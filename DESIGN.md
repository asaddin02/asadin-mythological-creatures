# Mythics · The Living Bestiary

The Royal Atlas interface presents mythology as a royal illustrated archive: walnut-brown surfaces, antique gold, parchment type, cinematic artwork, and three independent classification axes. Indonesian is the default language; public navigation and new controls also support English.

## Shared visual language

- Canvas `#160f09`, surfaces `#23190f` / `#2a1e13`, parchment `#f3e8cf`, and antique gold `#d4ae6c`. Fine bronze borders, warm shadow, and restrained gold gradients separate surfaces and identify actions. Class colors keep their semantic identities.
- Cinzel supplies the masthead and landing statement. Cormorant Garamond roman supplies character names and interior headings; its italic supplies literary accents. Manrope supplies reading and interface text. Local WOFF2 fonts use `font-display: swap`; no external font requests.
- Containers expand to 1440 px, with responsive horizontal spacing. The character dossier can expand to 1540 px. Portrait cards use four columns on the desktop landing page, two on tablets, and one on small phones.
- All seven Power levels retain a color, a distinct vector symbol, and a Roman numeral I–VII. Thin CSS outlines replace raster ornament. Unknown classes retain neutral treatment and no invented tier.
- Power, Threat, and Fear badges have distinct glyphs, names, and ordinal ticks. These are separate scales, not a combined score. Their names remain available as text, including when decoration is hidden on small screens.

## Landing and exploration

The landing page opens with a full-bleed illustrated scene, a dark warm vignette behind the introduction, a compact legend panel, and four chapter selectors. Garuda, Kitsune, Jörmungandr, and Barong update the background, name, origin, links, and badges together after the next image decodes. Previous, next, pause, and play controls accompany direct selection. Manual selection keeps focus and pauses autoplay. A separate archive strip shows live API counts and links to the seven classes. The search dock and three expedition paths lead to the bestiary, world atlas, and comparison. Featured portraits, classification guidance, a Nusantara feature, cultural entry points, and learning follow.

The archive uses a persistent filter sidebar above 1000 px and a compact filter panel on smaller screens. Search and the three class filters are exposed; culture, category, habitat, element, content depth, and sorting open through a disclosure. A shared URL with advanced filters opens that disclosure automatically. Search, filters, sorting, and pagination remain synchronized with the URL.

The culture directory has text search and a region selector. Search includes the localized culture name, country, and region, persists on reload, and provides an empty-state reset. Culture and regional cards have direct links to their context and filtered collections. Culture detail exposes historical scope on demand. Journal, learning, classification, comparison, navigation, and artwork dialogs share the same surfaces and typography.

## Character dossier

Desktop detail uses a portrait column beside an identity header, three class badges, save/compare controls, six tabs, and a bounded reading pane. The portrait and tabs stay visible while the selected topic is read. The tabs are Ringkasan / Overview, Kisah / Story, Kekuatan / Powers, Budaya / Culture, Relasi / Relations, and Sumber / Sources.

`js/components/dossier.js` moves the existing rendered sections into explicit topics without changing entry data. Secondary sections and per-axis rationales use native disclosures. All topics remain reachable; hidden panels are removed from focus navigation. Tab selection is saved in `?tab=`, survives reload and language changes, and supports Left/Right/Home/End keys. Source buttons activate the Sources tab and open any containing disclosure before moving focus.

On phones, the portrait becomes a compact profile image beside the identity and badges. Tabs appear in the first viewport and stay below the site header during reading. When a reader changes topics after scrolling, the new topic starts below the tabs. Only the chosen topic is displayed, avoiding a single long page of unrelated sections.

The illustration and View artwork button open the full original image. The viewer retains zoom, wheel/pinch, pan, fit/reset, keyboard operation, Escape, focus restoration, credits, and real file downloads. Direct download remains available alongside the portrait. Failed downloads offer an original-image link; loading and failed-image states keep unavailable viewer controls disabled. Illustration credits remain accessible in About this artwork.

## Motion and performance

A slow transform animation adds subtle movement to the active landing scene, dossier illustration, and Nusantara artwork. IntersectionObserver pauses image movement outside the viewport; page visibility pauses it in background tabs. Inactive slideshow images stay paused. The carousel advances every nine seconds with an opacity crossfade. Hover, keyboard interaction, manual selection, visibility, and play/pause govern playback. Reduced-motion preferences start with a still scene and remove animated image movement, crossfades, and entrance effects; direct navigation remains available. Route-scoped AbortController cleanup cancels timers, listeners, observers, and pending image updates when leaving the page. A failed next image leaves the current scene visible, stops autoplay, and offers a retry through selection.

Hover light passes, arrow movement, image scaling, and finite section reveals use CSS transforms and opacity. `js/motion.js` shares two observers across the application, observes new content after DOM changes, and removes detached targets. No animation library, canvas, video, WebGL, pointer tracking, or new package dependency is added. Raster frame downloads remain eliminated.

Images reuse the existing WebP artwork and preserve AI labels and documentary credit. The shared missing-image SVG uses the new palette without implying an illustration exists. Card images are lazy-loaded, the first hero image is prioritized and the other background layers receive their source when selected, and the homepage fetches selected profiles and counts instead of the entire static catalog. Page modules continue to load on demand.

## Classification and evidence

`js/scaling.js` remains the source of truth for seven Power, seven Threat, and six Fear levels and the existing editorial assessments. Assessments interpret the archive's displayed version; they are not official rankings across traditions. Data and assessments are outside the UI redesign scope.

Never turn missing evidence into Mortal / T1 / F1. Unreviewed entries display “Belum dinilai / Unassessed”. Benign intent does not imply low power. Do not derive classes from numerical scores, categories, or keywords. The guide links to filtered results and explains why the axes are separate. Comparison describes differences without declaring a combat winner.

## Implementation and verification

`css/archive.css` owns the current interface and responsive behavior. Existing base styles support the underlying components; `tier-frames.css` and `gilded-frame.js` retain tier identities, while `gallery.css` and `image-viewer.js` support the modal viewer. `creature-detail.js` renders existing editorial sections and assigns their dossier topics.

Run `npm test`, `npm run test:ui`, and `npm run test:static`. Browser coverage includes slideshow autoplay, pause, hover, previous/next, failed-image recovery, route cleanup, hero selection, real image downloads, failed-download recovery, zoom/pan/pinch, all six dossier tabs, keyboard navigation, disclosures, source navigation, tab persistence, mobile reading position, culture search, advanced filter persistence, comparison search/swap/reload/retry, favorites, learning, languages, reduced motion, failed archive fetches, interrupted app bootstrap, and 66 responsive route checks per hosting mode. Automated browser coverage uses Chromium; visual review includes desktop, tablet, and phone layouts. See `docs/UI-AUDIT-2026-10-03.md` for the redesign record.
