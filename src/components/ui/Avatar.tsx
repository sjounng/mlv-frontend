import Image from "next/image";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  src?: string;
  name: string;
  size?: AvatarSize;
  online?: boolean;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-xl",
};

const indicatorSize: Record<AvatarSize, string> = {
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
  lg: "w-3 h-3",
  xl: "w-3.5 h-3.5",
};

const colors = [
  "bg-red-500/70",
  "bg-orange-500/70",
  "bg-yellow-500/70",
  "bg-green-500/70",
  "bg-cyan-500/70",
  "bg-blue-500/70",
  "bg-violet-500/70",
  "bg-pink-500/70",
];

function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return colors[Math.abs(hash) % colors.length];
}

const pxSize: Record<AvatarSize, number> = {
  sm: 28,
  md: 36,
  lg: 48,
  xl: 64,
};

export default function Avatar({
  src,
  name,
  size = "md",
  online,
  className = "",
}: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center font-semibold text-white ${
          src ? "" : colorForName(name)
        }`}
      >
        {src ? (
          <Image
            src={src}
            alt={name}
            width={pxSize[size]}
            height={pxSize[size]}
            className="object-cover w-full h-full"
            unoptimized
          />
        ) : (
          <span>{initial}</span>
        )}
      </div>
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 ${indicatorSize[size]} rounded-full ring-2 ring-surface-1 ${
            online ? "bg-green-500" : "bg-white/30"
          }`}
        />
      )}
    </div>
  );
}
