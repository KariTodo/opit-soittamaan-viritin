import kaula from "@/assets/ukulelen-kaula.png.asset.json";
import type { StringName } from "@/lib/strings";

type Props = {
  active: StringName;
  done?: StringName[];
  onSelect?: (s: StringName) => void;
};

// Positions in % of the graphic: string line x, tuning peg x/y.
const LAYOUT: Record<StringName, { x: number; pegX: number; pegY: number }> = {
  G: { x: 36.5, pegX: 12, pegY: 21 },
  C: { x: 45.5, pegX: 12, pegY: 39.5 },
  E: { x: 55, pegX: 88, pegY: 39.5 },
  A: { x: 64, pegX: 88, pegY: 21 },
};

const ORDER: StringName[] = ["G", "C", "E", "A"];

export function UkuleleHead({ active, done = [], onSelect }: Props) {
  return (
    <div className="relative mx-auto w-full max-w-[230px] select-none">
      <img src={kaula.url} alt="Ukulelen lapa ja kielet" className="w-full" draggable={false} />
      {ORDER.map((s) => {
        const l = LAYOUT[s];
        const isActive = s === active;
        const isDone = done.includes(s);
        return (
          <button
            key={s}
            type="button"
            onClick={onSelect ? () => onSelect(s) : undefined}
            aria-label={`${s}-kieli`}
            aria-pressed={isActive}
            className="absolute inset-y-0 w-[9%] cursor-pointer"
            style={{ left: `${l.x - 4.5}%` }}
            disabled={!onSelect}
          >
            <span
              className="absolute inset-y-[10%] left-1/2 w-[3px] -translate-x-1/2 rounded-full transition-all"
              style={{
                background: isActive
                  ? "var(--tuner-good)"
                  : isDone
                    ? "color-mix(in oklab, var(--tuner-good) 45%, transparent)"
                    : "transparent",
                boxShadow: isActive ? "0 0 10px var(--tuner-good)" : "none",
              }}
            />
            <span
              className="absolute grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full text-sm font-extrabold transition-all"
              style={{
                left: `${((l.pegX - (l.x - 4.5)) / 9) * 100}%`,
                top: `${l.pegY}%`,
                background: isActive
                  ? "var(--tuner-good)"
                  : isDone
                    ? "color-mix(in oklab, var(--tuner-good) 25%, var(--card))"
                    : "var(--card)",
                color: isActive ? "var(--primary-foreground)" : "var(--foreground)",
                border: "2px solid var(--tuner-good)",
                transform: isActive ? "translateX(-50%) scale(1.25)" : "translateX(-50%)",
              }}
            >
              {s}
            </span>
          </button>
        );
      })}
    </div>
  );
}
