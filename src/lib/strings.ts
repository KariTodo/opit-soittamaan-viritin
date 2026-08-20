export type StringName = "G" | "C" | "E" | "A";

export const STRINGS: { name: StringName; freq: number }[] = [
  { name: "G", freq: 392.0 },
  { name: "C", freq: 261.63 },
  { name: "E", freq: 329.63 },
  { name: "A", freq: 440.0 },
];

export const STRING_ORDER: StringName[] = ["G", "C", "E", "A"];

export function freqOf(name: StringName) {
  return STRINGS.find((s) => s.name === name)!.freq;
}
