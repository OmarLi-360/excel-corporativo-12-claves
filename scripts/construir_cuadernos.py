"""
Genera los cuadernos de Google Colab del piloto (claves 1, 5 y 7).

Los cuadernos se escriben desde aquí para que todos compartan la misma
preparación, la misma paleta y el mismo sistema de retos verificables.

Uso:  python scripts/construir_cuadernos.py
"""
from pathlib import Path

import nbformat as nbf

RAIZ = Path(__file__).resolve().parents[1]
REPO = "OmarLi-360/excel-corporativo-12-claves"
RAW = f"https://raw.githubusercontent.com/{REPO}/main"
PAGES = f"https://omarli-360.github.io/excel-corporativo-12-claves/"


def md(texto):
    return nbf.v4.new_markdown_cell(texto.strip("\n"))


def code(texto, oculto=False):
    c = nbf.v4.new_code_cell(texto.strip("\n"))
    if oculto:  # en Colab se muestra solo el título; el código se abre con doble clic
        c.metadata["cellView"] = "form"
    return c


def encabezado(n, titulo, sub, minutos, objetivos, archivo):
    badge = f"https://colab.research.google.com/github/{REPO}/blob/main/notebooks/{archivo}"
    obj = "\n".join(f"{i}. {o}" for i, o in enumerate(objetivos, 1))
    return md(f"""
<img src="{RAW}/assets/logo-drbits.jpg" alt="Dr. Bits" width="170">

# Clave {n} · {titulo}
**Excel Corporativo · 12 Claves** — {sub} · ⏱ {minutos} min

[![Abrir en Colab](https://colab.research.google.com/assets/colab-badge.svg)]({badge}) &nbsp; [Volver al tablero]({PAGES}#clave-{n:02d})

**Al terminar podrás:**
{obj}

**Cómo usar este cuaderno.** Lee cada explicación y ejecuta la celda de código que sigue con **Shift + Enter**. Las celdas con un título y el código oculto (*Comprobar*, *Ver una solución*) se ejecutan igual; haz doble clic sobre ellas si quieres ver su código. Si algo falla, usa *Entorno de ejecución › Reiniciar y ejecutar todo*.
""")


PREPARACION = '''
# @title Preparar el entorno (ejecuta esta celda primero)
import os
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import plotly.io as pio

REPO = "OmarLi-360/excel-corporativo-12-claves"
BASE_URL = f"https://raw.githubusercontent.com/{REPO}/main/data/"
BASE_LOCAL = "../data/"   # si clonaste el repositorio, usa los archivos locales

def ruta(nombre):
    """Devuelve la ruta local del archivo si existe; si no, la URL de GitHub."""
    local = os.path.join(BASE_LOCAL, nombre)
    return local if os.path.exists(local) else BASE_URL + nombre

def pesos(x):
    """Formato de pesos colombianos: $ 1.234.567"""
    return "$ " + f"{x:,.0f}".replace(",", ".")

def millones(x):
    return "$ " + f"{x/1e6:,.1f}".replace(",", "X").replace(".", ",").replace("X", ".") + " M"

def porc(v, signo=False):
    """Porcentaje con coma decimal: 18,9 %"""
    txt = f"{v:+.1%}" if signo else f"{v:.1%}"
    return txt.replace(".", ",").replace("%", " %")

def comprobar(respuesta, esperado, tolerancia=0.0, unidad=""):
    """Compara tu respuesta con el resultado esperado y te da pistas."""
    if respuesta is None:
        print("Aún no has escrito tu respuesta: reemplaza None por tu resultado y vuelve a ejecutar.")
        return
    if isinstance(esperado, str):
        ok = str(respuesta).strip().lower() == esperado.strip().lower()
    else:
        try:
            ok = abs(float(respuesta) - float(esperado)) <= tolerancia
        except (TypeError, ValueError):
            print("Tu respuesta debe ser un número."); return
    if ok:
        print(f"Correcto. {respuesta}{unidad} es el resultado esperado.")
    else:
        print(f"Todavía no. Revisa los filtros (¿quitaste las anuladas?) y el periodo. Tu respuesta: {respuesta}{unidad}")

# Plantilla de gráficos Dr. Bits: separador decimal coma y miles punto, como en Colombia
pio.templates["drbits"] = go.layout.Template(layout=dict(
    font=dict(family="Source Sans 3, Segoe UI, Arial, sans-serif", size=14, color="#11153A"),
    title=dict(font=dict(size=18, color="#00006A"), x=0, xanchor="left"),
    colorway=["#4A5AD8", "#0E9BB8", "#D0336F"],
    plot_bgcolor="white", paper_bgcolor="white",
    xaxis=dict(gridcolor="#E4E8F2", zeroline=False, linecolor="#C9D0E2", exponentformat="none", separatethousands=True),
    yaxis=dict(gridcolor="#E4E8F2", zeroline=False, linecolor="#C9D0E2", exponentformat="none", separatethousands=True),
    separators=",.", hoverlabel=dict(font_size=13), margin=dict(t=70, l=10, r=20, b=40),
))
pio.templates.default = "plotly_white+drbits"
def dar_aire(fig, maximo, eje="x"):
    """Deja espacio a la derecha (o arriba) para que las etiquetas de las barras no se corten."""
    (fig.update_xaxes if eje == "x" else fig.update_yaxes)(range=[0, maximo * 1.22])

MM = "Millones de pesos"   # en español «billón» es 10^12: evitamos la abreviatura B de Plotly
AZUL, TEAL, MAGENTA, GRIS = "#4A5AD8", "#0E9BB8", "#D0336F", "#9AA3BF"
MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
pd.set_option("display.max_columns", 30)
pd.set_option("styler.format.decimal", ",")      # tablas con estilo: 18,9 %
pd.set_option("styler.format.thousands", ".")
print("Entorno listo. Datos desde:", "archivos locales" if os.path.exists(BASE_LOCAL) else "GitHub")
'''


def reto(i, enunciado, pista, comprobacion, solucion):
    return [
        md(f"### Reto {i}\n{enunciado}\n\n*Pista:* {pista}"),
        code(f"# Escribe tu código aquí y guarda el resultado en respuesta_{i}\nrespuesta_{i} = None"),
        code(f"# @title Comprobar reto {i}\n{comprobacion}", oculto=True),
        code(f"# @title Ver una solución (inténtalo primero)\n{solucion}", oculto=True),
    ]


def tip_ia(texto, prompt):
    return md(f"""
## Apóyate en IA
{texto}

```text
{prompt}
```

> **Verifica siempre.** Ejecuta el código que te proponga sobre un caso cuyo resultado ya conoces. No pegues datos personales reales (Ley 1581 de 2012): estos datos son ficticios, los de tu empresa no.
""")


