/**
 * Hero Component
 * Cinematic, mysterious, and engaging discovery portal.
 */

import { t } from '../i18n.js';

export function renderHero(creaturesCount = 18, culturesCount = 14) {
  return `
    <section class="hero-section">
      <div class="hero-glow-ambient"></div>
      <div class="container hero-content">
        <div class="hero-badge-wrap">
          <span class="section-badge">${t('hero.badge')}</span>
        </div>
        
        <h1 class="hero-title">${t('hero.title')}</h1>
        <p class="hero-subtitle">${t('hero.subtitle')}</p>

        <!-- Quick Search Bar in Hero -->
        <div class="search-input-wrap" style="max-width: 620px; margin: 0 auto 2.25rem;">
          <svg class="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input 
            type="search" 
            id="hero-search-input"
            class="search-input" 
            placeholder="${t('nav.searchPlaceholder')}"
            autocomplete="off"
          />
        </div>

        <div class="hero-actions">
          <a href="#/explore" class="btn btn-primary">
            <span>${t('hero.btnExplore')}</span>
            <span>→</span>
          </a>
          <button class="btn btn-secondary" id="hero-random-trigger">
            <span>${t('hero.btnRandom')}</span>
          </button>
        </div>

        <div class="hero-stats-strip">
          <div class="stat-item">
            <div class="stat-number">${creaturesCount}+</div>
            <div class="stat-label">${t('hero.statCreatures')}</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${culturesCount}</div>
            <div class="stat-label">${t('hero.statCultures')}</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">100%</div>
            <div class="stat-label">${t('hero.statProvenanced')}</div>
          </div>
        </div>
      </div>
    </section>
  `;
}
