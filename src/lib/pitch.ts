// McLeod Pitch Method (NSDF + peak picking). Runs fully in the browser.
export function detectPitch(
  buf: Float32Array,
  sampleRate: number,
): { freq: number; clarity: number } | null {
  const size = buf.length;

  // RMS gate: ignore silence / very quiet input
  let sumSq = 0;
  for (let i = 0; i < size; i++) sumSq += buf[i] * buf[i];
  const rms = Math.sqrt(sumSq / size);
  if (rms < 0.008) return null;

  const minFreq = 120; // below C4 with margin
  const maxFreq = 700; // above A4 with margin
  const minLag = Math.floor(sampleRate / maxFreq);
  const maxLag = Math.min(Math.floor(sampleRate / minFreq), Math.floor(size / 2));

  const nsdf = new Float32Array(maxLag + 1);
  for (let lag = minLag; lag <= maxLag; lag++) {
    let acf = 0;
    let div = 0;
    for (let i = 0; i < size - lag; i++) {
      acf += buf[i] * buf[i + lag];
      div += buf[i] * buf[i] + buf[i + lag] * buf[i + lag];
    }
    nsdf[lag] = div > 0 ? (2 * acf) / div : 0;
  }

  // Collect maxima between positive zero crossings
  const peaks: number[] = [];
  let lag = minLag;
  while (lag < maxLag && nsdf[lag] > 0) lag++; // skip initial positive block
  while (lag < maxLag) {
    if (nsdf[lag] > 0 && nsdf[lag - 1] <= 0) {
      let best = lag;
      while (lag < maxLag && nsdf[lag] > 0) {
        if (nsdf[lag] > nsdf[best]) best = lag;
        lag++;
      }
      peaks.push(best);
    } else {
      lag++;
    }
  }
  if (peaks.length === 0) return null;

  let highest = 0;
  for (const p of peaks) if (nsdf[p] > highest) highest = nsdf[p];
  if (highest < 0.6) return null;

  // Pick the first peak above threshold -> avoids octave-too-high errors
  const threshold = highest * 0.9;
  let chosen = peaks[0];
  for (const p of peaks) {
    if (nsdf[p] >= threshold) {
      chosen = p;
      break;
    }
  }

  // Parabolic interpolation around the chosen lag
  const y0 = nsdf[chosen - 1] ?? nsdf[chosen];
  const y1 = nsdf[chosen];
  const y2 = nsdf[chosen + 1] ?? nsdf[chosen];
  const denom = 2 * (2 * y1 - y0 - y2);
  const shift = denom !== 0 ? (y2 - y0) / denom : 0;
  const trueLag = chosen + shift;
  const freq = sampleRate / trueLag;
  if (!isFinite(freq) || freq < minFreq || freq > maxFreq) return null;

  return { freq, clarity: nsdf[chosen] };
}

export function centsBetween(freq: number, target: number) {
  return 1200 * Math.log2(freq / target);
}
