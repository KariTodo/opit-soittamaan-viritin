import ukeNeck from "@/assets/uke-neck-short.png";
import kitaraKaula from "@/assets/kitara-kaula.png.asset.json";
import kansikuva from "@/assets/kansikuva.png.asset.json";
import kitaraKonna from "@/assets/kitara-konna.png.asset.json";
import bassoKaula from "@/assets/basso-kaula.png.asset.json";
import bassoKonna from "@/assets/basso-konna.png.asset.json";
import kannelKaula from "@/assets/kannel-kaula.png.asset.json";
import kannelKonna from "@/assets/kannel-konna.png.asset.json";

export type TunerString = {
  /** Unique id (two strings can share a label, e.g. guitar E) */
  id: string;
  /** Letter shown to the user */
  label: string;
  freq: number;
  /** Peg position in % of the headstock graphic */
  peg: { x: number; y: number };
  /** String path in the 0-100 viewBox of the headstock graphic */
  path: string;
};

export type Instrument = {
  slug: "ukulele" | "kitara" | "basso" | "kannel";
  /** Käyttöliittymän nimi, esim. "Ukulele" */
  name: string;
  /** Sivun otsikko, esim. "Ukuleleviritin" */
  title: string;
  neck: string;
  cover: string;
  /** Peg-nappuloiden koko prosentteina kuvan leveydestä */
  pegSize: number;
  strings: TunerString[];
};

export const UKULELE: Instrument = {
  slug: "ukulele",
  name: "Ukulele",
  title: "Ukuleleviritin",
  neck: ukeNeck,
  cover: kansikuva.url,
  pegSize: 20,
  strings: [
    {
      id: "G",
      label: "G",
      freq: 392.0,
      peg: { x: 33.7, y: 54.4 },
      path: "M 33.7 54.4 L 36.5 74.5 L 36.5 100",
    },
    {
      id: "C",
      label: "C",
      freq: 261.63,
      peg: { x: 34.6, y: 32.8 },
      path: "M 34.6 32.8 L 45.0 74.5 L 45.0 100",
    },
    {
      id: "E",
      label: "E",
      freq: 329.63,
      peg: { x: 65.9, y: 32.8 },
      path: "M 65.9 32.8 L 54.2 74.5 L 54.2 100",
    },
    {
      id: "A",
      label: "A",
      freq: 440.0,
      peg: { x: 66.1, y: 54.4 },
      path: "M 66.1 54.4 L 63.2 74.5 L 63.2 100",
    },
  ],
};

export const KITARA: Instrument = {
  slug: "kitara",
  name: "Kitara",
  title: "Kitaraviritin",
  neck: kitaraKaula.url,
  cover: kitaraKonna.url,
  pegSize: 16,
  strings: [
    {
      id: "E2",
      label: "E",
      freq: 82.41,
      peg: { x: 34.1, y: 58.7 },
      path: "M 34.1 58.7 L 33.6 83.8 L 33.6 100",
    },
    {
      id: "A2",
      label: "A",
      freq: 110.0,
      peg: { x: 34.1, y: 41.0 },
      path: "M 34.1 41.0 L 39.8 83.8 L 39.8 100",
    },
    {
      id: "D3",
      label: "D",
      freq: 146.83,
      peg: { x: 34.1, y: 23.0 },
      path: "M 34.1 23.0 L 46.1 83.8 L 46.1 100",
    },
    {
      id: "G3",
      label: "G",
      freq: 196.0,
      peg: { x: 67.7, y: 23.0 },
      path: "M 67.7 23.0 L 53.5 83.8 L 53.5 100",
    },
    {
      id: "H3",
      label: "H",
      freq: 246.94,
      peg: { x: 67.7, y: 41.0 },
      path: "M 67.7 41.0 L 60.3 83.8 L 60.3 100",
    },
    {
      id: "E4",
      label: "E",
      freq: 329.63,
      peg: { x: 67.7, y: 58.7 },
      path: "M 67.7 58.7 L 67.1 83.8 L 67.1 100",
    },
  ],
};

export function stringOf(instrument: Instrument, id: string) {
  return instrument.strings.find((s) => s.id === id) ?? instrument.strings[0]!;
}

export const BASSO: Instrument = {
  slug: "basso",
  name: "Basso",
  title: "Bassoviritin",
  neck: bassoKaula.url,
  cover: bassoKonna.url,
  pegSize: 15,
  strings: [
    {
      id: "E1",
      label: "E",
      freq: 41.2,
      peg: { x: 41.9, y: 51.6 },
      path: "M 41.9 51.6 L 41.7 67.4 L 41.7 100",
    },
    {
      id: "A1",
      label: "A",
      freq: 55.0,
      peg: { x: 45.9, y: 38.5 },
      path: "M 45.9 38.5 L 47.5 67.4 L 47.5 100",
    },
    {
      id: "D2",
      label: "D",
      freq: 73.42,
      peg: { x: 50.5, y: 24.7 },
      path: "M 50.5 24.7 L 53.3 67.4 L 53.3 100",
    },
    {
      id: "G2",
      label: "G",
      freq: 98.0,
      peg: { x: 54.2, y: 12.2 },
      path: "M 54.2 12.2 L 59.1 67.4 L 59.1 100",
    },
  ],
};

/** Kanteleen kielet pisimmästä lyhimpään: D4, E4, F#4 (mollivireessä F4), G4, A4 */
export function kannel(minor: boolean): Instrument {
  return {
    slug: "kannel",
    name: "Kannel",
    title: "Kanteleviritin",
    neck: kannelKaula.url,
    cover: kannelKonna.url,
    pegSize: 15,
    strings: [
      {
        id: "D4",
        label: "D",
        freq: 293.66,
        peg: { x: 70.8, y: 26.2 },
        path: "M 70.8 26.2 L 70.4 40 L 70.4 100",
      },
      {
        id: "E4",
        label: "E",
        freq: 329.63,
        peg: { x: 60.4, y: 35.8 },
        path: "M 60.4 35.8 L 60.2 48 L 60.2 100",
      },
      {
        id: "F4",
        label: minor ? "F" : "F#",
        freq: minor ? 349.23 : 369.99,
        peg: { x: 50.5, y: 45.3 },
        path: "M 50.5 45.3 L 50.0 57 L 50.0 100",
      },
      {
        id: "G4",
        label: "G",
        freq: 392.0,
        peg: { x: 41.1, y: 54.7 },
        path: "M 41.1 54.7 L 40.3 66 L 40.3 100",
      },
      {
        id: "A4",
        label: "A",
        freq: 440.0,
        peg: { x: 31.0, y: 64.0 },
        path: "M 31.0 64.0 L 30.6 75 L 30.6 100",
      },
    ],
  };
}

export const KANNEL: Instrument = kannel(false);
