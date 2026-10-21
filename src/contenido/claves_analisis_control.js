/* ======================================================================
   CONTENIDO · Claves 6 y 8 (Análisis) y 9 (Control y comunicación)
   Misma plantilla que MOD[1]; simuladores al final del archivo.
   ====================================================================== */

/* ---------------------------------------------------------------------
   CLAVE 6 · Agregar con condiciones
   --------------------------------------------------------------------- */
MOD[6] = {
 minutos:45, notebook:"06_agregar_con_condiciones.ipynb",
 objetivos:["Construir un informe de formato fijo con SUMAR.SI.CONJUNTO.","Escribir criterios con texto, celdas y operadores.","Decidir cuándo conviene una fórmula condicional y cuándo una tabla dinámica."],
 entender:`
  <p><b>SUMAR.SI.CONJUNTO</b> suma solo las filas que cumplen <b>todas</b> las condiciones que le das:</p>
  <pre class="code">=SUMAR.SI.CONJUNTO(rango_suma; rango_criterios1; criterio1; [rango_criterios2; criterio2]; …)</pre>
  <p>Sus hermanas funcionan igual: <b>CONTAR.SI.CONJUNTO</b> cuenta las filas que cumplen y <b>PROMEDIO.SI.CONJUNTO</b> las promedia. Un criterio puede ser:</p>
  <ol><li>Un texto exacto: <code>"Bogotá"</code>.</li>
  <li>Una celda: <code>$A5</code>. Así una sola fórmula sirve para toda la tabla (clave 3).</li>
  <li>Una comparación entre comillas: <code>"&lt;&gt;Anulada"</code> (distinto de), <code>"&gt;5000000"</code>.</li>
  <li>Una comparación contra una celda, uniendo con <code>&amp;</code>: <code>"&gt;"&amp;G3</code>.</li></ol>
  <p>Todos los rangos deben tener el mismo tamaño. Con columnas de una Tabla (<code>tVentas[ciudad]</code>) siempre se cumple, y además crecen solas.</p>
  <p><b>¿Fórmula o tabla dinámica?</b> La dinámica es mejor para <b>explorar</b>: cambias la vista en segundos. Las fórmulas son mejores cuando el <b>formato es fijo</b>: una plantilla corporativa que se repite cada mes, un informe que mezcla ventas con metas o celdas que otras hojas consultan.</p>`,
 brechaTxt:"Muchos informes mensuales se arman filtrando la base y copiando totales a mano. Funcionan una vez y el mes siguiente hay que repetir todo, con nuevas oportunidades de error.",
 excel:[
  ["Abre la plantilla", "En <code>Andina_listo_para_dinamicas.xlsx</code>, hoja <b>Informe_Mensual</b>: sedes en A5:A10, canales en B4:D4, año en G1 y mes en G2. Las celdas amarillas se llenan con fórmulas."],
  ["Escribe una sola fórmula", "En B5: <code>=SUMAR.SI.CONJUNTO(tVentas[subtotal];tVentas[ciudad];$A5;tVentas[canal];B$4;tVentas[anio];$G$1;tVentas[mes];$G$2;tVentas[estado];\"&lt;&gt;Anulada\")</code>."],
  ["Cópiala a toda la matriz", "De B5 a D10. La sede se lee siempre de la columna A (<code>$A5</code>), el canal de la fila 4 (<code>B$4</code>) y el año y el mes de celdas fijas (<code>$G$1</code>, <code>$G$2</code>)."],
  ["Agrega los totales", "En E5: <code>=SUMA(B5:D5)</code> y en B11: <code>=SUMA(B5:B10)</code>. Copia ambos."],
  ["Cuadra contra una tabla dinámica", "Arma una dinámica con año y mes en Filtros, sin anuladas. El total general debe ser igual a E11. Si no cuadra, revisa el criterio de estado."],
  ["Cambia el periodo", "Escribe otro mes en G2: todo el informe se recalcula. Esa es la ventaja frente a copiar totales a mano."],
 ],
 colabQue:"Ves el informe mensual sede × canal como mapa de calor para el año y el mes que elijas, compruebas que cuadra con una tabla dinámica y comparas en gráficos lo que calculan SUMAR, CONTAR y PROMEDIO con condiciones.",
 ia:[
  {t:"De la pregunta a la fórmula", p:`Tengo en Excel 365 una Tabla tVentas con las columnas ciudad, canal, anio, mes, estado y subtotal.
Quiero la venta neta de cada sede (filas A5:A10) y canal (columnas B4:D4) para el año de G1 y el mes de G2, sin facturas anuladas.
Escribe la fórmula de B5 en español (separador ;) que pueda copiar a todo B5:D10 y explica cada $.`},
  {t:"Revisar un criterio que no funciona", p:`Mi fórmula =SUMAR.SI.CONJUNTO(tVentas[subtotal];tVentas[subtotal];>5000000) da error.
Explícame por qué y cómo se escribe un criterio de comparación, también cuando el límite está en una celda (G3).`},
 ],
 iaCuidado:"Cuadra siempre el total de una fórmula condicional contra una tabla dinámica o un filtro. Una coma o un espacio de más en un criterio de texto devuelve 0 sin mostrar error.",
 quiz:[
  {q:"¿Qué criterio excluye las facturas anuladas?",
   o:["\"Anulada\"","\"<>Anulada\"","\"=Anulada\"","\"No Anulada\""], a:1,
   w:"<> significa «distinto de». El criterio va entre comillas porque incluye el operador."},
  {q:"Quieres sumar solo los valores mayores al límite que está en G3. ¿Cómo escribes el criterio?",
   o:["\">G3\"","\">\"&G3",">G3","\"G3>\""], a:1,
   w:"El operador va entre comillas y se une con & a la referencia. \">G3\" compararía contra el texto «G3»."},
  {q:"SUMAR.SI.CONJUNTO con un criterio de ciudad y otro de canal suma las filas que…",
   o:["Cumplen cualquiera de los dos","Cumplen los dos a la vez","Cumplen solo el primero","Depende del orden"], a:1,
   w:"Todos los criterios se combinan con Y. Para un O hay que sumar dos fórmulas o usar una lista de criterios."},
  {q:"Gerencia quiere el mismo informe cada mes, con su formato corporativo, cambiando solo el mes. ¿Qué conviene?",
   o:["Una tabla dinámica nueva cada mes","Filtrar y copiar los totales","SUMAR.SI.CONJUNTO con el mes en una celda","Un gráfico"], a:2,
   w:"Con el formato fijo y el mes en una celda, el informe se actualiza solo. La dinámica es mejor para explorar."},
 ],
 docente:{
  duracion:[["Apertura: el informe del mes, hecho a mano",8,"Pregunta cómo arman hoy un informe mensual y cuánto tardan."],
            ["Simulador",10,"Cambien mes y año; hagan clic en varias celdas y comparen sus fórmulas."],
            ["Excel: hoja Informe_Mensual",20,"Una fórmula en B5, copiada a la matriz; cuadre contra una dinámica."],
            ["Colab: demostración",7,"Muestra el cuadre automático y la diferencia entre SUMAR, CONTAR y PROMEDIO."],
            ["Autoevaluación",10,"Cuestionario individual."]],
  preguntas:["¿Cuándo usarían fórmulas y cuándo una dinámica?","¿Qué pasa con el informe si alguien agrega filas a tVentas?","¿Cómo se haría un «O» entre dos estados?"],
  errores:["Escribir el criterio de comparación sin comillas.","Olvidar el criterio de estado y sumar anuladas.","Copiar la fórmula sin los $ mixtos: la clave 3 aparece aquí."],
  cierre:"Una fórmula, copiada a toda la matriz, con el periodo en celdas fijas: el informe del mes siguiente ya está hecho."},
};

