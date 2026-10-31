import { useI18n } from "../i18n/context.js";
import { PLANS } from "../data/gym.js";
import PlateMark from "./PlateMark.jsx";

// Plan lengths as plates on the floor: the longer the commitment, the bigger the plate.
// Interactive (radio buttons) on the membership page; decorative on the home page.

// Relative plate size: a year is the full plate, a month about two thirds of it
const grow = (months) => (0.5 + 0.5 * Math.sqrt(months / 12)).toFixed(3);

export default function PlanRack({ value, onChange, decorative = false }) {
  const { t, f, lang } = useI18n();

  const plate = (plan) => (
    <PlateMark
      className="plate--even"
      stampLeft={f.digits(plan.months)}
      stampRight={f.digits(plan.months)}
      arcTop="THE FIRST GYM"
      arcBottom={lang === "ar" ? t("months", { n: plan.months }) : t("months", { n: plan.months }).toUpperCase()}
      arabic={lang === "ar"}
    />
  );

  if (decorative) {
    return (
      <div className="rack" aria-hidden="true">
        {PLANS.map((plan) => (
          <div className="rack__plate" key={plan.id} style={{ "--grow": grow(plan.months) }}>
            {plate(plan)}
            <span className="rack__label">{t("months", { n: plan.months })}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <fieldset className="rack">
      <legend className="sr-only">{t("plan.choose")}</legend>
      {PLANS.map((plan) => (
        <label className="rack__plate" key={plan.id} style={{ "--grow": grow(plan.months) }}>
          <input
            type="radio"
            name="plan"
            className="sr-only"
            value={plan.id}
            checked={value === plan.id}
            onChange={() => onChange(plan.id)}
          />
          {plate(plan)}
          <span className="rack__label">{t("months", { n: plan.months })}</span>
        </label>
      ))}
    </fieldset>
  );
}
