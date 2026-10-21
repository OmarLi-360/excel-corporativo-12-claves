/* ======================================================================
   CONTENIDO · Gráficos para informes (capacitación rápida)
   Cada gráfico se dibuja en vivo con los datos de Distribuidora Andina.
   ====================================================================== */
const INTENTS = [
 ["comparar","Comparar","¿Quién es más, quién es menos?"],
 ["evolucion","Evolución","¿Cómo cambió en el tiempo?"],
 ["composicion","Composición","¿De qué partes está hecho el total?"],
 ["distribucion","Distribución","¿Cómo se reparten los valores?"],
 ["relacion","Relación","¿Una cosa se mueve con otra?"],
 ["cumplimiento","Cumplimiento","¿Llegamos a la meta?"],
];

function datosGraficos(){
  const ciu = DM.ciudad, y25=anioIdx(2025), y24=anioIdx(2024);
  const v25 = agg("ciudad",{filtro:i=>C.anio[i]===y25}), v24 = agg("ciudad",{filtro:i=>C.anio[i]===y24});
  const tot25=[...v25.values()].reduce((a,b)=>a+b,0), tot24=[...v24.values()].reduce((a,b)=>a+b,0);
  const ciudades = ciu.map((c,i)=>({k:c, i, v24:v24.get(i)||0, v25:v25.get(i)||0})).sort((a,b)=>b.v25-a.v25);
  const mes = a => { const m=agg("mes",{filtro:i=>C.anio[i]===a}); return MESES.map((_,k)=>(m.get(k)||0)/1e6) };
  const canal = a => { const m=agg("canal",{filtro:i=>C.anio[i]===a}); return DM.canal.map((_,k)=>m.get(k)||0) };
  const seg = agg("segmento",{filtro:i=>C.anio[i]===y25});
  // valor de cada factura 2025
  const fac = agg(i=>C.factura[i],{filtro:i=>C.anio[i]===y25}); const vf=[...fac.values()].sort((a,b)=>a-b);
  const p95 = vf[Math.floor(vf.length*.95)], mediana = vf[Math.floor(vf.length/2)];
  // vendedores: venta y margen %
  const vv = agg("vendedor"), vm = agg("vendedor",{valor:"margen"});
  const vend = DM.vendedor.map((n,k)=>({k:n, x:vv.get(k)||0, y:(vm.get(k)||0)/(vv.get(k)||1)})).filter(p=>p.x>0);
  // mapa de calor ciudad × mes 2025
  const cm = agg(i=>C.ciudad[i]*12+C.mes[i],{filtro:i=>C.anio[i]===y25});
  const calor = ciudades.map(c=>MESES.map((_,m)=>cm.get(c.i*12+m)||0));
  // Pareto de clientes 2025 en deciles
  const cl = [...agg("cliente",{filtro:i=>C.anio[i]===y25}).values()].sort((a,b)=>b-a), n=cl.length, totc=cl.reduce((a,b)=>a+b,0);
  const deciles = Array.from({length:10},(_,d)=>{ const a=Math.round(n*d/10), b=Math.round(n*(d+1)/10); return {k:`${(d+1)*10} %`, v:cl.slice(a,b).reduce((x,y)=>x+y,0)/totc} });
  // KPI
  const mg25 = agg(()=>"t",{filtro:i=>C.anio[i]===y25, valor:"margen"}).get("t");
  const f25 = new Set(); for(let i=0;i<NL;i++) if(C.anio[i]===y25&&C.estado[i]!==2) f25.add(C.factura[i]);
  return {ciudades, tot24, tot25, mes, canal, seg, vf, p95, mediana, vend, calor, deciles, mg25, f25:f25.size, nClientes:n};
}

