# CreatorKit by fanyafriliaa

Web interaktif (HTML + CSS + JS, tanpa build) versi web dari Google Sheet CreatorKit: Profil Brand, Riset Topik, Bedah Konten Viral, Ide, Hook, Studio Konten, Kalender, Data Konten, Dashboard, Analisa AI, Panduan Funnel dan Bank Hook.

## Cara pakai
Buka `index.html` di browser, atau jalankan server statis: `python3 -m http.server 8080`.
Bisa di-host di GitHub Pages / Netlify / Vercel tanpa konfigurasi.

## Preview 3D (Galeri Gaya)
13 gaya visual punya preview Three.js yang bergerak, plus "Mode rekam 9:16" untuk merekam layar sebagai bahan konten. Three.js (r160, MIT) disertakan di `vendor/`, jadi tidak butuh CDN. Preview memakai ES module, jadi halaman harus dibuka lewat http(s) (hosting atau `python3 -m http.server`), bukan klik file langsung.

## Mode
- **Manual (📋)**: tombol "Buat prompt" menyusun prompt dari Profil Brand + isian, salin ke ChatGPT / Gemini / Claude, tempel jawabannya.
- **Otomatis (✨)**: isi API Key Gemini di Pengaturan. Panggilan dikirim langsung dari browser ke Google.

## Data & privasi
Semua data (termasuk API Key) disimpan di `localStorage` browser pengguna. Ada fitur unduh/pulihkan cadangan JSON (API Key tidak ikut diekspor).
