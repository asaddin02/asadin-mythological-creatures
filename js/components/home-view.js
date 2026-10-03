import { api } from "../api-client.js";
import { resolveLocalized } from "../i18n.js";
import { bi, icon } from "../ui.js";
import { renderScaleIntro } from "./scaling-guide.js";
import { SCALES } from "../scaling.js";
import { renderHero, initHero } from "./hero.js";
import { renderCreatureCard } from "./creature-card.js";
import { openRandomEncounterModal } from "./random-encounter.js";
export async function renderHomeView(container, signal) {
  container.innerHTML = `<div id="home-hero-slot">${renderHero()}</div><div class="container home-body"><div class="royal-search-dock"><div class="royal-search-copy"><span class="eyebrow">${bi("IKUTI RASA INGIN TAHUMU","FOLLOW YOUR CURIOSITY")}</span><h2>${bi("Legenda apa yang memanggilmu?","Which legend calls to you?")}</h2></div><div class="royal-search-tools"><form class="discovery-search" id="home-search"><label for="hero-search-input">${icon("search", 22)}<span class="sr-only">${bi("Cari makhluk mitologi", "Search mythical beings")}</span></label><input id="hero-search-input" type="search" placeholder="${bi("Kisah apa yang ingin kamu temukan?", "What story will you discover?")}"><button type="submit">${bi("Cari di arsip", "Search archive")} ${icon("arrow", 17)}</button></form><div class="search-suggestions"><span>${bi("MULAI DARI", "START WITH")}</span><a href="#/creature/garuda">Garuda</a><a href="#/creature/kitsune">Kitsune</a><a href="#/explore?culture=indonesian-folklore">${bi("Folklor Nusantara", "Indonesian folklore")}</a><a href="#/explore?classification=dragon">${bi("Naga & ular purba", "Dragons & serpents")}</a></div></div></div>
  <nav class="expedition-paths" aria-label="${bi('Pilih jalur penjelajahan','Choose your path')}">${[
    ['explore','compass','01',bi('Buka Bestiary','Open the Bestiary'),bi('Temui makhluk dari setiap legenda.','Meet the beings behind every legend.')],
    ['regions','globe','02',bi('Lintasi Peradaban','Across Civilizations'),bi('Telusuri dunia melalui kisahnya.','Discover the world through its stories.')],
    ['compare','spark','03',bi('Sandingkan Legenda','Legends, Side by Side'),bi('Kenali kekuatan dan perbedaannya.','Uncover their powers and differences.')],
  ].map(([route,mark,n,title,desc])=>`<a href="#/${route}" class="expedition-path"><span class="path-symbol">${icon(mark,28)}</span><span class="path-copy"><small>${bi('JALUR','PATH')} ${n}</small><strong>${title}</strong><span>${desc}</span></span>${icon('arrow',18)}</a>`).join('')}</nav>
  <section class="home-section"><div class="editorial-heading"><div><div class="eyebrow">01 / ${bi("PILIHAN BESTIARY", "BESTIARY SELECTION")}</div><h2>${bi("Nama yang melampaui zaman", "Names beyond time")}</h2><p>${bi("Empat legenda. Kekuatan berbeda. Kisah yang menanti untuk dibuka.", "Four legends. Distinct powers. Stories waiting to be unlocked.")}</p></div><a class="text-link" href="#/explore">${bi("Lihat seluruh arsip", "View the full archive")} ${icon("arrow", 18)}</a></div><div class="power-spectrum" aria-label="Power tiers">${SCALES.power.map(level => `<a href="#/explore?power=${level.id}" style="--spectrum-color:${level.color}"><span></span>${level.name}</a>`).join("")}</div><div id="featured-grid-slot" class="creature-grid featured-grid" aria-live="polite"><p>${bi("Menyiapkan koleksi…", "Preparing the collection…")}</p></div></section>
  ${renderScaleIntro()}<section class="nusantara-feature"><a class="nusantara-art" href="#/creature/barong" aria-label="${bi('Buka legenda Barong', 'Open Barong’s story')}"><img src="/assets/art/barong-editorial.webp" alt="" loading="lazy" decoding="async" width="1024" height="1536"></a><div class="nusantara-copy"><div class="eyebrow">02 / ${bi("DEKAT DENGAN AKAR KITA", "CLOSER TO OUR ROOTS")}</div><h2>${bi("Tanah yang kaya.<br>Kisah yang tak habis.", "A land of wonder.<br>Stories without end.")}</h2><p>${bi("Di balik rimbun hutan dan gerbang pura, Nusantara menyimpan kisah tentang penjaga, arwah, dan keseimbangan. Kenali mereka melalui budaya yang menghidupkannya.", "Beyond forests and temple gates, Indonesia holds stories of guardians, spirits, and balance. Meet them through the cultures that keep their stories alive.")}</p><a class="btn btn-secondary" href="#/explore?culture=indonesian-folklore">${bi("Jelajahi Folklor Nusantara", "Explore Indonesian Folklore")} ${icon("arrow", 18)}</a><small>${bi("Visual Barong: interpretasi artistik AI", "Barong visual: AI artistic interpretation")}</small></div></section>
  <section class="home-section"><div class="editorial-heading"><div><div class="eyebrow">03 / ${bi("PETA IMAJINASI MANUSIA", "A MAP OF HUMAN IMAGINATION")}</div><h2>${bi("Satu dunia, banyak keajaiban.", "One world, many wonders.")}</h2></div><a href="#/cultures" class="text-link">${bi("Semua peradaban", "All cultures")} ${icon("arrow", 18)}</a></div><div id="home-cultures-slot" class="culture-portals"></div></section>
  <section class="learning-banner"><div class="learning-mark">${icon("book", 46)}</div><div><div class="eyebrow">${bi("BUKAN SEKADAR MEMBACA", "GO BEYOND THE STORY")}</div><h2>${bi("Belajar melihat di balik legenda.", "Learn to read between the legends.")}</h2><p>${bi("Pahami simbol, telusuri sumber, dan uji pemahamanmu di Ruang Belajar.", "Explore symbols, trace sources, and test your understanding in the Learning Room.")}</p></div><a href="#/learn" class="btn btn-primary">${bi("Masuk Ruang Belajar", "Start learning")} ${icon("arrow", 18)}</a></section><section class="support-banner"><div><h2>${bi('Suka belajar di Mythics?', 'Enjoy learning with Mythics?')}</h2><p>${bi('Bantu ruang belajar ini terus tumbuh. Dukungan sukarela, belajar tetap gratis.', 'Help this learning space grow. Support is optional; learning stays free.')}</p></div><a class="btn" href="#/dukung">${bi('Dukung Mythics', 'Support Mythics')} →</a></section></div>`;
  let creatureCount, cultureCount;
  initHero(container.querySelector('.gateway'), signal);
  container.querySelector('#hero-random-trigger').addEventListener('click', () => openRandomEncounterModal());
  container.querySelector("#home-search").onsubmit = (e) => {
    e.preventDefault();
    location.hash = `#/explore?q=${encodeURIComponent(container.querySelector("#hero-search-input").value.trim())}`;
  };
  try {
    const [stats, cultures, featured] = await Promise.all([
      api.getLibraryStats(),
      api.getCultures(),
      Promise.all(["garuda", "kitsune", "jormungandr", "barong"].map(slug => api.getCreature(slug))),
    ]);
    if (!container.isConnected || signal.aborted) return;
    creatureCount = stats.total;
    cultureCount = cultures.filter(c => c.creature_count > 0).length;
    // Update only counts; keep the hero image, user selection and focus stable.
    container.querySelector('[data-archive-count]').textContent = creatureCount.toLocaleString('id-ID');
    container.querySelector('[data-cultures-count]').textContent = cultureCount;
    container.querySelector("#featured-grid-slot").innerHTML = featured
      .map(c => renderCreatureCard(c)).join("");
    container.querySelector("#home-cultures-slot").innerHTML = cultures
      .filter((c) => c.creature_count > 0)
      .slice(0, 6)
      .map(
        (c, i) =>
          `<a href="#/culture/${c.id}" class="culture-portal"><span class="portal-number">0${i + 1}</span><div><h3>${resolveLocalized(c.name)}</h3><p>${c.creature_count} ${bi("kisah dalam arsip", "archived stories")}</p></div>${icon("arrow", 20)}</a>`,
      )
      .join("");
  } catch {
    if (!container.isConnected || signal.aborted) return;
    container.querySelector("#featured-grid-slot").innerHTML =
      `<p>${bi("Koleksi belum dapat dimuat.", "The collection could not be loaded.")} <a href="#/explore">${bi("Coba buka arsip", "Open the archive")} →</a></p>`;
  }
}
