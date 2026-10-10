/** Simple SVG monogram logo built from the letters "HAJ". */
export function Monogram({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect
        width="64"
        height="64"
        rx="14"
        fill="var(--surface)"
        stroke="var(--accent)"
        strokeOpacity="0.55"
        strokeWidth="2"
      />
      <text
        x="32"
        y="43"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize="25"
        fontWeight="700"
        letterSpacing="1"
        fill="var(--text)"
      >
        HAJ
      </text>
    </svg>
  );
}
