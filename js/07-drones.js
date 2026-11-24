/* =====================================================================
   PÁGINA · DRONES (#/drones y #/drones/t100)
   Catálogo con tarjetas, comparador de modelos, asesor «¿qué dron me
   conviene?» (3 preguntas) y la ficha de cada dron como página propia:
   video, giro arrastrando, datos, galería y repuestos de ese modelo.
   ===================================================================== */
let _comparar = [];
function dronesVisibles(){ return Datos.get().drones.filter(x => x.visible !== false); }
const dronDe = id => Datos.get().drones.find(x => x.id === id);

function tarjetaDron(x){
  const sp = x.specs.slice(0, 3);
  return `<article class="dron-card foco" data-aparece>
    <a href="#/drones/${x.id}" class="dc-img"><span class="dc-halo"></span>
      <img src="${esc(x.imagenes[0])}" alt="DJI ${esc(x.nombre)}" loading="lazy" class="dc-a">${x.imagenes[1] ? `<img src="${esc(x.imagenes[1])}" alt="" loading="lazy" class="dc-b">` : ''}
      <span class="chip azul dc-etq">${esc(tx(x.etiqueta))}</span></a>
    <div class="dc-info">
      <h3><a href="#/drones/${x.id}">DJI <b>${esc(x.nombre)}</b></a></h3>
      <p>${esc(tx(x.lema))}</p>
      <ul class="dc-specs">${sp.map(s => `<li><b>${esc(tx(s.v))}<small>${esc(tx(s.u))}</small></b><span>${esc(tx(s.l))}</span></li>`).join('')}</ul>
      <div class="dc-pie"><div>${x.precio > 0 ? `<small class="desde">${t('desde')}</small>` : ''}${precioHTML(x.precio, x.precioAntes)}</div>
        <a class="dc-ir" href="#/drones/${x.id}" aria-label="${t('ver_ficha')}">${icono('flecha')}</a></div>
    </div></article>`;
}

PAGINAS.drones = {
  titulo: id => id && dronDe(id) ? 'DJI ' + dronDe(id).nombre : t('p_drones'),
  html(id){ return id && dronDe(id) ? fichaDronHTML(dronDe(id)) : catalogoHTML(); },
  alMostrar(v, id){
    if (id && dronDe(id)) { activarGiro($('.fd-visor', v)); iniciarExplorar(v); return; }
    $$('[data-comp]', v).forEach(c => c.onchange = () => { const i = c.dataset.comp;
      _comparar = c.checked ? [...new Set([..._comparar, i])].slice(-3) : _comparar.filter(z => z !== i); pintarBarraComparar(); });
    pintarBarraComparar();
  }
};

function catalogoHTML(){
  const T = Datos.get().textos;
  return `<section class="cabeza-pag">
      <div class="cabeza-fondo">${fondoTopo()}</div>
      <div class="contenedor cabeza-in">
        <div><span class="etiqueta"><i></i>DJI Agriculture · ${t('p_drones')}</span><h1 class="titulo" data-dividir>${esc(tx(T.dronesTitulo))}</h1><p class="sub">${esc(tx(T.dronesSub))}</p></div>
        <button class="asesor-btn foco" onclick="abrirAsesor()"><span class="ab-ico">${icono('estrella')}</span><b>${t('asesor')}</b><span>${IDIOMA === 'pt' ? '3 perguntas · 20 segundos' : '3 preguntas · 20 segundos'}</span>${icono('flecha')}</button>
      </div>
    </section>
    <section class="bloque pegado"><div class="contenedor">
      <div class="drones-grilla">${dronesVisibles().map(x => tarjetaDron(x).replace('<div class="dc-pie">',
        `<label class="dc-comp"><input type="checkbox" data-comp="${x.id}" ${_comparar.includes(x.id) ? 'checked' : ''}><span>${icono('comparar')} ${t('comparar')}</span></label><div class="dc-pie">`)).join('')}</div>
    </div></section>
    <div class="barra-comp" id="barra-comp"></div>`;
}

