# CreatorKit by fanyafriliaa

Web interaktif (HTML + CSS + JS, tanpa build) versi web dari Google Sheet CreatorKit: Profil Brand, Riset Topik, Bedah Konten Viral, Ide, Hook, Studio Konten, Kalender, Data Konten, Dashboard, Analisa AI, Panduan Funnel dan Bank Hook.

## Cara pakai
Buka `index.html` di browser, atau jalankan server statis: `python3 -m http.server 8080`.
Bisa di-host di GitHub Pages / Netlify / Vercel tanpa konfigurasi.

## Mode
- **Manual (📋)**: tombol "Buat prompt" menyusun prompt dari Profil Brand + isian, salin ke ChatGPT / Gemini / Claude, tempel jawabannya.
- **Otomatis (✨)**: isi API Key Gemini di Pengaturan. Panggilan dikirim langsung dari browser ke Google.

## Data & privasi
Semua data (termasuk API Key) disimpan di `localStorage` browser pengguna. Ada fitur unduh/pulihkan cadangan JSON (API Key tidak ikut diekspor).
