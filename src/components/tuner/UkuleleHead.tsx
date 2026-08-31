import kaula from "@/assets/uke-neck-short.png";
import type { StringName } from "@/lib/strings";

type Props = {
  active: StringName;
  onSelect?: (s: StringName) => void;
};

// Peg positions and string paths in % of the (shortened) graphic.
const LAYOUT: Record<StringName, { x: number; y: number }> = {
  C: { x: 34.6, y: 32.8 },
  E: { x: 65.9, y: 32.8 },
  G: { x: 33.7, y: 54.4 },
  A: { x: 66.1, y: 54.4 },
};

const STRING_PATHS: Record<StringName, string> = {
  G: "M 33.7 54.4 L 36.5 74.5 L 36.5 100",
  C: "M 34.6 32.8 L 45.0 74.5 L 45.0 100",
  E: "M 65.9 32.8 L 54.2 74.5 L 54.2 100",
  A: "M 66.1 54.4 L 63.2 74.5 L 63.2 100",
};

const ORDER: StringName[] = ["G", "C", "E", "A"];

export function UkuleleHead({ active, onSelect }: Props) {
  return (
    <div className="relative mx-auto w-full select-none">
      <img src={kaula} alt="Ukulelen lapa ja kielet" className="w-full" draggable={false} />
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <path
          d={STRING_PATHS[active]}
          fill="none"
          stroke="var(--tuner-good)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {ORDER.map((s) => {
        const l = LAYOUT[s];
        const isActive = s === active;
        return (
          <button
            key={s}
            type="button"
            onClick={onSelect ? () => onSelect(s) : undefined}
            aria-label={`${s}-kieli`}
            aria-pressed={isActive}
            disabled={!onSelect}
            className={`absolute flex aspect-square w-[20%] items-center justify-center rounded-full border-[3px] font-display text-xl font-extrabold shadow-sm transition-all ${
              isActive
                ? "border-tuner-good bg-tuner-good text-primary-foreground"
                : "border-card bg-card text-foreground"
            } ${onSelect ? "cursor-pointer" : "cursor-default"}`}
            style={{
              left: `${l.x}%`,
              top: `${l.y}%`,
              boxShadow: isActive ? "0 0 0 4px var(--card), 0 0 0 8px var(--tuner-good)" : "none",
              transform: isActive
                ? "translate(-50%, -50%) scale(1.08)"
                : "translate(-50%, -50%)",
            }}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}
