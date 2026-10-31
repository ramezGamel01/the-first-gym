import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Menu, Moon, Phone, Sun, X } from "lucide-react";
import { useI18n } from "../i18n/context.js";
import { usePrefs } from "../state/prefs-context.js";
import { GYM } from "../data/gym.js";
import { facebookHref, instagramHref, telHref, whatsappHref } from "../lib/contact.js";
import PlateMark from "./PlateMark.jsx";
import { ExtLink, FacebookIcon, InstagramIcon, WhatsAppIcon } from "./bits.jsx";

const NAV = [
  { to: "/classes", label: "nav.classes" },
  { to: "/membership", label: "nav.membership" },
  { to: "/coaches", label: "nav.coaches" },
  { to: "/body-lab", label: "nav.bodyLab" },
  { to: "/visit", label: "nav.visit" },
];

export default function Layout({ children }) {
  const { t, f, pick, lang, setLang } = useI18n();
  const { theme, toggleTheme, motion, toggleMotion } = usePrefs();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef(null);
  const { pathname, hash } = useLocation();
  const firstRender = useRef(true);

  // After navigating: jump to the top (or the linked section) and move focus to the new page's heading
  useEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (firstRender.current) {
      firstRender.current = false;
      target?.scrollIntoView();
      return;
    }
    if (target) {
      target.scrollIntoView();
      target.focus({ preventScroll: true });
    } else {
      window.scrollTo(0, 0);
      document.querySelector("main h1")?.focus({ preventScroll: true });
    }
  }, [pathname, hash]);

  // The open menu covers the page: lock scrolling and close it with Escape
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", menuOpen);
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const otherLang = lang === "en" ? "ar" : "en";

  return (
    <>
      <a className="skip" href="#main">
        {t("skip")}
      </a>
      <header className="site-header">
        <div className="site-header__inner shell">
          <Link to="/" className="brand" aria-label={t("brand.home")} onClick={closeMenu}>
            <PlateMark className="brand__plate" detail={false} />
            <span className="brand__word" aria-hidden="true">
              The First <span className="brand__gym">Gym</span>
            </span>
          </Link>

          <nav className={`site-nav${menuOpen ? " is-open" : ""}`} id="site-nav" aria-label={t("nav.label")}>
            <ul className="site-nav__links">
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} onClick={closeMenu}>
                    {t(item.label)}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="site-nav__contact">
              <ExtLink className="btn btn--volt" href={whatsappHref(GYM.offerWord)}>
                <WhatsAppIcon />
                {t("cta.whatsapp")}
              </ExtLink>
              <a className="btn btn--ghost" href={telHref()}>
                <Phone aria-hidden="true" />
                {t("cta.call")} <bdi className="nums">{f.phone(GYM.phone)}</bdi>
              </a>
            </div>
          </nav>

          <div className="site-header__tools">
            <button
              type="button"
              className="tool-btn tool-btn--lang"
              lang={otherLang}
              title={t("lang.switchLabel")}
              onClick={() => setLang(otherLang)}
            >
              {t("lang.switch")}
            </button>
            <button
              type="button"
              className="tool-btn"
              aria-label={theme === "dark" ? t("theme.toLight") : t("theme.toDark")}
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
            </button>
            <ExtLink className="btn btn--volt btn--sm header-cta" href={whatsappHref(GYM.offerWord)}>
              <WhatsAppIcon />
              <span className="header-cta__text">{t("cta.whatsappShort")}</span>
            </ExtLink>
            <button
              type="button"
              ref={menuButton}
              className="tool-btn menu-btn"
              aria-expanded={menuOpen}
              aria-controls="site-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
              <span className="sr-only">{menuOpen ? t("nav.close") : t("nav.open")}</span>
            </button>
          </div>
        </div>
      </header>

      <main id="main">{children}</main>

      <footer className="site-footer">
        <div className="shell site-footer__grid">
          <div className="site-footer__brand">
            <PlateMark className="site-footer__plate" />
            <p className="site-footer__tagline">{pick(GYM.tagline)}</p>
          </div>
          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore">{t("footer.explore")}</h2>
            <ul className="site-footer__links">
              <li>
                <Link to="/">{t("nav.home")}</Link>
              </li>
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{t(item.label)}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2>{t("footer.contact")}</h2>
            <ul className="site-footer__links">
              <li>
                <a href={telHref()}>
                  <Phone aria-hidden="true" />
                  <bdi className="nums">{f.phone(GYM.phone)}</bdi>
                </a>
              </li>
              <li>
                <ExtLink href={whatsappHref()}>
                  <WhatsAppIcon />
                  {t("contact.whatsapp")}
                </ExtLink>
              </li>
              <li>
                <ExtLink href={instagramHref()}>
                  <InstagramIcon />
                  <bdi>@{GYM.instagram}</bdi>
                </ExtLink>
              </li>
              <li>
                <ExtLink href={facebookHref()}>
                  <FacebookIcon />
                  {t("contact.facebook")}
                </ExtLink>
              </li>
            </ul>
            <p className="site-footer__address">
              {pick(GYM.address)}
              <br />
              {pick(GYM.landmark)}
            </p>
          </div>
        </div>
        <div className="shell site-footer__base">
          <p>{t("footer.rights", { year: f.digits(new Date().getFullYear()) })}</p>
          <button type="button" className="switch" aria-pressed={motion} onClick={toggleMotion}>
            <span className="switch__track" aria-hidden="true">
              <span className="switch__thumb" />
            </span>
            {t("motion.label")}
          </button>
        </div>
      </footer>
    </>
  );
}
