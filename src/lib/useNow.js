import { useEffect, useState } from "react";
import { cairoNow } from "./hours.js";

// Cairo day and time, refreshed every minute so "open now" and "today" stay right
export function useNow() {
  const [now, setNow] = useState(() => cairoNow());
  useEffect(() => {
    const id = setInterval(() => setNow(cairoNow()), 60_000);
    return () => clearInterval(id);
  }, []);
  return now;
}
