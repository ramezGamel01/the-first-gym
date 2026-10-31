import { Link } from "react-router";
import { MapPin, Navigation, Phone } from "lucide-react";
import { useI18n, usePageTitle } from "../i18n/context.js";
import { CHALLENGES, FACILITIES, GALLERY, GYM, PROGRAMS } from "../data/gym.js";
import { directionsHref, facebookHref, instagramHref, telHref, whatsappHref } from "../lib/contact.js";
import Hero from "../components/Hero.jsx";
import ProgramList from "../components/Programs.jsx";
import PlanRack from "../components/PlanRack.jsx";
import { OpenStatus } from "../components/Hours.jsx";
import { ExtLink, FacebookIcon, FacilityIcon, InstagramIcon, Tbc, WhatsAppIcon } from "../components/bits.jsx";

function Inside() {
  const { t, pick } = useI18n();
  return (
    <section className="section" aria-labelledby="inside-title">
      <div className="shell">
        <header className="section__head">
          <h2 id="inside-title" className="section__title">
            {t("inside.title")}
          </h2>
          <p className="section__lede">{t("inside.lede")}</p>
        </header>
        <div className="inside">
          {FACILITIES.map((group) => (
            <div className="inside__group" key={group.group}>
              <h3 className="inside__title">{t(`group.${group.group}`)}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item.id}>
                    <FacilityIcon name={item.icon} />
                    {pick(item.label)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const { t, pick } = useI18n();
  return (
    <section className="section section--tight" aria-labelledby="gallery-title">
      <div className="shell">
        <h2 id="gallery-title" className="section__title section__title--small">
          {t("gallery.title")}
        </h2>
        {GALLERY.length ? (
          <ul className="gallery">
            {GALLERY.map((photo) => (
              <li key={photo.src}>
                <img src={photo.src} width={photo.width} height={photo.height} alt={pick(photo.alt)} loading="lazy" decoding="async" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="gallery-empty">
            <p>
              <Tbc /> <span className="gallery-empty__text">{t("gallery.empty")}</span>
            </p>
            <ExtLink className="btn btn--ghost" href={instagramHref()}>
              <InstagramIcon />
              {t("gallery.instagram")}
            </ExtLink>
          </div>
        )}
      </div>
    </section>
  );
}

function Challenges() {
  const { t, f, pick } = useI18n();
  const top = Math.max(...CHALLENGES.map((c) => c.upTo ?? c.prizes?.[0]?.cash ?? 0));
  return (
    <section className="challenges" aria-labelledby="challenges-title">
      <div className="shell challenges__grid">
        <div>
          <h2 id="challenges-title" className="section__title">
            {t("challenges.title")}
          </h2>
          <p className="section__lede">{t("challenges.lede")}</p>
          <p className="challenges__prize">
            <span className="challenges__prize-label">{t("challenges.topPrize")}</span>
            {t("egp", { n: top })}
          </p>
        </div>
        <div>
          <h3 className="challenges__recent">{t("challenges.recent")}</h3>
          <ul className="challenges__list">
            {CHALLENGES.map((c) => (
              <li className="challenge" key={c.id}>
                <p className="challenge__date">
                  {c.time ? t("challenges.dateTime", { date: f.date(c.date), time: f.time(c.time) }) : f.date(c.date)}
                </p>
                <h4 className="challenge__name">{pick(c.name)}</h4>
                {c.prizes ? (
                  <ol className="challenge__prizes">
                    {c.prizes.map((p, i) => (
                      <li key={i}>
                        <span>{t(`place.${i + 1}`)}</span>
                        <span>
                          {[p.cash ? t("egp", { n: p.cash }) : null, p.months ? t("freeMonths", { n: p.months }) : null]
                            .filter(Boolean)
                            .join(" + ")}
                        </span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p>{t("challenges.upTo", { n: c.upTo })}</p>
                )}
              </li>
            ))}
          </ul>
          <ExtLink className="challenges__follow" href={facebookHref()}>
            <FacebookIcon />
            {t("challenges.next")}
          </ExtLink>
        </div>
      </div>
    </section>
  );
}

function VisitStrip() {
  const { t, f, pick } = useI18n();
  return (
    <section className="section" aria-labelledby="visit-strip-title">
      <div className="shell visit-strip">
        <div>
          <h2 id="visit-strip-title" className="section__title">
            {t("visit.teaserTitle")}
          </h2>
          <p className="visit-strip__address">
            <MapPin aria-hidden="true" />
            <span>
              {pick(GYM.landmark)}
              <br />
              {pick(GYM.address)}
            </span>
          </p>
          <div className="button-row">
            <ExtLink className="btn btn--volt" href={directionsHref()}>
              <Navigation aria-hidden="true" />
              {t("cta.directions")}
            </ExtLink>
            <a className="btn btn--ghost" href={telHref()}>
              <Phone aria-hidden="true" />
              <bdi className="nums">{f.phone(GYM.phone)}</bdi>
            </a>
            <ExtLink className="btn btn--ghost" href={whatsappHref()}>
              <WhatsAppIcon />
              {t("cta.whatsappShort")}
            </ExtLink>
          </div>
        </div>
        <div className="visit-strip__hours">
          <h3 className="visit-strip__label">{t("visit.hours")}</h3>
          <OpenStatus />
          <p className="visit-strip__days">{t("fact.open")}</p>
          {!GYM.hours.confirmed && <Tbc kind="confirm" what={t("visit.hours")} />}
          <Link className="text-link" to="/visit">
            {t("visit.title")}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { t } = useI18n();
  usePageTitle("home.title");
  return (
    <>
      <Hero />
      <Inside />
      <Gallery />
      <section className="section" aria-labelledby="classes-title">
        <div className="shell">
          <header className="section__head section__head--row">
            <h2 id="classes-title" className="section__title">
              {t("teaser.classesTitle")}
            </h2>
            <Link className="text-link" to="/classes">
              {t("teaser.classesLink")}
            </Link>
          </header>
          <ProgramList programs={PROGRAMS} compact />
        </div>
      </section>
      <Challenges />
      <section className="section" aria-labelledby="plans-title">
        <div className="shell plans-teaser">
          <div>
            <h2 id="plans-title" className="section__title">
              {t("teaser.plansTitle")}
            </h2>
            <p className="section__lede">{t("teaser.plansLede")}</p>
            <Link className="btn btn--volt" to="/membership#finder">
              {t("teaser.plansLink")}
            </Link>
          </div>
          <PlanRack decorative />
        </div>
      </section>
      <VisitStrip />
    </>
  );
}
