#!/usr/bin/env node
/**
 * Writes a Gemini research batch: the manifest the verifier checks against
 * (data/gemini/batches/<id>.json) and the prompt Gemini works from
 * (docs/gemini/batches/<id>.md). Rules and output format live in
 * docs/gemini/00-instruksi-utama.md; a batch only lists the creatures and what is
 * already known about them, marking every unverified hint as such.
 *
 * Library: writeBatch() is used by build-worklist.mjs for the full plan.
 * CLI (existing creatures only):
 *   node scripts/gemini/make-batch.mjs --id batch-001 --task rewrite --tier rich --slugs a,b,c [--title "..."]
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';

const ROOT = new URL('../../', import.meta.url);
export const INSTRUCTIONS_VERSION = 3;

export const TASKS = {
  rewrite: 'Entri lama berisi teks template dan sumber yang belum terverifikasi. Tulis ulang dari nol berdasarkan riset baru; isi entri lama hanya petunjuk pencarian.',
  enrich: 'Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.',
  new: 'Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.'
};

// Images the 2026-09-29 audit found to depict something else; both were checked against Commons metadata.
const KNOWN_WRONG_IMAGES = new Map([
  ['File:Shrouded effigies,St Edmund, Fenny Bentley 2.jpg', 'foto patung makam di sebuah gereja Inggris, bukan Pocong'],
  ['File:Wewe Illustration.jpg', 'gravir Italia tahun 1585 tentang "monster dari seluruh dunia"; deskripsi Commons hanya menyebutnya "roughly corresponding" dengan Wewe Gombel, itu tafsiran pengunggah']
]);

const fileTitle = url => decodeURIComponent(String(url || '').split('/wiki/')[1] || '').replace(/_/g, ' ').replace(/^File:/i, '');
const wikiUrl = (wiki, title) => `https://${wiki.replace(/wiki$/, '').replace(/_/g, '-')}.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`;

/** Prompt section for one work item; `creature` is the current Mythics record, if any. */
function describe(item, creature, n) {
  const lines = [`### ${n}. \`${item.slug}\` — ${item.canonical_name} (task \`${item.task}\`, tier \`${item.tier}\`)`];
  if (item.jenis) lines.push(`- **Jenis: ${item.jenis}** (dugaan awal dari ${item.qid ? 'kelas/deskripsi Wikidata' : 'klasifikasi lama'}; pastikan dengan sumber, isi \`jenis\` dan \`classification\` sesuai temuanmu).`);
  if (item.qid) {
    const bits = [item.description_en && `deskripsi Wikidata: "${item.description_en}"`, item.classes?.length && `kelas Wikidata: ${item.classes.slice(0, 4).join(', ')}`].filter(Boolean);
    lines.push(`- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/${item.qid}${bits.length ? ` — ${bits.join('; ')}` : ''}.`);
  }
  if (item.wiki_links?.length) {
    lines.push('- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):');
    for (const w of item.wiki_links) lines.push(`  - ${w.wiki.replace(/wiki$/, '')}: ${wikiUrl(w.wiki, w.title)}`);
  }
  if (creature) {
    lines.push(`- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi \`${creature.classification}\`, budaya \`${creature.culture}\`, wilayah "${creature.region}".`);
    const names = (creature.alternate_names || []).map(a => a.name).filter(Boolean);
    if (names.length) lines.push(`- Nama lain di entri lama (belum terverifikasi): ${names.join(', ')}.`);
    const verified = (creature.sources || []).filter(s => s.revision_id);
    const unverified = (creature.sources || []).filter(s => !s.revision_id);
    if (verified.length) {
      lines.push('- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):');
      for (const s of verified) lines.push(`  - ${s.source_name}: ${s.url}`);
    }
    if (unverified.length) {
      lines.push('- Sumber di entri lama, **belum terverifikasi**. Jangan dicantumkan kecuali kamu menemukan dan membuka halaman spesifik yang memuat kutipannya:');
      for (const s of unverified) {
        const who = [s.author, s.publication_date].filter(Boolean).join(', ');
        lines.push(`  - ${who ? `${who} — ` : ''}"${s.title}" (${s.url})`);
      }
    }
    for (const img of creature.images || []) {
      const title = `File:${fileTitle(img.source_url)}`;
      const wrong = KNOWN_WRONG_IMAGES.get(title);
      lines.push(wrong
        ? `- Gambar lama \`${title}\` **SALAH** (${wrong}). Jangan dipakai.`
        : `- Gambar lama \`${title}\`: berkasnya ada di Commons, tetapi relevansinya belum dibuktikan. Pakai hanya kalau memenuhi §5.`);
    }
  }
  if (item.hint) lines.push(`- Catatan: ${item.hint}`);
  return lines.join('\n');
}

