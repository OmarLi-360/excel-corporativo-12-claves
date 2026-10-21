/* ======================================================================
   CONTENIDO · Claves 2, 3 y 4 (tramo Fundamentos)
   Misma plantilla que MOD[1]; simuladores al final del archivo.
   ====================================================================== */

/* ---------------------------------------------------------------------
   CLAVE 2 · Tipos de dato que no engañan
   --------------------------------------------------------------------- */
MOD[2] = {
 minutos:45, notebook:"02_tipos_de_dato.ipynb",
 objetivos:["Distinguir número, texto y fecha a simple vista y con ESNUMERO.","Convertir textos con forma de número y fechas importadas como texto.","Comprobar que una suma incluye todos los valores."],
 entender:`
  <p>Cada celda de Excel guarda un <b>tipo de dato</b>: número, texto, fecha, valor lógico (VERDADERO o FALSO) o error. Lo que ves en pantalla no siempre es lo que hay guardado. El <b>formato</b> cambia cómo se ve un valor, pero no lo que es: <code>1500000</code> con formato de moneda se ve como <code>$ 1.500.000</code> y sigue siendo un número; el texto escrito <code>"$ 1.500.000"</code> parece lo mismo, pero no se puede sumar.</p>
  <p>Las <b>fechas son números</b>: Excel cuenta los días desde el 1 de enero de 1900. El 2 de enero de 2024 es el número <code>45293</code>. Por eso una fecha sin formato aparece como un número de cinco cifras, y por eso se pueden restar fechas para obtener días.</p>
  <p>Tres señales delatan un número guardado como texto:</p>
  <ol><li><b>Alineación:</b> por omisión, los números se alinean a la derecha y los textos a la izquierda.</li>
  <li><b>Triángulo verde</b> en la esquina de la celda, con el aviso «Número almacenado como texto».</li>
  <li><b>Barra de estado:</b> al seleccionar la columna, Excel muestra <i>Suma</i> solo si hay números. Si solo aparece <i>Recuento</i>, son textos.</li></ol>
  <p>El problema aparece al importar: exportaciones de un ERP, archivos CSV, datos copiados de la web o de un PDF. Excel no adivina; si algo no es claramente un número o una fecha, lo deja como texto.</p>`,
 brechaTxt:"Es la causa silenciosa de muchos totales que no cuadran. SUMA ignora los textos sin avisar, así que el total sale más bajo y nadie lo nota hasta que contabilidad pregunta por la diferencia.",
 excel:[
  ["Detecta", "En la hoja <b>ERP_Sucio</b>, selecciona la columna <code>Valor Neto</code> y mira la barra de estado: el Recuento es mayor que la cantidad de números que suma. Confírmalo celda a celda con <code>=ESNUMERO(I2)</code>."],
  ["Cuenta los textos", "<code>=CONTARA(I2:I1855)-CONTAR(I2:I1855)</code>. CONTARA cuenta las celdas no vacías y CONTAR solo los números: la diferencia son los textos."],
  ["Convierte montos con símbolo y puntos", "En una columna nueva: <code>=VALOR(SUSTITUIR(SUSTITUIR(SUSTITUIR(I2;\"$\";\"\");\".\";\"\");\" \";\"\"))</code>. Quita el símbolo, los puntos de miles y los espacios, y convierte el resultado en número."],
  ["Quita unidades pegadas", "Para la columna Cantidad: <code>=VALOR(SUSTITUIR(H2;\" und\";\"\"))</code>. Si la columna entera es texto sin unidades, usa <b>Datos › Texto en columnas › Finalizar</b>: convierte todo de una vez."],
  ["Convierte fechas importadas como texto", "<code>=SI.ERROR(FECHANUMERO(C2);VALOR(C2))</code>. FECHANUMERO reconoce <code>02/01/2024</code> y <code>2024-01-02</code>; si falla, VALOR convierte un número serial como <code>45299</code>. Después aplica <b>Inicio › Formato de número › Fecha corta</b>. Este es un uso correcto de SI.ERROR: el error es esperado y sabes por qué ocurre."],
  ["Comprueba", "Compara <code>=SUMA</code> de la columna original con la de la columna convertida, y <code>=CONTAR</code> contra <code>=CONTARA</code>. Si la columna mezcla muchos formatos y llega cada mes, el camino estable es Power Query (clave 8)."],
 ],
 colabQue:"Ves en gráficos cuánto dinero deja por fuera una suma cuando hay montos guardados como texto, en cuántos formatos llegan las fechas y cómo la gráfica mensual se vuelve posible cuando las fechas se convierten. Eliges la columna a revisar en una lista desplegable.",
 ia:[
  {t:"Diagnosticar el tipo de una columna", p:`Tengo una columna de Excel 365 que debería ser numérica, pero la suma no cuadra. Estos son 10 valores tal como aparecen (copiados de la celda):
[PEGA AQUÍ]
1. Dime cuáles probablemente son texto y por qué.
2. Dame una fórmula en español (separador ;) que los convierta todos en número.
3. Dame una fórmula para contar cuántos siguen siendo texto después de convertir.`},
  {t:"Fechas en varios formatos", p:`En una columna de Excel 365 (configuración regional de Colombia) tengo fechas que llegaron en tres formatos: "02/01/2024", "2024-01-02" y "45293".
Dame una sola fórmula en español que las convierta todas en fecha real y explícame qué hace cada parte.
Luego dime cómo comprobar que ninguna quedó como texto.`},
 ],
 iaCuidado:"Pega solo una muestra de valores, no la columna completa. Prueba la fórmula que te proponga la IA sobre los casos difíciles (vacíos, con unidades, con símbolo) antes de aplicarla a todo.",
 quiz:[
  {q:"Seleccionas una columna de montos que se ven bien. La barra de estado muestra Recuento: 1.854, pero no muestra Suma. ¿Qué indica?",
   o:["Que la columna tiene filtros","Que los valores están guardados como texto","Que hay celdas combinadas","Que la hoja está protegida"], a:1,
   w:"Excel solo muestra Suma y Promedio cuando la selección contiene números. Si solo aparece Recuento, lo que hay son textos."},
  {q:"Una celda tiene el número 1500000 con formato de moneda; otra tiene escrito el texto «$ 1.500.000». ¿Cuál cuenta SUMA?",
   o:["Las dos","Solo la del número con formato","Solo la del texto","Ninguna"], a:1,
   w:"El formato cambia cómo se ve, no lo que es. El texto escrito con símbolo y puntos no es un número, aunque se vea igual."},
  {q:"En una columna de fechas, una celda muestra 45299. ¿Qué es probablemente?",
   o:["Un código de producto","Una fecha sin formato de fecha (número serial)","Un error de importación sin solución","Un monto en pesos"], a:1,
   w:"Excel guarda las fechas como días desde 1900. 45299 es una fecha de enero de 2024: basta aplicarle formato de fecha (o VALOR si llegó como texto)."},
  {q:"=CONTAR(D2:D100) da 80 y =CONTARA(D2:D100) da 95. ¿Qué significa?",
   o:["Hay 15 celdas vacías","Hay 15 celdas no vacías que no son números","Hay 15 números negativos","Hay 15 duplicados"], a:1,
   w:"CONTAR cuenta solo números; CONTARA cuenta todo lo que no esté vacío. La diferencia son textos (o errores) dentro de una columna que debería ser numérica."},
 ],
 docente:{
  duracion:[["Apertura: «la suma no cuadra»",10,"Muestra la columna Valor Neto y pregunta por qué la barra de estado no muestra Suma."],
            ["Simulador",10,"Que auditen las tres columnas y vean cómo cambia la barra de estado al convertir."],
            ["Excel: convertir montos, cantidades y fechas",25,"Hoja ERP_Sucio. Comprueben con CONTAR y CONTARA antes y después."],
            ["Colab: demostración",10,"Muestra cuánto dinero ignora la suma y la gráfica mensual antes y después."],
            ["Autoevaluación",10,"Cuestionario individual."]],
  preguntas:["¿Por qué Excel no convierte solo los textos que parecen números?","¿Qué diferencia hay entre cambiar el formato y cambiar el tipo de dato?","¿Cuándo es correcto usar SI.ERROR? (Cuando el error es esperado y se sabe por qué.)"],
  errores:["Cambiar el formato a «Número» y creer que eso convierte el texto.","Usar SUSTITUIR para quitar el punto de miles en una columna que ya era numérica con decimales.","Convertir fechas con el día y el mes invertidos por no revisar la configuración regional."],
  cierre:"Antes de sumar, comprueba que lo que sumas son números: CONTAR contra CONTARA."},
};

