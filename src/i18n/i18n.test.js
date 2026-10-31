import { describe, expect, it } from "vitest";
import { STRINGS } from "./strings.js";
import { makeFormat, makeTranslator, pickFrom } from "./translate.js";

describe("strings", () => {
  it("has every key in both languages", () => {
    const en = Object.keys(STRINGS.en).sort();
    const ar = Object.keys(STRINGS.ar).sort();
    expect(ar).toEqual(en);
  });

  it("uses the same placeholders in both languages", () => {
    const vars = (s) => (typeof s === "string" ? s : Object.values(s).join(" ")).match(/\{\w+\}/g)?.sort() ?? [];
    for (const key of Object.keys(STRINGS.en)) {
      const en = new Set(vars(STRINGS.en[key]));
      const ar = new Set(vars(STRINGS.ar[key]));
      // Arabic plural forms can spell out the number ("شهران"), so Arabic may use fewer placeholders
      for (const v of ar) expect(en.has(v), `${key} ${v}`).toBe(true);
    }
  });

  it("addresses visitors without singular commands in Arabic", () => {
    // Masculine or feminine singular imperatives that a visitor would read as aimed at one gender
    const singular = /(^|\s)(اشترك|احجز|ابدأ|تواصل|اتصل|ابعت|سجل|اختر|اعرف|أدخل|ادخل|اشتركي|احجزي|ابدئي|تواصلي|اتصلي|اختاري|أدخلي)(\s|$)/;
    for (const [key, value] of Object.entries(STRINGS.ar)) {
      const text = typeof value === "string" ? value : Object.values(value).join(" ");
      expect(singular.test(text), key).toBe(false);
    }
  });
});

describe("translator", () => {
  it("fills placeholders and writes numbers in Arabic-Indic digits in Arabic", () => {
    expect(makeTranslator("en")("finder.step", { n: 2, total: 4 })).toBe("Question 2 of 4");
    expect(makeTranslator("ar")("finder.step", { n: 2, total: 4 })).toBe("السؤال ٢ من ٤");
    expect(makeTranslator("ar")("egp", { n: 5000 })).toBe("٥٬٠٠٠ جنيه");
  });

  it("picks Arabic plural forms", () => {
    const t = makeTranslator("ar");
    expect(t("months", { n: 1 })).toBe("شهر");
    expect(t("months", { n: 2 })).toBe("شهران");
    expect(t("months", { n: 6 })).toBe("٦ شهور");
    expect(t("months", { n: 12 })).toBe("١٢ شهرًا");
    expect(makeTranslator("en")("months", { n: 1 })).toBe("1 month");
  });

  it("falls back to English, then to the key", () => {
    expect(makeTranslator("en")("no.such.key")).toBe("no.such.key");
  });
});

describe("format", () => {
  it("names the gym's days from Saturday", () => {
    expect(makeFormat("en").weekdayLong(0)).toBe("Saturday");
    expect(makeFormat("en").weekdayLong(6)).toBe("Friday");
    expect(makeFormat("ar").weekdayLong(0)).toBe("السبت");
  });

  it("formats times, phone numbers and lists per language", () => {
    const en = makeFormat("en");
    const ar = makeFormat("ar");
    expect(en.time("22:00")).toBe("10 pm");
    expect(en.time("07:30")).toBe("7:30 am");
    expect(ar.time("22:00")).toBe("١٠ م");
    expect(en.phone("01155017245")).toBe("011 5501 7245");
    expect(ar.phone("01155017245")).toBe("٠١١ ٥٥٠١ ٧٢٤٥");
    expect(en.list(["Sat", "Mon", "Wed"])).toBe("Sat, Mon and Wed");
    expect(ar.digits(2026)).toBe("٢٠٢٦");
  });

  it("picks the right language from a pair", () => {
    expect(pickFrom("ar")({ en: "Yoga", ar: "يوجا" })).toBe("يوجا");
    expect(pickFrom("en")("plain")).toBe("plain");
  });
});
