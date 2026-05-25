"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { useDashboard } from "@/app/components/dashboard/DashboardContext";
import { Input, Textarea } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { Checkbox } from "@/components/ui/checkbox";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { CodeEditor } from "@/app/components/dashboard/CodeEditor";
import { CONTACT_HERO, CONTACT_PAGE_INFO } from "@/app/lib/dashboard/placeholders";
import { INQUIRY_OPTIONS } from "@/lib/contact-data";
import type { InquiryType } from "@/lib/contact-data";
import { ScrollText, ChevronUp, Loader2, Plus, Trash2, GripVertical } from "lucide-react";
import { ColorPicker } from "@/app/components/dashboard/ColorPicker";
import type { FormFieldConfig } from "@/app/lib/form-fields-data";
import { FORM_FIELDS_DEFAULTS, CONTACT_FORM_DEFAULTS } from "@/app/lib/form-fields-data";

const sections = [
  { id: "banner", label: "البانر" },
  { id: "form", label: "النموذج" },
];

export default function ContactPageEditor() {
  const { contactData, loading, setContactData } = useDashboard();
  const [activeSection, setActiveSection] = useState("banner");
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
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el && pageRef.current) {
      pageRef.current.scrollTo({ top: el.offsetTop - 16, behavior: "smooth" });
    }
  };

  if (loading.contact || !contactData) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#2d2e83] mx-auto mb-3" />
          <p className="text-sm text-[#6b7a94]">جارٍ تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      <div ref={pageRef} className="flex-1 overflow-y-auto pr-2 -mr-2">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#0c2954] mb-1">صفحة التواصل</h1>
          <p className="text-sm text-[#6b7a94]">تعديل نموذج التواصل، معلومات الاتصال، والقنوات</p>
        </div>
        <div className="space-y-6 pb-8">
          <BannerSection 
            data={(contactData.hero as typeof CONTACT_HERO) || CONTACT_HERO} 
            onChange={(data) => setContactData({ hero: data }, "hero")} 
          />
          <FormSection 
            data={{
              formFields: (contactData.formFields as FormFieldConfig[]) || FORM_FIELDS_DEFAULTS,
              thirdPartyFormScript: (contactData.thirdPartyFormScript as string) || CONTACT_FORM_DEFAULTS.thirdPartyFormScript,
              formReplaced: (contactData.formReplaced as boolean) ?? CONTACT_FORM_DEFAULTS.formReplaced,
              successMessage: (contactData.successMessage as string) || "تم إرسال رسالتك بنجاح! سنتواصل معك خلال 24 ساعة.",
            }}
            onFieldsChange={(data) => setContactData({ formFields: data }, "formFields")}
            onScriptChange={(script) => setContactData({ thirdPartyFormScript: script }, "thirdPartyFormScript")}
            onReplacedChange={(replaced) => setContactData({ formReplaced: replaced }, "formReplaced")}
            onSuccessChange={(msg) => setContactData({ successMessage: msg }, "successMessage")}
          />
          <ContactInfoSection 
            data={(contactData.contactInfo as typeof CONTACT_PAGE_INFO) || CONTACT_PAGE_INFO} 
            onChange={(data) => setContactData({ contactInfo: data }, "contactInfo")} 
          />
          <InquiryOptionsSection 
            data={(contactData.inquiryOptions as typeof INQUIRY_OPTIONS) || INQUIRY_OPTIONS} 
            onChange={(data) => setContactData({ inquiryOptions: data }, "inquiryOptions")} 
          />
        </div>
      </div>
      <div className="hidden xl:block w-[200px] shrink-0">
        <div className="sticky top-0">
          <div className="bg-white rounded-xl border border-[#e8edf5] p-4">
            <p className="text-xs font-bold text-[#0c2954] mb-3 flex items-center gap-1.5"><ScrollText className="w-3.5 h-3.5" /> الأقسام</p>
            <nav className="space-y-1">
              {sections.map((s) => (
                <button key={s.id} onClick={() => scrollTo(s.id)} className={`w-full text-right text-xs py-1.5 px-2 rounded-md transition-colors ${activeSection === s.id ? "bg-[#0c2954]/5 text-[#0c2954] font-medium" : "text-[#6b7a94] hover:text-[#0c2954] hover:bg-[#f5f6f9]"}`}>{s.label}</button>
              ))}
            </nav>
            <button onClick={() => pageRef.current?.scrollTo({ top: 0, behavior: "smooth" })} className="mt-3 w-full flex items-center justify-center gap-1 text-[10px] text-[#6b7a94] hover:text-[#0c2954] py-1.5 rounded-md hover:bg-[#f5f6f9] transition-colors"><ChevronUp className="w-3 h-3" /> العودة للأعلى</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BannerSection({ data: initial, onChange }: { data: typeof CONTACT_HERO; onChange: (d: typeof CONTACT_HERO) => void }) {
  const [data, setData] = useState(initial);
  
  useEffect(() => {
    setData(initial);
  }, [initial]);

  const handleChange = useCallback((patch: Partial<typeof CONTACT_HERO>) => {
    const newData = { ...data, ...patch };
    setData(newData);
    onChange(newData);
  }, [data, onChange]);

  return (
    <section id="banner">
      <ContentCard title="البانر" subtitle="عنوان صفحة التواصل">
        <div className="form-grid-2">
          <Input label="الشارة" value={data.badge} onChange={(e) => handleChange({ badge: e.target.value })} />
          <Input label="عنوان السطر الأول" value={data.titleLine1} onChange={(e) => handleChange({ titleLine1: e.target.value })} />
          <Input label="عنوان السطر الثاني" value={data.titleLine2} onChange={(e) => handleChange({ titleLine2: e.target.value })} />
          <ColorPicker label="لون السطر الثاني" color={data.line2Color} onChange={(color) => handleChange({ line2Color: color })} />
          <div className="form-group-contact">
            <label>شفافية اللون (%) — {Math.round((data.line2Opacity || 0.5) * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={data.line2Opacity || 0.5}
              onChange={(e) => handleChange({ line2Opacity: parseFloat(e.target.value) })}
              className="w-full h-2 bg-[#e8edf5] rounded-lg appearance-none cursor-pointer mt-2"
            />
          </div>
          <Textarea label="الوصف" value={data.subtitle} onChange={(e) => handleChange({ subtitle: e.target.value })} rows={3} />
        </div>
      </ContentCard>
    </section>
  );
}

function FormSection({ data, onFieldsChange, onScriptChange, onReplacedChange, onSuccessChange }: { data: { formFields: FormFieldConfig[]; thirdPartyFormScript: string; formReplaced: boolean; successMessage: string; }; onFieldsChange: (fields: FormFieldConfig[]) => void; onScriptChange: (script: string) => void; onReplacedChange: (replaced: boolean) => void; onSuccessChange: (msg: string) => void; }) {
  const [fields, setFields] = useState(data.formFields);
  const [script, setScript] = useState(data.thirdPartyFormScript);
  const [replaced, setReplaced] = useState(data.formReplaced);
  const [successMsg, setSuccessMsg] = useState(data.successMessage);

  useEffect(() => {
    setFields(data.formFields);
    setScript(data.thirdPartyFormScript);
    setReplaced(data.formReplaced);
    setSuccessMsg(data.successMessage);
  }, [data]);

  return (
    <section id="form">
      <ContentCard title="نموذج التواصل" subtitle="إعدادات نموذج التواصل والحقول">
        <div className="space-y-6">
          <div className="form-grid-2">
            <div className="col-span-2">
              <Checkbox checked={replaced} onCheckedChange={(v) => { setReplaced(!!v); onReplacedChange(!!v); }} />
              <span className="mr-2 text-sm">استبدال النموذج بكود HTML/JavaScript (نموذج خارجي)</span>
            </div>
            {replaced ? (
              <div className="col-span-2">
                <div className="form-group-contact">
                  <label>كود النموذج الخارجي (HTML/JavaScript)</label>
                  <CodeEditor value={script} onChange={(v) => { setScript(v); onScriptChange(v); }} />
                </div>
              </div>
            ) : (
              <>
                <Input label="رسالة النجاح" value={successMsg} onChange={(e) => { setSuccessMsg(e.target.value); onSuccessChange(e.target.value); }} />
                <div className="col-span-2">
                  <p className="text-sm font-semibold text-[#3a4a60] mb-3">حقول النموذج</p>
                  <div className="space-y-3">
                    {fields.map((field, idx) => (
                      <div key={field.key} className="flex items-center gap-3 p-3 bg-[#fafbfc] rounded-lg border border-[#e8edf5]">
                        <GripVertical className="w-4 h-4 text-[#6b7a94]" />
                        <div className="flex-1 grid grid-cols-4 gap-3">
                          <Input label="مفتاح الحقل" value={field.key} onChange={(e) => { const nf = [...fields]; nf[idx] = { ...nf[idx], key: e.target.value }; setFields(nf); onFieldsChange(nf); }} />
                          <Input label="التسمية" value={field.label} onChange={(e) => { const nf = [...fields]; nf[idx] = { ...nf[idx], label: e.target.value }; setFields(nf); onFieldsChange(nf); }} />
                          <select className="form-control-contact" value={field.type} onChange={(e) => { const nf = [...fields]; nf[idx] = { ...nf[idx], type: e.target.value as FormFieldConfig["type"] }; setFields(nf); onFieldsChange(nf); }}>
                            <option value="text">نص</option>
                            <option value="email">بريد إلكتروني</option>
                            <option value="tel">هاتف</option>
                            <option value="textarea">نص طويل</option>
                            <option value="select">قائمة منسدلة</option>
                          </select>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-sm">
                              <Checkbox checked={field.required} onCheckedChange={(v) => { const nf = [...fields]; nf[idx] = { ...nf[idx], required: !!v }; setFields(nf); onFieldsChange(nf); }} />
                              مطلوب
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                              <Checkbox checked={field.enabled} onCheckedChange={(v) => { const nf = [...fields]; nf[idx] = { ...nf[idx], enabled: !!v }; setFields(nf); onFieldsChange(nf); }} />
                              مفعل
                            </label>
                          </div>
                        </div>
                        <DashboardButton variant="danger" size="icon-sm" onClick={() => { const nf = fields.filter((_, i) => i !== idx); setFields(nf); onFieldsChange(nf); }}>
                          <Trash2 className="w-4 h-4" />
                        </DashboardButton>
                      </div>
                    ))}
                    <button type="button" onClick={() => { const nf = [...fields, { key: `field-${Date.now()}`, label: "حقل جديد", placeholder: "", type: "text" as const, required: false, enabled: true }]; setFields(nf); onFieldsChange(nf); }} className="w-full py-2 rounded-lg border-2 border-dashed border-[#e8edf5] text-sm text-[#6b7a94] hover:border-[#0c2954]/30 hover:text-[#0c2954] hover:bg-[#f5f6f9] transition-colors flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" /> إضافة حقل
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </ContentCard>
    </section>
  );
}

function ContactInfoSection({ data: initial, onChange }: { data: typeof CONTACT_PAGE_INFO; onChange: (d: typeof CONTACT_PAGE_INFO) => void }) {
  const [data, setData] = useState(initial);

  useEffect(() => {
    setData(initial);
  }, [initial]);

  const handleChange = useCallback((patch: Partial<typeof CONTACT_PAGE_INFO>) => {
    const newData = { ...data, ...patch };
    setData(newData);
    onChange(newData);
  }, [data, onChange]);

  return (
    <section id="contact-info">
      <ContentCard title="معلومات الاتصال" subtitle="تفاصيل الاتصال الأساسية">
        <div className="form-grid-2">
          <Input label="البريد الإلكتروني" value={data.email} onChange={(e) => handleChange({ email: e.target.value })} />
          <Input label="رقم الهاتف" value={data.phone} onChange={(e) => handleChange({ phone: e.target.value })} />
          <Input label="العنوان" value={data.address} onChange={(e) => handleChange({ address: e.target.value })} />
          <Input label="رقم الواتساب" value={data.whatsapp} onChange={(e) => handleChange({ whatsapp: e.target.value })} />
        </div>
      </ContentCard>
    </section>
  );
}

function InquiryOptionsSection({ data: initial, onChange }: { data: typeof INQUIRY_OPTIONS; onChange: (d: typeof INQUIRY_OPTIONS) => void }) {
  const [items, setItems] = useState(initial);
  const dragIdx = useRef<number | null>(null);

  useEffect(() => {
    setItems(initial);
  }, [initial]);

  const notifyChange = (newItems: typeof INQUIRY_OPTIONS) => {
    setItems(newItems);
    onChange(newItems);
  };

  const updateItem = (idx: number, patch: Partial<typeof INQUIRY_OPTIONS[number]>) => {
    const n = [...items];
    n[idx] = { ...n[idx], ...patch };
    notifyChange(n);
  };

  return (
    <section id="inquiry-options">
      <ContentCard title="خيارات الاستفسار" subtitle="خيارات نوع الاستفسار في نموذج التواصل">
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-[#fafbfc] rounded-lg border border-[#e8edf5]">
              <GripVertical className="w-4 h-4 text-[#6b7a94] cursor-grab" />
               <Input label="القيمة" value={item.value} onChange={(e) => updateItem(idx, { value: e.target.value as InquiryType | "" })} wrapperClassName="flex-1" />
               <Input label="التسمية المعروضة" value={item.label} onChange={(e) => updateItem(idx, { label: e.target.value })} wrapperClassName="flex-1" />
               <DashboardButton variant="danger" size="icon-sm" onClick={() => notifyChange(items.filter((_, i) => i !== idx))}>
                 <Trash2 className="w-4 h-4" />
               </DashboardButton>
             </div>
           ))}
           <button type="button" onClick={() => notifyChange([...items, { value: `option-${items.length + 1}` as InquiryType, label: "خيار جديد" }])} className="w-full py-2 rounded-lg border-2 border-dashed border-[#e8edf5] text-sm text-[#6b7a94] hover:border-[#0c2954]/30 hover:text-[#0c2954] hover:bg-[#f5f6f9] transition-colors flex items-center justify-center gap-2">
             <Plus className="w-4 h-4" /> إضافة خيار
           </button>
        </div>
      </ContentCard>
    </section>
  );
}
