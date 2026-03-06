import { describe, it, expect } from 'vitest';
import {
  LINE_SPACING,
  NOTE_WIDTH,
  STAFF_PADDING,
  STAFF_TOP,
  BEATS_PER_MEASURE,
} from './constants';
import { getNoteY, noteToYPosition } from './getNoteY';
import { renderStaffLines } from './renderStaffLines';
import { renderLedgerLines } from './renderLedgerLines';
import type { Note } from '#shared/types';

describe('JazzSheets/Staff/utils/constants', () => {
  it('exports LINE_SPACING correctly', () => {
    expect(LINE_SPACING).toBe(12);
  });

  it('exports NOTE_WIDTH correctly', () => {
    expect(NOTE_WIDTH).toBe(30);
  });

  it('exports STAFF_PADDING correctly', () => {
    expect(STAFF_PADDING).toBe(40);
  });

  it('exports STAFF_TOP correctly', () => {
    expect(STAFF_TOP).toBe(60);
  });

  it('exports BEATS_PER_MEASURE correctly', () => {
    expect(BEATS_PER_MEASURE).toBe(4);
  });
});

describe('JazzSheets/Staff/utils/getNoteY', () => {
  const createNote = (note: Note['note'], octave: number): Note => ({
    id: '1',
    note,
    accidental: '',
    octave,
    duration: 'quarter',
    position: 0,
    isRest: false,
  });

  it('returns correct Y position for middle C (C4)', () => {
    const note = createNote('C', 4);
    const y = getNoteY(note);
    expect(y).toBe(STAFF_TOP - 10);
  });

  it('returns correct Y position for D4', () => {
    const note = createNote('D', 4);
    const y = getNoteY(note);
    expect(y).toBeLessThan(STAFF_TOP - 10);
  });

  it('returns correct Y position for B4 (above middle line)', () => {
    const note = createNote('B', 4);
    const y = getNoteY(note);
    expect(y).toBeLessThan(STAFF_TOP - 10);
  });

  it('returns correct Y position for lower octaves', () => {
    const noteC3 = createNote('C', 3);
    const noteC4 = createNote('C', 4);
    const yC3 = getNoteY(noteC3);
    const yC4 = getNoteY(noteC4);
    expect(yC3).toBeGreaterThan(yC4);
  });

  it('handles null note (rest)', () => {
    const rest: Note = {
      id: '1',
      note: null,
      accidental: '',
      octave: 4,
      duration: 'quarter',
      position: 0,
      isRest: true,
    };
    const y = getNoteY(rest);
    expect(y).toBe(STAFF_TOP - 10);
  });

  describe('noteToYPosition', () => {
    it('returns 0 for C', () => {
      expect(noteToYPosition('C', 4)).toBe(0);
    });

    it('returns increasing values for higher notes', () => {
      expect(noteToYPosition('D', 4)).toBe(1);
      expect(noteToYPosition('E', 4)).toBe(2);
      expect(noteToYPosition('F', 4)).toBe(3);
    });

    it('handles octave changes correctly', () => {
      expect(noteToYPosition('C', 5)).toBe(7);
      expect(noteToYPosition('C', 3)).toBe(-7);
    });
  });
});

describe('JazzSheets/Staff/utils/renderStaffLines', () => {
  it('renders 5 staff lines', () => {
    const lines = renderStaffLines();
    expect(lines).toHaveLength(5);
  });

  it('renders staff lines with correct positions', () => {
    const lines = renderStaffLines();
    lines.forEach((line, i) => {
      expect(line.props.style.top).toBe(STAFF_TOP + i * LINE_SPACING);
    });
  });

  it('renders staff lines with correct className', () => {
    const lines = renderStaffLines();
    lines.forEach((line) => {
      expect(line.props.className).toBe('staff-line');
    });
  });
});

describe('JazzSheets/Staff/utils/renderLedgerLines', () => {
  it('renders ledger lines for middle C position', () => {
    const y = STAFF_TOP - 10;
    const lines = renderLedgerLines(y);
    expect(lines).toHaveLength(1);
  });

  it('renders ledger lines for notes above staff', () => {
    const highY = 10;
    const lines = renderLedgerLines(highY);
    expect(lines).toBeTruthy();
  });

  it('renders ledger lines below staff for low notes', () => {
    const lowY = STAFF_TOP + 60;
    const lines = renderLedgerLines(lowY);
    expect(lines).toBeTruthy();
  });

  it('renders ledger lines with correct className', () => {
    const highY = STAFF_TOP - 30;
    const lines = renderLedgerLines(highY);
    if (Array.isArray(lines)) {
      lines.forEach((line) => {
        expect(line.props.className).toBe('ledger-line');
      });
    }
  });
});
