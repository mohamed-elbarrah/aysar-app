export interface PolicySection {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  content: (SectionBlock | ListBlock | TableBlock | AlertBlock)[];
}

export interface SectionBlock {
  type: "section";
  paragraphs: string[];
}

export interface ListBlock {
  type: "list";
  items: string[];
}

export interface TableBlock {
  type: "table";
  headers: string[];
  rows: [string, string][];
}

export interface AlertBlock {
  type: "alert";
  variant: "blue" | "green" | "amber";
  label: string;
  text: string;
}

export interface TOCItem {
  id: string;
  number: string;
  label: string;
  subtitle?: string;
}

export interface TOCGroup {
  title: string;
  items: TOCItem[];
}

export interface TOCGroup {
  title: string;
  items: TOCItem[];
}

export interface PolicyData {
  route: string;
  badge: string;
  breadcrumb: string;
  title: string;
  description: string;
  version?: string;
  effectiveDate?: string;
  entity?: string;
  tocItems: TOCItem[];
  tocGroups: TOCGroup[];
  sections: PolicySection[];
  sidebarCard?: {
    title: string;
    desc: string;
    linkLabel: string;
    href: string;
  };
  footerText: string;
  footerActions: {
    label: string;
    href: string;
    variant: "primary" | "ghost";
  }[];
}

function paragraphs(...texts: string[]): SectionBlock {
  return { type: "section", paragraphs: texts };
}

function list(...items: string[]): ListBlock {
  return { type: "list", items };
}

function table(headers: string[], rows: [string, string][]): TableBlock {
  return { type: "table", headers, rows };
}

function alert(variant: AlertBlock["variant"], label: string, text: string): AlertBlock {
  return { type: "alert", variant, label, text };
}

