/* Preview 3D untuk Galeri Gaya. Satu WebGL renderer dipakai bergantian untuk semua kartu,
   hasilnya disalin ke canvas 2D tiap kartu (hindari batas jumlah WebGL context). */
import * as THREE from './vendor/three.module.min.js';

const C = h => new THREE.Color(h);
const shade = (h, k) => '#' + C(h).multiplyScalar(k).getHexString();
const rng = seed => { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = s * 16807 % 2147483647) / 2147483647; };
const mat = (c, o = {}) => new THREE.MeshStandardMaterial({ color: C(c), roughness: .75, metalness: 0, ...o });
const basic = (c, o = {}) => new THREE.MeshBasicMaterial({ color: C(c), ...o });
const mesh = (g, m, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); return o; };
const cam = (fov = 45) => new THREE.PerspectiveCamera(fov, 1.6, .1, 300);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
function lights(s, { amb = .6, dir = 1.1, pos = [4, 6, 5] } = {}) {
  s.add(new THREE.HemisphereLight(0xffffff, 0x8a8a9a, amb));
  const d = new THREE.DirectionalLight(0xffffff, dir); d.position.set(...pos); s.add(d); return d;
}
function gradTex(c1, c2) {
  const cv = document.createElement('canvas'); cv.width = 2; cv.height = 256;
  const g = cv.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fillRect(0, 0, 2, 256);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const scene = (bg, fog) => { const s = new THREE.Scene(); s.background = C(bg); if (fog) s.fog = new THREE.Fog(C(bg), fog[0], fog[1]); return s; };


/* ---------------- scene isometrik dari spec JSON (lihat scenes/README.md) ---------------- */
const PRIMS = ['group', 'box', 'cylinder', 'sphere', 'cone', 'light'];
const KINDS = ['bob', 'spin', 'sway', 'pulse', 'appear', 'explode'];
const D2R = Math.PI / 180;
const eio = x => { x = clamp(x, 0, 1); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const eob = x => { x = clamp(x, 0, 1); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };

export function buildSpecScene(spec) {
  const fail = (p, m) => { throw new Error(`Spec tidak valid di ${p}: ${m}`); };
  if (!spec || typeof spec !== 'object' || Array.isArray(spec)) fail('(root)', 'harus berupa objek JSON');
  const pal = { bg: '#FFE8D6', floor: '#B7B7A4', wallBack: '#FFE8D6', wallLeft: '#EADBC8', accent: '#FFB4A2', ...(spec.palette || {}) };
  const col = (v, p) => { const h = typeof v === 'string' && v[0] !== '#' ? pal[v] : v; if (typeof h !== 'string' || !/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(h)) fail(p, `warna "${v}" harus hex (#RRGGBB) atau nama palet (${Object.keys(pal).join(', ')})`); return h; };
  const vec = (v, d, p) => { const a = v ?? d; if (!Array.isArray(a) || a.length !== 3 || a.some(x => typeof x !== 'number' || !isFinite(x))) fail(p, 'harus array 3 angka [x, y, z]'); return a; };
  const nv = (v, d, p) => { const x = v ?? d; if (typeof x !== 'number' || !isFinite(x)) fail(p, 'harus angka'); return x; };

  const room = { w: 5, d: 5, h: 3, walls: ['back', 'left'], floor: true, ...(spec.room || {}) };
  ['w', 'd', 'h'].forEach(k => { if (nv(room[k], 5, 'room.' + k) <= 0) fail('room.' + k, 'harus > 0'); });
  if (!Array.isArray(room.walls) || room.walls.some(w => w !== 'back' && w !== 'left')) fail('room.walls', 'isi dengan "back" dan/atau "left" ([] = tanpa dinding)');
  const cs = { size: 4, az: 45, elev: 35.264, dist: 40, sway: 12, swaySpeed: .4, target: [0, .8, 0], ...(spec.camera || {}) };
  ['size', 'az', 'elev', 'dist', 'sway', 'swaySpeed'].forEach(k => nv(cs[k], 0, 'camera.' + k));
  vec(cs.target, null, 'camera.target');

  const s = scene(col('bg', 'palette.bg')), shadows = spec.shadows !== false;
  s.add(new THREE.HemisphereLight(0xffffff, 0x9a9aa8, .95));
  const sun = new THREE.DirectionalLight(0xffffff, .9); sun.position.set(6, 9, 5);
  if (shadows) { sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9 }); sun.shadow.bias = -.0005; }
  s.add(sun);
  const solid = (g, color, o = {}) => { const m = new THREE.Mesh(g, mat(color, o)); m.castShadow = shadows; m.receiveShadow = shadows; return m; };
  if (room.floor) { const f = solid(new THREE.BoxGeometry(room.w, .2, room.d), col('floor', 'palette.floor')); f.position.y = -.1; s.add(f); }
  if (room.walls.includes('back')) { const w = solid(new THREE.BoxGeometry(room.w + .2, room.h, .2), col('wallBack', 'palette.wallBack')); w.position.set(-.1, room.h / 2, -room.d / 2 - .1); s.add(w); }
  if (room.walls.includes('left')) { const w = solid(new THREE.BoxGeometry(.2, room.h, room.d), col('wallLeft', 'palette.wallLeft')); w.position.set(-room.w / 2 - .1, room.h / 2, 0); s.add(w); }

  const byName = new Map(), items = [];
  if (spec.objects != null && !Array.isArray(spec.objects)) fail('objects', 'harus array');
  (spec.objects || []).forEach((o, i) => {
    const P = `objects[${i}]`;
    if (!o || typeof o !== 'object') fail(P, 'harus objek');
    if (!PRIMS.includes(o.type)) fail(P + '.type', `"${o.type}" tidak dikenal. Pilihan: ${PRIMS.join(', ')}`);
    const g = new THREE.Group(), pos = vec(o.pos, [0, 0, 0], P + '.pos');
    let parent = s;
    if (o.parent != null) { parent = byName.get(o.parent); if (!parent) fail(P + '.parent', `"${o.parent}" belum didefinisikan (parent harus ditulis lebih dulu)`); }
    g.position.set(...pos); g.rotation.y = nv(o.rot, 0, P + '.rot') * D2R; parent.add(g);
    if (o.name != null) { if (byName.has(o.name)) fail(P + '.name', `nama "${o.name}" dipakai dua kali`); byName.set(o.name, g); }
    const c = o.type === 'light' ? col(o.color ?? '#ffffff', P + '.color') : o.type === 'group' ? null : col(o.color ?? 'accent', P + '.color');
    const opt = { roughness: nv(o.rough, .75, P + '.rough'), metalness: nv(o.metal, 0, P + '.metal'), flatShading: !!o.flat };
    if (o.emissive != null) { opt.emissive = C(col(o.emissive, P + '.emissive')); opt.emissiveIntensity = nv(o.glow, .8, P + '.glow'); }
    let ref = null;
    if (o.type === 'box') { const z = vec(o.size, [1, 1, 1], P + '.size'); const m = solid(new THREE.BoxGeometry(...z), c, opt); m.position.y = z[1] / 2; g.add(m); }
    else if (o.type === 'cylinder') { const r = nv(o.r, .5, P + '.r'), h = nv(o.h, 1, P + '.h'); const m = solid(new THREE.CylinderGeometry(nv(o.rTop, r, P + '.rTop'), r, h, 28), c, opt); m.position.y = h / 2; g.add(m); }
    else if (o.type === 'cone') { const r = nv(o.r, .5, P + '.r'), h = nv(o.h, 1, P + '.h'); const m = solid(new THREE.ConeGeometry(r, h, 28), c, opt); m.position.y = h / 2; g.add(m); }
    else if (o.type === 'sphere') { const r = nv(o.r, .5, P + '.r'); const m = solid(new THREE.SphereGeometry(r, 28, 18), c, opt); m.position.y = o.center ? 0 : r; g.add(m); }
    else if (o.type === 'light') {
      const r = nv(o.r, .14, P + '.r'); if (r > 0) g.add(mesh(new THREE.SphereGeometry(r, 16, 12), basic(c)));
      const pl = new THREE.PointLight(C(c), nv(o.intensity, 6, P + '.intensity'), nv(o.distance, 6, P + '.distance')); g.add(pl); ref = pl; pl.userData.i0 = pl.intensity;
    }
    const anims = (o.anim ?? []); if (!Array.isArray(anims)) fail(P + '.anim', 'harus array');
    anims.forEach((a, j) => { if (!a || !KINDS.includes(a.kind)) fail(`${P}.anim[${j}].kind`, `"${a && a.kind}" tidak dikenal. Pilihan: ${KINDS.join(', ')}`); if (a.kind === 'explode') { vec(a.dir, [0, 1, 0], `${P}.anim[${j}].dir`); nv(a.t0, 0, `${P}.anim[${j}].t0`); nv(a.t1, 1, `${P}.anim[${j}].t1`); } });
    items.push({ g, base: pos.slice(), rot0: g.rotation.y, anims, light: ref });
  });

  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 300);
  const place = t => {
    const az = (cs.az + Math.sin(t * cs.swaySpeed) * cs.sway) * D2R, el = cs.elev * D2R, [tx, ty, tz] = cs.target;
    cam.position.set(tx + Math.cos(el) * Math.sin(az) * cs.dist, ty + Math.sin(el) * cs.dist, tz + Math.cos(el) * Math.cos(az) * cs.dist); cam.lookAt(tx, ty, tz);
  };
  const dirv = new THREE.Vector3();
  return {
    scene: s, camera: cam, duration: spec.duration, names: [...byName.keys()],
    resize(a) { const hw = a < 1 ? cs.size : cs.size * .75 * a, hh = a < 1 ? cs.size / a : cs.size * .75; cam.left = -hw; cam.right = hw; cam.top = hh; cam.bottom = -hh; cam.updateProjectionMatrix(); },
    tick(t) {
      place(t);
      items.forEach(({ g, base, rot0, anims, light }) => {
        let x = base[0], y = base[1], z = base[2], ry = rot0, rz = 0, sc = 1;
        for (const a of anims) {
          const sp = a.speed ?? 1, ph = a.phase ?? 0;
          if (a.kind === 'bob') y += Math.sin(t * sp + ph) * (a.amp ?? .1);
          else if (a.kind === 'spin') ry += t * (a.speed ?? 45) * D2R;
          else if (a.kind === 'sway') rz += Math.sin(t * sp + ph) * (a.amp ?? 5) * D2R;
          else if (a.kind === 'pulse') sc *= 1 + Math.sin(t * sp + ph) * (a.amp ?? .05);
          else if (a.kind === 'appear') { const u = (t - (a.delay ?? 0)) / (a.dur ?? .6), k = eob(u); sc *= u <= 0 ? 1e-4 : Math.max(k, 1e-4); y += (1 - clamp(u, 0, 1)) * (a.drop ?? 0); }
          else if (a.kind === 'explode') {
            let k = eio((t - a.t0) / ((a.t1 ?? a.t0 + 1) - a.t0));
            if (a.t2 != null) k *= 1 - eio((t - a.t2) / ((a.t3 ?? a.t2 + 1) - a.t2));
            dirv.set(...(a.dir ?? [0, 1, 0])).normalize().multiplyScalar((a.dist ?? 1) * k); x += dirv.x; y += dirv.y; z += dirv.z;
          }
        }
        g.position.set(x, y, z); g.rotation.y = ry; g.rotation.z = rz; g.scale.setScalar(sc);
        if (light) light.intensity = light.userData.i0 * clamp(sc, 0, 1);
      });
    }
  };
}
const ROOM_SPEC = {"duration": 10, "palette": {"desk": "#6B705C", "pot": "#c97b63", "leaf": "#6a9a5b", "pillow": "#ffffff", "screen": "#4f8cff", "bulb": "#fff2b0"}, "room": {"w": 5, "d": 5, "h": 3}, "camera": {"size": 3.9, "elev": 38, "sway": 14, "swaySpeed": 0.4, "target": [0, 0.9, 0]}, "objects": [{"name": "bed", "type": "box", "pos": [-1.3, 0, -0.8], "size": [1.6, 0.4, 2.2], "color": "accent", "anim": [{"kind": "appear", "delay": 0.2}]}, {"name": "pillow", "type": "box", "parent": "bed", "pos": [0, 0.4, -0.8], "size": [1.5, 0.15, 0.9], "color": "pillow"}, {"name": "desk", "type": "group", "pos": [1.1, 0, -1.9], "anim": [{"kind": "appear", "delay": 0.5}]}, {"type": "box", "parent": "desk", "pos": [0, 0.9, 0], "size": [1.8, 0.1, 0.8], "color": "desk"}, {"type": "box", "parent": "desk", "pos": [-0.8, 0, -0.3], "size": [0.08, 0.9, 0.08], "color": "desk"}, {"type": "box", "parent": "desk", "pos": [0.8, 0, -0.3], "size": [0.08, 0.9, 0.08], "color": "desk"}, {"type": "box", "parent": "desk", "pos": [-0.8, 0, 0.3], "size": [0.08, 0.9, 0.08], "color": "desk"}, {"type": "box", "parent": "desk", "pos": [0.8, 0, 0.3], "size": [0.08, 0.9, 0.08], "color": "desk"}, {"name": "monitor", "type": "box", "parent": "desk", "pos": [0, 1.0, -0.2], "size": [0.8, 0.5, 0.06], "color": "#222222", "emissive": "screen", "glow": 0.8}, {"name": "kotak", "type": "box", "pos": [1.2, 0, -1.0], "size": [0.5, 0.5, 0.5], "color": "accent", "anim": [{"kind": "appear", "delay": 0.9}]}, {"name": "plant", "type": "group", "pos": [-2, 0, 1.2], "anim": [{"kind": "appear", "delay": 1.1}, {"kind": "sway", "amp": 3, "speed": 2}]}, {"type": "cylinder", "parent": "plant", "r": 0.17, "rTop": 0.22, "h": 0.35, "color": "pot"}, {"type": "sphere", "parent": "plant", "pos": [0, 0.35, 0], "r": 0.34, "color": "leaf"}, {"name": "lamp", "type": "light", "pos": [2, 1.6, -2.2], "color": "bulb", "intensity": 6, "distance": 6, "r": 0.14, "anim": [{"kind": "appear", "delay": 1.4}]}]};

