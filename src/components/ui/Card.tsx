import type { HTMLAttributes, ReactNode } from "react";

export type CardVariant = "default" | "elevated" | "flat";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  children?: ReactNode;
}

// 흐릿한 글로우 대신 아래로 딱 떨어지는 오프셋 섀도 — 블록을 쌓은 듯한 인상
const variantClasses: Record<CardVariant, string> = {
  default:
    "bg-surface-3 border border-white/8 rounded-lg shadow-[0_2px_0_rgba(0,0,0,0.35)]",
  elevated:
    "bg-surface-3 border border-white/10 rounded-lg shadow-[0_4px_0_rgba(0,0,0,0.4)]",
  flat: "bg-white/[0.03] border border-white/5 rounded-lg",
};

const paddingClasses: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export default function Card({
  variant = "default",
  padding = "md",
  className = "",
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={`${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
