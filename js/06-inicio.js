/* =====================================================================
   PÁGINA · INICIO: portada con el amanecer en el campo (el fondo de la
   marca) y el T100 pulverizando, Claudio en primer plano, accesos
   rápidos, drones destacados, próximo curso con cuenta regresiva,
   promociones e Instagram.
   ===================================================================== */
/* Partes del inicio: cada una es un bloque «sis» que el Estudio puede mover u ocultar (versión 3, 24/11/2026) */
function datosInicio(){
    const d = Datos.get(), T = d.textos, cl = d.claudio;
    const t100 = d.drones.find(x => x.id === 't100') || d.drones[0];
    const accesos = [
      ['drones', 'b_comprar', 'b_comprar_d', 'media/fotos/t55-sierras.webp'],
      ['tienda', 'b_rep', 'b_rep_d', 'media/fotos/t100-bomba.jpg'],
      ['servicio', 'b_serv', 'b_serv_d', cl.foto3 || cl.foto2],
      ['cursos', 'b_cursos', 'b_cursos_d', 'media/instagram/curso-operador.jpg']];
    const curso = cursosVisibles().find(c => c.fecha >= hoyISO()) || cursosVisibles()[0];
    const promos = d.promos.filter(p => p.visible !== false).slice(0, 3);
    const P = portadaElegida();                 // portada elegida en el panel (06b-portadas.js)
      return { d, T, cl, t100, accesos, curso, promos, P };
}
const SIS_INICIO = {
  portada(){ const { d, T, cl, t100, accesos, curso, promos, P } = datosInicio();
    return `<section class="hero">
      <div class="hero-card portada-${P}">
        ${portadaFondo(P)}
        <div class="hero-grid">
          <div class="hero-txt">
            <span class="hero-chip">${icono('escudo')} ${esc(tx(T.heroEtiqueta))}</span>
            <h1 class="hero-titulo" data-dividir>${esc(tx(T.heroTitulo))}</h1>
            <p class="hero-sub">${esc(tx(T.heroSub))}</p>
            <div class="hero-botones">
              <a class="btn btn-blanco magnetico" href="#/drones">${t('ver_drones')} ${icono('flecha')}</a>
              <a class="btn btn-vidrio magnetico" href="#/tienda">${t('ir_tienda')}</a>
            </div>
          </div>
          <div class="hero-escena">${portadaEscena(P, t100)}</div>
        </div>
        <div class="hero-pie">
          <div class="hero-ubic">${icono('ubicacion')} Rivera · Uruguay</div>
          <a class="hero-claudio" href="#/nosotros">
            <img src="${esc(cl.foto)}" alt="${esc(cl.nombre)}">
            <div><b>${esc(cl.nombre)}</b><small>${esc(tx(cl.cargo))}</small><span>${t('conoce_equipo')} ${icono('flecha')}</span></div>
          </a>
        </div>
      </div>
    </section>`; },
  cinta(){ const { d, T, cl, t100, accesos, curso, promos, P } = datosInicio();
    return `${cintaHTML()}`; },
  accesos(){ const { d, T, cl, t100, accesos, curso, promos, P } = datosInicio();
    return `<section class="bloque buscas">
      <div class="contenedor">
        <div class="cabecera"><div><span class="etiqueta"><i></i>Drones del Pampa</span><h2 class="titulo" data-dividir>${esc(tx(T.buscasTitulo))}</h2></div></div>
        <div class="accesos">${accesos.map(([ruta, k, kd, img], i) => `
          <a class="acceso foco" href="#/${ruta}" data-aparece style="--i:${i}">
            <img src="${esc(img)}" alt="" loading="lazy"><span class="acceso-velo"></span>
            <span class="acceso-n">0${i + 1}</span>
            <div class="acceso-txt"><b>${t(k)}</b><span>${t(kd)}</span></div>
            <span class="acceso-ir">${icono('flecha')}</span></a>`).join('')}</div>
      </div>
    </section>`; },
  claudio(){ const { d, T, cl, t100, accesos, curso, promos, P } = datosInicio();
    return `<section class="bloque noche claudio">
      <div class="claudio-topo">${fondoTopo()}</div>
      <div class="contenedor claudio-in">
        <div class="claudio-video" data-aparece="izq">
          <div class="telefono"><video src="${esc(cl.video)}" poster="${esc(cl.video.replace(/\.mp4$/, '.jpg'))}" muted loop playsinline preload="none" data-auto></video>
            <button class="claudio-sonido" onclick="sonidoVideo(this)">${icono('mute')}<span>${t('sonido')}</span></button></div>
          <img class="claudio-foto2" src="${esc(cl.foto2)}" alt="" loading="lazy">
        </div>
        <div class="claudio-txt">
          <span class="etiqueta"><i></i>${esc(cl.nombre)} · ${esc(tx(cl.cargo))}</span>
          <h2 class="titulo" data-dividir>${esc(tx(T.claudioTitulo))}</h2>
          <blockquote data-aparece>“${esc(tx(cl.frase))}”</blockquote>
          <div class="firma" data-aparece><svg viewBox="0 0 220 60"><path d="M8 42 C 30 10 44 12 38 40 S 60 52 72 24 S 92 30 96 42 S 120 14 132 36 S 150 46 162 28 S 190 26 212 34"/></svg><span>${esc(cl.nombre)}</span></div>
          <div class="valores">${d.valores.map(v => `<div class="valor" data-aparece>${icono(v.icono)}<b>${esc(tx(v.t))}</b><span>${esc(tx(v.d))}</span></div>`).join('')}</div>
          <a class="btn btn-wa magnetico" href="${waLink(msjClaudio())}" target="_blank" rel="noopener" data-aparece>${icono('wa')} ${t('hablar_claudio')}</a>
        </div>
      </div>
    </section>`; },
  campo(){ const { d, T, cl, t100, accesos, curso, promos, P } = datosInicio();
    return `${campoHTML()}`; },
  destacados(){ const { d, T, cl, t100, accesos, curso, promos, P } = datosInicio();
    return `<section class="bloque noche destacados">
      <div class="contenedor">
        <div class="cabecera"><div><span class="etiqueta"><i></i>DJI Agriculture</span><h2 class="titulo" data-dividir>${t('destacados')}</h2></div>
          <div class="carrusel-flechas" data-aparece><button onclick="moverCarrusel(-1)" aria-label="‹">${icono('flecha')}</button><button onclick="moverCarrusel(1)" aria-label="›">${icono('flecha')}</button>
            <a class="enlace" href="#/drones">${t('ver_todo')} ${icono('flecha')}</a></div></div>
      </div>
      <div class="carrusel" id="carrusel">${dronesVisibles().map(tarjetaDron).join('')}</div>
      <div class="contenedor"><div class="carrusel-progreso" id="carrusel-progreso"><i></i></div></div>
    </section>`; },
  explorar(){ const { d, T, cl, t100, accesos, curso, promos, P } = datosInicio();
    return `${explorarHTML(t100)}`; },
  curso(){ const { d, T, cl, t100, accesos, curso, promos, P } = datosInicio();
    return `${curso ? `<section class="bloque niebla">
      <div class="contenedor"><a class="curso-banner foco" href="#/cursos/${curso.id}" data-aparece>
        <div class="cb-img"><img src="${esc(curso.imagen)}" alt="" loading="lazy"></div>
        <div class="cb-txt"><span class="etiqueta"><i></i>${t('proximo_curso')} · ${esc(fechaLarga(curso.fecha))}</span>
          <h3>${esc(tx(curso.titulo))}</h3><p>${esc(tx(curso.bajada))}</p>
          <div class="cuenta" data-fecha="${esc(curso.fecha)}"></div>
          <div class="cb-pie"><span class="chip">${libresDe(curso)} ${t('cupos_libres')}</span><span class="btn btn-azul btn-chico">${t('inscribirme')} ${icono('flecha')}</span></div></div>
      </a></div>
    </section>` : ''}`; },
  promos(){ const { d, T, cl, t100, accesos, curso, promos, P } = datosInicio();
    return `${promos.length ? `<section class="bloque">
      <div class="contenedor">
        <div class="cabecera"><div><span class="etiqueta"><i></i>${t('promos')}</span><h2 class="titulo chico" data-dividir>${IDIOMA === 'pt' ? 'Oportunidades deste mês' : 'Oportunidades de este mes'}</h2></div></div>
        <div class="promos">${promos.map(tarjetaPromo).join('')}</div>
      </div>
    </section>` : ''}`; },
  instagram(){ const { d, T, cl, t100, accesos, curso, promos, P } = datosInicio();
    return `<section class="bloque niebla ig">
      <div class="contenedor">
        <div class="cabecera"><div><span class="etiqueta"><i></i>${t('instagram')}</span><h2 class="titulo chico" data-dividir>@dragur_rivera_drones_del_pampa</h2></div>
          <a class="btn btn-borde" href="${esc(d.config.instagram)}" target="_blank" rel="noopener" data-aparece>${icono('instagram')} ${t('ver_ig')}</a></div>
        <div class="ig-grilla">${d.instagram.slice(0, 8).map(p => `
          <a class="ig-item" href="${esc(p.url)}" target="_blank" rel="noopener" data-aparece>
            <img src="${esc(p.img)}" alt="" loading="lazy">${p.video ? `<video src="${esc(p.video)}" muted loop playsinline preload="none"></video><span class="ig-play">${icono('play')}</span>` : ''}
            <span class="ig-ver">${icono('instagram')}</span></a>`).join('')}</div>
      </div>
    </section>`; }
};
PAGINAS.inicio = {
  html(){ return PARTES_INICIO.map(([k]) => SIS_INICIO[k]()).join(''); },
  alMostrar(v){
    iniciarHero(v); iniciarCampo(v); iniciarDronGuia(v); iniciarExplorar(v);
    activarCarrusel($('#carrusel', v));
    $$('.cuenta', v).forEach(cuentaRegresiva);
    $$('.ig-item', v).forEach(a => { const vid = $('video', a); if (!vid) return;
      a.addEventListener('mouseenter', () => { vid.preload = 'auto'; vid.play().catch(() => {}); a.classList.add('reproduce'); });
      a.addEventListener('mouseleave', () => { vid.pause(); a.classList.remove('reproduce'); }); });
  }
};

