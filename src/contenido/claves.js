/* ======================================================================
   CONTENIDO · Las 12 claves
   Para agregar una clave completa: añade su objeto en MOD[n] siguiendo la
   plantilla de MOD[1], su simulador en SIMS[n] y su número en PILOTO.
   ====================================================================== */
const PILOTO = [1,2,3,4,5,6,7,8,9,10,11,12];

const TRAMOS = [
 {t:"Fundamentos", d:"Lo que, si falla, hace que todo lo demás falle. Corrige aquí antes de avanzar."},
 {t:"Análisis", d:"Cruzar, resumir y limpiar datos de varias fuentes como se hace en un área de análisis."},
 {t:"Control y comunicación", d:"Que el resultado sea confiable, verificable y se pueda explicar a quien decide."},
];

/* orient = orientación teórica (para qué sirve y cuándo se usa)
   ej     = ejemplo de aplicación en un cargo real de Distribuidora Andina */
const CLAVES = [
 {n:1, tramo:0, nivel:"Básico", t:"Estructura antes que fórmulas", s:"Datos tabulares y Tablas de Excel",
  brecha:"Hojas armadas «para imprimir»: celdas combinadas, subtotales intercalados y filas en blanco que impiden filtrar, cruzar y resumir.",
  orient:"Antes de escribir una fórmula hay que decidir si la hoja es para <b>leer</b> (un reporte) o para <b>analizar</b> (una base). Una base analizable tiene una fila por registro y una columna por dato, y es la condición para filtrar, cruzar, resumir y automatizar. Se aplica cada vez que recibes o creas datos que alguien va a analizar.",
  ej:{rol:"AA", cargo:"Auxiliar administrativo", sit:"Gerencia pide el consolidado trimestral de ventas. Cada sede envía su propio reporte, con colores, celdas combinadas y subtotales.", ap:"Reconstruye una sola tabla con ciudad, línea, trimestre y subtotal, y la convierte en Tabla de Excel.", res:"El consolidado sale de una tabla dinámica en minutos, y el próximo trimestre solo se pegan las filas nuevas."}},
 {n:2, tramo:0, nivel:"Básico", nueva:true, t:"Tipos de dato que no engañan", s:"Números, textos y fechas",
  brecha:"Números guardados como texto y fechas que no son fechas: sumas que omiten valores sin avisar.",
  orient:"Excel trata de forma distinta un número, un texto y una fecha. Un número guardado como texto no suma, y una fecha guardada como texto no se puede agrupar por mes. Revisa el tipo de dato cada vez que importes información de un ERP, de la web o de un archivo CSV.",
  ej:{rol:"AC", cargo:"Auxiliar contable", sit:"Al conciliar, la suma del extracto bancario descargado en CSV da menos que el saldo del banco.", ap:"Detecta los valores alineados a la izquierda con ESNUMERO y los convierte con Datos › Texto en columnas.", res:"La conciliación cuadra y el procedimiento queda documentado para el mes siguiente."}},
 {n:3, tramo:0, nivel:"Básico", t:"Referencias que se copian bien", s:"Relativas, absolutas y mixtas",
  brecha:"Fórmulas que se rompen al arrastrarlas porque falta o sobra un $.",
  orient:"Al copiar una fórmula, Excel mueve sus referencias. El signo $ fija la columna, la fila o ambas. Se usa en toda tabla de cálculo que se arrastra: porcentajes sobre un total, precios con IVA o cálculos contra una tasa en una celda fija.",
  ej:{rol:"AN", cargo:"Analista comercial", sit:"Necesita la participación de cada sede sobre el total. Al arrastrar =B2/B8 hacia abajo obtiene errores #DIV/0!.", ap:"Fija la fila del total: =B2/B$8, y entiende por qué la fila cambia y el total no.", res:"Una sola fórmula sirve para las seis sedes y para cualquier mes."}},
 {n:4, tramo:0, nivel:"Básico", t:"Lógica condicional legible", s:"SI, Y, O, SI.CONJUNTO, SI.ERROR",
  brecha:"SI anidados de cinco niveles que nadie puede revisar, y SI.ERROR que esconde errores reales.",
  orient:"Las funciones lógicas clasifican registros según reglas de negocio. SI.CONJUNTO reemplaza los SI anidados y se lee de arriba abajo. SI.ERROR solo debe usarse cuando el error es esperado y se sabe por qué ocurre.",
  ej:{rol:"CA", cargo:"Gestor de cartera", sit:"Debe clasificar las facturas pendientes por días de mora para la reunión de cobranza.", ap:"Usa SI.CONJUNTO para asignar «Al día», «1–30», «31–60» y «Más de 60».", res:"Obtiene el informe de cartera por rango de mora, que se recalcula solo cada día."}},
 {n:5, tramo:1, nivel:"Intermedio", t:"Buscar y cruzar sin #N/D", s:"BUSCARX, INDICE+COINCIDIR, BUSCARV",
  brecha:"#N/D por espacios invisibles, BUSCARV con índice fijo y coincidencias aproximadas que devuelven datos equivocados en silencio.",
  orient:"Cruzar es traer un dato desde otra tabla usando una llave que ambas comparten, como el código del cliente. Se usa siempre que la información vive en tablas separadas: maestros de clientes, productos o empleados. Un cruce bien hecho incluye contar cuántas filas no encontraron pareja.",
  ej:{rol:"AN", cargo:"Analista comercial", sit:"La exportación del ERP trae el código del cliente pero no su segmento, y el comité quiere ver la venta por segmento.", ap:"Usa BUSCARX contra el maestro y cuenta los «No encontrado». Limpia las llaves con espacios y separa los códigos huérfanos.", res:"El 98 % de las filas cruza, y la lista de huérfanos llega al área de datos maestros."}},
 {n:6, tramo:1, nivel:"Intermedio", t:"Agregar con condiciones", s:"SUMAR.SI.CONJUNTO y CONTAR.SI.CONJUNTO",
  brecha:"Totales hechos con filtros y calculadora, imposibles de repetir el mes siguiente.",
  orient:"SUMAR.SI.CONJUNTO calcula totales que cumplen varias condiciones dentro de un formato fijo. Úsala cuando el informe tiene una forma corporativa que no cambia. Para explorar, usa una tabla dinámica.",
  ej:{rol:"AN", cargo:"Analista de planeación", sit:"El informe mensual tiene un formato aprobado por gerencia: venta por sede y canal del mes.", ap:"Construye la matriz con SUMAR.SI.CONJUNTO apuntando a una celda que contiene el mes.", res:"Cada mes solo cambia esa celda y el informe se actualiza completo."}},
 {n:7, tramo:1, nivel:"Intermedio", t:"Tablas dinámicas que responden preguntas", s:"Resumir, comparar y porcentajes",
  brecha:"Dinámicas sin pregunta de negocio, que suman anuladas, confunden líneas con facturas y promedian porcentajes.",
  orient:"Una tabla dinámica resume miles de filas sin fórmulas y permite cambiar la vista en segundos. Es la herramienta para explorar datos y responder preguntas, y la base de un tablero con segmentaciones. Su valor depende de que la pregunta esté bien formulada.",
  ej:{rol:"JC", cargo:"Coordinador comercial", sit:"El lunes, la gerencia pregunta qué sede está más lejos de la meta y por qué.", ap:"Arma una dinámica de sede por mes con venta y cumplimiento, y la filtra por canal con una segmentación.", res:"Responde en la misma reunión con cifras correctas, sin anuladas y con facturas bien contadas."}},
 {n:8, tramo:1, nivel:"Intermedio", t:"Limpieza reproducible", s:"Power Query",
  brecha:"La misma limpieza manual repetida cada mes, con resultados distintos según quién la haga.",
  orient:"Power Query registra los pasos de limpieza y transformación una sola vez y los repite con «Actualizar». Úsalo cuando el mismo archivo llega cada periodo con los mismos defectos.",
  ej:{rol:"AD", cargo:"Analista de datos", sit:"Cada lunes llega la exportación del ERP con espacios, montos como texto y filas duplicadas.", ap:"Crea una consulta que limpia, convierte los tipos, quita duplicados y une los maestros.", res:"La limpieza de los lunes pasa de 40 minutos a un clic, y siempre da el mismo resultado."}},
 {n:9, tramo:2, nivel:"Intermedio", t:"Datos que se validan solos", s:"Validación de datos y formato condicional",
  brecha:"Listas escritas a mano con variantes («Bogota», «BOGOTÁ») y alertas visuales que nadie configuró.",
  orient:"La validación de datos previene errores en la entrada (listas desplegables, rangos permitidos) y el formato condicional hace visibles las excepciones. Se usa en toda plantilla que llenan otras personas.",
  ej:{rol:"CV", cargo:"Coordinador de ventas", sit:"Los vendedores llenan un formato de pedidos especiales y cada uno escribe la ciudad a su manera.", ap:"Pone listas desplegables de ciudades y productos, exige cantidades mayores que cero y resalta en rojo los descuentos mayores al 15 %.", res:"Los pedidos llegan limpios y las excepciones saltan a la vista."}},
 {n:10, tramo:2, nivel:"Avanzado", t:"Fórmulas de matriz dinámica", s:"FILTRAR, ORDENAR, UNICOS, LET",
  brecha:"Copiar y pegar listas filtradas que quedan desactualizadas al cambiar la fuente.",
  orient:"Las fórmulas de matriz dinámica devuelven listas completas que se recalculan solas. Úsalas para listas derivadas, como el top 10 o los clientes de un vendedor, en lugar de copiar y pegar resultados filtrados.",
  ej:{rol:"JS", cargo:"Jefe de sede", sit:"Quiere ver siempre sus 10 mejores clientes del año.", ap:"Combina ORDENAR, FILTRAR y TOMAR sobre la Tabla de ventas, con la sede en una celda.", res:"Al cambiar la sede o agregar ventas, la lista se actualiza sin tocarla."}},
 {n:11, tramo:2, nivel:"Intermedio", t:"Gráficos y narrativa de resultados", s:"Del dato al informe que se explica solo",
  brecha:"Gráficos por defecto (tortas 3D, dos ejes) y informes sin un mensaje principal.",
  orient:"Cada pregunta tiene un gráfico adecuado: comparar, mostrar evolución, composición, distribución, relación o cumplimiento. El título debe decir el hallazgo, no el tema. Se aplica en todo informe que alguien va a leer para decidir.",
  ej:{rol:"AN", cargo:"Analista comercial", sit:"Prepara la diapositiva de cumplimiento para el comité.", ap:"Usa barras de real contra meta ordenadas y titula «Bucaramanga superó su meta; Barranquilla quedó 12 puntos abajo».", res:"El comité entiende la situación en diez segundos y la discusión se va a las causas."}},
 {n:12, tramo:2, nivel:"Transversal", t:"Auditoría, control y uso responsable de IA", s:"Revisar antes de enviar",
  brecha:"Informes enviados sin revisión, versiones «final_final2.xlsx» y fórmulas de IA usadas sin verificar.",
  orient:"Auditar es comprobar antes de entregar: rastrear precedentes, usar la comprobación de errores, cuadrar contra la fuente, controlar versiones y verificar con casos conocidos todo lo que proponga una IA. Se aplica antes de cada entrega.",
  ej:{rol:"AF", cargo:"Analista financiero", sit:"Va a enviar el informe trimestral a la junta.", ap:"Rastrea los precedentes del total, lo cuadra con contabilidad y prueba la fórmula que le sugirió la IA con tres casos conocidos.", res:"Descubre que un rango no incluía la última semana y lo corrige antes de enviar."}},
];

