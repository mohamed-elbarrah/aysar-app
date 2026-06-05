import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/db";
import { requireAdmin } from "@/app/lib/api-utils";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminResult = requireAdmin(request);
  if (adminResult instanceof NextResponse) return adminResult;

  const { id } = await params;

  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: true })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminResult = requireAdmin(request);
  if (adminResult instanceof NextResponse) return adminResult;

  const { id } = await params;

  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
