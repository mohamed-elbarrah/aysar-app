import PolicyTemplate from "@/app/components/PolicyTemplate";
import { getPolicyData } from "@/app/lib/policies-data";

export const metadata = {
  title: "سياسة الخصوصية — أيسَر",
  description: "يرجى قراءة سياسة الخصوصية بعناية قبل استخدام منصة أيسَر أو الاشتراك فيها. باستخدامك للمنصة فإنك توافق على الالتزام بجميع ما ورد فيها.",
};

export default async function PrivacyPolicyPage() {
  const data = await getPolicyData("privacy");
  return <PolicyTemplate data={data} />;
}