/* ---------------------------------------------------------------------
   CLAVE 3 · Referencias que se copian bien
   --------------------------------------------------------------------- */
MOD[3] = {
 minutos:40, notebook:"03_referencias.ipynb",
 objetivos:["Predecir cómo cambia una referencia al copiar una fórmula.","Elegir entre referencia relativa, absoluta y mixta.","Usar F4, nombres y referencias estructuradas para no depender de los $."],
 entender:`
  <p>Cuando copias una fórmula, Excel <b>desplaza sus referencias</b> la misma distancia que moviste la fórmula. Si <code>=B5*2</code> está en C5 y la copias una fila abajo, se convierte en <code>=B6*2</code>. Eso es lo que permite escribir una fórmula una vez y usarla en mil filas.</p>
  <p>El signo <code>$</code> <b>fija</b> la parte que no debe moverse. Hay cuatro formas de escribir la misma celda:</p>
  <ol><li><code>B5</code> · <b>relativa</b>: se mueve en filas y columnas.</li>
  <li><code>$B$5</code> · <b>absoluta</b>: no se mueve nunca. Para una tasa, un total o una fecha de corte en una celda fija.</li>
  <li><code>$B5</code> · <b>mixta</b>: la columna queda fija y la fila se mueve.</li>
  <li><code>B$5</code> · <b>mixta</b>: la fila queda fija y la columna se mueve.</li></ol>
  <p>La pregunta para decidir es siempre la misma: <b>«Al copiar hacia abajo, ¿esta referencia debe cambiar de fila? Al copiar hacia la derecha, ¿debe cambiar de columna?»</b> Donde la respuesta sea no, va un <code>$</code>. Al escribir la fórmula, la tecla <b>F4</b> recorre las cuatro formas.</p>
  <p>Dentro de una Tabla de Excel casi no se necesitan: <code>[@subtotal]</code> siempre apunta a la fila actual y <code>tVentas[subtotal]</code> siempre a la columna completa. Para valores fijos, un <b>nombre definido</b> (por ejemplo <code>IVA</code>) es más legible que <code>$K$1</code>.</p>`,
 brechaTxt:"Las fórmulas copiadas mal están entre las causas de error más citadas en la investigación sobre hojas de cálculo. El caso típico: un porcentaje sobre el total que da bien en la primera fila y absurdo o #DIV/0! en las demás.",
 excel:[
  ["Abre la hoja Referencias", "En el libro de práctica. Las celdas amarillas son las que vas a llenar; cada ejercicio se resuelve con <b>una sola fórmula</b> copiada a todo su rango."],
  ["Ejercicio 1 · Proyección por escenario", "En C5 escribe <code>=$B5*(1+C$4)</code> y cópiala hasta F10. La columna B (la venta base) queda fija y la fila 4 (el escenario) también. Comprueba que D5 es igual a B5, porque el escenario de D4 es 0 %."],
  ["Ejercicio 2 · Participación", "En H5: <code>=B5/B$11</code> y cópiala hasta H10. La fila del total queda fija. La columna debe sumar 100 %: compruébalo con <code>=SUMA(H5:H10)</code>."],
  ["Ejercicio 3 · Venta con IVA", "En J5: <code>=B5*(1+$K$1)</code> y cópiala hacia abajo. Con <code>$K$1</code>, la tasa se lee siempre de la misma celda."],
  ["Usa F4", "Escribe <code>=B5/B11</code>, deja el cursor sobre B11 y pulsa F4 varias veces: verás <code>$B$11</code>, <code>B$11</code>, <code>$B11</code> y otra vez <code>B11</code>."],
  ["Prueba con un nombre", "Selecciona K1 › <b>Fórmulas › Asignar nombre</b> › <code>IVA</code>. Ahora la fórmula del ejercicio 3 puede ser <code>=B5*(1+IVA)</code>: se entiende sin mirar la celda."],
 ],
 colabQue:"Ves como mapa de calor el resultado de copiar una fórmula de proyección con los $ bien puestos y con los $ olvidados, y cómo cambia una gráfica de participación cuando el total no está fijo. Eliges el escenario de crecimiento en una lista desplegable.",
 ia:[
  {t:"Explicar por qué una fórmula copiada falla", p:`En Excel 365 escribí en C5 la fórmula =B5/B11 y la copié hasta C10. En C5 da bien, pero de C6 en adelante sale #DIV/0!.
Explícame qué fórmula quedó en C6 y C7, por qué falla y cómo corregirla con $. Muéstrame también la alternativa con un nombre definido.`},
  {t:"Diseñar una tabla de doble entrada", p:`Quiero una tabla en Excel con sedes en las filas (A5:A10), su venta base en B5:B10 y escenarios de crecimiento en C4:F4.
Dame la fórmula para C5 que pueda copiar a todo C5:F10 y explícame cada $ con la pregunta «¿debe moverse al copiar hacia abajo? ¿y hacia la derecha?».`},
 ],
 iaCuidado:"La IA suele acertar con las fórmulas de doble entrada, pero copia siempre la fórmula a todo el rango y revisa dos celdas de esquinas opuestas antes de darla por buena.",
 quiz:[
  {q:"En C5 escribes =B5/B11 y la copias una fila abajo. ¿Qué fórmula queda en C6?",
   o:["=B5/B11","=B6/B11","=B6/B12","=C6/C12"], a:2,
   w:"Las dos referencias son relativas: ambas bajan una fila. B12 está vacía, así que el resultado es #DIV/0!. La solución es fijar la fila del total: B$11."},
  {q:"Tienes sedes en filas (venta base en la columna B) y escenarios en la fila 4. ¿Qué fórmula en C5 se puede copiar a toda la tabla?",
   o:["=B5*(1+C4)","=$B$5*(1+$C$4)","=$B5*(1+C$4)","=B$5*(1+$C4)"], a:2,
   w:"La venta base siempre está en la columna B (se fija la columna: $B5) y el escenario siempre en la fila 4 (se fija la fila: C$4)."},
  {q:"¿Qué hace F4 mientras editas una referencia?",
   o:["Repite la última acción","Alterna entre A1, $A$1, A$1 y $A1","Convierte la fórmula en valor","Abre el panel de nombres"], a:1,
   w:"F4 recorre las cuatro formas de la referencia que tiene el cursor. (Fuera de la edición, F4 repite la última acción: por eso a veces confunde.)"},
  {q:"En una Tabla, la fórmula =[@cantidad]*[@precio_unitario] se copia a todas las filas. ¿Necesita $?",
   o:["Sí, en las dos referencias","Solo en precio_unitario","No: [@columna] siempre apunta a la fila actual","No funciona en Tablas"], a:2,
   w:"Las referencias estructuradas ya dicen qué se fija: [@columna] es la fila actual y tVentas[columna] es la columna completa. Por eso las Tablas evitan casi todos los errores de $."},
 ],
 docente:{
  duracion:[["Apertura: el #DIV/0! que aparece al copiar",8,"Proyecta =B5/B11 copiada hacia abajo y pide que predigan C6."],
            ["Simulador",12,"Prueben las cuatro formas en el copiador; que expliquen por qué la mixta es la única que llena toda la tabla."],
            ["Excel: hoja Referencias",15,"Los tres ejercicios con una sola fórmula cada uno. Revisen las esquinas."],
            ["Nombres y Tablas",5,"Muestra IVA como nombre y [@columna] en una Tabla."],
            ["Autoevaluación",10,"Cuestionario individual."]],
  preguntas:["¿Por qué existe la referencia relativa si causa tantos errores? (Porque permite escribir una fórmula una vez.)","¿Cuándo prefieres un nombre definido a $K$1?","Si la tasa de IVA cambia, ¿cuántas celdas hay que modificar en tu libro?"],
  errores:["Poner $ en todo «por si acaso»: la fórmula deja de servir al copiarla.","Escribir la tasa dentro de la fórmula (*1,19) en lugar de en una celda.","Copiar arrastrando sin revisar la última fila del rango."],
  cierre:"Antes de copiar, pregúntate qué se debe mover hacia abajo y qué hacia la derecha."},
};

