/* =====================================================================
   VISOR DEL DRON en la ficha (versión 2, 13/11/2026)
   Escenario oscuro con foco de luz y piso, flechas grandes a los
   costados, miniaturas abajo y una animación al cambiar de ángulo
   (el dron sale girando y entra el siguiente). Pasa solo cada pocos
   segundos hasta que la persona toca algo. Arrastrar o deslizar con
   el dedo sigue andando, pero no hace falta.
   ===================================================================== */
function nombreAngulo(src){
  const n = String(src).split('/').pop().replace(/\.\w+$/, '').replace(/^[a-z0-9]+-/, '');
  const ES = { '45': 'Tres cuartos', '45-izq': 'Del otro lado', '45-arriba': 'Desde lo alto', frente: 'De frente', arriba: 'Desde arriba', abajo: 'Desde abajo',
    vuelo: 'En vuelo', esparcido: 'Esparciendo', carga: 'Con carga', 'carga-quieto': 'Cargado' };
  const PT = { '45': 'Três quartos', '45-izq': 'Do outro lado', '45-arriba': 'Do alto', frente: 'De frente', arriba: 'De cima', abajo: 'De baixo',
    vuelo: 'Em voo', esparcido: 'Espalhando', carga: 'Com carga', 'carga-quieto': 'Carregado' };
  return (IDIOMA === 'pt' ? PT : ES)[n] || '';
}

function visorDronHTML(x){
  const n = x.imagenes.length, dos = v => String(v).padStart(2, '0');
  return `<div class="fd-visor" data-aparece tabindex="0" aria-roledescription="carrusel" aria-label="DJI ${esc(x.nombre)}">
    <div class="fd-escenario">
      <span class="fd-foco"></span><span class="fd-piso"></span><span class="fd-reflejo"></span>
      <div class="fd-marca">DJI <b>${esc(x.nombre.replace(/^Agras\s*/i, ''))}</b></div>
      <div class="fd-pista">${x.imagenes.map((src, i) => `<img src="${esc(src)}" alt="DJI ${esc(x.nombre)} · ${esc(nombreAngulo(src))}" class="${i ? '' : 'act'}" draggable="false" ${i ? 'loading="lazy"' : ''}>`).join('')}</div>
    </div>
    ${n > 1 ? `
    <button class="fd-flecha ant" type="button" aria-label="${IDIOMA === 'pt' ? 'Anterior' : 'Anterior'}">${icono('flecha')}</button>
    <button class="fd-flecha sig" type="button" aria-label="${IDIOMA === 'pt' ? 'Próxima' : 'Siguiente'}">${icono('flecha')}</button>
    <div class="fd-info"><span class="fd-angulo">${esc(nombreAngulo(x.imagenes[0]))}</span><span class="fd-contador"><b>01</b> / ${dos(n)}</span></div>
    <div class="fd-tiempo"><i></i></div>
    <div class="fd-miniaturas">${x.imagenes.map((src, i) => `<button type="button" class="${i ? '' : 'act'}" aria-label="${esc(nombreAngulo(src)) || i + 1}"><img src="${esc(src)}" alt="" loading="lazy" draggable="false"></button>`).join('')}</div>` : ''}
  </div>`;
}

function activarGiro(caja){
  if (!caja) return;
  const imgs = $$('.fd-pista img', caja), minis = $$('.fd-miniaturas button', caja), n = imgs.length; if (n < 2) return;
  const cont = $('.fd-contador b', caja), ang = $('.fd-angulo', caja), barra = $('.fd-tiempo i', caja);
  const ESPERA = 4200;
  let i = 0, auto = !QUIETO, reloj = null, visible = true;

  const pintar = () => {
    minis.forEach((m, k) => m.classList.toggle('act', k === i));
    cont.textContent = String(i + 1).padStart(2, '0'); ang.textContent = nombreAngulo(imgs[i].getAttribute('src'));
    const m = minis[i]; if (m && m.parentElement.scrollWidth > m.parentElement.clientWidth) m.parentElement.scrollTo({ left: m.offsetLeft - m.parentElement.clientWidth / 2 + m.offsetWidth / 2, behavior: 'smooth' });
  };
  const ir = (k, dir) => {
    k = (k + n) % n; if (k === i) return;
    dir = dir || (k > i ? 1 : -1);
    const sale = imgs[i], entra = imgs[k]; i = k; pintar();
    if (!window.gsap || QUIETO) { sale.classList.remove('act'); entra.classList.add('act'); return; }
    // si estaba en medio de otro cambio, lo corta y arranca este
    imgs.forEach(im => { gsap.killTweensOf(im); if (im !== sale && im !== entra) { im.classList.remove('act'); gsap.set(im, { clearProps: 'all' }); } });
    gsap.to(sale, { xPercent: -dir * 38, rotationY: dir * 28, scale: .82, opacity: 0, filter: 'blur(6px)', duration: .55, ease: 'power3.in',
      onComplete: () => { sale.classList.remove('act'); gsap.set(sale, { clearProps: 'all' }); } });
    entra.classList.add('act');
    gsap.fromTo(entra, { xPercent: dir * 42, rotationY: -dir * 30, scale: .78, opacity: 0, filter: 'blur(8px)' },
      { xPercent: 0, rotationY: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1, delay: .22, ease: 'expo.out', onComplete: () => gsap.set(entra, { clearProps: 'filter,transform' }) });
    gsap.fromTo($('.fd-foco', caja), { scale: .85, opacity: .55 }, { scale: 1, opacity: 1, duration: 1.2, ease: 'expo.out' });
  };
  // Pasa solo hasta que la persona toca algo
  const reiniciarBarra = () => { if (!barra) return; barra.style.transition = 'none'; barra.style.transform = 'scaleX(0)'; void barra.offsetWidth;
    if (auto && visible) { barra.style.transition = `transform ${ESPERA}ms linear`; barra.style.transform = 'scaleX(1)'; } };
  const programar = () => { clearTimeout(reloj); reiniciarBarra(); if (auto && visible) reloj = setTimeout(() => { if (!caja.isConnected) return; ir(i + 1, 1); programar(); }, ESPERA); };
  const parar = () => { auto = false; clearTimeout(reloj); caja.classList.add('manual'); reiniciarBarra(); };

  $('.fd-flecha.ant', caja).onclick = () => { parar(); ir(i - 1, -1); };
  $('.fd-flecha.sig', caja).onclick = () => { parar(); ir(i + 1, 1); };
  minis.forEach((m, k) => m.onclick = () => { parar(); ir(k); });
  caja.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') { parar(); ir(i - 1, -1); } if (e.key === 'ArrowRight') { parar(); ir(i + 1, 1); } });
  // Deslizar con el dedo o arrastrar con el mouse (opcional)
  const esc_ = $('.fd-escenario', caja); let x0 = null;
  esc_.addEventListener('pointerdown', e => { x0 = e.clientX; });
  esc_.addEventListener('pointerup', e => { if (x0 === null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 40) { parar(); ir(i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); } });
  esc_.addEventListener('pointercancel', () => { x0 = null; });
  // Solo corre mientras se ve
  new IntersectionObserver(en => { visible = en[0].isIntersecting; programar(); }, { threshold: .35 }).observe(caja);
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; programar(); });
  pintar(); programar();
}
