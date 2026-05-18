import { cn } from "@/lib/utils";
import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: boolean;
  required?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  required?: boolean;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: boolean;
  required?: boolean;
}

export function Input({ label, error, required, className, ...rest }: InputProps) {
  return (
    <div className="form-group-contact">
      <label>
        {label}
        {required && <span className="text-red-500 mr-0.5">*</span>}
      </label>
      <input
        className={cn("form-control-contact", error && "error", className)}
        {...rest}
      />
    </div>
  );
}

export function Select({ label, required, className, children, ...rest }: SelectProps) {
  return (
    <div className="form-group-contact">
      <label>
        {label}
        {required && <span className="text-red-500 mr-0.5">*</span>}
      </label>
      <select className={cn("form-control-contact", className)} {...rest}>
        {children}
      </select>
    </div>
  );
}

export function Textarea({ label, error, required, className, ...rest }: TextareaProps) {
  return (
    <div className="form-group-contact full">
      <label>
        {label}
        {required && <span className="text-red-500 mr-0.5">*</span>}
      </label>
      <textarea
        className={cn("form-control-contact", error && "error", className)}
        {...rest}
      />
    </div>
  );
}
