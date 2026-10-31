// Opening-hours logic in Cairo time, whatever the visitor's own time zone.

const WEEKDAYS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

// Day of the gym's week (Saturday = 0) and minutes since midnight, in Cairo
export function cairoNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Cairo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type).value;
  return { day: WEEKDAYS.indexOf(get("weekday")), minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

// A close time earlier than the open time runs past midnight
const overnight = (slot) => toMinutes(slot.close) <= toMinutes(slot.open);

// { open: true, closes } or { open: false, opens, day, today }
export function openState(week, { day, minutes }) {
  const yesterday = week[(day + 6) % 7];
  if (yesterday && overnight(yesterday) && minutes < toMinutes(yesterday.close)) {
    return { open: true, closes: yesterday.close };
  }
  const today = week[day];
  if (today) {
    const start = toMinutes(today.open);
    const end = toMinutes(today.close);
    if (minutes >= start && (overnight(today) || minutes < end)) return { open: true, closes: today.close };
    if (minutes < start) return { open: false, opens: today.open, day, today: true };
  }
  for (let i = 1; i <= 7; i++) {
    const next = (day + i) % 7;
    if (week[next]) return { open: false, opens: week[next].open, day: next, today: false };
  }
  return { open: false };
}
