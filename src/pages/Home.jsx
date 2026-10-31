import { Link } from "react-router";
import { MapPin, Navigation, Phone, ScanLine } from "lucide-react";
import { useI18n, usePageTitle } from "../i18n/context.js";
import { CHALLENGES, FACILITIES, GALLERY, GYM } from "../data/gym.js";
import { FACILITY_PHOTOS, PHOTOS } from "../lib/photos.js";
import { directionsHref, facebookHref, telHref, whatsappHref } from "../lib/contact.js";
import Hero from "../components/Hero.jsx";
import Tapes from "../components/Tapes.jsx";
import ClassPicker from "../components/ClassPicker.jsx";
import PlanCards from "../components/PlanCards.jsx";
import { OpenStatus } from "../components/Hours.jsx";
import { ExtLink, FacebookIcon, FacilityIcon, SampleTag, Tbc, WhatsAppIcon } from "../components/bits.jsx";

function Facilities() {
  const { t, pick } = useI18n();
  return (
    <section className="section" aria-labelledby="inside-title">
      <div className="shell">
        <div className="statement">
          <h2 id="inside-title" className="section__title section__title--huge">
            {t("inside.title")}
          </h2>
          <blockquote className="statement__quote">
            <p>“{t("quote.text")}”</p>
            <footer>
              <bdi>{t("quote.by")}</bdi>
            </footer>
          </blockquote>
        </div>
        <div className="facility-rows">
          {FACILITIES.map((group) => (
            <div className="facility-row" key={group.group}>
              <div className="facility-row__side">
                <h3 className="facility-row__title">{t(`group.${group.group}`)}</h3>
                <figure className="facility-row__photo">
                  <img
                    className="graded"
                    src={FACILITY_PHOTOS[group.group]}
                    width="900"
                    height="640"
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  <SampleTag />
                </figure>
              </div>
              <ul className="facility-row__items">
                {group.items.map((item) => (
                  <li className="facility" key={item.id}>
                    <FacilityIcon name={item.icon} />
                    <span>{pick(item.label)}</span>
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

// Shows the gym's own photos once they're added to GALLERY in src/data/gym.js
function Gallery() {
  const { t, pick } = useI18n();
  if (!GALLERY.length) return null;
  return (
    <section className="section section--flush-top" aria-labelledby="gallery-title">
      <div className="shell">
        <h2 id="gallery-title" className="section__title">
          {t("gallery.title")}
        </h2>
        <ul className="gallery">
          {GALLERY.map((photo) => (
            <li key={photo.src}>
              <img src={photo.src} width={photo.width} height={photo.height} alt={pick(photo.alt)} loading="lazy" decoding="async" />
            </li>
          ))}
        </ul>
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
          <ul>
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

function LabTeaser() {
  const { t } = useI18n();
  return (
    <section className="section section--flush-top" aria-labelledby="lab-teaser-title">
      <div className="shell lab-teaser">
        <ScanLine className="lab-teaser__icon" aria-hidden="true" strokeWidth={1.5} />
        <div>
          <h2 id="lab-teaser-title" className="lab-teaser__title">
            {t("labTeaser.title")}
          </h2>
          <p className="lab-teaser__text">{t("labTeaser.text")}</p>
        </div>
        <div className="button-row">
          <Link className="btn btn--volt" to="/body-lab">
            {t("labTeaser.open")}
          </Link>
          <ExtLink className="btn btn--ghost" href={whatsappHref(t("msg.inbody"))}>
            {t("lab.inbody")}
          </ExtLink>
        </div>
      </div>
    </section>
  );
}

// Their own line from Facebook: "still saying I'll start tomorrow? Tomorrow is here."
function Tomorrow() {
  const { t } = useI18n();
  const photo = PHOTOS.weights;
  return (
    <section className="tomorrow island" aria-labelledby="tomorrow-title">
      <div className="tomorrow__media" aria-hidden="true">
        <img src={photo.src} width={photo.width} height={photo.height} alt="" loading="lazy" decoding="async" />
      </div>
      <div className="shell tomorrow__inner">
        <p className="tomorrow__ask">
          {t("tomorrow.before")} <s>{t("tomorrow.word")}</s>
          {t("tomorrow.after")}
        </p>
        <h2 id="tomorrow-title" className="tomorrow__title">
          {t("tomorrow.title")}
        </h2>
        <ExtLink className="btn btn--volt btn--lg" href={whatsappHref(GYM.offerWord)}>
          <WhatsAppIcon />
          {t("cta.whatsapp")}
        </ExtLink>
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
      <Tapes />
      <Facilities />
      <Gallery />
      <section className="section section--flush-top" aria-labelledby="classes-title">
        <div className="shell">
          <header className="section__head section__head--row">
            <h2 id="classes-title" className="section__title">
              {t("teaser.classesTitle")}
            </h2>
            <Link className="text-link" to="/classes">
              {t("teaser.classesLink")}
            </Link>
          </header>
          <ClassPicker />
        </div>
      </section>
      <Challenges />
      <section className="section" aria-labelledby="plans-title">
        <div className="shell">
          <header className="section__head section__head--row">
            <div className="section__head-text">
              <h2 id="plans-title" className="section__title">
                {t("teaser.plansTitle")}
              </h2>
              <p className="section__lede">{t("teaser.plansLede")}</p>
            </div>
            <Link className="btn btn--volt" to="/membership#finder">
              {t("teaser.plansLink")}
            </Link>
          </header>
          <PlanCards />
        </div>
      </section>
      <LabTeaser />
      <Tomorrow />
      <VisitStrip />
    </>
  );
}
