/* =====================================================================
   PÁGINA · TIENDA (#/tienda, #/tienda?cat=helices, #/tienda/<producto>)
   Filtros a la izquierda (categoría, modelo compatible, solo con stock,
   precio máximo), buscador, orden, ficha de producto como página propia
   y el pedido (carrito) que se manda por WhatsApp y queda en el panel.
   ===================================================================== */
const filtro = { cat: 'todo', q: '', orden: 'dest', modelo: '', stock: false, max: 0, mostrar: 12 };
let carrito = (() => { try { return JSON.parse(localStorage.getItem('dp_carrito')) || []; } catch (e) { return []; } })();

function itemDe(ref){
  const d = Datos.get(); const [tipo, id] = ref.split(':');
  if (tipo === 'dron') {
    const x = d.drones.find(z => z.id === id); if (!x) return null;
    return { ref, tipo, nombre: 'DJI ' + x.nombre, precio: x.precio, precioAntes: x.precioAntes, img: x.imagenes[0], cat: 'drones', stock: 3,
      codigo: x.nombre.toUpperCase().replace(/\s+/g, '-'), modelos: [x.nombre.replace(/^Agras\s*/i, '')], desc: x.lema, destacado: x.destacado, visible: x.visible !== false, dron: x };
  }
  const p = d.productos.find(z => z.id === id); if (!p) return null;
  return { ref, tipo, id: p.id, nombre: tx(p.nombre), precio: p.precio, precioAntes: p.precioAntes, img: p.foto, cat: p.cat, stock: Number(p.stock) || 0,
    codigo: p.codigo, modelos: p.modelos || [], desc: p.desc, destacado: p.destacado, visible: p.visible !== false };
}
function todosLosItems(){ const d = Datos.get(); return [...d.drones.map(x => itemDe('dron:' + x.id)), ...d.productos.map(p => itemDe('prod:' + p.id))].filter(x => x && x.visible); }
const catDe = id => Datos.get().categorias.find(c => c.id === id) || { id, icono: 'kit', n: { es: id } };

PAGINAS.tienda = {
  titulo: id => { const i = id && itemDe('prod:' + id); return i ? i.nombre : t('p_tienda'); },
  html(id, q){
    if (id && itemDe('prod:' + id)) return productoHTML(itemDe('prod:' + id));
    if (q.get('cat')) filtro.cat = q.get('cat');
    if (q.get('modelo')) filtro.modelo = q.get('modelo');
    const T = Datos.get().textos;
    return `<section class="cabeza-pag chica"><div class="cabeza-fondo">${fondoTopo()}</div>
        <div class="contenedor cabeza-in"><div><span class="etiqueta"><i></i>${t('p_tienda')} · Rivera</span><h1 class="titulo" data-dividir>${esc(tx(T.tiendaTitulo))}</h1><p class="sub">${esc(tx(T.tiendaSub))}</p></div>
        <img class="cabeza-dron" src="media/drones/t70p-45.png" alt="" aria-hidden="true"></div></section>
      <section class="bloque pegado"><div class="contenedor tienda-in">
        <aside class="filtros" id="filtros"></aside>
        <div class="tienda-main">
          <div class="tienda-barra">
            <label class="t-buscar">${icono('buscar')}<input type="search" id="t-buscar" placeholder="${esc(t('buscar'))}" value="${esc(filtro.q)}"></label>
            <select id="t-orden" aria-label="Orden">${[['dest', 'orden_dest'], ['menor', 'orden_menor'], ['mayor', 'orden_mayor'], ['nombre', 'orden_nombre']].map(([v, k]) => `<option value="${v}" ${filtro.orden === v ? 'selected' : ''}>${t(k)}</option>`).join('')}</select>
            <button class="btn btn-borde btn-chico t-filtros-btn" onclick="document.body.classList.add('filtros-abiertos')">${icono('filtro')} ${t('filtros')}</button>
          </div>
          <p class="t-cuenta" id="t-cuenta"></p>
          <div class="prods-grilla" id="t-grilla"></div>
          <div class="t-mas" id="t-mas"></div>
        </div>
      </div></section>`;
  },
  alMostrar(v, id){
    if (id) { activarCantidad(v); return; }
    $('#t-buscar').oninput = e => { filtro.q = e.target.value; filtro.mostrar = 12; pintarProductos(); };
    $('#t-orden').onchange = e => { filtro.orden = e.target.value; pintarProductos(); };
    pintarFiltros(); pintarProductos();
  }
};

