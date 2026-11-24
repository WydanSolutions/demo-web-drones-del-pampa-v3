/* =====================================================================
   «CONOCELO POR DENTRO» (versión 2, 12/11/2026)
   El T100 con efecto 3D: se inclina siguiendo el mouse (o el dedo), se
   gira arrastrando entre sus ángulos reales y tiene puntos para tocar
   cada parte (radar, tanque, bombas, aspersores, motores) con su foto y
   para qué sirve. No hay un modelo 3D del T100: se hace con las fotos
   reales. Las posiciones están medidas en la foto de frente (1080 × 1080).
   Se ve en el inicio y en la ficha de los drones que tengan PARTES.
   ===================================================================== */
const PARTES = {
  t100: { vista: 'media/drones/t100-frente.png', giro: ['media/drones/t100-frente.png', 'media/drones/t100-45.png', 'media/drones/t100-45-arriba.png', 'media/drones/t100-arriba.png', 'media/drones/t100-abajo.png'],
    puntos: [
      { x: .505, y: .375, ic: 'radar', foto: 'media/fotos/t100-oscuro.jpg', t: ['Radar y LiDAR', 'Radar e LiDAR'],
        d: ['Leen el terreno y los obstáculos (árboles, cables, postes) para volar a la altura justa y frenar o esquivar a tiempo, también de noche.', 'Leem o terreno e os obstáculos (árvores, cabos, postes) para voar na altura certa e frear ou desviar a tempo, também à noite.'] },
      { x: .505, y: .505, ic: 'gota', foto: 'media/fotos/t100-tanque.jpg', t: ['Tanque', 'Tanque'],
        d: ['100 L para pulverizar o 150 L con el kit de esparcido: más hectáreas por carga y menos viajes a la camioneta.', '100 L para pulverizar ou 150 L com o kit de espalhamento: mais hectares por carga e menos idas à caminhonete.'] },
      { x: .505, y: .585, ic: 'motor', foto: 'media/fotos/t100-bomba.jpg', t: ['Bombas dobles', 'Bombas duplas'],
        d: ['Dos bombas que empujan el producto de forma pareja durante toda la pasada, aunque el tanque se vaya vaciando.', 'Duas bombas que empurram o produto de forma uniforme durante toda a passada, mesmo com o tanque esvaziando.'] },
      { x: .324, y: .578, ic: 'gota', foto: 'media/fotos/t100-aspersor.jpg', t: ['Aspersores centrífugos', 'Aspersores centrífugos'],
        d: ['Un disco que gira y rompe el líquido en gotas finas y parejas. El tamaño de la gota se regula según el cultivo y el producto: cubre mejor y deriva menos.', 'Um disco que gira e quebra o líquido em gotas finas e uniformes. O tamanho da gota é regulado conforme a cultura e o produto: cobre melhor e deriva menos.'] },
      { x: .255, y: .452, ic: 'helice', foto: 'media/fotos/t100-oscuro.jpg', t: ['Motores y hélices', 'Motores e hélices'],
        d: ['Dos hélices por brazo, una arriba de la otra: más fuerza para levantar hasta 100 kg de carga útil sin agrandar el equipo.', 'Duas hélices por braço, uma sobre a outra: mais força para levantar até 100 kg de carga útil sem aumentar o equipamento.'] }
    ] }
};

function explorarHTML(x){
  const P = x && PARTES[x.id]; if (!P) return '';
  const pt = IDIOMA === 'pt', L2 = a => a[pt ? 1 : 0];
  return `<section class="bloque noche explorar" data-dron="${x.id}"><div class="contenedor ex-in">
    <div class="ex-txt">
      <span class="etiqueta"><i></i>${pt ? 'Conheça por dentro' : 'Conocelo por dentro'}</span>
      <h2 class="titulo chico">DJI <b>${esc(x.nombre)}</b>, ${pt ? 'peça por peça' : 'parte por parte'}</h2>
      <p class="sub">${pt ? 'Toque nos pontos para ver o que faz cada parte. Arraste o drone para girá-lo.' : 'Tocá los puntos para ver qué hace cada parte. Arrastrá el dron para girarlo.'}</p>
      <ol class="ex-lista">${P.puntos.map((p, i) => `<li><button type="button" data-p="${i}"><span>${i + 1}</span>${icono(p.ic)}<b>${esc(L2(p.t))}</b></button></li>`).join('')}</ol>
    </div>
    <div class="ex-visor">
      <div class="ex-escena">
        <span class="ex-brillo"></span><span class="ex-piso"></span>
        <div class="ex-dron">
          ${P.giro.map((src, i) => `<img src="${esc(src)}" alt="${i ? '' : 'DJI ' + esc(x.nombre)}" class="${i ? '' : 'act'}" draggable="false" ${i ? 'loading="lazy"' : ''}>`).join('')}
          <div class="ex-puntos">${P.puntos.map((p, i) => `<button type="button" class="ex-punto" data-p="${i}" style="left:${p.x * 100}%;top:${p.y * 100}%" aria-label="${esc(L2(p.t))}"><span>${i + 1}</span></button>`).join('')}</div>
        </div>
      </div>
      <div class="ex-ayuda">${icono('flecha')} ${pt ? 'Arraste para girar' : 'Arrastrá para girar'} ${icono('flecha')}</div>
      <button type="button" class="ex-volver">${icono('ojo')} ${pt ? 'Ver as peças' : 'Ver las partes'}</button>
      <div class="ex-ficha" aria-live="polite"></div>
    </div>
  </div></section>`;
}

