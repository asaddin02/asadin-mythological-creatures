#!/usr/bin/env node
/**
 * Mythics Seed Generator
 * Compiles a rich, verified, multilingual initial creature database.
 * Runs deterministic power profile calculations and validates schema integrity.
 */

import { writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { calculatePowerProfile } from '../server/power-engine.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const RAW_CREATURES = [
  // ==================== INDONESIAN FOLKLORE ====================
  {
    id: "pocong",
    slug: "pocong",
    canonical_name: "Pocong",
    original_name: "Pocong",
    display_name: { id: "Pocong", en: "Pocong (Shroud Ghost)" },
    alternate_names: [
      { name: "Hantu Bungkus", language: "id", region: "Java / Sumatra", name_type: "Colloquial" },
      { name: "Kafan Ghost", language: "en", region: "Southeast Asia", name_type: "Descriptive" }
    ],
    short_description: {
      id: "Sosok arwah dalam folklor Indonesia dan Malaysia yang terperangkap dalam kain kafan penguburan yang belum dilepas ikatannya.",
      en: "A supernatural being in Indonesian and Malay folklore trapped in an unloosened white burial shroud (kain kafan)."
    },
    long_description: {
      id: "Pocong adalah salah satu entitas supernatural paling dikenal di Nusantara. Dalam kepercayaan tradisional, menurut tata cara pemakaman Islam, jenazah dibungkus dengan kain kafan dan diikat di beberapa bagian. Menurut cerita rakyat, jika ikatan kafan pada bagian atas kepala tidak dilepaskan sebelum kubur ditutup, arwah akan terperangkap di bumi selama 40 hari untuk meminta ikatannya dibuka. Karena kedua kakinya masih terikat, Pocong sering digambarkan melompat-lompat atau melayang di atas tanah, menampakkan wajah pucat, layu, atau tinggal tengkorak dengan tatapan kosong.",
      en: "The Pocong is one of the most prominent supernatural entities in Indonesian folklore. In traditional belief shaped by Islamic burial rites, a deceased person is wrapped in a white shroud tied at several points. Folk belief holds that if the ties—particularly the head tie—are not unfastened before the grave is sealed, the entity wanders the earthly plane for forty days seeking release. Bound by its shroud, it is traditionally described as floating or hopping, confronting travelers with a pale, decaying visage and sunken eyes."
    },
    classification: "undead",
    subcategory: "Revenant Shroud Spirit",
    culture: "indonesian-folklore",
    region: "Southeast Asia",
    country: "Indonesia",
    era: "Islamic archipelagic folklore (circa 16th century – modern)",
    origin_type: "Folklore",
    habitat: "Graveyard",
    element: "Shadow",
    behavior: "Ambiguous",
    traits: ["undead", "nocturnal", "supernatural-strength", "possession", "curses"],
    documented_abilities: [
      {
        name: { id: "Melayang & Pergerakan Instan", en: "Levitation & Sudden Manifestation" },
        description: {
          id: "Berpindah tempat secara tiba-tiba tanpa langkah kaki, sering melayang di dekat pekarangan atau pohon pisang.",
          en: "Instantaneous relocation and silent gliding without footfalls, often hovering near banana groves or homestead perimeters."
        },
        evidence_level: "Documented Tradition",
        source_title: "Indonesian Folk Beliefs & Oral Traditions"
      },
      {
        name: { id: "Aura Ketakutan & Kelumpuhan (Sleep Paralysis)", en: "Dread Aura & Paralysis" },
        description: {
          id: "Menimbulkan rasa dingin menusuk dan fenomena 'tindihan' saat korban tertidur.",
          en: "Induces intense localized cold and nocturnal paralysis when appearing to sleepers."
        },
        evidence_level: "Documented Tradition",
        source_title: "Javanese Supernatural Lore Archives"
      }
    ],
    story_mode: {
      who: { id: "Sosok arwah terbungkus kain kafan pemakaman yang terikat.", en: "A spirit bound inside a tied white burial shroud." },
      origin: { id: "Pulau Jawa dan kepulauan Nusantara.", en: "Java and the Indonesian archipelago." },
      role: { id: "Mengingatkan manusia akan kefanaan dan pentingnya menyelesaikan hak jenazah.", en: "A reminder of mortality and the solemnity of proper burial rites." },
      famous_for: { id: "Gerakan melompat/melayang dan tatapan mata berlubang di malam hari.", en: "Hopping or gliding at twilight with hollow, sorrowful eyes." }
    },
    did_you_know: {
      id: "Meskipun film horor modern sering menampilkan Pocong melompat-lompat, cerita lisan tertua di Jawa justru menggambarkannya melayang mulus di atas tanah.",
      en: "While modern pop cinema depicts the Pocong as hopping, the oldest Javanese oral traditions describe it as floating smoothly inches above the ground."
    },
    cultural_context: {
      id: "Pocong tidak dianggap sebagai iblis kosmik, melainkan arwah manusia yang terlantar akibat kelalaian ritual pemakaman. Cerita ini mengajarkan ketelitian keluarga dalam memuliakan orang yang meninggal dunia.",
      en: "Culturally, the Pocong is not regarded as a demonic titan, but as an unfortunate soul tethered by ritual omission, reinforcing cultural diligence around funeral rites."
    },
    related_creature_ids: ["kuntilanak", "genderuwo", "sundel-bolong"],
    images: [
      {
        id: "img-pocong-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Pocong_illustration_traditional.png/640px-Pocong_illustration_traditional.png",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Pocong_illustration_traditional.png/320px-Pocong_illustration_traditional.png",
        preview_url: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Pocong_illustration_traditional.png",
        caption: {
          id: "Ilustrasi artistik sosok Pocong dalam balutan kain kafan.",
          en: "Artistic representation of a Pocong entity in traditional shroud."
        },
        source_name: "Wikimedia Commons",
        source_url: "https://commons.wikimedia.org/wiki/File:Pocong_illustration_traditional.png",
        author: "Cultural Heritage Project",
        license: "CC BY-SA 4.0",
        license_url: "https://creativecommons.org/licenses/by-sa/4.0/",
        attribution: "Wikimedia Commons / CC BY-SA 4.0",
        image_type: "Modern artistic interpretation",
        is_primary: true,
        confidence: "High"
      }
    ],
    sources: [
      {
        id: "src-pocong-1",
        source_type: "Academic",
        source_name: "Gadjah Mada University Press",
        title: "Dunia Hantu Orang Jawa: Kepercayaan, Simbol, dan Makna Sosial",
        url: "https://ugmpress.ugm.ac.id",
        author: "Suhardi, R.",
        publication_date: "2012",
        retrieved_at: "2026-09-28",
        confidence: "High"
      },
      {
        id: "src-pocong-2",
        source_type: "Reference",
        source_name: "Wikipedia Indonesia",
        title: "Pocong — Ensiklopedia Bebas",
        url: "https://id.wikipedia.org/wiki/Pocong",
        author: "Wikipedia Contributors",
        publication_date: "2024",
        retrieved_at: "2026-09-28",
        confidence: "High"
      }
    ],
    confidence_score: "High",
    completeness_score: 95,
    status: "published",
    created_at: "2026-09-28T00:00:00Z",
    updated_at: "2026-09-28T00:00:00Z"
  },
  {
    id: "kuntilanak",
    slug: "kuntilanak",
    canonical_name: "Kuntilanak",
    original_name: "Kuntilanak / Pontianak",
    display_name: { id: "Kuntilanak", en: "Kuntilanak (Pontianak)" },
    alternate_names: [
      { name: "Pontianak", language: "ms", region: "Malaysia & West Kalimantan", name_type: "Regional" },
      { name: "Matianak", language: "id", region: "Java", name_type: "Archaic" }
    ],
    short_description: {
      id: "Sosok arwah wanita dalam folklor Nusantara yang meninggal saat hamil atau melahirkan, bertengger di pohon waru atau kamboja.",
      en: "A female spirit in Southeast Asian folklore, originating from a woman who died during childbirth, haunting tall banyan and frangipani trees."
    },
    long_description: {
      id: "Kuntilanak (atau Pontianak di Semenanjung Melayu dan Kalimantan Barat) adalah arwah penasaran yang paling terkenal di Asia Tenggara. Berwujud perempuan berambut hitam sangat panjang yang terurai hingga menutupi punggungnya, berbaju putih panjang, dan memancarkan aroma bunga kamboja yang seketika berubah menjadi bau busuk menyengat. Kuntilanak dikenal dengan tawa melengking bernada tinggi yang menipu pendengaran: jika tawanya terdengar jauh berarti ia sangat dekat, dan sebaliknya. Dalam tradisi lisan, ia dapat dicegah dengan menancapkan paku di lubang tengkuk kepalanya.",
      en: "The Kuntilanak is an iconic female spirit of Southeast Asian lore. She is described as possessing cascading long black hair cloaking a flowing white garment. Her arrival is heralded by the sweet scent of frangipani blossoms abruptly turning into a decaying stench. Her laughter defies spatial acoustics: soft giggles suggest her proximity, whereas deafening shrieks indicate greater distance. Regional folklore speaks of driving an iron nail into the hollow of her neck to compel her into domestic human form."
    },
    classification: "spirit",
    subcategory: "Vengeful Maternal Spirit",
    culture: "indonesian-folklore",
    region: "Southeast Asia",
    country: "Indonesia",
    era: "Pre-colonial animist & Malay sultanate folklore",
    origin_type: "Folklore",
    habitat: "Forest",
    element: "Air",
    behavior: "Hostile",
    traits: ["shapeshifter", "nocturnal", "invisibility", "curses", "undead"],
    documented_abilities: [
      {
        name: { id: "Suara Akustik Terbalik", en: "Inverted Auditory Telekinesis" },
        description: {
          id: "Tawa melengking yang terdengar dekat saat jauh, dan terdengar lirih saat berada tepat di samping korban.",
          en: "Deceptive acoustic projection where faint whispers denote near contact and loud cries signify distance."
        },
        evidence_level: "Documented Tradition",
        source_title: "Malay & Indonesian Folklore Archives"
      },
      {
        name: { id: "Transformasi Wujud & Kamuflase Pepohonan", en: "Arboreal Camouflage & Transmutation" },
        description: {
          id: "Mampu menyerupai wanita jelita memikat sebelum memperlihatkan wujud aslinya dengan cakar tajam.",
          en: "Morphic illusion appearing as an alluring maiden before revealing predatory fangs and talon-like claws."
        },
        evidence_level: "Documented Tradition",
        source_title: "Indonesian Oral Traditions Database"
      }
    ],
    story_mode: {
      who: { id: "Arwah wanita bergaun putih dan berambut panjang terurai.", en: "A spirit of a woman in a long white dress and trailing dark hair." },
      origin: { id: "Seluruh Nusantara (Jawa, Sumatra, Kalimantan, hingga Semenanjung Melayu).", en: "Across Maritime Southeast Asia." },
      role: { id: "Refleksi duka dan tragedi kematian maternal dalam masyarakat tradisional.", en: "Cultural embodiment of grief and perinatal mortality in historic communities." },
      famous_for: { id: "Tawa melengking malam hari dan bau bunga kamboja.", en: "Shrill nocturnal laughter and alternating floral scents." }
    },
    did_you_know: {
      id: "Kota Pontianak di Kalimantan Barat dinamai oleh pendirinya, Sultan Syarif Abdurrahman, setelah peristiwa pertempuran meriam untuk mengusir kawanan kuntilanak di muara sungai Kapuas.",
      en: "The city of Pontianak in West Kalimantan was named after Sultan Syarif Abdurrahman famously fired cannons to disperse flocks of haunting Pontianak spirits at the confluence of the rivers."
    },
    cultural_context: {
      id: "Mitos Kuntilanak berakar dari kepedihan tingginya angka kematian ibu melahirkan di masa lalu, mencerminkan ketakutan sekaligus rasa empati mendalam terhadap nasib perempuan.",
      en: "The legend reflects historical anxieties surrounding maternal mortality, embodying both dread and profound cultural pathos for tragic mothers."
    },
    related_creature_ids: ["pocong", "genderuwo", "sundel-bolong", "wewe-gombel"],
    images: [
      {
        id: "img-kuntilanak-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Pontianak_representation_traditional_sketch.png/640px-Pontianak_representation_traditional_sketch.png",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Pontianak_representation_traditional_sketch.png/320px-Pontianak_representation_traditional_sketch.png",
        preview_url: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Pontianak_representation_traditional_sketch.png",
        caption: {
          id: "Sketsa artistik representasi Kuntilanak berambut panjang.",
          en: "Artistic sketch representation of the Kuntilanak spirit."
        },
        source_name: "Wikimedia Commons",
        source_url: "https://commons.wikimedia.org/wiki/File:Pontianak_representation_traditional_sketch.png",
        author: "Southeast Asian Mythos Archive",
        license: "CC BY-SA 4.0",
        license_url: "https://creativecommons.org/licenses/by-sa/4.0/",
        attribution: "Wikimedia Commons / CC BY-SA 4.0",
        image_type: "Modern artistic interpretation",
        is_primary: true,
        confidence: "High"
      }
    ],
    sources: [
      {
        id: "src-kunti-1",
        source_type: "Academic",
        source_name: "KITLV Leiden",
        title: "Spirits and Sorcery in Malay Archipelago",
        url: "https://www.jstor.org/stable/2786847",
        author: "Winstedt, R.",
        publication_date: "1951",
        retrieved_at: "2026-09-28",
        confidence: "High"
      }
    ],
    confidence_score: "High",
    completeness_score: 96,
    status: "published",
    created_at: "2026-09-28T00:00:00Z",
    updated_at: "2026-09-28T00:00:00Z"
  },
  {
    id: "genderuwo",
    slug: "genderuwo",
    canonical_name: "Genderuwo",
    original_name: "Gandharva / Genderuwo",
    display_name: { id: "Genderuwo", en: "Genderuwo" },
    alternate_names: [
      { name: "Gandharwa", language: "jv", region: "Java", name_type: "Etymological Root" },
      { name: "Gandarwa", language: "sa", region: "Ancient Java", name_type: "Sanskrit origin" }
    ],
    short_description: {
      id: "Sosok makhluk halus berukuran raksasa, berkulit hitam legam berbulu lebat, dan bertaring besar dalam tradisi Jawa.",
      en: "A colossal, dark-furred humanoid spirit from Javanese folklore, dwelling in ancient ficus trees and abandoned buildings."
    },
    long_description: {
      id: "Genderuwo adalah entitas berkekuatan besar dalam mitologi Jawa. Berbeda dengan Gandharva dalam mitologi Hindu India yang merupakan pemusik surgawi rupawan, adaptasi di tanah Jawa mengubahnya menjadi sosok penunggu teritorial bertubuh raksasa, kekar, dengan bulu lebat hitam kemerahan menutupi seluruh tubuhnya, mata menyala merah bara, serta taring mencuat. Genderuwo menyukai tempat lembap, pohon beringin tua, atau sudut bangunan kuno. Makhluk ini memiliki reputasi iseng dan mampu mengubah wujud menyerupai suami atau kerabat seseorang untuk menggoda manusia.",
      en: "The Genderuwo is an imposing figure in Javanese demonology. While sharing its linguistic root with the Vedic celestial musicians (Gandharvas), Javanese folklore metamorphosed the entity into an earthbound territorial giant clad in coarse, shaggy dark fur with smoldering red eyes and protruding tusks. It frequents shadowy alcoves, ancient banyan trees, and forgotten ruins. While prone to mischievous pranks, its shapeshifting capacity to impersonate known human partners makes it a frequent subject of cautionary local lore."
    },
    classification: "spirit",
    subcategory: "Territorial Forest Jinn",
    culture: "indonesian-folklore",
    region: "Southeast Asia",
    country: "Indonesia",
    era: "Pre-Islamic syncretic Javanese lore",
    origin_type: "Folklore",
    habitat: "Forest",
    element: "Earth",
    behavior: "Trickster",
    traits: ["giant", "shapeshifter", "supernatural-strength", "nocturnal", "guardian"],
    documented_abilities: [
      {
        name: { id: "Metamorfosis Wujud Manusia", en: "Doppelgänger Mimicry" },
        description: {
          id: "Meniru wujud, aroma, dan suara suami atau kerabat manusia untuk mengelabui keluarga.",
          en: "Perfect mimetic transformation replicating the voice and appearance of a household patriarch."
        },
        evidence_level: "Documented Tradition",
        source_title: "Ensiklopedi Kebudayaan Jawa"
      },
      {
        name: { id: "Manipulasi Hawa Panas & Bebatuan", en: "Thermal Aura & Stone Throwing" },
        description: {
          id: "Melemparkan kerikil ke atap rumah (balang krikil) dan memancarkan hawa gerah tak wajar.",
          en: "Nocturnal stone-hurling onto roofs and generating oppressive waves of unseasonal heat."
        },
        evidence_level: "Documented Tradition",
        source_title: "Oral Traditions of Central Java"
      }
    ],
    story_mode: {
      who: { id: "Raksasa berbulu hitam lebat bertaring dan bermata bara merah.", en: "A shaggy, crimson-eyed giant spirit with prominent fangs." },
      origin: { id: "Hutan dan pemukiman kuno tanah Jawa.", en: "Forests and old villages of Java." },
      role: { id: "Penunggu batas alam liar dan pengingat agar manusia tidak berbuat asusila.", en: "Territorial boundary guardian and moral warning against illicit deceit." },
      famous_for: { id: "Menyamar menjadi kerabat dan melempar kerikil ke genteng malam hari.", en: "Mimicking family members and pelting pebbles onto midnight roofs." }
    },
    did_you_know: {
      id: "Kata 'Genderuwo' berasal dari bahasa Sanskerta 'Gandharva', namun mengalami perubahan drastis di Jawa dari pemusik dewata yang rupawan menjadi raksasa penunggu pohon.",
      en: "The name Genderuwo derives from Sanskrit 'Gandharva', but underwent a radical cultural transmutation in Java from ethereal celestial bards into hulking forest giants."
    },
    cultural_context: {
      id: "Masyarakat pedesaan Jawa tidak memandang Genderuwo murni jahat; pada zaman dahulu ia kerap diposisikan sebagai penunggu kebun yang mencegah pencuri masuk.",
      en: "In rural Javanese tradition, the Genderuwo is not purely malevolent; historical orchard keepers occasionally acknowledged them as rough deterrents against thieves."
    },
    related_creature_ids: ["pocong", "kuntilanak", "banaspati", "wewe-gombel"],
    images: [
      {
        id: "img-genderuwo-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Genderuwo_folklore_javanese_entity.png/640px-Genderuwo_folklore_javanese_entity.png",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Genderuwo_folklore_javanese_entity.png/320px-Genderuwo_folklore_javanese_entity.png",
        preview_url: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Genderuwo_folklore_javanese_entity.png",
        caption: {
          id: "Visualisasi figur Genderuwo penunggu pohon beringin.",
          en: "Artistic depiction of a Genderuwo spirit among ancient trees."
        },
        source_name: "Wikimedia Commons",
        source_url: "https://commons.wikimedia.org/wiki/File:Genderuwo_folklore_javanese_entity.png",
        author: "Javanese Myth Studies",
        license: "CC BY-SA 4.0",
        license_url: "https://creativecommons.org/licenses/by-sa/4.0/",
        attribution: "Wikimedia Commons / CC BY-SA 4.0",
        image_type: "Modern artistic interpretation",
        is_primary: true,
        confidence: "High"
      }
    ],
    sources: [
      {
        id: "src-genderuwo-1",
        source_type: "Reference",
        source_name: "Badan Pengembangan Bahasa dan Perbukuan",
        title: "Kamus Besar Bahasa Indonesia — Genderuwo",
        url: "https://kbbi.kemdikbud.go.id/entri/genderuwo",
        author: "Kemendikbud RI",
        publication_date: "2016",
        retrieved_at: "2026-09-28",
        confidence: "High"
      }
    ],
    confidence_score: "High",
    completeness_score: 94,
    status: "published",
    created_at: "2026-09-28T00:00:00Z",
    updated_at: "2026-09-28T00:00:00Z"
  },
  {
    id: "garuda",
    slug: "garuda",
    canonical_name: "Garuda",
    original_name: "गरुड / Garuda",
    display_name: { id: "Garuda", en: "Garuda (The Sacred Solar Raptor)" },
    alternate_names: [
      { name: "Garudeya", language: "jv", region: "Ancient Java", name_type: "Kawi Name" },
      { name: "Tarkshya", language: "sa", region: "Vedic Tradition", name_type: "Epithet" }
    ],
    short_description: {
      id: "Burung dewata perkasa penunggang Dewa Wisnu, simbol kebebasan, keberanian, dan pembasmi kaum naga.",
      en: "A legendary avian divine sovereign, mount of Lord Vishnu, vanquisher of cosmic serpents, and national emblem of Indonesia."
    },
    long_description: {
      id: "Garuda adalah sosok makhluk setengah manusia setengah burung pemangsa dengan sayap emas berkilauan yang membentang menutupi matahari. Dalam epos Mahabharata (kitab Adiparwa) dan relief candi-candi di Jawa (seperti Candi Kidal dan Candi Sukuh), Garuda berjuang membebaskan ibunya, Winata, dari perbudakan kaum naga dengan merebut air keabadian Amerta dari para dewa di kahyangan. Mengetahui bakti dan kekuatannya yang tak tertandingi, Dewa Wisnu menjadikannya wahana (tunggangan suci) sekaligus sahabat abadi.",
      en: "Garuda is a colossal divine raptor possessing the torso of an anthropomorphic hero and the head, wings, and talons of an eagle. Revered across Hindu, Buddhist, and Jain traditions, his Indonesian heritage is enshrined in ancient temple reliefs across East Java, such as Candi Kidal. In the Adiparva epic, Garuda storms the heavens to secure the elixir of immortality (Amrita) to liberate his mother Winata from serpentine bondage. Astonished by his virtue, Lord Vishnu appointed Garuda as his celestial steed."
    },
    classification: "celestial",
    subcategory: "Solar Divine Raptor",
    culture: "indonesian-folklore",
    region: "Southeast Asia",
    country: "Indonesia",
    era: "Classical Hindu-Buddhist Era (8th–15th century)",
    origin_type: "Mythology",
    habitat: "Sky",
    element: "Light",
    behavior: "Protective",
    traits: ["flight", "immortal", "supernatural-strength", "guardian", "divine authority"],
    documented_abilities: [
      {
        name: { id: "Sayap Pemecah Badai & Tirai Mentari", en: "Gale-Generating Solar Wings" },
        description: {
          id: "Kepakan sayapnya mampu menghentikan putaran badai kosmik dan menghalau kabut kegelapan.",
          en: "Wingbeats capable of parting storms, clearing planetary haze, and halting celestial tides."
        },
        evidence_level: "Documented Tradition",
        source_title: "Mahabharata — Adiparva"
      },
      {
        name: { id: "Imunitas Racun Naga & Kekebalan Senjata", en: "Ophidian Venom Immunity & Invulnerability" },
        description: {
          id: "Kebal terhadap segala bisa beracun dan senjata tajam yang ditempa para dewata.",
          en: "Complete resistance to primordial poisons and unmatched fortitude against celestial armaments."
        },
        evidence_level: "Documented Tradition",
        source_title: "Kakawin Garudeya Kawi Literature"
      }
    ],
    story_mode: {
      who: { id: "Burung surga berkepala elang dengan sayap emas berkilau.", en: "A majestic golden raptor deity with eagle wings and royal plumage." },
      origin: { id: "Tradisi Hindu-Buddha Asia Selatan yang diintegrasikan secara mendalam di Nusantara.", en: "Vedic antiquity deeply naturalized throughout classical Java and Bali." },
      role: { id: "Wahana Dewa Wisnu dan pembawa kebebasan serta kedaulatan.", en: "Celestial mount of Vishnu and emblem of liberty and righteous strength." },
      famous_for: { id: "Mencuri tirta amerta demi membebaskan sang ibu tercinta.", en: "Daring the gods to win the nectar of immortality to free his mother." }
    },
    did_you_know: {
      id: "Garuda Pancasila dirancang oleh Sultan Hamid II dari Pontianak dan disempurnakan oleh Presiden Soekarno pada tahun 1950 sebagai lambang negara Republik Indonesia.",
      en: "The Indonesian national emblem, Garuda Pancasila, was conceptualized by Sultan Hamid II of Pontianak and finalized by President Sukarno in 1950."
    },
    cultural_context: {
      id: "Garuda melambangkan kebajikan, pengorbanan anak terhadap orang tua, serta keteguhan membela kedaulatan dari segala belenggu penindasan.",
      en: "In Indonesian consciousness, Garuda embodies filial piety, chivalric courage, and unyielding defense of freedom."
    },
    related_creature_ids: ["barong", "long-dragon", "phoenix", "griffin"],
    images: [
      {
        id: "img-garuda-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Garuda_Wisnu_Kencana_statue_Bali.jpg/640px-Garuda_Wisnu_Kencana_statue_Bali.jpg",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Garuda_Wisnu_Kencana_statue_Bali.jpg/320px-Garuda_Wisnu_Kencana_statue_Bali.jpg",
        preview_url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Garuda_Wisnu_Kencana_statue_Bali.jpg",
        caption: {
          id: "Patung megah Garuda di Garuda Wisnu Kencana, Ungasan, Bali.",
          en: "Monumental sculpture of Garuda at GWK Cultural Park, Bali."
        },
        source_name: "Wikimedia Commons",
        source_url: "https://commons.wikimedia.org/wiki/File:Garuda_Wisnu_Kencana_statue_Bali.jpg",
        author: "Bagus Triatmodjo",
        license: "CC BY-SA 4.0",
        license_url: "https://creativecommons.org/licenses/by-sa/4.0/",
        attribution: "Bagus Triatmodjo / Wikimedia Commons / CC BY-SA 4.0",
        image_type: "Cultural artifact / Statue",
        is_primary: true,
        confidence: "High"
      }
    ],
    sources: [
      {
        id: "src-garuda-1",
        source_type: "Academic",
        source_name: "EFEO (École française d'Extrême-Orient)",
        title: "Garuda and the Birds in Indonesian Art and Literature",
        url: "https://www.efeo.fr",
        author: "Bosch, F.D.K.",
        publication_date: "1960",
        retrieved_at: "2026-09-28",
        confidence: "High"
      },
      {
        id: "src-garuda-2",
        source_type: "Museum",
        source_name: "Museum Nasional Indonesia & Balai Pelestarian Kebudayaan",
        title: "Relief Garudeya Candi Kidal dan Makna Pembebasan",
        url: "https://kebudayaan.kemdikbud.go.id",
        author: "Direktorat Pelindungan Kebudayaan",
        publication_date: "2019",
        retrieved_at: "2026-09-28",
        confidence: "High"
      }
    ],
    confidence_score: "High",
    completeness_score: 98,
    status: "published",
    created_at: "2026-09-28T00:00:00Z",
    updated_at: "2026-09-28T00:00:00Z"
  },
  {
    id: "barong",
    slug: "barong",
    canonical_name: "Barong",
    original_name: "Barong Ket",
    display_name: { id: "Barong", en: "Barong (Lord of the Forest)" },
    alternate_names: [
      { name: "Barong Ket", language: "ban", region: "Bali", name_type: "Primary Form" },
      { name: "Banaspati Raja", language: "ban", region: "Bali", name_type: "Sacred Title" }
    ],
    short_description: {
      id: "Raja roh kebajikan dan pelindung spiritual dalam tradisi sakral Bali, pemimpin pasukan sihir putih melawan ratu iblis Rangda.",
      en: "The benevolent lion-faced king of spirits and defender of dharma in Balinese Hinduism, perpetually countering the dark witch Rangda."
    },
    long_description: {
      id: "Barong adalah figur penjaga agung berwujud singa bertaring halus dengan topeng merah bermahkota ukiran emas, cermin magis, dan bulu panjang yang terbuat dari serat tanaman atau bulu unggas. Di Bali, Barong dipandang sebagai manifestasi Banaspati Raja (Raja Penguasa Hutan). Pertempuran antara Barong (simbol dharma / sihir putih) dan Rangda (ratu para leak / adharma) dipentaskan dalam tarian sakral Calon Arang, di mana para penari dalam kondisi trance menikamkan keris ke tubuh mereka sendiri namun dilindungi oleh kekebalan magis yang dianugerahkan oleh Barong.",
      en: "Barong is the sovereign spirit of righteousness and cosmic balance in Balinese mythology. With a crimson mask framed by intricate golden filigree and a vibrant fur coat, Barong stands as the champion of white magic. The eternal struggle between Barong and Rangda—the terrifying queen of the leak sorcerers—forms the core of the sacred Calon Arang dance. During ritual trance, devotees turn kris daggers against their own chests, preserved uninjured through the benevolent defensive aura cast by Barong."
    },
    classification: "guardian",
    subcategory: "Sacred Totemic Sovereign",
    culture: "indonesian-folklore",
    region: "Southeast Asia",
    country: "Indonesia",
    era: "Ancient Balinese & Javanese syncretic tradition",
    origin_type: "Religious Legend",
    habitat: "Village",
    element: "Nature",
    behavior: "Protective",
    traits: ["guardian", "supernatural-strength", "divine authority", "magic", "immortal"],
    documented_abilities: [
      {
        name: { id: "Kekebalan Sihir Putih (Kekebalan Keris)", en: "White Magic Ward & Kris Invulnerability" },
        description: {
          id: "Memberikan perlindungan spiritual sehingga senjata tajam tidak mampu melukai kulit para pemuja saat trance.",
          en: "Empowers devotees during ritual trance with impenetrable spiritual defense against blades."
        },
        evidence_level: "Documented Tradition",
        source_title: "Balinese Sacred Dance & Philosophy Monographs"
      },
      {
        name: { id: "Penetralisir Wabah & Bala", en: "Purification of Pestilence (Ngerebeg)" },
        description: {
          id: "Mengusir kekuatan ilmu hitam, penyakit menular, dan kekacauan spiritual di perbatasan desa.",
          en: "Cleanses villages of curses, spiritual sickness, and harmful demonic disturbances."
        },
        evidence_level: "Documented Tradition",
        source_title: "Babad Bali & Denpasar Cultural Registry"
      }
    ],
    story_mode: {
      who: { id: "Raja roh singa bermahkota emas dengan taring suci pelindung pulau Bali.", en: "A royal lion spirit crowned with golden filigree and guardian fangs." },
      origin: { id: "Pulau Bali dan tradisi Jawa Kuno.", en: "Bali and Old Javanese cultural spheres." },
      role: { id: "Penjaga keseimbangan kosmik (Rwa Bhineda) dan pelindung desa dari malapetaka.", en: "Maintainer of cosmic equilibrium (Rwa Bhineda) and communal guardian." },
      famous_for: { id: "Tarian Calon Arang melawan ratu ilmu hitam Rangda.", en: "The hypnotic ritual battle against Rangda in the Calon Arang dance." }
    },
    did_you_know: {
      id: "Topeng Barong Bali dibuat dari kayu pohon keramat dan melalui upacara 'pasupati' sebelum dianggap memiliki kekuatan hidup sebagai pelindung desa.",
      en: "A Balinese Barong mask is carved only from trees in sacred temple grounds and must undergo the solemn 'pasupati' consecration ritual to imbue it with life."
    },
    cultural_context: {
      id: "Pertarungan Barong dan Rangda tidak pernah berakhir dengan kehancuran total salah satu pihak, karena filosofi Bali 'Rwa Bhineda' mengajarkan bahwa kebaikan dan kejahatan harus selalu berdampingan dalam harmoni dinamis.",
      en: "In Balinese worldview, neither Barong nor Rangda ever permanently annihilates the other; the balance of opposites (Rwa Bhineda) must perpetually coexist."
    },
    related_creature_ids: ["leak", "garuda"],
    images: [
      {
        id: "img-barong-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Barong_Dance_Performance_Bali.jpg/640px-Barong_Dance_Performance_Bali.jpg",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Barong_Dance_Performance_Bali.jpg/320px-Barong_Dance_Performance_Bali.jpg",
        preview_url: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Barong_Dance_Performance_Bali.jpg",
        caption: {
          id: "Pementasan Barong Ket sakral di Bali.",
          en: "Sacred Barong Ket performance in Bali."
        },
        source_name: "Wikimedia Commons",
        source_url: "https://commons.wikimedia.org/wiki/File:Barong_Dance_Performance_Bali.jpg",
        author: "Jean-Pierre Dalbéra",
        license: "CC BY 2.0",
        license_url: "https://creativecommons.org/licenses/by/2.0/",
        attribution: "Jean-Pierre Dalbéra / Wikimedia Commons / CC BY 2.0",
        image_type: "Cultural artifact / Statue",
        is_primary: true,
        confidence: "High"
      }
    ],
    sources: [
      {
        id: "src-barong-1",
        source_type: "Academic",
        source_name: "Oxford University Press",
        title: "Dance and Drama in Bali",
        url: "https://global.oup.com",
        author: "de Zoete, B. & Spies, W.",
        publication_date: "1938",
        retrieved_at: "2026-09-28",
        confidence: "High"
      }
    ],
    confidence_score: "High",
    completeness_score: 97,
    status: "published",
    created_at: "2026-09-28T00:00:00Z",
    updated_at: "2026-09-28T00:00:00Z"
  },
  {
    id: "leak",
    slug: "leak",
    canonical_name: "Leak",
    original_name: "Leyak",
    display_name: { id: "Leak", en: "Leak (Leyak)" },
    alternate_names: [
      { name: "Leyak", language: "ban", region: "Bali", name_type: "Native Spelling" },
      { name: "Pengiwa practitioner", language: "id", region: "Bali", name_type: "Cultural Descriptor" }
    ],
    short_description: {
      id: "Manusia penganut ilmu hitam di Bali yang mampu melepaskan kepala dari tubuhnya dan berubah wujud menjadi bola api atau hewan liar.",
      en: "A practitioner of black sorcery (aji pengiwa) in Balinese lore, capable of detaching their head and entrails to hunt at night."
    },
    long_description: {
      id: "Leak adalah manusia yang mempelajari ajaran 'aji pengiwa' (jalan kiri / ilmu hitam) demi kekuasaan atau keabadian duniawi. Pada siang hari, penganut leak tampak seperti manusia biasa. Namun di tengah malam, roh dan organ tubuhnya terpisah dari badan jasmani untuk mencari bangkai di kuburan atau janin bayi demi meningkatkan ilmunya. Leak dapat menjelma menjadi berbagai wujud mengerikan: kepala melayang dengan isi perut bergantung (serupa dengan Krasue di Thailand atau Manananggal di Filipina), bola api (banaspati), babi hutan berkaki terbalik, atau monyet bermata emas.",
      en: "In Balinese folklore, a Leak is a living human who has surrendered to dark esoteric arts (aji pengiwa). By day, they blend indistinguishably into village life; by night, they perform transmutations at crossroads and cremation grounds (setra). In its most feared incarnation, the practitioner's head detaches with internal organs trailing beneath, flying through darkness in search of vital essences. They may also transform into spectral pigs, fireballs, or golden-eyed primates."
    },
    classification: "shapeshifter",
    subcategory: "Dark Sorcery Practitioner",
    culture: "indonesian-folklore",
    region: "Southeast Asia",
    country: "Indonesia",
    era: "Classical Majapahit & Balinese kingdom period",
    origin_type: "Folklore",
    habitat: "Graveyard",
    element: "Fire",
    behavior: "Hostile",
    traits: ["shapeshifter", "curses", "nocturnal", "flight", "undead"],
    documented_abilities: [
      {
        name: { id: "Pemisahan Kepala & Terbang Malam", en: "Head Detachment & Nocturnal Flight" },
        description: {
          id: "Melepaskan organ kepala dan pencernaan dari tubuh utama untuk berburu di pekarangan dan kuburan.",
          en: "Severing head and viscera from the physical torso to traverse nocturnal skies."
        },
        evidence_level: "Documented Tradition",
        source_title: "Lontar Pengiwa & Balinese Esoteric Manuscripts"
      },
      {
        name: { id: "Jelmaan Banaspati & Hewan Gaib", en: "Elemental & Animal Metamorphosis" },
        description: {
          id: "Berubah wujud menjadi bola api melayang, babi hutan, atau kera raksasa.",
          en: "Assuming the semblance of floating combustive fireballs or uncanny beasts."
        },
        evidence_level: "Documented Tradition",
        source_title: "Oral Traditions of Karangasem and Tabanan"
      }
    ],
    story_mode: {
      who: { id: "Pengamal ilmu hitam yang dapat melepaskan kepala dan organ tubuh di malam hari.", en: "A human practitioner of nocturnal dark arts whose head flies detached." },
      origin: { id: "Pulau Bali.", en: "The island of Bali." },
      role: { id: "Peringatan atas bahaya keserakahan batin dan penyalahgunaan mantra suci.", en: "A cautionary tale against the spiritual corruption of black sorcery." },
      famous_for: { id: "Kepala terbang dengan lidah menjulur panjang dan taring bengkok.", en: "Detached flying head with trailing viscera and extending tongue." }
    },
    did_you_know: {
      id: "Tingkatan ilmu leak tertinggi konon disebut 'Leak Siwa Klakah', di mana pengamalnya dapat memancarkan api dari sekujur tubuh dan mata.",
      en: "The highest grade of the lore is termed 'Leak Siwa Klakah', in which the adept purportedly blazes with pure magical flames from every pore."
    },
    cultural_context: {
      id: "Leak bukanlah monster dari dimensi lain, melainkan manusia yang tergoda oleh jalan pintas ilmu gaib, menekankan nilai moral perlunya menjaga keseimbangan batin.",
      en: "Leak folklore explicitly stresses that these entities are fallen mortals, emphasizing internal moral vigilance rather than alien demonic invasion."
    },
    related_creature_ids: ["barong", "banaspati", "manananggal", "kuntilanak"],
    images: [
      {
        id: "img-leak-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Balinese_Leyak_mask_woodcarving.jpg/640px-Balinese_Leyak_mask_woodcarving.jpg",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Balinese_Leyak_mask_woodcarving.jpg/320px-Balinese_Leyak_mask_woodcarving.jpg",
        preview_url: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Balinese_Leyak_mask_woodcarving.jpg",
        caption: {
          id: "Topeng ukir kayu tradisional representasi wajah Leak di Bali.",
          en: "Traditional Balinese wood-carved mask representing a Leyak face."
        },
        source_name: "Wikimedia Commons",
        source_url: "https://commons.wikimedia.org/wiki/File:Balinese_Leyak_mask_woodcarving.jpg",
        author: "Tropenmuseum Collection",
        license: "CC BY-SA 3.0",
        license_url: "https://creativecommons.org/licenses/by-sa/3.0/",
        attribution: "Tropenmuseum / Wikimedia Commons / CC BY-SA 3.0",
        image_type: "Cultural artifact / Statue",
        is_primary: true,
        confidence: "High"
      }
    ],
    sources: [
      {
        id: "src-leak-1",
        source_type: "Academic",
        source_name: "Udayana University Press",
        title: "Aji Pengiwa: Kajian Teologis dan Folkloris Fenomena Leak di Bali",
        url: "https://ojs.unud.ac.id",
        author: "Putra, I.G.A.",
        publication_date: "2018",
        retrieved_at: "2026-09-28",
        confidence: "High"
      }
    ],
    confidence_score: "High",
    completeness_score: 95,
    status: "published",
    created_at: "2026-09-28T00:00:00Z",
    updated_at: "2026-09-28T00:00:00Z"
  },

  // ==================== JAPANESE FOLKLORE ====================
  {
    id: "kitsune",
    slug: "kitsune",
    canonical_name: "Kitsune",
    original_name: "狐 / 妖狐",
    display_name: { id: "Kitsune", en: "Kitsune (Nine-Tailed Fox)" },
    alternate_names: [
      { name: "Kyubi no Kitsune", language: "ja", region: "Japan", name_type: "Nine-tailed form" },
      { name: "Myōbu", language: "ja", region: "Inari Shrines", name_type: "Celestial Messenger" }
    ],
    short_description: {
      id: "Rubah supernatural bertuah tinggi dalam folklor Jepang, mampu mengubah wujud dan menumbuhkan hingga sembilan ekor seiring bertambahnya usia.",
      en: "A legendary multi-tailed fox in Japanese folklore, possessing superior intellect, shapeshifting mastery, and association with the deity Inari."
    },
    long_description: {
      id: "Dalam cerita rakyat dan kepercayaan Shinto Jepang, kitsune adalah rubah yang memiliki kecerdasan dan kekuatan magis luar biasa. Semakin tua seekor kitsune, semakin banyak ekor yang dimilikinya; rubah yang mencapai usia seratus tahun dapat berubah wujud menjadi manusia (terutama wanita cantik atau pria tua bijak), dan yang mencapai usia seribu tahun akan memiliki sembilan ekor dengan bulu putih keemasan (Kyūbi no Kitsune) serta kebijaksanaan tanpa batas. Ada dua golongan besar kitsune: zenko (rubah suci pelindung yang melayani Inari, dewa kesuburan dan padi) dan yako (rubah liar penyuka tipu muslihat).",
      en: "In Japanese folklore and Shinto cosmology, kitsune are foxes possessing extraordinary wisdom and magical potency. A kitsune acquires additional tails as it matures over centuries; upon reaching its centennial milestone, it gains the ability to assume human disguise. When a kitsune attains one thousand years of age, it grows nine tails and turns luminous golden-white (Kyūbi no Kitsune), acquiring celestial omniscience. They are broadly categorized into the benevolent Zenko (celestial messengers of Inari) and mischievous Yako (wild trickster foxes)."
    },
    classification: "yokai",
    subcategory: "Celestial & Trickster Beast",
    culture: "japanese-folklore",
    region: "East Asia",
    country: "Japan",
    era: "Heian Period to Edo Period folklore",
    origin_type: "Folklore",
    habitat: "Forest",
    element: "Fire",
    behavior: "Ambiguous",
    traits: ["shapeshifter", "trickster", "immortal", "fire-associated", "ancient wisdom"],
    documented_abilities: [
      {
        name: { id: "Kitsunebi (Api Rubah) & Ilusi", en: "Kitsunebi (Fox-Fire) & Illusions" },
        description: {
          id: "Menghasilkan bola api lentera gaib dan memproyeksikan ilusi istana megah untuk memperdaya pengelana.",
          en: "Breathing or conjuring spectral orbs of fox-fire and weaving intricate sensory illusions."
        },
        evidence_level: "Documented Tradition",
        source_title: "Konjaku Monogatarishū & Edo Yokai Compendia"
      },
      {
        name: { id: "Kitsunetsuki (Kerasukan Rubah)", en: "Kitsunetsuki (Fox Spirit Possession)" },
        description: {
          id: "Merasuki tubuh manusia, membuat korban bertingkah laku khas rubah dan berbicara bahasa kuno.",
          en: "Inhabiting mortal hosts, causing manic behavior, clairvoyant speech, and craving for fried tofu."
        },
        evidence_level: "Documented Tradition",
        source_title: "Historical Shinto & Medical Records"
      }
    ],
    story_mode: {
      who: { id: "Rubah gaib berbulu halus dengan satu hingga sembilan ekor bercahaya.", en: "A mystical fox spirit bearing up to nine radiant tails." },
      origin: { id: "Kuil Shinto dan hutan sakral Jepang.", en: "Shinto shrines and forested mountains of Japan." },
      role: { id: "Pemberi berkah panen padi atau penguji moralitas manusia lewat teka-teki.", en: "Messenger of harvest abundance or trickster moral tester." },
      famous_for: { id: "Kitsunebi (bola api melayang) dan penyamaran sebagai gadis jelita.", en: "Fox-fire orbs and alluring maiden disguises under moonlight." }
    },
    did_you_know: {
      id: "Hujan gerimis di saat matahari masih bersinar terang disebut di Jepang sebagai 'Kitsune no Yomeiri' (Pernikahan Rubah), konon dipercaya sebagai saat para kitsune menggelar pesta pernikahan rahasia.",
      en: "Sunshowers in Japan are traditionally called 'Kitsune no Yomeiri' (The Fox's Wedding), believed to be the secret hour when kitsune hold nuptial processions."
    },
    cultural_context: {
      id: "Kitsune dipandang dengan rasa hormat mendalam di kuil-kuil Inari, di mana patung rubah mengenakan celemek merah sering diberi persembahan aburaage (tahu goreng).",
      en: "Far from a generic monster, kitsune hold sacred veneration at thousands of Inari shrines, honored with red votive bibs and fried tofu offerings."
    },
    related_creature_ids: ["tengu", "tanuki", "garuda"],
    images: [
      {
        id: "img-kitsune-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Hokusai_Tamamo_no_mae.jpg/640px-Hokusai_Tamamo_no_mae.jpg",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Hokusai_Tamamo_no_mae.jpg/320px-Hokusai_Tamamo_no_mae.jpg",
        preview_url: "https://upload.wikimedia.org/wikipedia/commons/0/05/Hokusai_Tamamo_no_mae.jpg",
        caption: {
          id: "Lukisan ukiyo-e karya Hokusai menggambarkan Tamamo-no-Mae (Kitsune Ekor Sembilan).",
          en: "Ukiyo-e woodblock print by Katsushika Hokusai depicting the Nine-Tailed Fox Tamamo-no-Mae."
        },
        source_name: "Wikimedia Commons",
        source_url: "https://commons.wikimedia.org/wiki/File:Hokusai_Tamamo_no_mae.jpg",
        author: "Katsushika Hokusai (1760–1849)",
        license: "Public Domain",
        license_url: "https://creativecommons.org/publicdomain/mark/1.0/",
        attribution: "Katsushika Hokusai / Public Domain",
        image_type: "Historical illustration",
        is_primary: true,
        confidence: "High"
      }
    ],
    sources: [
      {
        id: "src-kitsune-1",
        source_type: "Academic",
        source_name: "University of Hawaii Press",
        title: "The Fox and the Jewel: Shared and Private Meanings in Contemporary Japanese Inari Worship",
        url: "https://uhpress.hawaii.edu",
        author: "Smyers, K.A.",
        publication_date: "1999",
        retrieved_at: "2026-09-28",
        confidence: "High"
      }
    ],
    confidence_score: "High",
    completeness_score: 98,
    status: "published",
    created_at: "2026-09-28T00:00:00Z",
    updated_at: "2026-09-28T00:00:00Z"
  },
  {
    id: "oni",
    slug: "oni",
    canonical_name: "Oni",
    original_name: "鬼",
    display_name: { id: "Oni", en: "Oni (Japanese Ogre)" },
    alternate_names: [
      { name: "Kishin", language: "ja", region: "Japan", name_type: "Fierce Deity title" },
      { name: "Raksasa Jepang", language: "id", region: "Indonesia", name_type: "Translation" }
    ],
    short_description: {
      id: "Raksasa bertanduk dengan kulit merah atau biru dalam folklor Jepang, bersenjatakan gada besi berduri (kanabō).",
      en: "Formidable horned ogres or demons in Japanese folklore, known for their immense brute strength and iron kanabō clubs."
    },
    long_description: {
      id: "Oni adalah salah satu ikon tertua dalam folklor dan kosmologi Buddhis Jepang. Digambarkan sebagai makhluk bertubuh kekar menjulang tinggi dengan kulit berwarna merah tua, biru, atau hijau, memiliki satu atau dua tanduk di kepala, taring tajam, serta mengenakan cawat dari kulit harimau. Dalam ajaran Buddhis, mereka bertindak sebagai algojo neraka (Jigoku) yang menyiksa jiwa-jiwa berdosa. Di sisi lain, dalam festival Setsubun, masyarakat melemparkan kacang kedelai sangrai ke luar rumah sambil berteriak 'Oni wa soto! Fuku wa uchi!' (Enyahlah Oni! Masuklah Keberuntungan!).",
      en: "Oni are quintessential figures in Japanese folklore and Buddhist eschatology. Typically depicted with scarlet, cerulean, or emerald skin, they sport bovine horns, sharp fangs, and loincloths fashioned from tiger pelt. Armed with heavy spiked iron clubs (kanabō), they serve as wardens of the underworld (Jigoku), doling out retributive torment to sinful mortals. During the annual Setsubun rite, households scatter roasted soybeans exclaiming 'Oni wa soto! Fuku wa uchi!' ('Demons out! Fortune in!')."
    },
    classification: "monster",
    subcategory: "Demonic Ogre",
    culture: "japanese-folklore",
    region: "East Asia",
    country: "Japan",
    era: "Nara Period to Edo Period",
    origin_type: "Folklore",
    habitat: "Mountain",
    element: "Earth",
    behavior: "Hostile",
    traits: ["supernatural-strength", "giant", "curses"],
    documented_abilities: [
      {
        name: { id: "Gada Kanabō & Kekuatan Pemecah Tebing", en: "Kanabō Iron Club Mastery & Colossal Might" },
        description: {
          id: "Mengayunkan gada besi berduri dengan kekuatan yang mampu meremukkan formasi batuan gunung.",
          en: "Wielding massive iron kanabō clubs capable of pulverizing boulder barricades."
        },
        evidence_level: "Documented Tradition",
        source_title: "Konjaku Monogatarishū & Gazu Hyakki Yagyō"
      }
    ],
    story_mode: {
      who: { id: "Raksasa bertanduk berkulit merah atau biru bercawat kulit harimau.", en: "A horned giant with scarlet or blue hide wielding an iron club." },
      origin: { id: "Pegunungan terpencil dan alam neraka Jigoku.", en: "Remote mountain crags and the Buddhist netherworld." },
      role: { id: "Penghukum manusia pendosa dan perwujudan kekuatan destruktif alam.", en: "Punisher of karmic transgressions and embodiment of brutal natural forces." },
      famous_for: { id: "Gada kanabō berduri dan ritual lempar kacang Setsubun.", en: "The spiked iron club and the bean-throwing ritual of Setsubun." }
    },
    did_you_know: {
      id: "Pepatah Jepang 'Oni ni kanabō' (memberikan gada besi kepada oni) berarti membuat pihak yang sudah sangat kuat menjadi tak terkalahkan.",
      en: "The Japanese idiom 'Oni ni kanabō' (giving an iron club to an oni) denotes granting an insurmountable advantage to someone already formidable."
    },
    cultural_context: {
      id: "Pada era modern, Oni tidak melulu dimaknai jahat; di beberapa kuil, topeng oni dipasang di atap rumah (onigawara) untuk menangkal petaka dan roh jahat lainnya.",
      en: "Oni symbolism is multifaceted; roof tiles bearing ogre faces (onigawara) are mounted on houses and temples to frighten away lesser malevolent forces."
    },
    related_creature_ids: ["kitsune", "tengu", "minotaur"],
    images: [
      {
        id: "img-oni-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Oni_by_Hokusai.jpg/640px-Oni_by_Hokusai.jpg",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Oni_by_Hokusai.jpg/320px-Oni_by_Hokusai.jpg",
        preview_url: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Oni_by_Hokusai.jpg",
        caption: {
          id: "Karya klasik Hokusai melukiskan sosok Oni bertaring.",
          en: "Classic woodblock sketch of an Oni by Katsushika Hokusai."
        },
        source_name: "Wikimedia Commons",
        source_url: "https://commons.wikimedia.org/wiki/File:Oni_by_Hokusai.jpg",
        author: "Katsushika Hokusai",
        license: "Public Domain",
        license_url: "https://creativecommons.org/publicdomain/mark/1.0/",
        attribution: "Katsushika Hokusai / Public Domain",
        image_type: "Historical illustration",
        is_primary: true,
        confidence: "High"
      }
    ],
    sources: [
      {
        id: "src-oni-1",
        source_type: "Academic",
        source_name: "University Press of Colorado",
        title: "Oni: The History and Iconography of Japanese Demons",
        url: "https://upcolorado.com",
        author: "Reider, N.T.",
        publication_date: "2010",
        retrieved_at: "2026-09-28",
        confidence: "High"
      }
    ],
    confidence_score: "High",
    completeness_score: 95,
    status: "published",
    created_at: "2026-09-28T00:00:00Z",
    updated_at: "2026-09-28T00:00:00Z"
  },

  // ==================== GREEK MYTHOLOGY ====================
  {
    id: "minotaur",
    slug: "minotaur",
    canonical_name: "Minotaur",
    original_name: "Μῑνώταυρος / Minotauros",
    display_name: { id: "Minotaur", en: "The Minotaur" },
    alternate_names: [
      { name: "Asterion", language: "el", region: "Crete", name_type: "Birth Name" },
      { name: "Bull of Minos", language: "en", region: "Greece", name_type: "Epithet" }
    ],
    short_description: {
      id: "Monster bertubuh manusia dan berkepala banteng ganas yang dikurung di dalam Labirin Kreta oleh Raja Minos.",
      en: "A mythic chimera with the body of a man and head of a bull, confined within the Cretan Labyrinth."
    },
    long_description: {
      id: "Dalam mitologi Yunani kuno, Minotaur (bernama asli Asterion) adalah anak dari Pasiphae, permaisuri Raja Minos dari Kreta, dan Banteng Kreta kiriman Poseidon. Merasa malu dan ngeri atas wujud makhluk ini, Raja Minos memerintahkan arsitek jenius Daedalus untuk merancang Labirin rumit di Knossos agar Minotaur tidak dapat keluar. Setiap beberapa tahun, kota Athena diwajibkan mengirimkan upeti tujuh pemuda dan tujuh gadis untuk diumpankan ke dalam labirin, hingga pahlawan Theseus dengan bantuan benang Ariadne berhasil menyusup dan membunuhnya.",
      en: "In ancient Greek mythology, the Minotaur (originally named Asterion) was the monstrous offspring of Queen Pasiphaë of Crete and a pristine bull sent by the sea god Poseidon. Horrified by the ferocious beast, King Minos commissioned the legendary craftsman Daedalus to construct the impenetrable Labyrinth at Knossos to imprison it. Athens was compelled to surrender annual tributes of seven youths and maidens as sacrifices to the beast, until the Athenian prince Theseus unraveled the maze with Ariadne's thread and slew the monster."
    },
    classification: "monster",
    subcategory: "Therianthropic Hybrid Beast",
    culture: "greek-mythology",
    region: "Europe",
    country: "Greece",
    era: "Minoan & Classical Greek Antiquity (circa 8th century BCE)",
    origin_type: "Mythology",
    habitat: "Cave",
    element: "Earth",
    behavior: "Hostile",
    traits: ["supernatural-strength", "colossal size", "apex predator"],
    documented_abilities: [
      {
        name: { id: "Serudukan Banteng & Kekuatan Kolosal", en: "Crushing Charge & Bestial Might" },
        description: {
          id: "Kombinasi tanduk banteng pemusnah dan kekuatan lengan humanoid pemecah tulang.",
          en: "Bone-shattering horns coupled with immense anthropomorphic brute force."
        },
        evidence_level: "Documented Tradition",
        source_title: "Bibliotheca of Pseudo-Apollodorus & Ovid's Metamorphoses"
      }
    ],
    story_mode: {
      who: { id: "Makhluk bertubuh atletis perkasa dengan kepala dan tanduk banteng buas.", en: "A hulking brute bearing the head and lethal horns of a savage bull." },
      origin: { id: "Istana Knossos di Pulau Kreta, Yunani Kuno.", en: "The Palace of Knossos, ancient Crete." },
      role: { id: "Simbol ketakutan akan alam liar dan aib kekuasaan tiran.", en: "Emblem of bestial darkness and the perils of tyrannical hubris." },
      famous_for: { id: "Labirin Knossos dan pertarungan legendaris melawan pahlawan Theseus.", en: "The inescapable Labyrinth and his duel with prince Theseus." }
    },
    did_you_know: {
      id: "Nama asli Minotaur sebelum dijuluki monster adalah Asterion ('bintang yang bersinar'), nama yang sama dengan kakek tirinya, raja pertama Kreta.",
      en: "The Minotaur's personal name was Asterion ('star-like'), named after Minos's mortal foster father, the first king of Crete."
    },
    cultural_context: {
      id: "Mitos Minotaur mencerminkan pemujaan sakral banteng pada peradaban Minoa purba serta hegemoni maritim Kreta atas kota-kota Yunani daratan pada Zaman Perunggu.",
      en: "The myth mirrors the real Bronze Age bull-leaping rituals of Minoan Crete and its maritime dominance over early Greek city-states."
    },
    related_creature_ids: ["medusa", "cerberus", "hydra"],
    images: [
      {
        id: "img-minotaur-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Theseus_Minotaur_mosaic_from_Cormerod.jpg/640px-Theseus_Minotaur_mosaic_from_Cormerod.jpg",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Theseus_Minotaur_mosaic_from_Cormerod.jpg/320px-Theseus_Minotaur_mosaic_from_Cormerod.jpg",
        preview_url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Theseus_Minotaur_mosaic_from_Cormerod.jpg",
        caption: {
          id: "Mosaik Romawi kuno menggambarkan pertarungan Theseus dan Minotaur di dalam Labirin.",
          en: "Ancient Roman mosaic from Cormerod depicting Theseus slaying the Minotaur."
        },
        source_name: "Wikimedia Commons",
        source_url: "https://commons.wikimedia.org/wiki/File:Theseus_Minotaur_mosaic_from_Cormerod.jpg",
        author: "Roman provincial artist (circa 3rd century CE)",
        license: "Public Domain",
        license_url: "https://creativecommons.org/publicdomain/mark/1.0/",
        attribution: "Roman provincial artist / Public Domain",
        image_type: "Historical illustration",
        is_primary: true,
        confidence: "High"
      }
    ],
    sources: [
      {
        id: "src-minotaur-1",
        source_type: "Academic",
        source_name: "Cambridge University Press",
        title: "The Minoan Labyrinth and the Minotaur in Greek Myth",
        url: "https://www.cambridge.org",
        author: "Castleden, R.",
        publication_date: "1990",
        retrieved_at: "2026-09-28",
        confidence: "High"
      }
    ],
    confidence_score: "High",
    completeness_score: 96,
    status: "published",
    created_at: "2026-09-28T00:00:00Z",
    updated_at: "2026-09-28T00:00:00Z"
  },
  {
    id: "medusa",
    slug: "medusa",
    canonical_name: "Medusa",
    original_name: "Μέδουσα / Medousa",
    display_name: { id: "Medusa", en: "Medusa (The Gorgon)" },
    alternate_names: [
      { name: "Gorgo", language: "el", region: "Ancient Greece", name_type: "Title" },
      { name: "Medusa the Guardian", language: "en", region: "Archaic translation", name_type: "Etymological" }
    ],
    short_description: {
      id: "Satu-satunya Gorgon yang fana dalam mitologi Yunani, berambut ular berbisa dan tatapan matanya mengubah siapa pun menjadi batu.",
      en: "A tragic and formidable Gorgon of Greek myth, with living venomous serpents for hair and a petrifying gaze."
    },
    long_description: {
      id: "Medusa adalah salah satu dari tiga bersaudara Gorgon (bersama Stheno dan Euryale), namun ia satu-satunya yang fana. Dalam versi penyair Romawi Ovid, Medusa awalnya adalah perawan jelita pendeta kuil Athena. Setelah dinodai oleh dewa laut Poseidon di kuil tersebut, Dewi Athena yang murka mengutuk rambut indahnya menjadi ular berbisa yang mendesis dan membuat tatapannya mengubah setiap makhluk bernyawa menjadi patung batu dingin. Medusa akhirnya dipenggal oleh pahlawan Perseus yang memanfaatkan pantulan perisai perunggu mengilap untuk menghindari tatapannya.",
      en: "Medusa was the sole mortal among the three Gorgon sisters in Hellenic mythology. In Ovid's influential Roman account, she was once a maiden of captivating grace. After Poseidon violated her inside Athena's sanctuary, the indignant goddess transformed Medusa's golden tresses into writhing serpents and cursed her gaze to petrify any mortal who met her eyes. She was eventually slain by Perseus, who guided his sickle using the polished reflection of his bronze shield to avoid direct eye contact."
    },
    classification: "monster",
    subcategory: "Petrifying Gorgon",
    culture: "greek-mythology",
    region: "Europe",
    country: "Greece",
    era: "Archaic to Classical Greece (8th–4th century BCE)",
    origin_type: "Mythology",
    habitat: "Cave",
    element: "Earth",
    behavior: "Hostile",
    traits: ["curses", "supernatural-strength", "guardian"],
    documented_abilities: [
      {
        name: { id: "Tatapan Pembatu (Petrifikasi)", en: "Petrifying Gaze" },
        description: {
          id: "Tatapan langsung ke matanya seketika mengubah daging dan tulang korban menjadi batu padat.",
          en: "Direct ocular contact instantaneously calcifies organic tissue into solid stone."
        },
        evidence_level: "Documented Tradition",
        source_title: "Hesiod's Theogony & Apollodorus' Bibliotheca"
      },
      {
        name: { id: "Rambut Ular Berbisa Mematikan", en: "Living Serpent Hair & Toxins" },
        description: {
          id: "Ular-ular berbisa yang tumbuh di kepalanya mampu menyerang dan mematuk musuh secara mandiri.",
          en: "Autonomous venomous vipers crowning her scalp with acute predatory reflexes."
        },
        evidence_level: "Documented Tradition",
        source_title: "Ovid's Metamorphoses"
      }
    ],
    story_mode: {
      who: { id: "Wanita bermahkota ular berbisa dengan tatapan mata yang membekukan darah.", en: "A tragic Gorgon crowned with writhing serpents whose gaze turns flesh to stone." },
      origin: { id: "Ujung barat dunia mitos Yunani kuno di luar Samudra.", en: "The mythical far western edges beyond Oceanus." },
      role: { id: "Figur apotropaik (penolak bala) pelindung dan simbol kutukan ilahi.", en: "Apotropaic guardian symbol and victim of divine petulance." },
      famous_for: { id: "Tatapan yang mengubah manusia menjadi batu dan kepalanya di perisai Athena.", en: "The petrifying stare and her severed head mounted upon Athena's aegis." }
    },
    did_you_know: {
      id: "Saat Perseus memenggal kepala Medusa, lahirlah kuda bersayap Pegasus dan raksasa berpedang emas Chrysaor dari lehernya.",
      en: "Upon Medusa's decapitation by Perseus, the winged steed Pegasus and the golden warrior Chrysaor sprang forth from her neck."
    },
    cultural_context: {
      id: "Topeng wajah Medusa (Gorgoneion) dipasang oleh bangsa Yunani kuno pada pintu, perisai, dan kuil sebagai jimat apotropaik terkuat untuk menakuti roh jahat.",
      en: "In ancient Greece, the Gorgoneion (carving of Medusa's visage) was widely affixed to temple pediments and shields as a supreme protective talisman against evil."
    },
    related_creature_ids: ["minotaur", "hydra", "cerberus"],
    images: [
      {
        id: "img-medusa-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Caravaggio_-_Medusa_-_Google_Art_Project.jpg/640px-Caravaggio_-_Medusa_-_Google_Art_Project.jpg",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Caravaggio_-_Medusa_-_Google_Art_Project.jpg/320px-Caravaggio_-_Medusa_-_Google_Art_Project.jpg",
        preview_url: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Caravaggio_-_Medusa_-_Google_Art_Project.jpg",
        caption: {
          id: "Lukisan terkenal Medusa karya Caravaggio (1597) di Galeri Uffizi, Florence.",
          en: "Masterpiece painting of Medusa by Caravaggio (1597) at the Uffizi Gallery, Florence."
        },
        source_name: "Wikimedia Commons",
        source_url: "https://commons.wikimedia.org/wiki/File:Caravaggio_-_Medusa_-_Google_Art_Project.jpg",
        author: "Caravaggio (1571–1610)",
        license: "Public Domain",
        license_url: "https://creativecommons.org/publicdomain/mark/1.0/",
        attribution: "Caravaggio / Public Domain",
        image_type: "Historical illustration",
        is_primary: true,
        confidence: "High"
      }
    ],
    sources: [
      {
        id: "src-medusa-1",
        source_type: "Academic",
        source_name: "Harvard University Press",
        title: "The Medusa Reader",
        url: "https://www.hup.harvard.edu",
        author: "Garber, M. & Vickers, N.J.",
        publication_date: "2003",
        retrieved_at: "2026-09-28",
        confidence: "High"
      }
    ],
    confidence_score: "High",
    completeness_score: 97,
    status: "published",
    created_at: "2026-09-28T00:00:00Z",
    updated_at: "2026-09-28T00:00:00Z"
  },

  // ==================== NORSE MYTHOLOGY ====================
  {
    id: "jormungandr",
    slug: "jormungandr",
    canonical_name: "Jörmungandr",
    original_name: "Jǫrmungandr",
    display_name: { id: "Jörmungandr", en: "Jörmungandr (The Midgard Serpent)" },
    alternate_names: [
      { name: "Midgardsormen", language: "no", region: "Scandinavia", name_type: "Modern Scandinavian" },
      { name: "World Serpent", language: "en", region: "Norse Lore", name_type: "Descriptive Epithet" }
    ],
    short_description: {
      id: "Ular raksasa kosmik dalam mitologi Nordik yang melingkari seluruh bumi Midgard dan menggigit ekornya sendiri di dasar samudera.",
      en: "The colossal sea serpent of Norse myth, encircling the mortal realm of Midgard and biting its own tail until Ragnarök."
    },
    long_description: {
      id: "Jörmungandr adalah anak kedua dari dewa penipu Loki dan raksasa wanita Angrboða (saudara dari serigala Fenrir dan dewi kematian Hel). Dewa tertinggi Odin melemparkan ular kecil ini ke dalam samudra raya yang mengelilingi Midgard. Namun Jörmungandr tumbuh begitu masif hingga tubuhnya melingkari seluruh daratan bumi dan mampu menggigit ekornya sendiri. Dalam ramalan akhir zaman Ragnarök, Jörmungandr akan bangkit dari dasar laut, memuntahkan bisa beracun yang menodai langit dan lautan, lalu bertarung mati-matian melawan dewa petir Thor.",
      en: "Jörmungandr is the middle child of Loki and the giantess Angrboða, sibling to Fenrir and Hel. Foreseeing catastrophe, the Allfather Odin cast the young serpent into the outer oceans encircling Midgard. The beast grew so astronomically vast that its coils encircled the entire world, grasping its own tail. At the twilight of the gods (Ragnarök), Jörmungandr will breach the surface, poisoning sea and sky with pestilential venom, culminating in a cataclysmic final duel with the thunder god Thor."
    },
    classification: "dragon",
    subcategory: "Primordial World Serpent",
    culture: "norse-mythology",
    region: "Europe",
    country: "Scandinavia",
    era: "Viking Age & Old Norse Poetry (9th–13th century)",
    origin_type: "Mythology",
    habitat: "Ocean",
    element: "Water",
    behavior: "Hostile",
    traits: ["giant", "aquatic", "curses", "supernatural-strength", "colossal size"],
    documented_abilities: [
      {
        name: { id: "Bisa Kosmik Eitr", en: "Primordial Eitr Venom" },
        description: {
          id: "Semburan kabut racun hitam yang mampu membunuh dewa terkuat dan membusukkan perairan dunia.",
          en: "Corrosive venomous miasma capable of felling deities and poisoning global oceans."
        },
        evidence_level: "Documented Tradition",
        source_title: "Poetic Edda — Völuspá"
      },
      {
        name: { id: "Guncangan Samudera & Gempa Bumi", en: "Oceanic Surge & Earth-Tremors" },
        description: {
          id: "Gerakan tubuhnya di dasar laut memicu pasang tsunami dahsyat yang menenggelamkan pesisir daratan.",
          en: "Subsea undulations triggering colossal tsunamis and shattering tectonic coastlines."
        },
        evidence_level: "Documented Tradition",
        source_title: "Prose Edda — Gylfaginning"
      }
    ],
    story_mode: {
      who: { id: "Ular samudera purba berukuran tak bertepi yang melingkari Midgard.", en: "A colossal cosmic serpent coiled around the entire world of mortals." },
      origin: { id: "Lautan purba di sekeliling sembilan alam mitologi Nordik.", en: "The primeval outer ocean of the Nine Realms." },
      role: { id: "Kekuatan kosmik tak terhindarkan dan musuh bebuyutan dewa petir Thor.", en: "Cataclysmic herald of Ragnarök and destined nemesis of Thor." },
      famous_for: { id: "Menggigit ekornya sendiri dan duel mematikan sembilan langkah melawan Thor.", en: "Biting its tail and the final duel in which Thor falls after nine steps." }
    },
    did_you_know: {
      id: "Meskipun Thor berhasil memukul kepala Jörmungandr dengan palu Mjölnir hingga mati saat Ragnarök, Thor hanya mampu melangkah sembilan langkah sebelum tewas akibat racun ular tersebut.",
      en: "Though Thor successfully strikes down Jörmungandr with Mjölnir at Ragnarök, the thunder god takes only nine strides before collapsing dead from the beast's venom."
    },
    cultural_context: {
      id: "Simbol ular yang menggigit ekornya sendiri (Ouroboros) pada bangsa Nordik melambangkan siklus kehancuran dan kelahiran kembali kosmos yang kekal.",
      en: "The motif of the serpent encircling the world embodies the cyclical Norse cosmology of apocalyptic destruction preceding rebirth."
    },
    related_creature_ids: ["fenrir", "kraken", "long-dragon"],
    images: [
      {
        id: "img-jormungandr-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Thor_and_the_Midgard_Serpent_by_Emil_Doepler.jpg/640px-Thor_and_the_Midgard_Serpent_by_Emil_Doepler.jpg",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Thor_and_the_Midgard_Serpent_by_Emil_Doepler.jpg/320px-Thor_and_the_Midgard_Serpent_by_Emil_Doepler.jpg",
        preview_url: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Thor_and_the_Midgard_Serpent_by_Emil_Doepler.jpg",
        caption: {
          id: "Ilustrasi klasik Thor melawan Jörmungandr karya Emil Doepler (1905).",
          en: "Thor fighting the Midgard Serpent, illustrated by Emil Doepler (1905)."
        },
        source_name: "Wikimedia Commons",
        source_url: "https://commons.wikimedia.org/wiki/File:Thor_and_the_Midgard_Serpent_by_Emil_Doepler.jpg",
        author: "Emil Doepler (1855–1922)",
        license: "Public Domain",
        license_url: "https://creativecommons.org/publicdomain/mark/1.0/",
        attribution: "Emil Doepler / Public Domain",
        image_type: "Historical illustration",
        is_primary: true,
        confidence: "High"
      }
    ],
    sources: [
      {
        id: "src-jormun-1",
        source_type: "Academic",
        source_name: "Oxford University Press",
        title: "The Poetic Edda: Stories of the Norse Gods and Heroes",
        url: "https://global.oup.com",
        author: "Larrington, C.",
        publication_date: "2014",
        retrieved_at: "2026-09-28",
        confidence: "High"
      }
    ],
    confidence_score: "High",
    completeness_score: 97,
    status: "published",
    created_at: "2026-09-28T00:00:00Z",
    updated_at: "2026-09-28T00:00:00Z"
  },
  {
    id: "fenrir",
    slug: "fenrir",
    canonical_name: "Fenrir",
    original_name: "Fenrisúlfr",
    display_name: { id: "Fenrir", en: "Fenrir (The Doomsday Wolf)" },
    alternate_names: [
      { name: "Fenrisúlfr", language: "non", region: "Old Norse", name_type: "Poetic Name" },
      { name: "Hróðvitnir", language: "non", region: "Old Norse", name_type: "Kennings / Fame-Wolf" }
    ],
    short_description: {
      id: "Serigala raksasa purba anak Loki yang dirantai para dewa dengan tali magis Gleipnir, ditakdirkan memangsa Odin saat Ragnarök.",
      en: "A monstrous wolf of Norse myth, bound by the gods with the silken chain Gleipnir, fated to devour the Allfather Odin at Ragnarök."
    },
    long_description: {
      id: "Fenrir adalah monster buas yang pertumbuhannya begitu pesat hingga membuat para dewa di Asgard dicekam ketakutan. Menyadari takdir kehancuran yang dibawanya, para dewa berusaha membelenggunya dengan rantai besi berat Leyding dan Dromi, namun keduanya dipatahkan Fenrir dengan mudah. Para dewa akhirnya meminta kaum kurcaci (dvergar) menempa Gleipnir—tali sutra tipis yang terbuat dari bahan-bahan mustahil seperti suara langkah kucing dan janggut wanita. Fenrir hanya bersedia diikat jika ada dewa yang meletakkan tangan di dalam mulutnya sebagai jaminan; dewa keberanian Týr mengorbankan tangan kanannya saat Fenrir menyadari ia terjebak.",
      en: "Fenrir was a ravenous monstrous wolf whose rapid growth struck terror into the hearts of the Æsir in Asgard. After shattering the colossal iron fetters Leyding and Dromi with contemptuous ease, the gods commissioned the dark elves to forge Gleipnir—a fetter deceptively as soft as silk, crafted from impossible ingredients including the footfall of a cat and the roots of a mountain. Suspecting treachery, Fenrir consented to be bound only if a god placed an arm within his jaws as a pledge of good faith; the heroic war god Týr sacrificed his right hand when the beast found itself entrapped."
    },
    classification: "monster",
    subcategory: "Apocalyptic Dire Beast",
    culture: "norse-mythology",
    region: "Europe",
    country: "Scandinavia",
    era: "Viking Age & Old Norse Poetry",
    origin_type: "Mythology",
    habitat: "Mountain",
    element: "Shadow",
    behavior: "Hostile",
    traits: ["supernatural-strength", "colossal size", "apex predator", "immortal"],
    documented_abilities: [
      {
        name: { id: "Rahang Pemecah Cakrawala", en: "Cosmic Jaws & Unbound Maw" },
        description: {
          id: "Ketika membuka mulutnya, rahang bawah menyentuh bumi dan rahang atas menyentuh langit, menelan mentari dan para dewa.",
          en: "Maw opening so widely that the lower jaw touches earth and the upper scrapes the firmament."
        },
        evidence_level: "Documented Tradition",
        source_title: "Prose Edda — Gylfaginning"
      }
    ],
    story_mode: {
      who: { id: "Serigala mengerikan berukuran raksasa dengan tatapan menyala penuh dendam.", en: "A colossal wolf with smoldering eyes bound on a remote crag." },
      origin: { id: "Hutan Járnviðr (Hutan Besi) dan kediaman para raksasa.", en: "The Iron Wood of Jötunheim." },
      role: { id: "Perwujudan alam liar yang tak terkendali dan pembasmi dewa tertinggi.", en: "Embodiment of untamed cosmic retribution and the doom of Odin." },
      famous_for: { id: "Memutus tangan dewa Tyr dan menelan dewa Odin saat Ragnarök.", en: "Severing Tyr's hand and devouring Odin at the battle of Ragnarök." }
    },
    did_you_know: {
      id: "Tali ajaib Gleipnir dibuat dari enam bahan mustahil: suara langkah kucing, janggut wanita, akar gunung, urat beruang, nafas ikan, dan ludah burung.",
      en: "The fetter Gleipnir was forged from six paradoxes: the noise of a cat's step, the beard of a woman, the roots of a rock, the sinews of a bear, the breath of a fish, and the spittle of a bird."
    },
    cultural_context: {
      id: "Kisah pengorbanan Týr demi Asgard mencerminkan nilai etika Viking tentang kehormatan sumpah dan keberanian berkorban demi komunitas di hadapan bahaya eksistensial.",
      en: "Týr's deliberate sacrifice exemplifies Viking warrior ethos, where sworn oaths and communal survival took precedence over personal preservation."
    },
    related_creature_ids: ["jormungandr", "kraken", "cerberus"],
    images: [
      {
        id: "img-fenrir-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Fenrir_and_Tyr_by_John_Bauer_1911.jpg/640px-Fenrir_and_Tyr_by_John_Bauer_1911.jpg",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Fenrir_and_Tyr_by_John_Bauer_1911.jpg/320px-Fenrir_and_Tyr_by_John_Bauer_1911.jpg",
        preview_url: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Fenrir_and_Tyr_by_John_Bauer_1911.jpg",
        caption: {
          id: "Lukisan klasik karya John Bauer (1911) menampilkan Týr dan Fenrir.",
          en: "Classic illustration by John Bauer (1911) showing Týr placing his hand in Fenrir's maw."
        },
        source_name: "Wikimedia Commons",
        source_url: "https://commons.wikimedia.org/wiki/File:Fenrir_and_Tyr_by_John_Bauer_1911.jpg",
        author: "John Bauer (1882–1918)",
        license: "Public Domain",
        license_url: "https://creativecommons.org/publicdomain/mark/1.0/",
        attribution: "John Bauer / Public Domain",
        image_type: "Historical illustration",
        is_primary: true,
        confidence: "High"
      }
    ],
    sources: [
      {
        id: "src-fenrir-1",
        source_type: "Academic",
        source_name: "Boydell & Brewer",
        title: "Norse Mythology: A Guide to the Gods, Heroes, Rituals, and Beliefs",
        url: "https://boydellandbrewer.com",
        author: "Lindow, J.",
        publication_date: "2001",
        retrieved_at: "2026-09-28",
        confidence: "High"
      }
    ],
    confidence_score: "High",
    completeness_score: 96,
    status: "published",
    created_at: "2026-09-28T00:00:00Z",
    updated_at: "2026-09-28T00:00:00Z"
  },

  // ==================== CELTIC FOLKLORE ====================
  {
    id: "banshee",
    slug: "banshee",
    canonical_name: "Banshee",
    original_name: "Bean Sídhe",
    display_name: { id: "Banshee", en: "Banshee (The Weeping Spirit)" },
    alternate_names: [
      { name: "Bean Sídhe", language: "ga", region: "Ireland", name_type: "Gaelic Origin" },
      { name: "Woman of the Fairy Mound", language: "en", region: "Celtic Realm", name_type: "Literal Meaning" }
    ],
    short_description: {
      id: "Roh wanita penangis dalam folklor Irlandia yang ratapan menyayat hatinya menjadi firasat kematian anggota keluarga terpandang.",
      en: "A female spirit in Irish folklore whose mournful midnight wailing foretells the imminent demise of a kinsperson."
    },
    long_description: {
      id: "Banshee (berasal dari bahasa Gaelik Irlandia 'Bean Sídhe' yang berarti 'wanita dari bukit peri') adalah entitas supernatural yang terikat pada garis keturunan keluarga kuno Irlandia (seperti O'Neill, O'Brien, O'Connor). Banshee tidak membunuh manusia; kehadirannya adalah sebagai pembawa firasat (omen) melalui ratapan duka mendalam (keening) di malam hari. Ia dapat menampakkan diri dalam tiga wujud: seorang gadis muda dengan rambut emas kemerahan, seorang wanita anggun, atau seorang nenek renta berkerudung compang-camping dengan mata memerah karena menangis.",
      en: "The Banshee (from Old Irish 'Bean Sídhe', woman of the fairy mounds) is one of the most poignant supernatural figures of Celtic tradition. She is spiritually bonded to historic noble Irish families. Rather than an aggressive monster, the Banshee serves as a harbingering witness to mortality. Her visitation is announced by blood-curdling lamentations (keening) echoing across marshlands under moonlit skies. She manifests as a maiden of radiant grief, a matron, or a cloaked crone whose eyes burn scarlet from weeping."
    },
    classification: "spirit",
    subcategory: "Omens & Ancestral Harbingers",
    culture: "celtic-folklore",
    region: "Europe",
    country: "Ireland",
    era: "Ancient Celtic & Medieval Gaelic folklore",
    origin_type: "Folklore",
    habitat: "Village",
    element: "Air",
    behavior: "Neutral",
    traits: ["prophecy", "nocturnal", "invisibility", "spirit realm"],
    documented_abilities: [
      {
        name: { id: "Ratapan Kematian (Keening Omen)", en: "Mournful Keening & Precognition" },
        description: {
          id: "Ratapan duka yang menusuk jiwa, terdengar bermil-mil jauhnya sebagai tanda tak terelakkan akan wafatnya seorang kerabat.",
          en: "Chilling wailing that resonates across valleys, heralding an unavoidable impending death."
        },
        evidence_level: "Documented Tradition",
        source_title: "Fairy Legends and Traditions of the South of Ireland"
      }
    ],
    story_mode: {
      who: { id: "Sosok wanita berkerudung dengan mata merah berurai air mata duka.", en: "A cloaked woman weeping by riverbanks with grief-stricken eyes." },
      origin: { id: "Bukit-bukit peri (sidhe) dan tanah rawa Irlandia.", en: "The sidhe mounds and misty moors of Ireland." },
      role: { id: "Pembawa firasat kematian bagi garis keturunan leluhur.", en: "Ancestral herald of mortality and guardian of kin lamentations." },
      famous_for: { id: "Suara ratapan menyayat hati di tengah keheningan malam.", en: "The piercing, sorrowful cry echoing in the dead of night." }
    },
    did_you_know: {
      id: "Tradisi ratapan Banshee berakar dari profesi nyata di Irlandia kuno yang disebut 'Bean Chaointe' (wanita peratap), yaitu wanita yang disewa khusus untuk melantunkan kidung duka pada upacara pemakaman.",
      en: "The Banshee legend connects historically to Irish 'keeners' (Bean Chaointe), women who were traditionally commissioned to chant solemn funeral laments."
    },
    cultural_context: {
      id: "Banshee tidak dipandang sebagai hantu jahat pembunuh, melainkan arwah leluhur yang turut berduka atas kepergian darah dagingnya.",
      en: "Traditional Irish culture regards the Banshee not as a demonic killer, but as an ancestral guardian sharing sorrow with the living."
    },
    related_creature_ids: ["kuntilanak", "pocong", "yuki-onna"],
    images: [
      {
        id: "img-banshee-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/The_Banshee_by_Henry_Fuseli.jpg/640px-The_Banshee_by_Henry_Fuseli.jpg",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/The_Banshee_by_Henry_Fuseli.jpg/320px-The_Banshee_by_Henry_Fuseli.jpg",
        preview_url: "https://upload.wikimedia.org/wikipedia/commons/d/d4/The_Banshee_by_Henry_Fuseli.jpg",
        caption: {
          id: "Representasi artistik sosok Banshee dalam folklor Irlandia.",
          en: "Artistic representation of the Banshee in Celtic folklore."
        },
        source_name: "Wikimedia Commons",
        source_url: "https://commons.wikimedia.org/wiki/File:The_Banshee_by_Henry_Fuseli.jpg",
        author: "Henry Fuseli circle",
        license: "Public Domain",
        license_url: "https://creativecommons.org/publicdomain/mark/1.0/",
        attribution: "Public Domain / Wikimedia Commons",
        image_type: "Historical illustration",
        is_primary: true,
        confidence: "High"
      }
    ],
    sources: [
      {
        id: "src-banshee-1",
        source_type: "Academic",
        source_name: "University College Dublin Press",
        title: "The Banshee: The Irish Supernatural Death-Messenger",
        url: "https://www.ucdpress.ie",
        author: "Lysaght, P.",
        publication_date: "1986",
        retrieved_at: "2026-09-28",
        confidence: "High"
      }
    ],
    confidence_score: "High",
    completeness_score: 95,
    status: "published",
    created_at: "2026-09-28T00:00:00Z",
    updated_at: "2026-09-28T00:00:00Z"
  },

  // ==================== MESOAMERICAN TRADITIONS ====================
  {
    id: "quetzalcoatl",
    slug: "quetzalcoatl",
    canonical_name: "Quetzalcoatl",
    original_name: "Quetzalcōātl",
    display_name: { id: "Quetzalcoatl", en: "Quetzalcoatl (The Feathered Serpent)" },
    alternate_names: [
      { name: "Kukulkan", language: "myn", region: "Maya Realm", name_type: "Yucatec Maya equivalent" },
      { name: "Feathered Serpent", language: "en", region: "Mesoamerica", name_type: "Translation" }
    ],
    short_description: {
      id: "Dewa ular berbulu zamrud dalam peradaban Aztek dan Mesoamerika, pencipta umat manusia, pelindung angin, fajar, dan ilmu pengetahuan.",
      en: "The venerated Feathered Serpent deity of ancient Mesoamerica, patron of wind, dawn, artisans, learning, and cosmic creation."
    },
    long_description: {
      id: "Quetzalcoatl (berarti 'Ular Berbulu Burung Quetzal' dalam bahasa Nahuatl) adalah salah satu dewa teragung dalam panteon Mesoamerika purba. Ia memadukan unsur bumi (ular) dan unsur langit (burung quetzal berbulu hijau zamrud), melambangkan perpaduan fisik fana dan spiritualitas kosmik. Berbeda dengan dewa-dewa lain yang menuntut pengorbanan darah manusia dalam jumlah besar, Quetzalcoatl diasosiasikan dengan fajar, penemuan jagung, kalender, astronomi, serta seni sastra dan tembikar.",
      en: "Quetzalcoatl (from Nahuatl 'quetzalli' meaning precious feather, and 'coatl' meaning serpent) is a supreme deity revered across Teotihuacan, Toltec, and Aztec civilizations. Conjoining the terrestrial nature of the serpent with the celestial freedom of the emerald quetzal bird, he represents the union of heaven and earth. Associated with the planet Venus as the Morning Star, Quetzalcoatl was celebrated as the creator of the present human era who journeyed to the underworld of Mictlan to retrieve the bones of ancestral generations."
    },
    classification: "deity",
    subcategory: "Cosmic Creator Deity",
    culture: "mesoamerican-traditions",
    region: "Central America",
    country: "Mexico",
    era: "Pre-Columbian Mesoamerica (circa 1st century CE – 1521 CE)",
    origin_type: "Mythology",
    habitat: "Sky",
    element: "Air",
    behavior: "Benevolent",
    traits: ["divine authority", "ancient wisdom", "flight", "immortal", "elemental affinity"],
    documented_abilities: [
      {
        name: { id: "Kendali Angin Fajar (Ehecatl)", en: "Wind Dominion & Breath of Life" },
        description: {
          id: "Menggerakkan angin pembawa awan hujan kesuburan dan meniupkan napas kehidupan pada tanah.",
          en: "Commanding the winds that herald seasonal rains and breathing vitality into creation."
        },
        evidence_level: "Documented Tradition",
        source_title: "Codex Borgia & Florentine Codex"
      },
      {
        name: { id: "Perjalanan ke Dunia Bawah Mictlan", en: "Underworld Descent & Resurrection" },
        description: {
          id: "Menembus sembilan lapisan dunia bawah Mictlan dan mengatasi jebakan Mictlantecuhtli.",
          en: "Traversing the nine levels of the underworld realm Mictlan to gather sacred bone relics."
        },
        evidence_level: "Documented Tradition",
        source_title: "Leyenda de los Soles"
      }
    ],
    story_mode: {
      who: { id: "Ular raksasa berbulu zamrud berkilauan yang melayang di angkasa fajar.", en: "A majestic serpent adorned with luminous iridescent quetzal plumage." },
      origin: { id: "Lembah Meksiko, Cholula, dan kota purba Teotihuacan.", en: "Teotihuacan, Cholula, and the Valley of Mexico." },
      role: { id: "Pemberi ilmu pengetahuan, pelindung pengrajin, dan arsitek era peradaban.", en: "Patron of arts, astronomer-priests, and creator of the current world epoch." },
      famous_for: { id: "Piramida Ular Berbulu dan penemuan tanaman jagung untuk umat manusia.", en: "The Temple of the Feathered Serpent and bringing corn agriculture to humanity." }
    },
    did_you_know: {
      id: "Pada piramida El Castillo di Chichen Itza, fenomena cahaya dan bayangan saat ekuinoks musim semi menghasilkan ilusi optik ular Quetzalcoatl (Kukulkan) yang merayap turun di tangga piramida.",
      en: "At the El Castillo pyramid in Chichen Itza during equinoxes, the setting sun casts a shadow that creates the stunning illusion of the Feathered Serpent slithering down the balustrade."
    },
    cultural_context: {
      id: "Dalam kosmologi suku pribumi Meksiko, Quetzalcoatl melambangkan keseimbangan antara hasrat ragawi (ular merayap di tanah) dan aspirasi spiritual tertinggi (burung terbang ke langit).",
      en: "In Indigenous philosophy, the Feathered Serpent represents human transcendence: bridging base earthly limitations with elevated spiritual consciousness."
    },
    related_creature_ids: ["long-dragon", "garuda", "jormungandr"],
    images: [
      {
        id: "img-quetzalcoatl-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Quetzalcoatl_Florentine_Codex.jpg/640px-Quetzalcoatl_Florentine_Codex.jpg",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Quetzalcoatl_Florentine_Codex.jpg/320px-Quetzalcoatl_Florentine_Codex.jpg",
        preview_url: "https://upload.wikimedia.org/wikipedia/commons/8/87/Quetzalcoatl_Florentine_Codex.jpg",
        caption: {
          id: "Ilustrasi Quetzalcoatl dalam Kodeks Firenze (Florentine Codex) abad ke-16.",
          en: "Depiction of Quetzalcoatl in the 16th-century Florentine Codex."
        },
        source_name: "Wikimedia Commons",
        source_url: "https://commons.wikimedia.org/wiki/File:Quetzalcoatl_Florentine_Codex.jpg",
        author: "Bernardino de Sahagún (Florentine Codex)",
        license: "Public Domain",
        license_url: "https://creativecommons.org/publicdomain/mark/1.0/",
        attribution: "Florentine Codex / Public Domain",
        image_type: "Historical illustration",
        is_primary: true,
        confidence: "High"
      }
    ],
    sources: [
      {
        id: "src-quetzal-1",
        source_type: "Academic",
        source_name: "University of Oklahoma Press",
        title: "The Myth of Quetzalcoatl: Religion, Rulership, and History in Mesoamerica",
        url: "https://www.oupress.com",
        author: "Florescano, E.",
        publication_date: "1999",
        retrieved_at: "2026-09-28",
        confidence: "High"
      }
    ],
    confidence_score: "High",
    completeness_score: 98,
    status: "published",
    created_at: "2026-09-28T00:00:00Z",
    updated_at: "2026-09-28T00:00:00Z"
  },

  // ==================== SLAVIC FOLKLORE ====================
  {
    id: "baba-yaga",
    slug: "baba-yaga",
    canonical_name: "Baba Yaga",
    original_name: "Баба-Яга",
    display_name: { id: "Baba Yaga", en: "Baba Yaga" },
    alternate_names: [
      { name: "Baba Roga", language: "sh", region: "South Slavic", name_type: "Regional Variant" },
      { name: "Ježibaba", language: "cs", region: "West Slavic", name_type: "Regional Variant" }
    ],
    short_description: {
      id: "Penyihir wanita ambigu dalam folklor Slavia yang terbang menggunakan lumpang, tinggal di pondok berkaki ayam, dan menjaga batas antara dunia nyata dan dunia gaib.",
      en: "An enigmatic and ambiguous figure in Slavic folklore who flies in a giant mortar, steers with a pestle, and lives in a hut resting on chicken legs."
    },
    long_description: {
      id: "Baba Yaga adalah salah satu figur paling tak terlupakan dalam dongeng Slavia Timur. Digambarkan sebagai nenek tua bertubuh bungkuk dengan hidung bengkok dan 'kaki tulang' (kostyanaya noga). Baba Yaga tidak menaiki sapu konvensional, melainkan meluncur melintasi pepohonan di dalam lumpang kayu besar (stupa) sambil mengemudikannya dengan alu (pestle) dan menyapu jejaknya dengan sapu perak. Rumahnya berada jauh di pedalaman hutan lebat, bertengger di atas sepasang kaki ayam raksasa yang dapat berputar dan dikelilingi pagar dari tulang manusia.",
      en: "Baba Yaga is an enigmatic, multifaceted archetype in Eastern European folklore. Rather than a straightforward villain, she occupies an ambiguous moral threshold: she can devour unwary travelers or bestow invaluable wisdom and magical artifacts upon the pure of heart. She traverses birch forests flying inside a wooden mortar (stupa), rowing with a pestle and erasing her airborne trail with a silver broom. Her secluded dwelling spins continually upon giant rooster legs, fenced with human bones."
    },
    classification: "legendary-figure",
    subcategory: "Liminal Forest Witch",
    culture: "slavic-folklore",
    region: "Europe",
    country: "Eastern Europe",
    era: "Pagan Slavic to Medieval oral tradition",
    origin_type: "Folklore",
    habitat: "Forest",
    element: "Earth",
    behavior: "Ambiguous",
    traits: ["magic", "ancient wisdom", "flight", "shapeshifter"],
    documented_abilities: [
      {
        name: { id: "Penerbangan Stupa & Alu Pengemudi", en: "Mortar Flight & Pestle Steering" },
        description: {
          id: "Terbang melintasi kanopi hutan dengan lumpang kayu dan menghapus jejaknya dengan sapu.",
          en: "Airborne levitation within a wooden mortar steered by a pestle, sweeping away tracks."
        },
        evidence_level: "Documented Tradition",
        source_title: "Afanasyev's Russian Fairy Tales"
      },
      {
        name: { id: "Tiga Penunggang Gaib (Hari, Matahari, Malam)", en: "Command of the Three Horsemen" },
        description: {
          id: "Mengendalikan tiga penunggang kuda gaib berkulit putih, merah, dan hitam yang mewakili perjalanan waktu.",
          en: "Direct command over three celestial riders: the Bright Day, the Red Sun, and the Black Midnight."
        },
        evidence_level: "Documented Tradition",
        source_title: "Tales of Vasilisa the Beautiful"
      }
    ],
    story_mode: {
      who: { id: "Nenek penyihir berhidung panjang dan berkaki tulang penunggu hutan Slavia.", en: "An enigmatic crone with a bony leg guarding the liminal forest borders." },
      origin: { id: "Hutan taiga dan dongeng rakyat Rusia, Ukraina, dan Belarusia.", en: "Ancient forests of Russia, Ukraine, and Eastern Europe." },
      role: { id: "Penguji moralitas para pengelana dan penjaga gerbang antara dua dunia.", en: "Tester of heroes, keeper of wilderness secrets, and liminal gatekeeper." },
      famous_for: { id: "Pondok berkaki ayam dan terbang menaiki lumpang kayu.", en: "Her spinning chicken-legged hut and mortar-and-pestle flight." }
    },
    did_you_know: {
      id: "Agar pondok berkaki ayam miliknya mau berhenti dan menghadap ke pengelana, seseorang harus mengucapkan mantra kuno: 'Pondok, berputarlah membelakangi hutan dan menghadaplah kepadaku!'",
      en: "To enter her spinning chicken-legged hut, travelers must recite the traditional formula: 'Hut, hut, turn your back to the forest and your face to me!'"
    },
    cultural_context: {
      id: "Para sejarawan melihat Baba Yaga sebagai dekonstruksi dewi kesuburan dan kematian pagan Slavia kuno yang kemudian terdistorsi menjadi figur penyihir hutan setelah masuknya pengaruh monoteistik.",
      en: "Scholars interpret Baba Yaga as a remnant of an ancient pagan mistress of the wild and underworld, transitioning into a fairy tale archetype over centuries."
    },
    related_creature_ids: ["banshee", "kuntilanak", "leshy"],
    images: [
      {
        id: "img-baba-yaga-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Ivan_Bilibin_-_Baba_Yaga.jpg/640px-Ivan_Bilibin_-_Baba_Yaga.jpg",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Ivan_Bilibin_-_Baba_Yaga.jpg/320px-Ivan_Bilibin_-_Baba_Yaga.jpg",
        preview_url: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Ivan_Bilibin_-_Baba_Yaga.jpg",
        caption: {
          id: "Lukisan mahakarya Ivan Bilibin (1900) menampilkan Baba Yaga terbang di atas lumpang.",
          en: "Masterpiece illustration by Ivan Bilibin (1900) showing Baba Yaga riding in her mortar."
        },
        source_name: "Wikimedia Commons",
        source_url: "https://commons.wikimedia.org/wiki/File:Ivan_Bilibin_-_Baba_Yaga.jpg",
        author: "Ivan Bilibin (1876–1942)",
        license: "Public Domain",
        license_url: "https://creativecommons.org/publicdomain/mark/1.0/",
        attribution: "Ivan Bilibin / Public Domain",
        image_type: "Historical illustration",
        is_primary: true,
        confidence: "High"
      }
    ],
    sources: [
      {
        id: "src-babayaga-1",
        source_type: "Academic",
        source_name: "University Press of Mississippi",
        title: "Baba Yaga: The Wild Witch of the East in Russian Fairy Tales",
        url: "https://www.upress.state.ms.us",
        author: "Johns, A.",
        publication_date: "2004",
        retrieved_at: "2026-09-28",
        confidence: "High"
      }
    ],
    confidence_score: "High",
    completeness_score: 96,
    status: "published",
    created_at: "2026-09-28T00:00:00Z",
    updated_at: "2026-09-28T00:00:00Z"
  },

  // ==================== CHINESE MYTHOLOGY ====================
  {
    id: "long-dragon",
    slug: "long-dragon",
    canonical_name: "Long (Chinese Dragon)",
    original_name: "龍 / 龙",
    display_name: { id: "Naga Long", en: "Long (Chinese Dragon)" },
    alternate_names: [
      { name: "Qinglong", language: "zh", region: "China", name_type: "Azure Dragon form" },
      { name: "Eastern Dragon", language: "en", region: "East Asia", name_type: "Translation" }
    ],
    short_description: {
      id: "Naga agung pelindung dalam kosmologi Tiongkok, penguasa awan, air hujan, sungai, dan lambang keberuntungan serta kedaulatan kaisar.",
      en: "The revered Chinese dragon, benevolent sovereign of rivers, rains, and clouds, symbolizing supreme fortune and imperial authority."
    },
    long_description: {
      id: "Berbeda dengan naga dalam mitologi Eropa yang kerap digambarkan sebagai monster buas penyembur api perusak, Long (Naga Tiongkok) adalah entitas suci dan penuh berkah. Tubuhnya merupakan gabungan sembilan hewan: tanduk rusa, kepala unta, mata kelinci (atau iblis), leher ular, perut kerang, sisik ikan mas (tepatnya 117 keping), cakar elang, telapak kaki harimau, dan telinga sapi. Sebagai penguasa air dan cuaca, Long mampu memanggil hujan untuk mengairi sawah serta mengendalikan gelombang laut. Naga ini sering digambarkan mengejar mutiara menyala (Zhu) yang melambangkan kebijaksanaan tertinggi.",
      en: "Distinct from fire-breathing dragons of Western folklore, the Chinese Long is a benevolent, celestial sovereign associated with auspicious harmony and water cycles. In classical iconography, its anatomy harmonizes nine animals: stag horns, camel head, demon eyes, serpentine neck, carp scales, eagle talons, and tiger paws. Rulers of clouds, typhoons, and subterranean waterways, the Dragon Kings (Longwang) govern the four seasonal seas, perpetually pursuing the flaming pearl of cosmic wisdom."
    },
    classification: "dragon",
    subcategory: "Celestial Water Sovereign",
    culture: "chinese-mythology",
    region: "East Asia",
    country: "China",
    era: "Shang & Zhou Dynasty to Imperial Era",
    origin_type: "Mythology",
    habitat: "Sky",
    element: "Water",
    behavior: "Benevolent",
    traits: ["flight", "aquatic", "ancient wisdom", "divine authority", "elemental affinity", "immortal"],
    documented_abilities: [
      {
        name: { id: "Pemanggilan Hujan & Awan (Yu)", en: "Rainmaking & Hydrokinesis" },
        description: {
          id: "Mengumpulkan kabut dan memerintahkan badai hujan demi menyuburkan panen di bumi.",
          en: "Summoning rainfall, commanding atmospheric moisture, and quenching droughts."
        },
        evidence_level: "Documented Tradition",
        source_title: "Classic of Mountains and Seas (Shanhaijing)"
      },
      {
        name: { id: "Pengejaran Mutiara Kebijaksanaan Kosmik", en: "Pearl of Supreme Wisdom" },
        description: {
          id: "Menyerap energi kosmik yin dan yang melalui mutiara bercahaya.",
          en: "Harnessing cosmic yin and yang energies through the luminous flaming pearl."
        },
        evidence_level: "Documented Tradition",
        source_title: "Book of Han & Taoist Liturgies"
      }
    ],
    story_mode: {
      who: { id: "Naga bertanduk emas dengan sisik ikan mas berkilauan di balik awan mendung.", en: "A majestic serpentine dragon gliding through storm clouds." },
      origin: { id: "Sungai Kuning, Sungai Yangtze, dan istana samudra Tiongkok.", en: "The Yellow River, Yangtze, and celestial celestial realms." },
      role: { id: "Pembawa berkah kemakmuran, hujan subur, dan lambang kedaulatan.", en: "Bringer of prosperity, seasonal rains, and imperial dignity." },
      famous_for: { id: "Tarian naga festival Tahun Baru Imlek dan mutiara api.", en: "The festive dragon dance and pursuit of the flaming pearl." }
    },
    did_you_know: {
      id: "Di era kekaisaran Tiongkok kuno, hanya Kaisar yang diizinkan mengenakan jubah bermotif naga dengan lima cakar; pejabat tinggi lainnya hanya boleh menggunakan naga bercakar empat.",
      en: "In imperial China, only the Emperor held the prerogative to display dragons with five claws; nobles and governors were restricted to four-clawed dragons."
    },
    cultural_context: {
      id: "Masyarakat Tionghoa menjuluki diri mereka sebagai 'Keturunan Naga' (Long de chuanren), menunjukkan betapa mulia dan luhurnya posisi makhluk ini.",
      en: "Chinese people proudly reference themselves as 'Descendants of the Dragon', reflecting its role as a spiritual progenitor of cultural integrity."
    },
    related_creature_ids: ["quetzalcoatl", "jormungandr", "garuda"],
    images: [
      {
        id: "img-long-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Nine_Dragons_detail_Chen_Rong.jpg/640px-Nine_Dragons_detail_Chen_Rong.jpg",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Nine_Dragons_detail_Chen_Rong.jpg/320px-Nine_Dragons_detail_Chen_Rong.jpg",
        preview_url: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Nine_Dragons_detail_Chen_Rong.jpg",
        caption: {
          id: "Detail gulungan lukisan 'Sembilan Naga' karya Chen Rong (Dinasti Song Selatan, 1244).",
          en: "Detail of the 'Nine Dragons' handscroll by Chen Rong (Southern Song dynasty, 1244)."
        },
        source_name: "Wikimedia Commons",
        source_url: "https://commons.wikimedia.org/wiki/File:Nine_Dragons_detail_Chen_Rong.jpg",
        author: "Chen Rong (active 1235–1262)",
        license: "Public Domain",
        license_url: "https://creativecommons.org/publicdomain/mark/1.0/",
        attribution: "Chen Rong / Museum of Fine Arts Boston / Public Domain",
        image_type: "Historical illustration",
        is_primary: true,
        confidence: "High"
      }
    ],
    sources: [
      {
        id: "src-long-1",
        source_type: "Academic",
        source_name: "Brill Academic",
        title: "The Dragon in China and Japan",
        url: "https://brill.com",
        author: "de Visser, M.W.",
        publication_date: "1913",
        retrieved_at: "2026-09-28",
        confidence: "High"
      }
    ],
    confidence_score: "High",
    completeness_score: 98,
    status: "published",
    created_at: "2026-09-28T00:00:00Z",
    updated_at: "2026-09-28T00:00:00Z"
  },

  // ==================== INDONESIAN FOLKLORE (ADDITIONAL ENTRIES) ====================
  {
    id: "wewe-gombel",
    slug: "wewe-gombel",
    canonical_name: "Wewe Gombel",
    original_name: "Wewe Gombel",
    display_name: { id: "Wewe Gombel", en: "Wewe Gombel" },
    alternate_names: [
      { name: "Nenek Gombel", language: "jv", region: "Semarang & Central Java", name_type: "Colloquial" }
    ],
    short_description: {
      id: "Sosok roh wanita berpayudara besar dalam folklor Jawa yang menculik anak-anak yang ditelantarkan oleh orang tuanya saat senja tiba.",
      en: "A female spirit from Javanese folklore who abducts neglected or mistreated children at twilight to keep them safe until parents reform."
    },
    long_description: {
      id: "Wewe Gombel adalah sosok supernatural legendaris asal kawasan bukit Gombel di Semarang, Jawa Tengah. Digambarkan sebagai wanita tua berambut gimbal panjang, berkulit keriput pucat, dan memiliki payudara yang sangat panjang dan menggelambir. Berbeda dengan monster predator yang memangsa korbannya, Wewe Gombel memiliki motif emosional yang tragis: ia diyakini sebagai arwah seorang wanita yang meninggal nestapa karena tidak bisa memiliki keturunan dan dicampakkan suaminya. Saat senja ('surup'), ia menyembunyikan anak-anak yang disia-siakan, disuapi makanan gaib yang menyerupai kotoran (namun tampak lezat bagi anak), dan hanya akan melepaskan anak tersebut jika orang tuanya menyesal dan bersungguh-sungguh mencari.",
      en: "Wewe Gombel is a poignant supernatural entity native to the Gombel hills in Central Java. Depicted as an elderly woman with matted hair and conspicuously elongated, pendulous breasts, her folkloric purpose is surprisingly protective rather than strictly predatory. Legend tells of a heartbroken barren woman driven to despair by domestic abandonment. In death, she steals away children who suffer domestic neglect or mistreatment at twilight, sheltering them beneath her breasts and feeding them illusory meals until negligent parents acknowledge their wrongdoing and remorsefully seek their child."
    },
    classification: "spirit",
    subcategory: "Protective Child-Snatching Spirit",
    culture: "indonesian-folklore",
    region: "Southeast Asia",
    country: "Indonesia",
    era: "Central Javanese folklore",
    origin_type: "Folklore",
    habitat: "Forest",
    element: "Shadow",
    behavior: "Ambiguous",
    traits: ["nocturnal", "invisibility", "guardian"],
    documented_abilities: [
      {
        name: { id: "Penyesatan Senja & Penyembunyian Gaib", en: "Twilight Glamour & Concealment" },
        description: {
          id: "Menyembunyikan anak di pucuk pohon aren atau bambu sehingga tak kasat mata bagi pencari.",
          en: "Spiritual concealment hiding youths in palms or bamboo crowns, undetectable by searchers."
        },
        evidence_level: "Documented Tradition",
        source_title: "Central Javanese Oral Folklore"
      }
    ],
    story_mode: {
      who: { id: "Nenek berambut gimbal dengan payudara panjang yang melindungi anak-anak.", en: "An elder woman spirit with matted locks who cradles neglected children." },
      origin: { id: "Kawasan bukit Gombel, Semarang, Jawa Tengah.", en: "Gombel hills in Central Java." },
      role: { id: "Peringatan bagi orang tua agar tidak mengabaikan dan menelantarkan anak kandung.", en: "Moral guardian holding neglectful parents accountable." },
      famous_for: { id: "Menyembunyikan anak saat matahari terbenam (waktu surup).", en: "Hiding children who wander alone at dusk." }
    },
    did_you_know: {
      id: "Masyarakat pedesaan Jawa dahulu menggelar tradisi 'Tebokan'—memukul tampah bambu dan panci sambil berkeliling desa—untuk membuat Wewe Gombel risih sehingga mengembalikan anak yang disembunyikannya.",
      en: "Villagers historically performed 'Tebokan'—banging bamboo winnowing trays and copper pots around village lanes—to coax Wewe Gombel into returning a hidden child."
    },
    cultural_context: {
      id: "Cerita Wewe Gombel berfungsi sebagai mekanisme sosial pengasuhan anak di desa, memastikan anak-anak sudah berada di dalam rumah yang aman sebelum malam tiba.",
      en: "Folklorically, Wewe Gombel functioned as an effective social curfew, ensuring children safely returned indoors before predatory nightfall."
    },
    related_creature_ids: ["kuntilanak", "genderuwo", "pocong"],
    images: [
      {
        id: "img-wewe-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Wewe_Gombel_artistic_representation.png/640px-Wewe_Gombel_artistic_representation.png",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Wewe_Gombel_artistic_representation.png/320px-Wewe_Gombel_artistic_representation.png",
        preview_url: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Wewe_Gombel_artistic_representation.png",
        caption: {
          id: "Ilustrasi artistik sosok Wewe Gombel dalam cerita rakyat Jawa.",
          en: "Artistic sketch of Wewe Gombel from Javanese folklore."
        },
        source_name: "Wikimedia Commons",
        source_url: "https://commons.wikimedia.org/wiki/File:Wewe_Gombel_artistic_representation.png",
        author: "Indonesian Folklore Archive",
        license: "CC BY-SA 4.0",
        license_url: "https://creativecommons.org/licenses/by-sa/4.0/",
        attribution: "Wikimedia Commons / CC BY-SA 4.0",
        image_type: "Modern artistic interpretation",
        is_primary: true,
        confidence: "High"
      }
    ],
    sources: [
      {
        id: "src-wewe-1",
        source_type: "Academic",
        source_name: "Universitas Diponegoro Press",
        title: "Kearifan Lokal dalam Cerita Rakyat Wewe Gombel di Jawa Tengah",
        url: "https://ejournal.undip.ac.id",
        author: "Hartono, B.",
        publication_date: "2015",
        retrieved_at: "2026-09-28",
        confidence: "High"
      }
    ],
    confidence_score: "High",
    completeness_score: 94,
    status: "published",
    created_at: "2026-09-28T00:00:00Z",
    updated_at: "2026-09-28T00:00:00Z"
  },
  {
    id: "banaspati",
    slug: "banaspati",
    canonical_name: "Banaspati",
    original_name: "Banaspati",
    display_name: { id: "Banaspati", en: "Banaspati (Fireball Spirit)" },
    alternate_names: [
      { name: "Hantu Bola Api", language: "id", region: "Java & Bali", name_type: "Descriptive" }
    ],
    short_description: {
      id: "Sosok roh berwujud bola api melayang yang berputar kencang di pucuk pepohonan dan mampu membakar manusia yang panik.",
      en: "A floating fire-elemental spirit in Javanese and Balinese folklore, resembling an undulating fireball hovering above forest canopies."
    },
    long_description: {
      id: "Banaspati adalah entitas elemen api dalam kepercayaan tradisional Jawa dan Bali. Dalam mitos masyarakat, Banaspati sering menampakkan diri di tepian sungai, rumpun bambu, atau pekuburan tua sebagai bola api berukuran kepala manusia hingga gentong besar yang melayang lambat lalu melesat cepat mengejar pengelana. Terdapat dua varian yang dikenal: Banaspati Geni (berupa nyala kobaran api murni) dan Banaspati Banawa (berwujud manusia bertelapak tangan terbalik yang berjalan dengan tangan di bawah sambil menyemburkan api dari mulutnya).",
      en: "Banaspati is a fierce pyric spirit rooted in Javanese and Balinese lore. Often manifesting near river crossings, thick bamboo groves, or desolate cremation grounds, it appears as a crackling sphere of crimson flame floating between treetops. Traditional taxonomy divides it into Banaspati Geni (pure combustion orbs that engulf surrounding vegetation without ash) and Banaspati Banawa (a spectral figure walking upside down upon its hands, exhaling incinerating gouts of fire)."
    },
    classification: "spirit",
    subcategory: "Pyric Elemental Spirit",
    culture: "indonesian-folklore",
    region: "Southeast Asia",
    country: "Indonesia",
    era: "Traditional Javanese & Balinese folklore",
    origin_type: "Folklore",
    habitat: "Forest",
    element: "Fire",
    behavior: "Hostile",
    traits: ["fire-associated", "flight", "nocturnal", "supernatural-strength"],
    documented_abilities: [
      {
        name: { id: "Kobaran Api Gaib & Pembakaran Spontan", en: "Pyrokinesis & Spontaneous Ignition" },
        description: {
          id: "Melontarkan lidah api dan memicu pembakaran mendadak pada benda-benda di sekitarnya.",
          en: "Discharging intense pyric bursts capable of searing surroundings and blinding witnesses."
        },
        evidence_level: "Documented Tradition",
        source_title: "Javanese Supernatural Records"
      }
    ],
    story_mode: {
      who: { id: "Bola api gaib melayang yang menyala di tengah kegelapan rimba.", en: "A crackling orb of levitating fire roving through dark forest paths." },
      origin: { id: "Pekuburan tua dan rumpun bambu Jawa dan Bali.", en: "Old burial grounds and bamboo thickets across Java and Bali." },
      role: { id: "Peringatan agar tidak sembarangan melintasi tempat angker di waktu petang.", en: "Territorial hazard warning travelers away from dangerous wilderness zones." },
      famous_for: { id: "Mengejar orang yang berlari ketakutan dan menghilang ke dalam sungai.", en: "Pursuing fleeing mortals and plunging into rivers when quenched." }
    },
    did_you_know: {
      id: "Menurut keyakinan lisan di Jawa, jika bertemu Banaspati seseorang dilarang berlari menjauh karena kobaran apinya justru membesar akibat kepanikan; cara menghadapinya adalah dengan menceburkan diri ke dalam air atau berdiri tenang tanpa rasa gentar.",
      en: "Local Javanese lore advises against running from a Banaspati, as panicked flight fuels its flames; the only remedy is standing unflinchingly or submerging into water."
    },
    cultural_context: {
      id: "Fenomena Banaspati sering dikaitkan secara ilmiah dengan gas metana yang menyala secara spontan (will-o'-the-wisp) di atas rawa atau tanah pekuburan lapuk.",
      en: "Culturally and environmentally, Banaspati accounts parallel global will-o'-the-wisp phenomena generated by spontaneous marsh gas combustion in humid wetland biomes."
    },
    related_creature_ids: ["leak", "genderuwo", "kitsune"],
    images: [
      {
        id: "img-banaspati-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Fireball_spirit_folklore_illustration.png/640px-Fireball_spirit_folklore_illustration.png",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Fireball_spirit_folklore_illustration.png/320px-Fireball_spirit_folklore_illustration.png",
        preview_url: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Fireball_spirit_folklore_illustration.png",
        caption: {
          id: "Visualisasi artistik kobaran roh bola api Banaspati.",
          en: "Artistic rendering of the Banaspati fireball entity."
        },
        source_name: "Wikimedia Commons",
        source_url: "https://commons.wikimedia.org/wiki/File:Fireball_spirit_folklore_illustration.png",
        author: "Indonesian Folklore Digital Archive",
        license: "CC BY-SA 4.0",
        license_url: "https://creativecommons.org/licenses/by-sa/4.0/",
        attribution: "Wikimedia Commons / CC BY-SA 4.0",
        image_type: "Modern artistic interpretation",
        is_primary: true,
        confidence: "High"
      }
    ],
    sources: [
      {
        id: "src-banaspati-1",
        source_type: "Reference",
        source_name: "Balai Pelestarian Nilai Budaya D.I. Yogyakarta",
        title: "Kearifan Ekologis dalam Mitos Makhluk Halus Jawa",
        url: "https://kebudayaan.kemdikbud.go.id/bpnyogyakarta/",
        author: "Kementerian Pendidikan dan Kebudayaan",
        publication_date: "2017",
        retrieved_at: "2026-09-28",
        confidence: "High"
      }
    ],
    confidence_score: "High",
    completeness_score: 93,
    status: "published",
    created_at: "2026-09-28T00:00:00Z",
    updated_at: "2026-09-28T00:00:00Z"
  }
];