/* ---------------- 13 gaya ---------------- */
const B = {
  'Low-poly pastel'(P) {
    const s = scene(P[3], [14, 34]); lights(s, { amb: .85, dir: 1, pos: [5, 8, 4] });
    const g = new THREE.Group(); s.add(g); const rnd = rng(7);
    g.add(mesh(new THREE.CylinderGeometry(9, 9, .3, 10), mat(P[2], { flatShading: true }), 0, -.9, 0));
    g.add(mesh(new THREE.CylinderGeometry(2.4, 3, .9, 7), mat(shade(P[1], .9), { flatShading: true }), 0, -.3, 0));
    g.add(mesh(new THREE.CylinderGeometry(2.1, 2.4, .25, 7), mat(P[0], { flatShading: true }), 0, .25, 0));
    const trees = [], clouds = [];
    for (let i = 0; i < 7; i++) {
      const a = rnd() * 6.28, r = .4 + rnd() * 1.5, t = new THREE.Group();
      t.add(mesh(new THREE.CylinderGeometry(.07, .09, .4, 5), mat('#8d6e63', { flatShading: true }), 0, .2, 0));
      t.add(mesh(new THREE.ConeGeometry(.35 + rnd() * .15, .9, 5), mat(shade(P[1], .65), { flatShading: true }), 0, .8, 0));
      t.position.set(Math.cos(a) * r, .38, Math.sin(a) * r); t.userData.ph = rnd() * 6; g.add(t); trees.push(t);
    }
    for (let i = 0; i < 4; i++) { const c = mesh(new THREE.IcosahedronGeometry(.5 + rnd() * .3, 0), mat('#ffffff', { flatShading: true }), rnd() * 8 - 4, 2.2 + rnd(), rnd() * 6 - 3); c.scale.set(1.6, .7, 1); s.add(c); clouds.push(c); c.userData.y0 = c.position.y; }
    const c = cam(40);
    return { scene: s, camera: c, tick(t) {
      c.position.set(Math.sin(t * .35) * 9, 5, Math.cos(t * .35) * 9); c.lookAt(0, 0, 0);
      trees.forEach(tr => tr.rotation.z = Math.sin(t * 2 + tr.userData.ph) * .05);
      clouds.forEach((cl, i) => cl.position.y = cl.userData.y0 + Math.sin(t * .8 + i) * .08);
    } };
  },

  'Neon cyberpunk'(P) {
    const s = scene(P[0], [8, 30]); s.add(new THREE.AmbientLight(0xffffff, .3));
    const l1 = new THREE.PointLight(C(P[1]), 40, 20), l2 = new THREE.PointLight(C(P[2]), 40, 20);
    l1.position.set(-3, 2, 2); l2.position.set(3, 2, -1); s.add(l1, l2);
    const grid = new THREE.GridHelper(60, 60, C(P[1]), C(P[3])); grid.position.y = -1.5; s.add(grid);
    const g = new THREE.Group(); s.add(g);
    g.add(mesh(new THREE.TorusKnotGeometry(.9, .28, 160, 20), mat('#111111', { emissive: C(P[1]), emissiveIntensity: 1.5, metalness: .5, roughness: .3 })));
    const shell = mesh(new THREE.TorusKnotGeometry(.9, .28, 160, 20), basic(P[2], { wireframe: true, transparent: true, opacity: .55, blending: THREE.AdditiveBlending })); shell.scale.setScalar(1.14); g.add(shell);
    const rnd = rng(11), cubes = [];
    for (let i = 0; i < 12; i++) {
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(.5, .5 + rnd() * 1.5, .5)), new THREE.LineBasicMaterial({ color: C(i % 2 ? P[2] : P[1]) }));
      e.position.set((rnd() - .5) * 12, -1.2, -3 - rnd() * 9); s.add(e); cubes.push(e);
    }
    const c = cam(50);
    return { scene: s, camera: c, tick(t) {
      g.rotation.x = t * .5; g.rotation.y = t * .7; g.position.y = Math.sin(t) * .15;
      grid.position.z = (t * 1.5) % 1;
      c.position.set(Math.sin(t * .3) * 1.5, .6, 5 + Math.sin(t * .5) * .6); c.lookAt(0, 0, 0);
      cubes.forEach((q, i) => q.rotation.y = t * .3 + i);
    } };
  },

  'Glassmorphism'(P) {
    const s = new THREE.Scene(); s.background = gradTex(P[0], P[1]); lights(s, { amb: 1.1, dir: 1.2 });
    const backs = [[P[3], 1, -1.3, .1, -2.5], ['#ffffff', .8, 1.5, .8, -2.5], [P[1], 1.2, .2, -1, -3]].map(([c, r, x, y, z]) => { const m = mesh(new THREE.SphereGeometry(r, 32, 24), basic(c), x, y, z); s.add(m); m.userData.x0 = x; return m; });
    const gm = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1, thickness: 1.2, roughness: .08, ior: 1.45 });
    const tor = mesh(new THREE.TorusGeometry(1, .38, 32, 64), gm), sph = mesh(new THREE.SphereGeometry(.7, 48, 32), gm, 1.8, -.6, .5);
    s.add(tor, sph);
    const c = cam(40); c.position.set(0, 0, 6);
    return { scene: s, camera: c, tick(t) {
      tor.rotation.x = t * .5; tor.rotation.y = t * .35; tor.position.y = Math.sin(t) * .2;
      sph.position.y = -.6 + Math.sin(t * 1.3) * .25;
      backs.forEach((b, i) => b.position.x = b.userData.x0 + Math.sin(t * .6 + i * 2) * .45);
    } };
  },

  'Isometric mini-room'(P) {
    return buildSpecScene({ ...ROOM_SPEC, palette: { ...ROOM_SPEC.palette, bg: P[0], floor: P[1], wallBack: P[0], wallLeft: shade(P[0], .93), accent: P[3], desk: P[2] } });
  },

  'Wireframe blueprint'(P) {
    const s = scene(P[0]); const grid = new THREE.GridHelper(30, 30, C(P[1]), C(P[1])); grid.material.transparent = true; grid.material.opacity = .18; grid.position.y = -2; s.add(grid);
    const g = new THREE.Group(); s.add(g); const items = [];
    [[new THREE.IcosahedronGeometry(1.4, 1), P[1], 0], [new THREE.BoxGeometry(1.5, 1.5, 1.5), P[2], 0], [new THREE.TorusGeometry(2.1, .08, 8, 48), P[1], 0]].forEach(([geo, col]) => {
      const e = new THREE.EdgesGeometry(geo), l = new THREE.LineSegments(e, new THREE.LineBasicMaterial({ color: C(col) })); l.userData.n = e.attributes.position.count; g.add(l); items.push(l);
    });
    const c = cam(42);
    return { scene: s, camera: c, tick(t) {
      const k = clamp(((t * .3) % 1.6) / 1.1, 0, 1);
      items.forEach(l => l.geometry.setDrawRange(0, Math.floor(l.userData.n * k / 2) * 2));
      items[1].rotation.set(t * .6, t * .8, 0); items[0].rotation.y = -t * .3; items[2].rotation.x = Math.PI / 2 + Math.sin(t * .5) * .4;
      c.position.set(Math.sin(t * .25) * 6, 2.5, Math.cos(t * .25) * 6); c.lookAt(0, 0, 0);
    } };
  },

  'Particle galaxy'(P) {
    const s = scene(P[0]); const rnd = rng(5), N = 6000, pos = new Float32Array(N * 3), col = new Float32Array(N * 3), a = C(P[1]), b = C(P[2]), hi = C(P[3]), tmp = new THREE.Color();
    for (let i = 0; i < N; i++) {
      const r = Math.pow(rnd(), .6) * 5, ang = r * 1.1 + (i % 3) * (Math.PI * 2 / 3), sp = (rnd() - .5) * .7 * (r * .25 + .2);
      pos.set([Math.cos(ang) * r + sp, (rnd() - .5) * .5 * (1 - r / 6), Math.sin(ang) * r + sp], i * 3);
      tmp.copy(a).lerp(b, r / 5); if (rnd() < .08) tmp.copy(hi); col.set([tmp.r, tmp.g, tmp.b], i * 3);
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: .05, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); s.add(pts);
    const sp = new Float32Array(900 * 3); for (let i = 0; i < 900; i++) { const v = new THREE.Vector3(rnd() - .5, rnd() - .5, rnd() - .5).normalize().multiplyScalar(14 + rnd() * 8); sp.set([v.x, v.y, v.z], i * 3); }
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3)); s.add(new THREE.Points(sg, new THREE.PointsMaterial({ size: .06, color: 0xffffff, transparent: true, opacity: .7 })));
    const c = cam(50);
    return { scene: s, camera: c, tick(t) { pts.rotation.y = t * .12; c.position.set(Math.sin(t * .15) * 3, 3.4 + Math.sin(t * .2) * .6, 7); c.lookAt(0, 0, 0); } };
  },

  'Clay / toy 3D'(P) {
    const s = scene(P[2]); lights(s, { amb: 1, dir: .9, pos: [3, 6, 5] });
    s.add(mesh(new THREE.CircleGeometry(5, 48), mat(P[1]), 0, 0, 0)); s.children.at(-1).rotation.x = -Math.PI / 2;
    const blob = mesh(new THREE.CircleGeometry(1, 32), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .15 }), 0, .01, 0); blob.rotation.x = -Math.PI / 2; s.add(blob);
    const body = new THREE.Group(); s.add(body);
    body.add(mesh(new THREE.SphereGeometry(1, 40, 30), mat(P[0], { roughness: .95 })));
    [-.6, .6].forEach(x => body.add(mesh(new THREE.SphereGeometry(.32, 20, 16), mat(P[0], { roughness: .95 }), x, .95, 0)));
    [-.35, .35].forEach(x => { body.add(mesh(new THREE.SphereGeometry(.1, 16, 12), mat('#3a3335'), x, .2, .93)); body.add(mesh(new THREE.SphereGeometry(.14, 16, 12), mat(P[1], { roughness: .9 }), x * 1.9, -.1, .85)); });
    const mouth = mesh(new THREE.CapsuleGeometry(.05, .2, 4, 8), mat('#3a3335'), 0, -.1, .97); mouth.rotation.z = Math.PI / 2; body.add(mouth);
    const floaters = [new THREE.TorusGeometry(.4, .16, 16, 32), new THREE.SphereGeometry(.35, 20, 16), new THREE.IcosahedronGeometry(.4, 1)].map((gm, i) => { const m = mesh(gm, mat(i % 2 ? P[3] : P[1], { roughness: .9 }), [-2.6, 2.6, 0][i], 1.5, [0, 0, -2][i]); s.add(m); return m; });
    const c = cam(40); c.position.set(0, 2.2, 7.5); c.lookAt(0, 1, 0);
    return { scene: s, camera: c, tick(t) {
      const b = Math.abs(Math.sin(t * 3));
      body.position.y = 1 + b * .8; body.scale.set(1 + (1 - b) * .1, 1 - (1 - b) * .12 + b * .05, 1 + (1 - b) * .1); body.rotation.y = Math.sin(t * 1.2) * .4;
      blob.scale.setScalar(1.1 - b * .35);
      floaters.forEach((f, i) => { f.rotation.x = t * (.6 + i * .2); f.rotation.y = t * .5; f.position.y = 1.5 + Math.sin(t * 1.5 + i) * .3; });
    } };
  },

  'Voxel / pixel 3D'(P) {
    const s = scene(P[0]); lights(s, { amb: .8, dir: 1.1, pos: [5, 9, 4] });
    const W = 12, items = [];
    for (let x = 0; x < W; x++) for (let z = 0; z < W; z++) {
      const h = 1 + Math.floor(2 + 1.8 * Math.sin(x * .6) + 1.6 * Math.cos(z * .5)); for (let y = 0; y < Math.max(1, Math.min(h, 5)); y++) items.push([x - W / 2 + .5, y, z - W / 2 + .5, y === Math.max(1, Math.min(h, 5)) - 1 ? 2 + ((x + z) % 2) : (y % 2 ? 1 : 0)]);
    }
    const colors = [shade(P[1], .55), shade(P[1], .8), P[3], P[2]].map(C);
    const im = new THREE.InstancedMesh(new THREE.BoxGeometry(.94, .94, .94), new THREE.MeshStandardMaterial({ roughness: .8 }), items.length);
    items.forEach((it, i) => im.setColorAt(i, colors[it[3]])); s.add(im);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), ps = new THREE.Vector3(), c = cam(42);
    return { scene: s, camera: c, tick(t) {
      const e = (t % 12) * 1.5;
      items.forEach((it, i) => { const k = clamp((e - (it[0] + 6) * .35 - (it[2] + 6) * .25 - it[1] * .5) * 1.6, 0, 1); sc.setScalar(Math.max(k, 1e-4)); ps.set(it[0], it[1] + (1 - k) * 3, it[2]); m4.compose(ps, q, sc); im.setMatrixAt(i, m4); });
      im.instanceMatrix.needsUpdate = true;
      c.position.set(Math.sin(t * .25) * 15, 11, Math.cos(t * .25) * 15); c.lookAt(0, 1, 0);
    } };
  },

  'Holographic iridescent'(P) {
    const s = scene(P[0]);
    const holo = new THREE.ShaderMaterial({ uniforms: { uT: { value: 0 } },
      vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }',
      fragmentShader: 'uniform float uT; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.-max(dot(normalize(vN),normalize(vV)),0.),1.6); vec3 c = .5+.5*cos(6.2831*(f*1.2+uT*.08+vec3(0.,.33,.67))); gl_FragColor = vec4(mix(vec3(.05,.05,.14),c,.35+f*.65),1.); }' });
    const knot = mesh(new THREE.TorusKnotGeometry(1, .34, 200, 28), holo); s.add(knot);
    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.3, 1)), new THREE.LineBasicMaterial({ color: C(P[1]), transparent: true, opacity: .35 })); s.add(wire);
    const c = cam(42); c.position.set(0, 0, 6.5);
    return { scene: s, camera: c, tick(t) { holo.uniforms.uT.value = t; knot.rotation.set(t * .4, t * .6, 0); wire.rotation.set(-t * .15, t * .2, 0); } };
  },

  'Product turntable studio'(P) {
    const s = scene(P[0]); s.add(new THREE.HemisphereLight(0xffffff, 0xcccccc, .9));
    const d = new THREE.DirectionalLight(0xffffff, 1.6); d.position.set(3, 6, 4); d.castShadow = true; d.shadow.mapSize.set(1024, 1024); Object.assign(d.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4 }); s.add(d);
    const fl = mesh(new THREE.PlaneGeometry(40, 40), mat(P[1], { roughness: .9 })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; s.add(fl);
    const turn = new THREE.Group(); s.add(turn);
    const plat = mesh(new THREE.CylinderGeometry(1.5, 1.5, .12, 48), mat('#ffffff', { roughness: .4 }), 0, .06, 0); plat.receiveShadow = true; plat.castShadow = true; turn.add(plat);
    const body = mesh(new THREE.CylinderGeometry(.5, .45, 1.7, 40), mat(P[3], { metalness: .35, roughness: .3 }), 0, 1, 0), lid = mesh(new THREE.CylinderGeometry(.42, .5, .25, 40), mat(P[2], { roughness: .5 }), 0, 1.95, 0), band = mesh(new THREE.CylinderGeometry(.505, .505, .12, 40), mat('#ffffff', { roughness: .3 }), 0, 1.2, 0);
    [body, lid, band].forEach(m => { m.castShadow = true; turn.add(m); });
    const ring = mesh(new THREE.TorusGeometry(1.7, .03, 8, 64), basic(P[3])); ring.rotation.x = Math.PI / 2; ring.position.y = .02; s.add(ring);
    const c = cam(38);
    return { scene: s, camera: c, tick(t) { turn.rotation.y = t * .8; c.position.set(Math.sin(t * .2) * .8, 2.3 + Math.sin(t * .3) * .2, 6); c.lookAt(0, 1.1, 0); } };
  },

  'Synthwave sunset'(P) {
    const s = new THREE.Scene(); s.background = gradTex(P[0], P[1]); s.fog = new THREE.Fog(C(P[1]), 10, 42);
    const sun = mesh(new THREE.CircleGeometry(4, 64), new THREE.ShaderMaterial({ uniforms: { c1: { value: C(P[1]) }, c2: { value: C(P[3]) } }, fog: false,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
      fragmentShader: 'varying vec2 vUv; uniform vec3 c1; uniform vec3 c2; void main(){ if (vUv.y < .5 && fract(vUv.y*18.) < vUv.y*.9) discard; gl_FragColor = vec4(mix(c1,c2,vUv.y),1.); }' }), 0, 2.2, -22); s.add(sun);
    const grid = new THREE.GridHelper(80, 80, C(P[1]), C(P[2])); grid.position.y = 0; s.add(grid);
    const rnd = rng(3);
    for (let i = 0; i < 14; i++) { const side = i % 2 ? 1 : -1, m = mesh(new THREE.ConeGeometry(1.6 + rnd() * 1.6, 2 + rnd() * 3, 4), mat(shade(P[0], 1.4), { flatShading: true }), side * (5 + rnd() * 9), 1, -10 - rnd() * 20); s.add(m); const e = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), new THREE.LineBasicMaterial({ color: C(P[2]) })); e.position.copy(m.position); s.add(e); }
    lights(s, { amb: 1, dir: .4 });
    const c = cam(55); c.position.set(0, 1.4, 4); c.lookAt(0, 2, -20);
    return { scene: s, camera: c, tick(t) { grid.position.z = (t * 3) % 1; sun.position.y = 2.2 + Math.sin(t * .5) * .15; c.position.x = Math.sin(t * .3) * .8; } };
  },

  'Paper-cut layers'(P) {
    const s = scene(P[0]);
    const base = C(P[1]), mid = C(P[2]), tmp = new THREE.Color();
    for (let i = 0; i < 6; i++) {
      const col = i === 5 ? C(P[3]) : tmp.copy(base).lerp(mid, i / 4.2).clone();
      const z = -9 + i * 1.6, hh = Math.tan(20 * Math.PI / 180) * (5 - z), top = -hh + 2 * hh * (.64 - i * .105), amp = hh * .07;
      const sh = new THREE.Shape(), off = i * 1.7; sh.moveTo(-30, -hh * 2);
      for (let x = -30; x <= 30; x += .75) sh.lineTo(x, top + Math.sin(x * .45 / (1 + i * .12) + off) * amp);
      sh.lineTo(30, -hh * 2); sh.lineTo(-30, -hh * 2);
      const geo = new THREE.ShapeGeometry(sh);
      s.add(mesh(geo, new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .16 }), .1, -.14, z - .05), mesh(geo, basic(col), 0, 0, z));
    }
    const sun = mesh(new THREE.CircleGeometry(1.7, 48), basic(P[2]), 2.8, 1.2, -10.5); s.add(sun);
    const c = cam(40); c.position.set(0, 0, 5);
    return { scene: s, camera: c, tick(t) { c.position.x = Math.sin(t * .6) * 1.4; c.position.y = Math.sin(t * .4) * .3; c.lookAt(0, -.2, -5); sun.position.y = 1.2 + Math.sin(t * .5) * .2; } };
  },

  'Toon / cel shading'(P) {
    const s = scene(P[0]); const gm = new THREE.DataTexture(new Uint8Array([90, 170, 255]), 3, 1, THREE.RedFormat); gm.minFilter = gm.magFilter = THREE.NearestFilter; gm.needsUpdate = true;
    lights(s, { amb: .5, dir: 1.2, pos: [4, 6, 5] });
    const toon = (geo, col, x, y, z) => { const g = new THREE.Group(), m = mesh(geo, new THREE.MeshToonMaterial({ color: C(col), gradientMap: gm })), o = mesh(geo, new THREE.MeshBasicMaterial({ color: 0x1b1b1b, side: THREE.BackSide })); o.scale.setScalar(1.07); g.add(m, o); g.position.set(x, y, z); s.add(g); return g; };
    const a = toon(new THREE.SphereGeometry(1.1, 32, 24), P[1], 0, 0, 0), b = toon(new THREE.TorusGeometry(.7, .3, 16, 32), P[2], -2.3, .4, 0), c2 = toon(new THREE.ConeGeometry(.7, 1.5, 24), P[3], 2.3, 0, 0), d = toon(new THREE.IcosahedronGeometry(.6, 0), P[2], 0, 2, -1.5);
    const floor = mesh(new THREE.CircleGeometry(5, 48), new THREE.MeshToonMaterial({ color: C(P[3]), gradientMap: gm }), 0, -1.4, 0); floor.rotation.x = -Math.PI / 2; s.add(floor);
    const c = cam(40); c.position.set(0, 1.6, 7.5); c.lookAt(0, .3, 0);
    return { scene: s, camera: c, tick(t) {
      a.position.y = Math.abs(Math.sin(t * 2.5)) * .6; a.rotation.y = t; b.rotation.set(t, t * .7, 0); b.position.y = .4 + Math.sin(t * 1.7) * .3;
      c2.rotation.z = Math.sin(t * 2) * .25; c2.position.y = Math.abs(Math.sin(t * 2.5 + 1)) * .4; d.rotation.set(t * .8, t, 0); d.position.y = 2 + Math.sin(t * 1.4) * .25;
    } };
  }
};

