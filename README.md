<p align="center"><img src="assets/logo-drbits.jpg" alt="Dr. Bits" width="240"></p>

<h1 align="center">Excel Corporativo · 12 Claves</h1>

<p align="center">Guía de estudio interactiva para corregir las brechas más comunes de Excel en equipos de análisis de datos e informes.<br>
Tablero web · cuadernos de Google Colab sin código expuesto · laboratorio guiado Excel + Colab · datos de una empresa ficticia.</p>

<p align="center">
<a href="https://omarli-360.github.io/excel-corporativo-12-claves/"><b>Abrir el tablero</b></a> ·
<a href="docs/BRECHAS.md">Por qué estas 12 claves</a> ·
<a href="data/README.md">Diccionario de datos</a> ·
<a href="docs/USABILIDAD.md">Prueba de usabilidad</a>
</p>

---

## Para quién es

Aprendices SENA y estudiantes que se incorporan a áreas de análisis de datos, elaboración y explicación de informes de resultados. **No se necesita saber programar.** El nivel es mixto: primero corrige las fallas de lo básico y luego construye lo intermedio. Funciona para autoestudio y para clases con instructor: el **Modo instructor** del tablero muestra en cada clave y cada taller una guía con tiempos, preguntas para discutir y errores esperados.

Requisitos: navegador, cuenta de Google (para Colab) y **Excel 365**.

## Empieza aquí

