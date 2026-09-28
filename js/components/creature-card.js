/**
 * CreatureCard Component
 * Reusable, accessible, and rich creature card with fallback image handling,
 * power preview, and bilingual localization.
 */

import { resolveLocalized, t } from '../i18n.js';

export function renderCreatureCard(creature) {
  const primaryImage = creature.images?.[0];
  const imgUrl = primaryImage?.thumbnail_url || primaryImage?.url || '/assets/placeholders/creature-fallback.svg';
  const imgAlt = primaryImage?.caption ? resolveLocalized(primaryImage.caption) : `${creature.canonical_name} illustration`;

  const displayName = resolveLocalized(creature.display_name, creature.canonical_name);
  const shortDesc = resolveLocalized(creature.short_description, '');
  const cultureName = creature.culture?.replace(/-/g, ' ') || 'Unknown';
  const classification = creature.classification || 'Creature';
  
  // Highest power dimension for preview
  const supernaturalVal = creature.power_profile?.dimensions?.supernatural || 50;

  const traits = (creature.traits || []).slice(0, 3);

  return `
    <article class="creature-card" data-slug="${creature.slug}">
      <div class="card-media">
        <img 
          src="${imgUrl}" 
          alt="${imgAlt}"
          loading="lazy"
          onerror="this.onerror=null; this.src='/assets/placeholders/creature-fallback.svg';"
        />
        <div class="card-floating-badges">
          <span class="badge badge-culture">${cultureName}</span>
          <span class="badge badge-classification">${classification}</span>
        </div>
      </div>
      <div class="card-content">
        <div class="card-title-wrap">
          <h3 class="card-title">${displayName}</h3>
          ${creature.original_name && creature.original_name !== creature.canonical_name ? `<span class="card-original-title">${creature.original_name}</span>` : ''}
        </div>
        <p class="card-desc">${shortDesc}</p>
        
        <div class="card-traits-list">
          ${traits.map(t => `<span class="tag-trait">${t}</span>`).join('')}
        </div>

        <div class="card-power-meter">
          <span class="power-meter-label">${t('card.power')}</span>
          <div class="power-meter-bar-wrap">
            <div class="power-meter-bar">
              <div class="power-meter-fill" style="width: ${supernaturalVal}%;"></div>
            </div>
            <span class="power-meter-val">${supernaturalVal}</span>
          </div>
        </div>
      </div>
    </article>
  `;
}
