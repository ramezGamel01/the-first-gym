// Photos used on the site.
// PHOTOS are the two supplied for the hero, the call to action and the footer. The rest are placeholders
// from Unsplash (free under the Unsplash License, credits in README.md) until the gym sends its own;
// the site tags each of them "Sample photo".
import boxing from "../assets/athletes-boxing.webp";
import weights from "../assets/athletes-weights.webp";
import classFitness from "../assets/stock/class-fitness.webp";
import classKickboxing from "../assets/stock/class-kickboxing.webp";
import classMma from "../assets/stock/class-mma.webp";
import classZumba from "../assets/stock/class-zumba.webp";
import classAerobics from "../assets/stock/class-aerobics.webp";
import classYoga from "../assets/stock/class-yoga.webp";
import classDance from "../assets/stock/class-dance.webp";
import coachOsama from "../assets/stock/coach-osama.webp";
import coachTamer from "../assets/stock/coach-tamer.webp";
import coachNada from "../assets/stock/coach-nada.webp";
import facilityTrain from "../assets/stock/facility-train.webp";
import facilityRecover from "../assets/stock/facility-recover.webp";
import facilityPractical from "../assets/stock/facility-practical.webp";
import headClasses from "../assets/stock/head-classes.webp";
import headMembership from "../assets/stock/head-membership.webp";
import headCoaches from "../assets/stock/head-coaches.webp";
import headBodyLab from "../assets/stock/head-body-lab.webp";
import headVisit from "../assets/stock/head-visit.webp";

export const PHOTOS = {
  boxing: {
    src: boxing,
    width: 1536,
    height: 1024,
    alt: {
      en: "Two athletes in a gym lit with warm light, one wrapping her hands for boxing",
      ar: "رياضيان في جيم بإضاءة دافئة، وإحداهما تلف رباط الملاكمة حول يديها",
    },
  },
  weights: {
    src: weights,
    width: 1536,
    height: 1024,
    alt: {
      en: "Two athletes standing by the weight racks, one holding a dumbbell",
      ar: "رياضيان بجوار أرفف الأوزان، وإحداهما تحمل دمبل",
    },
  },
};

// 1000 × 1250
export const CLASS_PHOTOS = {
  fitness: classFitness,
  kickboxing: classKickboxing,
  mma: classMma,
  zumba: classZumba,
  aerobics: classAerobics,
  yoga: classYoga,
  dance: classDance,
};

// 800 × 1000
export const COACH_PHOTOS = { osama: coachOsama, tamer: coachTamer, nada: coachNada };

// 900 × 640
export const FACILITY_PHOTOS = { train: facilityTrain, recover: facilityRecover, practical: facilityPractical };

// Wide page headers
export const PAGE_PHOTOS = {
  classes: headClasses,
  membership: headMembership,
  coaches: headCoaches,
  bodyLab: headBodyLab,
  visit: headVisit,
};