const DIAG = [
 {q:"¿Combinas celdas o dejas filas en blanco dentro de tus bases de datos?", si:1},
 {q:"¿Alguna vez una suma no incluyó números que en pantalla se veían bien?", si:2},
 {q:"¿Dudas cuándo usar $A$1, A$1 o $A1 en una fórmula?", si:3},
 {q:"¿Escribes a mano el número de columna en BUSCARV?", si:5},
 {q:"¿Te ha salido #N/D aunque el código «sí está» en la otra tabla?", si:5},
 {q:"¿Calculas porcentajes o totales de una tabla dinámica por fuera, con calculadora?", si:7},
 {q:"¿Repites cada mes los mismos pasos manuales para limpiar un archivo?", si:8},
 {q:"¿Envías informes sin que otra persona o una herramienta revise las fórmulas?", si:12},
];

/* ======================================================================
   MÓDULOS COMPLETOS (piloto)
   ====================================================================== */
const MOD = {};

MOD[1] = {
 minutos:45, notebook:"01_estructura_y_tablas.ipynb",
 objetivos:["Reconocer los 8 defectos de estructura que bloquean el análisis.","Reorganizar un reporte en formato tabular: una fila por registro.","Convertir un rango en Tabla de Excel y usar referencias estructuradas."],
 entender:`
  <p>Excel tiene dos usos que se confunden: <b>presentar</b> información (un reporte que alguien lee) y <b>almacenar</b> información (una base que alguien analiza). Un reporte puede tener títulos, colores y subtotales. Una base no. Casi todos los problemas de los niveles siguientes empiezan cuando se analiza un reporte como si fuera una base.</p>
  <p>Una base analizable sigue tres reglas, las mismas que usa la ciencia de datos con el nombre de <i>datos ordenados</i> (<i>tidy data</i>):</p>
  <ol><li><b>Cada columna es una variable</b>: fecha, ciudad, subtotal. Un trimestre no es una columna; es un valor de la variable «trimestre».</li>
  <li><b>Cada fila es un registro</b>: una línea de factura, un cliente, una meta mensual. Nunca un subtotal.</li>
  <li><b>Cada tipo de registro va en su propia tabla</b>: ventas en una, clientes en otra, unidas por una llave (<code>id_cliente</code>).</li></ol>
  <p>Cuando el rango cumple estas reglas, conviértelo en <b>Tabla de Excel</b>. La Tabla crece sola al agregar filas, copia las fórmulas a toda la columna y tiene nombre propio (<code>tVentas</code>), que hace las fórmulas legibles: <code>=[@cantidad]*[@precio_unitario]</code> se entiende sin mirar las coordenadas.</p>`,
 brechaTxt:"En las auditorías de hojas de cálculo reales casi todos los libros revisados tienen errores, y muchos nacen de la estructura: filas insertadas fuera del rango, subtotales sumados dos veces o fórmulas copiadas sobre celdas combinadas.",
 excel:[
  ["Separa presentar de almacenar", "Deja la base en una hoja (<code>Ventas</code>) y construye el reporte en otra. Nunca escribas totales dentro de la base."],
  ["Revisa la forma", "Encabezados en <b>una sola fila</b>, sin celdas combinadas, sin filas ni columnas vacías en medio. Si hay una ciudad combinada en varias filas: selecciona el bloque, <b>Inicio › Combinar y centrar › Separar celdas</b>, luego <b>Buscar y seleccionar › Ir a especial › Celdas en blanco</b>, escribe <code>=</code> y la celda de arriba, y pulsa <b>Ctrl+Enter</b>."],
  ["Convierte en Tabla", "Clic dentro del rango y <b>Ctrl+T</b> (o <b>Insertar › Tabla</b>). Marca «La tabla tiene encabezados»."],
  ["Ponle nombre", "<b>Diseño de tabla › Nombre de la tabla</b>: <code>tVentas</code>. Usa un prefijo (<code>t</code>) para reconocer tablas en las fórmulas."],
  ["Usa columnas calculadas", "En una columna nueva escribe <code>=[@cantidad]*[@precio_unitario]</code>. Excel la copia a todas las filas, presentes y futuras."],
  ["Activa la fila de totales", "<b>Diseño de tabla › Fila de totales</b>. Usa <code>SUBTOTALES(109;[subtotal])</code>, que respeta los filtros: si filtras Bogotá, suma solo Bogotá."],
 ],
 colabQue:"Un recorrido visual, sin escribir código: ves el reporte tal como llega, comparas en un gráfico cuánto se equivoca una suma rápida y observas cómo la misma información, ordenada, se convierte en gráficos que antes eran imposibles. Eliges ciudad y línea en listas desplegables y el gráfico se redibuja.",
 ia:[
  {t:"Diagnosticar la estructura de una hoja", p:`Actúa como analista de datos senior. Te pego el encabezado y 8 filas de muestra de una hoja de Excel (datos anonimizados).
[PEGA AQUÍ]

1. Lista los problemas de estructura que impedirían filtrarla, cruzarla o hacer una tabla dinámica.
2. Propón la estructura tabular ideal: nombre de cada columna, tipo de dato y una fila de ejemplo.
3. Dime los pasos en Excel 365 (en español) para transformarla.
No inventes datos que no aparezcan en la muestra.`},
  {t:"Explicar una referencia estructurada", p:`Explícame paso a paso qué calcula esta fórmula de Excel y qué pasa si agrego 100 filas nuevas a la tabla:
=SUMA(tVentas[subtotal]) - SUBTOTALES(109;tVentas[subtotal])
Responde para alguien que está aprendiendo, con un ejemplo de 3 filas.`},
 ],
 iaCuidado:"Pega solo encabezados y unas filas de muestra, nunca la base completa. Quita nombres, cédulas, teléfonos y correos antes: en Colombia el tratamiento de datos personales está regulado por la Ley 1581 de 2012.",
 quiz:[
  {q:"En un reporte, la ciudad «Bogotá» ocupa una celda combinada sobre tres filas. Filtras la columna Línea por «Tecnología». ¿Qué ves en la columna Ciudad?",
   o:["«Bogotá» repetido en cada fila filtrada","Celdas vacías: el valor combinado solo existe en la primera celda del bloque","Excel bloquea el filtro","Un error #REF!"], a:1,
   w:"Una celda combinada guarda el valor solo en su esquina superior izquierda. Las demás quedan vacías, y al filtrar o cruzar esas filas pierden la ciudad."},
  {q:"¿Por qué un subtotal escrito dentro de la base daña una tabla dinámica?",
   o:["Porque la dinámica no acepta negritas","Porque la dinámica lo trata como un registro más y lo suma otra vez","Porque los subtotales se calculan con otra función","No la daña si está en otra fuente"], a:1,
   w:"Para la tabla dinámica cada fila es un registro. Un subtotal es una fila más, así que su valor se suma junto con las filas que ya resume: el total queda inflado."},
  {q:"¿Cuál de estas estructuras es tabular y está lista para analizar?",
   o:["Una columna por trimestre (T1, T2, T3, T4)","Una hoja por ciudad con los mismos encabezados","Columnas ciudad, línea, trimestre y subtotal; una fila por combinación","Un bloque por ciudad separado por una fila en blanco"], a:2,
   w:"El trimestre es una variable, así que va en una columna propia. Con esa forma, una tabla dinámica puede ponerlo en filas, columnas o filtros sin rehacer nada."},
  {q:"¿Cuál es la ventaja principal de convertir un rango en Tabla (Ctrl+T)?",
   o:["Calcula más rápido que una base de datos","Elimina duplicados automáticamente","Las fórmulas, dinámicas y gráficos que la usan se amplían solos al agregar filas","Impide que otras personas editen los datos"], a:2,
   w:"La Tabla es un rango con nombre que crece. Todo lo que apunta a ella (fórmulas, tablas dinámicas, gráficos) incluye las filas nuevas sin cambiar referencias."},
 ],
 docente:{
  duracion:[["Apertura: el reporte en pantalla, ¿qué ven?",10,"Proyecta la hoja Reporte_Mal_Estructurado y deja que el grupo opine antes de explicar."],
            ["Simulador en parejas",15,"Cada pareja encuentra los 8 problemas. Gana la primera que explique tres en voz alta."],
            ["Excel paso a paso",25,"Todos reconstruyen la tabla y la convierten en tVentas. Verifica que nadie dejó filas en blanco dentro de la Tabla."],
            ["Colab: demostración",20,"Ejecuta el cuaderno 01 en pantalla. Detente en la gráfica de «dos totales»."],
            ["Autoevaluación y cierre",10,"Cuestionario individual; discute la pregunta con más errores."]],
  preguntas:["¿Quién ha recibido un reporte así? ¿Qué hizo con él?","¿Cuándo sí es válido combinar celdas? (En el reporte final, nunca en la base.)","Si el jefe pide el reporte «bonito», ¿cómo se entrega sin dañar la base? (Dos hojas: base y presentación.)"],
  errores:["Separar celdas y olvidar rellenar las vacías.","Convertir en Tabla un rango que incluye el título o una fila en blanco.","Borrar los subtotales pero no la fila TOTAL GENERAL."],
  cierre:"Una fila es un registro; lo bonito va en otra hoja."},
};

