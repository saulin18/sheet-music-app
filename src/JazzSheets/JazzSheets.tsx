import { useState, useRef, useCallback, useEffect } from 'react';
import { Staff } from './Staff';
import { Palette } from './Palette';
import {
  generateId,
} from '#shared/types';
import type {
  Note,
  NoteName,
  Duration,
  Accidental,
  Chord,
} from '#shared/types';
import './JazzSheets.css';

export function JazzSheets() {
  const [music, setMusic] = useState<(Note | Chord)[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteName | null>('C');
  const [selectedChord, setSelectedChord] = useState<NoteName | null>('C');

  const [selectedDuration, setSelectedDuration] = useState<Duration>('quarter');
  const [selectedAccidental, setSelectedAccidental] = useState<Accidental>('');
  const [isRest, setIsRest] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);

  const animationRef = useRef<number | null>(null);
  const positionRef = useRef(0);

  const handleNoteClick = useCallback((position: number) => {
    console.log('noteClick ', position);
  }, []);

  const handleDeletion = (id: string) => {
    setMusic((prev) =>
      prev.filter((n) => n.id !== id).map((n, i) => ({ ...n, position: i })),
    );
  };

  const handleStaffClick = () => {
    if (selectedNote === null && selectedChord === null) return;
    const maxPosition =
      music.length > 0 ? Math.max(...music.map((n) => n.position)) + 1 : 0;
    let newItem: Chord | Note;
    if (selectedNote) {
      newItem = {
        id: generateId(),
        note: selectedNote,
        accidental: selectedAccidental,
        octave: 4,
        duration: selectedDuration,
        position: maxPosition,
        isRest: isRest,
      };
    } else {
      newItem = {
        id: generateId(),
        note: selectedChord,
        duration: selectedDuration,
        position: maxPosition,
        accidental: selectedAccidental,
        features: [],
      };
    }
    setMusic((prev) =>
      [...prev, newItem].sort((a, b) => a.position - b.position),
    );
  };

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    positionRef.current = 0;
    setCurrentPosition(0);
  }, []);

  const handleClear = useCallback(() => {
    setMusic([]);
    handleStop();
  }, [handleStop]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof selectedChord === 'string') {
      setSelectedNote(null);
    }
    if (typeof selectedNote === 'string') {
      setSelectedChord(null);
    }
  }, [selectedChord, selectedNote]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Sheet Music Composer</h1>
        <p className="subtitle">
          Create and play back sheet music in American notation
        </p>
      </header>

      <main className="app-main">
        <div className="main-content">
          <div className="staff-section" onClick={handleStaffClick}>
            <Staff
              music={music}
              currentPosition={currentPosition}
              isPlaying={isPlaying}
              onNoteClick={handleNoteClick}
              onDelete={handleDeletion}
            />
          </div>

          <Palette
            selectedNote={selectedNote}
            selectedChord={selectedChord}
            selectedDuration={selectedDuration}
            selectedAccidental={selectedAccidental}
            isRest={isRest}
            onNoteSelect={setSelectedNote}
            onChordSelect={setSelectedChord}
            onDurationSelect={setSelectedDuration}
            onAccidentalToggle={setSelectedAccidental}
            onRestToggle={() => setIsRest(!isRest)}
            onClear={handleClear}
          />
        </div>
      </main>
    </div>
  );
}
