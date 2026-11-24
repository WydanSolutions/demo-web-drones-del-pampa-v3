/* =====================================================================
   DRON QUE ACOMPAÑA AL BAJAR + CAMPO PARA FUMIGAR (versión 2, 12/11/2026)
   - En el inicio, un T100 visto desde arriba (con su sombra) va cruzando
     la página de un lado al otro mientras bajás, inclinándose en las curvas.
   - «Así trabaja un Agras»: un campo dibujado con la ruta marcada. Se
     completa ARRASTRANDO el dron por la ruta (pedido de la usuaria: no al
     bajar la página). Lo fumigado se pone verde y se cuentan hectáreas,
     litros y % (ejemplo a 10 L/ha). «Ver cómo lo hace solo» lo recorre
     automáticamente y «Empezar de nuevo» lo deja seco otra vez.
   Con movimiento reducido no se muestra el dron que acompaña.
   ===================================================================== */
const CAMPO = { filas: 6, x0: 40, x1: 560, y0: 70, paso: 54, ha: 12, lha: 10 };

// La ruta como una línea de puntos (ida y vuelta por cada pasada) y su largo
function rutaCampo(){
  const C = CAMPO, pts = [];
  for (let i = 0; i < C.filas; i++) { const y = C.y0 + i * C.paso, a = i % 2 ? C.x1 : C.x0, b = i % 2 ? C.x0 : C.x1; pts.push([a, y], [b, y]); }
  const acum = [0]; for (let k = 1; k < pts.length; k++) acum.push(acum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
  return { pts, acum, total: acum[acum.length - 1] };
}

function campoHTML(){
  const pt = IDIOMA === 'pt', C = CAMPO, R = rutaCampo();
  const filas = Array.from({ length: C.filas }, (_, i) => {
    const y = C.y0 + i * C.paso;
    return `<g class="cf-fila"><rect class="cf-seco" x="${C.x0}" y="${y - 20}" width="${C.x1 - C.x0}" height="40" rx="6"/>
      <rect class="cf-verde" x="${C.x0}" y="${y - 20}" width="0" height="40" rx="6"/>
      ${Array.from({ length: 26 }, (_, k) => `<line class="cf-surco" x1="${C.x0 + 10 + k * 20}" y1="${y - 14}" x2="${C.x0 + 10 + k * 20}" y2="${y + 14}"/>`).join('')}</g>`;
  }).join('');
  const d = R.pts.map((p, k) => (k ? 'L' : 'M') + p[0] + ' ' + p[1]).join(' ');
  const fin = R.pts[R.pts.length - 1];
  return `<section class="bloque campo-sec" id="campo-sec"><div class="contenedor campo-in">
      <div class="campo-txt">
        <span class="etiqueta"><i></i>${pt ? 'Assim trabalha um Agras' : 'Así trabaja un Agras'}</span>
        <h2 class="titulo chico">${pt ? 'Passada a passada, <b>sem pisar a lavoura</b>' : 'Pasada a pasada, <b>sin pisar el cultivo</b>'}</h2>
        <p class="sub">${pt ? 'Experimente: pegue o drone e leve-o pela linha. Assim ele trabalha no campo: rota marcada, altura certa e nenhum pedaço repetido ou esquecido.' : 'Probalo: agarrá el dron y llevalo por la línea. Así trabaja en el campo: ruta marcada, altura justa y ningún pedazo repetido ni olvidado.'}</p>
        <div class="campo-datos">
          <div><b id="cf-ha">0,0</b><small>${pt ? 'hectares' : 'hectáreas'}</small></div>
          <div><b id="cf-l">0</b><small>${pt ? 'litros aplicados' : 'litros aplicados'}</small></div>
          <div><b id="cf-p">0 %</b><small>${pt ? 'do lote' : 'del lote'}</small></div>
        </div>
        <div class="campo-listo" id="cf-listo">${icono('check')}<span>${pt ? '<b>Lote pronto!</b> 12 ha e 120 L, sem pisar uma planta.' : '<b>¡Lote terminado!</b> 12 ha y 120 L, sin pisar una planta.'}</span></div>
        <div class="campo-btns">
          <button type="button" class="btn btn-azul btn-chico" id="cf-solo">${icono('play')} ${pt ? 'Ver como ele faz sozinho' : 'Ver cómo lo hace solo'}</button>
          <button type="button" class="btn btn-borde btn-chico" id="cf-reset">${pt ? 'Começar de novo' : 'Empezar de nuevo'}</button>
        </div>
        <p class="campo-nota">${pt ? 'Exemplo ilustrativo: lote de 12 ha a 10 L/ha.' : 'Ejemplo ilustrativo: lote de 12 ha a 10 L/ha.'}</p>
      </div>
      <div class="campo-mapa">
        <svg viewBox="0 0 600 420" aria-hidden="true">
          <defs><pattern id="cf-pasto" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#5e8a3a"/><circle cx="2" cy="2" r="1" fill="#6f9c45"/></pattern></defs>
          <rect x="0" y="0" width="600" height="420" rx="26" fill="url(#cf-pasto)"/>
          <rect x="18" y="26" width="564" height="${C.filas * C.paso + 16}" rx="14" fill="#8a6b3c" opacity=".35"/>
          ${filas}
          <path class="cf-ruta" d="${d}"/>
          <g class="cf-meta"><circle cx="${fin[0]}" cy="${fin[1]}" r="9"/><path d="M${fin[0] - 4} ${fin[1]} l3 3 l6 -6"/></g>
          <g class="cf-poste"><line x1="575" y1="20" x2="575" y2="8"/><circle cx="575" cy="8" r="4"/></g>
        </svg>
        <div class="cf-dron" id="cf-dron" role="slider" tabindex="0" aria-label="${pt ? 'Arraste o drone pela rota' : 'Arrastrá el dron por la ruta'}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <span class="cf-rocio"></span><span class="cf-sombra"></span><img src="media/drones/t100-arriba.png" alt="" draggable="false"></div>
        <div class="cf-pista" id="cf-pista"><span class="cf-mano">${icono('flecha')}</span>${pt ? 'Pegue o drone e leve-o pela linha' : 'Agarrá el dron y llevalo por la línea'}</div>
      </div>
    </div></section>`;
}

function iniciarCampo(v){
  const sec = $('#campo-sec', v); if (!sec) return;
  const C = CAMPO, R = rutaCampo(), L = C.x1 - C.x0;
  const dron = $('#cf-dron', sec), svg = $('.campo-mapa svg', sec), mapa = $('.campo-mapa', sec), verdes = $$('.cf-verde', sec);
  const ha = $('#cf-ha', sec), lt = $('#cf-l', sec), pc = $('#cf-p', sec), pista = $('#cf-pista', sec), listo = $('#cf-listo', sec);
  let s = 0, sMax = 0, xPrev = null, quieto = null, auto = null;

  const punto = d => {                                   // posición sobre la ruta a la distancia d
    d = Math.max(0, Math.min(R.total, d));
    let k = 1; while (k < R.acum.length - 1 && R.acum[k] < d) k++;
    const a = R.pts[k - 1], b = R.pts[k], t = (d - R.acum[k - 1]) / ((R.acum[k] - R.acum[k - 1]) || 1);
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  };
  const masCerca = (x, y) => {                           // distancia sobre la ruta del punto más cercano al dedo
    let mejor = 0, dmin = Infinity;
    for (let k = 1; k < R.pts.length; k++) {
      const a = R.pts[k - 1], b = R.pts[k], dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy || 1;
      const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / l2)), px = a[0] + dx * t, py = a[1] + dy * t, dd = (x - px) ** 2 + (y - py) ** 2;
      if (dd < dmin) { dmin = dd; mejor = R.acum[k - 1] + Math.sqrt(l2) * t; }
    }
    return mejor;
  };
  const dibujar = () => {
    const [x, y] = punto(s), caja = svg.getBoundingClientRect(), m = mapa.getBoundingClientRect(), k = caja.width / 600;
    dron.style.transform = `translate(${caja.left - m.left + x * k}px, ${caja.top - m.top + y * k}px) translate(-50%,-50%) rotate(${xPrev === null ? 0 : Math.max(-25, Math.min(25, (x - xPrev) * 2))}deg)`;
    xPrev = x;
    // cada pasada empieza en i × (largo + giro); se pinta hasta lo más lejos que llegó el dron
    verdes.forEach((r, i) => { const ini = i * (L + C.paso), w = Math.max(0, Math.min(L, sMax - ini)); r.setAttribute('width', w); r.setAttribute('x', i % 2 ? C.x1 - w : C.x0); });
    const f = sMax / R.total, hecho = f * C.ha;
    ha.textContent = hecho.toLocaleString('es-UY', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    lt.textContent = Math.round(hecho * C.lha).toLocaleString('es-UY'); pc.textContent = Math.round(f * 100) + ' %';
    dron.setAttribute('aria-valuenow', Math.round(f * 100));
    const termino = f >= .995; sec.classList.toggle('terminado', termino);
    if (termino && !listo.dataset.festejo) { listo.dataset.festejo = 1; if (window.gsap && !QUIETO) gsap.fromTo(listo, { scale: .8, opacity: 0 }, { scale: 1, opacity: 1, duration: .7, ease: 'back.out(2)' }); }
  };
  const mover = (nuevo, desdeDedo) => {
    // con el dedo no se puede saltar adelante: hay que seguir la ruta (sí se puede volver)
    if (desdeDedo && nuevo > sMax + 70) return;
    s = Math.max(0, Math.min(R.total, nuevo)); sMax = Math.max(sMax, s);
    dron.classList.add('fumiga'); clearTimeout(quieto); quieto = setTimeout(() => dron.classList.remove('fumiga'), 220);
    pista.classList.add('oculta'); dibujar();
  };
  const pararAuto = () => { if (auto) { auto.kill ? auto.kill() : cancelAnimationFrame(auto); auto = null; } };

  // Arrastrar el dron (mouse o dedo)
  const aDibujo = e => { const c = svg.getBoundingClientRect(), k = c.width / 600; return [(e.clientX - c.left) / k, (e.clientY - c.top) / k]; };
  let arrastrando = false;
  dron.addEventListener('pointerdown', e => { e.preventDefault(); pararAuto(); arrastrando = true; dron.setPointerCapture(e.pointerId); dron.classList.add('agarrado'); });
  dron.addEventListener('pointermove', e => { if (!arrastrando) return; const [x, y] = aDibujo(e); mover(masCerca(x, y), true); });
  const soltar = () => { arrastrando = false; dron.classList.remove('agarrado'); };
  dron.addEventListener('pointerup', soltar); dron.addEventListener('pointercancel', soltar);
  // Con el teclado: flechas para avanzar o volver
  dron.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); mover(s + 30); } if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); mover(s - 30); } });
  // «Ver cómo lo hace solo»
  $('#cf-solo', sec).onclick = () => {
    pararAuto(); if (s >= R.total - 1) { s = 0; sMax = 0; listo.dataset.festejo = ''; }
    const resto = R.total - s, dur = Math.max(2, resto / R.total * 9);
    if (window.gsap && !QUIETO) { const o = { v: s }; auto = gsap.to(o, { v: R.total, duration: dur, ease: 'none', onUpdate: () => mover(o.v) }); }
    else mover(R.total);
  };
  $('#cf-reset', sec).onclick = () => { pararAuto(); s = 0; sMax = 0; xPrev = null; listo.dataset.festejo = ''; pista.classList.remove('oculta'); dibujar(); };
  const alCambiar = () => { if (!sec.isConnected) { window.removeEventListener('resize', alCambiar); return; } dibujar(); };
  window.addEventListener('resize', alCambiar);
  requestAnimationFrame(dibujar); setTimeout(dibujar, 600);          // por si el diseño termina de acomodarse después
  new IntersectionObserver(en => { if (en[0].isIntersecting) dibujar(); }).observe(mapa);
}

