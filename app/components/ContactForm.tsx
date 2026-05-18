"use client";

import { useState } from "react";
import { Input, Select, Textarea } from "@/app/components/ui/Input";
import { INQUIRY_OPTIONS, ContactFormData } from "@/lib/contact-data";

function SuccessState() {
  return (
    <div className="form-success-state">
      <div className="success-icon-circle">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="#1a9a5a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="text-[20px] font-bold text-navy mb-2">تم إرسال رسالتك بنجاح!</h3>
      <p className="text-[14px] text-muted leading-[1.7]">
        شكراً لتواصلك معنا. سيتم الرد عليك خلال 24 ساعة من أوقات العمل.
      </p>
    </div>
  );
}

export function ContactForm() {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    phone: "",
    email: "",
    type: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): boolean {
    const newErrors: Record<string, boolean> = {};
    if (!form.name.trim()) newErrors.name = true;
    if (!form.phone.trim()) newErrors.phone = true;
    if (!form.type) newErrors.type = true;
    if (!form.message.trim()) newErrors.message = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  }

  function set<K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  if (submitted) {
    return (
      <div className="contact-form-card">
        <SuccessState />
      </div>
    );
  }

  return (
    <div className="contact-form-card anim-fade-in-up anim-delay-2">
      <div className="text-[20px] font-bold text-navy mb-2">أرسل لنا رسالتك</div>
      <div className="text-[14px] text-muted leading-[1.75] mb-7">
        سيتم التواصل معك خلال 24 ساعة من فريقنا المتخصص.
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid-2">
          <Input
            label="الاسم الكامل"
            placeholder="محمد العمري"
            required
            value={form.name}
            error={errors.name}
            onChange={(e) => set("name", e.target.value)}
          />
          <Input
            label="رقم الجوال"
            placeholder="05XXXXXXXX"
            required
            type="tel"
            value={form.phone}
            error={errors.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>

        <Input
          label="البريد الإلكتروني"
          placeholder="example@email.com"
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
        />

        <Select
          label="نوع الاستفسار"
          required
          value={form.type}
          onChange={(e) => set("type", e.target.value)}
        >
          {INQUIRY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
              {opt.label}
            </option>
          ))}
        </Select>

        <Textarea
          label="رسالتك"
          placeholder="اكتب رسالتك هنا..."
          required
          value={form.message}
          error={errors.message}
          onChange={(e) => set("message", e.target.value)}
        />

        <button type="submit" className="btn-submit-contact">
          إرسال الرسالة
        </button>

        <div className="text-[12px] text-muted text-center mt-3">
          بإرسال الرسالة، أنت توافق على{" "}
          <a href="https://www.aysar.sa/privacy-policy" className="text-indigo no-underline">
            سياسة الخصوصية
          </a>
        </div>
      </form>
    </div>
  );
}
