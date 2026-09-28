/**
 * CultureDetailView Component
 * Curatorial deep dive into a specific cultural mythology/folklore tradition.
 */

import { api } from '../api-client.js';
import { t, resolveLocalized } from '../i18n.js';
import { renderCreatureCard } from './creature-card.js';

export async function renderCultureDetailView(container, cultureId) {
  container.innerHTML = `
    <div class="container" style="padding: 3rem 1.5rem; text-align: center;">
      <div style="color: var(--gold-500); font-family: var(--font-display); letter-spacing: 0.1em;">
        ✦ MEMBUKA LEMBAR TRADISI KEBUDAYAAN... ✦
      </div>
    </div>
  `;

  try {
    const culture = await api.getCultureDetail(cultureId);
    if (!culture) throw new Error('Culture not found');

    const name = resolveLocalized(culture.name);
    const desc = resolveLocalized(culture.description);
    const scope = resolveLocalized(culture.tradition_scope, 'Tradisi lisan dan manuskrip sejarah regional.');
    const creatures = culture.creatures || [];

    container.innerHTML = `
      <div class="container" style="padding: 2.5rem 1.5rem 5rem;">
        <!-- Breadcrumbs -->
        <nav class="detail-breadcrumb" aria-label="Breadcrumb">
          <a href="#/">Mythics</a>
          <span>/</span>
          <a href="#/cultures">${t('nav.cultures')}</a>
          <span>/</span>
          <span style="color: var(--text-primary); font-weight: 600;">${name}</span>
        </nav>

        <!-- Culture Header Banner -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: var(--radius-xl); padding: 2.5rem; margin-bottom: 3.5rem; box-shadow: var(--shadow-md);">
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
            <span class="badge badge-culture">${name}</span>
            <span class="badge" style="background: var(--bg-tertiary);">${culture.region}</span>
            <span class="badge" style="background: var(--bg-tertiary);">${culture.country}</span>
            <span class="badge" style="background: rgba(212, 175, 55, 0.15); color: var(--gold-500); border: 1px solid var(--border-glow);">${creatures.length} Entitas Terdaftar</span>
          </div>

          <h1 style="font-family: var(--font-display); font-size: clamp(2.2rem, 3.5vw, 3.2rem); margin-bottom: 1rem; color: var(--text-primary);">
            ${name}
          </h1>

          <p style="font-size: 1.1rem; line-height: 1.7; color: var(--text-secondary); max-width: 860px; margin-bottom: 2rem;">
            ${desc}
          </p>

          <div style="background: var(--bg-surface); border-left: 3px solid var(--gold-500); padding: 1.25rem 1.5rem; border-radius: var(--radius-sm);">
            <div style="font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--gold-500); font-weight: 700; margin-bottom: 0.35rem;">
              Cakupan Tradisi & Kodifikasi Sejarah
            </div>
            <div style="font-size: 0.95rem; color: var(--text-primary); line-height: 1.6;">
              ${scope}
            </div>
          </div>
        </div>

        <!-- Beings from this Culture -->
        <div class="section-header" style="text-align: left; margin-bottom: 2rem;">
          <h2 class="section-title" style="font-size: 1.8rem;">Entitas Mitologi dari Tradisi Ini</h2>
          <p class="section-subtitle">Daftar makhluk, arwah, dan sosok legendaris yang tercatat dalam khazanah ${name}.</p>
        </div>

        ${creatures.length > 0 ? `
          <div class="creature-grid" id="culture-creatures-grid">
            ${creatures.map(c => renderCreatureCard(c)).join('')}
          </div>
        ` : `
          <div style="padding: 3rem; text-align: center; background: var(--bg-card); border-radius: var(--radius-lg); color: var(--text-muted);">
            Belum ada entitas yang dipublikasikan dalam tradisi ini.
          </div>
        `}

        <div style="margin-top: 3.5rem; text-align: center;">
          <a href="#/explore?culture=${culture.id}" class="btn btn-secondary">
            Buka di Penjelajahan Arsip Lengkap →
          </a>
        </div>
      </div>
    `;

    // Attach card click handlers
    container.querySelectorAll('.creature-card').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const slug = card.getAttribute('data-slug');
        if (slug) {
          window.location.hash = `#/creature/${slug}`;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

  } catch (err) {
    container.innerHTML = `
      <div class="container" style="padding: 5rem 1.5rem; text-align: center;">
        <h2 style="color: var(--accent-crimson); margin-bottom: 1rem;">Tradisi Budaya Tidak Ditemukan</h2>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">
          Tidak dapat menemukan arsip kebudayaan dengan tanda pengenal "${cultureId}".
        </p>
        <a href="#/cultures" class="btn btn-primary">Kembali ke Daftar Tradisi</a>
      </div>
    `;
  }
}