MOD[5] = {
 minutos:60, notebook:"05_busqueda_y_cruce.ipynb",
 objetivos:["Cruzar dos tablas con BUSCARX e INDICE+COINCIDIR.","Diagnosticar un #N/D: espacios, caracteres invisibles o llaves huérfanas.","Saber por qué BUSCARV con índice fijo y coincidencia aproximada es un riesgo."],
 entender:`
  <p>Cruzar es traer a una tabla un dato que vive en otra, usando una <b>llave</b> que ambas comparten. En la Distribuidora Andina, la exportación del ERP trae el <code>Cod Cliente</code>, y el maestro <code>tClientes</code> tiene la razón social y el segmento.</p>
  <p>Una búsqueda solo funciona si la llave es <b>idéntica</b> en las dos tablas. «C-0005» y «C-0005 » (con un espacio al final) son textos distintos para Excel, aunque en pantalla se vean iguales. Las mayúsculas, en cambio, no le importan: Excel considera iguales «c-0002» y «C-0002». Python sí las distingue.</p>
  <p>En Excel 365 la opción recomendada es <b>BUSCARX</b>: busca exacto por omisión, devuelve la columna que nombras (no un número de columna) y tiene un argumento para decir qué mostrar si no encuentra. Verás <b>INDICE + COINCIDIR</b> y <b>BUSCARV</b> en libros heredados, así que conviene entender sus trampas.</p>
  <pre class="code">=BUSCARX(valor_buscado; matriz_buscada; matriz_devuelta; [si_no_se_encuentra]; [modo_de_coincidencia]; [modo_de_búsqueda])</pre>`,
 brechaTxt:"La función más conocida del Excel laboral es también la que más errores silenciosos produce: un BUSCARV sin el último argumento hace coincidencia aproximada y puede devolver un cliente equivocado sin mostrar ningún error.",
 excel:[
  ["Convierte ambas fuentes en Tablas", "<code>tERP</code> para la exportación (hoja ERP_Sucio del libro de práctica) y <code>tClientes</code> para el maestro."],
  ["Escribe la búsqueda", "En una columna nueva de <code>tERP</code>: <code>=BUSCARX([@[Cod Cliente]];tClientes[id_cliente];tClientes[segmento];\"No encontrado\")</code>."],
  ["Cuenta los fallos", "<code>=CONTAR.SI(tERP[Segmento];\"No encontrado\")</code>. Un cruce sin este conteo no está terminado."],
  ["Limpia la llave", "Columna auxiliar <code>=ESPACIOS(SUSTITUIR([@[Cod Cliente]];CARACTER(160);\" \"))</code> y repite la búsqueda sobre ella. ESPACIOS quita espacios normales; el carácter 160, común en datos copiados de la web o de un ERP, necesita SUSTITUIR."],
  ["Conoce la alternativa clásica", "<code>=SI.ERROR(INDICE(tClientes[segmento];COINCIDIR([@llave];tClientes[id_cliente];0));\"No encontrado\")</code>. El 0 de COINCIDIR exige coincidencia exacta."],
  ["Revisa los huérfanos", "Los códigos que siguen sin aparecer no se arreglan con fórmulas: son clientes creados en el ERP y no en el maestro. Repórtalos a quien administra los datos maestros."],
 ],
 colabQue:"Sin escribir código, ves en gráficos cuántas filas de la exportación cruzan con el maestro, por qué fallan las demás, cuánto dinero queda sin clasificar si cruzas mal y cómo cambia el resultado cuando se limpia la llave. Los retos se responden eligiendo una opción en una lista desplegable.",
 ia:[
  {t:"Diagnosticar un #N/D", p:`Mi fórmula de Excel 365 devuelve #N/D:
=BUSCARX(A2;tClientes[id_cliente];tClientes[razon_social])
En A2 aparece "C-0005" y en tClientes también existe "C-0005".
Dame una lista ordenada de causas posibles y, para cada una, una fórmula de Excel en español (con ; como separador) que me permita comprobarla. Ejemplo: =LARGO(A2).`},
  {t:"Migrar BUSCARV heredados", p:`Tengo esta fórmula en un libro heredado:
=BUSCARV(B2;Clientes!$A$2:$F$500;4)
1. Explica qué riesgo tiene el último argumento omitido.
2. Reescríbela con BUSCARX usando una Tabla llamada tClientes con las columnas id_cliente y segmento.
3. Dame 3 casos de prueba para comprobar que la nueva fórmula devuelve lo mismo que la anterior cuando la anterior era correcta.`},
 ],
 iaCuidado:"Una IA puede escribir una fórmula que parece correcta y devuelve la columna equivocada. Prueba siempre con tres casos cuyo resultado conoces, incluido un código que no existe.",
 quiz:[
  {q:"=BUSCARX(\"C-0005 \";tClientes[id_cliente];tClientes[razon_social]) devuelve #N/D, aunque C-0005 está en el maestro. ¿Causa más probable?",
   o:["BUSCARX distingue mayúsculas","El valor buscado tiene un espacio al final","Falta el argumento modo_de_búsqueda","La tabla tClientes no está ordenada"], a:1,
   w:"El espacio forma parte del texto. Compruébalo con =LARGO(A2): «C-0005» tiene 6 caracteres; si da 7, sobra uno."},
  {q:"=BUSCARV(A2;tClientes;2;FALSO) empezó a devolver el NIT en vez de la razón social. ¿Qué pasó?",
   o:["Alguien insertó una columna en el maestro y el índice 2 ahora apunta a otra","FALSO cambió a coincidencia aproximada","El cliente se duplicó","Excel actualizó la función a BUSCARX"], a:0,
   w:"BUSCARV usa la posición de la columna, no su nombre. Al insertar una columna, la posición 2 es otra. BUSCARX e INDICE apuntan a la columna por nombre y no se afectan."},
  {q:"¿Qué hace BUSCARV si omites el cuarto argumento?",
   o:["Busca coincidencia exacta","Muestra un aviso","Usa coincidencia aproximada y puede devolver un valor equivocado sin error","Devuelve siempre #N/D"], a:2,
   w:"Sin el cuarto argumento BUSCARV asume VERDADERO (aproximada). Sobre una lista de códigos no ordenada devuelve la fila de otro cliente y no hay error que lo delate."},
  {q:"En Excel, ¿«c-0002» encuentra a «C-0002» con BUSCARX?",
   o:["Sí: las búsquedas de Excel no distinguen mayúsculas","No: hay que usar MAYUSC primero","Solo con modo_de_coincidencia = 2","Solo con INDICE+COINCIDIR"], a:0,
   w:"BUSCARX, BUSCARV y COINCIDIR no distinguen mayúsculas. En Python sí se distinguen: por eso el cuaderno normaliza las llaves a mayúsculas."},
  {q:"El maestro tiene el código C-0010 dos veces, con razones sociales distintas. ¿Qué hace BUSCARX?",
   o:["Muestra #N/D","Devuelve la primera coincidencia, sin avisar","Devuelve las dos separadas por coma","Suma los dos valores"], a:1,
   w:"Devuelve la primera fila que encuentra. Por eso un maestro debe tener la llave única: compruébalo antes de cruzar con CONTAR.SI o con formato condicional de duplicados."},
 ],
 docente:{
  duracion:[["Caso: «el código está ahí y sale #N/D»",10,"Muestra un #N/D real y pide hipótesis antes de explicar."],
            ["Simulador",15,"Que recorran las seis filas y expliquen cada causa con sus palabras."],
            ["Excel: BUSCARX sobre ERP_Sucio",30,"Cada estudiante cruza, cuenta los «No encontrado», limpia la llave y vuelve a contar."],
            ["Huérfanos y maestro duplicado",10,"Discute quién corrige qué: el analista o el área de datos maestros."],
            ["Colab: demostración",15,"Muestra la gráfica de dinero sin clasificar antes y después de limpiar."],
            ["Autoevaluación",10,"Cuestionario individual."]],
  preguntas:["¿Por qué es peor un dato equivocado que un #N/D?","¿Quién debe corregir un código huérfano?","¿Qué cambia si el proceso se migra de Excel a Python? (Las mayúsculas.)"],
  errores:["Usar SI.ERROR para ocultar los #N/D sin contarlos.","Limpiar la columna original en lugar de crear una columna auxiliar.","No detectar el carácter 160 porque ESPACIOS «no funcionó»."],
  cierre:"Un cruce termina cuando sabes cuántas filas cruzaron y por qué fallaron las demás."},
};

