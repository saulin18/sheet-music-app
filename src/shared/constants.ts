import type { Duration, NoteName } from './types';

export const NOTE_NAMES: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const DURATIONS: Duration[] = ['whole', 'half', 'quarter', 'eighth'];

export const DURATION_BEATS: Record<Duration, number> = {
  whole: 4,
  half: 2,
  quarter: 1,
  eighth: 0.5,
};

export const STAFF_TOP = 60;
export const LINE_SPACING = 12;
export const NOTE_WIDTH = 30;
export const STAFF_PADDING = 40;
export const BEATS_PER_MEASURE = 4;
