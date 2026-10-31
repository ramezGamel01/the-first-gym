import { Link } from "react-router";
import { useI18n, usePageTitle } from "../i18n/context.js";
import { COACHES, PROGRAMS } from "../data/gym.js";
import { ProgramTimes, Tbc } from "../components/bits.jsx";

// First letter of the coach's name without the "Capt." title, for the photo placeholder
const initial = (name) => name.replace(/^(Capt\.|كابتن)\s*/, "").charAt(0);

export default function Coaches() {
  const { t, pick } = useI18n();
  usePageTitle("coaches.title");

  return (
    <>
      <header className="page-head">
        <div className="shell">
          <h1 tabIndex={-1}>{t("coaches.title")}</h1>
          <p>{t("coaches.lede")}</p>
        </div>
      </header>

      <section className="section" aria-label={t("coaches.title")}>
        <div className="shell">
          <ul className="coaches">
            {COACHES.map((coach) => {
              const name = pick(coach.name);
              const programs = PROGRAMS.filter((p) => p.coach === coach.id);
              return (
                <li className="coach" key={coach.id}>
                  <div className="coach__photo">
                    {coach.photo ? (
                      <img src={coach.photo} alt={name} loading="lazy" decoding="async" />
                    ) : (
                      <>
                        <span className="coach__initial" aria-hidden="true">
                          {initial(name)}
                        </span>
                        <Tbc what={t("coaches.photoTbc")} />
                      </>
                    )}
                  </div>
                  <div className="coach__info">
                    <h2 className="coach__name">{name}</h2>
                    <h3 className="coach__label">{t("coaches.classes")}</h3>
                    <ul className="coach__classes">
                      {programs.map((p) => (
                        <li key={p.id}>
                          <Link to="/classes">{pick(p.name)}</Link>
                          <ProgramTimes id={p.id} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
            <li className="coach coach--more">
              <div className="coach__photo coach__photo--empty" aria-hidden="true" />
              <div className="coach__info">
                <h2 className="coach__name">{t("coaches.more")}</h2>
                <Tbc />
              </div>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
