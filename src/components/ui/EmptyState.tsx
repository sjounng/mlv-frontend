import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-10 ${className}`}
    >
      {Icon && (
        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 text-white/40">
          <Icon size={22} />
        </div>
      )}
      <p className="text-sm font-medium text-white/80">{title}</p>
      {description && (
        <p className="text-xs text-white/40 mt-1.5 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
