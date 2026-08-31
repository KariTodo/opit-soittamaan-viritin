type Props = {
  cents: number | null;
  state: "off" | "close" | "intune" | "unknown";
};

/** Big arc gauge: left = too low, middle = in tune, right = too high. */
export function Meter({ cents, state }: Props) {
  const clamped = cents === null ? 0 : Math.max(-50, Math.min(50, cents));
  const angle = (clamped / 50) * 70; // degrees from vertical
  const color =
    state === "intune"
      ? "var(--tuner-good)"
      : state === "close"
        ? "var(--tuner-close)"
        : state === "off"
          ? "var(--tuner-off)"
          : "var(--tuner-idle)";

  return (
    <div className="w-full max-w-md">
      <svg viewBox="0 0 200 100" className="w-full" role="img" aria-label="Viritysmittari">
        <path
          d="M 16 92 A 84 84 0 0 1 184 92"
          fill="none"
          stroke="var(--tuner-track)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M 84 10.5 A 84 84 0 0 1 116 10.5"
          fill="none"
          stroke="var(--tuner-good)"
          strokeWidth="16"
          strokeLinecap="round"
          opacity={state === "intune" ? 1 : 0.35}
        />
        <text x="22" y="99" fontSize="11" fill="var(--tuner-label)">
          matala
        </text>
        <text x="150" y="99" fontSize="11" fill="var(--tuner-label)">
          korkea
        </text>
        <g
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: "100px 92px",
            transition: "transform 140ms ease-out",
          }}
        >
          <line
            x1="100"
            y1="92"
            x2="100"
            y2="26"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            opacity={cents === null ? 0.35 : 1}
          />
        </g>
        <circle cx="100" cy="92" r="11" fill={color} opacity={cents === null ? 0.35 : 1} />
      </svg>
    </div>
  );
}
