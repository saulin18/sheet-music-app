import type { NoteName, Note } from "#shared/types";
import { LINE_SPACING, STAFF_TOP } from "./constants";

export const getNoteY = (note: Note): number => {
  const rawY = noteToYPosition(note.note, note.octave);
  const middleLineY = STAFF_TOP - 10;
  return middleLineY - rawY * (LINE_SPACING / 2);
};

export function noteToYPosition(note: NoteName, octave: number): number {
  const notePositions: Record<NoteName, number> = {
    C: 0,
    D: 1,
    E: 2,
    F: 3,
    G: 4,
    A: 5,
    B: 6,
  };
  
  const basePosition = notePositions[note];
  const octaveOffset = (octave - 4) * 7;
  
  return basePosition + octaveOffset;
}