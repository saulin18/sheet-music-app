import { useState, useRef, useCallback, useEffect } from 'react';
import { Staff } from './Staff';
import { Palette } from './Palette';
import { PlaybackControls } from './PlaybackControls';
import { SongList } from './SongList';
import { generateId } from '#shared/types';
import { DURATION_BEATS } from '#shared/constants';
import type {
  Note,
  NoteName,
  Duration,
  Accidental,
  Chord,
  Song,
} from '#shared/types';
import './JazzSheets.css';

export function JazzSheets() {
  const [music, setMusic] = useState<(Note | Chord)[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteName | null>('C');
  const [selectedNoteOctave, setSelectedNoteOctave] = useState<number>(4);
  const [selectedChord, setSelectedChord] = useState<NoteName | null>('C');

  const [selectedDuration, setSelectedDuration] = useState<Duration>('quarter');
  const [selectedAccidental, setSelectedAccidental] = useState<Accidental>('');
  const [isRest, setIsRest] = useState<boolean>(false);
  const [tempo, setTempo] = useState<number>(120);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPosition, setCurrentPosition] = useState<number>(0);

  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const positionRef = useRef<number>(0);

  const getTotalBeats = useCallback(() => {
    return music.reduce(
      (total, note) => total + DURATION_BEATS[note.duration],
      0,
    );
  }, [music]);

  const handleNoteClick = useCallback((position: number) => {
    console.log('noteClick ', position);
    // setMusic((prev) => prev.filter((n) => n.position !== position));
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
        octave: selectedNoteOctave,
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

  const handlePlay = useCallback(() => {
    if (music.length === 0) return;

    setIsPlaying(true);
    positionRef.current = currentPosition;
    lastTimeRef.current = performance.now();

    const animate = (time: number) => {
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      const beatsPerSecond = tempo / 60;
      positionRef.current += delta * beatsPerSecond;

      const totalBeats = getTotalBeats();
      if (positionRef.current >= totalBeats) {
        positionRef.current = 0;
        setCurrentPosition(0);
        setIsPlaying(false);
        return;
      }

      setCurrentPosition(positionRef.current);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [music.length, tempo, currentPosition, getTotalBeats]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setCurrentPosition(positionRef.current);
  }, []);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    positionRef.current = 0;
    setCurrentPosition(0);
  }, []);

  const handleTempoChange = useCallback((newTempo: number) => {
    setTempo(newTempo);
  }, []);

  const handleLoadSong = useCallback(
    (song: Song) => {
      setMusic(song.notesAndChords);
      setTempo(song.tempo);
      handleStop();
    },
    [handleStop],
  );

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
          <div className="palette-and-saved-songs">
            <Palette
              selectedNote={selectedNote}
              selectedChord={selectedChord}
              selectedDuration={selectedDuration}
              selectedAccidental={selectedAccidental}
              isRest={isRest}
              selectedNoteOctave={selectedNoteOctave}
              setSelectedNoteOctave={setSelectedNoteOctave}
              onNoteSelect={setSelectedNote}
              onChordSelect={setSelectedChord}
              onDurationSelect={setSelectedDuration}
              onAccidentalToggle={setSelectedAccidental}
              onRestToggle={() => setIsRest(!isRest)}
              onClear={handleClear}
            />
            <SongList
              currentNotes={music}
              currentTempo={tempo}
              onLoadSong={handleLoadSong}
            />
          </div>

          <PlaybackControls
            isPlaying={isPlaying}
            tempo={tempo}
            onPlay={handlePlay}
            onPause={handlePause}
            onStop={handleStop}
            onTempoChange={handleTempoChange}
          />
        </div>
      </main>
    </div>
  );
}
