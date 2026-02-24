# Sheet Music App

## 1. Project Overview

- **Project Name**: Sheet Music
- **Type**: React Web Application (TypeScript)
- **Core Functionality**: Create, save, and playback sheet music using American notation (A-G) with tempo control and visual playback progress
- **Target Users**: Musicians, students, hobbyists who want to write simple melodies

### Core Features

1. **Note Input**
   - Select note type (C-B) from palette
   - Select duration (whole, half, quarter, eighth)
   - Click on staff to place note at position
   - Support for sharps/flats
   - Support for rests

2. **Chords Input**
   - Select chord type from palette
   - Same things from last point
   
3. **Staff Rendering**
   - Draw 5-line staff with treble clef
   - Map note names to vertical positions
   - Display note heads with correct positioning
   - Show note duration visually

4. **Playback**
   - Play button starts playback from current position
   - Playhead moves across staff synced to tempo
   - Each beat = appropriate duration based on tempo
   - Pause maintains current position
   - Stop resets to beginning

5. **Tempo Control**
   - Adjustable tempo: 40-200 BPM
   - Default: 120 BPM
   - Real-time tempo changes during playback

6. **LocalStorage Persistence**
   - Save song with name
   - Store as JSON: { id, name, notes: [{note, octave, duration, position}] }
   - Load saved songs
   - Delete saved songs