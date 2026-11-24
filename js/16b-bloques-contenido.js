/* =====================================================================
   TIPOS DE BLOQUE · CONTENIDO (versión 3): portadas, textos, fotos,
   videos, preguntas, números, tarjetas, pasos, comparativas.
   Cada tipo dice qué campos tiene (los edita el Estudio) y cómo se dibuja.
   Tipos de campo: texto · i18n · md (texto con formato) · img · imgs ·
   video · boton · numero · usd · fecha · check · select · icono · items
   ===================================================================== */
const VARIANTES_PORTADA = [['foto', 'Foto de fondo'], ['video', 'Video de fondo'], ['partida', 'Partida: texto y foto'], ['centrada', 'Centrada con el fondo de la marca'], ['cuenta', 'Con cuenta regresiva']];
const CAMPOS_CAB = [['etiqueta', 'Etiqueta chiquita (arriba del título)', 'i18n'], ['titulo', 'Título', 'i18n'], ['texto', 'Texto', 'md']];

registrarBloque('portada', { nombre: 'Portada', grupo: 'Portadas', icono: 'casa', completo: true, fondo: 'noche',
  campos: [['variante', 'Estilo', 'select', VARIANTES_PORTADA], ...CAMPOS_CAB, ['img', 'Foto', 'img'], ['video', 'Video de fondo (YouTube no: un .mp4 o del Drive)', 'video'],
    ['fecha', 'Fecha de la cuenta regresiva', 'fecha'], ['b1', 'Botón principal', 'boton'], ['b2', 'Botón secundario', 'boton']],
  render(d){
    const v = d.variante || 'foto', media = v === 'video' && d.video ? `<video class="bp-media" src="${esc(d.video)}" muted loop autoplay playsinline data-auto ${d.img ? `poster="${esc(d.img)}"` : ''}></video>`
      : v === 'centrada' ? `<div class="bp-media bp-arte">${fondoAmanecer()}</div>` : d.img && v !== 'partida' ? `<img class="bp-media" src="${esc(d.img)}" alt="">` : '';
    return `<section class="b-portada var-${v}"><div class="bp-card">${media}<div class="bp-velo"></div>
      <div class="bp-grid contenedor"><div class="bp-txt">
        ${tx(d.etiqueta) ? `<span class="hero-chip">${icono('estrella')} <span${edd('etiqueta')}>${T(d.etiqueta)}</span></span>` : ''}
        <h1 class="bp-titulo" data-dividir${edd('titulo')}>${T(d.titulo)}</h1>${tx(d.texto) ? `<div class="bp-sub b-md"${edmd('texto')}>${md(d.texto)}</div>` : ''}
        ${v === 'cuenta' && d.fecha ? `<div class="cuenta bp-cuenta" data-fecha="${esc(d.fecha)}"></div>` : ''}
        <div class="hero-botones">${botonB(d.b1, 'btn-blanco', 'b1')}${botonB(d.b2, 'btn-vidrio', 'b2')}</div></div>
        ${v === 'partida' && d.img ? `<div class="bp-foto" data-aparece="der"><img src="${esc(d.img)}" alt=""${edimg('img')}></div>` : ''}</div></div></section>`;
  },
  alMostrar(el){ $$('.cuenta', el).forEach(cuentaRegresiva); }
});

registrarBloque('texto', { nombre: 'Título y texto', icono: 'lapiz', angosto: true,
  campos: [...CAMPOS_CAB, ['alin', 'Alineación', 'select', [['izq', 'A la izquierda'], ['centro', 'Centrado']]], ['boton', 'Botón (opcional)', 'boton']],
  render(d){ return `<div class="b-texto ${d.alin === 'centro' ? 'centro' : ''}">${cabeceraB({ etiqueta: d.etiqueta, titulo: d.titulo }, d.alin === 'centro')}
    <div class="b-md b-cuerpo" data-aparece${edmd('texto')}>${md(d.texto)}</div>${d.boton && tx(d.boton.txt) ? `<div class="b-botones" data-aparece>${botonB(d.boton, '', 'boton')}</div>` : ''}</div>`; }
});

