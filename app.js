/* CreatorKit by fanyafriliaa - web interaktif (tanpa server, data tersimpan di browser) */
'use strict';

/* ---------- util ---------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = v => { const x = parseFloat(String(v ?? '').replace(',', '.')); return isFinite(x) ? x : 0; };
const fmt = (v, d = 0) => (isFinite(v) ? v : 0).toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d });
const today = () => new Date().toISOString().slice(0, 10);
const dmy = iso => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ''); return m ? `${m[3]}/${m[2]}/${m[1]}` : (iso || ''); };
const uid = () => Math.random().toString(36).slice(2, 9);

/* ---------- daftar pilihan (dari sheet "Daftar") ---------- */
const L = {
  platform: ['Instagram', 'TikTok', 'Threads'],
  format: ['Reels', 'Carousel', 'Single Post', 'Story', 'Live', 'Video TikTok', 'Thread / Teks', 'Foto'],
  funnel: ['TOFU', 'MOFU', 'BOFU'],
  hook: ['Hasil / Angka', 'Kesalahan Umum', 'Rahasia / Penasaran', 'POV / Peran', 'Cara / Tutorial', 'Perbandingan', 'Mitos vs Fakta', 'Cerita / Pengakuan', 'Pertanyaan', 'Larangan (Jangan...)', 'Daftar / List', 'Opini Berani', 'Campur semua'],
  emosi: ['Penasaran', 'Harapan / Termotivasi', 'Takut ketinggalan (FOMO)', 'Relate / Merasa dimengerti', 'Kaget', 'Ingin praktis / cepat', 'Percaya / Yakin'],
  tujuan: ['Views & followers baru', 'Engagement & kepercayaan', 'Jualan / closing', 'Leads (DM / daftar kelas)', 'Campur']
};

/* ---------- bank hook (dari sheet "Bank Hook") ---------- */
const HOOKBANK = [
  ['Hasil / Angka', '[Peran] bisa dapat [hasil] cuma dari [cara sederhana]', 'IRT bisa dapat 1 juta pertama cuma dari sharing pengalaman'],
  ['Hasil / Angka', 'Dari [angka awal] ke [angka akhir] dalam [waktu]', 'Dari 0 ke 10 ribu followers dalam 60 hari, ini yang aku ubah'],
  ['Hasil / Angka', '[Angka] [hasil] dari 1 konten ini', '98 ribu views dari 1 carousel ini, dan aku bikinnya 15 menit'],
  ['Kesalahan Umum', 'Berhenti [kebiasaan] kalau mau [hasil]', 'Berhenti posting link affiliate doang kalau mau ada yang beli'],
  ['Kesalahan Umum', '[Angka] kesalahan yang bikin [masalah]', '3 kesalahan yang bikin kontenmu sepi padahal rajin upload'],
  ['Kesalahan Umum', 'Aku rugi [waktu/uang] karena [kesalahan]', 'Aku buang 3 bulan karena salah pilih niche'],
  ['Rahasia / Penasaran', 'Nggak ada yang ngasih tahu soal [topik] ini', 'Nggak ada yang ngasih tahu kalau caption itu lebih penting dari foto'],
  ['Rahasia / Penasaran', 'Ini alasan [hasil] kamu belum datang', 'Ini alasan komisi affiliate-mu masih nol'],
  ['Rahasia / Penasaran', 'Cara [hasil] yang jarang dibahas', 'Cara dapat ide konten 30 hari yang jarang dibahas'],
  ['POV / Peran', 'POV: kamu [peran] tapi [hal tak terduga]', 'POV: aku IRT tapi punya 10 karyawan AI'],
  ['POV / Peran', 'Kalau kamu [peran] dan [masalah], tonton ini', 'Kalau kamu ibu rumah tangga dan pengen punya penghasilan, tonton ini'],
  ['POV / Peran', 'Sehari jadi [peran] yang [aktivitas]', 'Sehari jadi IRT yang ngonten sambil ngurus 2 anak'],
  ['Cara / Tutorial', 'Cara [hasil] dalam [waktu] pakai [tools]', 'Cara bikin 10 hook dalam 1 menit pakai AI'],
  ['Cara / Tutorial', 'Kalau aku mulai [hal] dari 0 lagi, aku lakuin ini', 'Kalau aku mulai ngonten dari 0 lagi, aku lakuin 3 hal ini'],
  ['Cara / Tutorial', 'Simpan ini sebelum kamu [aktivitas]', 'Simpan ini sebelum kamu bikin konten jualan berikutnya'],
  ['Perbandingan', '[A] vs [B]: mana yang bikin [hasil]?', 'Posting tiap hari vs 3x seminggu: mana yang bikin akun naik?'],
  ['Perbandingan', 'Jangan tulis [X], tulis [Y]', 'Jangan tulis "murah kak", tulis "cukup 15 ribu buat sebulan"'],
  ['Perbandingan', 'Sebelum vs sesudah [perubahan]', 'Caption sebelum vs sesudah pakai rumus storytelling'],
  ['Mitos vs Fakta', 'Katanya [mitos]. Faktanya...', 'Katanya harus punya banyak followers buat dapat cuan. Faktanya...'],
  ['Mitos vs Fakta', '[Mitos] itu bohong, ini buktinya', '"Harus tampil muka" itu mitos, ini buktinya'],
  ['Cerita / Pengakuan', 'Aku hampir berhenti [hal], sampai...', 'Aku hampir berhenti ngonten, sampai 1 video ini tembus 100 ribu'],
  ['Cerita / Pengakuan', 'Jujur, aku dulu [kondisi]...', 'Jujur, aku dulu malu banget posting di depan teman sendiri'],
  ['Cerita / Pengakuan', 'Hari ini aku [momen penting]', 'Hari ini aku dapat komisi pertama, dan nominalnya bikin nangis'],
  ['Pertanyaan', 'Kamu termasuk yang [kebiasaan] nggak?', 'Kamu termasuk yang udah rajin posting tapi views tetap segitu-segitu aja?'],
  ['Pertanyaan', 'Kenapa [hal] padahal [kondisi]?', 'Kenapa kontenmu sepi padahal isinya bagus?']
];

/* ---------- profil brand (dari sheet "Profil Brand") ---------- */
const BRAND = [
  ['nama', 'Nama / Akun', '@namakamu - Rina, IRT 2 anak', 0],
  ['niche', 'Niche utama', 'Ngonten & cuan dari rumah untuk ibu rumah tangga', 0],
  ['audiens', 'Target audiens (spesifik)', 'IRT usia 25-40, punya HP, ingin penghasilan tambahan tanpa ninggalin anak', 1],
  ['masalah', 'Masalah terbesar audiens', 'Bingung mulai, malu tampil, konten sepi, takut nggak laku', 1],
  ['impian', 'Keinginan / impian audiens', 'Punya penghasilan sendiri dari rumah, dihargai, bisa bantu keuangan keluarga', 1],
  ['beda', 'Kenapa kamu beda (keunikan)', 'Aku juga IRT, mulai dari 0 followers, pakai AI biar cepat', 1],
  ['bukti', 'Bukti / hasil yang kamu punya', 'Dapat komisi affiliate pertama di bulan ke-2; 1 konten tembus 98rb views', 1],
  ['gaya', 'Gaya bahasa', 'Santai, hangat, pakai aku-kamu, sesekali emoji, tidak menggurui', 0],
  ['nilai', 'Nilai / prinsip', 'Jujur, tidak janji instan, ikhtiar + tawakal', 0],
  ['pilar1', 'Pilar konten 1', 'Hasil & bukti (cerita cuan dari rumah)', 0],
  ['pilar2', 'Pilar konten 2', 'Tutorial AI & prompt', 0],
  ['pilar3', 'Pilar konten 3', 'Tips affiliate', 0],
  ['pilar4', 'Pilar konten 4', 'Mindset & cerita perjalanan', 0],
  ['pilar5', 'Pilar konten 5', 'Promo produk / kelas', 0],
  ['produk', 'Produk / penawaran', 'Kelas online 14 hari bikin konten', 0],
  ['harga', 'Harga & bonus', 'Rp 179.000 + template + grup diskusi', 0],
  ['cta', 'CTA utama', 'Komen "MAU" untuk link kelas gratis', 0],
  ['ctakey', 'Kata kunci / link CTA', 'Komen MAU / link di bio', 0],
  ['platformUtama', 'Platform utama', 'Instagram, lalu TikTok & Threads', 0],
  ['terbukti', 'Konten yang TERBUKTI naik', 'Hasil konkret + peran spesifik, carousel JANGAN vs TULIS', 1],
  ['gagal', 'Konten yang TIDAK jalan', 'Curhat umum yang terlalu relatable tanpa hasil/manfaat', 1],
  ['hookTerbaik', 'Hook terbaikmu sejauh ini', '"Jangan cuma posting jualan, ceritain dulu..."', 0],
  ['hindari', 'Kata / gaya yang dihindari', 'Kata kasar, klaim "pasti kaya", bahasa terlalu formal', 0],
  ['kompetitor', 'Kompetitor / inspirasi', 'Akun edukasi ngonten untuk ibu-ibu', 0],
  ['catatan', 'Catatan lain', 'Jadwal ngonten malam setelah anak tidur', 1],
  ['fokus', 'Fokus saat ini (ganti tiap minggu / kampanye)', 'Misal: minggu ini fokus promo kelas, naikkan porsi BOFU', 1]
];


/* ---------- galeri gaya visual (resep 3D dipakai juga sebagai arahan visual non-3D) ---------- */
const STYLES = [
  { name: 'Low-poly pastel', emoji: '🧊', mood: 'lembut, ramah, seperti mainan', palette: ['#FFD6A5', '#CAFFBF', '#9BF6FF', '#FDFFB6'], three: 'geometri sedikit sisi dengan flatShading, MeshStandardMaterial, satu DirectionalLight hangat + HemisphereLight, bayangan lembut, kamera orbit pelan', cocok: 'tutorial pemula, intro channel, produk lucu' },
  { name: 'Neon cyberpunk', emoji: '🌃', mood: 'gelap, futuristik, energik', palette: ['#0B0F1A', '#FF2E97', '#00E5FF', '#7C4DFF'], three: 'material emissive + UnrealBloomPass, lantai reflektif, fog gelap, garis grid, kamera dolly cepat', cocok: 'teknologi, AI, demo yang bikin "wow"' },
  { name: 'Glassmorphism', emoji: '🫧', mood: 'bersih, premium, modern', palette: ['#E8EEFF', '#B8C7FF', '#FFFFFF', '#FF9ECF'], three: 'MeshPhysicalMaterial dengan transmission dan roughness rendah, bentuk membulat melayang, background gradien lembut, environment map', cocok: 'produktivitas, SaaS, tips UI/UX' },
  { name: 'Isometric mini-room', emoji: '🏠', mood: 'rapi, hangat, penuh detail kecil', palette: ['#FFE8D6', '#B7B7A4', '#6B705C', '#FFB4A2'], three: 'OrthographicCamera sudut isometrik, objek kecil dalam kubus ruangan, soft shadow, animasi loop kecil', cocok: 'storytelling, rutinitas harian, workspace' },
  { name: 'Wireframe blueprint', emoji: '📐', mood: 'teknis, jujur, edukatif', palette: ['#0D3B66', '#FAF0CA', '#F4D35E', '#EE964B'], three: 'EdgesGeometry / LineSegments putih di background biru, grid tipis, label teks kecil, animasi garis "digambar"', cocok: 'menjelaskan cara kerja, behind the code' },
  { name: 'Particle galaxy', emoji: '🌌', mood: 'megah, misterius', palette: ['#05010F', '#5B2A86', '#7AE7C7', '#F8F9FA'], three: 'THREE.Points dengan additive blending, noise di vertex shader, kamera orbit lambat, depth fog', cocok: 'intro dramatis, konsep AI, visualisasi data' },
  { name: 'Clay / toy 3D', emoji: '🧸', mood: 'lucu, empuk, hangat', palette: ['#FFB5A7', '#FCD5CE', '#F8EDEB', '#A2D2FF'], three: 'bentuk membulat (RoundedBox, Sphere), MeshStandardMaterial roughness tinggi, easing elastis, soft shadow', cocok: 'edukasi ringan, maskot, audiens pemula' },
  { name: 'Voxel / pixel 3D', emoji: '👾', mood: 'retro game, playful', palette: ['#2B2D42', '#8D99AE', '#EF233C', '#FFD166'], three: 'InstancedMesh kubus, palet terbatas, kamera orthographic, animasi membangun blok demi blok', cocok: 'gaming, progres, "bangun dari nol"' },
  { name: 'Holographic iridescent', emoji: '🔮', mood: 'futuristik, mengilap', palette: ['#0A0A1F', '#C77DFF', '#48CAE4', '#FFD6FF'], three: 'ShaderMaterial fresnel dengan gradien pelangi, background gelap, rotasi pelan, rim light', cocok: 'teaser, peluncuran, produk digital' },
  { name: 'Product turntable studio', emoji: '📦', mood: 'bersih, tepercaya, fokus produk', palette: ['#F5F5F5', '#E0E0E0', '#222222', '#FF6B35'], three: 'latar putih polos (cyclorama), softbox via RectAreaLight, lantai reflektif tipis, rotasi 360 derajat pelan, depth of field', cocok: 'affiliate, review produk, katalog' },
  { name: 'Synthwave sunset', emoji: '🌅', mood: 'retro 80an, nostalgia', palette: ['#2D00F7', '#F20089', '#FF8C42', '#FFD60A'], three: 'matahari gradien (ShaderMaterial), grid horizon bergerak, gunung low-poly, fog ungu-pink', cocok: 'motivasi, musik, intro nostalgia' },
  { name: 'Paper-cut layers', emoji: '✂️', mood: 'hangat, berdimensi, handmade', palette: ['#FDF0D5', '#C6D8D3', '#D81E5B', '#3A3335'], three: 'bidang datar bertumpuk di kedalaman Z berbeda, bayangan antar layer, parallax kamera geser', cocok: 'cerita, kutipan, carousel storytelling' },
  { name: 'Toon / cel shading', emoji: '🎌', mood: 'komik, ekspresif', palette: ['#FFFFFF', '#FF595E', '#1982C4', '#FFCA3A'], three: 'MeshToonMaterial dengan gradientMap 3 tingkat + outline (inverted hull), warna solid cerah', cocok: 'karakter, humor, penjelasan playful' }
];
const GAYA0 = 'Bebas (AI pilih)';
const gayaOpts = () => [GAYA0, ...STYLES.map(s => s.name)];
const styleOf = n => STYLES.find(s => s.name === n);