const SHARED_SECTIONS: PolicySection[] = [
  {
    id: "sec-intro", number: "01", eyebrow: "01 — التعريفات",
    title: "تعريف الأطراف والمنصة",
    content: [
      paragraphs(
        'هذه الاتفاقية ("الشروط") مبرمة بين <strong>مؤسسة أيسر المتطورة لتقنية المعلومات</strong> ("أيسَر"، "نحن"، "الشركة")، ومقرها المملكة العربية السعودية، رقم السجل التجاري: 4030620045 — وبين الشخص الطبيعي أو الاعتباري الذي يستخدم المنصة ("المستخدم"، "أنت").',
        'تشمل "المنصة" موقع أيسَر الإلكتروني، تطبيق الجوال، لوحة تحكم المطوّر، نظام CRM، وجميع الخدمات والأدوات المرتبطة.',
      ),
      alert("blue", "للعلم", "تُعدّ هذه الشروط ملزمة لجميع مستخدمي المنصة بمجرد التسجيل أو البدء في الاستخدام، بصرف النظر عن طريقة الوصول."),
    ],
  },
  {
    id: "sec-accept", number: "02", eyebrow: "02 — التسجيل",
    title: "شروط القبول والتسجيل",
    content: [
      paragraphs("للاشتراك في منصة أيسَر والاستفادة من خدماتها يجب استيفاء الشروط التالية:"),
      list(
        "أن يكون المستخدم شركة أو مؤسسة أو شخصاً اعتبارياً مرخّصاً لمزاولة نشاط التطوير العقاري في المملكة العربية السعودية.",
        "تقديم بيانات تسجيل صحيحة وكاملة وحديثة، والالتزام بتحديثها فور حدوث أي تغيير.",
        "الحفاظ على سرية بيانات الدخول (اسم المستخدم وكلمة المرور) وعدم مشاركتها مع أطراف غير مخوّلة.",
        "قبول هذه الشروط وسياسة الخصوصية بشكل صريح قبل بدء الاستخدام.",
        "ألا يكون المستخدم قد سبق إيقاف حسابه أو حظره من المنصة لأي سبب."
      ),
      paragraphs("تتحمل المنشأة المُسجَّلة المسؤولية الكاملة عن جميع الأنشطة التي تجري تحت حسابها، بما في ذلك تصرفات موظفيها ومستخدميها الفرعيين."),
    ],
  },
  {
    id: "sec-use", number: "03", eyebrow: "03 — الاستخدام",
    title: "الاستخدام المسموح به",
    content: [
      paragraphs("تُتيح منصة أيسَر للمستخدمين استخدام خدماتها ضمن النطاق التالي حصراً:"),
      list(
        "إدارة المشاريع العقارية وتتبع مراحل الإنشاء وتحديثها.",
        "التواصل مع العملاء والمشترين وإدارة علاقاتهم عبر نظام CRM المدمج.",
        "إنشاء صفحات هبوط احترافية واستقبال الحجوزات الإلكترونية.",
        "إصدار الإشعارات والتقارير الإنشائية الدورية وتوزيعها على العملاء.",
        "إدارة طلبات الصيانة ومتابعة تنفيذها بعد التسليم.",
        "الاستفادة من التقارير والإحصاءات التحليلية لاتخاذ قرارات مدروسة."
      ),
      alert("green", "استخدام مشروع", "يقتصر الاستخدام المصرّح به على الأنشطة التجارية العقارية المشروعة والمتوافقة مع أنظمة المملكة العربية السعودية."),
    ],
  },
  {
    id: "sec-forbidden", number: "04", eyebrow: "04 — المحظورات",
    title: "الاستخدامات المحظورة",
    content: [
      paragraphs("يُحظر على المستخدمين القيام بالأنشطة التالية أو السماح بها تحت أي ظرف:"),
      list(
        "نسخ المنصة أو أجزاء منها أو إعادة إنتاجها أو توزيعها دون إذن كتابي مسبق.",
        "محاولة الوصول غير المصرّح به إلى أنظمة أيسَر أو بيانات مستخدمين آخرين.",
        "استخدام المنصة لأغراض احتيالية أو مضللة أو مخالفة للأنظمة السعودية.",
        "نشر أو إدخال برمجيات خبيثة أو محتوى ضار بأي شكل من الأشكال.",
        "الاستخراج الآلي للبيانات (Scraping) أو استخدام واجهات برمجية غير رسمية دون إذن.",
        "إعادة بيع الخدمة أو منح حق الوصول إليها لأطراف خارج المنشأة المشتركة.",
        "التحايل على أي قيود تقنية أو إجراءات أمان مطبّقة على المنصة."
      ),
      alert("amber", "تحذير", "يُفضي انتهاك أي من هذه المحظورات إلى إيقاف الحساب فوراً دون إشعار مسبق، وقد تتخذ أيسَر الإجراءات القانونية اللازمة."),
    ],
  },
  {
    id: "sec-data", number: "05", eyebrow: "05 — البيانات",
    title: "البيانات والخصوصية",
    content: [
      paragraphs("تُعدّ جميع البيانات التي تُدخلها في المنصة ملكاً للمستخدم، وتلتزم أيسَر بحمايتها والحفاظ على سريتها وفقاً لسياسة الخصوصية المعتمدة ونظام حماية البيانات الشخصية في المملكة العربية السعودية (PDPL)."),
      list(
        "تُخزَّن البيانات على خوادم آمنة داخل المملكة العربية السعودية.",
        "لا تُباع بيانات المستخدمين أو تُشارَك مع أطراف ثالثة لأغراض تجارية.",
        "يحق للمستخدم طلب نسخة من بياناته أو حذفها وفق ما تتيحه سياسة الخصوصية.",
        "تُطبَّق تقنيات تشفير متقدمة لحماية البيانات أثناء النقل والتخزين."
      ),
      paragraphs('لمزيد من التفاصيل، يُرجى الاطلاع على <a href="https://www.aysar.sa/privacy-policy" style="color:var(--color-indigo);font-weight:600;text-decoration:none">سياسة الخصوصية</a> الخاصة بأيسَر.'),
    ],
  },
  {
    id: "sec-payment", number: "06", eyebrow: "06 — الاشتراكات",
    title: "الاشتراكات والدفع",
    content: [
      paragraphs("تعمل منصة أيسَر وفق نموذج اشتراك مدفوع، وتسري الشروط التالية على جميع المدفوعات:"),
      table(["البند", "التفاصيل"], [
        ["دورة الفوترة", "شهرية أو سنوية حسب الخطة المختارة"],
        ["طرق الدفع", "بطاقات الائتمان والمدى، والتحويل البنكي للشركات"],
        ["التجديد التلقائي", "يُجدَّد الاشتراك تلقائياً ما لم يُلغَ قبل 48 ساعة من تاريخ التجديد"],
        ["سياسة الاسترداد", "لا يُسترد رسوم الاشتراك بعد تفعيله، إلا في حالات استثنائية تُقدّرها أيسَر"],
        ["الضريبة", "تخضع جميع الأسعار لضريبة القيمة المضافة 15% وفق نظام الزكاة والضريبة"],
      ]),
      paragraphs("في حال التأخر في السداد، تحتفظ أيسَر بحق تعليق الحساب مع إشعار مسبق، واستئناف الخدمة بعد تسوية المستحقات."),
    ],
  },
  {
    id: "sec-ip", number: "07", eyebrow: "07 — الملكية الفكرية",
    title: "الملكية الفكرية",
    content: [
      paragraphs("جميع عناصر منصة أيسَر من تصميم وكود وواجهات وشعارات وخوارزميات ومحتوى مرئي — هي ملك حصري لمؤسسة أيسر المتطورة لتقنية المعلومات ومحمية بموجب قوانين الملكية الفكرية في المملكة العربية السعودية."),
      list(
        "لا يمنح الاشتراك في المنصة أي حقوق ملكية فكرية على أي من عناصرها.",
        "يُمنح المستخدم ترخيص استخدام محدود وغير حصري وغير قابل للتحويل.",
        "يحتفظ المستخدم بحقوق الملكية الكاملة على بياناته ومحتواه المُدخَل في المنصة.",
        "يُحظر إزالة أي إشارات حقوق النشر أو العلامات التجارية من أي جزء من المنصة."
      ),
    ],
  },
  {
    id: "sec-liability", number: "08", eyebrow: "08 — المسؤولية",
    title: "حدود المسؤولية",
    content: [
      paragraphs("تسعى أيسَر جاهدةً لتوفير خدمة موثوقة ومستمرة، غير أنها لا تتحمل المسؤولية عن:"),
      list(
        "الأضرار غير المباشرة أو العرضية الناجمة عن استخدام المنصة أو عدم إمكانية الوصول إليها.",
        "فقدان البيانات الناجم عن أخطاء المستخدم أو هجمات إلكترونية خارجة عن سيطرة أيسَر.",
        "الانقطاعات المؤقتة في الخدمة الناجمة عن أعمال الصيانة المجدولة أو الطوارئ.",
        "دقة البيانات المُدخَلة من قِبل المستخدم أو نتائج القرارات المبنية عليها."
      ),
      paragraphs("في جميع الأحوال، لا تتجاوز المسؤولية القصوى لأيسَر قيمة رسوم الاشتراك المدفوعة خلال الثلاثة أشهر السابقة للحادثة."),
    ],
  },
  {
    id: "sec-termination", number: "09", eyebrow: "09 — الإنهاء",
    title: "إيقاف الخدمة والإنهاء",
    content: [
      paragraphs("يحق لأي من الطرفين إنهاء الاتفاقية وفق الآتي:"),
      list(
        "<strong>إنهاء المستخدم:</strong> يمكن إلغاء الاشتراك في أي وقت من لوحة الإعدادات، وتبقى الخدمة نشطة حتى نهاية الفترة المدفوعة.",
        "<strong>إنهاء أيسَر بسبب مشروع:</strong> في حال انتهاك الشروط يُوقَف الحساب فوراً مع إشعار بالبريد الإلكتروني.",
        "<strong>إنهاء أيسَر بدون سبب:</strong> تُخطر المستخدم قبل 30 يوماً وتُتيح له تصدير بياناته كاملاً.",
        "<strong>بعد الإنهاء:</strong> تُحتفظ البيانات 90 يوماً يمكن خلالها تصديرها، ثم تُحذف نهائياً."
      ),
    ],
  },
  {
    id: "sec-law", number: "10", eyebrow: "10 — النزاعات",
    title: "القانون الحاكم وتسوية النزاعات",
    content: [
      paragraphs("تخضع هذه الاتفاقية وتُفسَّر وفقاً لأنظمة ولوائح المملكة العربية السعودية. وفي حال نشوء أي نزاع، يُتّبع المسار التالي:"),
      list(
        "<strong>التفاوض الودّي:</strong> يُمنح الطرفان 30 يوماً لتسوية النزاع وديّاً.",
        "<strong>الوساطة:</strong> عند تعذّر الحل الودّي يُلجأ إلى الوساطة عبر جهة معتمدة.",
        "<strong>التحكيم:</strong> في حال عدم الوصول إلى حل، يُحال النزاع إلى هيئة التحكيم التجاري السعودية.",
        "<strong>الاختصاص القضائي:</strong> تختص محاكم مدينة جدة بالفصل في أي نزاعات لم تُحسم بالطرق السابقة."
      ),
    ],
  },
  {
    id: "sec-changes", number: "11", eyebrow: "11 — التعديلات",
    title: "تعديل الشروط",
    content: [
      paragraphs("تحتفظ أيسَر بحق تعديل هذه الشروط في أي وقت، وستُخطر المستخدمين المُسجَّلين بالتغييرات الجوهرية عبر:"),
      list(
        "إشعار داخل المنصة قبل 14 يوماً على الأقل من سريان التعديلات.",
        "رسالة بريد إلكتروني إلى العنوان المسجّل في الحساب."
      ),
      paragraphs("يُعدّ استمرار المستخدم في استخدام المنصة بعد سريان التعديلات قبولاً صريحاً للشروط المحدّثة. إن لم تكن موافقاً، يحق لك إنهاء اشتراكك قبل تاريخ السريان."),
    ],
  },
  {
    id: "sec-contact", number: "12", eyebrow: "12 — التواصل",
    title: "التواصل معنا",
    content: [
      paragraphs("لأي استفسار أو ملاحظة تتعلق بهذه الشروط، يمكن التواصل معنا عبر القنوات التالية:"),
      list(
        '📧 البريد الإلكتروني: <a href="mailto:legal@aysar.sa" style="color:var(--color-indigo);font-weight:600;text-decoration:none">legal@aysar.sa</a>',
        '📞 الهاتف: <a href="tel:+966125101107" style="color:var(--color-indigo);font-weight:600;text-decoration:none">966125101107+</a>',
        '💬 واتساب: <a href="https://wa.me/966125101107" target="_blank" style="color:var(--color-indigo);font-weight:600;text-decoration:none">تواصل عبر واتساب</a>',
        '🌐 مركز المساعدة: <a href="https://support.aysar.sa/" target="_blank" style="color:var(--color-indigo);font-weight:600;text-decoration:none">support.aysar.sa</a>',
        "📍 العنوان: جدة، المملكة العربية السعودية"
      ),
      alert("green", "شكراً لثقتك في أيسَر", "نحن ملتزمون بتقديم خدمة شفافة وموثوقة، وهذه الشروط تعكس التزامنا المشترك ببناء علاقة تجارية ناجحة ومستدامة."),
    ],
  },
];

