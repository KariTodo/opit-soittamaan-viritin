import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Meter } from "@/components/tuner/Meter";
import { UkuleleHead } from "@/components/tuner/UkuleleHead";
import { useTuner } from "@/hooks/useTuner";
import { centsBetween } from "@/lib/pitch";
import { STRING_ORDER, freqOf, type StringName } from "@/lib/strings";
import logo from "@/assets/logo.png.asset.json";
import konnaKorvat from "@/assets/konna-korvat.png.asset.json";
import konnaTuumii from "@/assets/konna-lahella.png.asset.json";
import konnaPeukku from "@/assets/konna-peukku.png.asset.json";
import konnaNeutraali from "@/assets/konna-neutraali.png.asset.json";
import kansikuva from "@/assets/kansikuva.png.asset.json";

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
  const [hasHeard, setHasHeard] = useState(false);
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

  useEffect(() => {
    if (phase === "tuning" && reading.freq !== null && !hasHeard) {
      setHasHeard(true);
    }
  }, [phase, reading.freq, hasHeard]);

  const goTo = useCallback((s: StringName) => {
    if (holdRef.current !== null) {
      window.clearTimeout(holdRef.current);
      holdRef.current = null;
    }
    setCurrent(s);
    setLocked(false);
    setHasHeard(false);
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
        setHasHeard(false);
        setPhase("tuning");
      }
    },
    [start],
  );

  const guidance =
    state === "intune"
      ? "Vireessä!"
      : state === "unknown"
        ? hasHeard
          ? "Soita kieli uudelleen"
          : "Soita kieltä mikrofonin lähellä."
        : state === "close"
          ? "Melkein oikein – säädä vähän"
          : cents !== null && cents < 0
            ? "Alavire – kiristä kieltä vähän"
            : "Ylävire – löysää kieltä vähän";

  const absCents = cents === null ? null : Math.abs(cents);
  const showDirection = cents !== null && !locked && state !== "intune";
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
        ? "Konna näyttää sormillaan, että vire on lähellä"
        : konna === konnaKorvat.url
          ? "Konna pitää käsiä korvillaan"
          : "Konna odottaa rauhallisena";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 pb-3 pt-3">
      <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-2 sm:items-center sm:gap-3">
        <img
          src={logo.url}
          alt="Opit soittamaan!"
          className="h-10 w-10 shrink-0 sm:h-14 sm:w-14"
        />
        <div className="min-w-0 self-center">
          <h1 className="truncate text-lg font-extrabold text-primary sm:text-2xl">
            Ukuleleviritin
          </h1>
          <a
            href="https://www.opitsoittamaan.fi"
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-xs font-bold text-muted-foreground underline hover:text-primary sm:text-sm"
          >
            www.opitsoittamaan.fi
          </a>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-1.5 self-start">
          <div className="flex flex-col items-stretch gap-1 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              className="btn-soft whitespace-nowrap !px-2.5 !py-1 text-xs sm:!px-3 sm:text-sm"
              aria-pressed={muted}
            >
              {muted ? "🔇 Äänet pois" : "🔊 Äänet"}
            </button>
            {phase !== "start" && (
              <button
                type="button"
                className="btn-soft whitespace-nowrap !px-2.5 !py-1 text-xs sm:!px-3 sm:text-sm"
                onClick={() => {
                  setPhase("start");
                  setLocked(false);
                  setTuned([]);
                  setCurrent("G");
                }}
              >
                Alkuun
              </button>
            )}
          </div>
        </div>
      </header>


      <div className="flex flex-1 flex-col items-center justify-center py-2">
        {phase === "start" && (
          <section className="card-soft w-full max-w-md p-7 text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Opit soittamaan!
            </p>
            <h2 className="text-3xl font-extrabold text-primary">Ukuleleviritin</h2>
            <p className="mt-2 text-lg text-muted-foreground">Ukulele vireeseen helposti!</p>
            <img
              src={kansikuva.url}
              alt="Konna ukulele kädessään"
              className="mx-auto my-4 h-52 w-auto sm:h-64"
            />
            <button type="button" className="btn-big w-full" onClick={() => beginTuning(false)}>
              ALOITA VIRITYS
            </button>
            <button
              type="button"
              className="btn-soft mt-3 w-full"
              onClick={() => beginTuning(true)}
            >
              Valitse viritettävä kieli itse
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
            <div className="mb-1 flex min-h-[2.5rem] flex-col items-center justify-center gap-1 text-center">
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
                    {manual ? "JATKA" : "Seuraava kieli"}
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

            {/* Kaula + konna vierekkäin, keskitettynä */}
            <div className="flex items-center justify-center gap-2 sm:gap-8">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-40 sm:w-56">
                  <UkuleleHead active={current} {...(manual ? { onSelect: goTo } : {})} />
                </div>
                <div
                  className={`flex w-16 shrink-0 flex-col items-center sm:w-20 ${
                    showDirection ? "text-tuner-good" : "text-muted-foreground"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="grid h-6 w-6 place-items-center sm:h-7 sm:w-7"
                  >
                    {showDirection ? (
                      cents! < 0 ? (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-full w-full"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 19V5M5 12l7-7 7 7" />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-full w-full"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 5v14M5 12l7 7 7-7" />
                        </svg>
                      )
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-full w-full"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 9v6M8 9l4-4 4 4M8 15l4 4 4-4" />
                      </svg>
                    )}
                  </span>
                  <span className="text-center text-[10px] font-bold leading-tight sm:text-xs">
                    {showDirection
                      ? cents! < 0
                        ? "kiristä kieltä"
                        : "löystä kieltä"
                      : "Soita kieltä"}
                  </span>
                </div>
              </div>
              <img src={konna} alt={konnaAlt} className="h-28 w-auto sm:h-56" />
            </div>

            {/* Ohje ja sävelkirjain mittarin yläkulmissa */}
            <div className="mx-auto w-full max-w-[17rem] sm:max-w-sm">
              <div className="flex items-end justify-between gap-2 px-1">
                <p className="text-base font-bold text-foreground sm:text-lg">
                  Soita {current}-kieltä
                </p>
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
              </div>

              <div className="-mt-1 flex justify-center">
                <Meter cents={locked ? 0 : cents} state={state} />
              </div>
            </div>


            {/* Palaute mittarin alla */}
            <div className="mt-1 flex flex-col items-center text-center">

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

      <footer className="text-center text-[10px] leading-tight text-muted-foreground sm:text-xs">
        <p>
          Mikrofonin ääntä käsitellään vain tällä laitteella. Ääntä ei tallenneta eikä lähetetä
          palvelimelle.
        </p>
        <p className="mt-1 hidden sm:block">www.opitsoittamaan.fi</p>
      </footer>
    </main>
  );
}
