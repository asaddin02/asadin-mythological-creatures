// Generated transparent museum frames. The unknown state is deliberately neutral.
const TIERS = new Set(['mortal','superhuman','monstrous','regional','divine','cosmic','transcendent']);
export function renderGildedFrame(power = 'unknown') {
  const tier = TIERS.has(power) ? power : 'unknown';
  return `<span class="frame-fittings frame-art" data-frame-tier="${tier}" aria-hidden="true">${tier === 'unknown' ? '' : `<img src="/assets/frames/${tier}.webp" alt="" width="640" height="960" decoding="async" loading="lazy">`}</span>`;
}
