import { Shield, Users, Star, Zap } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "안정적인 서버",
    desc: "24시간 운영되는 고성능 서버로 언제든 쾌적한 플레이를 즐길 수 있습니다.",
  },
  {
    icon: Users,
    title: "활발한 커뮤니티",
    desc: "수천 명의 플레이어와 함께하는 따뜻한 커뮤니티가 여러분을 환영합니다.",
  },
  {
    icon: Star,
    title: "다양한 콘텐츠",
    desc: "생존, 미니게임, 건축 등 다양한 콘텐츠로 지루할 틈 없이 즐길 수 있습니다.",
  },
  {
    icon: Zap,
    title: "정기 업데이트",
    desc: "꾸준한 업데이트와 이벤트로 항상 새로운 재미를 제공합니다.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs text-white/40 uppercase tracking-widest">Why Maribel</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">마리벨이 특별한 이유</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-6 bg-white/3 hover:bg-white/6 border border-white/8 rounded-2xl transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-white/8 flex items-center justify-center mb-4 group-hover:bg-white/12 transition-colors">
                <f.icon size={20} className="text-white/70" />
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
