import { COACHES, PROGRAMS } from "../data/gym.js";

export const programById = (id) => PROGRAMS.find((p) => p.id === id);
export const coachById = (id) => COACHES.find((c) => c.id === id);