function catalogoGraficos(d){
  const top = d.ciudades[0], sh = top.v25/d.tot25;
  const can24=d.canal(anioIdx(2024)), can25=d.canal(anioIdx(2025)), sE=x=>x[2]/x.reduce((a,b)=>a+b,0);
  const segs = DM.segmento.map((s,k)=>({k:s, v:d.seg.get(k)||0})).sort((a,b)=>b.v-a.v);
  const top2 = d.deciles[0].v+d.deciles[1].v;
  const metas = d.ciudades.map(c=>({k:c.k, real:c.v25, meta:D.metas2025[c.k]})).sort((a,b)=>b.real/b.meta-a.real/a.meta);
  const cumplen = metas.filter(m=>m.real>=m.meta).length;
  const deltas = [...d.ciudades].map(c=>({k:c.k, v:c.v25-c.v24})).sort((a,b)=>b.v-a.v);
  const corto = v=>nf.format(Math.round(v/1e6));
  return [
   {id:"barras", n:"Barras horizontales", i:"comparar", q:"¿Qué sede vendió más en 2025?",
    tit:`${top.k} concentra el ${pf.format(sh)} de la venta 2025`,
    svg:G.barrasH(d.ciudades.map(c=>({k:c.k,v:c.v25})),{fmt:mill,ejeFmt:v=>nf.format(v/1e6)}),
    usa:"Comparas categorías, sobre todo si son muchas o tienen nombres largos.", evita:"El eje es el tiempo: usa líneas.",
    xl:"Insertar › Gráficos › Barra agrupada. Ordena los datos de mayor a menor antes de graficar.",
    dec:["Ordena de mayor a menor: el ojo lee el ranking sin esfuerzo.","Un solo color y resalta la barra del mensaje.","El eje empieza en cero; si no, las diferencias se exageran."]},
   {id:"agrupadas", n:"Columnas agrupadas", i:"comparar", q:"¿Cómo cambió cada sede de 2024 a 2025?",
    tit:`${d.ciudades.every(c=>c.v25>c.v24)?"Todas las sedes crecieron":"No todas las sedes crecieron"}; la venta total subió ${pf.format(d.tot25/d.tot24-1)}`,
    svg:G.columnasAgrupadas(d.ciudades.map(c=>c.k),[{n:"2024",v:d.ciudades.map(c=>c.v24/1e6),c:"var(--s0)"},{n:"2025",v:d.ciudades.map(c=>c.v25/1e6),c:"var(--s1)"}],{fmt:v=>"$ "+nf.format(Math.round(v))+" M",ejeFmt:v=>nf.format(v)}),
    usa:"Comparas dos o tres series dentro de cada categoría.", evita:"Hay más de tres series: se vuelve un código de colores. Usa varios gráficos pequeños.",
    xl:"Insertar › Columna agrupada, con el año en las columnas de la tabla dinámica.",
    dec:["El año anterior en gris y el actual en color: el foco va a lo nuevo.","Leyenda arriba, en el orden de las barras.","Máximo tres series."]},
   {id:"lineas", n:"Líneas", i:"evolucion", q:"¿Cómo se comportó la venta mes a mes?",
    tit:(()=>{ const m=d.mes(anioIdx(2025)).map((v,k)=>[v,k]).sort((a,b)=>b[0]-a[0]); return `En 2025 los meses más fuertes fueron ${MESES[m[0][1]].toLowerCase()} y ${MESES[m[1][1]].toLowerCase()}` })(),
    svg:G.lineas(MESES,[{n:"2024",v:d.mes(anioIdx(2024)),c:"var(--s0)"},{n:"2025",v:d.mes(anioIdx(2025)),c:"var(--s1)"}],{fmt:v=>"$ "+nf.format(Math.round(v))+" M",ejeFmt:v=>nf.format(Math.round(v))}),
    usa:"El eje horizontal es el tiempo y quieres ver tendencia, estacionalidad o picos.", evita:"Las categorías no tienen orden (sedes, productos): la línea sugiere una continuidad que no existe.",
    xl:"Insertar › Línea con marcadores. Fecha o mes en el eje horizontal.",
    dec:["Máximo cuatro líneas.","Etiqueta las líneas al final en vez de usar leyenda.","El eje puede no empezar en cero: aquí importa la forma, no la longitud."]},
   {id:"apiladas", n:"Barras apiladas al 100 %", i:"composicion", q:"¿El e-commerce ganó participación?",
    tit:`El e-commerce pasó de ${pf.format(sE(can24))} a ${pf.format(sE(can25))} de la venta`,
    svg:G.apiladas100([{k:"2024",v:can24},{k:"2025",v:can25}],DM.canal),
    usa:"Comparas cómo se reparte un total entre pocos grupos (2 a 4 partes).", evita:"Quieres comparar valores absolutos: el 100 % oculta que el total creció.",
    xl:"Insertar › Barra 100 % apilada. En la dinámica: Mostrar valores como › % del total de fila.",
    dec:["Pocas partes, siempre en el mismo orden.","Etiqueta los porcentajes dentro de las barras.","Separa los segmentos con una línea blanca."]},
   {id:"anillo", n:"Anillo (o torta)", i:"composicion", q:"¿Qué segmento de clientes pesa más?",
    tit:`${segs[0].k} aporta el ${pf.format(segs[0].v/segs.reduce((a,b)=>a+b.v,0))} de la venta`,
    svg:G.dona(segs,{centro:"2025",centroSub:"venta neta",label:"Venta por segmento"}),
    usa:"Hay una sola serie, máximo cuatro partes, y el mensaje es «una parte domina».", evita:"Hay más de cuatro partes o quieres comparar partes parecidas: usa barras.",
    xl:"Insertar › Gráfico circular o de anillos › Anillo. Nunca en 3D.",
    dec:["Ordena las partes de mayor a menor, empezando a las 12.","Escribe el porcentaje junto a cada parte.","Si dudas, usa barras: siempre se leen mejor."]},
   {id:"histograma", n:"Histograma", i:"distribucion", q:"¿Cuánto vale una factura típica?",
    tit:`La mitad de las facturas vale menos de ${mill(d.mediana)}`,
    svg:G.histograma(d.vf.map(v=>Math.min(v,d.p95*0.999)),{bins:12,max:d.p95,fmt:v=>nf.format(Math.round(v/1e6)),xlab:`Valor de la factura (millones). La última barra incluye las mayores a ${mill(d.p95)}`}),
    usa:"Quieres ver cómo se reparten los valores: cuáles son típicos y cuáles son extremos.", evita:"Tienes pocos datos (menos de 30) o categorías: el histograma es para cifras continuas.",
    xl:"Insertar › Gráfico estadístico › Histograma. Ajusta el ancho de los intervalos en Dar formato al eje.",
    dec:["Elige el ancho del intervalo: muy anchos ocultan, muy estrechos confunden.","Agrupa los valores extremos en la última barra y dilo.","Reporta la mediana, no el promedio, cuando hay valores muy grandes."]},
   {id:"dispersion", n:"Dispersión", i:"relacion", q:"¿Los vendedores que más venden tienen menor margen?",
    tit:(()=>{ const r=correl(d.vend.map(p=>p.x),d.vend.map(p=>p.y)); return r<-0.3?"Los vendedores que más venden tienden a dejar menos margen":r>0.3?"Los vendedores que más venden también dejan más margen":"Vender más no se asocia con más margen: el margen depende de qué se vende" })(),
    svg:G.dispersion(d.vend,{fx:v=>nf.format(Math.round(v/1e9*10)/10)+" mil M",fy:v=>Math.round(v*1000)/10+" %",xlab:"Venta 2024–2025 (eje X) y margen bruto % (eje Y). Cada punto es un vendedor"}),
    usa:"Quieres ver si dos medidas se mueven juntas, con un punto por elemento.", evita:"Una de las variables es una categoría o una fecha.",
    xl:"Insertar › Dispersión (X, Y). Cada fila debe tener las dos medidas.",
    dec:["Pon en el eje X la variable que crees que explica a la otra.","Rotula solo los puntos que importan.","Una relación no prueba causa."]},
   {id:"calor", n:"Mapa de calor", i:"distribucion", q:"¿En qué meses y sedes se concentra la venta?",
    tit:(()=>{ let b=[0,0,0]; d.calor.forEach((f,i)=>f.forEach((v,j)=>{ if(v>b[0]) b=[v,i,j] })); return `${d.ciudades[b[1]].k} en ${MESES[b[2]].toLowerCase()} es el punto más alto de 2025` })(),
    svg:G.calor(d.ciudades.map(c=>c.k),MESES,d.calor,{fmt:mill,corto}),
    usa:"Cruzas dos categorías y buscas patrones: meses fuertes, sedes débiles.", evita:"Necesitas cifras exactas para comparar: usa la tabla con números.",
    xl:"Sobre la tabla dinámica: Inicio › Formato condicional › Escalas de color.",
    dec:["Un solo color, de claro a oscuro.","Ordena las filas con sentido (por tamaño o por región).","Escribe los valores si caben."]},
   {id:"pareto", n:"Pareto", i:"distribucion", q:"¿Qué tan concentradas están las ventas en pocos clientes?",
    tit:`El 20 % de los clientes explica el ${pf.format(top2)} de la venta`,
    svg:G.pareto(d.deciles,{xlab:`Clientes de 2025 agrupados de 10 % en 10 %, del que más compra al que menos (${nf.format(d.nClientes)} clientes)`}),
    usa:"Quieres saber si pocos elementos explican la mayor parte: clientes, productos, causas de reclamos.", evita:"Los elementos aportan parecido: el gráfico no dice nada.",
    xl:"Insertar › Gráfico estadístico › Pareto. Excel usa dos ejes aquí; es la excepción aceptada porque la línea es el acumulado de las mismas barras.",
    dec:["Ordena de mayor a menor.","Marca la línea del 80 %.","Agrupa en bloques si hay cientos de elementos."]},
   {id:"kpi", n:"Tarjeta de indicador (KPI)", i:"cumplimiento", q:"¿Cómo cerró la empresa el año?",
    tit:"Lo primero que ve el comité: cuatro cifras y su comparación",
    svg:G.kpi([{et:"Venta neta 2025",v:mill(d.tot25),d:"▲ "+pf.format(d.tot25/d.tot24-1)+" vs 2024",bien:true},{et:"Margen bruto",v:pf.format(d.mg25/d.tot25),d:"sobre venta neta"},{et:"Facturas",v:nf.format(d.f25),d:"sin anuladas"}]),
    usa:"El mensaje es una cifra y su comparación (contra meta o periodo anterior).", evita:"Pones más de 4 o 5 tarjetas: ya no es un resumen.",
    xl:"Una celda grande con IMPORTARDATOSDINAMICOS, o un cuadro de texto vinculado a una celda (escribe =Panel!B5 en la barra de fórmulas).",
    dec:["Toda cifra va con su comparación.","Color de estado solo en la comparación, con ▲ o ▼.","Mismo formato de número en todas las tarjetas."]},
   {id:"realmeta", n:"Real contra meta", i:"cumplimiento", q:"¿Qué sedes cumplieron la meta de 2025?",
    tit:`${cumplen} de 6 sedes cumplieron; ${metas[metas.length-1].k} quedó en ${pf.format(metas[metas.length-1].real/metas[metas.length-1].meta)}`,
    svg:G.realMeta(metas),
    usa:"Comparas un resultado con su objetivo, por elemento.", evita:"No hay meta definida: no la inventes para el gráfico.",
    xl:"Barra agrupada con real y meta. En Dar formato a serie de datos › Superposición de series 100 % y deja la meta solo con borde.",
    dec:["Ordena por porcentaje de cumplimiento, no por tamaño.","Escribe el % de cumplimiento al lado.","Verde y rojo siempre acompañados de ✓ y ✗."]},
   {id:"cascada", n:"Cascada", i:"composicion", q:"¿Qué sedes explican el crecimiento de 2024 a 2025?",
    tit:`${deltas[0].k} aportó la mayor parte del crecimiento`,
    svg:G.cascada([{k:"2024",v:d.tot24,total:true},...deltas,{k:"2025",v:d.tot25,total:true}],{fmt:mill,corto,ejeFmt:v=>nf.format(Math.round(v/1e9))+" mil M"}),
    usa:"Explicas cómo se pasa de una cifra a otra: crecimiento, presupuesto, de venta bruta a neta.", evita:"Los pasos no suman el total: el gráfico pierde sentido.",
    xl:"Insertar › Gráfico de cascada. Marca las barras de inicio y fin: clic en la barra › Establecer como total.",
    dec:["Totales en gris; aumentos en verde y disminuciones en rojo.","Ordena los pasos de mayor a menor aporte.","Etiqueta cada paso con su valor."]},
  ];
}