1. **[Conoce la empresa](https://omarli-360.github.io/excel-corporativo-12-claves/#empresa).** Distribuidora Andina S.A.S.: qué hace, qué área produce cada tabla, qué representa una fila y qué significa cada columna.
2. **[Haz el diagnóstico](https://omarli-360.github.io/excel-corporativo-12-claves/#diagnostico).** Ocho preguntas para saber por qué clave empezar.
3. **[Estudia las claves](https://omarli-360.github.io/excel-corporativo-12-claves/#ruta).** Ocho pasos cada una: para qué sirve (con un caso real), entender, ver el error, practicar en un simulador, hacerlo en Excel, visualizar en Colab, apoyarse en IA y autoevaluarse.
4. **[Construye en el laboratorio](https://omarli-360.github.io/excel-corporativo-12-claves/#laboratorio).** Cuatro talleres para unir Excel y Colab en un proceso real.

La **[capacitación rápida en gráficos para informes](https://omarli-360.github.io/excel-corporativo-12-claves/#graficos)** (12 gráficos, cuándo usar cada uno y cómo hacerlo en Excel 365) sirve en cualquier momento.

## Laboratorio Excel + Colab

| Taller | Qué construyes | Entregable |
|---|---|---|
| T0 · Monta tu laboratorio | Carpetas en Drive, copia de los cuadernos, Excel probado | Mensaje «Laboratorio listo» |
| T1 · De Excel a Colab | Tu libro de Excel entra a Colab, se revisa y sale como informe interactivo | `informe_interactivo_Andina.html` |
| T2 · De Colab a Excel | Colab une y valida las tablas; en Excel armas un tablero con dinámicas, segmentaciones y escala de tiempo | `Panel_Andina_<nombre>.xlsx` |
| T3 · Tablero para el comité | Llega enero de 2026: actualizas Excel, generas el tablero web y escribes el informe | Panel actualizado, `tablero_comite_enero2026.html`, informe de una página |

El Taller 3 tiene una **cifra de control**: la venta neta de enero de 2026 debe dar lo mismo en Excel y en Colab. Así el estudiante comprueba solo que su proceso funciona.

## Cuadernos de Colab

Todos tienen el código oculto: el estudiante ejecuta, elige opciones en listas desplegables y responde retos de interpretación. Cada gráfico trae una **ficha de decisión** (qué se grafica, por qué esa forma, qué se descartó y cómo se lee).

| Cuaderno | Para qué | Colab |
|---|---|---|
| `00_conoce_la_empresa` | Recorrido por los datos y prueba del laboratorio | [Abrir](https://colab.research.google.com/github/OmarLi-360/excel-corporativo-12-claves/blob/main/notebooks/00_conoce_la_empresa.ipynb) |
| `01_estructura_y_tablas` | Clave 1 · reporte frente a tabla ordenada | [Abrir](https://colab.research.google.com/github/OmarLi-360/excel-corporativo-12-claves/blob/main/notebooks/01_estructura_y_tablas.ipynb) |
| `05_busqueda_y_cruce` | Clave 5 · lo que se pierde cuando un cruce falla | [Abrir](https://colab.research.google.com/github/OmarLi-360/excel-corporativo-12-claves/blob/main/notebooks/05_busqueda_y_cruce.ipynb) |
| `07_tablas_dinamicas` | Clave 7 · constructor de dinámicas y seis preguntas de negocio | [Abrir](https://colab.research.google.com/github/OmarLi-360/excel-corporativo-12-claves/blob/main/notebooks/07_tablas_dinamicas.ipynb) |
| `graficos_para_informes` | Galería de los 12 gráficos con su ficha | [Abrir](https://colab.research.google.com/github/OmarLi-360/excel-corporativo-12-claves/blob/main/notebooks/graficos_para_informes.ipynb) |
| `taller_1_excel_a_colab` | Taller 1 | [Abrir](https://colab.research.google.com/github/OmarLi-360/excel-corporativo-12-claves/blob/main/notebooks/taller_1_excel_a_colab.ipynb) |
| `taller_2_colab_a_excel` | Taller 2 | [Abrir](https://colab.research.google.com/github/OmarLi-360/excel-corporativo-12-claves/blob/main/notebooks/taller_2_colab_a_excel.ipynb) |
| `taller_3_tablero_comite` | Taller 3 | [Abrir](https://colab.research.google.com/github/OmarLi-360/excel-corporativo-12-claves/blob/main/notebooks/taller_3_tablero_comite.ipynb) |

## Las 12 claves

| Tramo | # | Clave | Estado |
|---|---|---|---|
| Fundamentos | 1 | Estructura antes que fórmulas | **Piloto** |
| | 2 | Tipos de dato que no engañan *(clave nueva)* | Orientación y ejemplo |
| | 3 | Referencias que se copian bien | Orientación y ejemplo |
| | 4 | Lógica condicional legible | Orientación y ejemplo |
| Análisis | 5 | Buscar y cruzar sin #N/D | **Piloto** |
| | 6 | Agregar con condiciones | Orientación y ejemplo |
| | 7 | Tablas dinámicas que responden preguntas | **Piloto** |
| | 8 | Limpieza reproducible con Power Query | Orientación y ejemplo |
| Control y comunicación | 9 | Datos que se validan solos | Orientación y ejemplo |
| | 10 | Fórmulas de matriz dinámica | Orientación y ejemplo |
| | 11 | Gráficos y narrativa de resultados | Orientación y ejemplo |
| | 12 | Auditoría, control y uso responsable de IA | Orientación y ejemplo |

La selección se basa en la evidencia sobre errores en hojas de cálculo y en lo que piden las vacantes de analista en Colombia: ver [docs/BRECHAS.md](docs/BRECHAS.md).

## El conjunto de datos

**Distribuidora Andina S.A.S.** es una empresa ficticia de suministros de oficina y tecnología con seis sedes. Tiene estacionalidad, crecimiento entre años, ajuste de precios, concentración de clientes, facturas anuladas, cartera pendiente, rotación de vendedores, una exportación de ERP con defectos y un mes nuevo (enero de 2026) para practicar la actualización. Detalle en [data/README.md](data/README.md).

Todo se genera con semilla fija, así que el tablero, los cuadernos y los libros de Excel dan las mismas cifras.

## Estructura del repositorio

```
├── index.html                 Tablero (GitHub Pages). Lo genera scripts/construir_tablero.py
├── src/
│   ├── tablero.html           Estructura y estilos del tablero
│   ├── motor/                 Utilidades, gráficos SVG y simuladores
│   ├── contenido/             Claves, empresa, gráficos y laboratorio (aquí se edita el contenido)
│   └── app.js                 Vistas generales y navegación
├── assets/                    Logo y datos compactos para el tablero
├── data/                      CSV, libros de Excel, diccionario y nuevo_mes/
├── notebooks/                 Cuadernos de Colab (los genera scripts/construir_cuadernos.py)
├── scripts/                   Generador de datos y constructores
└── docs/                      Evidencia de las brechas y prueba de usabilidad
```

### Regenerar todo

```bash
pip install pandas numpy openpyxl nbformat
python scripts/generar_dataset.py       # data/ y assets/datos-andina.js
python scripts/construir_tablero.py     # index.html
python scripts/construir_cuadernos.py   # notebooks/
```

### Cómo agregar una clave

1. En `src/contenido/claves.js`: añade su objeto completo en `MOD[n]` (objetivos, explicación, pasos en Excel, instrucciones de IA, preguntas y guía docente) y su número en `PILOTO`. La orientación y el ejemplo ya están en `CLAVES`.
2. En `src/motor/simuladores.js`: añade su simulador en `SIMS[n]`.
3. En `scripts/cuadernos/claves.py`: crea su cuaderno con `encabezado`, `ficha`, `reto` y `cierre`.
4. Ejecuta los constructores y prueba que cada reto acepte su respuesta correcta.

## Licencia y créditos

* Contenido educativo: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.es).
* Código: [MIT](LICENSE).
* La marca y el logo de Dr. Bits no están cubiertos por estas licencias.
* Los datos son ficticios: cualquier parecido con empresas o personas reales es coincidencia.

Creado por **Omar Libardo Acelas Angulo** · [Dr. Bits](https://github.com/OmarLi-360) · ADNBITS S.A.S. · Bogotá, Colombia · 2026
