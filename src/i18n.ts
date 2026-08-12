import { BIRTH_DATE_LABEL, type AgeInfo } from "./age";

export type Lang = "en" | "ru" | "hy";
export const LANGS: Lang[] = ["en", "ru", "hy"];

export type StringKey = "greeting" | "dob" | "age" | "eventHeader" | "treats" | "allergen" | "helpHint";

interface LangStrings {
  greeting: string;
  dobLabel: string;
  ageLabel: string;
  yearWord: (n: number) => string;
  dayWord: (n: number) => string;
  eventHeader: string;
  treatsLine: string;
  allergenLine: string;
  helpHint: string;
}

function ruPlural(n: number, forms: [string, string, string]): string {
  const mod100 = Math.abs(n) % 100;
  const mod10 = mod100 % 10;
  if (mod100 > 10 && mod100 < 20) return forms[2];
  if (mod10 > 1 && mod10 < 5) return forms[1];
  if (mod10 === 1) return forms[0];
  return forms[2];
}

export const STRINGS: Record<Lang, LangStrings> = {
  en: {
    greeting: "Hi, my name is Pavel R.",
    dobLabel: "Initial commit",
    ageLabel: "AGE",
    yearWord: (n) => (n === 1 ? "year" : "years"),
    dayWord: (n) => (n === 1 ? "day" : "days"),
    eventHeader: "EVENT NOTICE",
    treatsLine: "Birthday cookies & candies are available in the kitchen.",
    allergenLine: "ALLERGEN NOTICE: may contain nuts, dairy, gluten.",
    helpHint: "Type 'help' to list available commands.",
  },
  ru: {
    greeting: "Привет, меня зовут Павел Р.",
    dobLabel: "Первый коммит",
    ageLabel: "Возраст",
    yearWord: (n) => ruPlural(n, ["год", "года", "лет"]),
    dayWord: (n) => ruPlural(n, ["день", "дня", "дней"]),
    eventHeader: "АНОНС СОБЫТИЯ",
    treatsLine: "Праздничное печенье и конфеты — на кухне.",
    allergenLine: "ВНИМАНИЕ, АЛЛЕРГЕНЫ: может содержать орехи, молочные продукты, глютен.",
    helpHint: "Введите 'help' для списка доступных команд.",
  },
  hy: {
    greeting: "Բարև, իմ անունը Պավել Ռ. է:",
    dobLabel: "Սկզբնական commit",
    ageLabel: "Տարիք",
    yearWord: () => "տարի",
    dayWord: () => "օր",
    eventHeader: "ՀԱՅՏԱՐԱՐՈՒԹՅՈՒՆ",
    treatsLine: "Ծննդյան թխվածքաբլիթներն ու կոնֆետները խոհանոցում են:",
    allergenLine: "ԱԼԵՐԳԵՆՆԵՐԻ ՄԱՍԻՆ. կարող է պարունակել ընկույզ, կաթնամթերք, գլյուտեն:",
    helpHint: "Մուտքագրեք 'help'՝ հասանելի հրամանների ցանկը տեսնելու համար:",
  },
};

export function formatAgeLine(lang: Lang, info: AgeInfo): string {
  const t = STRINGS[lang];
  return `${t.ageLabel}: ${info.years} ${t.yearWord(info.years)}, ${info.days} ${t.dayWord(info.days)}`;
}

export function textForKey(lang: Lang, key: StringKey, info: AgeInfo): string {
  const t = STRINGS[lang];
  switch (key) {
    case "greeting":
      return t.greeting;
    case "dob":
      return `${t.dobLabel}: ${BIRTH_DATE_LABEL}`;
    case "age":
      return formatAgeLine(lang, info);
    case "eventHeader":
      return `=== ${t.eventHeader} ===`;
    case "treats":
      return t.treatsLine;
    case "allergen":
      return t.allergenLine;
    case "helpHint":
      return t.helpHint;
    default:
      return "";
  }
}
