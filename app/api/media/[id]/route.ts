import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/db";
import { apiError, apiResponse, requireAdmin } from "@/app/lib/api-utils";

export const dynamic = "force-dynamic";
const BUCKET = "site-media";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const { data: asset, error: findError } = await supabase
    .from("media_assets")
    .select("storage_path")
    .eq("id", id)
    .eq("status", "active")
    .single();

  if (findError || !asset) return apiError("الملف غير موجود", 404);

  const { error: storageError } = await supabase.storage.from(BUCKET).remove([asset.storage_path]);
  if (storageError) return apiError("تعذر حذف الملف من التخزين", 500);

  const { error: deleteError } = await supabase
    .from("media_assets")
    .update({ status: "deleted" })
    .eq("id", id);

  if (deleteError) return apiError("تعذر تحديث بيانات الملف", 500);
  return apiResponse({ id });
}
