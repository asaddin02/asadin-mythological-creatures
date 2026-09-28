/**
 * CulturesView Component
 * Dedicated page showcasing mythic traditions and civilizations.
 */

import { api } from '../api-client.js';
import { t, resolveLocalized } from '../i18n.js';

export async function renderCulturesView(container) {
  container.innerHTML = `
    <div class="container" style="padding: 2.5rem 1.5rem 5rem;">
      <div class="section-header">
        <span class="section-badge">${t('home.cultures')}</span>
        <h1 class="section-title">${t('home.cultures')}</h1>
        <p class="section-subtitle">${t('home.culturesSubtitle')}</p>
      </div>

      <div id="cultures-grid-slot" class="culture-grid">
        <div style="grid-column: 1 / -1; text-align: center; color: var(--gold-500); padding: 3rem;">
          ✦ MEMUAT TRADISI BUDAYA... ✦
        </div>
      </div>
    </div>
  `;

  const slot = container.querySelector('#cultures-grid-slot');

  try {
    const cultures = await api.getCultures();
    slot.innerHTML = cultures.map(cult => {
      const name = resolveLocalized(cult.name);
      const desc = resolveLocalized(cult.description);

      return `
        <div class="culture-card" data-culture="${cult.id}">
          <div class="culture-card-header">
            <h3 class="culture-name">${name}</h3>
            <span class="culture-count-pill">${cult.creature_count || 0} entitas</span>
          </div>
          <div style="font-size: 0.78rem; color: var(--gold-500); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
            ${cult.region} · ${cult.country}
          </div>
          <p class="culture-desc" style="margin-bottom: 1.25rem;">${desc}</p>
          <div style="display: flex; gap: 0.5rem; margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
            <a href="#/culture/${cult.id}" class="btn btn-secondary btn-sm" style="flex: 1; text-align: center; justify-content: center;">
              Pelajari Tradisi →
            </a>
            <a href="#/explore?culture=${cult.id}" class="btn btn-ghost btn-sm" style="border: 1px solid var(--border-subtle);" title="Jelajahi Makhluk">
              🔍 Makhluk
            </a>
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    slot.innerHTML = `<div style="grid-column: 1 / -1; color: var(--accent-crimson);">Gagal memuat budaya: ${err.message}</div>`;
  }
}
