# 마리벨 디자인 시스템 (Master)

"밤의 숲속 작은 마을" — 차갑고 균질한 AI 다크 테마 대신, 따뜻하고 손맛 있는 게임 커뮤니티의 인상을 만든다.

## 원칙

1. **에메랄드는 유지한다.** 브랜드 컬러(`--color-brand: #10b981`)는 바꾸지 않는다. 대신 주변(배경·질감·형태)이 이를 받쳐준다.
2. **블록의 형태 언어.** 마인크래프트다움은 픽셀아트/블록에서 온다 — 과한 라운딩(rounded-xl 남발) 대신 rounded-sm~lg, 흐린 글로우 대신 아래로 딱 떨어지는 오프셋 섀도.
3. **눌리는 버튼.** 주요 버튼은 바닥 두께(offset shadow)가 있고 누르면 실제로 눌린다(translate-y + shadow 축소). 게임 버튼의 촉감.
4. **질감.** body::after 필름 그레인(opacity 0.035)으로 균질한 디지털 표면을 깬다.

## 토큰 (globals.css @theme)

| 토큰 | 값 | 용도 |
|---|---|---|
| surface-1~4 | `#0c110d` → `#1e261d` | 에메랄드 기가 도는 웜 다크 표면 |
| line | `rgba(214,245,222,0.09)` | 헤어라인 |
| brand / brand-strong | `#10b981` / `#34d399` | 메인 컬러 (변경 금지) |
| cash | `#fbbf24` | 캐시/가격 표시 |

배경 글로우: 에메랄드(좌상) + 호박색(우상). 파란 계열 금지 — 밤의 숲은 따뜻하다.

## 타이포그래피

- **디스플레이 (h1, h2, `.font-display`)**: Jua — 둥근 한글 디스플레이체, weight 400 고정
- **본문**: IBM Plex Sans KR (400/500/600/700), `--font-plex`
- **숫자/코드**: Geist Mono + tabular-nums (가격, 서버 주소)

## 컴포넌트 규칙

- **Button**: solid는 `shadow-[0_3px_0_0_#065f46]` + `active:translate-y-[2px]`. radius는 md(sm/md)·lg(lg).
- **Card**: rounded-lg + 오프셋 섀도 `0_2px_0`(default) / `0_4px_0`(elevated). blur 섀도 금지.
- **Badge**: rounded-sm (블록 느낌).
- 페이지별 예외는 `design-system/pages/<page>.md`에 기록하고, 없으면 이 문서를 따른다.

## 금지 (AI-generated 냄새)

- 균일한 rounded-xl + `bg-white/5` + blur 글로우 섀도 조합
- 파란/보라 그라데이션 배경
- 시스템 기본 폰트로 방치된 제목
- 이모지 아이콘 (Lucide SVG만 사용)
