export interface FormFieldConfig {
  key: string;
  label: string;
  placeholder: string;
  type: "text" | "tel" | "email" | "select" | "textarea";
  required: boolean;
  enabled: boolean;
}

export const FORM_FIELDS_DEFAULTS: FormFieldConfig[] = [
  { key: "name", label: "الاسم الكامل", placeholder: "محمد العمري", type: "text", required: true, enabled: true },
  { key: "phone", label: "رقم الجوال", placeholder: "05XXXXXXXX", type: "tel", required: true, enabled: true },
  { key: "email", label: "البريد الإلكتروني", placeholder: "example@email.com", type: "email", required: false, enabled: true },
  { key: "type", label: "نوع الاستفسار", placeholder: "", type: "select", required: true, enabled: true },
  { key: "message", label: "رسالتك", placeholder: "اكتب رسالتك هنا...", type: "textarea", required: true, enabled: true },
];

function isOldFormFieldsFormat(v: unknown): v is Record<string, boolean> {
  if (!v || typeof v !== "object" || Array.isArray(v)) return false;
  return Object.values(v).every((val) => typeof val === "boolean");
}

export const CONTACT_FORM_DEFAULTS = {
  thirdPartyFormScript: "",
  formReplaced: false,
};

export function migrateFormFields(raw: unknown): FormFieldConfig[] {
  if (!raw) return FORM_FIELDS_DEFAULTS;
  if (Array.isArray(raw)) {
    const arr = raw as Record<string, unknown>[];
    return arr.map((f) => ({
      key: String(f.key ?? ""),
      label: String(f.label ?? ""),
      placeholder: String(f.placeholder ?? ""),
      type: (["text", "tel", "email", "select", "textarea"] as const).includes(f.type as "text" | "tel" | "email" | "select" | "textarea")
        ? (f.type as FormFieldConfig["type"])
        : "text",
      required: Boolean(f.required),
      enabled: Boolean(f.enabled),
    }));
  }
  if (isOldFormFieldsFormat(raw)) {
    return FORM_FIELDS_DEFAULTS.map((def) => ({
      ...def,
      enabled: raw[def.key] ?? true,
    }));
  }
  return FORM_FIELDS_DEFAULTS;
}
