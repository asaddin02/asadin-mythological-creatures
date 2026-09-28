/**
 * Mythics Bilingual Internationalization Engine (i18n)
 * Supports Indonesian (Primary - id) and English (Secondary - en).
 * Seamless key lookup, event dispatching, and localized content extraction.
 */

export const translations = {
  id: {
    // Navigation
    "nav.brand": "MYTHICS",
    "nav.explore": "Jelajah Arsip",
    "nav.cultures": "Tradisi Budaya",
    "nav.random": "Pertemuan Acak",
    "nav.compare": "Bandingkan",
    "nav.journal": "Buku Petualang",
    "nav.admin": "Editor & Riset",
    "nav.searchPlaceholder": "Cari makhluk, nama, budaya, atau kemampuan...",
    "nav.themeDark": "Mode Gelap",
    "nav.themeLight": "Mode Terang",

    // Hero Section
    "hero.badge": "ENSIKLOPEDIA MAKHLUK MITOLOGI & FOLKLOR DUNIA",
    "hero.title": "Jelajahi Entitas yang Membentuk Mitos Dunia",
    "hero.subtitle": "Arsip digital berstandar kuratorial untuk menemukan makhluk mitologi, arwah legenda, naga purba, dan entitas supernatural dari berbagai peradaban dunia dengan rujukan sumber terverifikasi.",
    "hero.btnExplore": "Mulai Menjelajah",
    "hero.btnRandom": "✦ Pertemuan Acak",
    "hero.statCreatures": "Entitas Terverifikasi",
    "hero.statCultures": "Tradisi Budaya Dunia",
    "hero.statProvenanced": "Rujukan Sumber Terdokumentasi",

    // Featured & Highlights
    "home.featured": "Sorotan Ensiklopedia",
    "home.featuredSubtitle": "Entitas terpilih dengan catatan sejarah dan kekayaan lore yang mendalam.",
    "home.indonesianSpotlight": "Folklor & Legenda Nusantara",
    "home.indonesianSubtitle": "Khazanah arwah, makhluk sakral, dan mitos dari kepulauan Indonesia.",
    "home.cultures": "Jelajahi Berdasarkan Budaya",
    "home.culturesSubtitle": "Telusuri asal-usul makhluk dari mitologi Yunani, Nordik, Shinto Jepang, hingga tradisi Mesoamerika.",
    "home.categories": "Klasifikasi Taksonomi",
    "home.categoriesSubtitle": "Temukan makhluk berdasarkan wujud: Naga, Roh, Dewa, Monster, Yokai, dan Raksasa.",
    "home.viewAll": "Lihat Semua",

    // Creature Card
    "card.viewDetail": "Buka Arsip →",
    "card.origin": "Asal",
    "card.culture": "Budaya",
    "card.type": "Klasifikasi",
    "card.power": "Profil Kekuatan",

    // Detail Page
    "detail.back": "← Kembali ke Penjelajahan",
    "detail.quickStats": "Ringkasan Parameter",
    "detail.about": "Tentang Entitas",
    "detail.lore": "Catatan Tradisi & Sejarah",
    "detail.culturalContext": "Konteks Budaya & Nuansa Tradisi",
    "detail.modernDistinction": "Pembeda Tradisi vs Budaya Populer",
    "detail.abilities": "Kemampuan Terdokumentasi",
    "detail.powerProfile": "Mythics Power Profile",
    "detail.powerDisclaimer": "Mythics Power Profile — klasifikasi editorial/hiburan yang diturunkan secara deterministik dari atribut tradisi terdokumentasi; bukan peringkat kanonik dari budaya sumber.",
    "detail.storyMode": "Mode Cerita (Ringkas)",
    "detail.expertMode": "Mode Arsip (Mendalam)",
    "detail.didYouKnow": "Tahukah Anda?",
    "detail.related": "Entitas Berhubungan",
    "detail.sources": "Sumber & Referensi Akademik",
    "detail.imageCredits": "Kredit Gambar & Lisensi",
    "detail.imageType": "Tipe Gambar",
    "detail.license": "Lisensi",
    "detail.bookmarkAdd": "Simpan ke Koleksi",
    "detail.bookmarkRemove": "Hapus dari Koleksi",
    "detail.share": "Bagikan Entitas",
    "detail.evidenceLevel": "Tingkat Bukti",
    "detail.completeness": "Kelengkapan Arsip",
    "detail.confidence": "Tingkat Kepercayaan",

    // Story Mode Labels
    "story.who": "Siapa Sosok Ini?",
    "story.origin": "Dari Mana Asalnya?",
    "story.role": "Apa Peran & Karakternya?",
    "story.famousFor": "Mengapa Terkenal?",

    // Explore Page
    "explore.title": "Jelajah Arsip Mitologi",
    "explore.subtitle": "Saring dan temukan ribuan makhluk berdasarkan tradisi, tipe, elemen, habitat, dan kekuatan.",
    "explore.searchLabel": "Pencarian Kata Kunci",
    "explore.allCultures": "Semua Budaya",
    "explore.allCategories": "Semua Klasifikasi",
    "explore.allElements": "Semua Elemen",
    "explore.allHabitats": "Semua Habitat",
    "explore.allTraits": "Semua Sifat",
    "explore.sortBy": "Urutkan",
    "explore.sortDefault": "Koleksi Terpilih",
    "explore.sortNameAsc": "Nama (A - Z)",
    "explore.sortNameDesc": "Nama (Z - A)",
    "explore.sortCompleteness": "Kelengkapan Tertinggi",
    "explore.sortPower": "Kekuatan Gaib Tertinggi",
    "explore.resultsCount": "entitas ditemukan",
    "explore.emptyTitle": "Tidak Ditemukan Makhluk yang Cocok",
    "explore.emptyDesc": "Coba ubah kata kunci pencarian atau sesuaikan kombinasi saringan budaya dan klasifikasi.",
    "explore.clearFilters": "Reset Saringan",

    // Random Encounter
    "random.modalTitle": "✦ Pertemuan Takdir",
    "random.encounterText": "Anda berpapasan dengan...",
    "random.exploreButton": "Telusuri Lembar Arsip →",
    "random.againButton": "Cari Pertemuan Lain",
    "random.filterLabel": "Saring Pertemuan:",
    "random.all": "Sepenuhnya Acak",
    "random.indo": "Folklor Indonesia",
    "random.japan": "Mitologi Jepang",
    "random.norse": "Mitologi Nordik",
    "random.greek": "Mitologi Yunani",

    // Compare
    "compare.title": "Bandingkan Dua Entitas",
    "compare.subtitle": "Analisis perbandingan struktural asal-usul, dimensi kemampuan, dan karakteristik budaya.",
    "compare.selectA": "Pilih Entitas Pertama",
    "compare.selectB": "Pilih Entitas Kedua",
    "compare.vs": "MELAWAN",
    "compare.metric": "Dimensi Analisis",
    "compare.delta": "Perbedaan Relatif",
    "compare.btnCompare": "Tampilkan Perbandingan",

    // Journal / Collection
    "journal.title": "Buku Petualang (Bestiary Journal)",
    "journal.subtitle": "Catatan eksplorasi pribadi makhluk mitologi yang telah Anda temukan dan simpan.",
    "journal.statsDiscovered": "Makhluk Ditemukan",
    "journal.statsBookmarked": "Tersimpan di Koleksi",
    "journal.achievements": "Lencana Penjelajah",
    "journal.emptyFavorites": "Anda belum menyimpan makhluk ke dalam koleksi favorit.",

    // Admin & Research Ingestion
    "admin.title": "Pusat Kontrol Redaksi & Riset",
    "admin.subtitle": "Pipeline otomatis penyerapan data entitas dari Wikimedia, Wikipedia, dan validasi sumber.",
    "admin.statsTotal": "Total Entitas",
    "admin.statsPublished": "Dipublikasikan",
    "admin.statsReviews": "Menunggu Review",
    "admin.statsLowConf": "Kepercayaan Rendah",
    "admin.statsMissingImg": "Tanpa Gambar",
    "admin.researchHeader": "Riset Entitas Baru (Autonomous Ingestion)",
    "admin.researchDesc": "Ketik nama makhluk dalam mitologi apa pun untuk menjalankan investigasi data otomatis, penarikan sumber, lisensi gambar, dan pembuatan draf dwibahasa.",
    "admin.inputEntityName": "Nama entitas (contoh: Valkyrie, Anubis, Ahool)...",
    "admin.btnRunResearch": "Jalankan Riset Otomatis",
    "admin.autoPublishCheckbox": "Publikasikan langsung (tanpa antrean draf)",
    "admin.terminalLogs": "Log Eksekusi Pipeline:",
    "admin.reviewQueue": "Antrean Draf Kurasi Redaksi",
    "admin.approve": "Setujui & Publikasikan",
    "admin.reject": "Tolak Draf",
    "admin.noPending": "Tidak ada draf yang sedang menunggu persetujuan.",

    // Footer
    "footer.aboutTitle": "Tentang Mythics",
    "footer.aboutText": "Mythics adalah proyek ensiklopedia digital independen untuk mendokumentasikan makhluk mitologi, cerita rakyat, dan tradisi kepercayaan dari seluruh peradaban dunia.",
    "footer.philosophy": "Mythics membedakan dengan tegas antara tradisi historis yang terdokumentasi, interpretasi budaya populer, dan rekonstruksi modern demi menjaga rasa hormat atas warisan kebudayaan manusia.",
    "footer.quickLinks": "Tautan Cepat",
    "footer.sourcesPolicy": "Kebijakan Data & Sumber",
    "footer.licensing": "Lisensi & Hak Cipta Gambar"
  },

  en: {
    // Navigation
    "nav.brand": "MYTHICS",
    "nav.explore": "Explore Archive",
    "nav.cultures": "World Cultures",
    "nav.random": "Random Encounter",
    "nav.compare": "Compare",
    "nav.journal": "Bestiary Journal",
    "nav.admin": "Editor & Research",
    "nav.searchPlaceholder": "Search creature, culture, trait, or ability...",
    "nav.themeDark": "Dark Theme",
    "nav.themeLight": "Light Theme",

    // Hero Section
    "hero.badge": "ENCYCLOPEDIA OF GLOBAL MYTHOLOGICAL BEINGS & FOLKLORE",
    "hero.title": "Explore the Beings That Shaped the Myths of Our World",
    "hero.subtitle": "A curated digital archive discovering legendary creatures, ancient dragons, folkloric spirits, and supernatural entities across civilizations with verified scholarly sources.",
    "hero.btnExplore": "Explore Bestiary",
    "hero.btnRandom": "✦ Random Encounter",
    "hero.statCreatures": "Verified Beings",
    "hero.statCultures": "Cultural Traditions",
    "hero.statProvenanced": "Documented References",

    // Featured & Highlights
    "home.featured": "Curated Highlights",
    "home.featuredSubtitle": "Spotlight entries featuring profound historical lineage and rich folklore.",
    "home.indonesianSpotlight": "Indonesian Folklore & Legends",
    "home.indonesianSubtitle": "Sacred spirits, reverent guardians, and legendary apparitions from the Indonesian archipelago.",
    "home.cultures": "Explore by Cultural Tradition",
    "home.culturesSubtitle": "Journey from Hellenic and Norse myth to Japanese Shinto lore and Mesoamerican traditions.",
    "home.categories": "Taxonomic Classifications",
    "home.categoriesSubtitle": "Discover beings classified by nature: Dragons, Spirits, Deities, Monsters, Yokai, and Giants.",
    "home.viewAll": "View All",

    // Creature Card
    "card.viewDetail": "Open Archive →",
    "card.origin": "Origin",
    "card.culture": "Culture",
    "card.type": "Classification",
    "card.power": "Power Profile",

    // Detail Page
    "detail.back": "← Back to Bestiary",
    "detail.quickStats": "Parameters Summary",
    "detail.about": "About the Entity",
    "detail.lore": "Mythic Lore & Tradition",
    "detail.culturalContext": "Cultural Context & Nuance",
    "detail.modernDistinction": "Traditional Lore vs Modern Pop Media",
    "detail.abilities": "Documented Abilities",
    "detail.powerProfile": "Mythics Power Profile",
    "detail.powerDisclaimer": "Mythics Power Profile — editorial/entertainment classification deterministically derived from documented traditional attributes; not a canonical rating from the source tradition.",
    "detail.storyMode": "Story Mode (Summary)",
    "detail.expertMode": "Archive Mode (Scholarly)",
    "detail.didYouKnow": "Did You Know?",
    "detail.related": "Related Beings",
    "detail.sources": "Sources & Scholarly References",
    "detail.imageCredits": "Image Credits & Licensing",
    "detail.imageType": "Image Type",
    "detail.license": "License",
    "detail.bookmarkAdd": "Save to Journal",
    "detail.bookmarkRemove": "Remove from Journal",
    "detail.share": "Share Entity",
    "detail.evidenceLevel": "Evidence Level",
    "detail.completeness": "Completeness",
    "detail.confidence": "Confidence",

    // Story Mode Labels
    "story.who": "Who is this entity?",
    "story.origin": "Where does it originate?",
    "story.role": "What is its role & behavior?",
    "story.famousFor": "Why is it famous?",

    // Explore Page
    "explore.title": "Explore Mythological Archive",
    "explore.subtitle": "Filter and discover thousands of beings by cultural tradition, classification, element, and traits.",
    "explore.searchLabel": "Keyword Search",
    "explore.allCultures": "All Cultures",
    "explore.allCategories": "All Classifications",
    "explore.allElements": "All Elements",
    "explore.allHabitats": "All Habitats",
    "explore.allTraits": "All Traits",
    "explore.sortBy": "Sort By",
    "explore.sortDefault": "Curated Highlights",
    "explore.sortNameAsc": "Name (A - Z)",
    "explore.sortNameDesc": "Name (Z - A)",
    "explore.sortCompleteness": "Highest Completeness",
    "explore.sortPower": "Supernatural Might",
    "explore.resultsCount": "beings discovered",
    "explore.emptyTitle": "No Matching Entities Found",
    "explore.emptyDesc": "Try adjusting your search terms or relaxing filter parameters.",
    "explore.clearFilters": "Reset Filters",

    // Random Encounter
    "random.modalTitle": "✦ Fateful Encounter",
    "random.encounterText": "You have crossed paths with...",
    "random.exploreButton": "Inspect Archive Entry →",
    "random.againButton": "Seek Another Encounter",
    "random.filterLabel": "Filter Encounter:",
    "random.all": "Completely Random",
    "random.indo": "Indonesian Folklore",
    "random.japan": "Japanese Folklore",
    "random.norse": "Norse Mythology",
    "random.greek": "Greek Mythology",

    // Compare
    "compare.title": "Side-by-Side Comparison",
    "compare.subtitle": "Comparative structural analysis of cultural origins, abilities, and power profiles.",
    "compare.selectA": "Select First Entity",
    "compare.selectB": "Select Second Entity",
    "compare.vs": "VERSUS",
    "compare.metric": "Analysis Dimension",
    "compare.delta": "Relative Delta",
    "compare.btnCompare": "Show Comparison",

    // Journal / Collection
    "journal.title": "Bestiary Journal",
    "journal.subtitle": "Personal explorer log tracking mythological beings you have unraveled and favorited.",
    "journal.statsDiscovered": "Entities Encountered",
    "journal.statsBookmarked": "Saved to Journal",
    "journal.achievements": "Explorer Badges",
    "journal.emptyFavorites": "You have not saved any creatures to your journal yet.",

    // Admin & Research Ingestion
    "admin.title": "Editorial & Research Control Center",
    "admin.subtitle": "Autonomous ingestion pipeline sourcing from Wikimedia, Wikipedia, and validating provenance.",
    "admin.statsTotal": "Total Entities",
    "admin.statsPublished": "Published",
    "admin.statsReviews": "Pending Review",
    "admin.statsLowConf": "Low Confidence",
    "admin.statsMissingImg": "Missing Image",
    "admin.researchHeader": "Research New Entity (Autonomous Ingestion)",
    "admin.researchDesc": "Input any mythological figure to initiate automated research, source citation, image licensing checks, and bilingual draft synthesis.",
    "admin.inputEntityName": "Entity name (e.g. Valkyrie, Anubis, Ahool)...",
    "admin.btnRunResearch": "Run Autonomous Research",
    "admin.autoPublishCheckbox": "Publish immediately (bypass review queue)",
    "admin.terminalLogs": "Pipeline Execution Stream:",
    "admin.reviewQueue": "Editorial Review & Curation Queue",
    "admin.approve": "Approve & Publish",
    "admin.reject": "Reject Draft",
    "admin.noPending": "No candidate drafts are currently pending editorial review.",

    // Footer
    "footer.aboutTitle": "About Mythics",
    "footer.aboutText": "Mythics is an independent digital encyclopedia documenting folklore, mythological beings, and supernatural heritage from world civilizations.",
    "footer.philosophy": "Mythics rigorously distinguishes between documented traditional lore, modern pop adaptations, and artistic reconstructions in respect of human cultural heritage.",
    "footer.quickLinks": "Navigation",
    "footer.sourcesPolicy": "Data & Sourcing Policy",
    "footer.licensing": "Licensing & Image Attribution"
  }
};

