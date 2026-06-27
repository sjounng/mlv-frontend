"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  containerClassName?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    error,
    hint,
    options,
    className = "",
    containerClassName = "",
    id,
    ...rest
  },
  ref,
) {
  const selectId =
    id ?? (label ? `select-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);

  const base =
    "w-full bg-white/5 border rounded-lg px-3 py-2 pr-9 text-sm text-white placeholder:text-white/30 focus:outline-none focus:bg-white/[0.07] focus:ring-2 appearance-none transition-colors cursor-pointer";
  const borderState = error
    ? "border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20"
    : "border-white/10 focus:border-emerald-400/50 focus:ring-emerald-400/15";

  return (
    <div className={containerClassName}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-medium text-white/60 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={`${base} ${borderState} ${className}`}
          {...rest}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-surface-4 text-white"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
        />
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      {!error && hint && <p className="text-xs text-white/35 mt-1">{hint}</p>}
    </div>
  );
});

export default Select;
