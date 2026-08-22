import kaula from "@/assets/uke-neck-clean.png";
import type { StringName } from "@/lib/strings";

type Props = {
  active: StringName;
  onSelect?: (s: StringName) => void;
};

// Peg positions and string paths in % of the graphic.
const LAYOUT: Record<StringName, { x: number; y: number }> = {
  C: { x: 34.2, y: 21.9 },
  E: { x: 65.8, y: 21.9 },
  G: { x: 34.2, y: 36.1 },
  A: { x: 65.8, y: 36.1 },
};

const STRING_PATHS: Record<StringName, string> = {
  G: "M 34.2 36.1 L 36 49.5 L 35.7 100",
  C: "M 34.2 21.9 L 45.5 49.5 L 45.5 100",
  E: "M 65.8 21.9 L 54.5 49.5 L 54.5 100",
  A: "M 65.8 36.1 L 64 49.5 L 64.3 100",
};

const ORDER: StringName[] = ["G", "C", "E", "A"];

export function UkuleleHead({ active, onSelect }: Props) {
  return (
    <div className="relative mx-auto w-full max-w-[230px] select-none">
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
            className={`absolute flex aspect-square w-[18%] items-center justify-center rounded-full border-[3px] font-display text-xl font-extrabold shadow-sm transition-all ${
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
