import { useI18n } from "../i18n/context.js";
import { GYM } from "../data/gym.js";
import { openState } from "../lib/hours.js";
import { useNow } from "../lib/useNow.js";
import { Tbc } from "./bits.jsx";

export function OpenStatus() {
  const { t, f } = useI18n();
  const state = openState(GYM.hours.week, useNow());
  let text;
  if (state.open) text = t("hours.openNow", { time: f.time(state.closes) });
  else if (state.today) text = t("hours.opensToday", { time: f.time(state.opens) });
  else text = t("hours.opensOn", { day: f.weekdayLong(state.day), time: f.time(state.opens) });
  return (
    <p className={`status ${state.open ? "status--open" : "status--closed"}`}>
      <span className="status__dot" aria-hidden="true" />
      {text}
    </p>
  );
}

export default function Hours() {
  const { t, f } = useI18n();
  const today = useNow().day;
  return (
    <div className="hours">
      <OpenStatus />
      <table className="hours__table">
        <caption className="sr-only">{t("visit.hours")}</caption>
        <tbody>
          {GYM.hours.week.map((slot, day) => (
            <tr key={day} className={day === today ? "is-today" : undefined} aria-current={day === today ? "date" : undefined}>
              <th scope="row">{f.weekdayLong(day)}</th>
              <td>
                <bdi>{f.time(slot.open)}</bdi> – <bdi>{f.time(slot.close)}</bdi>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!GYM.hours.confirmed && (
        <p className="hours__source">
          {t("visit.hoursSource")} <Tbc kind="confirm" />
        </p>
      )}
    </div>
  );
}
