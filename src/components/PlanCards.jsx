import { useI18n } from "../i18n/context.js";
import { PLANS } from "../data/gym.js";
import { whatsappHref } from "../lib/contact.js";
import { ExtLink, Tbc, WhatsAppIcon } from "./bits.jsx";

// One card per plan length. Twelve cells under the number light up for the months the plan covers.
export default function PlanCards() {
  const { t, f } = useI18n();
  return (
    <ul className="plans">
      {PLANS.map((plan) => {
        const length = t("months", { n: plan.months });
        return (
          <li className="plan" key={plan.id}>
            <p className="plan__length">
              <span className="plan__num" aria-hidden="true">
                {f.number(plan.months)}
              </span>
              <span className="plan__unit" aria-hidden="true">
                {t("monthsUnit", { n: plan.months })}
              </span>
              <span className="sr-only">{length}</span>
            </p>
            <span className="plan__cells" aria-hidden="true">
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} className={i < plan.months ? "is-on" : undefined} />
              ))}
            </span>
            <dl className="plan__price">
              <dt>{t("plan.price")}</dt>
              <dd>{plan.price ? t("egp", { n: plan.price }) : <Tbc />}</dd>
            </dl>
            <ExtLink className="btn btn--ghost" href={whatsappHref(t("plan.message", { plan: length }))}>
              <WhatsAppIcon />
              {t("plan.ask")}
            </ExtLink>
          </li>
        );
      })}
    </ul>
  );
}
