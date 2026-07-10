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

// 게임 버튼처럼 바닥 두께(오프셋 섀도)가 있고, 누르면 실제로 눌린다.
// 섀도는 레이아웃에 영향이 없어서 주변 요소가 밀리지 않는다.
const variantClasses: Record<ButtonVariant, string> = {
  solid:
    "bg-emerald-600 text-white shadow-[0_3px_0_0_#065f46] hover:bg-emerald-500 " +
    "active:translate-y-[2px] active:shadow-[0_1px_0_0_#065f46] " +
    "disabled:bg-emerald-600/40 disabled:text-white/60 disabled:shadow-none",
  outline:
    "border border-white/15 text-white/90 shadow-[0_2px_0_0_rgba(255,255,255,0.08)] " +
    "hover:bg-white/5 hover:border-white/25 " +
    "active:translate-y-[1px] active:shadow-[0_1px_0_0_rgba(255,255,255,0.08)] disabled:opacity-40 disabled:shadow-none",
  ghost:
    "text-white/70 hover:text-white hover:bg-white/5 active:translate-y-[1px] disabled:opacity-40",
  danger:
    "bg-red-500/15 border border-red-500/30 text-red-300 shadow-[0_2px_0_0_rgba(153,27,27,0.5)] " +
    "hover:bg-red-500/25 active:translate-y-[1px] active:shadow-[0_1px_0_0_rgba(153,27,27,0.5)] disabled:opacity-40 disabled:shadow-none",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-md gap-1.5",
  md: "px-4 py-2 text-sm rounded-md gap-2",
  lg: "px-6 py-2.5 text-base rounded-lg gap-2",
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
      className={`focus-ring inline-flex items-center justify-center whitespace-nowrap font-semibold transition-[background-color,border-color,box-shadow,transform] duration-150 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
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
