import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/app/lib/api-utils";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export const dynamic = "force-dynamic";

const BUCKET_NAME = "app-section-images";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

function getServiceSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL and/or SUPABASE_SERVICE_KEY");
  }

  return createClient(url, key);
}

/**
 * Ensures the Supabase Storage bucket exists.
 * If it doesn't exist, creates it as a public bucket.
 */
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
      // If bucket already exists (race condition), ignore
      if (!error.message?.includes("already exists")) {
        throw new Error(`Failed to create bucket: ${error.message}`);
      }
    }
  }
}

/**
 * POST /api/upload-app-image
 * Uploads a phone screenshot to Supabase Storage.
 * Auto-creates the bucket if missing.
 * Falls back to local filesystem if Supabase is unavailable.
 * Requires admin authentication.
 */
export async function POST(request: NextRequest) {
  const authResult = requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const position = formData.get("position") as "left" | "right" | null;
    const previousUrl = (formData.get("previousUrl") as string | null) || null;

    if (!file || !position) {
      return NextResponse.json(
        { success: false, error: "Missing file or position" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only JPG, PNG, WEBP allowed" },
        { status: 400 }
      );
    }

    // Validate size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "File too large (max 2MB)" },
        { status: 400 }
      );
    }

    // Try Supabase Storage first
    try {
      const supabase = getServiceSupabase();

      // Auto-create bucket if it doesn't exist
      await ensureBucketExists(supabase);

      // 1. Clean up previous image if one exists
      if (previousUrl) {
        const previousPath = extractStoragePath(previousUrl);
        if (previousPath) {
          const { error: deleteError } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([previousPath]);

          if (deleteError) {
            console.warn(
              "[upload-app-image] Failed to delete previous image:",
              deleteError.message
            );
            // Non-fatal: continue with upload even if cleanup fails
          }
        }
      }

      // 2. Build a deterministic path so the same position always has one file
      const ext =
        file.type === "image/png"
          ? "png"
          : file.type === "image/webp"
            ? "webp"
            : "jpg";

      const storagePath = `phone-${position}.${ext}`;

      // 3. Upload (upsert = true overwrites existing file at this path)
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, file, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        console.error("[upload-app-image] Supabase upload error:", uploadError);
        throw new Error(`Supabase upload failed: ${uploadError.message}`);
      }

      // 4. Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);

      // Append cache-busting query param
      const imageUrl = `${publicUrl}?v=${Date.now()}`;

      return NextResponse.json({
        success: true,
        imageUrl,
      });
    } catch (supabaseError) {
      console.warn(
        "[upload-app-image] Supabase failed, falling back to local filesystem:",
        supabaseError
      );

      // FALLBACK: Local filesystem (for development or if Supabase is down)
      return await handleLocalUpload(file, position, previousUrl);
    }
  } catch (error) {
    console.error("[upload-app-image] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}

/**
 * Fallback handler: saves file to local filesystem.
 * Used when Supabase Storage is unavailable.
 */
async function handleLocalUpload(
  file: File,
  position: "left" | "right",
  previousUrl: string | null
): Promise<NextResponse> {
  try {
    const uploadDir = join(process.cwd(), "public", "uploads", "app-section");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Delete previous local file if it exists
    if (previousUrl && previousUrl.startsWith("/uploads/app-section/")) {
      const previousFilename = previousUrl.split("/").pop()?.split("?")[0];
      if (previousFilename) {
        const previousPath = join(uploadDir, previousFilename);
        if (existsSync(previousPath)) {
          try {
            const { unlink } = await import("fs/promises");
            await unlink(previousPath);
          } catch {
            // Ignore deletion errors
          }
        }
      }
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `phone-${position}-${Date.now()}.${ext}`;
    const filepath = join(uploadDir, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    const imageUrl = `/uploads/app-section/${filename}`;

    return NextResponse.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    console.error("[upload-app-image] Local fallback failed:", error);
    throw error;
  }
}

/**
 * Extracts the storage path from a Supabase public URL.
 */
function extractStoragePath(url: string): string | null {
  try {
    const pathMatch = url.match(/\/object\/public\/[^/]+\/(.+?)(?:\?|$)/);
    return pathMatch?.[1] ?? null;
  } catch {
    return null;
  }
}