MOD[7] = {
 minutos:60, notebook:"07_tablas_dinamicas.ipynb",
 objetivos:["Partir de una pregunta de negocio y elegir filas, columnas y valores.","Distinguir suma, recuento de líneas y recuento distinto de facturas.","Calcular porcentajes y márgenes sin errores de agregación."],
 entender:`
  <p>Una tabla dinámica resume una base sin escribir fórmulas: eliges qué va en <b>filas</b>, qué va en <b>columnas</b>, qué se <b>calcula</b> y qué se <b>filtra</b>. Su valor no está en la herramienta sino en la pregunta. Antes de arrastrar campos, escribe la pregunta completa: «¿Cuánto vendió cada sede en 2025, sin anuladas?».</p>
  <p>Tres decisiones separan un resumen correcto de uno que se ve bien y está mal:</p>
  <ol><li><b>Qué se cuenta.</b> Cada fila de <code>tVentas</code> es una línea de factura. Contar <code>id_factura</code> cuenta líneas, no facturas. Para facturas necesitas <i>Recuento distinto</i>, disponible al agregar los datos al Modelo de datos.</li>
  <li><b>Qué se excluye.</b> Las facturas anuladas no son venta. Fíltralas siempre que la pregunta sea comercial.</li>
  <li><b>Cómo se agregan los porcentajes.</b> El margen % de un grupo es la suma del margen dividida por la suma de la venta. El promedio de los porcentajes de cada línea da otro número, y es incorrecto.</li></ol>`,
 brechaTxt:"La tabla dinámica es la frontera entre el usuario básico y el analista, y la que más se usa sin pregunta: resúmenes que incluyen anuladas, cuentan líneas como si fueran facturas o muestran totales de porcentajes que no cuadran.",
 excel:[
  ["Escribe la pregunta", "Una frase con medida, desglose, periodo y exclusiones: «Venta neta (subtotal) por sede y año, sin anuladas»."],
  ["Inserta desde la Tabla", "Clic en <code>tVentas</code> › <b>Insertar › Tabla dinámica</b>. Si vas a contar facturas, marca <b>Agregar estos datos al Modelo de datos</b>."],
  ["Arrastra los campos", "Ciudad a <b>Filas</b>, año a <b>Columnas</b>, subtotal a <b>Valores</b>, estado a <b>Filtros</b> (deja fuera «Anulada»)."],
  ["Configura el valor", "Clic derecho en un valor › <b>Configuración de campo de valor</b>: elige Suma, Recuento o Recuento distinto y aplica formato de número."],
  ["Muestra porcentajes", "Clic derecho › <b>Mostrar valores como › % del total general</b> (o de columna, o de fila). No calcules porcentajes al lado con calculadora."],
  ["Agrega segmentaciones y actualiza", "<b>Analizar tabla dinámica › Insertar segmentación de datos</b> para filtrar con botones. Cuando cambian los datos: <b>Datos › Actualizar todo</b>."],
 ],
 colabQue:"Armas tablas dinámicas eligiendo filas, columnas y valor en listas desplegables, sin escribir código. Cada pregunta de negocio trae su gráfico con una ficha de decisión: qué se grafica, por qué esa forma, qué se descartó y cómo se lee.",
 ia:[
  {t:"De la pregunta a la tabla dinámica", p:`Tengo una Tabla de Excel 365 llamada tVentas con estas columnas:
fecha, id_factura, ciudad, canal, categoria, cantidad, subtotal, margen_bruto, estado (Pagada, Pendiente, Anulada).
Pregunta de negocio: "¿Qué canal ganó participación entre 2024 y 2025?"
Dime qué campo va en Filas, Columnas, Valores y Filtros, qué "Mostrar valores como" debo usar y qué error de interpretación debo evitar.`},
  {t:"Redactar el hallazgo para un informe", p:`Este es el resultado de mi tabla dinámica (venta neta en pesos):
[PEGA LA TABLA]
Escribe 3 frases para un informe gerencial: el hallazgo principal con su cifra, una comparación y una pregunta que habría que investigar. No agregues cifras que no estén en la tabla.`},
 ],
 iaCuidado:"Si le pides a la IA que interprete una tabla, verifica que cada cifra de su respuesta esté en la tabla. Los modelos pueden calcular mal porcentajes o inventar comparaciones. Copilot en Excel tiene acceso a tu libro: revisa qué datos compartes.",
 quiz:[
  {q:"Quieres saber cuántas facturas emitió cada sede. En una dinámica clásica, «Recuento de id_factura» cuenta…",
   o:["Facturas distintas","Líneas de factura: una factura con 4 productos cuenta 4","Solo facturas pagadas","Clientes distintos"], a:1,
   w:"Cada fila de tVentas es una línea. Para contar facturas usa Recuento distinto, que aparece al agregar los datos al Modelo de datos."},
  {q:"¿Cómo se calcula el margen % de toda la empresa?",
   o:["Promedio del margen % de cada línea","Suma del margen bruto ÷ suma de la venta neta","Margen % de la sede más grande","Promedio del margen % de cada categoría"], a:1,
   w:"El margen % es una razón: hay que sumar numerador y denominador por separado y dividir al final. Promediar porcentajes da el mismo peso a una venta de $5.000 que a una de $5 millones."},
  {q:"Agregaste las ventas de diciembre a la Tabla y la dinámica no cambia. ¿Qué falta?",
   o:["Volver a crear la dinámica","Actualizarla (Datos › Actualizar todo)","Cambiar el formato de número","Desactivar las segmentaciones"], a:1,
   w:"Las dinámicas no recalculan solas. Como la fuente es una Tabla, el rango ya incluye las filas nuevas; solo hay que actualizar."},
  {q:"Sumas el subtotal de 2025 sin filtrar el campo estado. ¿Qué incluye el total?",
   o:["Solo facturas pagadas","Pagadas y pendientes","Pagadas, pendientes y anuladas, que no son venta","Nada distinto: Excel excluye anuladas"], a:2,
   w:"Excel no sabe qué significa «Anulada». Si la pregunta es comercial, las anuladas se filtran. Las pendientes sí son venta, aunque no son recaudo."},
 ],
 docente:{
  duracion:[["Escribir la pregunta",10,"Cada estudiante redacta una pregunta de negocio completa antes de abrir Excel."],
            ["Simulador: las seis preguntas",15,"Recorran los botones de preguntas y comenten las notas en gris."],
            ["Excel: dinámica, recuento distinto y %",30,"Con Andina_listo_para_dinamicas.xlsx: venta por sede, facturas por sede, participación por canal."],
            ["Segmentaciones",10,"Agregar segmentación por ciudad y mostrar cómo filtra."],
            ["Colab: gráficos de cada pregunta",15,"Proyecta el cuaderno 07 y discute las fichas de decisión."],
            ["Autoevaluación",10,"Cuestionario individual."]],
  preguntas:["¿Qué pregunta responde esta tabla? Si nadie la puede formular, la tabla sobra.","¿Por qué el total de facturas no es la suma de las facturas por categoría?","Las facturas pendientes, ¿son venta? ¿Son recaudo?"],
  errores:["No marcar «Agregar al Modelo de datos» y no encontrar Recuento distinto.","Arrastrar la fecha y que Excel la agrupe automáticamente en años y trimestres sin entender por qué.","Olvidar actualizar después de agregar datos."],
  cierre:"Primero la pregunta. Sin anuladas. Facturas con recuento distinto. Porcentajes como razón de sumas."},
};

