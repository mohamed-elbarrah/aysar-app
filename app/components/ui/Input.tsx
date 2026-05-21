import { cn } from "@/lib/utils";
import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  required?: boolean;
  wrapperClassName?: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  required?: boolean;
  wrapperClassName?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: boolean;
  required?: boolean;
  wrapperClassName?: string;
}

export function Input({ label, error, required, className, wrapperClassName, ...rest }: InputProps) {
  return (
    <div className={cn("form-group-contact", wrapperClassName)}>
      {label && (
        <label>
          {label}
          {required && <span className="text-red-500 mr-0.5">*</span>}
        </label>
      )}
      <input
        className={cn("form-control-contact", error && "error", className)}
        {...rest}
      />
    </div>
  );
}

export function Select({ label, required, className, wrapperClassName, children, ...rest }: SelectProps) {
  return (
    <div className={cn("form-group-contact", wrapperClassName)}>
      {label && (
        <label>
          {label}
          {required && <span className="text-red-500 mr-0.5">*</span>}
        </label>
      )}
      <select className={cn("form-control-contact", className)} {...rest}>
        {children}
      </select>
    </div>
  );
}

export function Textarea({ label, error, required, className, wrapperClassName, ...rest }: TextareaProps) {
  return (
    <div className={cn("form-group-contact full", wrapperClassName)}>
      {label && (
        <label>
          {label}
          {required && <span className="text-red-500 mr-0.5">*</span>}
        </label>
      )}
      <textarea
        className={cn("form-control-contact", error && "error", className)}
        {...rest}
      />
    </div>
  );
}
