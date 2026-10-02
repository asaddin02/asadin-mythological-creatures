import { renderGildedFrame } from './gilded-frame.js';
import { SCALES, getAssessment, getLevel } from '../scaling.js';
import { bi, escapeHtml as esc, icon } from '../ui.js';
import { resolveLocalized } from '../i18n.js';

export function scaleIcon(axis, size = 22) {
  const paths = {
    power: '<path d="m12 2 8 5v10l-8 5-8-5V7Z"/><path d="m12 6 4 6-4 6-4-6Z"/>',
    threat: '<path d="M4 4 12 2l8 2v8c0 5-8 10-8 10S4 17 4 12Z"/><path d="M12 7v6m0 3v.1"/>',
    fear: '<circle cx="12" cy="12" r="10"/><path d="M4 12s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5Z"/><circle cx="12" cy="12" r="2"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[axis]}</svg>`;
}

export function renderScaleBadges(creature, linked = false) {
  const profile = getAssessment(creature);
  return `<div class="scale-badges">${Object.keys(SCALES).map(axis => {
    const level = getLevel(axis, profile[axis]);
    const label = level ? `${axis === 'power' ? '' : level.id.toUpperCase() + ' · '}${level.name}` : bi('Belum dinilai', 'Unassessed');
    const description = level ? resolveLocalized(level.description) : bi('Belum cukup bukti untuk menetapkan kelas.', 'There is not enough evidence to assign a class.');
    const tag = linked ? 'a' : 'span';
    return `<${tag} ${linked ? `href="#/scales?axis=${axis}"` : ''} class="scale-badge badge-${axis} ${level ? '' : 'is-unassessed'}" style="--badge-color:${level?.color || '#a4a9b8'}" title="${esc(`${axis.toUpperCase()} · ${label}: ${description}`)}">${scaleIcon(axis)}<span class="badge-copy"><small>${axis}</small><strong>${level && axis !== 'power' ? `<span class="badge-code">${level.id.toUpperCase()}</span>` : ''}<span class="badge-name">${esc(level ? level.name : bi('Belum dinilai', 'Unassessed'))}</span></strong></span></${tag}>`;
  }).join('')}</div>`;
}

export function renderAssessmentPanel(creature) {
  const profile = getAssessment(creature);
  return `<section class="assessment-panel" id="detail-scaling" aria-labelledby="assessment-title"><div class="editorial-heading"><div><div class="eyebrow">${bi('ANATOMI SEBUAH LEGENDA', 'ANATOMY OF A LEGEND')}</div><h2 id="assessment-title">${bi('Di balik kekuatannya.', 'Behind its power.')}</h2></div><a class="text-link" href="#/scales">${bi('Panduan kelas', 'Class guide')} ${icon('arrow', 16)}</a></div>
  <p class="scaling-note">${bi('Interpretasi editorial berdasarkan versi dalam arsip ini. Power, Threat, dan Fear dinilai terpisah; bukan peringkat resmi tradisi sumber.', 'An editorial interpretation of this archive’s version. Power, Threat, and Fear are assessed separately; these are not official rankings of the source tradition.')}</p>
  <div class="assessment-grid">${Object.keys(SCALES).map(axis => {
    const level = getLevel(axis, profile[axis]);
    return `<article><span class="assessment-symbol" style="--badge-color:${level?.color || '#a4a9b8'}">${scaleIcon(axis, 32)}</span><div class="eyebrow">${axis.toUpperCase()}</div><h3>${level ? `${axis === 'power' ? '' : level.id.toUpperCase() + ' · '}${level.name}` : bi('Belum dinilai', 'Unassessed')}</h3><p>${esc(level ? resolveLocalized(level.description) : bi('Data kosong tidak berarti tingkat terendah.', 'Missing data does not mean the lowest tier.'))}</p><div class="assessment-reason"><strong>${bi('Dasar penilaian', 'Assessment basis')}</strong><p>${esc(resolveLocalized(profile.reasons[axis], bi('Entri ini belum memiliki penilaian editorial. Baca kisah dan sumber yang tersedia sebelum menetapkan kelas.', 'This entry has no editorial assessment yet. Read its story and available sources before assigning a class.')))}</p></div></article>`;
  }).join('')}</div><button class="btn-ghost assessment-source-link" data-scroll="detail-sources">${bi('Lihat sumber entri ini', 'View this entry’s sources')} ↓</button> <a class="text-link" href="#/learn?module=reading">${bi('Cara membaca sumber dan variasi tradisi', 'Reading sources and variations')} ↗</a></section>`;
}

export function renderScaleIntro() {
  return `<section class="scale-intro"><div><div class="eyebrow">${bi('KENALI SEBELUM MENJELAJAH', 'KNOW BEFORE YOU EXPLORE')}</div><h2>${bi('Satu makhluk.<br>Tiga dimensi.', 'One being.<br>Three dimensions.')}</h2><a class="text-link" href="#/scales">${bi('Pelajari semua kelas', 'Discover every class')} ${icon('arrow', 16)}</a></div><div class="scale-intro-axes">${[
    ['power', '01', bi('Seberapa kuat?', 'How powerful?'), bi('Dari manusia hingga melampaui kosmos.', 'From human to beyond the cosmos.'), '7'],
    ['threat', '02', bi('Seberapa berbahaya?', 'How dangerous?'), bi('Dari satu individu hingga seluruh realitas.', 'From one person to all of reality.'), '7'],
    ['fear', '03', bi('Seberapa mengerikan?', 'How terrifying?'), bi('Dari keganjilan hingga ancaman keberadaan.', 'From the uncanny to the horror of existence.'), '6'],
  ].map(([axis, n, title, desc, count]) => `<a href="#/scales?axis=${axis}" class="scale-intro-axis"><div class="scale-intro-top">${scaleIcon(axis, 29)}<span>${n}</span></div><h3>${axis}<small>${count} ${bi('kelas', 'classes')}</small></h3><strong>${title}</strong><p>${desc}</p></a>`).join('')}</div></section>`;
}

export function renderScalingGuide(container, params = {}) {
  const active = Object.hasOwn(SCALES, params.axis) ? params.axis : 'power';
  const summaries = {
    power: bi('Kapasitas kekuatan, dari batas manusia hingga entitas yang melampaui struktur dunia. Warna Power menentukan bentuk dan material bingkai kartu.', 'Capacity for power, from human limits to beings beyond the structure of the world. Power determines the card’s frame shape and material.'),
    threat: bi('Cakupan dampak jika makhluk menjadi ancaman. Potensi bahaya tidak sama dengan niat jahat; penjaga yang baik pun dapat sangat kuat.', 'The reach of its impact if a being becomes a threat. Potential danger is not the same as hostile intent; a benevolent guardian can be powerful.'),
    fear: bi('Sifat kengerian yang ditimbulkan, bukan skor kejahatan atau ukuran kekuatan fisik. Rasa takut dapat berbeda menurut pembaca dan versi cerita.', 'The nature of its horror, not a score of evil or physical strength. Fear can vary with the reader and the version of the story.'),
  };
  container.innerHTML = `<div class="container scales-page"><a class="text-link" href="#/explore">← ${bi('Kembali ke bestiary', 'Back to the bestiary')}</a><header class="scales-heading"><div class="eyebrow">THE MYTHICS CODEX / ${bi('PANDUAN KLASIFIKASI', 'CLASSIFICATION GUIDE')}</div><h1>${bi('Memahami yang<br><em>melampaui manusia.</em>', 'Understanding what<br><em>lies beyond us.</em>')}</h1><p>${bi('Tiga cara membaca sebuah legenda. Kenali kekuatannya, jangkauan ancamannya, dan kengerian yang dibawanya.', 'Three ways to read a legend. Understand its power, the reach of its threat, and the horror it embodies.')}</p></header>
  <nav class="scale-axis-nav" aria-label="${bi('Kelompok klasifikasi', 'Classification groups')}">${Object.keys(SCALES).map(axis => `<a href="#/scales?axis=${axis}" ${axis === active ? 'aria-current="page"' : ''}>${scaleIcon(axis, 26)}<span>${axis}<small>${SCALES[axis].length} ${bi('kelas', 'classes')}</small></span>${icon('arrow', 18)}</a>`).join('')}</nav>
  <section class="scale-level-section" aria-labelledby="axis-title"><div class="scale-axis-heading"><div><div class="eyebrow">${bi('SPEKTRUM', 'SPECTRUM')} / 0${Object.keys(SCALES).indexOf(active) + 1}</div><h2 id="axis-title">${active === 'fear' ? 'Horror / Fear' : active} Scaling</h2></div><p>${summaries[active]}</p></div><div class="scale-levels ${active === 'power' ? 'power-gallery' : ''}">${SCALES[active].map((item, i) => `<article class="scale-level power-${active === 'power' ? item.id : 'unknown'}" style="--level-color:${item.color}">${active === 'power' ? `<div class="tier-preview power-${item.id}">${renderGildedFrame(item.id)}<div class="tier-preview-copy"><small>${bi('TINGKAT', 'TIER')} ${String(i + 1).padStart(2, '0')}</small>${scaleIcon('power', 48)}<strong>${item.name}</strong><span>${bi('Material & ukiran', 'Materials & engraving')}</span></div></div>` : ''}<div class="level-emblem">${scaleIcon(active, 30)}<span>${active === 'power' ? String(i + 1).padStart(2, '0') : item.id.toUpperCase()}</span></div><div><h3>${item.name}</h3><p>${esc(resolveLocalized(item.description))}</p></div><a href="#/explore?${active}=${item.id}" class="level-explore" aria-label="${esc(bi('Jelajahi kelas', 'Explore class') + ' ' + item.name)}">${icon('arrow', 22)}</a></article>`).join('')}</div></section>
  <aside class="scales-method"><div>${icon('book', 28)}<h2>${bi('Legenda punya banyak versi.', 'Legends have many versions.')}</h2></div><p>${bi('Klasifikasi ini adalah interpretasi editorial untuk eksplorasi, bukan hierarki resmi lintas kepercayaan. Nilai mengikuti kemampuan, cakupan dampak, dan sifat kengerian dalam versi yang ditampilkan. Tidak ada skor gabungan atau pemenang otomatis.', 'These classifications are editorial interpretations for exploration, not an official hierarchy across beliefs. Assessments follow abilities, reach, and the nature of horror in the displayed version. There is no combined score or automatic winner.')}</p><p>${bi('Setiap profil menjelaskan dasar penilaiannya. Jika sumber belum cukup mendukung, badge menampilkan “Belum dinilai”, bukan tingkat terendah. Kelas tertentu bisa belum memiliki anggota.', 'Each profile explains the basis of its assessment. When sources do not support a judgment, its badge shows “Unassessed”, not the lowest tier. Some classes may have no members yet.')}</p><a class="text-link" href="#/creature/jormungandr">${bi('Lihat contoh profil Jörmungandr', 'See Jörmungandr’s profile')} ${icon('arrow', 18)}</a></aside></div>`;
}
