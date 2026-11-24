/* =====================================================================
   TIPOS DE BLOQUE · VENTA, CONFIANZA Y CONTACTO (versión 3):
   productos de la tienda, drones, cursos, promociones, precios,
   testimonios, logos, equipo, llamados a la acción, WhatsApp, formulario,
   mapa, enlaces, Instagram y novedades.
   ===================================================================== */
const MODOS_PRODUCTOS = [['destacados', 'Los destacados de la tienda'], ['categoria', 'De una categoría'], ['modelo', 'Repuestos de un modelo de dron'], ['elegidos', 'Elegidos a mano'], ['oferta', 'Los que tienen precio rebajado']];

registrarBloque('productos', { nombre: 'Productos de la tienda', grupo: 'Venta', icono: 'carrito',
  campos: [...CAMPOS_CAB, ['modo', 'Qué productos', 'select', MODOS_PRODUCTOS], ['cat', 'Categoría (si elegiste «De una categoría»)', 'cat'],
    ['modelo', 'Modelo (si elegiste «Repuestos de un modelo»)', 'modelo'], ['ids', 'Productos (si elegiste «Elegidos a mano»)', 'productos'], ['cantidad', 'Cuántos mostrar', 'numero']],
  render(d){
    const todos = todosLosItems().filter(i => i.tipo !== 'dron'); let l;
    if (d.modo === 'categoria') l = todos.filter(i => i.cat === d.cat);
    else if (d.modo === 'modelo') l = todos.filter(i => (i.modelos || []).some(m => m.toUpperCase() === String(d.modelo || '').toUpperCase()));
    else if (d.modo === 'elegidos') l = (d.ids || []).map(r => itemDe(r)).filter(Boolean);
    else if (d.modo === 'oferta') l = todos.filter(i => i.precioAntes > i.precio && i.precio > 0);
    else l = todos.filter(i => i.destacado).concat(todos.filter(i => !i.destacado));
    l = l.slice(0, Math.max(1, Number(d.cantidad) || 4));
    const ir = d.modo === 'categoria' && d.cat ? '#/tienda?cat=' + d.cat : d.modo === 'modelo' && d.modelo ? '#/tienda?modelo=' + encodeURIComponent(d.modelo) : '#/tienda';
    return `<div class="b-cab-fila">${cabeceraB(d)}<a class="enlace" href="${ir}">${t('ver_todo')} ${icono('flecha')}</a></div>
      <div class="productos b-productos">${l.map(tarjetaProducto).join('') || '<p class="b-vacia">No hay productos que coincidan.</p>'}</div>`;
  }
});

registrarBloque('drones', { nombre: 'Drones de la línea', grupo: 'Venta', icono: 'dron', fondo: 'noche',
  campos: [...CAMPOS_CAB, ['ids', 'Drones (vacío = todos)', 'drones']],
  render(d){ const l = (d.ids && d.ids.length ? d.ids.map(dronDe).filter(Boolean) : dronesVisibles());
    return `<div class="b-cab-fila">${cabeceraB(d)}<a class="enlace" href="#/drones">${t('ver_todo')} ${icono('flecha')}</a></div><div class="b-drones">${l.map(tarjetaDron).join('')}</div>`; }
});

registrarBloque('cursos', { nombre: 'Próximos cursos', grupo: 'Venta', icono: 'calendario',
  campos: [...CAMPOS_CAB, ['cantidad', 'Cuántos mostrar', 'numero']],
  render(d){ const l = cursosVisibles().filter(c => (c.fecha || '') >= hoyISO()).slice(0, Number(d.cantidad) || 3);
    return `${cabeceraB(d)}<div class="b-cursos">${l.map(c => { const f = fechaCorta(c.fecha);
      return `<a class="b-curso foco" href="#/cursos/${c.id}" data-aparece><div class="b-curso-img"><img src="${esc(c.imagen)}" alt="" loading="lazy"><div class="curso-fecha"><b>${f.d}</b><span>${esc(f.m)}</span></div></div>
        <div class="b-curso-txt"><b>${T(c.titulo)}</b><span>${libresDe(c)} ${t('cupos_libres')}</span>${precioHTML(c.precio)}</div></a>`; }).join('') || '<p class="b-vacia">No hay cursos próximos.</p>'}</div>`; }
});

