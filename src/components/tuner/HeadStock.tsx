import type { Instrument } from "@/lib/instruments";

type Props = {
  instrument: Instrument;
  active: string;
  onSelect?: (id: string) => void;
};

export function HeadStock({ instrument, active, onSelect }: Props) {
  const activeString = instrument.strings.find((s) => s.id === active);

  return (
    <div className="relative mx-auto w-full select-none">
      <img
        src={instrument.neck}
        alt={`${instrument.name}n lapa ja kielet`}
        className="w-full"
        draggable={false}
      />
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        {activeString && (
          <path
            d={activeString.path}
            fill="none"
            stroke="var(--tuner-good)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
      {instrument.strings.map((s) => {
        const isActive = s.id === active;
        return (
          <button
            key={s.id}
            type="button"
            onClick={onSelect ? () => onSelect(s.id) : undefined}
            aria-label={`${s.label}-kieli`}
            aria-pressed={isActive}
            disabled={!onSelect}
            className={`absolute flex aspect-square items-center justify-center rounded-full border-[3px] font-display font-extrabold shadow-sm transition-all ${
              instrument.pegSize > 18 ? "text-xl" : "text-base sm:text-lg"
            } ${
              isActive
                ? "border-tuner-good bg-tuner-good text-primary-foreground"
                : "border-card bg-card text-foreground"
            } ${onSelect ? "cursor-pointer" : "cursor-default"}`}
            style={{
              width: `${instrument.pegSize}%`,
              left: `${s.peg.x}%`,
              top: `${s.peg.y}%`,
              boxShadow: isActive ? "0 0 0 4px var(--card), 0 0 0 8px var(--tuner-good)" : "none",
              transform: isActive
                ? "translate(-50%, -50%) scale(1.08)"
                : "translate(-50%, -50%)",
            }}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
