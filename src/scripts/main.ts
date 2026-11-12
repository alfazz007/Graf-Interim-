import Lenis from 'lenis';
import { initViz } from './viz';

const R = document.documentElement;
const Q = new URLSearchParams(location.search);
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ST = Q.has('static');
if (ST) R.classList.add('static');
const fine = matchMedia('(pointer:fine)').matches;
const $ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => c.querySelector<T>(s) as T | null;
const $$ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => Array.from(c.querySelectorAll<T>(s));

/* ---------- Statement word scrub ---------- */
const stmt = $('[data-scrub]');
if (stmt) {
  (function walk(n: Node) {
    Array.from(n.childNodes).forEach((c) => {
      if (c.nodeType === 3) {
        const f = document.createDocumentFragment();
        (c.textContent || '').split(/(\s+)/).forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) { f.appendChild(document.createTextNode(' ')); return; }
          const s = document.createElement('span'); s.className = 'w'; s.textContent = p; f.appendChild(s);
        });
        c.parentNode!.replaceChild(f, c);
      } else if (c.nodeType === 1) walk(c);
    });
  })(stmt);
}
const stmtWords = stmt ? $$('.w', stmt) : [];

/* ---------- Reveal on scroll ---------- */
const targets = $$('.rv,.rvl,.clip,.card,.st');
const heroScope = $('.hero');
if (ST || RM || !('IntersectionObserver' in window)) targets.forEach((e) => e.classList.add('in'));
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  targets.forEach((e) => { if (!heroScope || !heroScope.contains(e)) io.observe(e); });
}
function heroIn() {
  R.classList.add('ready');
  $$('.hero .rv, .hero .hl-in, .ph .rv, .ph .rvl').forEach((e) => e.classList.add('in'));
}

/* ---------- Loader (home only, once per session) ---------- */
const ld = $('.loader');
if (!ld) heroIn();
else if (ST || RM || sessionStorage.getItem('gi-seen')) { ld.style.display = 'none'; heroIn(); }
else {
  const cnt = $('.cnt', ld)!, bar = $<HTMLElement>('.bar i', ld)!;
  let t0 = 0; const D = 1600;
  const step = (t: number) => {
    if (!t0) t0 = t;
    const p = Math.min((t - t0) / D, 1), e = 1 - Math.pow(1 - p, 3);
    cnt.textContent = String(Math.round(e * 100)); bar.style.transform = `scaleX(${e})`;
    if (p < 1) requestAnimationFrame(step);
    else setTimeout(() => { ld.classList.add('out'); heroIn(); sessionStorage.setItem('gi-seen', '1'); setTimeout(() => (ld.style.display = 'none'), 1200); }, 160);
  };
  requestAnimationFrame(step);
  setTimeout(() => { if (!R.classList.contains('ready')) { ld.style.display = 'none'; heroIn(); } }, 4000); // safety
}

/* ---------- Smooth scroll ---------- */
let lenis: Lenis | null = null;
if (!ST && !RM) {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  const raf = (t: number) => { lenis!.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  $$<HTMLAnchorElement>('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')!;
    if (id.length > 1 && document.querySelector(id)) { e.preventDefault(); lenis!.scrollTo(id, { duration: 1.4 }); }
  }));
}

/* ---------- Pinned scenes (home) ---------- */
const pinOK = !ST && !RM;
const kp = $('.kp'), kpis = $$('.kpi'), kpNav = $$('.kp-nav li'), kpIx = $('.kp-pg .ix'), kpBar = $<HTMLElement>('.kp-pg .bar i');
const ro = $('.roar'), track = $<HTMLElement>('.track'), roBar = $<HTMLElement>('.roar-pg .bar i');
const cards = $$('.card');
let tw = 0;
function measure() {
  if (!ro || !track) return;
  track.style.transform = '';
  if (R.classList.contains('pin')) { tw = track.scrollWidth - innerWidth; ro.style.setProperty('--rh', tw + innerHeight * 1.15 + 'px'); }
  else ro.style.removeProperty('--rh');
}
function setPin() { R.classList.toggle('pin', pinOK && innerWidth > 900 && !!(kp || ro)); measure(); }