# ============================================================================
# CLAVE 1
# ============================================================================
def cuaderno_01():
    c = [
        encabezado(1, "Estructura antes que fórmulas", "Datos tabulares y Tablas de Excel", 45, [
            "Detectar con código los defectos de un reporte «para imprimir».",
            "Reconstruirlo como tabla ordenada: una fila por registro.",
            "Medir cuánto se equivoca una suma hecha sobre un reporte.",
            "Hacer un diagnóstico de calidad a una base antes de analizarla."],
            "01_estructura_y_tablas.ipynb"),
        md("""
## Excel y Python, lado a lado
Lo que haces en Excel tiene un equivalente en pandas, la librería de Python para datos tabulares. Este cuaderno usa esta correspondencia:

| En Excel | En pandas | Para qué |
|---|---|---|
| Una Tabla (`Ctrl+T`) | un `DataFrame` | Datos con nombre de columna y tipo |
| Separar celdas + rellenar hacia abajo | `.ffill()` | Repetir la ciudad en cada fila |
| Filtro y eliminar filas | `df[condición]` | Quitar subtotales y filas en blanco |
| Anular dinamización de columnas (Power Query) | `.melt()` | Pasar T1…T4 a una columna *trimestre* |
| `SUMA`, `SUMAR.SI.CONJUNTO` | `.sum()`, `.groupby().sum()` | Totales |
"""),
        code(PREPARACION, oculto=True),
        md("""
## Parte A · El reporte que llega por correo
El libro de práctica tiene la hoja **Reporte_Mal_Estructurado**: el informe de ventas 2025 tal como lo armaría alguien para imprimirlo. Léelo sin decirle a pandas dónde está el encabezado (`header=None`) para verlo tal cual: cada `NaN` es una celda vacía.
"""),
        code('''
reporte = pd.read_excel(ruta("Distribuidora_Andina_practica.xlsx"),
                        sheet_name="Reporte_Mal_Estructurado", header=None)
reporte.head(16)
'''),
        md("""
Observa tres cosas en la salida:

* La ciudad aparece una sola vez por bloque. Las demás filas tienen `NaN` porque en Excel era una **celda combinada**: el valor solo vive en la primera celda.
* Hay filas `Subtotal …` y una fila `TOTAL GENERAL` mezcladas con los registros.
* Algunas cifras están escritas como texto, por ejemplo `'1.204,9 M'`.

### Diagnóstico con código
Antes de corregir, cuantifica. Primero encuentra dónde empieza la tabla buscando la palabra *Ciudad*: así el código funciona aunque el reporte cambie de posición.
"""),
        code('''
fila_enc = reporte.index[reporte.eq("Ciudad").any(axis=1)][0]
col_ciudad = reporte.columns[reporte.loc[fila_enc].eq("Ciudad")][0]
print(f"El encabezado está en la fila de Excel {fila_enc + 1}, columna {chr(65 + col_ciudad)}")

datos = reporte.iloc[fila_enc + 2:, col_ciudad:col_ciudad + 6].copy()
datos.columns = ["ciudad", "linea", "T1", "T2", "T3", "T4"]

es_subtotal = datos["linea"].astype(str).str.startswith(("Subtotal", "TOTAL"))
es_vacia = datos["linea"].isna()
valores = datos[["T1", "T2", "T3", "T4"]]
es_texto = valores.map(lambda v: isinstance(v, str))

print("Filas de subtotal o total:      ", es_subtotal.sum())
print("Filas vacías o de notas:        ", es_vacia.sum())
print("Celdas de ciudad vacías:        ", datos.loc[~es_subtotal & ~es_vacia, "ciudad"].isna().sum())
print("Cifras escritas como texto:     ", int(es_texto.values.sum()))
'''),
        md("""
### ¿Cuánto se equivoca una suma sobre el reporte?
Haz lo que haría alguien con prisa: seleccionar todas las cifras y sumarlas. Excel ignora el texto al sumar, así que la «suma de Excel» deja por fuera las celdas escritas como `'x,x M'` y, además, cuenta subtotales y total general como si fueran ventas.
"""),
        code('''
def a_numero(v):
    """Convierte '1.204,9 M' en 1204900000. Los números se dejan igual."""
    if isinstance(v, str):
        return float(v.replace(" M", "").replace(".", "").replace(",", ".")) * 1e6
    return v

suma_excel = valores[~es_texto].apply(pd.to_numeric, errors="coerce").sum().sum()
correcta = valores[~es_subtotal & ~es_vacia].map(a_numero).astype(float).sum().sum()

print("Suma «seleccionar todo» en Excel:", millones(suma_excel))
print("Suma correcta de los registros:  ", millones(correcta))
print(f"Error: la suma rápida infla el total {suma_excel / correcta:.1f} veces".replace(".", ","))
'''),
        code('''
comparacion = pd.DataFrame({
    "cálculo": ["Seleccionar todo y SUMA", "Solo registros, texto convertido"],
    "valor": [suma_excel, correcta]})
fig = px.bar(comparacion, x=comparacion["valor"] / 1e6, y="cálculo", orientation="h", text=comparacion["valor"].map(millones),
             color="cálculo", color_discrete_sequence=[MAGENTA, AZUL],
             title="La misma hoja, dos totales: el reporte invita a sumar subtotales")
fig.update_traces(textposition="outside", cliponaxis=False)
fig.update_layout(showlegend=False, xaxis_title=MM, yaxis_title="", height=280)
dar_aire(fig, suma_excel / 1e6)
fig.show()
'''),
        md("""
> **Brecha que corrige esta clave.** En auditorías de hojas reales casi todos los libros tienen errores, y muchos no están en las fórmulas sino en la estructura: rangos que no incluyen filas nuevas, subtotales que se suman otra vez, textos que parecen números.

## Parte B · Reconstruir la tabla ordenada
Una tabla ordenada (*tidy*) cumple tres reglas: cada columna es una variable, cada fila es un registro y cada tipo de registro va en su propia tabla. Vamos paso a paso. Junto a cada paso está su equivalente en Excel.
"""),
        md("**Paso 1 · Repetir la ciudad en cada fila.** En Excel: separar celdas, *Ir a especial › Celdas en blanco*, escribir `=` + la celda de arriba y `Ctrl+Enter`."),
        code('''
ordenada = datos.copy()
ordenada["ciudad"] = ordenada["ciudad"].ffill()
ordenada.head(8)
'''),
        md("**Paso 2 · Quitar lo que no es registro**: subtotales, total, filas en blanco y notas. En Excel: filtrar la columna *linea* y eliminar esas filas."),
        code('''
ordenada = ordenada[~es_subtotal & ~es_vacia]
print(len(ordenada), "filas: una por ciudad y línea")
'''),
        md("**Paso 3 · Convertir el texto en número.** En Excel: `=VALOR(SUSTITUIR(...))` o, mejor, corregirlo en la fuente (clave 2)."),
        code('''
for t in ["T1", "T2", "T3", "T4"]:
    ordenada[t] = ordenada[t].map(a_numero).astype(float)
ordenada.head()
'''),
        md("""
**Paso 4 · Llevar la variable *trimestre* a una columna.** T1…T4 son valores, no variables. En Excel esto se hace con Power Query: *Anular dinamización de columnas*. En pandas, `melt`.
"""),
        code('''
ordenada = ordenada.melt(id_vars=["ciudad", "linea"], var_name="trimestre", value_name="subtotal")
ordenada = ordenada.sort_values(["ciudad", "linea", "trimestre"]).reset_index(drop=True)
print(ordenada.shape)
ordenada.head(10)
'''),
        md("""
Ahora la tabla tiene cuatro columnas y ninguna ambigüedad. Con ella cualquier pregunta es una línea de código, o una tabla dinámica en Excel. Por ejemplo, la venta por trimestre de cada ciudad:
"""),
        code('''
por_trim = ordenada.groupby(["trimestre", "ciudad"], as_index=False)["subtotal"].sum()
orden_ciudades = ordenada.groupby("ciudad")["subtotal"].sum().sort_values(ascending=False).index
fig = px.line(por_trim, x="trimestre", y=por_trim["subtotal"] / 1e6, color="ciudad", markers=True,
              category_orders={"ciudad": list(orden_ciudades)},
              color_discrete_sequence=[AZUL, TEAL, MAGENTA, "#7A5AC8", "#3E8E5E", "#B07A1E"],
              title="Venta neta 2025 por trimestre y ciudad")
fig.update_layout(yaxis_title=MM, xaxis_title="", legend_title="")
fig.show()
'''),
        md("""
### Comprobar contra la fuente
Un analista no confía en un reporte: lo cuadra contra la base. Compara la tabla reconstruida con `ventas.csv` (2025, sin anuladas). Las únicas diferencias deberían ser las cifras que el reporte escribió como texto redondeado a un decimal de millón.
"""),
        code('''
ventas = pd.read_csv(ruta("ventas.csv"), parse_dates=["fecha"])
productos = pd.read_csv(ruta("productos.csv"))
sedes = pd.read_csv(ruta("sedes.csv"))

fuente = (ventas[(ventas.estado != "Anulada") & (ventas.fecha.dt.year == 2025)]
          .merge(productos[["sku", "categoria"]], on="sku")
          .merge(sedes[["id_sede", "ciudad"]], on="id_sede")
          .assign(trimestre=lambda d: "T" + d.fecha.dt.quarter.astype(str))
          .groupby(["ciudad", "categoria", "trimestre"], as_index=False)["subtotal"].sum()
          .rename(columns={"categoria": "linea", "subtotal": "subtotal_fuente"}))

cuadre = ordenada.merge(fuente, on=["ciudad", "linea", "trimestre"], how="outer", indicator=True)
cuadre["diferencia"] = cuadre["subtotal"] - cuadre["subtotal_fuente"]
print("Filas que cuadran exacto:", (cuadre["diferencia"] == 0).sum(), "de", len(cuadre))
print("Diferencia máxima:", pesos(cuadre["diferencia"].abs().max()))
cuadre[cuadre["diferencia"] != 0].head()
'''),
        md("""
Las diferencias existen y son pequeñas, pero son **información perdida**: nadie puede recuperar los pesos exactos de una celda que alguien escribió como «1.204,9 M». Esa es la razón para no escribir cifras como texto.

## Parte C · Diagnóstico de calidad de una base
Antes de analizar cualquier base, revisa su forma. Estas son las preguntas que debes hacerte siempre, con su respuesta en código.
"""),
        code('''
print("Filas y columnas:", ventas.shape)
print("\\nTipos de dato:")
print(ventas.dtypes.to_string())
'''),
        code('''
revision = pd.Series({
    "Celdas vacías": int(ventas.isna().sum().sum()),
    "Filas duplicadas": int(ventas.duplicated().sum()),
    "id_linea repetidos": int(ventas["id_linea"].duplicated().sum()),
    "Fecha mínima": ventas["fecha"].min().date(),
    "Fecha máxima": ventas["fecha"].max().date(),
    "Cantidades <= 0": int((ventas["cantidad"] <= 0).sum()),
    "subtotal ≠ bruto − descuento": int((ventas["subtotal"] != ventas["valor_bruto"] - ventas["valor_descuento"]).sum()),
    "total ≠ subtotal + iva": int((ventas["total"] != ventas["subtotal"] + ventas["iva"]).sum()),
})
revision.to_frame("resultado")
'''),
        md("""
La base pasa las pruebas de forma. Pero la calidad también es de **significado**: la columna `estado` tiene facturas anuladas que no son venta. Ninguna prueba automática lo detecta; lo detecta quien lee el diccionario de datos.
"""),
        code('''
ventas["estado"].value_counts().to_frame("líneas")
'''),
        code('''
validas = ventas[ventas["estado"] != "Anulada"]
mensual = (validas.assign(anio=validas.fecha.dt.year.astype(str), mes=validas.fecha.dt.month)
           .groupby(["anio", "mes"], as_index=False)["subtotal"].sum())
fig = px.line(mensual, x="mes", y=mensual["subtotal"] / 1e6, color="anio", markers=True,
              color_discrete_map={"2024": GRIS, "2025": AZUL},
              title="Venta neta mensual: temporada escolar, bache de mitad de año y cierre de presupuestos")
fig.update_xaxes(tickmode="array", tickvals=list(range(1, 13)), ticktext=MESES, title="")
fig.update_layout(yaxis_title=MM, legend_title="")
fig.show()
'''),
        md("## Retos\nResuelve cada reto con lo que aprendiste. Escribe tu código en la celda gris y ejecuta *Comprobar*."),
        *reto(1, "¿Cuántas filas tiene la tabla `ordenada`? Explica por qué ese número tiene sentido (ciudades × líneas × trimestres).",
              "`len(ordenada)`.",
              "comprobar(respuesta_1, ordenada['ciudad'].nunique() * ordenada['linea'].nunique() * 4, unidad=' filas')",
              "respuesta_1 = len(ordenada)\nprint(respuesta_1, '=', ordenada['ciudad'].nunique(), 'ciudades ×', ordenada['linea'].nunique(), 'líneas × 4 trimestres')"),
        *reto(2, "Desde `ventas.csv` calcula la venta neta (subtotal) de **Medellín**, línea **Tecnología**, en el **tercer trimestre de 2025**, sin anuladas.",
              "Une ventas con productos y sedes como en *Comprobar contra la fuente*, o filtra la tabla `fuente`.",
              "esp = fuente.query(\"ciudad == 'Medellín' and linea == 'Tecnología' and trimestre == 'T3'\")['subtotal_fuente'].iloc[0]\ncomprobar(respuesta_2, esp)",
              "respuesta_2 = fuente.query(\"ciudad == 'Medellín' and linea == 'Tecnología' and trimestre == 'T3'\")['subtotal_fuente'].iloc[0]\nprint(pesos(respuesta_2))"),
        *reto(3, "¿Cuántas **líneas** de venta están anuladas en toda la base?",
              "`value_counts()` o una comparación con `==`.",
              "comprobar(respuesta_3, int((ventas['estado'] == 'Anulada').sum()), unidad=' líneas')",
              "respuesta_3 = int((ventas['estado'] == 'Anulada').sum())\nprint(respuesta_3)"),
        tip_ia("Cuando recibas un reporte con otra forma, pídele a una IA que te ayude a escribir la reconstrucción. Dale la estructura, no los datos completos:",
               """Tengo en pandas un DataFrame leído de Excel con header=None. Así se ven sus primeras 12 filas:
[pega aquí reporte.head(12).to_string()]
Escribe código pandas que: (1) encuentre la fila de encabezados buscando el texto "Ciudad",
(2) rellene hacia abajo las celdas combinadas, (3) elimine subtotales y filas vacías,
(4) convierta textos como "1.204,9 M" en números y (5) use melt para dejar una columna "trimestre".
Explica cada paso con un comentario y su equivalente en Excel."""),
        md(f"""
## Resumen
* Un reporte sirve para leer; una tabla ordenada sirve para analizar. No los mezcles.
* Celdas combinadas, subtotales, filas vacías y números como texto producen errores **silenciosos**.
* Cuadra siempre un resultado contra su fuente.

**Siguiente:** [Clave 5 · Buscar y cruzar sin #N/D]({PAGES}#clave-05) · [Cuaderno 05](https://colab.research.google.com/github/{REPO}/blob/main/notebooks/05_busqueda_y_cruce.ipynb)

<sub>Dr. Bits · ADNBITS S.A.S. · Contenido CC BY-SA 4.0 · Datos ficticios de Distribuidora Andina S.A.S.</sub>
"""),
    ]
    return c


