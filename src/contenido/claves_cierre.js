/* ======================================================================
   CONTENIDO · Claves 10, 11 y 12 (Control y comunicación)
   Misma plantilla que MOD[1]; simuladores al final del archivo.
   ====================================================================== */

/* ---------- datos derivados que comparten simuladores ---------- */
const CIERRE = (()=>{
  const sedes = DM.ciudad, y24 = anioIdx(2024), y25 = anioIdx(2025);
  const venta = (anioI, conAnul)=>{ const v = sedes.map(()=>0);
    for(let i=0;i<NL;i++){ if(C.anio[i]!==anioI) continue; if(!conAnul && C.estado[i]===2) continue; v[C.ciudad[i]] += C.subtotal[i] }
    return v };
  const v25 = venta(y25,false), v25a = venta(y25,true), v24 = venta(y24,false);
  const meta = sedes.map(s=>D.metas2025[s]);
  return {sedes, v25, v25a, v24, meta, total25: v25.reduce((a,b)=>a+b,0)};
})();
const pct1 = v => (v*100).toFixed(1).replace(".",",")+" %";

/* ---------------------------------------------------------------------
   CLAVE 10 · Fórmulas de matriz dinámica
   --------------------------------------------------------------------- */
MOD[10] = {
 minutos:50, notebook:"10_matriz_dinamica.ipynb",
 objetivos:["Entender qué es un resultado que se «derrama» y cómo se referencia con #.","Combinar FILTRAR, UNICOS, ORDENAR y TOMAR para crear listas que se actualizan solas.","Escribir fórmulas largas de forma legible con LET."],
 entender:`
  <p>En Excel 365 una fórmula puede devolver <b>muchos valores</b>. El resultado se <b>derrama</b> hacia las celdas vecinas y se marca con un borde azul. Solo la primera celda tiene la fórmula; las demás muestran el resultado en gris dentro de la barra de fórmulas.</p>
  <ol><li><b>FILTRAR</b>(matriz; condición): devuelve las filas que cumplen. Varias condiciones se multiplican: <code>(tVentas[ciudad]=B2)*(tVentas[anio]=B3)</code> equivale a «y».</li>
  <li><b>UNICOS</b>(matriz): quita los repetidos. Sirve para listas de clientes, productos o sedes.</li>
  <li><b>ORDENAR</b>(matriz; columna; -1): ordena; -1 es de mayor a menor.</li>
  <li><b>TOMAR</b>(matriz; n): se queda con las primeras n filas.</li>
  <li><b>APILARH</b>(a; b): pone dos resultados lado a lado.</li>
  <li><b>LET</b>(nombre; valor; …; cálculo): da nombre a los pasos intermedios para que la fórmula se pueda leer.</li></ol>
  <p>Para usar todo un resultado derramado se escribe la celda de inicio con <b>#</b>: <code>D6#</code>. Si la fuente crece, D6# crece con ella. Si alguna celda del camino tiene contenido, Excel muestra <b>#¡DESBORDAMIENTO!</b>: hay que despejar el espacio, no borrar la fórmula.</p>
  <p>Estas fórmulas reemplazan el «filtrar, copiar y pegar»: la lista resultante nunca queda desactualizada.</p>`,
 brechaTxt:"Una lista filtrada que se copia y pega es una foto: en cuanto cambia la fuente, la lista miente y nadie lo nota.",
 excel:[
  ["Abre la hoja de práctica", "En <code>Andina_listo_para_dinamicas.xlsx</code>, hoja <b>Top_Clientes</b>: la sede está en B2 (lista desplegable), el año en B3 y cuántos clientes mostrar en B4."],
  ["Lista los clientes de la sede", "En D6: <code>=UNICOS(FILTRAR(tVentas[cliente];(tVentas[ciudad]=$B$2)*(tVentas[anio]=$B$3)*(tVentas[estado]&lt;&gt;\"Anulada\")))</code>. Observa el borde azul: es el rango derramado."],
  ["Calcula la venta de cada cliente", "En E6: <code>=SUMAR.SI.CONJUNTO(tVentas[subtotal];tVentas[cliente];D6#;tVentas[ciudad];$B$2;tVentas[anio];$B$3;tVentas[estado];\"&lt;&gt;Anulada\")</code>. Como el criterio es <code>D6#</code>, el resultado también se derrama."],
  ["Ordena y toma los primeros", "En A7: <code>=TOMAR(ORDENAR(APILARH(D6#;E6#);2;-1);$B$4)</code>. Ordena por la columna 2 (venta) de mayor a menor y se queda con los primeros."],
  ["Hazla legible con LET", "Reemplaza A7 por <code>=LET(c;D6#;v;E6#;TOMAR(ORDENAR(APILARH(c;v);2;-1);$B$4))</code>. Hace lo mismo, pero cada parte tiene nombre."],
  ["Prueba que se actualiza sola", "Cambia la sede en B2 y el número en B4. Luego escribe cualquier cosa en A10 para ver <b>#¡DESBORDAMIENTO!</b>, y bórrala para que vuelva el resultado."],
 ],
 colabQue:"Ves el top de clientes que devuelve la fórmula para la sede y el año que elijas, cuántos clientes concentran la mitad de la venta y cuántos clientes únicos compra cada sede por año.",
 ia:[
  {t:"Construir la fórmula paso a paso", p:`Trabajo en Excel 365 en español (separador ;). Tengo una Tabla tVentas con columnas cliente, ciudad, anio, estado y subtotal.
Quiero una lista de los 10 clientes con más venta neta de la sede escrita en B2 y el año en B3, sin facturas anuladas, que se actualice sola.
Dame la fórmula con LET, explica cada paso y dime qué error aparece si hay celdas ocupadas donde se derrama.`},
  {t:"Traducir una fórmula a palabras", p:`Explícame en palabras simples, paso por paso, qué hace esta fórmula de Excel 365:
=LET(c;D6#;v;E6#;TOMAR(ORDENAR(APILARH(c;v);2;-1);$B$4))
y qué significa el símbolo # en D6#.`},
 ],
 iaCuidado:"Las IA mezclan a menudo nombres de funciones en inglés y en español, o usan comas en lugar de punto y coma. Si Excel no reconoce la fórmula, revisa primero eso.",
 quiz:[
  {q:"¿Qué significa D6# en una fórmula?",
   o:["La celda D6 fija","Todo el rango que se derramó desde D6","La columna D completa","Un error de referencia"], a:1,
   w:"# toma el resultado completo derramado desde D6, con el tamaño que tenga en cada momento."},
  {q:"Una fórmula muestra #¡DESBORDAMIENTO!. ¿Qué haces?",
   o:["Borrar la fórmula","Despejar las celdas donde debe derramarse el resultado","Cambiarla por BUSCARV","Combinar las celdas"], a:1,
   w:"El resultado no cabe porque alguna celda del camino tiene contenido. Al despejarla, el resultado aparece."},
  {q:"¿Cómo se escriben dos condiciones «y» dentro de FILTRAR?",
   o:["(cond1)+(cond2)","(cond1)*(cond2)","Y(cond1;cond2)","cond1;cond2"], a:1,
   w:"Cada condición devuelve 1 o 0; multiplicarlas da 1 solo cuando ambas se cumplen. La suma equivale a «o»."},
  {q:"¿Para qué sirve LET?",
   o:["Para que la fórmula sea más rápida de escribir","Para dar nombre a los pasos intermedios y hacer legible la fórmula","Para fijar referencias","Para validar datos"], a:1,
   w:"LET nombra cada parte del cálculo. Quien revise la fórmula entiende qué hace cada paso."},
 ],
 docente:{
  duracion:[["Apertura: la lista copiada que quedó vieja",7,"Muestra una lista pegada y luego cambia la fuente."],
            ["Simulador: paso a paso",13,"Recorran los cuatro pasos y provoquen el #¡DESBORDAMIENTO!."],
            ["Excel: hoja Top_Clientes",20,"Fórmulas en D6, E6 y A7; luego la versión con LET."],
            ["Autoevaluación",10,"Cuestionario individual."]],
  preguntas:["¿Qué listas de su trabajo hoy se copian y pegan?","¿Qué pasa con D6# si llegan ventas de un cliente nuevo?","¿Cuándo preferirían una tabla dinámica en lugar de estas fórmulas?"],
  errores:["Escribir la fórmula en una celda con datos debajo: #¡DESBORDAMIENTO!.","Usar , en lugar de ; o nombres en inglés.","Referenciar D6:D50 en lugar de D6#."],
  cierre:"Una lista que se calcula no se desactualiza; una lista que se pega, sí."},
};