/* ---------------------------------------------------------------------
   CLAVE 8 · Limpieza reproducible (Power Query)
   --------------------------------------------------------------------- */
MOD[8] = {
 minutos:60, notebook:"08_limpieza_reproducible.ipynb",
 objetivos:["Importar una tabla a Power Query y aplicar pasos de limpieza.","Entender que cada paso queda registrado y se repite con «Actualizar».","Combinar con un maestro y cargar el resultado limpio a Excel."],
 entender:`
  <p><b>Power Query</b> es el editor de Excel para importar y transformar datos (<b>Datos › Obtener y transformar datos</b>). Cada acción que haces queda guardada como un <b>paso</b> en el panel <i>Pasos aplicados</i>, escrito en un lenguaje llamado M. Los datos originales no se tocan: el resultado se carga en otra hoja.</p>
  <p>La ventaja aparece el mes siguiente. Cuando llega la nueva exportación con los mismos defectos, no repites nada: <b>Datos › Actualizar todo</b> vuelve a ejecutar todos los pasos, siempre en el mismo orden y siempre igual, sin importar quién lo haga.</p>
  <p>Los pasos más usados en limpieza son: <b>Recortar</b> (quita espacios, como ESPACIOS), <b>MAYÚSCULAS</b>, <b>Reemplazar los valores</b>, <b>Tipo de datos</b>, <b>Quitar duplicados</b> y <b>Combinar consultas</b>, que trae columnas de otra tabla por una llave (como BUSCARX, pero varias columnas a la vez).</p>
  <p>Un detalle importante: al importar, Power Query agrega un paso automático <b>«Tipo cambiado»</b> que adivina los tipos mirando las primeras filas. Si más abajo hay un valor distinto (un monto con «$» o una cantidad con «und»), esa celda queda como <b>Error</b>. Por eso conviene borrar ese paso y fijar los tipos al final, cuando la columna ya está limpia.</p>`,
 brechaTxt:"La limpieza manual de cada lunes tarda, depende de quién la haga y nunca sale igual dos veces. Es exactamente el tipo de trabajo repetitivo que Power Query convierte en un clic.",
 excel:[
  ["Lleva la hoja a Power Query", "En el libro de práctica, clic en la hoja <b>ERP_Sucio</b> › <b>Datos › Desde tabla o rango</b> › marca «La tabla tiene encabezados». Se abre el Editor de Power Query."],
  ["Borra el paso automático", "En <i>Pasos aplicados</i>, haz clic en la X junto a <b>Tipo cambiado</b>. Los tipos los vas a fijar tú al final."],
  ["Limpia el código del cliente", "Selecciona <code>Cod Cliente</code> › <b>Transformar › Formato › Recortar</b> y luego <b>Formato › MAYÚSCULAS</b>."],
  ["Limpia montos y cantidades", "<code>Valor Neto</code>: <b>Tipo de datos › Texto</b>, luego <b>Inicio › Reemplazar los valores</b> «$» por nada y «.» por nada, <b>Recortar</b> y <b>Tipo de datos › Número entero</b>. <code>Cantidad</code>: reemplaza « und» por nada y cambia a Número entero."],
  ["Convierte las fechas", "<b>Agregar columna › Columna personalizada</b>: <code>try Date.FromText([Fecha], \"es-CO\") otherwise Date.From(Number.From([Fecha]))</code>. Cambia su tipo a Fecha y quita la columna original. Es el mismo razonamiento de la clave 2, escrito en M."],
  ["Quita duplicados y combina con Clientes", "Selecciona todas las columnas (Ctrl+A) › <b>Inicio › Quitar filas › Quitar duplicados</b>. Luego, en Excel, clic en la tabla <code>tClientes</code> › <b>Datos › Desde tabla o rango</b> y en el editor <b>Cerrar y cargar en › Solo crear conexión</b>. De vuelta en la consulta del ERP: <b>Inicio › Combinar consultas</b> con tClientes, por <code>Cod Cliente</code> = <code>id_cliente</code>, tipo <b>Externa izquierda</b>, y expande <code>segmento</code>."],
  ["Carga y actualiza", "<b>Inicio › Cerrar y cargar</b>: el resultado limpio queda como Tabla en una hoja nueva. Cuando la exportación cambie, <b>Datos › Actualizar todo</b> repite todos los pasos."],
 ],
 colabQue:"Ves cómo baja el número de problemas después de cada paso de limpieza, cuántas filas cambian y cuánto tiempo se ahorra en un año comparado con la limpieza manual, con los supuestos que tú elijas.",
 ia:[
  {t:"Planear los pasos de limpieza", p:`Tengo una exportación de ERP en Excel con estas columnas y estos problemas:
- Cod Cliente: espacios al final y algunos en minúsculas
- Valor Neto: algunos números y otros textos como "$ 1.234.567"
- Fecha: textos en tres formatos (dd/mm/aaaa, aaaa-mm-dd y número serial)
- Filas duplicadas
Dame, en orden, los pasos en el Editor de Power Query de Excel 365 en español (menú por menú) para limpiarla, y explica por qué conviene borrar el paso automático «Tipo cambiado».`},
  {t:"Explicar un paso en M", p:`En Power Query tengo este paso y no lo entiendo:
[PEGA LA FÓRMULA DEL PASO, por ejemplo: = Table.TransformColumns(#"Paso anterior",{{"Cod Cliente", Text.Trim, type text}})]
Explícamelo en palabras simples y dime cómo se hace lo mismo con los menús.`},
 ],
 iaCuidado:"Si una IA te propone código M, pégalo en un paso nuevo y revisa la vista previa antes de cargar. Compara siempre el número de filas antes y después de cada paso.",
 quiz:[
  {q:"Aplicas diez pasos de limpieza en Power Query. ¿Qué pasa con los datos de la hoja original?",
   o:["Se sobrescriben con los datos limpios","No cambian: el resultado se carga en otra hoja","Se borran","Quedan con formato condicional"], a:1,
   w:"Power Query lee el origen y carga el resultado aparte. La fuente queda intacta, y eso permite repetir el proceso."},
  {q:"Llega la exportación del mes siguiente con los mismos defectos. ¿Qué haces?",
   o:["Repetir los pasos uno por uno","Reemplazar los datos de origen y usar Actualizar todo","Crear una consulta nueva","Limpiar a mano solo lo nuevo"], a:1,
   w:"Los pasos están guardados: Actualizar los vuelve a ejecutar sobre los datos nuevos."},
  {q:"«Combinar consultas» en Power Query equivale en Excel a…",
   o:["Una tabla dinámica","BUSCARX, pero trayendo varias columnas a la vez","SUMAR.SI.CONJUNTO","Copiar y pegar"], a:1,
   w:"Une dos tablas por una llave, como un BUSCARX, y puede traer todas las columnas que necesites."},
  {q:"¿Por qué conviene revisar el paso automático «Tipo cambiado»?",
   o:["Porque hace lenta la consulta","Porque adivina los tipos con las primeras filas y puede volver Error valores de más abajo","Porque borra columnas","No hace falta revisarlo"], a:1,
   w:"Si la columna parece numérica al principio pero más abajo trae «$ 1.234.567» o «33 und», esas celdas quedan en Error."},
 ],
 docente:{
  duracion:[["Apertura: la limpieza de los lunes",8,"Pide que cuenten los pasos manuales que harían con ERP_Sucio."],
            ["Simulador: editor de pasos",12,"Activen y desactiven pasos; vean qué pasa con el paso automático de tipos."],
            ["Excel: Power Query sobre ERP_Sucio",30,"Siguiendo los siete pasos; comparen filas y errores con el simulador."],
            ["Autoevaluación",10,"Cuestionario individual."]],
  preguntas:["¿Qué parte de su trabajo semanal se parece a esta limpieza?","¿Quién debería mantener la consulta si cambia el formato del ERP?","¿Qué gana la empresa si todos usan la misma consulta?"],
  errores:["No borrar «Tipo cambiado» y encontrar errores en Valor Neto.","Reemplazar «.» en una columna que ya era numérica.","Combinar consultas con la llave sin limpiar."],
  cierre:"Lo que se repite cada mes se automatiza una vez."},
};