registrarBloque('promo', { nombre: 'Promoción con vencimiento', grupo: 'Venta', icono: 'estrella', fondo: 'blanco',
  campos: [...CAMPOS_CAB, ['img', 'Foto', 'img'], ['precio', 'Precio en dólares (opcional)', 'usd'], ['precioAntes', 'Precio anterior tachado (opcional)', 'usd'],
    ['hasta', 'Válida hasta (muestra la cuenta regresiva)', 'fecha'], ['boton', 'Botón', 'boton']],
  render(d){ const vencida = d.hasta && d.hasta < hoyISO();
    return `<div class="b-promo ${vencida ? 'vencida' : ''}" data-aparece><div class="b-promo-img"${edimg('img')}>${d.img ? `<img src="${esc(d.img)}" alt="" loading="lazy">` : ''}${vencida ? `<span class="chip gris">${IDIOMA === 'pt' ? 'Encerrada' : 'Terminó'}</span>` : ''}</div>
      <div class="b-promo-txt">${cabeceraB(d)}${d.precio ? `<div class="b-promo-precio">${precioHTML(d.precio, d.precioAntes)}</div>` : ''}
        ${d.hasta && !vencida ? `<div class="cuenta" data-fecha="${esc(d.hasta)}"></div>` : ''}<div class="b-botones">${botonB(d.boton, '', 'boton')}</div></div></div>`; },
  alMostrar(el){ $$('.cuenta', el).forEach(cuentaRegresiva); }
});

registrarBloque('precios', { nombre: 'Paquetes y precios', grupo: 'Venta', icono: 'carrito',
  campos: [...CAMPOS_CAB, ['items', 'Paquetes', 'items', [['t', 'Nombre', 'i18n'], ['precio', 'Precio en dólares (0 = consultar)', 'usd'], ['per', 'Aclaración (ej. «por hectárea»)', 'i18n'],
    ['puntos', 'Qué incluye (un renglón por cosa)', 'md'], ['destacado', 'Destacado', 'check'], ['boton', 'Botón', 'boton']]]],
  render(d){ return `${cabeceraB(d, true)}<div class="b-precios">${(d.items || []).map((x, i) => `<div class="b-plan ${x.destacado ? 'dest' : ''}" data-aparece>
      ${x.destacado ? `<span class="b-plan-chip">${IDIOMA === 'pt' ? 'Mais escolhido' : 'El más elegido'}</span>` : ''}<b class="b-plan-t"${edd('items.' + i + '.t')}>${T(x.t)}</b>
      <div class="b-plan-precio">${precioHTML(Number(x.precio) || 0)}${tx(x.per) ? `<small>${T(x.per)}</small>` : ''}</div>
      <ul>${tx(x.puntos).split('\n').map(s => s.replace(/^\s*[-•]\s*/, '').trim()).filter(Boolean).map(s => `<li>${icono('check')}<span>${esc(s)}</span></li>`).join('')}</ul>
      <div class="b-botones">${botonB(x.boton, x.destacado ? 'btn-verde' : 'btn-azul', 'items.' + i + '.boton')}</div></div>`).join('')}</div>`; }
});

registrarBloque('testimonios', { nombre: 'Testimonios de clientes', grupo: 'Confianza', icono: 'usuarios',
  campos: [...CAMPOS_CAB, ['items', 'Testimonios', 'items', [['texto', 'Lo que dijo', 'i18n'], ['nombre', 'Nombre', 'texto'], ['lugar', 'Lugar o cargo', 'texto'], ['foto', 'Foto (opcional)', 'img'], ['estrellas', 'Estrellas (1 a 5)', 'numero']]]],
  render(d){ return `${cabeceraB(d, true)}<div class="b-testimonios">${(d.items || []).map((x, i) => `<figure class="b-testi" data-aparece>
      <div class="b-estrellas">${'★'.repeat(Math.max(0, Math.min(5, Number(x.estrellas) || 5)))}</div><blockquote>“<span${edd('items.' + i + '.texto')}>${T(x.texto)}</span>”</blockquote>
      <figcaption>${x.foto ? `<img src="${esc(x.foto)}" alt="">` : `<span class="b-inicial">${esc((x.nombre || '?').trim()[0] || '?')}</span>`}<div><b>${esc(x.nombre || '')}</b><small>${esc(x.lugar || '')}</small></div></figcaption></figure>`).join('')}</div>`; }
});

