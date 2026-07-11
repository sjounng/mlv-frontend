"use client";

// 네비바 라이트/다크 전환 버튼 (07-10 피드백).
// 해/달 아이콘이 회전+스케일 모션으로 교차 전환된다. 선택은 localStorage 에 저장(마이페이지 설정과 공유).
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label={isLight ? "다크 모드로 전환" : "라이트 모드로 전환"}
      title={isLight ? "다크 모드로 전환" : "라이트 모드로 전환"}
      className="focus-ring relative w-9 h-9 rounded-md text-white/60 hover:text-white hover:bg-white/8 transition-colors"
    >
      {/* 해 (라이트에서 표시) */}
      <Sun
        size={17}
        className={`absolute inset-0 m-auto transition-all duration-300 ease-out ${
          isLight ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
        }`}
      />
      {/* 달 (다크에서 표시) */}
      <Moon
        size={17}
        className={`absolute inset-0 m-auto transition-all duration-300 ease-out ${
          isLight ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      />
    </button>
  );
}
