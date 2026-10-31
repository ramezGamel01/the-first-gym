import { useI18n } from "../i18n/context.js";
import { FACILITIES, PROGRAMS } from "../data/gym.js";

// Two strips of caution tape crossing under the hero, with the gym's facts running along them.
// Decorative: everything on them is also said elsewhere on the page.
export default function Tapes() {
  const { t, pick } = useI18n();
  const facility = (id) => pick(FACILITIES.flatMap((g) => g.items).find((item) => item.id === id).label);
  const front = [t("fact.open"), facility("sauna"), t("fact.inbody"), t("fact.coaches"), facility("ac"), facility("parking")];
  const back = PROGRAMS.map((p) => pick(p.name));
  return (
    <div className="tapes" aria-hidden="true">
      <Tape items={back} className="tape--back" />
      <Tape items={front} className="tape--front" />
    </div>
  );
}

function Tape({ items, className }) {
  // Each half holds the list twice so it's always wider than the screen; the track slides by one half
  const half = [...items, ...items];
  return (
    <div className={`tape ${className}`} dir="ltr">
      <div className="tape__track">
        {[0, 1].map((copy) => (
          <span className="tape__group" key={copy}>
            {half.map((item, i) => (
              <span className="tape__item" key={i}>
                {item}
                <svg viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