/* ---------- Scroll loop ---------- */
const hdr = $('#hdr'), prog = $<HTMLElement>('.progress'), hm = $<HTMLElement>('.hero-m .pl'), hc = $<HTMLElement>('.hero-c'), abp = $<HTMLElement>('.abp');
let lastY = -1;
function frame() {
  const y = scrollY, vh = innerHeight, H = document.documentElement.scrollHeight - vh;
  if (y !== lastY) {
    if (prog) prog.style.transform = `scaleX(${H > 0 ? y / H : 0})`;
    if (hdr && Math.abs(y - lastY) > 4) hdr.classList.toggle('hide', y > lastY && y > vh * 0.6 && !hdr.matches(':hover, :focus-within'));
    if (hdr) hdr.classList.toggle('scrolled', y > 40);
    if (!ST && hm && hc && y < vh * 1.2) { hm.style.transform = `translateY(${y * 0.18}px)`; hc.style.transform = `translateY(${-y * 0.12}px)`; hc.style.opacity = String(Math.max(0, 1 - y / (vh * 0.75))); }
    if (stmt) {
      if (ST || RM) stmtWords.forEach((w) => w.classList.add('on'));
      else { const r = stmt.getBoundingClientRect(), p = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (r.height + vh * 0.3))), n = Math.round(p * stmtWords.length * 1.12); stmtWords.forEach((w, i) => w.classList.toggle('on', i < n)); }
    }
    if (!ST) cards.forEach((c, i) => {
      const nx = cards[i + 1];
      if (!nx) { c.style.transform = ''; c.style.filter = ''; return; }
      const a = c.getBoundingClientRect(), b = nx.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, 1 - (b.top - a.top) / a.height));
      c.style.transform = `scale(${1 - p * 0.06})`; c.style.filter = `brightness(${1 - p * 0.35})`;
    });
    if (R.classList.contains('pin')) {
      if (kp) {
        const kr = kp.getBoundingClientRect(), kpP = Math.min(1, Math.max(0, -kr.top / (kr.height - vh))), idx = Math.min(3, Math.floor(kpP * 4));
        kpis.forEach((k, i) => { k.classList.toggle('on', i === idx); k.classList.toggle('past', i < idx); });
        kpNav.forEach((l, i) => l.classList.toggle('on', i === idx));
        if (kpIx) kpIx.textContent = '0' + (idx + 1);
        if (kpBar) kpBar.style.transform = `scaleX(${kpP})`;
      }
      if (ro && track) {
        const rr = ro.getBoundingClientRect(), rp = Math.min(1, Math.max(0, -rr.top / (rr.height - vh)));
        track.style.transform = `translate3d(${-rp * tw}px,0,0)`;
        if (roBar) roBar.style.transform = `scaleX(${rp})`;
      }
    }
    if (abp && !ST) { const ar = abp.parentElement!.getBoundingClientRect(); if (ar.top < vh && ar.bottom > 0) abp.style.transform = `translateX(-46%) translateY(${(ar.top / vh) * 40}px)`; }
    lastY = y;
  }
  requestAnimationFrame(frame);
}

