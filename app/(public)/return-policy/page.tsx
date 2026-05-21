import PolicyTemplate from "@/app/components/PolicyTemplate";
import { RETURN_POLICY } from "@/lib/policy-data";

export const metadata = {
  title: "سياسة الاسترجاع — أيسَر",
  description: "يرجى قراءة سياسة الاسترجاع بعناية قبل استخدام منصة أيسَر أو الاشتراك فيها. باستخدامك للمنصة فإنك توافق على الالتزام بجميع ما ورد فيها.",
};

export default function ReturnPolicyPage() {
  return <PolicyTemplate data={RETURN_POLICY} />;
}
