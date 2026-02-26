import { useState, useRef, useCallback, useEffect } from 'react';
import { Staff } from './Staff';
import { Palette } from './Palette';
import { generateId } from '#shared/types';
import type {
  Note,
  NoteName,
  Duration,
  Accidental,
  Chord,
} from '#shared/types';
import './JazzSheets.css';
import { NOTE_WIDTH, STAFF_PADDING } from './Staff/utils/constants';

let isInitializing = true;

export function JazzSheets() {
  const [music, setMusic] = useState<(Note | Chord)[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteName | null>('C');
  const [selectedChord, setSelectedChord] = useState<NoteName | null>('C');

  const [selectedDuration, setSelectedDuration] = useState<Duration>('quarter');
  const [selectedAccidental, setSelectedAccidental] = useState<Accidental>('');
  const [isRest, setIsRest] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [rowsStaff, setRowsStaff] = useState<
    { notes: (Note | Chord)[]; position: number }[]
  >([]);

  const animationRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const didLoadFromStorage = useRef(false);
  const skipInitialSave = useRef(false);
  const lastWidthRef = useRef(0);

  //Get the music from the localStorage
  useEffect(() => {
    if (isInitializing) {
      isInitializing = false;
      const savedMusic = localStorage.getItem('music');
      if (savedMusic) {
        setMusic(JSON.parse(savedMusic));
      }
      didLoadFromStorage.current = true;
    }
  }, []);

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

    const newMusic = [...music, newItem].sort(
      (a, b) => a.position - b.position,
    );
    setMusic(newMusic);
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

  /**
   * We pass the actual width of the staff and we use it to calculate the number of notes per row
   * We calculate internally the max width of the staff and we use it to calculate the number of notes per row
   *
   * @param actualWidth - The actual width of the staff
   * @returns void
   */
  const handleMaximumWidthChange = useCallback(
    (actualWidth: number) => {
      lastWidthRef.current = actualWidth;
      const width = STAFF_PADDING * 2 + (music.length + 1) * NOTE_WIDTH;

      //We have enough space, we don't need to have more rows
      if (actualWidth >= width) {
        setRowsStaff([
          {
            notes: music.map((note, i) => ({ ...note, position: i })),
            position: 0,
          },
        ]);
        return;
      }

      /**
       *
       * @param arr - The array of notes or chords
       * @param notesPerRow - The number of notes per row
       * @returns The array of notes or chords grouped by the number of notes per row
       */
      const chunkMusic = (
        arr: (Note | Chord)[],
        notesPerRow: number,
      ): (Note | Chord)[][] => {
        const chunks: (Note | Chord)[][] = [];
        for (let start = 0; start < arr.length; start += notesPerRow) {
          chunks.push(arr.slice(start, start + notesPerRow));
        }
        return chunks;
      };

      const usableWidth = actualWidth - 2 * STAFF_PADDING;
      const notesPerRow = Math.max(1, Math.floor(usableWidth / NOTE_WIDTH));

      //We set the rows staff
      setRowsStaff(
        chunkMusic(music, notesPerRow).map((chunk, index) => ({
          notes: chunk.map((note, i) => ({ ...note, position: i })),
          position: index,
        })),
      );
    },
    [music],
  );

  //useEffect for reacting to changes in the music array and saving the music to the localStorage
  //and for handling the maximum width change of the staff
  useEffect(() => {
    if (!skipInitialSave.current) {
      skipInitialSave.current = true;
      return;
    }
    localStorage.setItem('music', JSON.stringify(music));
    if (lastWidthRef.current !== 0) {
      handleMaximumWidthChange(lastWidthRef.current);
    }
  }, [music, handleMaximumWidthChange]);

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
          <div className="staff-section" style={{ maxWidth: '100%' }}>
            {rowsStaff.length > 0 &&
              rowsStaff.map((row, index) => (
                <div
                  key={row.position}
                  onClick={
                    index === rowsStaff.length - 1
                      ? handleStaffClick
                      : undefined
                  }
                  className="staff-row"
                >
                  <Staff
                    key={row.position}
                    music={row.notes}
                    currentPosition={currentPosition}
                    isPlaying={isPlaying}
                    onNoteClick={
                      index === rowsStaff.length - 1
                        ? handleNoteClick
                        : undefined
                    }
                    onDelete={handleDeletion}
                    onMaximumWidthChange={
                      index === 0 ? handleMaximumWidthChange : undefined
                    }
                  />
                </div>
              ))}
            {rowsStaff.length === 0 && (
              <div className="single-staff" style={{ maxWidth: '100%' }}>
                <Staff
                  music={music}
                  currentPosition={currentPosition}
                  isPlaying={isPlaying}
                  onNoteClick={handleNoteClick}
                  onDelete={handleDeletion}
                  onMaximumWidthChange={handleMaximumWidthChange}
                />
              </div>
            )}
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
