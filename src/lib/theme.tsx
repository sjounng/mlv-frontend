"use client";

// 라이트/다크 테마 (07-10 피드백).
// 기본값: 사용자 브라우저 환경(prefers-color-scheme)을 따라간다.
// 사용자가 마이페이지 > 설정에서 토글하면 그 선택을 localStorage 에 저장(오버라이드).
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";
const STORAGE_KEY = "mlv-theme";

interface ThemeContextValue {
  /** 실제 적용 중인 테마 */
  theme: Theme;
  /** 오버라이드 없이 시스템 설정을 따르는 중인지 */
  isSystem: boolean;
  setTheme: (t: Theme) => void;
  followSystem: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ── 시스템(prefers-color-scheme) 스토어 ──
function subscribeSystem(cb: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: light)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function getSystem(): Theme {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

// ── 사용자 오버라이드 스토어 (localStorage) ──
const overrideListeners = new Set<() => void>();
function notifyOverride() {
  overrideListeners.forEach((l) => l());
}
function subscribeOverride(cb: () => void) {
  overrideListeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    overrideListeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}
function getOverride(): Theme | null {
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "light" || v === "dark" ? v : null;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useSyncExternalStore(subscribeSystem, getSystem, () => "dark" as Theme);
  const override = useSyncExternalStore(subscribeOverride, getOverride, () => null);

  const theme: Theme = override ?? system;

  // DOM 반영 (외부 시스템 업데이트 — setState 아님).
  // 테마가 "바뀌는 순간"에만 .theme-switching 을 붙여 모든 요소 색이 서서히 전환되게 한다.
  const prevThemeRef = useRef<Theme | null>(null);
  useEffect(() => {
    const root = document.documentElement;
    const changed = prevThemeRef.current !== null && prevThemeRef.current !== theme;
    prevThemeRef.current = theme;
    if (changed) {
      root.classList.add("theme-switching");
      root.setAttribute("data-theme", theme);
      const timer = setTimeout(() => root.classList.remove("theme-switching"), 500);
      return () => {
        clearTimeout(timer);
        root.classList.remove("theme-switching");
      };
    }
    root.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    localStorage.setItem(STORAGE_KEY, t);
    notifyOverride();
  }, []);

  const followSystem = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    notifyOverride();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, isSystem: override === null, setTheme, followSystem }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