/* ---------------------------------------------------------------------
   CLAVE 4 · Lógica condicional legible
   --------------------------------------------------------------------- */
MOD[4] = {
 minutos:50, notebook:"04_logica_condicional.ipynb",
 objetivos:["Escribir una regla de negocio como tabla de decisión antes de hacer la fórmula.","Usar SI.CONJUNTO en lugar de SI anidados, y combinar condiciones con Y y O.","Usar SI.ERROR solo cuando el error es esperado."],
 entender:`
  <p>Las funciones lógicas convierten una <b>regla de negocio</b> en una fórmula. La regla de Cartera de la Distribuidora Andina dice: «Una factura está al día si no ha vencido; entre 1 y 30 días de mora es alerta temprana; entre 31 y 60, gestión de cobro; más de 60, cobro jurídico». Antes de escribir la fórmula, escribe la regla como una <b>tabla de decisión</b>: condición a la izquierda, resultado a la derecha, en el orden en que se evalúan.</p>
  <p><b>SI</b> evalúa una prueba y devuelve un valor u otro: <code>=SI(prueba; si_verdadero; si_falso)</code>. Para más de dos resultados, los SI anidados se vuelven ilegibles. <b>SI.CONJUNTO</b> evalúa las pruebas en orden y devuelve el valor de la <b>primera que sea verdadera</b>:</p>
  <pre class="code">=SI.CONJUNTO([@dias_mora]&lt;=0; "No vencida";
             [@dias_mora]&lt;=30; "1–30";
             [@dias_mora]&lt;=60; "31–60";
             VERDADERO;        "Más de 60")</pre>
  <p>El orden importa: si la prueba <code>&lt;=60</code> fuera primero, una factura con 10 días de mora caería en «31–60». <code>VERDADERO</code> al final funciona como «en cualquier otro caso».</p>
  <p><b>Y</b> exige que todas las condiciones se cumplan; <b>O</b>, que se cumpla al menos una. <b>SI.ERROR</b> reemplaza un error por otro valor. Es útil cuando el error es esperado (una fecha en dos formatos, clave 2), pero peligroso como tapa: <code>SI.ERROR(…;0)</code> sobre una fecha mal escrita convierte una factura vencida en «0 días de mora».</p>`,
 brechaTxt:"Los SI anidados de cinco niveles son difíciles de revisar y fáciles de romper, y SI.ERROR usado como tapa esconde precisamente los datos que alguien debería corregir.",
 excel:[
  ["Escribe la tabla de decisión", "En una hoja aparte: <i>Días de mora ≤ 0 → No vencida; ≤ 30 → 1–30; ≤ 60 → 31–60; mayor → Más de 60</i>. Esa tabla es tu especificación y la revisas con quien conoce el negocio."],
  ["Calcula los días de mora", "En la hoja <b>Cartera</b>, agrega a <code>tCartera</code> la columna <code>dias_mora</code>: <code>=$K$2-[@fecha_vencimiento]</code>. La fecha de corte está en K2, fija con $ (clave 3). Las fechas se restan porque son números (clave 2)."],
  ["Clasifica con SI.CONJUNTO", "Columna <code>rango</code>: <code>=SI.CONJUNTO([@dias_mora]&lt;=0;\"No vencida\";[@dias_mora]&lt;=30;\"1–30\";[@dias_mora]&lt;=60;\"31–60\";VERDADERO;\"Más de 60\")</code>."],
  ["Combina condiciones", "Columna <code>alerta</code>: <code>=SI(Y([@dias_mora]&gt;30;[@total]&gt;5000000);\"Llamar hoy\";\"Seguimiento normal\")</code>. Prueba cambiar Y por O y cuenta cuántas facturas cambian."],
  ["Resume", "Una tabla dinámica con <code>rango</code> en Filas y <code>total</code> en Valores responde «¿cuánta plata está en cada rango de mora?». Ordénala con el orden de la regla, no alfabéticamente."],
  ["Usa SI.ERROR con criterio", "Si alguna fecha de vencimiento viene mal, no la tapes con 0: <code>=SI.ERROR($K$2-[@fecha_vencimiento];\"Revisar fecha\")</code>. El error queda visible y alguien lo corrige."],
 ],
 colabQue:"Ves la cartera pendiente clasificada por rango de mora en gráficos que cambian según la fecha de corte y los umbrales que elijas. Comparas qué facturas quedan en «Llamar hoy» con Y frente a O, y cuánto dinero esconde un SI.ERROR mal usado.",
 ia:[
  {t:"De la regla a la fórmula", p:`Tengo esta regla de negocio para clasificar facturas por días de mora:
- 0 o menos: "No vencida"
- 1 a 30: "1–30"
- 31 a 60: "31–60"
- más de 60: "Más de 60"
Escríbela como fórmula de Excel 365 en español con SI.CONJUNTO (separador ;), usando la columna [@dias_mora] de una Tabla.
Luego dame 5 casos de prueba con el resultado esperado, incluidos los límites (0, 30, 31, 60, 61).`},
  {t:"Simplificar SI anidados", p:`Heredé esta fórmula y nadie la entiende:
[PEGA LA FÓRMULA]
1. Escribe la regla de negocio que implementa, como tabla de decisión.
2. Reescríbela con SI.CONJUNTO.
3. Dime si hay casos que la fórmula original no cubre.`},
 ],
 iaCuidado:"Prueba siempre los límites de cada rango (30 y 31, 60 y 61). Es donde las fórmulas propuestas por una IA, y las nuestras, suelen fallar.",
 quiz:[
  {q:"=SI.CONJUNTO(A2<=60;\"31–60\";A2<=30;\"1–30\";VERDADERO;\"Más de 60\"). Si A2 vale 10, ¿qué devuelve?",
   o:["1–30","31–60","Más de 60","Un error"], a:1,
   w:"SI.CONJUNTO devuelve el valor de la primera prueba verdadera. 10 ≤ 60 es verdadero, así que nunca llega a evaluar ≤ 30. El orden de las pruebas es parte de la regla."},
  {q:"La regla dice «Llamar hoy si la mora es mayor a 30 días Y el total supera $ 5.000.000». Una factura tiene 45 días de mora y $ 2.000.000. ¿Qué le corresponde?",
   o:["Llamar hoy","Seguimiento normal","Depende del cliente","Un error"], a:1,
   w:"Con Y deben cumplirse las dos condiciones. Cumple la de mora pero no la de monto. Con O, sí sería «Llamar hoy»."},
  {q:"Envuelves los días de mora en SI.ERROR(…;0) y una factura tiene la fecha de vencimiento mal escrita. ¿Qué pasa?",
   o:["Excel avisa del error","La factura aparece con 0 días de mora, como si estuviera al día","La fila se borra","La fórmula no se puede copiar"], a:1,
   w:"SI.ERROR reemplaza el error por 0 y la factura se clasifica como «No vencida». El dato malo queda escondido. Mejor: SI.ERROR(…;\"Revisar fecha\")."},
  {q:"¿Por qué la fecha de corte va en una celda fija (con $) y no se usa HOY()?",
   o:["HOY() no existe en Excel en español","Para que el informe se pueda reproducir a una fecha fija; HOY() cambia cada día","Porque HOY() es más lenta","No hay diferencia"], a:1,
   w:"Un informe de cartera se hace «con corte a» una fecha. Con HOY(), el mismo archivo da otro resultado mañana y nadie puede verificar lo que se presentó."},
 ],
 docente:{
  duracion:[["La regla de Cartera",8,"Pide al grupo que escriba la tabla de decisión antes de ver cualquier fórmula."],
            ["Simulador",12,"Cambien el corte y los umbrales; prueben Y frente a O y activen SI.ERROR."],
            ["Excel: hoja Cartera",20,"dias_mora, rango y alerta en tCartera; luego una dinámica por rango."],
            ["Colab: demostración",10,"Muestra cómo cambia la cartera vencida entre el corte de diciembre y el de enero."],
            ["Autoevaluación",10,"Cuestionario individual."]],
  preguntas:["¿Quién define los rangos de mora: el analista o el área de Cartera?","¿Qué cambia en el informe si la regla usa O en lugar de Y?","¿Cuándo es aceptable SI.ERROR y cuándo es una trampa?"],
  errores:["Poner las pruebas de SI.CONJUNTO en desorden.","Usar HOY() y no poder reproducir el informe del mes pasado.","Comparar con «30» entre comillas: es texto y la comparación falla."],
  cierre:"Primero la regla en una tabla; después la fórmula; al final, prueba los límites."},
};

