# Mythics · The Living Bestiary

An illustrated mythology bestiary, with warm black and walnut surfaces, engraved typography, antique gold frames, and independent Power / Threat / Fear classifications. Indonesian is the default language; all new classifications and their explanations also support English.

## Visual language

- Permanent dark canvas: warm black `#100c09`; walnut surface `#1c140e`; bronze border `#6a4c2c`. No theme switch; legacy light preferences are removed on startup.
- Type: ivory `#f3e5c9`, secondary `#c8b69a`; antique gold `#d9b16b`.
- Titles: Cinzel (400–700). Expressive italic accents: Cormorant Garamond (500). Body and UI: Manrope (400–700). Three local Latin WOFF2 files total about 73 KiB, licensed under the included SIL OFL licenses; `font-display: swap` and system fallbacks remain available. No external font requests.
- Content width: 1360 px. Desktop home has four portrait cards, tablet two, phone one, so illustrations and all three badges remain legible.
- Power controls seven generated museum-style frames: bronze and walnut (Mortal), silver and sapphire (Superhuman), dark copper and garnet (Monstrous), jade and gold (Regional), gilded arch and topaz (Divine), amethyst arch (Cosmic), and platinum with opal (Transcendent). Each has a central gemstone, with distinct material and silhouette. Transparent 640 × 960 WebP overlays total about 640 KiB; only visible frames load, and repeated tiers reuse the same asset. See `assets/frames/README.md` for generation prompts. Unassessed entries use a neutral CSS border. The Power guide displays all seven designs even where a tier has no assessed members.
- Power: faceted octagonal badge with a crystal. Threat: pointed shield with a prominent T code. Fear: oval eye medallion with an F code. Names and codes are separate, and group shapes and colors remain readable independently of the creature frame.

## Classifications and evidence

`js/scaling.js` is the shared source of truth for seven Power, seven Threat, and six Fear levels, bilingual explanations, and per-axis editorial rationales for 18 initial entries. Two of those entries have an unassessed Threat axis. These are interpretations of the archive's displayed versions, not canonical rankings or independent verification of every source.

Never turn absent evidence into Mortal / T1 / F1. Unreviewed entries show three neutral “Belum dinilai / Unassessed” badges. A benign role does not automatically imply low power, and foretelling death does not establish lethal threat. Do not infer classes from old numerical power scores, categories, or keywords.

`#/scales?axis=power|threat|fear` explains each class and links to filtered results. Detail pages explain each assigned axis and link to the entry's source section. All three filters compose with existing search and culture filters and persist in the URL. Power sorting follows the seven tiers, with unassessed entries last. The query engine is shared by Node and static hosting.

To extend coverage, read an entry's version, abilities, limitations, and source context, then add its assessment and a bilingual rationale for each axis to `ASSESSMENTS`. Null is valid independently for each axis. Future version-specific profiles should retain this distinction.

## Motion and performance

Aura, smoke, particles, pointer tilt, and the aura toggle have been removed. Old aura preferences are cleared on startup. Frames are static images; no animation loop, canvas, video, or WebGL is needed. Ordinary hover and focus feedback respects `prefers-reduced-motion`.

The four hero legends are selected manually with accessible buttons; there is no autoplay or background carousel timer. Focus is retained after selection, and the title, image, and classifications update together.

Images reuse existing local WebP artwork, preserve AI illustration labels and documentary credits, and lazy-load card images. The hero is prioritized. The homepage fetches four selected profiles and counts instead of the entire static catalog. The full catalog is only required when browsing/searching it. Detail, exploration, learning, journal, culture, comparison, and admin modules load on demand. A sub-kilobyte vector replaces the hidden 1 MB footer logo and page favicon; the original PNG remains available for social previews and installation. Hero counts update without replacing the artwork or resetting selection.

## Illustration gallery and comparison

Cards on the homepage, filtered results, journal, and comparison navigate to the creature detail, including when their images are clicked. Hero artwork and the Nusantara feature also link to the detail. Preview and download controls are exclusive to the detail page.

The detail layout pairs a readable introduction, three class badges, facts, and actions with a framed illustration. A reading column and sticky table of contents organize the story, classifications, reader notes, and sources; these stack on phones. Both the illustration and its View artwork button open a native modal dialog. A separate Download image button saves the original directly.

The viewer fits the full original illustration without cropping and offers 100–400% zoom, wheel and pinch gestures, drag and arrow-key panning, fit/reset, Escape to close, focus restoration, credits, and a real file download. Downloads fetch a same-origin/CORS-enabled image blob; a blocked external source offers the original-image link with a clear message. Loading and failed-image states keep unavailable controls disabled, including keyboard zoom. Closing disconnects the resize observer; generated object URLs are revoked after downloads.

Comparison has searchable selectors for the entire library, automatic updates on selection, an explicit Compare action, loading/error/retry states, and selected slugs in the URL. Three rows compare the independent editorial Power, Threat, and Fear classes; further rows show origin, tradition, classification, and habitat. Missing assessments remain unknown. Relative levels are not represented as combat outcomes. The comparison view guards against stale asynchronous responses and uses the same API on Node and static hosts. Comparison cards open the corresponding detail page.

## Implementation and verification

`css/bestiary.css` follows the existing base/editorial styles. `css/tier-frames.css` positions the generated frame overlays and class seals. `css/detail-editorial.css` owns the reading layout. `js/components/scaling-guide.js` owns badges, the guide, and the per-creature assessment panel. The shared `gilded-frame.js` component selects frame assets for cards, the class guide, and detail artwork. `css/gallery.css` and `js/components/image-viewer.js` implement the accessible artwork viewer. `css/fonts.css` defines locally served typefaces; both native and static preview servers serve WOFF2 with the correct MIME type. Existing journal, comparison, culture, learning, and language flows remain available.

Run `npm test`, `npm run test:ui`, and `npm run test:static`. Coverage includes classification independence, unknown states, filter composition, static/server parity, URL persistence, class explanations, successful local font loading, permanent dark mode with legacy light preferences, hero selection, card-to-detail navigation, actual image-download bytes from the viewer and detail, blocked-download fallback, zoom/pan/pinch, failed-image controls, mobile dialog bounds, reading navigation, comparison search and reload persistence, failed-fetch recovery, all seven generated frames, absence of aura, and 44 responsive route checks per hosting mode.
