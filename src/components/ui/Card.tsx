import type { HTMLAttributes, ReactNode } from "react";

export type CardVariant = "default" | "elevated" | "flat";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  children?: ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  default:
    "bg-surface-3 border border-white/8 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.25)]",
  elevated:
    "bg-surface-3 border border-white/10 rounded-xl shadow-xl shadow-black/40",
  flat: "bg-white/[0.03] border border-white/5 rounded-xl",
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
