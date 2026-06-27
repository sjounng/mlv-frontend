"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      error,
      hint,
      className = "",
      containerClassName = "",
      id,
      rows = 4,
      ...rest
    },
    ref,
  ) {
    const textareaId =
      id ??
      (label ? `textarea-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);

    const base =
      "w-full bg-white/5 border rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:bg-white/[0.07] focus:ring-2 resize-y transition-colors";
    const borderState = error
      ? "border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20"
      : "border-white/10 focus:border-emerald-400/50 focus:ring-emerald-400/15";

    return (
      <div className={containerClassName}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-medium text-white/60 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`${base} ${borderState} ${className}`}
          {...rest}
        />
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        {!error && hint && <p className="text-xs text-white/35 mt-1">{hint}</p>}
      </div>
    );
  },
);

export default Textarea;
