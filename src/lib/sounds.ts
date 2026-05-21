/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export class TransitionSoundEngine {
  private audioCtx: AudioContext | null = null;
  private volume: number = 0.3;

  constructor() {
    // AudioContext is initialized lazily because of browser autoplay policies
  }

  private init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  playWhoosh(duration: number = 2) {
    this.init();
    if (!this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // Create components
    const oscillator = ctx.createOscillator();
    const noiseBuffer = this.createNoiseBuffer(ctx);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    // Setup Noise (for the air/wind effect)
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(100, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(1200, now + duration * 0.4);
    noiseFilter.frequency.exponentialRampToValueAtTime(100, now + duration);
    noiseFilter.Q.value = 10;

    // Setup Gain (Volume envelope)
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(this.volume, now + duration * 0.3);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    // Connections
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Start
    noiseSource.start(now);
    noiseSource.stop(now + duration);
  }

  private createNoiseBuffer(ctx: AudioContext) {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }
}

export const soundEngine = new TransitionSoundEngine();