function correl(x,y){ const n=x.length, mx=x.reduce((a,b)=>a+b)/n, my=y.reduce((a,b)=>a+b)/n;
  let sxy=0,sx=0,sy=0; for(let i=0;i<n;i++){ sxy+=(x[i]-mx)*(y[i]-my); sx+=(x[i]-mx)**2; sy+=(y[i]-my)**2 } return sxy/Math.sqrt(sx*sy) }

const EVITAR = [
 ["Gráficos en 3D","Deforman las proporciones: la parte del frente se ve más grande de lo que es.","Usa la versión plana."],
 ["Dos ejes con escalas distintas","El cruce de las líneas depende de cómo se elijan las escalas, no de los datos.","Dos gráficos uno encima del otro, con el mismo eje de tiempo."],
 ["Torta con muchas partes","Nadie compara bien ángulos parecidos.","Barras ordenadas."],
 ["Barras que no empiezan en cero","Una diferencia del 5 % se ve como el doble.","Eje desde cero en barras y columnas."],
 ["Colores sin significado","Un color distinto por barra obliga a buscar qué significa cada uno.","Un color y un resaltado para el mensaje."],
 ["Título que describe y no dice","«Ventas por ciudad» no le dice nada a quien decide.","Escribe el hallazgo: «Bogotá concentra el 30 %»."],
];
const REGLAS = [
 ["Empieza por la pregunta","Elige el gráfico por lo que quieres mostrar, no por cómo se ve."],
 ["El título es el hallazgo","Una frase con la cifra que importa."],
 ["Ordena","De mayor a menor, salvo que el orden sea el tiempo."],
 ["Un color y un resaltado","El color se usa para señalar, no para decorar."],
 ["Escribe los valores clave","Si el lector necesita la cifra exacta, póntela."],
 ["Fuente y fecha","Al pie: de dónde salen los datos y a qué fecha."],
];

