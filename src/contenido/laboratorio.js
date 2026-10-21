/* ======================================================================
   CONTENIDO · Laboratorio Excel + Colab: talleres guiados T0 a T3
   Cada paso tiene un punto de control («Debes ver…») para que el
   estudiante sepa si va bien sin depender del instructor.
   ====================================================================== */
const XL = f => `${GH}/raw/main/data/${f}`;   // descarga directa desde GitHub

const TALLERES = [
 {n:0, t:"Monta tu laboratorio", sub:"Carpetas, Colab y Excel listos en 20 minutos", min:20, nivel:"Inicial",
  her:"Google Drive · Colab · Excel 365", ent:"Captura del mensaje «Laboratorio listo»",
  obj:"Dejar preparado el entorno donde vas a trabajar todos los talleres: una carpeta ordenada en Google Drive, una copia propia de los cuadernos y los libros de Excel abiertos. Si este taller sale bien, los demás no tienen fricción.",
  antes:["Una cuenta de Google (personal o institucional).","Navegador Chrome o Edge actualizado.","Excel 365 de escritorio. Excel para la web también sirve, pero algunas opciones cambian de lugar.","Conexión a internet."],
  pasos:[
   {h:"Drive", t:"Crea la carpeta del laboratorio", d:`En <a href="https://drive.google.com" target="_blank" rel="noopener">Google Drive</a>: <b>Nuevo › Carpeta</b> y llámala <code>Laboratorio_Andina</code>. Dentro, crea cuatro subcarpetas:<pre class="code">Laboratorio_Andina/
├── 1_datos        ← libros de Excel y archivos CSV
├── 2_cuadernos    ← tus copias de los cuadernos de Colab
├── 3_salidas      ← lo que producen los cuadernos (HTML, Excel)
└── 4_tableros     ← tus tableros de Excel terminados</pre>`, ck:"Ves las cuatro subcarpetas con esos nombres."},
   {h:"Excel", t:"Descarga los libros de práctica", d:`Descarga <a href="${XL("Distribuidora_Andina_practica.xlsx")}">Distribuidora_Andina_practica.xlsx</a> y <a href="${XL("Andina_listo_para_dinamicas.xlsx")}">Andina_listo_para_dinamicas.xlsx</a>. Guárdalos en tu computador y súbelos también a <code>1_datos</code>. Al abrirlos, si aparece la barra amarilla de <b>Vista protegida</b>, pulsa <b>Habilitar edición</b>.`, ck:"El libro abre en la hoja LEEME y ves las pestañas Ventas, Clientes, Productos…"},
   {h:"Colab", t:"Abre el cuaderno 00", d:`Abre <a href="${colabURL("00_conoce_la_empresa.ipynb")}" target="_blank" rel="noopener">00 · Conoce la empresa y sus datos</a>. Se abre en Colab, en modo lectura.`, ck:"Ves el logo de Dr. Bits y el título del cuaderno."},
   {h:"Colab", t:"Guarda tu propia copia", d:`En Colab: <b>Archivo › Guardar una copia en Drive</b>. Colab la guarda en la carpeta <code>Colab Notebooks</code> de tu Drive; desde Drive, muévela a <code>2_cuadernos</code>. Desde ahora trabaja siempre en tu copia: ahí se guardan tus cambios.`, ck:"El nombre del cuaderno empieza por «Copia de…»."},
   {h:"Colab", t:"Ejecuta todo", d:`<b>Entorno de ejecución › Ejecutar todas</b> (o Ctrl+F9). Si Colab avisa que el cuaderno no fue creado por Google, pulsa <b>Ejecutar de todos modos</b>: este viene del repositorio del curso. Hazlo solo con cuadernos de fuentes que conoces.`, ck:"Al final del cuaderno aparece «Laboratorio listo» y un gráfico de venta mensual."},
   {h:"Excel", t:"Prueba la tabla dinámica", d:`En <code>Andina_listo_para_dinamicas.xlsx</code>, haz clic en cualquier celda de la hoja Ventas y elige <b>Insertar › Tabla dinámica › Aceptar</b>. Solo queremos comprobar que funciona: cierra sin guardar.`, ck:"Aparece a la derecha la lista de campos: fecha, anio, mes, ciudad…"},
  ],
  errores:[["No aparece «Guardar una copia en Drive»","No iniciaste sesión con tu cuenta de Google.","Inicia sesión arriba a la derecha y vuelve a abrir el enlace."],
           ["Colab dice «Sesión desconectada»","La sesión se cierra tras un rato sin uso.","Entorno de ejecución › Volver a conectar, y luego Ejecutar todas."],
           ["El libro abre en Vista protegida y no deja editar","Excel protege los archivos descargados.","Pulsa Habilitar edición."],
           ["En Excel para la web no encuentro una opción","La versión web reorganiza algunos menús.","Usa Excel de escritorio para los talleres 2 y 3."]],
  reto:"Comparte con tu instructor (con permiso de lectura) la carpeta Laboratorio_Andina.",
  docente:{duracion:[["Explicar el porqué del laboratorio",5,"Un entorno ordenado evita perder archivos y permite repetir el proceso."],["Pasos 1 a 6",15,"Avanza paso a paso; nadie sigue sin ver el punto de control."]],
   errores:["Estudiantes que trabajan en el cuaderno original y pierden sus cambios: insiste en «Guardar una copia».","Cuentas institucionales con Colab bloqueado: ten listo un plan B con cuentas personales."],cierre:"Si todos ven «Laboratorio listo», la próxima sesión arranca sin fricción."}},

 {n:1, t:"De Excel a Colab", sub:"Tu libro de Excel se convierte en un informe interactivo", min:45, nivel:"Inicial",
  her:"Excel 365 · Colab", ent:"informe_interactivo_Andina.html", nb:"taller_1_excel_a_colab.ipynb",
  obj:"Llevar un libro de Excel a Colab para obtener, en minutos, gráficos de análisis que en Excel toman mucho trabajo (mapa de calor, Pareto, comparación de sedes en paralelo) y entregarlos como una página web interactiva que cualquiera abre en su navegador.",
  antes:["Taller 0 terminado.","Andina_listo_para_dinamicas.xlsx en tu computador o en 1_datos."],
  pasos:[
   {h:"Excel", t:"Prepara la fuente", d:`Abre <code>Andina_listo_para_dinamicas.xlsx</code>. Comprueba que la hoja Ventas es una Tabla llamada <code>tVentas</code> (al hacer clic aparece la pestaña <b>Diseño de tabla</b>). <b>No cambies los nombres de las columnas</b>: Colab los usa. Para comprobar que Colab lee tu archivo y no otro, cambia el nombre del primer cliente por el tuyo y guarda.`, ck:"Ves la pestaña Diseño de tabla y el nombre tVentas."},
   {h:"Colab", t:"Abre el cuaderno del taller y guarda tu copia", d:`Abre <a href="${colabURL("taller_1_excel_a_colab.ipynb")}" target="_blank" rel="noopener">Taller 1 · De Excel a Colab</a> y usa <b>Archivo › Guardar una copia en Drive</b>.`, ck:"El nombre empieza por «Copia de…»."},
   {h:"Colab", t:"Elige de dónde viene el libro", d:`En la primera celda hay una lista desplegable <b>fuente</b> con tres opciones: <b>Subir desde mi computador</b> (aparece un botón «Elegir archivos»), <b>Desde mi Google Drive</b> (Colab pide permiso para ver tu Drive y busca el libro en <code>Laboratorio_Andina/1_datos</code>) o <b>Copia del curso</b>. Ejecuta la celda con el botón ▶.`, ck:"El cuaderno dice cuántas filas y columnas leyó de la hoja Ventas y muestra el primer cliente: si lo cambiaste, ves tu nombre."},
   {h:"Colab", t:"Revisa el diagnóstico automático", d:`La siguiente celda revisa el libro antes de analizarlo: columnas esperadas, fechas, filas anuladas y valores vacíos. Es el hábito de la clave 12: comprobar antes de concluir.`, ck:"Todas las revisiones aparecen con ✓."},
   {h:"Colab", t:"Configura y genera los gráficos", d:`En el formulario elige <b>año</b>, <b>sede</b> y <b>medida</b> (venta neta o margen bruto) y ejecuta. El cuaderno dibuja cinco gráficos interactivos, cada uno con su ficha de decisión: mapa de calor sede × mes, Pareto de clientes, mapa de árbol línea → producto, una pequeña gráfica por sede y dispersión de vendedores.`, ck:"Al pasar el mouse sobre un gráfico ves los valores exactos."},
   {h:"Colab", t:"Exporta el informe", d:`La última celda crea <code>informe_interactivo_Andina.html</code> con los cinco gráficos y lo descarga. Ese archivo funciona sin Colab y sin internet: se puede enviar por correo o Teams. Guárdalo en <code>3_salidas</code>.`, ck:"Abres el archivo en el navegador y los gráficos responden al mouse."},
  ],
  errores:[["El botón «Elegir archivos» no hace nada","El navegador bloquea cookies de terceros (frecuente en Safari o modo incógnito).","Usa la opción «Desde mi Google Drive», o sube el archivo con el ícono de carpeta del panel izquierdo de Colab y elige «Copia ya subida al panel»."],
           ["Error con el nombre de una columna","Se cambió el nombre de una columna en Excel.","Restaura el nombre original o vuelve a descargar el libro."],
           ["La descarga no aparece","El navegador bloqueó la descarga automática.","Panel de archivos de Colab (ícono de carpeta) › clic derecho sobre el archivo › Descargar."]],
  reto:"Genera el informe solo para la sede que te asigne el instructor y escribe tres hallazgos con cifra, cada uno basado en uno de los gráficos.",
  docente:{duracion:[["Por qué unir herramientas",5,"Excel es donde está la información; Colab es donde se analiza y visualiza rápido."],["Pasos 1 a 4",15,"Insiste en el diagnóstico automático: «primero revisar, luego graficar»."],["Pasos 5 y 6",15,"Pide que comparen el mapa de calor con lo que tardarían en hacerlo en Excel."],["Reto",10,"Tres hallazgos por persona; lee dos en voz alta."]],
   preguntas:["¿Qué gráfico de este informe sería más difícil en Excel? ¿Por qué?","¿Qué ventaja tiene entregar un HTML en lugar de un Excel? ¿Y qué desventaja?"],
   errores:["Cuentas institucionales que no permiten montar Drive: usa la subida desde el computador.","Estudiantes que cambiaron columnas en Excel «para ordenar»."],cierre:"Excel conserva los datos; Colab los convierte en análisis que se comparte."}},

 {n:2, t:"De Colab a Excel", sub:"Colab prepara los datos; tú construyes un tablero con segmentaciones", min:90, nivel:"Intermedio",
  her:"Colab · Excel 365", ent:"Panel_Andina_<tu nombre>.xlsx", nb:"taller_2_colab_a_excel.ipynb",
  obj:"Usar Colab para unir las cinco tablas de la empresa en una sola, validarla y entregarla como libro de Excel. Luego, en Excel, construir un tablero interactivo con tablas dinámicas, gráficos dinámicos, segmentaciones, escala de tiempo e indicadores que se actualizan solos.",
  antes:["Taller 0 terminado.","Haber visto la clave 7 (tablas dinámicas) o tenerla abierta al lado."],
  parte:{0:"Parte A · En Colab (20 min)", 2:"Parte B · En Excel 365 (70 min)"},
  pasos:[
   {h:"Colab", t:"Une y valida las tablas", d:`Abre <a href="${colabURL("taller_2_colab_a_excel.ipynb")}" target="_blank" rel="noopener">Taller 2 · De Colab a Excel</a>, guarda tu copia y ejecuta todo. El cuaderno lee ventas, clientes, productos, vendedores, sedes y metas, las une por sus llaves, crea columnas de tiempo (año, mes, trimestre), valida el resultado y te muestra un gráfico de cómo quedó cada tabla. Es lo que en Excel serían 8 columnas de BUSCARX sobre 17.106 filas.`, ck:"Las cuatro validaciones aparecen con ✓: ninguna fila perdida, ninguna duplicada, todas las llaves cruzaron y el total cuadra con la fuente."},
   {h:"Colab", t:"Descarga el libro listo para dinámicas", d:`La última celda crea y descarga <code>Andina_listo_para_dinamicas.xlsx</code>, con las Tablas <code>tVentas</code> y <code>tMetas</code> y una hoja <code>Panel</code> vacía. Guárdalo en <code>4_tableros</code> con el nombre <code>Panel_Andina_TuNombre.xlsx</code>. Si no puedes usar Colab, <a href="${XL("Andina_listo_para_dinamicas.xlsx")}">descarga aquí el mismo libro</a>.`, ck:"Al abrirlo ves las hojas LEEME, Panel, Ventas y Metas."},
   {h:"Excel", t:"Crea una hoja de cálculos", d:`Agrega una hoja llamada <code>Calculos</code>. Ahí van las tablas dinámicas; el <code>Panel</code> solo muestra resultados. Separar cálculo de presentación es la clave 1 aplicada a tableros.`, ck:"El libro tiene las hojas Panel, Calculos, Ventas y Metas."},
   {h:"Excel", t:"Dinámica 1 · Venta por mes", d:`Clic en <code>tVentas</code> › <b>Insertar › Tabla dinámica</b> › Hoja de cálculo existente: <code>Calculos!A3</code>. Arrastra <b>fecha</b> a Filas (Excel la agrupa en años y trimestres; clic derecho › <b>Agrupar</b> › marca <b>Meses</b> y <b>Años</b>), <b>subtotal</b> a Valores y <b>estado</b> a Filtros, dejando solo Pagada y Pendiente.`, ck:"Ves 24 filas de meses agrupados por año, sin anuladas."},
   {h:"Excel", t:"Dinámicas 2 y 3 · Ciudad y canal", d:`Repite desde <code>tVentas</code>, en <code>Calculos!E3</code> y <code>Calculos!I3</code>. <b>Dinámica 2:</b> ciudad en Filas; subtotal y margen_bruto en Valores; ordena de mayor a menor. <b>Dinámica 3:</b> canal en Filas; subtotal en Valores › clic derecho › <b>Mostrar valores como › % del total general</b>. Aplica a ambas el mismo filtro de estado.`, ck:"Tres dinámicas en la hoja Calculos, todas creadas desde tVentas."},
   {h:"Excel", t:"Gráficos dinámicos", d:`Clic en cada dinámica › <b>Analizar tabla dinámica › Gráfico dinámico</b>: <b>Línea</b> para la venta por mes, <b>Barra agrupada</b> para la ciudad y <b>Anillo</b> para el canal (son solo 3 partes). Córtalos (Ctrl+X) y pégalos en el Panel. Quita los botones grises: <b>Analizar gráfico dinámico › Botones de campo › Ocultar todo</b>.`, ck:"Tres gráficos en el Panel, sin botones grises."},
   {h:"Excel", t:"Segmentaciones y escala de tiempo", d:`Clic en la dinámica 1 › <b>Analizar tabla dinámica › Insertar segmentación de datos</b> › marca <b>ciudad</b>, <b>categoria</b> y <b>canal</b>. Luego <b>Insertar escala de tiempo</b> › <b>fecha</b>. Muévelas al Panel: segmentaciones a la izquierda y escala de tiempo arriba.`, ck:"Cuatro filtros en el Panel."},
   {h:"Excel", t:"Conecta los filtros a todas las dinámicas", d:`Clic derecho sobre cada segmentación › <b>Conexiones de informe</b> › marca las tres dinámicas. Repite con la escala de tiempo. Funciona porque las tres dinámicas vienen de la misma Tabla.`, ck:"Al hacer clic en Medellín, los tres gráficos cambian a la vez."},
   {h:"Excel", t:"Indicadores que se actualizan solos", d:`En el Panel, escribe <code>=</code> y haz clic en el <b>Total general</b> del subtotal de la dinámica 2. Excel crea una fórmula <code>IMPORTARDATOSDINAMICOS</code>. Haz lo mismo con el margen y divide para obtener el margen %. Para el tercer indicador, apunta a la fila E-commerce de la dinámica 3. Dales formato grande (24 pt) y una etiqueta encima.`, ck:"Al filtrar por Cali con la segmentación, los indicadores cambian."},
   {h:"Excel", t:"Diseño final", d:`<b>Vista › Líneas de cuadrícula</b> (desmarcar). Título con hallazgo en la parte superior. Alinea los objetos: selecciónalos con Ctrl y usa <b>Formato de forma › Alinear</b>. Sigue el boceto de abajo. Guarda.`, ck:"El Panel se ve como un tablero, sin cuadrícula y con todos los elementos alineados."},
  ],
  boceto:true,
  errores:[["Conexiones de informe no muestra todas las dinámicas","Alguna dinámica se creó desde otro rango o con el Modelo de datos.","Crea las tres desde tVentas, con la misma opción de Modelo de datos."],
           ["La escala de tiempo dice que no hay campos de fecha","La columna fecha quedó como texto.","Revisa que las celdas estén alineadas a la derecha. Si no, conviértelas (clave 2) o vuelve a descargar el libro."],
           ["Los meses salen en orden alfabético (Abr, Ago, Dic…)","Usaste nombre_mes en lugar de la fecha agrupada.","Usa fecha agrupada por meses, o el campo mes (número)."],
           ["El indicador muestra #REF!","Moviste o borraste la dinámica a la que apunta.","Vuelve a crear la fórmula con = y clic en el total."]],
  reto:"Agrega una cuarta dinámica con los 10 mejores clientes (clic en la flecha de Filas › Filtros de valor › Diez mejores) y conéctala a las segmentaciones.",
  docente:{duracion:[["Parte A: Colab une y valida",20,"Muestra el gráfico de validación y explica qué habría costado en Excel."],["Dinámicas 1 a 3",25,"Revisa que todas salgan de tVentas: es el error que rompe las conexiones."],["Gráficos y filtros",25,"Momento clave: el clic en Medellín que mueve todo."],["Indicadores y diseño",20,"Pide un título con hallazgo, no «Tablero de ventas»."]],
   preguntas:["¿Por qué las dinámicas van en una hoja aparte del Panel?","¿Qué hizo Colab que en Excel habría sido lento o propenso a errores?"],
   errores:["Dinámicas creadas desde rangos distintos que no se pueden conectar.","Estudiantes que filtran anuladas en una dinámica y no en las otras: los totales no cuadran."],cierre:"Colab prepara y valida; Excel presenta y permite explorar."}},

 {n:3, t:"Tablero para el comité", sub:"Llega un mes nuevo: actualiza, integra y presenta", min:90, nivel:"Intermedio",
  her:"Excel 365 · Colab · IA", ent:"Panel actualizado + tablero_comite.html + informe de una página", nb:"taller_3_tablero_comite.ipynb",
  obj:"Demostrar que el proceso se puede repetir: agregar un mes nuevo de datos, actualizar el tablero de Excel con un clic, generar en Colab un tablero web para el comité y escribir un informe de una página. Así se trabaja en un área de análisis real.",
  antes:["Talleres 1 y 2 terminados.","Tu Panel_Andina_TuNombre.xlsx con segmentaciones funcionando."],
  escenario:"Es lunes 2 de febrero de 2026. A las 9:00 se reúne el comité comercial y acaban de llegar los datos de enero. El gerente quiere saber tres cosas: ¿cómo cerró enero frente a la meta?, ¿qué sede preocupa? y ¿qué está pasando con los canales?",
  pasos:[
   {h:"Excel", t:"Agrega enero a tus Tablas", d:`Descarga <a href="${XL("nuevo_mes/Andina_enero_2026_para_pegar.xlsx")}">Andina_enero_2026_para_pegar.xlsx</a>. En su hoja <code>Ventas_enero</code>, selecciona las filas de datos <b>sin el encabezado</b> y cópialas. En tu Panel, ve a la hoja Ventas, ubícate en la primera celda vacía debajo de la Tabla y pega. La Tabla crece sola. Repite con <code>Metas_enero</code> debajo de <code>tMetas</code>.`, ck:"La última fila de tVentas tiene fecha 2026-01 y la Tabla la incluye (franjas de color hasta el final)."},
   {h:"Excel", t:"Actualiza todo", d:`<b>Datos › Actualizar todo</b>. Las dinámicas, los gráficos, las segmentaciones y la escala de tiempo incluyen enero de 2026.`, ck:`Con la escala de tiempo en enero de 2026 y sin anuladas, la venta neta es <b>$ ${D.enero2026?nf.format(D.enero2026.venta):"—"}</b>. Si coincide, tu actualización es correcta.`},
   {h:"Colab", t:"Genera el tablero web del comité", d:`Abre <a href="${colabURL("taller_3_tablero_comite.ipynb")}" target="_blank" rel="noopener">Taller 3 · Tablero para el comité</a>, guarda tu copia y ejecuta todo. El cuaderno integra 2024, 2025 y enero de 2026, compara con las metas y crea <code>tablero_comite_enero2026.html</code>: indicadores, real contra meta por sede, tendencia de 13 meses y participación por canal, con una lista desplegable para ver cada sede.`, ck:`El cuaderno muestra la misma cifra de control: $ ${D.enero2026?nf.format(D.enero2026.venta):"—"}. Excel y Colab cuadran.`},
   {h:"Informe", t:"Escribe el informe de una página", d:`Usa la plantilla de abajo. Cada hallazgo lleva una cifra, una comparación y la pregunta que sigue. Puedes pedirle un borrador a una IA con la instrucción de abajo, pero verifica que cada cifra esté en tu tablero.`, ck:"Tres hallazgos, cada uno con cifra y comparación, y una recomendación."},
   {h:"Comité", t:"Presenta en tres minutos", d:`Abre el tablero web, filtra la sede que preocupa y lee tus tres hallazgos. Responde una pregunta usando el Panel de Excel en vivo.`, ck:"Respondiste la pregunta filtrando el tablero, sin calcular nada a mano."},
  ],
  plantilla:`INFORME COMERCIAL · ENERO 2026 · Distribuidora Andina S.A.S.
Elaboró: [tu nombre]   Fecha: 2 de febrero de 2026   Fuente: ERP, corte 31/01/2026

1. [Hallazgo con cifra] — [comparación contra meta o contra enero de 2025]
   Siguiente pregunta: [qué hay que averiguar]
2. [Hallazgo con cifra] — [comparación]
   Siguiente pregunta: [...]
3. [Hallazgo con cifra] — [comparación]
   Siguiente pregunta: [...]

Recomendación: [una acción concreta, con responsable]
Anexos: Panel_Andina_[nombre].xlsx · tablero_comite_enero2026.html`,
  ia:[{t:"Borrador del informe (verifica cada cifra)", p:`Actúa como analista comercial. Con estos resultados de enero de 2026 de una distribuidora (cifras en pesos, venta neta sin IVA):
[pega aquí: venta y meta por sede, venta por canal, comparación con enero 2025]
Redacta 3 hallazgos para el comité comercial. Cada uno con: la cifra, una comparación y la pregunta que habría que investigar.
Luego una recomendación concreta. Máximo 150 palabras. No uses cifras que no estén en los datos que te di.`}],
  errores:[["La Tabla no creció al pegar","Pegaste dejando una fila vacía entre la Tabla y los datos nuevos.","Diseño de tabla › Cambiar tamaño de la tabla, y ajusta el rango hasta la última fila."],
           ["La cifra de control no coincide","Pegaste también el encabezado, faltan filas o incluiste anuladas.","Revisa que la última fila de tVentas sea de enero de 2026 y que el filtro de estado excluya Anulada."],
           ["La escala de tiempo no muestra 2026","No actualizaste.","Datos › Actualizar todo."]],
  reto:"Repite el taller completo solo, sin la guía, y mide cuánto tardas. Ese tiempo es el que le ahorras a tu equipo cada mes.",
  rubrica:true,
  docente:{duracion:[["Escenario",5,"Lee el escenario como si fueras el gerente."],["Actualización en Excel",20,"Todos deben llegar a la cifra de control antes de seguir."],["Tablero web en Colab",20,"Muestra que las dos herramientas dan la misma cifra."],["Informe",25,"Revisa que cada hallazgo tenga cifra y comparación."],["Presentaciones",20,"Tres minutos por grupo; el resto hace de comité."]],
   preguntas:["¿Qué tendría que cambiar en el proceso si en vez de un mes llegaran datos cada día?","¿Qué parte del proceso automatizarías primero?"],
   errores:["Pegar el mes nuevo en otra hoja en vez de debajo de la Tabla.","Informes que describen el gráfico en lugar de decir qué significa."],cierre:"Un proceso bien armado se repite cada mes con un clic; el tiempo ganado se usa para pensar."}},
];

