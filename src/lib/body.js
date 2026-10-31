// Body Lab maths: BMI (WHO adult bands), daily calories (Mifflin-St Jeor) and a protein range.

export const LIMITS = {
  age: { min: 18, max: 80 },
  height: { min: 120, max: 230 },
  weight: { min: 30, max: 250 },
};

// Accepts Arabic-Indic and Persian digits and the Arabic decimal comma, since phones type them
export function parseNumber(text) {
  const latin = String(text)
    .trim()
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٫,]/g, ".");
  if (!/^\d+(\.\d+)?$/.test(latin)) return null;
  return Number(latin);
}

export function bmi(weightKg, heightCm) {
  const m = heightCm / 100;
  return weightKg / (m * m);
}

export const BMI_BANDS = [
  { id: "under", min: 0, max: 18.5 },
  { id: "normal", min: 18.5, max: 25 },
  { id: "over", min: 25, max: 30 },
  { id: "obese", min: 30, max: Infinity },
];

export const bmiBand = (value) => BMI_BANDS.find((b) => value < b.max).id;

export function bmr({ sex, weight, height, age }) {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return sex === "female" ? base - 161 : base + 5;
}

export const ACTIVITY = { low: 1.2, light: 1.375, moderate: 1.55, high: 1.725, athlete: 1.9 };

// A 20% deficit to lose fat, a 10% surplus to build muscle
const GOAL_FACTOR = { lose: 0.8, maintain: 1, gain: 1.1 };

const round10 = (n) => Math.round(n / 10) * 10;

export function dailyCalories(input) {
  const maintain = bmr(input) * ACTIVITY[input.activity];
  return { maintain: round10(maintain), target: round10(maintain * GOAL_FACTOR[input.goal]) };
}

// 1.6–2.2 g per kg of body weight, the usual range for people who train
export const proteinRange = (weight) => [Math.round(weight * 1.6), Math.round(weight * 2.2)];

// Checks one field against its limits: null when it's empty, otherwise { value, ok }
export function check(field, text) {
  if (String(text).trim() === "") return null;
  const value = parseNumber(text);
  const { min, max } = LIMITS[field];
  return { value, ok: value !== null && value >= min && value <= max };
}
