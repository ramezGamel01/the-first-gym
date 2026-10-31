import { useId, useRef, useState } from "react";
import { useI18n } from "../i18n/context.js";
import { PROGRAMS } from "../data/gym.js";
import { CLASS_PHOTOS } from "../lib/photos.js";
import { coachById } from "../lib/lookup.js";
import { whatsappHref } from "../lib/contact.js";
import { AudienceTags, ExtLink, ProgramTimes, SampleTag, Tbc, WhatsAppIcon } from "./bits.jsx";

// Class names down one side (tabs); picking one brings up that class's photo with who it's for,
// the coach and the published times.
export default function ClassPicker() {
  const { t, f, pick, dir } = useI18n();
  const [active, setActive] = useState(PROGRAMS[0].id);
  const tabs = useRef([]);
  const base = useId().replace(/[^\w-]/g, "");
  const program = PROGRAMS.find((p) => p.id === active);
  const coach = coachById(program.coach);

  const select = (index) => {
    setActive(PROGRAMS[index].id);
    tabs.current[index]?.focus();
  };

  const onKeyDown = (e, index) => {
    const last = PROGRAMS.length - 1;
    const forward = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    const back = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
    let next = null;
    if (e.key === "ArrowDown" || e.key === forward) next = index === last ? 0 : index + 1;
    else if (e.key === "ArrowUp" || e.key === back) next = index === 0 ? last : index - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    select(next);
  };

  return (
    <div className="picker">
      <div className="picker__list" role="tablist" aria-label={t("picker.label")} aria-orientation="vertical">
        {PROGRAMS.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => (tabs.current[i] = el)}
            type="button"
            role="tab"
            id={`${base}-tab-${p.id}`}
            aria-selected={p.id === active}
            aria-controls={`${base}-panel`}
            tabIndex={p.id === active ? 0 : -1}
            className="picker__tab"
            onClick={() => setActive(p.id)}
            onMouseEnter={() => setActive(p.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            <span className="picker__name">{pick(p.name)}</span>
            <span className="picker__for">{f.list(p.for.map((a) => t(`aud.${a}`)))}</span>
          </button>
        ))}
      </div>

      <div className="picker__panel island" role="tabpanel" id={`${base}-panel`} aria-labelledby={`${base}-tab-${active}`}>
        {PROGRAMS.map((p) => (
          <img
            key={p.id}
            className={`picker__img graded${p.id === active ? " is-active" : ""}`}
            src={CLASS_PHOTOS[p.id]}
            width="1000"
            height="1250"
            alt=""
            loading="lazy"
            decoding="async"
          />
        ))}
        <SampleTag />
        <div className="picker__info">
          <h3 className="picker__title">{pick(program.name)}</h3>
          <AudienceTags audiences={program.for} />
          <p className="picker__about">{pick(program.about)}</p>
          {program.freeForMembers && <p className="picker__free">{t("classes.free")}</p>}
          <dl className="picker__meta">
            <div>
              <dt>{t("classes.coach")}</dt>
              <dd>{coach ? pick(coach.name) : <Tbc what={t("classes.coach")} />}</dd>
            </div>
            <div>
              <dt>{t("classes.when")}</dt>
              <dd>
                <ProgramTimes id={program.id} />
              </dd>
            </div>
          </dl>
          <ExtLink className="btn btn--volt" href={whatsappHref(t("picker.message", { name: pick(program.name) }))}>
            <WhatsAppIcon />
            {t("picker.ask")}
          </ExtLink>
        </div>
      </div>
    </div>
  );
}
