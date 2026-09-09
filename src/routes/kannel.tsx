import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { TunerScreen } from "@/components/tuner/TunerScreen";
import { kannel } from "@/lib/instruments";

export const Route = createFileRoute("/kannel")({
  head: () => ({
    meta: [
      { title: "Kanteleviritin – Opit soittamaan!" },
      {
        name: "description",
        content:
          "Helppo 5-kielisen kanteleen viritysmittari: D, E, F# (tai F), G ja A. Ääni käsitellään vain omalla laitteella.",
      },
      { property: "og:title", content: "Kanteleviritin – Opit soittamaan!" },
      {
        property: "og:description",
        content: "Viritetään kannel helposti duuri- tai mollivireeseen selaimessa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Kanneleviritin,
});

function Kanneleviritin() {
  const [minor, setMinor] = useState(false);
  const instrument = useMemo(() => kannel(minor), [minor]);

  return (
    <TunerScreen
      instrument={instrument}
      extra={
        <div className="mx-auto mt-1 flex w-full max-w-2xl flex-wrap items-center justify-center gap-2 text-center">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMinor(false)}
              aria-pressed={!minor}
              className={`flex h-9 w-9 items-center justify-center rounded-full border-[3px] font-display text-sm font-extrabold transition-all ${
                !minor
                  ? "border-tuner-good bg-tuner-good text-primary-foreground"
                  : "border-card bg-card text-foreground"
              }`}
            >
              F#
            </button>
            <button
              type="button"
              onClick={() => setMinor(true)}
              aria-pressed={minor}
              className={`flex h-9 w-9 items-center justify-center rounded-full border-[3px] font-display text-sm font-extrabold transition-all ${
                minor
                  ? "border-tuner-good bg-tuner-good text-primary-foreground"
                  : "border-card bg-card text-foreground"
              }`}
            >
              F
            </button>
          </div>
          <p className="max-w-md text-[11px] font-bold leading-tight text-muted-foreground sm:text-xs">
            Kun kannel viritetään duurivireeseen, käytetään keskimmäisessä kielessä F#-säveltä.
            Mollivireessä kieli viritetään F-säveleen.
          </p>
        </div>
      }
    />
  );
}
