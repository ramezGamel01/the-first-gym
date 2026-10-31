import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { useI18n } from "../i18n/context.js";
import { usePrefs } from "../state/prefs-context.js";
import { GYM } from "../data/gym.js";
import { PHOTOS } from "../lib/photos.js";
import { whatsappHref } from "../lib/contact.js";
import Stencil from "./Stencil.jsx";
import PlateCard from "./PlateCard.jsx";
import { ExtLink, WhatsAppIcon } from "./bits.jsx";

// Full-bleed photo that flickers on like the gym's lights, the gym's tagline, and its name
// cut out of the band at the bottom so the photo shows through the letters.
export default function Hero() {
  const { t, pick } = useI18n();
  const { motion } = usePrefs();
  const hero = useRef(null);

  // The photo drifts slower than the page, so the stencil letters slide across it
  useEffect(() => {
    const el = hero.current;
    if (!motion || !el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      el.style.setProperty("--shift", `${(Math.min(window.scrollY, el.offsetHeight) * 0.28).toFixed(1)}px`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      el.style.removeProperty("--shift");
    };
  }, [motion]);

  const photo = PHOTOS.boxing;
  const lines = [t("hero.line1"), t("hero.line2"), t("hero.line3")];

  return (
    <section className="hero island" ref={hero} aria-labelledby="hero-title">
      <div className="hero__media">
        <img
          className="hero__photo"
          src={photo.src}
          width={photo.width}
          height={photo.height}
          alt={pick(photo.alt)}
          fetchPriority="high"
        />
        <span className="hero__lights" aria-hidden="true" />
      </div>

      <div className="shell hero__inner">
        <div className="hero__copy">
          <p className="hero__kicker">
            <span className="hero__dot" aria-hidden="true" />
            {t("hero.kicker")}
          </p>
          <h1 id="hero-title" className="hero__title" tabIndex={-1}>
            {lines.map((line, i) => (
              <span className="hero__line" key={i}>
                <span style={{ "--i": i }}>{line}</span>
              </span>
            ))}
          </h1>
          <p className="hero__lede">{t("hero.lede")}</p>
          <div className="hero__actions">
            <ExtLink className="btn btn--volt btn--lg" href={whatsappHref(GYM.offerWord)}>
              <WhatsAppIcon />
              {t("cta.whatsapp")}
            </ExtLink>
            <Link className="btn btn--ghost btn--lg" to="/classes">
              {t("hero.seeClasses")}
            </Link>
          </div>
          <p className="hero__note">{t("hero.note")}</p>
        </div>
        <PlateCard />
      </div>

      <Stencil text="THE FIRST" className="hero__stencil" />
    </section>
  );
}