/* ---------------------------------------------------------------------
   CLAVE 9 · Datos que se validan solos
   --------------------------------------------------------------------- */
MOD[9] = {
 minutos:45, notebook:"09_validacion_y_formato.ipynb",
 objetivos:["Restringir la entrada con listas desplegables y reglas.","Resaltar excepciones con formato condicional basado en reglas de negocio.","Encontrar los datos inválidos que entraron antes de la validación."],
 entender:`
  <p>La mejor limpieza es la que no hace falta. La <b>validación de datos</b> (<b>Datos › Validación de datos</b>) controla lo que se puede escribir en una celda: una lista desplegable, un número entero mayor que cero o un porcentaje entre 0 y 15 %. Tiene tres estilos de mensaje: <b>Detener</b> (no deja escribir el valor), <b>Advertencia</b> y <b>Información</b> (avisan pero dejan pasar).</p>
  <p>Para que una lista crezca sola, apunta a una Tabla mediante un <b>nombre definido</b>: crea el nombre <code>Ciudades</code> que se refiera a <code>=tListaCiudades[ciudad]</code> y usa <code>=Ciudades</code> como origen de la lista.</p>
  <p>La validación solo revisa lo que se escribe <b>después</b> de activarla. Para encontrar los datos malos que ya estaban: <b>Datos › Validación de datos › Rodear con un círculo datos no válidos</b>.</p>
  <p>El <b>formato condicional</b> (<b>Inicio › Formato condicional</b>) no impide nada: hace visibles las excepciones. Las reglas más útiles en informes son las que expresan una regla de negocio con una fórmula, por ejemplo <code>=$H2&gt;=0,10</code> para resaltar la fila completa de un pedido con descuento que requiere aprobación. El <code>$</code> fija la columna del descuento para que la regla funcione en toda la fila (clave 3).</p>`,
 brechaTxt:"En la exportación del ERP las seis ciudades aparecen escritas de 16 formas distintas. Cada variante es una «ciudad» más en una tabla dinámica y una venta que se reparte mal.",
 excel:[
  ["Crea los nombres de las listas", "En el libro de práctica, hoja <b>Listas</b>. <b>Fórmulas › Administrador de nombres › Nuevo</b>: <code>Ciudades</code> que se refiera a <code>=tListaCiudades[ciudad]</code>. Repite con <code>Canales</code> y <code>Productos</code>."],
  ["Agrega listas desplegables", "En la hoja <b>Pedidos</b>, selecciona la columna ciudad de <code>tPedidos</code> › <b>Datos › Validación de datos</b> › Permitir: <b>Lista</b> › Origen: <code>=Ciudades</code>. Igual para canal y producto."],
  ["Pon reglas a los números", "Cantidad: <b>Número entero</b>, mayor que 0. Descuento: <b>Decimal</b>, entre 0 y 0,15. En la pestaña <b>Mensaje de error</b>, estilo <b>Detener</b> y un texto que diga qué hacer: «El descuento máximo es 15 %. Para más, pide aprobación»."],
  ["Encuentra lo que ya estaba mal", "<b>Datos › Validación de datos › Rodear con un círculo datos no válidos</b>. Aparecen marcadas «Bogota», «B/quilla», «Ecommerce», la cantidad 0 y el descuento del 25 %. Corrígelos con las listas."],
  ["Resalta excepciones con una fórmula", "Selecciona A2:H6 › <b>Inicio › Formato condicional › Nueva regla › Utilice una fórmula</b>: <code>=$H2&gt;=0,10</code> con relleno amarillo. Se resalta la fila completa de los pedidos que requieren aprobación."],
  ["Marca las ciudades fuera de la lista", "En la hoja ERP_Sucio, selecciona la columna Ciudad › nueva regla con fórmula <code>=CONTAR.SI(Ciudades;$F2)=0</code> y relleno rojo claro. Así ves cuántas filas tienen una ciudad mal escrita."],
 ],
 colabQue:"Ves en gráficos las 16 formas en que llegan escritas las 6 ciudades, cómo se reparte mal la venta por ciudad cuando no hay validación y cómo una regla de formato condicional señala las excepciones que importan.",
 ia:[
  {t:"Diseñar las reglas de un formato", p:`Voy a crear en Excel 365 un formato de pedidos que llenan 18 vendedores. Columnas: fecha, vendedor, ciudad, canal, producto, cantidad, precio_unitario, descuento_pct.
Para cada columna, propón una regla de validación de datos (tipo, límites, origen de la lista) y el texto del mensaje de error.
Luego propón dos reglas de formato condicional con fórmula para resaltar excepciones de negocio.`},
  {t:"Normalizar variantes existentes", p:`En una columna de Excel tengo la ciudad escrita de muchas formas: "Bogota", "BOGOTÁ", "Bogotá D.C.", "bogota ", "B/quilla", "Santiago de Cali"...
Dame una forma de convertirlas a los nombres oficiales (Bogotá, Barranquilla, Cali…) con una tabla de equivalencias y BUSCARX, y explica cómo evitar que vuelva a pasar.`},
 ],
 iaCuidado:"La validación protege la entrada, pero no corrige el pasado. Antes de confiar en una lista, revisa con «Rodear con un círculo datos no válidos» lo que ya existe.",
 quiz:[
  {q:"Agregas una lista desplegable a una columna que ya tenía escrito «Bogota». ¿Qué pasa con esa celda?",
   o:["Se corrige sola a «Bogotá»","Nada: la validación solo controla lo que se escribe después","Se borra","Muestra un error"], a:1,
   w:"La validación no revisa el pasado. Usa «Rodear con un círculo datos no válidos» para encontrar esos casos."},
  {q:"Para que la lista de ciudades crezca sola al agregar una sede, el origen de la validación debe ser…",
   o:["El rango fijo $A$2:$A$7","Un nombre definido sobre la columna de una Tabla","Los nombres escritos separados por punto y coma","Una tabla dinámica"], a:1,
   w:"El nombre apunta a la columna de la Tabla, y la Tabla crece al agregar filas."},
  {q:"Aplicas a A2:H100 una regla de formato condicional con la fórmula =$H2>0,15. ¿Qué se resalta?",
   o:["Solo la columna H","La fila completa de cada pedido con descuento mayor al 15 %","Solo la celda H2","Nada, falta el signo igual"], a:1,
   w:"El $ fija la columna H, y la fila cambia para cada fila del rango: cada fila se evalúa con su propio descuento."},
  {q:"¿Qué estilo de mensaje de error impide escribir un valor inválido?",
   o:["Información","Advertencia","Detener","Cualquiera de los tres"], a:2,
   w:"Advertencia e Información avisan, pero dejan continuar. Detener obliga a corregir."},
 ],
 docente:{
  duracion:[["Apertura: 16 formas de escribir 6 ciudades",8,"Muestra la tabla dinámica de ventas por ciudad sobre ERP_Sucio."],
            ["Simulador",10,"Activen la validación, intenten pedidos inválidos y prueben las reglas de formato."],
            ["Excel: Pedidos y Listas",20,"Nombres, listas, reglas y «Rodear con un círculo»."],
            ["Formato condicional con fórmula",7,"La regla de fila completa con $."],
            ["Autoevaluación",10,"Cuestionario individual."]],
  preguntas:["¿Qué datos de su trabajo se escriben a mano y deberían venir de una lista?","¿Cuándo usarían Advertencia en lugar de Detener?","¿Qué excepción de negocio resaltarían en un informe?"],
  errores:["Escribir la lista separada por comas: se desactualiza.","Aplicar formato condicional a una columna sin el $ y resaltar celdas sueltas.","Colores sin significado: rojo para todo."],
  cierre:"Validar evita el error; el formato condicional muestra la excepción."},
};

