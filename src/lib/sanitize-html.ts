// 관리자가 작성한 이벤트 본문(리치 HTML)을 렌더 전에 정화한다.
//  - 허용 태그/속성 화이트리스트, on* 이벤트 핸들러 제거, javascript: URL 차단
//  - iframe 은 YouTube 임베드 도메인만 허용 (영상 삽입)
// 관리자(OPERATOR 이상)만 작성 가능한 콘텐츠지만, 계정 탈취 대비 최소 방어선.

const ALLOWED_TAGS = new Set([
  "P", "BR", "B", "STRONG", "I", "EM", "U", "SPAN", "DIV",
  "H1", "H2", "H3", "H4", "UL", "OL", "LI", "BLOCKQUOTE",
  "A", "IMG", "VIDEO", "SOURCE", "IFRAME", "FIGURE",
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  A: new Set(["href", "target", "rel"]),
  IMG: new Set(["src", "alt"]),
  VIDEO: new Set(["src", "controls", "poster", "width", "height"]),
  SOURCE: new Set(["src", "type"]),
  IFRAME: new Set(["src", "allow", "allowfullscreen", "frameborder", "width", "height"]),
};

const IFRAME_ALLOWED_HOSTS = [
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "player.vimeo.com",
];

function isSafeUrl(value: string, allowRelative = true): boolean {
  const v = value.trim();
  if (allowRelative && (v.startsWith("/") || v.startsWith("#"))) return true;
  try {
    const url = new URL(v, "https://example.invalid");
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function iframeSrcAllowed(value: string): boolean {
  try {
    const url = new URL(value);
    return (url.protocol === "https:") && IFRAME_ALLOWED_HOSTS.includes(url.hostname);
  } catch {
    return false;
  }
}

function clean(node: Element) {
  // 자식부터 재귀 (라이브 컬렉션 대비 배열 스냅샷)
  Array.from(node.children).forEach((child) => clean(child));

  if (!ALLOWED_TAGS.has(node.tagName)) {
    node.replaceWith(...Array.from(node.childNodes));
    return;
  }

  const allowed = ALLOWED_ATTRS[node.tagName] ?? new Set<string>();
  for (const attr of Array.from(node.attributes)) {
    const name = attr.name.toLowerCase();
    if (name.startsWith("on") || !allowed.has(name)) {
      node.removeAttribute(attr.name);
      continue;
    }
    if ((name === "href" || name === "src") && node.tagName !== "IFRAME") {
      if (!isSafeUrl(attr.value)) node.removeAttribute(attr.name);
    }
  }

  if (node.tagName === "IFRAME") {
    const src = node.getAttribute("src") ?? "";
    if (!iframeSrcAllowed(src)) {
      node.remove();
      return;
    }
  }
  if (node.tagName === "A") {
    // 새 탭 링크의 보안 속성 보정
    if (node.getAttribute("target") === "_blank") node.setAttribute("rel", "noopener noreferrer");
  }
}

export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined" || !html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  Array.from(doc.body.children).forEach((child) => clean(child));
  return doc.body.innerHTML;
}
