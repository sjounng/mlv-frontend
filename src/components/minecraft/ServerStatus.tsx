export type ServerStatusType = "open" | "maintenance" | "closed";

export interface ServerStatusProps {
  status: ServerStatusType;
  showLabel?: boolean;
  className?: string;
}

const labels: Record<ServerStatusType, string> = {
  open: "서버 운영 중",
  maintenance: "점검 중",
  closed: "서버 닫힘",
};

const dotColors: Record<ServerStatusType, string> = {
  open: "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]",
  maintenance: "bg-red-400",
  closed: "bg-white/30",
};

const textColors: Record<ServerStatusType, string> = {
  open: "text-green-300",
  maintenance: "text-red-300",
  closed: "text-white/40",
};

export default function ServerStatus({
  status,
  showLabel = true,
  className = "",
}: ServerStatusProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`relative inline-block w-2 h-2 rounded-full ${dotColors[status]}`}>
        {status === "open" && (
          <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60" />
        )}
      </span>
      {showLabel && (
        <span className={`text-xs font-medium ${textColors[status]}`}>
          {labels[status]}
        </span>
      )}
    </span>
  );
}
