/**
 * AdminDashboard Component
 * Editorial oversight, autonomous ingestion trigger, and review queue manager.
 */

import { api } from '../api-client.js';
import { t, resolveLocalized } from '../i18n.js';

export async function renderAdminDashboard(container) {
  container.innerHTML = `
    <div class="container" style="padding: 2.5rem 1.5rem 5rem;">
      <div class="section-header">
        <span class="section-badge">${t('admin.title')}</span>
        <h1 class="section-title">${t('admin.title')}</h1>
        <p class="section-subtitle">${t('admin.subtitle')}</p>
      </div>

      <!-- Live Stats Grid -->
      <div id="admin-stats-slot" class="admin-stats-grid">
        <div class="admin-stat-card"><div class="admin-stat-value">...</div><div class="admin-stat-label">Memuat...</div></div>
      </div>

      <!-- Autonomous Research Console -->
      <div class="research-console-card">
        <div style="display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.5rem;">
          <span style="font-size: 1.4rem;">🔬</span>
          <h2 style="font-family: var(--font-display); font-size: 1.3rem;">${t('admin.researchHeader')}</h2>
        </div>
        <p style="font-size: 0.92rem; color: var(--text-secondary); max-width: 720px;">
          ${t('admin.researchDesc')}
        </p>

        <form id="admin-research-form">
          <div class="research-form-row">
            <input 
              type="text" 
              id="admin-entity-input" 
              class="research-input" 
              placeholder="${t('admin.inputEntityName')}"
              required
            />
            <button type="submit" class="btn btn-primary" id="btn-submit-research">
              ${t('admin.btnRunResearch')}
            </button>
          </div>

          <div class="research-options-strip">
            <label style="display: inline-flex; align-items: center; gap: 0.4rem; cursor: pointer;">
              <input type="checkbox" id="admin-auto-publish-check" />
              <span>${t('admin.autoPublishCheckbox')}</span>
            </label>
          </div>
        </form>

        <!-- Terminal Logs -->
        <div id="admin-terminal-wrap" class="terminal-stream-wrap" style="display: none;">
          <div style="color: var(--gold-500); margin-bottom: 0.5rem; font-weight: 600;">${t('admin.terminalLogs')}</div>
          <div id="admin-terminal-output"></div>
        </div>
      </div>

      <!-- Editorial Review Queue -->
      <div style="margin-top: 3.5rem;">
        <h2 style="font-family: var(--font-display); font-size: 1.6rem; margin-bottom: 1.25rem;">
          ${t('admin.reviewQueue')}
        </h2>
        <div id="admin-reviews-slot" class="review-queue-list">
          <div style="color: var(--text-muted); padding: 2rem; text-align: center;">Memeriksa antrean...</div>
        </div>
      </div>
    </div>
  `;

  const statsSlot = container.querySelector('#admin-stats-slot');
  const reviewsSlot = container.querySelector('#admin-reviews-slot');
  const researchForm = container.querySelector('#admin-research-form');
  const entityInput = container.querySelector('#admin-entity-input');
  const autoPublishCheck = container.querySelector('#admin-auto-publish-check');
  const terminalWrap = container.querySelector('#admin-terminal-wrap');
  const terminalOutput = container.querySelector('#admin-terminal-output');
  const submitBtn = container.querySelector('#btn-submit-research');

  async function refreshData() {
    try {
      const [stats, reviews] = await Promise.all([
        api.getAdminStats(),
        api.getReviews()
      ]);

      statsSlot.innerHTML = `
        <div class="admin-stat-card">
          <div class="admin-stat-value" style="color: var(--gold-500);">${stats.total}</div>
          <div class="admin-stat-label">${t('admin.statsTotal')}</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-value" style="color: #10b981;">${stats.published}</div>
          <div class="admin-stat-label">${t('admin.statsPublished')}</div>
        </div>
        <div class="admin-stat-card ${stats.reviewRequired > 0 ? 'alert' : ''}">
          <div class="admin-stat-value" style="color: #f59e0b;">${stats.reviewRequired}</div>
          <div class="admin-stat-label">${t('admin.statsReviews')}</div>
        </div>
        <div class="admin-stat-card ${stats.lowConfidence > 0 ? 'alert' : ''}">
          <div class="admin-stat-value" style="color: #f43f5e;">${stats.lowConfidence}</div>
          <div class="admin-stat-label">${t('admin.statsLowConf')}</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-value">${stats.missingImages}</div>
          <div class="admin-stat-label">${t('admin.statsMissingImg')}</div>
        </div>
      `;

      if (reviews.length === 0) {
        reviewsSlot.innerHTML = `
          <div style="padding: 2.5rem; text-align: center; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-medium); color: var(--text-secondary);">
            ✓ ${t('admin.noPending')}
          </div>
        `;
        return;
      }

      reviewsSlot.innerHTML = reviews.map(r => {
        const thumb = r.images?.[0]?.thumbnail_url || '/assets/placeholders/creature-fallback.svg';
        const name = resolveLocalized(r.display_name, r.canonical_name);
        const desc = resolveLocalized(r.short_description, '');

        return `
          <div class="review-card" data-slug="${r.slug}">
            <img 
              src="${thumb}" 
              alt="${name}" 
              class="review-thumb"
              onerror="this.onerror=null; this.src='/assets/placeholders/creature-fallback.svg';"
            />
            <div class="review-body">
              <h3 class="review-title">${name} (${r.canonical_name})</h3>
              <div class="review-meta-strip">
                <span>Budaya: <strong>${r.culture}</strong></span>
                <span>Tipe: <strong>${r.classification}</strong></span>
                <span>Kelengkapan: <strong>${r.completeness_score}%</strong></span>
                <span>Kepercayaan: <strong>${r.confidence_score}</strong></span>
                <span>Sumber: <strong>${r.sources?.length || 0}</strong></span>
              </div>
              <p class="review-desc">${desc}</p>
              <div class="review-actions">
                <button class="btn btn-primary btn-approve" data-slug="${r.slug}">
                  ${t('admin.approve')}
                </button>
                <button class="btn btn-ghost btn-reject" data-slug="${r.slug}" style="color: var(--accent-crimson);">
                  ${t('admin.reject')}
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Attach approve & reject listeners
      reviewsSlot.querySelectorAll('.btn-approve').forEach(btn => {
        btn.addEventListener('click', async () => {
          const slug = btn.getAttribute('data-slug');
          btn.textContent = 'Menyimpan...';
          btn.disabled = true;
          try {
            await api.approveReview(slug);
            await refreshData();
          } catch (err) {
            alert('Gagal menyetujui: ' + err.message);
          }
        });
      });

      reviewsSlot.querySelectorAll('.btn-reject').forEach(btn => {
        btn.addEventListener('click', async () => {
          const slug = btn.getAttribute('data-slug');
          if (confirm(`Hapus draf "${slug}" dari antrean review?`)) {
            try {
              await api.rejectReview(slug);
              await refreshData();
            } catch (err) {
              alert('Gagal menolak: ' + err.message);
            }
          }
        });
      });

    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  }

  // Handle autonomous research submission
  researchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const entityName = entityInput.value.trim();
    if (!entityName) return;

    const autoPublish = autoPublishCheck.checked;
    terminalWrap.style.display = 'block';
    terminalOutput.innerHTML = `
      <div class="terminal-line">[System] Dispatching autonomous ingestion pipeline for "${entityName}"...</div>
    `;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Menjalankan Riset...';

    try {
      const result = await api.runResearch(entityName, autoPublish);
      
      let logsHtml = '';
      for (const line of result.log || []) {
        logsHtml += `<div class="terminal-line">${line}</div>`;
      }
      logsHtml += `<div class="terminal-line" style="color: #10b981;">✓ Selesai. Status draf: "${result.draft?.status}"</div>`;
      terminalOutput.innerHTML = logsHtml;
      terminalWrap.scrollTop = terminalWrap.scrollHeight;

      entityInput.value = '';
      await refreshData();
    } catch (err) {
      terminalOutput.innerHTML += `<div class="terminal-line error">❌ Error: ${err.message}</div>`;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = t('admin.btnRunResearch');
    }
  });

  // Initial load
  await refreshData();
}
