import { Coins } from "lucide-react";

export type CashDisplaySize = "sm" | "md" | "lg";

export interface CashDisplayProps {
  amount: number;
  size?: CashDisplaySize;
  showIcon?: boolean;
  className?: string;
}

const sizeClasses: Record<CashDisplaySize, { text: string; icon: number }> = {
  sm: { text: "text-xs", icon: 12 },
  md: { text: "text-sm", icon: 14 },
  lg: { text: "text-lg", icon: 18 },
};

export default function CashDisplay({
  amount,
  size = "md",
  showIcon = true,
  className = "",
}: CashDisplayProps) {
  const s = sizeClasses[size];
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold text-amber-300 tabular-nums ${s.text} ${className}`}
    >
      {showIcon && <Coins size={s.icon} className="text-amber-400" />}
      <span>{amount.toLocaleString()} C</span>
    </span>
  );
}