/* ---------- template jenis akun ---------- */
const ACCT_TYPES = {
  umum: { label: 'Umum (kosong)', emoji: '🌸', brand: {} },
  affiliate: {
    label: 'Affiliate (Shopee dll)', emoji: '🛍️', brand: {
      niche: 'Review jujur & rekomendasi produk (affiliate Shopee) yang berguna di kehidupan sehari-hari',
      audiens: 'Pembeli online yang ingin belanja hemat dan tidak mau salah beli',
      masalah: 'Takut salah beli, bingung banyak pilihan, ragu kualitas dan harga',
      impian: 'Dapat barang bagus dengan harga masuk akal tanpa kecewa',
      beda: 'Review apa adanya: kelebihan dan kekurangan sama-sama disebut',
      gaya: 'Santai, jujur, to the point, pakai aku-kamu',
      nilai: 'Transparan soal link affiliate, tidak melebih-lebihkan produk',
      pilar1: 'Review jujur (plus dan minus)', pilar2: 'Haul / racun belanja', pilar3: 'Perbandingan produk', pilar4: 'Tips pakai & hasil nyata', pilar5: 'Promo & flash sale (BOFU)',
      produk: 'Produk affiliate (isi kategori produkmu)', cta: 'Cek link di bio / keranjang kuning', ctakey: 'Link di bio',
      hindari: 'Klaim berlebihan, janji khasiat, diskon atau spesifikasi yang belum dicek', platformUtama: 'TikTok & Instagram, lalu Threads'
    }
  },
  tech3d: {
    label: 'Kreator Kode 3D (AI agent + Three.js)', emoji: '🧊', brand: {
      niche: 'Bikin video & animasi 3D pakai AI agent + kode (Three.js): dari prompt sampai jadi video',
      audiens: 'Kreator dan developer pemula yang penasaran bikin visual 3D tanpa software 3D yang berat',
      masalah: 'Takut koding, bingung mulai, hasil AI terlihat generik, tidak tahu cara mengubah kode jadi video',
      impian: 'Punya video 3D keren yang terlihat profesional dan bisa dibuat berulang dengan cepat',
      beda: 'Menunjukkan proses nyata: prompt ke agent, hasil kode, sampai render video, termasuk saat gagal',
      gaya: 'Santai, visual dulu baru penjelasan, istilah teknis dijelaskan dengan analogi sederhana',
      nilai: 'Jujur soal hasil dan batasan AI; tunjukkan prosesnya, bukan cuma hasil akhir',
      pilar1: 'Demo hasil (dari prompt jadi visual 3D)', pilar2: 'Tutorial prompt untuk agent koding', pilar3: 'Perbandingan gaya visual (low-poly, neon, glass, dll)', pilar4: 'Behind the code & troubleshooting', pilar5: 'Template / kelas / jasa (BOFU)',
      cta: 'Komen "3D" untuk dapat prompt-nya', ctakey: 'Komen 3D / link di bio',
      hindari: 'Jargon tanpa penjelasan, janji "jadi pro dalam sehari"', platformUtama: 'TikTok & Instagram Reels, lalu YouTube Shorts'
    }
  }
};

/* ---------- state ---------- */
const KEY = 'creatorkit.fanyafriliaa.v1';
const newAcct = (name = 'Akun 1', emoji = '🌸', handle = '', type = 'umum') => ({ id: uid(), name, emoji, handle, type, brand: {}, tools: {}, data: [], done: {}, cal: { rows: [] } });
function normalize(raw) {
  const st = { settings: Object.assign({ key: '', model: 'otomatis', mode: 'Cepat' }, raw && raw.settings), accounts: [], cur: '' };
  if (raw && Array.isArray(raw.accounts) && raw.accounts.length) {
    st.accounts = raw.accounts.map(a => Object.assign(newAcct(), a, { cal: Object.assign({ rows: [] }, a.cal) }));
    st.cur = raw.cur;
  } else { // data lama (satu akun) dipindah jadi Akun 1
    const a = newAcct('Akun 1');
    if (raw) { ['brand', 'tools', 'data', 'done'].forEach(k => { if (raw[k]) a[k] = raw[k]; }); if (raw.cal) a.cal = Object.assign({ rows: [] }, raw.cal); }
    st.accounts = [a];
  }
  if (!st.accounts.some(a => a.id === st.cur)) st.cur = st.accounts[0].id;
  return st;
}
const acct = () => S.accounts.find(a => a.id === S.cur) || S.accounts[0];
function wrap(st) { // S.brand, S.data, dst. otomatis menunjuk ke akun yang sedang dipilih
  ['brand', 'tools', 'data', 'done', 'cal'].forEach(k => Object.defineProperty(st, k, { get() { return acct()[k]; }, set(v) { acct()[k] = v; }, enumerable: false, configurable: true }));
  return st;
}
let S;
try { S = wrap(normalize(JSON.parse(localStorage.getItem(KEY) || 'null'))); } catch { S = wrap(normalize(null)); }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* storage penuh/diblokir */ } };

function setPath(path, val) {
  const ks = path.split('.'); let o = S;
  for (let i = 0; i < ks.length - 1; i++) { if (o[ks[i]] == null) o[ks[i]] = {}; o = o[ks[i]]; }
  o[ks.at(-1)] = val;
}

/* ---------- prompt helpers ---------- */
function brandCtx() {
  const lines = BRAND.map(([k, l]) => S.brand[k] && S.brand[k].trim() ? `- ${l}: ${S.brand[k].trim()}` : '').filter(Boolean);
  return lines.length ? lines.join('\n') : '(Profil Brand belum diisi. Minta aku melengkapinya bila perlu, jangan mengarang detail brand.)';
}
function memory() {
  const rows = computed().sort((a, b) => b.score - a.score);
  if (rows.length < 3) return '';
  const f = r => `"${r.judul}" (${r.platform}, ${r.format}, ${r.funnel}; views ${fmt(r.views)}, save ${fmt(r.saveRate, 2)}%, share ${fmt(r.shareRate, 2)}%, skor ${r.score})`;
  return '\nMEMORI AKUN (data nyata dari kontenku, pakai sebagai pelajaran):\n- Konten terbaik: ' + rows.slice(0, 3).map(f).join('; ') + '\n- Konten terlemah: ' + rows.slice(-3).map(f).join('; ') + '\n';
}
const PRE = () => `Kamu strategis konten media sosial berpengalaman untuk kreator Indonesia. Jawab dalam Bahasa Indonesia yang natural dan konkret, tanpa basa-basi dan tanpa janji hasil instan.

PROFIL BRAND SAYA:
${brandCtx()}
${memory()}`;
function gayaLine(i) {
  const st = styleOf(i.gaya);
  return st ? `- Gaya visual: ${st.name} (${st.mood}). Palet: ${st.palette.join(', ')}. Resep 3D: ${st.three}` : '- Gaya visual: bebas, pilihkan yang paling cocok dengan brand dan topik';
}
const extraLine = i => i.extra && i.extra.trim() ? `\nINSTRUKSI TAMBAHAN DARI SAYA (prioritaskan): ${i.extra.trim()}\n` : '';
const EXTRA = { k: 'extra', l: 'Instruksi tambahan (prompt bebas dari kamu)', t: 'area', ph: 'Misal: pakai gaya bercerita, jangan sebut harga, tampilkan hasil sebelum penjelasan...', wide: 1 };
const GAYA = { k: 'gaya', l: 'Gaya visual', t: 'select', o: gayaOpts() };
const orBrand = (v, k) => (v && String(v).trim()) || (S.brand[k] || '') || '(belum diisi)';

