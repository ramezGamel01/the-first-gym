import { useI18n } from "../i18n/context.js";
import { sessionsOn } from "../lib/schedule.js";
import { useNow } from "../lib/useNow.js";
import { Tbc } from "./bits.jsx";
import { coachById, programById } from "../lib/lookup.js";

export default function Timetable() {
  const { t, f, pick } = useI18n();
  const today = useNow().day;
  return (
    <ol className="week">
      {[0, 1, 2, 3, 4, 5, 6].map((day) => {
        const sessions = sessionsOn(day);
        const isToday = day === today;
        return (
          <li key={day} className={`week__day${isToday ? " is-today" : ""}`} aria-current={isToday ? "date" : undefined}>
            <h3 className="week__name">
              {f.weekdayLong(day)}
              {isToday && <span className="week__today">{t("timetable.today")}</span>}
            </h3>
            {sessions.length ? (
              <ul className="week__sessions">
                {sessions.map((s) => {
                  const program = programById(s.program);
                  const coach = coachById(program.coach);
                  return (
                    <li className="session" key={s.program}>
                      <span className="session__time">{s.time ? f.time(s.time) : <Tbc what={t("when.time")} />}</span>
                      <span className="session__name">{pick(program.name)}</span>
                      {coach && <span className="session__coach">{pick(coach.name)}</span>}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="week__empty">{t("timetable.empty")}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