registrarBloque('textoImg', { nombre: 'Texto con foto', icono: 'ojo',
  campos: [...CAMPOS_CAB, ['img', 'Foto', 'img'], ['lado', 'La foto va', 'select', [['der', 'A la derecha'], ['izq', 'A la izquierda']]], ['puntos', 'Puntos con tilde (opcional)', 'lista'], ['boton', 'Botón (opcional)', 'boton']],
  render(d){ return `<div class="b-ti ${d.lado === 'izq' ? 'izq' : ''}"><div class="b-ti-txt">${cabeceraB({ etiqueta: d.etiqueta, titulo: d.titulo })}
      <div class="b-md b-cuerpo" data-aparece${edmd('texto')}>${md(d.texto)}</div>
      ${(d.puntos || []).filter(p => tx(p)).length ? `<ul class="b-puntos" data-aparece>${d.puntos.map((p, i) => tx(p) ? `<li>${icono('check')}<span${edd('puntos.' + i)}>${T(p)}</span></li>` : '').join('')}</ul>` : ''}
      ${d.boton && tx(d.boton.txt) ? `<div class="b-botones" data-aparece>${botonB(d.boton, '', 'boton')}</div>` : ''}</div>
    <div class="b-ti-img" data-aparece="${d.lado === 'izq' ? 'izq' : 'der'}"${edimg('img')}>${d.img ? `<img src="${esc(d.img)}" alt="" loading="lazy">` : `<div class="b-sinfoto">${icono('imagen')}</div>`}</div></div>`; }
});

registrarBloque('cita', { nombre: 'Frase destacada', icono: 'estrella', angosto: true,
  campos: [['texto', 'Frase', 'i18n'], ['autor', 'Quién lo dice', 'i18n'], ['foto', 'Foto (opcional)', 'img']],
  render(d){ return `<figure class="b-cita" data-aparece><span class="b-comillas">“</span><blockquote${edd('texto')}>${T(d.texto)}</blockquote>
    ${tx(d.autor) ? `<figcaption>${d.foto ? `<img src="${esc(d.foto)}" alt=""${edimg('foto')}>` : ''}<span${edd('autor')}>${T(d.autor)}</span></figcaption>` : ''}</figure>`; }
});

registrarBloque('aviso', { nombre: 'Franja de aviso', icono: 'estrella', completo: true,
  campos: [['texto', 'Texto', 'i18n'], ['url', 'Link al tocar (opcional)', 'url'], ['icono', 'Ícono', 'icono'], ['estilo', 'Color', 'select', [['verde', 'Verde'], ['azul', 'Azul'], ['ambar', 'Ámbar']]]],
  render(d){ const h = d.url ? urlDe(d.url) : ''; const tag = h ? 'a' : 'div';
    return `<div class="contenedor"><${tag} class="b-aviso ${d.estilo || 'verde'}" ${h ? `href="${esc(h)}"${externo(h) ? ' target="_blank" rel="noopener"' : ''}` : ''}>${icono(d.icono || 'estrella')}<span${edd('texto')}>${T(d.texto)}</span>${h ? icono('flecha') : ''}</${tag}></div>`; }
});

registrarBloque('galeria', { nombre: 'Galería de fotos', grupo: 'Fotos y videos', icono: 'ojo',
  campos: [...CAMPOS_CAB, ['fotos', 'Fotos', 'imgs'], ['estilo', 'Estilo', 'select', [['grilla', 'Grilla pareja'], ['mosaico', 'Mosaico (una grande)']]]],
  render(d){ const f = (d.fotos || []).filter(Boolean);
    return `${cabeceraB(d)}<div class="b-galeria ${d.estilo === 'mosaico' ? 'mosaico' : ''}">${f.map((s, i) => `<button class="b-gal-item" data-aparece style="--i:${i}" onclick="verFoto('${esc(s)}')"><img src="${esc(s)}" alt="" loading="lazy"></button>`).join('') || '<p class="b-vacia">Agregá fotos desde el Estudio.</p>'}</div>`; }
});

