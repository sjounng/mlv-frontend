"use client";

// 간소화된 리치 텍스트 에디터 (07-22 이벤트 본문용)
//  - 굵게(Bold), 이미지 업로드 삽입, 영상(YouTube/mp4 URL) 삽입
//  - contentEditable 기반. 값은 HTML 문자열로 onChange 전달 (렌더 시 sanitizeHtml 로 정화)
import { useEffect, useRef } from "react";
import { Bold, ImagePlus, Clapperboard, List, Heading2 } from "lucide-react";
import { uploadImage } from "@/lib/admin-api";
import { useToast } from "@/components/ui";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarButton({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      aria-label={label}
      title={label}
      className="focus-ring w-8 h-8 rounded-md flex items-center justify-center text-white/60 hover:text-white hover:bg-white/8 transition-colors"
    >
      {children}
    </button>
  );
}

function youtubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    let id = "";
    if (u.hostname === "youtu.be") id = u.pathname.slice(1);
    else if (u.hostname.includes("youtube.com")) id = u.searchParams.get("v") ?? "";
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}`;
  } catch {
    return null;
  }
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // 외부 value 가 바뀌었고(다른 이벤트 편집 시작 등) 에디터 내용과 다르면 동기화
  useEffect(() => {
    const el = ref.current;
    if (el && el.innerHTML !== value) {
      el.innerHTML = value ?? "";
    }
    // value 를 의존성에 넣으면 타이핑마다 커서가 튀므로, 초기/외부 변경 시에만 동기화한다.
  }, [value]);

  const emit = () => {
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const exec = (command: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    emit();
  };

  const insertHtml = (html: string) => {
    ref.current?.focus();
    document.execCommand("insertHTML", false, html);
    emit();
  };

  const onPickImage = async (file: File) => {
    try {
      const { url } = await uploadImage(file);
      insertHtml(`<img src="${url}" alt="" />`);
    } catch {
      toast({ title: "이미지 업로드 실패", variant: "error" });
    }
  };

  const onInsertVideo = () => {
    const url = window.prompt("영상 URL을 입력하세요 (YouTube 링크 또는 mp4 주소)");
    if (!url || !url.trim()) return;
    const embed = youtubeEmbed(url.trim());
    if (embed) {
      insertHtml(`<iframe src="${embed}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
    } else {
      insertHtml(`<video src="${url.trim()}" controls></video>`);
    }
  };

  return (
    <div className="rounded-lg border border-white/10 bg-surface-2 overflow-hidden">
      <div className="flex items-center gap-0.5 border-b border-white/8 px-2 py-1.5">
        <ToolbarButton onClick={() => exec("bold")} label="굵게"><Bold size={15} /></ToolbarButton>
        <ToolbarButton onClick={() => exec("formatBlock", "H2")} label="제목"><Heading2 size={15} /></ToolbarButton>
        <ToolbarButton onClick={() => exec("insertUnorderedList")} label="목록"><List size={15} /></ToolbarButton>
        <div className="w-px h-5 bg-white/10 mx-1" />
        <ToolbarButton onClick={() => fileRef.current?.click()} label="이미지 삽입"><ImagePlus size={15} /></ToolbarButton>
        <ToolbarButton onClick={onInsertVideo} label="영상 삽입"><Clapperboard size={15} /></ToolbarButton>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        data-placeholder={placeholder ?? "본문을 작성하세요"}
        className="rte-content min-h-[220px] max-h-[480px] overflow-y-auto px-4 py-3 text-sm leading-relaxed outline-none"
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void onPickImage(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
