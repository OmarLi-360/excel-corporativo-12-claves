/* ======================================================================
   CONTENIDO · Curso rápido de Google Colab (#colab)
   Presenta el cuaderno curso_rapido_colab.ipynb con la anatomía de Colab.
   ====================================================================== */

/* Maqueta de la pantalla de Colab: cada parte está marcada con su número y unida
   con una línea a su explicación. Al pasar el mouse (o tocar) una parte o su
   explicación, ambas se resaltan. */
const PARTES_COLAB = [
  {t:"Crear celdas", d:"Botones + Código y + Texto"},
  {t:"Celda de texto", d:"Explica; doble clic para editar"},
  {t:"Botón ▶ ejecutar", d:"O Shift + Enter"},
  {t:"Orden de ejecución", d:"[2]: se ejecutó de segunda"},
  {t:"Celda de código", d:"Lo que Colab va a hacer"},
  {t:"Resultado", d:"Aparece debajo de la celda"},
  {t:"Formulario", d:"Cambia controles y ejecuta ▶"},
  {t:"Mensaje de error", d:"La última línea dice qué pasó"},
];
function anatomiaColab(){
  const W=820, H=490, LX=592, GX=560;
  const t=(x,y,s,o={})=>`<text x="${x}" y="${y}" ${o.a?`text-anchor="${o.a}"`:""} style="font-size:${o.z||12}px;${o.b?"font-weight:600;":""}${o.mono?"font-family:var(--f-mono);":""}fill:${o.f||"var(--ink)"}">${esc(s)}</text>`;
  const num=(x,y,n)=>`<g class="cp-num" data-p="${n}"><circle cx="${x}" cy="${y}" r="10"/>${t(x,y+4,String(n),{a:"middle",z:11,b:true,f:"#fff"})}</g>`;
  /* zona resaltable de cada parte: rectángulo punteado + número en la esquina */
  const zona=(n,x,y,w,h,r=8)=>`<rect class="cp-zone" data-p="${n}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`+num(x,y,n);
  /* línea guía desde la parte (ax,ay) hasta su explicación, con codos por zonas libres */
  const guia=(n,pts)=>`<polyline class="cp-line" data-p="${n}" points="${pts.map(p=>p.join(",")).join(" ")}"/><circle class="cp-dot" data-p="${n}" cx="${pts[0][0]}" cy="${pts[0][1]}" r="3.5"/>`;
  const LY = [64, 123, 172, 214, 250, 300, 360, 452];   // altura de cada explicación
  let s = `<rect x="0" y="0" width="${W}" height="${H}" rx="12" fill="var(--surface)" stroke="var(--line)"/>
    <rect x="1" y="1" width="${LX-30}" height="38" rx="11" fill="var(--surface-2)"/>
    ${t(16,25,"curso_rapido_colab.ipynb",{b:true})}${t(210,25,"Archivo  Editar  Ver  Insertar  Entorno de ejecución",{z:11,f:"var(--muted)"})}
    <rect x="16" y="52" width="76" height="24" rx="6" fill="var(--surface)" stroke="var(--line)"/>${t(54,68,"+ Código",{a:"middle",z:11.5})}
    <rect x="100" y="52" width="70" height="24" rx="6" fill="var(--surface)" stroke="var(--line)"/>${t(135,68,"+ Texto",{a:"middle",z:11.5})}
    ${t(84,118,"Lección 3 · Celdas de código",{z:16,b:true})}
    ${t(84,138,"Una celda de código se ejecuta y muestra su resultado.",{z:12})}
    <rect x="76" y="186" width="444" height="72" rx="6" fill="var(--surface-2)" stroke="var(--line)"/>
    <circle cx="44" cy="204" r="13" fill="var(--s1)"/><path d="M40,197 L51,204 L40,211 Z" fill="#fff"/>
    ${t(44,240,"[2]",{a:"middle",z:11,mono:true,f:"var(--muted)"})}
    ${t(90,208,"precio = 21900",{mono:true})}${t(90,226,"total = precio * 40",{mono:true})}${t(90,244,"total",{mono:true})}
    ${t(90,300,"876000",{mono:true})}
    <rect x="76" y="326" width="444" height="88" rx="6" fill="var(--surface-2)" stroke="var(--line)"/>
    <circle cx="44" cy="344" r="13" fill="var(--s1)"/><path d="M40,337 L51,344 L40,351 Z" fill="#fff"/>
    ${t(90,350,"Calcular un pedido",{b:true,z:13})}${t(90,368,"Mostrar código",{z:10.5,f:"var(--s1)"})}
    ${t(318,350,"sede:",{z:11.5})}<rect x="356" y="337" width="150" height="20" rx="4" fill="var(--surface)" stroke="var(--line)"/>${t(364,351,"Bogotá  ▾",{z:11.5})}
    ${t(296,378,"descuento:",{z:11.5})}<line x1="366" x2="506" y1="374" y2="374" stroke="var(--line)" stroke-width="4" stroke-linecap="round"/><circle cx="410" cy="374" r="7" fill="var(--s1)"/>
    ${t(90,402,"Pedido de Bogotá: 40 resmas…",{mono:true,z:11})}
    <rect x="76" y="436" width="444" height="32" rx="6" fill="var(--bad-soft)" stroke="var(--bad)"/>
    ${t(90,457,"NameError: name 'iva' is not defined",{mono:true,z:11.5,f:"var(--bad)"})}`;
  /* líneas guía (debajo de las zonas) */
  s += guia(1,[[170,64],[LX-12,LY[0]]])
     + guia(2,[[520,123],[LX-12,LY[1]]])
     + guia(3,[[44,190],[44,172],[LX-12,LY[2]]])
     + guia(4,[[44,247],[44,270],[GX,270],[GX,LY[3]],[LX-12,LY[3]]])
     + guia(5,[[520,250],[GX-14,250],[LX-12,LY[4]]])
     + guia(6,[[150,296],[LX-12,LY[5]]])
     + guia(7,[[520,360],[LX-12,LY[6]]])
     + guia(8,[[520,452],[LX-12,LY[7]]]);
  /* zonas resaltables con su número */
  s += zona(1,12,48,162,32) + zona(2,74,96,450,54) + zona(3,27,187,34,34,17) + zona(4,28,226,32,22,4)
     + zona(5,72,182,452,80) + zona(6,82,282,120,26,4) + zona(7,72,322,452,96) + zona(8,72,432,452,40);
  /* explicaciones */
  PARTES_COLAB.forEach((p,i)=>{ const y=LY[i];
    s += `<g class="cp-item" data-p="${i+1}" tabindex="0" role="button" aria-label="${esc(p.t+": "+p.d)}">
      <rect x="${LX-6}" y="${y-17}" width="${W-LX-6}" height="36" rx="8" class="cp-hit"/>
      ${num(LX+8,y,i+1)}${t(LX+24,y-2,p.t,{b:true,z:12})}${t(LX+24,y+13,p.d,{z:10,f:"var(--muted)"})}</g>` });
  return `<svg class="cp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Partes de la pantalla de Google Colab">${s}</svg>
    <p class="muted small" style="margin:8px 0 0">Pasa el mouse o toca una explicación para resaltar su parte en la pantalla.</p>`;
}
function wireAnatomia(root){
  const svg = root.querySelector(".cp-svg"); if(!svg) return;
  const on = n => { svg.classList.toggle("cp-focus", !!n); svg.querySelectorAll("[data-p]").forEach(e=>e.classList.toggle("on", e.dataset.p===String(n))) };
  let fijo = null;   // el clic (o toque) deja una parte resaltada; el mouse resalta de paso
  svg.querySelectorAll(".cp-item, .cp-zone").forEach(g=>{
    g.addEventListener("mouseenter", ()=>on(g.dataset.p)); g.addEventListener("mouseleave", ()=>on(fijo));
    g.addEventListener("focus", ()=>on(g.dataset.p)); g.addEventListener("blur", ()=>on(fijo));
    g.addEventListener("click", ()=>{ fijo = fijo===g.dataset.p ? null : g.dataset.p; on(fijo) });
  });
}

