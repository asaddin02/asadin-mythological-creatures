/**
 * Navbar Component
 * Renders header, site logo, navigation routes, theme switcher,
 * and language toggle.
 */

import { t, getLanguage, setLanguage } from '../i18n.js';

export function renderNavbar(container) {
  const currentLang = getLanguage();
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

  container.innerHTML = `
    <header class="site-header">
      <div class="container">
        <nav class="navbar" aria-label="Main Navigation">
          <a href="#/" class="brand-link">
            <svg class="brand-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="9"/>
              <path d="M12 3v18"/>
              <path d="M3 12h18"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>
            <span class="brand-name">${t('nav.brand')}</span>
          </a>

          <ul class="nav-links" id="main-nav-links">
            <li><a href="#/explore" class="nav-link" data-route="explore">${t('nav.explore')}</a></li>
            <li><a href="#/cultures" class="nav-link" data-route="cultures">${t('nav.cultures')}</a></li>
            <li><a href="#/random" class="nav-link" data-action="random-encounter">${t('nav.random')}</a></li>
            <li><a href="#/compare" class="nav-link" data-route="compare">${t('nav.compare')}</a></li>
            <li><a href="#/journal" class="nav-link" data-route="journal">${t('nav.journal')}</a></li>
            <li><a href="#/admin" class="nav-link" data-route="admin">${t('nav.admin')}</a></li>
          </ul>

          <div class="nav-actions">
            <!-- Language Switcher -->
            <button class="lang-toggle-btn" id="lang-toggle-btn" title="Ganti Bahasa / Switch Language" aria-label="Switch Language">
              <span>${currentLang === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}</span>
            </button>

            <!-- Theme Toggle -->
            <button class="btn-icon" id="theme-toggle-btn" title="Toggle Theme" aria-label="Toggle Theme">
              <svg id="theme-icon-sun" class="${currentTheme === 'dark' ? '' : 'hidden'}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
              <svg id="theme-icon-moon" class="${currentTheme === 'light' ? '' : 'hidden'}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </button>

            <!-- Mobile Nav Toggle -->
            <button class="btn-icon mobile-nav-toggle" id="mobile-menu-toggle" aria-label="Open Navigation Menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </header>
  `;

  // Attach event handlers
  const langBtn = container.querySelector('#lang-toggle-btn');
  langBtn?.addEventListener('click', () => {
    const nextLang = getLanguage() === 'id' ? 'en' : 'id';
    setLanguage(nextLang);
  });

  const themeBtn = container.querySelector('#theme-toggle-btn');
  themeBtn?.addEventListener('click', () => {
    const active = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = active === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('mythics_theme', next);
    
    // Toggle icons
    container.querySelector('#theme-icon-sun')?.classList.toggle('hidden', next !== 'dark');
    container.querySelector('#theme-icon-moon')?.classList.toggle('hidden', next !== 'light');
  });

  const mobileToggle = container.querySelector('#mobile-menu-toggle');
  const navLinks = container.querySelector('#main-nav-links');
  mobileToggle?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
  });

  // Close mobile nav on click
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}
