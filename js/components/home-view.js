/**
 * HomeView Component
 * Curated discovery homepage with featured showcases, Indonesian spotlight,
 * cultural portals, and taxonomy categories.
 */

import { api } from '../api-client.js';
import { t, resolveLocalized } from '../i18n.js';
import { renderHero } from './hero.js';
import { renderCreatureCard } from './creature-card.js';
import { openRandomEncounterModal } from './random-encounter.js';

export async function renderHomeView(container) {
  container.innerHTML = `
    <!-- Hero Portal -->
    <div id="home-hero-slot"></div>

    <!-- Main Content Container -->
    <div class="container" style="padding-bottom: 5rem;">
      
      <!-- Featured Curated Showcase -->
      <section style="margin-bottom: 5rem;">
        <div class="section-header" style="text-align: left; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span class="section-badge">${t('home.featured')}</span>
            <h2 class="section-title">${t('home.featured')}</h2>
            <p class="section-subtitle" style="margin-left: 0;">${t('home.featuredSubtitle')}</p>
          </div>
          <a href="#/explore" class="btn btn-ghost" style="border: 1px solid var(--border-subtle);">
            ${t('home.viewAll')} →
          </a>
        </div>
        <div id="featured-grid-slot" class="creature-grid">
          <div style="grid-column: 1 / -1; text-align: center; color: var(--gold-500); padding: 3rem;">✦ MEMUAT ENTITAS PILIHAN... ✦</div>
        </div>
      </section>

      <!-- Indonesian Folklore Spotlight -->
      <section style="margin-bottom: 5rem; padding: 2.5rem; background: linear-gradient(135deg, rgba(217, 119, 6, 0.08), rgba(15, 23, 42, 0.5)); border: 1px solid rgba(217, 119, 6, 0.3); border-radius: var(--radius-xl);">
        <div class="section-header" style="text-align: left; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
          <div>
            <span class="badge" style="background: rgba(217, 119, 6, 0.9); color: #fff; margin-bottom: 0.5rem;">🇮🇩 NUSANTARA SPOTLIGHT</span>
            <h2 class="section-title" style="color: #fef3c7;">${t('home.indonesianSpotlight')}</h2>
            <p class="section-subtitle" style="margin-left: 0; color: #fde68a;">${t('home.indonesianSubtitle')}</p>
          </div>
          <a href="#/explore?culture=indonesian-folklore" class="btn btn-secondary" style="border-color: var(--gold-500);">
            Jelajahi Folklor Indonesia →
          </a>
        </div>
        <div id="indonesian-grid-slot" class="creature-grid" style="margin-bottom: 0;"></div>
      </section>

      <!-- Cultures of the World Preview -->
      <section style="margin-bottom: 5rem;">
        <div class="section-header">
          <span class="section-badge">${t('home.cultures')}</span>
          <h2 class="section-title">${t('home.cultures')}</h2>
          <p class="section-subtitle">${t('home.culturesSubtitle')}</p>
        </div>
        <div id="home-cultures-slot" class="culture-grid"></div>
      </section>

      <!-- Random Encounter Banner -->
      <section style="padding: 3rem; background: var(--bg-card); border: 1px solid var(--border-glow); border-radius: var(--radius-xl); text-align: center; position: relative; overflow: hidden; box-shadow: var(--shadow-gold);">
        <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: var(--gold-glow); filter: blur(40px); pointer-events: none;"></div>
        <h2 style="font-family: var(--font-display); font-size: 2rem; margin-bottom: 0.75rem;">Siap Menghadapi yang Tak Terduga?</h2>
        <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto 2rem; line-height: 1.6;">
          Uji takdir Anda dengan memanggil entitas acak dari ribuan arsip cerita rakyat dunia.
        </p>
        <button class="btn btn-primary" id="home-random-banner-trigger" style="font-size: 1.05rem; padding: 0.85rem 1.8rem;">
          ✦ ${t('hero.btnRandom')}
        </button>
      </section>

    </div>
  `;

  // Render Hero
  const heroSlot = container.querySelector('#home-hero-slot');
  heroSlot.innerHTML = renderHero(18, 14);

  // Attach hero search and random trigger
  const heroSearchInput = heroSlot.querySelector('#hero-search-input');
  heroSearchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = heroSearchInput.value.trim();
      window.location.hash = `#/explore?q=${encodeURIComponent(q)}`;
    }
  });

  heroSlot.querySelector('#hero-random-trigger')?.addEventListener('click', () => openRandomEncounterModal());
  container.querySelector('#home-random-banner-trigger')?.addEventListener('click', () => openRandomEncounterModal());

  // Fetch data
  try {
    const [creaturesData, cultures] = await Promise.all([
      api.getCreatures({ limit: 50 }),
      api.getCultures()
    ]);

    const all = creaturesData.creatures || [];

    // Featured: Garuda, Pocong, Kitsune, Quetzalcoatl, Jörmungandr, Barong
    const featuredSlugs = ['garuda', 'kitsune', 'jormungandr', 'quetzalcoatl', 'pocong', 'barong'];
    const featured = all.filter(c => featuredSlugs.includes(c.slug));
    const featuredSlot = container.querySelector('#featured-grid-slot');
    featuredSlot.innerHTML = featured.map(c => renderCreatureCard(c)).join('');

    // Indonesian Spotlight
    const indonesian = all.filter(c => c.culture === 'indonesian-folklore').slice(0, 4);
    const indoSlot = container.querySelector('#indonesian-grid-slot');
    indoSlot.innerHTML = indonesian.map(c => renderCreatureCard(c)).join('');

    // Cultures Preview (first 8)
    const cultSlot = container.querySelector('#home-cultures-slot');
    cultSlot.innerHTML = cultures.slice(0, 8).map(cult => `
      <a href="#/explore?culture=${cult.id}" class="culture-card">
        <div class="culture-card-header">
          <h3 class="culture-name">${resolveLocalized(cult.name)}</h3>
          <span class="culture-count-pill">${cult.creature_count || 0}</span>
        </div>
        <div style="font-size: 0.78rem; color: var(--gold-500); margin-bottom: 0.5rem; text-transform: uppercase;">
          ${cult.region}
        </div>
        <p class="culture-desc">${resolveLocalized(cult.description)}</p>
      </a>
    `).join('');

    // Attach card clicks
    container.querySelectorAll('.creature-card').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const slug = card.getAttribute('data-slug');
        if (slug) window.location.hash = `#/creature/${slug}`;
      });
    });

  } catch (err) {
    console.error('Failed to populate home view:', err);
  }
}