function pintarFiltros(){
  const items = todosLosItems(), d = Datos.get();
  const cats = d.categorias.filter(c => items.some(i => i.cat === c.id));
  const modelos = [...new Set(items.flatMap(i => i.modelos || []))].filter(Boolean).sort();
  const maxPrecio = Math.max(...items.map(i => i.precio || 0));
  $('#filtros').innerHTML = `<div class="f-cab"><b>${t('filtros')}</b><button onclick="document.body.classList.remove('filtros-abiertos')">${icono('cerrar')}</button></div>
    <div class="f-grupo"><h4>${t('categorias')}</h4>
      <button class="f-cat ${filtro.cat === 'todo' ? 'act' : ''}" data-cat="todo">${icono('kit')}<span>${t('todas')}</span><small>${items.length}</small></button>
      ${cats.map(c => `<button class="f-cat ${filtro.cat === c.id ? 'act' : ''}" data-cat="${c.id}">${icono(c.icono)}<span>${esc(tx(c.n))}</span><small>${items.filter(i => i.cat === c.id).length}</small></button>`).join('')}</div>
    <div class="f-grupo"><h4>${t('modelo')}</h4><div class="f-modelos">${modelos.map(m => `<button class="f-mod ${filtro.modelo === m ? 'act' : ''}" data-mod="${esc(m)}">${esc(m)}</button>`).join('')}</div></div>
    <div class="f-grupo"><label class="f-switch"><input type="checkbox" id="f-stock" ${filtro.stock ? 'checked' : ''}><span></span>${t('solo_stock')}</label></div>
    <div class="f-grupo"><h4>${t('precio_max')}: <b id="f-max-txt">${filtro.max ? 'USD ' + usd(filtro.max) : t('todas')}</b></h4>
      <input type="range" id="f-max" min="0" max="${Math.ceil(maxPrecio / 50) * 50}" step="50" value="${filtro.max || Math.ceil(maxPrecio / 50) * 50}"></div>
    <button class="btn btn-borde btn-chico f-limpiar" onclick="Object.assign(filtro,{cat:'todo',q:'',modelo:'',stock:false,max:0});document.getElementById('t-buscar').value='';pintarFiltros();pintarProductos(true)">${t('limpiar')}</button>
    <button class="btn btn-azul f-ver" onclick="document.body.classList.remove('filtros-abiertos')">${t('resultados')}</button>`;
  $$('.f-cat').forEach(b => b.onclick = () => { filtro.cat = b.dataset.cat; filtro.mostrar = 12; pintarFiltros(); pintarProductos(true); });
  $$('.f-mod').forEach(b => b.onclick = () => { filtro.modelo = filtro.modelo === b.dataset.mod ? '' : b.dataset.mod; pintarFiltros(); pintarProductos(true); });
  $('#f-stock').onchange = e => { filtro.stock = e.target.checked; pintarProductos(true); };
  const r = $('#f-max'); r.oninput = () => { const tope = +r.max; filtro.max = +r.value >= tope ? 0 : +r.value; $('#f-max-txt').textContent = filtro.max ? 'USD ' + usd(filtro.max) : t('todas'); pintarProductos(); };
}