function pintarBarraComparar(){
  const b = $('#barra-comp'); if (!b) return;
  b.classList.toggle('ver', _comparar.length > 0);
  b.innerHTML = `<div class="bc-items">${_comparar.map(id => { const x = dronDe(id); return x ? `<span><img src="${esc(x.imagenes[0])}" alt="">${esc(x.nombre)}</span>` : ''; }).join('')}</div>
    <button class="btn btn-azul btn-chico" onclick="abrirComparador()" ${_comparar.length < 2 ? 'disabled' : ''}>${icono('comparar')} ${t('comparando')} (${_comparar.length})</button>`;
}
function abrirComparador(){
  const xs = _comparar.map(dronDe).filter(Boolean); if (xs.length < 2) return aviso(t('elegir_2'));
  const etiquetas = [...new Set(xs.flatMap(x => x.specs.map(s => tx(s.l))))];
  abrirModal(`<div class="comp">
    <h3>${t('comparando')}</h3>
    <div class="comp-tabla" style="--n:${xs.length}">
      <div class="comp-fila comp-cab"><span></span>${xs.map(x => `<div><img src="${esc(x.imagenes[0])}" alt=""><b>DJI ${esc(x.nombre)}</b>${precioHTML(x.precio)}</div>`).join('')}</div>
      ${etiquetas.map(l => `<div class="comp-fila"><span>${esc(l)}</span>${xs.map(x => { const s = x.specs.find(z => tx(z.l) === l); return `<div>${s ? `<b>${esc(tx(s.v))}</b> ${esc(tx(s.u))}` : '—'}</div>`; }).join('')}</div>`).join('')}
      <div class="comp-fila"><span></span>${xs.map(x => `<div><a class="btn btn-borde btn-chico" href="#/drones/${x.id}">${t('ver_ficha')}</a></div>`).join('')}</div>
    </div></div>`, { cls: 'ancho' });
}

/* --- Asesor: 3 preguntas y una recomendación --- */
function abrirAsesor(){
  const preguntas = [['q1', ['q1a', 'q1b', 'q1c']], ['q2', ['q2a', 'q2b', 'q2c']], ['q3', ['q3a', 'q3b', 'q3c']]];
  const r = [];
  const paso = (i) => {
    const m = $('#modal');
    if (i < 3) {
      const [q, ops] = preguntas[i];
      $('.asesor', m).innerHTML = `<div class="as-barra"><i style="width:${(i / 3) * 100}%"></i></div><small>${i + 1} / 3</small><h3>${t(q)}</h3>
        <div class="as-ops">${ops.map((o, k) => `<button class="as-op" data-k="${k}"><span>${'ABC'[k]}</span>${t(o)}</button>`).join('')}</div>`;
      $$('.as-op', m).forEach(b => b.onclick = () => { r[i] = +b.dataset.k; paso(i + 1); });
      if (window.gsap) gsap.from($$('.asesor > *', m), { opacity: 0, y: 20, stagger: .05, duration: .5, ease: 'expo.out' });
      return;
    }
    // Regla simple: mapeo → Mavic 3M; grande → T100; mediano → T70P; chico/huerto → T55 o T25P
    let id = r[1] === 2 ? 'mavic3m' : r[0] === 2 ? 't100' : r[0] === 1 ? (r[2] === 1 ? 't55' : 't70p') : (r[2] === 2 ? 't25' : 't55');
    const x = dronDe(id) && dronDe(id).visible !== false ? dronDe(id) : dronesVisibles()[0];
    $('.asesor', $('#modal')).innerHTML = `<div class="as-barra"><i style="width:100%"></i></div><small>${t('te_recomendamos')}</small>
      <div class="as-res"><img src="${esc(x.imagenes[0])}" alt=""><h3>DJI <b>${esc(x.nombre)}</b></h3><p>${esc(tx(x.lema))}</p>
        <div class="as-btns"><a class="btn btn-azul" href="#/drones/${x.id}">${t('ver_ficha')} ${icono('flecha')}</a>
        <a class="btn btn-wa" target="_blank" rel="noopener" href="${waLink((IDIOMA === 'pt' ? 'Olá, Drones del Pampa! O assessor do site me recomendou o DJI ' : '¡Hola, Drones del Pampa! El asesor de la página me recomendó el DJI ') + x.nombre)}">${icono('wa')} ${t('hablar_claudio')}</a></div>
        <button class="as-otra" onclick="abrirAsesor()">${t('otra_vez')}</button></div>`;
    if (window.gsap) gsap.from('.as-res img', { scale: .6, opacity: 0, y: 40, duration: 1, ease: 'expo.out' });
  };
  abrirModal(`<div class="asesor"></div>`, { cls: 'chico' }); paso(0);
}