/* ---------------------------------------------------------------------
   CLAVE 11 · Gráficos y narrativa de resultados
   --------------------------------------------------------------------- */
MOD[11] = {
 minutos:50, notebook:"11_graficos_y_narrativa.ipynb",
 objetivos:["Elegir el gráfico según la pregunta, no según el menú.","Escribir títulos que digan el hallazgo.","Armar un informe de una página: mensaje, evidencia y siguiente paso."],
 entender:`
  <p>Un gráfico de informe responde <b>una pregunta</b> para alguien que va a decidir. Antes de abrir el menú de gráficos, escribe la pregunta y el mensaje en una frase. Cada pregunta tiene su forma (en la sección <a href="#graficos">Gráficos para informes</a> están los 12 más usados):</p>
  <ol><li><b>Comparar</b> categorías: barras horizontales ordenadas.</li>
  <li><b>Evolución</b> en el tiempo: líneas.</li>
  <li><b>Cumplimiento</b>: barras de real con una marca de meta, o barras de % con una línea en 100 %.</li>
  <li><b>Composición</b> con pocas partes: barras apiladas al 100 % o una dona con máximo cuatro partes.</li></ol>
  <p>Después vienen las decisiones que hacen que se entienda en diez segundos: <b>ordenar</b> las barras, usar <b>un color de énfasis</b> solo para lo que importa y gris para el resto, poner <b>etiquetas directas</b> en lugar de leyendas, y escribir un <b>título que diga el hallazgo</b>: «Barranquilla quedó 12 puntos debajo de su meta» en lugar de «Ventas por sede».</p>
  <p>La <b>narrativa</b> completa del informe sigue tres pasos: qué pasó (el hallazgo con su cifra), por qué pasó (la evidencia) y qué sigue (una recomendación concreta).</p>`,
 brechaTxt:"El gráfico que sale por defecto rara vez responde la pregunta: obliga al lector a buscar el mensaje, y cada lector encuentra uno distinto.",
 excel:[
  ["Prepara los datos", "En <code>Andina_listo_para_dinamicas.xlsx</code>, arma una tabla dinámica con ciudad en Filas, suma de subtotal (sin anuladas, año 2025) y suma de meta desde tMetas. Agrega el cumplimiento como columna calculada fuera de la dinámica o con una medida."],
  ["Elige la forma por la pregunta", "La pregunta es «¿quién cumplió la meta?»: <b>Insertar › Gráfico de barras agrupadas</b> con el cumplimiento en %. Descarta la torta: no puede mostrar una meta."],
  ["Ordena", "Ordena la columna de cumplimiento de mayor a menor. En barras horizontales Excel dibuja al revés: en <b>Formato del eje › Categorías en orden inverso</b>."],
  ["Agrega la referencia de 100 %", "Agrega una serie con el valor 100 % y cámbiala a <b>línea</b> (clic derecho › Cambiar tipo de gráfico de series), o dibuja una línea con la meta."],
  ["Enfatiza y limpia", "Colorea en gris todas las barras y en un color fuerte solo las que no cumplen (clic en una barra, otra vez clic para seleccionar solo esa, <b>Relleno</b>). Quita la leyenda y las líneas de cuadrícula; agrega etiquetas de datos."],
  ["Escribe el título del hallazgo", "Clic en el título › escribe la conclusión con su cifra. Para que cambie solo, el título puede apuntar a una celda: selecciona el título, escribe <code>=</code> en la barra de fórmulas y haz clic en la celda con el texto."],
 ],
 colabQue:"Comparas el gráfico por defecto con el que se explica solo, eliges el mensaje del informe (cumplimiento, crecimiento o mezcla de canales) y el cuaderno arma el gráfico y el título adecuados, y termina con un informe de una página con su narrativa.",
 ia:[
  {t:"Pasar de la tabla al mensaje", p:`Te paso una tabla con real, meta y cumplimiento 2025 por sede de una distribuidora:
[PEGA LA TABLA]
1) Escribe tres posibles títulos de hallazgo (máximo 12 palabras, con cifra).
2) Recomienda el tipo de gráfico de Excel 365 para el que elijas y explica por qué descartas una torta.
3) Escribe la narrativa en tres frases: qué pasó, por qué y qué sigue.`},
  {t:"Revisar un gráfico antes del comité", p:`Voy a presentar este gráfico al comité: [DESCRIBE EL GRÁFICO: tipo, orden, colores, título, leyenda].
La pregunta que debe responder es: [PREGUNTA].
Dime qué cambiarías para que se entienda en diez segundos, en orden de importancia.`},
 ],
 iaCuidado:"Una IA redacta títulos muy convincentes. Verifica cada cifra del título contra tu tabla antes de presentarlo: un título con un número equivocado es peor que un título genérico.",
 quiz:[
  {q:"¿Cuál es un título de hallazgo?",
   o:["Ventas por sede 2025","Cumplimiento de metas","Bucaramanga superó su meta en 12 puntos; Barranquilla quedó 12 abajo","Gráfico 1"], a:2,
   w:"Dice qué pasó y con qué cifra. Los demás solo nombran el tema."},
  {q:"La pregunta es «¿qué sedes cumplieron la meta?». ¿Qué gráfico usas?",
   o:["Torta de venta por sede","Barras de cumplimiento con una línea en 100 %","Líneas mensuales","Dispersión"], a:1,
   w:"La línea de 100 % hace visible quién la supera. Una torta no puede mostrar la meta."},
  {q:"¿Para qué sirve un color de énfasis?",
   o:["Para que el gráfico se vea más alegre","Para dirigir la vista a lo que importa; el resto va en gris","Para diferenciar cada sede","Para cumplir el manual de marca"], a:1,
   w:"Si todo tiene color, nada destaca. Un solo color fuerte guía la lectura."},
  {q:"¿Cuál es el orden de una narrativa de resultados?",
   o:["Datos, metodología, anexos","Qué pasó, por qué pasó, qué sigue","Gráficos y luego conclusiones","Introducción y agradecimientos"], a:1,
   w:"El lector necesita el hallazgo primero, después la evidencia y al final la acción recomendada."},
 ],
 docente:{
  duracion:[["Apertura: el gráfico por defecto",8,"Proyecta el gráfico sin ordenar y pregunta qué entienden."],
            ["Simulador: decisiones de diseño",12,"Apliquen una decisión a la vez y comenten el cambio."],
            ["Excel: gráfico de cumplimiento",20,"Del gráfico por defecto al que se explica solo."],
            ["Narrativa en tres frases",5,"Cada estudiante escribe qué pasó, por qué y qué sigue."],
            ["Autoevaluación",5,"Cuestionario individual."]],
  preguntas:["¿Qué debe entender el gerente en diez segundos?","¿Qué información quitarían del gráfico sin perder el mensaje?","¿Qué recomendarían a la sede que no cumplió?"],
  errores:["Torta con seis porciones para comparar sedes.","Título genérico: «Ventas por sede».","Colores distintos para cada barra, sin significado."],
  cierre:"El gráfico responde una pregunta; el título dice la respuesta."},
};

