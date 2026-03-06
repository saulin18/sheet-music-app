import { describe, it, expect } from 'vitest';
import { NOTE_NAMES, DURATIONS, DURATION_BEATS } from './constants';
import { generateId, type Note, type Chord, type Song } from './types';

describe('shared/constants', () => {
  it('exports NOTE_NAMES correctly', () => {
    expect(NOTE_NAMES).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  });

  it('exports DURATIONS correctly', () => {
    expect(DURATIONS).toEqual(['whole', 'half', 'quarter', 'eighth']);
  });

  it('exports DURATION_BEATS correctly', () => {
    expect(DURATION_BEATS).toEqual({
      whole: 4,
      half: 2,
      quarter: 1,
      eighth: 0.5,
    });
  });

  it('DURATION_BEATS has correct values for all durations', () => {
    DURATIONS.forEach((duration) => {
      expect(DURATION_BEATS[duration]).toBeDefined();
      expect(typeof DURATION_BEATS[duration]).toBe('number');
    });
  });
});

describe('shared/types', () => {
  describe('generateId', () => {
    it('generates a string id', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
    });

    it('generates unique ids', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(generateId());
      }
      expect(ids.size).toBe(100);
    });

    it('generates ids with expected length', () => {
      const id = generateId();
      expect(id.length).toBeGreaterThanOrEqual(7);
    });
  });

  describe('type definitions', () => {
    it('creates a valid Note object', () => {
      const note: Note = {
        id: '1',
        note: 'C',
        accidental: '#',
        octave: 4,
        duration: 'quarter',
        position: 0,
        isRest: false,
      };
      expect(note.note).toBe('C');
      expect(note.accidental).toBe('#');
    });

    it('creates a valid Chord object', () => {
      const chord: Chord = {
        id: '1',
        note: 'C',
        position: 0,
        duration: 'quarter',
        accidental: '',
        features: [{ name: 'type', value: 'major' }],
      };
      expect(chord.note).toBe('C');
      expect(chord.features).toHaveLength(1);
    });

    it('creates a valid Song object', () => {
      const song: Song = {
        id: '1',
        name: 'Test Song',
        notesAndChords: [],
        tempo: 120,
      };
      expect(song.name).toBe('Test Song');
      expect(song.tempo).toBe(120);
    });

    it('allows null notes', () => {
      const note: Note = {
        id: '1',
        note: null,
        accidental: '',
        octave: 4,
        duration: 'quarter',
        position: 0,
        isRest: true,
      };
      expect(note.note).toBeNull();
    });
  });
});
