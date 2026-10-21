/* ======================================================================
   Simuladores de práctica de las claves 1, 5 y 7.
   SIMS[n](elemento) dibuja el simulador de la clave n.
   ====================================================================== */
const SIMS = {};

/* ---- Clave 1: encuentra los 8 problemas del reporte ---- */
SIMS[1] = function(el){
  const PROB = [
   ["Título dentro del área de datos","La fila 1 combina A:F. Al seleccionar «toda la región» Excel la incluye y los encabezados quedan en la fila equivocada. Los títulos van fuera de la base o en el nombre de la hoja."],
   ["Encabezado en dos filas","«Ventas por trimestre» está combinado sobre T1–T4. Una base necesita encabezados en una sola fila, cada uno con un nombre único."],
   ["Ciudad en celda combinada","Solo la primera fila del bloque tiene «Bogotá». Al filtrar o cruzar, las demás filas quedan sin ciudad."],
   ["Subtotales intercalados","Las filas «Subtotal» son resultados, no registros. Una suma o una tabla dinámica las cuenta dos veces."],
   ["Fila en blanco","Corta el rango: Ctrl+T, los filtros y Ctrl+Flecha se detienen ahí y dejan fuera a Medellín."],
   ["Número escrito como texto","«4,2 M» es texto. SUMA lo ignora sin avisar, así que el total cambia según cómo se escribió cada celda (clave 2)."],
   ["Variable en los encabezados","T1, T2, T3 y T4 son valores de la variable «trimestre». Deben estar en una columna, no repartidos en cuatro."],
   ["Nota dentro de los datos","Un comentario en una fila de datos se lee como registro. Usa un comentario de celda o una hoja de notas."],
  ];
  const val = (ciudad, cat, q)=>{ let s=0; const ci=DM.ciudad.indexOf(ciudad), ca=DM.categoria.indexOf(cat), y=anioIdx(2025);
    for(let i=0;i<NL;i++){ if(C.ciudad[i]===ci&&C.categoria[i]===ca&&C.anio[i]===y&&C.estado[i]!==2&&Math.floor(C.mes[i]/3)===q) s+=C.subtotal[i] } return s };
  const cats=["Papelería","Tecnología","Mobiliario"];
  const block=(ciudad,txtRow)=>{ const rows=cats.map(c=>[0,1,2,3].map(q=>val(ciudad,c,q))); const tot=[0,1,2,3].map(q=>rows.reduce((a,r)=>a+r[q],0)); return {rows,tot,txtRow} };
  const bog=block("Bogotá",2), med=block("Medellín",-1);
  const cellNum=(v,p)=> p!=null ? `<td class="num" data-p="${p}">${(v/1e6).toFixed(1).replace(".",",")} M</td>` : `<td class="num">${nf.format(v)}</td>`;
  let r=0; const rn=()=>`<td class="rn">${++r}</td>`;
  const rowsHtml = (b,ciudad)=>b.rows.map((row,i)=>`<tr>${rn()}${i===0?`<td rowspan="3" data-p="2" style="vertical-align:middle">${ciudad}</td>`:""}<td>${cats[i]}</td>${row.map((v,q)=> (b.txtRow===i&&q===1)?cellNum(v,5):cellNum(v)).join("")}</tr>`).join("")
     + `<tr>${rn()}<td colspan="2" class="bold" data-p="3">Subtotal ${ciudad}</td>${b.tot.map(v=>`<td class="num bold" data-p="3">${nf.format(v)}</td>`).join("")}</tr>`;
  el.innerHTML = `<div class="stack">
    <p class="read">Este es un fragmento del reporte que llega a tu correo, con cifras reales de 2025 del conjunto de datos. Tiene <b>8 problemas</b> que impiden analizarlo. Haz clic en las celdas donde los veas.</p>
    <div class="sheetwrap"><table class="sheet">
      <thead><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th></tr></thead>
      <tbody>
      <tr>${rn()}<td class="tt" colspan="6" data-p="0">INFORME DE VENTAS 2025 – DISTRIBUIDORA ANDINA (pesos)</td></tr>
      <tr>${rn()}<td class="hd" rowspan="2" data-p="1">Ciudad</td><td class="hd" rowspan="2" data-p="1">Línea</td><td class="hd" colspan="4" data-p="1">Ventas por trimestre</td></tr>
      <tr>${rn()}${["T1","T2","T3","T4"].map(t=>`<td class="hd" data-p="6">${t}</td>`).join("")}</tr>
      ${rowsHtml(bog,"Bogotá")}
      <tr>${rn()}<td colspan="6" data-p="4">&nbsp;</td></tr>
      ${rowsHtml(med,"Medellín")}
      <tr>${rn()}<td colspan="6" class="note" data-p="7">Nota: T3 de Medellín incluye un ajuste manual pendiente de validar.</td></tr>
      </tbody></table></div>
    <div class="row"><span data-cnt class="muted">0 de 8 encontrados</span><button class="btn small" data-all>Mostrar todos</button><button class="btn small" data-tidy aria-pressed="false">Ver versión ordenada</button></div>
    <ol class="plist" data-pl></ol>
    <div data-tidyout hidden></div></div>`;
  const found=new Set();
  const paint=()=>{
    $("[data-pl]",el).innerHTML = PROB.map((p,i)=> found.has(i)?`<li><b>${p[0]}.</b> ${p[1]}</li>`:`<li class="locked">Problema por encontrar</li>`).join("");
    $("[data-cnt]",el).textContent = `${found.size} de 8 encontrados`;
    el.querySelectorAll("td[data-p]").forEach(td=>td.classList.toggle("found", found.has(+td.dataset.p)));
  };
  el.querySelectorAll("td[data-p]").forEach(td=>td.onclick=()=>{ const had=found.has(+td.dataset.p); found.add(+td.dataset.p); paint(); if(!had) toast(PROB[+td.dataset.p][0]) });
  $("[data-all]",el).onclick=()=>{ PROB.forEach((_,i)=>found.add(i)); paint() };
  $("[data-tidy]",el).onclick=function(){ const on=this.getAttribute("aria-pressed")!=="true"; this.setAttribute("aria-pressed",on); const o=$("[data-tidyout]",el); o.hidden=!on;
    if(on){ const rows=[]; [["Bogotá",bog],["Medellín",med]].forEach(([c,b])=>b.rows.forEach((row,i)=>row.forEach((v,q)=>rows.push([c,cats[i],"T"+(q+1),v]))));
      o.innerHTML=`<p class="read" style="margin-bottom:8px">Los mismos datos, ordenados: <b>${rows.length} filas × 4 columnas</b>, sin subtotales, sin combinadas, con el trimestre como variable. Así quedan listos para Ctrl+T y una tabla dinámica.</p>
      <div class="sheetwrap" style="max-height:280px; overflow:auto"><table class="sheet"><thead><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead><tbody>
      <tr><td class="rn">1</td><td class="hd">ciudad</td><td class="hd">linea</td><td class="hd">trimestre</td><td class="hd">subtotal</td></tr>
      ${rows.map((x,i)=>`<tr><td class="rn">${i+2}</td><td>${x[0]}</td><td>${x[1]}</td><td>${x[2]}</td><td class="num">${nf.format(x[3])}</td></tr>`).join("")}</tbody></table></div>` }
  };
  paint();
};