registrarBloque('logos', { nombre: 'Logos de marcas', grupo: 'Confianza', icono: 'escudo',
  campos: [['titulo', 'Título (opcional)', 'i18n'], ['items', 'Logos', 'items', [['img', 'Logo', 'img'], ['nombre', 'Nombre', 'texto'], ['url', 'Link (opcional)', 'url']]]],
  render(d){ return `${cabeceraB({ titulo: d.titulo }, true)}<div class="b-logos">${(d.items || []).map(x => { const h = x.url ? urlDe(x.url) : '';
    return `<${h ? 'a' : 'div'} class="b-logo" data-aparece ${h ? `href="${esc(h)}" target="_blank" rel="noopener"` : ''}>${x.img ? `<img src="${esc(x.img)}" alt="${esc(x.nombre || '')}">` : `<b>${esc(x.nombre || '')}</b>`}</${h ? 'a' : 'div'}>`; }).join('')}</div>`; }
});

registrarBloque('equipo', { nombre: 'El equipo', grupo: 'Confianza', icono: 'usuarios',
  campos: [...CAMPOS_CAB, ['items', 'Personas o áreas', 'items', [['foto', 'Foto', 'img'], ['nombre', 'Nombre o área', 'i18n'], ['rol', 'Qué hace', 'i18n']]]],
  render(d){ return `${cabeceraB(d, true)}<div class="b-equipo">${(d.items || []).map((x, i) => `<div class="b-persona" data-aparece>${x.foto ? `<img src="${esc(x.foto)}" alt=""${edimg('items.' + i + '.foto')}>` : `<span class="b-persona-ico"${edimg('items.' + i + '.foto')}>${icono('usuarios')}</span>`}<b${edd('items.' + i + '.nombre')}>${T(x.nombre)}</b><span${edd('items.' + i + '.rol')}>${T(x.rol)}</span></div>`).join('')}</div>`; }
});

registrarBloque('cta', { nombre: 'Llamado a la acción', grupo: 'Contacto', icono: 'flecha', fondo: 'verde', angosto: true,
  campos: [['titulo', 'Título', 'i18n'], ['texto', 'Texto', 'md'], ['b1', 'Botón principal', 'boton'], ['b2', 'Botón secundario (opcional)', 'boton']],
  render(d){ return `<div class="b-cta" data-aparece><h2 class="titulo chico"${edd('titulo')}>${T(d.titulo)}</h2>${tx(d.texto) ? `<div class="sub b-md"${edmd('texto')}>${md(d.texto)}</div>` : ''}<div class="b-botones">${botonB(d.b1, 'btn-blanco', 'b1')}${botonB(d.b2, 'btn-vidrio', 'b2')}</div></div>`; }
});

registrarBloque('whatsapp', { nombre: 'Botón grande de WhatsApp', grupo: 'Contacto', icono: 'wa', angosto: true,
  campos: [['titulo', 'Título', 'i18n'], ['texto', 'Texto', 'i18n'], ['mensaje', 'Mensaje que se escribe solo', 'i18n'], ['boton', 'Texto del botón', 'i18n']],
  render(d){ return `<div class="b-wa" data-aparece><span class="b-wa-ico">${icono('wa')}</span><div><b${edd('titulo')}>${T(d.titulo)}</b><p${edd('texto')}>${T(d.texto)}</p></div>
    <a class="btn btn-wa magnetico" href="${esc(waLink(tx(d.mensaje) || msjClaudio()))}" target="_blank" rel="noopener">${icono('wa')} <span${edd('boton')}>${T(d.boton) || t('hablar_claudio')}</span></a></div>`; }
});

const CAMPOS_FORM = [['nombre', 'Nombre'], ['tel', 'Teléfono'], ['email', 'Correo'], ['ciudad', 'Ciudad'], ['msg', 'Mensaje']];
registrarBloque('formulario', { nombre: 'Formulario de contacto', grupo: 'Contacto', icono: 'mail', angosto: true, fondo: 'blanco',
  campos: [...CAMPOS_CAB, ['pide', 'Qué datos pide', 'checks', CAMPOS_FORM], ['motivo', 'Asunto con el que llega a la Bandeja', 'texto'], ['boton', 'Texto del botón', 'i18n']],
  render(d, b){ const pide = d.pide && d.pide.length ? d.pide : ['nombre', 'tel', 'msg'];
    const et = { nombre: t('f_nombre'), tel: t('f_telefono'), email: t('f_email'), ciudad: t('f_ciudad'), msg: t('c_mensaje') };
    return `${cabeceraB(d, true)}<form class="b-form" data-form="${esc(b.id)}" novalidate>
      <div class="grilla-form">${pide.map(k => `<div class="campo ${k === 'msg' ? 'ancho' : ''}"><label>${esc(et[k] || k)}</label>${k === 'msg' ? `<textarea name="${k}" data-obl></textarea>` : `<input name="${k}" ${k === 'email' ? 'type="email"' : k === 'tel' ? 'inputmode="tel"' : ''} ${k === 'nombre' || k === 'tel' ? 'data-obl' : ''}>`}<span class="error">${t('f_obligatorio')}</span></div>`).join('')}</div>
      <button class="btn btn-azul" type="submit">${T(d.boton) || t('c_enviar')} ${icono('flecha')}</button></form>`; },
  alMostrar(el, d){ const f = $('form', el); if (!f) return;
    f.onsubmit = e => { e.preventDefault(); if (EN_EDITOR) return; if (!validar(f)) return;
      const v = Object.fromEntries(new FormData(f).entries());
      Datos.get().mensajes.unshift({ id: Datos.nuevoId('msj'), fecha: new Date().toISOString(), nombre: v.nombre || '', tel: v.tel || '', email: v.email || '', ciudad: v.ciudad || '', motivo: d.motivo || 'Formulario de la página', msg: v.msg || '', pagina: location.hash, leido: false });
      Datos.guardar(); f.innerHTML = `<div class="b-form-ok">${icono('check')}<b>${t('c_enviado')}</b><p>${IDIOMA === 'pt' ? 'Respondemos o quanto antes.' : 'Te respondemos a la brevedad.'}</p></div>`; }; }
});