function iniciarExplorar(v){
  $$('.explorar', v).forEach(sec => {
    const P = PARTES[sec.dataset.dron]; if (!P) return;
    const pt = IDIOMA === 'pt', L2 = a => a[pt ? 1 : 0];
    const visor = $('.ex-visor', sec), escena = $('.ex-escena', sec), imgs = $$('.ex-dron img', sec), ficha = $('.ex-ficha', sec);
    let ang = 0, sel = -1;
    const elegir = i => {
      if (ang !== 0) girarA(0);
      sel = i; const p = P.puntos[i];
      $$('[data-p]', sec).forEach(b => b.classList.toggle('act', +b.dataset.p === i));
      ficha.innerHTML = `<div class="exf-foto"><img src="${esc(p.foto)}" alt=""></div><div class="exf-txt"><small>${String(i + 1).padStart(2, '0')} / ${String(P.puntos.length).padStart(2, '0')}</small>
        <b>${esc(L2(p.t))}</b><p>${esc(L2(p.d))}</p>
        <div class="exf-nav"><button type="button" data-ir="-1" aria-label="${pt ? 'Anterior' : 'Anterior'}">${icono('flecha')}</button><button type="button" data-ir="1" aria-label="${pt ? 'Próxima' : 'Siguiente'}">${icono('flecha')}</button></div></div>
        <button type="button" class="exf-cerrar" aria-label="${t('cerrar')}">${icono('cerrar')}</button>`;
      ficha.classList.add('ver');
      $$('[data-ir]', ficha).forEach(b => b.onclick = () => elegir((sel + +b.dataset.ir + P.puntos.length) % P.puntos.length));
      $('.exf-cerrar', ficha).onclick = () => { ficha.classList.remove('ver'); sel = -1; $$('[data-p]', sec).forEach(b => b.classList.remove('act')); };
      if (window.gsap && !QUIETO) gsap.fromTo(ficha.children, { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: .05, duration: .5, ease: 'expo.out' });
    };
    const girarA = k => {
      k = (k + imgs.length) % imgs.length; if (k === ang) return;
      imgs[ang].classList.remove('act'); imgs[k].classList.add('act'); ang = k;
      sec.classList.toggle('girado', ang !== 0);
      if (ang !== 0) { ficha.classList.remove('ver'); $$('[data-p]', sec).forEach(b => b.classList.remove('act')); sel = -1; }
      if (window.gsap && !QUIETO) gsap.fromTo(imgs[k], { scale: .94, opacity: .4 }, { scale: 1, opacity: 1, duration: .5, ease: 'expo.out', clearProps: 'transform,opacity' });
    };
    $$('[data-p]', sec).forEach(b => b.onclick = e => { e.stopPropagation(); elegir(+b.dataset.p); });
    $('.ex-volver', sec).onclick = () => girarA(0);
    // Efecto 3D: se inclina siguiendo el puntero; arrastrar gira entre los ángulos
    let x0 = null, acum = 0, movio = false;
    const inclinar = (x, y) => { if (!window.gsap || QUIETO) return; gsap.to(escena, { rotationY: x * 18, rotationX: -y * 12, duration: .8, ease: 'power3.out' }); gsap.to($('.ex-brillo', sec), { xPercent: x * 40, yPercent: y * 30, duration: .8 }); };
    visor.addEventListener('pointermove', e => {
      const r = visor.getBoundingClientRect(); inclinar((e.clientX - r.left) / r.width - .5, (e.clientY - r.top) / r.height - .5);
      if (x0 === null) return; acum += e.clientX - x0; x0 = e.clientX;
      if (Math.abs(acum) > 70) { girarA(ang + (acum < 0 ? 1 : -1)); acum = 0; movio = true; }
    });
    visor.addEventListener('pointerdown', e => { if (e.target.closest('button')) return; x0 = e.clientX; acum = 0; movio = false; });
    const soltar = () => { x0 = null; };
    visor.addEventListener('pointerup', soltar); visor.addEventListener('pointercancel', soltar);
    visor.addEventListener('pointerleave', () => { soltar(); inclinar(0, 0); });
    // Al aparecer, el dron gira una vez solo para mostrar que se puede
    if (window.gsap && !QUIETO) new IntersectionObserver((en, ob) => { if (!en[0].isIntersecting) return; ob.disconnect();
      gsap.timeline().to(escena, { rotationY: -16, duration: .9, ease: 'power2.inOut' }).to(escena, { rotationY: 14, duration: 1.1, ease: 'power2.inOut' }).to(escena, { rotationY: 0, duration: .9, ease: 'power2.out' });
      $$('.ex-punto', sec).forEach((b, i) => gsap.from(b, { scale: 0, duration: .6, delay: .4 + i * .12, ease: 'back.out(2.5)' }));
    }, { threshold: .4 }).observe(visor);
  });
}
