import { CreditCard, Tag } from "lucide-react";
import { useI18n, usePageTitle } from "../i18n/context.js";
import PageHead from "../components/PageHead.jsx";
import { PAGE_PHOTOS } from "../lib/photos.js";
import PlanCards from "../components/PlanCards.jsx";
import PlanFinder from "../components/PlanFinder.jsx";

export default function Membership() {
  const { t } = useI18n();
  usePageTitle("membership.title");

  return (
    <>
      <PageHead title={t("membership.title")} lede={t("membership.lede")} photo={PAGE_PHOTOS.membership} />

      <section className="section" aria-label={t("membership.title")}>
        <div className="shell">
          <PlanCards />
          <ul className="plan-notes">
            <li>
              <Tag aria-hidden="true" />
              {t("plan.offers")}
            </li>
            <li>
              <CreditCard aria-hidden="true" />
              {t("plan.payment")}
            </li>
          </ul>
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
