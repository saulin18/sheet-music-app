import { Staff } from './Staff';
import { Palette } from './Palette';
import { PlaybackControls } from './PlaybackControls';
import { SongList } from './SongList';
import { useSongs } from '#shared/useSongs';
import './JazzSheets.css';

let isInitializing = true;

export function JazzSheets() {
  const {
    music,
    selectedNote,
    selectedNoteOctave,
    selectedChord,
    selectedDuration,
    selectedAccidental,
    isRest,
    tempo,
    isPlaying,
    currentPosition,
    rowsStaff,
    handleNoteClick,
    handleDeletion,
    handleStaffClick,
    handlePlay,
    handlePause,
    handleStop,
    handleTempoChange,
    handleLoadSong,
    handleClear,
    handleMaximumWidthChange,
    setIsRest,
    setSelectedNote,
    setSelectedDuration,
    setSelectedAccidental,
    setSelectedNoteOctave,
    setSelectedChord,
  } = useSongs(isInitializing);

  return (
    <div className="main-content">
      <div className="staff-section" style={{ maxWidth: '100%' }}>
        {rowsStaff.length > 0 &&
          rowsStaff.map((row, index) => (
            <div
              key={row.position}
              onClick={
                index === rowsStaff.length - 1 ? handleStaffClick : undefined
              }
              className="staff-row"
            >
              <Staff
                key={row.position}
                music={row.notes}
                currentPosition={currentPosition}
                isPlaying={isPlaying}
                onNoteClick={
                  index === rowsStaff.length - 1 ? handleNoteClick : undefined
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
      <div className="palette-and-saved-songs">
        <Palette
          selectedNote={selectedNote}
          selectedChord={selectedChord}
          selectedDuration={selectedDuration}
          selectedAccidental={selectedAccidental}
          isRest={isRest}
          selectedNoteOctave={selectedNoteOctave}
          setSelectedNoteOctave={setSelectedNoteOctave}
          onNoteSelect={handleNoteSelect}
          onChordSelect={handleChordSelect}
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
  );
}
