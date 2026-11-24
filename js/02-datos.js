/* =====================================================================
   DATOS: guarda todo lo editable en el navegador (demo, sin Firebase).
   En la versión real esto mismo se guarda en la nube y lo ve todo el mundo.

   Versión 3 (24/11/2026): BORRADOR y PUBLICADO.
   - La gente ve lo PUBLICADO.
   - El Estudio (el panel) trabaja sobre un BORRADOR: se puede probar todo
     tranquilo y recién al tocar «Publicar» lo ve la gente.
   - Cada publicación guarda una VERSIÓN (se puede volver a una anterior).
   - Deshacer / rehacer cualquier cambio del borrador.
   - Lo que llega de los visitantes (pedidos, turnos, inscripciones,
     DINACIA, mensajes) NO es parte del borrador: se guarda siempre en lo
     publicado, así publicar nunca borra un pedido.

   - Datos.get()            → el contenido actual (publicado o borrador)
   - Datos.guardar()        → guarda los cambios
   - Datos.usarBorrador()   → el Estudio pasa a trabajar sobre el borrador
   - Datos.usarPublicado()  → vuelve a lo que ve la gente
   - Datos.publicar(nota)   → el borrador pasa a ser lo publicado (+ versión)
   - Datos.deshacer() / rehacer()
   - Datos.exportar() / importar(texto) / restaurar()
   ===================================================================== */
const VERSION_CONTENIDO = 7;   // 7: versión 3 · páginas por bloques, novedades, links, instagram (24/11/2026)
const CLAVE_DATOS = 'dronesdelpampa_web_v3';   // versión 3 (24/11/2026): su propia memoria, no se mezcla con la base ni con la v2
const CLAVE_BORRADOR = CLAVE_DATOS + '_borrador';
const CLAVE_VERSIONES = CLAVE_DATOS + '_versiones';
// Lo que mandan los visitantes: vive siempre en lo publicado (no se «despublica»)
const CAMPOS_BANDEJA = ['pedidos', 'inscripciones', 'services', 'mensajes', 'dinacia'];
const MAX_VERSIONES = 15, MAX_HISTORIAL = 80;

