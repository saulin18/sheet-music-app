import type { Duration, NoteName } from "./types";

export const NOTE_NAMES: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const DURATIONS: Duration[] = ['whole', 'half', 'quarter', 'eighth'];

export const DURATION_BEATS: Record<Duration, number> = {
  whole: 4,
  half: 2,
  quarter: 1,
  eighth: 0.5,
};
