import HeroSection from "./sections/HeroSection";
import CTASection from "./sections/CTASection";
import { DashboardMockup } from "./components/DashboardMockup";

export default function Home() {
  return (
    <>
      <HeroSection
        badge="منصة سحابية للتطوير العقاري"
        title="إدارة مشاريعك العقارية"
        titleAccent="بسهولة وشفافية كاملة"
        subtitle="أيسَر تمنحك لوحة تحكم احترافية لإدارة مشاريعك وعملاءك — من تتبع مراحل الإنشاء وإشعارات فورية، حتى صفحات هبوط واستقبال حجوزات ونظام CRM متكامل."
        primaryCta={{ label: "اطلب تجربة مجانية", href: "#" }}
        secondaryCta={{ label: "اكتشف المميزات", href: "#features" }}
      >
        <DashboardMockup />
      </HeroSection>

      <CTASection
        variant="dark"
        title="جاهز تبدأ مع أيسَر؟"
        subtitle="انضم لمطورين عقاريين يستخدمون أيسَر لتوفير الوقت ورفع مستوى تجربة عملاءهم."
        primaryCta={{
          label: "ابدأ مجاناً الآن",
          href: "https://platform.aysar.sa/ar/company/dashboard/register",
        }}
        secondaryCta={{
          label: "تواصل على واتساب",
          href: "http://wa.me/966125101107",
        }}
        note="لا بطاقة ائتمان · فريقنا يتواصل معك خلال 24 ساعة"
      />
    </>
  );
}
