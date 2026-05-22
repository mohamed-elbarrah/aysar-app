import PlansPageContent from "./PlansPageContent";
import { getPlansPageData } from "@/app/lib/plans-page-data";

export const metadata = {
  title: "الباقات والأسعار — أيسَر",
  description:
    "باقات مرنة تساعدك على إدارة مشاريعك العقارية بكفاءة عالية — ابدأ مجاناً وطوّر متى تريد.",
};

export default async function PlansPage() {
  const data = await getPlansPageData();
  return <PlansPageContent data={data} />;
}
