import PolicyTemplate from "@/app/components/PolicyTemplate";
import { PRIVACY_POLICY } from "@/lib/policy-data";

export const metadata = {
  title: "سياسة الخصوصية — أيسَر",
  description: "يرجى قراءة سياسة الخصوصية بعناية قبل استخدام منصة أيسَر أو الاشتراك فيها. باستخدامك للمنصة فإنك توافق على الالتزام بجميع ما ورد فيها.",
};

export default function PrivacyPolicyPage() {
  return <PolicyTemplate data={PRIVACY_POLICY} />;
}
