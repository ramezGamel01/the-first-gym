import { Link } from "react-router";
import { useI18n, usePageTitle } from "../i18n/context.js";

export default function NotFound() {
  const { t } = useI18n();
  usePageTitle("notFound.title");
  return (
    <header className="page-head page-head--alone">
      <div className="shell">
        <h1 tabIndex={-1}>{t("notFound.title")}</h1>
        <p>{t("notFound.lede")}</p>
        <Link className="btn btn--volt" to="/">
          {t("notFound.home")}
        </Link>
      </div>
    </header>
  );
}
