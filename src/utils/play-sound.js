/** @type {AudioContext} */
let audioCtx;

export function playSound() {
  audioCtx =
    audioCtx ||
    new (
      window.AudioContext || /** @type {any} */ (window).webkitAudioContext
    )();

  const now = audioCtx.currentTime;

  /** @param {number} start @param {number} f0 @param {number} f1 */
  const blip = (start, f0, f1) => {
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(f0, start);
    oscillator.frequency.exponentialRampToValueAtTime(f1, start + 0.01);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, start);
    filter.Q.setValueAtTime(2.5, start);

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(1, start + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.1);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    oscillator.start(start);
    oscillator.stop(start + 0.11);
  };

  blip(now, 266, 276);
  blip(now + 0.14, 398.5, 413.5);
}
