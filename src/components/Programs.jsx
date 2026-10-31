import { Link } from "react-router";
import { useI18n } from "../i18n/context.js";
import { AudienceTags, ProgramTimes, Tbc } from "./bits.jsx";
import { coachById } from "../lib/lookup.js";

// One row per class: name and who it's for, what it is, then coach and times.
// `compact` drops the description for the home page preview.
export default function ProgramList({ programs, compact = false }) {
  const { t, pick } = useI18n();
  return (
    <ul className={`programs${compact ? " programs--compact" : ""}`}>
      {programs.map((p) => {
        const coach = coachById(p.coach);
        return (
          <li className="program" key={p.id}>
            <div className="program__head">
              <h3 className="program__name">{pick(p.name)}</h3>
              <AudienceTags audiences={p.for} />
            </div>
            {!compact && (
              <div className="program__body">
                <p>{pick(p.about)}</p>
                {p.freeForMembers && <p className="program__free">{t("classes.free")}</p>}
              </div>
            )}
            <dl className="program__meta">
              {!compact && (
                <div>
                  <dt>{t("classes.coach")}</dt>
                  <dd>{coach ? <Link to="/coaches">{pick(coach.name)}</Link> : <Tbc what={t("classes.coach")} />}</dd>
                </div>
              )}
              <div>
                <dt>{t("classes.when")}</dt>
                <dd>
                  <ProgramTimes id={p.id} />
                </dd>
              </div>
            </dl>
          </li>
        );
      })}
    </ul>
  );
}