/* ---------------- renderer bersama ---------------- */
let renderer = null, cur = [0, 0];
function getRenderer() {
  if (!renderer) {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }
  return renderer;
}
function build(name, palette) { const f = B[name]; if (!f) throw new Error('Gaya tidak dikenal: ' + name); return f(palette); }
function draw(canvas, inst, t) {
  const r = getRenderer(), w = canvas.width, h = canvas.height;
  if (cur[0] !== w || cur[1] !== h) { r.setSize(w, h, false); cur = [w, h]; }
  const cm = inst.camera, a = w / h;
  if (cm.isPerspectiveCamera) {
    // layar vertikal: lebarkan sudut pandang agar objek tidak terpotong di kiri/kanan
    cm.userData.fov0 ??= cm.fov;
    cm.fov = a < 1.2 ? 2 * Math.atan(Math.tan(cm.userData.fov0 * Math.PI / 360) * Math.pow(1.6 / a, .8)) * 180 / Math.PI : cm.userData.fov0;
    cm.aspect = a; cm.updateProjectionMatrix();
  } else inst.resize?.(a);
  inst.tick(t); r.render(inst.scene, cm);
  canvas.getContext('2d').drawImage(r.domElement, 0, 0, w, h);
}

/* ---------------- kartu galeri ---------------- */
const cache = new Map(); let obs = null, raf = 0, last = 0; const vis = new Set(); const t0 = performance.now();
const inst = c => { const k = c.dataset.style; if (!cache.has(k)) cache.set(k, build(k, c.dataset.palette.split(','))); return cache.get(k); };
function loop(now) {
  raf = requestAnimationFrame(loop); if (now - last < 33) return; last = now;
  const t = (now - t0) / 1000;
  vis.forEach(c => { if (c.dataset.paused !== '1') draw(c, inst(c), t); });
}
export function stop() { cancelAnimationFrame(raf); raf = 0; obs && obs.disconnect(); obs = null; vis.clear(); }
export function mount(canvases, reduced) {
  stop(); try { getRenderer(); } catch { return false; }
  obs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { vis.add(e.target); if (!e.target._d) { draw(e.target, inst(e.target), 2.2); e.target._d = 1; } } else vis.delete(e.target);
  }), { rootMargin: '120px' });
  canvases.forEach(c => { if (reduced) c.dataset.paused = '1'; obs.observe(c); });
  raf = requestAnimationFrame(loop); return true;
}

