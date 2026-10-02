// Editorial scales, independent of legacy numerical scores. Shared by static and server queries.
const level = (id, name, color, descriptionId, descriptionEn) => ({ id, name, color, description: { id: descriptionId, en: descriptionEn } });
export const SCALES = {
  power: [
    level('mortal', 'Mortal', '#c79870', 'Kapasitas manusia: prajurit, raja, atau penyihir dengan batas kemampuan manusia.', 'Human capacity: warriors, rulers, or sorcerers whose abilities remain within human limits.'),
    level('superhuman', 'Superhuman', '#4da7ff', 'Melampaui manusia biasa melalui kekuatan, ketahanan, atau kemampuan gaib. Setara hero legendaris.', 'Beyond ordinary humans in strength, resilience, or supernatural ability. The realm of legendary heroes.'),
    level('monstrous', 'Monstrous', '#ff5947', 'Kekuatan monster besar yang mampu menghancurkan kelompok atau kawasan terbatas.', 'The might of great monsters, capable of overwhelming groups or devastating a limited area.'),
    level('regional', 'Regional', '#4de0a4', 'Mempengaruhi wilayah luas, misalnya melalui badai, banjir, atau kendali atas bentang alam.', 'Influence over a broad region through storms, floods, or control of the landscape.'),
    level('divine', 'Divine', '#f2c75d', 'Kekuatan setingkat dewa dengan kuasa atas ranah seperti perang, laut, atau petir.', 'Godlike power, with authority over domains such as war, the sea, or lightning.'),
    level('cosmic', 'Cosmic', '#bc7aff', 'Kekuatan yang mempengaruhi dunia atau kosmos, termasuk entitas primordial berskala dunia.', 'Power affecting the world or cosmos, including primordial entities with world-scale influence.'),
    level('transcendent', 'Transcendent', '#f0dcff', 'Melampaui struktur dunia; keberadaannya bersifat metafisik atau mendasari kosmologi itu sendiri.', 'Beyond the structure of the world; a metaphysical existence or a foundation of cosmology itself.'),
  ],
  threat: [
    level('t1', 'Personal', '#d3bb89', 'Ancaman terhadap satu individu. Tidak menyiratkan bahwa makhluknya selalu menyerang.', 'A threat to an individual. This does not imply that the being always attacks.'),
    level('t2', 'Group', '#e7b273', 'Mampu membunuh atau mengalahkan satu kelompok manusia.', 'Can kill or overwhelm a group of people.'),
    level('t3', 'Settlement', '#f09a6d', 'Potensi kehancuran pada skala permukiman, desa, atau kota.', 'Potential destruction at the scale of a settlement, village, or city.'),
    level('t4', 'Regional', '#ff5947', 'Mengancam keselamatan suatu wilayah yang luas.', 'Threatens the safety of a broad region.'),
    level('t5', 'Civilization', '#f27794', 'Dapat menyebabkan runtuhnya sebuah bangsa atau peradaban.', 'Can cause the collapse of a nation or civilization.'),
    level('t6', 'Global', '#e88dcc', 'Ancaman yang dapat menjangkau atau menghancurkan dunia.', 'A threat capable of reaching or devastating the entire world.'),
    level('t7', 'Cosmic', '#c9a3ff', 'Mengancam tatanan kosmos atau realitas, melampaui kehancuran satu dunia.', 'Threatens the order of the cosmos or reality, beyond the destruction of a single world.'),
  ],
  fear: [
    level('f1', 'Unsettling', '#aebcca', 'Aneh, ganjil, dan membuat tidak nyaman; rasa takut tumbuh dari sesuatu yang terasa tidak semestinya.', 'Strange, uncanny, and uncomfortable; fear of something that feels out of place.'),
    level('f2', 'Predatory', '#91b9d3', 'Ketakutan menjadi mangsa: makhluk yang memburu manusia.', 'The fear of becoming prey to a being that hunts humans.'),
    level('f3', 'Supernatural', '#a1a6ed', 'Kemampuan atau keberadaan yang tidak dapat dijelaskan oleh hukum alam.', 'Abilities or an existence that cannot be explained by natural laws.'),
    level('f4', 'Existential', '#bb9aef', 'Membuat manusia menyadari kerapuhan hidup dan betapa sedikit kendali yang mereka miliki.', 'Confronts humans with the fragility of life and how little control they have.'),
    level('f5', 'Cosmic Horror', '#d5aff2', 'Skala entitas membuat manusia terasa tidak berarti dalam luasnya kosmos.', 'The scale of the entity renders humanity insignificant within the cosmos.'),
    level('f6', 'Reality Horror', '#eee0ff', 'Keberadaan atau realitasnya sendiri merupakan ancaman, bukan hanya tindakan makhluk tersebut.', 'Its very existence or reality is a threat, beyond the actions of the being itself.'),
  ],
};

