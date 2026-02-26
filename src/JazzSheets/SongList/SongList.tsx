import React, { useState, useEffect } from 'react';
import type { Song, Note, Chord } from '#shared/types';
import './SongList.css';

interface SongListProps {
  currentNotes: (Note | Chord)[];
  currentTempo: number;
  onLoadSong: (song: Song) => void;
}

const STORAGE_KEY = 'sheet-music-songs';

export const SongList: React.FC<SongListProps> = ({
  currentNotes,
  currentTempo,
  onLoadSong,
}) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [songName, setSongName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSongs(JSON.parse(stored));
      } catch {
        setError('Error loading saved songs');
      }
    }
  }, []);

  const saveSong = () => {
    if (!songName.trim()) {
      setError('Please enter a name for the song');
      return;
    }

    if (currentNotes.length === 0) {
      setError('No notes to save');
      return;
    }

    const newSong: Song = {
      id: Math.random().toString(36).substring(2, 9),
      name: songName.trim(),
      notesAndChords: currentNotes,
      tempo: currentTempo,
    };

    const updatedSongs = [...songs, newSong];
    setSongs(updatedSongs);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSongs));
      setSongName('');
      setError(null);
    } catch {
      setError('Error saving the song');
    }
  };

  const deleteSong = (id: string) => {
    const updatedSongs = songs.filter((s) => s.id !== id);
    setSongs(updatedSongs);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSongs));
    } catch {
      setError('Error deleting the song');
    }
  };

  return (
    <div className="song-list">
      <h3>Saved Songs</h3>

      <div className="save-section">
        <input
          type="text"
          placeholder="Song name"
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
          className="song-name-input"
        />
        <button className="save-btn" onClick={saveSong}>
          Save
        </button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div className="songs-container">
        {songs.length === 0 ? (
          <p className="no-songs">No saved songs</p>
        ) : (
          songs.map((song) => (
            <div key={song.id} className="song-item">
              <span className="song-name">{song.name}</span>
              <span className="song-info">
                {song.notesAndChords.length} notes - {song.tempo} BPM
              </span>
              <div className="song-actions">
                <button className="load-btn" onClick={() => onLoadSong(song)}>
                  Load
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteSong(song.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