# ============================================================================
# CLAVE 5
# ============================================================================
def cuaderno_05():
    c = [
        encabezado(5, "Buscar y cruzar sin #N/D", "BUSCARX, INDICE+COINCIDIR y su equivalente en pandas", 60, [
            "Cruzar una exportación de ERP con el maestro de clientes.",
            "Medir la tasa de cruce y clasificar por qué falla cada fila.",
            "Normalizar llaves y separar los huérfanos que no se arreglan con fórmulas.",
            "Evitar que un maestro con duplicados multiplique filas."],
            "05_busqueda_y_cruce.ipynb"),
        md("""
## Excel y Python, lado a lado

| En Excel | En pandas | Nota |
|---|---|---|
| `BUSCARX(llave; tClientes[id_cliente]; tClientes[segmento])` | `erp["llave"].map(clientes.set_index("id_cliente")["segmento"])` | Trae una columna |
| Varias columnas con BUSCARX | `erp.merge(clientes, how="left", ...)` | Trae varias columnas a la vez |
| `"No encontrado"` en el 4.º argumento | `indicator=True` → `left_only` | Marca lo que no cruzó |
| `ESPACIOS(...)` | `.str.strip()` | Python también quita el carácter 160 |
| Excel no distingue mayúsculas | pandas **sí** las distingue | Normaliza con `.str.upper()` |
"""),
        code(PREPARACION, oculto=True),
        md("""
## Parte A · Conocer las dos tablas
La exportación del ERP trae el código del cliente, pero no su **segmento** ni sus **días de crédito**, que viven en el maestro `clientes.csv`. La leemos toda como texto (`dtype=str`) para ver los datos exactamente como llegaron.
"""),
        code('''
erp = pd.read_csv(ruta("ventas_erp_sucio.csv"), dtype=str, keep_default_na=False)
clientes = pd.read_csv(ruta("clientes.csv"))
print("ERP:", erp.shape, "| Maestro:", clientes.shape)
erp.head(8)
'''),
        md("""
En pantalla `C-0129` y `C-0129 ` se ven iguales. Para ver lo que hay de verdad, usa `repr` (muestra comillas y espacios) y mide la longitud. Un código válido tiene 6 caracteres. Es lo mismo que hacer `=LARGO(A2)` en Excel.
"""),
        code('''
erp["Cod Cliente"].str.len().value_counts().rename_axis("caracteres").to_frame("filas")
'''),
        code('''
raros = erp.loc[erp["Cod Cliente"].str.len() != 6, "Cod Cliente"]
raros.head(6).map(repr)
'''),
        md("""
## Parte B · El cruce ingenuo
Primero crúzalas tal como vienen. `how="left"` conserva todas las filas del ERP (como una columna de BUSCARX al lado de tus datos) e `indicator=True` agrega la columna `_merge`, que dice si cada fila encontró pareja.
"""),
        code('''
maestro = clientes[["id_cliente", "segmento", "dias_credito"]]
ingenuo = erp.merge(maestro, left_on="Cod Cliente", right_on="id_cliente", how="left", indicator=True)
tasa_antes = (ingenuo["_merge"] == "both").mean()
print("Tasa de cruce sin limpiar:", porc(tasa_antes))
ingenuo["_merge"].value_counts().to_frame("filas")
'''),
        md("""
### ¿Por qué falla cada fila?
Un #N/D no es un diagnóstico. Clasifica cada fallo según qué lo arreglaría: así sabes si el problema es de formato (se corrige) o de datos maestros (se reporta).
"""),
        code('''
ids = set(clientes["id_cliente"])

def motivo(cod):
    if cod in ids:                       return "Cruza tal como viene"
    if cod.strip() in ids:               return "Espacios"
    if cod.upper() in ids:               return "Minúsculas"
    if cod.strip().upper() in ids:       return "Espacios y minúsculas"
    return "No existe en el maestro"

ingenuo["motivo"] = ingenuo["Cod Cliente"].map(motivo)
motivos = ingenuo["motivo"].value_counts().rename_axis("motivo").reset_index(name="filas")
motivos
'''),
        code('''
colores = {"Cruza tal como viene": AZUL, "Espacios": TEAL, "Minúsculas": TEAL,
           "Espacios y minúsculas": TEAL, "No existe en el maestro": MAGENTA}
fig = px.bar(motivos.sort_values("filas"), x="filas", y="motivo", orientation="h", text="filas",
             color="motivo", color_discrete_map=colores,
             title="Qué pasa con cada fila del ERP al buscarla en el maestro")
fig.update_traces(textposition="outside", cliponaxis=False)
fig.update_layout(showlegend=False, yaxis_title="", xaxis_title="Filas", height=330)
fig.show()
'''),
        md("""
> **Ojo con la diferencia entre herramientas.** En Excel, las filas con *Minúsculas* sí habrían cruzado: BUSCARX no distingue mayúsculas. En pandas no. Si migras un proceso de Excel a Python, el número de cruces puede cambiar sin que cambien los datos.

## Parte C · Normalizar la llave y cruzar bien
Crea una columna auxiliar con la llave limpia y no toques la original: así siempre puedes explicar qué transformaste. `validate="many_to_one"` le dice a pandas que el maestro debe tener cada código una sola vez; si no, se detiene con un error en vez de duplicar filas en silencio.
"""),
        code('''
erp["llave"] = erp["Cod Cliente"].str.strip().str.upper()
cruzado = erp.merge(maestro, left_on="llave", right_on="id_cliente", how="left",
                    indicator=True, validate="many_to_one")
tasa_despues = (cruzado["_merge"] == "both").mean()
print("Tasa de cruce:", porc(tasa_antes), "→", porc(tasa_despues))
'''),
        code('''
tasas = pd.DataFrame({"momento": ["Llave como viene", "Llave normalizada"],
                      "tasa": [tasa_antes, tasa_despues]})
fig = px.bar(tasas, x="momento", y="tasa", text=tasas["tasa"].map(lambda t: f"{t:.1%}".replace(".", ",")),
             color="momento", color_discrete_sequence=[GRIS, AZUL],
             title="Normalizar la llave antes de cruzar")
fig.update_traces(textposition="outside", cliponaxis=False)
fig.update_layout(showlegend=False, yaxis_tickformat=".0%", yaxis_range=[0, 1.1], xaxis_title="", yaxis_title="Filas cruzadas", height=360)
fig.show()
'''),
        md("""
### Los huérfanos se reportan, no se fuerzan
Lo que sigue sin cruzar son códigos que **no existen** en el maestro: clientes creados en el ERP que nadie registró en el maestro. Ninguna fórmula lo arregla. El entregable correcto es una lista para quien administra los datos maestros.
"""),
        code('''
huerfanos = (cruzado[cruzado["_merge"] == "left_only"]
             .groupby("llave").agg(filas=("Factura", "size"), primera_factura=("Factura", "min"))
             .reset_index())
huerfanos.to_csv("huerfanos_para_maestro.csv", index=False)
print(len(huerfanos), "códigos huérfanos guardados en huerfanos_para_maestro.csv (panel de archivos de Colab)")
huerfanos.head()
'''),
        md("""
### `map`: el BUSCARX de pandas
Si solo necesitas **una** columna, `map` con una serie indexada por la llave hace exactamente lo que hace BUSCARX: busca cada llave y devuelve el valor, o `NaN` si no la encuentra.
"""),
        code('''
segmento_por_id = clientes.set_index("id_cliente")["segmento"]
erp["segmento"] = erp["llave"].map(segmento_por_id).fillna("No encontrado")
erp[["Factura", "Cod Cliente", "llave", "segmento"]].head(8)
'''),
        md("""
## Parte D · El riesgo del maestro duplicado
Si un código aparece dos veces en el maestro, BUSCARX devuelve la primera coincidencia **sin avisar**. En pandas el problema es otro: `merge` repite la fila del ERP una vez por cada coincidencia y los totales se inflan. Simulémoslo duplicando en el maestro al cliente que más compra.
"""),
        code('''
frecuente = erp["llave"].value_counts().index[0]          # el cliente con más líneas en el ERP
dup = clientes[clientes["id_cliente"] == frecuente].assign(razon_social="Registro duplicado S.A.S.")
print("Duplicamos en el maestro al cliente", frecuente)
maestro_dup = pd.concat([clientes, dup])[["id_cliente", "segmento", "dias_credito"]]

malo = erp.merge(maestro_dup, left_on="llave", right_on="id_cliente", how="left")
print("Filas del ERP:", len(erp), "→ después del merge:", len(malo))

try:
    erp.merge(maestro_dup, left_on="llave", right_on="id_cliente", how="left", validate="many_to_one")
except pd.errors.MergeError as e:
    print("\\nCon validate, pandas se detiene a tiempo:\\n", e)
'''),
        md("""
En Excel la prevención equivalente es comprobar que la llave del maestro es única antes de cruzar: `=CONTAR.SI(tClientes[id_cliente];[@id_cliente])>1` en una columna auxiliar, o *Formato condicional › Valores duplicados*.

## Parte E · De vuelta al análisis
Con la llave resuelta, termina de preparar la exportación: elimina duplicados exactos (filas exportadas dos veces) y convierte el valor a número (es la clave 2). Luego responde la pregunta de negocio: ¿cuánto vende cada segmento?
"""),
        code('''
def a_pesos(texto):
    """'$ 1.234.567' → 1234567 ; '' → NaN"""
    limpio = texto.replace("$", "").replace(".", "").strip()
    return float(limpio) if limpio else np.nan

print("Líneas exportadas dos veces:", cruzado.duplicated(subset=["Linea"]).sum())
final = (cruzado.drop_duplicates(subset=["Linea"])
               .assign(valor=lambda d: d["Valor Neto"].map(a_pesos))
               .query("Estado != 'Anulada' and _merge == 'both'"))
por_segmento = final.groupby("segmento", as_index=False)["valor"].sum().sort_values("valor")
fig = px.bar(por_segmento, x=por_segmento["valor"] / 1e6, y="segmento", orientation="h", text=por_segmento["valor"].map(millones),
             color_discrete_sequence=[AZUL], title="Venta neta de la exportación por segmento (después del cruce)")
fig.update_traces(textposition="outside", cliponaxis=False)
fig.update_layout(xaxis_title=MM, yaxis_title="", height=330)
dar_aire(fig, por_segmento["valor"].max() / 1e6)
fig.show()
'''),
        md("## Retos"),
        *reto(1, "Después de normalizar la llave, ¿qué porcentaje de filas del ERP cruzó? Escríbelo como número con un decimal (por ejemplo, `97.3`).",
              "`(cruzado['_merge'] == 'both').mean() * 100`.",
              "comprobar(respuesta_1, round(tasa_despues * 100, 1), tolerancia=0.05, unidad=' %')",
              "respuesta_1 = round((cruzado['_merge'] == 'both').mean() * 100, 1)\nprint(respuesta_1)"),
        *reto(2, "¿Cuántos códigos de cliente **distintos** no existen en el maestro?",
              "Filtra `left_only` y cuenta valores únicos de la llave.",
              "comprobar(respuesta_2, cruzado.loc[cruzado['_merge'] == 'left_only', 'llave'].nunique(), unidad=' códigos')",
              "respuesta_2 = cruzado.loc[cruzado['_merge'] == 'left_only', 'llave'].nunique()\nprint(respuesta_2)"),
        *reto(3, "¿Cuántas filas de la exportación original están repetidas exactamente (exportadas dos veces)?",
              "`erp_original.duplicated().sum()` sobre el archivo recién leído.",
              "comprobar(respuesta_3, int(pd.read_csv(ruta('ventas_erp_sucio.csv'), dtype=str, keep_default_na=False).duplicated().sum()), unidad=' filas')",
              "respuesta_3 = int(pd.read_csv(ruta('ventas_erp_sucio.csv'), dtype=str, keep_default_na=False).duplicated().sum())\nprint(respuesta_3)"),
        tip_ia("Cuando un cruce falle, pide un diagnóstico, no una fórmula nueva:",
               """Estoy cruzando dos tablas en pandas con merge(how="left", indicator=True).
La tasa de cruce es [X %]. Estos son 10 valores de la llave que no cruzaron, mostrados con repr():
[pega aquí la lista]
Y estos son 5 valores válidos del maestro: [pega aquí]
Clasifica las causas probables (espacios, mayúsculas, caracteres invisibles, ceros a la izquierda,
códigos inexistentes) y dame el código para comprobar cada una. No modifiques la columna original."""),
        md(f"""
## Resumen
* Un cruce no termina cuando la fórmula funciona: termina cuando sabes **cuántas filas cruzaron y por qué fallaron las demás**.
* Normaliza la llave en una columna auxiliar: espacios, carácter 160 y, en Python, mayúsculas.
* Los huérfanos se reportan. Un maestro con llaves duplicadas se corrige antes de cruzar.

**Siguiente:** [Clave 7 · Tablas dinámicas que responden preguntas]({PAGES}#clave-07) · [Cuaderno 07](https://colab.research.google.com/github/{REPO}/blob/main/notebooks/07_tablas_dinamicas.ipynb)

<sub>Dr. Bits · ADNBITS S.A.S. · Contenido CC BY-SA 4.0 · Datos ficticios de Distribuidora Andina S.A.S.</sub>
"""),
    ]
    return c


