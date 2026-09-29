/**
 * Comparison Component
 * Side-by-side creature analysis comparing power dimensions, traits, and origins.
 */

import { api } from '../api-client.js';
import { t, resolveLocalized } from '../i18n.js';

export async function renderComparisonView(container, initialSlugA = 'garuda', initialSlugB = 'minotaur') {
  container.innerHTML = `
    <div class="container" style="padding: 2.5rem 1.5rem 5rem;">
      <div class="section-header">
        <span class="section-badge">${t('compare.title')}</span>
        <h1 class="section-title">${t('compare.title')}</h1>
        <p class="section-subtitle">${t('compare.subtitle')}</p>
      </div>

      <!-- Selectors Strip -->
      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 2.5rem;">
        <select aria-label="Makhluk pertama / First being" id="compare-select-a" class="filter-select" style="max-width: 280px;"></select>
        <span style="display: flex; align-items: center; font-weight: 700; color: var(--gold-500);">VS</span>
        <select aria-label="Makhluk kedua / Second being" id="compare-select-b" class="filter-select" style="max-width: 280px;"></select>
        <button class="btn btn-primary" id="btn-run-compare">${t('compare.btnCompare')}</button>
      </div>

      <!-- Comparison Slot -->
      <div id="comparison-result-slot"></div>
    </div>
  `;

  const selectA = container.querySelector('#compare-select-a');
  const selectB = container.querySelector('#compare-select-b');
  const btnCompare = container.querySelector('#btn-run-compare');
  const slot = container.querySelector('#comparison-result-slot');

  try {
    const list = await api.getCreatureIndex();
    for (const c of list) {
      const optA = document.createElement('option');
      optA.value = c.slug;
      optA.textContent = `${resolveLocalized(c.display_name)} (${c.canonical_name})`;
      if (c.slug === initialSlugA) optA.selected = true;
      selectA.appendChild(optA);

      const optB = document.createElement('option');
      optB.value = c.slug;
      optB.textContent = `${resolveLocalized(c.display_name)} (${c.canonical_name})`;
      if (c.slug === initialSlugB) optB.selected = true;
      selectB.appendChild(optB);
    }
  } catch (err) {
    console.error('Failed to populate comparison lists:', err);
  }

  btnCompare.addEventListener('click', () => {
    executeCompare(selectA.value, selectB.value);
  });

  executeCompare(selectA.value || initialSlugA, selectB.value || initialSlugB);

  async function executeCompare(slugA, slugB) {
    if (!slugA || !slugB) return;
    slot.innerHTML = `
      <div style="text-align: center; padding: 3rem;">
        <div style="color: var(--gold-500); font-family: var(--font-display);">✦ MENYANDINGKAN DUA LEGENDA... ✦</div>
      </div>
    `;

    try {
      const data = await api.compare(slugA, slugB);
      const cA = data.creatureA;
      const cB = data.creatureB;
      const nameA = resolveLocalized(cA.display_name, cA.canonical_name);
      const nameB = resolveLocalized(cB.display_name, cB.canonical_name);
      const imgA = cA.images?.[0]?.thumbnail_url || '/assets/placeholders/creature-fallback.svg';
      const imgB = cB.images?.[0]?.thumbnail_url || '/assets/placeholders/creature-fallback.svg';

      slot.innerHTML = `
        <!-- Side-by-side header cards -->
        <div class="compare-header-row">
          <div class="compare-creature-card">
            <img 
              src="${imgA}" 
              alt="${nameA}" 
              class="compare-thumb-img"
              onerror="this.onerror=null; this.src='/assets/placeholders/creature-fallback.svg';"
            />
            <h3 style="font-family: var(--font-display); font-size: 1.6rem; color: var(--gold-500);">${nameA}</h3>
            <div style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 0.75rem;">${cA.culture} · ${cA.classification}</div>
            <a href="#/creature/${cA.slug}" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.4rem 0.8rem;">Buka Arsip</a>
          </div>

          <div class="compare-vs-badge">VS</div>

          <div class="compare-creature-card">
            <img 
              src="${imgB}" 
              alt="${nameB}" 
              class="compare-thumb-img"
              onerror="this.onerror=null; this.src='/assets/placeholders/creature-fallback.svg';"
            />
            <h3 style="font-family: var(--font-display); font-size: 1.6rem; color: var(--accent-cyan);">${nameB}</h3>
            <div style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 0.75rem;">${cB.culture} · ${cB.classification}</div>
            <a href="#/creature/${cB.slug}" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.4rem 0.8rem;">Buka Arsip</a>
          </div>
        </div>

        <!-- Comparative Matrix Table -->
        <div class="table-scroll" tabindex="0" role="region" aria-label="Tabel perbandingan / Comparison table"><table class="compare-matrix-table">
          <thead>
            <tr>
              <th>${t('compare.metric')}</th>
              <th style="color: var(--gold-500);">${nameA}</th>
              <th style="color: var(--accent-cyan);">${nameB}</th>
              <th>Analisis Relatif</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Asal Wilayah</strong></td>
              <td>${cA.country || cA.region}</td>
              <td>${cB.country || cB.region}</td>
              <td>${cA.region === cB.region ? 'Kawasan Geografis Sama' : 'Lintas Kawasan Benua'}</td>
            </tr>
            <tr>
              <td><strong>Klasifikasi Tradisi</strong></td>
              <td>${cA.classification}</td>
              <td>${cB.classification}</td>
              <td>${cA.classification === cB.classification ? 'Taksonomi Serupa' : 'Tipe Entitas Berbeda'}</td>
            </tr>
            <tr>
              <td><strong>Elemen & Habitat</strong></td>
              <td>${cA.element} (${cA.habitat})</td>
              <td>${cB.element} (${cB.habitat})</td>
              <td>-</td>
            </tr>
            ${data.comparisonMatrix.map(row => {
              const diff = row.difference;
              let diffText = diff === null ? 'Belum tersedia / Not assessed' : 'Seimbang';
              let diffColor = 'var(--text-muted)';
              if (diff > 0) {
                diffText = `+${diff} untuk ${nameA}`;
                diffColor = 'var(--gold-500)';
              } else if (diff < 0) {
                diffText = `+${Math.abs(diff)} untuk ${nameB}`;
                diffColor = 'var(--accent-cyan)';
              }
              return `
                <tr>
                  <td><strong>${row.dimension.toUpperCase()}</strong></td>
                  <td><strong>${row.valA ?? '—'}</strong>${row.valA === null ? '' : ' / 100'}</td>
                  <td><strong>${row.valB ?? '—'}</strong>${row.valB === null ? '' : ' / 100'}</td>
                  <td style="color: ${diffColor}; font-weight: 600;">${diffText}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table></div>

        <!-- Disclaimer -->
        <div class="power-profile-disclaimer-box" style="margin-top: 2rem;">
          <strong>Pemberitahuan Etika Budaya:</strong> ${resolveLocalized(data.disclaimer)}
        </div>
      `;
    } catch (err) {
      slot.innerHTML = `<div style="color: var(--accent-crimson); text-align: center;">Gagal membandingkan entitas: ${err.message}</div>`;
    }
  }
}