/* --- Ficha del dron (página propia) --- */
function fichaDronHTML(x){
  const msg = (IDIOMA === 'pt' ? 'Olá, Drones del Pampa! Quero informações sobre o DJI ' : '¡Hola, Drones del Pampa! Quiero información sobre el DJI ') + x.nombre;
  const corto = x.nombre.replace(/^Agras\s*/i, '');
  const reps = Datos.get().productos.filter(p => p.visible !== false && (p.modelos || []).some(m => m.toLowerCase() === corto.toLowerCase())).slice(0, 4);
  const otros = dronesVisibles().filter(z => z.id !== x.id).slice(0, 3);
  return `<section class="fd-hero">
      ${x.video ? `<video class="fd-video" src="${esc(x.video)}" poster="${esc(x.video.replace(/\.mp4$/, '.jpg'))}" autoplay muted loop playsinline></video>` : `<img class="fd-video" src="${esc((x.galeria || [])[0] || '')}" alt="">`}
      <div class="fd-velo"></div>
      <div class="contenedor fd-hero-in">
        <a class="fd-volver" href="#/drones">${icono('flecha')} ${t('p_drones')}</a>
        <span class="chip">${esc(tx(x.etiqueta))}</span>
        <h1 class="fd-titulo">DJI <b>${esc(x.nombre)}</b></h1>
        <p>${esc(tx(x.lema))}</p>
      </div>
    </section>
    <section class="bloque fd-cuerpo"><div class="contenedor fd-in">
      <div class="fd-col">
        ${visorDronHTML(x)}
        <p class="fd-desc" data-aparece>${esc(tx(x.desc))}</p>
        <h2 class="fd-h">${t('especificaciones')}</h2>
        <div class="fd-specs">${x.specs.map(s => `<div data-aparece><b>${numeroAnimable(s.v)}<small>${esc(tx(s.u))}</small></b><span>${esc(tx(s.l))}</span></div>`).join('')}</div>
        ${(x.galeria || []).length ? `<h2 class="fd-h">${t('galeria')}</h2><div class="fd-galeria">${x.galeria.map(src => `<button onclick="verFoto('${esc(src)}')" data-aparece><img src="${esc(src)}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}
      </div>
      <aside class="fd-lado">
        <div class="fd-caja">
          <small>${x.precio > 0 ? t('desde') : ''}</small>${precioHTML(x.precio, x.precioAntes)}<p>${t('precios_usd')}</p>
          <button class="btn btn-azul" onclick="agregarAlCarrito('dron:${x.id}', this)">${icono('carrito')} ${t('agregar')}</button>
          <a class="btn btn-wa" href="${waLink(msg)}" target="_blank" rel="noopener">${icono('wa')} ${t('hablar_claudio')}</a>
          <div class="fd-claudio"><img src="${esc(Datos.get().claudio.foto)}" alt=""><span>${IDIOMA === 'pt' ? 'Nossa equipe assessora você e acompanha a entrega e o primeiro voo.' : 'Nuestro equipo te asesora y te acompaña en la entrega y el primer vuelo.'}</span></div>
        </div>
      </aside>
    </div></section>
    ${explorarHTML(x)}
    ${reps.length ? `<section class="bloque niebla"><div class="contenedor"><div class="cabecera"><h2 class="titulo chico">${t('repuestos_modelo')}</h2><a class="enlace" href="#/tienda?modelo=${encodeURIComponent(corto)}">${t('ver_todo')} ${icono('flecha')}</a></div>
      <div class="prods-grilla">${reps.map(p => tarjetaProducto(itemDe('prod:' + p.id))).join('')}</div></div></section>` : ''}
    <section class="bloque"><div class="contenedor"><h2 class="titulo chico">${t('otros_modelos')}</h2><div class="drones-grilla tres" style="margin-top:34px">${otros.map(tarjetaDron).join('')}</div></div></section>`;
}

function numeroAnimable(v){ const s = String(tx(v)); return /^\d+(\.\d+)?$/.test(s) ? `<span class="contador" data-n="${s}">${s}</span>` : esc(s); }

// El visor de la ficha (flechas, miniaturas y animación) está en 07b-visor.js

function verFoto(src){
  const v = document.createElement('div'); v.className = 'visor';
  v.innerHTML = `<img src="${esc(src)}" alt=""><button class="modal-cerrar" aria-label="${t('cerrar')}">${icono('cerrar')}</button>`;
  v.onclick = () => { v.classList.remove('abierto'); setTimeout(() => v.remove(), 350); };
  document.body.appendChild(v); requestAnimationFrame(() => v.classList.add('abierto'));
}
