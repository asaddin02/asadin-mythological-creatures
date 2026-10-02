/**
 * Bestiary Journal Component
 * Personal explorer dashboard tracking discovered entities and favorited creatures.
 */

import { api } from '../api-client.js';
import { t, resolveLocalized } from '../i18n.js';
import { gamification } from './gamification.js';
import { renderCreatureCard } from './creature-card.js';

export async function renderJournalView(container) {
  const collection = await api.getCreatures({ limit: 1 }).catch(() => null);
  const stats = gamification.getStats(collection?.pagination?.total || 18);
  const achievements = gamification.getAchievements();
  const favoriteSlugs = gamification.getFavorites();

  container.innerHTML = `
    <div class="container" style="padding: 2.5rem 1.5rem 5rem;">
      <div class="section-header">
        <span class="section-badge">${t('journal.title')}</span>
        <h1 class="section-title">${t('journal.title')}</h1>
        <p class="section-subtitle">${t('journal.subtitle')}</p>
      </div>

      <!-- Journal Progress Banner -->
      <div class="journal-stats-banner">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Tingkat Eksplorasi Arsip</div>
            <div style="font-family: var(--font-display); font-size: 2.2rem; font-weight: 700; color: var(--gold-500);">
              ${stats.discoveredCount} Entitas Terbuka (${stats.percentage}%)
            </div>
          </div>
          <div style="font-size: 0.95rem; color: var(--text-secondary);">
            ⭐ <strong>${stats.favoritesCount}</strong> makhluk tersimpan di koleksi favorit
          </div>
        </div>
        <div class="journal-progress-bar">
          <div class="journal-progress-fill" style="width: ${stats.percentage}%;"></div>
        </div>
      </div>

      <!-- Achievements Grid -->
      <h2 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 1.25rem;">
        ${t('journal.achievements')}
      </h2>
      <div class="achievements-grid">
        ${achievements.map(ach => `
          <div class="achievement-card ${ach.unlocked ? 'unlocked' : ''}">
            <div class="achievement-icon">${ach.icon}</div>
            <div>
              <div class="achievement-title">
                ${resolveLocalized(ach.title)} ${ach.unlocked ? '✓' : '🔒'}
              </div>
              <div class="achievement-desc">${resolveLocalized(ach.desc)}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Favorites Grid -->
      <h2 style="font-family: var(--font-display); font-size: 1.5rem; margin-top: 3.5rem; margin-bottom: 1.25rem;">
        Koleksi Makhluk Favorit (${favoriteSlugs.length})
      </h2>
      <div id="journal-favorites-slot">
        <div style="color: var(--text-muted); text-align: center; padding: 2rem;">Memuat koleksi favorit...</div>
      </div>
    </div>
  `;

  const favSlot = container.querySelector('#journal-favorites-slot');

  if (favoriteSlugs.length === 0) {
    favSlot.innerHTML = `
      <div style="padding: 3rem 1.5rem; text-align: center; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-medium); color: var(--text-secondary);">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">⭐</div>
        <p>${t('journal.emptyFavorites')}</p>
        <a href="#/explore" class="btn btn-secondary" style="margin-top: 1rem;">Jelajahi dan Temukan Makhluk</a>
      </div>
    `;
    return;
  }

  try {
    const favCreatures = [];
    for (let i = 0; i < favoriteSlugs.length; i += 10) {
      const batch = await Promise.allSettled(favoriteSlugs.slice(i, i + 10).map(slug => api.getCreature(slug)));
      favCreatures.push(...batch.filter(r => r.status === 'fulfilled').map(r => r.value));
    }

    if (favCreatures.length === 0) {
      favSlot.innerHTML = `<p>${t('journal.emptyFavorites')}</p>`;
      return;
    }

    favSlot.className = 'creature-grid';
    favSlot.innerHTML = favCreatures.map(c => renderCreatureCard(c)).join('');



  } catch (err) {
    favSlot.innerHTML = `<div style="color: var(--accent-crimson);">Gagal memuat favorit: ${err.message}</div>`;
  }
}
