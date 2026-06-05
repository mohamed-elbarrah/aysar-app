import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/app/lib/api-utils";
import { existsSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

const BUCKET_NAME = "app-section-images";

function getServiceSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL and/or SUPABASE_SERVICE_KEY");
  }

  return createClient(url, key);
}

/**
 * POST /api/delete-app-image
 * Deletes a phone screenshot from Supabase Storage or local filesystem.
 * Requires admin authentication.
 */
export async function POST(request: NextRequest) {
  const authResult = requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = (await request.json()) as { imageUrl?: string };
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "imageUrl is required" },
        { status: 400 }
      );
    }

    // If it's a local file, delete from disk
    if (imageUrl.startsWith("/uploads/app-section/")) {
      const filename = imageUrl.split("/").pop()?.split("?")[0];
      if (filename) {
        const filepath = join(
          process.cwd(),
          "public",
          "uploads",
          "app-section",
          filename
        );
        if (existsSync(filepath)) {
          try {
            const { unlink } = await import("fs/promises");
            await unlink(filepath);
          } catch {
            // Ignore deletion errors
          }
        }
      }
      return NextResponse.json({ success: true });
    }

    // Otherwise, delete from Supabase Storage
    const storagePath = extractStoragePath(imageUrl);
    if (!storagePath) {
      return NextResponse.json(
        { success: false, error: "Invalid imageUrl format" },
        { status: 400 }
      );
    }

    try {
      const supabase = getServiceSupabase();
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([storagePath]);

      if (error) {
        console.warn("[delete-app-image] Supabase delete error:", error);
        // Non-fatal: return success even if file was already gone
      }
    } catch (supabaseError) {
      console.warn(
        "[delete-app-image] Supabase unavailable, skipping storage cleanup:",
        supabaseError
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[delete-app-image] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Delete failed" },
      { status: 500 }
    );
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
