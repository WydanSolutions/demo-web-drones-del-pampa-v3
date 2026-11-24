/* =====================================================================
   DETALLES «PREMIUM» (versión 2, 13/11/2026)
   - Barra fina arriba que muestra cuánto falta de la página.
   - Cinta que corre debajo de la portada con lo que ofrece el taller.
   - Carrusel de drones: barra de avance y flechas que se apagan al final.
   - Tarjetas que se inclinan apenas siguiendo el mouse (solo compu).
   ===================================================================== */
function cintaHTML(){
  const items = IDIOMA === 'pt'
    ? [['escudo', 'Filial oficial DRAGUR'], ['kit', 'Peças originais DJI'], ['motor', 'Assistência técnica própria'], ['calendario', 'Cursos para pilotos'], ['dron', 'Registro na DINACIA'], ['usuarios', 'Atendimento personalizado']]
    : [['escudo', 'Sucursal oficial DRAGUR'], ['kit', 'Repuestos originales DJI'], ['motor', 'Servicio técnico propio'], ['calendario', 'Cursos para pilotos'], ['dron', 'Registro ante DINACIA'], ['usuarios', 'Atención personalizada']];
  const fila = items.map(([ic, txt]) => `<span>${icono(ic)}${esc(txt)}</span><i></i>`).join('');
  return `<div class="cinta" aria-hidden="true"><div class="cinta-pista">${fila}${fila}</div></div>`;
}

function barraProgreso(){
  if ($('#progreso-pag')) return;
  const b = document.createElement('div'); b.id = 'progreso-pag'; b.className = 'progreso-pag'; document.body.appendChild(b);
  const f = () => { const h = document.documentElement.scrollHeight - innerHeight; b.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`; };
  window.addEventListener('scroll', f, { passive: true }); window.addEventListener('resize', f); f();
}

function progresoCarrusel(root){
  const c = $('#carrusel', root), p = $('#carrusel-progreso i', root); if (!c || !p) return;
  const [ant, sig] = $$('.carrusel-flechas button', root);
  const f = () => {
    const max = c.scrollWidth - c.clientWidth, x = max > 0 ? c.scrollLeft / max : 0, vis = c.clientWidth / c.scrollWidth;
    p.style.width = Math.max(12, vis * 100) + '%'; p.style.transform = `translateX(${x * (100 / Math.max(.12, vis) - 100)}%)`;
    if (ant) ant.disabled = c.scrollLeft < 8; if (sig) sig.disabled = c.scrollLeft > max - 8;
  };
  c.addEventListener('scroll', f, { passive: true }); window.addEventListener('resize', f); f();
}

function inclinarTarjetas(root){
  if (MOVIL() || QUIETO || !window.gsap || !matchMedia('(hover:hover)').matches) return;
  $$('.dron-card, .promo, .curso-banner', root).forEach(el => {
    if (el.dataset.inclina) return; el.dataset.inclina = 1;
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      gsap.to(el, { rotationY: x * 5, rotationX: -y * 5, transformPerspective: 900, duration: .6, ease: 'power3.out' }); });
    el.addEventListener('pointerleave', () => gsap.to(el, { rotationY: 0, rotationX: 0, duration: .9, ease: 'power3.out', clearProps: 'transform' }));
  });
}

// Se suma a lo que ya se hace cada vez que cambia la página
const _refrescarBase = refrescarAnimaciones;
refrescarAnimaciones = function(root){ _refrescarBase(root); progresoCarrusel(root || document); inclinarTarjetas(root || document); barraProgreso(); };
