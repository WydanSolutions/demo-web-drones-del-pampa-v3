/* =====================================================================
   INSTAGRAM (versión 3): qué publicaciones se muestran en la página.
   Se agregan pegando el link de una publicación o reel, se ordenan y se
   les puede poner una foto de portada propia (carga más rápido que el
   Instagram embebido).
   24/11/2026: se SACÓ la opción «Conectar (automático)» (pedido de la
   usuaria: «que no tengan esa opción»).
   ===================================================================== */
function publicacionesIG(){ return (Datos.get().instagram || []).filter(p => p && (p.img || p.url)); }
const tipoIG = url => /\/reel\//.test(url || '') ? 'Reel' : /\/p\//.test(url || '') ? 'Publicación' : 'Perfil';

seccionEstudio({ id: 'instagram', nombre: 'Instagram', icono: 'instagram', grupo: 'Diseño',
  render(){
    const d = Datos.get(), ig = d.igConexion || {}, l = publicacionesIG();
    const usos = (d.paginas || []).reduce((s, p) => s + (p.bloques || []).filter(b => (b.tipo === 'instagram' || b.tipo === 'reel' || b.tipo === 'igpost' || (b.tipo === 'sis' && b.clave === 'instagram')) && !b.oculto).length, 0);
    return `<div class="ad-cab"><div><h2>Instagram</h2><p>Elegí qué publicaciones se ven en la página. Aparecen en ${usos} ${usos === 1 ? 'lugar' : 'lugares'} (la parte de Instagram del inicio y los bloques de Instagram).</p></div></div>
      <div class="ig-cuenta"><span class="ig-avatar">${iconoDP({ cls: 'ig-dp' })}</span><div><b>@${esc(ig.usuario || '')}</b><small>${l.length} publicaciones en la página</small></div>
        <a class="btn btn-borde btn-chico" href="${esc(d.config.instagram)}" target="_blank" rel="noopener">${icono('externo')} Abrir Instagram</a></div>
      <div class="ig-agregar"><b>${icono('mas')} Agregar una publicación o reel</b><p>En Instagram tocá los tres puntitos de la publicación → <b>Copiar enlace</b>, y pegalo acá.</p>
        <div class="ig-agregar-fila"><input id="ig-link" placeholder="https://www.instagram.com/reel/…"><button class="btn btn-verde btn-chico" onclick="igAgregar()">${icono('mas')} Agregar</button></div></div>
      <div class="ad-cab chica"><div><h3>${l.length} publicaciones · así se ven en la página</h3><p>La primera es la que se ve primero. Una foto de portada propia hace que cargue más rápido.</p></div></div>
      <div class="ig-lista">${l.map((p, i) => `<div class="ig-tarj">
        <div class="ig-tarj-img">${p.img ? `<img src="${esc(p.img)}" alt="">` : `<span>${icono('instagram')}<small>Sin portada</small></span>`}${p.video ? `<span class="ig-play">${icono('play')}</span>` : ''}<span class="chip gris">${tipoIG(p.url)}</span></div>
        <div class="ig-tarj-acc"><button title="Antes" onclick="igMover(${i},-1)">←</button><button title="Después" onclick="igMover(${i},1)">→</button>
          <button title="Elegir portada" onclick="igPortada(${i})">${icono('imagen')}</button><a title="Ver en Instagram" href="${esc(p.url)}" target="_blank" rel="noopener">${icono('externo')}</a>
          <button title="Quitar" class="rojo" onclick="igQuitar(${i})">${icono('basura')}</button></div></div>`).join('') || '<p class="ad-vacio">Todavía no hay publicaciones.</p>'}</div>`;
  } });

function igAgregar(){
  const inp = $('#ig-link'), u = inp.value.trim();
  if (!/instagram\.com\//.test(u)) { aviso('Pegá un link de Instagram (empieza con https://www.instagram.com/…).', 'error'); return; }
  const lista = Datos.get().instagram; if (lista.some(p => p.url === u)) { aviso('Esa publicación ya está.', 'error'); return; }
  lista.unshift({ img: '', url: u.split('?')[0], video: '' }); Datos.guardar(); adminIr('instagram'); aviso('Agregada. Si querés, elegile una foto de portada.');
}
function igMover(i, d){ const a = Datos.get().instagram, j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; Datos.guardar(); adminIr('instagram'); }
function igQuitar(i){ if (!confirm('¿Quitar esta publicación de la página? (En Instagram sigue estando.)')) return; Datos.get().instagram.splice(i, 1); Datos.guardar(); adminIr('instagram'); }
async function igPortada(i){ const r = await elegirArchivo({ tipo: 'imagen' }); if (!r) return; Datos.get().instagram[i].img = r; Datos.guardar(); adminIr('instagram'); }
