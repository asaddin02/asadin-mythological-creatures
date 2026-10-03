import { api } from '../api-client.js';
import { t, resolveLocalized as tr } from '../i18n.js';
import { bi, escapeHtml as esc, icon } from '../ui.js';
export async function renderRegionsView(container) {
  container.innerHTML=`<div class="container browse-page"><header class="section-header"><span class="eyebrow">MYTHICS / ${bi('ATLAS DUNIA','WORLD ATLAS')}</span><h1 class="section-title">${bi('Legenda tak mengenal<br>batas dunia.','Legends know<br>no borders.')}</h1><p class="section-subtitle">${t('regions.subtitle')}</p></header><div id="regions-grid-slot" class="culture-grid"></div></div>`;
  const slot=container.querySelector('#regions-grid-slot');
  try {
    const regions=await api.getRegions();
    slot.innerHTML=regions.map((r,i)=>`<article class="culture-card region-card" data-region="${esc(r.id)}"><div class="region-number"><span>${String(i+1).padStart(2,'0')}</span>${icon('globe',44)}</div><div class="culture-card-header"><h2 class="culture-name">${esc(tr(r.name))}</h2><span class="culture-count-pill">${r.cultures?.length||0} ${bi('tradisi','traditions')}</span></div><p class="culture-desc">${esc(tr(r.description))}</p><details class="region-index"><summary>${bi('Lihat tradisi dalam kawasan','View traditions in this region')} <span>+</span></summary><div class="region-traditions">${(r.cultures||[]).map(id=>`<a href="#/culture/${encodeURIComponent(id)}">${esc(id.replace(/-/g,' '))}</a>`).join('')}</div></details><div class="directory-card-footer"><a href="#/explore?region=${encodeURIComponent(r.id)}">${bi('Jelajahi kawasan ini','Explore this region')} ${icon('arrow',16)}</a></div></article>`).join('')||`<p class="directory-empty">${bi('Belum ada kawasan yang tersedia.','No regions are available yet.')}</p>`;
  } catch {
    slot.innerHTML=`<div class="directory-empty"><p>${bi('Atlas belum dapat dimuat.','The atlas could not be loaded.')}</p><button class="btn btn-secondary">${bi('Coba lagi','Try again')}</button></div>`;
    slot.querySelector('button').onclick=()=>renderRegionsView(container);
  }
}
