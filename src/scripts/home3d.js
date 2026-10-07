// Home page 3D story (from the approved design). Loaded only on the home page,
// after the text has appeared. three.js is bundled with the site.
// Changes from the design: three.js is stored locally, the scene re-lays itself out on
// resize and phone rotation, and the small corner emblem renders at a lower frame rate.
import * as THREE from 'three';

export async function init(o) {
  const { mount, story, lite, onHover, onPick, links } = o;
  const C = { navy: 0x0B1F3A, em: 0x0E9F6E, emL: 0x2FD39A, white: 0xF7F9FB, gold: 0xD4A72C, blue: 0x7FA8E0 };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
  const smooth01 = x => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const hdr = (c, i) => lite ? new THREE.Color(c) : new THREE.Color(c).multiplyScalar(i);

  const renderer = new THREE.WebGLRenderer({ antialias: lite, powerPreference: lite ? 'low-power' : 'high-performance' });
  const PR = Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2);
  renderer.setPixelRatio(PR);
  renderer.setClearColor(C.navy, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  const cv = renderer.domElement;
  cv.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y;opacity:0;transition:opacity 1.2s ease;';
  cv.setAttribute('aria-hidden', 'true');
  mount.appendChild(cv);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(C.navy, 0.035);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 120);
  camera.position.set(0, 0, 14);

  // Studio environment built from code: soft white key, emerald and blue strips, a gold kicker
  const pm = new THREE.PMREMGenerator(renderer);
  { const es = new THREE.Scene();
    es.add(new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), new THREE.MeshBasicMaterial({ color: 0x08172d, side: THREE.BackSide })));
    const panel = (c, i, w, h, p) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(i), side: THREE.DoubleSide })); m.position.set(...p); m.lookAt(0, 0, 0); es.add(m); };
    panel(0xffffff, 4, 10, 3, [0, 9, 3]);
    panel(C.emL, 3, 2.5, 12, [-10, 0, 3]);
    panel(0x6f9bff, 2, 2.5, 12, [10, 1, -2]);
    panel(C.gold, 2, 2.5, 2.5, [5, -7, 6]);
    panel(0xffffff, 1.4, 8, 1.5, [0, -3, 10]);
    scene.environment = pm.fromScene(es, 0.03).texture; }

  scene.add(new THREE.AmbientLight(0x6f8fb8, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(4, 7, 8); scene.add(key);
  const pl = new THREE.PointLight(C.emL, 30, 24, 1.6); pl.position.set(0, 0, 5); scene.add(pl);
  const back = new THREE.PointLight(0x5d8fe0, 40, 30, 1.6); back.position.set(-6, 4, -6); scene.add(back);

  const root = new THREE.Group(); scene.add(root);
  const RIM = hdr(C.emL, 1.8);

  function rimify(mat, color, power, strength) {
    mat.userData.rim = { value: strength }; mat.userData.rimBase = strength;
    mat.onBeforeCompile = sh => {
      sh.uniforms.uRim = mat.userData.rim; sh.uniforms.uRimColor = { value: color }; sh.uniforms.uRimPow = { value: power };
      sh.fragmentShader = 'uniform float uRim;\nuniform vec3 uRimColor;\nuniform float uRimPow;\n' + sh.fragmentShader.replace('#include <emissivemap_fragment>',
        '#include <emissivemap_fragment>\n{ float fr = pow(1.0 - clamp(abs(dot(normal, normalize(vViewPosition))), 0.0, 1.0), uRimPow); totalEmissiveRadiance += uRimColor * fr * uRim; }');
    };
    return mat;
  }

  let dotTex, haloTex;
  { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.3, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    dotTex = new THREE.CanvasTexture(c); }
  if (lite) { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(46,211,154,0.5)'); gr.addColorStop(0.35, 'rgba(14,159,110,0.16)'); gr.addColorStop(1, 'rgba(14,159,110,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    haloTex = new THREE.CanvasTexture(c); }

  const rr = (w, h, r) => { const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; };
  const slab = (w, h, d, r, b = 0.012) => { const g = new THREE.ExtrudeGeometry(rr(w, h, r), { depth: d, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 2, curveSegments: 6 }); g.center(); return g; };
  const rcube = (s, r) => { const g = new THREE.ExtrudeGeometry(rr(s - 2 * r, s - 2 * r, r * 0.5), { depth: s - 2 * r, bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelSegments: 3, curveSegments: 4 }); g.center(); return g; };
  const up = new THREE.Vector3(0, 1, 0);
  const rod = (a, b, r, mat) => { const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b); const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, A.distanceTo(B), 8, 1, true), mat);
    m.position.copy(A).add(B).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(up, B.clone().sub(A).normalize()); return m; };

  function mkObj(key, name) {
    const group = new THREE.Group(); group.name = key;
    const ob = { key, name, group, mats: [], rims: [], hover: 0, base: new THREE.Vector3(), phase: Math.random() * 6, isT: false, update: () => {} };
    ob.reg = (m, always) => { m.userData.always = !!always; if (always) m.transparent = true; ob.mats.push({ m, op: m.opacity }); if (m.userData.rim) ob.rims.push(m); return m; };
    ob.dark = (opt = {}) => ob.reg(rimify(new THREE.MeshPhysicalMaterial(Object.assign({ color: 0x0c2040, metalness: 0.75, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.25 }, opt)), RIM, 2.6, 0.75));
    ob.glass = (opt = {}) => ob.reg(rimify(new THREE.MeshPhysicalMaterial(Object.assign(lite
      ? { color: 0x1d5480, metalness: 0.2, roughness: 0.06, transparent: true, opacity: 0.4, clearcoat: 1, envMapIntensity: 1.6, side: THREE.DoubleSide }
      : { color: 0xe6fbff, metalness: 0, roughness: 0.05, transmission: 1, thickness: 0.8, ior: 1.5, attenuationColor: new THREE.Color(0x0E9F6E), attenuationDistance: 2.6, clearcoat: 1, envMapIntensity: 1.5 }, opt)), RIM, 3, 0.9), lite);
    ob.glow = (c, i = 1.6, op = 1) => ob.reg(new THREE.MeshBasicMaterial({ color: hdr(c, i), opacity: op, toneMapped: false }), true);
    ob.line = (c, i = 1.2, op = 0.6) => ob.reg(new THREE.LineBasicMaterial({ color: hdr(c, i), opacity: op, toneMapped: false }), true);
    ob.hit = new THREE.Mesh(new THREE.SphereGeometry(1.7, 12, 8), new THREE.MeshBasicMaterial({ visible: false }));
    ob.hit.userData.key = key; group.add(ob.hit);
    if (haloTex) { ob.halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.25 })); ob.halo.scale.set(4.4, 4.4, 1); group.add(ob.halo); }
    return ob;
  }
  const objs = {};

  // WEB — a browser window with UI layers floating off the glass
  { const ob = mkObj('web', 'Web Development'); const g = ob.group; const W = 2.9, H = 2.0;
    const fs = rr(W, H, 0.16); fs.holes.push(rr(W - 0.12, H - 0.12, 0.11));
    const fg = new THREE.ExtrudeGeometry(fs, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.02, bevelSegments: 3, curveSegments: 10 }); fg.center();
    g.add(new THREE.Mesh(fg, ob.dark()));
    const bar = new THREE.Mesh(slab(W - 0.14, 0.3, 0.04, 0.08), ob.dark({ color: 0x10294c })); bar.position.set(0, H / 2 - 0.22, 0); g.add(bar);
    [C.gold, C.emL, C.white].forEach((c, i) => { const s = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 10), ob.glow(c, 2.2)); s.position.set(-W / 2 + 0.22 + i * 0.15, H / 2 - 0.22, 0.04); g.add(s); });
    const ab = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(rr(1.55, 0.14, 0.07).getPoints(8)), ob.line(C.emL, 1.6, 0.85)); ab.position.set(0.3, H / 2 - 0.22, 0.04); g.add(ab);
    const scr = new THREE.Mesh(new THREE.BoxGeometry(W - 0.14, H - 0.44, 0.03), ob.glass({ thickness: 0.2 })); scr.position.set(0, -0.15, -0.02); g.add(scr);
    ob.layers = [];
    const layer = (mesh, z) => { mesh.position.z = z; ob.layers.push({ m: mesh, z }); g.add(mesh); return mesh; };
    const hero = layer(new THREE.Mesh(slab(1.4, 0.82, 0.03, 0.06), ob.dark({ color: 0x143760 })), 0.12); hero.position.set(-0.6, -0.08, 0);
    layer(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.07, 0.01), ob.glow(C.emL, 2)), 0.2).position.set(-0.72, 0.13, 0);
    layer(new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.035, 0.01), ob.glow(C.white, 1.3, 0.85)), 0.2).position.set(-0.85, 0.0, 0);
    layer(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.035, 0.01), ob.glow(C.white, 1.1, 0.6)), 0.2).position.set(-0.92, -0.08, 0);
    layer(new THREE.Mesh(slab(0.4, 0.13, 0.02, 0.06), ob.glow(C.emL, 2.4)), 0.24).position.set(-1.0, -0.28, 0);
    [0.2, -0.09, -0.38].forEach((y, i) => {
      layer(new THREE.Mesh(slab(0.92, 0.22, 0.02, 0.05), ob.dark({ color: 0x173d68 })), 0.3 + i * 0.07).position.set(0.74, y, 0);
      layer(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.01), ob.glow(i === 1 ? C.gold : C.emL, 1.8)), 0.33 + i * 0.07).position.set(0.38, y, 0);
      layer(new THREE.Mesh(new THREE.BoxGeometry(0.5 - i * 0.08, 0.03, 0.01), ob.glow(C.white, 1.1, 0.7)), 0.33 + i * 0.07).position.set(0.8, y, 0);
    });
    const cs = new THREE.Shape(); [[0, 0], [0, -0.32], [0.085, -0.24], [0.15, -0.38], [0.2, -0.355], [0.135, -0.22], [0.25, -0.215]].forEach((p, i) => i ? cs.lineTo(p[0], p[1]) : cs.moveTo(p[0], p[1]));
    const cur = layer(new THREE.Mesh(new THREE.ExtrudeGeometry(cs, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.008, bevelSegments: 1 }), ob.glow(C.white, 2.4)), 0.55);
    cur.position.set(-0.86, -0.2, 0);
    ob.update = (t, h) => {
      ob.layers.forEach((L, i) => { L.m.position.z = L.z * (1 + h * 2.2) + Math.sin(t * 1.3 + i * 0.7) * 0.012; });
      cur.position.x = -0.86 + Math.sin(t * 0.9) * 0.08; cur.position.y = -0.2 + Math.cos(t * 1.1) * 0.05;
    };
    g.rotation.set(0.1, 0.38, -0.03); objs.web = ob; }

  // SOFTWARE — modular blocks assembling around a lit core
  { const ob = mkObj('software', 'Software Development'); const g = ob.group; const s = 0.46, gap = 0.54;
    const geo = rcube(s, 0.05), eg = new THREE.EdgesGeometry(new THREE.BoxGeometry(s * 1.03, s * 1.03, s * 1.03));
    const cells = []; for (let x = -1; x <= 1; x++) for (let z = -1; z <= 1; z++) if (!(x === 1 && z === 1)) cells.push([x, 0, z]);
    cells.push([-1, 1, 0], [0, 1, 0], [0, 1, -1], [1, 1, -1], [0, 1, 1], [-1, 1, -1], [0, 2, -1], [-1, 2, -1]);
    const dk = ob.dark(), dk2 = ob.dark({ color: 0x15406b }), gl = ob.glass({ thickness: 0.5 }), edge = ob.line(C.emL, 1.4, 0.4);
    const inner = new THREE.Group(); inner.position.y = -0.55; g.add(inner);
    ob.blocks = cells.map((p, i) => {
      const isCore = p[0] === 0 && p[1] === 0 && p[2] === 0;
      const m = new THREE.Mesh(isCore ? new THREE.BoxGeometry(s * 0.62, s * 0.62, s * 0.62) : geo, isCore ? ob.glow(C.emL, 3) : (i % 5 === 2 ? gl : i % 3 ? dk : dk2));
      if (!isCore) m.add(new THREE.LineSegments(eg, edge));
      inner.add(m); return { m, p: new THREE.Vector3(...p), i };
    });
    if (!lite) { const coreLight = new THREE.PointLight(C.emL, 6, 3, 2); inner.add(coreLight); }
    const mover = new THREE.Mesh(geo, gl); mover.add(new THREE.LineSegments(eg, ob.line(C.emL, 2.2, 0.9))); inner.add(mover);
    const slot = new THREE.Vector3(1, 0, 1);
    ob.update = (t, h) => {
      const k = gap * (1 + h * 0.38);
      ob.blocks.forEach(b => { b.m.position.copy(b.p).multiplyScalar(k); b.m.position.y += Math.sin(t * 1.4 + b.i) * 0.012; });
      const cyc = (t * 0.32) % 1, inT = ease(seg(cyc, 0.1, 0.45)), outT = ease(seg(cyc, 0.75, 1));
      const off = (1 - inT) * 1.4 + outT * 1.4;
      mover.position.set(slot.x * k + off, slot.y * k + off * 0.35, slot.z * k);
      mover.rotation.y = (1 - inT + outT) * 1.2;
    };
    g.rotation.set(0.42, -0.62, 0); objs.software = ob; }

  // DESIGN — a dispersive glass prism splitting a beam into the palette
  { const ob = mkObj('design', 'Graphic Design'); const g = ob.group;
    const pg = new THREE.CylinderGeometry(0.95, 0.95, 1.9, 3, 1);
    const prism = new THREE.Mesh(pg, ob.glass(lite ? { flatShading: true } : { dispersion: 5, iridescence: 0.7, iridescenceIOR: 1.5, thickness: 1.6, roughness: 0.02, attenuationDistance: 5, flatShading: true }));
    prism.add(new THREE.LineSegments(new THREE.EdgesGeometry(pg), ob.line(C.white, 1.8, 0.9)));
    prism.rotation.y = Math.PI / 6; g.add(prism);
    const beam = rod([-2.7, -0.38, 0], [-0.46, 0.02, 0], 0.022, ob.glow(C.white, 3)); g.add(beam);
    const fan = new THREE.Group(); fan.position.set(0.42, 0.05, 0); g.add(fan);
    const cols = [C.emL, 0x3fc7c0, 0x6f9bff, C.gold, 0xf2e6c4]; const pos = [], col = [];
    cols.forEach((c, i) => { const a1 = 0.5 - i * 0.2, a2 = a1 - 0.16, L = 2.6; const cc = hdr(c, 2.4);
      pos.push(0, 0, 0, Math.cos(a1) * L, Math.sin(a1) * L, 0, Math.cos(a2) * L, Math.sin(a2) * L, 0);
      col.push(cc.r, cc.g, cc.b, 0, 0, 0, 0, 0, 0); });
    const fg = new THREE.BufferGeometry(); fg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); fg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    fan.add(new THREE.Mesh(fg, ob.reg(new THREE.MeshBasicMaterial({ vertexColors: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }), true)));
    ob.shards = []; const sm = [ob.dark({ color: 0x163e66 }), ob.glass({ thickness: 0.3 })];
    for (let i = 0; i < 7; i++) { const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.07 + (i % 3) * 0.035), sm[i % 2]); g.add(m); ob.shards.push({ m, a: i / 7 * Math.PI * 2, r: 1.45 + (i % 2) * 0.25, y: (i % 3 - 1) * 0.5, sp: 0.25 + (i % 3) * 0.08 }); }
    ob.update = (t, h, dt) => {
      prism.rotation.y = Math.PI / 6 + Math.sin(t * 0.45) * 0.12;
      fan.scale.set(1 + h * 0.15, 1 + h * 0.6 + Math.sin(t * 1.2) * 0.04, 1);
      ob.shards.forEach(s => { s.a += dt * s.sp * (1 + h * 2); s.m.position.set(Math.cos(s.a) * s.r, s.y + Math.sin(t + s.a) * 0.1, Math.sin(s.a) * s.r * 0.6); s.m.rotation.x += dt; s.m.rotation.y += dt * 1.3; });
    };
    g.rotation.set(0.15, 0.3, 0.08); objs.design = ob; }

  // VIDEO — a play button in a glass dial with a running progress arc
  { const ob = mkObj('video', 'Video Marketing'); const g = ob.group; const R = 1.2;
    g.add(new THREE.Mesh(new THREE.TorusGeometry(R, 0.075, 24, 140), ob.dark()));
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(R - 0.1, R - 0.1, 0.06, 72), ob.glass({ thickness: 0.3 })); disc.rotation.x = Math.PI / 2; disc.position.z = -0.05; g.add(disc);
    const arcLen = Math.PI * 1.3;
    const arc = new THREE.Mesh(new THREE.TorusGeometry(R, 0.03, 8, 180, arcLen), ob.glow(C.emL, 2.6)); arc.position.z = 0.1; g.add(arc);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 10), ob.glow(C.white, 4)); head.position.z = 0.1; g.add(head);
    const T = 60, ticks = new THREE.InstancedMesh(new THREE.BoxGeometry(0.018, 1, 0.018), ob.glow(0xbfd3ea, 1.1, 0.55), T); const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), ps = new THREE.Vector3();
    for (let i = 0; i < T; i++) { const a = i / T * Math.PI * 2, l = i % 5 ? 0.07 : 0.16; ps.set(Math.cos(a) * (R + 0.2 + l / 2), Math.sin(a) * (R + 0.2 + l / 2), 0); q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), a - Math.PI / 2); sc.set(1, l, 1); m4.compose(ps, q, sc); ticks.setMatrixAt(i, m4); }
    g.add(ticks);
    const sh = new THREE.Shape(); const P = [[-0.4, -0.6], [0.66, 0], [-0.4, 0.6]];
    for (let i = 0; i < 3; i++) { const A = P[i], B = P[(i + 1) % 3], Cc = P[(i + 2) % 3];
      const s0 = [A[0] + (Cc[0] - A[0]) * 0.16, A[1] + (Cc[1] - A[1]) * 0.16], s1 = [A[0] + (B[0] - A[0]) * 0.16, A[1] + (B[1] - A[1]) * 0.16];
      if (!i) sh.moveTo(s0[0], s0[1]); else sh.lineTo(s0[0], s0[1]); sh.quadraticCurveTo(A[0], A[1], s1[0], s1[1]); }
    sh.closePath();
    const tg = new THREE.ExtrudeGeometry(sh, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 4, curveSegments: 10 }); tg.center();
    const playMat = ob.reg(rimify(new THREE.MeshPhysicalMaterial({ color: 0x0E9F6E, metalness: 0.35, roughness: 0.2, clearcoat: 1, emissive: 0x0E9F6E, emissiveIntensity: 0.45, envMapIntensity: 1.3 }), hdr(0xffffff, 1.4), 2.5, 0.6));
    const play = new THREE.Mesh(tg, playMat); play.position.set(0.06, 0, 0.12); g.add(play);
    ob.update = (t, h) => {
      arc.rotation.z = -t * 0.9; const a = arc.rotation.z + arcLen; head.position.x = Math.cos(a) * R; head.position.y = Math.sin(a) * R;
      play.scale.setScalar(1 + Math.sin(t * 2.2) * 0.025 + h * 0.1); playMat.emissiveIntensity = 0.45 + h * 1.4 + Math.sin(t * 2.2) * 0.1;
      ticks.rotation.z = t * 0.05;
    };
    g.rotation.set(-0.1, -0.4, 0); objs.video = ob; }

  // AI — a node network with signals travelling between nodes around a faceted core
  { const ob = mkObj('ai', 'AI Integrations'); const g = ob.group; const N = lite ? 44 : 96, R = 1.2; const pts = [];
    for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, rr2 = Math.sqrt(1 - y * y), th = i * 2.39996, k = R * (0.94 + ((i * 37) % 11) / 100);
      pts.push(new THREE.Vector3(Math.cos(th) * rr2 * k, y * k, Math.sin(th) * rr2 * k)); }
    const net = new THREE.Group(); g.add(net);
    const nodes = new THREE.InstancedMesh(new THREE.SphereGeometry(0.042, 10, 8), ob.glow(C.emL, 2.4), N); const m4 = new THREE.Matrix4();
    pts.forEach((p, i) => { const s = 0.6 + ((i * 53) % 9) / 10; m4.makeScale(s, s, s).setPosition(p); nodes.setMatrixAt(i, m4); }); net.add(nodes);
    const nb = pts.map(() => []); const lp = [];
    pts.forEach((p, i) => { pts.map((q, j) => [j, p.distanceTo(q)]).filter(x => x[0] !== i).sort((a, b) => a[1] - b[1]).slice(0, 3).forEach(([j]) => { if (!nb[i].includes(j)) { nb[i].push(j); nb[j].push(i); lp.push(p, pts[j]); } }); });
    net.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(lp), ob.line(C.emL, 1.1, 0.38)));
    const S = lite ? 8 : 24; const sig = new THREE.InstancedMesh(new THREE.SphereGeometry(0.03, 8, 6), ob.glow(C.white, 4), S); net.add(sig);
    const walkers = Array.from({ length: S }, (_, i) => { const a = (i * 13) % N; return { a, b: nb[a][0], t: Math.random(), sp: 0.6 + Math.random() * 0.8 }; });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.52, 1), ob.glass({ flatShading: true, thickness: 1, iridescence: lite ? 0 : 0.5 })); g.add(core);
    const coreGlow = new THREE.Mesh(new THREE.IcosahedronGeometry(0.24, 2), ob.glow(C.emL, 3.2)); g.add(coreGlow);
    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.6, 1)), ob.line(C.emL, 1.5, 0.45)); g.add(wire);
    const orbits = [[1.55, 0.9, 0.2], [1.7, -0.5, 0.9]].map(([r, ax, az]) => { const og = new THREE.Group(); og.rotation.set(ax, 0, az);
      og.add(new THREE.Mesh(new THREE.TorusGeometry(r, 0.006, 6, 160), ob.glow(0xbfd3ea, 1.4, 0.5)));
      const sat = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 8), ob.glow(C.gold, 2.6)); sat.position.x = r; og.add(sat); g.add(og); return og; });
    const v = new THREE.Vector3();
    ob.update = (t, h, dt) => {
      net.rotation.y += dt * 0.15; wire.rotation.y -= dt * 0.3; wire.rotation.x += dt * 0.12; core.rotation.y += dt * 0.2;
      const pu = 1 + Math.sin(t * 2.2) * 0.12 + h * 0.4; coreGlow.scale.setScalar(pu);
      walkers.forEach((w, i) => { w.t += dt * w.sp * (1 + h * 1.5); if (w.t >= 1) { w.t = 0; const prev = w.a; w.a = w.b; const opts = nb[w.a].filter(j => j !== prev); w.b = (opts.length ? opts : nb[w.a])[Math.floor(Math.random() * (opts.length || nb[w.a].length))]; }
        v.lerpVectors(pts[w.a], pts[w.b], w.t); m4.makeTranslation(v.x, v.y, v.z); sig.setMatrixAt(i, m4); });
      sig.instanceMatrix.needsUpdate = true;
      orbits[0].rotation.y = t * 0.5; orbits[1].rotation.y = -t * 0.38;
    };
    objs.ai = ob; }
  Object.values(objs).forEach(ob => { ob.ry = ob.group.rotation.y; ob.spin = 0; ob.group.userData.ob = ob; root.add(ob.group); });

  // The chain: five interlocked rings, alternating steel-navy and emerald metal
  const chain = new THREE.Group(); root.add(chain);
  const mkRing = c => rimify(new THREE.MeshPhysicalMaterial({ color: c, metalness: 0.88, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.7, transparent: true, opacity: 0 }), RIM, 2.4, 0.8);
  const ringA = mkRing(0x1b4a78), ringB = mkRing(0x0E9F6E);
  const ringEdge = new THREE.MeshBasicMaterial({ color: hdr(C.emL, 2.2), transparent: true, opacity: 0, toneMapped: false });
  const rings = []; const SP = 1.3;
  for (let i = 0; i < 5; i++) {
    const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.1, lite ? 14 : 28, lite ? 56 : 120), i % 2 ? ringB : ringA));
    const e = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.012, 6, 120), ringEdge); e.scale.setScalar(1.14); g.add(e);
    g.position.x = (i - 2) * SP; if (i % 2) g.rotation.x = Math.PI / 2; chain.add(g); rings.push(g);
  }
  chain.visible = false;

  let ringTex;
  { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 34, 64, 64, 62);
    gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.55, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); ringTex = new THREE.CanvasTexture(c); }
  const BM = lite ? 56 : 120; const beamCol = new THREE.Color(C.emL), headCol = new THREE.Color(0xd8fff0);
  const beams = links.map(([a, b], i) => {
    const pos = new Float32Array(BM * 3), col = new Float32Array(BM * 3);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ map: dotTex, vertexColors: true, size: lite ? 0.17 : 0.13, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
    pts.frustumCulled = false; pts.visible = false; root.add(pts);
    const head = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTex, color: hdr(0xd8fff0, 4), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false })); head.visible = false; root.add(head);
    const wave = new THREE.Sprite(new THREE.SpriteMaterial({ map: ringTex, color: hdr(C.emL, 2.6), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0, toneMapped: false })); root.add(wave);
    return { a, b, i, pts, pos, col, head, wave, arrived: false, wt: 1 };
  });
  const bz = new THREE.Vector3(), bA = new THREE.Vector3(), bB = new THREE.Vector3(), bC = new THREE.Vector3(), bD = new THREE.Vector3();
  const bez = (u, out) => { const m = 1 - u; return out.set(m * m * bA.x + 2 * m * u * bC.x + u * u * bB.x, m * m * bA.y + 2 * m * u * bC.y + u * u * bB.y, m * m * bA.z + 2 * m * u * bC.z + u * u * bB.z); };
  let focusS = 0;

  let dust;
  { const N = lite ? 320 : 1600; const pos = new Float32Array(N * 3), col = new Float32Array(N * 3); const cA = new THREE.Color(0x8fb8e8), cB = hdr(C.emL, 1.6);
    for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - .5) * 44; pos[i * 3 + 1] = (Math.random() - .5) * 28; pos[i * 3 + 2] = -Math.random() * 30 + 4; const c = Math.random() < 0.12 ? cB : cA; col.set([c.r, c.g, c.b], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    dust = new THREE.Points(g, new THREE.PointsMaterial({ map: dotTex, vertexColors: true, size: lite ? 0.09 : 0.07, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
    scene.add(dust); }

  // Bloom (desktop only): bright pass, two blur levels, soft highlight roll-off
  let bloom = null;
  if (!lite) {
    const opts = { type: THREE.HalfFloatType };
    const rtS = new THREE.WebGLRenderTarget(1, 1, Object.assign({ samples: 4 }, opts));
    const rA1 = new THREE.WebGLRenderTarget(1, 1, opts), rB1 = new THREE.WebGLRenderTarget(1, 1, opts), rA2 = new THREE.WebGLRenderTarget(1, 1, opts), rB2 = new THREE.WebGLRenderTarget(1, 1, opts);
    const vs = 'varying vec2 vUv;\nvoid main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';
    const mk = (u, fs) => new THREE.ShaderMaterial({ uniforms: u, vertexShader: vs, fragmentShader: fs, depthTest: false, depthWrite: false });
    const bright = mk({ t: { value: null }, th: { value: 0.85 } }, 'uniform sampler2D t; uniform float th; varying vec2 vUv;\nvoid main(){ vec3 c = texture2D(t, vUv).rgb; float l = dot(c, vec3(.2126,.7152,.0722)); gl_FragColor = vec4(c * smoothstep(th, th + .7, l), 1.0); }');
    const blur = mk({ t: { value: null }, dir: { value: new THREE.Vector2() } }, 'uniform sampler2D t; uniform vec2 dir; varying vec2 vUv;\nvoid main(){ vec3 c = texture2D(t, vUv).rgb * .227027;\n c += (texture2D(t, vUv + dir * 1.3846).rgb + texture2D(t, vUv - dir * 1.3846).rgb) * .3162162;\n c += (texture2D(t, vUv + dir * 3.2308).rgb + texture2D(t, vUv - dir * 3.2308).rgb) * .0702703;\n gl_FragColor = vec4(c, 1.0); }');
    const comp = mk({ tS: { value: rtS.texture }, b1: { value: rB1.texture }, b2: { value: rB2.texture }, k: { value: 0.9 } },
      'uniform sampler2D tS; uniform sampler2D b1; uniform sampler2D b2; uniform float k; varying vec2 vUv;\nvec3 sc(vec3 x){ vec3 a = vec3(.78); return mix(x, a + .22 * (1.0 - exp(-(x - a) / .22)), step(a, x)); }\nvoid main(){ vec3 c = texture2D(tS, vUv).rgb + (texture2D(b1, vUv).rgb * .8 + texture2D(b2, vUv).rgb * 1.2) * k; gl_FragColor = vec4(sc(c), 1.0);\n#include <colorspace_fragment>\n}');
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2)); quad.frustumCulled = false; const qs = new THREE.Scene(); qs.add(quad); const qc = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const pass = (mat, target) => { quad.material = mat; renderer.setRenderTarget(target); renderer.render(qs, qc); };
    bloom = {
      size(w, h) { const W2 = Math.max(1, Math.round(w * PR)), H2 = Math.max(1, Math.round(h * PR)); rtS.setSize(W2, H2); rA1.setSize(W2 >> 1 || 1, H2 >> 1 || 1); rB1.setSize(W2 >> 1 || 1, H2 >> 1 || 1); rA2.setSize(W2 >> 2 || 1, H2 >> 2 || 1); rB2.setSize(W2 >> 2 || 1, H2 >> 2 || 1); },
      render() {
        renderer.setRenderTarget(rtS); renderer.render(scene, camera);
        bright.uniforms.t.value = rtS.texture; pass(bright, rA1);
        blur.uniforms.t.value = rA1.texture; blur.uniforms.dir.value.set(1 / rA1.width, 0); pass(blur, rB1);
        blur.uniforms.t.value = rB1.texture; blur.uniforms.dir.value.set(0, 1 / rA1.height); pass(blur, rA1);
        blur.uniforms.t.value = rA1.texture; blur.uniforms.dir.value.set(1 / rA1.width, 0); pass(blur, rB1);
        blur.uniforms.t.value = rB1.texture; blur.uniforms.dir.value.set(2 / rA2.width, 0); pass(blur, rA2);
        blur.uniforms.t.value = rA2.texture; blur.uniforms.dir.value.set(0, 2 / rA2.height); pass(blur, rB2);
        pass(comp, null);
      },
      dispose() { [rtS, rA1, rB1, rA2, rB2].forEach(r => r.dispose()); }
    };
  }

  const LAY = {
    wide: { web: [0.38, 0.56, -0.8], software: [0.8, 0.5, -1.6], ai: [0.6, 0.02, 0.4], design: [0.4, -0.56, 0.3], video: [0.82, -0.46, -0.5], s: 0.92, z: 14, cs: 1, rel: true,
      spread: { design: [-0.6, 0.36, 0], web: [-0.06, 0.4, -0.4], video: [0.58, 0.38, -0.2], ai: [0.18, -0.22, 0.2], software: [0.6, -0.42, -0.4] } },
    tall: { web: [-1.6, 4.4, -0.5], software: [1.7, 4.7, -1.2], ai: [0.1, 2.5, 0], design: [-1.8, 0.8, 0.3], video: [1.8, 0.7, 0], s: 0.68, z: 16, cs: 0.72,
      spread: { design: [-0.5, 0.74, 0], web: [0.5, 0.66, -0.3], video: [-0.48, 0.2, -0.2], ai: [0.48, 0.12, 0.2], software: [0, -0.3, -0.3] } }
  };
  const order = ['design', 'web', 'video', 'ai', 'software'];
  let lay = LAY.wide, W = 1, H = 1, emblem = false, curSize = '';
  const E = () => (innerWidth < 600 ? 72 : 96);
  function setSize(w, h) {
    const k = w + 'x' + h; if (k === curSize) return; curSize = k;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); if (bloom) bloom.size(w, h);
  }
  function layout() {
    W = innerWidth; H = innerHeight; lay = W / H < 1 ? LAY.tall : LAY.wide;
    const hh = lay.z * Math.tan(20 * Math.PI / 180), hw = hh * W / H;
    if (lay.rel) { lay.s = clamp(hw / 10, 0.62, 0.95);
      Object.values(objs).forEach(ob => { const p = lay[ob.key]; ob.base.set(p[0] * hw, p[1] * hh, p[2]); }); }
    else Object.values(objs).forEach(ob => ob.base.set(...lay[ob.key]));
    lay.ss = lay.rel ? clamp(hw / 8.5, 0.7, 1.05) : 0.72;
    Object.values(objs).forEach(ob => { const p = lay.spread[ob.key]; ob.spread = new THREE.Vector3(p[0] * hw, p[1] * hh, p[2]); });
  }
  layout();
  // Re-lay out after a rotation once the browser has settled on the new size.
  let relayT = 0;
  const relayout = () => { layout(); clearTimeout(relayT); relayT = setTimeout(layout, 250); };

  const ray = new THREE.Raycaster(); const ptr = new THREE.Vector2(9, 9);
  let tiltX = 0, tiltY = 0, tx = 0, ty = 0, hovered = null, P = 0, down = null;
  const hits = Object.values(objs).map(ob => ob.hit);
  function pick(cx, cy) {
    if (emblem || P > 0.6) return null;
    const r = cv.getBoundingClientRect(); ptr.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera); const h = ray.intersectObjects(hits, false)[0];
    return h ? objs[h.object.userData.key] : null;
  }
  function setHover(ob) { if (ob === hovered) return; hovered = ob; document.body.style.cursor = ob ? 'pointer' : ''; if (!ob) onHover(null); }
  const onMove = e => {
    if (e.pointerType === 'touch') { if (down) { tx = clamp(tx + (e.clientX - down.x) / W * 0.6, -0.35, 0.35); ty = clamp(ty + (e.clientY - down.y) / H * 0.4, -0.25, 0.25); down.x = e.clientX; down.y = e.clientY; down.moved = true; } return; }
    tx = (e.clientX / W - 0.5) * 0.3; ty = (e.clientY / H - 0.5) * 0.2;
    if (e.target === cv) setHover(pick(e.clientX, e.clientY)); else setHover(null);
  };
  const onDown = e => { if (e.pointerType === 'touch') down = { x: e.clientX, y: e.clientY, moved: false }; };
  const onUp = e => {
    if (e.pointerType !== 'touch') return;
    const moved = down && down.moved; down = null; if (moved || e.target !== cv) return;
    if (emblem) { scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const ob = pick(e.clientX, e.clientY); if (ob && hovered === ob) onPick(ob.key); else setHover(ob);
  };
  const onClick = e => {
    if (e.target !== cv || e.pointerType === 'touch') return;
    if (emblem) { scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const ob = pick(e.clientX, e.clientY); if (ob) onPick(ob.key);
  };
  addEventListener('pointermove', onMove, { passive: true });
  addEventListener('pointerdown', onDown, { passive: true });
  addEventListener('pointerup', onUp, { passive: true });
  cv.addEventListener('click', onClick);
  addEventListener('resize', relayout);
  addEventListener('orientationchange', relayout);

  const v = new THREE.Vector3(), v2 = new THREE.Vector3();
  let run = !document.hidden, raf = 0, last = performance.now(), t = 0, frame = 0;
  function progress() { const r = story.getBoundingClientRect(); const span = r.height - innerHeight; return span > 0 ? clamp(-r.top / span, 0, 1) : 0; }
  function setFade(ob, f) {
    const wantT = f < 0.999;
    ob.mats.forEach(({ m, op }) => { m.opacity = op * f; if (!m.userData.always && m.transparent !== wantT) { m.transparent = wantT; m.needsUpdate = true; } });
  }
  function tick(now) {
    raf = requestAnimationFrame(tick); if (!run) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt; frame++;
    P = progress();
    const s4 = ease(seg(P, 0.86, 1));
    emblem = s4 >= 0.999;
    // The small corner emblem only needs about 20 frames a second.
    if (emblem && frame % 3) return;
    const e = E(), fw = innerWidth, fh = innerHeight;
    const w = Math.round(fw + (e - fw) * s4), h = Math.round(fh + (e - fh) * s4);
    const x = Math.round((fw - e - 18) * s4), y = Math.round(84 * s4);
    const ms = mount.style;
    ms.left = x + 'px'; ms.top = y + 'px'; ms.width = w + 'px'; ms.height = h + 'px';
    ms.borderRadius = s4 > 0 ? (50 * s4) + '%' : '0'; ms.zIndex = s4 > 0.02 ? '40' : '0';
    ms.boxShadow = s4 > 0.5 ? '0 0 0 1px rgba(14,159,110,.55), 0 8px 30px rgba(0,0,0,.35)' : 'none';
    ms.cursor = emblem ? 'pointer' : '';
    setSize(w, h);
    camera.position.z = lay.z + (s4 * (10 - lay.z));
    tiltX += (tx - tiltX) * 0.06; tiltY += (ty - tiltY) * 0.06;
    root.rotation.y = tiltX; root.rotation.x = tiltY;
    dust.rotation.y = t * 0.01;

    const j = ease(seg(P, 0.62, 0.76));
    const sp = ease(seg(P, 0.05, 0.14));
    const emph = {}, linkE = []; let focus = 0;
    const pan = new THREE.Vector3(); let pw = 0;
    links.forEach(([a, b], i) => { const st = 0.12 + i * 0.1; const e = seg(P, st - 0.02, st + 0.02) * (1 - seg(P, st + 0.08, st + 0.1)) * (1 - j);
      linkE[i] = e; emph[a] = Math.max(emph[a] || 0, e); emph[b] = Math.max(emph[b] || 0, e); focus = Math.max(focus, e);
      if (e > 0) { pan.addScaledVector(objs[a].spread, e * 0.5).addScaledVector(objs[b].spread, e * 0.5); pw += e; } });
    if (pw > 0) pan.multiplyScalar(1 / pw);
    focusS += (focus - focusS) * Math.min(1, dt * 5); focus = focusS;
    root.position.x += ((-pan.x * 0.18 * Math.min(1, pw)) - root.position.x) * 0.06;
    root.position.y += ((-pan.y * 0.18 * Math.min(1, pw)) - root.position.y) * 0.06;
    order.forEach((k, i) => {
      const ob = objs[k]; const g = ob.group; ob.em = (ob.em || 0) + ((emph[k] || 0) - (ob.em || 0)) * Math.min(1, dt * 5); const em = ob.em; ob.pop = (ob.pop || 0) * Math.max(0, 1 - dt * 2.5);
      v.lerpVectors(ob.base, ob.spread, sp); v.y += Math.sin(t * 0.8 + ob.phase) * 0.12 * (1 - j); v.z += em * 1.0 - (focus - em) * 1.4;
      v2.set((i - 2) * SP * lay.cs, 0, 0);
      g.position.lerpVectors(v, v2, j);
      ob.hover += ((hovered === ob ? 1 : 0) - ob.hover) * 0.1;
      const h = Math.max(ob.hover, em * 0.85);
      const baseS = lay.s + (lay.ss - lay.s) * sp;
      g.scale.setScalar(baseS * (1 + h * 0.06 + Math.sin(Math.min(1, (1 - ob.pop)) * Math.PI) * ob.pop * 0.25 + em * 0.2 - (focus - em) * 0.24) * (1 - j * 0.55));
      g.rotation.y = ob.ry + Math.sin(t * 0.35 + ob.phase) * 0.32 * (1 - j) + (ob.spin = (ob.spin + dt * ob.hover * 0.9) * (1 - dt * 0.8 * (1 - ob.hover)));
      const fade = 1 - seg(j, 0.45, 1);
      g.visible = fade > 0.01;
      if (!g.visible) return;
      setFade(ob, fade);
      ob.rims.forEach(m => { m.userData.rim.value = m.userData.rimBase * (1 + h * 1.8) * (1 - (focus - em) * 0.5); });
      if (ob.halo) ob.halo.material.opacity = (0.2 + h * 0.4) * fade;
      ob.update(t, h, dt);
      if (hovered === ob) { v.copy(g.position); g.parent.localToWorld(v); v.project(camera); const r = cv.getBoundingClientRect(); onHover({ key: k, name: ob.name, x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height - 80 * lay.s }); }
    });
    if (j > 0.3 && hovered) setHover(null);
    const linkFade = 1 - seg(j, 0, 0.4);
    beams.forEach((b, i) => {
      const st = 0.12 + i * 0.1; const lp = ease(seg(P, st, st + 0.06)); const act = linkE[i] || 0;
      const on = lp > 0.001 && linkFade > 0.01; b.pts.visible = on;
      if (!on) { b.head.visible = false; b.wave.material.opacity = 0; b.arrived = false; return; }
      const OA = objs[b.a].group, OB = objs[b.b].group;
      bA.copy(OA.position); bB.copy(OB.position); bD.subVectors(bB, bA); const len = bD.length() || 0.001;
      bC.addVectors(bA, bB).multiplyScalar(0.5); v.set(-bD.y, bD.x, 0).normalize().multiplyScalar(len * 0.2 * (i % 2 ? 1 : -1)); bC.add(v); bC.z += 0.9 + len * 0.06;
      const u0 = clamp(1.1 * OA.scale.x / len, 0, 0.32), u1 = 1 - clamp(1.1 * OB.scale.x / len, 0, 0.32), uEnd = u0 + (u1 - u0) * lp;
      const drawn = lp >= 0.999 ? 1 : 0, baseI = (0.22 + 0.6 * act) * linkFade, hi = lite ? 1 : 2.2;
      for (let k = 0; k < BM; k++) {
        const f = k / (BM - 1), u = u0 + (u1 - u0) * f; bez(u, bz); b.pos[k * 3] = bz.x; b.pos[k * 3 + 1] = bz.y; b.pos[k * 3 + 2] = bz.z;
        let I = 0;
        if (u <= uEnd + 1e-4) {
          const tr = (uEnd - u) / Math.max(0.001, u1 - u0); I = baseI + Math.exp(-Math.pow(tr * 10, 2)) * (1 - drawn) * 1.6 * linkFade;
          if (drawn) for (let n = 0; n < 3; n++) { let d = f - ((t * (0.35 + 0.4 * act) + n / 3) % 1); I += Math.exp(-d * d * 500) * (0.35 + 1.4 * act) * linkFade; }
          I *= smooth01(f * 6) * smooth01((1 - f) * 6 + (1 - drawn) * 6);
        }
        I *= hi; b.col[k * 3] = beamCol.r * I + headCol.r * I * 0.15; b.col[k * 3 + 1] = beamCol.g * I; b.col[k * 3 + 2] = beamCol.b * I + headCol.b * I * 0.1;
      }
      b.pts.geometry.attributes.position.needsUpdate = true; b.pts.geometry.attributes.color.needsUpdate = true;
      b.head.visible = !drawn; if (!drawn) { bez(uEnd, bz); b.head.position.copy(bz); const hs = 0.55 + Math.sin(t * 9) * 0.06; b.head.scale.set(hs, hs, 1); b.head.material.opacity = linkFade; }
      if (drawn && !b.arrived) { b.arrived = true; b.wt = 0; OB.userData.ob.pop = 1; }
      if (lp < 0.95) b.arrived = false;
      if (b.wt < 1) { b.wt = Math.min(1, b.wt + dt * 1.3); bez(u1, bz); b.wave.position.copy(bz); const s = 0.5 + ease(b.wt) * 2.8 * OB.scale.x; b.wave.scale.set(s, s, 1); b.wave.material.opacity = (1 - b.wt) * linkFade; } else b.wave.material.opacity = 0;
    });
    const cA = seg(j, 0.4, 1);
    chain.visible = cA > 0;
    if (chain.visible) {
      ringA.opacity = ringB.opacity = cA; ringEdge.opacity = 0.75 * cA;
      chain.scale.setScalar(lay.cs * (0.85 + 0.15 * cA) * (1 + s4 * (lay === LAY.tall ? 0.25 : 0)));
      rings.forEach((r, i) => { r.rotation.y = Math.sin(t * 0.6 + i) * 0.05; });
      chain.rotation.x = t * 0.35; chain.rotation.z = 0.12 + Math.sin(t * 0.3) * 0.05; chain.rotation.y = s4 * 0.5;
    }
    pl.intensity = 30 + Math.sin(t * 1.4) * 5;
    if (bloom) bloom.render(); else { renderer.setRenderTarget(null); renderer.render(scene, camera); }
  }
  // Pause completely while the browser tab is hidden.
  const onVis = () => { run = !document.hidden; last = performance.now(); };
  document.addEventListener('visibilitychange', onVis);
  raf = requestAnimationFrame(tick);
  requestAnimationFrame(() => requestAnimationFrame(() => { cv.style.opacity = '1'; }));

  return {
    destroy() {
      cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', onVis);
      removeEventListener('pointermove', onMove); removeEventListener('pointerdown', onDown); removeEventListener('pointerup', onUp);
      removeEventListener('resize', relayout); removeEventListener('orientationchange', relayout);
      if (bloom) bloom.dispose(); pm.dispose(); renderer.dispose(); cv.remove();
    }
  };
}
