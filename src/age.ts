export interface AgeInfo {
  years: number;
  months: number;
  days: number;
}

const BIRTH_DATE = new Date(1993, 7, 16); // 16.08.1993
export const BIRTH_DATE_LABEL = "16.08.1993";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function getAgeInfo(now: Date = new Date()): AgeInfo {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let years = today.getFullYear() - BIRTH_DATE.getFullYear();
  let anniversary = new Date(today.getFullYear(), BIRTH_DATE.getMonth(), BIRTH_DATE.getDate());

  if (anniversary > today) {
    years--;
    anniversary = new Date(today.getFullYear() - 1, BIRTH_DATE.getMonth(), BIRTH_DATE.getDate());
  }

  const days = Math.round((today.getTime() - anniversary.getTime()) / MS_PER_DAY);

  let months = (today.getFullYear() - anniversary.getFullYear()) * 12 + (today.getMonth() - anniversary.getMonth());
  if (today.getDate() < anniversary.getDate()) {
    months--;
  }

  return { years, months, days };
}

export function formatVersion(info: AgeInfo): string {
  return `${info.years}.${info.months}.${info.days}`;
}
