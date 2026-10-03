import { bi, icon, editorialArt } from '../ui.js';
import { getAssessment } from '../scaling.js';
import { renderScaleBadges } from './scaling-guide.js';

const LEGENDS = [
  {slug:'garuda',name:'Garuda',origin:['Hindu–Buddha · Nusantara','Hindu–Buddhist · Indonesia'],subtitle:['Sang penguasa langit','Sovereign of the skies']},
  {slug:'kitsune',name:'Kitsune',origin:['Folklor Jepang · Asia Timur','Japanese folklore · East Asia'],subtitle:['Sembilan ekor, seribu rahasia','Nine tails, a thousand secrets']},
  {slug:'jormungandr',name:'Jörmungandr',origin:['Mitologi Nordik · Eropa','Norse mythology · Europe'],subtitle:['Sang ular yang melingkari dunia','The serpent that encircles the world']},
  {slug:'barong',name:'Barong',origin:['Tradisi Bali · Nusantara','Balinese traditions · Indonesia'],subtitle:['Penjaga keseimbangan','Guardian of balance']},
];
const feature = (legend,index) => `<div class="royal-feature-overline"><span>${bi('LEGENDA PILIHAN','FEATURED LEGEND')}</span><span>0${index+1} / 04</span></div><a class="gateway-art" href="#/creature/${legend.slug}"><span class="royal-feature-origin">${bi(...legend.origin)}</span><span class="gateway-art-name">${legend.name}<span class="round-arrow">${icon('arrow',21)}</span></span><span class="royal-feature-subtitle">${bi(...legend.subtitle)}</span></a>${renderScaleBadges(legend)}`;

export function renderHero() {
  return `<section class="gateway royal-gateway power-divine" data-legend="garuda" aria-label="${bi('Gerbang dunia legenda','Gateway to a world of legends')}">
    <div class="royal-background" aria-hidden="true">${LEGENDS.map((legend,i)=>`<div class="royal-slide${i===0?' is-active':''}" data-scene="${legend.slug}"><img class="hero-art" ${i===0?`src="${editorialArt(legend.slug)}" fetchpriority="high"`:`data-src="${editorialArt(legend.slug)}"`} alt="" width="1536" height="1024" decoding="async"></div>`).join('')}</div>
    <div class="royal-vignette" aria-hidden="true"></div><div class="royal-hero-edges" aria-hidden="true"><span>✦</span></div>
    <a class="royal-scene-link" href="#/creature/garuda" aria-label="${bi('Buka legenda Garuda','Open Garuda’s legend')}"></a>
    <div class="container royal-hero-body">
      <div class="royal-hero-copy"><div class="royal-overline"><span></span>${icon('crown',23)} THE LIVING BESTIARY <span></span></div>
        <h1>${bi('Di balik mitos,<br>ada <em>keajaiban.</em>','Beyond every myth,<br>there is <em>wonder.</em>')}</h1>
        <p>${bi('Buka lembaran dunia yang terlupakan. Temui para penjaga, makhluk purba, dan legenda yang hidup melampaui zaman.','Open the pages of a forgotten world. Encounter guardians, ancient beings, and legends that live beyond time.')}</p>
        <div class="royal-hero-actions"><a href="#/explore" class="btn btn-primary">${bi('Mulai penjelajahan','Begin your journey')} ${icon('arrow',18)}</a><button class="btn btn-secondary" id="hero-random-trigger">${icon('compass',18)} ${bi('Ikuti takdir','Follow your fate')}</button></div>
        <a class="royal-discover-note" href="#/scales">${icon('spark',15)} ${bi('Tujuh kelas kekuatan. Tak terhitung kisah.','Seven classes of power. Countless stories.')} <span>↗</span></a>
      </div>
      <div class="royal-feature" id="royal-legend-meta">${feature(LEGENDS[0],0)}</div>
    </div>
    <div class="container royal-hero-bottom"><div class="royal-collection-label"><span>${icon('book',18)} ${bi('LEMBARAN LEGENDA','PAGES OF LEGEND')}</span><small>${bi('Pilih kisah yang memanggilmu','Choose the story that calls to you')}</small></div><div class="hero-selection" role="group" aria-label="${bi('Pilih legenda dalam sorotan','Choose the featured legend')}">${LEGENDS.map((legend,i)=>`<button class="hero-select" data-hero="${legend.slug}" aria-pressed="${i===0}"><span class="hero-select-number">0${i+1}</span><span class="hero-select-copy">${legend.name}<small>${bi(...legend.subtitle)}</small></span><span class="hero-select-line"></span></button>`).join('')}</div><div class="royal-slide-controls"><button id="hero-prev" aria-label="${bi('Legenda sebelumnya','Previous legend')}">${icon('arrow',17)}</button><button id="hero-play" aria-label="${bi('Jeda slideshow','Pause slideshow')}" aria-pressed="true"></button><button id="hero-next" aria-label="${bi('Legenda berikutnya','Next legend')}">${icon('arrow',17)}</button></div></div>
    <div class="container royal-hero-fineprint"><span>${bi('Ilustrasi editorial · interpretasi artistik AI','Editorial illustrations · AI artistic interpretations')}</span><span id="hero-slide-status" role="status"></span><a href="#/explore">${bi('MASUK KE ARSIP','ENTER THE ARCHIVE')} ↓</a></div>
  </section>
  <div class="royal-archive-strip"><div class="container"><div class="royal-strip-intro">${icon('compass',28)}<span>${bi('Setiap legenda<br>menyimpan dunia.','Every legend<br>holds a world.')}</span></div><div class="royal-stat"><strong data-archive-count>—</strong><span>${bi('MAKHLUK & LEGENDA','BEINGS & LEGENDS')}</span></div><div class="royal-stat"><strong data-cultures-count>—</strong><span>${bi('TRADISI BUDAYA','CULTURAL TRADITIONS')}</span></div><a href="#/scales" class="royal-stat"><strong>VII</strong><span>${bi('KELAS KEKUATAN','CLASSES OF POWER')} ↗</span></a></div></div>`;
}

