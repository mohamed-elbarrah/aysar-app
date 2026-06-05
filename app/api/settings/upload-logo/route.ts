import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/app/lib/api-utils";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import sharp from "sharp";

export const dynamic = "force-dynamic";

const BUCKET_NAME = "site-assets";
const ALLOWED_TYPES = ["image/svg+xml", "image/png", "image/jpeg", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024;
const LOGO_MAX_WIDTH = 400;

function getServiceSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL and/or SUPABASE_SERVICE_KEY");
  }

  return createClient(url, key);
}

async function ensureBucketExists(supabase: ReturnType<typeof getServiceSupabase>): Promise<void> {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET_NAME);

  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: String(MAX_SIZE),
      allowedMimeTypes: ALLOWED_TYPES,
    });

    if (error) {
      if (!error.message?.includes("already exists")) {
        throw new Error(`Failed to create bucket: ${error.message}`);
      }
    }
  }
}

function extractStoragePath(url: string): string | null {
  try {
    const pathMatch = url.match(/\/object\/public\/[^/]+\/(.+?)(?:\?|$)/);
    return pathMatch?.[1] ?? null;
  } catch {
    return null;
  }
}

async function resizeLogo(buffer: Buffer, mimeType: string): Promise<{ buffer: Buffer; ext: string }> {
  if (mimeType === "image/svg+xml") {
    return { buffer, ext: "svg" };
  }

  const ext = mimeType === "image/webp" ? "webp" : "png";
  const outputFormat = mimeType === "image/webp" ? "webp" : "png";

  const metadata = await sharp(buffer).metadata();
  const width = metadata.width || LOGO_MAX_WIDTH;

  if (width <= LOGO_MAX_WIDTH) {
    const resized = await sharp(buffer)
      [outputFormat]({ quality: 90 })
      .toBuffer();
    return { buffer: resized, ext };
  }

  const resized = await sharp(buffer)
    .resize(LOGO_MAX_WIDTH, null, { fit: "inside", withoutEnlargement: true })
    [outputFormat]({ quality: 90 })
    .toBuffer();

  return { buffer: resized, ext };
}

export async function POST(request: NextRequest) {
  const authResult = requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const previousUrl = (formData.get("previousUrl") as string | null) || null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "الملف مطلوب" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "نوع الملف غير مدعوم. الأنواع المدعومة: SVG, PNG, JPG, WEBP" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "حجم الملف كبير جدًا (الحد الأقصى 2MB)" },
        { status: 400 }
      );
    }

    const originalBuffer = Buffer.from(await file.arrayBuffer());
    const { buffer: processedBuffer, ext } = await resizeLogo(originalBuffer, file.type);
    const timestamp = Date.now();
    const storagePath = `logo-${timestamp}.${ext}`;
    const contentType = ext === "svg" ? "image/svg+xml" : ext === "webp" ? "image/webp" : "image/png";

    try {
      const supabase = getServiceSupabase();
      await ensureBucketExists(supabase);

      if (previousUrl) {
        const previousPath = extractStoragePath(previousUrl);
        if (previousPath) {
          const { error: deleteError } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([previousPath]);

          if (deleteError) {
            console.warn("[upload-logo] Failed to delete previous logo:", deleteError.message);
          }
        }
      }

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, processedBuffer, {
          contentType,
          upsert: true,
        });

      if (uploadError) {
        console.error("[upload-logo] Supabase upload error:", uploadError);
        throw new Error(`Supabase upload failed: ${uploadError.message}`);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);

      const logoUrl = `${publicUrl}?v=${timestamp}`;

      return NextResponse.json({
        success: true,
        logoUrl,
      });
    } catch (supabaseError) {
      console.warn(
        "[upload-logo] Supabase failed, falling back to local filesystem:",
        supabaseError
      );

      return await handleLocalUpload(processedBuffer, ext, previousUrl, timestamp);
    }
  } catch (error) {
    console.error("[upload-logo] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "فشل رفع الملف" },
      { status: 500 }
    );
  }
}

async function handleLocalUpload(
  buffer: Buffer,
  ext: string,
  previousUrl: string | null,
  timestamp: number
): Promise<NextResponse> {
  try {
    const uploadDir = join(process.cwd(), "public", "uploads", "logo");

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    if (previousUrl && previousUrl.startsWith("/uploads/logo/")) {
      const previousFilename = previousUrl.split("/").pop()?.split("?")[0];
      if (previousFilename) {
        const previousPath = join(uploadDir, previousFilename);
        if (existsSync(previousPath)) {
          try {
            await unlink(previousPath);
          } catch {
            // Ignore deletion errors
          }
        }
      }
    }

    const filename = `logo-${timestamp}.${ext}`;
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const logoUrl = `/uploads/logo/${filename}?v=${timestamp}`;

    return NextResponse.json({
      success: true,
      logoUrl,
    });
  } catch (error) {
    console.error("[upload-logo] Local fallback failed:", error);
    throw error;
  }
}