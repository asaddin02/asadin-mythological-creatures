# Editorial illustrations

Created with the built-in OpenAI `image_gen` tool using the imagegen skill. These are contemporary AI-generated interpretations, not historical artifacts, documentary photographs, or scholarly reconstructions. The interface identifies them as editorial art. Selected original PNG outputs remain in the generator output folder; rejected variants from the additional 100-image batch have been deleted. The original six assets use WebP quality 84; the new creature-specific assets use quality 86 at their original dimensions.

## Files and prompts

- `garuda-editorial.webp`: wide homepage hero and Garuda card.
- `kitsune-editorial.webp`: Kitsune card and entry.
- `jormungandr-editorial.webp`: Jörmungandr card and entry.
- `barong-editorial.webp`: Barong card, entry, and Indonesian feature.
- `kuntilanak-editorial.webp`, `genderuwo-editorial.webp`: entry and card artwork where no local documentary image was available.

The exact prompts are recorded in `prompts.json`. No external artist or historical source is attributed to generated illustrations. Their anatomy, composition, and visual details are not historical evidence.

Documentary images live separately in `../archive/`; individual sources, artists, and licenses are recorded in `data/creatures.json`. Their original licenses continue to apply.

## Illustrations for the primary verified entries

The first group covers the 18 published entries with `confidence_score: High`, each of which also has a `lulus-otomatis` Gemini review. This does not mean the entire automatically reviewed research library has received illustrations. The broader worklist is in `data/artwork-worklist.json`.

Thirteen new individual images were generated using prompts derived from the reviewed creature descriptions and visual claims. Five existing creature illustrations were visually checked and attached to their entries. Each entry now explicitly includes its AI illustration in `images`, alongside any original documentary image. The browser lookup in `js/editorial-art.js` uses the same slug and URL for cards, dossiers, the hero, previews, and downloads.

| Creature slug | Current illustration | Identifying form checked |
| --- | --- | --- |
| pocong | pocong-verified.webp | Human ghost enclosed in tied burial shroud |
| kuntilanak | kuntilanak-editorial.webp | Female spirit, long black hair, white dress |
| genderuwo | genderuwo-editorial.webp | Large shaggy humanoid forest spirit |
| garuda | garuda-verified.webp | Human torso, eagle head, red wings, talons |
| barong | barong-editorial.webp | Balinese lion mask, mane, elaborate ornament |
| leak | leak-verified.webp | Floating human head, fangs, trailing spectral form |
| kitsune | kitsune-editorial.webp | White fox with multiple distinct tails |
| oni | oni-verified.webp | Red horned ogre, tiger-pelt wrap, iron club |
| minotaur | minotaur-verified.webp | Bull head and tail, human body |
| medusa | medusa-verified.webp | Human woman with snake hair |
| jormungandr | jormungandr-editorial.webp | Vast coiling sea serpent |
| fenrir | fenrir-verified.webp | Giant wolf bound by a silk-like fetter |
| banshee | banshee-verified.webp | Mourning woman, grey cloak, green dress |
| quetzalcoatl | quetzalcoatl-verified.webp | Legless feathered serpent |
| baba-yaga | baba-yaga-verified.webp | Elderly woman in mortar, chicken-legged hut |
| long-dragon | long-dragon-verified.webp | Wingless serpentine dragon, four legs, antlers |
| wewe-gombel | wewe-gombel-verified.webp | Elderly female spirit, long hair, elongated covered silhouette |
| banaspati | banaspati-verified.webp | Floating fireball variant |

The exact new prompts are recorded in `verified-prompts.json`. `verified-manifest.json` records all attached illustrations, their prompts, originating files, creature IDs, source-review paths, dimensions, and visual checks. The original Garuda image remains available; the revised image matches the anthropomorphic form described in the entry.

After visually inspecting a new output, register it with:

```bash
python3 scripts/register-artwork.py SLUG /absolute/path/to/generated.png --reviewed
```

The registrar checks the unique slug, passing research review, exact prompt, and image dimensions before encoding and attaching an image. It refuses to overwrite an existing generated asset. Its `--reviewed` flag records a human/agent visual inspection; it does not perform image recognition itself. `npm test` checks the creature/image mapping, research review, local asset availability, AI labeling, and prevents identical images from being reused across different creatures.

## Completed additional batch — 3 October 2026

The additional batch is **100/100 complete**, bringing the registered, attached editorial illustrations to **118 entries** including the original 18. Every batch illustration was inspected individually against its creature-specific prompt, checked for anatomy and folklore variant, encoded as a separate WebP in this directory, and attached to its matching creature. The illustrations can be reviewed together in [the 100-image gallery](../../docs/artwork-batch-100.html).

Eight creatures required anatomical corrections: Abada, Caballucos del Diablu, Cabra Cabriola, Chickcharney, Curupira, Dahu, Fuzhu, and Alara. Curupira's final rear three-quarter composition makes both reversed feet visible; the other revisions correct hooves, wing counts, toe counts, horns, and unequal leg lengths. Seven previously missing outputs were also generated successfully. Fourteen rejected PNG variants and seven review composites containing rejected images were deleted.

The completed worklist is in `../../data/artwork-batch-100.json`. `../../data/artwork-visual-review.json` records individual passing visual decisions and rejected attempts; `../../data/artwork-rejected-variants.json` records deleted filenames, reasons, and hashes. The exact selected prompts and manifest remain in `verified-prompts.json` and `verified-manifest.json`. These records separate source review from agent visual inspection; no automated image recognition is claimed.
