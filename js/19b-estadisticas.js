/* =====================================================================
   ESTADÍSTICAS (versión 3): visitas por página, toques en WhatsApp,
   productos y drones más vistos, de dónde llega la gente (Instagram,
   WhatsApp, Google, directo) y toques en el link de la bio.
   En la demo se cuentan en este navegador y vienen con 30 días de
   ejemplo para que se vea cómo queda. En la versión real se juntan las
   visitas de todos (sin datos personales).
   ===================================================================== */
const Estadisticas = (() => {
  const K = 'dp_web_v3_stats';
  let s = (() => { try { return JSON.parse(localStorage.getItem(K)); } catch (e) { return null; } })();
  const hoy = () => new Date().toISOString().slice(0, 10);
  const guardar = () => { try { localStorage.setItem(K, JSON.stringify(s)); } catch (e) {} };
  const dia = (f) => { f = f || hoy(); s.dias[f] = s.dias[f] || { v: {}, wa: 0, prod: {}, lk: {}, ori: {} }; return s.dias[f]; };
  const sumar = (o, k, n) => { o[k] = (o[k] || 0) + (n || 1); };

  // 30 días de ejemplo (para la demostración)
  if (!s || !s.dias) {
    s = { dias: {}, ejemplo: true }; let semilla = 7; const azar = () => { semilla = (semilla * 9301 + 49297) % 233280; return semilla / 233280; };
    const pags = [['inicio', 60], ['tienda', 28], ['drones', 22], ['drones/t100', 14], ['cursos', 9], ['servicio', 11], ['preventa-t100', 12], ['novedades', 6], ['contacto', 5], ['nosotros', 4], ['dinacia', 3], ['links', 16]];
    const prods = ['dron:t100', 'prod:kit-precision', 'dron:t50', 'prod:t100-bat', 'dron:t70p', 'prod:d14000', 'prod:kit-t100-365', 'prod:t50-bat'];
    for (let i = 29; i >= 0; i--) {
      const f = new Date(Date.now() - i * 864e5), k = f.toISOString().slice(0, 10), finde = [0, 6].includes(f.getDay()) ? .6 : 1, crece = .7 + (29 - i) / 60;
      const d = dia(k);
      pags.forEach(([p, n]) => { const c = Math.round(n * finde * crece * (.6 + azar() * .8)); if (c) d.v[p] = c; });
      d.wa = Math.round(9 * finde * crece * (.5 + azar())); prods.forEach((p, j) => { const c = Math.round((8 - j) * crece * azar()); if (c) d.prod[p] = c; });
      ['lk-wa', 'lk-t100', 'lk-tienda', 'lk-serv', 'lk-cursos', 'lk-mapa'].forEach((l, j) => { const c = Math.round((6 - j) * finde * azar() * 1.4); if (c) d.lk[l] = c; });
      d.ori = { instagram: Math.round(38 * finde * crece * (.7 + azar() * .5)), whatsapp: Math.round(14 * finde * (.6 + azar() * .6)), google: Math.round(22 * crece * (.6 + azar() * .6)), directo: Math.round(18 * (.6 + azar() * .6)) };
    }
    guardar();
  }

  const contar = () => !EN_EDITOR && Datos.modo() !== 'borrador' && !$('#admin.abierto');
  function empezar(){
    if (!contar()) return;
    try { if (!sessionStorage.getItem('dp_origen')) {
      const r = document.referrer, u = new URLSearchParams(location.search).get('utm_source') || '';
      const o = /instagram/i.test(r + u) ? 'instagram' : /whatsapp|wa\.me/i.test(r + u) ? 'whatsapp' : /google|bing/i.test(r) ? 'google' : 'directo';
      sessionStorage.setItem('dp_origen', o); sumar(dia().ori, o); guardar(); } } catch (e) {}
    document.addEventListener('click', e => { const a = e.target.closest('a[href*="wa.me"]'); if (a && contar()) { dia().wa++; guardar(); } }, true);
  }
  function visita(r){
    if (!contar()) return;
    const k = r.seccion + (r.id ? '/' + r.id : ''); sumar(dia().v, k);
    if ((r.seccion === 'tienda' || r.seccion === 'drones') && r.id) sumar(dia().prod, (r.seccion === 'drones' ? 'dron:' : 'prod:') + r.id);
    guardar();
  }
  function clicLink(id){ if (!contar() && !location.hash.includes('links')) return; sumar(dia().lk, id); guardar(); }
  function resumen(n){
    const dias = Object.keys(s.dias).sort().slice(-n), R = { visitas: 0, wa: 0, porDia: [], pags: {}, prods: {}, ori: {}, lk: {} };
    for (const k of dias) { const d = s.dias[k], v = Object.values(d.v).reduce((a, b) => a + b, 0);
      R.visitas += v; R.wa += d.wa || 0; R.porDia.push([k, v, d.wa || 0]);
      for (const [p, c] of Object.entries(d.v)) sumar(R.pags, p, c); for (const [p, c] of Object.entries(d.prod || {})) sumar(R.prods, p, c);
      for (const [p, c] of Object.entries(d.ori || {})) sumar(R.ori, p, c); for (const [p, c] of Object.entries(d.lk || {})) sumar(R.lk, p, c); }
    return R;
  }
  return { empezar, visita, clicLink, resumen, clicsLinks: () => resumen(30).lk, esEjemplo: () => !!s.ejemplo,
    borrar(){ s = { dias: {}, ejemplo: false }; guardar(); } };
})();

