"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "solid" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  solid:
    "bg-emerald-600 text-white hover:bg-emerald-500 disabled:bg-emerald-600/40 disabled:text-white/60 shadow-sm shadow-emerald-950/40",
  outline:
    "border border-white/15 text-white/90 hover:bg-white/5 hover:border-white/25 disabled:opacity-40",
  ghost:
    "text-white/70 hover:text-white hover:bg-white/5 disabled:opacity-40",
  danger:
    "bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25 disabled:opacity-40",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2 text-sm rounded-lg gap-2",
  lg: "px-6 py-2.5 text-base rounded-xl gap-2",
};

const spinnerSize: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "solid",
    size = "md",
    loading = false,
    leftIcon,
    rightIcon,
    className = "",
    disabled,
    children,
    type = "button",
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`focus-ring inline-flex items-center justify-center font-medium transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {loading ? (
        <Loader2 size={spinnerSize[size]} className="animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
});

export default Button;