const hoyISO = () => new Date().toISOString().slice(0, 10);

function tarjetaPromo(p){
  const msg = (IDIOMA === 'pt' ? 'Olá! Tenho interesse na promoção: ' : '¡Hola! Me interesa la promoción: ') + tx(p.titulo);
  return `<article class="promo foco" data-aparece>
    <div class="promo-img"><img src="${esc(p.imagen)}" alt="" loading="lazy"></div>
    <div class="promo-txt"><h3>${esc(tx(p.titulo))}</h3><p>${esc(tx(p.texto))}</p>
      ${p.hasta ? `<small class="promo-hasta">${t('hasta')} ${esc(fechaLarga(p.hasta))}</small>` : ''}
      <div class="promo-pie">${p.precio ? precioHTML(p.precio, p.precioAntes) : '<span></span>'}
        <a class="btn btn-azul btn-chico" href="${waLink(msg)}" target="_blank" rel="noopener">${t('ver_promo')}</a></div></div></article>`;
}

// Activa / desactiva el sonido del video de Claudio
function sonidoVideo(b){
  const v = $('video', b.parentElement); v.muted = !v.muted; if (!v.muted) v.play().catch(() => {});
  b.innerHTML = icono(v.muted ? 'mute' : 'sonido') + `<span>${v.muted ? t('sonido') : ''}</span>`; b.classList.toggle('activo', !v.muted);
}

