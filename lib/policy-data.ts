export interface PolicyPart {
  id: string;
  headline: string;
  content: string;
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
  parts: PolicyPart[];
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

function sectionToHtml(sec: {
  id: string; number: string; eyebrow: string; title: string;
  content: (SecBlock | ListB | TableB | AlertB)[];
}): PolicyPart {
  const blocksHtml = sec.content.map((block) => {
    if (block.type === "section") return block.paragraphs.map((p) => `<p>${p}</p>`).join("");
    if (block.type === "list") return `<ul class="policy-list">${block.items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
    if (block.type === "table") {
      const headers = `<thead><tr>${block.headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>`;
      const rows = `<tbody>${block.rows.map((r) => `<tr><td><strong>${r[0]}</strong></td><td>${r[1]}</td></tr>`).join("")}</tbody>`;
      return `<table class="policy-table">${headers}${rows}</table>`;
    }
    if (block.type === "alert") {
      const emoji = { blue: "&#x2139;&#xFE0F;", green: "&#x2705;", amber: "&#x26A0;&#xFE0F;" }[block.variant];
      return `<div class="alert-card ${block.variant}"><div class="alert-icon">${emoji}</div><div class="alert-body"><strong>${block.label}</strong><p>${block.text}</p></div></div>`;
    }
    return "";
  }).join("\n");

  return { id: sec.id, headline: sec.title, content: blocksHtml };
}

// Legacy block types (internal, used only for the conversion below)
type SecBlock = { type: "section"; paragraphs: string[] };
type ListB = { type: "list"; items: string[] };
type TableB = { type: "table"; headers: string[]; rows: [string, string][] };
type AlertB = { type: "alert"; variant: "blue" | "green" | "amber"; label: string; text: string };

const SHARED_PARTS: PolicyPart[] = [
  {
    id: "sec-intro", headline: "تعريف الأطراف والمنصة",
    content: '<p>هذه الاتفاقية ("الشروط") مبرمة بين <strong>مؤسسة أيسر المتطورة لتقنية المعلومات</strong> ("أيسَر"، "نحن"، "الشركة")، ومقرها المملكة العربية السعودية، رقم السجل التجاري: 4030620045 — وبين الشخص الطبيعي أو الاعتباري الذي يستخدم المنصة ("المستخدم"، "أنت").</p>\n<p>تشمل "المنصة" موقع أيسَر الإلكتروني، تطبيق الجوال، لوحة تحكم المطوّر، نظام CRM، وجميع الخدمات والأدوات المرتبطة.</p>\n<div class="alert-card blue"><div class="alert-icon">&#x2139;&#xFE0F;</div><div class="alert-body"><strong>للعلم</strong><p>تُعدّ هذه الشروط ملزمة لجميع مستخدمي المنصة بمجرد التسجيل أو البدء في الاستخدام، بصرف النظر عن طريقة الوصول.</p></div></div>',
  },
  {
    id: "sec-accept", headline: "شروط القبول والتسجيل",
    content: '<p>للاشتراك في منصة أيسَر والاستفادة من خدماتها يجب استيفاء الشروط التالية:</p>\n<ul class="policy-list"><li>أن يكون المستخدم شركة أو مؤسسة أو شخصاً اعتبارياً مرخّصاً لمزاولة نشاط التطوير العقاري في المملكة العربية السعودية.</li><li>تقديم بيانات تسجيل صحيحة وكاملة وحديثة، والالتزام بتحديثها فور حدوث أي تغيير.</li><li>الحفاظ على سرية بيانات الدخول (اسم المستخدم وكلمة المرور) وعدم مشاركتها مع أطراف غير مخوّلة.</li><li>قبول هذه الشروط وسياسة الخصوصية بشكل صريح قبل بدء الاستخدام.</li><li>ألا يكون المستخدم قد سبق إيقاف حسابه أو حظره من المنصة لأي سبب.</li></ul>\n<p>تتحمل المنشأة المُسجَّلة المسؤولية الكاملة عن جميع الأنشطة التي تجري تحت حسابها، بما في ذلك تصرفات موظفيها ومستخدميها الفرعيين.</p>',
  },
  {
    id: "sec-use", headline: "الاستخدام المسموح به",
    content: '<p>تُتيح منصة أيسَر للمستخدمين استخدام خدماتها ضمن النطاق التالي حصراً:</p>\n<ul class="policy-list"><li>إدارة المشاريع العقارية وتتبع مراحل الإنشاء وتحديثها.</li><li>التواصل مع العملاء والمشترين وإدارة علاقاتهم عبر نظام CRM المدمج.</li><li>إنشاء صفحات هبوط احترافية واستقبال الحجوزات الإلكترونية.</li><li>إصدار الإشعارات والتقارير الإنشائية الدورية وتوزيعها على العملاء.</li><li>إدارة طلبات الصيانة ومتابعة تنفيذها بعد التسليم.</li><li>الاستفادة من التقارير والإحصاءات التحليلية لاتخاذ قرارات مدروسة.</li></ul>\n<div class="alert-card green"><div class="alert-icon">&#x2705;</div><div class="alert-body"><strong>استخدام مشروع</strong><p>يقتصر الاستخدام المصرّح به على الأنشطة التجارية العقارية المشروعة والمتوافقة مع أنظمة المملكة العربية السعودية.</p></div></div>',
  },
  {
    id: "sec-forbidden", headline: "الاستخدامات المحظورة",
    content: '<p>يُحظر على المستخدمين القيام بالأنشطة التالية أو السماح بها تحت أي ظرف:</p>\n<ul class="policy-list"><li>نسخ المنصة أو أجزاء منها أو إعادة إنتاجها أو توزيعها دون إذن كتابي مسبق.</li><li>محاولة الوصول غير المصرّح به إلى أنظمة أيسَر أو بيانات مستخدمين آخرين.</li><li>استخدام المنصة لأغراض احتيالية أو مضللة أو مخالفة للأنظمة السعودية.</li><li>نشر أو إدخال برمجيات خبيثة أو محتوى ضار بأي شكل من الأشكال.</li><li>الاستخراج الآلي للبيانات (Scraping) أو استخدام واجهات برمجية غير رسمية دون إذن.</li><li>إعادة بيع الخدمة أو منح حق الوصول إليها لأطراف خارج المنشأة المشتركة.</li><li>التحايل على أي قيود تقنية أو إجراءات أمان مطبّقة على المنصة.</li></ul>\n<div class="alert-card amber"><div class="alert-icon">&#x26A0;&#xFE0F;</div><div class="alert-body"><strong>تحذير</strong><p>يُفضي انتهاك أي من هذه المحظورات إلى إيقاف الحساب فوراً دون إشعار مسبق، وقد تتخذ أيسَر الإجراءات القانونية اللازمة.</p></div></div>',
  },
  {
    id: "sec-data", headline: "البيانات والخصوصية",
    content: '<p>تُعدّ جميع البيانات التي تُدخلها في المنصة ملكاً للمستخدم، وتلتزم أيسَر بحمايتها والحفاظ على سريتها وفقاً لسياسة الخصوصية المعتمدة ونظام حماية البيانات الشخصية في المملكة العربية السعودية (PDPL).</p>\n<ul class="policy-list"><li>تُخزَّن البيانات على خوادم آمنة داخل المملكة العربية السعودية.</li><li>لا تُباع بيانات المستخدمين أو تُشارَك مع أطراف ثالثة لأغراض تجارية.</li><li>يحق للمستخدم طلب نسخة من بياناته أو حذفها وفق ما تتيحه سياسة الخصوصية.</li><li>تُطبَّق تقنيات تشفير متقدمة لحماية البيانات أثناء النقل والتخزين.</li></ul>\n<p>لمزيد من التفاصيل، يُرجى الاطلاع على <a href="https://www.aysar.sa/privacy-policy" style="color:var(--color-indigo);font-weight:600;text-decoration:none">سياسة الخصوصية</a> الخاصة بأيسَر.</p>',
  },
  {
    id: "sec-payment", headline: "الاشتراكات والدفع",
    content: '<p>تعمل منصة أيسَر وفق نموذج اشتراك مدفوع، وتسري الشروط التالية على جميع المدفوعات:</p>\n<table class="policy-table"><thead><tr><th>البند</th><th>التفاصيل</th></tr></thead><tbody><tr><td><strong>دورة الفوترة</strong></td><td>شهرية أو سنوية حسب الخطة المختارة</td></tr><tr><td><strong>طرق الدفع</strong></td><td>بطاقات الائتمان والمدى، والتحويل البنكي للشركات</td></tr><tr><td><strong>التجديد التلقائي</strong></td><td>يُجدَّد الاشتراك تلقائياً ما لم يُلغَ قبل 48 ساعة من تاريخ التجديد</td></tr><tr><td><strong>سياسة الاسترداد</strong></td><td>لا يُسترد رسوم الاشتراك بعد تفعيله، إلا في حالات استثنائية تُقدّرها أيسَر</td></tr><tr><td><strong>الضريبة</strong></td><td>تخضع جميع الأسعار لضريبة القيمة المضافة 15% وفق نظام الزكاة والضريبة</td></tr></tbody></table>\n<p>في حال التأخر في السداد، تحتفظ أيسَر بحق تعليق الحساب مع إشعار مسبق، واستئناف الخدمة بعد تسوية المستحقات.</p>',
  },
  {
    id: "sec-ip", headline: "الملكية الفكرية",
    content: '<p>جميع عناصر منصة أيسَر من تصميم وكود وواجهات وشعارات وخوارزميات ومحتوى مرئي — هي ملك حصري لمؤسسة أيسر المتطورة لتقنية المعلومات ومحمية بموجب قوانين الملكية الفكرية في المملكة العربية السعودية.</p>\n<ul class="policy-list"><li>لا يمنح الاشتراك في المنصة أي حقوق ملكية فكرية على أي من عناصرها.</li><li>يُمنح المستخدم ترخيص استخدام محدود وغير حصري وغير قابل للتحويل.</li><li>يحتفظ المستخدم بحقوق الملكية الكاملة على بياناته ومحتواه المُدخَل في المنصة.</li><li>يُحظر إزالة أي إشارات حقوق النشر أو العلامات التجارية من أي جزء من المنصة.</li></ul>',
  },
  {
    id: "sec-liability", headline: "حدود المسؤولية",
    content: '<p>تسعى أيسَر جاهدةً لتوفير خدمة موثوقة ومستمرة، غير أنها لا تتحمل المسؤولية عن:</p>\n<ul class="policy-list"><li>الأضرار غير المباشرة أو العرضية الناجمة عن استخدام المنصة أو عدم إمكانية الوصول إليها.</li><li>فقدان البيانات الناجم عن أخطاء المستخدم أو هجمات إلكترونية خارجة عن سيطرة أيسَر.</li><li>الانقطاعات المؤقتة في الخدمة الناجمة عن أعمال الصيانة المجدولة أو الطوارئ.</li><li>دقة البيانات المُدخَلة من قِبل المستخدم أو نتائج القرارات المبنية عليها.</li></ul>\n<p>في جميع الأحوال، لا تتجاوز المسؤولية القصوى لأيسَر قيمة رسوم الاشتراك المدفوعة خلال الثلاثة أشهر السابقة للحادثة.</p>',
  },
  {
    id: "sec-termination", headline: "إيقاف الخدمة والإنهاء",
    content: '<p>يحق لأي من الطرفين إنهاء الاتفاقية وفق الآتي:</p>\n<ul class="policy-list"><li><strong>إنهاء المستخدم:</strong> يمكن إلغاء الاشتراك في أي وقت من لوحة الإعدادات، وتبقى الخدمة نشطة حتى نهاية الفترة المدفوعة.</li><li><strong>إنهاء أيسَر بسبب مشروع:</strong> في حال انتهاك الشروط يُوقَف الحساب فوراً مع إشعار بالبريد الإلكتروني.</li><li><strong>إنهاء أيسَر بدون سبب:</strong> تُخطر المستخدم قبل 30 يوماً وتُتيح له تصدير بياناته كاملاً.</li><li><strong>بعد الإنهاء:</strong> تُحتفظ البيانات 90 يوماً يمكن خلالها تصديرها، ثم تُحذف نهائياً.</li></ul>',
  },
  {
    id: "sec-law", headline: "القانون الحاكم وتسوية النزاعات",
    content: '<p>تخضع هذه الاتفاقية وتُفسَّر وفقاً لأنظمة ولوائح المملكة العربية السعودية. وفي حال نشوء أي نزاع، يُتّبع المسار التالي:</p>\n<ul class="policy-list"><li><strong>التفاوض الودّي:</strong> يُمنح الطرفان 30 يوماً لتسوية النزاع وديّاً.</li><li><strong>الوساطة:</strong> عند تعذّر الحل الودّي يُلجأ إلى الوساطة عبر جهة معتمدة.</li><li><strong>التحكيم:</strong> في حال عدم الوصول إلى حل، يُحال النزاع إلى هيئة التحكيم التجاري السعودية.</li><li><strong>الاختصاص القضائي:</strong> تختص محاكم مدينة جدة بالفصل في أي نزاعات لم تُحسم بالطرق السابقة.</li></ul>',
  },
  {
    id: "sec-changes", headline: "تعديل الشروط",
    content: '<p>تحتفظ أيسَر بحق تعديل هذه الشروط في أي وقت، وستُخطر المستخدمين المُسجَّلين بالتغييرات الجوهرية عبر:</p>\n<ul class="policy-list"><li>إشعار داخل المنصة قبل 14 يوماً على الأقل من سريان التعديلات.</li><li>رسالة بريد إلكتروني إلى العنوان المسجّل في الحساب.</li></ul>\n<p>يُعدّ استمرار المستخدم في استخدام المنصة بعد سريان التعديلات قبولاً صريحاً للشروط المحدّثة. إن لم تكن موافقاً، يحق لك إنهاء اشتراكك قبل تاريخ السريان.</p>',
  },
  {
    id: "sec-contact", headline: "التواصل معنا",
    content: '<p>لأي استفسار أو ملاحظة تتعلق بهذه الشروط، يمكن التواصل معنا عبر القنوات التالية:</p>\n<ul class="policy-list"><li>&#x1F4E7; البريد الإلكتروني: <a href="mailto:legal@aysar.sa" style="color:var(--color-indigo);font-weight:600;text-decoration:none">legal@aysar.sa</a></li><li>&#x1F4DE; الهاتف: <a href="tel:+966125101107" style="color:var(--color-indigo);font-weight:600;text-decoration:none">966125101107+</a></li><li>&#x1F4AC; واتساب: <a href="https://wa.me/966125101107" target="_blank" style="color:var(--color-indigo);font-weight:600;text-decoration:none">تواصل عبر واتساب</a></li><li>&#x1F310; مركز المساعدة: <a href="https://support.aysar.sa/" target="_blank" style="color:var(--color-indigo);font-weight:600;text-decoration:none">support.aysar.sa</a></li><li>&#x1F4CD; العنوان: جدة، المملكة العربية السعودية</li></ul>\n<div class="alert-card green"><div class="alert-icon">&#x2705;</div><div class="alert-body"><strong>شكراً لثقتك في أيسَر</strong><p>نحن ملتزمون بتقديم خدمة شفافة وموثوقة، وهذه الشروط تعكس التزامنا المشترك ببناء علاقة تجارية ناجحة ومستدامة.</p></div></div>',
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
  parts: SHARED_PARTS,
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
  parts: SHARED_PARTS,
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
  parts: SHARED_PARTS,
  sidebarCard: SIDEBAR_CARD,
  footerText: `${CR}\nآخر تحديث لهذه الشروط: مايو 2025 · الإصدار ${VERSION}`,
  footerActions: FOOTER_ACTIONS,
};
