
import React, { useEffect, useRef, useState } from 'react';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0);
  const timerIDRef = useRef<number | null>(null);

  // Melody: We Wish You a Merry Christmas
  // G4, C5, C5, D5, C5, B4, A4, A4...
  const melody = [
    // Phrase 1
    { note: 392.00, dur: 0.3 }, // G4
    { note: 523.25, dur: 0.3 }, // C5
    { note: 523.25, dur: 0.15 }, // C5
    { note: 587.33, dur: 0.15 }, // D5
    { note: 523.25, dur: 0.15 }, // C5
    { note: 493.88, dur: 0.15 }, // B4
    { note: 440.00, dur: 0.3 }, // A4
    { note: 440.00, dur: 0.3 }, // A4
    // Phrase 2
    { note: 440.00, dur: 0.3 }, // A4
    { note: 587.33, dur: 0.3 }, // D5
    { note: 587.33, dur: 0.15 }, // D5
    { note: 659.25, dur: 0.15 }, // E5
    { note: 587.33, dur: 0.15 }, // D5
    { note: 523.25, dur: 0.15 }, // C5
    { note: 493.88, dur: 0.3 }, // B4
    { note: 392.00, dur: 0.3 }, // G4
    // Phrase 3
    { note: 392.00, dur: 0.3 }, // G4
    { note: 659.25, dur: 0.3 }, // E5
    { note: 659.25, dur: 0.15 }, // E5
    { note: 698.46, dur: 0.15 }, // F5
    { note: 659.25, dur: 0.15 }, // E5
    { note: 587.33, dur: 0.15 }, // D5
    { note: 523.25, dur: 0.3 }, // C5
    { note: 440.00, dur: 0.3 }, // A4
    // Phrase 4
    { note: 392.00, dur: 0.15 }, // G4
    { note: 392.00, dur: 0.15 }, // G4
    { note: 440.00, dur: 0.3 }, // A4
    { note: 587.33, dur: 0.3 }, // D5
    { note: 493.88, dur: 0.3 }, // B4
    { note: 523.25, dur: 0.6 }, // C5
    { note: 0, dur: 0.3 }, // Rest
  ];
  const currentNoteIndex = useRef(0);

  const playNote = (freq: number, startTime: number, duration: number) => {
    if (!audioCtxRef.current || freq === 0) return;
    const osc = audioCtxRef.current.createOscillator();
    const subOsc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();

    // Use a mix of sine and triangle for a bell-like tone
    osc.type = 'triangle';
    subOsc.type = 'sine';
    
    osc.frequency.setValueAtTime(freq, startTime);
    subOsc.frequency.setValueAtTime(freq / 2, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    subOsc.connect(gain);
    gain.connect(audioCtxRef.current.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
    subOsc.start(startTime);
    subOsc.stop(startTime + duration);
  };

  const scheduler = () => {
    while (nextNoteTimeRef.current < audioCtxRef.current!.currentTime + 0.1) {
      const noteObj = melody[currentNoteIndex.current];
      playNote(noteObj.note, nextNoteTimeRef.current, noteObj.dur);
      nextNoteTimeRef.current += noteObj.dur + 0.02;
      currentNoteIndex.current = (currentNoteIndex.current + 1) % melody.length;
    }
    timerIDRef.current = window.setTimeout(scheduler, 25);
  };

  const toggleMusic = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (isPlaying) {
      audioCtxRef.current.suspend();
      if (timerIDRef.current) clearTimeout(timerIDRef.current);
      setIsPlaying(false);
    } else {
      audioCtxRef.current.resume();
      nextNoteTimeRef.current = audioCtxRef.current.currentTime;
      scheduler();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (timerIDRef.current) clearTimeout(timerIDRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return (
    <button
      onClick={toggleMusic}
      className="fixed bottom-6 right-6 z-50 p-4 bg-red-600/90 hover:bg-red-700 text-white rounded-full shadow-2xl backdrop-blur-md border-2 border-white/30 transition-all transform hover:scale-110 active:scale-95 group"
      title={isPlaying ? "关闭背景音乐" : "开启背景音乐"}
    >
      <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity"></div>
      {isPlaying ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      )}
    </button>
  );
};

export default MusicPlayer;
