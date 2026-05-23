import PlansPageContent from "./PlansPageContent";
import { getPlansPageData } from "@/app/lib/plans-page-data";
import { getSiteSettings } from "@/app/lib/settings-data";

export const metadata = {
  title: "الباقات والأسعار — أيسَر",
  description:
    "باقات مرنة تساعدك على إدارة مشاريعك العقارية بكفاءة عالية — ابدأ مجاناً وطوّر متى تريد.",
};

export default async function PlansPage() {
  const [data, settings] = await Promise.all([
    getPlansPageData(),
    getSiteSettings(),
  ]);
  return (
    <PlansPageContent
      data={data}
      platformLinks={settings.platformLinks}
      contactInfo={settings.contactInfo}
    />
  );
}