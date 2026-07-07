import Image from "next/image";

export type MinecraftHeadSize = "sm" | "md" | "lg";

export interface MinecraftHeadProps {
  username: string;
  size?: MinecraftHeadSize;
  /** 마인크래프트 UUID — 주면 cravatar.eu 스킨 아바타를 자동으로 사용한다 */
  uuid?: string;
  src?: string;
  className?: string;
}

const sizeClasses: Record<MinecraftHeadSize, { wrap: string; text: string; px: number }> = {
  sm: { wrap: "w-7 h-7", text: "text-xs", px: 28 },
  md: { wrap: "w-9 h-9", text: "text-sm", px: 36 },
  lg: { wrap: "w-12 h-12", text: "text-base", px: 48 },
};

const palette = [
  "bg-amber-700",
  "bg-emerald-700",
  "bg-cyan-700",
  "bg-indigo-700",
  "bg-rose-700",
  "bg-orange-700",
  "bg-purple-700",
  "bg-teal-700",
];

function colorForUsername(username: string): string {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = (hash << 5) - hash + username.charCodeAt(i);
    hash |= 0;
  }
  return palette[Math.abs(hash) % palette.length];
}

export default function MinecraftHead({
  username,
  size = "md",
  uuid,
  src,
  className = "",
}: MinecraftHeadProps) {
  const s = sizeClasses[size];
  const initial = username.trim().charAt(0).toUpperCase() || "S";
  // 스킨 아바타 연동: 명시된 src > cravatar(uuid) > 이니셜 폴백
  const resolvedSrc = src ?? (uuid ? `https://cravatar.eu/avatar/${uuid.replace(/-/g, "")}/${s.px * 2}.png` : undefined);
  return (
    <div
      className={`relative inline-block ${s.wrap} rounded-sm overflow-hidden ring-1 ring-white/15 shrink-0 ${className}`}
    >
      {resolvedSrc ? (
        <Image
          src={resolvedSrc}
          alt={username}
          width={s.px}
          height={s.px}
          className="object-cover w-full h-full image-pixelated"
          style={{ imageRendering: "pixelated" }}
          unoptimized
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center text-white font-bold ${s.text} ${colorForUsername(username)}`}
        >
          {initial}
        </div>
      )}
    </div>
  );
}
