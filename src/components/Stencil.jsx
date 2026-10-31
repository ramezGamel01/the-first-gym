import { useId } from "react";

// A band in the page colour with the text cut out of it, so whatever sits behind shows through the letters.
// The band's width follows the text length, so every word keeps the same letter height and proportions.
export default function Stencil({ text, className = "" }) {
  const id = `stencil-${useId().replace(/[^\w-]/g, "")}`;
  const width = text.length * 110;
  return (
    <svg className={`stencil ${className}`} viewBox={`0 0 ${width} 200`} aria-hidden="true" focusable="false">
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width={width} height="200">
          <rect width={width} height="200" fill="#fff" />
          <text
            className="stencil__text"
            x={width / 2}
            y="194"
            textAnchor="middle"
            textLength={width - 16}
            lengthAdjust="spacingAndGlyphs"
          >
            {text}
          </text>
        </mask>
      </defs>
      <rect width={width} height="200" fill="currentColor" mask={`url(#${id})`} />
      {/* A thin yellow edge, like an LED strip, keeps the letters readable over dark parts of the photo */}
      <text
        className="stencil__text stencil__edge"
        x={width / 2}
        y="194"
        textAnchor="middle"
        textLength={width - 16}
        lengthAdjust="spacingAndGlyphs"
      >
        {text}
      </text>
    </svg>
  );
}