function filtrados(){
  const q = filtro.q.trim().toLowerCase(), m = filtro.modelo.toLowerCase();
  let l = todosLosItems().filter(i => (filtro.cat === 'todo' || i.cat === filtro.cat)
    && (!q || [i.nombre, i.codigo, ...(i.modelos || [])].join(' ').toLowerCase().includes(q))
    && (!m || (i.modelos || []).some(x => x.toLowerCase() === m))
    && (!filtro.stock || i.stock > 0) && (!filtro.max || (i.precio && i.precio <= filtro.max)));
  const o = filtro.orden;
  l.sort((a, b) => o === 'menor' ? (a.precio || 9e9) - (b.precio || 9e9) : o === 'mayor' ? b.precio - a.precio
    : o === 'nombre' ? a.nombre.localeCompare(b.nombre) : (b.destacado - a.destacado) || ((b.tipo === 'dron') - (a.tipo === 'dron')));
  return l;
}
function pintarProductos(animar){
  const g = $('#t-grilla'); if (!g) return;
  const l = filtrados();
  $('#t-cuenta').textContent = l.length + ' ' + t('resultados') + (filtro.cat !== 'todo' ? ' · ' + tx(catDe(filtro.cat).n) : '') + (filtro.modelo ? ' · ' + filtro.modelo : '');
  g.innerHTML = l.length ? l.slice(0, filtro.mostrar).map(tarjetaProducto).join('') : `<div class="t-vacia">${icono('buscar')}<p>${t('sin_resultados')}</p></div>`;
  $('#t-mas').innerHTML = l.length > filtro.mostrar ? `<button class="btn btn-borde" onclick="filtro.mostrar+=12;pintarProductos(true)">${IDIOMA === 'pt' ? 'Ver mais' : 'Ver más'} (${l.length - filtro.mostrar})</button>` : '';
  activarFocos(g);
  if (animar && window.gsap) gsap.from($$('.prod', g), { opacity: 0, y: 26, duration: .55, stagger: .035, ease: 'expo.out' });
}

function stockChip(i){
  if (i.stock <= 0) return `<span class="chip gris">${t('stock_no')}</span>`;
  if (i.stock <= 2) return `<span class="chip ambar">${t('stock_poco')}</span>`;
  return `<span class="chip">${icono('check')}${t('stock_hay')}</span>`;
}
function arteProducto(i){
  if (i.img) return `<img src="${esc(i.img)}" alt="${esc(i.nombre)}" loading="lazy" class="${i.tipo === 'dron' || /\.png$/i.test(i.img) ? 'recorte' : 'foto'}">`;
  const c = catDe(i.cat); return `<div class="prod-arte">${icono(c.icono)}<span>${esc(i.codigo)}</span></div>`;
}
const enlaceItem = i => i.tipo === 'dron' ? '#/drones/' + i.dron.id : '#/tienda/' + i.id;
function tarjetaProducto(i){
  if (!i) return '';
  return `<article class="prod foco">
    <a class="prod-img" href="${enlaceItem(i)}">${arteProducto(i)}
      ${i.precioAntes > i.precio && i.precio > 0 ? `<span class="prod-oferta">-${Math.round((1 - i.precio / i.precioAntes) * 100)}%</span>` : ''}</a>
    <div class="prod-info">
      <div class="prod-chips"><span class="prod-cat">${esc(tx(catDe(i.cat).n))}</span>${stockChip(i)}</div>
      <h3><a href="${enlaceItem(i)}">${esc(i.nombre)}</a></h3>
      <p class="prod-compat">${i.modelos.length && i.tipo !== 'dron' ? t('compatible') + ' ' + esc(i.modelos.join(' · ')) : esc(tx(i.desc))}</p>
      <div class="prod-pie"><div>${precioHTML(i.precio, i.precioAntes)}</div>
        <button class="prod-agregar" onclick="agregarAlCarrito('${esc(i.ref)}', this)" aria-label="${t('agregar')}">${icono('mas')}</button></div>
    </div></article>`;
}