/* ---------- En el Estudio ---------- */
let _stDias = 30;
seccionEstudio({ id: 'estadisticas', nombre: 'Estadísticas', icono: 'grafico', grupo: 'Clientes',
  render(){
    const R = Estadisticas.resumen(_stDias), ant = Estadisticas.resumen(_stDias * 2);
    const antV = ant.visitas - R.visitas, varV = antV ? Math.round((R.visitas - antV) / antV * 100) : 0;
    const max = Math.max(1, ...R.porDia.map(x => x[1])), d = Datos.get();
    const nombrePag = k => { const [s1, id] = k.split('/'); const p = paginaDe(s1); if (id && s1 === 'drones') return 'DJI ' + ((dronDe(id) || {}).nombre || id);
      if (id && s1 === 'novedades') return tx(((d.novedades || []).find(n => n.id === id) || {}).titulo) || id; return p ? tituloPagina(p) : s1; };
    const nombreProd = r => { const i = itemDe(r); return i ? i.nombre : r; };
    const top = (o, nom, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n || 6).map(([k, v], i, a) => `<div class="st-fila"><span>${esc(nom(k))}</span><i style="--p:${Math.round(v / a[0][1] * 100)}%"></i><b>${v.toLocaleString('es-UY')}</b></div>`).join('') || '<p class="st-vacio">Sin datos todavía.</p>';
    const totOri = Object.values(R.ori).reduce((a, b) => a + b, 0) || 1;
    const pedidos = (d.pedidos || []).length, ins = (d.inscripciones || []).length;
    return `<div class="ad-cab"><div><h2>Estadísticas</h2><p>Cuánta gente entra, qué mira y de dónde viene.</p></div>
        <div class="opciones">${[7, 30].map(n => `<label class="opcion"><input type="radio" name="st-d" ${_stDias === n ? 'checked' : ''} onchange="_stDias=${n};adminIr('estadisticas')"><span>Últimos ${n} días</span></label>`).join('')}</div></div>
      ${Estadisticas.esEjemplo() ? `<p class="ad-demo st-aviso">⚠ Demostración: incluye ${_stDias} días de datos de ejemplo para que veas cómo queda. Las visitas que hagas en la página también se suman.</p>` : ''}
      <div class="es-kpis">${[['ojo', R.visitas.toLocaleString('es-UY'), 'visitas', varV ? (varV > 0 ? '▲ ' : '▼ ') + Math.abs(varV) + '% contra el período anterior' : ''],
        ['wa', R.wa.toLocaleString('es-UY'), 'toques en WhatsApp', R.visitas ? Math.round(R.wa / R.visitas * 100) + '% de las visitas' : ''],
        ['carrito', pedidos, 'pedidos por la tienda', 'en la Bandeja'], ['calendario', ins, 'inscripciones a cursos', 'en la Bandeja']]
        .map(([ic, n, t2, s]) => `<div class="es-kpi">${icono(ic)}<b>${n}</b><span>${t2}</span>${s ? `<small>${s}</small>` : ''}</div>`).join('')}</div>
      <div class="st-caja"><b>Visitas por día</b><div class="st-barras">${R.porDia.map(([f, v, w]) => `<div class="st-barra" title="${f.split('-').reverse().join('/')}: ${v} visitas, ${w} WhatsApp"><i style="--h:${Math.round(v / max * 100)}%"></i><em style="--h:${Math.round(w / max * 100)}%"></em><small>${+f.slice(8)}</small></div>`).join('')}</div>
        <div class="st-leyenda"><span><i></i>Visitas</span><span><i class="v"></i>WhatsApp</span></div></div>
      <div class="st-grilla"><div class="st-caja"><b>Páginas más vistas</b>${top(R.pags, nombrePag, 8)}</div>
        <div class="st-caja"><b>Productos y drones más vistos</b>${top(R.prods, nombreProd, 8)}</div>
        <div class="st-caja"><b>De dónde llegan</b>${[['instagram', 'Instagram', 'instagram'], ['whatsapp', 'WhatsApp', 'wa'], ['google', 'Google', 'buscar'], ['directo', 'Directo o guardado', 'mundo']]
          .map(([k, n, ic]) => `<div class="st-ori">${icono(ic)}<span>${n}</span><i style="--p:${Math.round((R.ori[k] || 0) / totOri * 100)}%"></i><b>${Math.round((R.ori[k] || 0) / totOri * 100)}%</b></div>`).join('')}
          <p class="st-nota">Consejo: compartí los links con <b>?utm_source=instagram</b> al final para que se cuenten bien.</p></div>
        <div class="st-caja"><b>Link en la bio · lo más tocado</b>${top(R.lk, id => tx(((d.links || {}).items || []).find(x => x.id === id)?.texto) || id, 6)}</div></div>`;
  } });
