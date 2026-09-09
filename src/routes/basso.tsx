import { createFileRoute } from "@tanstack/react-router";
import { TunerScreen } from "@/components/tuner/TunerScreen";
import { BASSO } from "@/lib/instruments";

export const Route = createFileRoute("/basso")({
  head: () => ({
    meta: [
      { title: "Bassoviritin – Opit soittamaan!" },
      {
        name: "description",
        content:
          "Helppo basson viritysmittari lapsille. Viritä kielet E, A, D ja G selaimessa – ääni käsitellään vain omalla laitteella.",
      },
      { property: "og:title", content: "Bassoviritin – Opit soittamaan!" },
      {
        property: "og:description",
        content: "Viritetään basso helposti! Lapsiystävällinen viritysmittari selaimessa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <TunerScreen instrument={BASSO} />,
});