function productoHTML(i){
  const msg = (IDIOMA === 'pt' ? 'Olá! Quero consultar sobre: ' : '¡Hola! Quiero consultar por: ') + i.nombre + ' (' + i.codigo + ')';
  const rel = todosLosItems().filter(z => z.ref !== i.ref && z.tipo !== 'dron' && (z.cat === i.cat || z.modelos.some(m => i.modelos.includes(m)))).slice(0, 4);
  return `<section class="bloque prod-pag"><div class="contenedor">
      <a class="fd-volver oscuro" href="#/tienda">${icono('flecha')} ${t('p_tienda')}</a>
      <div class="pp-in">
        <div class="pp-img ${i.img ? '' : 'sin'}" data-aparece>${arteProducto(i)}</div>
        <div class="pp-info">
          <div class="prod-chips"><a class="prod-cat" href="#/tienda?cat=${i.cat}">${esc(tx(catDe(i.cat).n))}</a>${stockChip(i)}</div>
          <h1>${esc(i.nombre)}</h1>
          <p class="pp-cod">${t('codigo')}: <b>${esc(i.codigo)}</b></p>
          <div class="pp-precio">${precioHTML(i.precio, i.precioAntes)}</div>
          <p class="pp-desc">${esc(tx(i.desc))}</p>
          ${i.modelos.length ? `<div class="pp-compat"><small>${t('compatible')}</small>${i.modelos.map(m => `<a class="chip azul" href="#/tienda?modelo=${encodeURIComponent(m)}">${esc(m)}</a>`).join('')}</div>` : ''}
          <div class="pp-comprar"><div class="cant" data-ref="${esc(i.ref)}"><button data-d="-1">${icono('menos')}</button><span>1</span><button data-d="1">${icono('mas')}</button></div>
            <button class="btn btn-azul" id="pp-agregar">${icono('carrito')} ${t('agregar')}</button></div>
          <a class="btn btn-wa pp-wa" href="${waLink(msg)}" target="_blank" rel="noopener">${icono('wa')} ${t('consultar')}</a>
          <ul class="pp-garantias"><li>${icono('escudo')}${IDIOMA === 'pt' ? 'Peça original DJI' : 'Repuesto original DJI'}</li><li>${icono('motor')}${IDIOMA === 'pt' ? 'Instalação na nossa oficina' : 'Colocación en nuestro taller'}</li><li>${icono('ubicacion')}${IDIOMA === 'pt' ? 'Retirada em Rivera ou envio' : 'Retiro en Rivera o envío'}</li></ul>
        </div>
      </div>
    </div></section>
    ${rel.length ? `<section class="bloque niebla"><div class="contenedor"><h2 class="titulo chico">${t('relacionados')}</h2><div class="prods-grilla" style="margin-top:30px">${rel.map(tarjetaProducto).join('')}</div></div></section>` : ''}`;
}
function activarCantidad(v){
  const c = $('.cant', v); if (!c) return; let n = 1;
  $$('button', c).forEach(b => b.onclick = () => { n = Math.max(1, n + +b.dataset.d); $('span', c).textContent = n; });
  $('#pp-agregar').onclick = e => agregarAlCarrito(c.dataset.ref, e.currentTarget, n);
}

