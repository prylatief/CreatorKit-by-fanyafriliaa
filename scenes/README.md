# Scene JSON (isometrik)

Satu file JSON = satu scene. Render jadi video:

```bash
node tools/render-video.js --spec scenes/bongkar-benda.json --out bongkar.mp4
node tools/render-video.js --spec scenes/kamar-demo.json --w 1080 --h 1920 --fps 30 --out kamar.mp4
```
Durasi default diambil dari field `duration` (detik). Ukuran/fps lewat opsi `--w --h --fps --seconds`. Kesalahan di JSON ditolak dengan pesan yang menyebut lokasinya (misal `objects[3].type`).

## Struktur
```jsonc
{
  "duration": 10,                       // detik (opsional)
  "palette": { "bg": "#FFE8D6", "floor": "#B7B7A4", "wallBack": "#FFE8D6", "wallLeft": "#EADBC8", "accent": "#FFB4A2",
               "kayu": "#8d6e63" },      // nama bebas, dipakai lewat "color": "kayu"
  "room":   { "w": 5, "d": 5, "h": 3, "walls": ["back", "left"], "floor": true },   // walls: [] = tanpa dinding
  "camera": { "size": 3.9, "elev": 38, "az": 45, "sway": 14, "swaySpeed": 0.4, "target": [0, 0.9, 0] },
  "shadows": true,
  "objects": [ ... ]
}
```
- Satuan bebas, lantai di `y = 0`. `pos` = titik tengah-dasar objek `[x, y, z]` (x ke kanan, z ke arah kamera).
- `camera.fit`: `"objects"` = kamera zoom dan menengahkan diri otomatis supaya semua objek (termasuk saat meledak) pas di frame, tanpa menghitung `size`/`target` manual. `"all"` = termasuk lantai dan dinding. `camera.pad` (default 1.2) = ruang kosong di sekeliling. Framing tetap sepanjang video, jadi objek terlihat lebih kecil sebelum meledak.
- `edges`: `true` (atau warna hex) = garis tipis di tepi setiap objek, berguna kalau dua bagian berwarna mirip. Per objek bisa dimatikan dengan `"edge": false`.
- `camera.size`: makin kecil makin zoom-in (diabaikan kalau `fit` aktif). `elev`: sudut dari atas (35 isometrik klasik, 45-55 lebih top-down, cocok untuk 9:16). `sway`: ayunan kamera (derajat).

## Objek
| type | field |
|---|---|
| `box` | `size: [lebar, tinggi, dalam]` |
| `cylinder` | `r` (alas), `rTop` (atas, default = r), `h` |
| `cone` | `r`, `h` |
| `sphere` | `r`, `center: true` (titik pusat di `pos`, bukan dasar) |
| `group` | tanpa bentuk, untuk menggabungkan beberapa objek |
| `light` | `intensity`, `distance`, `r` (bola bohlam, 0 = tak terlihat) |

Umum: `name`, `parent` (nama group/objek yang sudah ditulis lebih dulu, `pos` jadi relatif), `pos`, `rot` (derajat, sumbu Y), `color` (hex atau nama palet), `emissive` + `glow`, `rough`, `metal`, `flat`.

## Animasi (`anim`: array, boleh beberapa per objek)
| kind | field |
|---|---|
| `appear` | `delay`, `dur`, `drop` (jatuh dari ketinggian sekian) |
| `explode` | `dir: [x,y,z]`, `dist`, `t0`, `t1` (keluar), `t2`, `t3` (opsional, kembali) |
| `bob` | `amp`, `speed`, `phase` |
| `spin` | `speed` (derajat/detik) |
| `sway` | `amp` (derajat), `speed` |
| `pulse` | `amp`, `speed` |

Tips `explode`: kamera isometrik memendekkan gerak horizontal, jadi ledakan ke samping butuh `dist` 2 sampai 3 agar terbaca (ke atas cukup 0.5 sampai 2). Beri warna berbeda untuk bagian yang bersebelahan, atau aktifkan `edges`.

Semua animasi dihitung dari waktu `t`, jadi hasilnya persis sama setiap dirender. Belum ada: teks/label, objek dari model 3D, kurva gerak bebas.

Contoh: `kamar-demo.json` (ruangan menyusun diri), `bongkar-benda.json` (exploded view lampu meja).
