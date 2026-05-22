import type { Response } from "express";
import { prisma } from "@/app/lib/db";
import { policiesUpdateSchema } from "@/app/lib/shared-types";
import type { AuthenticatedRequest, ApiResponse } from "@/app/lib/shared-types";
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

function deepMerge<T extends Record<string, unknown>>(existing: T, incoming: Partial<T>): T {
  const result = { ...existing };
  for (const key of Object.keys(incoming) as (keyof T)[]) {
    const incomingVal = incoming[key];
    const existingVal = result[key];
    if (
      incomingVal !== null &&
      incomingVal !== undefined &&
      typeof incomingVal === "object" &&
      !Array.isArray(incomingVal) &&
      typeof existingVal === "object" &&
      existingVal !== null &&
      !Array.isArray(existingVal)
    ) {
      result[key] = deepMerge(existingVal as Record<string, unknown>, incomingVal as Record<string, unknown>) as T[keyof T];
    } else if (incomingVal !== undefined) {
      result[key] = incomingVal as T[keyof T];
    }
  }
  return result;
}

export async function getPolicyHandler(
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> {
  const type = req.params.type as string;
  const dbKey = TYPE_MAP[type];

  if (!dbKey) {
    res.status(404).json({ success: false, error: "نوع السياسة غير موجود" });
    return;
  }

  let page = await prisma.policies.findUnique({ where: { id: "POLICIES" } });

  if (!page) {
    res.json({ success: true, data: FALLBACKS[dbKey] });
    return;
  }

  const data = page[dbKey] as unknown as PolicyData;
  res.json({ success: true, data: data || FALLBACKS[dbKey] });
}

export async function updatePolicyHandler(
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> {
  const type = req.params.type as string;
  const dbKey = TYPE_MAP[type];

  if (!dbKey) {
    res.status(404).json({ success: false, error: "نوع السياسة غير موجود" });
    return;
  }

  const parsed = policiesUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, error: "بيانات غير صالحة" });
    return;
  }

  const existing = await prisma.policies.findUnique({ where: { id: "POLICIES" } });
  const currentPolicy = ((existing?.[dbKey] as unknown as PolicyData) || FALLBACKS[dbKey]) as Record<string, unknown>;

  const merged = deepMerge(currentPolicy, parsed.data as Record<string, unknown>);

  await prisma.policies.upsert({
    where: { id: "POLICIES" },
    create: {
      id: "POLICIES",
      privacy: dbKey === "privacy" ? merged : FALLBACKS.privacy,
      terms: dbKey === "terms" ? merged : FALLBACKS.terms,
      returns: dbKey === "returns" ? merged : FALLBACKS.returns,
    },
    update: { [dbKey]: merged },
  });

  res.json({ success: true, data: merged });
}
