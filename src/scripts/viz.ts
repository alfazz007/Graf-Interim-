/* Generative canvas visuals (navy/gold). Types: waves | sphere | stream | rings */
type RGB = [number, number, number];

function mkViz(cv: HTMLCanvasElement) {
  const type = cv.dataset.viz, soft = !!cv.dataset.soft, ctx = cv.getContext('2d')!, dpr = Math.min(2, devicePixelRatio || 1);
  const host = cv.parentElement!, alt = !!cv.closest('.card.alt');
  let w = 1, h = 1, mx = 0, my = 0, tx = 0, ty = 0;
  let pts: number[][] = [];
  let parts: { x: number; y: number; lane: number; v: number; j: number }[] = [];
  const C: RGB = alt ? [10, 26, 43] : [220, 187, 126], W: RGB = alt ? [10, 26, 43] : [255, 255, 255];
  const col = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
  const sp = (r: boolean) => ({ x: r ? Math.random() : -0.02, y: Math.random(), lane: Math.floor(Math.random() * 3), v: 0.0011 + Math.random() * 0.0016, j: Math.random() * 6.283 });
  function init() {
    pts = []; parts = [];
    if (type === 'sphere') { const n = 780, g = Math.PI * (3 - Math.sqrt(5)); for (let i = 0; i < n; i++) { const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = g * i; pts.push([Math.cos(th) * r, y, Math.sin(th) * r]); } }
    if (type === 'stream') for (let k = 0; k < 400; k++) parts.push(sp(true));
  }
  function size() { w = cv.offsetWidth || 1; h = cv.offsetHeight || 1; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); init(); }
  host.addEventListener('mousemove', (e) => { const r = host.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5; });
  host.addEventListener('mouseleave', () => { tx = 0; ty = 0; });
  const glow = (x: number, y: number, r: number, a: number) => { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col(C, a)); g.addColorStop(1, col(C, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); };
  const wy = (x: number, i: number, k: number, t: number) => { const p = x / w, amp = (5 + 38 * p * p) * (1 - k * 0.45); return h * (0.24 + 0.7 * k) - p * p * h * 0.3 * (1 - k * 0.6) + Math.sin(x * 0.011 + t * 0.0008 + i * 0.38 + mx * 2) * amp * 0.55 + Math.sin(x * 0.027 - t * 0.0012 + i * 0.9) * amp * 0.22 + my * 20 * (1 - k); };
  function waves(t: number) {
    const N = soft ? 26 : 34; ctx.lineWidth = 1;
    for (let i = 0; i < N; i++) {
      const k = i / (N - 1), a = soft ? 0.035 + 0.2 * Math.pow(1 - k, 2.5) : 0.05 + 0.78 * Math.pow(1 - k, 3);
      ctx.beginPath(); for (let x = 0; x <= w + 6; x += 6) { const y = wy(x, i, k, t); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.strokeStyle = k < 0.35 ? col(C, a) : col(W, a * 0.6); ctx.stroke();
    }
    if (!soft) {
      ctx.globalCompositeOperation = 'lighter';
      for (let j = 0; j < 3; j++) { const x = ((t * 0.00006 + j / 3) % 1) * w, y = wy(x, 0, 0, t); glow(x, y, 20, 0.9); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 2, 0, 6.283); ctx.fill(); }
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  function orbit(cx: number, cy: number, R: number, t: number, back: boolean) {
    const rx = R * 1.6, ry = R * 0.36; ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.32);
    ctx.strokeStyle = col(C, 0.3); ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, back ? Math.PI : 0, back ? Math.PI * 2 : Math.PI); ctx.stroke();
    for (let j = 0; j < 3; j++) {
      const an = t * 0.0004 + j * 2.094, s = Math.sin(an); if (s < 0 !== back) continue;
      const x = Math.cos(an) * rx, y = s * ry;
      ctx.fillStyle = col(C, 0.95); ctx.beginPath(); ctx.arc(x, y, j ? 2.6 : 4.2, 0, 6.283); ctx.fill();
      if (!j) { ctx.strokeStyle = col(C, 0.45); ctx.beginPath(); ctx.arc(x, y, 10, 0, 6.283); ctx.stroke(); }
    }
    ctx.restore();
  }
  function sphere(t: number) {
    const cx = w * 0.5 + mx * 30, cy = h * 0.47 + my * 20, R = Math.min(w, h) * 0.3, a = t * 0.00018 + mx * 1.2, tl = 0.42 + my * 0.5;
    const ca = Math.cos(a), sa = Math.sin(a), ct = Math.cos(tl), st = Math.sin(tl);
    orbit(cx, cy, R, t, true);
    for (const q of pts) {
      const x = q[0] * ca + q[2] * sa; let z = -q[0] * sa + q[2] * ca; const y = q[1] * ct - z * st; z = q[1] * st + z * ct;
      const d = (z + 1) / 2, s = 1 / (1.9 - z * 0.6);
      ctx.fillStyle = col(C, 0.1 + 0.8 * d * d); ctx.beginPath(); ctx.arc(cx + x * R * s * 1.25, cy + y * R * s * 1.25, 0.5 + 1.5 * d, 0, 6.283); ctx.fill();
    }
    orbit(cx, cy, R, t, false);
  }
  function stream(t: number) {
    const lanes = [h * 0.38, h * 0.5, h * 0.62]; ctx.strokeStyle = col(W, 0.07); ctx.lineWidth = 1;
    [0.3, 0.5, 0.7].forEach((g) => { ctx.beginPath(); ctx.moveTo(g * w, h * 0.16); ctx.lineTo(g * w, h * 0.84); ctx.stroke(); });
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i]; p.x += p.v; if (p.x > 1.03) { parts[i] = sp(false); continue; }
      let e = Math.min(1, Math.max(0, (p.x - 0.18) / 0.55)); e = e * e * (3 - 2 * e);
      const y0 = h * (0.12 + 0.76 * p.y) + Math.sin(t * 0.002 + p.j) * 14 * (1 - e), y = y0 + (lanes[p.lane] - y0) * e + my * 10, x = p.x * w, len = 5 + e * 24, a = 0.14 + 0.76 * e;
      ctx.strokeStyle = e > 0.5 ? col(C, a) : col(W, a * 0.7); ctx.lineWidth = e > 0.5 ? 1.4 : 1; ctx.beginPath(); ctx.moveTo(x - len, y); ctx.lineTo(x, y); ctx.stroke();
    }
    lanes.forEach((l) => glow(w * 0.97, l + my * 10, 26, 0.35));
    ctx.globalCompositeOperation = 'source-over';
  }
  function rings(t: number) {
    const cx = w * 0.5 + mx * 24, cy = h * 0.48 + my * 18, R = Math.min(w, h) * 0.34; ctx.lineWidth = 1;
    for (let i = 0; i < 120; i++) { const an = (i / 120) * 6.283 + t * 0.00005, l = i % 10 ? 5 : 12, r1 = R * 1.1; ctx.strokeStyle = col(W, i % 10 ? 0.12 : 0.38); ctx.beginPath(); ctx.moveTo(cx + Math.cos(an) * r1, cy + Math.sin(an) * r1); ctx.lineTo(cx + Math.cos(an) * (r1 + l), cy + Math.sin(an) * (r1 + l)); ctx.stroke(); }
    ([[1, 0.00025, [2, 6]], [0.84, -0.0004, [30, 10]], [0.7, 0.0006, [4, 4]], [0.56, -0.0003, [60, 18, 8, 18]], [0.42, 0.0008, [1, 5]], [0.28, -0.0005, [14, 8]]] as [number, number, number[]][]).forEach((d, k) => {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * d[1]); ctx.setLineDash(d[2]); ctx.strokeStyle = k % 2 ? col(W, 0.2) : col(C, 0.45); ctx.beginPath(); ctx.arc(0, 0, R * d[0], 0, 6.283); ctx.stroke(); ctx.restore();
    });
    ctx.setLineDash([]);
    const pr = 0.78 + Math.sin(t * 0.0006) * 0.06, s0 = -Math.PI / 2, e0 = s0 + pr * 6.283, g = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
    g.addColorStop(0, col(C, 0.15)); g.addColorStop(1, col(C, 1));
    ctx.lineCap = 'round'; ctx.lineWidth = 3; ctx.strokeStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 0.92, s0, e0); ctx.stroke(); ctx.lineCap = 'butt'; ctx.lineWidth = 1;
    const ex = cx + Math.cos(e0) * R * 0.92, ey = cy + Math.sin(e0) * R * 0.92;
    ctx.globalCompositeOperation = 'lighter'; glow(ex, ey, 24, 0.9); ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex, ey, 2.5, 0, 6.283); ctx.fill();
    [[0.7, 0.0011], [0.42, -0.0016], [0.56, 0.0007]].forEach((o, k) => { const an = t * o[1] + k * 2; ctx.fillStyle = col(C, 0.95); ctx.beginPath(); ctx.arc(cx + Math.cos(an) * R * o[0], cy + Math.sin(an) * R * o[0], 3, 0, 6.283); ctx.fill(); });
    ctx.globalCompositeOperation = 'lighter'; glow(cx, cy, 40, 0.35); ctx.globalCompositeOperation = 'source-over';
  }
  function draw(t: number) {
    mx += (tx - mx) * 0.05; my += (ty - my) * 0.05; ctx.clearRect(0, 0, w, h);
    if (type === 'waves') waves(t); else if (type === 'sphere') sphere(t); else if (type === 'stream') stream(t); else rings(t);
  }
  return { size, draw, on: false };
}

export function initViz({ ST, RM }: { ST: boolean; RM: boolean }) {
  const els = Array.from(document.querySelectorAll<HTMLCanvasElement>('canvas.viz'));
  if (!els.length) return;
  const VZ = els.map(mkViz);
  const sizeAll = () => { VZ.forEach((v) => v.size()); if (ST || RM) VZ.forEach((v) => v.draw(2600)); };
  sizeAll();
  addEventListener('resize', sizeAll);
  addEventListener('load', sizeAll);
  if (ST || RM) return;
  const io = new IntersectionObserver((es) => es.forEach((e) => { VZ[els.indexOf(e.target as HTMLCanvasElement)].on = e.isIntersecting; }), { rootMargin: '150px' });
  els.forEach((c) => io.observe(c));
  const loop = (t: number) => { VZ.forEach((v) => v.on && v.draw(t)); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
}
