import React from 'react';
import './PlaybackControls.css';

interface PlaybackControlsProps {
  isPlaying: boolean;
  tempo: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onTempoChange: (tempo: number) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  tempo,
  onPlay,
  onPause,
  onStop,
  onTempoChange,
}) => {
  return (
    <div className="playback-controls">
      <div className="transport-controls">
        {!isPlaying ? (
          <button className="control-btn play-btn" onClick={onPlay}>
            ▶ Play
          </button>
        ) : (
          <button className="control-btn pause-btn" onClick={onPause}>
            ⏸ Pause
          </button>
        )}
        <button className="control-btn stop-btn" onClick={onStop}>
          ⏹ Stop
        </button>
      </div>

      <div className="tempo-control">
        <label htmlFor="tempo-slider">Tempo: {tempo} BPM</label>
        <input
          id="tempo-slider"
          type="range"
          min="40"
          max="200"
          value={tempo}
          onChange={(e) => onTempoChange(Number(e.target.value))}
          className="tempo-slider"
        />
      </div>
    </div>
  );
};
