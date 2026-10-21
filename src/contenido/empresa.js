/* ======================================================================
   CONTENIDO · La empresa: contexto de Distribuidora Andina y su dataset
   ====================================================================== */
const DEPTOS = [
 {d:"Comercial", q:"18 vendedores en 6 sedes registran cada pedido en el ERP.", t:"ventas", c:"id_cliente, id_vendedor, canal, sku, cantidad, descuento_pct"},
 {d:"Facturación", q:"Emite las facturas, calcula el IVA y anula las que tienen errores.", t:"ventas", c:"id_factura, fecha, subtotal, iva, total, estado = Anulada"},
 {d:"Cartera", q:"Controla el crédito y registra el recaudo.", t:"ventas · clientes", c:"medio_pago, estado = Pendiente o Pagada, dias_credito"},
 {d:"Servicio al cliente", q:"Crea y actualiza a los clientes en el maestro.", t:"clientes", c:"id_cliente, razon_social, segmento, ciudad"},
 {d:"Compras", q:"Mantiene el catálogo, la lista de precios y los costos.", t:"productos", c:"sku, producto, categoría, precio, costo"},
 {d:"Talento Humano", q:"Registra la vinculación y el retiro de vendedores.", t:"vendedores", c:"id_vendedor, nombre, sede, fecha de ingreso y retiro"},
 {d:"Planeación financiera", q:"Fija el presupuesto de venta de cada sede, mes a mes.", t:"metas", c:"id_sede, año, mes, meta_subtotal"},
 {d:"Tecnología (TI)", q:"Administra el ERP y exporta los datos para otras áreas.", t:"ventas_erp_sucio", c:"La exportación tal como sale, sin depurar"},
];
const TABLAS = [
 ["ventas","Una línea de factura (un producto dentro de una factura)","ventas.csv","id_linea","Comercial y Facturación",20],
 ["clientes","Un cliente","clientes.csv","id_cliente","Servicio al cliente",7],
 ["productos","Un producto del catálogo","productos.csv","sku","Compras",9],
 ["vendedores","Un vendedor","vendedores.csv","id_vendedor","Talento Humano",6],
 ["sedes","Una sede","sedes.csv","id_sede","Gerencia",5],
 ["metas","La meta de una sede en un mes","metas.csv","id_sede + anio + mes","Planeación financiera",4],
 ["exportación ERP","Una línea exportada por TI, sin depurar","ventas_erp_sucio.csv","Linea","Tecnología (TI)",10],
];
const DICC = [
 ["id_linea","Entero","Identificador único de la línea.","ERP (automático)","Sumarlo o usarlo como cantidad."],
 ["id_factura","Texto","Número de la factura (FV-000001). Una factura tiene de 1 a 5 líneas.","Facturación","Contar sus filas creyendo que son facturas."],
 ["fecha","Fecha","Día en que se emitió la factura.","Facturación","Importarla como texto y no poder agruparla por mes."],
 ["id_cliente","Texto","Llave hacia la tabla clientes.","Comercial","Llega con espacios o minúsculas en las exportaciones."],
 ["id_vendedor","Texto","Llave hacia la tabla vendedores.","Comercial","Olvidar que hay vendedores que ingresaron o se retiraron a mitad del periodo."],
 ["id_sede","Texto","Sede que factura. Llave hacia sedes y metas.","Comercial","Confundir la sede que factura con la ciudad del cliente."],
 ["canal","Texto","Presencial, Televentas o E-commerce.","Comercial","Variantes escritas a mano: «Ecommerce», «E-Commerce»."],
 ["sku","Texto","Código del producto. Llave hacia productos.","Comercial","Códigos de productos descontinuados."],
 ["cantidad","Entero","Unidades o paquetes vendidos.","Comercial","Unidad pegada al número: «49 und»."],
 ["precio_unitario","Pesos","Precio de lista del año de la venta (subió 6,5 % en 2025).","Compras","Valorar ventas de 2024 con precios de 2025."],
 ["descuento_pct","Porcentaje","0 %, 5 %, 10 % o 15 % según segmento, volumen y negociación.","Comercial","Escribir 10 en lugar de 10 % (0,10)."],
 ["valor_bruto","Pesos","cantidad × precio_unitario.","Calculado","—"],
 ["valor_descuento","Pesos","valor_bruto × descuento_pct.","Calculado","—"],
 ["subtotal","Pesos","<b>Venta neta sin IVA.</b> Es la cifra que se compara con la meta.","Facturación","Comparar el total (con IVA) contra la meta."],
 ["iva","Pesos","19 % del subtotal.","Facturación","Sumar el IVA como si fuera venta."],
 ["total","Pesos","subtotal + iva: lo que paga el cliente.","Facturación","Usarlo como venta de la empresa."],
 ["costo_total","Pesos","cantidad × costo unitario del año.","Compras","Usar el costo de otro año."],
 ["margen_bruto","Pesos","subtotal − costo_total: lo que queda para cubrir gastos.","Calculado","Promediar márgenes porcentuales."],
 ["medio_pago","Texto","Transferencia, Tarjeta, Efectivo o Crédito.","Cartera","—"],
 ["estado","Texto","Pagada, Pendiente (aún no se cobra) o <b>Anulada (no es venta)</b>.","Facturación y Cartera","Sumar las anuladas como venta."],
];
const MAESTROS = [
 ["clientes",["id_cliente","razon_social","segmento (Pyme, Corporativo, Gobierno, Educación)","id_sede","ciudad","dias_credito (0, 30 o 60)","fecha_alta"]],
 ["productos",["sku","producto","categoria (5 líneas)","subcategoria","unidad","precio_lista_2024 / 2025","costo_unitario_2024 / 2025"]],
 ["vendedores",["id_vendedor","nombre_vendedor","id_sede","fecha_ingreso","fecha_retiro","estado (Activo, Retirado)"]],
 ["sedes",["id_sede","ciudad","departamento","region","fecha_apertura"]],
 ["metas",["id_sede","anio","mes","meta_subtotal"]],
];
const PALABRAS = [
 ["Registro o fila","Una unidad de lo que se mide. En ventas, una línea de factura."],
 ["Campo o columna","Un dato de cada registro: la fecha, la ciudad, el subtotal."],
 ["Granularidad","Lo que representa una fila. Es lo primero que se pregunta ante una tabla nueva."],
 ["Llave","El campo que identifica un registro y conecta tablas (id_cliente, sku)."],
 ["Tabla de hechos","La tabla de lo que pasa: transacciones con fecha y cifras (ventas)."],
 ["Maestro","La tabla de quién o qué participa: clientes, productos, vendedores."],
 ["Venta neta","El subtotal: venta sin IVA y descontando descuentos."],
 ["Anulada","Factura emitida y luego cancelada. Existe en el sistema, pero no es venta."],
];

