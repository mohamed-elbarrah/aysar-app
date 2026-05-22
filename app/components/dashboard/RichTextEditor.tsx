"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, className, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const lastValueRef = useRef(value);
  const didMount = useRef(false);

  if (!didMount.current && editorRef.current) {
    editorRef.current.innerHTML = value;
    didMount.current = true;
  }

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML && value !== lastValueRef.current) {
      editorRef.current.innerHTML = value;
      lastValueRef.current = value;
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      lastValueRef.current = html;
      onChange(html);
    }
  }, [onChange]);

  const exec = useCallback((command: string, valueArg: string = "") => {
    document.execCommand(command, false, valueArg);
    handleInput();
    editorRef.current?.focus();
  }, [handleInput]);

  const buttons = [
    { cmd: "bold", label: "B", title: "عريض" },
    { cmd: "italic", label: "I", title: "مائل" },
    { cmd: "underline", label: "U", title: "تسطير" },
    { cmd: "strikeThrough", label: "S", title: "شطب" },
    { divider: true },
    { cmd: "formatBlock", arg: "H2", label: "H2", title: "عنوان 2" },
    { cmd: "formatBlock", arg: "H3", label: "H3", title: "عنوان 3" },
    { divider: true },
    { cmd: "insertUnorderedList", label: "•", title: "قائمة" },
    { cmd: "insertOrderedList", label: "1.", title: "قائمة مرقمة" },
    { divider: true },
    { cmd: "createLink", label: "🔗", title: "رابط" },
    { cmd: "removeFormat", label: "✕", title: "إزالة التنسيق" },
  ];

  return (
    <div
      className={`border border-[#e8edf5] rounded-xl overflow-hidden bg-white ${focused ? "ring-2 ring-[#0c2954]/10 border-[#0c2954]/20" : ""} transition-all ${className || ""}`}
    >
      <div className="flex items-center gap-0.5 px-3 py-2 bg-[#f8f9fb] border-b border-[#e8edf5] flex-wrap">
        {buttons.map((btn, i) => {
          if ("divider" in btn) {
            return <div key={i} className="w-px h-5 bg-[#e8edf5] mx-1" />;
          }
          return (
            <button
              key={btn.cmd + i}
              type="button"
              onClick={() => exec(btn.cmd, btn.arg || "")}
              title={btn.title}
              className="px-2 py-1 rounded text-xs font-semibold text-[#6b7a94] hover:bg-white hover:text-[#0c2954] transition-colors border border-transparent hover:border-[#e8edf5]"
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="min-h-[200px] max-h-[500px] overflow-y-auto p-4 text-sm leading-relaxed outline-none"
        style={{ direction: "rtl", textAlign: "start" }}
        data-placeholder={placeholder || ""}
      />
    </div>
  );
}
