import { api } from "../api-client.js";
import { resolveLocalized } from "../i18n.js";
import { bi, icon } from "../ui.js";
import { renderHero } from "./hero.js";
import { renderCreatureCard } from "./creature-card.js";
import { openRandomEncounterModal } from "./random-encounter.js";
export async function renderHomeView(container) {
  container.innerHTML = `<div id="home-hero-slot">${renderHero()}</div><div class="container home-body"><form class="discovery-search" id="home-search"><label for="hero-search-input">${icon("search", 22)}<span class="sr-only">${bi("Cari makhluk mitologi", "Search mythical beings")}</span></label><input id="hero-search-input" type="search" placeholder="${bi("Kisah apa yang ingin kamu temukan?", "What story will you discover?")}"><button type="submit">${bi("Cari di arsip", "Search archive")} ${icon("arrow", 17)}</button></form><div class="search-suggestions"><span>${bi("MULAI DARI", "START WITH")}</span><a href="#/creature/garuda">Garuda</a><a href="#/creature/kitsune">Kitsune</a><a href="#/explore?culture=indonesian-folklore">${bi("Folklor Nusantara", "Indonesian folklore")}</a><a href="#/explore?classification=dragon">${bi("Naga & ular purba", "Dragons & serpents")}</a></div>
  <section class="home-section"><div class="editorial-heading"><div><div class="eyebrow">01 / ${bi("PILIHAN EDITORIAL", "EDITORIAL SELECTION")}</div><h2>${bi("Legenda yang melampaui zaman", "Legends beyond time")}</h2><p>${bi("Empat pintu masuk menuju dunia yang lebih luas.", "Four doorways into a wider world.")}</p></div><a class="text-link" href="#/explore">${bi("Lihat seluruh arsip", "View the full archive")} ${icon("arrow", 18)}</a></div><div id="featured-grid-slot" class="creature-grid featured-grid" aria-live="polite"><p>${bi("Menyiapkan koleksi…", "Preparing the collection…")}</p></div></section>
  <section class="nusantara-feature"><div class="nusantara-art" role="img" aria-label="${bi("Interpretasi artistik Barong Bali", "Artistic interpretation of a Balinese Barong")}"></div><div class="nusantara-copy"><div class="eyebrow">02 / ${bi("DEKAT DENGAN AKAR KITA", "CLOSER TO OUR ROOTS")}</div><h2>${bi("Tanah yang kaya.<br>Kisah yang tak habis.", "A land of wonder.<br>Stories without end.")}</h2><p>${bi("Di balik rimbun hutan dan gerbang pura, Nusantara menyimpan kisah tentang penjaga, arwah, dan keseimbangan. Kenali mereka melalui budaya yang menghidupkannya.", "Beyond forests and temple gates, Indonesia holds stories of guardians, spirits, and balance. Meet them through the cultures that keep their stories alive.")}</p><a class="btn btn-secondary" href="#/explore?culture=indonesian-folklore">${bi("Jelajahi Folklor Nusantara", "Explore Indonesian Folklore")} ${icon("arrow", 18)}</a><small>${bi("Visual Barong: interpretasi artistik AI", "Barong visual: AI artistic interpretation")}</small></div></section>
  <section class="home-section"><div class="editorial-heading"><div><div class="eyebrow">03 / ${bi("PETA IMAJINASI MANUSIA", "A MAP OF HUMAN IMAGINATION")}</div><h2>${bi("Satu dunia, banyak keajaiban.", "One world, many wonders.")}</h2></div><a href="#/cultures" class="text-link">${bi("Semua peradaban", "All cultures")} ${icon("arrow", 18)}</a></div><div id="home-cultures-slot" class="culture-portals"></div></section>
  <section class="learning-banner"><div class="learning-mark">${icon("book", 46)}</div><div><div class="eyebrow">${bi("BUKAN SEKADAR MEMBACA", "GO BEYOND THE STORY")}</div><h2>${bi("Belajar melihat di balik legenda.", "Learn to read between the legends.")}</h2><p>${bi("Pahami simbol, telusuri sumber, dan uji pemahamanmu di Ruang Belajar.", "Explore symbols, trace sources, and test your understanding in the Learning Room.")}</p></div><a href="#/learn" class="btn btn-primary">${bi("Masuk Ruang Belajar", "Start learning")} ${icon("arrow", 18)}</a></section></div>`;
  const wireHero = () =>
    container
      .querySelector("#hero-random-trigger")
      ?.addEventListener("click", () => openRandomEncounterModal());
  wireHero();
  container.querySelector("#home-search").onsubmit = (e) => {
    e.preventDefault();
    location.hash = `#/explore?q=${encodeURIComponent(container.querySelector("#hero-search-input").value.trim())}`;
  };
  try {
    const [data, cultures] = await Promise.all([
      api.getCreatures({ limit: 100 }),
      api.getCultures(),
    ]);
    if (!container.querySelector("#home-hero-slot")) return;
    container.querySelector("#home-hero-slot").innerHTML = renderHero(
      data.pagination.total,
      cultures.filter((c) => c.creature_count > 0).length,
    );
    wireHero();
    const all = data.creatures || [];
    container.querySelector("#featured-grid-slot").innerHTML = [
      "garuda",
      "kitsune",
      "jormungandr",
      "barong",
    ]
      .map((s) => all.find((c) => c.slug === s))
      .filter(Boolean)
      .map((c) => renderCreatureCard(c))
      .join("");
    container.querySelector("#home-cultures-slot").innerHTML = cultures
      .filter((c) => c.creature_count > 0)
      .slice(0, 6)
      .map(
        (c, i) =>
          `<a href="#/culture/${c.id}" class="culture-portal"><span class="portal-number">0${i + 1}</span><div><h3>${resolveLocalized(c.name)}</h3><p>${c.creature_count} ${bi("kisah dalam arsip", "archived stories")}</p></div>${icon("arrow", 20)}</a>`,
      )
      .join("");
  } catch {
    container.querySelector("#featured-grid-slot").innerHTML =
      `<p>${bi("Koleksi belum dapat dimuat.", "The collection could not be loaded.")} <a href="#/explore">${bi("Coba buka arsip", "Open the archive")} →</a></p>`;
  }
}
