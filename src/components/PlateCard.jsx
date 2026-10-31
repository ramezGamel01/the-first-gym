import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "../i18n/context.js";
import { usePrefs } from "../state/prefs-context.js";
import { GYM } from "../data/gym.js";
import { whatsappHref } from "../lib/contact.js";
import { hasWebGL, SceneBoundary, useOnScreen } from "../three/SceneGuard.jsx";
import PlateMark from "./PlateMark.jsx";
import { ExtLink } from "./bits.jsx";

// three.js only loads with this card, in its own chunk
const PlateScene = lazy(() => import("../three/PlateScene.jsx"));

// The glass card in the hero: the gym's plate in 3D above the START offer.
// Hidden on phones, and the card is never on screen there, so the 3D never loads.
export default function PlateCard() {
  const { t, dir } = useI18n();
  const { motion } = usePrefs();
  const stage = useRef(null);
  const onScreen = useOnScreen(stage);
  const [webgl] = useState(hasWebGL);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (onScreen && webgl) setMounted(true);
  }, [onScreen, webgl]);

  return (
    <ExtLink className="plate-card" href={whatsappHref(GYM.offerWord)}>
      <span className="plate-card__stage" ref={stage} aria-hidden="true">
        <PlateMark className={`plate-card__poster${ready ? " is-hidden" : ""}`} />
        {mounted && (
          <SceneBoundary fallback={null}>
            <Suspense fallback={null}>
              <PlateScene motion={motion} active={onScreen} dir={dir} onReady={() => setReady(true)} />
            </Suspense>
          </SceneBoundary>
        )}
      </span>
      <span className="plate-card__title">
        {t("card.title")}
        <ArrowUpRight className="plate-card__arrow" aria-hidden="true" />
      </span>
      <span className="plate-card__sub">{t("card.sub")}</span>
    </ExtLink>
  );
}