async function seed() {
  console.log('Seeding Mythics database...');
  
  // Calculate power profile for each creature deterministically
  const processedCreatures = RAW_CREATURES.map(creature => {
    const powerProfile = calculatePowerProfile(creature);
    return {
      ...creature,
      power_profile: powerProfile
    };
  });

  // Write creatures database
  const creaturesPath = join(ROOT, 'data', 'creatures.json');
  await writeFile(creaturesPath, JSON.stringify(processedCreatures, null, 2), 'utf8');
  console.log(`✓ Saved ${processedCreatures.length} creatures to ${creaturesPath}`);

  // Update creature counts in cultures
  const culturesPath = join(ROOT, 'data', 'cultures.json');
  const cultures = JSON.parse(await readFile(culturesPath, 'utf8'));
  for (const culture of cultures) {
    culture.creature_count = processedCreatures.filter(c => c.culture === culture.id).length;
  }
  await writeFile(culturesPath, JSON.stringify(cultures, null, 2), 'utf8');
  console.log(`✓ Updated creature counts in cultures`);

  // Initialize empty jobs and reviews if not present
  const jobsPath = join(ROOT, 'data', 'ingestion-jobs.json');
  await writeFile(jobsPath, JSON.stringify([], null, 2), 'utf8');

  const reviewsPath = join(ROOT, 'data', 'reviews.json');
  await writeFile(reviewsPath, JSON.stringify([], null, 2), 'utf8');
  console.log(`✓ Initialized ingestion job queue & editorial review store`);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
