import { prisma } from "@/app/lib/db";
import { PRIVACY_POLICY, TERMS_OF_USE, RETURN_POLICY } from "@/lib/policy-data";
import type { PolicyData } from "@/lib/policy-data";

const FALLBACKS: Record<string, PolicyData> = {
  privacy: PRIVACY_POLICY,
  terms: TERMS_OF_USE,
  returns: RETURN_POLICY,
};

export async function getPolicyData(type: "privacy" | "terms" | "returns"): Promise<PolicyData> {
  let page = await prisma.policies.findUnique({ where: { id: "POLICIES" } });

  if (!page) {
    return { ...FALLBACKS[type] };
  }

  const data = (page[type] || FALLBACKS[type]) as unknown as PolicyData;
  return data as PolicyData;
}
