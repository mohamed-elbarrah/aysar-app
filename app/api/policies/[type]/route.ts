import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
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

  const page = await prisma.policies.findUnique({ where: { id: "POLICIES" } });

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

  const existing = await prisma.policies.findUnique({ where: { id: "POLICIES" } });
  const currentPolicy = ((existing?.[dbKey] as unknown as PolicyData) || FALLBACKS[dbKey]) as unknown as Record<string, unknown>;

  const merged = deepMerge(currentPolicy, parsed.data as unknown as Record<string, unknown>);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createData: any = {
    id: "POLICIES",
    privacy: dbKey === "privacy" ? merged : FALLBACKS.privacy,
    terms: dbKey === "terms" ? merged : FALLBACKS.terms,
    returns: dbKey === "returns" ? merged : FALLBACKS.returns,
  };

  await prisma.policies.upsert({
    where: { id: "POLICIES" },
    create: createData,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update: { [dbKey]: merged } as any,
  });

  return NextResponse.json({ success: true, data: merged });
}