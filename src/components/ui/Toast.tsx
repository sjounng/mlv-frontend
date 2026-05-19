"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastVariant = "default" | "success" | "error" | "warning";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  toast: (opts: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const iconMap = {
  default: Info,
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
};

const variantClasses: Record<ToastVariant, string> = {
  default: "border-white/15 text-white",
  success: "border-green-500/30 text-green-300",
  error: "border-red-500/30 text-red-300",
  warning: "border-yellow-500/30 text-yellow-300",
};

const iconColor: Record<ToastVariant, string> = {
  default: "text-white/60",
  success: "text-green-400",
  error: "text-red-400",
  warning: "text-yellow-400",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback((opts: ToastOptions) => {
    const id = Math.random().toString(36).slice(2);
    const item: ToastItem = {
      ...opts,
      id,
      variant: opts.variant ?? "default",
      duration: opts.duration ?? 4000,
    };
    setToasts((t) => [...t, item]);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastView key={t.id} item={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastView({
  item,
  onClose,
}: {
  item: ToastItem;
  onClose: () => void;
}) {
  const variant = item.variant ?? "default";
  const Icon = iconMap[variant];

  useEffect(() => {
    const t = setTimeout(onClose, item.duration ?? 4000);
    return () => clearTimeout(t);
  }, [onClose, item.duration]);

  return (
    <div
      className={`pointer-events-auto min-w-[300px] max-w-sm bg-surface-3 border ${variantClasses[variant]} rounded-xl shadow-2xl px-4 py-3 flex items-start gap-3`}
      role="status"
    >
      <Icon size={18} className={`shrink-0 mt-0.5 ${iconColor[variant]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{item.title}</p>
        {item.description && (
          <p className="text-xs text-white/50 mt-0.5">{item.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-1 -m-1 text-white/40 hover:text-white transition-colors"
        aria-label="닫기"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      toast: () => {
        if (typeof window !== "undefined") {
          // eslint-disable-next-line no-console
          console.warn("useToast called outside <ToastProvider>");
        }
      },
    };
  }
  return ctx;
}

export default ToastProvider;