/* ---------- «Ver el error» de las claves 6, 8 y 9 ---------- */
ERRORES[6] = ()=>`<div class="two">
   <div class="panel bad"><span class="eyebrow">Lo que circula</span>
     <ul class="plain small" style="margin-top:8px"><li>Filtrar tVentas por Bogotá, diciembre, Presencial.</li><li>Leer el total en la barra de estado.</li><li>Escribirlo a mano en el informe.</li><li>Repetir 18 veces (6 sedes × 3 canales).</li><li>El mes siguiente, repetir todo.</li></ul>
     <pre class="code" style="margin-top:8px">=SUMAR.SI.CONJUNTO(A2:A100;B2:B99;"Bogotá")  → #¡VALOR!</pre>
     <p class="muted small" style="margin-top:8px">Y cuando se intenta con fórmula, rangos de distinto tamaño dan error.</p></div>
   <div class="panel good"><span class="eyebrow">Lo que se actualiza solo</span><pre class="code" style="margin-top:8px">=SUMAR.SI.CONJUNTO(tVentas[subtotal];
  tVentas[ciudad];$A5;
  tVentas[canal];B$4;
  tVentas[anio];$G$1;
  tVentas[mes];$G$2;
  tVentas[estado];"&lt;&gt;Anulada")</pre>
     <p class="muted small" style="margin-top:8px">Una fórmula para las 18 celdas. Para otro mes, se cambia G2.</p></div></div>`;
