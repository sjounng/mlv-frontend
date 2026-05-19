"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { Check } from "lucide-react";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, error, className = "", checked, id, ...rest },
  ref,
) {
  const checkboxId =
    id ?? (label ? `checkbox-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);

  return (
    <div className={className}>
      <label
        htmlFor={checkboxId}
        className="flex items-start gap-2.5 cursor-pointer group"
      >
        <span className="relative inline-flex items-center justify-center mt-0.5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            checked={checked}
            className="peer sr-only"
            {...rest}
          />
          <span
            className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${
              checked
                ? "bg-white border-white"
                : "bg-transparent border-white/20 group-hover:border-white/35"
            } ${error ? "border-red-500/50" : ""}`}
          >
            {checked && <Check size={12} className="text-black" strokeWidth={3} />}
          </span>
        </span>
        {(label || description) && (
          <span className="flex-1 min-w-0">
            {label && (
              <span className="block text-sm text-white/80">{label}</span>
            )}
            {description && (
              <span className="block text-xs text-white/40 mt-0.5">
                {description}
              </span>
            )}
          </span>
        )}
      </label>
      {error && <p className="text-xs text-red-400 mt-1 ml-6">{error}</p>}
    </div>
  );
});

export default Checkbox;
