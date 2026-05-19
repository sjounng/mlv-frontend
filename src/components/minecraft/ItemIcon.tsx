export type ItemIconSize = "sm" | "md" | "lg" | "xl";

export interface ItemIconProps {
  emoji: string;
  color?: string;
  size?: ItemIconSize;
  label?: string;
  className?: string;
}

const sizeClasses: Record<ItemIconSize, string> = {
  sm: "w-8 h-8 text-xl",
  md: "w-12 h-12 text-2xl",
  lg: "w-16 h-16 text-4xl",
  xl: "w-24 h-24 text-6xl",
};

export default function ItemIcon({
  emoji,
  color = "bg-white/5",
  size = "md",
  label,
  className = "",
}: ItemIconProps) {
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      className={`inline-flex items-center justify-center rounded-lg border border-white/10 ${color} ${sizeClasses[size]} ${className}`}
    >
      <span className="leading-none">{emoji}</span>
    </div>
  );
}
