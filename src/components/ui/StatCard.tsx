import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import Card from "./Card";

export type StatTrend = "up" | "down" | "neutral";

export interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: StatTrend;
  icon?: LucideIcon;
  color?: string;
  className?: string;
}

const trendColor: Record<StatTrend, string> = {
  up: "text-green-400",
  down: "text-red-400",
  neutral: "text-white/40",
};

const trendIcon: Record<StatTrend, typeof ArrowUp> = {
  up: ArrowUp,
  down: ArrowDown,
  neutral: Minus,
};

export default function StatCard({
  title,
  value,
  change,
  trend = "neutral",
  icon: Icon,
  color = "bg-white/5 text-white/80",
  className = "",
}: StatCardProps) {
  const TrendIcon = trendIcon[trend];
  return (
    <Card padding="lg" className={`relative ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-white/40 mb-1.5">{title}</p>
          <p className="text-2xl font-semibold text-white tracking-tight">
            {value}
          </p>
          {change && (
            <div className={`inline-flex items-center gap-1 mt-2 text-xs ${trendColor[trend]}`}>
              <TrendIcon size={12} />
              <span>{change}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}
          >
            <Icon size={17} />
          </div>
        )}
      </div>
    </Card>
  );
}
