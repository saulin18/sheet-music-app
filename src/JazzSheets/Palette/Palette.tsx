import React from 'react';
import './Palette.css';
import type { Accidental, Duration, NoteName } from '#shared/types';
import { DURATIONS, NOTE_NAMES } from '#shared/constants';

interface PaletteProps {
  selectedNote: NoteName | null;
  selectedChord: NoteName | null;
  selectedDuration: Duration;
  selectedAccidental: Accidental;
  isRest: boolean;
  onNoteSelect: (note: NoteName) => void;
  onChordSelect: (note: NoteName) => void;
  onDurationSelect: (duration: Duration) => void;
  onAccidentalToggle: (accidental: Accidental) => void;
  onRestToggle: () => void;
  onClear: () => void;
}

export const Palette: React.FC<PaletteProps> = ({
  selectedNote,
  selectedChord,
  selectedDuration,
  selectedAccidental,
  isRest,
  onNoteSelect,
  onChordSelect,
  onDurationSelect,
  onAccidentalToggle,
  onRestToggle,
  onClear,
}) => {
  return (
    <div className="note-palette">
      <div className="palette-section">
        <h3>Note</h3>
        <div className="palette-buttons">
          {NOTE_NAMES.map((note) => (
            <button
              key={note}
              className={`palette-btn ${selectedNote === note && !isRest ? 'active' : ''}`}
              onClick={() => onNoteSelect(note)}
            >
              {note}
            </button>
          ))}
        </div>
      </div>
      <div className="palette-section">
        <h3>Chord</h3>
        <div className="palette-buttons">
          {NOTE_NAMES.map((note) => (
            <button
              key={note}
              className={`palette-btn ${selectedChord === note && !isRest ? 'active' : ''}`}
              onClick={() => onChordSelect(note)}
            >
              {note}
            </button>
          ))}
        </div>
      </div>

      <div className="palette-section">
        <h3>Duration</h3>
        <div className="palette-buttons">
          {DURATIONS.map((duration) => (
            <button
              key={duration}
              className={`palette-btn ${selectedDuration === duration ? 'active' : ''}`}
              onClick={() => onDurationSelect(duration)}
            >
              {duration === 'whole' && '1'}
              {duration === 'half' && '1/2'}
              {duration === 'quarter' && '1/4'}
              {duration === 'eighth' && '1/8'}
            </button>
          ))}
        </div>
      </div>

      <div className="palette-section">
        <h3>Accidental</h3>
        <div className="palette-buttons">
          <button
            className={`palette-btn ${selectedAccidental === '' ? 'active' : ''}`}
            onClick={() => onAccidentalToggle('')}
          >
            Natural (♮)
          </button>
          <button
            className={`palette-btn ${selectedAccidental === '#' ? 'active' : ''}`}
            onClick={() => onAccidentalToggle('#')}
          >
            ♯
          </button>
          <button
            className={`palette-btn ${selectedAccidental === 'b' ? 'active' : ''}`}
            onClick={() => onAccidentalToggle('b')}
          >
            ♭
          </button>
        </div>
      </div>

      <div className="palette-section">
        <h3>Rest</h3>
        <div className="palette-buttons">
          <button
            className={`palette-btn ${isRest ? 'active' : ''}`}
            onClick={onRestToggle}
          >
            Rest
          </button>
        </div>
      </div>

      <div className="palette-section">
        <h3>Controls</h3>
        <button className="palette-btn clear-btn" onClick={onClear}>
          Clear
        </button>
      </div>
    </div>
  );
};
