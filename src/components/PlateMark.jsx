import { useId } from "react";

// The site's mark: a bumper plate seen face-on, stamped "1 ST" where a plate shows its weight.
// The 3D hero draws the same face (three/PlateScene.jsx), so the two layouts share these numbers.
export default function PlateMark({
  className = "",
  stampLeft = "1",
  stampRight = "ST",
  arcTop = "THE FIRST GYM",
  arcBottom = "YOUR FIRST PLACE TO BE A HERO",
  detail = true,
}) {
  const uid = useId().replace(/[^\w-]/g, "");
  return (
    <svg viewBox="0 0 200 200" className={`plate ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${uid}r`} cx="36%" cy="30%" r="78%">
          <stop offset="0" stopColor="#2c2c2c" />
          <stop offset="0.55" stopColor="#101010" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <linearGradient id={`${uid}s`} x1="0.15" y1="0.1" x2="0.85" y2="0.9">
          <stop offset="0" stopColor="#f5f5f5" />
          <stop offset="0.45" stopColor="#8a8a8a" />
          <stop offset="0.7" stopColor="#d8d8d8" />
          <stop offset="1" stopColor="#686868" />
        </linearGradient>
        <path id={`${uid}t`} d="M 30 100 A 70 70 0 0 1 170 100" />
        <path id={`${uid}b`} d="M 24 100 A 76 76 0 0 0 176 100" />
      </defs>
      <circle cx="100" cy="100" r="99.5" fill={`url(#${uid}r)`} />
      <circle cx="100" cy="100" r="95" fill="none" stroke="var(--volt)" strokeWidth="1.8" />
      <circle cx="100" cy="100" r="89.5" fill="none" stroke="#000" strokeWidth="2.5" opacity="0.75" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="#3b3b3b" strokeWidth="0.6" />
      {detail && (
        <>
          <text className="plate__arc">
            <textPath href={`#${uid}t`} startOffset="50%" textAnchor="middle">
              {arcTop}
            </textPath>
          </text>
          <text className="plate__arc plate__arc--small">
            <textPath href={`#${uid}b`} startOffset="50%" textAnchor="middle">
              {arcBottom}
            </textPath>
          </text>
        </>
      )}
      <circle cx="100" cy="100" r="37" fill="#0c0c0c" stroke="#272727" strokeWidth="1" />
      <circle cx="100" cy="100" r="24" fill={`url(#${uid}s)`} />
      <circle cx="100" cy="100" r="11.5" fill="#000" />
      {detail && (
        <>
          <text x="48" y="101" className="plate__stamp" textAnchor="middle" dominantBaseline="central">
            {stampLeft}
          </text>
          <text x="153" y="101" className="plate__stamp plate__stamp--small" textAnchor="middle" dominantBaseline="central">
            {stampRight}
          </text>
        </>
      )}
    </svg>
  );
}
