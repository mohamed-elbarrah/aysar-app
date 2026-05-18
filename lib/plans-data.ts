export type BillingPeriod = "monthly" | "yearly";

export interface PlanFeature {
  text: string;
  enabled: boolean;
  soon?: boolean;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number | null;
  priceYearly: number | null;
  isFree: boolean;
  isFeatured: boolean;
  ctaLabel: string;
  ctaHref: string;
  features: PlanFeature[];
  featuresTitle: string;
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "المجانية",
    description: "لتجربة المنصة والبدء الأول",
    priceMonthly: null,
    priceYearly: null,
    isFree: true,
    isFeatured: false,
    ctaLabel: "ابدأ مجاناً",
    ctaHref: "https://platform.aysar.sa/ar/company/dashboard/register",
    featuresTitle: "ما تحصل عليه",
    features: [
      { text: "مشروع واحد فقط", enabled: true },
      { text: "حتى 10 ملاك", enabled: true },
      { text: "تتبع مراحل الإنشاء", enabled: true },
      { text: "تطبيق iOS و Android", enabled: true },
      { text: "طلبات الصيانة", enabled: false },
      { text: "صفحات الهبوط", enabled: false },
      { text: "استقبال الحجوزات", enabled: false },
      { text: "نظام CRM", enabled: false },
    ],
  },
  {
    id: "advanced",
    name: "المتقدمة",
    description: "الأمثل للشركات الناشئة",
    priceMonthly: 1379,
    priceYearly: 16100,
    isFree: false,
    isFeatured: false,
    ctaLabel: "اختر الباقة",
    ctaHref: "https://platform.aysar.sa/ar/company/dashboard/register",
    featuresTitle: "ما تحصل عليه",
    features: [
      { text: "نماذج مختلفة من المشاريع", enabled: true },
      { text: "حتى 10 مشاريع", enabled: true },
      { text: "حتى 100 مالك", enabled: true },
      { text: "حتى 2 مستثمرين", enabled: true },
      { text: "تتبع مراحل الإنشاء", enabled: true },
      { text: "تطبيق iOS و Android", enabled: true },
      { text: "تخصيص رسالة تسجيل بأسم الشركة", enabled: true },
      { text: "طلبات الصيانة والمحادثة", enabled: false },
      { text: "صفحات الهبوط", enabled: false },
      { text: "استقبال الحجوزات", enabled: false },
      { text: "ربط دومين مخصص", enabled: false },
    ],
  },
  {
    id: "featured",
    name: "المميزة",
    description: "الأمثل للشركات الكبيرة",
    priceMonthly: 2395,
    priceYearly: 28750,
    isFree: false,
    isFeatured: true,
    ctaLabel: "اختر الباقة",
    ctaHref: "https://platform.aysar.sa/ar/company/dashboard/register",
    featuresTitle: "كل شيء في المتقدمة، و+",
    features: [
      { text: "مشاريع غير محدودة", enabled: true },
      { text: "ملاك ومستثمرين غير محدود", enabled: true },
      { text: "موظف واحد", enabled: true },
      { text: "نظام طلبات صيانة + محادثة", enabled: true },
      { text: "قوالب جاهزة لمراحل الإنشاء", enabled: true },
      { text: "صفحات هبوط مع تحديثات الوحدات", enabled: true },
      { text: "استقبال الحجوزات + CRM", enabled: true },
      { text: "ربط دومين مخصص", enabled: true },
      { text: "مدير حساب شخصي", enabled: true },
      { text: "تقارير المشاريع قيد الإنشاء", enabled: true },
      { text: "تكاملات خارجية عبر API", enabled: true },
      { text: "إدارة المدفوعات والمستحقات", enabled: true, soon: true },
      { text: "التوقيع الإلكتروني المعتمد", enabled: true, soon: true },
    ],
  },
];

export interface CompareSection {
  section: string;
}

export interface CompareRowItem {
  label: string;
  free: string | null;
  advanced: string | null;
  featured: string | null;
}

export type CompareRowData = CompareSection | CompareRowItem;

