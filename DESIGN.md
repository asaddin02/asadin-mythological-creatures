# Mythics · The Living Archive

An editorial mythology archive with a warm, quiet museum atmosphere. The default language is Indonesian; English remains available from the persistent language control.

## Visual language

- Canvas: forest ink `#101311`; elevated surface `#191d19`; hairline `#30352d`.
- Type: parchment `#efece3`, secondary `#aeb0a4`; accent: copper `#c6a477`.
- Light theme: parchment `#f6f3eb`, forest ink `#242b23`, copper `#805e32`.
- Titles: DM Serif Display, regular weight. Italics are reserved for editorial emphasis.
- UI and body: DM Sans. Use generous line heights and short reading measures.
- Maximum content width: 1240 px; gutters: 36 px desktop, 22 px phone.
- Corners: 5–8 px on controls and cards. Border lines establish hierarchy without heavy shadows.
- Chapter labels, modest numbered culture links, and factual archive counts replace decorative statistics.

## Navigation and reading

Home → encyclopedia / cultures / atlas / learning → individual entries → journal and comparison.

The landing page highlights four selected stories, the Indonesian collection, and learning materials. Individual entries expose a reading guide and section navigation. Search and filter state survives reloads through the URL. User favorites and completed lessons remain local to the browser.

Content labels distinguish source images from AI editorial interpretations. Scores summarize editorial attributes; they are not scientific measurements. Cultural category names are navigation aids, not claims that entire regions share one tradition.

## Accessibility and responsive behavior

Cards are real links. Menus expose expanded state. Forms have labels. The encounter dialog supports Escape, focus containment, and focus restoration. A skip link moves focus into main content. Reduced motion disables decorative transitions. Tables scroll within their own containers on phones instead of widening the page.

Phone widths: two compact creature columns, stacked cultural feature, collapsible navigation. Tablet: two-column collections. Desktop: four-column editorial selection and three-column results.

## Implementation

`css/editorial.css` contains the final design tokens and shared component treatments over the existing functional base. `js/ui.js` owns reusable line icons, bilingual microcopy helpers, safe text escaping, and editorial image selection. `js/learning-content.js` owns the four bilingual lessons.