/* ---------- «Ver el error» de las claves 2, 3 y 4 ---------- */
ERRORES[2] = ()=>{
  const filas = D.erp_tipos.slice(0,6);
  const num = v => typeof v==="number";
  const real = v => num(v)? v : (v? +String(v).replace(/[$.\s]/g,"") : 0);
  const sumaExcel = filas.reduce((a,r)=>a+(num(r[3])?r[3]:0),0), sumaReal = filas.reduce((a,r)=>a+real(r[3]),0);
  return `<div class="two">
   <div class="panel bad"><span class="eyebrow">Lo que llega del ERP</span><div class="sheetwrap" style="margin-top:8px"><table class="sheet">
     <tr><td class="hd">Factura</td><td class="hd">Valor Neto</td></tr>
     ${filas.map(r=>`<tr><td>${r[0]}</td><td style="text-align:${num(r[3])?"right":"left"}">${esc(num(r[3])?nf.format(r[3]):r[3])}</td></tr>`).join("")}
     <tr><td class="bold">SUMA</td><td class="num bold">${nf.format(sumaExcel)}</td></tr></table></div>
     <p class="muted small" style="margin-top:8px">Los textos quedan a la izquierda y la suma los ignora sin avisar.</p></div>
   <div class="panel good"><span class="eyebrow">Después de convertir</span><div class="sheetwrap" style="margin-top:8px"><table class="sheet">
     <tr><td class="hd">Factura</td><td class="hd">Valor</td><td class="hd">ESNUMERO</td></tr>
     ${filas.map(r=>`<tr><td>${r[0]}</td><td class="num">${nf.format(real(r[3]))}</td><td>VERDADERO</td></tr>`).join("")}
     <tr><td class="bold">SUMA</td><td class="num bold">${nf.format(sumaReal)}</td><td></td></tr></table></div>
     <p class="muted small" style="margin-top:8px">Faltaban ${nf.format(sumaReal-sumaExcel)} pesos en solo seis filas.</p></div></div>`;
};
ERRORES[3] = ()=>`<div class="two">
   <div class="panel bad"><span class="eyebrow">Fórmula copiada sin $</span><div class="sheetwrap" style="margin-top:8px"><table class="sheet">
     <tr><td class="hd">Sede</td><td class="hd">Venta</td><td class="hd">%</td><td class="hd">Fórmula</td></tr>
     <tr><td>Bogotá</td><td class="num">4.438</td><td class="num">30,2 %</td><td class="mono">=B5/B11</td></tr>
     <tr><td>Medellín</td><td class="num">2.907</td><td class="num" style="color:var(--bad)">#DIV/0!</td><td class="mono">=B6/B12</td></tr>
     <tr><td>Cali</td><td class="num">2.348</td><td class="num" style="color:var(--bad)">#DIV/0!</td><td class="mono">=B7/B13</td></tr></table></div>
     <p class="muted small" style="margin-top:8px">El total «se movió» con la fórmula y apunta a celdas vacías.</p></div>
   <div class="panel good"><span class="eyebrow">Con la fila del total fija</span><div class="sheetwrap" style="margin-top:8px"><table class="sheet">
     <tr><td class="hd">Sede</td><td class="hd">Venta</td><td class="hd">%</td><td class="hd">Fórmula</td></tr>
     <tr><td>Bogotá</td><td class="num">4.438</td><td class="num">30,2 %</td><td class="mono">=B5/B$11</td></tr>
     <tr><td>Medellín</td><td class="num">2.907</td><td class="num">19,8 %</td><td class="mono">=B6/B$11</td></tr>
     <tr><td>Cali</td><td class="num">2.348</td><td class="num">16,0 %</td><td class="mono">=B7/B$11</td></tr></table></div>
     <p class="muted small" style="margin-top:8px">Una fórmula, copiada a todas las filas, siempre contra el mismo total. (Venta 2025 en millones.)</p></div></div>`;
