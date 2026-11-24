/* =====================================================================
   ANIMACIONES: scroll suave (Lenis), entrada de cada página, palabras
   que suben, tarjetas que aparecen al bajar, números que cuentan,
   botones magnéticos, luz que sigue al mouse, videos que se prenden
   solo al verlos y el producto que cae del dron de la portada.
   Sin internet (sin GSAP) la página se ve igual, sin movimiento.
   ===================================================================== */
const MOVIL = () => window.matchMedia('(max-width: 820px)').matches;
const QUIETO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let _obsAparece = null, _obsVideos = null, _obsContador = null;

function iniciarScrollSuave(){
  if (!window.gsap || QUIETO) return;
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (window.Lenis) {
    window.lenis = new Lenis({ lerp: .1, smoothWheel: true });
    if (window.ScrollTrigger) window.lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tm => window.lenis.raf(tm * 1000));
    gsap.ticker.lagSmoothing(0);
  }
}

function dividirPalabras(root){
  $$('[data-dividir]', root).forEach(el => {
    if (el.dataset.dividido) return; el.dataset.dividido = 1;
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="pal"><span>${esc(w)}</span></span>`).join(' ');
  });
}

/* --- Entrada de la página (después del telón o de la carga) --- */
function entradaPagina(){
  const p = $('#vista .pagina'); if (!p || !window.gsap || QUIETO) return;
  const titulo = $('h1[data-dividir]', p);
  const tl = gsap.timeline();
  if (titulo) tl.fromTo($$('.pal > span', titulo), { yPercent: 115, rotate: 3 }, { yPercent: 0, rotate: 0, duration: 1.1, stagger: .05, ease: 'expo.out' }, 0);
  const extra = $$('.hero-chip, .hero-sub, .hero-botones > *, .hero-claudio, .hero-ubic, .cabeza-in .sub, .cabeza-in .etiqueta, .asesor-btn, .cabeza-dron, .fd-hero-in > :not(h1), .fd-titulo, .cm-hero-in > :not(h1), .cm-hero-in h1, .serv-hero-txt > :not(h1), .nos-hero-txt .etiqueta, .ct-txt > .etiqueta, .ct-txt > .sub', p);
  if (extra.length) tl.fromTo(extra, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, stagger: .06, ease: 'expo.out', clearProps: 'transform' }, .15);
  const dron = $('.hero-dron', p);
  if (dron) tl.fromTo(dron, { yPercent: -70, xPercent: 30, scale: .6, opacity: 0 }, { yPercent: 0, xPercent: 0, scale: 1, opacity: 1, duration: 1.6, ease: 'expo.out' }, 0);
  const fondo = $('.hero-fondo svg, .fd-video, .cm-hero > img, .cabeza-video', p);
  if (fondo) tl.fromTo(fondo, { scale: 1.15 }, { scale: 1, duration: 2, ease: 'expo.out' }, 0);
}

/* --- Aparecer al bajar --- */
function observarApariciones(root){
  dividirPalabras(root);
  if (!window.gsap || QUIETO) { document.documentElement.classList.remove('anim'); return; }
  if (!_obsAparece) _obsAparece = new IntersectionObserver(en => en.forEach(e => {
    if (!e.isIntersecting) return; const el = e.target; _obsAparece.unobserve(el);
    if (el.matches('[data-dividir]')) { gsap.fromTo($$('.pal > span', el), { yPercent: 115 }, { yPercent: 0, duration: 1.05, stagger: .045, ease: 'expo.out' }); return; }
    const hermanos = el.parentElement ? $$(':scope > [data-aparece]', el.parentElement) : [el];
    const i = Math.max(0, hermanos.indexOf(el));
    gsap.to(el, { opacity: 1, x: 0, y: 0, scale: 1, duration: 1.05, delay: Math.min(i, 6) * .07, ease: 'expo.out', onStart: () => el.classList.add('visto'), clearProps: 'transform' });
  }), { rootMargin: '0px 0px -6% 0px', threshold: .06 });
  $$('[data-aparece], [data-dividir]', root).forEach(el => {
    if (el.matches('h1')) return;                       // el título principal lo anima entradaPagina
    if (el.matches('[data-dividir]')) gsap.set($$('.pal > span', el), { yPercent: 115 });
    _obsAparece.observe(el);
  });
}

/* --- Números que cuentan --- */
function contarNumeros(root){
  const lista = $$('.contador', root).filter(el => !el.dataset.contado);
  if (!window.gsap || QUIETO || (typeof EN_EDITOR !== 'undefined' && EN_EDITOR)) return;   // en el Estudio, quietos
  if (!_obsContador) _obsContador = new IntersectionObserver(en => en.forEach(e => {
    if (!e.isIntersecting) return; const el = e.target; _obsContador.unobserve(el);
    const fin = parseFloat(el.dataset.n), o = { v: 0 }, dec = (String(el.dataset.n).split('.')[1] || '').length;
    gsap.to(o, { v: fin, duration: 1.8, ease: 'power3.out', onUpdate: () => el.textContent = o.v.toLocaleString('es-UY', { minimumFractionDigits: dec, maximumFractionDigits: dec }) });
  }), { threshold: .4 });
  lista.forEach(el => { el.dataset.contado = 1; el.textContent = '0'; _obsContador.observe(el); });
}

/* --- Videos: se prenden solo cuando se ven (ahorra datos en el celular) --- */
function observarVideos(root){
  if (!_obsVideos) _obsVideos = new IntersectionObserver(en => en.forEach(e => {
    const v = e.target; if (e.isIntersecting) { if (v.preload !== 'auto') v.preload = 'auto'; v.play().catch(() => {}); } else v.pause();
  }), { threshold: .25 });
  $$('video[data-auto]', root).forEach(v => _obsVideos.observe(v));
}

/* --- Botones magnéticos y luz que sigue al mouse --- */
function activarMagneticos(root){
  if (MOVIL() || !window.gsap || QUIETO) return;
  $$('.magnetico', root).forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .22, y: (e.clientY - r.top - r.height / 2) * .32, duration: .4, ease: 'power3.out' }); });
    b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1,.35)' }));
  });
}
function activarFocos(root){
  $$('.foco', root).forEach(el => { if (el.dataset.foco) return; el.dataset.foco = 1;
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px'); }); });
}

/* --- Menú: sombra al bajar y se esconde mientras bajás rápido --- */
function navAlBajar(){
  let ultimo = 0;
  const f = () => { const y = window.scrollY, nav = $('#nav');
    nav.classList.toggle('solido', y > 20); document.body.classList.toggle('ver-wa', y > 500);
    nav.classList.toggle('oculto', y > 500 && y > ultimo + 4 && !_enTransicion);
    if (y < ultimo - 4) nav.classList.remove('oculto');
    ultimo = y; };
  window.addEventListener('scroll', f, { passive: true }); f();
}

/* --- Gotitas de producto que caen de los aspersores del dron --- */
function iniciarRocio(cv, dron, fuerza){
  if (!cv || !dron || QUIETO) return;
  const g = cv.getContext('2d'); let gotas = [], w = 0, h = 0; const dpr = Math.min(2, devicePixelRatio || 1);
  const medir = () => { const r = cv.getBoundingClientRect(); w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); };
  medir(); window.addEventListener('resize', medir);
  (function cuadro(){
    if (!cv.isConnected) return;
    requestAnimationFrame(cuadro);
    const c = cv.getBoundingClientRect(); if (c.bottom < 0 || c.top > innerHeight) return;
    g.clearRect(0, 0, w, h);
    const f = fuerza(), r = dron.getBoundingClientRect();
    if (f > .02 && r.width) {
      // Las gotas salen de los 4 picos reales de la barra (PICOS_T100), teniendo en cuenta cómo está recortada la foto
      const cs = getComputedStyle(dron), pos = cs.objectPosition.split(' ').map(z => parseFloat(z) / 100), nw = dron.naturalWidth || 1, nh = dron.naturalHeight || 1;
      const esc_ = cs.objectFit === 'cover' ? Math.max(r.width / nw, r.height / nh) : Math.min(r.width / nw, r.height / nh), dw = nw * esc_, dh = nh * esc_;
      const ox = r.left - c.left + (r.width - dw) * (isNaN(pos[0]) ? .5 : pos[0]), oy = r.top - c.top + (r.height - dh) * (isNaN(pos[1]) ? .5 : pos[1]);
      (typeof PICOS_T100 !== 'undefined' ? PICOS_T100 : [[.33, .64], [.67, .64]]).forEach(([px, py]) => { const x0 = ox + dw * px, y0 = oy + dh * py;
        for (let k = 0; k < 3 * f; k++) gotas.push({ x: x0 + (Math.random() - .5) * 6, y: y0, vx: (Math.random() - .5) * 1.6, vy: 1.4 + Math.random() * 2, v: 1, r: .7 + Math.random() * 1.4 }); });
    }
    gotas = gotas.filter(p => p.v > 0 && p.y < h);
    for (const p of gotas) { p.x += p.vx; p.y += p.vy; p.vy += .05; p.vx *= .99; p.v -= .0095;
      g.fillStyle = `rgba(235,248,255,${Math.max(0, p.v) * .5})`; g.beginPath(); g.arc(p.x, p.y, p.r * (1 + (1 - p.v) * 2.4), 0, 6.283); g.fill(); }
    if (gotas.length > 800) gotas.splice(0, gotas.length - 800);
  })();
}

function refrescarAnimaciones(root){
  root = root || document;
  observarApariciones(root); contarNumeros(root); observarVideos(root); activarMagneticos(root); activarFocos(root);
  if (window.ScrollTrigger) ScrollTrigger.refresh();
}
