/**
 * Mythics Client Application Main Entry Point
 * Routing, view lifecycle management, and global event coordination.
 */

import { initI18n, t } from './i18n.js';
import { renderNavbar } from './components/navbar.js';
import { renderHomeView } from './components/home-view.js';
import { renderExploreView } from './components/explore.js';
import { renderCreatureDetail } from './components/creature-detail.js';
import { renderCulturesView } from './components/cultures-view.js';
import { renderCultureDetailView } from './components/culture-detail-view.js';
import { renderRegionsView } from './components/regions-view.js';
import { renderComparisonView } from './components/comparison.js';
import { renderJournalView } from './components/journal.js';
import { renderAdminDashboard } from './components/admin-dashboard.js';
import { openRandomEncounterModal } from './components/random-encounter.js';

class App {
  constructor() {
    this.appContainer = document.getElementById('app');
    this.headerContainer = document.getElementById('header-root');
    this.footerContainer = document.getElementById('footer-root');
  }

  init() {
    // 1. Initialize Theme from storage
    const savedTheme = localStorage.getItem('mythics_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // 2. Initialize i18n
    initI18n();

    // 3. Render Persistent Chrome (Navbar & Footer)
    this.renderChrome();

    // 4. Listen for route transitions and language changes
    window.addEventListener('hashchange', () => this.handleRouting());
    window.addEventListener('mythics:lang-change', () => {
      this.renderChrome();
      this.handleRouting();
    });

    // 5. Initial Route dispatch
    this.handleRouting();
  }

  renderChrome() {
    if (this.headerContainer) renderNavbar(this.headerContainer);
    if (this.footerContainer) {
      this.footerContainer.innerHTML = `
        <footer class="site-footer">
          <div class="container">
            <div class="footer-grid">
              <div class="footer-brand">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                  <span style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 800; color: var(--gold-500); letter-spacing: 0.15em;">MYTHICS</span>
                </div>
                <p class="footer-desc">${t('footer.aboutText')}</p>
                <div class="footer-philosophy">${t('footer.philosophy')}</div>
              </div>

              <div>
                <h4 class="footer-col-title">${t('footer.quickLinks')}</h4>
                <ul class="footer-links">
                  <li><a href="#/explore">${t('nav.explore')}</a></li>
                  <li><a href="#/cultures">${t('nav.cultures')}</a></li>
                  <li><a href="#/compare">${t('nav.compare')}</a></li>
                  <li><a href="#/journal">${t('nav.journal')}</a></li>
                  <li><a href="#/admin">${t('nav.admin')}</a></li>
                </ul>
              </div>

              <div>
                <h4 class="footer-col-title">Metodologi & Etika</h4>
                <ul class="footer-links">
                  <li><a href="#/admin">${t('footer.sourcesPolicy')}</a></li>
                  <li><a href="#/admin">${t('footer.licensing')}</a></li>
                  <li><span style="font-size: 0.85rem; color: var(--text-muted);">Sistem Kurasi Autonomus</span></li>
                </ul>
              </div>
            </div>

            <div class="footer-bottom">
              <div>© 2026 Mythics Encyclopedia. Hak cipta materi lisan & tradisi milik peradaban sumber.</div>
              <div>Bilingual Platform (Bahasa Indonesia & English)</div>
            </div>
          </div>
        </footer>
      `;
    }
  }

  async handleRouting() {
    const rawHash = window.location.hash.slice(1) || '/';
    const [pathWithQuery] = rawHash.split('?');
    const path = pathWithQuery.replace(/\/+$/, '') || '/';
    const queryString = rawHash.includes('?') ? rawHash.split('?')[1] : '';
    const params = Object.fromEntries(new URLSearchParams(queryString));

    // Update active navbar links
    document.querySelectorAll('.nav-link').forEach(link => {
      const routeAttr = link.getAttribute('data-route');
      const href = link.getAttribute('href')?.replace('#/', '');
      const currentSection = path.replace(/^\//, '').split('/')[0];
      link.classList.toggle('active', routeAttr === currentSection || href === currentSection);
    });

    // Check actions (e.g. random)
    if (path === '/random') {
      openRandomEncounterModal();
      window.location.hash = '#/';
      return;
    }

    // Creature Detail Route: /creature/:slug
    const creatureMatch = path.match(/^\/creature\/([a-zA-Z0-9_-]+)$/);
    if (creatureMatch) {
      const slug = creatureMatch[1];
      await renderCreatureDetail(this.appContainer, slug);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Explore Route: /explore
    if (path === '/explore') {
      await renderExploreView(this.appContainer, params);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Cultures Route: /cultures
    if (path === '/cultures') {
      await renderCulturesView(this.appContainer);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Culture Detail Route: /culture/:id
    const cultureMatch = path.match(/^\/culture\/([a-zA-Z0-9_-]+)$/);
    if (cultureMatch) {
      const cultureId = cultureMatch[1];
      await renderCultureDetailView(this.appContainer, cultureId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Regions Route: /regions
    if (path === '/regions') {
      await renderRegionsView(this.appContainer);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Region Detail Route: /region/:id
    const regionMatch = path.match(/^\/region\/([a-zA-Z0-9_-]+)$/);
    if (regionMatch) {
      const regId = regionMatch[1];
      await renderExploreView(this.appContainer, { region: regId });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Compare Route: /compare
    if (path === '/compare') {
      await renderComparisonView(this.appContainer, params.a || 'garuda', params.b || 'minotaur');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Journal Route: /journal
    if (path === '/journal') {
      await renderJournalView(this.appContainer);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Admin Route: /admin
    if (path === '/admin') {
      await renderAdminDashboard(this.appContainer);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Default: Home
    await renderHomeView(this.appContainer);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Bootstrap application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
