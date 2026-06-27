"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    className = "",
    containerClassName = "",
    id,
    ...rest
  },
  ref,
) {
  const inputId =
    id ?? (label ? `input-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);

  const base =
    "w-full bg-white/5 border rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:bg-white/[0.07] focus:ring-2 transition-colors";
  const borderState = error
    ? "border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20"
    : "border-white/10 focus:border-emerald-400/50 focus:ring-emerald-400/15";

  return (
    <div className={containerClassName}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-white/60 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`${base} ${borderState} ${leftIcon ? "pl-9" : ""} ${rightIcon ? "pr-9" : ""} ${className}`}
          {...rest}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      {!error && hint && <p className="text-xs text-white/35 mt-1">{hint}</p>}
    </div>
  );
});

export default Input;