/* ---- Clave 5: laboratorio de búsqueda ---- */
SIMS[5] = function(el){
  // NIT ficticio, solo para el ejercicio de «insertar columna»
  const maestro = D.clientes.slice(0,8).map((c,i)=>({id:c[0], rs:c[1], seg:c[2], ciu:c[3], nit:`9${String(10234567 + i*482713).slice(0,8)}-${(i*7+3)%10}`}));
  const NB=" ";
  const erp = [
    {f:"FV-004120", k:"C-0003", d:"Llave limpia"},
    {f:"FV-004131", k:"C-0005 ", d:"Espacio al final"},
    {f:"FV-004138", k:"c-0002", d:"Minúsculas"},
    {f:"FV-004146", k:" C-0007", d:"Espacio al inicio"},
    {f:"FV-004152", k:"C-9137", d:"No existe en el maestro"},
    {f:"FV-004159", k:"C-0004"+NB, d:"Espacio de no separación (carácter 160)"},
  ];
  let S = {fn:"BUSCARX", motor:"excel", limpia:0, nit:false, sel:1};
  const show = k => esc(k).replace(/^ +| +$/g, m=>`<span class="sp">${"·".repeat(m.length)}</span>`).replace(/ /g,`<span class="sp">°</span>`);
  const clean = k => {
    if(S.motor==="excel"){
      if(S.limpia>=2) k=k.replace(/ /g," ");
      if(S.limpia>=1) k=k.replace(/ +/g," ").replace(/^ | $/g,"");   // ESPACIOS: solo el espacio normal (código 32)
      return k;
    }
    if(S.limpia>=1) k=k.trim();            // Python .strip() también quita el carácter 160
    if(S.limpia>=2) k=k.toUpperCase();
    return k;
  };
  const find = k => S.motor==="excel" ? maestro.find(m=>m.id.toUpperCase()===k.toUpperCase()) : maestro.find(m=>m.id===k);
  const cols = ()=> S.nit ? ["id_cliente","nit","razon_social","segmento","ciudad"] : ["id_cliente","razon_social","segmento","ciudad"];
  const result = r => {
    const m = find(clean(r.k));
    if(S.motor==="pandas") return m ? {ok:true, v:m.rs} : {ok:false, v:"NaN (left_only)"};
    if(!m) return {ok:false, v: S.fn==="BUSCARX" ? "No encontrado" : "#N/D"};
    if(S.fn==="BUSCARV"){ const c=cols()[1]; const v = c==="nit"?m.nit:m.rs; return {ok:true, v, wrong:c==="nit"} }
    return {ok:true, v:m.rs};
  };
  const llave = ()=> S.motor==="excel"
     ? (S.limpia===0?"[@[Cod Cliente]]": S.limpia===1?"ESPACIOS([@[Cod Cliente]])":"ESPACIOS(SUSTITUIR([@[Cod Cliente]];CARACTER(160);\" \"))")
     : (S.limpia===0?"erp['Cod Cliente']": S.limpia===1?"erp['Cod Cliente'].str.strip()":"erp['Cod Cliente'].str.strip().str.upper()");
  const formula = ()=>{
    const k=llave();
    if(S.motor==="pandas") return `erp['llave'] = ${k}  →  erp.merge(clientes, left_on='llave', right_on='id_cliente', how='left', indicator=True)`;
    if(S.fn==="BUSCARX") return `=BUSCARX(${k};tClientes[id_cliente];tClientes[razon_social];"No encontrado")`;
    if(S.fn==="BUSCARV") return `=BUSCARV(${k};tClientes;2;FALSO)`;
    return `=INDICE(tClientes[razon_social];COINCIDIR(${k};tClientes[id_cliente];0))`;
  };
  const why = (r,res)=>{
    const ck=clean(r.k);
    if(res.wrong) return `Encontró al cliente, pero el índice 2 ahora apunta a la columna <b>nit</b>. BUSCARV no avisa: el dato está mal y parece correcto.`;
    if(res.ok){
      if(r.k!==ck) return `Cruza gracias a la limpieza: la llave quedó como «${esc(ck)}».`;
      if(r.k!==r.k.toUpperCase()) return `Cruza: Excel no distingue mayúsculas, así que «c-0002» encuentra a «C-0002».`;
      return `Llave idéntica en ambas tablas: cruce directo.`;
    }
    if(r.k==="C-9137") return `El código no existe en el maestro. Ninguna limpieza lo arregla: es un cliente creado en el ERP y no en el maestro. Repórtalo a quien administra los datos maestros.`;
    if(ck.includes(" ")) return S.motor==="excel"
      ? (S.limpia===1 ? `ESPACIOS no elimina el carácter 160 (°): solo quita el espacio normal. Elige la limpieza con SUSTITUIR.` : `La llave termina en un carácter 160 (°), un espacio que no es espacio. Aparece al copiar desde la web o un ERP.`)
      : `Sin limpieza la llave conserva el carácter 160 (°). En Python, .str.strip() sí lo elimina.`;
    if(S.motor==="pandas" && ck!==ck.toUpperCase()) return `pandas distingue mayúsculas: «${esc(ck)}» no es igual a «${esc(ck.toUpperCase())}». Normaliza con .str.upper().`;
    return `La llave tiene espacios que en pantalla no se ven (·). Aplica ESPACIOS en Excel o .str.strip() en Python.`;
  };
  const draw = ()=>{
    const lim = S.motor==="excel" ? ["Sin limpiar","ESPACIOS","ESPACIOS + SUSTITUIR(carácter 160)"] : ["Sin limpiar",".str.strip()",".str.strip().str.upper()"];
    const res = erp.map(result), okN = res.filter(x=>x.ok&&!x.wrong).length;
    const r = erp[S.sel], rr = res[S.sel], mk = rr.ok ? find(clean(r.k)) : null;
    el.innerHTML = `<div class="stack">
      <p class="read">Seis líneas de la exportación del ERP deben traer la razón social desde el maestro de clientes. Cada una tiene un problema distinto. Cambia la función, la limpieza y la herramienta, y mira qué filas cruzan. Los espacios se muestran como <span class="sp">·</span> y el carácter 160 como <span class="sp">°</span>.</p>
      <div class="ctl">
        <label for="s5m">Herramienta<select id="s5m"><option value="excel">Excel</option><option value="pandas">Python (Colab)</option></select></label>
        <label for="s5f">Función<select id="s5f" ${S.motor==="pandas"?"disabled":""}><option>BUSCARX</option><option>INDICE+COINCIDIR</option><option>BUSCARV</option></select></label>
        <label for="s5l">Limpieza de la llave<select id="s5l">${lim.map((t,i)=>`<option value="${i}">${t}</option>`).join("")}</select></label>
        <label class="chk" for="s5n"><input type="checkbox" id="s5n" ${S.nit?"checked":""}> Insertar columna «nit» en el maestro</label>
      </div>
      ${fxbar(S.motor==="excel"?"G"+(S.sel+2):"Colab", `<span class="mono">${esc(formula())}</span>`)}
      <div class="two">
        <div class="panel" style="padding:0"><div style="padding:10px 12px" class="eyebrow">tERP · exportación (clic para elegir fila)</div>
          <div class="sheetwrap" style="border:0; border-top:1px solid var(--line); border-radius:0"><table class="sheet"><thead><tr><th>Factura</th><th>Cod Cliente</th><th>Resultado</th></tr></thead><tbody>
          ${erp.map((x,i)=>`<tr data-r="${i}" class="${i===S.sel?(res[i].ok&&!res[i].wrong?"hit":"miss"):""}" style="cursor:pointer"><td>${x.f}</td><td class="mono">${show(x.k)}</td><td style="color:${res[i].ok&&!res[i].wrong?"var(--good)":"var(--bad)"}">${esc(res[i].v)}</td></tr>`).join("")}
          </tbody></table></div></div>
        <div class="panel" style="padding:0"><div style="padding:10px 12px" class="eyebrow">tClientes · maestro</div>
          <div class="sheetwrap" style="border:0; border-top:1px solid var(--line); border-radius:0"><table class="sheet"><thead><tr>${cols().map((c,i)=>`<th>${i+1} · ${c}</th>`).join("")}</tr></thead><tbody>
          ${maestro.map(m=>`<tr class="${mk&&mk.id===m.id?"hit":""}">${cols().map(c=>`<td class="${c==="id_cliente"?"mono":""}">${esc({id_cliente:m.id,nit:m.nit,razon_social:m.rs,segmento:m.seg,ciudad:m.ciu}[c])}</td>`).join("")}</tr>`).join("")}
          </tbody></table></div></div>
      </div>
      <div class="insight"><b>${erp[S.sel].f} · ${erp[S.sel].d}.</b> ${why(r,rr)}</div>
      <div class="row"><b style="font-family:var(--f-display)">${okN} de 6 filas cruzadas correctamente.</b><span class="muted">${okN===5?"La que falta es un huérfano: se reporta, no se fuerza.":""}</span></div>
    </div>`;
    $("#s5m").value=S.motor; $("#s5f").value=S.fn; $("#s5l").value=S.limpia;
    $("#s5m").onchange=e=>{ S.motor=e.target.value; draw() };
    $("#s5f").onchange=e=>{ S.fn=e.target.value; draw() };
    $("#s5l").onchange=e=>{ S.limpia=+e.target.value; draw() };
    $("#s5n").onchange=e=>{ S.nit=e.target.checked; if(S.nit&&S.motor==="excel") S.fn="BUSCARV"; draw() };
    el.querySelectorAll("tr[data-r]").forEach(tr=>tr.onclick=()=>{ S.sel=+tr.dataset.r; draw() });
  };
  draw();
};