const SHARED_TOC: TOCItem[] = [
  { id: "sec-intro", number: "01", label: "تعريف الأطراف والمنصة", subtitle: "الأطراف المعنية ونطاق المنصة" },
  { id: "sec-accept", number: "02", label: "شروط القبول والتسجيل", subtitle: "متطلبات التسجيل والموافقة" },
  { id: "sec-use", number: "03", label: "الاستخدام المسموح به", subtitle: "النطاق المسموح لاستخدام المنصة" },
  { id: "sec-forbidden", number: "04", label: "الاستخدامات المحظورة", subtitle: "الممارسات الممنوعة والعقوبات" },
  { id: "sec-data", number: "05", label: "البيانات والخصوصية", subtitle: "حماية البيانات وسريتها" },
  { id: "sec-payment", number: "06", label: "الاشتراكات والدفع", subtitle: "خطط الدفع والفواتير" },
  { id: "sec-ip", number: "07", label: "الملكية الفكرية", subtitle: "حقوق الملكية والتراخيص" },
  { id: "sec-liability", number: "08", label: "حدود المسؤولية", subtitle: "نطاق المسؤولية القانونية" },
  { id: "sec-termination", number: "09", label: "إيقاف الخدمة والإنهاء", subtitle: "إنهاء الاشتراك والبيانات" },
  { id: "sec-law", number: "10", label: "القانون الحاكم وتسوية النزاعات", subtitle: "القوانين المنظمة وآليات الحل" },
  { id: "sec-changes", number: "11", label: "تعديل الشروط", subtitle: "آلية التحديث والإشعار" },
  { id: "sec-contact", number: "12", label: "التواصل معنا", subtitle: "قنوات الدعم والتواصل" },
];