registrarBloque('carrusel', { nombre: 'Carrusel de fotos', grupo: 'Fotos y videos', icono: 'flecha',
  campos: [...CAMPOS_CAB, ['items', 'Fotos', 'items', [['img', 'Foto', 'img'], ['txt', 'Texto (opcional)', 'i18n']]]],
  render(d){ const it = (d.items || []).filter(x => x.img);
    return `<div class="b-carr-cab">${cabeceraB(d)}<div class="carrusel-flechas"><button data-dir="-1" aria-label="‹">${icono('flecha')}</button><button data-dir="1" aria-label="›">${icono('flecha')}</button></div></div>
      <div class="b-carrusel">${it.map(x => `<figure><img src="${esc(x.img)}" alt="" loading="lazy">${tx(x.txt) ? `<figcaption${edd('items.' + d.items.indexOf(x) + '.txt')}>${T(x.txt)}</figcaption>` : ''}</figure>`).join('') || '<p class="b-vacia">Agregá fotos desde el Estudio.</p>'}</div>`; },
  alMostrar(el){ const c = $('.b-carrusel', el); if (!c) return; activarCarrusel(c);
    $$('[data-dir]', el).forEach(b => b.onclick = () => { const w = ($('figure', c) || {}).offsetWidth || 300; c.scrollBy({ left: +b.dataset.dir * (w + 18), behavior: 'smooth' }); }); }
});

registrarBloque('video', { nombre: 'Video', grupo: 'Fotos y videos', icono: 'play',
  campos: [['titulo', 'Título (opcional)', 'i18n'], ['texto', 'Texto (opcional)', 'md'], ['url', 'Video: link de YouTube, de Instagram, o un archivo', 'video'], ['formato', 'Formato', 'select', [['ancho', 'Ancho (horizontal)'], ['vertical', 'Vertical (reel o celular)']]]],
  render(d){ return `${cabeceraB({ titulo: d.titulo, texto: d.texto }, true)}<div class="b-video ${d.formato === 'vertical' ? 'vertical' : ''}" data-aparece="zoom">${videoHTML(d.url, { vertical: d.formato === 'vertical' }) || '<p class="b-vacia">Pegá el link del video en el Estudio.</p>'}</div>`; }
});

registrarBloque('preguntas', { nombre: 'Preguntas frecuentes', icono: 'mas', angosto: true,
  campos: [...CAMPOS_CAB, ['items', 'Preguntas', 'items', [['p', 'Pregunta', 'i18n'], ['r', 'Respuesta', 'md']]]],
  render(d){ return `${cabeceraB(d, true)}<div class="b-faq">${(d.items || []).map((x, i) => `<details class="b-faq-item" data-aparece ${EN_EDITOR ? 'open' : ''}><summary><span${edd('items.' + i + '.p')}>${T(x.p)}</span><i>${icono('mas')}</i></summary><div class="b-md"${edmd('items.' + i + '.r')}>${md(x.r)}</div></details>`).join('')}</div>`; }
});

registrarBloque('numeros', { nombre: 'Números que suben', icono: 'estrella',
  campos: [['titulo', 'Título (opcional)', 'i18n'], ['items', 'Números', 'items', [['n', 'Número', 'texto'], ['suf', 'Unidad (ej. L, ha, %)', 'texto'], ['l', 'Qué es', 'i18n']]]],
  render(d){ return `${cabeceraB({ titulo: d.titulo }, true)}<div class="b-numeros">${(d.items || []).map((x, i) => { const n = String(x.n || '').trim();
    return `<div class="b-num" data-aparece><b>${/^\d+(\.\d+)?$/.test(n) ? `<span class="contador" data-n="${esc(n)}">${esc(n)}</span>` : esc(n)}<small>${esc(x.suf || '')}</small></b><span${edd('items.' + i + '.l')}>${T(x.l)}</span></div>`; }).join('')}</div>`; }
});