// Interpretations of the corresponding archive entry, not canonical cultural rankings.
// Each axis has its own rationale. Absence of an assessment must never become a low tier.
const entry = (power, threat, fear, reasonsId, reasonsEn) => ({
  power, threat, fear,
  reasons: Object.fromEntries(['power', 'threat', 'fear'].map((axis, i) => [axis, { id: reasonsId[i], en: reasonsEn[i] }])),
});
export const ASSESSMENTS = {
  garuda: entry('divine', 't4', 'f3',
    ['Sosok dewata dan wahana Wisnu; kuasa ilahinya menjadi dasar Divine.', 'Pertarungan melawan kaum naga ditafsirkan berpotensi berdampak regional, bukan bukti kehancuran dunia.', 'Penerbangan dan kekuatan dewata melampaui hukum alam; peran pelindung tidak berarti predator.'],
    ['A divine being and Vishnu’s mount; divine authority supports this tier.', 'Conflict with the nagas is interpreted as a regional potential, not evidence of world destruction.', 'Divine flight and strength exceed natural law; a protector is not necessarily a predator.']),
  kitsune: entry('superhuman', 't2', 'f3',
    ['Perubahan wujud dan kecerdasan gaib melampaui kemampuan manusia; versi rubah folklor umum yang dipakai.', 'Tipuan dan kemampuan gaib ditafsirkan mengancam kelompok kecil; tidak semua kitsune bermusuhan.', 'Perubahan wujud dan api gaib menjadi dasar sifat supernatural.'],
    ['Shapeshifting and supernatural intelligence exceed human abilities; this uses the general folklore fox.', 'Trickery and magic are interpreted as a small-group threat; not all kitsune are hostile.', 'Shapeshifting and supernatural fire support this fear category.']),
  jormungandr: entry('cosmic', 't6', 'f4',
    ['Tubuh yang melingkari Midgard menempatkan skalanya pada tataran dunia.', 'Perannya dalam Ragnarök menjadi dasar interpretasi ancaman global.', 'Akhir dunia yang tak terhindarkan menekankan hilangnya kendali manusia.'],
    ['A body encircling Midgard places its scale at the level of the world.', 'Its role in Ragnarök supports a global-threat interpretation.', 'An inescapable end of the world emphasizes humanity’s lack of control.']),
  barong: entry('divine', 't2', 'f3',
    ['Raja roh pelindung dan kuasa sakralnya menjadi dasar Divine.', 'Konflik dengan kekuatan Rangda dipakai sebagai potensi menghadapi kelompok; peran utamanya pelindung.', 'Pertarungan spiritual dan sihir berada di luar hukum alam; Fear bukan penilaian moral.'],
    ['Its role as a protective spirit king and sacred authority support Divine.', 'Conflict with Rangda’s forces suggests group-scale potential; its primary role is protective.', 'Spiritual combat and magic exceed natural law; Fear is not a moral judgment.']),
  pocong: entry('superhuman', 't1', 'f3', ['Sifat arwah dan kemampuan gaib melampaui manusia.', 'Kisah perjumpaan berpusat pada gangguan terhadap individu.', 'Arwah dalam kain kafan merupakan keberadaan supernatural.'], ['Its spirit nature and supernatural abilities exceed human limits.', 'Encounter stories center on haunting individuals.', 'A spirit within a burial shroud is a supernatural presence.']),
  kuntilanak: entry('superhuman', 't1', 'f3', ['Perubahan wujud, kutukan, dan sifat arwah menjadi dasar penilaian.', 'Perjumpaan yang dicatat berpusat pada korban individu.', 'Sosok arwah dan gangguan gaib melampaui hukum alam.'], ['Shapeshifting, curses, and its spirit nature support the assessment.', 'Recorded encounters center on individual victims.', 'Its spirit nature and hauntings exceed natural law.']),
  genderuwo: entry('monstrous', 't2', 'f3', ['Wujud raksasa dan kekuatan supernatural menjadi dasar Monstrous.', 'Ukuran dan kekuatannya ditafsirkan dapat mengancam kelompok.', 'Perubahan wujud dan sifat makhluk halus menjadi dasar Fear 3.'], ['Giant size and supernatural strength support Monstrous.', 'Its size and strength are interpreted as a group-scale threat.', 'Shapeshifting and its spirit nature support Fear 3.']),
  leak: entry('superhuman', 't1', 'f3', ['Sihir dan perubahan wujud melampaui kemampuan manusia biasa.', 'Kisah perburuan malam ditafsirkan pada skala individu.', 'Kepala terlepas dan transformasi gaib melanggar hukum alam.'], ['Sorcery and shapeshifting exceed ordinary human abilities.', 'Night-hunting stories are interpreted at an individual scale.', 'A detached head and magical transformations defy natural law.']),
  oni: entry('monstrous', 't2', 'f3', ['Ukuran raksasa dan kekuatan gada menjadi dasar kekuatan monster.', 'Kekuatan fisik besar berpotensi mengalahkan kelompok.', 'Kutukan dan sifat gaib memperluas kengerian melampaui predator biasa.'], ['Giant size and the force of its club support monstrous power.', 'Great physical strength can potentially overwhelm a group.', 'Curses and supernatural nature extend fear beyond an ordinary predator.']),
  minotaur: entry('monstrous', 't2', 'f2', ['Tubuh hibrida dan kekuatan besar menjadi dasar Monstrous.', 'Kisah korban dalam labirin menjadi dasar skala kelompok.', 'Kengerian utamanya adalah diburu dan dimangsa dalam labirin.'], ['Its hybrid body and great strength support Monstrous.', 'The victims within the labyrinth support a group-scale interpretation.', 'The primary horror is being hunted and devoured in a labyrinth.']),
  medusa: entry('monstrous', 't2', 'f3', ['Tatapan pembatu mampu melumpuhkan banyak lawan; fana tidak berarti berkekuatan manusia.', 'Ancaman ditafsirkan pada kelompok yang berada dalam jangkauan tatapannya.', 'Perubahan manusia menjadi batu melampaui hukum alam.'], ['A petrifying gaze can disable multiple opponents; mortality does not imply human-level power.', 'The threat is interpreted as a group within reach of her gaze.', 'Turning people to stone exceeds natural law.']),
  fenrir: entry('divine', 't6', 'f4', ['Kemampuan menghadapi dan memangsa Odin ditafsirkan setara kekuatan dewa.', 'Perannya dalam Ragnarök menjadi dasar ancaman global.', 'Takdir kehancuran dan rantai yang akhirnya putus menekankan kengerian eksistensial.'], ['The ability to confront and devour Odin is interpreted as godlike power.', 'Its role in Ragnarök supports global threat.', 'Doom and the eventual breaking of its bonds emphasize existential horror.']),
  banshee: entry('superhuman', null, 'f3', ['Firasat kematian merupakan kemampuan di luar batas manusia.', 'Pertanda kematian bukan bukti menyebabkan kematian; ancaman belum dinilai.', 'Ratapan yang meramalkan kematian menjadi dasar sifat supernatural.'], ['Foretelling death is beyond human limits.', 'Foretelling death is not evidence of causing it; threat remains unassessed.', 'A wail foretelling death supports the supernatural category.']),
  quetzalcoatl: entry('cosmic', null, 'f4', ['Peran pencipta dalam ringkasan tradisi menjadi dasar skala dunia.', 'Peran pencipta dan pelindung tidak membuktikan cakupan kehancuran; ancaman belum dinilai.', 'Kuasa penciptaan menempatkan kehidupan manusia di bawah kekuatan yang lebih besar.'], ['A creation role in the tradition summary supports world-scale power.', 'A creator and protector role does not establish destructive reach; threat remains unassessed.', 'Creation places human life under powers beyond human control.']),
  'baba-yaga': entry('superhuman', 't1', 'f3', ['Sihir, penerbangan, dan perubahan wujud melampaui manusia biasa.', 'Kisah perjumpaan berpusat pada individu dan ujian personal.', 'Pondok berkaki ayam dan sihir menjadi sumber kengerian supernatural.'], ['Magic, flight, and shapeshifting exceed ordinary humans.', 'Encounter stories center on individuals and personal trials.', 'A chicken-legged hut and sorcery create supernatural horror.']),
  'long-dragon': entry('regional', 't4', 'f3', ['Kuasa atas hujan dan sungai menunjukkan pengaruh pada wilayah luas.', 'Kendali cuaca dan air ditafsirkan berpotensi mengancam wilayah bila bermusuhan.', 'Penguasaan cuaca secara gaib menjadi dasar Fear 3.'], ['Authority over rain and rivers indicates influence over a broad region.', 'Weather and water control are interpreted as a regional potential if hostile.', 'Supernatural control of weather supports Fear 3.']),
  'wewe-gombel': entry('superhuman', 't1', 'f3', ['Sifat arwah dan kemampuan menghilang melampaui manusia.', 'Kisah penculikan anak ditafsirkan sebagai ancaman terhadap individu.', 'Kehadiran arwah gaib menjadi dasar Fear 3; motif pelindung tidak dihapus.'], ['Spirit nature and invisibility exceed human abilities.', 'Child-abduction stories are interpreted as individual threats.', 'A supernatural spirit supports Fear 3 without erasing its protective motives.']),
  banaspati: entry('superhuman', 't1', 'f3', ['Wujud api terbang merupakan kemampuan supernatural.', 'Ringkasan kisah menekankan bahaya membakar korban individu.', 'Api yang bergerak sebagai makhluk merupakan fenomena supernatural.'], ['A flying fire form is a supernatural ability.', 'The story summary emphasizes the danger of burning individual victims.', 'Fire moving as a living being is a supernatural phenomenon.']),
};

export function getAssessment(creature) {
  return Object.hasOwn(ASSESSMENTS, creature.slug) ? ASSESSMENTS[creature.slug] : { power: null, threat: null, fear: null, reasons: {} };
}
export function getLevel(axis, id) {
  return SCALES[axis]?.find(item => item.id === id);
}
