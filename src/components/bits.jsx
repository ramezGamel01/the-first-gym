// Small shared pieces: the "to be added" marker, external links, icons, class times.
import {
  Car, CloudFog, Coffee, CreditCard, Crown, Dumbbell, HandFist, Lock, ScanLine, Snowflake, Sofa, Store, UserCheck, Users, Wifi,
} from "lucide-react";
import { useI18n } from "../i18n/context.js";
import { SCHEDULE } from "../data/gym.js";

// Marks information the gym hasn't published yet, with a strip of hazard tape
export function Tbc({ what, kind = "added" }) {
  const { t } = useI18n();
  return (
    <span className="tbc">
      <span className="tbc__tape" aria-hidden="true" />
      {what ? t(`tbc.${kind}What`, { what }) : t(`tbc.${kind}`)}
    </span>
  );
}

// Marks a placeholder photo, so nobody takes it for the gym's own
export function SampleTag() {
  const { t } = useI18n();
  return <span className="sample-tag">{t("photo.sample")}</span>;
}

export function ExtLink({ href, className, children, ...rest }) {
  const { t } = useI18n();
  return (
    <a href={href} className={className} target="_blank" rel="noreferrer" {...rest}>
      {children}
      <span className="sr-only"> {t("external")}</span>
    </a>
  );
}

const FACILITY_ICONS = {
  dumbbell: Dumbbell,
  boxing: HandFist,
  scan: ScanLine,
  coach: UserCheck,
  team: Users,
  steam: CloudFog,
  lounge: Sofa,
  cafe: Coffee,
  store: Store,
  snow: Snowflake,
  lock: Lock,
  wifi: Wifi,
  car: Car,
  card: CreditCard,
  crown: Crown,
};

export function FacilityIcon({ name }) {
  const Icon = FACILITY_ICONS[name];
  return <Icon aria-hidden="true" strokeWidth={1.75} />;
}

// Brand glyphs drawn for this site (the icon set has no brand logos)
export function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.4 20.6l1.3-4.2a8.6 8.6 0 1 1 3.4 3.3z" />
      <path
        d="M9.2 7.9c.3 0 .5 0 .7.5l.7 1.7c.1.2 0 .5-.1.7l-.6.7a6.6 6.6 0 0 0 3.3 3.3l.7-.6c.2-.2.5-.2.7-.1l1.7.7c.5.2.5.4.5.7 0 .8-.8 1.7-1.7 1.7-3.6 0-7.6-4-7.6-7.6 0-.9.9-1.7 1.7-1.7z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.6 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.9v3h2.6V21z" />
    </svg>
  );
}

// "Sat, Mon and Wed, 10 PM", or a marker for whatever the gym hasn't posted
export function ProgramTimes({ id }) {
  const { t, f } = useI18n();
  const sessions = SCHEDULE.filter((s) => s.program === id);
  if (!sessions.length) return <Tbc what={t("when.all")} />;
  return sessions.map((s) => (
    <span className="when" key={s.days.join()}>
      <span>{f.list(s.days.map(f.weekdayShort))}</span>
      {s.time ? <span className="when__time">{f.time(s.time)}</span> : <Tbc what={t("when.time")} />}
    </span>
  ));
}

export function AudienceTags({ audiences }) {
  const { t } = useI18n();
  return (
    <ul className="tags">
      {audiences.map((a) => (
        <li className="tag" key={a}>
          {t(`aud.${a}`)}
        </li>
      ))}
    </ul>
  );
}
