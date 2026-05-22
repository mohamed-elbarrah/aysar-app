import PolicyTemplate from "@/app/components/PolicyTemplate";
import { getPolicyData } from "@/app/lib/policies-data";

export const metadata = {
  title: "سياسة الاسترجاع — أيسَر",
  description: "يرجى قراءة سياسة الاسترجاع بعناية قبل استخدام منصة أيسَر أو الاشتراك فيها. باستخدامك للمنصة فإنك توافق على الالتزام بجميع ما ورد فيها.",
};

export default async function ReturnPolicyPage() {
  const data = await getPolicyData("returns");
  return <PolicyTemplate data={data} />;
}