/* ---- Clave 7: constructor de tablas dinámicas ---- */
const DIMS7 = {ciudad:"Ciudad", categoria:"Categoría", segmento:"Segmento", canal:"Canal", vendedor:"Vendedor", anio:"Año", mes:"Mes"};
const lbl = (d,i)=> d==="mes"?MESES[i]:String(DM[d][i]);
const VALS = {sum:"Suma de subtotal (venta neta)", marg:"Suma de margen_bruto", mpct:"Margen % (Σ margen ÷ Σ venta)", lines:"Recuento de líneas", fact:"Recuento distinto de facturas", qty:"Suma de cantidad"};
const PRESETS = [
 {t:"¿Qué ciudad vendió más en 2025?", c:{f:"ciudad", c:"", v:"sum", sh:"val", y:"2025", an:false}},
 {t:"¿Cuánto creció cada ciudad de 2024 a 2025?", c:{f:"ciudad", c:"anio", v:"sum", sh:"val", y:"", an:false}},
 {t:"¿Qué línea deja más margen porcentual?", c:{f:"categoria", c:"", v:"mpct", sh:"val", y:"", an:false}},
 {t:"¿El e-commerce ganó participación?", c:{f:"anio", c:"canal", v:"sum", sh:"row", y:"", an:false}},
 {t:"¿Cuántas facturas emitió cada sede?", c:{f:"ciudad", c:"", v:"fact", sh:"val", y:"", an:false}},
 {t:"¿En qué meses se concentra la venta?", c:{f:"mes", c:"anio", v:"sum", sh:"val", y:"", an:false}},
];
function pivot(cfg){
  const yI = cfg.y?anioIdx(+cfg.y):-1;
  const R={}, T={}, G={s:0,m:0,l:0,q:0,f:new Set()}, colKeys=new Set();
  const acc = ()=>({s:0,m:0,l:0,q:0,f:new Set()});
  const add=(a,i)=>{ a.s+=C.subtotal[i]; a.m+=C.margen[i]; a.l++; a.q+=C.cantidad[i]; if(cfg.v==="fact") a.f.add(C.factura[i]) };
  for(let i=0;i<NL;i++){
    if(!cfg.an && C.estado[i]===2) continue;
    if(yI>=0 && C.anio[i]!==yI) continue;
    const r=C[cfg.f][i], c= cfg.c? C[cfg.c][i] : "_";
    colKeys.add(c);
    R[r]=R[r]||{_t:acc()}; R[r][c]=R[r][c]||acc(); add(R[r][c],i); add(R[r]._t,i);
    T[c]=T[c]||acc(); add(T[c],i); add(G,i);
  }
  const val = a => !a?null: cfg.v==="sum"?a.s: cfg.v==="marg"?a.m: cfg.v==="mpct"?(a.s?a.m/a.s:null): cfg.v==="lines"?a.l: cfg.v==="fact"?a.f.size: a.q;
  return {R,T,G,cols:[...colKeys].sort((a,b)=>a-b), val};
}
SIMS[7] = function(el){
  let cfg = {...PRESETS[1].c}, preset=1;
  const draw = ()=>{
    const p = pivot(cfg), isPct = cfg.v==="mpct";
    let rows = Object.keys(p.R).map(Number);
    rows.sort(cfg.f==="mes"||cfg.f==="anio" ? (a,b)=>a-b : (a,b)=>(p.val(p.R[b]._t)||0)-(p.val(p.R[a]._t)||0));
    const gTot = p.val(p.G);
    const multi = !!cfg.c, cs = multi?p.cols:["_"];
    const fmt = (v, r, c)=>{
      if(v==null) return "–";
      if(isPct) return pf.format(v);
      if(cfg.sh==="val") return nf.format(v);
      if(cfg.sh==="tot") return pf.format(v/gTot);
      if(cfg.sh==="col") return pf.format(v/(c==="_" ? gTot : p.val(p.T[c])));
      return pf.format(v/(r==null ? gTot : p.val(p.R[r]._t)));
    };
    const growth = cfg.c==="anio" && p.cols.length===2 && !isPct && cfg.sh==="val";
    const gcell = (a,b,strong)=> `<td class="num" style="color:${b>=a?"var(--good)":"var(--bad)"}">${strong?"<b>":""}${a?(b>=a?"▲ ":"▼ ")+pf.format(b/a-1):"–"}${strong?"</b>":""}</td>`;
    let html = `<table class="datatbl"><thead><tr><th>${DIMS7[cfg.f]}</th>${multi?cs.map(c=>`<th style="text-align:right">${lbl(cfg.c,c)}</th>`).join(""):""}<th style="text-align:right">${multi?"Total general":VALS[cfg.v].split(" (")[0]}</th>${growth?`<th style="text-align:right">Var. %</th>`:""}</tr></thead><tbody>`;
    rows.forEach(r=>{
      html += `<tr><td>${lbl(cfg.f,r)}</td>${multi?cs.map(c=>`<td class="num">${fmt(p.val(p.R[r][c]),r,c)}</td>`).join(""):""}<td class="num"><b>${fmt(p.val(p.R[r]._t),r,"_")}</b></td>`;
      if(growth) html += gcell(p.val(p.R[r][p.cols[0]]), p.val(p.R[r][p.cols[1]]));
      html += `</tr>`;
    });
    html += `<tr><td><b>Total general</b></td>${multi?cs.map(c=>`<td class="num"><b>${fmt(p.val(p.T[c]),null,c)}</b></td>`).join(""):""}<td class="num"><b>${fmt(gTot,null,"_")}</b></td>${growth?gcell(p.val(p.T[p.cols[0]]),p.val(p.T[p.cols[1]]),true):""}</tr></tbody></table>`;

    const notes=[];
    if(cfg.v==="fact"){ const sumRows=rows.reduce((s,r)=>s+p.R[r]._t.f.size,0); if(sumRows!==p.G.f.size) notes.push(`La suma de las filas (${nf.format(sumRows)}) no es igual al total (${nf.format(p.G.f.size)}): una misma factura aparece en varias filas. Por eso un recuento distinto nunca se suma.`); else notes.push(`Compara con «Recuento de líneas»: el conjunto tiene más líneas que facturas porque una factura tiene en promedio ${(p.G.l/p.G.f.size).toFixed(1).replace(".",",")} productos.`) }
    if(isPct){ let s=0,k=0; for(let i=0;i<NL;i++){ if(!cfg.an&&C.estado[i]===2) continue; if(cfg.y&&DM.anio[C.anio[i]]!==+cfg.y) continue; s+=C.margen[i]/C.subtotal[i]; k++ } notes.push(`Margen % correcto de la empresa: ${pf.format(p.val(p.G))}. Si promedias el margen % de cada línea obtienes ${pf.format(s/k)}: las líneas pequeñas pesan igual que las grandes.`) }
    if(cfg.an) notes.push(`Estás incluyendo facturas anuladas. Para una pregunta comercial, desmarca la casilla.`);
    if(!cfg.an){ const an=pivot({...cfg, an:true}); if(cfg.v==="sum") notes.push(`Sin el filtro de estado el total sería ${nf.format(an.G.s)}: ${nf.format(an.G.s-p.G.s)} pesos de facturas anuladas contados como venta.`) }
    if(growth){ const best=rows.map(r=>[r,p.val(p.R[r][p.cols[1]])/p.val(p.R[r][p.cols[0]])-1]).sort((a,b)=>b[1]-a[1])[0]; notes.unshift(`<b>Hallazgo:</b> ${lbl(cfg.f,best[0])} es la que más creció (${pf.format(best[1])}).`) }
    else if(!multi && !isPct && rows.length && cfg.f!=="mes" && cfg.f!=="anio"){ const top=rows[0], tv=p.val(p.R[top]._t); notes.unshift(`<b>Hallazgo:</b> ${lbl(cfg.f,top)} lidera con ${nf.format(tv)}${cfg.v==="fact"?"":` (${pf.format(tv/gTot)} del total)`}.`) }
    else if(isPct){ const s=[...rows].sort((a,b)=>p.val(p.R[b]._t)-p.val(p.R[a]._t)); notes.unshift(`<b>Hallazgo:</b> ${lbl(cfg.f,s[0])} tiene el mayor margen (${pf.format(p.val(p.R[s[0]]._t))}); ${lbl(cfg.f,s[s.length-1])}, el menor (${pf.format(p.val(p.R[s[s.length-1]]._t))}).`) }

    const bars = rows.map(r=>({k:lbl(cfg.f,r), v: p.val(p.R[r]._t)}));
    $("[data-pvt]",el).innerHTML = html;
    $("[data-notes]",el).innerHTML = notes.map(n=>`<div class="insight">${n}</div>`).join("");
    drawBars($("[data-chart]",el), bars, isPct?pf.format: (cfg.sh==="tot"? v=>pf.format(v/gTot) : (cfg.v==="sum"||cfg.v==="marg"? v=>"$ "+nf.format(Math.round(v/1e6))+" M" : nf.format)), cfg.f==="mes"||cfg.f==="anio" ? false : true,
      multi ? `Total por ${DIMS7[cfg.f].toLowerCase()}` : VALS[cfg.v]);
  };
  el.innerHTML = `<div class="stack">
    <p class="read">Este constructor resume las <b>${nf.format(D.n_lineas)} líneas de venta</b> de 2024 y 2025, igual que una tabla dinámica de Excel. Empieza por una pregunta de negocio o arma tu propia combinación.</p>
    <div class="chips" data-presets>${PRESETS.map((x,i)=>`<button class="chip" data-p="${i}" aria-pressed="${i===preset}">${x.t}</button>`).join("")}</div>
    <div class="panel"><div class="ctl">
      <label for="p-f">Filas<select id="p-f">${Object.entries(DIMS7).map(([k,v])=>`<option value="${k}">${v}</option>`).join("")}</select></label>
      <label for="p-c">Columnas<select id="p-c"><option value="">(ninguna)</option>${Object.entries(DIMS7).filter(([k])=>k!=="vendedor"&&k!=="mes").map(([k,v])=>`<option value="${k}">${v}</option>`).join("")}</select></label>
      <label for="p-v">Valores<select id="p-v">${Object.entries(VALS).map(([k,v])=>`<option value="${k}">${v}</option>`).join("")}</select></label>
      <label for="p-s">Mostrar valores como<select id="p-s"><option value="val">Valor</option><option value="tot">% del total general</option><option value="col">% del total de columna</option><option value="row">% del total de fila</option></select></label>
      <label for="p-y">Filtro año<select id="p-y"><option value="">(Todos)</option><option>2024</option><option>2025</option></select></label>
      <label class="chk" for="p-a"><input type="checkbox" id="p-a"> Incluir facturas anuladas</label>
    </div></div>
    <div class="two" style="grid-template-columns:minmax(0,1.15fr) minmax(0,1fr)">
      <div class="panel scroll" data-pvt></div>
      <div class="panel"><div class="chartbox" data-chart></div></div>
    </div>
    <div class="stack" style="gap:8px" data-notes></div>
  </div>`;
  const sync = ()=>{ $("#p-f").value=cfg.f; $("#p-c").value=cfg.c; $("#p-v").value=cfg.v; $("#p-s").value=cfg.sh; $("#p-y").value=cfg.y; $("#p-a").checked=cfg.an;
    el.querySelectorAll("[data-presets] .chip").forEach((b,i)=>b.setAttribute("aria-pressed", i===preset)) };
  el.querySelectorAll("[data-presets] .chip").forEach(b=>b.onclick=()=>{ preset=+b.dataset.p; cfg={...PRESETS[preset].c}; sync(); draw() });
  const on = (id,key)=> $(id).onchange=e=>{ cfg[key]= e.target.type==="checkbox"?e.target.checked:e.target.value; if(cfg.c===cfg.f) cfg.c=""; if(cfg.c==="anio") cfg.y=""; preset=-1; sync(); draw() };
  on("#p-f","f"); on("#p-c","c"); on("#p-v","v"); on("#p-s","sh"); on("#p-y","y"); on("#p-a","an");
  sync(); draw();
};