ERRORES[4] = ()=>`<div class="two">
   <div class="panel bad"><span class="eyebrow">Lo que circula</span><pre class="code" style="margin-top:8px">=SI(N2&lt;=0;"No vencida";SI(N2&lt;=30;"1–30";
 SI(N2&lt;=60;"31–60";"Más de 60")))

=SI.ERROR(HOY()-H2;0)</pre>
     <ul class="plain small" style="margin-top:10px"><li>Tres paréntesis de cierre que nadie revisa.</li><li>HOY() cambia el resultado cada día.</li><li>SI.ERROR convierte una fecha mala en «0 días»: la factura parece al día.</li></ul></div>
   <div class="panel good"><span class="eyebrow">Lo que se revisa</span><pre class="code" style="margin-top:8px">=SI.CONJUNTO([@dias_mora]&lt;=0;"No vencida";
             [@dias_mora]&lt;=30;"1–30";
             [@dias_mora]&lt;=60;"31–60";
             VERDADERO;"Más de 60")

=SI.ERROR($K$2-[@fecha_vencimiento];"Revisar fecha")</pre>
     <ul class="plain small" style="margin-top:10px"><li>Se lee de arriba abajo, como la tabla de decisión.</li><li>Fecha de corte fija: el informe se puede reproducir.</li><li>El error queda visible para corregirlo.</li></ul></div></div>`;

