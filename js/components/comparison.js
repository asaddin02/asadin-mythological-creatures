import { renderCreatureCard } from './creature-card.js';
import { api } from '../api-client.js';
import { bi, escapeHtml as esc } from '../ui.js';
import { resolveLocalized } from '../i18n.js';
import { SCALES, getAssessment, getLevel } from '../scaling.js';

export async function renderComparisonView(container, initialSlugA = 'garuda', initialSlugB = 'kitsune') {
  container.innerHTML = `<div class="container comparison-view"><header class="section-header"><span class="eyebrow">MYTHICS / ${bi('DUA LEGENDA','TWO LEGENDS')}</span><h1 class="section-title">${bi('Sandingkan kekuatannya.', 'Their powers, side by side.')}</h1><p class="section-subtitle">${bi('Pilih dua makhluk. Telusuri perbedaan kekuatan, ancaman, dan kengerian dalam kisahnya.','Choose two beings. Explore the power, threat, and fear within their stories.')}</p></header>
    <form class="compare-controls"><div class="compare-picker"><label for="compare-search-a">${bi('Legenda pertama','First legend')}</label><input id="compare-search-a" type="search" placeholder="${bi('Cari nama makhluk…','Search beings…')}" autocomplete="off"><select id="compare-select-a" class="filter-select" aria-label="${bi('Pilih legenda pertama','Choose first legend')}" disabled></select></div><span class="compare-divider" aria-hidden="true">&</span><div class="compare-picker"><label for="compare-search-b">${bi('Legenda kedua','Second legend')}</label><input id="compare-search-b" type="search" placeholder="${bi('Cari nama makhluk…','Search beings…')}" autocomplete="off"><select id="compare-select-b" class="filter-select" aria-label="${bi('Pilih legenda kedua','Choose second legend')}" disabled></select></div><button class="btn btn-primary" id="btn-run-compare" disabled>${bi('Bandingkan','Compare')}</button></form><p class="compare-status" role="status"></p><div id="comparison-result-slot" aria-busy="true"></div></div>`;
  const selectA=container.querySelector('#compare-select-a'),selectB=container.querySelector('#compare-select-b');
  const button=container.querySelector('#btn-run-compare'),slot=container.querySelector('#comparison-result-slot');
  const status=container.querySelector('.compare-status');
  let list=[],request=0;
  const name=c=>resolveLocalized(c.display_name,c.canonical_name);
  const normalize=s=>s.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().trim();
  function populate(select,query,preferred){
    const matches=list.filter(c=>normalize(`${name(c)} ${c.canonical_name}`).includes(normalize(query)));
    select.replaceChildren(...matches.map(c=>new Option(name(c),c.slug)));
    if(matches.some(c=>c.slug===preferred))select.value=preferred;
    select.disabled=!matches.length;
    if(!matches.length)select.add(new Option(bi('Tidak ditemukan','No matches'),''));
    button.disabled=!selectA.value||!selectB.value;
  }
  async function load(){
    status.textContent=bi('Memuat daftar legenda…','Loading legends…');
    try{
      list=await api.getCreatureIndex();if(!container.isConnected)return;
      populate(selectA,'',initialSlugA);populate(selectB,'',initialSlugB===initialSlugA?(initialSlugA==='kitsune'?'garuda':'kitsune'):initialSlugB);
      button.disabled=false;
      await executeCompare(false);
    }catch{
      slot.setAttribute('aria-busy','false');
      status.innerHTML=`${bi('Daftar makhluk belum berhasil dimuat.','Unable to load the list of beings.')} <button type="button" class="text-link">${bi('Coba lagi','Try again')}</button>`;
      status.querySelector('button').onclick=load;
    }
  }
  container.querySelector('.compare-controls').onsubmit=e=>{e.preventDefault();executeCompare(true);};
  for(const [side,select] of [['a',selectA],['b',selectB]]){
    container.querySelector(`#compare-search-${side}`).oninput=e=>{
      populate(select,e.target.value,select.value);
      status.textContent=select.disabled?bi('Nama tidak ditemukan. Coba nama lain.','No matches. Try another name.'):bi('Pilih hasil pencarian, lalu tekan Bandingkan.','Choose a search result, then press Compare.');
    };
    select.onchange=()=>executeCompare(true);
  }
  async function executeCompare(saveURL){
    const a=selectA.value,b=selectB.value;if(!a||!b)return;
    const ticket=++request;
    slot.setAttribute('aria-busy','true');button.disabled=true;
    status.textContent=bi('Menyandingkan dua legenda…','Comparing two legends…');
    try{
      const data=await api.compare(a,b);
      if(ticket!==request||!container.isConnected)return;
      const A=data.creatureA,B=data.creatureB,nA=esc(name(A)),nB=esc(name(B));
      const pA=getAssessment(A),pB=getAssessment(B);
      const unknown=bi('Belum dinilai','Not assessed');
      const classCell=(axis,profile)=>{
        const level=getLevel(axis,profile[axis]);
        return level?`<strong style="color:${level.color}">${axis==='power'?'':esc(level.id.toUpperCase())+' · '}${esc(level.name)}</strong><small>${esc(resolveLocalized(level.description))}</small>`:`<span class="comparison-unassessed">${unknown}</span>`;
      };
      const axes=Object.keys(SCALES).map(axis=>{
        const iA=SCALES[axis].findIndex(l=>l.id===pA[axis]),iB=SCALES[axis].findIndex(l=>l.id===pB[axis]);
        const result=iA<0||iB<0?bi('Penilaian belum lengkap','Assessment incomplete'):iA===iB?bi('Tingkat yang sama','Same tier'):bi(`${iA>iB?name(A):name(B)} berada ${Math.abs(iA-iB)} tingkat lebih tinggi`,`${iA>iB?name(A):name(B)} is ${Math.abs(iA-iB)} tier(s) higher`);
        return `<tr data-axis="${axis}"><th scope="row">${axis==='power'?'Power':axis==='threat'?'Threat':'Fear'}</th><td>${classCell(axis,pA)}</td><td>${classCell(axis,pB)}</td><td>${esc(result)}</td></tr>`;
      }).join('');
      const textRow=(label,vA,vB)=>`<tr><th scope="row">${label}</th><td>${esc(vA||'—')}</td><td>${esc(vB||'—')}</td><td>${vA&&vB&&vA===vB?bi('Sama','Shared'):'—'}</td></tr>`;
      slot.innerHTML=`<div class="compare-header-row">${renderCreatureCard(A)}<span class="compare-vs-badge" aria-hidden="true">&</span>${renderCreatureCard(B)}</div><div class="comparison-heading"><span class="eyebrow">${bi('TIGA DIMENSI','THREE DIMENSIONS')}</span><h2>${bi('Di mana letak perbedaannya?','Where do they differ?')}</h2><p>${bi('Kekuatan, ancaman, dan ketakutan dinilai terpisah. Tingkat yang lebih tinggi bukan keputusan siapa menang.','Power, threat, and fear are assessed separately. A higher tier does not determine a winner.')}</p></div><div class="table-scroll" tabindex="0" role="region" aria-label="${bi('Tabel perbandingan','Comparison table')}"><table class="compare-matrix-table"><thead><tr><th scope="col">${bi('Dimensi','Dimension')}</th><th scope="col">${nA}</th><th scope="col">${nB}</th><th scope="col">${bi('Perbedaan','Difference')}</th></tr></thead><tbody>${axes}${textRow(bi('Asal','Origin'),A.country||A.region,B.country||B.region)}${textRow(bi('Tradisi','Tradition'),A.culture,B.culture)}${textRow(bi('Klasifikasi','Classification'),A.classification,B.classification)}${textRow(bi('Habitat','Habitat'),A.habitat,B.habitat)}</tbody></table></div><p class="comparison-note">${bi('Dasar tiap penilaian dapat dibaca dalam arsip makhluk. Kelas yang belum dinilai tetap ditandai, tanpa memberi skor nol.','Read the rationale for each assessment in the creature archive. Unassessed classes stay marked without assigning a zero score.')} <a href="#/scales">${bi('Panduan kelas ↗','Class guide ↗')}</a></p>`;
      if(saveURL)history.replaceState(null,'',`#/compare?${new URLSearchParams({a,b})}`);
      status.textContent=a===b?bi('Kedua pilihan adalah makhluk yang sama. Pilih makhluk lain untuk melihat perbedaan.','Both choices are the same being. Choose another to see differences.'):bi(`${name(A)} dan ${name(B)} siap dibandingkan.`,`${name(A)} and ${name(B)} are ready to compare.`);
    }catch{
      if(ticket!==request||!container.isConnected)return;
      slot.innerHTML=`<div class="comparison-error">${bi('Perbandingan belum berhasil dimuat. Tekan Bandingkan untuk mencoba kembali.','Unable to load the comparison. Press Compare to try again.')}</div>`;
      status.textContent=bi('Gagal memuat perbandingan.','Comparison failed to load.');
    }finally{if(ticket===request){slot.setAttribute('aria-busy','false');button.disabled=!selectA.value||!selectB.value;}}
  }
  await load();
}