/* ---------- definisi tool ---------- */
const TOOLS = {
  riset: {
    emoji: '🧭', title: 'Riset Topik', stage: 'Riset',
    desc: 'Pakai saat BINGUNG MAU BAHAS APA. Hasil: daftar topik + skor potensi + kata kunci + Top 3. Pilih 1 topik, lalu bawa ke Ide Konten.',
    fields: [
      { k: 'niche', l: 'Niche / Bidang', t: 'text', ph: 'Kosong = pakai Profil Brand' },
      { k: 'audiens', l: 'Target Audiens', t: 'text', ph: 'Kosong = pakai Profil Brand' },
      { k: 'platform', l: 'Platform', t: 'select', o: L.platform },
      { k: 'tujuan', l: 'Tujuan Konten', t: 'select', o: L.tujuan },
      { k: 'kunci', l: 'Kata Kunci / Tema Awal', t: 'text', ph: 'cara pakai ChatGPT untuk pemula, AI untuk jualan online', wide: 1 },
      { k: 'tren', l: 'Hasil Cek Search Bar / Tren (opsional)', t: 'area', ph: 'Tempel saran search bar TikTok/IG/Google, atau topik yang lagi ramai', wide: 1 },
      { k: 'cek', l: 'Topik yang Mau Dicek (opsional)', t: 'text', ph: 'Satu topik yang ingin kamu uji potensinya', wide: 1 },
      { k: 'jumlah', l: 'Jumlah Topik', t: 'num', def: 10, min: 3, max: 30 }
    ],
    modes: [{
      id: 'main', label: 'Cari Topik', btn: '✨ Cari Topik', prompt: i => `${PRE()}
TUGAS: RISET TOPIK
- Niche: ${orBrand(i.niche, 'niche')}
- Target audiens: ${orBrand(i.audiens, 'audiens')}
- Platform: ${i.platform} | Tujuan konten: ${i.tujuan}
- Kata kunci / tema awal: ${i.kunci || '(bebas)'}
- Hasil cek search bar / tren dari saya: ${i.tren || '(tidak ada)'}
- Topik yang mau dicek: ${i.cek || '(tidak ada)'}

Buat ${i.jumlah} topik konten. Untuk tiap topik tulis:
1. Nomor + judul topik
2. Kenapa topik ini berpotensi untuk audiens saya
3. Kata kunci yang dicari orang
4. Skor potensi 0-100 + alasan singkat
5. Cocok di funnel TOFU / MOFU / BOFU
${i.cek ? 'Awali dengan penilaian jujur untuk "Topik yang mau dicek" (layak atau tidak, dan sudut yang lebih tajam).\n' : ''}Akhiri dengan TOP 3 topik yang sebaiknya dikerjakan lebih dulu.
Aturan: kamu tidak bisa melihat tren real-time. Jangan mengarang angka pencarian atau tren. Kalau saya tidak memberi data tren, tulis jelas "perlu dicek manual" dan berikan cara mengeceknya.`
    }],
    next: [{ to: 'ide', field: 'pilar', label: 'Ide Konten' }]
  },
  bedah: {
    emoji: '🔬', title: 'Bedah Konten Viral', stage: 'Riset',
    desc: 'Pakai saat MENEMUKAN KONTEN VIRAL orang lain (views jauh di atas followers-nya). Hasil: rumusnya + 3 versi untukmu.',
    fields: [
      { k: 'link', l: 'Link / Nama Akun', t: 'text', ph: '@akunorang atau link konten' },
      { k: 'platform', l: 'Platform', t: 'select', o: L.platform },
      { k: 'format', l: 'Format', t: 'select', o: L.format },
      { k: 'hook', l: 'Hook / Judul', t: 'text', ph: 'Kalimat pembuka konten itu', wide: 1 },
      { k: 'isi', l: 'Isi / Caption Singkat', t: 'area', ph: 'Ringkas isi kontennya', wide: 1 },
      { k: 'views', l: 'Views', t: 'num' }, { k: 'likes', l: 'Likes', t: 'num' }, { k: 'komen', l: 'Komentar', t: 'num' },
      { k: 'share', l: 'Share', t: 'num' }, { k: 'save', l: 'Save', t: 'num' }, { k: 'followers', l: 'Followers Akun', t: 'num' },
      { k: 'tujuanku', l: 'Tujuanku (mau diadaptasi untuk apa)', t: 'text', ph: 'Misal: cari followers baru', wide: 1 }
    ],
    modes: [{
      id: 'main', label: 'Bedah', btn: '✨ Bedah', prompt: i => `${PRE()}
TUGAS: BEDAH KONTEN VIRAL milik orang lain
- Akun/link: ${i.link || '-'} | Platform: ${i.platform} | Format: ${i.format}
- Hook / judul: ${i.hook || '-'}
- Isi singkat: ${i.isi || '-'}
- Angka: views ${fmt(num(i.views))}, likes ${fmt(num(i.likes))}, komentar ${fmt(num(i.komen))}, share ${fmt(num(i.share))}, save ${fmt(num(i.save))}, followers akun ${fmt(num(i.followers))}${num(i.followers) ? ` (views = ${fmt(num(i.views) / num(i.followers), 1)}x followers)` : ''}
- Tujuanku mengadaptasi: ${i.tujuanku || '(bebas)'}

Keluarkan:
1. KENAPA VIRAL: hook, struktur, emosi, format, dan angka yang menonjol
2. RUMUS yang bisa dipakai ulang (tulis sebagai template dengan [ ])
3. 3 VERSI ATM (Amati, Tiru, Modifikasi) untuk brand saya: masing-masing berisi hook, garis besar isi, CTA
4. Yang JANGAN ditiru (supaya tidak terlihat menyalin dan tetap sesuai gaya saya)`
    }],
    next: [{ to: 'ide', field: 'catatan', label: 'Ide Konten (catatan)' }]
  },
  ide: {
    emoji: '💡', title: 'Ide Konten', stage: 'Bikin Konten',
    desc: 'Pakai saat SUDAH PUNYA TOPIK, tapi belum tahu mau dibuat konten seperti apa. Hasil: beberapa ide siap produksi. Pilih 1, lanjut ke Hook & Studio.',
    fields: [
      { k: 'platform', l: 'Platform', t: 'select', o: L.platform },
      { k: 'format', l: 'Format', t: 'select', o: L.format },
      { k: 'funnel', l: 'Funnel', t: 'select', o: L.funnel },
      { k: 'jumlah', l: 'Jumlah Ide', t: 'num', def: 5, min: 1, max: 15 },
      GAYA,
      { k: 'pilar', l: 'Pilar / Topik', t: 'pilar', ph: 'Pilih pilar atau ketik topik', wide: 1 },
      { k: 'masalah', l: 'Masalah Audiens yang Disasar', t: 'text', ph: 'Misal: merasa tidak ada waktu sama sekali', wide: 1 },
      { k: 'catatan', l: 'Catatan Tambahan', t: 'area', wide: 1 },
      EXTRA
    ],
    modes: [{
      id: 'main', label: 'Ide', btn: '✨ Generate Ide', prompt: i => `${PRE()}
TUGAS: IDE KONTEN siap produksi
- Platform: ${i.platform} | Format: ${i.format} | Funnel: ${i.funnel}
- Pilar / topik: ${i.pilar || '(pilih dari pilar brand)'}
- Masalah audiens yang disasar: ${i.masalah || '(pilih dari Profil Brand)'}
- Catatan: ${i.catatan || '-'}
${gayaLine(i)}${extraLine(i)}
Buat ${i.jumlah} ide. Tiap ide berisi: nomor, judul konten, hook 1 kalimat, garis besar isi (3-5 poin), SARAN VISUAL singkat (apa yang tampil di layar/foto, gaya, warna), CTA yang cocok untuk funnel ${i.funnel}, alasan ide ini bisa jalan, tingkat usaha produksi (mudah/sedang/susah).
Akhiri dengan REKOMENDASI 1 ide terbaik dan alasannya.`
    }],
    next: [{ to: 'hook', field: 'topik', label: 'Hook' }, { to: 'studio', field: 'judul', label: 'Studio Konten' }]
  },
  hook: {
    emoji: '🎣', title: 'Hook', stage: 'Bikin Konten',
    desc: 'Pakai saat SUDAH PUNYA IDE, butuh kalimat pembuka yang bikin berhenti scroll. Pilih hook terbaik, lanjut ke Studio Konten.',
    fields: [
      { k: 'topik', l: 'Topik / Ide Konten', t: 'text', ph: 'Judul ide yang mau dibuatkan hook', wide: 1 },
      { k: 'platform', l: 'Platform', t: 'select', o: L.platform },
      { k: 'jenis', l: 'Jenis Hook', t: 'select', o: L.hook, def: 'Campur semua' },
      { k: 'emosi', l: 'Emosi yang Dituju', t: 'select', o: L.emosi },
      { k: 'jumlah', l: 'Jumlah', t: 'num', def: 10, min: 3, max: 30 },
      { k: 'catatan', l: 'Catatan', t: 'text', ph: 'Opsional' },
      EXTRA
    ],
    modes: [{
      id: 'main', label: 'Hook', btn: '✨ Generate Hook', prompt: i => {
        const refs = HOOKBANK.filter(h => i.jenis === 'Campur semua' || h[0] === i.jenis).slice(0, 6).map(h => `- ${h[1]}  (contoh: ${h[2]})`).join('\n');
        return `${PRE()}
TUGAS: HOOK pembuka (3 detik pertama / baris pertama)
- Topik / ide: ${i.topik || '(belum diisi)'}
- Platform: ${i.platform} | Jenis hook: ${i.jenis} | Emosi yang dituju: ${i.emosi}
- Catatan: ${i.catatan || '-'}
${extraLine(i)}
Rumus referensi (boleh dimodifikasi, jangan ditiru mentah):
${refs}

Buat ${i.jumlah} hook. Tiap hook: nomor, kalimat hook (maks 15 kata), teks layar yang disarankan, jenis hook.
Akhiri dengan 3 HOOK TERBAIK beserta alasan singkat kenapa bikin orang berhenti scroll.`;
      }
    }],
    next: [{ to: 'studio', field: 'hook', label: 'Studio Konten' }]
  },
  studio: {
    emoji: '🎬', title: 'Studio Konten', stage: 'Bikin Konten',
    desc: 'Pakai saat SIAP PRODUKSI. Hasil: script / slide / thread lengkap + caption & hashtag.',
    fields: [
      { k: 'judul', l: 'Ide / Judul Konten', t: 'text', wide: 1 },
      { k: 'platform', l: 'Platform', t: 'select', o: L.platform },
      { k: 'format', l: 'Format', t: 'select', o: L.format },
      { k: 'funnel', l: 'Funnel', t: 'select', o: L.funnel },
      { k: 'durasi', l: 'Durasi (detik) / Jumlah Slide', t: 'text', ph: '30 atau 8 slide' },
      GAYA,
      { k: 'hook', l: 'Hook Pilihan', t: 'text', wide: 1 },
      { k: 'poin', l: 'Poin Penting / Catatan', t: 'area', wide: 1 },
      { k: 'cta', l: 'CTA', t: 'text', ph: 'Kosong = pakai CTA utama Profil Brand', wide: 1 },
      EXTRA
    ],
    modes: [
      {
        id: 'isi', label: 'Isi / Script', btn: '✨ Isi', prompt: i => {
          const f = i.format;
          const bentuk = /Reels|Video|Live/.test(f) ? 'SCRIPT VIDEO per bagian: waktu (detik), visual/adegan, voiceover/ucapan, teks layar. Total sekitar ' + (i.durasi || '30') + ' detik.'
            : /Carousel/.test(f) ? 'SLIDE CAROUSEL: ' + (i.durasi || '8') + ' slide. Tiap slide: judul singkat + isi (maks 25 kata) + saran visual. Slide 1 = hook, slide terakhir = CTA.'
              : /Thread/.test(f) ? 'THREAD: 5-8 post bernomor, tiap post maks 500 karakter, post pertama = hook, terakhir = CTA.'
                : /Story/.test(f) ? 'STORY: 3-5 frame, tiap frame berisi teks + stiker interaktif yang disarankan (poll/pertanyaan).'
                  : 'KONSEP POST: teks di gambar, arahan visual, dan isi singkat.';
          return `${PRE()}
TUGAS: ISI KONTEN siap produksi
- Judul / ide: ${i.judul || '(belum diisi)'}
- Platform: ${i.platform} | Format: ${f} | Funnel: ${i.funnel}
- Hook pilihan: ${i.hook || '(buatkan hook terbaik)'}
- Poin penting / catatan: ${i.poin || '-'}
- CTA: ${orBrand(i.cta, 'cta')}
${gayaLine(i)}${extraLine(i)}
Tulis ${bentuk}
Pakai gaya bahasa dari Profil Brand dan hindari hal yang saya larang.`;
        }
      },
      {
        id: 'caption', label: 'Caption', btn: '✨ Caption', prompt: i => `${PRE()}
TUGAS: CAPTION & HASHTAG
- Judul / ide: ${i.judul || '(belum diisi)'}
- Platform: ${i.platform} | Format: ${i.format} | Funnel: ${i.funnel}
- Hook pilihan: ${i.hook || '-'}
- Poin penting: ${i.poin || '-'}
- CTA: ${orBrand(i.cta, 'cta')}
${extraLine(i)}
Buat 2 versi caption (pendek dan panjang) sesuai kebiasaan ${i.platform}, baris pertama harus kuat. Tambahkan 6-10 hashtag relevan (campur besar dan niche) dan 1 saran komentar pertama untuk memancing diskusi.`
      },
      {
        id: 'visual', label: 'Saran Visual', btn: '✨ Saran Visual', prompt: i => {
          const f = i.format;
          const arah = /Reels|Video|Live/.test(f) ? `SHOT LIST per adegan: waktu (detik), jenis shot (close-up/wide/POV/screen record), gerakan kamera, apa yang tampil, transisi, teks layar (gaya huruf & posisi), B-roll yang perlu disiapkan. Tambahkan saran musik/efek suara (mood saja), ide cover/thumbnail, dan kesalahan visual yang perlu dihindari.`
            : /Carousel/.test(f) ? `DESAIN PER SLIDE: tata letak (di mana judul, isi, visual), hirarki ukuran huruf, warna latar & teks (kode hex), ikon/ilustrasi yang cocok, konsistensi antar slide, desain slide cover yang bikin berhenti scroll, dan desain slide CTA. Beri pasangan font yang disarankan.`
              : /Foto|Single|Story/.test(f) ? `ARAHAN FOTO/GAMBAR: komposisi, sudut pengambilan, pencahayaan, properti, latar belakang, warna dominan (kode hex), teks di gambar (jika ada), dan cara mengeditnya agar rapi. Beri 2 alternatif konsep.`
                : `ARAHAN VISUAL: tampilan yang mendukung isi konten dan cara menyajikannya.`;
          return `${PRE()}
TUGAS: SARAN VISUAL
- Judul / ide: ${i.judul || '(belum diisi)'}
- Platform: ${i.platform} | Format: ${f} | Funnel: ${i.funnel}
- Hook pilihan: ${i.hook || '-'}
- Poin penting: ${i.poin || '-'}
${gayaLine(i)}${extraLine(i)}
Tulis ${arah}
Semua saran harus bisa dikerjakan pakai HP / alat sederhana kecuali saya minta lain. Jelaskan singkat kenapa tiap pilihan visual mendukung hook.`;
        }
      },
      {
        id: 'aset', label: 'Prompt Aset', btn: '✨ Prompt Aset', prompt: i => {
          const st = styleOf(i.gaya), three = !!st || acct().type === 'tech3d';
          return `${PRE()}
TUGAS: PAKET PROMPT ASET (siap tempel ke alat lain)
- Judul / ide: ${i.judul || '(belum diisi)'}
- Platform: ${i.platform} | Format: ${i.format} | Durasi/slide: ${i.durasi || '-'}
- Hook: ${i.hook || '-'}
${gayaLine(i)}${extraLine(i)}
Buat bagian berikut. Tiap bagian ditulis sebagai blok yang bisa langsung disalin:
${three ? `A. PROMPT UNTUK AGENT KODING (Claude Code / Cursor / sejenis): minta dibuatkan animasi 3D dengan Three.js dalam satu file HTML. Isi: tujuan scene, objek & geometri, material, pencahayaan, gerakan kamera per detik, timeline animasi, durasi, rasio 9:16 (1080x1920), 30 fps, loop mulus. Animasi harus berbasis waktu (bukan jumlah frame) supaya bisa dirender dengan hasil yang sama. Parameter penting (warna, durasi, teks) ditaruh di bagian atas file. Sertakan cara mengubahnya jadi video: render frame demi frame lalu gabung dengan ffmpeg, atau rekam layar. Tutup dengan kriteria "selesai".\n` : 'A. (dilewati, konten ini tidak memakai animasi 3D dari kode)\n'}B. PROMPT GAMBAR untuk cover / thumbnail / foto pendukung, bahasa Inggris: subjek, gaya, komposisi, pencahayaan, palet warna, rasio, dan hal yang harus dihindari. Beri 2 variasi.
C. PROMPT VIDEO AI per adegan (bahasa Inggris, klip 3-5 detik), hanya untuk adegan yang sulit direkam sendiri.
D. DAFTAR ASET yang perlu disiapkan (rekaman, foto, musik/SFX mood, font, ikon).
Jangan menyebut fitur alat yang tidak kamu yakini ada. Kalau ragu, tulis "cek di alatnya".`;
        }
      }
    ],
    next: []
  },
  kalender: {
    emoji: '🗓️', title: 'Kalender Konten', stage: 'Bikin Konten',
    desc: 'Pakai saat mau MERENCANAKAN BANYAK POSTING sekaligus (1-30 hari). Detail tiap konten tetap dikerjakan di Hook & Studio.',
    fields: [
      { k: 'mulai', l: 'Tanggal Mulai', t: 'date', def: () => today() },
      { k: 'periode', l: 'Periode (hari)', t: 'num', def: 14, min: 1, max: 30 },
      { k: 'platform', l: 'Platform', t: 'text', def: 'Instagram, TikTok, Threads' },
      { k: 'perhari', l: 'Posting per Hari', t: 'num', def: 1, min: 1, max: 3 },
      { k: 'fokus', l: 'Fokus / Promo', t: 'text', ph: 'Misal: buka kelas 14 hari tanggal 25', wide: 1 },
      { k: 'rasio', l: 'Rasio Funnel & Catatan', t: 'area', def: 'TOFU 60%, MOFU 30%, BOFU 10%. Carousel 2x seminggu.', wide: 1 }
    ],
    modes: [{
      id: 'main', label: 'Jadwal', btn: '✨ Isi Kalender', prompt: i => `${PRE()}
TUGAS: KALENDER KONTEN
- Mulai: ${dmy(i.mulai)} | Periode: ${i.periode} hari | Platform: ${i.platform} | Posting per hari: ${i.perhari}
- Fokus / promo: ${i.fokus || '(tidak ada)'}
- Rasio funnel & catatan: ${i.rasio}

Buat jadwal sebanyak periode x posting per hari. Keluarkan HANYA tabel dengan pemisah "|" dan kolom persis berikut, satu baris per posting, tanpa teks lain:
Tanggal | Hari ke | Platform | Format | Funnel | Pilar | Ide Konten | Hook | CTA
Pakai tanggal format DD/MM/YYYY. Variasikan format dan pilar, patuhi rasio funnel, taruh konten BOFU saat masa promo.`
    }],
    next: [], after: 'cal'
  },
  affiliate: {
    emoji: '🛍️', title: 'Konten Affiliate', stage: 'Bikin Konten',
    desc: 'Untuk akun affiliate (Shopee, TikTok Shop, dll). Masukkan link & detail produk, dapat banyak ide konten + saran visual (video atau foto) + CTA + caption. Web ini tidak membuka link-nya, jadi isi detail produk sendiri supaya AI tidak mengarang.',
    fields: [
      { k: 'produk', l: 'Nama Produk', t: 'text', ph: 'Misal: Tumbler 1 liter anti bocor', wide: 1 },
      { k: 'link', l: 'Link Affiliate', t: 'text', ph: 'https://s.shopee.co.id/...', wide: 1 },
      { k: 'marketplace', l: 'Marketplace', t: 'select', o: ['Shopee', 'TikTok Shop', 'Tokopedia', 'Lazada', 'Lainnya'] },
      { k: 'harga', l: 'Harga (opsional)', t: 'text', ph: 'Rp 89.000' },
      { k: 'fitur', l: 'Fitur / keunggulan / spesifikasi', t: 'area', ph: 'Salin dari halaman produk atau dari barang yang kamu pegang', wide: 1 },
      { k: 'untuk', l: 'Cocok untuk siapa', t: 'text', ph: 'Anak kos, pekerja kantoran, ibu baru...', wide: 1 },
      { k: 'bukti', l: 'Pengalaman / ulasan asli yang kamu punya (opsional)', t: 'area', ph: 'Cerita pemakaian nyata, kekurangan yang kamu temukan, ulasan pembeli yang bisa dipercaya', wide: 1 },
      { k: 'hasil', l: 'Bentuk konten', t: 'select', o: ['Campur video & foto', 'Video pendek', 'Foto / carousel'] },
      { k: 'platform', l: 'Platform', t: 'select', o: L.platform },
      { k: 'jumlah', l: 'Jumlah Ide', t: 'num', def: 10, min: 3, max: 30 },
      GAYA, EXTRA
    ],
    modes: [{
      id: 'main', label: 'Ide Affiliate', btn: '✨ Buat Ide Affiliate', prompt: i => `${PRE()}
TUGAS: IDE KONTEN AFFILIATE
- Produk: ${i.produk || '(belum diisi)'} (${i.marketplace}) | Harga: ${i.harga || 'tidak disebut'}
- Link affiliate (hanya untuk penempatan CTA, jangan menebak isi halaman dari link): ${i.link || '(belum diisi)'}
- Fitur / spesifikasi dari saya: ${i.fitur || '(tidak ada)'}
- Cocok untuk: ${i.untuk || '-'}
- Pengalaman / ulasan asli dari saya: ${i.bukti || '(tidak ada)'}
- Platform: ${i.platform} | Bentuk konten: ${i.hasil}
${gayaLine(i)}${extraLine(i)}
ATURAN KERAS:
1. Pakai HANYA data yang saya berikan. Jangan mengarang spesifikasi, harga, diskon, stok, klaim khasiat/kesehatan, atau testimoni. Kalau data kurang, tulis placeholder [ISI: ...].
2. Jangan berjanji hasil berlebihan. Sebut kekurangan produk bila saya memberikannya.
3. Ingatkan cara memberi tahu audiens bahwa ini link affiliate (misal tulisan "#ad" atau "link affiliate") dan cara menaruh link yang umum di ${i.platform}. Anggap panduan ini umum dan minta saya mengecek aturan terbaru platform.

Buat ${i.jumlah} ide dengan SUDUT yang berbeda-beda (review jujur, masalah-solusi, unboxing, sebelum-sesudah, perbandingan, haul/racun belanja, tips pakai, budget finds, mitos vs fakta, dll). Tiap ide berisi:
- Nomor + judul + sudut + bentuk (video / foto / carousel)
- Hook (maks 15 kata)
- Isi / alur singkat
- SARAN VISUAL: untuk video berupa shot list ringkas (adegan, sudut, teks layar); untuk foto/carousel berupa tata letak, properti, latar, dan warna
- CTA dan cara menaruh link
- Caption pendek + 5 hashtag
Akhiri dengan 3 ide yang paling mudah dibuat hari ini dan saran urutan posting 1 minggu.`
    }],
    next: [{ to: 'studio', field: 'judul', label: 'Studio Konten' }]
  },
  analisa: {
    emoji: '🧠', title: 'Analisa AI Akun', stage: 'Perbaiki',
    desc: 'Pola pemenang, yang harus distop, 3 eksperimen, dan strategi 14 hari berdasarkan data kontenmu.',
    fields: [{ k: 'tanya', l: 'Pertanyaan khusus (opsional)', t: 'text', ph: 'Misal: kenapa reels-ku kalah dari carousel?', wide: 1 }],
    modes: [{
      id: 'main', label: 'Analisa', btn: '✨ Analisa Akun', prompt: i => `${PRE()}
TUGAS: ANALISA AKUN berdasarkan data nyata.
${summaryText()}
DATA KONTEN (maks 40 terbaru):
${dataTable()}
${i.tanya ? `\nPERTANYAAN KHUSUS: ${i.tanya}\n` : ''}
Keluarkan:
1. POLA PEMENANG (apa yang sama dari konten skor tinggi)
2. YANG HARUS DISTOP (pola konten skor rendah)
3. 3 EKSPERIMEN dengan hipotesis dan cara ukurnya
4. STRATEGI 14 HARI (garis besar per hari/minggu)
5. Apa yang sebaiknya diisi di Riset Topik, Ide Konten dan Kalender untuk putaran berikutnya
Kalau data kurang dari 7 konten, katakan kesimpulannya masih sementara dan jangan melebih-lebihkan.`
    }],
    next: [], after: 'summary'
  }
};

