import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/app/lib/api-utils";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import sharp from "sharp";

const BUCKET_NAME = "site-assets";
const ALLOWED_TYPES = ["image/svg+xml", "image/png", "image/jpeg", "image/webp", "image/x-icon"];
const MAX_SIZE = 2 * 1024 * 1024;
const FAVICON_SIZE = 64;

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

async function resizeFavicon(buffer: Buffer, mimeType: string): Promise<{ buffer: Buffer; ext: string }> {
  if (mimeType === "image/svg+xml" || mimeType === "image/x-icon") {
    const ext = mimeType === "image/svg+xml" ? "svg" : "ico";
    return { buffer, ext };
  }

  const ext = mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "png";
  const outputFormat = mimeType === "image/webp" ? "webp" : "png";

  const resized = await sharp(buffer)
    .resize(FAVICON_SIZE, FAVICON_SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    [outputFormat]({ quality: 90 })
    .toBuffer();

  return { buffer: resized, ext };
}

export async function POST(req: NextRequest) {
  const authResult = requireAdmin(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const previousUrl = (formData.get("previousUrl") as string | null) || null;

    if (!file) {
      return NextResponse.json({ success: false, error: "الملف مطلوب" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "نوع الملف غير مدعوم. الأنواع المدعومة: SVG, PNG, JPG, WEBP, ICO" },
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
    const { buffer: processedBuffer, ext } = await resizeFavicon(originalBuffer, file.type);
    const timestamp = Date.now();
    const storagePath = `favicon-${timestamp}.${ext}`;
    const contentType = ext === "svg" ? "image/svg+xml" : ext === "ico" ? "image/x-icon" : ext === "webp" ? "image/webp" : "image/png";

    try {
      const supabase = getServiceSupabase();
      await ensureBucketExists(supabase);

      // Delete all previous favicons from storage
      if (previousUrl) {
        const previousPath = extractStoragePath(previousUrl);
        if (previousPath) {
          const { error: deleteError } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([previousPath]);

          if (deleteError) {
            console.warn("[upload-favicon] Failed to delete previous favicon:", deleteError.message);
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
        console.error("[upload-favicon] Supabase upload error:", uploadError);
        throw new Error(`Supabase upload failed: ${uploadError.message}`);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);

      const faviconUrl = `${publicUrl}?v=${timestamp}`;

      return NextResponse.json({ success: true, faviconUrl });
    } catch (supabaseError) {
      console.warn(
        "[upload-favicon] Supabase failed, falling back to local filesystem:",
        supabaseError
      );

      return await handleLocalUpload(processedBuffer, ext, previousUrl, timestamp);
    }
  } catch (error) {
    console.error("[upload-favicon] Unexpected error:", error);
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
    const uploadDir = join(process.cwd(), "public", "uploads", "favicon");

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Delete previous local file if it exists
    if (previousUrl && previousUrl.startsWith("/uploads/favicon/")) {
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

    const filename = `favicon-${timestamp}.${ext}`;
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const faviconUrl = `/uploads/favicon/${filename}?v=${timestamp}`;

    return NextResponse.json({ success: true, faviconUrl });
  } catch (error) {
    console.error("[upload-favicon] Local fallback failed:", error);
    throw error;
  }
}