import { api } from '../api-client.js';
import { resolveLocalized as tr } from '../i18n.js';
import { bi, escapeHtml as esc, icon } from '../ui.js';
import { renderCreatureCard } from './creature-card.js';
export async function renderCultureDetailView(container, cultureId) {
  container.innerHTML=`<div class="container directory-empty">${bi('Membuka lembar tradisi…','Opening the tradition…')}</div>`;
  try {
    const culture=await api.getCultureDetail(cultureId);
    if(!culture)throw new Error('Culture not found');
    const name=tr(culture.name), creatures=culture.creatures||[];
    container.innerHTML=`<div class="container browse-page"><nav class="detail-breadcrumb" aria-label="Breadcrumb"><a href="#/cultures">${bi('Peradaban','Cultures')}</a><span>/</span><span aria-current="page">${esc(name)}</span></nav><header class="culture-cover"><span class="eyebrow">${esc(culture.region)} / ${esc(culture.country)}</span><h1>${esc(name)}</h1><p>${esc(tr(culture.description))}</p><details class="culture-scope"><summary>${bi('Cakupan tradisi & sejarah','Tradition & historical scope')}</summary><p>${esc(tr(culture.tradition_scope,bi('Tradisi lisan dan manuskrip sejarah regional.','Regional oral traditions and historical manuscripts.')))}</p></details></header><div class="editorial-heading"><div><span class="eyebrow">${creatures.length} ${bi('ENTRI DALAM ARSIP','ARCHIVED ENTRIES')}</span><h2>${bi('Mereka yang hidup dalam kisahnya.','The beings within its stories.')}</h2></div><a class="text-link" href="#/explore?culture=${encodeURIComponent(culture.id)}">${bi('Buka filter arsip','Open archive filters')} ${icon('arrow',17)}</a></div>${creatures.length?`<div class="creature-grid" id="culture-creatures-grid">${creatures.map(renderCreatureCard).join('')}</div>`:`<p class="directory-empty">${bi('Belum ada makhluk yang dipublikasikan dalam tradisi ini.','No beings have been published in this tradition yet.')}</p>`}</div>`;
  } catch {
    container.innerHTML=`<div class="container directory-empty"><h1>${bi('Tradisi belum dapat dibuka.','This tradition could not be opened.')}</h1><a class="btn btn-secondary" href="#/cultures">${bi('Kembali ke peradaban','Back to cultures')}</a></div>`;
  }
}
