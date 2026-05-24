import PolicyTemplate from "@/app/components/PolicyTemplate";
import { getPolicyData } from "@/app/lib/policies-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "شروط الاستخدام — أيسَر",
  description: "يرجى قراءة هذه الشروط بعناية قبل استخدام منصة أيسَر أو الاشتراك فيها. باستخدامك للمنصة فإنك توافق على الالتزام بجميع ما ورد فيها.",
};

export default async function TermsOfUsePage() {
  const data = await getPolicyData("terms");
  return <PolicyTemplate data={data} />;
}
