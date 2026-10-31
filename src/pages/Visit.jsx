import { MapPinned, Navigation, Plus } from "lucide-react";
import { useI18n, usePageTitle } from "../i18n/context.js";
import { FAQ, GYM } from "../data/gym.js";
import { directionsHref, facebookHref, instagramHref, mapsHref, telHref, whatsappHref } from "../lib/contact.js";
import Hours from "../components/Hours.jsx";
import PageHead from "../components/PageHead.jsx";
import { PAGE_PHOTOS } from "../lib/photos.js";
import { ExtLink } from "../components/bits.jsx";

export default function Visit() {
  const { t, f, pick } = useI18n();
  usePageTitle("visit.title");
  const phone = f.phone(GYM.phone);

  return (
    <>
      <PageHead title={t("visit.title")} lede={t("visit.lede")} photo={PAGE_PHOTOS.visit} />

      <section className="section" aria-label={t("visit.address")}>
        <div className="shell visit">
          <div className="visit__where">
            <h2 className="visit__label">{t("visit.address")}</h2>
            <p className="visit__address">{pick(GYM.landmark)}</p>
            <p className="visit__sub">{pick(GYM.address)}</p>
            <div className="button-row">
              <ExtLink className="btn btn--volt" href={directionsHref()}>
                <Navigation aria-hidden="true" />
                {t("cta.directions")}
              </ExtLink>
              <ExtLink className="btn btn--ghost" href={mapsHref()}>
                <MapPinned aria-hidden="true" />
                {t("cta.openMaps")}
              </ExtLink>
            </div>

            <h2 className="visit__label">{t("visit.contact")}</h2>
            <dl className="contact-list">
              <div>
                <dt>{t("contact.phone")}</dt>
                <dd>
                  <a href={telHref()}>
                    <bdi className="nums">{phone}</bdi>
                  </a>
                </dd>
              </div>
              <div>
                <dt>{t("contact.whatsapp")}</dt>
                <dd>
                  <ExtLink href={whatsappHref()}>
                    <bdi className="nums">{phone}</bdi>
                  </ExtLink>
                </dd>
              </div>
              <div>
                <dt>{t("contact.instagram")}</dt>
                <dd>
                  <ExtLink href={instagramHref()}>
                    <bdi>@{GYM.instagram}</bdi>
                  </ExtLink>
                </dd>
              </div>
              <div>
                <dt>{t("contact.facebook")}</dt>
                <dd>
                  <ExtLink href={facebookHref()}>
                    <bdi>facebook.com/{GYM.facebook}</bdi>
                  </ExtLink>
                </dd>
              </div>
            </dl>
          </div>

          <div className="visit__hours">
            <h2 className="visit__label">{t("visit.hours")}</h2>
            <Hours />
          </div>
        </div>
      </section>

      <section className="section section--flush-top" aria-labelledby="faq-title">
        <div className="shell faq-wrap">
          <h2 id="faq-title" className="section__title">
            {t("faq.title")}
          </h2>
          <div className="faq">
            {FAQ.map((item) => (
              <details key={item.q.en}>
                <summary>
                  {pick(item.q)}
                  <Plus aria-hidden="true" />
                </summary>
                <p>{pick(item.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
