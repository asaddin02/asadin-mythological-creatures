import { bi, icon } from '../ui.js';
import { getAssessment } from '../scaling.js';
import { renderScaleBadges } from './scaling-guide.js';

const LEGENDS = [
  {slug:'garuda', name:'Garuda', subtitle:['Sang penguasa langit · Tradisi Hindu–Buddha', 'Sovereign of the skies · Hindu–Buddhist traditions']},
  {slug:'kitsune', name:'Kitsune', subtitle:['Sembilan ekor, seribu rahasia · Folklor Jepang', 'Nine tails, a thousand secrets · Japanese folklore']},
  {slug:'jormungandr', name:'Jörmungandr', subtitle:['Sang ular dunia · Mitologi Nordik', 'The world serpent · Norse mythology']},
  {slug:'barong', name:'Barong', subtitle:['Penjaga keseimbangan · Tradisi Bali', 'Guardian of balance · Balinese traditions']},
];

export function renderHero(creaturesCount, culturesCount, selected = 'garuda') {
  const legend = LEGENDS.find(item => item.slug === selected) || LEGENDS[0];
  const power = getAssessment(legend).power;
  return `<section class="archive-hero power-${power}" data-legend="${legend.slug}">
    <a class="hero-art-link" href="#/creature/${legend.slug}" aria-label="${bi('Buka legenda', 'Open legend')} ${legend.name}"></a><img class="hero-art" src="/assets/art/${legend.slug}-editorial.webp" alt="${bi('Interpretasi artistik', 'Artistic interpretation of')} ${legend.name}" fetchpriority="high" width="1536" height="1024">
    <div class="hero-shade"></div><div class="hero-orbit" aria-hidden="true"></div><div class="hero-stars" aria-hidden="true"></div>

    <div class="container hero-layout"><div class="hero-copy">
      <div class="eyebrow"><span class="tiny-star">✦</span> THE LIVING BESTIARY</div>
      <h1>${bi('Mereka bukan<br>sekadar <em>legenda.</em>', 'More than myth.<br>Beyond <em>legend.</em>')}</h1>
      <p>${bi('Dari penjaga tanah Nusantara hingga entitas di ujung kosmos. Temui wujudnya. Kenali kekuatannya. Telusuri kisah di balik namanya.', 'From guardians of the archipelago to beings at the edge of the cosmos. Meet their forms. Discover their power. Uncover the stories behind their names.')}</p>
      <div class="hero-actions"><a href="#/explore" class="btn btn-primary">${bi('Jelajahi Bestiary', 'Explore the Bestiary')} ${icon('arrow', 18)}</a><button class="btn btn-ghost" id="hero-random-trigger">${icon('spark', 17)} ${bi('Pertemuan acak', 'Random encounter')}</button></div>
      <a class="hero-footnote" href="#/scales"><span class="fine-line"></span>POWER · THREAT · FEAR <span>↗</span></a>
      <div class="hero-selection" role="group" aria-label="${bi('Pilih legenda dalam sorotan', 'Choose the featured legend')}">${LEGENDS.map((item,i)=>`<button class="hero-select" data-hero="${item.slug}" aria-pressed="${item.slug === legend.slug}"><span>0${i+1}</span>${item.name}</button>`).join('')}</div>
    </div>
    <a class="hero-art-label" href="#/creature/${legend.slug}"><span class="eyebrow">${bi('LEGENDA DALAM SOROTAN', 'LEGEND IN THE SPOTLIGHT')} · 00${LEGENDS.indexOf(legend)+1}</span><span class="hero-art-name">${legend.name} ${icon('arrow', 22)}</span><small>${bi(...legend.subtitle)}</small>${renderScaleBadges(legend)}<span class="art-disclosure">${bi('Interpretasi artistik · AI', 'Artistic interpretation · AI')}</span></a></div>
    <div class="hero-bottom-rule" aria-hidden="true">✦</div>
  </section>
  <div class="archive-strip"><div class="container archive-strip-inner"><span>${icon('book', 18)} <strong data-archive-count>${creaturesCount?.toLocaleString('id-ID') ?? '—'}</strong> ${bi('makhluk dalam arsip', 'archived beings')}</span><span>${icon('globe', 18)} <strong data-cultures-count>${culturesCount ?? '—'}</strong> ${bi('tradisi budaya', 'cultural traditions')}</span><span>${icon('spark', 18)} <strong>3</strong> ${bi('dimensi klasifikasi', 'classification dimensions')}</span><a href="#/scales">${bi('Baca panduan kelas', 'Read the class guide')} ↗</a></div></div>`;
}