const RUBRICA = [
 ["Datos","Tablas actualizadas; la cifra de control coincide en Excel y Colab.","Datos actualizados con una diferencia que se explica.","La cifra no coincide o faltan datos."],
 ["Interactividad","Todos los filtros mueven todos los gráficos e indicadores.","Algún filtro no está conectado.","Los gráficos no responden a los filtros."],
 ["Gráficos","El tipo responde a la pregunta, están ordenados y el título dice el hallazgo.","Tipos adecuados pero títulos genéricos.","Gráficos por defecto, en 3D o sin orden."],
 ["Informe","Tres hallazgos con cifra, comparación y siguiente pregunta.","Hallazgos sin comparación o sin cifra.","Describe los gráficos sin concluir."],
 ["Orden y repetibilidad","Carpeta ordenada, archivos con nombre claro, cuaderno guardado.","Archivos completos pero desordenados.","Archivos perdidos o sin nombre."],
];

function viewLaboratorio(){
  app.innerHTML = `<div class="wrap">
    <div class="mhead"><span class="eyebrow">Laboratorio · Talleres guiados</span><h1>Excel + Colab: el poder de unir herramientas</h1>
      <p class="muted read" style="font-size:1.1rem">En una empresa nadie trabaja con una sola herramienta. Estos cuatro talleres te llevan a montar tu propio laboratorio y a construir, paso a paso, un proceso completo: los datos entran, se preparan, se analizan, se presentan y se actualizan cada mes. Cada paso tiene un punto de control para que sepas si vas bien.</p></div>
    ${docenteBox({duracion:[["Sesión 1",65,"Taller 0 (20 min) y Taller 1 (45 min)."],["Sesión 2",90,"Taller 2."],["Sesión 3",90,"Taller 3 con presentaciones al «comité»."]],
      preguntas:["¿Qué herramienta usan hoy en su trabajo o práctica para cada parte del proceso?"],cierre:"El objetivo no es Python ni Excel: es un proceso repetible que produce decisiones."})}

    <section class="block" style="border-top:0; padding-top:0"><div class="sechead"><h2>Qué aporta cada herramienta</h2></div>
      <div class="scroll"><table class="datatbl"><tr><th></th><th>Excel 365</th><th>Google Colab</th><th>Juntas</th></tr>
        <tr><td><b>Fortalezas</b></td><td>Está en todas las empresas. Tablas dinámicas, segmentaciones y edición directa. Gerencia lo conoce.</td><td>Gratis en el navegador. Procesa millones de filas. Cada paso queda escrito y se repite igual. Gráficos interactivos que se comparten como página web.</td><td>Colab prepara y valida; Excel presenta y deja explorar. El proceso se repite cada mes.</td></tr>
        <tr><td><b>Límites</b></td><td>Máximo 1.048.576 filas por hoja. Los pasos manuales son difíciles de repetir igual. Algunos gráficos de análisis cuestan mucho trabajo.</td><td>Requiere cuenta de Google. Los archivos temporales se borran al cerrar la sesión. Menos familiar para quien recibe el informe.</td><td>Hay que acordar nombres de columnas y carpetas; por eso existe el Taller 0.</td></tr></table></div>
      <div class="panel scroll" style="margin-top:14px">${flujoLab()}</div>
      <div class="callout tip" style="margin-top:12px"><span class="k">Python dentro de Excel</span><p>Algunas licencias de Microsoft 365 incluyen <b>Python en Excel</b> (<b>Fórmulas › Insertar Python</b>), que ejecuta código Python en una celda. Su disponibilidad depende de la licencia y la región. Este laboratorio no lo necesita: usa Colab, que es gratuito para cualquier estudiante.</p></div>
    </section>

    <section class="block"><a class="tcard" href="#colab" style="display:block"><span class="tn">Antes de empezar · 25 min · Sin saber programar</span><h3>Curso rápido de Google Colab</h3><p>Celdas de texto y de código, cómo ejecutar, cómo leer un error y qué son las librerías, los «poderes» de Colab.</p></a></section>

    <section class="block" style="padding-bottom:40px"><div class="sechead"><h2>Los talleres</h2><p class="muted read">Hazlos en orden. Cada uno usa lo que produjo el anterior.</p></div>
      <div class="grid2">${TALLERES.map(x=>`<a class="tcard" href="#taller-${x.n}"><span class="tn">Taller ${x.n} · ${x.min} min · ${x.nivel}</span><h3>${x.t}</h3><p>${x.sub}</p>
        <div class="tags"><span class="tag">${x.her}</span>${pasosHechos(x)?`<span class="tag ok">${pasosHechos(x)} de ${x.pasos.length} pasos</span>`:""}</div><span class="small"><b>Entregable:</b> ${esc(x.ent)}</span></a>`).join("")}</div>
    </section></div>`;
}
function pasosHechos(x){ const st=PROG.check["taller-"+x.n]||{}; return Object.values(st).filter(Boolean).length }