/* ======================================================================
   SIMULADORES
   ====================================================================== */

/* ---- Clave 2: auditor de tipos de dato ---- */
SIMS[2] = function(el){
  const F = D.erp_tipos.map(r=>({fac:r[0], fecha:r[1], cant:r[2], valor:r[3]}));
  const COLS = {valor:"Valor Neto", cant:"Cantidad", fecha:"Fecha"};
  const conv = {valor:false, cant:false, fecha:false};
  let col = "valor";
  const aNumero = v => typeof v==="number" ? v : (v===""?null: +String(v).replace(/[$.\s]/g,"").replace(" und",""));
  const aFecha = s => { if(/^\d{5}$/.test(s)) { const d=new Date(Date.UTC(1899,11,30)+(+s)*864e5); return d } const m=s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/); if(m) return new Date(Date.UTC(+m[3],+m[2]-1,+m[1])); const i=s.match(/^(\d{4})-(\d{2})-(\d{2})$/); if(i) return new Date(Date.UTC(+i[1],+i[2]-1,+i[3])); return null };
  const serial = d => Math.round((d - Date.UTC(1899,11,30))/864e5);
  const fmtF = d => `${pad2(d.getUTCDate())}/${pad2(d.getUTCMonth()+1)}/${d.getUTCFullYear()}`;
  const celda = (r,c) => {
    const raw = r[c];
    if(c==="valor"){ if(raw==="") return {t:"Vacía",s:"",n:null}; if(conv.valor) return {t:"Número",s:nf.format(aNumero(raw)),n:aNumero(raw)}; return typeof raw==="number"?{t:"Número",s:nf.format(raw),n:raw}:{t:"Texto",s:raw,n:null} }
    if(c==="cant"){ if(conv.cant) return {t:"Número",s:nf.format(+raw.replace(" und","")),n:+raw.replace(" und","")}; return {t:"Texto",s:raw,n:null} }
    if(conv.fecha){ const d=aFecha(raw); return {t:"Número (fecha)",s:fmtF(d),n:serial(d)} }
    return {t:"Texto",s:raw,n:null};
  };
  const formula = {valor:`=VALOR(SUSTITUIR(SUSTITUIR(SUSTITUIR(I2;"$";"");".";"");" ";""))`, cant:`=VALOR(SUSTITUIR(H2;" und";""))`, fecha:`=SI.ERROR(FECHANUMERO(C2);VALOR(C2))`};
  const draw = ()=>{
    const cs = F.map(r=>celda(r,col)), nums = cs.filter(c=>c.n!=null), noVacias = cs.filter(c=>c.t!=="Vacía");
    const sumaReal = col==="fecha"?null:F.reduce((a,r)=>{ const v=col==="valor"?aNumero(r.valor):+r.cant.replace(" und",""); return a+(v||0) },0);
    el.innerHTML = `<div class="stack">
      <p class="read">Once filas reales de la exportación del ERP. Elige una columna y míralas como las ve Excel: <b>los números se alinean a la derecha y los textos a la izquierda</b>, y la barra de estado solo suma números. Luego aplica la conversión.</p>
      <div class="ctl"><label for="s2c">Columna a revisar<select id="s2c">${Object.entries(COLS).map(([k,v])=>`<option value="${k}">${v}</option>`).join("")}</select></label>
        <button class="btn ${conv[col]?"":"primary"}" data-conv>${conv[col]?"Deshacer conversión":"Aplicar la fórmula de conversión"}</button></div>
      ${fxbar("Nueva columna", `<span class="mono">${conv[col]?esc(formula[col]):"(sin convertir: los valores tal como llegaron)"}</span>`)}
      <div class="sheetwrap"><table class="sheet"><thead><tr><th></th><th>Factura</th><th>${COLS[col]}</th><th>=ESNUMERO()</th><th>Excel lo guarda como</th></tr></thead><tbody>
        ${F.map((r,i)=>{ const c=cs[i]; return `<tr><td class="rn">${i+2}</td><td>${r.fac}</td><td style="text-align:${c.n!=null?"right":"left"}; ${c.n==null&&c.t!=="Vacía"?"color:var(--bad)":""}">${esc(c.s)||"&nbsp;"}</td><td>${c.n!=null?"VERDADERO":"FALSO"}</td><td>${c.t}</td></tr>` }).join("")}
      </tbody></table></div>
      <div class="fx" role="status" aria-label="Barra de estado"><div class="namebox">Barra de estado</div><div class="formula">Recuento: ${noVacias.length} &nbsp;&nbsp; ${nums.length?`Recuento numérico: ${nums.length} &nbsp;&nbsp; ${col==="fecha"?"":`Suma: ${nf.format(nums.reduce((a,c)=>a+c.n,0))}`}`:"(sin Suma: no hay números)"}</div></div>
      <div class="insight">${col==="fecha"
        ? (conv.fecha?`Las tres formas (<code>dd/mm/aaaa</code>, <code>aaaa-mm-dd</code> y el serial <code>45299</code>) quedaron como la misma clase de dato: un número que Excel muestra como fecha. Ahora se pueden restar y agrupar por mes.`:`Las fechas llegaron como texto en tres formatos. Así no se pueden agrupar por mes ni restar para calcular días.`)
        : (conv[col]?`Todas las celdas son números. Suma correcta: <b>${nf.format(sumaReal)}</b>.`:`SUMA ve ${nums.length} de ${noVacias.length} valores. Con la columna convertida la suma sería <b>${nf.format(sumaReal)}</b>: hoy faltan <b>${nf.format(sumaReal-nums.reduce((a,c)=>a+c.n,0))}</b>.`)}</div>
    </div>`;
    $("#s2c").value = col;
    $("#s2c").onchange = e=>{ col=e.target.value; draw() };
    $("[data-conv]",el).onclick = ()=>{ conv[col]=!conv[col]; draw() };
  };
  draw();
};

