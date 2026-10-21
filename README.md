<p align="center"><img src="assets/logo-drbits.jpg" alt="Dr. Bits" width="240"></p>

<h1 align="center">Excel Corporativo · 12 Claves</h1>

<p align="center">Guía de estudio interactiva para corregir las brechas más comunes de Excel en equipos de análisis de datos e informes.<br>
Tablero web + cuadernos de Google Colab + un conjunto de datos empresarial ficticio y reproducible.</p>

<p align="center">
<a href="https://omarli-360.github.io/excel-corporativo-12-claves/"><b>Abrir el tablero</b></a> ·
<a href="docs/BRECHAS.md">Por qué estas 12 claves</a> ·
<a href="data/README.md">Diccionario de datos</a>
</p>

---

## Para quién es

Aprendices SENA y estudiantes que se incorporan a áreas de análisis de datos, elaboración y explicación de informes de resultados. El nivel es **mixto**: primero corrige las fallas de lo básico y luego construye lo intermedio sobre esa base.

## Cómo se usa

1. **Abre el [tablero](https://omarli-360.github.io/excel-corporativo-12-claves/)** y haz el diagnóstico de 8 preguntas. Te dice por qué clave empezar.
2. **Estudia cada clave en siete pasos:** entender → ver el error → practicar en el simulador → hacerlo en Excel → analizar en Colab → apoyarse en IA → autoevaluarse.
3. **Practica en Excel** con [`Distribuidora_Andina_practica.xlsx`](data/Distribuidora_Andina_practica.xlsx).
4. **Profundiza en Colab** con los cuadernos. No hay que instalar nada:

| Clave | Cuaderno | Colab |
|---|---|---|
| 1 · Estructura antes que fórmulas | `01_estructura_y_tablas.ipynb` | [![Abrir en Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/OmarLi-360/excel-corporativo-12-claves/blob/main/notebooks/01_estructura_y_tablas.ipynb) |
| 5 · Buscar y cruzar sin #N/D | `05_busqueda_y_cruce.ipynb` | [![Abrir en Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/OmarLi-360/excel-corporativo-12-claves/blob/main/notebooks/05_busqueda_y_cruce.ipynb) |
| 7 · Tablas dinámicas que responden preguntas | `07_tablas_dinamicas.ipynb` | [![Abrir en Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/OmarLi-360/excel-corporativo-12-claves/blob/main/notebooks/07_tablas_dinamicas.ipynb) |

## Las 12 claves

| Tramo | # | Clave | Estado |
|---|---|---|---|
| Fundamentos | 1 | Estructura antes que fórmulas | **Piloto** |
| | 2 | Tipos de dato que no engañan *(clave nueva)* | En preparación |
| | 3 | Referencias que se copian bien | En preparación |
| | 4 | Lógica condicional legible | En preparación |
| Análisis | 5 | Buscar y cruzar sin #N/D | **Piloto** |
| | 6 | Agregar con condiciones | En preparación |
| | 7 | Tablas dinámicas que responden preguntas | **Piloto** |
| | 8 | Limpieza reproducible con Power Query | En preparación |
| Control y comunicación | 9 | Datos que se validan solos | En preparación |
| | 10 | Fórmulas de matriz dinámica | En preparación |
| | 11 | Gráficos y narrativa de resultados | En preparación |
| | 12 | Auditoría, control y uso responsable de IA | En preparación |

La selección se basa en la evidencia sobre errores en hojas de cálculo y en lo que piden las vacantes de analista en Colombia: ver [docs/BRECHAS.md](docs/BRECHAS.md).

## El conjunto de datos

**Distribuidora Andina S.A.S.** es una empresa ficticia de suministros de oficina y tecnología con seis sedes (Bogotá, Medellín, Cali, Barranquilla, Bucaramanga y Pereira). El generador reproduce lo que hace difícil el trabajo real: estacionalidad, crecimiento entre años, ajuste de precios, concentración de clientes tipo Pareto, facturas anuladas, cartera pendiente, rotación de vendedores y una exportación de ERP con defectos. Detalle en [data/README.md](data/README.md).

Todo se genera con semilla fija, así que el tablero, los cuadernos y el libro de Excel dan los mismos resultados:

```bash
pip install pandas numpy openpyxl
python scripts/generar_dataset.py       # data/ y assets/datos-andina.js
python scripts/construir_tablero.py     # index.html
pip install nbformat
python scripts/construir_cuadernos.py   # notebooks/
```

## Estructura del repositorio

```
├── index.html                  Tablero (GitHub Pages). Se genera desde src/tablero.html
├── src/tablero.html            Fuente del tablero: contenido, simuladores y estilos
├── assets/                     Logo y muestra compacta de datos para el tablero
├── data/                       CSV, libro de práctica .xlsx y diccionario de datos
├── notebooks/                  Cuadernos de Google Colab (claves 1, 5 y 7)
├── scripts/                    Generador de datos y constructores del tablero y los cuadernos
└── docs/BRECHAS.md             Evidencia y criterios de selección de las claves
```

## Cómo agregar una clave

1. Escribe su contenido en el objeto `MOD[n]` de `src/tablero.html` (objetivos, explicación, pasos en Excel, instrucciones de IA y preguntas) y su simulador en `SIMS[n]`.
2. Agrega su cuaderno en `scripts/construir_cuadernos.py`, usando las mismas funciones `encabezado`, `reto` y `tip_ia`.
3. Ejecuta los constructores y comprueba que todos los retos pasen con su solución.

## Licencia y créditos

* Contenido educativo: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.es). Puedes usarlo y adaptarlo citando la fuente y compartiendo con la misma licencia.
* Código: [MIT](LICENSE).
* La marca y el logo de Dr. Bits no están cubiertos por estas licencias.
* Los datos son ficticios: cualquier parecido con empresas o personas reales es coincidencia.

Creado por **Omar Libardo Acelas Angulo** · [Dr. Bits](https://github.com/OmarLi-360) · ADNBITS S.A.S. · Bogotá, Colombia · 2026
