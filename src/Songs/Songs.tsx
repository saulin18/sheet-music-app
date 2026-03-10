import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Staff } from '../JazzSheets/Staff';
import { PlaybackControls } from '../JazzSheets/PlaybackControls';
import type { Song, Note, Chord } from '#shared/types';
import { DURATION_BEATS, NOTE_WIDTH, STAFF_PADDING } from '#shared/constants';
import './Songs.css';

const STORAGE_KEY = 'sheet-music-songs';

export function Songs() {
  const navigate = useNavigate();
  const [songs, setSongs] = useState<Song[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  });
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [music, setMusic] = useState<(Note | Chord)[]>([]);
  const [tempo, setTempo] = useState<number>(120);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [rowsStaff, setRowsStaff] = useState<
    { notes: (Note | Chord)[]; position: number }[]
  >([]);
  const [error, setError] = useState<string | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      JSON.parse(stored);
      return null;
    } catch {
      return 'Error loading saved songs';
    }
  });

  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const positionRef = useRef<number>(0);
  const lastWidthRef = useRef(0);

  const getTotalBeats = useCallback(() => {
    return music.reduce(
      (total, note) => total + DURATION_BEATS[note.duration],
      0,
    );
  }, [music]);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    positionRef.current = 0;
    setCurrentPosition(0);
  }, []);

  const handleLoadSong = useCallback(
    (song: Song) => {
      setSelectedSong(song);
      setMusic(song.notesAndChords);
      setTempo(song.tempo);
      handleStop();
    },
    [handleStop],
  );

  const handleDeleteSong = (id: string) => {
    const updatedSongs = songs.filter((s) => s.id !== id);
    setSongs(updatedSongs);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSongs));
    } catch {
      setError('Error deleting the song');
    }

    if (selectedSong?.id === id) {
      setSelectedSong(null);
      setMusic([]);
    }
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

  const handleTempoChange = useCallback((newTempo: number) => {
    setTempo(newTempo);
  }, []);

  const handleMaximumWidthChange = useCallback(
    (actualWidth: number) => {
      lastWidthRef.current = actualWidth;
      const width = STAFF_PADDING * 2 + (music.length + 1) * NOTE_WIDTH;

      if (actualWidth >= width) {
        setRowsStaff([
          {
            notes: music.map((note, i) => ({ ...note, position: i })),
            position: 0,
          },
        ]);
        return;
      }

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

      setRowsStaff(
        chunkMusic(music, notesPerRow).map((chunk, index) => ({
          notes: chunk.map((note, i) => ({ ...note, position: i })),
          position: index,
        })),
      );
    },
    [music],
  );

  useEffect(() => {
    if (lastWidthRef.current !== 0) {
      handleMaximumWidthChange(lastWidthRef.current);
    }
  }, [music, handleMaximumWidthChange]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="songs-page">
      <div className="songs-page-header">
        <button className="back-btn" onClick={() => navigate({ to: '/' })}>
          ← Back to Composer
        </button>
        <h2>Saved Songs</h2>
      </div>

      <div className="songs-page-content">
        <div className="songs-list-section">
          {error && <p className="error-msg">{error}</p>}
          {songs.length === 0 ? (
            <p className="no-songs">No saved songs</p>
          ) : (
            songs.map((song) => (
              <div
                key={song.id}
                className={`song-item ${selectedSong?.id === song.id ? 'selected' : ''}`}
              >
                <div className="song-info">
                  <span className="song-name">{song.name}</span>
                  <span className="song-details">
                    {song.notesAndChords.length} notes - {song.tempo} BPM
                  </span>
                </div>
                <div className="song-actions">
                  <button
                    className="load-btn"
                    onClick={() => handleLoadSong(song)}
                  >
                    Load to Staff
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteSong(song.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="staff-preview-section">
          {selectedSong ? (
            <>
              <h3>Preview: {selectedSong.name}</h3>
              <div className="staff-section">
                {rowsStaff.length > 0 &&
                  rowsStaff.map((row) => (
                    <Staff
                      key={row.position}
                      music={row.notes}
                      currentPosition={currentPosition}
                      isPlaying={isPlaying}
                      onDelete={() => {}}
                      onMaximumWidthChange={
                        row.position === 0
                          ? handleMaximumWidthChange
                          : undefined
                      }
                    />
                  ))}
                {rowsStaff.length === 0 && (
                  <Staff
                    music={music}
                    currentPosition={currentPosition}
                    isPlaying={isPlaying}
                    onDelete={() => {}}
                    onMaximumWidthChange={handleMaximumWidthChange}
                  />
                )}
              </div>
              <PlaybackControls
                isPlaying={isPlaying}
                tempo={tempo}
                onPlay={handlePlay}
                onPause={handlePause}
                onStop={handleStop}
                onTempoChange={handleTempoChange}
              />
            </>
          ) : (
            <p className="no-selection">Select a song to preview</p>
          )}
        </div>
      </div>
    </div>
  );
}