function viewTaller(n){
  const x = TALLERES[n]; if(!x){ location.hash="#laboratorio"; return }
  const sig = TALLERES[n+1];
  app.innerHTML = `<div class="wrap">
    <div class="mhead"><a href="#laboratorio" class="muted small">← Laboratorio</a>
      <span class="eyebrow">Taller ${x.n} de 3</span><h1>${x.t}</h1><p class="muted" style="font-size:1.1rem">${x.sub}</p>
      <div class="taller-meta"><div><span>Duración</span>${x.min} min</div><div><span>Nivel</span>${x.nivel}</div><div><span>Herramientas</span>${x.her}</div><div><span>Entregable</span>${esc(x.ent)}</div></div></div>
    <div class="stack read" style="max-width:860px; padding-bottom:40px; gap:22px">
      ${docenteBox(x.docente)}
      <p style="font-size:1.05rem">${x.obj}</p>
      ${x.escenario?`<div class="callout warn"><span class="k">Escenario</span><p>${x.escenario}</p></div>`:""}
      <div class="callout"><span class="k">Antes de empezar</span><ul class="plain">${x.antes.map(a=>`<li>${a}</li>`).join("")}</ul></div>
      <div><h2 style="margin-bottom:14px">Paso a paso</h2>
        <ol class="steps">${x.pasos.map((p,i)=>`${x.parte&&x.parte[i]?`<li class="parte"><h3>${x.parte[i]}</h3></li>`:""}<li><div><span class="eyebrow">${p.h}</span><b>${p.t}</b><span>${p.d}</span><div class="checkpoint"><b>Debes ver:</b> ${p.ck}</div></div></li>`).join("")}</ol></div>
      ${x.boceto?`<div><h3 style="margin-bottom:8px">Boceto del Panel</h3><div class="panel scroll">${bocetoPanel()}</div><p class="muted small" style="margin-top:6px">Es una guía de distribución, no una imagen de Excel. Arriba lo que más importa: el título con el hallazgo y los indicadores.</p></div>`:""}
      ${x.plantilla?`<div><h3 style="margin-bottom:8px">Plantilla del informe</h3>${promptsHTML([{t:"Copia y completa",p:x.plantilla}],"pl")}</div>`:""}
      ${x.ia?`<div><h3 style="margin-bottom:8px">Apoyo de IA</h3>${promptsHTML(x.ia,"ia")}</div>`:""}
      <div><h3 style="margin-bottom:8px">Si algo falla</h3><div class="scroll"><table class="datatbl"><tr><th>Lo que pasa</th><th>Por qué</th><th>Qué hacer</th></tr>${x.errores.map(e=>`<tr><td><b>${e[0]}</b></td><td>${e[1]}</td><td>${e[2]}</td></tr>`).join("")}</table></div></div>
      ${x.rubrica?`<div><h3 style="margin-bottom:8px">Rúbrica de evaluación</h3><div class="scroll"><table class="datatbl"><tr><th>Criterio</th><th>Logrado</th><th>En proceso</th><th>Por mejorar</th></tr>${RUBRICA.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join("")}</table></div></div>`:""}
      <div class="callout good"><span class="k">Reto de extensión</span><p>${x.reto}</p></div>
      <div><h3 style="margin-bottom:8px">Mi avance</h3>${checklistHTML("taller-"+x.n, x.pasos.map(p=>p.t))}<p class="muted small" style="margin-top:6px">Se guarda en este navegador.</p></div>
      <div class="row">${x.nb?`<a class="btn primary" href="${colabURL(x.nb)}" target="_blank" rel="noopener">Abrir el cuaderno en Colab</a>`:""}${sig?`<a class="btn" href="#taller-${sig.n}">Siguiente: Taller ${sig.n}</a>`:`<a class="btn" href="#laboratorio">Volver al laboratorio</a>`}</div>
    </div></div>`;
  wireCopy(app); wireChecklists(app);
}

