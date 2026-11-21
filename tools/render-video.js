#!/usr/bin/env node
/* Render gaya 3D dari Galeri Gaya jadi video, frame demi frame (hasil deterministik).
   Butuh: Node 18+, `npm i playwright` (+ `npx playwright install chromium`), dan ffmpeg (kecuali pakai --png-dir).
   Contoh:
     node tools/render-video.js --style "Isometric mini-room" --seconds 12 --fps 30 --out isometric.mp4
     node tools/render-video.js --style "Voxel / pixel 3D" --seconds 8 --png-dir frames/       (hanya PNG)
   Opsi: --style --seconds(10) --fps(30) --w(1080) --h(1920) --start(0) --out(out.mp4) --png-dir --crf(18) --list */
const http = require('http'), fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i < 0 ? d : (process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : true); };
const root = path.resolve(__dirname, '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.txt': 'text/plain' };

function serve() {
  return new Promise(ok => {
    const srv = http.createServer((req, res) => {
      const f = path.join(root, decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html');
      if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('404'); }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
    }).listen(0, '127.0.0.1', () => ok(srv));
  });
}

(async () => {
  let chromium; try { ({ chromium } = require('playwright')); } catch { console.error('Playwright belum terpasang: npm i playwright && npx playwright install chromium'); process.exit(1); }
  const style = arg('style', 'Isometric mini-room'), seconds = +arg('seconds', 10), fps = +arg('fps', 30), w = +arg('w', 1080), h = +arg('h', 1920), start = +arg('start', 0);
  const out = arg('out', 'out.mp4'), pngDir = arg('png-dir', null), crf = String(arg('crf', 18));
  const srv = await serve(), port = srv.address().port;
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: Math.min(w, 1920), height: Math.min(h, 1920) } });
  page.on('pageerror', e => console.error('Error halaman:', e.message));
  await page.goto(`http://127.0.0.1:${port}/capture.html?style=${encodeURIComponent(style)}&w=${w}&h=${h}&t=${start}`);
  try { await page.evaluate(() => window.captureReady); }
  catch { console.error(await page.evaluate(() => document.documentElement.dataset.error || 'WebGL tidak tersedia')); await browser.close(); srv.close(); process.exit(1); }
  if (arg('list', false)) { console.log((await page.evaluate(() => window.STYLE_NAMES)).join('\n')); await browser.close(); srv.close(); return; }

  const total = Math.round(seconds * fps); let ff = null;
  if (pngDir) fs.mkdirSync(pngDir, { recursive: true });
  else {
    ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', crf, '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    ff.on('error', e => { console.error('ffmpeg tidak ditemukan:', e.message); process.exit(1); });
  }
  const t0 = Date.now();
  for (let i = 0; i < total; i++) {
    const url = await page.evaluate(t => { window.renderAt(t); return window.frameDataURL(); }, start + i / fps);
    const buf = Buffer.from(url.split(',')[1], 'base64');
    if (pngDir) fs.writeFileSync(path.join(pngDir, `frame-${String(i + 1).padStart(5, '0')}.png`), buf);
    else if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 10 === 0 || i === total - 1) process.stdout.write(`\rframe ${i + 1}/${total}  (${((Date.now() - t0) / 1000).toFixed(0)} dtk)`);
  }
  process.stdout.write('\n');
  if (ff) { ff.stdin.end(); await new Promise(r => ff.on('close', r)); console.log('Selesai:', out); } else console.log('Selesai, PNG di', pngDir);
  await browser.close(); srv.close();
})().catch(e => { console.error(e); process.exit(1); });
