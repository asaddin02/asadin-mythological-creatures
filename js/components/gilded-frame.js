// Small engraved marks identify each Power tier without covering the artwork.
const MARKS = {
  mortal: ['I', '<path d="M5 12h14M8 8h8M8 16h8"/>'],
  superhuman: ['II', '<path d="m12 4 7 8-7 8-7-8Z"/>'],
  monstrous: ['III', '<path d="m5 17 3-10 4 6 4-6 3 10M8 7V4m8 3V4"/>'],
  regional: ['IV', '<path d="M12 20V4m0 11c-6 0-8-4-8-8 5 0 8 3 8 8Zm0-3c6 0 8-4 8-8-5 0-8 3-8 8Z"/>'],
  divine: ['V', '<circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M19 5l-2 2M7 17l-2 2"/>'],
  cosmic: ['VI', '<circle cx="12" cy="12" r="7"/><ellipse cx="12" cy="12" rx="11" ry="3" transform="rotate(-35 12 12)"/>'],
  transcendent: ['VII', '<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/><circle cx="12" cy="12" r="2"/>'],
};
export function renderGildedFrame(power = 'unknown') {
  const tier = Object.hasOwn(MARKS, power) ? power : 'unknown';
  const mark = MARKS[tier];
  return `<span class="frame-fittings frame-art" data-frame-tier="${tier}" aria-hidden="true">${mark ? `<span class="frame-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">${mark[1]}</svg><span class="frame-level">${mark[0]}</span></span>` : ''}</span>`;
}
