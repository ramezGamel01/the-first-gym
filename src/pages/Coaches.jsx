import { Link } from "react-router";
import { useI18n, usePageTitle } from "../i18n/context.js";
import { COACHES, PROGRAMS } from "../data/gym.js";
import PageHead from "../components/PageHead.jsx";
import { COACH_PHOTOS, PAGE_PHOTOS } from "../lib/photos.js";
import { ProgramTimes, SampleTag, Tbc } from "../components/bits.jsx";

export default function Coaches() {
  const { t, pick } = useI18n();
  usePageTitle("coaches.title");

  return (
    <>
      <PageHead title={t("coaches.title")} lede={t("coaches.lede")} photo={PAGE_PHOTOS.coaches} />

      <section className="section" aria-label={t("coaches.title")}>
        <div className="shell">
          <ul className="coaches">
            {COACHES.map((coach) => {
              const name = pick(coach.name);
              const programs = PROGRAMS.filter((p) => p.coach === coach.id);
              const photo = coach.photo ?? COACH_PHOTOS[coach.id];
              return (
                <li className="coach" key={coach.id}>
                  <div className="coach__photo">
                    <img
                      className={coach.photo ? undefined : "graded"}
                      src={photo}
                      width="800"
                      height="1000"
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                    {!coach.photo && <SampleTag />}
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
