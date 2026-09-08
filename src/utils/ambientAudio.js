/**
 * Pure Web Audio API Ambient Analog Drone Synthesizer.
 * Requires zero external audio files.
 * Generates soothing binaural sine drones tuned to emotional frequencies
 * layered with filtered analog radio tape warmth.
 */

const MOOD_FREQUENCIES = {
  'restless': { base: 174, beat: 4, label: '174Hz Deep Theta Sleep' },
  'hopeful-lonely': { base: 396, beat: 5, label: '396Hz Grounding Drone' },
  'electric': { base: 528, beat: 6, label: '528Hz Vitality Resonance' },
  'bittersweet': { base: 432, beat: 4, label: '432Hz Harmonic Balance' },
  'anxious': { base: 285, beat: 3, label: '285Hz Nervous Soother' },
  'warm': { base: 639, beat: 5, label: '639Hz Heart Radiance' },
  'aching': { base: 216, beat: 3, label: '216Hz Melancholic Warmth' },
  'determined': { base: 370, beat: 5, label: '370Hz Clarity Swell' },
};

class AmbientDroneSynth {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.osc1 = null;
    this.osc2 = null;
    this.subOsc = null;
    this.noiseNode = null;
    this.filterNode = null;
    this.isPlaying = false;
    this.currentMood = 'restless';
  }

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();

    // Master gain node
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Filter node for smooth analog warmth
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(450, this.ctx.currentTime);
    this.filterNode.Q.setValueAtTime(1.5, this.ctx.currentTime);
    this.filterNode.connect(this.masterGain);

    // Generate subtle analog radio vinyl hiss buffer
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.04;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.015, this.ctx.currentTime);

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(800, this.ctx.currentTime);
      noiseFilter.Q.setValueAtTime(1.0, this.ctx.currentTime);

      this.noiseNode.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      this.noiseNode.start();
    } catch {
      // Noise buffer fallback gracefully
    }
  }

  start(mood = 'restless') {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.currentMood = mood;
    const config = MOOD_FREQUENCIES[mood] || MOOD_FREQUENCIES['restless'];
    const now = this.ctx.currentTime;

    // Create oscillator pair for gentle binaural hum
    this.osc1 = this.ctx.createOscillator();
    this.osc2 = this.ctx.createOscillator();
    this.subOsc = this.ctx.createOscillator();

    this.osc1.type = 'sine';
    this.osc2.type = 'sine';
    this.subOsc.type = 'sine';

    this.osc1.frequency.setValueAtTime(config.base, now);
    this.osc2.frequency.setValueAtTime(config.base + config.beat, now);
    this.subOsc.frequency.setValueAtTime(config.base / 2, now); // Warm sub-octave

    const voiceGain = this.ctx.createGain();
    voiceGain.gain.setValueAtTime(0.08, now);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.04, now);

    this.osc1.connect(voiceGain);
    this.osc2.connect(voiceGain);
    this.subOsc.connect(subGain);

    voiceGain.connect(this.filterNode);
    subGain.connect(this.filterNode);

    this.osc1.start(now);
    this.osc2.start(now);
    this.subOsc.start(now);

    // Smooth fade in
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(0, now);
    this.masterGain.gain.linearRampToValueAtTime(0.12, now + 1.2);

    this.isPlaying = true;
  }

  setMood(mood) {
    if (!this.isPlaying || !this.ctx || !this.osc1) return;
    this.currentMood = mood;
    const config = MOOD_FREQUENCIES[mood] || MOOD_FREQUENCIES['restless'];
    const now = this.ctx.currentTime;

    // Smooth glide to new frequency over 0.8s
    this.osc1.frequency.cancelScheduledValues(now);
    this.osc2.frequency.cancelScheduledValues(now);
    this.subOsc.frequency.cancelScheduledValues(now);

    this.osc1.frequency.exponentialRampToValueAtTime(config.base, now + 0.8);
    this.osc2.frequency.exponentialRampToValueAtTime(config.base + config.beat, now + 0.8);
    this.subOsc.frequency.exponentialRampToValueAtTime(Math.max(40, config.base / 2), now + 0.8);
  }

  stop() {
    if (!this.isPlaying || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Smooth fade out
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(0, now + 0.6);

    setTimeout(() => {
      try {
        if (this.osc1) { this.osc1.stop(); this.osc1.disconnect(); this.osc1 = null; }
        if (this.osc2) { this.osc2.stop(); this.osc2.disconnect(); this.osc2 = null; }
        if (this.subOsc) { this.subOsc.stop(); this.subOsc.disconnect(); this.subOsc = null; }
      } catch {
        // Safe tear down
      }
      this.isPlaying = false;
    }, 650);
  }

  toggle(mood) {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start(mood);
      return true;
    }
  }
}

export const ambientDrone = new AmbientDroneSynth();
