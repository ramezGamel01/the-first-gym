import { useState } from "react";
import { useI18n, usePageTitle } from "../i18n/context.js";
import { AUDIENCES, PROGRAMS } from "../data/gym.js";
import PageHead from "../components/PageHead.jsx";
import { PAGE_PHOTOS } from "../lib/photos.js";
import ProgramList from "../components/Programs.jsx";
import Timetable from "../components/Timetable.jsx";

export default function Classes() {
  const { t } = useI18n();
  usePageTitle("classes.title");
  const [audience, setAudience] = useState("all");
  const shown = audience === "all" ? PROGRAMS : PROGRAMS.filter((p) => p.for.includes(audience));

  return (
    <>
      <PageHead title={t("classes.title")} lede={t("classes.lede")} photo={PAGE_PHOTOS.classes} />

      <section className="section" aria-label={t("nav.classes")}>
        <div className="shell">
          <div className="filter" role="group" aria-labelledby="filter-label">
            <span className="filter__label" id="filter-label">
              {t("classes.filter")}
            </span>
            {["all", ...AUDIENCES].map((a) => (
              <button
                type="button"
                key={a}
                className="chip"
                aria-pressed={audience === a}
                onClick={() => setAudience(a)}
              >
                {t(`aud.${a}`)}
              </button>
            ))}
          </div>
          {shown.length ? <ProgramList programs={shown} /> : <p>{t("classes.none")}</p>}
        </div>
      </section>

      <section className="section section--flush-top" aria-labelledby="week-title">
        <div className="shell">
          <header className="section__head">
            <h2 id="week-title" className="section__title">
              {t("timetable.title")}
            </h2>
            <p className="section__lede">{t("timetable.lede")}</p>
          </header>
          <Timetable />
        </div>
      </section>
    </>
  );
}
