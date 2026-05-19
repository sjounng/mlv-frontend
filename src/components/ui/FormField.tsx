import type { ReactNode } from "react";

export interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  htmlFor?: string;
}

export default function FormField({
  label,
  error,
  hint,
  required,
  children,
  className = "",
  htmlFor,
}: FormFieldProps) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium text-white/70 mb-1.5"
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      {!error && hint && <p className="text-xs text-white/35 mt-1">{hint}</p>}
    </div>
  );
}
