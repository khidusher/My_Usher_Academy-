
import React, { useEffect, useRef } from 'react';

interface PianoMelodyProps {
  isPlaying: boolean;
}

const PianoMelody: React.FC<PianoMelodyProps> = ({ isPlaying }) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeNodesRef = useRef<Array<{ osc: OscillatorNode[]; gain: GainNode; filter: BiquadFilterNode }>>([]);
  const timerRef = useRef<number | null>(null);

  // Ethereal, warm chord progression: Cmaj9 -> Fmaj9 -> Am9 -> G11
  const progression = [
    [130.81, 164.81, 196.00, 246.94, 293.66], // C, E, G, B, D
    [174.61, 220.00, 261.63, 329.63, 392.00], // F, A, C, E, G
    [110.00, 130.81, 164.81, 196.00, 246.94], // A, C, E, G, B
    [98.00, 146.83, 174.61, 220.00, 261.63],  // G, D, F, A, C
  ];

  const createPadVoice = (ctx: AudioContext, freqs: number[], startTime: number, duration: number) => {
    const voiceGain = ctx.createGain();
    const voiceFilter = ctx.createBiquadFilter();
    
    voiceFilter.type = 'lowpass';
    voiceFilter.frequency.setValueAtTime(400, startTime);
    voiceFilter.frequency.exponentialRampToValueAtTime(1200, startTime + duration / 2);
    voiceFilter.frequency.exponentialRampToValueAtTime(400, startTime + duration);
    voiceFilter.Q.value = 1;

    voiceGain.gain.setValueAtTime(0, startTime);
    voiceGain.gain.linearRampToValueAtTime(0.08, startTime + duration * 0.3); // Slow attack
    voiceGain.gain.linearRampToValueAtTime(0, startTime + duration); // Slow release

    const oscillators: OscillatorNode[] = [];

    freqs.forEach((f) => {
      // Primary Oscillator
      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.value = f;
      
      // Detuned second oscillator for warmth
      const osc2 = ctx.createOscillator();
      osc2.type = 'sawtooth';
      osc2.frequency.value = f * 1.005; // Slightly detuned
      
      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.5;

      osc1.connect(oscGain);
      osc2.connect(oscGain);
      oscGain.connect(voiceFilter);
      
      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + duration);
      osc2.stop(startTime + duration);
      
      oscillators.push(osc1, osc2);
    });

    voiceFilter.connect(voiceGain);
    if (masterGainRef.current) {
      voiceGain.connect(masterGainRef.current);
    }

    return { osc: oscillators, gain: voiceGain, filter: voiceFilter };
  };

  const startSequence = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    let chordIdx = 0;
    const chordDuration = 10; // 10 seconds per chord for slow feel
    const overlap = 4; // Overlap for crossfading

    const schedule = () => {
      const startTime = ctx.currentTime;
      const voice = createPadVoice(ctx, progression[chordIdx], startTime, chordDuration);
      activeNodesRef.current.push(voice);

      // Cleanup finished voices
      setTimeout(() => {
        activeNodesRef.current = activeNodesRef.current.filter(v => v !== voice);
      }, chordDuration * 1000 + 100);

      chordIdx = (chordIdx + 1) % progression.length;
      timerRef.current = window.setTimeout(schedule, (chordDuration - overlap) * 1000);
    };

    schedule();
  };

  useEffect(() => {
    if (isPlaying) {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        masterGainRef.current = audioCtxRef.current.createGain();
        masterGainRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
        masterGainRef.current.gain.linearRampToValueAtTime(0.6, audioCtxRef.current.currentTime + 2);
        
        const reverb = audioCtxRef.current.createConvolver();
        // Simple artificial reverb using a compressor for tail
        const compressor = audioCtxRef.current.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-24, audioCtxRef.current.currentTime);
        compressor.knee.setValueAtTime(40, audioCtxRef.current.currentTime);
        compressor.ratio.setValueAtTime(12, audioCtxRef.current.currentTime);
        compressor.attack.setValueAtTime(0, audioCtxRef.current.currentTime);
        compressor.release.setValueAtTime(0.25, audioCtxRef.current.currentTime);

        masterGainRef.current.connect(compressor);
        compressor.connect(audioCtxRef.current.destination);

        startSequence();
      } else if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    } else {
      if (masterGainRef.current && audioCtxRef.current) {
        masterGainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 1);
        setTimeout(() => {
          if (timerRef.current) clearTimeout(timerRef.current);
          if (audioCtxRef.current) {
            audioCtxRef.current.close();
            audioCtxRef.current = null;
          }
        }, 1100);
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying]);

  return null;
};

export default PianoMelody;
