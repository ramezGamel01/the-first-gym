import { SCHEDULE } from "../data/gym.js";

// Sessions on one day of the gym's week (Saturday = 0): timed ones in order, untimed ones last
export function sessionsOn(day, schedule = SCHEDULE) {
  return schedule.filter((s) => s.days.includes(day)).sort((a, b) => (a.time ?? "99").localeCompare(b.time ?? "99"));
}
