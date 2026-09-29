const L = (id, en) => ({ id, en });
export const lessons = [
  {
    id: "foundations",
    minutes: 5,
    title: L("Mitos, legenda, dan folklor", "Myth, legend, and folklore"),
    summary: L(
      "Mulai dengan memahami jenis cerita, lalu lihat apa yang dapat dipelajari dari sebuah kisah.",
      "Start with the kinds of stories, then discover what a story can teach us.",
    ),
    objectives: [
      L(
        "Membedakan mitos, legenda, dan folklor tanpa membuat batas yang kaku.",
        "Distinguish myth, legend, and folklore without imposing rigid boundaries.",
      ),
      L(
        "Membaca kisah sebagai bagian dari kehidupan sebuah komunitas.",
        "Read stories within the lives of the communities that tell them.",
      ),
    ],
    sections: [
      {
        title: L(
          "Cerita sebagai cara memahami dunia",
          "Stories as ways of understanding the world",
        ),
        text: L(
          "Dalam kajian budaya, mitos dapat membawa makna simbolik tentang asal-usul, tatanan dunia, dan hubungan manusia dengan yang sakral. Kata “mitos” di sini bukan vonis bahwa sebuah kepercayaan keliru. Kita mempelajari bagaimana sebuah cerita dimaknai oleh penuturnya, termasuk ketika tradisi itu masih hidup.",
          "In cultural study, myths can carry symbolic meanings about origins, the order of the world, and relationships with the sacred. “Myth” here is not a verdict that a belief is false. We ask what a story means to those who tell it, including communities where the tradition remains alive.",
        ),
      },
      {
        title: L(
          "Tiga istilah yang saling bersinggungan",
          "Three overlapping terms",
        ),
        text: L(
          "Legenda biasanya dilekatkan pada tokoh atau tempat tertentu dan dapat memuat unsur supernatural. Folklor mencakup wilayah yang lebih luas: cerita, kepercayaan, adat, pertunjukan, dan pengetahuan yang diwariskan. Pembagian ini membantu membaca, tetapi bukan kotak yang mutlak; penutur, penerjemah, dan peneliti dapat mengelompokkan kisah yang sama secara berbeda.",
          "Legends are often tied to particular people or places and may contain supernatural elements. Folklore is broader: stories, beliefs, customs, performances, and knowledge passed between people. These categories help us read, but are not absolute boxes; narrators, translators, and researchers may classify the same story differently.",
        ),
      },
      {
        title: L(
          "Makhluk adalah pintu masuk, bukan keseluruhan budaya",
          "A being is a doorway, not an entire culture",
        ),
        text: L(
          "Halaman makhluk di Mythics menghubungkan ringkasan, konteks, dan sumber. Sebuah label seperti “penjaga” atau “arwah” hanya alat penelusuran. Label itu tidak mewakili semua pandangan dalam suatu wilayah. Saat membaca dua versi yang berbeda, catat tempat, waktu, dan siapa yang menceritakannya sebelum memutuskan bahwa keduanya bertentangan.",
          "A Mythics entry connects a summary, context, and sources. A label such as “guardian” or “spirit” is a browsing aid. It does not represent every perspective in a region. When two versions differ, record their place, time, and narrator before deciding they contradict one another.",
        ),
      },
      {
        title: L("Latihan membaca", "Reading exercise"),
        text: L(
          "Buka halaman Garuda. Pisahkan tiga hal dalam catatanmu: ciri yang diceritakan, peran dalam tradisi, dan wujud dalam karya seni. Lalu tulis satu pertanyaan yang belum dijawab oleh ringkasannya. Kebiasaan ini mengubah kegiatan mengenali makhluk menjadi kegiatan memahami konteks.",
          "Open the Garuda entry. Separate three things in your notes: described features, a role in tradition, and appearance in an artwork. Then write one question the summary does not answer. This practice moves from recognizing a being to understanding its context.",
        ),
      },
    ],
    creatures: ["garuda", "barong"],
    sources: [
      [
        "Britannica Education · Myths, Legends and Epics",
        "https://elearn.eb.com/myths-legends-epics-activities/",
      ],
    ],
    quiz: {
      question: L(
        "Apa langkah terbaik ketika dua versi legenda berbeda?",
        "What is the best response when two versions of a legend differ?",
      ),
      options: [
        L(
          "Memilih versi yang paling dramatis.",
          "Choose the most dramatic version.",
        ),
        L(
          "Memeriksa konteks, penutur, dan sumber masing-masing.",
          "Examine the context, narrator, and source of each.",
        ),
        L(
          "Menganggap semua versi selain yang tertua keliru.",
          "Treat every version except the oldest as wrong.",
        ),
      ],
      answer: 1,
      explanation: L(
        "Perbedaan versi dapat mencerminkan konteks komunitas dan sejarah penceritaan. Usia atau popularitas saja tidak cukup untuk menilai sebuah versi.",
        "Different versions may reflect communities and storytelling histories. Age or popularity alone cannot determine the value of a version.",
      ),
    },
  },
  {
    id: "nusantara",
    minutes: 6,
    title: L("Nusantara: tradisi yang hidup", "Indonesia: living traditions"),
    summary: L(
      "Membaca cerita bersama seni, ruang, dan komunitas yang merawatnya.",
      "Read stories alongside the art, places, and communities that sustain them.",
    ),
    objectives: [
      L(
        "Memisahkan penggambaran modern dari fungsi budaya.",
        "Separate modern portrayals from cultural functions.",
      ),
      L(
        "Memahami mengapa konteks pertunjukan penting.",
        "Understand why the context of a performance matters.",
      ),
    ],
    sections: [
      {
        title: L(
          "Melampaui satu label “Indonesia”",
          "Beyond one label: “Indonesia”",
        ),
        text: L(
          "Kategori Nusantara dalam arsip ini adalah pintu penelusuran, bukan satu sistem kepercayaan tunggal. Setiap kisah perlu dibaca bersama keterangan tempat, komunitas, dan sumbernya. Tokoh bernama serupa pun dapat memiliki peran berbeda. Hindari mengubah satu versi lokal menjadi klaim tentang semua orang Indonesia.",
          "The Indonesian category in this archive is a browsing doorway, not one unified belief system. Read each story with its place, community, and source. Even similarly named beings may play different roles. Avoid turning one local account into a claim about everyone in Indonesia.",
        ),
      },
      {
        title: L(
          "Barong dan konteks pertunjukan",
          "Barong and performance context",
        ),
        text: L(
          "UNESCO membedakan tiga ranah tari tradisional Bali: sakral, semi-sakral, dan hiburan. Gerak, kostum, musik, serta konteks pertunjukan bekerja bersama. Karena itu, ketika melihat representasi Barong, tanyakan bentuk tari dan konteks yang sedang dibahas. Foto panggung wisata saja tidak dapat menjelaskan seluruh kehidupan ritual suatu komunitas.",
          "UNESCO distinguishes sacred, semi-sacred, and entertainment contexts in traditional Balinese dance. Movement, costume, music, and setting work together. When viewing a Barong representation, ask which performance and context are being discussed. A tourist-stage photograph cannot explain an entire community’s ritual life.",
        ),
      },
      {
        title: L("Garuda dalam seni Jawa", "Garuda in Javanese art"),
        text: L(
          "Koleksi The Metropolitan Museum of Art memuat arca “Krishna on Garuda” dari Jawa, sekitar abad ke-9. Objek ini menjadi titik berangkat konkret: kita dapat membandingkan gestur, bahan, dan susunan figur dengan representasi lain. Sebuah objek membantu melacak cara tokoh diwujudkan, tetapi tidak dengan sendirinya membuktikan setiap rincian cerita yang beredar.",
          "The Metropolitan Museum of Art holds a “Krishna on Garuda” sculpture from Java, around the ninth century. It offers a concrete starting point for comparing gestures, materials, and figures with other representations. An object helps trace how a being was portrayed, but does not by itself establish every detail of a circulating story.",
        ),
      },
      {
        title: L(
          "Latihan: dua lapisan dalam satu kisah",
          "Exercise: two layers in one story",
        ),
        text: L(
          "Bandingkan bagian konteks budaya dan adaptasi populer pada halaman Pocong atau Barong. Catat apa yang dinyatakan oleh sumber, lalu pisahkan kesan yang datang dari film, gim, atau ilustrasi. Bila sebuah rincian tidak memiliki rujukan jelas, tulis “perlu ditelusuri”, alih-alih menganggapnya tradisi yang seragam.",
          "Compare cultural context and popular adaptation in the Pocong or Barong entry. Record what a source states, then separate impressions that come from films, games, or illustrations. If a detail lacks a clear reference, mark it “needs investigation” instead of treating it as a uniform tradition.",
        ),
      },
    ],
    creatures: ["barong", "garuda", "pocong"],
    sources: [
      [
        "UNESCO · Three genres of traditional dance in Bali",
        "https://ich.unesco.org/en/RL/three-genres-of-traditional-dance-in-bali-00617",
      ],
      [
        "The Met · Krishna on Garuda",
        "https://www.metmuseum.org/art/collection/search/37609",
      ],
    ],
    quiz: {
      question: L(
        "Apa yang perlu ditanyakan saat melihat foto Barong?",
        "What should you ask when viewing a Barong photograph?",
      ),
      options: [
        L(
          "Konteks pertunjukan dan komunitas yang diwakilinya.",
          "The performance context and community it represents.",
        ),
        L("Berapa skor kekuatan makhluk itu?", "What is its power score?"),
        L(
          "Apakah tampilannya sama dengan gim terbaru?",
          "Does it resemble the newest game?",
        ),
      ],
      answer: 0,
      explanation: L(
        "Bentuk visual perlu dipahami dalam konteksnya. Skor editorial dan adaptasi populer tidak menggantikan pengetahuan tentang pertunjukan.",
        "Visual appearance needs context. Editorial scores and popular adaptations cannot replace knowledge of a performance.",
      ),
    },
  },
  {
    id: "symbols",
    minutes: 5,
    title: L(
      "Simbol dan perbandingan lintas budaya",
      "Symbols across cultures",
    ),
    summary: L(
      "Menemukan kemiripan tanpa menghapus perbedaan.",
      "Notice similarities while preserving differences.",
    ),
    objectives: [
      L(
        "Membandingkan fungsi dan konteks, bukan hanya bentuk fisik.",
        "Compare functions and contexts, not just appearance.",
      ),
      L(
        "Membedakan kemiripan motif dari bukti hubungan sejarah.",
        "Distinguish similar motifs from evidence of historical connections.",
      ),
    ],
    sections: [
      {
        title: L(
          "Bentuk serupa, makna berbeda",
          "Similar forms, different meanings",
        ),
        text: L(
          "Sayap, sisik, atau tubuh gabungan dapat menjadi titik awal perbandingan visual. Namun, kemiripan bentuk tidak otomatis berarti dua kisah berasal dari satu sumber. Hubungan sejarah memerlukan bukti tambahan: teks, jalur pertukaran, penanggalan, atau kajian yang menunjukkan bagaimana cerita berpindah.",
          "Wings, scales, or composite bodies can begin a visual comparison. Similar appearance does not automatically mean two stories share one source. Historical connections require further evidence: texts, exchange routes, dates, or research showing how stories traveled.",
        ),
      },
      {
        title: L(
          "Naga sebagai latihan perbandingan",
          "Dragons as a comparison exercise",
        ),
        text: L(
          "Materi pendidikan AMNH menjelaskan hubungan naga dalam tradisi Tiongkok dengan air dan hujan. Gunakan keterangan itu sebagai konteks saat membaca Long. Lalu buka makhluk berbentuk ular lain, seperti Jörmungandr, dan catat peran naratifnya berdasarkan sumber yang tercantum. Jangan menyamakan semua makhluk bersisik dengan naga penyembur api dalam fantasi modern.",
          "AMNH educational material describes connections between dragons in Chinese traditions, water, and rain. Use this context when reading about Long. Then open another serpentine being, such as Jörmungandr, and record its narrative role from the listed sources. Avoid equating every scaled being with the fire-breathing dragons of modern fantasy.",
        ),
      },
      {
        title: L(
          "Medusa: gambar juga memiliki sejarah",
          "Medusa: images have histories too",
        ),
        text: L(
          "Kajian The Met menunjukkan perubahan penggambaran Medusa dalam seni Yunani kuno. Dengan demikian, satu ilustrasi bukan potret tetap untuk seluruh masa. Saat membandingkan gambar, catat tanggal pembuatan dan jenis objeknya. Perubahan wujud dapat menjadi pertanyaan penelitian yang menarik, bukan kesalahan yang harus langsung diseragamkan.",
          "The Met’s study traces changes in depictions of Medusa in ancient Greek art. One illustration is therefore not a fixed portrait for every period. When comparing images, note their date and object type. Changing appearances can be a useful research question rather than an error to standardize away.",
        ),
      },
      {
        title: L(
          "Gunakan perbandingan secara kritis",
          "Use comparisons critically",
        ),
        text: L(
          "Fitur Bandingkan di Mythics menyandingkan atribut cerita. Angka kekuatan adalah ringkasan editorial untuk eksplorasi, bukan ukuran ilmiah atau klaim budaya sumber. Buat tabel catatanmu sendiri dengan kolom “wujud”, “peran”, “lingkungan”, dan “sumber”. Persamaan menjadi lebih bermakna ketika perbedaannya tetap terlihat.",
          "Mythics Compare places story attributes side by side. Power scores are editorial summaries for exploration, not scientific measures or claims made by source cultures. Make your own notes with columns for “form,” “role,” “environment,” and “source.” Similarities become more meaningful when differences remain visible.",
        ),
      },
    ],
    creatures: ["long-dragon", "jormungandr", "medusa"],
    sources: [
      [
        "AMNH · Dragon",
        "https://www.amnh.org/explore/ology/ology-cards/277-dragon",
      ],
      [
        "The Met · Medusa in Ancient Greek Art",
        "https://www.metmuseum.org/essays/medusa-in-ancient-greek-art",
      ],
    ],
    quiz: {
      question: L(
        "Dua makhluk sama-sama bersayap. Apa yang dapat disimpulkan?",
        "Two beings both have wings. What can you conclude?",
      ),
      options: [
        L(
          "Keduanya pasti berasal dari kisah yang sama.",
          "They must originate in the same story.",
        ),
        L(
          "Keduanya pasti memiliki fungsi budaya yang sama.",
          "They must have the same cultural function.",
        ),
        L(
          "Ada kemiripan visual; hubungan sejarah perlu bukti tambahan.",
          "They share a visual feature; a historical link needs further evidence.",
        ),
      ],
      answer: 2,
      explanation: L(
        "Motif yang mirip merupakan awal pertanyaan. Ia belum menjadi bukti perpindahan cerita atau kesamaan makna.",
        "A similar motif starts a question. It is not yet evidence of transmission or identical meaning.",
      ),
    },
  },
  {
    id: "reading",
    minutes: 5,
    title: L("Cara membaca arsip & sumber", "How to read archives & sources"),
    summary: L(
      "Panduan praktis membedakan bukti, tafsir, dan rekonstruksi.",
      "A practical guide to evidence, interpretation, and reconstruction.",
    ),
    objectives: [
      L(
        "Menilai apakah sumber benar-benar mendukung sebuah klaim.",
        "Assess whether a source supports a specific claim.",
      ),
      L(
        "Mengenali batas informasi, label, dan ilustrasi dalam arsip.",
        "Recognize the limits of information, labels, and illustrations in the archive.",
      ),
    ],
    sections: [
      {
        title: L("Sumber memiliki konteks", "Sources have contexts"),
        text: L(
          "Teks lama, objek museum, catatan lapangan, dan kajian modern menjawab pertanyaan yang berbeda. Sebuah objek primer dapat menunjukkan bentuk pada masa tertentu; penelitian sekunder dapat membantu menjelaskan sejarah penafsirannya. “Primer” tidak berarti lengkap atau bebas sudut pandang. Selalu catat siapa yang membuat sumber, kapan, dan untuk keperluan apa.",
          "Old texts, museum objects, field notes, and modern research answer different questions. A primary object may show an appearance at a particular time; secondary research may explain its interpretation. “Primary” does not mean complete or free from perspective. Always note who made a source, when, and for what purpose.",
        ),
      },
      {
        title: L(
          "Bacalah klaim, bukan hanya daftar pustaka",
          "Read the claim, not just the bibliography",
        ),
        text: L(
          "Adanya tautan rujukan tidak berarti semua kalimat pada halaman sudah dibuktikan oleh tautan itu. Buka sumber dan cari bagian yang mendukung rincian yang sedang dibaca. Label kualitas arsip merupakan alat editorial; ia bukan bukti bahwa makhluk supernatural benar-benar ada. Jika dukungan belum jelas, pertahankan ketidakpastian itu dalam catatanmu.",
          "A reference link does not mean it supports every sentence on a page. Open it and find the passage supporting the particular detail you are reading. Archive quality labels are editorial aids, not evidence that supernatural beings exist. If support is unclear, preserve that uncertainty in your notes.",
        ),
      },
      {
        title: L("Tentang visual dan atribusi", "Visuals and attribution"),
        text: L(
          "Enam ilustrasi editorial, termasuk Garuda, Kitsune, Jörmungandr, dan Barong, dibuat dengan AI untuk pengalaman membaca. Visual tersebut bukan artefak atau rekonstruksi ilmiah. Gambar dokumenter, jika tersedia, mengikuti keterangan sumber dan lisensinya masing-masing. Jangan menganggap semua gambar dalam arsip bebas dipakai; periksa atribusi dan ketentuan sumber sebelum menggunakannya kembali.",
          "Six editorial illustrations, including Garuda, Kitsune, Jörmungandr, and Barong, were generated with AI for the reading experience. They are not artifacts or scholarly reconstructions. Documentary images, where available, carry their own sources and licenses. Do not assume every image is free to reuse; check attribution and source terms first.",
        ),
      },
      {
        title: L(
          "Kebiasaan penjelajah yang baik",
          "A thoughtful explorer’s habits",
        ),
        text: L(
          "Simpan tokoh yang ingin dipelajari di Jurnal Saya. Untuk setiap tokoh, tuliskan satu hal yang diketahui, satu variasi cerita, dan satu pertanyaan terbuka. Gunakan tombol Bandingkan untuk menyusun pertanyaan, lalu kembali ke sumber untuk menilainya. Tradisi yang hidup layak dipahami melalui suara komunitasnya, bukan hanya melalui kategori yang dibuat arsip.",
          "Save beings you want to study in My Journal. For each one, write one supported detail, one variant, and one open question. Use Compare to frame questions, then return to sources to evaluate them. Living traditions deserve to be understood through their communities, not only through archive categories.",
        ),
      },
    ],
    creatures: ["garuda", "medusa"],
    sources: [
      [
        "The Met · Krishna on Garuda: contoh katalog objek / object catalogue example",
        "https://www.metmuseum.org/art/collection/search/37609",
      ],
      [
        "UNESCO · Living heritage: Balinese dance",
        "https://ich.unesco.org/en/RL/three-genres-of-traditional-dance-in-bali-00617",
      ],
    ],
    quiz: {
      question: L(
        "Apa arti ilustrasi berlabel “AI · ART” di Mythics?",
        "What does an illustration labeled “AI · ART” mean in Mythics?",
      ),
      options: [
        L(
          "Foto artefak bersejarah yang telah diverifikasi.",
          "A verified photograph of a historical artifact.",
        ),
        L(
          "Interpretasi visual kontemporer, bukan bukti sejarah.",
          "A contemporary visual interpretation, not historical evidence.",
        ),
        L(
          "Gambaran baku yang disepakati semua komunitas.",
          "A standard depiction agreed upon by every community.",
        ),
      ],
      answer: 1,
      explanation: L(
        "Ilustrasi editorial membantu suasana membaca. Untuk mempelajari ikonografi sejarah, gunakan objek dan sumber yang memiliki konteks jelas.",
        "Editorial illustrations support the reading experience. To study historical iconography, use objects and sources with clear context.",
      ),
    },
  },
];