const Datos = (() => {
  let d = null, modo = 'publicado';
  let antes = [], despues = [], ultimo = '';          // deshacer / rehacer (solo el borrador)
  const copia = o => JSON.parse(JSON.stringify(o));
  const leer = k => { try { const t = localStorage.getItem(k); return t ? JSON.parse(t) : null; } catch (e) { return null; } };
  const escribir = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
  const valido = g => g && g._v === VERSION_CONTENIDO && Array.isArray(g.drones);
  // Contenido sin lo que mandan los visitantes (para comparar, versiones y deshacer)
  const contenido = g => { const c = {}; for (const k of Object.keys(g)) if (!CAMPOS_BANDEJA.includes(k)) c[k] = g[k]; return c; };
  const sello = g => JSON.stringify(contenido(g));

  function publicadoGuardado(){
    const g = leer(CLAVE_DATOS);
    if (valido(g)) return completar(g);
    const n = copia(CONTENIDO_INICIAL); n._v = VERSION_CONTENIDO;
    escribir(CLAVE_DATOS, n);
    return n;
  }

  // La vista previa del Estudio abre la página con ?borrador=1
  const enVistaPrevia = () => /[?&]borrador=1\b/.test(location.search);

  function cargar(){
    modo = 'publicado';
    d = publicadoGuardado();
    if (enVistaPrevia()) { modo = 'borrador'; d = borradorConBandeja(d); }
    return d;
  }

  function borradorConBandeja(pub){
    const b = leer(CLAVE_BORRADOR);
    const base = valido(b) ? completar(b) : copia(pub);
    for (const k of CAMPOS_BANDEJA) base[k] = pub[k] || [];
    return base;
  }

  // Si falta alguna parte (por ejemplo, un texto nuevo), se completa con el ejemplo
  function completar(g){
    const base = copia(CONTENIDO_INICIAL);
    for (const k of Object.keys(base)) if (g[k] === undefined) g[k] = base[k];
    for (const k of Object.keys(base.textos)) if (!g.textos[k]) g.textos[k] = base.textos[k];
    for (const k of Object.keys(base.config)) if (g.config[k] === undefined) g.config[k] = base.config[k];
    // Páginas del sistema que falten (si en una versión nueva se suma una)
    if (Array.isArray(g.paginas)) for (const p of base.paginas) if (p.sistema && !g.paginas.some(x => x.id === p.id)) g.paginas.push(p);
    return g;
  }

  function guardar(){
    let ok;
    if (modo === 'borrador') {
      const s = sello(d);
      if (ultimo && s !== ultimo) { antes.push(ultimo); if (antes.length > MAX_HISTORIAL) antes.shift(); despues = []; }
      ultimo = s;
      ok = escribir(CLAVE_BORRADOR, contenido(d));
      // lo de la bandeja va directo a lo publicado
      const pub = leer(CLAVE_DATOS) || {};
      for (const k of CAMPOS_BANDEJA) pub[k] = d[k];
      escribir(CLAVE_DATOS, pub);
      avisarCambio();
    } else ok = escribir(CLAVE_DATOS, d);
    if (!ok && typeof aviso === 'function') aviso('No hay más lugar en este navegador. Subí las fotos al Drive (Archivos) en vez de pegarlas.', 'error');
    return ok;
  }

  // Avisa a la vista previa (y al resto del Estudio) que algo cambió
  const oyentes = [];
  function avisarCambio(){ oyentes.forEach(f => { try { f(); } catch (e) {} }); }

  function usarBorrador(){
    const pub = publicadoGuardado();
    d = borradorConBandeja(pub); modo = 'borrador';
    ultimo = sello(d); antes = []; despues = [];
    return d;
  }
  function usarPublicado(){ d = publicadoGuardado(); modo = 'publicado'; return d; }

  // ¿Hay cambios en el borrador que la gente todavía no ve?
  function hayCambios(){
    const b = leer(CLAVE_BORRADOR); if (!valido(b)) return false;
    return sello(b) !== sello(publicadoGuardado());
  }
  function cambiosResumen(){
    const b = leer(CLAVE_BORRADOR), p = publicadoGuardado(); if (!valido(b)) return [];
    const nombres = { paginas: 'Páginas', novedades: 'Novedades', links: 'Link en la bio', instagram: 'Instagram', drones: 'Drones', productos: 'Productos',
      categorias: 'Categorías', cursos: 'Cursos', promos: 'Promociones', textos: 'Textos', config: 'Contacto y datos', claudio: 'Claudio',
      valores: 'Lo que nos destaca', equipo: 'El equipo', faq: 'Preguntas', servicio: 'Pasos del servicio', tiposService: 'Tipos de service', igConexion: 'Instagram' };
    return Object.keys(contenido(b)).filter(k => k !== '_v' && JSON.stringify(b[k]) !== JSON.stringify(p[k])).map(k => nombres[k] || k);
  }

  function publicar(nota){
    const b = contenido(d);
    const pub = publicadoGuardado();
    const nuevo = { ...copia(b) }; for (const k of CAMPOS_BANDEJA) nuevo[k] = pub[k] || [];
    nuevo._v = VERSION_CONTENIDO;
    if (!escribir(CLAVE_DATOS, nuevo)) return false;
    escribir(CLAVE_BORRADOR, b);
    const vs = versiones();
    vs.unshift({ id: nuevoId('ver'), fecha: new Date().toISOString(), nota: nota || '', datos: copia(b) });
    while (vs.length > MAX_VERSIONES) vs.pop();
    if (!escribir(CLAVE_VERSIONES, vs)) { vs.splice(5); escribir(CLAVE_VERSIONES, vs); }
    avisarCambio();
    return true;
  }
  const versiones = () => leer(CLAVE_VERSIONES) || [];
  // Volver a una versión: queda en el BORRADOR (hay que publicar para que la vea la gente)
  function volverAVersion(id){
    const v = versiones().find(x => x.id === id); if (!v) return false;
    const bandeja = {}; for (const k of CAMPOS_BANDEJA) bandeja[k] = d[k];
    for (const k of Object.keys(d)) if (!CAMPOS_BANDEJA.includes(k)) delete d[k];
    Object.assign(d, completar({ ...copia(v.datos), ...bandeja, _v: VERSION_CONTENIDO }));
    return guardar();
  }
  function descartarBorrador(){
    try { localStorage.removeItem(CLAVE_BORRADOR); } catch (e) {}
    usarBorrador(); avisarCambio();
  }

  function reemplazarContenido(s){
    const c = JSON.parse(s);
    for (const k of Object.keys(d)) if (!CAMPOS_BANDEJA.includes(k)) delete d[k];
    Object.assign(d, c);
    ultimo = s;
    escribir(CLAVE_BORRADOR, contenido(d));
    avisarCambio();
  }
  function deshacer(){ if (!antes.length) return false; despues.push(ultimo); reemplazarContenido(antes.pop()); return true; }
  function rehacer(){ if (!despues.length) return false; antes.push(ultimo); reemplazarContenido(despues.pop()); return true; }

  function exportar(){
    const blob = new Blob([JSON.stringify(d, null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    const hoy = new Date().toISOString().slice(0, 10);
    a.href = URL.createObjectURL(blob); a.download = 'drones-del-pampa-pagina-' + hoy + '.json';
    document.body.appendChild(a); a.click(); a.remove();
  }

  function importar(texto){
    const g = JSON.parse(texto);
    if (!g || !Array.isArray(g.drones) || !g.textos) throw new Error('El archivo no es un respaldo de la página.');
    g._v = VERSION_CONTENIDO;
    const bandeja = {}; for (const k of CAMPOS_BANDEJA) bandeja[k] = d[k];
    for (const k of Object.keys(d)) delete d[k];
    Object.assign(d, completar(g));
    if (modo === 'borrador') Object.assign(d, bandeja);
    guardar();
  }

  function restaurar(){
    const bandeja = {}; for (const k of CAMPOS_BANDEJA) bandeja[k] = d[k];
    for (const k of Object.keys(d)) delete d[k];
    Object.assign(d, copia(CONTENIDO_INICIAL), { _v: VERSION_CONTENIDO });
    if (modo === 'borrador') Object.assign(d, bandeja);
    guardar();
  }

  const nuevoId = (pre) => (pre || 'id') + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

  return { cargar, get: () => d, guardar, exportar, importar, restaurar, nuevoId,
    usarBorrador, usarPublicado, publicar, hayCambios, cambiosResumen, versiones, volverAVersion, descartarBorrador,
    deshacer, rehacer, puedeDeshacer: () => antes.length > 0, puedeRehacer: () => despues.length > 0,
    modo: () => modo, enVistaPrevia, alCambiar: f => oyentes.push(f) };
})();