const SHARED_GROUPS: TOCGroup[] = [
  {
    title: "أساسيات الاستخدام",
    items: SHARED_TOC.slice(0, 4),
  },
  {
    title: "الحقوق والبيانات",
    items: SHARED_TOC.slice(4, 8),
  },
  {
    title: "الخدمة والدعم",
    items: SHARED_TOC.slice(8, 12),
  },
];

const SIDEBAR_CARD = {
  title: "لديك استفسار قانوني؟",
  desc: "فريقنا جاهز للإجابة على أي أسئلة تتعلق بشروط استخدام المنصة.",
  linkLabel: "تواصل معنا",
  href: "mailto:legal@aysar.sa",
} as const;

const VERSION = "2.1";
const EFFECTIVE_DATE = "1 مايو 2025";
const ENTITY = "مؤسسة أيسر المتطورة لتقنية المعلومات";

const FOOTER_ACTIONS = [
  { label: "سياسة الخصوصية", href: "/privacy-policy", variant: "ghost" as const },
  { label: "📧 اتصل بالفريق القانوني", href: "mailto:legal@aysar.sa", variant: "primary" as const },
];

const CR = "© 2026 مؤسسة أيسر المتطورة لتقنية المعلومات · رقم السجل التجاري: 4030620045";

export const TERMS_OF_USE: PolicyData = {
  route: "/terms-of-use",
  badge: "آخر تحديث: مايو 2025",
  breadcrumb: "شروط الاستخدام",
  title: "شروط الاستخدام",
  description: "يرجى قراءة هذه الشروط بعناية قبل استخدام منصة أيسَر أو الاشتراك فيها. باستخدامك للمنصة فإنك توافق على الالتزام بجميع ما ورد فيها.",
  version: VERSION,
  effectiveDate: EFFECTIVE_DATE,
  entity: ENTITY,
  tocItems: SHARED_TOC,
  tocGroups: SHARED_GROUPS,
  sections: SHARED_SECTIONS,
  sidebarCard: SIDEBAR_CARD,
  footerText: `${CR}\nآخر تحديث لهذه الشروط: مايو 2025 · الإصدار ${VERSION}`,
  footerActions: FOOTER_ACTIONS,
};

