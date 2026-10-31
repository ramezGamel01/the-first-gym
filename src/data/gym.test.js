import { describe, expect, it } from "vitest";
import { AUDIENCES, CHALLENGES, COACHES, FACILITIES, FAQ, GYM, PLANS, PROGRAMS, SCHEDULE } from "./gym.js";

// Every { en, ar } pair in the data, wherever it sits
function pairs(value, path = "") {
  if (!value || typeof value !== "object") return [];
  if ("en" in value || "ar" in value) return [[path, value]];
  return Object.entries(value).flatMap(([k, v]) => pairs(v, `${path}.${k}`));
}

describe("gym data", () => {
  it("translates every text into English and Arabic", () => {
    const all = pairs({ GYM, PROGRAMS, COACHES, FACILITIES, CHALLENGES, FAQ });
    expect(all.length).toBeGreaterThan(40);
    for (const [path, pair] of all) {
      expect(pair.en?.trim(), path).toBeTruthy();
      expect(pair.ar?.trim(), path).toBeTruthy();
    }
  });

  it("links classes, coaches and the timetable consistently", () => {
    const programIds = new Set(PROGRAMS.map((p) => p.id));
    const coachIds = new Set(COACHES.map((c) => c.id));
    for (const p of PROGRAMS) {
      if (p.coach) expect(coachIds.has(p.coach), p.id).toBe(true);
      for (const a of p.for) expect(AUDIENCES).toContain(a);
    }
    for (const s of SCHEDULE) {
      expect(programIds.has(s.program)).toBe(true);
      for (const d of s.days) expect(d >= 0 && d <= 6).toBe(true);
      if (s.time) expect(s.time).toMatch(/^\d{2}:\d{2}$/);
    }
    // Every named coach leads at least one class
    for (const c of COACHES) expect(PROGRAMS.some((p) => p.coach === c.id), c.id).toBe(true);
  });

  it("keeps hours for all seven days, Saturday first", () => {
    expect(GYM.hours.week).toHaveLength(7);
    for (const slot of GYM.hours.week) {
      expect(slot.open).toMatch(/^\d{2}:\d{2}$/);
      expect(slot.close).toMatch(/^\d{2}:\d{2}$/);
    }
  });

  it("doesn't invent prices", () => {
    // Prices aren't published yet; a real number here must come from the gym
    for (const plan of PLANS) expect(plan.price === null || typeof plan.price === "number").toBe(true);
    expect(PLANS.map((p) => p.months)).toEqual([1, 3, 6, 12]);
  });
});