/* ---- Clave 3: copiador de fórmulas ---- */
SIMS[3] = function(el){
  const sedes = DM.ciudad.slice(), y=anioIdx(2025);
  const v = agg("ciudad",{filtro:i=>C.anio[i]===y}); const base = sedes.map((_,i)=>Math.round((v.get(i)||0)/1e6));
  const esc4 = [-0.05,0,0.05,0.10];
  // Celda de origen C5 = (fila 5, col 3). Referencias: base en B5, escenario en C4.
  let S = {b:"$B5", e:"C$4"};
  const parse = r => ({cAbs:r[0]==="$", col:r.replace(/\$/g,"").match(/[A-Z]+/)[0], rAbs:/[A-Z]\$/.test(r), row:+r.match(/\d+/)[0]});
  const colN = c => c.charCodeAt(0)-64, colL = n => String.fromCharCode(64+n);
  const mover = (ref, dr, dc) => { const p=parse(ref); const c=p.cAbs?colN(p.col):colN(p.col)+dc, r=p.rAbs?p.row:p.row+dr; return {c, r, txt:`${p.cAbs?"$":""}${colL(c)}${p.rAbs?"$":""}${r}`} };
  const draw = ()=>{
    let ok=0, total=0, filas="";
    sedes.forEach((s,i)=>{ let tds="";
      esc4.forEach((e,j)=>{ total++;
        const rb = mover(S.b,i,j), re = mover(S.e,i,j);
        const bien = rb.c===2 && rb.r===5+i && re.r===4 && re.c===3+j;
        if(bien) ok++;
        const valor = bien ? nf.format(Math.round(base[i]*(1+e))) : "✗";
        tds += `<td class="num" style="${bien?"":"background:var(--bad-soft)"}" title="=${rb.txt}*(1+${re.txt})"><span class="mono small muted">=${rb.txt}*(1+${re.txt})</span><br>${valor}</td>` });
      filas += `<tr><td class="rn">${5+i}</td><td>${s}</td><td class="num">${nf.format(base[i])}</td>${tds}</tr>` });
    const opts = (cur, list)=>list.map(o=>`<option ${o===cur?"selected":""}>${o}</option>`).join("");
    el.innerHTML = `<div class="stack">
      <p class="read">En C5 se escribe una sola fórmula: venta base por (1 + escenario). Elige cómo escribir cada referencia y mira qué pasa al copiarla a toda la tabla. Cada celda muestra la fórmula que le quedó y su resultado (venta 2025 en millones).</p>
      <div class="ctl"><label for="s3b">Referencia a la venta base<select id="s3b">${opts(S.b,["B5","$B$5","$B5","B$5"])}</select></label>
        <label for="s3e">Referencia al escenario<select id="s3e">${opts(S.e,["C4","$C$4","$C4","C$4"])}</select></label></div>
      ${fxbar("C5", `<span class="mono">=${S.b}*(1+${S.e})</span>`)}
      <div class="sheetwrap"><table class="sheet"><thead><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th></tr></thead><tbody>
        <tr><td class="rn">4</td><td class="hd">Sede</td><td class="hd">Venta 2025</td>${esc4.map(e=>`<td class="hd">${e>0?"+":""}${Math.round(e*100)} %</td>`).join("")}</tr>
        ${filas}</tbody></table></div>
      <div class="insight"><b>${ok} de ${total} celdas correctas.</b> ${ok===total?"La columna de la venta base y la fila de los escenarios quedaron fijas: una fórmula sirve para toda la tabla.":
        S.b==="$B$5"?"Con $B$5 todas las sedes usan la venta de Bogotá.":S.b==="B5"||S.b==="B$5"?"La venta base se corre hacia la derecha al copiar: hay que fijar la columna B ($B5).":
        S.e==="$C$4"?"Con $C$4 todas las columnas usan el escenario de −5 %.":"El escenario baja con la fórmula y deja de leer la fila 4: hay que fijar la fila (C$4)."}</div>
    </div>`;
    $("#s3b").onchange=e=>{ S.b=e.target.value; draw() }; $("#s3e").onchange=e=>{ S.e=e.target.value; draw() };
  };
  draw();
};

