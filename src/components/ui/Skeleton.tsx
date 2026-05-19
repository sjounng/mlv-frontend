import type { HTMLAttributes } from "react";

export type SkeletonVariant = "text" | "rect" | "circle";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
}

const variantClasses: Record<SkeletonVariant, string> = {
  text: "rounded h-4",
  rect: "rounded-lg",
  circle: "rounded-full",
};

export default function Skeleton({
  variant = "text",
  className = "",
  ...rest
}: SkeletonProps) {
  return (
    <div
      className={`skeleton-shimmer ${variantClasses[variant]} ${className}`}
      {...rest}
    />
  );
}
