"use client";

import { useState } from "react";
import { Input, Select, Textarea } from "@/app/components/ui/Input";
import type { InquiryOption } from "@/lib/contact-data";
import type { FormFieldConfig } from "@/app/lib/form-fields-data";
import { ThirdPartyForm } from "@/app/components/ThirdPartyForm";

interface ContactFormProps {
  inquiryOptions: InquiryOption[];
  successMessage: string;
  formFields: FormFieldConfig[];
  thirdPartyFormScript?: string;
  formReplaced?: boolean;
}

const API_KEY_MAP: Record<string, string> = {
  name: "fullName",
  phone: "phone",
  email: "email",
  type: "inquiry",
  message: "message",
};

function SuccessState({ message }: { message: string }) {
  return (
    <div className="form-success-state">
      <div className="success-icon-circle">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="#1a9a5a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="text-[20px] font-bold text-navy mb-2">تم إرسال رسالتك بنجاح!</h3>
      <p className="text-[14px] text-muted leading-[1.7]">{message}</p>
    </div>
  );
}

export function ContactForm({ inquiryOptions, successMessage, formFields, thirdPartyFormScript, formReplaced }: ContactFormProps) {
  const enabledFields = formFields.filter((f) => f.enabled);

  const initialForm = Object.fromEntries(enabledFields.map((f) => [f.key, ""]));

  const [form, setForm] = useState<Record<string, string>>(initialForm);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const newErrors: Record<string, boolean> = {};
    for (const field of enabledFields) {
      if (field.required && !form[field.key]?.trim()) {
        newErrors[field.key] = true;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload: Record<string, string> = {};
      const extraParts: string[] = [];

      for (const field of enabledFields) {
        const val = form[field.key]?.trim() ?? "";
        const apiField = API_KEY_MAP[field.key];
        if (apiField) {
          payload[apiField] = val;
        } else if (val) {
          extraParts.push(`${field.label}: ${val}`);
        }
      }

      if (extraParts.length > 0) {
        payload.message = (payload.message ? payload.message + "\n\n" : "") + extraParts.join("\n");
      }

      const res = await fetch("/api/contact-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  function setValue(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function renderField(field: FormFieldConfig) {
    if (field.type === "select") {
      return (
        <Select
          key={field.key}
          label={field.label}
          required={field.required}
          value={form[field.key] ?? ""}
          onChange={(e) => setValue(field.key, e.target.value)}
        >
          {inquiryOptions.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
              {opt.label}
            </option>
          ))}
        </Select>
      );
    }

    if (field.type === "textarea") {
      return (
        <Textarea
          key={field.key}
          label={field.label}
          placeholder={field.placeholder || undefined}
          required={field.required}
          value={form[field.key] ?? ""}
          error={errors[field.key]}
          onChange={(e) => setValue(field.key, e.target.value)}
          rows={4}
        />
      );
    }

    return (
      <Input
        key={field.key}
        label={field.label}
        placeholder={field.placeholder || undefined}
        required={field.required}
        type={field.type === "tel" ? "tel" : field.type === "email" ? "email" : "text"}
        value={form[field.key] ?? ""}
        error={errors[field.key]}
        onChange={(e) => setValue(field.key, e.target.value)}
      />
    );
  }

  function isTextLike(f: FormFieldConfig) {
    return f.type === "text" || f.type === "tel" || f.type === "email";
  }

  function renderFields() {
    const rows: React.ReactNode[] = [];
    let i = 0;
    while (i < enabledFields.length) {
      const cur = enabledFields[i];
      const next = enabledFields[i + 1];
      if (next && isTextLike(cur) && isTextLike(next)) {
        rows.push(
          <div key={`pair-${i}`} className="form-grid-2">
            {renderField(cur)}
            {renderField(next)}
          </div>
        );
        i += 2;
      } else {
        rows.push(<div key={cur.key} className="form-grid-single">{renderField(cur)}</div>);
        i += 1;
      }
    }
    return rows;
  }

  if (submitted) {
    return (
      <div className="contact-form-card">
        <SuccessState message={successMessage} />
      </div>
    );
  }

  return (
    <div className="contact-form-card anim-fade-in-up anim-delay-2">
      <div className="text-[20px] font-bold text-navy mb-2">أرسل لنا رسالتك</div>
      <div className="text-[14px] text-muted leading-[1.75] mb-7">
        سيتم التواصل معك خلال 24 ساعة من فريقنا المتخصص.
      </div>

      {formReplaced && thirdPartyFormScript ? (
        <ThirdPartyForm scriptHtml={thirdPartyFormScript} />
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          {renderFields()}

          <button type="submit" className="btn-submit-contact" disabled={submitting}>
            {submitting ? "جاري الإرسال..." : "إرسال الرسالة"}
          </button>

          <div className="text-[12px] text-muted text-center mt-3">
            بإرسال الرسالة، أنت توافق على{" "}
            <a href="https://www.aysar.sa/privacy-policy" className="text-indigo no-underline">
              سياسة الخصوصية
            </a>
          </div>
        </form>
      )}
    </div>
  );
}
