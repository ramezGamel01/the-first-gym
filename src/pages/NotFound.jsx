import { Link } from "react-router";
import { useI18n, usePageTitle } from "../i18n/context.js";
import PageHead from "../components/PageHead.jsx";
import { PHOTOS } from "../lib/photos.js";

export default function NotFound() {
  const { t } = useI18n();
  usePageTitle("notFound.title");
  return (
    <PageHead title={t("notFound.title")} lede={t("notFound.lede")} photo={PHOTOS.weights.src} sample={false}>
      <Link className="btn btn--volt page-head__action" to="/">
        {t("notFound.home")}
      </Link>
    </PageHead>
  );
}
