import { Shield, Users, Star, Zap } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "안정적인 서버",
    desc: "24시간 운영되는 고성능 서버로 언제든 쾌적한 플레이를 즐길 수 있습니다.",
    tint: "bg-emerald-500/12 text-emerald-300",
  },
  {
    icon: Users,
    title: "활발한 커뮤니티",
    desc: "수천 명의 플레이어와 함께하는 따뜻한 커뮤니티가 여러분을 환영합니다.",
    tint: "bg-blue-500/12 text-blue-300",
  },
  {
    icon: Star,
    title: "다양한 콘텐츠",
    desc: "생존, 미니게임, 건축 등 다양한 콘텐츠로 지루할 틈 없이 즐길 수 있습니다.",
    tint: "bg-amber-500/12 text-amber-300",
  },
  {
    icon: Zap,
    title: "정기 업데이트",
    desc: "꾸준한 업데이트와 이벤트로 항상 새로운 재미를 제공합니다.",
    tint: "bg-purple-500/12 text-purple-300",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 sm:py-24 bg-surface-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-xs text-emerald-300/70 uppercase tracking-widest font-medium">Why Maribel</span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold">마리벨이 특별한 이유</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-6 bg-white/[0.03] hover:bg-white/[0.06] border border-white/8 hover:border-white/12 rounded-2xl transition-colors"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105 ${f.tint}`}>
                <f.icon size={20} />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