/* ---------------------------------------------------------------------
   CLAVE 12 · Auditoría, control y uso responsable de IA
   --------------------------------------------------------------------- */
MOD[12] = {
 minutos:55, notebook:"12_auditoria_y_control.ipynb",
 objetivos:["Usar las herramientas de auditoría de fórmulas de Excel.","Cuadrar un informe contra la fuente antes de enviarlo.","Probar con casos conocidos toda fórmula que proponga una IA."],
 entender:`
  <p>Auditar es comprobar antes de entregar. Excel trae herramientas en <b>Fórmulas › Auditoría de fórmulas</b>:</p>
  <ol><li><b>Mostrar fórmulas</b> (Ctrl + &#96;): cambia los resultados por las fórmulas. Un número escrito a mano entre fórmulas salta a la vista.</li>
  <li><b>Rastrear precedentes</b> y <b>dependientes</b>: dibuja flechas desde las celdas que alimentan una fórmula, o hacia las que dependen de ella.</li>
  <li><b>Comprobación de errores</b>: revisa las celdas con triángulo verde, como un número guardado como texto, una fórmula distinta a sus vecinas o un total que omite celdas adyacentes.</li>
  <li><b>Evaluar fórmula</b>: ejecuta una fórmula paso a paso.</li></ol>
  <p>Las herramientas no lo encuentran todo. Un valor pegado del informe anterior o una fórmula con un criterio de menos no muestran ningún aviso. Para eso existen dos controles más: el <b>cuadre contra la fuente</b> (el total del informe debe ser igual al de la base, calculado por otro camino) y la <b>prueba con casos conocidos</b> (antes de usar una fórmula, compárala con tres resultados que ya sabes que son correctos).</p>
  <p>Con la IA, la regla es la misma que con un colega nuevo: puede proponer, pero lo que entregas es tu responsabilidad. No compartas datos confidenciales con herramientas no autorizadas por la empresa y guarda versiones con nombre y fecha (<code>Informe_2025-12_v2.xlsx</code>), no «final_final2».</p>`,
 brechaTxt:"La mayoría de las hojas de cálculo corporativas tiene errores. Casi ninguno se ve a simple vista: aparecen cuando alguien cuadra el total o pregunta de dónde salió una cifra.",
 excel:[
  ["Abre el informe a revisar", "En <code>Andina_listo_para_dinamicas.xlsx</code>, hoja <b>Auditoria</b>: cumplimiento 2025 por sede. Tiene cinco errores sembrados."],
  ["Mira las fórmulas", "<b>Fórmulas › Mostrar fórmulas</b> (Ctrl + `). Recorre la columna B: ¿todas las celdas tienen la misma fórmula? ¿Hay algún número escrito a mano?"],
  ["Usa la comprobación de errores", "<b>Fórmulas › Comprobación de errores</b>. Revisa cada aviso: número como texto, fórmula incoherente con las vecinas y total que omite celdas."],
  ["Rastrea precedentes", "Selecciona D10 y el total B11 › <b>Rastrear precedentes</b>. ¿Las flechas llegan a las celdas correctas?"],
  ["Cuadra contra la fuente", "Mira las filas 14 y 15: el total del informe debe ser igual a la venta neta 2025 de tVentas. Si hay diferencia, explica de dónde sale. La suma de las participaciones también debe dar 100 %."],
  ["Prueba la fórmula de la IA", "B8 tiene un comentario: la fórmula la sugirió un asistente de IA. Compárala con una tabla dinámica de Barranquilla 2025 sin anuladas. Corrige los cinco errores y guarda como <code>Auditoria_2025_revisado.xlsx</code>."],
 ],
 colabQue:"Ves cuánto mueve cada error el total del informe (de la cifra correcta a la reportada), cómo cambia el cumplimiento de cada sede, y cómo se prueba una fórmula con casos conocidos mes a mes.",
 ia:[
  {t:"Pedir una revisión de fórmulas", p:`Voy a enviar un informe de Excel 365. Estas son las fórmulas de la columna de venta y del total (pegadas con Mostrar fórmulas):
[PEGA LAS FÓRMULAS]
Revisa si son coherentes entre sí, si algún rango omite filas y si algún criterio falta. No supongas datos que no te di.`},
  {t:"Diseñar casos de prueba", p:`Una IA me propuso esta fórmula para la venta neta por sede y año:
=SUMAR.SI.CONJUNTO(tVentas[subtotal];tVentas[ciudad];A8;tVentas[anio];G1)
Propón tres casos de prueba que yo pueda verificar con una tabla dinámica para saber si es correcta, e incluye uno que detecte facturas anuladas.`},
 ],
 iaCuidado:"No pegues en una IA pública datos de clientes, salarios ni cifras confidenciales. Usa datos de ejemplo o anonimizados, y las herramientas que la empresa haya autorizado.",
 quiz:[
  {q:"Una celda de una columna de fórmulas tiene un número escrito a mano. ¿Qué herramienta lo revela más rápido?",
   o:["Formato condicional","Mostrar fórmulas (Ctrl + `)","Ordenar","Inmovilizar paneles"], a:1,
   w:"Al mostrar fórmulas, el número escrito a mano aparece como número entre fórmulas."},
  {q:"La fórmula que sugirió la IA da un resultado razonable. ¿Qué haces antes de usarla?",
   o:["Usarla: se ve bien","Probarla con casos conocidos","Pedirle a la IA que confirme","Copiarla a todo el informe"], a:1,
   w:"Un resultado razonable puede estar mal. Compáralo con tres resultados que ya sabes que son correctos."},
  {q:"El total del informe no es igual al total de la base. ¿Qué indica?",
   o:["Nada, son redondeos","Que algo en el informe omite, duplica o cambia datos","Que la base está mal","Que hay que usar más decimales"], a:1,
   w:"El cuadre contra la fuente es el control más simple: una diferencia exige una explicación."},
  {q:"¿Cuál es un nombre de versión adecuado?",
   o:["informe_final_final2.xlsx","Informe_cumplimiento_2025-12_v2.xlsx","nuevo.xlsx","copia de informe.xlsx"], a:1,
   w:"Tema, periodo y versión: cualquiera sabe qué es y cuál es la última."},
 ],
 docente:{
  duracion:[["Apertura: un informe que parece correcto",8,"Proyecta la hoja Auditoria y pregunta si la enviarían."],
            ["Simulador: la búsqueda",15,"En parejas, encuentren los cinco errores con las herramientas."],
            ["Excel: hoja Auditoria",20,"Herramientas, cuadre y corrección de los cinco errores."],
            ["IA responsable",5,"Datos confidenciales, verificación y responsabilidad."],
            ["Autoevaluación",7,"Cuestionario individual."]],
  preguntas:["¿Cuáles errores encontró una herramienta y cuáles solo el cuadre?","¿Qué controles harían siempre antes de enviar?","¿Qué datos de su trabajo no pondrían en una IA pública?"],
  errores:["Confiar solo en la comprobación de errores: no detecta valores pegados.","Corregir el total sin buscar la causa.","Aceptar la fórmula de la IA porque «el número se ve bien»."],
  cierre:"Antes de enviar: mostrar fórmulas, comprobar errores, cuadrar con la fuente y probar lo que no escribiste tú."},
};