/* ---- Clave 4: constructor de reglas de cartera ---- */
SIMS[4] = function(el){
  const base = D.cartera.filas.map(r=>({fac:r[0], cli:r[1], ciu:r[2], cred:r[3], fecha:r[4], venc:r[5], total:r[6]}));
  const dato = base.map((r,i)=> i===3 ? {...r, venc:"pendiente"} : r);   // una fecha mal escrita, como en la vida real
  let S = {corte:"2026-01-31", forma:"conjunto", dias:30, monto:5000000, op:"Y", sierror:false};
  const dias = r => { if(!/^\d{4}-\d{2}-\d{2}$/.test(r.venc)) return S.sierror ? 0 : null; return Math.round((Date.parse(S.corte)-Date.parse(r.venc))/864e5) };
  const rango = d => d==null?"#¡VALOR!": d<=0?"No vencida": d<=30?"1–30": d<=60?"31–60":"Más de 60";
  const alerta = (d,t) => d==null?"#¡VALOR!": (S.op==="Y" ? (d>S.dias && t>S.monto) : (d>S.dias || t>S.monto)) ? "Llamar hoy":"Seguimiento normal";
  const RANGOS = ["No vencida","1–30","31–60","Más de 60"];
  const draw = ()=>{
    const filas = dato.map(r=>{ const d=dias(r); return {...r, d, rg:rango(d), al:alerta(d,r.total)} });
    const porR = RANGOS.map(k=>({k, n:filas.filter(f=>f.rg===k).length, v:filas.filter(f=>f.rg===k).reduce((a,f)=>a+f.total,0)}));
    const llamar = filas.filter(f=>f.al==="Llamar hoy"), errores = filas.filter(f=>f.rg==="#¡VALOR!");
    const f1 = S.forma==="conjunto"
      ? `=SI.CONJUNTO([@dias_mora]<=0;"No vencida";[@dias_mora]<=30;"1–30";[@dias_mora]<=60;"31–60";VERDADERO;"Más de 60")`
      : `=SI([@dias_mora]<=0;"No vencida";SI([@dias_mora]<=30;"1–30";SI([@dias_mora]<=60;"31–60";"Más de 60")))`;
    const fd = S.sierror ? `=SI.ERROR($K$2-[@fecha_vencimiento];0)` : `=$K$2-[@fecha_vencimiento]`;
    const fa = `=SI(${S.op}([@dias_mora]>${S.dias};[@total]>${S.monto});"Llamar hoy";"Seguimiento normal")`;
    el.innerHTML = `<div class="stack">
      <p class="read">Las <b>${base.length} facturas pendientes</b> de la empresa. Cambia la fecha de corte, la forma de la fórmula y la regla de alerta, y mira cómo cambia la clasificación. La cuarta factura tiene la fecha de vencimiento mal escrita, como pasa en la vida real.</p>
      <div class="panel"><div class="ctl">
        <label for="s4c">Fecha de corte<select id="s4c"><option value="2025-12-31">31/12/2025</option><option value="2026-01-31">31/01/2026</option></select></label>
        <label for="s4f">Forma de la fórmula<select id="s4f"><option value="conjunto">SI.CONJUNTO</option><option value="anidado">SI anidados</option></select></label>
        <label for="s4d">Alerta si mora mayor a<select id="s4d"><option value="15">15 días</option><option value="30">30 días</option><option value="45">45 días</option></select></label>
        <label for="s4o">Operador<select id="s4o"><option>Y</option><option>O</option></select></label>
        <label for="s4m">y total mayor a<select id="s4m"><option value="2000000">$ 2 M</option><option value="5000000">$ 5 M</option><option value="10000000">$ 10 M</option></select></label>
        <label class="chk" for="s4e"><input type="checkbox" id="s4e" ${S.sierror?"checked":""}> Envolver los días en SI.ERROR(…;0)</label>
      </div></div>
      ${fxbar("dias_mora", `<span class="mono">${esc(fd)}</span>`)}
      ${fxbar("rango", `<span class="mono">${esc(f1)}</span>`)}
      ${fxbar("alerta", `<span class="mono">${esc(fa)}</span>`)}
      <div class="two" style="grid-template-columns:minmax(0,1.2fr) minmax(0,1fr)">
        <div class="sheetwrap"><table class="sheet"><thead><tr><th>Factura</th><th>Vence</th><th>Total</th><th>dias_mora</th><th>rango</th><th>alerta</th></tr></thead><tbody>
          ${filas.slice(0,10).map(f=>`<tr style="${f.d==null||(S.sierror&&f.venc==="pendiente")?"background:var(--bad-soft)":""}"><td>${f.fac}</td><td>${esc(f.venc)}</td><td class="num">${nf.format(f.total)}</td><td class="num">${f.d==null?"#¡VALOR!":f.d}</td><td>${f.rg}</td><td>${f.al==="Llamar hoy"?"<b>Llamar hoy</b>":f.al}</td></tr>`).join("")}
        </tbody></table><p class="muted small" style="padding:6px 10px">Primeras 10 de ${base.length} facturas.</p></div>
        <div class="panel mini"><div class="gtitle">Cartera por rango de mora (millones)</div>${G.barrasH(porR.map(x=>({k:x.k,v:x.v})),{fmt:mill,ejeFmt:v=>nf.format(v/1e6),resaltar:porR.reduce((m,x,i)=>x.v>porR[m].v?i:m,0),label:"Cartera por rango"})}
          <p class="small muted">${porR.map(x=>`${x.k}: ${x.n}`).join(" · ")}</p></div>
      </div>
      <div class="insight"><b>${llamar.length} facturas para «Llamar hoy»</b> (${mill(llamar.reduce((a,f)=>a+f.total,0))}).
        ${S.sierror?` <b>Ojo:</b> SI.ERROR convirtió la fecha mal escrita en 0 días: la factura ${dato[3].fac}, con vencimiento «pendiente», aparece como «No vencida» y nadie la va a revisar.`:errores.length?` Hay ${errores.length} factura con #¡VALOR!: es un dato que alguien debe corregir, y el error lo deja a la vista.`:""}
        ${S.forma==="anidado"?" Los SI anidados dan el mismo resultado, pero hay que contar paréntesis para revisarlos.":""}</div>
    </div>`;
    $("#s4c").value=S.corte; $("#s4f").value=S.forma; $("#s4d").value=S.dias; $("#s4o").value=S.op; $("#s4m").value=S.monto;
    $("#s4c").onchange=e=>{S.corte=e.target.value;draw()}; $("#s4f").onchange=e=>{S.forma=e.target.value;draw()};
    $("#s4d").onchange=e=>{S.dias=+e.target.value;draw()}; $("#s4o").onchange=e=>{S.op=e.target.value;draw()};
    $("#s4m").onchange=e=>{S.monto=+e.target.value;draw()}; $("#s4e").onchange=e=>{S.sierror=e.target.checked;draw()};
  };
  draw();
};
