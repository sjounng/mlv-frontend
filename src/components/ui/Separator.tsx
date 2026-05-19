import type { ReactNode } from "react";

export interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  label?: ReactNode;
  className?: string;
}

export default function Separator({
  orientation = "horizontal",
  label,
  className = "",
}: SeparatorProps) {
  if (orientation === "vertical") {
    return <div className={`w-px h-full bg-white/8 ${className}`} />;
  }
  if (label) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-xs text-white/30">{label}</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>
    );
  }
  return <div className={`w-full h-px bg-white/8 ${className}`} />;
}