export function initHero(root, signal, interval = 9000) {
  if (!root || signal.aborted) return;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  let current=0,wanted=0,ticket=0,timer,automatic=!preference.matches,hovered=false,visible=false;
  const play=root.querySelector('#hero-play');
  const status=root.querySelector('#hero-slide-status');
  function stopTimer(){clearTimeout(timer);timer=undefined;}
  function reflect(){
    play.setAttribute('aria-pressed',String(automatic));
    play.setAttribute('aria-label',automatic?bi('Jeda slideshow','Pause slideshow'):bi('Putar slideshow','Play slideshow'));
    play.innerHTML=automatic?'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>':'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m8 4 12 8-12 8Z"/></svg>';
    root.dataset.autoplay=String(automatic);
  }
  function schedule(){
    stopTimer();
    root.classList.toggle('is-playing',automatic&&visible&&!hovered&&!document.hidden);
    if(signal.aborted||!automatic||!visible||hovered||document.hidden)return;
    timer=setTimeout(()=>select((current+1)%LEGENDS.length),interval);
  }
  async function select(index,manual=false){
    wanted=(index+LEGENDS.length)%LEGENDS.length;
    const next=wanted,version=++ticket,legend=LEGENDS[next];
    stopTimer();
    if(manual){automatic=false;reflect();}
    if(next===current){schedule();return;}
    const scene=root.querySelector(`[data-scene="${legend.slug}"]`),img=scene.querySelector('img');
    if(!img.getAttribute('src'))img.src=img.dataset.src;
    try { await img.decode(); }
    catch {
      if(signal.aborted||version!==ticket)return;
      img.removeAttribute('src');
      status.textContent=bi('Ilustrasi belum dapat dimuat. Coba legenda lain.','The illustration could not be loaded. Try another legend.');
      automatic=false;reflect();schedule();return;
    }
    if(signal.aborted||version!==ticket||!root.isConnected)return;
    root.querySelectorAll('.royal-slide').forEach(el=>el.classList.toggle('is-active',el===scene));
    const previous=LEGENDS[current];
    root.classList.remove(`power-${getAssessment(previous).power}`);
    root.classList.add(`power-${getAssessment(legend).power}`);
    current=next;root.dataset.legend=legend.slug;
    root.querySelector('#royal-legend-meta').innerHTML=feature(legend,next);
    const sceneLink=root.querySelector('.royal-scene-link');sceneLink.href=`#/creature/${legend.slug}`;sceneLink.setAttribute('aria-label',`${bi('Buka legenda','Open legend')} ${legend.name}`);
    root.querySelectorAll('[data-hero]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.hero===legend.slug)));
    status.textContent=manual?`${legend.name} · ${bi(...legend.origin)}`:'';
    schedule();
  }
  const on=(node,type,handler)=>node.addEventListener(type,handler,{signal});
  root.querySelectorAll('[data-hero]').forEach((button,i)=>on(button,'click',()=>select(i,true)));
  on(root.querySelector('#hero-prev'),'click',()=>select(wanted-1,true));
  on(root.querySelector('#hero-next'),'click',()=>select(wanted+1,true));
  on(play,'click',()=>{automatic=!automatic;reflect();schedule();});
  // A reader navigating by keyboard owns the selection until explicitly resuming.
  on(root,'focusin',event=>{if(event.target===play)return;automatic=false;reflect();schedule();});
  on(root,'pointerenter',event=>{if(event.pointerType==='mouse'){hovered=true;schedule();}});
  on(root,'pointerleave',()=>{hovered=false;schedule();});
  on(document,'visibilitychange',schedule);
  on(preference,'change',()=>{if(preference.matches)automatic=false;reflect();schedule();});
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.12});
  observer.observe(root);
  signal.addEventListener('abort',()=>{stopTimer();ticket++;observer.disconnect();},{once:true});
  reflect();
}