let INTENT = "todos";
function viewGraficos(){
  const d = datosGraficos(), cat = catalogoGraficos(d);
  app.innerHTML = `<div class="wrap">
    <div class="mhead"><span class="eyebrow">Capacitación rápida · 30 minutos</span><h1>Gráficos para informes</h1>
      <p class="muted read" style="font-size:1.1rem">Un buen gráfico responde una pregunta en diez segundos. Aquí tienes los 12 gráficos más usados en informes, cuándo usar cada uno y cómo hacerlo en Excel 365. Todos están dibujados con los datos de la Distribuidora Andina.</p></div>
    ${docenteBox({duracion:[["¿Qué quiero mostrar?",5,"Presenta las seis intenciones con una pregunta de la empresa para cada una."],["Recorrido de los 12 gráficos",15,"Para cada uno, lee la pregunta y pide al grupo que diga el hallazgo antes de mostrar el título."],["Gráficos a evitar",5,"Muestra un ejemplo malo de su propio trabajo o de internet."],["Ejercicio",5,"Dales una pregunta nueva y que elijan el gráfico con el selector."]],
      preguntas:["¿Por qué el título debe decir el hallazgo?","¿Cuándo una tabla es mejor que un gráfico?"],cierre:"Pregunta → intención → gráfico → título con hallazgo."})}

    <section class="block" style="border-top:0; padding-top:0"><div class="sechead"><span class="eyebrow">Paso 1</span><h2>¿Qué quieres mostrar?</h2></div>
      <div class="chips" data-int><button class="chip" data-i="todos" aria-pressed="${INTENT==="todos"}">Todos (12)</button>
        ${INTENTS.map(x=>`<button class="chip" data-i="${x[0]}" aria-pressed="${INTENT===x[0]}"><b>${x[1]}</b> · ${x[2]}</button>`).join("")}</div></section>

    <section class="block"><div class="sechead"><span class="eyebrow">Paso 2</span><h2>Elige el gráfico</h2></div>
      <div class="gcards">${cat.filter(g=>INTENT==="todos"||g.i===INTENT).map(g=>`<article class="gcard" id="g-${g.id}">
        <div class="gh"><h3>${g.n}</h3><span class="tag av">${INTENTS.find(x=>x[0]===g.i)[1]}</span></div>
        <div class="muted small">Pregunta: ${g.q}</div>
        <div class="gtitle">${esc(g.tit)}</div>
        <div class="mini">${g.svg}</div>
        <dl><dt>Úsalo cuando</dt><dd>${g.usa}</dd><dt>Evítalo cuando</dt><dd>${g.evita}</dd><dt>En Excel 365</dt><dd>${g.xl}</dd>
          <dt>Decisiones</dt><dd><ul class="plain">${g.dec.map(x=>`<li>${x}</li>`).join("")}</ul></dd></dl>
      </article>`).join("")}</div></section>

    <section class="block"><div class="sechead"><span class="eyebrow">Paso 3</span><h2>Seis reglas para cualquier gráfico</h2></div>
      <div class="grid3">${REGLAS.map((r,i)=>`<div class="panel"><span class="eyebrow">${i+1}</span><h4 style="margin-top:4px">${r[0]}</h4><p class="muted small" style="margin-top:4px">${r[1]}</p></div>`).join("")}</div></section>

    <section class="block"><div class="sechead"><h2>Gráficos que debes evitar</h2></div>
      <div class="scroll"><table class="datatbl"><tr><th>Evita</th><th>Por qué engaña</th><th>Usa en cambio</th></tr>${EVITAR.map(e=>`<tr><td><b>${e[0]}</b></td><td>${e[1]}</td><td>${e[2]}</td></tr>`).join("")}</table></div></section>

    <section class="block" style="padding-bottom:40px"><div class="colab"><div class="stack" style="gap:8px"><span class="eyebrow">Practica en Colab · sin programar</span><p>El cuaderno <b>Galería de gráficos</b> tiene los mismos 12 gráficos en versión interactiva. Eliges la pregunta en una lista desplegable y el gráfico se redibuja, con su ficha de decisión.</p></div>
      <div class="stack" style="gap:8px"><a class="btn primary" href="${colabURL("graficos_para_informes.ipynb")}" target="_blank" rel="noopener">Abrir en Colab</a></div></div></section>
  </div>`;
  app.querySelectorAll("[data-int] .chip").forEach(b=>b.onclick=()=>{ INTENT=b.dataset.i; const y=scrollY; viewGraficos(); scrollTo(0,y) });
}