function viewEmpresa(){
  // Cifras calculadas en vivo desde los datos
  const v25 = agg(()=>"t",{filtro:es2025}).get("t"), v24 = agg(()=>"t",{filtro:i=>!es2025(i)}).get("t");
  const porCat = agg("categoria",{filtro:es2025});
  const fx = D.factura_ejemplo, F = fx.filas.map(r=>Object.fromEntries(fx.columnas.map((c,i)=>[c,r[i]])));
  const f0 = F[0], sum = k=>F.reduce((a,r)=>a+r[k],0);
  const files=[["ventas.csv","Hecho: una fila por línea de factura"],["clientes.csv","Maestro de clientes"],["productos.csv","Catálogo con precios y costos 2024–2025"],["vendedores.csv","Fuerza comercial, con ingresos y retiros"],["sedes.csv","Las 6 sedes"],["metas.csv","Meta mensual de venta neta por sede"],["ventas_erp_sucio.csv","Exportación de ERP con defectos reales"],["cartera.csv","Facturas pendientes de cobro con fecha de vencimiento (clave 4)"],["Distribuidora_Andina_practica.xlsx","Todo lo anterior como Tablas de Excel, más las hojas de práctica de las claves 1 a 5"],["Andina_listo_para_dinamicas.xlsx","Una sola tabla con todo unido, lista para tablas dinámicas (Taller 2)"],["nuevo_mes/","Enero de 2026, para practicar la actualización (Taller 3)"]];

  app.innerHTML = `<div class="wrap">
    <div class="mhead"><span class="eyebrow">Antes de empezar · La empresa</span><h1>Distribuidora Andina S.A.S.</h1>
      <p class="muted read" style="font-size:1.1rem">Todos los ejercicios usan los datos de esta empresa. Es ficticia, pero funciona como una real: tiene áreas que producen datos, errores de captura, temporadas y metas que no siempre se cumplen. Conocerla es la mitad del análisis.</p></div>
    ${docenteBox({duracion:[["Presentación de la empresa",10,"Recorre esta página con el grupo; pregunta qué vende y a quién."],["Juego de roles",15,"Asigna a cada grupo un área de la tabla «Quién produce los datos» y pídele que explique qué error podría cometer al registrar."],["La factura de 3 líneas",10,"Pide que expliquen por qué una factura son 3 filas y no una."]],
      preguntas:["¿Qué representa una fila de la tabla ventas?","Si Cartera dice «vendimos X» y Comercial dice «vendimos Y», ¿qué cifra usa cada una?"],cierre:"Antes de analizar una tabla, pregunta siempre: ¿qué representa una fila y quién la produce?"})}

    <section class="block"><div class="sechead"><span class="eyebrow">1 · A qué se dedica</span><h2>Suministros para empresas, en seis ciudades</h2></div>
      <div class="two"><div class="prose">
        <p>Distribuidora Andina vende <b>suministros de oficina y tecnología a otras organizaciones</b> (venta entre empresas, o B2B). Abrió en Bogotá en 2015 y hoy tiene sedes en Bogotá, Medellín, Cali, Barranquilla, Bucaramanga y Pereira.</p>
        <p>Vende cinco líneas de producto: <b>papelería</b> (resmas, cuadernos, archivo), <b>tecnología</b> (portátiles, monitores, periféricos), <b>aseo y cafetería</b>, <b>mobiliario</b> (sillas, escritorios, archivadores) e <b>impresión</b> (tóner, impresoras).</p>
        <p>Sus clientes son <b>pymes, empresas corporativas, entidades de gobierno e instituciones educativas</b>. Les vende por tres canales: <b>presencial</b> (el vendedor visita), <b>televentas</b> y <b>e-commerce</b>, que crece cada año.</p>
        <p>Su año tiene dos picos: la <b>temporada escolar</b> (enero y febrero, cuando colegios y empresas compran papelería) y el <b>cierre de presupuestos</b> (noviembre y diciembre, cuando las entidades compran tecnología). A mitad de año las ventas bajan.</p>
      </div>
      <div class="stack">
        ${G.kpi([{et:"Venta neta 2025",v:"$ "+nf.format(Math.round(v25/1e9*10)/10).replace(".",",")+" mil M",d:"▲ "+pf.format(v25/v24-1)+" vs 2024",bien:true},{et:"Facturas emitidas",v:nf.format(D.conteos.facturas),d:"2024 y 2025"}])}
        ${G.kpi([{et:"Clientes",v:nf.format(D.conteos.clientes),d:"4 segmentos"},{et:"Productos",v:nf.format(D.conteos.productos),d:"5 líneas"},{et:"Vendedores",v:nf.format(D.conteos.vendedores),d:"6 sedes"}])}
        <div class="panel mini"><div class="gtitle" style="margin-bottom:6px">Tecnología es la línea que más vende en 2025</div>${G.barrasH([...porCat].map(([k,v])=>({k:DM.categoria[k],v})).sort((a,b)=>b.v-a.v),{fmt:mill,ejeFmt:v=>nf.format(v/1e6),lw:118,label:"Venta neta 2025 por línea"})}</div>
      </div></div>
    </section>

    <section class="block"><div class="sechead"><span class="eyebrow">2 · Quién produce los datos</span><h2>Cada área llena una parte de las tablas</h2>
      <p class="muted read">Los datos no aparecen solos: los registra una persona de un área, con sus reglas y sus errores. Por eso la misma venta puede tener distintas cifras según quién la cuente.</p></div>
      <div class="flow">${DEPTOS.map(x=>`<div class="dept"><b>${x.d}</b><p>${x.q}</p><span class="arrow">→ ${x.t}</span><span class="mono small muted">${x.c}</span></div>`).join("")}</div>
    </section>

    <section class="block"><div class="sechead"><span class="eyebrow">3 · Una factura, varias filas</span><h2>Lo que el cliente recibe y lo que guarda el sistema</h2>
      <p class="muted read">Esta es una factura real del conjunto de datos. El cliente compró 3 productos. En la tabla <code>ventas</code> esa factura ocupa <b>3 filas</b>: una por producto. Los totales de la factura no se guardan; se calculan sumando sus filas.</p></div>
      <div class="two">
        <div class="invoice"><div class="ih"><div><b style="font-family:var(--f-display)">Distribuidora Andina S.A.S.</b><br><span class="muted">Sede ${f0.ciudad} · ${f0.canal}</span></div><div style="text-align:right"><b>Factura ${f0.id_factura}</b><br><span class="muted">${f0.fecha}</span></div></div>
          <div><span class="muted">Cliente:</span> ${esc(f0.razon_social)} (${f0.id_cliente}) · ${f0.segmento}<br><span class="muted">Vendedor:</span> ${esc(f0.nombre_vendedor)} · <span class="muted">Pago:</span> ${f0.medio_pago}</div>
          <div class="scroll"><table><tr><th>Producto</th><th class="num">Cant.</th><th class="num">Precio</th><th class="num">Desc.</th><th class="num">Subtotal</th></tr>
          ${F.map(r=>`<tr><td>${esc(r.producto)}</td><td class="num">${r.cantidad}</td><td class="num">${nf.format(r.precio_unitario)}</td><td class="num">${Math.round(r.descuento_pct*100)} %</td><td class="num">${nf.format(r.subtotal)}</td></tr>`).join("")}
          <tr><td colspan="4" class="num">Subtotal</td><td class="num"><b>${nf.format(sum("subtotal"))}</b></td></tr>
          <tr><td colspan="4" class="num">IVA 19 %</td><td class="num">${nf.format(sum("iva"))}</td></tr>
          <tr><td colspan="4" class="num"><b>Total a pagar</b></td><td class="num"><b>${nf.format(sum("total"))}</b></td></tr></table></div></div>
        <div class="stack"><div class="sheetwrap"><table class="sheet"><thead><tr><th></th><th>id_linea</th><th>id_factura</th><th>id_cliente</th><th>sku</th><th>cantidad</th><th>subtotal</th><th>estado</th></tr></thead><tbody>
          ${F.map((r,i)=>`<tr><td class="rn">${i+2}</td><td>${r.id_linea}</td><td>${r.id_factura}</td><td>${r.id_cliente}</td><td>${r.sku}</td><td class="num">${r.cantidad}</td><td class="num">${nf.format(r.subtotal)}</td><td>${r.estado}</td></tr>`).join("")}</tbody></table></div>
          <div class="callout tip"><span class="k">Lo que esto significa al analizar</span><ul class="plain small"><li>Contar filas cuenta <b>líneas</b>, no facturas: aquí habría 3.</li><li>El cliente y el vendedor se repiten en cada fila: es normal.</li><li>La tabla guarda códigos (<code>${f0.id_cliente}</code>, <code>${F[0].sku}</code>); los nombres viven en los maestros.</li></ul></div></div>
      </div>
    </section>

    <section class="block"><div class="sechead"><span class="eyebrow">4 · Las tablas</span><h2>Seis tablas y una exportación</h2>
      <p class="muted read">La primera pregunta ante cualquier tabla es <b>qué representa una fila</b>. Esa respuesta se llama granularidad, y define qué se puede contar y sumar.</p></div>
      <div class="scroll"><table class="datatbl"><tr><th>Tabla</th><th>Una fila es…</th><th style="text-align:right">Filas</th><th style="text-align:right">Columnas</th><th>Llave</th><th>Área responsable</th></tr>
      ${TABLAS.map(t=>{ const n={ventas:D.n_lineas,clientes:D.conteos.clientes,productos:D.conteos.productos,vendedores:D.conteos.vendedores,sedes:D.conteos.sedes,metas:D.conteos.metas,"exportación ERP":D.conteos.erp}[t[0]];
        return `<tr><td class="mono"><b>${t[0]}</b><br><span class="muted">${t[2]}</span></td><td>${t[1]}</td><td class="num">${nf.format(n)}</td><td class="num">${t[5]}</td><td class="mono">${t[3]}</td><td>${t[4]}</td></tr>` }).join("")}</table></div>
    </section>

    <section class="block"><div class="sechead"><span class="eyebrow">5 · Diccionario de la tabla ventas</span><h2>Qué significa cada columna y dónde suele fallar</h2></div>
      <div class="scroll"><table class="datatbl"><tr><th>Columna</th><th>Tipo</th><th>Qué significa</th><th>Quién la produce</th><th>Error típico</th></tr>
      ${DICC.map(d=>`<tr><td class="mono"><b>${d[0]}</b></td><td>${d[1]}</td><td>${d[2]}</td><td>${d[3]}</td><td class="muted">${d[4]}</td></tr>`).join("")}</table></div>
    </section>

    <section class="block"><div class="sechead"><span class="eyebrow">6 · Los maestros y el modelo</span><h2>Un hecho en el centro, maestros alrededor</h2>
      <p class="muted read">Es el modelo en estrella que encontrarás en Power BI y en cualquier bodega de datos. Las líneas son las llaves que permiten cruzar.</p></div>
      <div class="panel scroll">${modelo()}</div>
      <div class="grid3" style="margin-top:12px">${MAESTROS.map(m=>`<div class="panel"><b class="mono">${m[0]}</b><ul class="plain small muted" style="margin-top:6px">${m[1].map(c=>`<li>${c}</li>`).join("")}</ul></div>`).join("")}</div>
    </section>

    <section class="block"><div class="sechead"><span class="eyebrow">7 · Palabras clave</span><h2>El vocabulario mínimo</h2></div>
      <div class="grid2">${PALABRAS.map(p=>`<div class="panel"><b>${p[0]}</b><p class="muted small" style="margin-top:4px">${p[1]}</p></div>`).join("")}</div>
    </section>

    <section class="block" style="padding-bottom:40px"><div class="sechead"><span class="eyebrow">8 · Archivos</span><h2>Descarga los datos</h2>
      <p class="muted read">Los mismos datos están en CSV, en Excel y dentro de este tablero. Se generan con un script de semilla fija, así que el tablero, los cuadernos y tu libro de Excel dan las mismas cifras.</p></div>
      <div class="scroll"><table class="datatbl"><tr><th>Archivo</th><th>Contenido</th></tr>${files.map(f=>`<tr><td><a class="mono" href="${GH}/${f[0].endsWith("/")?"tree":"blob"}/main/data/${f[0]}" target="_blank" rel="noopener">${f[0]}</a></td><td>${f[1]}</td></tr>`).join("")}</table></div>
      <div class="row" style="margin-top:14px"><a class="btn primary" href="${colabURL("00_conoce_la_empresa.ipynb")}" target="_blank" rel="noopener">Recorrer los datos en Colab</a><a class="btn" href="#inicio">Hacer el diagnóstico</a></div>
    </section>
  </div>`;
}

