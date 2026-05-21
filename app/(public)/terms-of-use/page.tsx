import PolicyTemplate from "@/app/components/PolicyTemplate";
import { TERMS_OF_USE } from "@/lib/policy-data";

export const metadata = {
  title: "شروط الاستخدام — أيسَر",
  description: "يرجى قراءة هذه الشروط بعناية قبل استخدام منصة أيسَر أو الاشتراك فيها. باستخدامك للمنصة فإنك توافق على الالتزام بجميع ما ورد فيها.",
};

export default function TermsOfUsePage() {
  return <PolicyTemplate data={TERMS_OF_USE} />;
}