/* ---------- Cursor, magnetic, previews ---------- */
if (fine && !RM && !ST) {
  R.classList.add('has-cur');
  const cd = $<HTMLElement>('.cur')!, cr = $<HTMLElement>('.cur-r')!, crl = $('span', cr)!;
  let mx = -100, my = -100, rx = -100, ry = -100;
  addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
  const c = () => { rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16; cd.style.transform = `translate(${mx}px,${my}px)`; cr.style.transform = `translate(${rx}px,${ry}px) scale(${cr.classList.contains('on') ? 1 : 0})`; requestAnimationFrame(c); };
  c();
  $$('[data-cur]').forEach((el) => {
    el.addEventListener('mouseenter', () => { crl.textContent = el.getAttribute('data-cur'); cr.classList.add('on'); });
    el.addEventListener('mouseleave', () => cr.classList.remove('on'));
  });
  $$('.mg').forEach((el) => {
    el.addEventListener('mousemove', (e) => { const b = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - b.left - b.width / 2) * 0.22}px,${(e.clientY - b.top - b.height / 2) * 0.3}px)`; });
    el.addEventListener('mouseleave', () => { el.style.transition = 'transform .7s cubic-bezier(.16,1,.3,1),color .5s'; el.style.transform = ''; setTimeout(() => (el.style.transition = ''), 700); });
  });
  const pv = $<HTMLElement>('.pv');
  if (pv) {
    const pim: Record<string, HTMLImageElement> = {}; let px = 0, py = 0;
    $$('[data-img]').forEach((el) => {
      const src = el.getAttribute('data-img')!;
      if (!pim[src]) { const im = new Image(); im.src = src; im.alt = ''; pv.appendChild(im); pim[src] = im; }
      el.addEventListener('mouseenter', () => { pv.classList.add('on'); for (const k in pim) pim[k].classList.toggle('on', k === src); });
      el.addEventListener('mouseleave', () => pv.classList.remove('on'));
    });
    const pl = () => { px += (mx - px) * 0.12; py += (my - py) * 0.12; pv.style.transform = `translate(${px + 30}px,${py - 96}px) rotate(${Math.max(-8, Math.min(8, (mx - px) * 0.05))}deg)`; requestAnimationFrame(pl); };
    pl();
  }
}

/* ---------- Overlay menu ---------- */
const ov = $('#ovl'), mb = $('.menu-b');
if (ov && mb) {
  const tog = (o: boolean) => { ov.classList.toggle('open', o); ov.setAttribute('aria-hidden', String(!o)); mb.setAttribute('aria-expanded', String(o)); if (lenis) o ? lenis.stop() : lenis.start(); document.body.style.overflow = o ? 'hidden' : ''; };
  mb.addEventListener('click', () => tog(true));
  $('.x', ov)?.addEventListener('click', () => tog(false));
  $$('a', ov).forEach((a) => a.addEventListener('click', () => tog(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') tog(false); });
}

/* ---------- Video (click to play, self-hosted) ---------- */
$$('.vid').forEach((v) => {
  const btn = $<HTMLButtonElement>('.play', v), video = $<HTMLVideoElement>('video', v);
  btn?.addEventListener('click', () => { btn.remove(); if (video) { video.controls = true; video.play().catch(() => {}); } });
});

/* ---------- Contact form ---------- */
$$<HTMLFormElement>('form[data-contact]').forEach((form) => {
  const status = $('.fstatus', form)!, btn = $<HTMLButtonElement>('button[type=submit]', form)!;
  const msg = JSON.parse(form.dataset.msg || '{}');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    status.className = 'fstatus';
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email || '');
    if (!data.name?.trim() || !okEmail || !data.message?.trim() || !data.consent) { status.textContent = msg.invalid; status.className = 'fstatus err'; return; }
    btn.disabled = true; const label = $('.lbl', btn); const prev = label?.textContent; if (label) label.textContent = msg.sending;
    try {
      const res = await fetch('/api/contact/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, lang: R.lang }) });
      const j = await res.json().catch(() => ({}));
      if (res.ok && j.ok) { form.reset(); status.textContent = msg.ok; status.className = 'fstatus ok'; }
      else throw new Error(j.error || 'send_failed');
    } catch { status.textContent = msg.err; status.className = 'fstatus err'; }
    finally { btn.disabled = false; if (label) label.textContent = prev || ''; }
  });
});

/* ---------- Init ---------- */
initViz({ ST, RM });
setPin();
addEventListener('resize', setPin);
addEventListener('load', measure);
document.fonts?.ready.then(measure);
requestAnimationFrame(frame);
