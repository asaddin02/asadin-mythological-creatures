import { mountDossier } from './dossier.js';
import { artwork, previewAttributes, downloadAttributes } from './image-viewer.js';
import { renderGildedFrame } from './gilded-frame.js';
/**
 * CreatureDetail Component
 * Comprehensive, scholarly, and immersive archive page for an individual entity.
 * Supports Multi-Tier Content (Core, Rich, Archive), Claim-level Provenance,
 * Ability Matrix, Historical Timeline, Tradition vs Pop Culture, and Semantic Relationship Graph.
 */

import { getAssessment } from '../scaling.js';
import { renderScaleBadges, renderAssessmentPanel } from './scaling-guide.js';
import { bi, editorialArt, escapeHtml, icon } from '../ui.js';
import { api } from '../api-client.js';
import { t, resolveLocalized } from '../i18n.js';
import { renderCreatureCard } from './creature-card.js';
import { gamification } from './gamification.js';
import { renderRelationshipGraph } from './relationship-graph.js';

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

    const art = editorialArt(creature.slug);
    const primaryImg = art ? { url: art, image_type: bi('Interpretasi artistik AI', 'AI artistic interpretation'), license: bi('Ilustrasi editorial', 'Editorial illustration'), author: 'Mythics · OpenAI image generation' } : creature.images?.[0];
    const imgUrl = primaryImg?.preview_url || primaryImg?.url || '/assets/placeholders/creature-fallback.svg';
    const artData = artwork(creature);
    const profile = getAssessment(creature);
    const isFav = gamification.isFavorite(creature.slug);

    const tier = creature.content_tier || 'rich';
    const tierLabel = tier === 'archive' ? bi('Catatan arsip', 'Archive notes') : tier === 'rich' ? bi('Kisah & konteks', 'Story & context') : bi('Pengantar', 'Introduction');

    const dimensions = creature.power_profile?.dimensions || {};
    const basisList = creature.power_profile?.calculated_basis || [];
    const disclaimer = resolveLocalized(creature.power_profile?.disclaimer, t('detail.powerDisclaimer'));

    const story = creature.story_mode || {};
    const etymology = creature.etymology || null;
    const timeline = creature.historical_timeline || [];
    const popContrast = creature.pop_culture_contrast || null;
    const abilityMatrix = creature.ability_matrix || [];
    const weaknesses = creature.weaknesses_limitations || [];
    const claims = creature.claims_provenance || [];
    const stories = creature.associated_stories || [];
    const places = creature.associated_places || [];
    const variants = creature.variants || [];

    function renderStatusBadge(status) {
      if (status === 'strongly_documented') {
        return `<span class="status-badge status-strongly-documented">✓ Terdokumentasi Primer</span>`;
      }
      if (status === 'documented') {
        return `<span class="status-badge status-documented">✓ Terdokumentasi</span>`;
      }
      if (status === 'uncertain') {
        return `<span class="status-badge status-uncertain">? Atribut Tak Pasti</span>`;
      }
      return `<span class="status-badge status-not-documented">— Tidak Terdokumentasi</span>`;
    }

    container.innerHTML = `
      <div class="detail-view">
        <div class="container">
          <nav class="detail-breadcrumb" aria-label="Breadcrumb"><a href="#/explore">${bi('Bestiary','Bestiary')}</a><span>/</span><a href="#/culture/${creature.culture}">${escapeHtml((creature.culture || '').replace(/-/g, ' '))}</a><span>/</span><span aria-current="page">${escapeHtml(displayName)}</span></nav>
          <header class="detail-hero-grid">
            <div class="detail-header-content">
              <div class="detail-overline"><span class="fine-line"></span>${escapeHtml(creature.country || creature.region)} · ${escapeHtml(creature.classification)}</div>
              <h1 class="detail-canonical-name">${escapeHtml(displayName)}</h1>
              ${creature.original_name ? `<p class="detail-original-script">${escapeHtml(creature.original_name)}</p>` : ''}
              <p class="detail-short-summary">${escapeHtml(shortDesc)}</p>
              <div class="detail-classification-heading"><span>${bi('TIGA DIMENSI LEGENDA','THREE DIMENSIONS OF LEGEND')}</span><a href="#/scales">${bi('Panduan kelas','Class guide')} ↗</a></div>
              ${renderScaleBadges(creature, true)}
              <dl class="detail-facts">
                <div><dt>${bi('Tradisi','Tradition')}</dt><dd>${escapeHtml((creature.culture || '').replace(/-/g, ' '))}</dd></div>
                <div><dt>${bi('Habitat','Habitat')}</dt><dd>${escapeHtml(creature.habitat || bi('Belum dicatat','Not recorded'))}</dd></div>
                <div><dt>${bi('Elemen','Element')}</dt><dd>${escapeHtml(creature.element || '—')}</dd></div>
                <div><dt>${bi('Periode','Period')}</dt><dd>${escapeHtml(creature.era || bi('Tradisi lintas zaman','A tradition across time'))}</dd></div>
              </dl>
              <div class="detail-header-actions"><button class="btn btn-primary" data-scroll="detail-lore">${bi('Baca kisahnya','Read the story')} ${icon('arrow',17)}</button><button class="detail-save" id="btn-toggle-favorite" aria-pressed="${isFav}"><span id="fav-icon">${isFav ? '★' : '☆'}</span><span id="fav-text">${isFav ? t('detail.bookmarkRemove') : t('detail.bookmarkAdd')}</span></button><a class="detail-compare-link" href="#/compare?a=${creature.slug}">${t('nav.compare')} ↗</a></div>
            </div>
            <figure class="detail-illustration">
              <div class="detail-art-stage power-${profile.power || 'unknown'}"><button type="button" class="detail-preview image-preview-trigger" ${previewAttributes(artData)}><img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(displayName)}" class="detail-primary-img" decoding="async" onerror="this.onerror=null;this.src='/assets/placeholders/creature-fallback.svg';"><span class="detail-zoom-mark">${icon('zoom',20)}<span>${bi('Perbesar','Zoom')}</span></span></button>${renderGildedFrame(profile.power)}</div>
              <div class="detail-art-tools"><button type="button" class="detail-open-art" ${previewAttributes(artData)}>${icon('zoom',17)} ${bi('Lihat ilustrasi','View artwork')}</button><button type="button" class="detail-download" ${downloadAttributes(artData)}>${icon('download',17)} ${bi('Unduh gambar','Download image')}</button></div>
              <p class="detail-download-status" role="status"></p>
              <figcaption><span>${escapeHtml(primaryImg?.image_type || bi('Visual belum tersedia','Visual unavailable'))}</span><span>${escapeHtml(primaryImg?.author || '—')}${primaryImg?.source_url ? ` · <a href="${escapeHtml(primaryImg.source_url)}" target="_blank" rel="noopener noreferrer">${bi('Sumber asli','Original source')} ↗</a>` : ''}</span><small>${escapeHtml(primaryImg?.license || '')}</small></figcaption>
            </figure>
          </header>
          <div class="detail-reading-layout">
            <aside class="detail-reading-rail"><div class="detail-rail-inner"><span class="eyebrow">${bi('DI DALAM ARSIP','IN THIS ARCHIVE')}</span><nav class="detail-toc" aria-label="${bi('Daftar isi','On this page')}"><button data-scroll="detail-lore"><span>01</span>${bi('Kisah & asal-usul','Story & origins')}</button><button data-scroll="detail-scaling"><span>02</span>${bi('Kelas & kekuatan','Classes & powers')}</button><button data-scroll="detail-study"><span>03</span>${bi('Catatan pembaca','Reader’s notes')}</button>${creature.sources?.length ? `<button data-scroll="detail-sources"><span>04</span>${bi('Sumber bacaan','Reading sources')}</button>` : ''}</nav><p>${bi('Setiap legenda hidup dalam banyak versi. Baca bersama tradisi dan sumbernya.','Every legend lives in many versions. Read it with its traditions and sources.')}</p><span class="detail-curation-note">${escapeHtml(tierLabel)}</span></div></aside>
            <article class="detail-reading-content">
              <section class="detail-summary-section" data-topic="overview"><div class="eyebrow">${bi('SEKILAS TENTANGNYA','AT A GLANCE')}</div><h2>${bi('Mengenal','Meet')} ${escapeHtml(displayName)}</h2>
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

              </section>
          <!-- Detailed Lore Block -->
          <div class="detail-section-block" id="detail-lore">
            <h2 class="detail-block-title">
              <span>📜</span>
              <span>${t('detail.lore')}</span>
            </h2>
            <div class="detail-prose-text">
              ${creature.import_method === 'wikipedia-category-library' ? `<div class="source-reading-notice"><strong>${bi('Pengantar bersumber · belum dikurasi mendalam','Sourced introduction · not yet individually curated')}</strong><p>${creature.translation_status === 'english-source-only' ? bi('Uraian berikut tersedia dalam bahasa sumber (Inggris). Terjemahan lengkap Bahasa Indonesia belum tersedia.','This introduction is available in English. A full Indonesian translation is not yet available.') : bi('Uraian berasal dari edisi bahasa sumber Wikipedia; versi Indonesia dan Inggris dapat berbeda cakupan.','Text comes from Wikipedia language editions; Indonesian and English introductions may differ in coverage.')}</p></div>` : ''}
              <p ${creature.translation_status === 'english-source-only' ? 'lang="en"' : ''}>${escapeHtml(longDesc)}</p>
              ${creature.import_method === 'wikipedia-category-library' ? `<p class="source-text-credit">${bi('Kutipan pengantar dinormalisasi spasinya dari','Introductory extract with normalized whitespace from')} <a href="${creature.sources.find(s => s.source_name.includes(creature.translation_status === 'english-source-only' ? '(en)' : bi('(id)','(en)')))?.url || creature.sources[0].url}" target="_blank" rel="noopener noreferrer">Wikipedia · ${escapeHtml(creature.canonical_name)}</a> · Wikipedia contributors · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a></p>` : ''}
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

          <!-- Etymology & Original Form Block -->
          ${etymology ? `
            <div class="detail-section-block">
              <h2 class="detail-block-title">
                <span>🔤</span>
                <span>${t('detail.etymology')}</span>
              </h2>
              <div class="etymology-panel">
                <div class="etymology-grid">
                  <div class="etymology-item">
                    <span class="etymology-label">Bentuk Tulisan Asli</span>
                    <span class="etymology-val" style="color: var(--gold-500); font-family: var(--font-display); font-size: 1.25rem;">
                      ${etymology.original_form || creature.original_name || creature.canonical_name}
                    </span>
                  </div>
                  <div class="etymology-item">
                    <span class="etymology-label">Bahasa Sumber</span>
                    <span class="etymology-val">${etymology.language || 'Bahasa Klasik'}</span>
                  </div>
                  <div class="etymology-item">
                    <span class="etymology-label">Makna Harfiah (Literal)</span>
                    <span class="etymology-val">${etymology.literal_meaning || 'Tidak terdokumentasi'}</span>
                  </div>
                  <div class="etymology-item">
                    <span class="etymology-label">Pelafalan / Transliterasi</span>
                    <span class="etymology-val" style="font-family: var(--font-mono); font-size: 0.95rem;">
                      ${etymology.pronunciation || creature.canonical_name}
                    </span>
                  </div>
                </div>
                ${etymology.root_origin ? `
                  <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle); font-size: 0.88rem; color: var(--text-secondary);">
                    <strong>Akar Linguistik:</strong> ${etymology.root_origin}
                  </div>
                ` : ''}
              </div>
            </div>
          ` : ''}

          <section class="detail-section-block" data-topic="culture" id="detail-study"><div class="study-notes"><div><span class="eyebrow">${bi('CATATAN PEMBACA','READER’S NOTES')}</span><h3>${bi('Membaca dengan konteks','Read with context')}</h3><p>${resolveLocalized(creature.learning_notes?.context, bi('Baca rincian kisah bersama tempat, masa, dan sumber yang mencatatnya. Variasi antarpenutur tidak selalu merupakan pertentangan.','Read story details with their place, period, and source. Differences between narrators are not necessarily contradictions.'))}</p><a class="text-link" href="#/learn?module=reading">${bi('Panduan membaca sumber','A guide to reading sources')} →</a></div><div><h3>${bi('Pertanyaan untuk ditelusuri','Questions to explore')}</h3><ul>${(creature.learning_notes?.questions || [{id:'Bagian mana yang berasal dari tradisi, dan mana yang merupakan interpretasi modern?',en:'Which details come from tradition, and which are modern interpretations?'}]).map(q=>`<li>${resolveLocalized(q)}</li>`).join('')}</ul><p style="margin-top:14px;font-size:11px">${bi('Pertanyaan reflektif editorial; bukan tambahan klaim sejarah.','Editorial reflection prompts; not additional historical claims.')}</p></div></div></section>
          <!-- Cultural Context & Sacred Nuance Block -->
          ${culturalContext ? `
            <div class="detail-section-block" data-topic="culture">
              <h2 class="detail-block-title">
                <span>🏛️</span>
                <span>${t('detail.culturalContext')}</span>
              </h2>
              <div class="detail-prose-text" style="border-left: 3px solid var(--accent-cyan);">
                <p>${culturalContext}</p>
              </div>
            </div>
          ` : ''}

          <!-- Ability Matrix Panel -->
          ${abilityMatrix && abilityMatrix.length > 0 ? `
            <div class="detail-section-block" data-topic="power">
              <h2 class="detail-block-title">
                <span>📊</span>
                <span>${t('detail.abilityMatrix')}</span>
              </h2>
              <div class="ability-matrix-panel table-scroll" tabindex="0" role="region" aria-label="${bi('Tabel kemampuan', 'Ability table')}">
                <table class="ability-matrix-table">
                  <thead>
                    <tr>
                      <th>Kemampuan / Atribut Taksonomi</th>
                      <th>Status Pembuktian Tradisi</th>
                      <th>Catatan Bukti & Sumber Klaim</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${abilityMatrix.map(ab => `
                      <tr>
                        <td style="font-weight: 600; color: var(--text-primary);">
                          ${resolveLocalized(ab.name)}
                        </td>
                        <td>
                          ${renderStatusBadge(ab.status)}
                        </td>
                        <td style="font-size: 0.85rem; color: var(--text-secondary);">
                          ${resolveLocalized(ab.evidence_note)}
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          ` : ''}

          <!-- Documented Abilities Section -->
          ${creature.documented_abilities && creature.documented_abilities.length > 0 ? `
            <div class="detail-section-block" data-topic="power">
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

          <!-- Weaknesses & Constraints -->
          ${weaknesses && weaknesses.length > 0 ? `
            <div class="detail-section-block" data-topic="power">
              <h2 class="detail-block-title">
                <span>🛡️</span>
                <span>${t('detail.weaknesses')}</span>
              </h2>
              <div class="abilities-grid">
                ${weaknesses.map(w => `
                  <div class="ability-card" style="border-left: 3px solid var(--accent-amber);">
                    <div class="ability-header">
                      <h3 class="ability-name">${resolveLocalized(w.name)}</h3>
                      <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: var(--accent-amber); font-size: 0.72rem;">
                        ${w.evidence_level || 'Tradisi Asli'}
                      </span>
                    </div>
                    <p class="ability-desc">${resolveLocalized(w.description)}</p>
                    ${w.source_title ? `<div class="ability-source-tag">Sumber: ${w.source_title}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${renderAssessmentPanel(creature)}
          <!-- Mythics Power Profile Panel -->
          <div class="detail-section-block" data-topic="power">
            <h2 class="detail-block-title">
              <span>🔮</span>
              <span>${t('detail.powerProfile')}</span>
            </h2>
            <div class="power-profile-panel">
              <div class="power-profile-disclaimer-box">
                <strong>Pemberitahuan Metodologi:</strong> ${disclaimer}
              </div>

              <div class="power-dimensions-list">
                ${!Object.keys(dimensions).length ? `<p>${bi('Belum ada skor yang dinilai. Data kosong tidak berarti kekuatan nol.','No scores have been assessed. Missing data does not mean zero power.')}</p>` : ''}
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
                  ${bi('Dasar perhitungan profil:', 'Profile calculation basis:')}
                </div>
                <ul class="power-basis-list">
                  ${basisList.map(item => `<li>• ${item}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          </div>

          <!-- Historical Timeline & Earliest Attestation -->
          ${timeline && timeline.length > 0 ? `
            <div class="detail-section-block" data-topic="culture">
              <h2 class="detail-block-title">
                <span>⏳</span>
                <span>${t('detail.historicalTimeline')}</span>
              </h2>
              <div class="timeline-stream">
                ${timeline.map(node => `
                  <div class="timeline-node">
                    <div class="timeline-marker"></div>
                    <div class="timeline-node-header">
                      <span class="timeline-period-badge">${node.period}</span>
                      ${node.earliest_attestation ? `
                        <span class="timeline-earliest-badge">⭐ Bukti Tertua Terdokumentasi</span>
                      ` : ''}
                    </div>
                    <h3 class="timeline-node-title">${resolveLocalized(node.title)}</h3>
                    <p class="timeline-node-desc">${resolveLocalized(node.description)}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Tradition vs Pop Culture -->
          ${popContrast ? `
            <div class="detail-section-block" data-topic="culture">
              <h2 class="detail-block-title">
                <span>🎭</span>
                <span>${t('detail.popCulture')}</span>
              </h2>
              <div class="contrast-panel">
                <div class="contrast-summaries-grid">
                  <div class="contrast-box tradition">
                    <div class="contrast-box-title">🏛️ Esensi Tradisi Asli</div>
                    <p style="font-size: 0.92rem; color: var(--text-primary); line-height: 1.6;">
                      ${resolveLocalized(popContrast.traditional_summary)}
                    </p>
                  </div>
                  <div class="contrast-box modern">
                    <div class="contrast-box-title">🎬 Penggambaran Budaya Pop Modern</div>
                    <p style="font-size: 0.92rem; color: var(--text-primary); line-height: 1.6;">
                      ${resolveLocalized(popContrast.modern_depiction)}
                    </p>
                  </div>
                </div>

                ${popContrast.major_differences && popContrast.major_differences.length > 0 ? `
                  <div class="table-scroll" tabindex="0" role="region" aria-label="Tradisi dan adaptasi / Tradition and adaptation"><table class="diff-table">
                    <thead>
                      <tr>
                        <th style="width: 25%;">Aspek Pembanding</th>
                        <th style="width: 37.5%; color: var(--gold-500);">Tradisi Asli / Historis</th>
                        <th style="width: 37.5%; color: var(--accent-cyan);">Media Populer / Fiksi Modern</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${popContrast.major_differences.map(diff => `
                        <tr>
                          <td style="font-weight: 600; color: var(--text-primary);">${resolveLocalized(diff.aspect)}</td>
                          <td style="color: var(--text-secondary);">${resolveLocalized(diff.tradition)}</td>
                          <td style="color: var(--text-secondary);">${resolveLocalized(diff.modern)}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table></div>
                ` : ''}
              </div>
            </div>
          ` : ''}

          <!-- Associated Stories & Sacred Places -->
          ${stories && stories.length > 0 ? `
            <div class="detail-section-block" data-topic="lore">
              <h2 class="detail-block-title">
                <span>📖</span>
                <span>${t('detail.associatedStories')}</span>
              </h2>
              <div class="stories-grid">
                ${stories.map(st => `
                  <div class="archive-card">
                    <span class="archive-card-sub">${resolveLocalized(st.role)}</span>
                    <h3 class="archive-card-title">${resolveLocalized(st.title)}</h3>
                    <p class="archive-card-desc">${resolveLocalized(st.summary)}</p>
                    ${st.source_ref ? `<div style="font-size: 0.75rem; color: var(--text-muted); margin-top: auto;">Rujukan: ${st.source_ref}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${places && places.length > 0 ? `
            <div class="detail-section-block">
              <h2 class="detail-block-title">
                <span>🏔️</span>
                <span>${t('detail.associatedPlaces')}</span>
              </h2>
              <div class="places-grid">
                ${places.map(pl => `
                  <div class="archive-card" style="border-left: 3px solid var(--accent-cyan);">
                    <span class="archive-card-sub">${pl.type}</span>
                    <h3 class="archive-card-title">${resolveLocalized(pl.name)}</h3>
                    <p class="archive-card-desc">${resolveLocalized(pl.description)}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Traditional & Regional Variants -->
          ${variants && variants.length > 0 ? `
            <div class="detail-section-block" data-topic="culture">
              <h2 class="detail-block-title">
                <span>🗺️</span>
                <span>${t('detail.variants')}</span>
              </h2>
              <div class="variants-grid">
                ${variants.map(v => `
                  <div class="archive-card">
                    <span class="archive-card-sub">${resolveLocalized(v.region_or_tradition)}</span>
                    <h3 class="archive-card-title">${v.name}</h3>
                    <p class="archive-card-desc">${resolveLocalized(v.description)}</p>
                    ${v.source_title ? `<div style="font-size: 0.75rem; color: var(--text-muted); margin-top: auto;">Sumber: ${v.source_title}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Semantic Relationship Graph -->
          <div class="detail-section-block" data-topic="relations">
            <h2 class="detail-block-title">
              <span>🕸️</span>
              <span>${t('detail.relationshipGraph')}</span>
            </h2>
            <div id="relationship-graph-mount" class="graph-container-box"></div>
          </div>

          <!-- Related Beings -->
          ${creature.resolved_related && creature.resolved_related.length > 0 ? `
            <div class="detail-section-block" data-topic="relations">
              <h2 class="detail-block-title">
                <span>👥</span>
                <span>${t('detail.related')}</span>
              </h2>
              <div class="creature-grid" style="margin-bottom: 0;">
                ${creature.resolved_related.map(r => renderCreatureCard(r)).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Claim-Level Provenance & Source Hierarchy -->
          ${claims && claims.length > 0 ? `
            <div class="detail-section-block" data-topic="sources">
              <h2 class="detail-block-title">
                <span>🔍</span>
                <span>${t('detail.claimsProvenance')}</span>
              </h2>
              <div class="claims-panel table-scroll" tabindex="0" role="region" aria-label="${bi('Tabel sumber klaim', 'Claim source table')}">
                <table class="claims-table">
                  <thead>
                    <tr>
                      <th style="width: 45%;">Pernyataan / Klaim Fakta Tradisi</th>
                      <th style="width: 15%;">Tipe Klaim</th>
                      <th style="width: 25%;">Rujukan Sumber / Sitasi</th>
                      <th style="width: 15%;">Hierarki Sumber</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${claims.map(cl => `
                      <tr>
                        <td style="font-size: 0.9rem; color: var(--text-primary); font-weight: 500;">
                          ${resolveLocalized(cl.claim)}
                        </td>
                        <td>
                          <span class="badge" style="background: var(--bg-tertiary); font-size: 0.75rem;">
                            ${cl.claim_type || 'tradition'}
                          </span>
                        </td>
                        <td style="font-size: 0.85rem; color: var(--text-secondary);">
                          ${cl.source_citation || 'Tradisi Historis'}
                        </td>
                        <td>
                          <span class="source-hierarchy-badge ${cl.source_type || 'Reference'}">
                            ${cl.source_type || 'Reference'}
                          </span>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          ` : ''}

          <!-- Sources & Bibliographic Provenance -->
          ${creature.sources && creature.sources.length > 0 ? `
            <div class="detail-section-block" data-topic="sources" id="detail-sources">
              <h2 class="detail-block-title">
                <span>📚</span>
                <span>${t('detail.sources')}</span>
              </h2>
              <div class="sources-list">
                ${creature.sources.map(s => `
                  <div class="source-item-card">
                    <div>
                      <div class="source-item-title">${s.title}</div>
                      <div class="source-item-meta">${s.source_name} · ${s.author || 'Anonim'}${s.publication_date ? ' · ' + s.publication_date : ''}${s.license ? ' · ' + s.license : ''}${s.revision_id ? ' · revision ' + s.revision_id : ''}</div>
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
            </article>
          </div>
        </div>
      </div>
    `;

    const sources = container.querySelector('#detail-sources');
    const firstSourceBlock = container.querySelector('[data-topic="sources"]');
    if (sources && firstSourceBlock !== sources) firstSourceBlock.before(sources);
    const assessment = container.querySelector('#detail-scaling');
    assessment.dataset.topic = 'power';
    const firstPowerBlock = container.querySelector('[data-topic="power"]');
    if (firstPowerBlock !== assessment) firstPowerBlock.before(assessment);
    mountDossier(container, creature.slug);
    // Mount Relationship Graph asynchronously into the container
    const graphMount = container.querySelector('#relationship-graph-mount');
    if (graphMount) {
      renderRelationshipGraph(graphMount, creature.slug);
    }

    // Attach Event Handlers
    const favBtn = container.querySelector('#btn-toggle-favorite');
    const favIcon = container.querySelector('#fav-icon');
    const favText = container.querySelector('#fav-text');

    favBtn?.addEventListener('click', () => {
      const nowFav = gamification.toggleFavorite(creature.slug);
      favBtn.setAttribute('aria-pressed', String(nowFav));
      favIcon.textContent = nowFav ? '★' : '☆';
      favText.textContent = nowFav ? t('detail.bookmarkRemove') : t('detail.bookmarkAdd');
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
