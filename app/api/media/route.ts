import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/db";
import { apiError, apiResponse, requireAdmin } from "@/app/lib/api-utils";

export const dynamic = "force-dynamic";

const BUCKET = "site-media";
// Keep this within the Supabase project limit. Increase it only after
// increasing the Storage file-size limit in Supabase billing/settings.
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "application/pdf",
]);

async function ensureBucket() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) throw new Error(error.message);
  const bucket = data?.find((item) => item.name === BUCKET);
  if (!bucket) {
    const { error: createError } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: String(MAX_FILE_SIZE),
      allowedMimeTypes: [...ALLOWED_TYPES],
    });
    if (createError && !createError.message.toLowerCase().includes("already exists")) {
      throw new Error(createError.message);
    }
    return;
  }

  // Existing buckets may have been created with a smaller default limit.
  // Keep the bucket configuration aligned with this endpoint.
  if (bucket.file_size_limit !== MAX_FILE_SIZE) {
    const { error: updateError } = await supabase.storage.updateBucket(BUCKET, {
      public: true,
      fileSizeLimit: String(MAX_FILE_SIZE),
      allowedMimeTypes: [...ALLOWED_TYPES],
    });
    if (updateError) throw new Error(updateError.message);
  }
}

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const search = request.nextUrl.searchParams.get("search")?.trim();
  const type = request.nextUrl.searchParams.get("type");
  const page = Math.max(Number(request.nextUrl.searchParams.get("page")) || 1, 1);
  const limit = Math.min(Math.max(Number(request.nextUrl.searchParams.get("limit")) || 24, 1), 100);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("media_assets")
    .select("*", { count: "exact" })
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) query = query.ilike("original_name", `%${search}%`);
  if (type && ["image", "video", "document"].includes(type)) {
    query = query.ilike("mime_type", `${type === "document" ? "application" : type}/%`);
  }

  const { data, error, count } = await query;
  if (error) return apiError(error.message, 500);
  return apiResponse({ items: data ?? [], page, limit, total: count ?? 0 });
}

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return apiError("الملف مطلوب");
    if (!ALLOWED_TYPES.has(file.type)) return apiError("نوع الملف غير مدعوم");
    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return apiError("حجم الملف يجب أن يكون أقل من 50 ميجابايت");
    }

    await ensureBucket();
    const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
    const storagePath = `${file.type.startsWith("video/") ? "videos" : file.type.startsWith("image/") ? "images" : "documents"}/${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(storagePath, file, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });
    if (uploadError) return apiError(`فشل رفع الملف: ${uploadError.message}`, 500);

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    const { data: asset, error: insertError } = await supabase
      .from("media_assets")
      .insert({
        original_name: file.name,
        storage_path: storagePath,
        public_url: urlData.publicUrl,
        mime_type: file.type,
        file_size: file.size,
        uploaded_by: auth.userId,
      })
      .select()
      .single();

    if (insertError) {
      await supabase.storage.from(BUCKET).remove([storagePath]);
      return apiError(`فشل حفظ بيانات الملف: ${insertError.message}`, 500);
    }

    return apiResponse(asset, 201);
  } catch (error) {
    console.error("[media] upload error", error);
    return apiError("فشل رفع الملف", 500);
  }
}