/* ---------- «Ver el error» ---------- */
ERRORES[10] = ()=>`<div class="two">
   <div class="panel bad"><span class="eyebrow">Filtrar, copiar y pegar</span>
     <ol class="plain small" style="margin-top:8px"><li>Filtrar tVentas por Bogotá y 2025.</li><li>Tabla dinámica por cliente, ordenar, copiar los 10 primeros.</li><li>Pegar como valores en el informe.</li></ol>
     <p class="muted small" style="margin-top:8px">Al día siguiente llegan ventas nuevas o alguien pide Medellín: la lista pegada ya no es cierta, y nada lo indica.</p></div>
   <div class="panel good"><span class="eyebrow">Una fórmula que se derrama</span><pre class="code" style="margin-top:8px">=LET(c;UNICOS(FILTRAR(tVentas[cliente];
      (tVentas[ciudad]=B2)*(tVentas[anio]=B3)));
    v;SUMAR.SI.CONJUNTO(tVentas[subtotal];
      tVentas[cliente];c;tVentas[ciudad];B2;tVentas[anio];B3);
    TOMAR(ORDENAR(APILARH(c;v);2;-1);B4))</pre>
     <p class="muted small" style="margin-top:8px">Cambias la sede en B2 y la lista se recalcula. Si llegan ventas, también.</p></div></div>`;
ERRORES[11] = ()=>{
  const {sedes, v25, meta} = CIERRE;
  const items = sedes.map((s,i)=>({k:s, real:v25[i], meta:meta[i]})).sort((a,b)=>b.real/b.meta-a.real/a.meta);
  return `<div class="two">
   <div class="panel bad"><span class="eyebrow">Por defecto · «Ventas por sede»</span><div style="margin-top:8px">${G.dona(sedes.map((s,i)=>({k:s, v:v25[i]})).slice(0,6),{centro:"", label:"Torta de venta por sede"})}</div>
     <p class="muted small">Seis porciones casi iguales, sin meta y sin mensaje. ¿Quién cumplió?</p></div>
   <div class="panel good"><span class="eyebrow">Responde la pregunta</span><p class="small" style="margin:6px 0"><b>Bucaramanga y Pereira superaron la meta; Barranquilla quedó ${Math.round((1-items[items.length-1].real/items[items.length-1].meta)*100)} puntos abajo</b></p>
     ${G.realMeta(items,{label:"Real contra meta por sede"})}</div></div>`;
};
ERRORES[12] = ()=>`<div class="two">
   <div class="panel bad"><span class="eyebrow">Enviado sin revisar</span>
     <ul class="plain small" style="margin-top:8px"><li>Un valor pegado del informe del año anterior.</li><li>Una fórmula de IA que nadie probó.</li><li>Un total que omite la última fila.</li><li>Archivo: <code>informe_final_final2.xlsx</code>.</li></ul>
     <p class="muted small" style="margin-top:8px">El total reportado queda ${mill(Math.abs(CIERRE.total25 - (CIERRE.total25 - CIERRE.v25[2] + CIERRE.v24[2] - CIERRE.v25[3] + CIERRE.v25a[3] - CIERRE.v25[5])))} lejos de la base, y nadie lo nota hasta la junta.</p></div>
   <div class="panel good"><span class="eyebrow">Cuatro controles antes de enviar</span>
     <ol class="plain small" style="margin-top:8px"><li>Mostrar fórmulas (Ctrl + &#96;).</li><li>Comprobación de errores.</li><li>Cuadre contra la fuente: diferencia = 0.</li><li>Probar con casos conocidos lo que no escribiste tú.</li></ol>
     <p class="muted small" style="margin-top:8px">Archivo: <code>Informe_cumplimiento_2025-12_v2.xlsx</code>.</p></div></div>`;