ERRORES[8] = ()=>`<div class="two">
   <div class="panel bad"><span class="eyebrow">La limpieza de cada lunes</span>
     <ol class="plain small" style="margin-top:8px"><li>Abrir la exportación y copiarla al libro.</li><li>ESPACIOS y MAYUSC en una columna auxiliar.</li><li>Buscar y reemplazar «$» y «.».</li><li>Convertir textos a número.</li><li>Arreglar fechas una por una.</li><li>Quitar duplicados.</li><li>BUSCARX para el segmento.</li></ol>
     <p class="muted small" style="margin-top:8px">Cuarenta minutos, y el resultado depende de quién lo haga.</p></div>
   <div class="panel good"><span class="eyebrow">Pasos aplicados en Power Query</span>
     <ol class="plain small mono" style="margin-top:8px"><li>Origen</li><li>Texto recortado</li><li>Texto en mayúsculas</li><li>Valor reemplazado</li><li>Personalizada agregada (fecha)</li><li>Duplicados quitados</li><li>Consultas combinadas</li></ol>
     <p class="muted small" style="margin-top:8px">Los mismos pasos, guardados. El lunes siguiente: Datos › Actualizar todo.</p></div></div>`;
ERRORES[9] = ()=>{
  const v = Object.entries(D.ciudad_variantes).sort((a,b)=>b[1]-a[1]);
  return `<div class="two">
   <div class="panel bad"><span class="eyebrow">Sin validación: ${v.length} «ciudades»</span><div class="sheetwrap" style="margin-top:8px; max-height:260px; overflow:auto"><table class="sheet">
     <tr><td class="hd">Ciudad (como se escribió)</td><td class="hd">Filas</td></tr>
     ${v.map(([k,n])=>`<tr><td class="mono">${esc(k).replace(/ $/,`<span class="sp">·</span>`)}</td><td class="num">${n}</td></tr>`).join("")}</table></div>
     <p class="muted small" style="margin-top:8px">Una tabla dinámica muestra ${v.length} filas en lugar de 6.</p></div>
   <div class="panel good"><span class="eyebrow">Con lista desplegable: 6 ciudades</span><div class="sheetwrap" style="margin-top:8px"><table class="sheet">
     <tr><td class="hd">Ciudad</td></tr>${DM.ciudad.map(c=>`<tr><td>${c}</td></tr>`).join("")}</table></div>
     <p class="muted small" style="margin-top:8px">Nadie puede escribir otra cosa: la lista viene de tListaCiudades.</p></div></div>`;
};

/* ======================================================================
   SIMULADORES
   ====================================================================== */

