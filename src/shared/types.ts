export type NoteName = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export type Accidental = '' | '#' | 'b';
export type Duration = 'whole' | 'half' | 'quarter' | 'eighth';

export interface Note {
  id: string;
  note: NoteName | null;
  accidental: Accidental;
  octave: number;
  duration: Duration;
  position: number;
  isRest: boolean;
}

export interface Chord {
  id: string;
  note: NoteName | null;
  position: number;
  duration: Duration;
  accidental: Accidental;
  features: Feature[];
}

export interface Feature {
  name: string;
  value: string;
}

export interface Song {
  id: string;
  name: string;
  notesAndChords: (Note | Chord)[];
  tempo: number;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