/* ---------- «Ver el error»: antes y después ---------- */
const ERRORES = {
 1: ()=>`<div class="two">
   <div class="panel bad"><span class="eyebrow">Lo que circula (ejemplo ilustrativo)</span><div class="sheetwrap" style="margin-top:8px"><table class="sheet">
     <tr><td class="tt" colspan="3">VENTAS 2025</td></tr><tr><td class="hd">Ciudad</td><td class="hd">T1</td><td class="hd">T2</td></tr>
     <tr><td rowspan="2" style="vertical-align:middle">Bogotá</td><td class="num">1.204.880.150</td><td class="num">998.341.020</td></tr>
     <tr><td class="num">88.210.400</td><td class="num">4,2 M</td></tr><tr><td class="bold">Subtotal</td><td class="num bold">1.293.090.550</td><td class="num bold">998.341.020</td></tr></table></div>
     <p class="muted small" style="margin-top:8px">Se lee bien impreso. No se puede filtrar, cruzar ni resumir.</p></div>
   <div class="panel good"><span class="eyebrow">Lo que se analiza</span><div class="sheetwrap" style="margin-top:8px"><table class="sheet">
     <tr><td class="hd">ciudad</td><td class="hd">linea</td><td class="hd">trimestre</td><td class="hd">subtotal</td></tr>
     <tr><td>Bogotá</td><td>Tecnología</td><td>T1</td><td class="num">1204880150</td></tr><tr><td>Bogotá</td><td>Papelería</td><td>T1</td><td class="num">88210400</td></tr>
     <tr><td>Bogotá</td><td>Tecnología</td><td>T2</td><td class="num">998341020</td></tr><tr><td>Bogotá</td><td>Papelería</td><td>T2</td><td class="num">4200000</td></tr></table></div>
     <p class="muted small" style="margin-top:8px">Más filas, cero ambigüedad. El reporte se arma después, con una tabla dinámica.</p></div></div>`,
 5: ()=>`<div class="two">
   <div class="panel bad"><span class="eyebrow">Lo que circula</span><pre class="code" style="margin-top:8px">=BUSCARV(B2;Clientes!$A$2:$F$500;4)</pre>
     <ul class="plain small" style="margin-top:10px"><li>Sin cuarto argumento: coincidencia aproximada.</li><li>El 4 se rompe si alguien inserta una columna.</li><li>El rango fijo no incluye el cliente 501.</li><li>Si no encuentra, #N/D sin explicación.</li></ul></div>
   <div class="panel good"><span class="eyebrow">Lo que se mantiene</span><pre class="code" style="margin-top:8px">=BUSCARX([@llave];
  tClientes[id_cliente];
  tClientes[segmento];
  "No encontrado")</pre>
     <ul class="plain small" style="margin-top:10px"><li>Exacta por omisión.</li><li>Devuelve la columna por nombre.</li><li>La Tabla crece con el maestro.</li><li>El fallo se ve y se puede contar.</li></ul></div></div>`,
 7: ()=>{
   const bi=DM.ciudad.indexOf("Bogotá"); let fs=new Set(), s=0, mg=0, lines=0, pctSum=0;
   for(let i=0;i<NL;i++){ if(C.ciudad[i]!==bi) continue; lines++; pctSum += C.margen[i]/C.subtotal[i];
     if(C.estado[i]===2) continue; fs.add(C.factura[i]); s+=C.subtotal[i]; mg+=C.margen[i] }
   return `<div class="two">
   <div class="panel bad"><span class="eyebrow">Lo que circula</span>
     <table class="datatbl" style="margin-top:8px"><tr><th>Sede</th><th>Recuento de id_factura</th><th>Margen % (promedio)</th></tr>
     <tr><td>Bogotá</td><td class="num">${nf.format(lines)}</td><td class="num">${pf.format(pctSum/lines)}</td></tr></table>
     <p class="muted small" style="margin-top:8px">Cuenta líneas como si fueran facturas, incluye anuladas y promedia el margen de cada línea: un paquete de lápices pesa lo mismo que un lote de portátiles.</p></div>
   <div class="panel good"><span class="eyebrow">Lo que responde la pregunta</span>
     <table class="datatbl" style="margin-top:8px"><tr><th>Sede</th><th>Facturas (recuento distinto)</th><th>Margen % (Σ margen ÷ Σ venta)</th></tr>
     <tr><td>Bogotá</td><td class="num">${nf.format(fs.size)}</td><td class="num">${pf.format(mg/s)}</td></tr></table>
     <p class="muted small" style="margin-top:8px">Sin anuladas, contando facturas y con el margen ponderado por la venta. Cifras reales del conjunto de datos.</p></div></div>` },
};