/* ---- Clave 6: informe mensual con SUMAR.SI.CONJUNTO ---- */
SIMS[6] = function(el){
  const canales = DM.canal, sedes = DM.ciudad;
  let S = {anio:2025, mes:12, anuladas:false, mal:false, sel:[0,0]};
  const draw = ()=>{
    const yi = anioIdx(S.anio), M = sedes.map(()=>canales.map(()=>0));
    let piv = 0;
    for(let i=0;i<NL;i++){ if(C.anio[i]!==yi||C.mes[i]!==S.mes-1) continue; if(C.estado[i]===2&&!S.anuladas) continue; M[C.ciudad[i]][C.canal[i]] += C.subtotal[i] }
    for(let i=0;i<NL;i++){ if(C.anio[i]===yi&&C.mes[i]===S.mes-1&&C.estado[i]!==2) piv+=C.subtotal[i] }
    const tot = M.flat().reduce((a,b)=>a+b,0);
    const [r,c] = S.sel, col = String.fromCharCode(66+c), fila = 5+r;
    const f = S.mal ? `=SUMAR.SI.CONJUNTO(D2:D17000;A2:A16999;$A${fila};B2:B17000;${col}$4)` :
      `=SUMAR.SI.CONJUNTO(tVentas[subtotal];tVentas[ciudad];$A${fila};tVentas[canal];${col}$4;tVentas[anio];$G$1;tVentas[mes];$G$2${S.anuladas?"":';tVentas[estado];"<>Anulada"'})`;
    const celda = (v,i,j)=> S.mal ? `<td class="num" style="color:var(--bad)">#¡VALOR!</td>` :
      `<td class="num" data-c="${i},${j}" style="cursor:pointer;${i===r&&j===c?"outline:2px solid var(--cyan); outline-offset:-2px":""}">${nf.format(v)}</td>`;
    el.innerHTML = `<div class="stack">
      <p class="read">Este es el informe mensual de formato fijo: sedes en filas y canales en columnas, con una sola fórmula copiada a las 18 celdas. Cambia el año y el mes como si escribieras en G1 y G2, y haz clic en cualquier celda para ver su fórmula.</p>
      <div class="ctl"><label for="s6a">Año (G1)<select id="s6a"><option>2024</option><option>2025</option></select></label>
        <label for="s6m">Mes (G2)<select id="s6m">${MESES.map((m,i)=>`<option value="${i+1}">${i+1} · ${m}</option>`).join("")}</select></label>
        <label class="chk" for="s6x"><input type="checkbox" id="s6x" ${S.anuladas?"checked":""}> Quitar el criterio de estado</label>
        <label class="chk" for="s6e"><input type="checkbox" id="s6e" ${S.mal?"checked":""}> Usar rangos de distinto tamaño</label></div>
      ${fxbar(S.mal?"B5":`${col}${fila}`, `<span class="mono">${esc(f)}</span>`)}
      <div class="sheetwrap"><table class="sheet"><thead><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr></thead><tbody>
        <tr><td class="rn">4</td><td class="hd">Sede</td>${canales.map(k=>`<td class="hd">${k}</td>`).join("")}<td class="hd">Total</td></tr>
        ${sedes.map((s,i)=>`<tr><td class="rn">${5+i}</td><td>${s}</td>${M[i].map((v,j)=>celda(v,i,j)).join("")}<td class="num bold">${S.mal?"#¡VALOR!":nf.format(M[i].reduce((a,b)=>a+b,0))}</td></tr>`).join("")}
        <tr><td class="rn">11</td><td class="bold">Total</td>${canales.map((_,j)=>`<td class="num bold">${S.mal?"#¡VALOR!":nf.format(M.reduce((a,row)=>a+row[j],0))}</td>`).join("")}<td class="num bold">${S.mal?"#¡VALOR!":nf.format(tot)}</td></tr>
      </tbody></table></div>
      <div class="insight">${S.mal ? "Los rangos tienen distinto tamaño (17.000 frente a 16.999 filas): Excel devuelve #¡VALOR! en todas las celdas. Con columnas de una Tabla no puede pasar."
        : tot===piv ? `<b>✓ Cuadra con la tabla dinámica:</b> ${nf.format(piv)} de venta neta en ${MESES[S.mes-1].toLowerCase()} de ${S.anio}.`
        : `<b>✗ No cuadra con la tabla dinámica</b> (${nf.format(piv)}): sin el criterio de estado se suman ${nf.format(tot-piv)} pesos de facturas anuladas.`}</div>
    </div>`;
    $("#s6a").value=S.anio; $("#s6m").value=S.mes;
    $("#s6a").onchange=e=>{S.anio=+e.target.value;draw()}; $("#s6m").onchange=e=>{S.mes=+e.target.value;draw()};
    $("#s6x").onchange=e=>{S.anuladas=e.target.checked;draw()}; $("#s6e").onchange=e=>{S.mal=e.target.checked;draw()};
    el.querySelectorAll("[data-c]").forEach(td=>td.onclick=()=>{ S.sel=td.dataset.c.split(",").map(Number); draw() });
  };
  draw();
};