function modelo(){
  const box=(x,y,t,k,center)=>`<g><rect x="${x}" y="${y}" width="170" height="${center?96:62}" rx="8" fill="${center?"var(--brand)":"var(--surface-2)"}" stroke="${center?"var(--brand)":"var(--line)"}"></rect>
    <text x="${x+14}" y="${y+24}" style="font-family:var(--f-display); font-size:14px; font-weight:600; fill:${center?"var(--on-brand)":"var(--ink)"}">${t}</text>
    <text x="${x+14}" y="${y+44}" style="font-family:var(--f-mono); font-size:11px; fill:${center?"var(--cyan)":"var(--muted)"}">${k}</text>${center?`<text x="${x+14}" y="${y+62}" style="font-family:var(--f-mono); font-size:11px; fill:var(--cyan)">${nf.format(D.n_lineas)} filas</text><text x="${x+14}" y="${y+80}" style="font-family:var(--f-mono); font-size:11px; fill:var(--cyan)">una por línea de factura</text>`:""}</g>`;
  const ln=(x1,y1,x2,y2)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--muted)" stroke-width="1.5"></line>`;
  return `<svg viewBox="0 0 760 330" width="100%" style="min-width:600px" role="img" aria-label="Modelo en estrella: Ventas unida a Clientes, Productos, Vendedores, Sedes y Metas">
    ${ln(380,165,105,61)}${ln(380,165,655,61)}${ln(380,165,105,271)}${ln(380,165,655,271)}${ln(380,165,380,300)}
    ${box(20,30,"Clientes","id_cliente")}${box(570,30,"Productos","sku")}${box(20,240,"Vendedores","id_vendedor")}${box(570,240,"Sedes","id_sede")}
    ${box(295,117,"Ventas","id_linea · id_factura",true)}
    <g><rect x="315" y="268" width="130" height="50" rx="8" fill="var(--surface-2)" stroke="var(--line)"></rect><text x="329" y="289" style="font-family:var(--f-display); font-size:14px; font-weight:600; fill:var(--ink)">Metas</text><text x="329" y="307" style="font-family:var(--f-mono); font-size:10.5px; fill:var(--muted)">id_sede + año + mes</text></g>
  </svg>`;
}