/**
 * Write one batch (manifest + prompt).
 * @param {{ id: string, title?: string, items: object[], creaturesBySlug: Map<string, object> }} opts
 */
export async function writeBatch({ id, title = '', items, creaturesBySlug }) {
  const tasks = [...new Set(items.map(i => i.task))];
  const prompt = [
    `# Batch ${id}${title ? ` — ${title}` : ''}`,
    '',
    `Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi ${INSTRUCTIONS_VERSION})" di \`docs/gemini/00-instruksi-utama.md\`.`,
    '',
    `- \`batch_id\`: \`${id}\``,
    `- Jumlah makhluk: ${items.length}`,
    ...tasks.map(t => `- \`task\` \`${t}\`: ${TASKS[t]}`),
    '',
    '## Daftar makhluk',
    '',
    items.map((item, i) => describe(item, creaturesBySlug.get(item.slug), i + 1)).join('\n\n'),
    '',
    '## Cara menjawab',
    '',
    `Kerjakan berurutan mulai dari \`${items[0].slug}\`, sesuai §10: satu blok \`\`\`json per makhluk, ditulis ke \`data/gemini/inbox/${id}.md\` (mode agen) atau dikirim sebagai jawaban (mode chat).`,
    ''
  ].join('\n');
  const manifest = {
    batch_id: id,
    created_at: new Date().toISOString(),
    instructions_version: INSTRUCTIONS_VERSION,
    entries: items.map(i => ({ slug: i.slug, canonical_name: i.canonical_name, task: i.task, tier: i.tier, jenis: i.jenis || null, qid: i.qid || null }))
  };
  await mkdir(new URL('data/gemini/batches/', ROOT), { recursive: true });
  await mkdir(new URL('data/gemini/inbox/', ROOT), { recursive: true });
  await mkdir(new URL('docs/gemini/batches/', ROOT), { recursive: true });
  await writeFile(new URL(`data/gemini/batches/${id}.json`, ROOT), JSON.stringify(manifest, null, 2) + '\n');
  await writeFile(new URL(`docs/gemini/batches/${id}.md`, ROOT), prompt);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { values: args } = parseArgs({
    options: { id: { type: 'string' }, task: { type: 'string' }, tier: { type: 'string' }, slugs: { type: 'string' }, title: { type: 'string', default: '' } }
  });
  const fail = message => {
    console.error(message);
    process.exit(1);
  };
  if (!/^batch-\d{3,4}$/.test(args.id || '')) fail('--id harus berbentuk batch-001');
  if (!['rewrite', 'enrich'].includes(args.task)) fail('--task harus rewrite atau enrich (makhluk baru dibuat lewat build-worklist.mjs)');
  if (!['rich', 'core'].includes(args.tier)) fail('--tier harus rich atau core');
  const slugs = (args.slugs || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!slugs.length) fail('--slugs kosong');
  const creatures = JSON.parse(await readFile(new URL('data/creatures.json', ROOT), 'utf8'));
  const creaturesBySlug = new Map(creatures.map(c => [c.slug, c]));
  const missing = slugs.filter(s => !creaturesBySlug.has(s));
  if (missing.length) fail(`Slug tidak ada di data/creatures.json: ${missing.join(', ')}`);
  const items = slugs.map(slug => ({ slug, canonical_name: creaturesBySlug.get(slug).canonical_name, task: args.task, tier: args.tier }));
  await writeBatch({ id: args.id, title: args.title, items, creaturesBySlug });
  console.log(`Batch ${args.id}: ${items.length} makhluk → docs/gemini/batches/${args.id}.md`);
}