/* --- Pedido (carrito) --- */
function guardarCarrito(){ try { localStorage.setItem('dp_carrito', JSON.stringify(carrito)); } catch (e) {} actualizarBurbuja(); }
function actualizarBurbuja(){ const n = carrito.reduce((s, c) => s + c.n, 0); $$('.burbuja').forEach(b => { b.textContent = n; b.classList.toggle('ver', n > 0); }); }
function agregarAlCarrito(ref, boton, cant){
  const i = itemDe(ref); if (!i) return; cant = cant || 1;
  const c = carrito.find(z => z.ref === ref); if (c) c.n += cant; else carrito.push({ ref, n: cant });
  guardarCarrito(); volarAlCarrito(boton);
  $$('.burbuja').forEach(b => window.gsap && gsap.fromTo(b, { scale: 1.8 }, { scale: 1, duration: .6, ease: 'elastic.out(1,.4)' }));
  aviso(t('agregado') + ': ' + i.nombre);
  if ($('#carrito').classList.contains('abierto')) pintarCarrito();
}
function volarAlCarrito(boton){
  const destino = [...$$('.nav-carrito')].find(e => e.offsetParent) ; if (!boton || !destino || !window.gsap) return;
  const a = boton.getBoundingClientRect(), b = destino.getBoundingClientRect();
  const p = document.createElement('i'); p.className = 'punto-vuela'; document.body.appendChild(p);
  gsap.set(p, { x: a.left + a.width / 2, y: a.top + a.height / 2 });
  gsap.to(p, { x: b.left + b.width / 2, duration: .8, ease: 'power1.inOut' });
  gsap.to(p, { y: b.top + b.height / 2, duration: .8, ease: 'back.in(1.6)', onComplete: () => p.remove() });
}
function abrirCarrito(){ pintarCarrito(); $('#carrito').classList.add('abierto'); $('#velo-carrito').classList.add('abierto'); if (window.lenis) window.lenis.stop(); }
function cerrarCarrito(){ const c = $('#carrito'); if (!c || !c.classList.contains('abierto')) return; c.classList.remove('abierto'); $('#velo-carrito').classList.remove('abierto'); if (window.lenis) window.lenis.start(); }
function cambiarCantidad(ref, d){ const c = carrito.find(z => z.ref === ref); if (!c) return; c.n += d; if (c.n <= 0) carrito = carrito.filter(z => z !== c); guardarCarrito(); pintarCarrito(); }
function pintarCarrito(){
  const filas = carrito.map(c => ({ c, i: itemDe(c.ref) })).filter(x => x.i);
  const total = filas.reduce((s, x) => s + (x.i.precio || 0) * x.c.n, 0);
  $('#carrito').innerHTML = `
    <div class="car-cab"><h3>${t('carrito')}</h3><button class="modal-cerrar" onclick="cerrarCarrito()" aria-label="${t('cerrar')}">${icono('cerrar')}</button></div>
    ${filas.length ? `<div class="car-lista">${filas.map(({ c, i }) => `
      <div class="car-item"><div class="car-img">${arteProducto(i)}</div>
        <div class="car-txt"><b>${esc(i.nombre)}</b><small>${esc(i.codigo)}</small>
          <div class="cant chica"><button onclick="cambiarCantidad('${esc(c.ref)}',-1)">${icono('menos')}</button><span>${c.n}</span><button onclick="cambiarCantidad('${esc(c.ref)}',1)">${icono('mas')}</button></div></div>
        <div class="car-precio">${i.precio ? 'USD ' + usd(i.precio * c.n) : t('consultar_precio')}</div></div>`).join('')}</div>
      <form class="car-form" id="car-form" novalidate>
        <div class="campo"><label>${t('tu_nombre')}</label><input id="cf-nombre" data-obl autocomplete="name"><span class="error">${t('f_obligatorio')}</span></div>
        <div class="grilla-form"><div class="campo"><label>${t('tu_telefono')}</label><input id="cf-tel" data-obl type="tel" autocomplete="tel"><span class="error">${t('f_obligatorio')}</span></div>
        <div class="campo"><label>${t('tu_ciudad')}</label><input id="cf-ciudad"></div></div>
      </form>
      <div class="car-total"><span>${t('total')}</span><b>USD ${usd(total)}</b></div>
      <p class="car-nota">${t('pedido_nota')}</p>
      <button class="btn btn-wa car-enviar" onclick="enviarPedido()">${icono('wa')} ${t('enviar_pedido')}</button>`
    : `<div class="car-vacio">${icono('carrito')}<p>${t('carrito_vacio')}</p><a class="btn btn-azul" href="#/tienda" onclick="cerrarCarrito()">${t('ir_tienda')}</a></div>`}`;
}
function enviarPedido(){
  if (!validar($('#car-form'))) return;
  const filas = carrito.map(c => ({ c, i: itemDe(c.ref) })).filter(x => x.i);
  const total = filas.reduce((s, x) => s + (x.i.precio || 0) * x.c.n, 0);
  const nombre = $('#cf-nombre').value.trim(), tel = $('#cf-tel').value.trim(), ciudad = $('#cf-ciudad').value.trim();
  const txt = (IDIOMA === 'pt' ? 'Olá! Quero fazer este pedido:\n' : '¡Hola! Quiero hacer este pedido:\n') +
    filas.map(({ c, i }) => `• ${c.n} × ${i.nombre} (${i.codigo})${i.precio ? ' — USD ' + usd(i.precio * c.n) : ''}`).join('\n') + `\nTotal: USD ${usd(total)}\n${nombre} · ${tel}${ciudad ? ' · ' + ciudad : ''}`;
  Datos.get().pedidos.unshift({ id: Datos.nuevoId('ped'), fecha: new Date().toISOString(), nombre, tel, ciudad, idioma: IDIOMA, total,
    items: filas.map(({ c, i }) => ({ ref: c.ref, nombre: i.nombre, codigo: i.codigo, n: c.n, precio: i.precio })), estado: 'nuevo' });
  Datos.guardar();
  window.open(waLink(txt), '_blank', 'noopener');
  carrito = []; guardarCarrito(); pintarCarrito();
}
