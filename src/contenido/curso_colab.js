/* ======================================================================
   CONTENIDO · Curso rápido de Google Colab (#colab)
   Presenta el cuaderno curso_rapido_colab.ipynb con la anatomía de Colab.
   ====================================================================== */

/* Maqueta de la pantalla de Colab con llamadas numeradas */
function anatomiaColab(){
  const W=760, H=430, t=(x,y,s,o={})=>`<text x="${x}" y="${y}" ${o.a?`text-anchor="${o.a}"`:""} style="font-size:${o.z||12}px;${o.b?"font-weight:600;":""}${o.mono?"font-family:var(--f-mono);":""}fill:${o.f||"var(--ink)"}">${esc(s)}</text>`;
  const badge=(x,y,n)=>`<circle cx="${x}" cy="${y}" r="11" fill="var(--s3)"/>`+t(x,y+4,String(n),{a:"middle",z:12,b:true,f:"#fff"});
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Partes de la pantalla de Google Colab">
    <rect x="0" y="0" width="${W}" height="${H}" rx="12" fill="var(--surface)" stroke="var(--line)"/>
    <rect x="0" y="0" width="${W}" height="40" rx="12" fill="var(--surface-2)"/>
    ${t(16,25,"curso_rapido_colab.ipynb",{b:true})}${t(220,25,"Archivo   Editar   Ver   Insertar   Entorno de ejecución",{z:11.5,f:"var(--muted)"})}
    <rect x="16" y="50" width="78" height="24" rx="6" fill="var(--surface)" stroke="var(--line)"/>${t(55,66,"+ Código",{a:"middle",z:11.5})}
    <rect x="102" y="50" width="70" height="24" rx="6" fill="var(--surface)" stroke="var(--line)"/>${t(137,66,"+ Texto",{a:"middle",z:11.5})}
    ${badge(190,62,1)}${t(208,66,"Crear celdas nuevas",{z:11.5,f:"var(--muted)"})}

    ${t(40,108,"Lección 3 · Celdas de código",{z:17,b:true})}
    ${t(40,130,"Una celda de código se ejecuta y muestra su resultado debajo.",{z:12})}
    ${badge(560,118,2)}${t(578,122,"Celda de texto: se lee",{z:11.5,f:"var(--muted)"})}

    <rect x="56" y="150" width="480" height="70" rx="6" fill="var(--surface-2)" stroke="var(--line)"/>
    <circle cx="36" cy="168" r="12" fill="var(--s1)"/><path d="M32,162 L42,168 L32,174 Z" fill="#fff"/>
    ${t(36,198,"[2]",{a:"middle",z:10.5,mono:true,f:"var(--muted)"})}
    ${t(68,172,"precio = 21900",{mono:true,z:12})}${t(68,190,"total = precio * 40",{mono:true,z:12})}${t(68,208,"total",{mono:true,z:12})}
    ${t(68,240,"876000",{mono:true,z:12})}
    ${badge(560,168,3)}${t(578,172,"Botón ▶: ejecutar (Shift + Enter)",{z:11.5,f:"var(--muted)"})}
    ${badge(560,200,4)}${t(578,204,"[2]: orden en que se ejecutó",{z:11.5,f:"var(--muted)"})}
    ${badge(560,238,5)}${t(578,242,"Resultado de la celda",{z:11.5,f:"var(--muted)"})}

    <rect x="56" y="268" width="480" height="96" rx="6" fill="var(--surface-2)" stroke="var(--line)"/>
    <circle cx="36" cy="286" r="12" fill="var(--s1)"/><path d="M32,280 L42,286 L32,292 Z" fill="#fff"/>
    ${t(68,292,"Calcular un pedido con formulario",{b:true,z:13})}${t(68,312,"Mostrar código",{z:10.5,f:"var(--s1)"})}
    ${t(330,292,"sede:",{z:11.5})}<rect x="372" y="279" width="150" height="20" rx="4" fill="var(--surface)" stroke="var(--line)"/>${t(380,293,"Bogotá  ▾",{z:11.5})}
    ${t(330,326,"descuento:",{z:11.5})}<line x1="400" x2="520" y1="322" y2="322" stroke="var(--line)" stroke-width="4" stroke-linecap="round"/><circle cx="440" cy="322" r="7" fill="var(--s1)"/>
    ${t(68,352,"Pedido de Bogotá: 40 resmas con 5 % de descuento…",{mono:true,z:11})}
    ${badge(560,300,6)}${t(578,296,"Formulario: el código está",{z:11.5,f:"var(--muted)"})}${t(578,312,"oculto; cambias los controles",{z:11.5,f:"var(--muted)"})}

    <rect x="16" y="384" width="520" height="30" rx="6" fill="var(--bad-soft)" stroke="var(--bad)"/>
    ${t(28,404,"NameError: name 'iva' is not defined",{mono:true,z:11.5,f:"var(--bad)"})}
    ${badge(560,399,7)}${t(578,403,"Error: lee la última línea",{z:11.5,f:"var(--muted)"})}
  </svg>`;
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
}
