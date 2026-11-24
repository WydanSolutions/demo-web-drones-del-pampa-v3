/* =====================================================================
   INSTAGRAM (versión 3): qué publicaciones se muestran en la página.
   Tres niveles (de más simple a más completo):
   1. Pegar el link de una publicación o reel (anda desde el primer día).
   2. Foto de portada propia para la grilla (carga más rápido que el
      Instagram embebido).
   3. AUTOMÁTICO: la página trae sola las últimas publicaciones. En la
      versión real pide que la cuenta sea profesional y conectar un
      permiso de Meta que se renueva solo. En la demo se simula.
   ===================================================================== */
function publicacionesIG(){ return (Datos.get().instagram || []).filter(p => p && (p.img || p.url)); }
const tipoIG = url => /\/reel\//.test(url || '') ? 'Reel' : /\/p\//.test(url || '') ? 'Publicación' : 'Perfil';

seccionEstudio({ id: 'instagram', nombre: 'Instagram', icono: 'instagram', grupo: 'Diseño',
  render(){
    const d = Datos.get(), ig = d.igConexion || {}, l = publicacionesIG();
    const usos = (d.paginas || []).reduce((s, p) => s + (p.bloques || []).filter(b => (b.tipo === 'instagram' || b.tipo === 'reel' || (b.tipo === 'sis' && b.clave === 'instagram')) && !b.oculto).length, 0);
    return `<div class="ad-cab"><div><h2>Instagram</h2><p>Elegí qué publicaciones se ven en la página. Aparecen en ${usos} ${usos === 1 ? 'lugar' : 'lugares'} (la parte de Instagram del inicio y los bloques de Instagram).</p></div></div>
      <div class="ig-cuenta"><span class="ig-avatar">${iconoDP({ cls: 'ig-dp' })}</span><div><b>@${esc(ig.usuario || '')}</b>
        <small>${ig.conectado ? `Conectada · se actualiza sola · última vez ${haceCuanto(ig.sync || ig.desde)}` : 'Sin conectar · las publicaciones se eligen a mano'}</small></div>
        <span class="chip ${ig.conectado ? '' : 'gris'}">${ig.conectado ? 'Automático' : 'A mano'}</span>
        ${ig.conectado ? `<button class="btn btn-borde btn-chico" onclick="igSincronizar()">${icono('historial')} Actualizar ahora</button><button class="btn btn-borde btn-chico" onclick="igDesconectar()">Desconectar</button>`
          : `<button class="btn btn-azul btn-chico" onclick="igConectar()">${icono('rayo')} Conectar (automático)</button>`}</div>
      <div class="ig-agregar"><b>${icono('mas')} Agregar una publicación o reel</b><p>En Instagram tocá los tres puntitos de la publicación → <b>Copiar enlace</b>, y pegalo acá.</p>
        <div class="ig-agregar-fila"><input id="ig-link" placeholder="https://www.instagram.com/reel/…"><button class="btn btn-verde btn-chico" onclick="igAgregar()">${icono('mas')} Agregar</button></div></div>
      <div class="ad-cab chica"><div><h3>${l.length} publicaciones · así se ven en la página</h3><p>La primera es la que se ve primero. Una foto de portada propia hace que cargue más rápido.</p></div></div>
      <div class="ig-lista">${l.map((p, i) => `<div class="ig-tarj">
        <div class="ig-tarj-img">${p.img ? `<img src="${esc(p.img)}" alt="">` : `<span>${icono('instagram')}<small>Sin portada</small></span>`}${p.video ? `<span class="ig-play">${icono('play')}</span>` : ''}<span class="chip gris">${tipoIG(p.url)}</span></div>
        <div class="ig-tarj-acc"><button title="Antes" onclick="igMover(${i},-1)">←</button><button title="Después" onclick="igMover(${i},1)">→</button>
          <button title="Elegir portada" onclick="igPortada(${i})">${icono('imagen')}</button><a title="Ver en Instagram" href="${esc(p.url)}" target="_blank" rel="noopener">${icono('externo')}</a>
          <button title="Quitar" class="rojo" onclick="igQuitar(${i})">${icono('basura')}</button></div></div>`).join('') || '<p class="ad-vacio">Todavía no hay publicaciones.</p>'}</div>
      <div class="ad-nota"><b>¿Cómo funciona el automático en la versión real?</b><ol><li>La cuenta de Instagram tiene que ser <b>profesional</b> (empresa o creador; es gratis y se cambia en la app).</li>
        <li>Wydan conecta la página con un permiso de Meta que <b>se renueva solo</b>.</li><li>Cada pocas horas la página trae las últimas publicaciones: no hay que hacer nada más.</li></ol>
        <p class="ad-demo">⚠ En la demostración la conexión es simulada: usa estas mismas publicaciones.</p></div>`;
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
function igConectar(){
  const ig = Datos.get().igConexion;
  abrirModal(`<div class="es-modal"><h3>${icono('instagram')} Conectar Instagram</h3><p>Con la conexión automática, la página muestra sola las últimas publicaciones de <b>@${esc(ig.usuario)}</b>.</p>
    <ol class="ig-pasos"><li><b>Cuenta profesional</b><span>En Instagram: Configuración → Tipo de cuenta → Cambiar a cuenta profesional.</span></li>
      <li><b>Iniciar sesión con Instagram</b><span>En la versión real se abre la ventana de Instagram para dar permiso (Claude nunca ve la contraseña).</span></li>
      <li><b>Listo</b><span>Las publicaciones se actualizan solas cada pocas horas.</span></li></ol>
    <p class="ad-demo">⚠ Demostración: no se conecta de verdad.</p>
    <div class="es-modal-pie"><button class="btn btn-borde btn-chico" onclick="cerrarModal()">Cancelar</button><button class="btn btn-azul btn-chico" id="ig-sim">${icono('rayo')} Simular la conexión</button></div></div>`, { cls: 'chico' });
  $('#ig-sim').onclick = () => { Object.assign(ig, { conectado: true, modo: 'auto', desde: new Date().toISOString(), sync: new Date().toISOString() }); Datos.guardar(); cerrarModal(); adminIr('instagram'); aviso('Instagram conectado (simulado).'); };
}
function igSincronizar(){ const ig = Datos.get().igConexion; ig.sync = new Date().toISOString(); Datos.guardar(); adminIr('instagram'); aviso('Publicaciones actualizadas.'); }
function igDesconectar(){ if (!confirm('¿Desconectar Instagram? Las publicaciones quedan como están y se eligen a mano.')) return; Object.assign(Datos.get().igConexion, { conectado: false, modo: 'propias' }); Datos.guardar(); adminIr('instagram'); }
