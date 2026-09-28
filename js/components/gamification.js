/**
 * Mythics Bestiary Journal & Gamification Engine
 * Anonymously tracks exploration progress, favorited entities,
 * and unlocks scholar badges in localStorage.
 */

const STORAGE_KEY_DISCOVERED = 'mythics_discovered_beings';
const STORAGE_KEY_FAVORITES = 'mythics_favorite_beings';

export const gamification = {
  getDiscovered() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_DISCOVERED)) || {};
    } catch {
      return {};
    }
  },

  getFavorites() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_FAVORITES)) || [];
    } catch {
      return [];
    }
  },

  markDiscovered(slug, metadata = {}) {
    if (!slug) return;
    const discovered = this.getDiscovered();
    if (!discovered[slug]) {
      discovered[slug] = {
        slug,
        discoveredAt: new Date().toISOString(),
        culture: metadata.culture || 'unknown',
        classification: metadata.classification || 'unknown',
        name: metadata.canonical_name || slug
      };
      localStorage.setItem(STORAGE_KEY_DISCOVERED, JSON.stringify(discovered));
      window.dispatchEvent(new CustomEvent('mythics:discovered-change', { detail: { slug } }));
    }
  },

  isFavorite(slug) {
    const favs = this.getFavorites();
    return favs.includes(slug);
  },

  toggleFavorite(slug) {
    let favs = this.getFavorites();
    const isFav = favs.includes(slug);
    if (isFav) {
      favs = favs.filter(s => s !== slug);
    } else {
      favs.push(slug);
    }
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favs));
    window.dispatchEvent(new CustomEvent('mythics:favorites-change', { detail: { slug, isFavorite: !isFav } }));
    return !isFav;
  },

  getStats(totalInEncyclopedia = 18) {
    const discovered = this.getDiscovered();
    const count = Object.keys(discovered).length;
    const percentage = totalInEncyclopedia > 0 ? Math.min(100, Math.round((count / totalInEncyclopedia) * 100)) : 0;
    return {
      discoveredCount: count,
      favoritesCount: this.getFavorites().length,
      percentage
    };
  },

  getAchievements() {
    const discovered = this.getDiscovered();
    const entries = Object.values(discovered);
    const count = entries.length;

    const achievements = [
      {
        id: 'first-encounter',
        title: { id: 'Pertemuan Pertama', en: 'First Encounter' },
        desc: { id: 'Membuka dan membaca arsip makhluk pertama Anda.', en: 'Unraveled and inspected your first creature archive.' },
        icon: '📜',
        unlocked: count >= 1
      },
      {
        id: 'nusantara-explorer',
        title: { id: 'Penjelajah Nusantara', en: 'Archipelago Explorer' },
        desc: { id: 'Menemukan 3 makhluk dari folklor Indonesia.', en: 'Discovered at least 3 entities from Indonesian folklore.' },
        icon: '🏝️',
        unlocked: entries.filter(e => e.culture === 'indonesian-folklore').length >= 3
      },
      {
        id: 'dragon-hunter',
        title: { id: 'Pemburu Naga', en: 'Dragon Seeker' },
        desc: { id: 'Menemukan 2 entitas berklasifikasi naga purba.', en: 'Encountered 2 entities classified as dragons.' },
        icon: '🐉',
        unlocked: entries.filter(e => e.classification === 'dragon').length >= 2
      },
      {
        id: 'spirit-whisperer',
        title: { id: 'Penyingkap Tabir Gaib', en: 'Spirit Whisperer' },
        desc: { id: 'Mempelajari 3 entitas berwujud arwah atau hantu.', en: 'Documented 3 spirits or undead apparitions.' },
        icon: '👻',
        unlocked: entries.filter(e => e.classification === 'spirit' || e.classification === 'undead').length >= 3
      },
      {
        id: 'master-archivist',
        title: { id: 'Kurator Ensiklopedia', en: 'Master Archivist' },
        desc: { id: 'Menjelajahi 10 makhluk dari berbagai penjuru dunia.', en: 'Explored 10 mythological beings from across civilizations.' },
        icon: '🏛️',
        unlocked: count >= 10
      }
    ];

    return achievements;
  }
};
