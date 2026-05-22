export const siteName = "GymIn";

export const defaultSiteOrigin = "https://gymin.co.kr";

export const defaultSeoTitle = "GymIn | 피트니스 구인구직 플랫폼";

export const defaultSeoDescription =
  "헬스장, 필라테스 스튜디오, 요가원, 크로스핏 박스와 강사·트레이너를 연결하는 피트니스 구인구직 플랫폼입니다.";

export const defaultSeoKeywords = [
  "피트니스 구인구직",
  "헬스장 구인",
  "필라테스 강사 구인",
  "요가 강사 구인",
  "크로스핏 코치 구인",
  "트레이너 구인",
  "운동 지도자 채용"
];

export function getSiteOrigin() {
  const rawOrigin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.SITE_DOMAIN ? `https://${process.env.SITE_DOMAIN}` : defaultSiteOrigin);

  return normalizeOrigin(rawOrigin);
}

export function getCanonicalUrl(path = "/") {
  return new URL(path, `${getSiteOrigin()}/`).toString();
}

export function truncateMetaDescription(value: string | null | undefined, fallback = defaultSeoDescription, maxLength = 155) {
  const normalized = (value || fallback).replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trim()}…`;
}

function normalizeOrigin(value: string) {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return defaultSiteOrigin;
  }
}