/* ======================================================================
   SIMULADORES
   ====================================================================== */

/* ---- Clave 10: derrame paso a paso ---- */
SIMS[10] = function(el){
  let S = {sede:0, anio:2025, n:10, paso:4, bloqueo:false};
  const PASOS = [
    {n:"1 · UNICOS(FILTRAR(…))", celda:"D6", f:s=>`=UNICOS(FILTRAR(tVentas[cliente];(tVentas[ciudad]=$B$2)*(tVentas[anio]=$B$3)*(tVentas[estado]<>"Anulada")))`},
    {n:"2 · + SUMAR.SI.CONJUNTO con D6#", celda:"E6", f:s=>`=SUMAR.SI.CONJUNTO(tVentas[subtotal];tVentas[cliente];D6#;tVentas[ciudad];$B$2;tVentas[anio];$B$3;tVentas[estado];"<>Anulada")`},
    {n:"3 · ORDENAR(APILARH(D6#;E6#);2;-1)", celda:"G6", f:s=>`=ORDENAR(APILARH(D6#;E6#);2;-1)`},
    {n:"4 · TOMAR(…; $B$4) con LET", celda:"A7", f:s=>`=LET(c;D6#;v;E6#;TOMAR(ORDENAR(APILARH(c;v);2;-1);$B$4))`},
  ];
  const draw = ()=>{
    const yi = anioIdx(S.anio), m = new Map();
    for(let i=0;i<NL;i++){ if(C.ciudad[i]!==S.sede||C.anio[i]!==yi||C.estado[i]===2) continue; m.set(C.cliente[i],(m.get(C.cliente[i])||0)+C.subtotal[i]) }
    let filas = [...m.entries()].map(([c,v])=>({c:D.clientes_nombres[c], v}));
    const total = filas.reduce((a,b)=>a+b.v,0), unicos = filas.length;
    if(S.paso>=3) filas.sort((a,b)=>b.v-a.v);
    if(S.paso===4) filas = filas.slice(0,S.n);
    const conValor = S.paso>=2, P = PASOS[S.paso-1];
    const bloq = S.bloqueo && S.paso===4 && S.n>=4;
    const visibles = filas.slice(0,12);
    const cuerpo = bloq ? `<tr><td class="rn">7</td><td style="color:var(--bad); font-weight:600">#¡DESBORDAMIENTO!</td><td></td></tr><tr><td class="rn">8</td><td></td><td></td></tr><tr><td class="rn">9</td><td></td><td></td></tr><tr><td class="rn">10</td><td style="background:var(--warn-soft)">nota del jefe</td><td></td></tr>`
      : visibles.map((f,i)=>`<tr><td class="rn">${(S.paso===4?7:6)+i}</td><td style="${i===0?"outline:2px solid var(--s1); outline-offset:-2px":""}">${esc(f.c)}</td>${conValor?`<td class="num">${nf.format(f.v)}</td>`:""}</tr>`).join("")
        + (filas.length>12?`<tr><td class="rn">⋮</td><td class="muted" colspan="2">… ${filas.length-12} filas más derramadas</td></tr>`:"");
    const top = [...m.values()].sort((a,b)=>b-a).slice(0,S.n).reduce((a,b)=>a+b,0);
    el.innerHTML = `<div class="stack">
      <p class="read">Así se arma la lista de mejores clientes de la hoja <b>Top_Clientes</b>. Avanza paso a paso y mira qué devuelve cada fórmula. Las celdas dentro del borde punteado son el resultado derramado.</p>
      <div class="ctl"><label for="s10s">Sede (B2)<select id="s10s">${DM.ciudad.map((c,i)=>`<option value="${i}">${c}</option>`).join("")}</select></label>
        <label for="s10a">Año (B3)<select id="s10a"><option>2024</option><option>2025</option></select></label>
        <label for="s10n">Cuántos (B4)<select id="s10n"><option>5</option><option>10</option><option>15</option></select></label>
        <label for="s10p">Paso<select id="s10p">${PASOS.map((p,i)=>`<option value="${i+1}">${p.n}</option>`).join("")}</select></label>
        <label class="chk" for="s10b"><input type="checkbox" id="s10b" ${S.bloqueo?"checked":""}> Escribir una nota en A10</label></div>
      ${fxbar(P.celda, `<span class="mono">${esc(P.f())}</span>`)}
      <div class="sheetwrap" style="border:2px dashed ${bloq?"var(--bad)":"var(--s1)"}"><table class="sheet"><thead><tr><th></th><th>${S.paso===4?"A · Cliente":"D · Cliente"}</th>${conValor||bloq?`<th>${S.paso===4?"B":"E"} · Venta neta</th>`:""}</tr></thead><tbody>${cuerpo}</tbody></table></div>
      <div class="insight">${bloq ? "La nota en A10 está en el camino del resultado: Excel no sobrescribe y muestra <b>#¡DESBORDAMIENTO!</b>. Borra la nota (desmarca la casilla) y el resultado vuelve. No hay que tocar la fórmula."
        : S.paso===1 ? `UNICOS devuelve <b>${unicos} clientes</b> distintos de ${DM.ciudad[S.sede]} en ${S.anio}. Si mañana compra un cliente nuevo, la lista crece sola.`
        : S.paso===2 ? `Como el criterio es <b>D6#</b>, SUMAR.SI.CONJUNTO devuelve una venta por cada cliente: también se derrama, con las mismas ${unicos} filas.`
        : S.paso===3 ? "APILARH junta las dos columnas y ORDENAR las acomoda por la columna 2 (venta) de mayor a menor."
        : `Los ${S.n} primeros clientes suman el <b>${pct1(top/total)}</b> de la venta de ${DM.ciudad[S.sede]} en ${S.anio}. Cambia la sede o el número: la lista se recalcula.`}</div>
    </div>`;
    $("#s10s").value=S.sede; $("#s10a").value=S.anio; $("#s10n").value=S.n; $("#s10p").value=S.paso;
    $("#s10s").onchange=e=>{S.sede=+e.target.value;draw()}; $("#s10a").onchange=e=>{S.anio=+e.target.value;draw()};
    $("#s10n").onchange=e=>{S.n=+e.target.value;draw()}; $("#s10p").onchange=e=>{S.paso=+e.target.value;draw()};
    $("#s10b").onchange=e=>{S.bloqueo=e.target.checked; if(S.bloqueo) S.paso=4; draw()};
  };
  draw();
};

/* ---- Clave 11: del gráfico por defecto al que se explica solo ---- */
SIMS[11] = function(el){
  const {sedes, v25, meta} = CIERRE;
  const base = sedes.map((s,i)=>({k:s, real:v25[i], meta:meta[i], c:v25[i]/meta[i]}));
  let S = {tipo:"torta", orden:false, titulo:false, enfasis:false, ref:false, etiquetas:false};
  const peor = [...base].sort((a,b)=>a.c-b.c)[0], mejor = [...base].sort((a,b)=>b.c-a.c)[0];
  const cumplen = base.filter(d=>d.c>=1).map(d=>d.k);
  const hallazgo = `${cumplen.join(" y ")} superaron su meta; ${peor.k} quedó ${Math.round((1-peor.c)*100)} puntos abajo`;
  const W=480, txt=(x,y,s,o={})=>`<text x="${x}" y="${y}" ${o.a?`text-anchor="${o.a}"`:""} style="font-size:${o.z||11}px;${o.b?"font-weight:600;":""}${o.f?`fill:${o.f}`:""}">${esc(s)}</text>`;
  const PAL = ["var(--s1)","var(--s2)","var(--s3)","#E8A33D","#5BAA6A","#8B6BD6"];
  const torta = ()=>{ const tot=base.reduce((a,b)=>a+b.real,0); let a0=-Math.PI/2, s="";
    base.forEach((d,i)=>{ const a1=a0+d.real/tot*Math.PI*2, p=a=>`${120+90*Math.cos(a)},${110+90*Math.sin(a)}`;
      s+=`<path d="M120,110 L${p(a0)} A90,90 0 ${a1-a0>Math.PI?1:0} 1 ${p(a1)} Z" fill="${PAL[i]}" stroke="var(--surface)" stroke-width="1.5"/>`;
      s+=`<rect x="260" y="${40+i*24}" width="12" height="12" rx="2" fill="${PAL[i]}"/>`+txt(278,50+i*24,`${d.k} ${S.etiquetas?pct1(d.real/tot):""}`); a0=a1 });
    return `<svg viewBox="0 0 ${W} 225" role="img" aria-label="Torta de venta por sede">${s}</svg>` };
  const columnas = ()=>{ const items = S.orden?[...base].sort((a,b)=>b.real-a.real):base;
    const l=50, top=30, ch=170, gw=(W-l-10)/items.length, max=5e9;
    let s=(S.etiquetas?"":`<rect x="${l}" y="6" width="10" height="10" fill="var(--s1)"/>`+txt(l+14,15,"Real")+`<rect x="${l+60}" y="6" width="10" height="10" fill="${S.enfasis?"var(--s0)":"var(--s3)"}"/>`+txt(l+74,15,"Meta"));
    for(let g=0;g<=5;g++){ const y=top+ch-ch*g/5; s+=`<line x1="${l}" x2="${W-10}" y1="${y}" y2="${y}" stroke="var(--grid)"/>`+txt(l-6,y+3,mill(max*g/5),{a:"end",z:9}) }
    items.forEach((d,i)=>{ const x=l+i*gw+gw/2-22, hr=d.real/max*ch, hm=d.meta/max*ch, bajo=d.c<1;
      const cr = S.enfasis ? (bajo?"var(--s3)":"var(--s0)") : "var(--s1)";
      s+=`<rect x="${x}" y="${top+ch-hr}" width="20" height="${hr}" fill="${cr}"/>`;
      s+= S.ref ? `<line x1="${x-3}" x2="${x+23}" y1="${top+ch-hm}" y2="${top+ch-hm}" stroke="var(--ink)" stroke-width="2.5"/>` : `<rect x="${x+22}" y="${top+ch-hm}" width="20" height="${hm}" fill="${S.enfasis?"var(--s0)":"var(--s3)"}" opacity="${S.enfasis?.5:1}"/>`;
      if(S.etiquetas) s+=txt(x+10,top+ch-Math.max(hr,hm)-4,pct1(d.c),{a:"middle",z:9.5,b:bajo,f:bajo&&S.enfasis?"var(--s3)":""});
      s+=txt(x+20,top+ch+14,d.k.length>11?d.k.slice(0,10)+"…":d.k,{a:"middle",z:9.5}) });
    return `<svg viewBox="0 0 ${W} 225" role="img" aria-label="Columnas de real y meta">${s}</svg>` };
  const barras = ()=>{ const items = S.orden?[...base].sort((a,b)=>b.c-a.c):base;
    const lw=96, rh=28, top=22, maxc=1.25, sx=c=>c/maxc*(W-lw-60), h=top+items.length*rh+24;
    let s=""; if(!S.etiquetas) for(let g=0;g<=5;g++){ const c=maxc*g/5, x=lw+sx(c); s+=`<line x1="${x}" x2="${x}" y1="${top}" y2="${h-20}" stroke="var(--grid)"/>`+txt(x,h-6,Math.round(c*100)+" %",{a:"middle",z:9}) }
    items.forEach((d,i)=>{ const y=top+i*rh, bajo=d.c<1, cr=S.enfasis?(bajo?"var(--s3)":"var(--s0)"):PAL[i%6];
      s+=txt(lw-6,y+rh/2+4,d.k,{a:"end"})+`<rect x="${lw}" y="${y+5}" width="${sx(d.c)}" height="${rh-10}" rx="3" fill="${cr}"/>`;
      if(S.etiquetas) s+=txt(lw+sx(d.c)+5,y+rh/2+4,pct1(d.c),{z:10.5,b:true,f:bajo&&S.enfasis?"var(--s3)":""}) });
    if(S.ref) s+=`<line x1="${lw+sx(1)}" x2="${lw+sx(1)}" y1="${top-2}" y2="${h-20}" stroke="var(--ink)" stroke-width="2" stroke-dasharray="4 3"/>`+txt(lw+sx(1),12,"Meta 100 %",{a:"middle",z:10,b:true});
    return `<svg viewBox="0 0 ${W} ${h}" role="img" aria-label="Barras de cumplimiento">${s}</svg>` };
  const draw = ()=>{
    const dec = [S.tipo==="barras", S.orden, S.titulo, S.enfasis, S.ref, S.etiquetas];
    const puntos = dec.filter(Boolean).length;
    const titulo = S.titulo ? hallazgo : "Ventas por sede 2025";
    el.innerHTML = `<div class="stack">
      <p class="read">El comité pregunta: <b>«¿qué sedes cumplieron la meta de 2025?»</b>. Empieza con lo que sale por defecto y toma una decisión a la vez. Observa cuándo el gráfico empieza a responder la pregunta sin explicación.</p>
      <div class="ctl"><label for="s11t">Tipo de gráfico<select id="s11t"><option value="torta">Torta de venta</option><option value="columnas">Columnas: real y meta</option><option value="barras">Barras de cumplimiento %</option></select></label></div>
      <div class="ctl">${[["orden","Ordenar"],["titulo","Título con el hallazgo"],["enfasis","Un color de énfasis"],["ref","Meta como referencia"],["etiquetas","Etiquetas directas"]].map(([k,t])=>`<label class="chk" for="s11${k}"><input type="checkbox" id="s11${k}" data-k="${k}" ${S[k]?"checked":""}> ${t}</label>`).join("")}</div>
      <div class="panel"><p style="margin:0 0 6px; font-weight:${S.titulo?700:400}; ${S.titulo?"":"color:var(--muted)"}">${esc(titulo)}</p>${S.tipo==="torta"?torta():S.tipo==="columnas"?columnas():barras()}</div>
      <div class="row"><span class="tag ${puntos===6?"ok":""}">${puntos} de 6 decisiones</span></div>
      <div class="insight">${S.tipo==="torta" ? "Una torta muestra cómo se reparte un total. No puede mostrar la meta, y con seis porciones parecidas el ojo no compara. Cambia el tipo de gráfico."
        : !S.titulo ? "El título nombra el tema, no la respuesta. Activa «Título con el hallazgo»: el lector sabe qué buscar antes de mirar las barras."
        : S.tipo==="columnas" ? "Las columnas de real y meta obligan a comparar pares de barras. El cumplimiento en % con una línea de 100 % responde la pregunta de forma directa."
        : puntos<6 ? "Ya responde la pregunta. Completa las decisiones que faltan: cada una le ahorra trabajo al lector."
        : `Seis decisiones: el gráfico se entiende en diez segundos. ${mejor.k} lidera con ${pct1(mejor.c)} y ${peor.k} queda en ${pct1(peor.c)}. La discusión del comité puede ir directo a las causas.`}</div>
    </div>`;
    $("#s11t").value=S.tipo; $("#s11t").onchange=e=>{S.tipo=e.target.value;draw()};
    el.querySelectorAll("[data-k]").forEach(cb=>cb.onchange=()=>{ S[cb.dataset.k]=cb.checked; draw() });
  };
  draw();
};

/* ---- Clave 12: encontrar los cinco errores ---- */
SIMS[12] = function(el){
  const {sedes, v25, v25a, v24, meta, total25} = CIERRE;
  const fV = r=>`=SUMAR.SI.CONJUNTO(Ventas!$P:$P;Ventas!$G:$G;$A${r};Ventas!$B:$B;$G$1;Ventas!$R:$R;"<>Anulada")`;
  const fM = r=>`=SUMAR.SI.CONJUNTO(Metas!$F:$F;Metas!$A:$A;$A${r};Metas!$B:$B;$G$1)`;
  const B = v25.slice(), Cm = meta.slice();
  B[2] = v24[2]; B[3] = v25a[3];
  const totB = B.slice(0,5).reduce((a,b)=>a+b,0), totC = Cm.reduce((a,b,i)=>a+(i===4?0:b),0);
  const cel = {};
  sedes.forEach((s,i)=>{ const r=5+i;
    cel[`A${r}`] = {v:s, f:s};
    cel[`B${r}`] = {v:nf.format(B[i]), f:fV(r), n:true};
    cel[`C${r}`] = {v:nf.format(Cm[i]), f:fM(r), n:true};
    cel[`D${r}`] = {v:pct1(B[i]/Cm[i]), f:`=B${r}/C${r}`, n:true};
    cel[`E${r}`] = {v:pct1(B[i]/totB), f:`=B${r}/B$11`, n:true};
  });
  cel.B7 = {v:nf.format(B[2]), f:String(B[2]), n:true};
  cel.B8 = {v:nf.format(B[3]), f:`=SUMAR.SI.CONJUNTO(Ventas!$P:$P;Ventas!$G:$G;$A8;Ventas!$B:$B;$G$1)`, n:true, comentario:"Fórmula sugerida por un asistente de IA. ¿Alguien la probó?"};
  cel.C9 = {v:String(Cm[4]), f:String(Cm[4]), texto:true};
  cel.D10 = {v:pct1(B[5]/Cm[4]), f:"=B10/C9", n:true};
  cel.A11 = {v:"Total", f:"Total", b:true};
  cel.B11 = {v:nf.format(totB), f:"=SUMA(B5:B9)", n:true, b:true};
  cel.C11 = {v:nf.format(totC), f:"=SUMA(C5:C10)", n:true, b:true};
  cel.D11 = {v:pct1(totB/totC), f:"=B11/C11", n:true, b:true};
  cel.E11 = {v:pct1(sedes.reduce((a,_,i)=>a+B[i]/totB,0)), f:"=SUMA(E5:E10)", n:true, b:true};
  const ERR = {
    B7:"Valor escrito a mano: es la venta de Cali de 2024, pegada del informe anterior. Ninguna herramienta lo marca; se ve con Mostrar fórmulas.",
    B8:"La fórmula de la IA no tiene el criterio de estado: suma facturas anuladas. Se detecta probándola contra una tabla dinámica.",
    C9:"Meta escrita como texto: la división la convierte, pero SUMA la ignora y el total de metas queda corto. Comprobación de errores la marca.",
    D10:"Divide por la meta de la fila de arriba (C9). Comprobación de errores la marca como fórmula incoherente; Rastrear precedentes lo confirma.",
    B11:"El total omite Pereira (B10). Comprobación de errores avisa que omite celdas adyacentes, y el cuadre muestra la diferencia.",
  };
  const AVISO = {C9:"Número almacenado como texto", D10:"Fórmula incoherente con las celdas vecinas", B11:"La fórmula omite celdas adyacentes"};
  const PREC = {D10:["B10","C9"], B11:["B5","B6","B7","B8","B9"], C11:["C5","C6","C7","C8","C9","C10"], D11:["B11","C11"]};
  sedes.forEach((_,i)=>{ const r=5+i; if(!PREC[`D${r}`]) PREC[`D${r}`]=[`B${r}`,`C${r}`]; PREC[`E${r}`]=[`B${r}`,"B11"] });
  let S = {formulas:false, avisos:false, cuadre:false, rastrear:false, sel:"B11", marcas:new Set()};
  const draw = ()=>{
    const enc = [...S.marcas].filter(k=>ERR[k]), falsos = [...S.marcas].filter(k=>!ERR[k]);
    const prec = S.rastrear ? (PREC[S.sel]||[]) : [];
    const td = (ref)=>{ const c = cel[ref]; if(!c) return `<td></td>`;
      const st = [];
      if(ref===S.sel) st.push("outline:2px solid var(--s2); outline-offset:-2px");
      if(prec.includes(ref)) st.push("background:var(--surface-2); box-shadow:inset 0 0 0 2px var(--s1)");
      if(S.marcas.has(ref)) st.push(ERR[ref]?"background:var(--good-soft)":"background:var(--bad-soft)");
      if(c.b) st.push("font-weight:600");
      const tri = (S.avisos && AVISO[ref]) ? `<span title="${AVISO[ref]}" style="position:absolute;left:0;top:0;border-top:7px solid var(--good);border-right:7px solid transparent"></span>` : "";
      const com = c.comentario ? `<span title="${c.comentario}" style="position:absolute;right:0;top:0;border-top:7px solid var(--bad);border-left:7px solid transparent"></span>` : "";
      const val = S.formulas ? c.f : c.v;
      return `<td data-r="${ref}" class="${c.n&&!S.formulas&&!c.texto?"num":""} ${S.formulas?"mono":""}" style="position:relative;cursor:pointer;${S.formulas?"font-size:11px;white-space:nowrap;":""}${c.texto&&!S.formulas?"text-align:left;":""}${st.join(";")}">${tri}${com}${esc(val)}</td>` };
    const sc = cel[S.sel];
    el.innerHTML = `<div class="stack">
      <p class="read">Este es el informe de la hoja <b>Auditoria</b>. Tiene <b>cinco errores</b>. Usa las herramientas de auditoría, haz clic en una celda sospechosa y márcala. Ninguna herramienta encuentra los cinco: combínalas.</p>
      <div class="ctl">
        <label class="chk" for="s12f"><input type="checkbox" id="s12f" ${S.formulas?"checked":""}> Mostrar fórmulas (Ctrl + \`)</label>
        <label class="chk" for="s12a"><input type="checkbox" id="s12a" ${S.avisos?"checked":""}> Comprobación de errores</label>
        <label class="chk" for="s12r"><input type="checkbox" id="s12r" ${S.rastrear?"checked":""}> Rastrear precedentes de la celda elegida</label>
        <label class="chk" for="s12c"><input type="checkbox" id="s12c" ${S.cuadre?"checked":""}> Cuadrar contra la fuente</label></div>
      ${fxbar(S.sel, `<span class="mono">${esc(sc?sc.f:"")}</span>`)}
      <div class="sheetwrap"><table class="sheet"><thead><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr></thead><tbody>
        <tr><td class="rn">4</td><td class="hd">Sede</td><td class="hd">Venta 2025</td><td class="hd">Meta 2025</td><td class="hd">Cumplimiento</td><td class="hd">Participación</td></tr>
        ${[5,6,7,8,9,10,11].map(r=>`<tr><td class="rn">${r}</td>${["A","B","C","D","E"].map(c=>td(c+r)).join("")}</tr>`).join("")}
        ${S.cuadre?`<tr><td class="rn">14</td><td>Venta neta 2025 en tVentas</td><td class="num">${nf.format(total25)}</td><td colspan="3"></td></tr>
        <tr><td class="rn">15</td><td>Diferencia con el informe</td><td class="num" style="color:var(--bad); font-weight:600">${nf.format(totB-total25)}</td><td colspan="3" class="small muted">Participaciones suman ${cel.E11.v}</td></tr>`:""}
      </tbody></table></div>
      <div class="row"><button class="btn primary" data-mark>${S.marcas.has(S.sel)?"Quitar marca de":"Marcar como error"} ${S.sel}</button>
        <span class="tag ${enc.length===5?"ok":""}">${enc.length} de 5 errores</span>${falsos.length?`<span class="tag">${falsos.length} marca(s) en celdas correctas</span>`:""}
        ${S.avisos&&AVISO[S.sel]?`<span class="tag">Aviso: ${AVISO[S.sel]}</span>`:""}${sc&&sc.comentario?`<span class="tag">Comentario: ${sc.comentario}</span>`:""}</div>
      ${enc.length?`<div class="panel"><ol class="plain small">${enc.map(k=>`<li><b>${k}</b> · ${ERR[k]}</li>`).join("")}</ol></div>`:""}
      <div class="insight">${enc.length===5 ? `Encontraste los cinco. Tres los marca Excel; los otros dos (el valor pegado y la fórmula de la IA) solo aparecen al mostrar fórmulas, cuadrar y probar. Corregido, el informe debe dar ${nf.format(total25)}.`
        : falsos.length ? "Hay marcas en celdas correctas. Mira la fórmula de cada una en la barra de fórmulas antes de marcarla."
        : "Pista: empieza por Mostrar fórmulas y recorre la columna B; luego activa la comprobación de errores y el cuadre."}</div>
    </div>`;
    $("#s12f").onchange=e=>{S.formulas=e.target.checked;draw()}; $("#s12a").onchange=e=>{S.avisos=e.target.checked;draw()};
    $("#s12r").onchange=e=>{S.rastrear=e.target.checked;draw()}; $("#s12c").onchange=e=>{S.cuadre=e.target.checked;draw()};
    el.querySelectorAll("[data-r]").forEach(t=>t.onclick=()=>{ S.sel=t.dataset.r; draw() });
    $("[data-mark]",el).onclick=()=>{ S.marcas.has(S.sel)?S.marcas.delete(S.sel):S.marcas.add(S.sel); draw() };
  };
  draw();
};
