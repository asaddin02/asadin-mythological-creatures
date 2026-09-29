/**
 * RandomEncounter Modal Component
 * Mysterious, immersive encounter reveal with cultural filtering.
 */

import { api } from '../api-client.js';
import { t, resolveLocalized } from '../i18n.js';
import { gamification } from './gamification.js';

export function openRandomEncounterModal(preferredCulture = null) {
  let modalEl = document.getElementById('random-encounter-modal');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'random-encounter-modal';
    modalEl.className = 'modal-overlay';
    document.body.appendChild(modalEl);
  }

  modalEl.innerHTML = `
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="random-dialog-title">
      <button class="modal-close-btn" id="modal-close-btn" aria-label="Tutup">&times;</button>
      
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <span class="section-badge">${t('random.modalTitle')}</span>
        <h2 id="random-dialog-title" style="font-size: 1.6rem; margin-top: 0.5rem;">${t('random.encounterText')}</h2>
      </div>

      <div id="random-encounter-card-slot" style="min-height: 220px; display: flex; align-items: center; justify-content: center;">
        <div style="color: var(--gold-500); font-family: var(--font-display); letter-spacing: 0.1em;">
          ✦ MEMBUKA GERBANG KOSMIS... ✦
        </div>
      </div>

      <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
        <button class="btn btn-secondary" id="random-again-btn">${t('random.againButton')}</button>
        <button class="btn btn-primary" id="random-inspect-btn" style="display: none;">${t('random.exploreButton')}</button>
      </div>
    </div>
  `;

  const previousFocus = document.activeElement;
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  modalEl.classList.add('open');
  const close = () => {
    modalEl.classList.remove('open');
    document.body.style.overflow = previousOverflow;
    modalEl.onkeydown = null;
    previousFocus?.focus();
  };
  modalEl.onkeydown = e => {
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    const focusable = [...modalEl.querySelectorAll('button, a[href]')].filter(el => !el.disabled && el.offsetParent !== null);
    const first = focusable[0], last = focusable.at(-1);
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
  };

  const closeBtn = modalEl.querySelector('#modal-close-btn');
  closeBtn.addEventListener('click', close);
  closeBtn.focus();

  modalEl.onclick = e => { if (e.target === modalEl) close(); };

  const againBtn = modalEl.querySelector('#random-again-btn');
  againBtn.addEventListener('click', () => fetchAndDisplay(preferredCulture));

  fetchAndDisplay(preferredCulture);

  async function fetchAndDisplay(culture) {
    const slot = modalEl.querySelector('#random-encounter-card-slot');
    const inspectBtn = modalEl.querySelector('#random-inspect-btn');
    inspectBtn.style.display = 'none';

    slot.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div style="color: var(--gold-500); font-family: var(--font-display); margin-bottom: 0.5rem; animation: pulse 1.5s infinite;">
          ✦ MEMANGGIL ENTITAS MISTERIUS... ✦
        </div>
      </div>
    `;

    try {
      const filters = culture ? { culture } : {};
      const creature = await api.getRandom(filters);

      // Track encounter in bestiary journal
      gamification.markDiscovered(creature.slug, creature);

      const displayName = resolveLocalized(creature.display_name, creature.canonical_name);
      const shortDesc = resolveLocalized(creature.short_description, '');
      const primaryImg = creature.images?.[0]?.thumbnail_url || '/assets/placeholders/creature-fallback.svg';

      slot.innerHTML = `
        <div style="text-align: center; width: 100%;">
          <div style="width: 140px; height: 140px; margin: 0 auto 1.25rem; border-radius: var(--radius-full); overflow: hidden; border: 2px solid var(--border-glow); box-shadow: var(--shadow-gold);">
            <img 
              src="${primaryImg}" 
              alt="${displayName}" 
              style="width: 100%; height: 100%; object-fit: cover;"
              onerror="this.onerror=null; this.src='/assets/placeholders/creature-fallback.svg';"
            />
          </div>
          <h3 style="font-family: var(--font-display); font-size: 1.8rem; margin-bottom: 0.25rem; color: var(--gold-500);">
            ${displayName}
          </h3>
          <div style="display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 0.85rem;">
            <span class="badge badge-culture">${creature.culture}</span>
            <span class="badge badge-classification">${creature.classification}</span>
          </div>
          <p style="font-size: 0.92rem; color: var(--text-secondary); max-width: 440px; margin: 0 auto; line-height: 1.5;">
            ${shortDesc}
          </p>
        </div>
      `;

      inspectBtn.style.display = 'inline-flex';
      inspectBtn.onclick = () => {
        close();
        window.location.hash = `#/creature/${creature.slug}`;
      };
    } catch (err) {
      slot.innerHTML = `
        <div style="text-align: center; color: var(--text-muted);">
          Gagal memanggil entitas. Silakan coba kembali.
        </div>
      `;
    }
  }
}
