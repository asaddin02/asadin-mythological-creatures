/**
 * Explore Component
 * Multi-faceted search and filtering interface with URL synchronization.
 */

import { SCALES } from '../scaling.js';
import { bi, escapeHtml } from '../ui.js';
import { api } from '../api-client.js';
import { t, resolveLocalized } from '../i18n.js';
import { renderCreatureCard } from './creature-card.js';

export async function renderExploreView(container, initialParams = {}) {
  container.innerHTML = `
    <div class="container" style="padding: 2.5rem 1.5rem 5rem;">
      <div class="section-header">
        <span class="section-badge">THE LIVING BESTIARY</span>
        <h1 class="section-title">${t('explore.title')}</h1>
        <p class="section-subtitle">${bi('Temukan legenda. Baca kekuatannya. Kenali apa yang bersembunyi di balik mitos.', 'Discover legends. Read their power. Uncover what lies behind the myth.')}</p><a class="text-link" href="#/scales">${bi('Panduan Power · Threat · Fear', 'Power · Threat · Fear guide')} ↗</a>
      </div>

      <div class="library-overview" id="library-overview" aria-live="polite"></div>
      <!-- Filter Panel -->
      <div class="filter-panel">
        <div class="search-input-wrap">
          <svg class="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input 
            type="search" 
            id="explore-search-input"
            class="search-input" 
            placeholder="${t('nav.searchPlaceholder')}"
            value="${escapeHtml(initialParams.q || '')}" aria-label="${bi('Cari dalam arsip','Search the archive')}"
          />
        </div>

        <div class="scaling-filter-row">${Object.entries(SCALES).map(([axis, levels]) => `<label><span>${axis.toUpperCase()}</span><select class="filter-select" id="filter-${axis}"><option value="all">${bi('Semua kelas', 'All classes')}</option>${levels.map(level => `<option value="${level.id}">${axis === 'power' ? '' : level.id.toUpperCase() + ' · '}${level.name}</option>`).join('')}<option value="unassessed">${bi('Belum dinilai', 'Unassessed')}</option></select></label>`).join('')}</div>
        <div class="filters-row">
          <!-- Culture Filter -->
          <select id="filter-culture" aria-label="Tradisi budaya / Culture" class="filter-select">
            <option value="all">${t('explore.allCultures')}</option>
          </select>

          <!-- Category Filter -->
          <select id="filter-category" aria-label="Kategori / Category" class="filter-select">
            <option value="all">${t('explore.allCategories')}</option>
          </select>

          <!-- Element Filter -->
          <select id="filter-element" aria-label="Elemen / Element" class="filter-select">
            <option value="all">${t('explore.allElements')}</option>
            <option value="Fire">Api (Fire)</option>
            <option value="Water">Air (Water)</option>
            <option value="Earth">Tanah / Batu (Earth)</option>
            <option value="Air">Udara / Angin (Air)</option>
            <option value="Light">Cahaya (Light)</option>
            <option value="Shadow">Kegelapan (Shadow)</option>
            <option value="Nature">Alam (Nature)</option>
          </select>

          <!-- Habitat Filter -->
          <select id="filter-habitat" aria-label="Habitat" class="filter-select">
            <option value="all">${t('explore.allHabitats')}</option>
            <option value="Forest">Hutan (Forest)</option>
            <option value="Mountain">Gunung (Mountain)</option>
            <option value="Ocean">Samudera (Ocean)</option>
            <option value="Graveyard">Kuburan (Graveyard)</option>
            <option value="Cave">Gua / Labirin (Cave)</option>
            <option value="Village">Pemukiman (Village)</option>
            <option value="Sky">Angkasa (Sky)</option>
          </select>

          <select id="filter-tier" class="filter-select" aria-label="${bi('Kedalaman materi','Content depth')}"><option value="all">${bi('Semua kedalaman','All content depths')}</option><option value="rich">${bi('Materi mendalam','Detailed entries')}</option><option value="core">${bi('Pengantar bersumber','Sourced introductions')}</option></select>
          <!-- Sort -->
          <select id="filter-sort" aria-label="Urutan / Sort" class="filter-select">
            <option value="default">${t('explore.sortDefault')}</option>
            <option value="name-asc">${t('explore.sortNameAsc')}</option>
            <option value="name-desc">${t('explore.sortNameDesc')}</option>
            <option value="completeness">${t('explore.sortCompleteness')}</option>
            <option value="power">${t('explore.sortPower')}</option>
          </select>
        </div>

        <div class="filter-status-strip">
          <span id="explore-results-count" role="status">Memuat data...</span>
          <button class="btn-ghost" id="btn-clear-filters" style="font-size: 0.85rem; padding: 0.25rem 0.5rem;">
            ${t('explore.clearFilters')}
          </button>
        </div>
      </div>

      <!-- Results Grid -->
      <div id="explore-creature-grid" class="creature-grid"></div>

      <!-- Pagination -->
      <div id="explore-pagination-slot" style="display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem;"></div>
    </div>
  `;

  api.getLibraryStats().then(stats => {
    const overview = container.querySelector('#library-overview');
    if (overview) overview.innerHTML = `<strong>${stats.total.toLocaleString()} ${bi('entri siap dijelajahi', 'entries to explore')}</strong><span>${stats.detailed} ${bi('materi mendalam','detailed entries')} · ${stats.introductory.toLocaleString()} ${bi('pengantar bersumber','sourced introductions')} · ${stats.cultures} ${bi('kelompok budaya','cultural groups')}</span><small>${bi('Sebagian pengantar tersedia dalam bahasa Inggris. Kedalaman materi dan ketersediaan visual berbeda pada setiap entri.','Some introductions are available in English. Content depth and visual coverage vary by entry.')}</small>`;
  }).catch(() => {});
  // Populate culture and category dropdowns
  const cultureSelect = container.querySelector('#filter-culture');
  const categorySelect = container.querySelector('#filter-category');
  const searchInput = container.querySelector('#explore-search-input');
  const elementSelect = container.querySelector('#filter-element');
  const habitatSelect = container.querySelector('#filter-habitat');
  const sortSelect = container.querySelector('#filter-sort');
  const tierSelect = container.querySelector('#filter-tier');
  tierSelect.value = initialParams.tier || 'all';
  tierSelect.addEventListener('change', () => loadResults(1));
  const scaleSelects = Object.keys(SCALES).map(axis => {
    const select = container.querySelector(`#filter-${axis}`);
    select.value = SCALES[axis].some(level => level.id === initialParams[axis]) || initialParams[axis] === 'unassessed' ? initialParams[axis] : 'all';
    select.addEventListener('change', () => loadResults(1));
    return [axis, select];
  });
  const grid = container.querySelector('#explore-creature-grid');
  const countSpan = container.querySelector('#explore-results-count');
  const clearBtn = container.querySelector('#btn-clear-filters');

  try {
    const [cultures, categories] = await Promise.all([
      api.getCultures(),
      api.getCategories()
    ]);

    for (const cult of cultures) {
      const opt = document.createElement('option');
      opt.value = cult.id;
      opt.textContent = `${resolveLocalized(cult.name)} (${cult.creature_count || 0})`;
      if (initialParams.culture === cult.id) opt.selected = true;
      cultureSelect.appendChild(opt);
    }

    for (const cat of categories) {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = `${resolveLocalized(cat.name)} (${cat.count || 0})`;
      if (initialParams.classification === cat.id || initialParams.type === cat.id) opt.selected = true;
      categorySelect.appendChild(opt);
    }

    if (initialParams.element) elementSelect.value = initialParams.element;
    if (initialParams.habitat) habitatSelect.value = initialParams.habitat;
    if (initialParams.sort) sortSelect.value = initialParams.sort;
  } catch (err) {
    console.error('Failed to load filter metadata:', err);
  }

  // Ignore stale responses when filters change rapidly.
  let requestVersion = 0;
  async function loadResults(page = 1) {
    const request = ++requestVersion;
    const params = {
      ...Object.fromEntries(scaleSelects.map(([axis, select]) => [axis, select.value])),
      tier: tierSelect.value,
      q: searchInput.value.trim(),
      region: initialParams.region || '',
      culture: cultureSelect.value,
      classification: categorySelect.value,
      element: elementSelect.value,
      habitat: habitatSelect.value,
      sort: sortSelect.value,
      page,
      limit: 12
    };

    const query = new URLSearchParams(Object.entries(params).filter(([k,v]) => k !== 'limit' && v && v !== 'all' && v !== 'default'));
    history.replaceState(null, '', `#/explore?${query}`);
    container.querySelector('#explore-pagination-slot').innerHTML = '';
    grid.setAttribute('aria-busy', 'true');
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 0;">
        <div style="color: var(--gold-500); font-family: var(--font-display);">✦ MENYELAMI ARSIP... ✦</div>
      </div>
    `;

    try {
      const data = await api.getCreatures(params);
      if (request !== requestVersion || !grid.isConnected) return;
      grid.setAttribute('aria-busy', 'false');
      countSpan.textContent = `${data.pagination.total} ${t('explore.resultsCount')}`;

      if (data.creatures.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-medium);">
            <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">📜</div>
            <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">${t('explore.emptyTitle')}</h3>
            <p style="color: var(--text-secondary); max-width: 480px; margin: 0 auto 1.5rem;">
              ${t('explore.emptyDesc')}
            </p>
            <button class="btn btn-primary" id="empty-clear-btn">${t('explore.clearFilters')}</button>
          </div>
        `;
        container.querySelector('#empty-clear-btn')?.addEventListener('click', resetFilters);
        return;
      }

      grid.innerHTML = data.creatures.map(c => renderCreatureCard(c)).join('');

      // Attach card click handlers
      grid.querySelectorAll('.creature-card').forEach(card => {
        card.addEventListener('click', (e) => {
          e.preventDefault();
          const slug = card.getAttribute('data-slug');
          if (slug) window.location.hash = `#/creature/${slug}`;
        });
      });

      // Pagination
      renderPagination(data.pagination);

    } catch (err) {
      if (request !== requestVersion || !grid.isConnected) return;
      grid.setAttribute('aria-busy', 'false');
      grid.innerHTML = `<div style="grid-column: 1 / -1; color: var(--accent-crimson); text-align: center;">Gagal memuat arsip: ${escapeHtml(err.message)}</div>`;
    }
  }

  function renderPagination(pagination) {
    const slot = container.querySelector('#explore-pagination-slot');
    if (!slot) return;
    if (pagination.totalPages <= 1) {
      slot.innerHTML = '';
      return;
    }

    let buttons = '';
    const pages = [...new Set([1, pagination.page - 1, pagination.page, pagination.page + 1, pagination.totalPages])].filter(p => p > 0 && p <= pagination.totalPages).sort((a,b) => a-b);
    for (const [index, i] of pages.entries()) {
      if (index && i - pages[index - 1] > 1) buttons += '<span class="pagination-gap" aria-hidden="true">…</span>';
      const isActive = i === pagination.page;
      buttons += `
        <button 
          class="btn ${isActive ? 'btn-primary' : 'btn-secondary'}" 
          style="padding: 0.4rem 0.8rem; font-size: 0.85rem;"
          data-page="${i}" aria-label="${bi('Halaman', 'Page')} ${i}" ${isActive ? 'aria-current="page"' : ''}
        >
          ${i}
        </button>
      `;
    }

    slot.innerHTML = buttons;
    slot.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = Number(btn.getAttribute('data-page'));
        loadResults(p);
        window.scrollTo({ top: 150, behavior: 'smooth' });
      });
    });
  }

  function resetFilters() {
    initialParams.region = '';
    scaleSelects.forEach(([, select]) => { select.value = 'all'; });
    tierSelect.value = 'all';
    searchInput.value = '';
    cultureSelect.value = 'all';
    categorySelect.value = 'all';
    elementSelect.value = 'all';
    habitatSelect.value = 'all';
    sortSelect.value = 'default';
    loadResults(1);
  }

  // Debounced input search
  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => loadResults(1), 300);
  });

  cultureSelect.addEventListener('change', () => loadResults(1));
  categorySelect.addEventListener('change', () => loadResults(1));
  elementSelect.addEventListener('change', () => loadResults(1));
  habitatSelect.addEventListener('change', () => loadResults(1));
  sortSelect.addEventListener('change', () => loadResults(1));
  clearBtn.addEventListener('click', resetFilters);

  // Initial load
  loadResults(Math.max(1, Number(initialParams.page) || 1));
}
