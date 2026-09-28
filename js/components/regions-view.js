/**
 * RegionsView Component
 * Curatorial overview of the world's mythological and folkloric macro-regions.
 */

import { api } from '../api-client.js';
import { t, resolveLocalized } from '../i18n.js';

export async function renderRegionsView(container) {
  container.innerHTML = `
    <div class="container" style="padding: 2.5rem 1.5rem 5rem;">
      <div class="section-header">
        <span class="section-badge">${t('nav.regions')}</span>
        <h1 class="section-title">${t('regions.title')}</h1>
        <p class="section-subtitle">${t('regions.subtitle')}</p>
      </div>

      <div id="regions-grid-slot" class="culture-grid">
        <div style="grid-column: 1 / -1; text-align: center; color: var(--gold-500); padding: 3rem;">
          ✦ MEMUAT KAWASAN MAKRO-REGIONAL DUNIA... ✦
        </div>
      </div>
    </div>
  `;

  const slot = container.querySelector('#regions-grid-slot');

  try {
    const regions = await api.getRegions();
    if (!regions || regions.length === 0) {
      slot.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted);">Belum ada data wilayah yang tersedia.</div>`;
      return;
    }

    slot.innerHTML = regions.map(reg => {
      const name = resolveLocalized(reg.name);
      const desc = resolveLocalized(reg.description);
      const cultureList = reg.cultures || [];

      return `
        <div class="culture-card region-card" data-region="${reg.id}">
          <div class="culture-card-header">
            <h3 class="culture-name">${name}</h3>
            <span class="culture-count-pill">${cultureList.length} tradisi</span>
          </div>
          <p class="culture-desc" style="margin-bottom: 1.25rem;">${desc}</p>
          
          <div style="margin-bottom: 1.25rem;">
            <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; margin-bottom: 0.4rem; letter-spacing: 0.05em;">
              Tradisi Tercakup:
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
              ${cultureList.map(cId => `
                <a href="#/culture/${cId}" class="badge badge-culture" style="text-decoration: none; font-size: 0.75rem;">
                  ${cId.replace(/-/g, ' ')}
                </a>
              `).join('')}
            </div>
          </div>

          <div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
            <a href="#/explore?region=${encodeURIComponent(name)}" class="btn btn-secondary btn-sm" style="width: 100%; text-align: center; justify-content: center;">
              Jelajahi Entitas ${name} →
            </a>
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    slot.innerHTML = `<div style="grid-column: 1 / -1; color: var(--accent-crimson);">Gagal memuat kawasan regional: ${err.message}</div>`;
  }
}
