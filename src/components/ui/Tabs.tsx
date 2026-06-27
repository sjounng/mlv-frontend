"use client";

import type { LucideIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: ReactNode;
}

export type TabsVariant = "underline" | "pill";

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: TabsVariant;
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = "underline",
  className = "",
}: TabsProps) {
  if (variant === "underline") {
    return (
      <div className={`flex items-center gap-1 border-b border-white/8 ${className}`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`focus-ring relative inline-flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                active
                  ? "text-white font-medium after:absolute after:-bottom-px after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-emerald-400"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {Icon && <Icon size={15} />}
              <span>{tab.label}</span>
              {tab.badge && <span className="ml-1">{tab.badge}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1 p-1 bg-white/3 rounded-lg ${className}`}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`focus-ring inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
              active
                ? "bg-white/10 text-white shadow-sm"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            {Icon && <Icon size={14} />}
            <span>{tab.label}</span>
            {tab.badge && <span className="ml-1">{tab.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function TabsContent({
  children,
  className = "",
  ...rest
}: TabsContentProps) {
  return (
    <div className={`mt-5 ${className}`} {...rest}>
      {children}
    </div>
  );
}

export default Tabs;
