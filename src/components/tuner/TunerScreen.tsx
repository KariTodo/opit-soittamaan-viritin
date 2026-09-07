import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Meter } from "@/components/tuner/Meter";
import { HeadStock } from "@/components/tuner/HeadStock";
import { useTuner } from "@/hooks/useTuner";
import { centsBetween } from "@/lib/pitch";
import type { Instrument } from "@/lib/instruments";
import logo from "@/assets/logo.png.asset.json";
import konnaKorvat from "@/assets/konna-korvat.png.asset.json";
import konnaTuumii from "@/assets/konna-lahella.png.asset.json";
import konnaPeukku from "@/assets/konna-peukku.png.asset.json";
import konnaNeutraali from "@/assets/konna-neutraali.png.asset.json";

type Phase = "start" | "mic" | "tuning" | "done";
type TuneState = "off" | "close" | "intune" | "unknown";

export function TunerScreen({ instrument }: { instrument: Instrument }) {
  const { micStatus, reading, start, playSuccess, pauseFor } = useTuner();
  const firstId = instrument.strings[0]!.id;
  const [phase, setPhase] = useState<Phase>("start");
  const [manual, setManual] = useState(false);
  const [current, setCurrent] = useState<string>(firstId);
  const [tuned, setTuned] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const [muted, setMuted] = useState(false);
  const [hasHeard, setHasHeard] = useState(false);
  const holdRef = useRef<number | null>(null);

  const currentString =
    instrument.strings.find((s) => s.id === current) ?? instrument.strings[0]!;
  const target = currentString.freq;
  const label = currentString.label;
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

  const goTo = useCallback((s: string) => {
    if (holdRef.current !== null) {
      window.clearTimeout(holdRef.current);
      holdRef.current = null;
    }
    setCurrent(s);
    setLocked(false);
    setHasHeard(false);
  }, []);

  const nextString = useCallback(() => {
    const remaining = instrument.strings
      .map((s) => s.id)
      .filter((s) => s !== current && !tuned.includes(s));
    if (manual) {
      setLocked(false);
      return;
    }
    if (remaining.length === 0) {
      setPhase("done");
      return;
    }
    goTo(remaining[0]!);
  }, [current, tuned, manual, goTo, instrument]);

  const beginTuning = useCallback(
    async (manualMode: boolean) => {
      setManual(manualMode);
      setPhase("mic");
      const ok = await start();
      if (ok) {
        setTuned([]);
        setLocked(false);
        setCurrent(firstId);
        setHasHeard(false);
        setPhase("tuning");
      }
    },
    [start, firstId],
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

  const order = instrument.strings.map((s) => s.label).join(" – ");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 pb-2 pt-2 sm:pb-3 sm:pt-3">
      <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-2 sm:items-center sm:gap-3">
        <img
          src={logo.url}
          alt="Opit soittamaan!"
          className="h-10 w-10 shrink-0 sm:h-14 sm:w-14"
        />
        <div className="min-w-0 self-center">
          <h1 className="truncate text-lg font-extrabold text-primary sm:text-2xl">
            {instrument.title}
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
            <Link
              to="/"
              className="btn-soft whitespace-nowrap !px-2.5 !py-1 text-center text-xs sm:!px-3 sm:text-sm"
            >
              Alkuun
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center py-1 sm:py-2">
        {phase === "start" && (
          <section className="card-soft w-full max-w-md p-7 text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Opit soittamaan!
            </p>
            <h2 className="text-3xl font-extrabold text-primary">{instrument.title}</h2>
            <img
              src={instrument.cover}
              alt={`Konna ja ${instrument.name.toLowerCase()}`}
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
              Tarvitsen mikrofonin kuullakseni soittimesi.
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
            <div className="mb-0 flex min-h-[1.75rem] flex-col items-center justify-center gap-1 text-center sm:min-h-[1.75rem]">
              {locked ? (
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <p className="text-base font-extrabold text-tuner-good sm:text-lg">
                    Hienoa! {label} on vireessä.
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
                    ? "Valitse kieli klikkaamalla kielen kirjainta."
                    : "Näppää kieltä, jonka nimi näkyy alla."}
                </p>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 sm:gap-6">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-40 sm:w-56">
                  <HeadStock
                    instrument={instrument}
                    active={current}
                    {...(manual ? { onSelect: goTo } : {})}
                  />
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
              <img src={konna} alt={konnaAlt} className="h-28 w-auto sm:h-44" />
            </div>

            <div className="mx-auto w-full max-w-[17rem] sm:max-w-xs">
              <div className="flex items-end justify-between gap-2 px-1">
                <p className="text-base font-bold text-foreground sm:text-lg">
                  Soita {label}-kieltä
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
                  {label}
                </p>
              </div>

              <div className="-mt-1 flex justify-center">
                <Meter cents={locked ? 0 : cents} state={state} />
              </div>
            </div>

            <div className="mt-0 flex flex-col items-center text-center sm:mt-1">
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
            <img
              src={konnaPeukku.url}
              alt="Iloinen konna näyttää peukkua"
              className="mx-auto h-44"
            />
            <h2 className="text-3xl font-extrabold text-primary">
              Hienoa! {instrument.name} on vireessä!
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Soita kielet järjestyksessä: {order}. Jos ne kuulostavat hyvältä, soitin on valmis
              soittoon.
            </p>
            <button
              type="button"
              className="btn-big mt-5 w-full"
              onClick={() => {
                setTuned([]);
                setLocked(false);
                setCurrent(firstId);
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

      {phase === "tuning" && (
        <div className="mb-2 flex justify-end px-2 pb-0 sm:mb-3 sm:px-3">
          <button
            type="button"
            className="btn-soft max-w-[11rem] whitespace-normal leading-tight !px-4 !py-2.5 text-sm font-extrabold shadow-md ring-1 ring-primary/20 sm:max-w-none sm:whitespace-nowrap sm:text-base"
            onClick={() => {
              setManual((m) => !m);
              setLocked(false);
            }}
          >
            {manual ? "Automaattinen kielen valinta" : "Valitse kieli itse"}
          </button>
        </div>
      )}

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