/* ---- Clave 8: editor de pasos de Power Query ---- */
SIMS[8] = function(el){
  const ORIG = D.erp_pq.filas.map(r=>({linea:r[0], fac:r[1], fecha:r[2], cod:r[3], ciudad:r[4], cant:r[5], valor:r[6], estado:r[7]}));
  const SEG = D.erp_pq.segmento;
  const PASOS = [
    {id:"auto", n:"Tipo cambiado (automático)", m:`Table.TransformColumnTypes(Origen,{{"Cantidad", Int64.Type}, {"Valor Neto", Int64.Type}})`},
    {id:"cod", n:"Texto recortado y en mayúsculas", m:`Table.TransformColumns(#"Paso anterior",{{"Cod Cliente", each Text.Upper(Text.Trim(_)), type text}})`},
    {id:"valor", n:"Valor reemplazado y a número", m:`Table.ReplaceValue(Table.ReplaceValue(#"Paso anterior","$","",Replacer.ReplaceText,{"Valor Neto"}),".","",Replacer.ReplaceText,{"Valor Neto"})`},
    {id:"cant", n:"Cantidad sin « und» y a número", m:`Table.ReplaceValue(#"Paso anterior"," und","",Replacer.ReplaceText,{"Cantidad"})`},
    {id:"fecha", n:"Personalizada agregada (fecha)", m:`Table.AddColumn(#"Paso anterior", "Fecha", each try Date.FromText([Fecha], "es-CO") otherwise Date.From(Number.From([Fecha])), type date)`},
    {id:"dup", n:"Duplicados quitados", m:`Table.Distinct(#"Paso anterior")`},
    {id:"join", n:"Consultas combinadas (Clientes)", m:`Table.NestedJoin(#"Paso anterior", {"Cod Cliente"}, tClientes, {"id_cliente"}, "tClientes", JoinKind.LeftOuter)`},
  ];
  const on = {auto:true, cod:false, valor:false, cant:false, fecha:false, dup:false, join:false};
  const ERR = "Error";
  const aplicar = ()=>{
    let t = ORIG.map(r=>({...r}));
    if(on.auto) t.forEach(r=>{ r.cant = /^\d+$/.test(r.cant)? +r.cant : ERR; r.valor = typeof r.valor==="number"? r.valor : (r.valor===""? null : ERR) });
    if(on.cod) t.forEach(r=>{ r.cod = r.cod.trim().toUpperCase() });
    if(on.valor) t.forEach(r=>{ if(r.valor!==ERR && typeof r.valor==="string") r.valor = r.valor===""? null : +r.valor.replace(/[$.\s]/g,"") });
    if(on.cant) t.forEach(r=>{ if(r.cant!==ERR && typeof r.cant==="string") r.cant = +r.cant.replace(" und","") });
    if(on.fecha) t.forEach(r=>{ const s=r.fecha; let d=null; let m=s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/); if(m) d=`${m[3]}-${m[2]}-${m[1]}`; else if(/^\d{4}-\d{2}-\d{2}$/.test(s)) d=s; else if(/^\d{5}$/.test(s)){ const x=new Date(Date.UTC(1899,11,30)+(+s)*864e5); d=x.toISOString().slice(0,10) } r.fecha=d });
    if(on.dup){ const vistos=new Set(); t=t.filter(r=>{ const k=JSON.stringify(r); if(vistos.has(k)) return false; vistos.add(k); return true }) }
    if(on.join) t.forEach(r=>{ r.seg = SEG[r.cod] || null });
    return t;
  };
  const draw = ()=>{
    const t = aplicar();
    const errores = t.reduce((a,r)=>a+(r.cant===ERR)+(r.valor===ERR),0);
    const textos = t.reduce((a,r)=>a+(typeof r.cant==="string"&&r.cant!==ERR)+(typeof r.valor==="string"&&r.valor!==ERR&&r.valor!==""),0);
    const sinSeg = on.join ? t.filter(r=>!r.seg).length : null;
    const celda = v => v===ERR ? `<td style="color:var(--bad); font-weight:600">Error</td>` : v==null? `<td class="muted">null</td>` :
      typeof v==="number" ? `<td class="num">${nf.format(v)}</td>` : `<td>${esc(String(v)).replace(/ $/,'<span class="sp">·</span>')}</td>`;
    el.innerHTML = `<div class="stack">
      <p class="read">Trece filas reales de la exportación, con todos sus defectos. Activa los pasos en orden, como en el panel <b>Pasos aplicados</b> de Power Query, y mira cómo cambia la vista previa. Empieza observando qué hace el paso automático de tipos.</p>
      <div class="two" style="grid-template-columns:minmax(0,.8fr) minmax(0,1.6fr)">
        <div class="panel"><span class="eyebrow">Pasos aplicados</span>
          <div class="checklist" style="margin-top:8px"><label class="done"><input type="checkbox" checked disabled> <span>Origen</span></label>
          ${PASOS.map(p=>`<label class="${on[p.id]?"done":""}"><input type="checkbox" data-p="${p.id}" ${on[p.id]?"checked":""}> <span>${p.n}</span></label>`).join("")}</div>
          <p class="muted small" style="margin-top:8px">Cada paso es una línea de M. La barra de fórmulas muestra la del último paso activo.</p></div>
        <div class="stack" style="gap:8px">
          ${fxbar("M", `<span class="mono">${esc((PASOS.filter(p=>on[p.id]).pop()||{m:'Excel.CurrentWorkbook(){[Name="tERP"]}[Content]'}).m)}</span>`)}
          <div class="sheetwrap"><table class="sheet"><thead><tr><th>Línea</th><th>Fecha</th><th>Cod Cliente</th><th>Cantidad</th><th>Valor Neto</th>${on.join?"<th>segmento</th>":""}</tr></thead><tbody>
            ${t.map(r=>`<tr><td>${r.linea}</td>${celda(r.fecha)}${celda(r.cod)}${celda(r.cant)}${celda(r.valor)}${on.join?celda(r.seg):""}</tr>`).join("")}
          </tbody></table></div></div>
      </div>
      <div class="row"><span class="tag">${t.length} filas</span><span class="tag ${errores?"":"ok"}">${errores} celdas en Error</span><span class="tag ${textos?"":"ok"}">${textos} números como texto</span>${on.join?`<span class="tag ${sinSeg>1?"":"ok"}">${sinSeg} sin segmento</span>`:""}</div>
      <div class="insight">${on.auto && (on.valor||on.cant) ? "El paso automático ya convirtió en <b>Error</b> los montos con «$» y la cantidad con «und»: los pasos de limpieza que siguen no pueden recuperarlos. Desactiva «Tipo cambiado (automático)»."
        : on.auto ? `Power Query adivinó que Cantidad y Valor Neto son números y dejó <b>${errores} celdas en Error</b>. En el Editor verías esas celdas en rojo.`
        : errores===0 && textos===0 && on.fecha && on.dup && on.join && on.cod ? `Tabla limpia: ${t.length} filas, sin errores, fechas convertidas y segmento traído del maestro. ${sinSeg===1?"La fila sin segmento es un código que no existe en el maestro (clave 5).":""} El próximo mes: <b>Actualizar todo</b>.`
        : "Sigue activando pasos. Observa que el orden importa: la llave se limpia antes de combinar."}</div>
    </div>`;
    el.querySelectorAll("[data-p]").forEach(cb=>cb.onchange=()=>{ on[cb.dataset.p]=cb.checked; draw() });
  };
  draw();
};

