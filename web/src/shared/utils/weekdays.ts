export const weekdayOptions = [
  { value: "mon", label: "월" },
  { value: "tue", label: "화" },
  { value: "wed", label: "수" },
  { value: "thu", label: "목" },
  { value: "fri", label: "금" },
  { value: "sat", label: "토" },
  { value: "sun", label: "일" }
] as const;

export type WeekdayCode = (typeof weekdayOptions)[number]["value"];

const weekdayCodeSet = new Set<string>(weekdayOptions.map((day) => day.value));
const koreanWeekdayCodes: Array<{ pattern: RegExp; value: WeekdayCode }> = [
  { pattern: /월/, value: "mon" },
  { pattern: /화/, value: "tue" },
  { pattern: /수/, value: "wed" },
  { pattern: /목/, value: "thu" },
  { pattern: /금/, value: "fri" },
  { pattern: /토/, value: "sat" },
  { pattern: /일/, value: "sun" }
];

export function parseWorkDayCodes(value: string | null | undefined): WeekdayCode[] {
  if (!value) {
    return [];
  }

  const normalizedTokens = value
    .split(/[\s,|/]+/)
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  const tokenCodes = normalizedTokens.filter((token): token is WeekdayCode => weekdayCodeSet.has(token));

  if (tokenCodes.length > 0) {
    return weekdayOptions.map((day) => day.value).filter((day) => tokenCodes.includes(day));
  }

  const shouldParseKoreanWeekdays = /[월화수목금토]/.test(value) || /(^|[\s,|/])일($|[\s,|/])|일요일/.test(value);
  if (!shouldParseKoreanWeekdays) {
    return [];
  }

  const koreanCodes = koreanWeekdayCodes
    .filter((day) => day.pattern.test(value))
    .map((day) => day.value);
  return weekdayOptions.map((day) => day.value).filter((day) => koreanCodes.includes(day));
}

export function serializeWorkDayCodes(codes: WeekdayCode[]) {
  return weekdayOptions
    .map((day) => day.value)
    .filter((day) => codes.includes(day))
    .join(",");
}

export function toggleWorkDay(value: string, day: WeekdayCode) {
  const current = parseWorkDayCodes(value);
  const next = current.includes(day) ? current.filter((item) => item !== day) : [...current, day];
  return serializeWorkDayCodes(next);
}

export function formatWorkDays(value: string | null | undefined) {
  const codes = parseWorkDayCodes(value);

  if (codes.length > 0) {
    return weekdayOptions
      .filter((day) => codes.includes(day.value))
      .map((day) => day.label)
      .join(" · ");
  }

  return value?.trim() || "협의";
}