registrarBloque('mapa', { nombre: 'Mapa y horarios', grupo: 'Contacto', icono: 'ubicacion',
  campos: [['titulo', 'Título', 'i18n'], ['direccion', 'Dirección para el mapa (vacío = la de Marca y datos)', 'texto'], ['horarios', 'Mostrar teléfonos y horarios', 'check']],
  render(d){ const c = Datos.get().config, dir = d.direccion || c.mapa;
    return `<div class="b-mapa"><div class="b-mapa-txt">${cabeceraB({ titulo: d.titulo })}${d.horarios !== false ? `<ul class="b-datos">
      <li>${icono('ubicacion')}<span>${T(c.direccion)}</span></li><li>${icono('reloj')}<span>${T(c.horarios)}</span></li>${c.telefonos.filter(Boolean).map(n => `<li>${icono('telefono')}<a href="tel:${n.replace(/\D/g, '')}">${esc(n)}</a></li>`).join('')}</ul>` : ''}
      <a class="btn btn-azul" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dir)}" target="_blank" rel="noopener">${icono('ubicacion')} ${IDIOMA === 'pt' ? 'Como chegar' : 'Cómo llegar'}</a></div>
      <div class="b-mapa-frame" data-aparece><iframe title="Mapa" loading="lazy" src="https://maps.google.com/maps?q=${encodeURIComponent(dir)}&z=14&output=embed"></iframe></div></div>`; }
});

registrarBloque('enlaces', { nombre: 'Lista de enlaces', grupo: 'Contacto', icono: 'enlace', angosto: true,
  campos: [['titulo', 'Título (opcional)', 'i18n'], ['items', 'Enlaces', 'items', [['texto', 'Texto', 'i18n'], ['url', 'Link', 'url'], ['icono', 'Ícono', 'icono']]]],
  render(d){ return `${cabeceraB({ titulo: d.titulo }, true)}<div class="b-enlaces">${(d.items || []).map(x => { const h = urlDe(x.url);
    return `<a class="b-enlace" data-aparece href="${esc(h)}"${externo(h) ? ' target="_blank" rel="noopener"' : ''}>${icono(x.icono || 'enlace')}<span${edd('items.' + d.items.indexOf(x) + '.texto')}>${T(x.texto)}</span>${icono('flecha')}</a>`; }).join('')}</div>`; }
});