# ============================================================================
# CLAVE 7
# ============================================================================
def cuaderno_07():
    c = [
        encabezado(7, "Tablas dinámicas que responden preguntas", "pivot_table, crosstab y gráficas de análisis", 60, [
            "Convertir preguntas de negocio en filas, columnas, valores y filtros.",
            "Distinguir suma, recuento de líneas y recuento distinto de facturas.",
            "Calcular márgenes y participaciones sin errores de agregación.",
            "Comparar la venta real con las metas y redactar el hallazgo."],
            "07_tablas_dinamicas.ipynb"),
        md("""
## Excel y Python, lado a lado

| Tabla dinámica en Excel | En pandas |
|---|---|
| Filas, Columnas, Valores | `pd.pivot_table(df, index=..., columns=..., values=..., aggfunc=...)` |
| Filtro de informe | `df[condición]` antes de resumir |
| Recuento | `aggfunc="count"` (cuenta líneas) |
| Recuento distinto (Modelo de datos) | `aggfunc="nunique"` |
| Mostrar valores como › % del total de fila | `pd.crosstab(..., normalize="index")` |
| Totales generales | `margins=True` |
"""),
        code(PREPARACION, oculto=True),
        md("""
## Parte A · Armar el modelo
Una tabla dinámica en Excel trabaja sobre una sola tabla, o sobre el Modelo de datos con relaciones. En pandas unimos la venta con sus maestros, con `validate` para que ninguna unión multiplique filas (clave 5).
"""),
        code('''
ventas = pd.read_csv(ruta("ventas.csv"), parse_dates=["fecha"])
productos = pd.read_csv(ruta("productos.csv"))
clientes = pd.read_csv(ruta("clientes.csv"))
sedes = pd.read_csv(ruta("sedes.csv"))
metas = pd.read_csv(ruta("metas.csv"))

df = (ventas
      .merge(productos[["sku", "categoria"]], on="sku", validate="many_to_one")
      .merge(clientes[["id_cliente", "segmento"]], on="id_cliente", validate="many_to_one")
      .merge(sedes[["id_sede", "ciudad"]], on="id_sede", validate="many_to_one")
      .assign(anio=lambda d: d.fecha.dt.year, mes=lambda d: d.fecha.dt.month))
print(df.shape)
df.head(3)
'''),
        md("""
### El filtro que casi todos olvidan
Las facturas anuladas no son venta. Si la pregunta es comercial, se excluyen **antes** de resumir. Mira cuánto cambiaría el total si no lo haces.
"""),
        code('''
validas = df[df["estado"] != "Anulada"]
print("Venta neta con anuladas:", millones(df["subtotal"].sum()))
print("Venta neta sin anuladas:", millones(validas["subtotal"].sum()))
print("Diferencia:             ", millones(df["subtotal"].sum() - validas["subtotal"].sum()))
'''),
        md("""
## Parte B · Seis preguntas, seis tablas dinámicas
Cada pregunta sigue el mismo método: **escribe la pregunta → decide filtros, filas, columnas y valor → resume → grafica → redacta el hallazgo.** Son las mismas preguntas del simulador del tablero: los números deben coincidir.

### Pregunta 1 · ¿Qué ciudad vendió más en 2025?
Filtro: 2025. Filas: ciudad. Valor: suma de subtotal.
"""),
        code('''
p1 = (validas[validas["anio"] == 2025]
      .pivot_table(index="ciudad", values="subtotal", aggfunc="sum")
      .sort_values("subtotal", ascending=False))
p1["participación"] = p1["subtotal"] / p1["subtotal"].sum()
p1.style.format({"subtotal": pesos, "participación": "{:.1%}"})
'''),
        code('''
datos = p1.reset_index().sort_values("subtotal")
fig = px.bar(datos, x=datos["subtotal"] / 1e6, y="ciudad", orientation="h", text=datos["subtotal"].map(millones),
             color_discrete_sequence=[AZUL], title="Venta neta 2025 por ciudad")
fig.update_traces(textposition="outside", cliponaxis=False)
fig.update_layout(xaxis_title=MM, yaxis_title="", height=360)
dar_aire(fig, datos["subtotal"].max() / 1e6)
fig.show()
'''),
        md("""
### Pregunta 2 · ¿Cuánto creció cada ciudad de 2024 a 2025?
Filas: ciudad. Columnas: año. Valor: suma de subtotal. La variación se calcula **después** de resumir.
"""),
        code('''
p2 = validas.pivot_table(index="ciudad", columns="anio", values="subtotal", aggfunc="sum")
p2["variación"] = p2[2025] / p2[2024] - 1
p2 = p2.sort_values("variación", ascending=False)
p2.style.format({2024: pesos, 2025: pesos, "variación": "{:+.1%}"})
'''),
        code('''
largo = p2[[2024, 2025]].reset_index().melt(id_vars="ciudad", var_name="año", value_name="subtotal")
largo["año"] = largo["año"].astype(str)
largo["millones"] = largo["subtotal"] / 1e6
fig = px.bar(largo, x="ciudad", y="millones", color="año", barmode="group",
             color_discrete_map={"2024": GRIS, "2025": AZUL},
             category_orders={"ciudad": list(p2.index)},
             title="Venta neta por ciudad, 2024 frente a 2025 (ordenado por crecimiento)")
for i, (ciudad, fila) in enumerate(p2.iterrows()):
    fig.add_annotation(x=ciudad, y=max(fila[2024], fila[2025]) / 1e6, text=porc(fila["variación"], signo=True),
                       showarrow=False, yshift=12, font=dict(size=12, color="#11153A"))
fig.update_layout(yaxis_title=MM, xaxis_title="", legend_title="")
fig.show()
'''),
        md("""
### Pregunta 3 · ¿Qué línea deja más margen porcentual?
Aquí está el error más frecuente con porcentajes. El margen % de un grupo es **Σ margen ÷ Σ venta**. Promediar el margen % de cada línea da el mismo peso a un paquete de lápices que a un lote de portátiles.
"""),
        code('''
p3 = validas.groupby("categoria").agg(venta=("subtotal", "sum"), margen=("margen_bruto", "sum"))
p3["margen % correcto"] = p3["margen"] / p3["venta"]
p3["promedio de % (incorrecto)"] = (validas.assign(pct=validas["margen_bruto"] / validas["subtotal"])
                                    .groupby("categoria")["pct"].mean())
p3 = p3.sort_values("margen % correcto", ascending=False)
total_ok = validas["margen_bruto"].sum() / validas["subtotal"].sum()
total_mal = (validas["margen_bruto"] / validas["subtotal"]).mean()
print("Empresa: margen correcto", porc(total_ok), "| promedio de porcentajes", porc(total_mal))
p3.style.format({"venta": pesos, "margen": pesos, "margen % correcto": "{:.1%}", "promedio de % (incorrecto)": "{:.1%}"})
'''),
        code('''
datos = p3.reset_index().sort_values("margen % correcto")
fig = px.bar(datos, x="margen % correcto", y="categoria", orientation="h",
             text=datos["margen % correcto"].map(lambda v: f"{v:.1%}".replace(".", ",")),
             color_discrete_sequence=[TEAL], title="Margen bruto % por línea (Σ margen ÷ Σ venta)")
fig.update_traces(textposition="outside", cliponaxis=False)
fig.update_layout(xaxis_tickformat=".0%", xaxis_title="", yaxis_title="", height=330)
dar_aire(fig, datos["margen % correcto"].max())
fig.show()
'''),
        md("""
Tecnología es la línea que más vende y la que menos margen deja. Esa tensión entre volumen y rentabilidad es un hallazgo que vale la pena llevar a un informe.

### Pregunta 4 · ¿El e-commerce ganó participación?
Filas: año. Columnas: canal. Mostrar valores como **% del total de fila**. En pandas: `crosstab` con `normalize="index"`.
"""),
        code('''
p4 = pd.crosstab(validas["anio"], validas["canal"], values=validas["subtotal"], aggfunc="sum", normalize="index")
p4 = p4[["Presencial", "Televentas", "E-commerce"]]
p4.style.format("{:.1%}")
'''),
        code('''
largo = p4.reset_index().melt(id_vars="anio", var_name="canal", value_name="participación")
largo["anio"] = largo["anio"].astype(str)
fig = px.bar(largo, y="anio", x="participación", color="canal", orientation="h",
             text=largo["participación"].map(lambda v: f"{v:.0%}"),
             color_discrete_sequence=[AZUL, TEAL, MAGENTA],
             title="Participación de cada canal en la venta neta")
fig.update_traces(marker_line_color="white", marker_line_width=2, insidetextanchor="middle")
fig.update_layout(barmode="stack", xaxis_tickformat=".0%", yaxis_title="", xaxis_title="",
                  legend_title="", height=300, yaxis=dict(autorange="reversed"))
fig.show()
'''),
        md("""
### Pregunta 5 · ¿Cuántas facturas emitió cada sede?
Cada fila de la base es una **línea** de factura. Contar `id_factura` cuenta líneas; para facturas necesitas el recuento distinto (`nunique`). Y fíjate: los recuentos distintos de cada fila **no se suman** para obtener el total.
"""),
        code('''
p5 = validas.pivot_table(index="ciudad", values="id_factura", aggfunc=["count", "nunique"])
p5.columns = ["líneas (count)", "facturas (nunique)"]
p5["productos por factura"] = p5["líneas (count)"] / p5["facturas (nunique)"]
print("Facturas en toda la empresa:", validas["id_factura"].nunique(),
      "| suma de la columna facturas:", p5["facturas (nunique)"].sum())
p5.sort_values("facturas (nunique)", ascending=False).style.format({"productos por factura": "{:.2f}"})
'''),
        md("""
Aquí la suma coincide con el total porque cada factura pertenece a una sola sede. Repite el ejercicio con `index="categoria"` y verás que ya no: una factura puede tener productos de varias líneas.

### Pregunta 6 · ¿En qué meses y ciudades se concentra la venta?
Una tabla dinámica de dos dimensiones se lee mejor como **mapa de calor**: el color hace visible la estacionalidad.
"""),
        code('''
p6 = (validas[validas["anio"] == 2025]
      .pivot_table(index="ciudad", columns="mes", values="subtotal", aggfunc="sum")
      .loc[p1.index])
fig = px.imshow(p6 / 1e6, x=MESES, y=p6.index, aspect="auto", text_auto=".0f",
                color_continuous_scale=["#EEF2FF", "#9AA8F0", "#4A5AD8", "#00006A"],
                title="Venta neta 2025 por ciudad y mes (millones de pesos)")
fig.update_layout(coloraxis_colorbar_title="M$", xaxis_title="", yaxis_title="", height=380)
fig.show()
'''),
        md("""
## Parte C · Real contra meta
Las metas viven en otra tabla, a nivel sede × año × mes. Para compararlas, resume la venta **al mismo nivel** y luego une. Unir la meta a cada línea de venta y sumar repetiría la meta miles de veces.
"""),
        code('''
real = (validas.groupby(["id_sede", "anio", "mes"], as_index=False)["subtotal"].sum())
comp = metas.merge(real, on=["id_sede", "anio", "mes"], how="left", validate="one_to_one")
anual = (comp[comp["anio"] == 2025].groupby("id_sede")[["meta_subtotal", "subtotal"]].sum()
         .join(sedes.set_index("id_sede")["ciudad"]))
anual["cumplimiento"] = anual["subtotal"] / anual["meta_subtotal"]
anual = anual.sort_values("cumplimiento", ascending=False)
anual.style.format({"meta_subtotal": pesos, "subtotal": pesos, "cumplimiento": "{:.1%}"})
'''),
        code('''
datos = anual.sort_values("cumplimiento")
colores = [TEAL if v >= 1 else MAGENTA for v in datos["cumplimiento"]]
fig = go.Figure(go.Bar(x=datos["cumplimiento"], y=datos["ciudad"], orientation="h", marker_color=colores,
                       text=[f"{v:.1%}".replace(".", ",") for v in datos["cumplimiento"]], textposition="outside",
                       cliponaxis=False))
fig.add_vline(x=1, line_dash="dot", line_color="#11153A", annotation_text="Meta 100 %", annotation_position="top")
fig.update_layout(title="Cumplimiento de la meta anual 2025 por sede", xaxis_tickformat=".0%",
                  xaxis_range=[0.8, max(1.15, datos["cumplimiento"].max() + 0.05)], height=360, yaxis_title="")
fig.show()
'''),
        md("""
Las barras en teal cumplieron; las magenta no. El color de estado va siempre con el número escrito, para que el gráfico se entienda también impreso en blanco y negro.

## Parte D · Del resultado al informe
Una tabla dinámica no es un informe. El informe es la frase que alguien puede leer en diez segundos. Usa esta estructura:

1. **Hallazgo con cifra:** qué pasó y cuánto.
2. **Comparación:** contra qué (año anterior, meta, otra sede).
3. **Pregunta siguiente:** qué hay que investigar para decidir.
"""),
        code('''
mejor, peor = anual.iloc[0], anual.iloc[-1]
print(f"1. En 2025 la empresa vendió {millones(validas.loc[validas.anio == 2025, 'subtotal'].sum())} netos, "
      f"{porc(p2[2025].sum() / p2[2024].sum() - 1, signo=True)} frente a 2024.")
print(f"2. {mejor['ciudad']} superó su meta ({porc(mejor['cumplimiento'])}) y {peor['ciudad']} quedó en {porc(peor['cumplimiento'])}.")
print(f"3. Tecnología concentra la venta pero deja el menor margen ({porc(p3.loc['Tecnología', 'margen % correcto'])}): "
      "¿conviene revisar su política de descuentos?")
'''),
        md("## Retos"),
        *reto(1, "¿Qué participación tuvo el **e-commerce** en la venta neta de **2025**? Escríbela en porcentaje con un decimal (por ejemplo, `18.4`).",
              "Usa la tabla `p4` o calcula tú mismo la suma del canal entre la suma total de 2025.",
              "comprobar(respuesta_1, round(p4.loc[2025, 'E-commerce'] * 100, 1), tolerancia=0.05, unidad=' %')",
              "v25 = validas[validas.anio == 2025]\nrespuesta_1 = round(v25.loc[v25.canal == 'E-commerce', 'subtotal'].sum() / v25['subtotal'].sum() * 100, 1)\nprint(respuesta_1)"),
        *reto(2, "¿Qué ciudad tuvo el **mayor cumplimiento** de meta en 2025? Escribe el nombre como texto, por ejemplo `'Cali'`.",
              "Ordena `anual` por cumplimiento.",
              "comprobar(respuesta_2, anual.sort_values('cumplimiento').iloc[-1]['ciudad'])",
              "respuesta_2 = anual.sort_values('cumplimiento').iloc[-1]['ciudad']\nprint(respuesta_2)"),
        *reto(3, "¿Cuál fue el margen bruto % de **Tecnología** en **2025**, bien calculado? Escríbelo con un decimal (por ejemplo, `11.2`).",
              "Σ margen_bruto ÷ Σ subtotal, solo 2025, solo Tecnología, sin anuladas.",
              "t = validas[(validas.anio == 2025) & (validas.categoria == 'Tecnología')]\ncomprobar(respuesta_3, round(t['margen_bruto'].sum() / t['subtotal'].sum() * 100, 1), tolerancia=0.05, unidad=' %')",
              "t = validas[(validas.anio == 2025) & (validas.categoria == 'Tecnología')]\nrespuesta_3 = round(t['margen_bruto'].sum() / t['subtotal'].sum() * 100, 1)\nprint(respuesta_3)"),
        tip_ia("La IA es buena para convertir una pregunta de negocio en la configuración de una tabla dinámica, y para revisar si tu interpretación se sostiene:",
               """Tengo un DataFrame de pandas llamado validas con estas columnas:
fecha, id_factura, ciudad, categoria, segmento, canal, subtotal, margen_bruto, estado, anio, mes.
Cada fila es una línea de factura y ya excluí las anuladas.
Pregunta de negocio: "[escribe tu pregunta]".
1. Dime qué va en index, columns, values y aggfunc de pivot_table, y por qué.
2. Señala qué error de agregación debo evitar (conteo de líneas vs facturas, promedio de porcentajes).
3. Propón el gráfico más adecuado y por qué.
No inventes resultados: solo dame el código y el razonamiento."""),
        md(f"""
## Resumen
* Primero la pregunta, después la tabla dinámica.
* Filtra lo que no es venta. Cuenta facturas con recuento distinto. Calcula porcentajes como razón de sumas.
* Resume al mismo nivel antes de comparar tablas con distinto detalle (venta contra meta).
* Cierra con una frase que tenga cifra, comparación y siguiente pregunta.

**Siguiente:** vuelve al [tablero]({PAGES}#ruta) para ver la ruta completa de las 12 claves.

<sub>Dr. Bits · ADNBITS S.A.S. · Contenido CC BY-SA 4.0 · Datos ficticios de Distribuidora Andina S.A.S.</sub>
"""),
    ]
    return c


def escribir(nombre, celdas):
    nb = nbf.v4.new_notebook()
    nb.cells = celdas
    nb.metadata = {
        "kernelspec": {"name": "python3", "display_name": "Python 3"},
        "language_info": {"name": "python"},
        "colab": {"provenance": [], "toc_visible": True},
    }
    ruta = RAIZ / "notebooks" / nombre
    nbf.write(nb, ruta)
    print("escrito", ruta.name, f"({len(celdas)} celdas)")


if __name__ == "__main__":
    escribir("01_estructura_y_tablas.ipynb", cuaderno_01())
    escribir("05_busqueda_y_cruce.ipynb", cuaderno_05())
    escribir("07_tablas_dinamicas.ipynb", cuaderno_07())