export const COMPARE_ROWS: CompareRowData[] = [
  { section: "إدارة المشاريع" },
  { label: "نماذج المشاريع", free: "واحد فقط", advanced: "غير محدود", featured: "غير محدود" },
  { label: "عدد المشاريع", free: "1 مشروع", advanced: "10 مشاريع", featured: "غير محدود" },
  { label: "عدد الملاك", free: "10 ملاك", advanced: "100 مالك", featured: "غير محدود" },
  { label: "عدد المستثمرين", free: null, advanced: "2 مستثمرين", featured: "غير محدود" },
  { label: "عدد الموظفين", free: "موظف واحد", advanced: null, featured: "موظف واحد" },
  { section: "المميزات الأساسية" },
  { label: "تتبع مراحل الإنشاء", free: "✓", advanced: "✓", featured: "✓" },
  { label: "تطبيق iOS و Android", free: "✓", advanced: "✓", featured: "✓" },
  { label: "قوالب جاهزة للمراحل", free: "✓", advanced: null, featured: "✓" },
  { label: "نظام طلبات الصيانة", free: "✓", advanced: null, featured: "✓" },
  { section: "صفحات الهبوط والحجوزات" },
  { label: "صفحات هبوط للمشاريع", free: "✓", advanced: null, featured: "✓" },
  { label: "استقبال الحجوزات", free: "✓", advanced: null, featured: "✓" },
  { label: "نظام CRM", free: "✓", advanced: null, featured: "✓" },
  { section: "التخصيص والتكاملات" },
  { label: "تخصيص رسالة تسجيل الملاك", free: null, advanced: "✓", featured: "✓" },
  { label: "اسم نطاق مخصص", free: "✓", advanced: null, featured: "✓" },
  { label: "تكاملات خارجية (API)", free: "✓", advanced: null, featured: "✓" },
  { section: "قادم قريباً" },
  { label: "إدارة المدفوعات والمستحقات", free: "قريباً", advanced: null, featured: "قريباً" },
  { label: "التوقيع الإلكتروني المعتمد", free: "قريباً", advanced: null, featured: "قريباً" },
  { label: "نظام الفواتير والضرائب", free: "قريباً", advanced: null, featured: "قريباً" },
  { section: "الدعم الفني" },
  { label: "دعم عبر البريد الإلكتروني", free: "✓", advanced: "✓", featured: "✓" },
  { label: "دعم مباشر (هاتف + محادثة)", free: null, advanced: "✓", featured: "✓" },
  { label: "مدير حساب شخصي", free: "✓", advanced: null, featured: "✓" },
  { label: "تدريب مجاني للفريق", free: null, advanced: "جلسة واحدة", featured: "جلسات متعددة" },
];

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "هل يمكنني الترقية من الباقة المجانية في أي وقت؟",
    answer: "نعم، يمكنك الترقية في أي وقت من لوحة التحكم. ستُحتسب الرسوم بشكل تناسبي من تاريخ الترقية.",
  },
  {
    question: "ما الفرق بين الاشتراك الشهري والسنوي؟",
    answer: "الاشتراك السنوي يوفر لك 15% مقارنةً بالشهري. يُدفع مرة واحدة في السنة ويشمل جميع المميزات نفسها.",
  },
  {
    question: "هل الأسعار شاملة الضريبة؟",
    answer: "نعم، جميع الأسعار المعروضة شاملة ضريبة القيمة المضافة بنسبة 15%.",
  },
  {
    question: "هل يمكن استخدام المنصة لأنواع مختلفة من المشاريع العقارية؟",
    answer: "نعم، تدعم أيسَر أنواعاً متعددة من المشاريع: فيلات، شقق، مجمعات سكنية، مبانٍ تجارية، ومشاريع متعددة النماذج.",
  },
  {
    question: "هل يحتاج العملاء (الملاك) إلى دفع أي رسوم؟",
    answer: "لا. التطبيق مجاني تماماً للملاك والمستثمرين. أنت كمطور عقاري تدفع الاشتراك، وعملاؤك يستخدمون التطبيق مجاناً.",
  },
  {
    question: "كيف تتم عملية الإلغاء؟",
    answer: "يمكنك إلغاء اشتراكك في أي وقت من لوحة التحكم أو بالتواصل مع فريق الدعم. تبقى بياناتك محفوظة لمدة 30 يوماً بعد الإلغاء.",
  },
];
