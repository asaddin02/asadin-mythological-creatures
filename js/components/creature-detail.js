/**
 * CreatureDetail Component
 * Comprehensive, scholarly, and immersive archive page for an individual entity.
 */

import { api } from '../api-client.js';
import { t, resolveLocalized } from '../i18n.js';
import { renderCreatureCard } from './creature-card.js';
import { gamification } from './gamification.js';

export async function renderCreatureDetail(container, slug) {
  container.innerHTML = `
    <div class="container" style="padding: 4rem 1.5rem; text-align: center;">
      <div style="color: var(--gold-500); font-family: var(--font-display); letter-spacing: 0.1em;">
        ✦ MEMBUKA CATATAN ARSIP KUNO... ✦
      </div>
    </div>
  `;

  try {
    const creature = await api.getCreature(slug);
    if (!creature) throw new Error('Creature not found');

    // Mark as discovered in journal
    gamification.markDiscovered(creature.slug, creature);

    const displayName = resolveLocalized(creature.display_name, creature.canonical_name);
    const shortDesc = resolveLocalized(creature.short_description, '');
    const longDesc = resolveLocalized(creature.long_description, shortDesc);
    const culturalContext = resolveLocalized(creature.cultural_context, '');
    const didYouKnow = resolveLocalized(creature.did_you_know, '');

    const primaryImg = creature.images?.[0];
    const imgUrl = primaryImg?.preview_url || primaryImg?.url || '/assets/placeholders/creature-fallback.svg';
    const isFav = gamification.isFavorite(creature.slug);

    const dimensions = creature.power_profile?.dimensions || {};
    const basisList = creature.power_profile?.calculated_basis || [];
    const disclaimer = resolveLocalized(creature.power_profile?.disclaimer, t('detail.powerDisclaimer'));

    const story = creature.story_mode || {};

    container.innerHTML = `
      <div class="detail-view">
        <div class="container">
          <!-- Breadcrumb -->
          <nav class="detail-breadcrumb" aria-label="Breadcrumb">
            <a href="#/">Mythics</a>
            <span>/</span>
            <a href="#/explore">Jelajah</a>
            <span>/</span>
            <a href="#/explore?culture=${creature.culture}">${creature.culture}</a>
            <span>/</span>
            <span style="color: var(--text-primary); font-weight: 600;">${creature.canonical_name}</span>
          </nav>

          <!-- Detail Hero (2 Columns) -->
          <div class="detail-hero-grid">
            <!-- Left: Imagery & Provenance -->
            <div class="detail-image-box">
              <img 
                src="${imgUrl}" 
                alt="${displayName}"
                class="detail-primary-img"
                onerror="this.onerror=null; this.src='/assets/placeholders/creature-fallback.svg';"
              />
              <div class="detail-image-meta">
                <div class="detail-image-meta-row">
                  <span style="font-weight: 600;">${primaryImg?.image_type || 'Representasi Visual'}</span>
                  <span class="badge" style="background: var(--bg-tertiary);">${primaryImg?.license || 'Public Domain'}</span>
                </div>
                <div>
                  Kredit: ${primaryImg?.author || 'Arsip Kebudayaan'}
                  ${primaryImg?.source_url ? ` · <a href="${primaryImg.source_url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.78rem;">Sumber Asli ↗</a>` : ''}
                </div>
              </div>
            </div>

            <!-- Right: Metadata & Specs -->
            <div class="detail-header-content">
              <div class="detail-badge-strip">
                <span class="badge badge-culture">${creature.culture}</span>
                <span class="badge badge-classification">${creature.classification}</span>
                <span class="badge" style="background: var(--bg-tertiary);">${creature.region}</span>
              </div>

              <h1 class="detail-canonical-name">${displayName}</h1>
              ${creature.original_name ? `<div class="detail-original-script">${creature.original_name}</div>` : ''}

              <p class="detail-short-summary">${shortDesc}</p>

              <!-- Quick Specs Grid -->
              <div class="detail-specs-grid">
                <div class="spec-cell">
                  <span class="spec-key">${t('card.origin')}</span>
                  <span class="spec-val">${creature.country || creature.region}</span>
                </div>
                <div class="spec-cell">
                  <span class="spec-key">Era / Periode</span>
                  <span class="spec-val">${creature.era || 'Klasik'}</span>
                </div>
                <div class="spec-cell">
                  <span class="spec-key">Habitat</span>
                  <span class="spec-val">${creature.habitat || 'Tidak Ditentukan'}</span>
                </div>
                <div class="spec-cell">
                  <span class="spec-key">Elemen / Sifat</span>
                  <span class="spec-val">${creature.element || 'Netral'} · ${creature.behavior || 'Ambivalen'}</span>
                </div>
              </div>

              <!-- Header Action Buttons -->
              <div class="detail-header-actions">
                <button class="btn btn-secondary" id="btn-toggle-favorite">
                  <span id="fav-icon">${isFav ? '★' : '☆'}</span>
                  <span id="fav-text">${isFav ? t('detail.bookmarkRemove') : t('detail.bookmarkAdd')}</span>
                </button>
                <a href="#/compare?a=${creature.slug}" class="btn btn-ghost" style="border: 1px solid var(--border-subtle);">
                  <span>⚔️ ${t('nav.compare')}</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Mode Switcher (Story Mode vs Expert Mode) -->
          <div class="mode-switch-bar">
            <button class="mode-btn active" id="btn-mode-story">${t('detail.storyMode')}</button>
            <button class="mode-btn" id="btn-mode-expert">${t('detail.expertMode')}</button>
          </div>

          <!-- Story Mode (TL;DR Cards) -->
          <div id="story-mode-container" class="story-mode-grid">
            <div class="story-card">
              <div class="story-card-title">${t('story.who')}</div>
              <div class="story-card-body">${resolveLocalized(story.who, displayName)}</div>
            </div>
            <div class="story-card">
              <div class="story-card-title">${t('story.origin')}</div>
              <div class="story-card-body">${resolveLocalized(story.origin, creature.region)}</div>
            </div>
            <div class="story-card">
              <div class="story-card-title">${t('story.role')}</div>
              <div class="story-card-body">${resolveLocalized(story.role, 'Entitas mitos dalam tradisi lisan.')}</div>
            </div>
            <div class="story-card">
              <div class="story-card-title">${t('story.famousFor')}</div>
              <div class="story-card-body">${resolveLocalized(story.famous_for, 'Dikenal dalam cerita rakyat dan sastra klasik.')}</div>
            </div>
          </div>

          <!-- Did You Know Trivia Box -->
          ${didYouKnow ? `
            <div class="did-you-know-card">
              <div class="did-you-know-icon">💡</div>
              <div>
                <div class="did-you-know-title">${t('detail.didYouKnow')}</div>
                <div class="did-you-know-text">${didYouKnow}</div>
              </div>
            </div>
          ` : ''}

          <!-- Detailed Lore Block -->
          <div class="detail-section-block">
            <h2 class="detail-block-title">
              <span>📜</span>
              <span>${t('detail.lore')}</span>
            </h2>
            <div class="detail-prose-text">
              <p>${longDesc}</p>
            </div>
          </div>

          <!-- Cultural Context & Modern Distinction Block -->
          ${culturalContext ? `
            <div class="detail-section-block">
              <h2 class="detail-block-title">
                <span>🏛️</span>
                <span>${t('detail.culturalContext')}</span>
              </h2>
              <div class="detail-prose-text" style="border-left: 3px solid var(--accent-cyan);">
                <p>${culturalContext}</p>
              </div>
            </div>
          ` : ''}

          <!-- Documented Abilities Section -->
          ${creature.documented_abilities && creature.documented_abilities.length > 0 ? `
            <div class="detail-section-block">
              <h2 class="detail-block-title">
                <span>⚡</span>
                <span>${t('detail.abilities')}</span>
              </h2>
              <div class="abilities-grid">
                ${creature.documented_abilities.map(ab => `
                  <div class="ability-card">
                    <div class="ability-header">
                      <h3 class="ability-name">${resolveLocalized(ab.name)}</h3>
                      <span class="evidence-badge">${ab.evidence_level || 'Documented'}</span>
                    </div>
                    <p class="ability-desc">${resolveLocalized(ab.description)}</p>
                    ${ab.source_title ? `<div class="ability-source-tag">Rujukan: ${ab.source_title}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Mythics Power Profile Panel -->
          <div class="detail-section-block">
            <h2 class="detail-block-title">
              <span>🔮</span>
              <span>${t('detail.powerProfile')}</span>
            </h2>
            <div class="power-profile-panel">
              <div class="power-profile-disclaimer-box">
                <strong>Pemberitahuan Metodologi:</strong> ${disclaimer}
              </div>

              <div class="power-dimensions-list">
                ${Object.entries(dimensions).map(([dim, val]) => `
                  <div class="power-dim-row">
                    <span class="power-dim-name">${dim}</span>
                    <div class="power-dim-track">
                      <div class="power-dim-bar" style="width: ${val}%;"></div>
                    </div>
                    <span class="power-dim-score">${val}</span>
                  </div>
                `).join('')}
              </div>

              ${basisList.length > 0 ? `
                <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem;">
                  Faktor Penurunan Profil (Deterministic Triggers):
                </div>
                <ul class="power-basis-list">
                  ${basisList.map(item => `<li>• ${item}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          </div>

          <!-- Related Beings -->
          ${creature.resolved_related && creature.resolved_related.length > 0 ? `
            <div class="detail-section-block">
              <h2 class="detail-block-title">
                <span>🕸️</span>
                <span>${t('detail.related')}</span>
              </h2>
              <div class="creature-grid" style="margin-bottom: 0;">
                ${creature.resolved_related.map(r => renderCreatureCard(r)).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Sources & Bibliographic Provenance -->
          ${creature.sources && creature.sources.length > 0 ? `
            <div class="detail-section-block">
              <h2 class="detail-block-title">
                <span>📚</span>
                <span>${t('detail.sources')}</span>
              </h2>
              <div class="sources-list">
                ${creature.sources.map(s => `
                  <div class="source-item-card">
                    <div>
                      <div class="source-item-title">${s.title}</div>
                      <div class="source-item-meta">${s.source_name} · ${s.author || 'Anonim'} (${s.publication_date || 'N/A'})</div>
                    </div>
                    ${s.url ? `
                      <a href="${s.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.85rem; font-weight: 600;">
                        Kunjungi Dokumen Sumber ↗
                      </a>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    // Attach Event Handlers
    const favBtn = container.querySelector('#btn-toggle-favorite');
    const favIcon = container.querySelector('#fav-icon');
    const favText = container.querySelector('#fav-text');

    favBtn?.addEventListener('click', () => {
      const nowFav = gamification.toggleFavorite(creature.slug);
      favIcon.textContent = nowFav ? '★' : '☆';
      favText.textContent = nowFav ? t('detail.bookmarkRemove') : t('detail.bookmarkAdd');
    });

    // Story vs Expert Mode toggles
    const btnStory = container.querySelector('#btn-mode-story');
    const btnExpert = container.querySelector('#btn-mode-expert');
    const storyContainer = container.querySelector('#story-mode-container');

    btnStory?.addEventListener('click', () => {
      btnStory.classList.add('active');
      btnExpert.classList.remove('active');
      if (storyContainer) storyContainer.style.display = 'grid';
    });

    btnExpert?.addEventListener('click', () => {
      btnExpert.classList.add('active');
      btnStory.classList.remove('active');
      if (storyContainer) storyContainer.style.display = 'none';
    });

    // Related creature card clicks
    container.querySelectorAll('.creature-card').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSlug = card.getAttribute('data-slug');
        if (targetSlug) {
          window.location.hash = `#/creature/${targetSlug}`;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

  } catch (err) {
    container.innerHTML = `
      <div class="container" style="padding: 5rem 1.5rem; text-align: center;">
        <h2 style="font-size: 2rem; margin-bottom: 1rem; color: var(--accent-crimson);">Arsip Tidak Ditemukan</h2>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">
          Entitas dengan identitas "${slug}" belum tercatat atau telah dipindahkan.
        </p>
        <a href="#/explore" class="btn btn-primary">Kembali ke Penjelajahan</a>
      </div>
    `;
  }
}
