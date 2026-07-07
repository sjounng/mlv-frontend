import type { HTMLAttributes, ReactNode } from "react";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "hot"
  | "new";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children?: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-white/8 text-white/60 border border-white/10",
  success: "bg-green-500/15 text-green-400 border border-green-500/20",
  warning: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
  error: "bg-red-500/15 text-red-400 border border-red-500/20",
  info: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  hot: "bg-red-500/90 text-white",
  new: "bg-blue-500/90 text-white",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "text-[10px] px-1.5 py-0.5 rounded-sm",
  md: "text-xs px-2 py-0.5 rounded-sm",
};

export default function Badge({
  variant = "default",
  size = "md",
  className = "",
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-semibold ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