/* ---- Clave 9: validación y formato condicional ---- */
SIMS[9] = function(el){
  const ciudades = DM.ciudad, canales = DM.canal;
  let filas = [
    {v:"Laura Gómez", ciu:"Bogotá", can:"Presencial", prod:"Resma carta 75 g", cant:40, desc:0.05},
    {v:"Diego Rojas", ciu:"Bogota", can:"Televentas", prod:"Silla ergonómica malla", cant:6, desc:0.10},
    {v:"Laura Gómez", ciu:"Medellín", can:"E-commerce", prod:"Monitor 24\" FHD", cant:0, desc:0},
    {v:"Paula Ortiz", ciu:"B/quilla", can:"Presencial", prod:"Tóner negro alto rendimiento", cant:12, desc:0.25},
    {v:"Diego Rojas", ciu:"Cali", can:"Ecommerce", prod:"Café molido 500 g", cant:30, desc:0.05},
  ];
  let S = {validar:true, circulos:false, regla:false, msg:""};
  const malo = f => ({ciu:!ciudades.includes(f.ciu), can:!canales.includes(f.can), prod:!D.productos_lista.includes(f.prod), cant:!(Number.isInteger(f.cant)&&f.cant>0), desc:!(f.desc>=0&&f.desc<=0.15)});
  const draw = ()=>{
    const td = (f,k,txt) => { const m=malo(f)[k]; return `<td style="${S.circulos&&m?"box-shadow:inset 0 0 0 2px var(--bad); border-radius:12px":""}">${esc(txt)}</td>` };
    el.innerHTML = `<div class="stack">
      <p class="read">La hoja <b>Pedidos</b> trae cinco filas con errores típicos. Marca dónde hay datos inválidos, activa la regla de formato condicional y luego intenta registrar un pedido nuevo con y sin validación.</p>
      <div class="ctl"><label class="chk" for="s9c"><input type="checkbox" id="s9c" ${S.circulos?"checked":""}> Rodear con un círculo datos no válidos</label>
        <label class="chk" for="s9r"><input type="checkbox" id="s9r" ${S.regla?"checked":""}> Formato condicional: =$H2&gt;=0,10 (descuento que requiere aprobación)</label></div>
      <div class="sheetwrap"><table class="sheet"><thead><tr><th></th><th>vendedor</th><th>ciudad</th><th>canal</th><th>producto</th><th>cantidad</th><th>descuento</th></tr></thead><tbody>
        ${filas.map((f,i)=>`<tr style="${S.regla&&f.desc>=0.10?"background:var(--warn-soft)":""}"><td class="rn">${i+2}</td><td>${esc(f.v)}</td>${td(f,"ciu",f.ciu)}${td(f,"can",f.can)}${td(f,"prod",f.prod)}${td(f,"cant",String(f.cant))}${td(f,"desc",Math.round(f.desc*100)+" %")}</tr>`).join("")}
      </tbody></table></div>
      <div class="panel"><div class="row" style="justify-content:space-between"><b>Registrar un pedido nuevo</b><label class="chk" for="s9v"><input type="checkbox" id="s9v" ${S.validar?"checked":""}> Validación de datos activada</label></div>
        <div class="ctl" style="margin-top:10px">
          <label for="s9ciu">Ciudad${S.validar?`<select id="s9ciu">${ciudades.map(c=>`<option>${c}</option>`).join("")}</select>`:`<input type="search" id="s9ciu" value="bogota " style="width:140px">`}</label>
          <label for="s9can">Canal${S.validar?`<select id="s9can">${canales.map(c=>`<option>${c}</option>`).join("")}</select>`:`<input type="search" id="s9can" value="Ecommerce" style="width:120px">`}</label>
          <label for="s9cant">Cantidad<input type="search" id="s9cant" value="0" style="width:80px"></label>
          <label for="s9desc">Descuento (%)<input type="search" id="s9desc" value="20" style="width:80px"></label>
          <button class="btn primary" data-add>Registrar</button></div>
        ${S.msg?`<div class="callout ${S.msg.startsWith("✓")?"good":"gap"}" role="alert" style="margin-top:10px">${S.msg}</div>`:""}</div>
      <div class="insight">${S.validar?"Con validación, la ciudad y el canal solo se pueden elegir de las listas, y los números fuera de rango se detienen con un mensaje que explica qué hacer.":"Sin validación, Excel acepta lo que sea: «bogota » con espacio, «Ecommerce», cantidad 0. Así nacen las 16 variantes de ciudad."}</div>
    </div>`;
    $("#s9c").onchange=e=>{S.circulos=e.target.checked;draw()}; $("#s9r").onchange=e=>{S.regla=e.target.checked;draw()};
    $("#s9v").onchange=e=>{S.validar=e.target.checked;S.msg="";draw()};
    $("[data-add]",el).onclick=()=>{
      const f = {v:"Tú", ciu:$("#s9ciu").value, can:$("#s9can").value, prod:"Resma carta 75 g", cant:+$("#s9cant").value, desc:(+String($("#s9desc").value).replace(",","."))/100};
      const m = malo(f);
      if(S.validar && (m.cant||m.desc)){ S.msg = m.cant ? "<b>Detener:</b> la cantidad debe ser un número entero mayor que 0." : "<b>Detener:</b> el descuento máximo es 15 %. Para más, pide aprobación."; draw(); return }
      filas.push(f); S.msg = Object.values(m).some(Boolean) ? "Registrado sin validación, con datos inválidos. Activa «Rodear con un círculo» para verlos." : "✓ Pedido registrado con datos válidos."; draw();
    };
  };
  draw();
};
