const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

export function playClickSound() {
  if (!audioContext) return;

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.setValueAtTime(1200, now);
  oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.08);
  oscillator.type = 'square';

  gainNode.gain.setValueAtTime(0.1, now);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

  oscillator.start(now);
  oscillator.stop(now + 0.08);
}

export function playTimerTick() {
  if (!audioContext) return;

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Descending tick: 1000Hz to 600Hz
  oscillator.frequency.setValueAtTime(1000, now);
  oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.07);
  oscillator.type = 'square';

  gainNode.gain.setValueAtTime(0.15, now);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.07);

  oscillator.start(now);
  oscillator.stop(now + 0.07);
}

export function playTimerSecondTick() {
  if (!audioContext) return;

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.setValueAtTime(900, now); // Subtle tick
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.1, now);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

  oscillator.start(now);
  oscillator.stop(now + 0.05);
}

export function playCompletionSound() {
  if (!audioContext) return;

  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 (victory chord)
  let time = audioContext.currentTime;

  notes.forEach((freq, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(freq, time);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.2, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

    oscillator.start(time);
    oscillator.stop(time + 0.3);

    time += 0.15;
  });
}

export function playApplauseSound() {
  if (!audioContext) return;

  // Rapid hand claps approximation with noise bursts
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const now = audioContext.currentTime;
      const bufferSize = audioContext.sampleRate * 0.02; // 20ms clap
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);

      // Noise burst for clap
      for (let j = 0; j < bufferSize; j++) {
        data[j] = (Math.random() * 2 - 1) * 0.3 * Math.pow(1 - j / bufferSize, 2);
      }

      const noiseSource = audioContext.createBufferSource();
      noiseSource.buffer = buffer;
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();

      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, now);
      filter.Q.setValueAtTime(1, now);

      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.02);

      noiseSource.start(now);
      noiseSource.stop(now + 0.02);
    }, i * 80); // 8 claps spaced 80ms apart
  }
}

