import { createFileRoute } from "@tanstack/react-router";
import { TunerScreen } from "@/components/tuner/TunerScreen";
import { KITARA } from "@/lib/instruments";

export const Route = createFileRoute("/kitara")({
  head: () => ({
    meta: [
      { title: "Kitaraviritin – Opit soittamaan!" },
      {
        name: "description",
        content:
          "Helppo kitaran viritysmittari lapsille. Viritä kielet E, A, D, G, H ja E selaimessa – ääni käsitellään vain omalla laitteella.",
      },
      { property: "og:title", content: "Kitaraviritin – Opit soittamaan!" },
      {
        property: "og:description",
        content: "Viritetään kitara helposti! Lapsiystävällinen viritysmittari selaimessa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <TunerScreen instrument={KITARA} />,
});
