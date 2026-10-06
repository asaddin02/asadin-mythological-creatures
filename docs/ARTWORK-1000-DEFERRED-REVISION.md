# Completed mythology presentation revision

Status: **141/141 revisions completed locally on 6 October 2026 (Asia/Jakarta)**. The user resumed the previously deferred work after the 1,000-image target was finished. Three parallel agents visually screened all 1,000 active illustrations: 859 were kept and 141 were selected for replacement (59 + 42 + 40). No screening decisions or selected revisions remain pending.

The replacements use source-supported variants, mythic events, character roles, and scale. Ordinary animal anatomy remains where the tradition calls for it; images convey identity through the documented scene instead of adding arbitrary appendages or glow. Examples include Heqet's frog-headed woman form, Otso's creation from wool, Henwen's wolf cub and eaglet, and Hrímfaxi carrying Night while bit foam falls as dew.

Every selected native PNG was inspected by its generator and independently by root. Both reviews are bound to the selected SHA256. Source claim IDs, statements, quotations, and source identities match the passing research review. Exact generation/edit prompts, editorial choices, previous paths and hashes are retained. Corrected attempts remain available without replacing the selected final or earlier approved files.

All 1,000 earlier WebP files and all 918 native originals that existed at baseline remain unchanged. The other 82 native paths were already missing before this task; they are recorded as a baseline limitation. All 141 new selected natives are stored in the workspace. Catalogue facts and membership remain unchanged: 1,936 entries and 1,000 active illustrations.

Review the [before/after gallery](artwork-presentation-revision-1000.html), [decision ledger and exact prompts](../data/artwork-presentation-revision-1000.json), [final audit](../data/artwork-presentation-revision-1000-audit.json), and [completion handoff](HANDOFF-ARTWORK-REVISION-2026-10-06.md). Native images and per-slug receipts are in `data/artwork-generated/presentation-revision-1000/`; deployed-format WebP files are in `assets/art/`. Generation used OpenAI built-in `image_gen`.

Verification: `node scripts/audit-artwork-presentation.mjs --require-complete`, `node tests/artwork-presentation.mjs`, `node tests/artwork-presentation-browser.mjs`, `npm run check`, `npm test`, static build/API checks and responsive browser checks all passed. Preparation and integration are resumable; integration now adds zero images. Run shared-state preparation and integration serially. Earlier historical batch galleries remain historical snapshots unless refreshed.

The changes are local and have not been committed, pushed or deployed.
