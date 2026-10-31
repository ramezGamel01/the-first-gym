// Translation and formatting helpers, shared by the provider and the tests
import { STRINGS } from "./strings.js";

export const localeOf = (lang) => (lang === "ar" ? "ar-EG" : "en-GB");

// Picks the current language from a { en, ar } pair; plain values pass through
export const pickFrom = (lang) => (value) =>
  value && typeof value === "object" && "en" in value ? value[lang] ?? value.en : value;

export function makeTranslator(lang) {
  const plural = new Intl.PluralRules(lang === "ar" ? "ar" : "en");
  const digits = new Intl.NumberFormat(localeOf(lang), { useGrouping: true });
  const dict = STRINGS[lang];
  return function t(key, vars = {}) {
    let entry = dict[key] ?? STRINGS.en[key] ?? key;
    if (typeof entry === "object") {
      const n = Number(vars.n ?? 0);
      entry = entry[plural.select(n)] ?? entry.other;
    }
    // Numbers come out in the page's own digits (Arabic-Indic in Arabic)
    return entry.replace(/\{(\w+)\}/g, (_, name) => {
      const v = vars[name];
      if (v === undefined) return `{${name}}`;
      return typeof v === "number" ? digits.format(v) : String(v);
    });
  };
}

export function makeFormat(lang) {
  const locale = localeOf(lang);
  const number = new Intl.NumberFormat(locale);
  const plain = new Intl.NumberFormat(locale, { useGrouping: false });
  const oneDecimal = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const weekdayShort = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const weekdayLong = new Intl.DateTimeFormat(locale, { weekday: "long" });
  const dayMonth = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" });
  const list = new Intl.ListFormat(locale, { style: "long", type: "conjunction" });
  // 3 January 2026 was a Saturday: a fixed week to name the gym's days (Saturday = 0)
  const weekdayDate = (i) => new Date(2026, 0, 3 + i);

  // Swaps each digit for the page's own, without thousands separators (years, phone numbers)
  const digits = (value) => String(value).replace(/\d/g, (c) => plain.format(Number(c)));

  return {
    number: (v) => number.format(v),
    decimal: (v) => oneDecimal.format(v),
    digits,
    weekdayShort: (i) => weekdayShort.format(weekdayDate(i)),
    weekdayLong: (i) => weekdayLong.format(weekdayDate(i)),
    list: (items) => list.format(items),
    date(iso) {
      const [y, m, d] = iso.split("-").map(Number);
      return dayMonth.format(new Date(y, m - 1, d));
    },
    // "22:00" → "10 pm", "07:30" → "7:30 am" (Arabic: "١٠ م"); Egypt reads the 12-hour clock
    time(hhmm) {
      const [h, m] = hhmm.split(":").map(Number);
      const opts = m ? { hour: "numeric", minute: "2-digit", hour12: true } : { hour: "numeric", hour12: true };
      return new Intl.DateTimeFormat(locale, opts).format(new Date(2026, 0, 1, h, m));
    },
    // 01155017245 → "011 5501 7245", in the page's digits
    phone(number) {
      return digits([number.slice(0, 3), number.slice(3, 7), number.slice(7)].join(" "));
    },
  };
}
