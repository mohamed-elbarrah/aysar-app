import ContactPageContent from "./ContactPageContent";
import { getContactPageData } from "@/app/lib/contact-page-data";
import { getSiteSettings } from "@/app/lib/settings-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "اتصل بنا — أيسَر",
  description:
    "تواصل مع فريق أيسَر — سواء كنت مطوراً عقارياً أو عميلاً يبحث عن دعم، نحن هنا لخدمتك والإجابة عن جميع استفساراتك.",
};

export default async function ContactPage() {
  const [data, settings] = await Promise.all([
    getContactPageData(),
    getSiteSettings(),
  ]);
  return <ContactPageContent data={data} contactInfo={settings.contactInfo} socialLinks={settings.socialLinks} workHours={settings.workHours} platformLinks={settings.platformLinks} />;
}
