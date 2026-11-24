/* =====================================================================
   PORTADAS DEL INICIO (versión 2, 12/11/2026) — se elige en
   Administrar › Contacto y datos › «Portada del inicio», o para ver una
   sin cambiarla: ?portada=video | estudio | ilustrada en el link.
   - video:     videos reales de los Agras pulverizando, uno tras otro.
   - estudio:   el T100 en un estudio oscuro, girando, con sus datos.
   - ilustrada: el amanecer en el campo dibujado (la de la versión 1),
                con el rocío saliendo de los 4 picos reales de la barra.
   ===================================================================== */
const PORTADAS = [['video', 'Video real de los drones en el campo'], ['estudio', 'El T100 en un estudio, girando'], ['ilustrada', 'Amanecer en el campo (dibujo)']];
const CLIPS_PORTADA = [
  { src: 'media/video/t50.mp4', n: 'DJI Agras T50', a: ['Pulverizando', 'Pulverizando'] },
  { src: 'media/video/t100.mp4', n: 'DJI Agras T100', a: ['Pulverizando', 'Pulverizando'] },
  { src: 'media/video/t25.mp4', n: 'DJI Agras T25P', a: ['En el campo', 'No campo'] },
  { src: 'media/video/t55.mp4', n: 'DJI Agras T55', a: ['En vuelo', 'Em voo'] }];
// Los 4 picos de la barra del T100 en la foto de frente (proporción de la imagen de 1080 × 1080)
const PICOS_T100 = [[.278, .575], [.348, .588], [.66, .588], [.727, .575]];

function portadaElegida(){
  const q = new URLSearchParams(location.search).get('portada');
  const p = q || Datos.get().config.portada || 'video';
  return PORTADAS.some(x => x[0] === p) ? p : 'video';
}

function portadaFondo(p){
  if (p === 'video') return `<div class="hero-fondo hero-videos">${[0, 1].map(i => `<video class="${i ? '' : 'act'}" muted playsinline preload="${i ? 'none' : 'auto'}" ${i ? '' : `src="${CLIPS_PORTADA[0].src}" poster="${CLIPS_PORTADA[0].src.replace(/\.mp4$/, '.jpg')}" autoplay`}></video>`).join('')}</div>`;
  if (p === 'estudio') return `<div class="hero-fondo hero-estudio"><div class="he-lineas">${fondoTopo()}</div><span class="he-foco"></span><span class="he-piso"></span></div>`;
  return `<div class="hero-fondo" data-prof="0.25">${fondoAmanecer()}</div><div class="hero-sol" aria-hidden="true"></div><canvas class="rocio" id="rocio"></canvas>`;
}

function portadaEscena(p, x){
  const pt = IDIOMA === 'pt', chip = `<a class="hero-modelo" href="#/drones/${x.id}"><small>${pt ? 'Novo' : 'Nuevo'}</small>DJI <b>${esc(x.nombre)}</b>${icono('flecha')}</a>`;
  if (p === 'video') return `<div class="hero-clip"><span class="hc-vivo"><i></i>${pt ? 'Vídeo real' : 'Video real'}</span><b id="hc-nombre">${esc(CLIPS_PORTADA[0].n)}</b><small id="hc-accion">${esc(CLIPS_PORTADA[0].a[pt ? 1 : 0])}</small>
      <div class="hc-puntos">${CLIPS_PORTADA.map((_, i) => `<i class="${i ? '' : 'act'}"></i>`).join('')}</div></div>`;
  if (p === 'estudio') {
    const sp = x.specs.slice(0, 3);
    return `<div class="hero-dron estudio-dron" data-prof="1">${x.imagenes.slice(0, 4).map((src, i) => `<img src="${esc(src)}" alt="DJI ${esc(x.nombre)}" class="${i ? '' : 'act'}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}>`).join('')}<i class="hero-sombra"></i></div>
      <div class="he-datos">${sp.map((s, i) => `<span style="--i:${i}"><b>${esc(tx(s.v))}<small>${esc(tx(s.u))}</small></b>${esc(tx(s.l))}</span>`).join('')}</div>${chip}`;
  }
  return `<div class="hero-dron" data-prof="1"><img src="${esc(x.imagenes[1] || x.imagenes[0])}" alt="DJI ${esc(x.nombre)}" fetchpriority="high"><i class="hero-sombra"></i></div>${chip}`;
}

/* --- Videos uno tras otro, con fundido --- */
function iniciarVideosPortada(v){
  const caja = $('.hero-videos', v); if (!caja) return;
  const [a, b] = $$('video', caja), puntos = $$('.hc-puntos i', v), pt = IDIOMA === 'pt';
  let i = 0, vis = a, oculto = b;
  const etiquetas = k => { const n = $('#hc-nombre', v), ac = $('#hc-accion', v); if (n) n.textContent = CLIPS_PORTADA[k].n; if (ac) ac.textContent = CLIPS_PORTADA[k].a[pt ? 1 : 0]; puntos.forEach((p, j) => p.classList.toggle('act', j === k)); };
  const preparar = k => { oculto.src = CLIPS_PORTADA[k].src; oculto.poster = CLIPS_PORTADA[k].src.replace(/\.mp4$/, '.jpg'); oculto.preload = 'auto'; oculto.load(); };
  const siguiente = () => {
    if (!caja.isConnected) return;
    i = (i + 1) % CLIPS_PORTADA.length;
    oculto.currentTime = 0; oculto.play().catch(() => {});
    oculto.classList.add('act'); vis.classList.remove('act'); etiquetas(i);
    [vis, oculto] = [oculto, vis];
    setTimeout(() => preparar((i + 1) % CLIPS_PORTADA.length), 900);
  };
  [a, b].forEach(x => x.addEventListener('ended', () => { if (x === vis) siguiente(); }));
  a.play().catch(() => {}); preparar(1);
  // Si el video está fuera de la pantalla, se pausa (ahorra datos en el celular)
  new IntersectionObserver(en => { if (en[0].isIntersecting) vis.play().catch(() => {}); else vis.pause(); }, { threshold: .1 }).observe(caja);
}

/* --- Estudio: el dron cambia de ángulo solo --- */
function iniciarEstudio(v){
  const imgs = $$('.estudio-dron img', v); if (imgs.length < 2 || QUIETO) return;
  let i = 0;
  const reloj = setInterval(() => {
    if (!imgs[0].isConnected) return clearInterval(reloj);
    if (document.hidden) return;
    const sale = imgs[i]; i = (i + 1) % imgs.length; const entra = imgs[i];
    if (!window.gsap) { sale.classList.remove('act'); entra.classList.add('act'); return; }
    gsap.to(sale, { xPercent: -30, rotationY: 30, scale: .85, opacity: 0, duration: .6, ease: 'power3.in', onComplete: () => { sale.classList.remove('act'); gsap.set(sale, { clearProps: 'all' }); } });
    entra.classList.add('act');
    gsap.fromTo(entra, { xPercent: 34, rotationY: -30, scale: .8, opacity: 0 }, { xPercent: 0, rotationY: 0, scale: 1, opacity: 1, duration: 1.1, delay: .25, ease: 'expo.out', clearProps: 'transform' });
  }, 4200);
}
