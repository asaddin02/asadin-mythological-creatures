import { api } from '../api-client.js';
import { t, resolveLocalized as tr } from '../i18n.js';
import { bi, escapeHtml as esc, icon } from '../ui.js';

export async function renderCulturesView(container) {
  container.innerHTML = `<div class="container browse-page"><header class="section-header"><span class="eyebrow">MYTHICS / ${bi('PERADABAN','CULTURES')}</span><h1 class="section-title">${bi('Setiap budaya,<br>semesta yang berbeda.','Every culture,<br>a different universe.')}</h1><p class="section-subtitle">${t('home.culturesSubtitle')}</p></header><div class="directory-tools"><input id="culture-search" class="directory-search" type="search" placeholder="${bi('Cari tradisi, negara, atau budaya…','Search traditions, countries, or cultures…')}" aria-label="${bi('Cari budaya','Search cultures')}"><select id="culture-region" class="filter-select" aria-label="${bi('Filter kawasan','Filter region')}"><option value="">${bi('Semua kawasan','All regions')}</option></select><span class="directory-count" role="status"></span></div><div id="cultures-grid-slot" class="culture-grid" aria-busy="true"></div></div>`;
  const slot=container.querySelector('#cultures-grid-slot');
  try {
    const cultures=await api.getCultures();
    if(!container.isConnected)return;
    const search=container.querySelector('#culture-search'), region=container.querySelector('#culture-region'), count=container.querySelector('.directory-count');
    [...new Set(cultures.map(c=>c.region).filter(Boolean))].sort().forEach(value=>region.add(new Option(value,value)));
    const params=new URLSearchParams(location.hash.split('?')[1]||'');search.value=params.get('q')||'';region.value=params.get('region')||'';
    const normalize=value=>String(value||'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
    function render(save=false) {
      const query=normalize(search.value.trim());
      const matches=cultures.filter(c=>(!region.value||c.region===region.value)&&normalize(`${tr(c.name)} ${c.country} ${c.region}`).includes(query));
      count.textContent=`${matches.length} ${bi('tradisi','traditions')}`;
      slot.setAttribute('aria-busy','false');
      slot.innerHTML=matches.length?matches.map(c=>`<article class="culture-card" data-culture="${esc(c.id)}"><div class="culture-card-header"><h2 class="culture-name">${esc(tr(c.name))}</h2><span class="culture-count-pill">${c.creature_count||0} ${bi('entri','entries')}</span></div><div class="directory-meta">${esc(c.region)} · ${esc(c.country)}</div><p class="culture-desc">${esc(tr(c.description))}</p><div class="directory-card-footer"><a href="#/culture/${encodeURIComponent(c.id)}">${bi('Kenali tradisinya','Meet the tradition')} ${icon('arrow',15)}</a><a href="#/explore?culture=${encodeURIComponent(c.id)}">${icon('search',14)} ${bi('Makhluk','Beings')}</a></div></article>`).join(''):`<div class="directory-empty"><p>${bi('Belum ada tradisi yang cocok dengan pencarianmu.','No traditions match your search.')}</p><button class="btn btn-secondary" id="culture-reset">${bi('Tampilkan semua','Show all')}</button></div>`;
      slot.querySelector('#culture-reset')?.addEventListener('click',()=>{search.value='';region.value='';render(true);});
      if(save){const next=new URLSearchParams();if(search.value.trim())next.set('q',search.value.trim());if(region.value)next.set('region',region.value);history.replaceState(null,'',`#/cultures${next.size?'?'+next:''}`);}
    }
    search.oninput=()=>render(true);region.onchange=()=>render(true);render();
  } catch {
    slot.setAttribute('aria-busy','false');slot.innerHTML=`<div class="directory-empty"><p>${bi('Tradisi belum dapat dimuat.','Traditions could not be loaded.')}</p><button class="btn btn-secondary" id="culture-retry">${bi('Coba lagi','Try again')}</button></div>`;
    slot.querySelector('button').onclick=()=>renderCulturesView(container);
  }
}
