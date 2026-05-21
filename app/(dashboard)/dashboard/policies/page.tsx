"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { RichTextEditor } from "@/app/components/dashboard/RichTextEditor";
import { PRIVACY_POLICY, TERMS_OF_USE, RETURN_POLICY } from "@/app/lib/dashboard/placeholders";
import { ScrollText, ChevronUp } from "lucide-react";

const sections = [
  { id: "privacy", label: "سياسة الخصوصية" },
  { id: "terms", label: "شروط الاستخدام" },
  { id: "return", label: "سياسة الإرجاع" },
];

export default function PoliciesEditor() {
  const [activeSection, setActiveSection] = useState("privacy");
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!pageRef.current) return;
      const els = sections.map((s) => document.getElementById(s.id));
      const scrollY = pageRef.current.scrollTop + 100;
      for (let i = els.length - 1; i >= 0; i--) {
        const el = els[i];
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    const el = pageRef.current;
    el?.addEventListener("scroll", handleScroll);
    return () => el?.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el && pageRef.current) {
      pageRef.current.scrollTo({ top: el.offsetTop - 16, behavior: "smooth" });
    }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      <div ref={pageRef} className="flex-1 overflow-y-auto pr-2 -mr-2">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#0c2954] mb-1">الصفحات القانونية</h1>
          <p className="text-sm text-[#6b7a94]">تعديل محتوى سياسة الخصوصية وشروط الاستخدام وسياسة الإرجاع</p>
        </div>
        <div className="space-y-6 pb-24">
          <PolicyEditor id="privacy" title="سياسة الخصوصية" defaultData={PRIVACY_POLICY} />
          <PolicyEditor id="terms" title="شروط الاستخدام" defaultData={TERMS_OF_USE} />
          <PolicyEditor id="return" title="سياسة الإرجاع" defaultData={RETURN_POLICY} />
        </div>
      </div>
      <div className="hidden xl:block w-[200px] shrink-0">
        <div className="sticky top-0">
          <div className="bg-white rounded-xl border border-[#e8edf5] p-4">
            <p className="text-xs font-bold text-[#0c2954] mb-3 flex items-center gap-1.5"><ScrollText className="w-3.5 h-3.5" /> الأقسام</p>
            <nav className="space-y-1">
              {sections.map((s) => (
                <button key={s.id} onClick={() => scrollTo(s.id)}
                  className={`w-full text-right text-xs py-1.5 px-2 rounded-md transition-colors ${activeSection === s.id ? "bg-[#0c2954]/5 text-[#0c2954] font-medium" : "text-[#6b7a94] hover:text-[#0c2954] hover:bg-[#f5f6f9]"}`}
                >{s.label}</button>
              ))}
            </nav>
            <button onClick={() => pageRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
              className="mt-3 w-full flex items-center justify-center gap-1 text-[10px] text-[#6b7a94] hover:text-[#0c2954] py-1.5 rounded-md hover:bg-[#f5f6f9] transition-colors"
            ><ChevronUp className="w-3 h-3" /> العودة للأعلى</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PolicyEditor({ id, title, defaultData }: { id: string; title: string; defaultData: typeof PRIVACY_POLICY }) {
  const [content, setContent] = useState(() => {
    let html = "";
    defaultData.sections.forEach((sec) => {
      html += `<h2>${sec.number} — ${sec.title}</h2><p></p>`;
      sec.content.forEach((block) => {
        if (block.type === "section") {
          block.paragraphs.forEach((p) => { html += `<p>${p}</p>`; });
        } else if (block.type === "list") {
          html += "<ul>";
          block.items.forEach((item) => { html += `<li>${item}</li>`; });
          html += "</ul>";
        } else if (block.type === "alert") {
          html += `<blockquote><strong>${block.label}</strong>: ${block.text}</blockquote>`;
        }
      });
    });
    return html;
  });
  const [version, setVersion] = useState(defaultData.version || "2.1");
  const [effectiveDate, setEffectiveDate] = useState(defaultData.effectiveDate || "1 مايو 2025");
  const [saved, setSaved] = useState(false);

  return (
    <section id={id}>
      <ContentCard title={title} subtitle={`إصدار ${version} · تاريخ السريان: ${effectiveDate}`}>
        <div className="form-grid-2 mb-5">
          <Input label="الإصدار" value={version} onChange={(e) => { setVersion(e.target.value); setSaved(false); }} />
          <Input label="تاريخ السريان" value={effectiveDate} onChange={(e) => { setEffectiveDate(e.target.value); setSaved(false); }} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#3a4a60]">المحتوى</label>
          <RichTextEditor value={content} onChange={(v) => { setContent(v); setSaved(false); }} />
        </div>
        <div className="mt-5 flex items-center justify-between">
          {saved && <span className="text-xs text-[#1a9a5a]">✓ تم الحفظ بنجاح</span>}
          <div className="flex-1" />
          <DashboardButton onClick={() => setSaved(true)}>حفظ التغييرات</DashboardButton>
        </div>
      </ContentCard>
    </section>
  );
}
