import { useState } from "react";
import { CreditCard, Tag } from "lucide-react";
import { useI18n, usePageTitle } from "../i18n/context.js";
import { PLANS } from "../data/gym.js";
import { whatsappHref } from "../lib/contact.js";
import PlanRack from "../components/PlanRack.jsx";
import PlanFinder from "../components/PlanFinder.jsx";
import { ExtLink, Tbc, WhatsAppIcon } from "../components/bits.jsx";

export default function Membership() {
  const { t } = useI18n();
  usePageTitle("membership.title");
  const [planId, setPlanId] = useState("3m");
  const plan = PLANS.find((p) => p.id === planId);
  const length = t("months", { n: plan.months });

  return (
    <>
      <header className="page-head">
        <div className="shell">
          <h1 tabIndex={-1}>{t("membership.title")}</h1>
          <p>{t("membership.lede")}</p>
        </div>
      </header>

      <section className="section" aria-label={t("plan.choose")}>
        <div className="shell plans">
          <PlanRack value={planId} onChange={setPlanId} />
          <div className="plan-card" aria-live="polite">
            <p className="plan-card__length">{length}</p>
            <dl className="plan-card__price">
              <dt>{t("plan.price")}</dt>
              <dd>{plan.price ? t("egp", { n: plan.price }) : <Tbc />}</dd>
            </dl>
            <ul className="plan-card__notes">
              <li>
                <Tag aria-hidden="true" />
                {t("plan.offers")}
              </li>
              <li>
                <CreditCard aria-hidden="true" />
                {t("plan.payment")}
              </li>
            </ul>
            <ExtLink className="btn btn--volt" href={whatsappHref(t("plan.message", { plan: length }))}>
              <WhatsAppIcon />
              {t("plan.ask")}
            </ExtLink>
          </div>
        </div>
      </section>

      <section className="section section--flush-top" id="finder" tabIndex={-1} aria-labelledby="finder-title">
        <div className="shell finder-wrap">
          <header className="section__head">
            <h2 id="finder-title" className="section__title">
              {t("finder.title")}
            </h2>
            <p className="section__lede">{t("finder.lede")}</p>
          </header>
          <PlanFinder />
        </div>
      </section>
    </>
  );
}
