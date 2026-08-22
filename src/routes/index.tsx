import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Meter } from "@/components/tuner/Meter";
import { UkuleleHead } from "@/components/tuner/UkuleleHead";
import { useTuner } from "@/hooks/useTuner";
import { centsBetween } from "@/lib/pitch";
import { STRING_ORDER, freqOf, type StringName } from "@/lib/strings";
import logo from "@/assets/logo.png.asset.json";
import konnaKorvat from "@/assets/konna-korvat.png.asset.json";
import konnaTuumii from "@/assets/konna-tuumii.png.asset.json";
import konnaPeukku from "@/assets/konna-peukku.png.asset.json";
import konnaNeutraali from "@/assets/konna-neutraali.png.asset.json";

export const Route = createFileRoute("/")({
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
  component: Viritin,
});

type Phase = "start" | "mic" | "tuning" | "done";
type TuneState = "off" | "close" | "intune" | "unknown";

function Viritin() {
  const { micStatus, reading, start, playSuccess, pauseFor } = useTuner();
  const [phase, setPhase] = useState<Phase>("start");
  const [manual, setManual] = useState(false);
  const [current, setCurrent] = useState<StringName>("G");
  const [tuned, setTuned] = useState<StringName[]>([]);
  const [locked, setLocked] = useState(false);
  const [muted, setMuted] = useState(false);
  const holdRef = useRef<number | null>(null);

  const target = freqOf(current);
  const cents = reading.freq !== null ? centsBetween(reading.freq, target) : null;

  const state: TuneState = useMemo(() => {
    if (locked) return "intune";
    if (cents === null) return "unknown";
    const a = Math.abs(cents);
    if (a <= 8) return "intune";
    if (a <= 25) return "close";
    return "off";
  }, [cents, locked]);

  // Hold ~600 ms in tune before accepting the string
  useEffect(() => {
    if (phase !== "tuning" || locked) return;
    const inTune = cents !== null && Math.abs(cents) <= 8;
    if (inTune) {
      if (holdRef.current === null) {
        holdRef.current = window.setTimeout(() => {
          holdRef.current = null;
          setLocked(true);
          setTuned((t) => (t.includes(current) ? t : [...t, current]));
          if (!muted) playSuccess(target);
          else pauseFor(300);
        }, 600);
      }
    } else if (holdRef.current !== null) {
      window.clearTimeout(holdRef.current);
      holdRef.current = null;
    }
  }, [cents, phase, locked, current, muted, playSuccess, pauseFor, target]);

  useEffect(() => {
    return () => {
      if (holdRef.current !== null) {
        window.clearTimeout(holdRef.current);
      }
    };
  }, []);

  const goTo = useCallback((s: StringName) => {
    if (holdRef.current !== null) {
      window.clearTimeout(holdRef.current);
      holdRef.current = null;
    }
    setCurrent(s);
    setLocked(false);
  }, []);

  const nextString = useCallback(() => {
    const remaining = STRING_ORDER.filter((s) => s !== current && !tuned.includes(s));
    if (manual) {
      setLocked(false);
      return;
    }
    if (remaining.length === 0) {
      setPhase("done");
      return;
    }
    goTo(remaining[0]!);
  }, [current, tuned, manual, goTo]);

  const beginTuning = useCallback(
    async (manualMode: boolean) => {
      setManual(manualMode);
      setPhase("mic");
      const ok = await start();
      if (ok) {
        setTuned([]);
        setLocked(false);
        setCurrent("G");
        setPhase("tuning");
      }
    },
    [start],
  );

  const guidance =
    state === "intune"
      ? "Vireessä!"
      : state === "unknown"
        ? "Soita kieli uudelleen"
        : state === "close"
          ? "Melkein oikein – säädä vähän"
          : cents !== null && cents < 0
            ? "Alavire – kiristä kieltä vähän"
            : "Ylävire – löysää kieltä vähän";

  const absCents = cents === null ? null : Math.abs(cents);
  const konna =
    locked || (absCents !== null && absCents < 5)
      ? konnaPeukku.url
      : absCents === null
        ? konnaNeutraali.url
        : absCents >= 33
          ? konnaKorvat.url
          : konnaTuumii.url;
  const konnaAlt =
    konna === konnaPeukku.url
      ? "Iloinen konna näyttää peukkua"
      : konna === konnaTuumii.url
        ? "Konna miettii sormi poskella"
        : konna === konnaKorvat.url
          ? "Konna pitää käsiä korvillaan"
          : "Konna odottaa rauhallisena";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 pb-6 pt-4">
      <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <img src={logo.url} alt="Opit soittamaan!" className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" />
        <div className="min-w-0">
          <h1 className="truncate text-xl font-extrabold text-primary sm:text-2xl">
            Ukuleleviritin
          </h1>
          <a
            href="https://www.opitsoittamaan.fi"
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-sm font-bold text-muted-foreground underline hover:text-primary"
          >
            www.opitsoittamaan.fi
          </a>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-1.5">
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="btn-soft !px-4 !py-1.5 text-sm"
            aria-pressed={muted}
          >
            {muted ? "🔇 Äänet pois" : "🔊 Äänet"}
          </button>
          {phase === "tuning" && (
            <button
              type="button"
              className="btn-soft !px-4 !py-1.5 text-xs"
              onClick={() => {
                setManual((m) => !m);
                setLocked(false);
              }}
            >
              {manual ? "Automaattinen viritys" : "Valitse kieli itse"}
            </button>
          )}
        </div>
      </header>


      <div className="flex flex-1 flex-col items-center justify-center py-2">
        {phase === "start" && (
          <section className="card-soft w-full max-w-md p-7 text-center">
            <h2 className="text-3xl font-extrabold text-primary">Ukuleleviritin</h2>
            <p className="mt-2 text-lg text-muted-foreground">Viritetään ukulele helposti!</p>
            <img src={konnaNeutraali.url} alt="" className="mx-auto my-4 h-40" />
            <button type="button" className="btn-big w-full" onClick={() => beginTuning(false)}>
              ALOITA VIRITYS
            </button>
            <button
              type="button"
              className="btn-soft mt-3 w-full"
              onClick={() => beginTuning(true)}
            >
              Valitse kieli itse
            </button>
          </section>
        )}

        {phase === "mic" && (
          <section className="card-soft w-full max-w-md p-7 text-center">
            <img src={konnaTuumii.url} alt="" className="mx-auto h-36" />
            <h2 className="mt-2 text-2xl font-extrabold text-primary">
              Tarvitsen mikrofonin kuullakseni ukulelesi.
            </h2>
            {micStatus === "denied" || micStatus === "error" ? (
              <div className="mt-4 text-left text-base text-muted-foreground">
                <p className="font-bold text-foreground">Mikrofoni ei ole vielä sallittu.</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5">
                  <li>Etsi selaimen osoiterivin lukko- tai mikrofonikuvake.</li>
                  <li>Valitse siitä “Salli mikrofoni”.</li>
                  <li>Paina alta uudelleen.</li>
                </ol>
              </div>
            ) : null}
            <button
              type="button"
              className="btn-big mt-5 w-full"
              onClick={() => beginTuning(manual)}
              disabled={micStatus === "requesting"}
            >
              {micStatus === "requesting" ? "ODOTA HETKI…" : "SALLI MIKROFONI"}
            </button>
            <button type="button" className="btn-soft mt-3" onClick={() => setPhase("start")}>
              Takaisin
            </button>
          </section>
        )}

        {phase === "tuning" && (
          <section className="w-full">
            {/* Vaihtoehtoinen ylänäkymä: ohje TAI onnistumispalaute + seuraava */}
            <div className="mb-2 flex min-h-[3.25rem] flex-col items-center justify-center gap-2 text-center">
              {locked ? (
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <p className="text-base font-extrabold text-tuner-good sm:text-lg">
                    Hienoa! {current} on vireessä.
                  </p>
                  <button
                    type="button"
                    className="btn-big !px-6 !py-2 !text-base"
                    onClick={nextString}
                  >
                    {manual ? "JATKA" : "SEURAAVA"}
                  </button>
                </div>
              ) : (
                <p className="text-sm font-bold text-muted-foreground sm:text-base">
                  {manual
                    ? "Valitse kieli klikkaamalla kielen nimeä lavassa."
                    : "Näppää kieltä, jonka nimi näkyy alla."}
                </p>
              )}
            </div>

            <div className="grid items-center gap-3 sm:grid-cols-[auto_minmax(0,1fr)]">
              <div className="mx-auto w-32 sm:w-44">
                <UkuleleHead active={current} {...(manual ? { onSelect: goTo } : {})} />
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="grid w-full max-w-sm grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <div className="min-w-0">
                    <p
                      className={`font-display text-5xl font-extrabold leading-none sm:text-6xl ${
                        state === "intune"
                          ? "text-tuner-good"
                          : state === "close"
                            ? "text-tuner-close"
                            : "text-tuner-off"
                      }`}
                    >
                      {current}
                    </p>
                    <p className="text-sm font-bold text-foreground sm:text-base">
                      Soita {current}-kieltä
                    </p>
                  </div>
                  <img src={konna} alt={konnaAlt} className="h-20 shrink-0 sm:h-24" />
                </div>

                <div className="w-full max-w-[17rem] sm:max-w-xs">
                  <Meter cents={locked ? 0 : cents} state={state} />
                </div>

                <p
                  className="font-display text-lg font-extrabold sm:text-xl"
                  style={{
                    color:
                      state === "intune"
                        ? "var(--tuner-good)"
                        : state === "close"
                          ? "var(--tuner-close)"
                          : "var(--tuner-off)",
                  }}
                >
                  {locked ? "VIREESSÄ!" : guidance}
                </p>
                <p className="h-4 text-xs text-muted-foreground">
                  {reading.freq !== null && cents !== null && !locked
                    ? `${reading.freq.toFixed(1)} Hz · ${cents.toFixed(0)} cents`
                    : ""}
                </p>
              </div>
            </div>
          </section>
        )}


        {phase === "done" && (
          <section className="card-soft w-full max-w-md p-7 text-center">
            <img src={konnaPeukku.url} alt="Iloinen konna näyttää peukkua" className="mx-auto h-44" />
            <h2 className="text-3xl font-extrabold text-primary">Hienoa! Ukulele on vireessä!</h2>
            <p className="mt-3 text-base text-muted-foreground">
              Soita kielet järjestyksessä: G – C – E – A. Jos ne kuulostavat hyvältä, ukulele on
              valmis soittoon.
            </p>
            <button
              type="button"
              className="btn-big mt-5 w-full"
              onClick={() => {
                setTuned([]);
                setLocked(false);
                setCurrent("G");
                setManual(false);
                setPhase("tuning");
              }}
            >
              VIRITÄ UUDELLEEN
            </button>
            <button
              type="button"
              className="btn-soft mt-3 w-full"
              onClick={() => {
                setTuned([]);
                setLocked(false);
                setManual(true);
                setPhase("tuning");
              }}
            >
              VALITSE KIELI
            </button>
          </section>
        )}
      </div>

      <footer className="text-center text-xs text-muted-foreground">
        <p>
          Mikrofonin ääntä käsitellään vain tällä laitteella. Ääntä ei tallenneta eikä lähetetä
          palvelimelle.
        </p>
        <p className="mt-1">www.opitsoittamaan.fi</p>
      </footer>
    </main>
  );
}
