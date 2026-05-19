import Link from "next/link";
import { ArrowRight, Gift, Calendar } from "lucide-react";

const events = [
  {
    icon: Calendar,
    tag: "진행 중",
    title: "5월 출석체크 이벤트",
    desc: "매일 출석하고 특별 보상을 받아가세요!",
    href: "/event",
    color: "from-green-900/30 to-transparent",
    tagColor: "text-green-400 bg-green-400/10",
  },
  {
    icon: Gift,
    tag: "신규",
    title: "친구 초대 보상 이벤트",
    desc: "친구를 초대하면 둘 다 특별 아이템을 드립니다.",
    href: "/event",
    color: "from-yellow-900/20 to-transparent",
    tagColor: "text-yellow-400 bg-yellow-400/10",
  },
];

export default function EventBanner() {
  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-xs text-white/40 uppercase tracking-widest">Events</span>
            <h2 className="mt-3 text-3xl font-bold">진행 중인 이벤트</h2>
          </div>
          <Link
            href="/event"
            className="hidden sm:flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors"
          >
            전체 보기 <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((ev) => (
            <Link
              key={ev.title}
              href={ev.href}
              className={`group relative p-6 bg-linear-to-br ${ev.color} bg-white/3 hover:bg-white/6 border border-white/8 rounded-2xl transition-all overflow-hidden`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/8 flex items-center justify-center shrink-0">
                  <ev.icon size={18} className="text-white/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ev.tagColor}`}>
                      {ev.tag}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1.5 group-hover:text-white transition-colors">
                    {ev.title}
                  </h3>
                  <p className="text-sm text-white/45">{ev.desc}</p>
                </div>
                <ArrowRight
                  size={16}
                  className="text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all shrink-0 mt-1"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
