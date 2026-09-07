import { createFileRoute } from "@tanstack/react-router";
import { TunerScreen } from "@/components/tuner/TunerScreen";
import { UKULELE } from "@/lib/instruments";

export const Route = createFileRoute("/ukulele")({
  head: () => ({
    meta: [
      { title: "Ukuleleviritin – Opit soittamaan!" },
      {
        name: "description",
        content:
          "Helppo ukulelen viritysmittari lapsille. Viritä kielet G, C, E ja A selaimessa – ääni käsitellään vain omalla laitteella.",
      },
      { property: "og:title", content: "Ukuleleviritin – Opit soittamaan!" },
      {
        property: "og:description",
        content: "Viritetään ukulele helposti! Lapsiystävällinen viritysmittari selaimessa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <TunerScreen instrument={UKULELE} />,
});
