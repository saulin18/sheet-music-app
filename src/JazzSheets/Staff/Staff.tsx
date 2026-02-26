import React, { useEffect, useRef, type MouseEvent } from 'react';
import type { Chord, Note } from '#shared/types';
import './Staff.css';
import {
  getNoteY,
  NOTE_WIDTH,
  renderLedgerLines,
  renderStaffLines,
  STAFF_PADDING,
} from './utils';

interface StaffProps {
  music: (Note | Chord)[];
  currentPosition: number;
  isPlaying: boolean;
  onNoteClick?: (position: number) => void;
  onDelete: (id: string) => void;

  onMaximumWidthChange?: (actualWidth: number) => void;
}

export const Staff: React.FC<StaffProps> = ({
  music,
  currentPosition,
  onNoteClick,
  onDelete,
  onMaximumWidthChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastWidthRef = useRef(0);
  const renderNoteBarOrChord = (noteOrChord: Note | Chord) => {
    const x = STAFF_PADDING + noteOrChord.position * NOTE_WIDTH;

    const handleDelete = (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      onDelete(noteOrChord.id);
    };

    if (!('features' in noteOrChord)) {
      //Todo type verification
      const y = getNoteY(noteOrChord);

      if (noteOrChord.isRest) {
        return (
          <div
            key={noteOrChord.id}
            className={`note rest ${noteOrChord.duration}`}
            style={{ left: x }}
          >
            <span className="rest-symbol">
              {noteOrChord.duration === 'whole'
                ? '𝄻'
                : noteOrChord.duration === 'half'
                  ? '𝄼'
                  : '𝄽'}
            </span>
          </div>
        );
      }

      const isActive = noteOrChord.position === Math.floor(currentPosition);

      return (
        <div
          key={noteOrChord.id}
          className={`note ${noteOrChord.duration} ${isActive ? 'active' : ''}`}
          style={{ left: x, maxWidth: '100%' }}
          onClick={(e) => {
            e.stopPropagation();
            onNoteClick &&onNoteClick(noteOrChord.position);
          }}
          onContextMenu={handleDelete}
        >
          {renderLedgerLines(y)}
          <div
            className="note-head"
            style={{
              top: y,
              transform:
                noteOrChord.duration === 'whole' ? 'none' : 'rotate(-10deg)',
            }}
          />
          {noteOrChord.duration !== 'whole' && (
            <div className="note-stem" style={{ top: y + 3 }} />
          )}
          {noteOrChord.duration === 'eighth' && (
            <div className="note-flag" style={{ top: y + 27 }} />
          )}
          {noteOrChord.accidental === '#' && (
            <span className="accidental sharp" style={{ top: y + 5 }}>
              ♯
            </span>
          )}
          {/* ♮ */}
          {noteOrChord.accidental === 'b' && (
            <span className="accidental flat" style={{ top: y + 5 }}>
              ♭
            </span>
          )}
        </div>
      );
    }
    // Is a chord :D
    return (
      <div
        className="chord"
        key={noteOrChord.id}
        style={{
          left: x,
        }}
        onContextMenu={handleDelete}
      >
        {noteOrChord.note}
        {noteOrChord.accidental === '#' && (
          <span className="accidental sharp for-chord">♯</span>
        )}
        {noteOrChord.accidental === 'b' && (
          <span className="accidental flat for-chord">♭</span>
        )}
      </div>
    );
  };

  const totalWidth = Math.max(
    800,
    STAFF_PADDING * 2 + (music.length + 1) * NOTE_WIDTH,
  );

  useEffect(() => {
    if (!onMaximumWidthChange) return;
    const el = containerRef.current;
    if (!el) return;

    const handler = () => {
      const actualWidth = el.clientWidth;
      if (actualWidth !== lastWidthRef.current) {
        lastWidthRef.current = actualWidth;
        onMaximumWidthChange(actualWidth);
      }
    };

    const ro = new ResizeObserver(handler);
    ro.observe(el);
    handler();

    return () => ro.disconnect();
  }, [music.length, onMaximumWidthChange]);

  return (
    <div className="staff-container" ref={containerRef}>
      <div
        className="staff-scroll"
        style={{ width: '100%' }}
      >
        <div className="staff" style={{ minWidth: totalWidth }}>
          <p className="clef">𝄞|</p>
          {renderStaffLines()}
          {music.map((noteOrChord) => renderNoteBarOrChord(noteOrChord))}
        </div>
      </div>
    </div>
  );
};