function flujoLab(){
  const b=(x,y,w,h,t,s,fill,tc)=>`<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="var(--line)"/><text x="${x+w/2}" y="${y+24}" text-anchor="middle" style="font-family:var(--f-display);font-size:14px;font-weight:600;fill:${tc||"var(--ink)"}">${t}</text>${s.map((l,i)=>`<text x="${x+w/2}" y="${y+44+i*16}" text-anchor="middle" style="font-size:11.5px;fill:${tc?"var(--cyan)":"var(--muted)"}">${l}</text>`).join("")}</g>`;
  const ar=(x1,y1,x2,y2,l)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--brand-ink)" stroke-width="2" marker-end="url(#fl)"/>${l?`<text x="${(x1+x2)/2}" y="${(y1+y2)/2-6}" text-anchor="middle" style="font-size:11px;fill:var(--muted)">${l}</text>`:""}`;
  return `<svg viewBox="0 0 900 300" width="100%" style="min-width:700px" role="img" aria-label="Flujo del laboratorio: fuentes, Colab, Excel, comité y actualización mensual">
    <defs><marker id="fl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--brand-ink)"/></marker></defs>
    ${b(10,40,150,96,"Fuentes",["ERP · CSV","Libros de Excel"],"var(--surface-2)")}
    ${b(220,20,200,136,"Google Colab",["Unir y limpiar","Validar","Analizar y graficar"],"var(--brand)","var(--on-brand)")}
    ${b(490,20,180,96,"Excel 365",["Tablas dinámicas","Segmentaciones · Panel"],"var(--surface-2)")}
    ${b(490,150,180,80,"Tablero web",["HTML interactivo"],"var(--surface-2)")}
    ${b(730,70,160,96,"Comité",["Informe de","una página"],"var(--cyan-soft)")}
    ${ar(160,88,218,88,"")}${ar(420,62,488,62,"T2")}${ar(420,130,488,180,"T1 · T3")}${ar(670,68,728,105,"")}${ar(670,190,728,140,"")}
    <path d="M810,170 C810,280 90,280 85,140" fill="none" stroke="var(--s3)" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#fl)"/>
    <text x="450" y="268" text-anchor="middle" style="font-size:12px;fill:var(--s3);font-weight:600">Cada mes llega un mes nuevo → Actualizar (T3)</text>
  </svg>`;
}

