import { useCallback, useEffect, useRef, useState } from "react";
import { detectPitch } from "@/lib/pitch";

export type MicStatus = "idle" | "requesting" | "granted" | "denied" | "error";

export type Reading = {
  freq: number | null;
  clarity: number;
};

export function useTuner() {
  const [micStatus, setMicStatus] = useState<MicStatus>("idle");
  const [reading, setReading] = useState<Reading>({ freq: null, clarity: 0 });

  const ctxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const bufRef = useRef<Float32Array | null>(null);
  const historyRef = useRef<number[]>([]);
  const pausedRef = useRef(false);
  const missesRef = useRef(0);

  const loop = useCallback(() => {
    rafRef.current = requestAnimationFrame(loop);
    const analyser = analyserRef.current;
    const ctx = ctxRef.current;
    const buf = bufRef.current;
    if (!analyser || !ctx || !buf) return;
    if (pausedRef.current) return;

    analyser.getFloatTimeDomainData(buf);
    const res = detectPitch(buf, ctx.sampleRate);

    if (!res) {
      missesRef.current += 1;
      if (missesRef.current > 20) {
        historyRef.current = [];
        setReading({ freq: null, clarity: 0 });
      }
      return;
    }
    missesRef.current = 0;

    const hist = historyRef.current;
    // Octave sanity: snap readings that are a clean octave off the running median
    const prevMedian = median(hist);
    let f = res.freq;
    if (prevMedian) {
      if (f / prevMedian > 1.9 && f / prevMedian < 2.1) f /= 2;
      else if (prevMedian / f > 1.9 && prevMedian / f < 2.1) f *= 2;
    }
    hist.push(f);
    if (hist.length > 7) hist.shift();

    const m = median(hist);
    if (m) setReading({ freq: m, clarity: res.clarity });
  }, []);

  const start = useCallback(async () => {
    if (micStatus === "granted") return true;
    setMicStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      streamRef.current = stream;
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      await ctx.resume();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 4096;
      source.connect(analyser);
      ctxRef.current = ctx;
      analyserRef.current = analyser;
      bufRef.current = new Float32Array(analyser.fftSize);
      setMicStatus("granted");
      rafRef.current = requestAnimationFrame(loop);
      return true;
    } catch (err) {
      const name = (err as DOMException)?.name;
      setMicStatus(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "error");
      return false;
    }
  }, [loop, micStatus]);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    void ctxRef.current?.close();
    ctxRef.current = null;
    analyserRef.current = null;
    historyRef.current = [];
    setReading({ freq: null, clarity: 0 });
    setMicStatus("idle");
  }, []);

  useEffect(() => () => stop(), [stop]);

  /** Play a short chime while the microphone analysis is paused. */
  const playSuccess = useCallback((freq: number) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    pausedRef.current = true;
    historyRef.current = [];
    const now = ctx.currentTime;
    [freq, freq * 2].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(i === 0 ? 0.25 : 0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1);
    });
    window.setTimeout(() => {
      pausedRef.current = false;
      historyRef.current = [];
    }, 1200);
  }, []);

  const pauseFor = useCallback((ms: number) => {
    pausedRef.current = true;
    window.setTimeout(() => {
      pausedRef.current = false;
      historyRef.current = [];
    }, ms);
  }, []);

  return { micStatus, reading, start, stop, playSuccess, pauseFor };
}

function median(values: number[]) {
  if (values.length === 0) return null;
  const s = [...values].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}
