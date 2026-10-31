import { describe, expect, it } from "vitest";
import { bmi, bmiBand, bmr, check, dailyCalories, parseNumber, proteinRange } from "./body.js";

describe("parseNumber", () => {
  it("reads Latin, Arabic-Indic and Persian digits", () => {
    expect(parseNumber("72.5")).toBe(72.5);
    expect(parseNumber("١٧٥")).toBe(175);
    expect(parseNumber("۸۰")).toBe(80);
    expect(parseNumber("٧٢٫٥")).toBe(72.5);
    expect(parseNumber(" 64,5 ")).toBe(64.5);
  });

  it("rejects anything that isn't a plain number", () => {
    expect(parseNumber("")).toBeNull();
    expect(parseNumber("12kg")).toBeNull();
    expect(parseNumber("-4")).toBeNull();
    expect(parseNumber("1.2.3")).toBeNull();
  });
});

describe("BMI", () => {
  it("divides weight by height squared", () => {
    expect(bmi(70, 175)).toBeCloseTo(22.86, 2);
  });

  it("uses the WHO adult bands, with each cut-off starting the next band", () => {
    expect(bmiBand(18.4)).toBe("under");
    expect(bmiBand(18.5)).toBe("normal");
    expect(bmiBand(24.9)).toBe("normal");
    expect(bmiBand(25)).toBe("over");
    expect(bmiBand(30)).toBe("obese");
  });
});

describe("daily calories", () => {
  it("follows Mifflin-St Jeor", () => {
    expect(bmr({ sex: "male", weight: 80, height: 180, age: 30 })).toBe(1780);
    expect(bmr({ sex: "female", weight: 60, height: 165, age: 25 })).toBeCloseTo(1345.25, 2);
  });

  it("scales by activity and goal, rounded to 10 kcal", () => {
    const base = { sex: "male", weight: 80, height: 180, age: 30, activity: "moderate" };
    expect(dailyCalories({ ...base, goal: "maintain" })).toEqual({ maintain: 2760, target: 2760 });
    expect(dailyCalories({ ...base, goal: "lose" }).target).toBe(2210);
    expect(dailyCalories({ ...base, goal: "gain" }).target).toBe(3030);
  });

  it("gives 1.6 to 2.2 g of protein per kg", () => {
    expect(proteinRange(75)).toEqual([120, 165]);
  });
});

describe("check", () => {
  it("is null for an empty field and flags values outside the limits", () => {
    expect(check("age", "")).toBeNull();
    expect(check("age", "30")).toEqual({ value: 30, ok: true });
    expect(check("age", "15")).toEqual({ value: 15, ok: false });
    expect(check("height", "٣٠٠")).toEqual({ value: 300, ok: false });
    expect(check("weight", "abc")).toEqual({ value: null, ok: false });
  });
});
