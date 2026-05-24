import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/db";
import { policiesUpdateSchema } from "@/app/lib/shared-types";
import { deepMerge, requireAdmin } from "@/app/lib/api-utils";
import { PRIVACY_POLICY, TERMS_OF_USE, RETURN_POLICY } from "@/lib/policy-data";
import type { PolicyData } from "@/lib/policy-data";

const TYPE_MAP: Record<string, keyof typeof FALLBACKS> = {
  privacy: "privacy",
  terms: "terms",
  returns: "returns",
};

const FALLBACKS = {
  privacy: PRIVACY_POLICY,
  terms: TERMS_OF_USE,
  returns: RETURN_POLICY,
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const dbKey = TYPE_MAP[type];

  if (!dbKey) {
    return NextResponse.json({ success: false, error: "نوع السياسة غير موجود" }, { status: 404 });
  }

  const { data: page } = await supabase
    .from("policies")
    .select("*")
    .eq("id", "POLICIES")
    .single();

  if (!page) {
    return NextResponse.json({ success: true, data: FALLBACKS[dbKey] });
  }

  const data = page[dbKey] as unknown as PolicyData;
  return NextResponse.json({ success: true, data: data || FALLBACKS[dbKey] });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const adminResult = requireAdmin(request);
  if (adminResult instanceof NextResponse) return adminResult;

  const { type } = await params;
  const dbKey = TYPE_MAP[type];

  if (!dbKey) {
    return NextResponse.json({ success: false, error: "نوع السياسة غير موجود" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = policiesUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "بيانات غير صالحة" }, { status: 422 });
  }

  const { data: existing } = await supabase
    .from("policies")
    .select("*")
    .eq("id", "POLICIES")
    .single();

  const currentPolicy = ((existing?.[dbKey] as unknown as PolicyData) || FALLBACKS[dbKey]) as unknown as Record<string, unknown>;

  const merged = deepMerge(currentPolicy, parsed.data as unknown as Record<string, unknown>);

  const createData: Record<string, unknown> = {
    id: "POLICIES",
    privacy: dbKey === "privacy" ? merged : FALLBACKS.privacy,
    terms: dbKey === "terms" ? merged : FALLBACKS.terms,
    returns: dbKey === "returns" ? merged : FALLBACKS.returns,
  };

  const { error } = await supabase
    .from("policies")
    .upsert(createData, { onConflict: "id" });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  if (dbKey !== Object.keys(TYPE_MAP)[0] || existing) {
    const { error: updateError } = await supabase
      .from("policies")
      .update({ [dbKey]: merged })
      .eq("id", "POLICIES");

    if (updateError) {
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, data: merged });
}