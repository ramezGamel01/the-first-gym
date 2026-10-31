import { describe, expect, it } from "vitest";
import { cairoNow, openState } from "./hours.js";
import { GYM } from "../data/gym.js";

const week = GYM.hours.week; // Sat–Thu 07:30–03:00, Fri 15:00–01:00
const at = (day, hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return { day, minutes: h * 60 + m };
};

describe("cairoNow", () => {
  it("reads the day and time in Cairo, whatever the visitor's time zone", () => {
    // Saturday 3 Jan 2026, 20:15 UTC = 22:15 in Cairo (UTC+2 in winter)
    expect(cairoNow(new Date(Date.UTC(2026, 0, 3, 20, 15)))).toEqual({ day: 0, minutes: 22 * 60 + 15 });
    // Thursday 1 Jan 2026, 23:30 UTC is already Friday 01:30 in Cairo
    expect(cairoNow(new Date(Date.UTC(2026, 0, 1, 23, 30)))).toEqual({ day: 6, minutes: 90 });
  });
});

describe("openState", () => {
  it("is open during the day's hours", () => {
    expect(openState(week, at(2, "10:00"))).toEqual({ open: true, closes: "03:00" });
  });

  it("counts the hours after midnight as part of the day before", () => {
    // Sunday 02:00 is still Saturday's session
    expect(openState(week, at(1, "02:00"))).toEqual({ open: true, closes: "03:00" });
    // Saturday 00:30 is still Friday's session, which closes at 01:00
    expect(openState(week, at(0, "00:30"))).toEqual({ open: true, closes: "01:00" });
  });

  it("says when it opens next", () => {
    expect(openState(week, at(0, "05:00"))).toEqual({ open: false, opens: "07:30", day: 0, today: true });
    expect(openState(week, at(6, "04:00"))).toEqual({ open: false, opens: "15:00", day: 6, today: true });
    // Friday's late session ends at 01:00; at 02:00 on Saturday it opens again at 07:30
    expect(openState(week, at(0, "02:00"))).toEqual({ open: false, opens: "07:30", day: 0, today: true });
  });

  it("looks ahead to the next open day", () => {
    const fridaysOff = week.map((slot, i) => (i === 6 ? null : slot));
    expect(openState(fridaysOff, at(6, "04:00"))).toEqual({ open: false, opens: "07:30", day: 0, today: false });
  });
});