/* --- Carrusel de drones (arrastrar o flechas) --- */
function activarCarrusel(c){
  if (!c) return;
  let x0 = null, s0 = 0, movio = false;
  c.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; x0 = e.clientX; s0 = c.scrollLeft; movio = false; c.classList.add('arrastrando'); });
  window.addEventListener('pointermove', e => { if (x0 === null) return; const dx = e.clientX - x0; if (Math.abs(dx) > 5) movio = true; c.scrollLeft = s0 - dx; });
  window.addEventListener('pointerup', () => { x0 = null; c.classList.remove('arrastrando'); });
  c.addEventListener('click', e => { if (movio) { e.preventDefault(); e.stopPropagation(); movio = false; } }, true);
}
function moverCarrusel(d){ const c = $('#carrusel'); if (!c) return; const w = ($('.dron-card', c) || {}).offsetWidth || 320; c.scrollBy({ left: d * (w + 20), behavior: 'smooth' }); }

/* --- Cuenta regresiva al próximo curso --- */
function cuentaRegresiva(el){
  const [a, m, d] = el.dataset.fecha.split('-').map(Number); const fin = new Date(a, m - 1, d, 9, 0, 0);
  const pintar = () => {
    if (!el.isConnected) return clearInterval(id);
    let s = Math.max(0, (fin - new Date()) / 1000);
    const dd = Math.floor(s / 86400); s -= dd * 86400; const hh = Math.floor(s / 3600); s -= hh * 3600; const mm = Math.floor(s / 60);
    el.innerHTML = `<small>${t('faltan')}</small>` + [[dd, 'dias'], [hh, 'horas'], [mm, 'min']].map(([n, k]) => `<div><b>${String(n).padStart(2, '0')}</b><span>${t(k)}</span></div>`).join('');
  };
  const id = setInterval(pintar, 30000); pintar();
}

/* --- Portada: el dron sigue al mouse, el campo se mueve y cae producto --- */
function iniciarHero(v){
  const card = $('.hero-card', v); if (!card) return;
  const t0 = performance.now(); iniciarRocio($('#rocio', v), $('.hero-dron img', v), () => performance.now() - t0 > 1900 ? 1 : 0);
  iniciarVideosPortada(v); iniciarEstudio(v);
  if (MOVIL() || QUIETO || !window.gsap) return;
  const capas = $$('[data-prof]', card);
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    capas.forEach(c => { const p = +c.dataset.prof; gsap.to(c, { x: x * 40 * p, y: y * 26 * p, rotate: c.classList.contains('hero-dron') ? x * 6 : 0, duration: 1.2, ease: 'power3.out' }); });
  });
  card.addEventListener('pointerleave', () => capas.forEach(c => gsap.to(c, { x: 0, y: 0, rotate: 0, duration: 1.4, ease: 'power3.out' })));
}