/* --- El dron que acompaña por toda la página de inicio --- */
function iniciarDronGuia(v){
  const viejo = $('#dron-guia'); if (viejo) viejo.remove();
  if (QUIETO || !$('.pagina-inicio', v)) return;
  const g = document.createElement('div'); g.id = 'dron-guia'; g.className = 'dron-guia'; g.setAttribute('aria-hidden', 'true');
  g.innerHTML = '<span class="dg-sombra"></span><img src="media/drones/t100-arriba.png" alt="">'; document.body.appendChild(g);
  const hero = $('.hero', v), tapan = [$('#campo-sec', v), ...$$('.explorar', v)].filter(Boolean), pie = $('.pie', v);
  let x = innerWidth / 2, vx = 0, pedido = false;
  const mover = () => {
    pedido = false; if (!g.isConnected) return;
    if (!hero.isConnected) { g.remove(); return quitar(); }
    const y = scrollY, alto = document.documentElement.scrollHeight - innerHeight, p = alto > 0 ? y / alto : 0;
    // se esconde donde hay otro dron (el campo y «Conocelo por dentro») y en el pie
    const enCampo = tapan.some(el => { const r = el.getBoundingClientRect(); return r.top < innerHeight * .85 && r.bottom > innerHeight * .15; });
    const enPie = pie && pie.getBoundingClientRect().top < innerHeight * .8;
    const ver = y > hero.offsetHeight * .55 && !enCampo && !enPie;
    g.classList.toggle('ver', ver);
    const ancho = innerWidth, margen = Math.min(140, ancho * .12);
    const objetivo = margen + (ancho - 2 * margen) * (.5 + .5 * Math.sin(p * Math.PI * 7));
    vx = objetivo - x; x += vx * .18;
    g.style.transform = `translate(${x}px, ${innerHeight * .58}px) translate(-50%,-50%) rotate(${Math.max(-28, Math.min(28, vx * .35))}deg)`;
    if (Math.abs(vx) > .5) pedir();
  };
  const pedir = () => { if (!pedido) { pedido = true; requestAnimationFrame(mover); } };
  const quitar = () => { window.removeEventListener('scroll', pedir); window.removeEventListener('resize', pedir); };
  window.addEventListener('scroll', pedir, { passive: true }); window.addEventListener('resize', pedir); mover();
}
// Al salir del inicio, el dron se va
window.addEventListener('hashchange', () => { const g = $('#dron-guia'); if (g && leerRuta().seccion !== 'inicio') g.remove(); });
