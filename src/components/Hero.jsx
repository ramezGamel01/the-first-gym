import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { MapPin, ScanLine, UserCheck, CalendarDays } from "lucide-react";
import { useI18n } from "../i18n/context.js";
import { usePrefs } from "../state/prefs-context.js";
import { GYM } from "../data/gym.js";
import { whatsappHref } from "../lib/contact.js";
import { hasWebGL, SceneBoundary, useOnScreen } from "../three/SceneGuard.jsx";
import PlateMark from "./PlateMark.jsx";
import { ExtLink, WhatsAppIcon } from "./bits.jsx";

// three.js only loads with the hero, in its own chunk
const PlateScene = lazy(() => import("../three/PlateScene.jsx"));

export default function Hero() {
  const { t, dir } = useI18n();
  const { motion, theme } = usePrefs();
  const stage = useRef(null);
  const onScreen = useOnScreen(stage);
  const [webgl] = useState(hasWebGL);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  // Mount the scene the first time the stage scrolls into view, then keep it
  useEffect(() => {
    if (onScreen && webgl) setMounted(true);
  }, [onScreen, webgl]);

  const lines = [t("hero.line1"), t("hero.line2"), t("hero.line3")];

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="shell hero__grid">
        <div className="hero__copy">
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

        {/* Holds the plate's place in the layout; the flat drawing shows until the 3D plate is ready */}
        <div className="hero__stage" ref={stage} aria-hidden="true">
          <PlateMark className={`hero__poster${ready ? " is-hidden" : ""}`} />
        </div>
      </div>

      {/* The canvas spans the whole hero so the plate can roll in from the edge of the screen */}
      {mounted && (
        <div className="hero__scene" aria-hidden="true">
          <SceneBoundary fallback={null}>
            <Suspense fallback={null}>
              <PlateScene
                stage={stage}
                motion={motion}
                active={onScreen}
                dir={dir}
                theme={theme}
                onReady={() => setReady(true)}
              />
            </Suspense>
          </SceneBoundary>
        </div>
      )}

      <div className="facts">
        <ul className="shell facts__list">
          <li>
            <CalendarDays aria-hidden="true" strokeWidth={1.75} />
            {t("fact.open")}
          </li>
          <li>
            <MapPin aria-hidden="true" strokeWidth={1.75} />
            {t("fact.where")}
          </li>
          <li>
            <UserCheck aria-hidden="true" strokeWidth={1.75} />
            {t("fact.coaches")}
          </li>
          <li>
            <ScanLine aria-hidden="true" strokeWidth={1.75} />
            {t("fact.inbody")}
          </li>
        </ul>
      </div>
    </section>
  );
}
