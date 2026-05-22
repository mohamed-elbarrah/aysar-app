import ContactPageContent from "./ContactPageContent";
import { getContactPageData } from "@/app/lib/contact-page-data";

export const metadata = {
  title: "اتصل بنا — أيسَر",
  description:
    "تواصل مع فريق أيسَر — سواء كنت مطوراً عقارياً أو عميلاً يبحث عن دعم، نحن هنا لخدمتك والإجابة عن جميع استفساراتك.",
};

export default async function ContactPage() {
  const data = await getContactPageData();
  return <ContactPageContent data={data} />;
}