const PODERES = [
  {n:"pandas", apodo:"pd", p:"Leer CSV y Excel, filtrar, unir y resumir tablas de millones de filas.", x:"Tablas, filtros, BUSCARX y tablas dinámicas"},
  {n:"plotly", apodo:"px", p:"Gráficos interactivos: zoom, valores al pasar el mouse y exportación como página web.", x:"Insertar › Gráfico"},
  {n:"numpy", apodo:"np", p:"Cálculos rápidos con muchos números a la vez.", x:"Funciones matemáticas"},
  {n:"openpyxl", apodo:"—", p:"Leer y escribir libros de Excel con varias hojas y formatos.", x:"Abrir y guardar .xlsx"},
];

function viewColab(){
  const nb = colabURL("curso_rapido_colab.ipynb");
  app.innerHTML = `<div class="wrap">
    <div class="mhead"><a href="#laboratorio" class="muted small">← Laboratorio</a>
      <span class="eyebrow">Antes del laboratorio · 25 min · Sin saber programar</span><h1>Curso rápido de Google Colab</h1>
      <p class="muted read" style="font-size:1.1rem">Colab es un cuaderno en el navegador donde el texto explica y el código hace el trabajo. En 25 minutos entiendes cómo leer un cuaderno, cómo ejecutarlo y qué son las librerías, los «poderes» que le permiten leer un archivo y dibujar un gráfico en dos líneas.</p>
      <div class="row" style="margin-top:12px"><a class="btn primary" href="${nb}" target="_blank" rel="noopener">Abrir el curso en Colab</a><a class="btn" href="#taller-0">Siguiente: Taller 0</a></div></div>
    ${docenteBox({duracion:[["Demostración de la pantalla",5,"Proyecta la anatomía y nombra cada parte."],["Lecciones 1 a 5",12,"Cada estudiante en su copia: texto, código, errores y formularios."],["Lección 6: librerías",6,"Leer, resumir y graficar con tres celdas."],["Retos",2,"Tres preguntas de repaso."]],
      preguntas:["¿En qué se parece una celda de código a una celda de Excel con fórmula?","¿Qué pasa si ejecutan una celda del medio sin haber ejecutado las de arriba?","¿Qué complemento o aplicación usan que se parezca a una librería?"],
      errores:["Trabajar en el cuaderno original y perder los cambios: insiste en «Guardar una copia en Drive».","Ejecutar celdas sueltas y ver NameError: enseña «Ejecutar todas».","Asustarse con el texto rojo: lean juntos la última línea."],
      cierre:"No van a programar: van a leer cuadernos, cambiar opciones e interpretar resultados."})}

    <section class="block" style="border-top:0; padding-top:0"><div class="sechead"><h2>Las partes de la pantalla</h2></div>
      <div class="panel scroll">${anatomiaColab()}</div></section>

    <section class="block"><div class="sechead"><h2>Dos clases de celda</h2></div>
      <div class="scroll"><table class="datatbl"><tr><th></th><th>Celda de texto</th><th>Celda de código</th></tr>
        <tr><td><b>Para qué</b></td><td>Explicar: títulos, párrafos, tablas e imágenes.</td><td>Hacer: calcular, leer archivos, dibujar gráficos.</td></tr>
        <tr><td><b>Cómo se edita</b></td><td>Doble clic. Usa símbolos sencillos (Markdown): <code># Título</code>, <code>**negrita**</code>, <code>* viñeta</code>.</td><td>Clic dentro del bloque gris.</td></tr>
        <tr><td><b>Cómo se usa</b></td><td>Se lee. Shift + Enter cierra la edición.</td><td>Se ejecuta con ▶, Ctrl + Enter o Shift + Enter, y el resultado aparece debajo.</td></tr>
        <tr><td><b>Parecido en Excel</b></td><td>Un cuadro de texto con instrucciones.</td><td>Una celda con fórmula. Un nombre como <code>precio = 21900</code> es como ponerle nombre a una celda.</td></tr>
      </table></div>
      <div class="grid2" style="margin-top:14px">
        <div class="callout"><span class="k">El orden importa</span><p>Las celdas recuerdan solo lo que ya se ejecutó. Abre siempre los cuadernos del curso con <b>Entorno de ejecución › Ejecutar todas</b> (Ctrl + F9).</p></div>
        <div class="callout"><span class="k">Los formularios</span><p>En los cuadernos del curso el código está oculto: solo ves un título y controles a la derecha. Cambia una opción y vuelve a ejecutar la celda con ▶.</p></div>
      </div></section>

    <section class="block"><div class="sechead"><h2>Librerías: los poderes de Colab</h2><p class="muted read">Python, el lenguaje de Colab, solo sabe hacer lo básico. Las librerías son paquetes de herramientas que otras personas construyeron y comparten gratis, como las aplicaciones del celular o los complementos de Excel. Se activan al comienzo del cuaderno con <code>import</code> y un apodo corto.</p></div>
      <div class="grid2">${PODERES.map(p=>`<div class="panel"><div class="row" style="justify-content:space-between"><b class="mono">${p.n}</b>${p.apodo!=="—"?`<span class="tag">apodo: ${p.apodo}</span>`:""}</div><p class="small" style="margin:8px 0 4px">${p.p}</p><p class="muted small" style="margin:0">En Excel: ${p.x}</p></div>`).join("")}</div>
      <pre class="code" style="margin-top:14px">import pandas as pd                                   # activar el poder de las tablas
ventas = pd.read_csv("ventas.csv")                    # leer 17.106 filas
ventas.groupby("canal")["subtotal"].sum()             # resumir como una tabla dinámica</pre></section>

    <section class="block"><div class="sechead"><h2>Cuando algo falla</h2></div>
      <div class="scroll"><table class="datatbl"><tr><th>Última línea del error</th><th>Qué significa</th><th>Qué hacer</th></tr>
        <tr><td class="mono">NameError</td><td>Se usa algo que no se ha calculado.</td><td>Entorno de ejecución › Ejecutar todas.</td></tr>
        <tr><td class="mono">FileNotFoundError</td><td>No encuentra el archivo.</td><td>Revisa el nombre y que esté en la carpeta.</td></tr>
        <tr><td class="mono">ModuleNotFoundError</td><td>Falta una librería.</td><td>Ejecuta la celda que la instala (<code>!pip install …</code>).</td></tr>
        <tr><td>La celda gira y no termina</td><td>Está trabajando o se colgó.</td><td>Espera; si no termina, Entorno de ejecución › Interrumpir.</td></tr>
        <tr><td>Nada funciona</td><td>La sesión quedó en mal estado.</td><td>Entorno de ejecución › Reiniciar sesión y luego Ejecutar todas.</td></tr>
      </table></div>
      <div class="callout tip" style="margin-top:14px"><span class="k">Guardar y cuidar los datos</span><p>Tu copia vive en Google Drive, en la carpeta <i>Colab Notebooks</i>. Los archivos que subes a la sesión son temporales y se borran al desconectarse. No subas datos personales reales de clientes o empleados a cuentas personales: los datos de este curso son ficticios.</p></div>
    </section>

    <section class="block" style="padding-bottom:40px"><div class="row"><a class="btn primary" href="${nb}" target="_blank" rel="noopener">Abrir el curso en Colab</a><a class="btn" href="#taller-0">Siguiente: Taller 0 · Monta tu laboratorio</a></div></section>
  </div>`;
  wireAnatomia(app);
}
