import kaula from "@/assets/uke-neck.png.asset.json";
import type { StringName } from "@/lib/strings";

type Props = {
  active: StringName;
  done?: StringName[];
  onSelect?: (s: StringName) => void;
};

// Peg label positions in % of the graphic (left→right: G, C, A, E).
const LAYOUT: Record<StringName, { x: number; y: number }> = {
  C: { x: 31.4, y: 26.4 },
  A: { x: 68.6, y: 26.5 },
  G: { x: 30.9, y: 43.8 },
  E: { x: 68.6, y: 43.9 },
};

const ORDER: StringName[] = ["G", "C", "A", "E"];

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
            disabled={!onSelect}
            className={`absolute h-[13%] w-[23%] rounded-full transition-all ${
              onSelect ? "cursor-pointer" : "cursor-default"
            }`}
            style={{
              left: `${l.x}%`,
              top: `${l.y}%`,
              boxShadow: isActive
                ? "0 0 0 4px var(--tuner-good), 0 0 16px var(--tuner-good)"
                : isDone
                  ? "0 0 0 3px color-mix(in oklab, var(--tuner-good) 45%, transparent)"
                  : "none",
              transform: isActive
                ? "translate(-50%, -50%) scale(1.08)"
                : "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </div>
  );
}
