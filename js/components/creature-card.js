import { renderGildedFrame } from './gilded-frame.js';
import { resolveLocalized } from '../i18n.js';
import { bi, escapeHtml as esc, editorialArt, icon } from '../ui.js';
import { getAssessment } from '../scaling.js';
import { renderScaleBadges } from './scaling-guide.js';
export function renderCreatureCard(creature) {
  const art = editorialArt(creature.slug), img = creature.images?.[0];
  const src = art || img?.thumbnail_url || img?.url || '/assets/placeholders/creature-fallback.svg';
  const name = resolveLocalized(creature.display_name, creature.canonical_name);
  const profile = getAssessment(creature);
  return `<a href="#/creature/${encodeURIComponent(creature.slug)}" class="creature-card power-${profile.power || 'unknown'}" data-slug="${esc(creature.slug)}" data-power="${profile.power || 'unassessed'}"><div class="card-media"><img src="${esc(src)}" alt="${esc(art ? bi(`Interpretasi artistik ${name}`, `Artistic interpretation of ${name}`) : resolveLocalized(img?.caption, name))}" loading="lazy" decoding="async" width="480" height="600" onerror="this.onerror=null;this.src='/assets/placeholders/creature-fallback.svg';"><span class="card-region">${esc(creature.country || creature.region)}</span>${art ? '<span class="card-art-tag">AI · ART</span>' : ''}<span class="card-rank">${profile.power ? esc(profile.power) : bi('Misteri arsip', 'Archive mystery')}</span></div>${renderGildedFrame(profile.power)}<div class="card-content"><div class="card-kicker">${esc((creature.culture || '').replace(/-/g, ' '))}</div><div class="card-title-wrap"><h3 class="card-title">${esc(name)}</h3>${icon('arrow', 20)}</div><p class="card-desc">${esc(resolveLocalized(creature.short_description))}</p>${renderScaleBadges(creature)}<div class="card-bottom"><span>${esc(creature.classification)}</span><span>${bi('Buka legenda', 'Open legend')} ↗</span></div></div></a>`;
}
