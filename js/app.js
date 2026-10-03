/**
 * Mythics Client Application Main Entry Point
 * Routing, view lifecycle management, and global event coordination.
 */

import { initImageViewer } from './components/image-viewer.js';
import { initMotion } from './motion.js';
import { renderScalingGuide } from './components/scaling-guide.js';
import { bi, icon } from './ui.js';
import { initI18n, t } from './i18n.js';
import { renderNavbar } from './components/navbar.js';
import { renderHomeView } from './components/home-view.js';
import { openRandomEncounterModal } from './components/random-encounter.js';
import { adminEnabled } from './api-client.js';

class App {
  constructor() {
    this.appContainer = document.getElementById('app');
    this.headerContainer = document.getElementById('header-root');
    this.footerContainer = document.getElementById('footer-root');
  }

  init() {
    // A single, permanent dark identity, including visitors with a saved legacy light theme.
    document.documentElement.dataset.theme = 'dark';
    localStorage.removeItem('mythics_theme');

    localStorage.removeItem('mythics_aura');

    // 2. Initialize i18n
    initI18n();
    initImageViewer();
    initMotion(this.appContainer);

    // 3. Render Persistent Chrome (Navbar & Footer)
    this.renderChrome();

    // 4. Listen for route transitions and language changes
    window.addEventListener('hashchange', () => this.handleRouting());
    window.addEventListener('mythics:lang-change', () => {
      this.renderChrome();
      this.handleRouting();
    });

    document.querySelector('.skip-link')?.addEventListener('click', e => { e.preventDefault(); this.appContainer.focus(); this.appContainer.scrollIntoView(); });

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
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                  <span class="footer-emblem" aria-hidden="true">${icon('crown', 30)}</span>
                  <span style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 800; color: var(--gold-500); letter-spacing: 0.15em;">MYTHICS</span>
                </div>
                <p class="footer-desc">${t('footer.aboutText')}</p>
                <div class="footer-philosophy">${t('footer.philosophy')}</div>
              </div>

              <div>
                <h4 class="footer-col-title">${t('footer.quickLinks')}</h4>
                <ul class="footer-links">
                  <li><a href="#/explore">${t('nav.explore')}</a></li>
                  <li><a href="#/cultures">${t('nav.cultures')}</a></li><li><a href="#/scales">${bi('Panduan Kelas', 'Class Guide')}</a></li>
                  <li><a href="#/compare">${t('nav.compare')}</a></li>
                  <li><a href="#/journal">${t('nav.journal')}</a></li>
                  ${adminEnabled ? `<li><a href="#/admin">${t('nav.admin')}</a></li>` : ''}
                </ul>
              </div>

              <div>
                <h4 class="footer-col-title">${bi('Tentang arsip', 'About the archive')}</h4>
                <ul class="footer-links">
                  <li><a href="#/dukung">${bi('Dukung Mythics', 'Support Mythics')}</a></li>
                  <li><a href="#/learn?module=reading">${t('footer.sourcesPolicy')}</a></li>
                  <li><a href="#/learn?module=reading">${t('footer.licensing')}</a></li>
                  <li><span style="font-size: 0.85rem; color: var(--text-muted);">${bi('Tradisi · Konteks · Interpretasi', 'Tradition · Context · Interpretation')}</span></li>
                </ul>
              </div>
            </div>

            <div class="footer-bottom">
              <div>© 2026 Mythics · ${bi('Proyek eksplorasi budaya oleh Asadin', 'A cultural exploration project by Asadin')}</div>
              <div>Bilingual Platform (Bahasa Indonesia & English)</div>
            </div>
          </div>
        </footer>
      `;
    }
  }

  async handleRouting() {
    this.routeController?.abort();
    const controller = new AbortController();
    this.routeController = controller;
    // A detached view cannot overwrite a newer route after an asynchronous fetch.
    const routeContainer = document.createElement('div');
    this.appContainer.replaceChildren(routeContainer);
    const rawHash = window.location.hash.slice(1) || '/';
    const [pathWithQuery] = rawHash.split('?');
    const path = pathWithQuery.replace(/\/+$/, '') || '/';
    const queryString = rawHash.includes('?') ? rawHash.split('?')[1] : '';
    const params = Object.fromEntries(new URLSearchParams(queryString));

    // Update active navbar links
    document.querySelectorAll('.nav-link').forEach(link => {
      const routeAttr = link.getAttribute('data-route');
      const href = link.getAttribute('href')?.replace('#/', '');
      const section = path.replace(/^\//, '').split('/')[0];
      const currentSection = ({creature:'explore',culture:'cultures',region:'regions'})[section] || section;
      const active = routeAttr === currentSection || href === currentSection;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
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
      const { renderCreatureDetail } = await import('./components/creature-detail.js');
      if (!routeContainer.isConnected) return;
      await renderCreatureDetail(routeContainer, slug);
      if (routeContainer.isConnected) window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (path === '/scales') {
      renderScalingGuide(routeContainer, params);
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (path === '/dukung') {
      const { renderSupportView } = await import('./components/support-view.js');
      if (!routeContainer.isConnected) return;
      renderSupportView(routeContainer);
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (path === '/learn') {
      const { renderLearnView } = await import('./components/learn-view.js');
      if (!routeContainer.isConnected) return;
      renderLearnView(routeContainer, params);
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    // Explore Route: /explore
    if (path === '/explore') {
      const { renderExploreView } = await import('./components/explore.js');
      if (!routeContainer.isConnected) return;
      await renderExploreView(routeContainer, params);
      if (routeContainer.isConnected) window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    // Cultures Route: /cultures
    if (path === '/cultures') {
      const { renderCulturesView } = await import('./components/cultures-view.js');
      if (!routeContainer.isConnected) return;
      await renderCulturesView(routeContainer);
      if (routeContainer.isConnected) window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    // Culture Detail Route: /culture/:id
    const cultureMatch = path.match(/^\/culture\/([a-zA-Z0-9_-]+)$/);
    if (cultureMatch) {
      const cultureId = cultureMatch[1];
      const { renderCultureDetailView } = await import('./components/culture-detail-view.js');
      if (!routeContainer.isConnected) return;
      await renderCultureDetailView(routeContainer, cultureId);
      if (routeContainer.isConnected) window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    // Regions Route: /regions
    if (path === '/regions') {
      const { renderRegionsView } = await import('./components/regions-view.js');
      if (!routeContainer.isConnected) return;
      await renderRegionsView(routeContainer);
      if (routeContainer.isConnected) window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    // Region Detail Route: /region/:id
    const regionMatch = path.match(/^\/region\/([a-zA-Z0-9_-]+)$/);
    if (regionMatch) {
      const regId = regionMatch[1];
      const { renderExploreView } = await import('./components/explore.js');
      if (!routeContainer.isConnected) return;
      await renderExploreView(routeContainer, { region: regId });
      if (routeContainer.isConnected) window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    // Compare Route: /compare
    if (path === '/compare') {
      const { renderComparisonView } = await import('./components/comparison.js');
      if (!routeContainer.isConnected) return;
      await renderComparisonView(routeContainer, params.a || 'garuda', params.b || 'kitsune');
      if (routeContainer.isConnected) window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    // Journal Route: /journal
    if (path === '/journal') {
      const { renderJournalView } = await import('./components/journal.js');
      if (!routeContainer.isConnected) return;
      await renderJournalView(routeContainer);
      if (routeContainer.isConnected) window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    // Admin Route: /admin (only when the local server enables the editorial console)
    if (path === '/admin' && adminEnabled) {
      const { renderAdminDashboard } = await import('./components/admin-dashboard.js');
      if (!routeContainer.isConnected) return;
      await renderAdminDashboard(routeContainer);
      if (routeContainer.isConnected) window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    // Default: Home
    await renderHomeView(routeContainer, controller.signal);
    if (routeContainer.isConnected) window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

// Cached modules and late imports must also initialize after DOMContentLoaded.
const bootstrap = () => new App().init();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once:true });
} else {
  bootstrap();
}
