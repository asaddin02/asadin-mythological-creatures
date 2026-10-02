import { getLanguage, setLanguage } from "../i18n.js";
import { bi, icon } from "../ui.js";
export function renderNavbar(container) {
  const links = [
    ["explore", "Bestiary"],
    ["compare", bi("Bandingkan", "Compare")],
    ["scales", bi("Klasifikasi", "Classes")],
    ["cultures", bi("Peradaban", "Cultures")],
    ["regions", bi("Atlas Dunia", "World Atlas")],
    ["learn", bi("Ruang Belajar", "Learning Room")],
  ];
  container.innerHTML = `<header class="site-header"><div class="container"><nav class="navbar" aria-label="${bi("Navigasi utama", "Main navigation")}">
    <a href="#/" class="brand-link"><span class="brand-emblem">${icon("compass", 30)}</span><span class="brand-lockup"><span class="brand-name">MYTHICS<span class="brand-dot">.</span></span><small>THE LIVING BESTIARY</small></span></a>
    <ul class="nav-links" id="main-nav-links">${links.map(([route, label]) => `<li><a href="#/${route}" class="nav-link" data-route="${route}">${label}</a></li>`).join("")}<li class="mobile-extra"><a href="#/journal" class="nav-link" data-route="journal">${bi("Jurnal Saya", "My Journal")}</a></li></ul>
    <div class="nav-actions"><button class="lang-toggle-btn" id="lang-toggle-btn" aria-label="${bi("Switch to English", "Ganti ke Bahasa Indonesia")}">${icon("globe", 16)} ${getLanguage().toUpperCase()}</button><a href="#/journal" class="nav-journal">${icon("bookmark", 17)}<span>${bi("Jurnal Saya", "My Journal")}</span></a><button class="btn-icon mobile-nav-toggle" id="mobile-menu-toggle" aria-label="${bi("Buka navigasi", "Open navigation")}" aria-controls="main-nav-links" aria-expanded="false">${icon("menu")}</button></div>
  </nav></div></header>`;
  container.querySelector("#lang-toggle-btn").onclick = () =>
    setLanguage(getLanguage() === "id" ? "en" : "id");
  const toggle = container.querySelector("#mobile-menu-toggle"),
    nav = container.querySelector("#main-nav-links");
  const close = () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.onclick = () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  };
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  container.onkeydown = (e) => {
    if (e.key === "Escape") {
      close();
      toggle.focus();
    }
  };
}