function T(id) {
  const def = TOOLS[id];
  let t = S.tools[id];
  if (!t) t = S.tools[id] = { inputs: {}, results: {}, prompts: {}, saved: [] };
  def.fields.forEach(f => {
    if (t.inputs[f.k] === undefined) {
      const d = f.def !== undefined ? f.def : (f.t === 'select' ? f.o[0] : '');
      t.inputs[f.k] = typeof d === 'function' ? d() : d;
    }
  });
  return t;
}
const inp = id => T(id).inputs;

/* ---------- AI (Gemini langsung dari browser) ---------- */
const busy = {};
async function callAI(prompt) {
  const { key, model } = S.settings;
  if (!key) throw new Error('API Key belum diisi');
  const list = model === 'otomatis' ? ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash-lite'] : [model];
  let last = new Error('Gagal menghubungi AI');
  for (const m of list) {
    let r, j;
    try {
      r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.9 } })
      });
      j = await r.json();
    } catch (e) { last = new Error('Tidak bisa terhubung. Cek internet kamu.'); continue; }
    if (!r.ok) {
      last = new Error(j?.error?.message || `HTTP ${r.status}`);
      if (r.status === 400 && /API key/i.test(last.message)) throw new Error('API Key tidak valid. Cek lagi di Pengaturan.');
      continue; // coba model berikutnya (penuh / tidak tersedia)
    }
    const t = (j.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('');
    if (t) return t;
    last = new Error('AI mengembalikan jawaban kosong');
  }
  throw last;
}
const reviewPrompt = (p, out) => `Berikut tugas dan jawabanmu. Periksa sendiri: apakah ada yang tidak sesuai profil brand, terlalu umum, mengarang fakta, atau melanggar larangan? Perbaiki dan tulis versi final saja, tanpa komentar tambahan.\n\n=== TUGAS ===\n${p}\n\n=== JAWABAN AWAL ===\n${out}`;

async function runTool(id, mode) {
  const m = TOOLS[id].modes.find(x => x.id === mode), key = id + ':' + mode;
  if (busy[key]) return;
  if (!S.settings.key) { toast('Belum ada API Key. Isi di Pengaturan, atau pakai tombol 📋 Buat prompt.', 1); return; }
  const t = T(id); t.prompts[mode] = m.prompt(t.inputs);
  busy[key] = 1; render(true);
  try {
    let out = await callAI(t.prompts[mode]);
    if (S.settings.mode === 'Maksimal') out = await callAI(reviewPrompt(t.prompts[mode], out));
    t.results[mode] = out; toast('Selesai! Hasil ada di kolom Hasil.');
  } catch (e) { toast('Gagal: ' + e.message, 1); }
  delete busy[key]; save(); render(true);
}

/* ---------- hitung data konten ---------- */
function computed(src = S.data) {
  const d = src.map(r => {
    const views = num(r.views), inter = num(r.likes) + num(r.komen) + num(r.share) + num(r.save);
    const pct = v => views ? v / views * 100 : 0;
    const h = parseInt((r.jam || '').slice(0, 2), 10);
    const day = r.tgl ? ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date(r.tgl + 'T12:00:00').getDay()] : '';
    const slot = isNaN(h) ? '' : h < 5 ? 'Dini hari' : h < 11 ? 'Pagi' : h < 15 ? 'Siang' : h < 19 ? 'Sore' : 'Malam';
    return {
      ...r, views, leads: num(r.leads), er: pct(inter), saveRate: pct(num(r.save)), shareRate: pct(num(r.share)),
      komRate: pct(num(r.komen)), f1k: views ? num(r.follow) / views * 1000 : 0,
      retensi: num(r.durasi) && num(r.avgwatch) ? num(r.avgwatch) / num(r.durasi) * 100 : 0, day, slot
    };
  });
  const avg = (arr, f) => arr.length ? arr.reduce((s, x) => s + f(x), 0) / arr.length : 0;
  const base = {};
  L.platform.concat([...new Set(d.map(x => x.platform))]).forEach(p => {
    if (base[p]) return;
    const a = d.filter(x => x.platform === p), b = a.filter(x => x.funnel === 'BOFU');
    base[p] = { v: avg(a, x => x.views), s: avg(a, x => x.saveRate), sh: avg(a, x => x.shareRate), f: avg(a, x => x.f1k), l: avg(b, x => x.leads) };
  });
  const ratio = (v, a) => a > 0 ? Math.min(v / a, 2) : 1;
  d.forEach(r => {
    const b = base[r.platform] || {};
    r.idx = ratio(r.views, b.v);
    const parts = r.funnel === 'BOFU'
      ? [[ratio(r.leads, b.l), .5], [r.idx, .2], [ratio(r.saveRate, b.s), .15], [ratio(r.shareRate, b.sh), .15]]
      : [[r.idx, .35], [ratio(r.saveRate, b.s), .25], [ratio(r.shareRate, b.sh), .2], [ratio(r.f1k, b.f), .2]];
    r.score = Math.round(Math.max(0, Math.min(100, parts.reduce((s, [x, w]) => s + x * w, 0) * 50)));
    r.label = r.score >= 70 ? '🔥 Juara' : r.score >= 50 ? '👍 Oke' : r.score >= 35 ? '🔧 Perlu diperbaiki' : '🚨 Evaluasi';
    const tips = [];
    if (r.idx < .6) tips.push('Views rendah: perkuat hook 3 detik pertama & teks di layar');
    if (b.s && r.saveRate < b.s * .6) tips.push('Save rendah: bikin lebih praktis (langkah, template, daftar)');
    if (b.sh && r.shareRate < b.sh * .6) tips.push('Share rendah: angkat masalah spesifik audiens & sudut yang relate');
    if (r.views && r.komRate < .1) tips.push('Komentar sedikit: pakai pertanyaan atau CTA komen kata kunci');
    if (b.f && r.f1k < b.f * .6) tips.push('Follow rendah: tunjukkan konten berseri / alasan follow');
    if (r.retensi && r.retensi < 40) tips.push('Retensi rendah: potong intro, percepat tempo, buka loop penasaran');
    if (r.funnel === 'BOFU' && !r.leads) tips.push('BOFU tanpa leads: perjelas penawaran & CTA');
    r.diag = tips.length ? tips.join('. ') + '.' : (d.length < 3 ? 'Data masih sedikit, isi lebih banyak konten.' : 'Stabil. Ulangi formatnya dan uji variasi hook.');
  });
  return d;
}
function groupBy(rows, f) {
  const m = new Map();
  rows.forEach(r => { const k = f(r); if (!k) return; if (!m.has(k)) m.set(k, []); m.get(k).push(r); });
  const avg = (a, g) => a.reduce((s, x) => s + g(x), 0) / a.length;
  return [...m].map(([k, a]) => ({ k, n: a.length, views: avg(a, x => x.views), er: avg(a, x => x.er), save: avg(a, x => x.saveRate), share: avg(a, x => x.shareRate), f1k: avg(a, x => x.f1k), score: avg(a, x => x.score) })).sort((a, b) => b.score - a.score);
}
function summaryText() {
  const d = computed(); if (!d.length) return 'RINGKASAN: belum ada data konten.';
  const s = (f) => d.reduce((a, x) => a + f(x), 0);
  const pf = k => Math.round(d.filter(x => x.funnel === k).length / d.length * 100);
  const best = (f) => groupBy(d, f)[0]?.k || '-';
  return `RINGKASAN: ${d.length} konten${d.length < 7 ? ' (kurang dari 7, kesimpulan sementara)' : ''}. Total views ${fmt(s(x => x.views))}, rata views ${fmt(s(x => x.views) / d.length)}, rata ER ${fmt(s(x => x.er) / d.length, 1)}%, rata save ${fmt(s(x => x.saveRate) / d.length, 2)}%, rata share ${fmt(s(x => x.shareRate) / d.length, 2)}%, follow baru ${fmt(s(x => num(x.follow)))}, leads ${fmt(s(x => x.leads))}.
Porsi funnel: TOFU ${pf('TOFU')}%, MOFU ${pf('MOFU')}%, BOFU ${pf('BOFU')}% (patokan sehat 60/30/10).
Terbaik: platform ${best(x => x.platform)}, format ${best(x => x.format)}, funnel ${best(x => x.funnel)}, pilar ${best(x => x.pilar)}, hari ${best(x => x.day)}, slot jam ${best(x => x.slot)}.`;
}
function dataTable() {
  const d = computed().slice(-40);
  if (!d.length) return '(kosong)';
  return 'tanggal | platform | format | funnel | pilar | jenis hook | judul | views | ER% | save% | share% | follow/1K | leads | skor\n' +
    d.map(r => [dmy(r.tgl), r.platform, r.format, r.funnel, r.pilar || '-', r.jenisHook || '-', r.judul, fmt(r.views), fmt(r.er, 1), fmt(r.saveRate, 2), fmt(r.shareRate, 2), fmt(r.f1k, 1), r.leads, r.score].join(' | ')).join('\n');
}

