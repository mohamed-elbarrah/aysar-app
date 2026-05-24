import { supabase } from "@/app/lib/db";
import { PRIVACY_POLICY, TERMS_OF_USE, RETURN_POLICY } from "@/lib/policy-data";
import type { PolicyData } from "@/lib/policy-data";

const FALLBACKS: Record<string, PolicyData> = {
  privacy: PRIVACY_POLICY,
  terms: TERMS_OF_USE,
  returns: RETURN_POLICY,
};

export async function getPolicyData(type: "privacy" | "terms" | "returns"): Promise<PolicyData> {
  const { data: page } = await supabase
    .from("policies")
    .select("*")
    .eq("id", "POLICIES")
    .single();

  if (!page) {
    return { ...FALLBACKS[type] };
  }

  const data = (page[type] || FALLBACKS[type]) as unknown as PolicyData;
  return data as PolicyData;
}