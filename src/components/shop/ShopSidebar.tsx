"use client";

// 상점 좌측 사이드바 (07-12 피드백: 추천상품/이벤트 제거 → 아이템 태그(카테고리) 배치)
import { Tags } from "lucide-react";

export interface CategoryTag {
  id: string;
  label: string;
}

export default function ShopSidebar({
  categories,
  active,
  onSelect,
}: {
  categories: CategoryTag[];
  active: string;
  onSelect: (id: string) => void;
}) {
  const tags: CategoryTag[] = [{ id: "all", label: "전체" }, ...categories];

  return (
    <aside className="hidden lg:flex w-52 shrink-0 flex-col gap-4">
      <div className="bg-surface-3 border border-white/8 rounded-xl p-4">
        <p className="text-sm font-semibold mb-3 flex items-center gap-1.5">
          <Tags size={14} className="text-emerald-300" /> 아이템 태그
        </p>
        <ul className="flex flex-col gap-1">
          {tags.map((tag) => (
            <li key={tag.id}>
              <button
                type="button"
                onClick={() => onSelect(tag.id)}
                aria-pressed={active === tag.id}
                className={`focus-ring w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  active === tag.id
                    ? "bg-emerald-600 text-white font-medium"
                    : "text-white/55 hover:text-white hover:bg-white/5"
                }`}
              >
                {tag.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