/* ---------- UI kecil ---------- */
function toast(msg, warn) {
  const el = document.createElement('div'); el.className = 'toast' + (warn ? ' warn' : ''); el.textContent = msg;
  $('#toasts').appendChild(el); setTimeout(() => el.remove(), 3600);
}
async function copy(text) {
  try { await navigator.clipboard.writeText(text); }
  catch { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch { /* abaikan */ } t.remove(); }
  toast('Tersalin! Tinggal tempel 📋');
}
function download(name, text, type = 'text/plain') {
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: type + ';charset=utf-8' })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
const csv = rows => rows.map(r => r.map(c => '"' + String(c ?? '').replace(/"/g, '""') + '"').join(',')).join('\n');
const head = (t, p, e = '') => `<div class="page-head"><h1>${e} <span class="hl">${esc(t)}</span></h1><p>${p}</p><p style="margin-top:8px"><a href="#/akun" class="tag" style="text-decoration:none" title="Ganti akun">${acct().emoji} ${esc(acct().name)}</a></p></div>`;
const opts = (arr, cur) => arr.map(o => `<option ${o === cur ? 'selected' : ''}>${esc(o)}</option>`).join('');
const pilarList = () => [1, 2, 3, 4, 5].map(i => S.brand['pilar' + i]).filter(Boolean);
const funnelTag = f => `<span class="tag ${String(f).toLowerCase()}">${esc(f)}</span>`;

/* ---------- navigasi ---------- */
const NAV = [
  ['Mulai', [['home', '🏠', 'Panduan'], ['akun', '👥', 'Akun Saya'], ['settings', '⚙️', 'Pengaturan'], ['brand', '🧠', 'Profil Brand']]],
  ['Riset', [['riset', '🧭', 'Riset Topik'], ['bedah', '🔬', 'Bedah Viral']]],
  ['Bikin Konten', [['ide', '💡', 'Ide Konten'], ['affiliate', '🛍️', 'Konten Affiliate'], ['hook', '🎣', 'Hook'], ['studio', '🎬', 'Studio Konten'], ['kalender', '🗓️', 'Kalender']]],
  ['Ukur', [['data', '📈', 'Data Konten'], ['dashboard', '📊', 'Dashboard']]],
  ['Perbaiki', [['analisa', '🧠', 'Analisa AI']]],
  ['Contekan', [['gaya', '🎨', 'Galeri Gaya'], ['funnel', '🎯', 'Panduan Funnel'], ['bank', '🗂️', 'Bank Hook']]]
];
const STEPS = [
  ['Tahap 1 · Siapkan (sekali saja)', [['settings', 'Pengaturan', 'API Key + tes koneksi. Lewati kalau pakai cara manual 📋.'], ['brand', 'Profil Brand', 'Otak brand: audiens, masalah, gaya bahasa, 5 pilar, produk, CTA.']]],
  ['Tahap 2 · Riset (mau bikin apa?)', [['riset', 'Riset Topik', 'Daftar topik + skor potensi + Top 3.'], ['bedah', 'Bedah Konten Viral', 'Bedah konten viral orang lain, dapat rumus + 3 versi.']]],
  ['Tahap 3 · Bikin konten', [['ide', 'Ide Konten', 'Beberapa ide lengkap + rekomendasi terbaik.'], ['hook', 'Hook', 'Puluhan hook + teks layar + 3 terbaik.'], ['studio', 'Studio Konten', 'Script / slide / thread + caption & hashtag.'], ['kalender', 'Kalender', 'Jadwal sampai 30 posting.']]],
  ['Tahap 4 · Ukur (2-3 hari setelah posting)', [['data', 'Data Konten', 'Catat angka dari Insight: skor, label, diagnosa otomatis.'], ['dashboard', 'Dashboard', 'Ringkasan: platform, format, hook, pilar, hari & jam terbaik.']]],
  ['Tahap 5 · Perbaiki', [['analisa', 'Analisa AI', 'Pola pemenang, yang distop, 3 eksperimen, strategi 14 hari.']]]
];
const stepNo = (() => { let n = 0; const m = {}; STEPS.forEach(([, a]) => a.forEach(([id]) => m[id] = ++n)); return m; })();

function renderNav(cur) {
  $('#side').innerHTML = NAV.map(([g, items]) => `<h4>${g}</h4>` + items.map(([id, e, l]) =>
    `<a href="#/${id}" class="${id === cur ? 'on' : ''}" ${id === cur ? 'aria-current="page"' : ''}><span>${e}</span>${l}${S.done[id] ? '<span class="ck">✅</span>' : ''}</a>`).join('')).join('');
  const sel = $('#acctSel');
  sel.innerHTML = S.accounts.map(a => `<option value="${a.id}" ${a.id === S.cur ? 'selected' : ''}>${a.emoji} ${esc(a.name)}</option>`).join('') + '<option value="__new">➕ Kelola / tambah akun...</option>';
  const manual = !S.settings.key;
  const p = $('#modePill'); p.textContent = manual ? '📋 Mode manual' : '✨ Mode otomatis'; p.className = 'mode-pill' + (manual ? ' manual' : '');
}

/* ---------- views ---------- */
function viewHome() {
  const filled = BRAND.filter(([k]) => (S.brand[k] || '').trim()).length;
  const doneN = Object.values(S.done).filter(Boolean).length;
  return `
  <div class="card hero"><div>
    <h1>✨ CreatorKit <span class="hl">by fanyafriliaa</span></h1>
    <p>Riset topik, bedah konten viral, ide, hook, script, caption & kalender dalam satu tempat. Bisa <b>OTOMATIS</b> (✨ pakai API Gemini gratis milikmu) atau <b>MANUAL</b> (📋 buat prompt, salin ke ChatGPT / Gemini / Claude).</p>
    <div class="row" style="margin-top:14px">
      <a class="btn pink" href="#/${filled < 5 ? 'brand' : 'riset'}">${filled < 5 ? '🧠 Mulai: isi Profil Brand' : '🧭 Lanjut: Riset Topik'}</a>
      <a class="btn lilac" href="#/akun">👥 Kelola Akun (${S.accounts.length})</a>
      <a class="btn" href="#/settings">⚙️ Pengaturan</a>
    </div>
    <p class="small muted" style="margin-top:10px">by Fany Afrilia. Semua datamu tersimpan di browser ini saja.</p>
  </div>
  <div>
    <div class="sticky pink legend" style="margin:0"><b class="t">Cara pakai singkat</b>
    <div><span class="e">1️⃣</span> Isi Profil Brand sekali, makin spesifik makin tajam hasilnya.</div>
    <div><span class="e">2️⃣</span> Ikuti urutan tab dari atas ke bawah.</div>
    <div><span class="e">3️⃣</span> Tekan ✨ (otomatis) atau 📋 (salin prompt ke AI favoritmu).</div>
    <div><span class="e">4️⃣</span> Catat angka konten di Data Konten, lihat skornya di Dashboard.</div></div>
  </div></div>
  <div class="grid g3">
    <div class="stat"><div class="v">${filled}/${BRAND.length}</div><div class="l">Kolom Profil Brand terisi</div></div>
    <div class="stat"><div class="v">${S.data.length}</div><div class="l">Konten tercatat</div></div>
    <div class="stat"><div class="v">${doneN}/${Object.keys(stepNo).length}</div><div class="l">Langkah selesai</div></div>
  </div>
  <div class="card" style="margin-top:20px"><h2>🔄 Alur kerja</h2>
    <p class="muted small">Ikuti dari atas ke bawah. Centang kotak kalau langkahnya sudah kamu kerjakan.</p>
    ${STEPS.map(([t, a]) => `<div class="stage">${t}</div><ul class="steps">${a.map(([id, n, d]) => `
      <li class="${S.done[id] ? 'done' : ''}"><span class="no">${stepNo[id]}</span>
      <a href="#/${id}" style="text-decoration:none" class="what"><b>${n}</b><span>${d}</span></a>
      <label class="small" style="display:flex;gap:6px;align-items:center;font-weight:800"><input type="checkbox" data-act="done" data-id="${id}" ${S.done[id] ? 'checked' : ''}> Selesai</label></li>`).join('')}</ul>`).join('')}
  </div>
  <div class="card"><h2>🎨 Arti tanda</h2><div class="grid g2 small">
    <div>🌸 <b>Kolom pink</b>: tempat mengisi data</div><div>✨ <b>Tombol AI</b>: jalankan otomatis (perlu API Key)</div>
    <div>📋 <b>Buat prompt</b>: tanpa API, salin ke AI lalu tempel jawabannya</div><div>📝 <b>Kolom Hasil</b>: jawaban AI, bisa diedit & disimpan</div></div></div>`;
}


let acctForm = null; // null | 'new' | id akun yang diubah
const EMOJIS = ['🌸', '🎀', '⭐', '🍓', '🌈', '🐱', '🎧', '📚', '☕', '🦋', '🍋', '🌙', '🍑', '🧸', '🎨', '🛍️'];
const CARDBG = ['yellow', 'pink', 'mint', 'blue', 'lilac', 'orange'];
function viewAkun() {
  const rows = S.accounts.map(a => {
    const d = computed(a.data), n = d.length;
    return { a, n, avg: n ? d.reduce((s, x) => s + x.views, 0) / n : 0, sc: n ? d.reduce((s, x) => s + x.score, 0) / n : 0,
      filled: BRAND.filter(([k]) => (a.brand[k] || '').trim()).length, last: a.data.map(x => x.tgl).filter(Boolean).sort().at(-1) };
  });
  const ed = acctForm && acctForm !== 'new' ? S.accounts.find(a => a.id === acctForm) : null;
  return head('Akun Saya', 'Satu orang, banyak akun sosmed. Tiap akun punya Profil Brand, riset, ide, kalender, dan data konten sendiri, jadi hasil AI tidak tercampur.', '👥') + `
  <div class="row" style="margin-bottom:16px"><button class="btn pink" data-act="acctnew">➕ Tambah akun</button><span class="small muted">${S.accounts.length} akun terdaftar, tanpa batas jumlah.</span></div>
  ${acctForm ? `<form class="card" id="aform"><h2>${ed ? '✏️ Ubah akun' : '🌸 Akun baru'}</h2>
    <div class="grid g2 pink-field">
      <label class="f">Nama akun / brand ★<input name="name" type="text" required maxlength="40" value="${esc(ed?.name || '')}" placeholder="Misal: Toko Kue Fany"></label>
      <label class="f">Username (opsional)<input name="handle" type="text" maxlength="40" value="${esc(ed?.handle || '')}" placeholder="@namaakun"></label>
      ${ed ? '' : `<label class="f wide">Jenis akun<small>Template mengisi Profil Brand awal (bisa kamu ubah setelahnya)</small><select name="type">${Object.entries(ACCT_TYPES).map(([k, v]) => `<option value="${k}">${v.emoji} ${esc(v.label)}</option>`).join('')}</select></label>`}
      <div class="f wide">Ikon<div class="chips">${EMOJIS.map((e, i) => `<label class="chip" style="font-size:20px"><input type="radio" name="emoji" value="${e}" hidden ${(ed ? ed.emoji === e : i === S.accounts.length % EMOJIS.length) ? 'checked' : ''}>${e}</label>`).join('')}</div></div>
    </div>
    <div class="row" style="margin-top:14px"><button class="btn mint" type="submit">💾 Simpan</button><button class="btn" type="button" data-act="acctcancel">Batal</button></div></form>` : ''}
  <div class="grid gauto">${rows.map(({ a, n, filled, last }, i) => `
    <div class="card" style="margin:0;background:${a.id === S.cur ? 'var(--' + CARDBG[i % 6] + ')' : 'var(--paper)'}">
      <div class="row" style="flex-wrap:nowrap"><span style="font-size:34px">${a.emoji}</span>
        <div style="min-width:0"><h3 style="margin:0;overflow:hidden;text-overflow:ellipsis">${esc(a.name)}</h3><div class="small muted">${esc(a.handle || 'tanpa username')} · ${esc((ACCT_TYPES[a.type] || ACCT_TYPES.umum).label)}</div></div>
        ${a.id === S.cur ? '<span class="tag" style="margin-left:auto">aktif</span>' : ''}</div>
      <p class="small" style="margin:10px 0">Brand ${filled}/${BRAND.length} · ${n} konten</p>
      <div class="bar mint"><i style="width:${Math.round(filled / BRAND.length * 100)}%"></i></div>
      <div class="row" style="margin-top:12px">
        ${a.id === S.cur ? '' : `<button class="btn sm mint" data-act="acctpick" data-id="${a.id}">Pakai</button>`}
        <button class="btn sm blue" data-act="acctedit" data-id="${a.id}">Ubah</button>
        <button class="btn sm yellow" data-act="acctdup" data-id="${a.id}" title="Salin Profil Brand ke akun baru">Duplikat</button>
        <button class="btn sm orange" data-act="acctdel" data-id="${a.id}" aria-label="Hapus akun">Hapus</button></div></div>`).join('')}</div>
  <div class="card" style="margin-top:20px"><h2>📊 Perbandingan semua akun</h2>
    <div class="tablewrap"><table><thead><tr><th>Akun</th><th class="n">Konten</th><th class="n">Rata views</th><th class="n">Rata skor</th><th>Posting terakhir</th></tr></thead><tbody>
    ${rows.map(r => `<tr><td>${r.a.emoji} <b>${esc(r.a.name)}</b></td><td class="n">${r.n}</td><td class="n">${r.n ? fmt(r.avg) : '-'}</td><td class="n">${r.n ? Math.round(r.sc) : '-'}</td><td>${r.last ? dmy(r.last) : '-'}</td></tr>`).join('')}
    </tbody></table></div></div>`;
}

function viewGaya() {
  return head('Galeri Gaya Visual', 'Pilih gaya lalu pakai di Studio atau Konten Affiliate. Tiap gaya punya palet warna dan resep Three.js yang bisa disalin ke agent koding. Untuk konten non-3D, palet dan mood-nya tetap bisa jadi arahan desain.', '🎨') + `
  <div class="grid gauto">${STYLES.map((st, i) => `<div class="hookcard">
    <div class="pv"><canvas class="pvc" width="480" height="300" data-style="${esc(st.name)}" data-palette="${st.palette.join(',')}" role="img" aria-label="Preview 3D gaya ${esc(st.name)}"></canvas>
      <div class="pvbar"><button class="btn sm" data-act="pvplay">⏸ Jeda</button><button class="btn sm lilac" data-act="pvstage" data-i="${i}">📱 Mode rekam 9:16</button></div></div>
    <div class="f1" style="font-size:18px">${st.emoji} ${esc(st.name)}</div>
    <div class="row" style="gap:6px">${st.palette.map(c => `<span class="swatch" style="background:${c}" title="${c}"></span>`).join('')}<span class="small muted">${st.palette.join(' ')}</span></div>
    <div class="small"><b>Mood:</b> ${esc(st.mood)}</div>
    <div class="small"><b>Resep Three.js:</b> ${esc(st.three)}</div>
    <div class="small"><b>Cocok untuk:</b> ${esc(st.cocok)}</div>
    <div class="row"><button class="btn sm yellow" data-act="gayause" data-i="${i}">Pakai di Studio</button>
    <button class="btn sm mint" data-act="gayaaff" data-i="${i}">Pakai di Affiliate</button>
    <button class="btn sm" data-act="gayacopy" data-i="${i}">Salin resep</button></div></div>`).join('')}</div>`;
}

function viewSettings() {
  const s = S.settings;
  return head('Pengaturan', 'Isi sekali saja. API Key = kunci AI gratis milikmu sendiri.', '⚙️') + `
  <div class="card"><h2>🔑 API Gemini</h2>
    <div class="grid g2">
      <label class="f wide pink-field">API Key Gemini<small>Ambil di aistudio.google.com → Get API key → Create API key</small>
        <input type="password" id="apikey" autocomplete="off" data-bind="settings.key" data-live="1" value="${esc(s.key)}" placeholder="AIza..."></label>
      <label class="f pink-field">Model AI<small>"otomatis" = pilih model gratis terbaik & pindah sendiri kalau error/penuh</small>
        <select data-bind="settings.model">${opts(['otomatis', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash-lite'], s.model)}</select></label>
      <label class="f pink-field">Mode Kualitas<small>Cepat = 10-40 detik. Maksimal = AI memeriksa & memperbaiki sendiri (2x lebih lama, 2x kuota)</small>
        <select data-bind="settings.mode">${opts(['Cepat', 'Maksimal'], s.mode)}</select></label>
    </div>
    <div class="row" style="margin-top:14px"><button class="btn mint" data-act="test">✨ Tes koneksi</button>
      <button class="btn" data-act="showkey">👁️ Lihat / sembunyikan key</button><span id="testout" class="small muted"></span></div>
    <p class="small muted" style="margin-top:12px">🙋 Tidak mau pakai API? Lewati bagian ini. Pakai tombol 📋 di setiap tab, lalu salin prompt ke ChatGPT / Gemini / Claude.</p>
  </div>
  <div class="sticky orange"><b class="t">ℹ️ Tentang kuota gratis & privasi</b>
    <div class="small">• Key disimpan hanya di browser ini dan dikirim langsung ke Google (tidak lewat server lain). Jangan isi di komputer umum.<br>
    • Setiap orang memakai API Key sendiri, jadi kuotanya milik masing-masing. Ada batas per menit & per hari, kalau kena batas tunggu sebentar lalu coba lagi.<br>
    • Data yang dikirim lewat kuota gratis bisa dipakai Google untuk meningkatkan produknya. Jangan masukkan data rahasia.</div></div>
  <div class="card"><h2>💾 Cadangan data</h2>
    <p class="small muted">Data ada di browser. Kalau ganti HP/laptop atau bersihkan data browser, kamu butuh cadangan.</p>
    <div class="row"><button class="btn blue" data-act="export">⬇️ Unduh cadangan (JSON)</button>
    <label class="btn yellow" style="cursor:pointer">⬆️ Pulihkan dari file<input type="file" accept="application/json" data-act="import" hidden></label>
    <button class="btn orange" data-act="reset">🗑️ Hapus semua data</button></div></div>`;
}

function viewBrand() {
  const filled = BRAND.filter(([k]) => (S.brand[k] || '').trim()).length;
  return head('Profil Brand', 'Otak dari semua hasil AI. Isi selengkap & sespesifik mungkin. Teks abu-abu hanya contoh.', '🧠') + `
  <div class="sticky"><b class="t">Terisi ${filled} dari ${BRAND.length}</b>
    <div class="bar mint" style="margin-top:6px"><i style="width:${Math.round(filled / BRAND.length * 100)}%"></i></div></div>
  <div class="card"><div class="grid g2 pink-field">${BRAND.map(([k, l, ph, area]) => `
    <label class="f ${area || k === 'fokus' ? 'wide' : ''}">${esc(l)}
    ${area ? `<textarea rows="3" data-bind="brand.${k}" placeholder="${esc(ph)}">${esc(S.brand[k] || '')}</textarea>`
      : `<input type="text" data-bind="brand.${k}" value="${esc(S.brand[k] || '')}" placeholder="${esc(ph)}">`}</label>`).join('')}</div>
    <div class="row" style="margin-top:16px"><a class="btn pink" href="#/riset">Lanjut ke Riset Topik →</a></div></div>`;
}

function fieldHtml(id, f) {
  const path = `tools.${id}.inputs.${f.k}`, v = T(id).inputs[f.k];
  const cls = 'f' + (f.wide ? ' wide' : '');
  const bind = `data-bind="${path}"`;
  if (f.t === 'select') return `<label class="${cls}">${esc(f.l)}<select ${bind}>${opts(f.o, v)}</select></label>`;
  if (f.t === 'area') return `<label class="${cls}">${esc(f.l)}<textarea rows="3" ${bind} placeholder="${esc(f.ph || '')}">${esc(v)}</textarea></label>`;
  if (f.t === 'num') return `<label class="${cls}">${esc(f.l)}<input type="number" inputmode="decimal" ${bind} data-num="1" value="${esc(v)}" ${f.min != null ? `min="${f.min}" max="${f.max}"` : ''} placeholder="${esc(f.ph || '')}"></label>`;
  if (f.t === 'date') return `<label class="${cls}">${esc(f.l)}<input type="date" ${bind} value="${esc(v)}"></label>`;
  const list = f.t === 'pilar' ? 'list="dl-pilar"' : '';
  const pre = f.k === 'niche' || f.k === 'audiens' ? S.brand[f.k === 'niche' ? 'niche' : 'audiens'] : '';
  return `<label class="${cls}">${esc(f.l)}<input type="text" ${list} ${bind} value="${esc(v)}" placeholder="${esc(pre || f.ph || '')}"></label>`;
}

function viewTool(id) {
  const D = TOOLS[id], t = T(id), empty = !Object.values(S.brand).some(v => v && v.trim());
  return head(D.title, esc(D.desc), D.emoji) + `
  ${empty ? `<div class="sticky blue"><b class="t">Tips</b>Profil Brand masih kosong, hasil AI akan lebih umum. <a href="#/brand"><b>Isi dulu yuk →</b></a></div>` : ''}
  <datalist id="dl-pilar">${pilarList().map(p => `<option value="${esc(p)}">`).join('')}</datalist>
  <div class="card"><h2>🌸 Isi bahan</h2><div class="grid g2 pink-field">${D.fields.map(f => fieldHtml(id, f)).join('')}</div>
    <div class="row" style="margin-top:16px">
      ${D.modes.map(m => `<div class="modegrp"><button class="btn pink" data-act="run" data-t="${id}" data-m="${m.id}" ${busy[id + ':' + m.id] ? 'disabled' : ''}>${busy[id + ':' + m.id] ? '<span class="spin"></span> AI bekerja...' : m.btn}</button>
      <button class="btn blue" data-act="prompt" data-t="${id}" data-m="${m.id}">📋 ${D.modes.length > 1 ? esc(m.label) : 'Buat prompt'}</button></div>`).join('')}
    </div>
    <p class="small muted" style="margin:10px 0 0">${S.settings.key ? 'Mode otomatis aktif. Tombol ✨ butuh 10-40 detik.' : 'Belum ada API Key: pakai tombol 📋, lalu salin prompt ke AI favoritmu.'}</p>
  </div>
  ${D.modes.map(m => resultHtml(id, m, D)).join('')}
  ${D.after === 'cal' ? calHtml() : ''}${D.after === 'summary' ? `<div class="card"><h2>📊 Data yang dibaca AI</h2><pre class="small" style="white-space:pre-wrap;margin:0">${esc(summaryText())}</pre></div>` : ''}
  ${shelfHtml(id)}`;
}

function resultHtml(id, m, D) {
  const t = T(id), p = t.prompts[m.id], r = t.results[m.id] || '';
  return `<div class="card"><h2>📝 Hasil ${esc(m.label)}</h2>
  ${p ? `<div class="promptbox"><b>📋 Prompt siap salin</b>
    <pre>${esc(p)}</pre>
    <div class="row"><button class="btn sm yellow" data-act="copyprompt" data-t="${id}" data-m="${m.id}">Salin prompt</button>
    <a class="btn sm" target="_blank" rel="noopener" href="https://chatgpt.com/">ChatGPT ↗</a>
    <a class="btn sm" target="_blank" rel="noopener" href="https://gemini.google.com/">Gemini ↗</a>
    <a class="btn sm" target="_blank" rel="noopener" href="https://claude.ai/">Claude ↗</a></div>
    <p class="small muted" style="margin:8px 0 0">Tempel jawaban AI di kolom Hasil di bawah ini supaya tersimpan.</p></div>` : ''}
  <div class="result"><div class="rhead"><b>Jawaban</b>
    <button class="btn sm" data-act="copyres" data-t="${id}" data-m="${m.id}">Salin hasil</button>
    ${D.after === 'cal' ? `<button class="btn sm mint" data-act="parsecal" data-t="${id}" data-m="${m.id}">📥 Ubah jadi tabel</button>` : ''}
    <button class="btn sm lilac" data-act="saveshelf" data-t="${id}" data-m="${m.id}">💾 Simpan ke rak</button></div>
    <textarea class="paper" id="res-${id}-${m.id}" data-bind="tools.${id}.results.${m.id}" rows="12" placeholder="Hasil muncul di sini (otomatis ✨) atau tempel dari AI (📋)...">${esc(r)}</textarea>
    ${D.next.length && m.id === D.modes[0].id ? `<div class="row" style="margin-top:10px"><span class="small muted">Blok 1 baris pilihanmu, lalu kirim:</span>
      ${D.next.map(n => `<button class="btn sm yellow" data-act="send" data-t="${id}" data-m="${m.id}" data-to="${n.to}" data-f="${n.field}">➡️ Kirim ke ${esc(n.label)}</button>`).join('')}</div>` : ''}
  </div></div>`;
}

function shelfHtml(id) {
  const sv = T(id).saved;
  return `<div class="card"><h2>🗃️ Rak simpanan</h2>${sv.length ? `<div class="grid gauto">${sv.map((s, i) => `
    <div class="hookcard"><div class="f1">${esc(s.title)}</div><div class="small muted">${new Date(s.ts).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</div>
    <div class="row"><button class="btn sm blue" data-act="loadshelf" data-t="${id}" data-i="${i}">Buka</button><button class="btn sm orange" data-act="delshelf" data-t="${id}" data-i="${i}">Hapus</button></div></div>`).join('')}</div>`
    : '<div class="empty">Belum ada. Klik "Simpan ke rak" di atas supaya hasil bagus tidak hilang.</div>'}</div>`;
}

/* kalender: tabel yang bisa diedit */
const CALCOLS = [['tgl', 'Tanggal'], ['hari', 'Hari ke'], ['platform', 'Platform'], ['format', 'Format'], ['funnel', 'Funnel'], ['pilar', 'Pilar'], ['ide', 'Ide Konten'], ['hook', 'Hook'], ['cta', 'CTA']];
function calHtml() {
  const rows = S.cal.rows;
  return `<div class="card"><h2>📅 Tabel kalender</h2>
  <div class="row" style="margin-bottom:10px"><button class="btn sm mint" data-act="caladd">➕ Tambah baris</button>
    <button class="btn sm blue" data-act="calcsv" ${rows.length ? '' : 'disabled'}>⬇️ Unduh CSV</button>
    <button class="btn sm orange" data-act="calclear" ${rows.length ? '' : 'disabled'}>Kosongkan</button></div>
  ${rows.length ? `<div class="tablewrap"><table><thead><tr>${CALCOLS.map(c => `<th>${c[1]}</th>`).join('')}<th>Aksi</th></tr></thead><tbody>
    ${rows.map((r, i) => `<tr>${CALCOLS.map(([k]) => `<td><input type="text" data-bind="cal.rows.${i}.${k}" value="${esc(r[k] || '')}"></td>`).join('')}
    <td><button class="btn sm yellow" data-act="calstudio" data-i="${i}" title="Kerjakan di Studio Konten">🎬</button> <button class="btn sm orange" data-act="caldel" data-i="${i}" aria-label="Hapus baris">✕</button></td></tr>`).join('')}
  </tbody></table></div>` : '<div class="empty">Belum ada jadwal. Klik ✨ Isi Kalender atau 📋 prompt, lalu tekan "Ubah jadi tabel". Bisa juga tambah baris manual.</div>'}</div>`;
}
function parseCal(text) {
  const out = [];
  text.split('\n').forEach(line => {
    let c = line.includes('|') ? line.split('|') : line.includes('\t') ? line.split('\t') : null;
    if (!c) return;
    c = c.map(x => x.trim()); if (line.trim().startsWith('|')) c.shift(); if (line.trim().endsWith('|')) c.pop();
    if (c.length < 4 || c.every(x => /^[-: ]*$/.test(x)) || /^tanggal$/i.test(c[0])) return;
    const o = {}; CALCOLS.forEach(([k], i) => o[k] = c[i] || ''); out.push(o);
  });
  return out;
}

/* data konten */
const DEMO = [
  ['Instagram', 'Reels', 'TOFU', 'Tutorial AI & prompt', 'Cara / Tutorial', 'Cara bikin 10 hook dalam 1 menit pakai AI', 12500, 640, 48, 210, 520, 85, '19:30', 30, 21],
  ['Instagram', 'Carousel', 'TOFU', 'Hasil & bukti', 'Hasil / Angka', '98 ribu views dari 1 carousel', 9800, 410, 33, 150, 610, 60, '20:15', 0, 0],
  ['TikTok', 'Video TikTok', 'TOFU', 'Mindset & cerita', 'Cerita / Pengakuan', 'Aku hampir berhenti ngonten', 21000, 980, 120, 340, 410, 140, '21:00', 45, 18],
  ['Instagram', 'Reels', 'MOFU', 'Tips affiliate', 'Kesalahan Umum', '3 kesalahan yang bikin kontenmu sepi', 4300, 190, 25, 70, 160, 22, '12:10', 28, 19],
  ['Instagram', 'Carousel', 'MOFU', 'Tutorial AI & prompt', 'Daftar / List', '7 prompt caption jualan', 5200, 260, 40, 90, 480, 35, '20:00', 0, 0],
  ['TikTok', 'Video TikTok', 'TOFU', 'Hasil & bukti', 'POV / Peran', 'POV: IRT punya 10 karyawan AI', 8700, 330, 45, 120, 190, 55, '19:45', 35, 12],
  ['Instagram', 'Story', 'BOFU', 'Promo produk / kelas', 'Larangan (Jangan...)', 'Kelas 14 hari dibuka, sisa 20 kursi', 1900, 60, 15, 20, 40, 8, '08:30', 0, 0],
  ['Threads', 'Thread / Teks', 'MOFU', 'Mindset & cerita', 'Opini Berani', 'Posting tiap hari belum tentu bikin naik', 2400, 120, 38, 25, 60, 18, '13:00', 0, 0]
];
function demoRows() {
  const keys = ['platform', 'format', 'funnel', 'pilar', 'jenisHook', 'judul', 'views', 'likes', 'komen', 'share', 'save', 'follow', 'jam', 'durasi', 'avgwatch'];
  return DEMO.map((r, i) => { const o = { id: uid(), demo: 1, tgl: new Date(Date.now() - (DEMO.length - i) * 86400000 * 2).toISOString().slice(0, 10), hook: '', leads: r[2] === 'BOFU' ? 14 : 0 }; keys.forEach((k, j) => o[k] = r[j]); return o; });
}
const FORM = [
  ['tgl', 'Tanggal Upload ★', 'date'], ['jam', 'Jam Upload', 'time'], ['platform', 'Platform ★', 'sel', L.platform], ['format', 'Format ★', 'sel', L.format],
  ['funnel', 'Funnel ★', 'sel', L.funnel], ['pilar', 'Pilar Konten', 'pilar'], ['jenisHook', 'Jenis Hook', 'sel', L.hook, 1], ['durasi', 'Durasi Video (detik)', 'n'],
  ['judul', 'Judul / Topik ★', 'text', 0, 'w'], ['hook', 'Hook (kalimat pembuka) ★', 'text', 0, 'w'], ['cta', 'CTA', 'text', 0, 'w'],
  ['views', 'Views ★', 'n'], ['reach', 'Reach', 'n'], ['likes', 'Likes ★', 'n'], ['komen', 'Komentar ★', 'n'], ['share', 'Share ★', 'n'], ['save', 'Save ★', 'n'],
  ['follow', 'Follow Baru ★', 'n'], ['avgwatch', 'Rata-rata Tonton (detik)', 'n'], ['leads', 'Leads (klik/DM/komen) ★ untuk BOFU', 'n'], ['catatan', 'Catatan', 'text', 0, 'w']
];
let editId = null, formOpen = false;
function viewData() {
  const d = computed(), ed = S.data.find(x => x.id === editId) || { tgl: today(), platform: L.platform[0], format: L.format[0], funnel: 'TOFU' };
  return head('Data Konten', 'Isi 2-3 hari setelah posting. ★ = wajib. 1 baris = 1 konten. Skor & diagnosa dihitung otomatis.', '📈') + `
  <div class="row" style="margin-bottom:16px">
    <button class="btn pink" data-act="formtoggle">${formOpen || editId ? '✖ Tutup form' : '➕ Tambah konten'}</button>
    ${S.data.some(x => x.demo) ? '<button class="btn orange" data-act="rmdemo">Hapus data contoh</button>' : '<button class="btn yellow" data-act="demo">🧪 Muat data contoh</button>'}
    <button class="btn blue" data-act="datacsv" ${d.length ? '' : 'disabled'}>⬇️ Unduh CSV</button></div>
  ${formOpen || editId ? `<form class="card" id="dform"><h2>${editId ? '✏️ Ubah konten' : '🌸 Konten baru'}</h2>
    <datalist id="dl-pilar">${pilarList().map(p => `<option value="${esc(p)}">`).join('')}</datalist>
    <div class="grid g3 pink-field">${FORM.map(([k, l, t, o, w]) => {
    const v = ed[k] ?? '', c = 'f' + (w === 'w' ? ' wide' : '');
    return `<label class="${c}">${esc(l)}${t === 'sel' ? `<select name="${k}">${o ? '<option value="">-</option>' : ''}${opts(o, v)}</select>`
      : `<input name="${k}" type="${t === 'n' ? 'number' : t === 'pilar' ? 'text' : t}" ${t === 'n' ? 'min="0" step="any" inputmode="decimal"' : ''} ${t === 'pilar' ? 'list="dl-pilar"' : ''} value="${esc(v)}"></label>`}`;
  }).join('')}</div>
    <div class="row" style="margin-top:14px"><button class="btn mint" type="submit">💾 Simpan</button><button class="btn" type="button" data-act="formcancel">Batal</button></div></form>` : ''}
  <div class="card"><h2>📚 Daftar konten (${d.length})</h2>
  ${d.length ? `<div class="tablewrap"><table><thead><tr><th>Tanggal</th><th>Platform</th><th>Format</th><th>Funnel</th><th>Judul</th><th class="n">Views</th><th class="n">ER%</th><th class="n">Save%</th><th class="n">Share%</th><th class="n">Skor</th><th>Label</th><th>🔍 Diagnosa</th><th></th></tr></thead><tbody>
  ${d.slice().reverse().map(r => `<tr><td>${dmy(r.tgl)}${r.demo ? ' <span class="tag">contoh</span>' : ''}</td><td>${esc(r.platform)}</td><td>${esc(r.format)}</td><td>${funnelTag(r.funnel)}</td><td style="min-width:180px">${esc(r.judul)}</td>
  <td class="n">${fmt(r.views)}</td><td class="n">${fmt(r.er, 1)}</td><td class="n">${fmt(r.saveRate, 2)}</td><td class="n">${fmt(r.shareRate, 2)}</td>
  <td class="n"><span class="score" style="background:${r.score >= 70 ? 'var(--mint)' : r.score >= 50 ? 'var(--yellow)' : 'var(--pink)'}">${r.score}</span></td><td>${r.label}</td><td style="min-width:240px" class="small">${esc(r.diag)}</td>
  <td style="white-space:nowrap"><button class="btn sm blue" data-act="dedit" data-id="${r.id}" aria-label="Ubah">✏️</button> <button class="btn sm orange" data-act="ddel" data-id="${r.id}" aria-label="Hapus">✕</button></td></tr>`).join('')}
  </tbody></table></div>` : '<div class="empty">Belum ada konten. Tambah satu, atau coba "Muat data contoh" untuk melihat Dashboard hidup.</div>'}</div>`;
}

function viewDashboard() {
  const d = computed();
  if (!d.length) return head('Dashboard', 'Otomatis dari Data Konten (paling akurat setelah 7+ konten).', '📊') + `<div class="empty">Belum ada data konten. <a href="#/data"><b>Catat konten pertamamu →</b></a></div>`;
  const sum = f => d.reduce((a, x) => a + f(x), 0), n = d.length;
  const stats = [['Total konten', n], ['Total views', fmt(sum(x => x.views))], ['Rata-rata views', fmt(sum(x => x.views) / n)], ['Rata ER (%)', fmt(sum(x => x.er) / n, 1)], ['Rata Save (%)', fmt(sum(x => x.saveRate) / n, 2)], ['Rata Share (%)', fmt(sum(x => x.shareRate) / n, 2)], ['Total follow baru', fmt(sum(x => num(x.follow)))], ['Total leads', fmt(sum(x => x.leads))]];
  const G = { Platform: x => x.platform, Format: x => x.format, Funnel: x => x.funnel, 'Pilar': x => x.pilar, 'Jenis hook': x => x.jenisHook, Hari: x => x.day, 'Slot jam': x => x.slot };
  const best = Object.entries(G).map(([l, f]) => [l, groupBy(d, f)[0]?.k]).filter(x => x[1]);
  const pf = k => Math.round(d.filter(x => x.funnel === k).length / n * 100);
  const tgt = { TOFU: 60, MOFU: 30, BOFU: 10 };
  const sorted = d.slice().sort((a, b) => (a.tgl || '').localeCompare(b.tgl || ''));
  return head('Dashboard', `Skor 50 = rata-rata akunmu di platform yang sama. Konten jualan (BOFU) dinilai dari leads. ${n < 7 ? '<b>Baru ' + n + ' konten, kesimpulan masih sementara.</b>' : ''}`, '📊') + `
  <div class="grid g4">${stats.map(([l, v]) => `<div class="stat"><div class="v">${v}</div><div class="l">${l}</div></div>`).join('')}</div>
  <div class="grid g2" style="margin-top:20px">
    <div class="card"><h2>🏆 Yang paling jalan di akunmu</h2><div class="chips">${best.map(([l, v]) => `<span class="chip on"><small>${l}:</small> ${esc(v)}</span>`).join('')}</div></div>
    <div class="card"><h2>🎯 Porsi funnel</h2>${['TOFU', 'MOFU', 'BOFU'].map(k => `<div style="margin-bottom:8px"><div class="small"><b>${k}</b> ${pf(k)}% <span class="muted">(patokan ${tgt[k]}%)</span></div><div class="bar mint"><i style="width:${pf(k)}%"></i></div></div>`).join('')}</div></div>
  <div class="card"><h2>📈 Skor tiap konten</h2><div style="display:flex;align-items:flex-end;gap:6px;height:140px;overflow-x:auto;padding-bottom:4px">${sorted.map(r => `<div title="${esc(r.judul)}: ${r.score}" style="flex:1;min-width:26px;text-align:center"><div style="height:${Math.max(r.score, 4)}px;background:${r.score >= 70 ? '#6fd3a2' : r.score >= 50 ? '#ffe36e' : '#ff9ec3'};border:2px solid var(--ink);border-radius:6px 6px 0 0"></div><div class="small">${r.score}</div></div>`).join('')}</div></div>
  ${Object.entries(G).map(([l, f]) => { const g = groupBy(d, f); return g.length ? `<div class="card"><h2>${l}</h2><div class="tablewrap"><table><thead><tr><th>${l}</th><th class="n">Jumlah</th><th class="n">Rata views</th><th class="n">ER%</th><th class="n">Save%</th><th class="n">Share%</th><th class="n">Follow/1K</th><th>Rata skor</th></tr></thead><tbody>${g.map(r => `<tr><td><b>${esc(r.k)}</b></td><td class="n">${r.n}</td><td class="n">${fmt(r.views)}</td><td class="n">${fmt(r.er, 1)}</td><td class="n">${fmt(r.save, 2)}</td><td class="n">${fmt(r.share, 2)}</td><td class="n">${fmt(r.f1k, 1)}</td><td style="min-width:120px"><div class="bar"><i style="width:${Math.round(r.score)}%"></i></div> <span class="small">${Math.round(r.score)}</span></td></tr>`).join('')}</tbody></table></div></div>` : ''; }).join('')}
  <div class="row"><a class="btn pink" href="#/analisa">🧠 Minta analisa AI →</a></div>`;
}

function viewFunnel() {
  const cols = [
    ['TOFU (Menarik)', 'mint', 'Menjangkau orang baru & dapat follower', 'Luas, relate, hasil konkret, mengejutkan', '"IRT dapat 1 juta dari sharing"', 'Reels, TikTok, carousel hook kuat', 'Follow, share, save', 'Views, Share Rate, Follow /1K', '± 60%'],
    ['MOFU (Membangun Percaya)', 'yellow', 'Membuat orang percaya kamu bisa bantu', 'Cara, tutorial, proses, bukti, studi kasus', '"3 langkah aku mulai affiliate"', 'Carousel tutorial, thread, live', 'Komen kata kunci, ikut kelas gratis', 'Save Rate, Komentar, Retensi', '± 30%'],
    ['BOFU (Jualan)', 'pink', 'Mengubah follower jadi pembeli', 'Penawaran, testimoni, bonus, batas waktu', '"Kelas 14 hari dibuka, sisa 20 kursi"', 'Story, single post, live, carousel testimoni', 'Klik link, DM, daftar sekarang', 'Klik link / DM, penjualan', '± 10% (naikkan saat masa promo)']
  ];
  const lb = ['Tujuan', 'Ciri konten', 'Contoh topik', 'Format cocok', 'CTA', 'Metrik utama', 'Porsi disarankan'];
  const met = [
    ['Views & Indeks Views', 'Seberapa luas konten disebar. Indeks 1,0 = rata-rata akunmu.', 'Perkuat hook 3 detik pertama & teks di layar'],
    ['ER (%)', 'Total interaksi dibagi views', 'Tambah pertanyaan / ajakan di akhir'],
    ['Save Rate (%)', 'Konten dianggap bernilai, mau dibuka lagi', 'Bikin lebih praktis: langkah, template, daftar'],
    ['Share Rate (%)', 'Orang merasa "ini gue banget" / perlu dikirim ke teman', 'Angkat masalah spesifik audiens & sudut yang relate'],
    ['Komentar Rate (%)', 'Konten memancing obrolan', 'Opini berani, pertanyaan, CTA komen kata kunci'],
    ['Follow per 1K Views', 'Penonton jadi pengikut', 'Tunjukkan konten berseri / alasan follow'],
    ['Retensi (%)', 'Berapa lama video ditonton', 'Potong intro, percepat tempo, buka loop penasaran'],
    ['Skor (0-100)', 'Gabungan Views, Save, Share, Follow dibanding rata-ratamu sendiri', 'Lihat poin yang paling rendah, perbaiki itu dulu']
  ];
  return head('Panduan Funnel Konten', 'Supaya konten tidak cuma ramai, tapi juga menghasilkan.', '🎯') + `
  <div class="grid g3">${cols.map(c => `<div class="card" style="background:var(--${c[1]})"><h2>${c[0]}</h2>${lb.map((l, i) => `<p style="margin:0 0 8px"><b>${l}</b><br>${c[i + 2]}</p>`).join('')}</div>`).join('')}</div>
  <div class="card"><h2>📏 Arti metrik</h2><div class="tablewrap"><table><thead><tr><th>Metrik</th><th>Artinya</th><th>Kalau rendah, coba...</th></tr></thead><tbody>${met.map(m => `<tr><td><b>${m[0]}</b></td><td>${m[1]}</td><td>${m[2]}</td></tr>`).join('')}</tbody></table></div></div>`;
}

let bankF = 'Semua', bankQ = '';
function viewBank() {
  const types = ['Semua', ...new Set(HOOKBANK.map(h => h[0]))];
  const list = HOOKBANK.filter(h => (bankF === 'Semua' || h[0] === bankF) && (h[1] + ' ' + h[2]).toLowerCase().includes(bankQ.toLowerCase()));
  const hi = s => esc(s).replace(/\[([^\]]+)\]/g, '<span class="fill">[$1]</span>');
  return head('Bank Hook', 'Rumus hook siap pakai. Ganti bagian [ ] dengan versimu. Cocok juga untuk teks cover/thumbnail.', '🗂️') + `
  <div class="card"><label class="f">Cari rumus<input type="text" id="bankq" value="${esc(bankQ)}" placeholder="Ketik: angka, POV, mitos..."></label>
  <div class="chips" style="margin-top:12px">${types.map(t => `<button class="chip ${t === bankF ? 'on' : ''}" data-act="bankf" data-v="${esc(t)}">${esc(t)}</button>`).join('')}</div></div>
  <div class="grid gauto">${list.map(h => `<div class="hookcard"><span class="tag">${esc(h[0])}</span><div class="f1">${hi(h[1])}</div><div class="ex">Contoh: ${esc(h[2])}</div>
  <div class="row"><button class="btn sm yellow" data-act="bankcopy" data-v="${esc(h[1])}">Salin rumus</button><button class="btn sm mint" data-act="bankuse" data-v="${esc(h[2])}">Pakai di Hook</button></div></div>`).join('') || '<div class="empty">Tidak ada yang cocok.</div>'}</div>`;
}

const VIEWS = {
  home: viewHome, akun: viewAkun, gaya: viewGaya, settings: viewSettings, brand: viewBrand, dashboard: viewDashboard, data: viewData, funnel: viewFunnel, bank: viewBank
};
let pvMod = null, stageStop = null;
const stopPreviews = () => { try { pvMod && pvMod.stop(); } catch { /* abaikan */ } };
async function initPreviews() {
  const cs = [...document.querySelectorAll('.pvc')], reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  try {
    pvMod = pvMod || await import('./preview3d.js');
    if (route !== 'gaya' || !cs[0]?.isConnected) return;
    if (!pvMod.mount(cs, reduced)) throw new Error('webgl');
    if (reduced) document.querySelectorAll('[data-act=pvplay]').forEach(x => x.textContent = '▶ Putar');
  } catch {
    cs.forEach(c => { const d = document.createElement('div'); d.className = 'empty'; d.textContent = 'Preview 3D tidak bisa dimuat. Butuh WebGL, dan halaman harus dibuka lewat http(s) (hosting atau server lokal), bukan klik file langsung.'; c.closest('.pv')?.replaceWith(d); });
  }
}
function closeStage() {
  if (stageStop) { stageStop(); stageStop = null; }
  $('#stage')?.remove(); if (route === 'gaya') initPreviews();
}
let route = 'home';
function render(keep) {
  const y = window.scrollY;
  const view = VIEWS[route] ? VIEWS[route]() : TOOLS[route] ? viewTool(route) : viewHome();
  stopPreviews(); $('#view').innerHTML = view; renderNav(route);
  if (route === 'gaya') initPreviews();
  const nm = (NAV.flatMap(g => g[1]).find(x => x[0] === route) || [])[2];
  document.title = (nm ? nm + ' · ' : '') + 'CreatorKit by fanyafriliaa';
  if (keep) window.scrollTo(0, y);
}
function go() {
  const r = (location.hash.replace(/^#\//, '') || 'home');
  route = (VIEWS[r] || TOOLS[r]) ? r : 'home';
  if (route !== 'data') { editId = null; formOpen = false; }
  if (route !== 'akun') acctForm = null;
  render(); window.scrollTo(0, 0); document.body.classList.remove('menu'); $('#menuBtn').setAttribute('aria-expanded', 'false');
}
window.addEventListener('hashchange', go);

/* ---------- event ---------- */
document.addEventListener('input', e => {
  const el = e.target;
  if (el.id === 'bankq') { bankQ = el.value; const pos = el.selectionStart; render(true); const n = $('#bankq'); n.focus(); n.setSelectionRange(pos, pos); return; }
  const p = el.dataset.bind; if (!p) return;
  setPath(p, el.type === 'checkbox' ? el.checked : el.value); save();
  if (el.dataset.live) renderNav(route);
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.id === 'acctSel') {
    if (el.value === '__new') { location.hash = '#/akun'; renderNav(route); return; }
    S.cur = el.value; editId = null; formOpen = false; save(); toast('Sekarang mengerjakan: ' + acct().name); render(true); return;
  }
  if (el.dataset.bind && el.tagName === 'SELECT') { setPath(el.dataset.bind, el.value); save(); renderNav(route); }
  if (el.dataset.act === 'done') { S.done[el.dataset.id] = el.checked; save(); render(true); }
  if (el.dataset.act === 'import' && el.files[0]) {
    const fr = new FileReader();
    fr.onload = () => { try { const o = JSON.parse(fr.result); if (typeof o !== 'object' || !o) throw 0; const k = S.settings.key; S = wrap(normalize(o)); S.settings.key = k; save(); toast('Data berhasil dipulihkan'); render(); } catch { toast('File cadangan tidak valid', 1); } };
    fr.readAsText(el.files[0]);
  }
});
document.addEventListener('submit', e => {
  if (e.target.id === 'aform') {
    e.preventDefault();
    const o = Object.fromEntries(new FormData(e.target)); if (!o.name.trim()) return;
    if (acctForm && acctForm !== 'new') { Object.assign(S.accounts.find(a => a.id === acctForm), { name: o.name.trim(), handle: o.handle.trim(), emoji: o.emoji || '🌸' }); toast('Akun diperbarui'); acctForm = null; }
    else { const a = newAcct(o.name.trim(), o.emoji || '🌸', o.handle.trim(), o.type || 'umum'); a.brand = { ...(ACCT_TYPES[a.type]?.brand || {}) }; S.accounts.push(a); S.cur = a.id; acctForm = null; toast('Akun dibuat. Isi Profil Brand-nya dulu ya 🌸'); save(); location.hash = '#/brand'; return; }
    save(); return render();
  }
  if (e.target.id !== 'dform') return;
  e.preventDefault();
  const o = Object.fromEntries(new FormData(e.target));
  if (!o.judul?.trim() || !o.views) { toast('Isi minimal Judul dan Views dulu ya', 1); return; }
  if (editId) { const i = S.data.findIndex(x => x.id === editId); S.data[i] = { ...S.data[i], ...o }; } else S.data.push({ id: uid(), ...o });
  editId = null; formOpen = false; save(); toast('Tersimpan! Skor sudah dihitung 🎉'); render();
});
document.addEventListener('click', async e => {
  const b = e.target.closest('[data-act]'); if (!b || b.tagName === 'INPUT') return;
  const a = b.dataset.act, id = b.dataset.t, m = b.dataset.m, D = TOOLS[id];
  switch (a) {
    case 'run': return runTool(id, m);
    case 'prompt': { const t = T(id); t.prompts[m] = D.modes.find(x => x.id === m).prompt(t.inputs); save(); render(true); setTimeout(() => $('.promptbox')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 30); return; }
    case 'copyprompt': return copy(T(id).prompts[m] || '');
    case 'copyres': return copy(T(id).results[m] || '');
    case 'saveshelf': {
      const t = T(id), first = Object.values(t.inputs).find(v => typeof v === 'string' && v.trim()) || D.title;
      t.saved.unshift({ ts: Date.now(), title: first.slice(0, 70), inputs: { ...t.inputs }, results: { ...t.results } }); save(); toast('Disimpan ke rak 🗃️'); return render(true);
    }
    case 'loadshelf': { const t = T(id), s = t.saved[+b.dataset.i]; t.inputs = { ...s.inputs }; t.results = { ...s.results }; save(); toast('Dibuka dari rak'); return render(true); }
    case 'delshelf': T(id).saved.splice(+b.dataset.i, 1); save(); return render(true);
    case 'send': {
      const ta = $('#res-' + id + '-' + m); let txt = ta.value.slice(ta.selectionStart, ta.selectionEnd).trim();
      if (!txt) txt = ta.value.trim().split('\n').find(l => l.trim()) || '';
      txt = txt.replace(/^\s*(\d+[.)]|[-*•])\s*/, '').replace(/\*\*/g, '').slice(0, 400);
      if (!txt) { toast('Hasil masih kosong', 1); return; }
      const to = b.dataset.to, f = b.dataset.f, tt = T(to);
      tt.inputs[f] = f === 'catatan' && tt.inputs[f] ? tt.inputs[f] + '\n' + txt : txt;
      if (to === 'studio' && f === 'hook' && !tt.inputs.judul) tt.inputs.judul = T('hook').inputs.topik || '';
      save(); toast('Terkirim ke ' + TOOLS[to].title + ' ✅'); location.hash = '#/' + to; return;
    }
    case 'parsecal': { const rows = parseCal(T(id).results[m] || ''); if (!rows.length) { toast('Tidak menemukan tabel. Pastikan kolom dipisah tanda |', 1); return; } S.cal.rows = rows; save(); toast(rows.length + ' baris masuk ke tabel 🎉'); return render(true); }
    case 'caladd': S.cal.rows.push({}); save(); return render(true);
    case 'caldel': S.cal.rows.splice(+b.dataset.i, 1); save(); return render(true);
    case 'calclear': if (confirm('Kosongkan tabel kalender?')) { S.cal.rows = []; save(); render(true); } return;
    case 'calcsv': return download('kalender-konten.csv', csv([CALCOLS.map(c => c[1]), ...S.cal.rows.map(r => CALCOLS.map(([k]) => r[k]))]), 'text/csv');
    case 'calstudio': { const r = S.cal.rows[+b.dataset.i], t = T('studio'); t.inputs.judul = r.ide || ''; t.inputs.hook = r.hook || ''; t.inputs.cta = r.cta || ''; if (L.platform.includes(r.platform)) t.inputs.platform = r.platform; if (L.format.includes(r.format)) t.inputs.format = r.format; if (L.funnel.includes(r.funnel)) t.inputs.funnel = r.funnel; save(); location.hash = '#/studio'; toast('Dikirim ke Studio Konten'); return; }
    case 'pvplay': { const c = b.closest('.pv').querySelector('canvas'), on = c.dataset.paused === '1'; c.dataset.paused = on ? '0' : '1'; b.textContent = on ? '⏸ Jeda' : '▶ Putar'; return; }
    case 'pvstage': {
      const st = STYLES[+b.dataset.i]; if (!pvMod) { toast('Preview 3D belum siap', 1); return; }
      pvMod.stop(); closeStage();
      const el = document.createElement('div'); el.className = 'stage'; el.id = 'stage';
      el.innerHTML = `<div class="stage-box"><canvas id="stagec" width="540" height="960"></canvas><div class="row" style="justify-content:center"><span class="small">${esc(st.emoji + ' ' + st.name)}. Rekam layar bagian kotak ini untuk bahan konten.</span><button class="btn sm orange" data-act="stageclose">✖ Tutup</button></div></div>`;
      document.body.appendChild(el); stageStop = pvMod.stage($('#stagec'), st.name, st.palette); return;
    }
    case 'stageclose': return closeStage();
    case 'gayause': T('studio').inputs.gaya = STYLES[+b.dataset.i].name; save(); toast('Gaya dipilih di Studio Konten'); location.hash = '#/studio'; return;
    case 'gayaaff': T('affiliate').inputs.gaya = STYLES[+b.dataset.i].name; save(); toast('Gaya dipilih di Konten Affiliate'); location.hash = '#/affiliate'; return;
    case 'gayacopy': { const st = STYLES[+b.dataset.i]; return copy(`Gaya: ${st.name} (${st.mood})\nPalet: ${st.palette.join(', ')}\nResep Three.js: ${st.three}`); }
    case 'acctnew': acctForm = 'new'; render(true); return $('#aform')?.scrollIntoView({ behavior: 'smooth' });
    case 'acctcancel': acctForm = null; return render(true);
    case 'acctedit': acctForm = b.dataset.id; render(true); return $('#aform')?.scrollIntoView({ behavior: 'smooth' });
    case 'acctpick': S.cur = b.dataset.id; editId = null; formOpen = false; save(); toast('Sekarang mengerjakan: ' + acct().name); return render(true);
    case 'acctdup': { const src = S.accounts.find(a => a.id === b.dataset.id), a = newAcct(src.name + ' (salinan)', src.emoji, '', src.type); a.brand = { ...src.brand }; S.accounts.push(a); S.cur = a.id; save(); toast('Profil Brand disalin ke akun baru. Silakan sesuaikan.'); location.hash = '#/brand'; return; }
    case 'acctdel': {
      if (S.accounts.length < 2) { toast('Minimal harus ada 1 akun', 1); return; }
      const a = S.accounts.find(x => x.id === b.dataset.id);
      if (confirm(`Hapus akun "${a.name}" beserta semua datanya? Tidak bisa dibatalkan.`)) { S.accounts = S.accounts.filter(x => x.id !== a.id); if (S.cur === a.id) S.cur = S.accounts[0].id; save(); render(true); }
      return;
    }
    case 'formtoggle': if (editId) editId = null; formOpen = !formOpen; return render(true);
    case 'formcancel': editId = null; formOpen = false; return render(true);
    case 'dedit': editId = b.dataset.id; formOpen = true; render(); return $('#dform')?.scrollIntoView({ behavior: 'smooth' });
    case 'ddel': if (confirm('Hapus konten ini?')) { S.data = S.data.filter(x => x.id !== b.dataset.id); save(); render(true); } return;
    case 'demo': S.data.push(...demoRows()); save(); toast('Data contoh dimuat. Cek Dashboard!'); return render(true);
    case 'rmdemo': S.data = S.data.filter(x => !x.demo); save(); return render(true);
    case 'datacsv': { const d = computed(); return download('data-konten.csv', csv([['Tanggal', 'Jam', 'Platform', 'Format', 'Funnel', 'Pilar', 'Jenis Hook', 'Judul', 'Hook', 'CTA', 'Views', 'Likes', 'Komentar', 'Share', 'Save', 'Follow', 'Leads', 'ER%', 'Save%', 'Share%', 'Follow/1K', 'Skor', 'Label'], ...d.map(r => [dmy(r.tgl), r.jam, r.platform, r.format, r.funnel, r.pilar, r.jenisHook, r.judul, r.hook, r.cta, r.views, r.likes, r.komen, r.share, r.save, r.follow, r.leads, fmt(r.er, 2), fmt(r.saveRate, 2), fmt(r.shareRate, 2), fmt(r.f1k, 1), r.score, r.label])]), 'text/csv'); }
    case 'bankf': bankF = b.dataset.v; return render(true);
    case 'bankcopy': return copy(b.dataset.v);
    case 'bankuse': T('hook').inputs.catatan = 'Gaya referensi: ' + b.dataset.v; save(); toast('Masuk ke catatan Hook'); location.hash = '#/hook'; return;
    case 'showkey': { const k = $('#apikey'); k.type = k.type === 'password' ? 'text' : 'password'; return; }
    case 'test': {
      const out = $('#testout'); out.textContent = 'Menguji...';
      try { const r = await callAI('Balas hanya dengan satu kata: siap'); out.textContent = '✅ Terhubung. Balasan: ' + r.trim().slice(0, 40); }
      catch (err) { out.textContent = '⚠️ ' + err.message; }
      return;
    }
    case 'export': return download('creatorkit-cadangan-' + today() + '.json', JSON.stringify({ ...S, settings: { ...S.settings, key: '' } }, null, 2), 'application/json');
    case 'reset': if (confirm('Hapus SEMUA data (profil, hasil, konten, API Key) di browser ini? Tidak bisa dibatalkan.')) { localStorage.removeItem(KEY); S = wrap(normalize(null)); toast('Semua data dihapus'); render(); } return;
  }
});
$('#menuBtn').addEventListener('click', () => { const o = document.body.classList.toggle('menu'); $('#menuBtn').setAttribute('aria-expanded', o); });
$('#scrim').addEventListener('click', () => document.body.classList.remove('menu'));
document.addEventListener('keydown', e => { if (e.key === 'Escape') { document.body.classList.remove('menu'); if ($('#stage')) closeStage(); } });

go();