registrarBloque('tarjetas', { nombre: 'Tarjetas con íconos', icono: 'kit',
  campos: [...CAMPOS_CAB, ['items', 'Tarjetas', 'items', [['icono', 'Ícono', 'icono'], ['t', 'Título', 'i18n'], ['d', 'Texto', 'i18n'], ['url', 'Link (opcional)', 'url']]], ['columnas', 'Columnas en la compu', 'select', [['3', 'Tres'], ['2', 'Dos'], ['4', 'Cuatro']]]],
  render(d){ return `${cabeceraB(d)}<div class="b-tarjetas c${d.columnas || 3}">${(d.items || []).map((x, i) => { const h = x.url ? urlDe(x.url) : ''; const tag = h ? 'a' : 'div';
    return `<${tag} class="b-tarjeta foco" data-aparece ${h ? `href="${esc(h)}"${externo(h) ? ' target="_blank" rel="noopener"' : ''}` : ''}><span class="b-tar-ico">${icono(x.icono || 'escudo')}</span><b${edd('items.' + i + '.t')}>${T(x.t)}</b><p${edd('items.' + i + '.d')}>${T(x.d)}</p>${h ? `<span class="enlace">${icono('flecha')}</span>` : ''}</${tag}>`; }).join('')}</div>`; }
});

registrarBloque('pasos', { nombre: 'Pasos o línea de tiempo', icono: 'check',
  campos: [...CAMPOS_CAB, ['estilo', 'Estilo', 'select', [['numeros', 'Pasos numerados'], ['linea', 'Línea de tiempo']]], ['items', 'Pasos', 'items', [['f', 'Fecha o etiqueta (opcional)', 'i18n'], ['t', 'Título', 'i18n'], ['d', 'Texto', 'i18n']]]],
  render(d){ return `${cabeceraB(d, d.estilo !== 'linea')}<ol class="b-pasos ${d.estilo === 'linea' ? 'linea' : ''}">${(d.items || []).map((x, i) => `<li data-aparece><span class="b-paso-n">${tx(x.f) ? T(x.f) : String(i + 1).padStart(2, '0')}</span><div><b${edd('items.' + i + '.t')}>${T(x.t)}</b><p${edd('items.' + i + '.d')}>${T(x.d)}</p></div></li>`).join('')}</ol>`; }
});

registrarBloque('comparativa', { nombre: 'Tabla comparativa', icono: 'comparar',
  campos: [...CAMPOS_CAB, ['c1', 'Columna 1', 'i18n'], ['c2', 'Columna 2', 'i18n'], ['c3', 'Columna 3 (opcional)', 'i18n'],
    ['items', 'Filas', 'items', [['l', 'Qué se compara', 'i18n'], ['v1', 'Columna 1', 'texto'], ['v2', 'Columna 2', 'texto'], ['v3', 'Columna 3', 'texto']]]],
  render(d){ const cols = ['c1', 'c2', 'c3'].filter(k => tx(d[k]));
    const celda = v => v === 'si' || v === 'sí' ? `<span class="b-si">${icono('check')}</span>` : v === 'no' ? '<span class="b-no">—</span>' : esc(v || '');
    return `${cabeceraB(d, true)}<div class="b-tabla-caja" data-aparece><table class="b-tabla"><thead><tr><th></th>${cols.map(k => `<th>${T(d[k])}</th>`).join('')}</tr></thead>
      <tbody>${(d.items || []).map(x => `<tr><th>${T(x.l)}</th>${cols.map((k, i) => `<td>${celda(String(x['v' + (i + 1)] || '').trim().toLowerCase() === 'sí' ? 'si' : String(x['v' + (i + 1)] || '').trim())}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`; }
});

registrarBloque('separador', { nombre: 'Separador', icono: 'menos', completo: true,
  campos: [['estilo', 'Estilo', 'select', [['dron', 'Dron del logo'], ['linea', 'Línea fina'], ['espacio', 'Solo espacio']]]],
  render(d){ return `<div class="b-separador ${d.estilo || 'dron'}">${d.estilo === 'linea' ? '<i></i>' : d.estilo === 'espacio' ? '' : `<i></i><svg viewBox="${DP.vbIcono}">${dpDefs('sep')}${dpDron('sep')}</svg><i></i>`}</div>`; }
});