/* ---------------- mode rekam 9:16 ---------------- */
export function stage(canvas, name, palette) {
  const it = build(name, palette); let id = 0; const s0 = performance.now();
  const go = now => { id = requestAnimationFrame(go); draw(canvas, it, (now - s0) / 1000); };
  id = requestAnimationFrame(go); return () => cancelAnimationFrame(id);
}

/* ---------------- capture frame demi frame (untuk render video di VM / komputer) ---------------- */
export const STYLE_NAMES = Object.keys(B);
export const PALETTES = {
  'Low-poly pastel': ['#FFD6A5', '#CAFFBF', '#9BF6FF', '#FDFFB6'], 'Neon cyberpunk': ['#0B0F1A', '#FF2E97', '#00E5FF', '#7C4DFF'],
  'Glassmorphism': ['#E8EEFF', '#B8C7FF', '#FFFFFF', '#FF9ECF'], 'Isometric mini-room': ['#FFE8D6', '#B7B7A4', '#6B705C', '#FFB4A2'],
  'Wireframe blueprint': ['#0D3B66', '#FAF0CA', '#F4D35E', '#EE964B'], 'Particle galaxy': ['#05010F', '#5B2A86', '#7AE7C7', '#F8F9FA'],
  'Clay / toy 3D': ['#FFB5A7', '#FCD5CE', '#F8EDEB', '#A2D2FF'], 'Voxel / pixel 3D': ['#2B2D42', '#8D99AE', '#EF233C', '#FFD166'],
  'Holographic iridescent': ['#0A0A1F', '#C77DFF', '#48CAE4', '#FFD6FF'], 'Product turntable studio': ['#F5F5F5', '#E0E0E0', '#222222', '#FF6B35'],
  'Synthwave sunset': ['#2D00F7', '#F20089', '#FF8C42', '#FFD60A'], 'Paper-cut layers': ['#FDF0D5', '#C6D8D3', '#D81E5B', '#3A3335'],
  'Toon / cel shading': ['#FFFFFF', '#FF595E', '#1982C4', '#FFCA3A']
};
export function createCaptureFromSpec(canvas, spec) {
  const it = buildSpecScene(spec);
  return { duration: it.duration, renderAt(t) { draw(canvas, it, t); } };
}
export function createCapture(canvas, name, palette) {
  const it = build(name, palette || PALETTES[name]);
  return { renderAt(t) { draw(canvas, it, t); } };
}
