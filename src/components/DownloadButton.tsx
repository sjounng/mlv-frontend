"use client";

// 네비바 다운로드 버튼 + 플레이 방법 모달 (피드백: 히어로 버튼 제거 후 프로필 우측 배치)
// 클릭 시 전용 런처 다운로드 안내 콜아웃 팝업을 연다.

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const CLIENT_DOWNLOAD_URL = siteConfig.clientDownloadUrl;
const GUIDE_URL = siteConfig.guideUrl;

export default function DownloadButton({
  compact = false,
  large = false,
}: {
  compact?: boolean;
  large?: boolean;
}) {
  const [open, setOpen] = useState(false);

  // ESC 로 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`focus-ring inline-flex items-center gap-1.5 whitespace-nowrap font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-[background-color,box-shadow,transform] duration-150 shadow-[0_2px_0_0_#065f46] active:translate-y-[1px] active:shadow-[0_1px_0_0_#065f46] ${
          large ? "px-7 py-3 text-base gap-2 shadow-[0_4px_0_0_#065f46] active:translate-y-[2px]" : compact ? "px-3 py-1.5 text-xs" : "px-4 py-1.5 text-sm"
        }`}
      >
        다운로드
        <Download size={large ? 18 : compact ? 13 : 15} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative bg-surface-3 border border-white/10 rounded-lg p-8 max-w-md w-full mx-4 shadow-[0_6px_0_rgba(0,0,0,0.45)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="focus-ring absolute top-4 right-4 p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="닫기"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-bold mb-3">플레이 방법</h2>
            <p className="text-white/55 text-sm leading-relaxed mb-6 break-keep">
              마이리틀밸리 서버에 접속하려면 전용런처와 Java Edition을 보유한 Microsoft 계정이
              필요합니다. 아래 다운로드 버튼을 눌러 런처를 설치한 뒤 로그인하여 플레이 해주시기
              바랍니다.
            </p>

            <div className="flex flex-col gap-2.5">
              {CLIENT_DOWNLOAD_URL ? (
                <a
                  href={CLIENT_DOWNLOAD_URL}
                  className="focus-ring flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-semibold transition-[background-color,box-shadow,transform] duration-150 shadow-[0_3px_0_0_#065f46] active:translate-y-[2px] active:shadow-[0_1px_0_0_#065f46]"
                >
                  <Download size={15} />
                  전용 런처 다운로드
                </a>
              ) : (
                <div className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white/45">
                  <Download size={15} />
                  다운로드 링크 준비 중입니다
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  if (GUIDE_URL) window.open(GUIDE_URL, "_blank", "noopener,noreferrer");
                }}
                disabled={!GUIDE_URL}
                className="focus-ring block w-full text-center py-2.5 px-4 border border-white/10 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {GUIDE_URL ? "접속 가이드 보기" : "접속 가이드 준비 중"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