/* ---------- Glosario español / inglés ---------- */
const GLOS = [
 ["BUSCARX","XLOOKUP","Busca un valor y devuelve el de otra columna. Exacta por omisión.",5],["BUSCARV","VLOOKUP","Búsqueda vertical por posición de columna. Úsala con FALSO al final.",5],
 ["INDICE","INDEX","Devuelve el valor en una posición de un rango.",5],["COINCIDIR","MATCH","Devuelve la posición de un valor. Con 0, coincidencia exacta.",5],
 ["ESPACIOS","TRIM","Quita espacios al inicio, al final y repetidos en medio.",5],["SUSTITUIR","SUBSTITUTE","Reemplaza un texto por otro dentro de una celda.",5],
 ["CARACTER","CHAR","Devuelve el carácter de un código. CARACTER(160) es el espacio de no separación.",5],["LIMPIAR","CLEAN","Quita caracteres no imprimibles.",8],
 ["LARGO","LEN","Cuenta caracteres. Delata espacios invisibles.",2],["ESNUMERO","ISNUMBER","Indica si una celda contiene un número de verdad.",2],
 ["SI.ERROR","IFERROR","Devuelve otro valor si hay error. También oculta errores reales: úsala con cuidado.",4],
 ["SI","IF","Devuelve un valor u otro según una condición.",4],["SI.CONJUNTO","IFS","Varias condiciones sin anidar SI.",4],["Y / O","AND / OR","Combinan condiciones.",4],
 ["SUMA","SUM","Suma un rango. Ignora números guardados como texto.",2],["SUBTOTALES","SUBTOTAL","Suma, cuenta o promedia respetando filtros (109 = suma visible).",1],
 ["SUMAR.SI.CONJUNTO","SUMIFS","Suma con varias condiciones.",6],["CONTAR.SI.CONJUNTO","COUNTIFS","Cuenta con varias condiciones.",6],["CONTAR.SI","COUNTIF","Cuenta las celdas que cumplen una condición.",5],
 ["PROMEDIO.SI.CONJUNTO","AVERAGEIFS","Promedio con varias condiciones.",6],["VALOR","VALUE","Convierte texto con forma de número en número.",2],
 ["FECHA","DATE","Construye una fecha a partir de año, mes y día.",2],["TEXTO","TEXT","Da formato de texto a un número o fecha.",2],["MAYUSC","UPPER","Convierte a mayúsculas.",8],
 ["FILTRAR","FILTER","Devuelve las filas que cumplen una condición (matriz dinámica).",10],["ORDENAR","SORT","Ordena un rango (matriz dinámica).",10],["UNICOS","UNIQUE","Devuelve valores sin repetir (matriz dinámica).",10],
 ["TOMAR","TAKE","Devuelve las primeras o últimas filas de una matriz.",10],["LET","LET","Asigna nombres a cálculos dentro de una fórmula.",10],
 ["IMPORTARDATOSDINAMICOS","GETPIVOTDATA","Trae un valor de una tabla dinámica a una celda (indicadores de un tablero).",7],
 ["Tabla dinámica","PivotTable","Resume una base sin fórmulas.",7],["Gráfico dinámico","PivotChart","Gráfico conectado a una tabla dinámica; se filtra con ella.",11],
 ["Segmentación de datos","Slicer","Botones para filtrar dinámicas y tablas.",7],["Escala de tiempo","Timeline","Filtro de fechas por días, meses, trimestres o años.",7],
 ["Conexiones de informe","Report Connections","Hace que una segmentación filtre varias dinámicas a la vez.",7],
 ["Mostrar valores como","Show Values As","Convierte valores en % del total, de fila o de columna.",7],["Recuento distinto","Distinct Count","Cuenta valores únicos. Requiere el Modelo de datos.",7],
 ["Power Query","Power Query","Editor para importar, limpiar y transformar datos con pasos repetibles.",8],
];