export const PRIVACY_POLICY: PolicyData = {
  route: "/privacy-policy",
  badge: "آخر تحديث: مايو 2025",
  breadcrumb: "سياسة الخصوصية",
  title: "سياسة الخصوصية",
  description: "يرجى قراءة سياسة الخصوصية بعناية قبل استخدام منصة أيسَر أو الاشتراك فيها. باستخدامك للمنصة فإنك توافق على الالتزام بجميع ما ورد فيها.",
  version: VERSION,
  effectiveDate: EFFECTIVE_DATE,
  entity: ENTITY,
  tocItems: SHARED_TOC,
  tocGroups: SHARED_GROUPS,
  sections: SHARED_SECTIONS,
  sidebarCard: SIDEBAR_CARD,
  footerText: `${CR}\nآخر تحديث لهذه الشروط: مايو 2025 · الإصدار ${VERSION}`,
  footerActions: FOOTER_ACTIONS,
};

export const RETURN_POLICY: PolicyData = {
  route: "/return-policy",
  badge: "آخر تحديث: مايو 2025",
  breadcrumb: "سياسة الاسترجاع",
  title: "سياسة الاسترجاع",
  description: "يرجى قراءة سياسة الاسترجاع بعناية قبل استخدام منصة أيسَر أو الاشتراك فيها. باستخدامك للمنصة فإنك توافق على الالتزام بجميع ما ورد فيها.",
  version: VERSION,
  effectiveDate: EFFECTIVE_DATE,
  entity: ENTITY,
  tocItems: SHARED_TOC,
  tocGroups: SHARED_GROUPS,
  sections: SHARED_SECTIONS,
  sidebarCard: SIDEBAR_CARD,
  footerText: `${CR}\nآخر تحديث لهذه الشروط: مايو 2025 · الإصدار ${VERSION}`,
  footerActions: FOOTER_ACTIONS,
};
