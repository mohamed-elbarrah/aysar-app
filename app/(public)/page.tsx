import HeroSection from "../sections/HeroSection";
import CTASection from "../sections/CTASection";
import { FeatureSection } from "../components/FeatureSection";
import { DashboardMockup } from "../components/DashboardMockup";
import { StagesMockup } from "../components/StagesMockup";
import { MaintenanceMockup } from "../components/MaintenanceMockup";
import { BookingsMockup } from "../components/BookingsMockup";
import { TemplatesMockup } from "../components/TemplatesMockup";
import { FeaturesGrid } from "../sections/FeaturesGrid";
import { ProjectOverview } from "../sections/ProjectOverview";
import { AppSection } from "../sections/AppSection";

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

      {/* Feature 1: Construction Stages - Indigo theme */}
      <div id="features">
        <FeatureSection
          eyebrow="01 — تتبع مراحل الإنشاء"
          title="تتبع مراحل الإنشاء"
          titleAccent="خطوة بخطوة"
          description="يتيح أيسَر متابعة دقيقة لكل مراحل تنفيذ العقار — من الحفر حتى التسليم. المنصة تأتي بقوالب جاهزة تصل إلى 50 مرحلة قابلة للتعديل بالكامل حسب مشروعك."
          features={[
            { iconColor: "#1a9a5a", text: "صور وفيديو — من الموقع ترفعها الفرق مباشرة" },
            { iconColor: "#1a9a5a", text: "إشعارات فورية — عند كل تحديث لكل مرحلة" },
            { iconColor: "#1a9a5a", text: "قوالب مرنة — تصل إلى 50 مرحلة وتعدّلها كما تشاء" },
          ]}
          mockup={<StagesMockup />}
          layout="text-left"
          bgColor="bg-white"
          accentColor="#2d2e83"
          badgeBgColor="#f0f4ff"
        />
      </div>

      {/* Feature 2: Maintenance Requests - Red theme */}
      <FeatureSection
        eyebrow="02 — إدارة طلبات الصيانة"
        title="بلاغات الصيانة"
        titleAccent="بضغطة واحدة"
        description="بعد التسليم، يمكن للعميل تقديم بلاغات الصيانة بشكل مباشر عبر التطبيق. يتم توجيهها فورًا إلى حسابك وتستطيع متابعة حالة الطلب حتى الإغلاق."
        features={[
          { iconColor: "#ef4444", text: "إشعار فوري — عند رفع أي بلاغ جديد" },
          { iconColor: "#ef4444", text: "تتبع الحالة — من مفتوح حتى الإغلاق" },
          { iconColor: "#ef4444", text: "تعيين موظف — مسؤول لكل بلاغ" },
          { iconColor: "#ef4444", text: "سجل كامل — لكل طلبات الصيانة" },
        ]}
        mockup={<MaintenanceMockup />}
        layout="text-right"
        bgColor="bg-[#f7f8fa]"
        accentColor="#ef4444"
        badgeBgColor="#feeeee"
      />

      {/* Feature 3: Bookings - Orange theme */}
      <FeatureSection
        eyebrow="03 — استقبال الحجوزات"
        title="استقبل الحجوزات"
        titleAccent="من كل مكان"
        description="صفحات هبوط مخصصة لكل مشروع مع نموذج حجز مدمج — الحجوزات تصل تلقائياً للوحة التحكم. وإذا جاء عميل مباشرة أضفه يدوياً في ثوانٍ، ثم أدر الكل من CRM واحد."
        features={[
          { iconColor: "#f97316", text: "صفحة هبوط — مخصصة لكل مشروع برابط خاص" },
          { iconColor: "#f97316", text: "نموذج حجز — مدمج يصل تلقائياً للوحة التحكم" },
          { iconColor: "#f97316", text: "إضافة يدوية — للعملاء المباشرين بثوانٍ" },
          { iconColor: "#f97316", text: "CRM متكامل — لإدارة pipeline المبيعات" },
        ]}
        mockup={<BookingsMockup />}
        layout="text-left"
        bgColor="bg-white"
        accentColor="#f97316"
        badgeBgColor="#fff7ed"
      />

      {/* Feature 4: Templates - Orange theme */}
      <FeatureSection
        eyebrow="04 — القوالب الجاهزة"
        title="قوالب جاهزة"
        titleAccent="تصل إلى 50 مرحلة"
        description="لا تبدأ من الصفر — أيسَر يوفر قوالب مراحل جاهزة لكل أنواع المشاريع. استورد القالب، عدّل المراحل حسب مشروعك، وابدأ فوراً."
        features={[
          { iconColor: "#f97316", text: "قوالب جاهزة — لكل أنواع المشاريع العقارية" },
          { iconColor: "#f97316", text: "50 مرحلة — قابلة للتعديل الكامل حسب مشروعك" },
          { iconColor: "#f97316", text: "ترتيب بالسحب والإفلات — لإعادة ترتيب المراحل" },
          { iconColor: "#f97316", text: "صور وفيديو — لكل مرحلة ترفعها الفرق مباشرة" },
        ]}
        mockup={<TemplatesMockup />}
        layout="text-right"
        bgColor="bg-[#f7f8fa]"
        accentColor="#f97316"
        badgeBgColor="#fff7ed"
      />

      {/* Features Grid (Bento) */}
      <FeaturesGrid />

      {/* Project Overview (Split Dashboard) */}
      <ProjectOverview />

      {/* App Download */}
      <AppSection />

      <CTASection
        variant="dark"
        title="جاهز تبدأ مع أيسَر؟"
        subtitle="انضم لمطورين عقاريين يستخدمون أيسَر لتوفير الوقت ورفع مستوى تجربة عملائهم."
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
