import { bi, escapeHtml as esc } from '../ui.js';
const S = values => new Proxy(values, { get: (values, key) => bi(...values[key]) });
const link = (url, label) => `<a class="text-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
const config = { donateLocalURL: 'https://saweria.co/asadin02', donateInternationalURL: 'https://ko-fi.com/asadin02', feedbackURL: 'https://github.com/asaddin02/asadin-mythological-creatures/issues' };
const pageHead = (heading, intro, eyebrow) => `<header class="edu-support-head"><span class="eyebrow">${eyebrow}</span><h1>${heading}</h1><p>${intro}</p></header>`;

const s = S({
  title: ['Dukung Mythics', 'Support Mythics'],
  heading: ['Bantu rasa ingin tahu terus tumbuh.', 'Help curiosity keep growing.'],
  intro: [
    'Mythics adalah ruang belajar gratis. Jika bermanfaat, orang tua, guru, dan sahabat pendidikan dapat mendukung pengembangannya secara sukarela.',
    'Mythics is a free learning space. Parents, teachers and friends of education can voluntarily support its development.',
  ],
  donate: ['Donasi sukarela', 'Voluntary donations'],
  purpose: [
    'Dukungan dapat membantu biaya operasional situs, perawatan aplikasi, dan pengembangan materi belajar.',
    'Support can help cover site operations, application maintenance and learning content development.',
  ],
  action: ['Lanjut ke halaman donasi', 'Continue to the donation page'],
  external: [
    'Pembayaran dilakukan di layanan eksternal. Periksa nama penerima, nominal, serta biaya yang tertera sebelum melanjutkan. Mythics tidak meminta atau menyimpan data pembayaran.',
    'Payment takes place on an external service. Check the recipient, amount and any fees before continuing. Mythics does not request or store payment details.',
  ],
  pending: ['Donasi uang belum tersedia.', 'Monetary donations are not available yet.'],
  pendingText: [
    'Sambil menunggu kanal donasi resmi, kamu tetap bisa mendukung dengan membagikan Mythics atau memberi masukan.',
    'While the official donation channel is being prepared, you can still help by sharing Mythics or sending feedback.',
  ],
  free: ['Belajar tetap gratis', 'Learning stays free'],
  freeText: [
    'Donasi tidak membuka materi khusus, menambah nilai, atau memengaruhi lencana. Semua orang mendapatkan akses belajar yang sama.',
    'Donations do not unlock lessons, increase scores or affect badges. Everyone gets the same learning access.',
  ],
  other: ['Mari tumbuhkan semangat belajar', 'Help curiosity grow'],
  share: ['Kenalkan ke teman dan guru', 'Share with friends and teachers'],
  shareText: [
    'Bagikan alamat Mythics kepada orang yang ingin belajar bersama Asadin Edu.',
    'Share the Mythics address with someone who wants to learn with Asadin Edu.',
  ],
  feedback: ['Bantu materi semakin baik', 'Help improve the lessons'],
  feedbackText: [
    'Menemukan istilah yang sulit atau informasi yang keliru? Beri tahu kami agar bisa diperbaiki.',
    'Found an unclear term or inaccurate information? Let us know so we can improve it.',
  ],
  send: ['Kirim masukan', 'Send feedback'],
  classroom: ['Gunakan dalam kegiatan belajar', 'Bring Mythics into learning activities'],
  classroomText: [
    'Ajak siswa atau keluarga mengenal materi belajar melalui materi, kuis, dan pengamatan bersama.',
    'Explore learning topics with students or family through lessons, quizzes and shared observations.',
  ],
  classroomAction: ['Jelajahi kegiatan belajar', 'Explore learning activities'],
  local: ['Dukungan dari Indonesia', 'Support from Indonesia'],
  international: ['Dukungan internasional', 'International support'],
  choose: ['Pilih kanal yang sesuai', 'Choose a suitable channel'],
  channelHint: [
    'Metode pembayaran, mata uang, dan ketersediaan negara mengikuti layanan yang dipilih. Kamu menentukan nominal di halaman layanan tersebut.',
    'Payment methods, currencies and country availability depend on the selected service. Choose your amount on that service’s page.',
  ],
  help: ['Tentang donasi', 'About donations'],
  receipt: ['Bukti pembayaran dan kendala transaksi', 'Receipts and payment issues'],
  receiptText: [
    'Simpan bukti pembayaran dari layanan yang kamu gunakan. Untuk status transaksi, pembayaran gagal, atau permintaan pengembalian dana, gunakan bantuan layanan tersebut. Mythics tidak memeriksa status pembayaran secara otomatis.',
    'Keep the receipt from your chosen service. For transaction status, failed payments or refund requests, use that service’s support. Mythics does not automatically check payment status.',
  ],
  back: ['Kembali belajar', 'Back to learning'],
});

// Payment destinations must be explicit HTTPS URLs, never a guessed account.
export function donationURL(value = config.donateURL) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
  } catch {
    return '';
  }
}

export const title = () => s.title;
export function renderSupportView(main) {
  const ctx = { main };
  document.title = `${s.title} · Mythics`;
  const channels = [
    { provider: 'Saweria', label: s.local, url: donationURL(config.donateLocalURL || '') },
    { provider: 'Ko-fi', label: s.international, url: donationURL(config.donateInternationalURL || '') },
  ].filter(channel => channel.url);
  // Preserve existing deployments configured with the original single destination.
  if (!channels.length && donationURL()) channels.push({ label: s.donate, url: donationURL() });
  ctx.main.innerHTML = `<div class="edu-support">${pageHead(s.heading, s.intro, 'MYTHICS / SUPPORT')}
    <div class="support-grid">
      <section class="card support-donation"><h2>${s.donate}</h2><p>${s.purpose}</p>
        ${channels.length ? `<h3>${s.choose}</h3><p class="muted small">${s.channelHint}</p><div class="support-channels">${channels.map(channel => `<article class="support-channel"><h4>${channel.provider || channel.label}</h4><p>${channel.label}</p><a class="btn" data-donate href="${esc(channel.url)}" target="_blank" rel="noopener noreferrer">${s.action} ↗<span class="sr-only"> — ${channel.label}</span></a><p class="source-meta">${esc(new URL(channel.url).hostname)}</p></article>`).join('')}</div><p class="muted small">${s.external}</p>` : `<div class="notice"><strong>${s.pending}</strong><p>${s.pendingText}</p></div>`}
      </section>
      <aside class="card support-promise"><span class="eyebrow">MYTHICS · ASADIN EDU</span><h2>${s.free}</h2><p>${s.freeText}</p><a class="btn secondary" href="#/learn">${s.back} →</a></aside>
    </div>
    <section class="section"><div class="section-head"><h2>${s.other}</h2></div><div class="grid support-ways">
      <article class="card"><h3>${s.share}</h3><p>${s.shareText}</p><a class="text-link" href="#/">Mythics →</a></article>
      <article class="card"><h3>${s.feedback}</h3><p>${s.feedbackText}</p>${config.feedbackURL ? link(config.feedbackURL, s.send, { cls: 'text-link' }) : ''}</article>
      <article class="card"><h3>${s.classroom}</h3><p>${s.classroomText}</p><a class="text-link" href="#/learn">${s.classroomAction} →</a></article>
    </div></section>
    <section class="section support-help"><h2>${s.help}</h2><details class="card"><summary>${s.receipt}</summary><p>${s.receiptText}</p></details></section></div>`;
}