registrarBloque('instagram', { nombre: 'Grilla de Instagram', grupo: 'Instagram', icono: 'instagram', fondo: 'niebla',
  campos: [...CAMPOS_CAB, ['cantidad', 'Cuántas publicaciones', 'numero'], ['estilo', 'Cómo se ven', 'select', [['grilla', 'Grilla de fotos (rápida)'], ['embebido', 'Publicaciones de Instagram tal cual']]]],
  render(d){ const c = Datos.get().config, ig = Datos.get().igConexion || {};
    const l = publicacionesIG().slice(0, Number(d.cantidad) || 8);
    return `<div class="b-cab-fila">${cabeceraB({ etiqueta: d.etiqueta, titulo: tx(d.titulo) ? d.titulo : '@' + (ig.usuario || ''), texto: d.texto })}
      <a class="btn btn-borde" href="${esc(c.instagram)}" target="_blank" rel="noopener">${icono('instagram')} ${t('ver_ig')}</a></div>
      ${d.estilo === 'embebido' ? `<div class="b-ig-embeds">${l.filter(p => /instagram\.com\/(?:[\w.]+\/)?(p|reel)\//.test(p.url)).slice(0, 3).map(p => videoHTML(p.url)).join('') || '<p class="b-vacia">Pegá links de publicaciones en Instagram (Estudio).</p>'}</div>`
        : `<div class="ig-grilla">${l.map(p => `<a class="ig-item" href="${esc(p.url)}" target="_blank" rel="noopener" data-aparece>${p.img ? `<img src="${esc(p.img)}" alt="" loading="lazy">` : `<span class="ig-sin">${icono('instagram')}</span>`}
          ${p.video ? `<video src="${esc(p.video)}" muted loop playsinline preload="none"></video><span class="ig-play">${icono('play')}</span>` : ''}<span class="ig-ver">${icono('instagram')}</span></a>`).join('')}</div>`}`; },
  alMostrar(el){ $$('.ig-item', el).forEach(a => { const vid = $('video', a); if (!vid) return;
    a.addEventListener('mouseenter', () => { vid.preload = 'auto'; vid.play().catch(() => {}); a.classList.add('reproduce'); });
    a.addEventListener('mouseleave', () => { vid.pause(); a.classList.remove('reproduce'); }); }); }
});

registrarBloque('reel', { nombre: 'Reel destacado', grupo: 'Instagram', icono: 'play', fondo: 'noche',
  campos: [...CAMPOS_CAB, ['url', 'Link del reel o publicación de Instagram (o un video)', 'video'], ['boton', 'Botón (opcional)', 'boton']],
  render(d){ return `<div class="b-reel"><div class="b-reel-txt">${cabeceraB(d)}<div class="b-botones">${botonB(d.boton, 'btn-blanco', 'boton')}<a class="btn btn-vidrio" href="${esc(Datos.get().config.instagram)}" target="_blank" rel="noopener">${icono('instagram')} ${t('ver_ig')}</a></div></div>
    <div class="b-reel-cel" data-aparece="der"><div class="telefono">${videoHTML(d.url, { vertical: true, auto: !/instagram|youtu/.test(d.url || '') }) || ''}</div></div></div>`; }
});

registrarBloque('novedades', { nombre: 'Últimas novedades', grupo: 'Novedades', icono: 'diario',
  campos: [...CAMPOS_CAB, ['cantidad', 'Cuántas mostrar', 'numero'], ['cat', 'Solo de un tema (vacío = todas)', 'select', [['', 'Todas'], ...CATS_NOVEDADES.map(c => [c[0], c[1]])]]],
  render(d){ const l = novedadesVisibles().filter(n => !d.cat || n.cat === d.cat).slice(0, Number(d.cantidad) || 3);
    return `<div class="b-cab-fila">${cabeceraB(d)}<a class="enlace" href="#/novedades">${IDIOMA === 'pt' ? 'Ver todas' : 'Ver todas'} ${icono('flecha')}</a></div>
      <div class="nv-grilla">${l.map(tarjetaNovedad).join('') || '<p class="b-vacia">Todavía no hay novedades publicadas.</p>'}</div>`; }
});

// Un post o reel de Instagram, tal cual, con texto y botón al costado (24/11/2026, pedido de la usuaria)
registrarBloque('igpost', { nombre: 'Post de Instagram', grupo: 'Instagram', icono: 'instagram', fondo: 'blanco',
  campos: [['url', 'Link del post o reel de Instagram', 'video'], ...CAMPOS_CAB, ['lado', 'El post va', 'select', [['izq', 'A la izquierda'], ['der', 'A la derecha']]], ['boton', 'Botón (opcional)', 'boton']],
  render(d){ const ok = /instagram\.com\//.test(d.url || '');
    return `<div class="b-igpost ${d.lado === 'der' ? 'der' : ''}"><div class="b-igpost-post" data-aparece="zoom">${ok ? videoHTML(d.url) : `<div class="b-vacia">${icono('instagram')}<p>Pegá el link del post en el Estudio<br>(en Instagram: ⋯ → Copiar enlace).</p></div>`}</div>
      <div class="b-igpost-txt">${cabeceraB(d)}<div class="b-botones">${botonB(d.boton, '', 'boton')}<a class="btn btn-borde" href="${esc(ok ? d.url : Datos.get().config.instagram)}" target="_blank" rel="noopener">${icono('instagram')} ${t('ver_ig')}</a></div></div></div>`; }
});
