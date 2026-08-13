// A simple audio utility using the Web Audio API to synthesize sounds.

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

export function playCorrectSound() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const t = ctx.currentTime;
    
    // Create oscillator and gain node
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    
    // Play a happy major third double-chime (C5 -> E5)
    // First note (C5)
    osc.frequency.setValueAtTime(523.25, t); 
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    
    // Second note (E5)
    osc.frequency.setValueAtTime(659.25, t + 0.15);
    gain.gain.setValueAtTime(0, t + 0.15);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.17);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
    
    osc.start(t);
    osc.stop(t + 0.5);
  } catch (e) {
    console.warn("Audio synthesis failed:", e);
  }
}

export function playIncorrectSound() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const t = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'triangle'; // duller sound
    
    // Low double thump/buzz
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.1);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
    
    osc.frequency.setValueAtTime(150, t + 0.2);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.3);
    
    gain.gain.setValueAtTime(0, t + 0.2);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.22);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
    
    osc.start(t);
    osc.stop(t + 0.5);
  } catch (e) {
    console.warn("Audio synthesis failed:", e);
  }
}
