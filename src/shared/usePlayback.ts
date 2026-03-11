import { useCallback, useRef, useState } from 'react';
import { DURATION_BEATS } from '#shared/constants';
import { type Note, type Chord } from '#shared/types';
import * as Tone from 'tone';

export const usePlayback = (music: (Note | Chord)[]) => {
  const pianoSampler = new Tone.Sampler({
    urls: {
      C4: 'C4.mp3',
      'D#4': 'Ds4.mp3',
      'F#4': 'Fs4.mp3',
      A4: 'A4.mp3',
    },
    baseUrl: 'https://tonejs.github.io/audio/salamander/',
    release: 1,
  }).toDestination();

  const noteNameToTone = (
    note: string,
    octave: number,
    accidental: string,
  ): string => {
    return `${note}${accidental}${octave}`;
  };

  const getTotalBeats = useCallback(() => {
    return music.reduce(
      (total, note) => total + DURATION_BEATS[note.duration],
      0,
    );
  }, [music]);

  const [tempo, setTempo] = useState<number>(120);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const positionRef = useRef<number>(0);

  const handlePlay = useCallback(async () => {
    if (music.length === 0) return;

    await Tone.start();
    Tone.getTransport().bpm.value = tempo;

    setIsPlaying(true);
    positionRef.current = currentPosition;
    lastTimeRef.current = performance.now();

    const playNote = (noteItem: Note | Chord, beatPosition: number) => {
      if ('isRest' in noteItem && noteItem.isRest) return;
      if (!noteItem.note) return;

      const noteString = noteNameToTone(
        noteItem.note,
        'octave' in noteItem ? noteItem.octave : 4,
        noteItem.accidental,
      );
      const duration = DURATION_BEATS[noteItem.duration] / (tempo / 60);

      pianoSampler.triggerAttackRelease(
        noteString,
        duration,
        Tone.getTransport().seconds + beatPosition / (tempo / 60),
      );
    };

    let currentBeat = 0;
    music.forEach((noteItem) => {
      const beats = DURATION_BEATS[noteItem.duration];
      playNote(noteItem, currentBeat);
      currentBeat += beats;
    });

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
  }, [music, tempo, currentPosition, getTotalBeats, pianoSampler]);

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
    pianoSampler.releaseAll();
  }, [pianoSampler]);

  const handleTempoChange = useCallback((newTempo: number) => {
    setTempo(newTempo);
  }, []);

  return {
    handlePlay,
    handlePause,
    handleStop,
    handleTempoChange,
    isPlaying,
    tempo,
    currentPosition,
    animationRef,
    lastTimeRef,
    positionRef,
    setTempo,
    setIsPlaying,
  };
};