let currentLang = 'id';

/**
 * Initialize language from localStorage or browser preferences
 */
export function initI18n() {
  const saved = localStorage.getItem('mythics_lang');
  if (saved && (saved === 'id' || saved === 'en')) {
    currentLang = saved;
  } else {
    // Default Indonesian as primary
    currentLang = 'id';
  }
  document.documentElement.lang = currentLang;
  return currentLang;
}

/**
 * Get current active language
 */
export function getLanguage() {
  return currentLang;
}

/**
 * Switch language and dispatch change event
 */
export function setLanguage(lang) {
  if (lang !== 'id' && lang !== 'en') return;
  currentLang = lang;
  localStorage.setItem('mythics_lang', lang);
  document.documentElement.lang = lang;
  window.dispatchEvent(new CustomEvent('mythics:lang-change', { detail: { lang } }));
}

/**
 * Translate a UI key
 */
export function t(key, fallback = '') {
  const dict = translations[currentLang] || translations.id;
  if (dict[key] !== undefined) return dict[key];
  // Fallback to opposite language
  const otherDict = currentLang === 'id' ? translations.en : translations.id;
  if (otherDict[key] !== undefined) return otherDict[key];
  return fallback || key;
}

/**
 * Resolve bilingual object { id: "...", en: "..." }
 */
export function resolveLocalized(field, fallback = '') {
  if (!field) return fallback;
  if (typeof field === 'string') return field;
  if (typeof field === 'object') {
    return field[currentLang] || field.id || field.en || fallback;
  }
  return String(field);
}
