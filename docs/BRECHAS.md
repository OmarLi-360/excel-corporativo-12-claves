# Por qué estas 12 claves

Las claves no salen de una lista de «funciones más populares». Salen de las **brechas** que la investigación y el mercado laboral reportan en usuarios de Excel. Este documento resume la evidencia y explica cómo se convirtió en una ruta de aprendizaje.

## 1. Lo que dice la evidencia

| Hallazgo | Fuente |
|---|---|
| En auditorías de hojas de cálculo de empresas reales, casi todas las hojas revisadas (94 %) tenían errores. | Panko, R. (2008). *Spreadsheets and Sarbanes-Oxley*. [arXiv:0804.0797](https://arxiv.org/pdf/0804.0797); ver también [arXiv:1602.02601](https://arxiv.org/pdf/1602.02601) |
| En promedio, alrededor del 5,2 % de las celdas con fórmula de esas hojas tenían error. Con miles de fórmulas por libro, eso son decenas o cientos de errores. | Panko (1998), citado en *Spreadsheet Risk Management in Organisations* — [arXiv:1009.2775](https://arxiv.org/pdf/1009.2775) |
| Entre las causas frecuentes: fórmulas copiadas mal, fórmulas sobrescritas, mal uso de funciones, errores de digitación, ordenamientos que desalinean filas y datos nuevos que quedan fuera del rango. | IBM, *Risks of using spreadsheets*, con datos de EuSpRIG 2016 — [ibm.com](https://www.ibm.com/downloads/cas/WA1VAO2L) |
| La mayoría de usuarios aprendió por su cuenta (71 % autodidactas) y aun así más de tres cuartas partes se declaran de nivel intermedio o superior. | EuSpRIG 2016, citado por IBM (misma fuente) |
| En una prueba práctica a personas que usan hojas de cálculo en su trabajo, la mayoría solo pudo resolver tareas muy básicas. | Gibbs, Steel & McKinnon (2014), *Are workplace end-user computing skills at a desirable level?* — [FAO AGRIS](https://agris.fao.org/search/en/records/67659bb350e69ae81838fe0f) |
| La experiencia y la capacitación mejoran el conocimiento de *funciones*, pero no el conocimiento de *desarrollo* ni de *aseguramiento de calidad* de hojas de cálculo. | *Spreadsheet Knowledge: An Exploratory Study* — [IRMA](https://irma-international.org/proceeding-paper/spreadsheet-knowledge-exploratory-study/31685) |
| En un foro de ayuda de Excel, solo el 18 % de las preguntas eran sobre fórmulas: la mayoría de las dificultades están en estructura, formato, gráficos y manejo de datos. | Chambers & Scaffidi, *A Study of Help Requested Online by Spreadsheet Users* — [IGI Global](https://www.igi-global.com/article/study-help-requested-online-spreadsheet/70427) |
| En Colombia, las vacantes de analista piden Excel avanzado (fórmulas, tablas dinámicas, Power Query), elaboración de reportes e indicadores y, cada vez más, uso de herramientas de IA. | Ofertas publicadas en [elempleo.com](https://www.elempleo.com/co/ofertas-trabajo/analista-de-data-ingles-requerido-1886733438) y [Magneto](https://www.magneto365.com/co/empleos/profesional-de-ingenieria-industrial-data-analytics-excel-avanzado-colombia-939122) (consultadas en octubre de 2026) |

## 2. De la evidencia a las claves

Tres conclusiones orientan el diseño:

1. **El problema no son solo las fórmulas.** Estructura de datos, tipos de dato y limpieza explican buena parte de los errores. Por eso el primer tramo es de fundamentos, y la clave 1 trata de estructura antes que de funciones.
2. **Saber funciones no es saber verificar.** La capacitación tradicional enseña funciones; la evidencia muestra que la brecha está en el aseguramiento de calidad. Cada clave incluye un paso de verificación, y la clave 12 lo convierte en hábito.
3. **El usuario sobreestima su nivel.** Por eso la guía empieza con un diagnóstico y cada clave abre mostrando el error que circula en las empresas, no la teoría.

| # | Clave | Brecha que corrige | Evidencia principal |
|---|---|---|---|
| 1 | Estructura antes que fórmulas | Hojas «para imprimir» que no se pueden analizar | Datos nuevos fuera del rango; dificultades fuera de las fórmulas |
| 2 | Tipos de dato que no engañan **(clave nueva)** | Números como texto, fechas que no son fechas | Errores de digitación y mal uso de funciones; exportaciones de ERP |
| 3 | Referencias que se copian bien | Fórmulas que se rompen al copiarlas | Fórmulas copiadas mal |
| 4 | Lógica condicional legible | SI anidados imposibles de revisar | Errores de lógica |
| 5 | Buscar y cruzar sin #N/D | Cruces fallidos o silenciosamente equivocados | Mal uso de funciones; vacantes piden cruce de bases |
| 6 | Agregar con condiciones | Totales hechos a mano | Omisiones y digitación |
| 7 | Tablas dinámicas que responden preguntas | Resúmenes que suman lo que no deben | Frontera básico–analista en vacantes |
| 8 | Limpieza reproducible (Power Query) | Limpieza manual repetida cada mes | Vacantes piden Power Query |
| 9 | Datos que se validan solos | Entradas inconsistentes | Errores de digitación |
| 10 | Fórmulas de matriz dinámica | Listas copiadas que se desactualizan | Datos nuevos fuera del rango |
| 11 | Gráficos y narrativa de resultados | Informes sin mensaje | Vacantes piden reportes e indicadores |
| 12 | Auditoría, control y uso responsable de IA | Informes sin revisión y fórmulas de IA sin verificar | 94 % con errores; formación sin aseguramiento de calidad |

**Sobre la clave nueva.** La propuesta inicial tenía 11 claves. La revisión de brechas mostró que los problemas de tipo de dato (números guardados como texto, fechas importadas como texto, separadores decimales mezclados) aparecían como causa en varias categorías a la vez y no tenían un lugar propio. Se convirtió en la clave 2, dentro de los fundamentos, y el antiguo tema de gráficos se reorientó a *narrativa de resultados*, porque el público objetivo debe explicar informes, no solo construirlos.

## 3. Por qué este piloto (claves 1, 5 y 7)

Cubren un recorrido completo, de lo básico a lo intermedio: **estructurar** (1) → **cruzar** (5) → **resumir y explicar** (7). Con ellas se puede validar el formato de los siete pasos, los simuladores, los cuadernos y los retos antes de producir las nueve restantes.

---
*Los porcentajes de la tabla 1 provienen de estudios con muestras y metodologías distintas; se citan para dimensionar el problema, no como una tasa universal.*
