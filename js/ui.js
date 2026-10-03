import { getLanguage } from "./i18n.js";
import { EDITORIAL_ART } from "./editorial-art.js";
export const bi = (id, en) => (getLanguage() === "en" ? en : id);
export const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const icon = (name, size = 20) => {
  const paths = {
    crown: '<path d="M4 17 2 6l6 5 4-8 4 8 6-5-2 11ZM5 21h14M4 17h16"/><path d="M8 17v-3m8 3v-3"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    zoom: '<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6M10 7v6m-3-3h6"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    book: '<path d="M12 5v16m0-16C8 2 4 3 2 4v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-4-1-7-1-10 1Z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5Z"/>',
    globe:
      '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4Z"/>',
    spark: '<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.spark}</svg>`;
};
export const editorialArt = (slug) =>
  Object.hasOwn(EDITORIAL_ART, slug) ? EDITORIAL_ART[slug] : null;
