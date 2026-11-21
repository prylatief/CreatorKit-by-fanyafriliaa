# CreatorKit by fanyafriliaa

Web interaktif (HTML + CSS + JS, tanpa build) versi web dari Google Sheet CreatorKit: Profil Brand, Riset Topik, Bedah Konten Viral, Ide, Hook, Studio Konten, Kalender, Data Konten, Dashboard, Analisa AI, Panduan Funnel dan Bank Hook.

## Cara pakai
Buka `index.html` di browser, atau jalankan server statis: `python3 -m http.server 8080`.
Bisa di-host di GitHub Pages / Netlify / Vercel tanpa konfigurasi.

## Preview 3D (Galeri Gaya)
13 gaya visual punya preview Three.js yang bergerak, plus "Mode rekam 9:16" untuk merekam layar sebagai bahan konten. Three.js (r160, MIT) disertakan di `vendor/`, jadi tidak butuh CDN. Preview memakai ES module, jadi halaman harus dibuka lewat http(s) (hosting atau `python3 -m http.server`), bukan klik file langsung.

## Render video dari gaya 3D (komputer / VM)
`capture.html` merender satu frame pada detik `t` (deterministik). `tools/render-video.js` memakainya untuk membuat MP4 frame demi frame:

```bash
npm i playwright && npx playwright install chromium   # sekali saja
node tools/render-video.js --style "Isometric mini-room" --seconds 12 --fps 30 --out isometric.mp4
node tools/render-video.js --list                      # daftar gaya
node tools/render-video.js --style "Voxel / pixel 3D" --seconds 8 --png-dir frames/   # tanpa ffmpeg
```
Opsi: `--w` `--h` (default 1080x1920), `--fps`, `--seconds`, `--start`, `--crf`. WebGL memakai SwiftShader (software), jadi tidak butuh GPU. Perlu ffmpeg kecuali memakai `--png-dir`.

## Mode
- **Manual (📋)**: tombol "Buat prompt" menyusun prompt dari Profil Brand + isian, salin ke ChatGPT / Gemini / Claude, tempel jawabannya.
- **Otomatis (✨)**: isi API Key Gemini di Pengaturan. Panggilan dikirim langsung dari browser ke Google.

## Data & privasi
Semua data (termasuk API Key) disimpan di `localStorage` browser pengguna. Ada fitur unduh/pulihkan cadangan JSON (API Key tidak ikut diekspor).
