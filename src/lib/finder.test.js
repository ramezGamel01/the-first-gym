import { describe, expect, it } from "vitest";
import { joinMessage, QUESTIONS, recommend } from "./finder.js";
import { makeFormat, makeTranslator, pickFrom } from "../i18n/translate.js";
import { PROGRAMS } from "../data/gym.js";

const i18n = (lang) => ({ t: makeTranslator(lang), f: makeFormat(lang), pick: pickFrom(lang) });

describe("plan finder", () => {
  it("never suggests a class the visitor can't join", () => {
    for (const goal of QUESTIONS[0].options) {
      for (const who of QUESTIONS[1].options) {
        const { classes } = recommend({ goal, who, days: 3, months: 3 });
        expect(classes.length).toBeGreaterThan(0);
        expect(classes.length).toBeLessThanOrEqual(3);
        for (const id of classes) expect(PROGRAMS.find((p) => p.id === id).for).toContain(who);
      }
    }
  });

  it("matches classes to the goal", () => {
    expect(recommend({ goal: "fight", who: "women", days: 3, months: 6 }).classes).toEqual(["kickboxing", "mma"]);
    expect(recommend({ goal: "fat", who: "women", days: 3, months: 6 }).classes).toEqual(["zumba", "kickboxing", "fitness"]);
    expect(recommend({ goal: "calm", who: "women", days: 2, months: 1 }).classes).toEqual(["yoga", "dance", "zumba"]);
  });

  it("falls back to Fitness when no class fits, and keeps kids off the machines and out of the sauna", () => {
    const men = recommend({ goal: "calm", who: "men", days: 2, months: 1 });
    expect(men.classes).toEqual(["fitness"]);
    expect(men.recover).toBe(true);

    const kids = recommend({ goal: "muscle", who: "kids", days: 2, months: 3 });
    expect(kids.floor).toBe(false);
    expect(kids.recover).toBe(false);
    expect(recommend({ goal: "muscle", who: "men", days: 4, months: 12 }).floor).toBe(true);
  });

  it("writes the WhatsApp message in the visitor's language, starting with START", () => {
    const answers = { goal: "fight", who: "women", days: 3, months: 6 };
    const result = recommend(answers);

    const en = joinMessage(answers, result, i18n("en"));
    expect(en.split("\n")[0]).toBe("START");
    expect(en).toContain("Goal: Learn to fight");
    expect(en).toContain("Plan: 6 months");
    expect(en).toContain("Interests: Kickboxing and MMA");

    const ar = joinMessage(answers, result, i18n("ar"));
    expect(ar.split("\n")[0]).toBe("START");
    expect(ar).toContain("الاشتراك: ٦ شهور");
    expect(ar).toContain("الاهتمامات: كيك بوكس وMMA");
  });
});