function bocetoPanel(){
  const r=(x,y,w,h,t,fill)=>`<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${fill||"var(--surface-2)"}" stroke="var(--line)"/><text x="${x+w/2}" y="${y+h/2+4}" text-anchor="middle" style="font-size:12px;fill:${fill==="var(--brand)"?"var(--on-brand)":"var(--muted)"}">${t}</text></g>`;
  return `<svg viewBox="0 0 760 420" width="100%" style="min-width:560px" role="img" aria-label="Boceto de distribución del Panel">
    ${r(10,10,740,44,"Título con el hallazgo · ej.: «Enero cerró en 82 % de la meta; Barranquilla preocupa»","var(--brand)")}
    ${r(10,64,740,40,"Escala de tiempo (fecha)")}
    ${r(10,114,150,92,"Segmentación: ciudad")}${r(10,214,150,92,"Segmentación: categoría")}${r(10,314,150,96,"Segmentación: canal")}
    ${r(172,114,186,70,"Indicador: venta neta")}${r(368,114,186,70,"Indicador: margen %")}${r(564,114,186,70,"Indicador: % e-commerce")}
    ${r(172,194,578,110,"Gráfico de líneas: venta por mes")}
    ${r(172,314,370,96,"Barras: venta por ciudad (ordenadas)")}${r(552,314,198,96,"Anillo: canal")}
  </svg>`;
}
