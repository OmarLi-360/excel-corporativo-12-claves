"""Cuadernos de las claves 6 y 8 (Análisis) y 9 (Control y comunicación), enfoque visual."""
import numpy as np
import pandas as pd

from .comun import PAGES, PREPARACION, RAIZ, cierre, code, colab, datos, encabezado, ficha, md, reto, tip_ia

# Lógica de limpieza compartida: se ejecuta al construir (para calcular las opciones de los retos)
# y se copia tal cual en el cuaderno 08, así ambas cifras son siempre las mismas.
LIMPIEZA = '''
def problemas(t):
    cod = t["Cod Cliente"].astype(str)
    return pd.Series({
        "Código con espacios o minúsculas": int((cod != cod.str.strip().str.upper()).sum()),
        "Monto escrito como texto": int(t["Valor Neto"].map(lambda x: isinstance(x, str)).sum()),
        "Cantidad escrita como texto": int(t["Cantidad"].map(lambda x: isinstance(x, str)).sum()),
        "Fecha que no es fecha": int(t["Fecha"].map(lambda x: not isinstance(x, pd.Timestamp)).sum()),
        "Fila duplicada": int(t.duplicated().sum()),
    })

def a_fecha(s):
    s = str(s).strip()
    try:
        return pd.to_datetime(s, format="%d/%m/%Y")
    except ValueError:
        pass
    try:
        return pd.to_datetime(s, format="%Y-%m-%d")
    except ValueError:
        return pd.Timestamp("1899-12-30") + pd.Timedelta(days=int(float(s)))

def a_numero(x):
    if isinstance(x, str):
        x = x.replace("$", "").replace(".", "").replace("und", "").strip()
    return pd.to_numeric(x, errors="coerce")

PASOS = [
    ("Recortar y MAYÚSCULAS en Cod Cliente", lambda t: t.assign(**{"Cod Cliente": t["Cod Cliente"].astype(str).str.strip().str.upper()})),
    ("Limpiar Valor Neto ($ y puntos)",   lambda t: t.assign(**{"Valor Neto": t["Valor Neto"].map(a_numero)})),
    ("Limpiar Cantidad (quitar und)",            lambda t: t.assign(Cantidad=t["Cantidad"].map(a_numero))),
    ("Convertir Fecha (try … otherwise)",    lambda t: t.assign(Fecha=t["Fecha"].map(a_fecha))),
    ("Quitar duplicados",                    lambda t: t.drop_duplicates()),
]

def aplicar_pasos(origen, n=len(PASOS)):
    """Devuelve la tabla después de los primeros n pasos y la evolución de problemas y filas."""
    t = origen.copy()
    evolucion = [("Origen", problemas(t), len(t))]
    for nombre, paso in PASOS[:n]:
        t = paso(t)
        evolucion.append((nombre, problemas(t), len(t)))
    return t, evolucion
'''

NORMALIZAR = '''
import unicodedata
OFICIALES = sedes.ciudad.tolist()
ALIAS = {"bquilla": "Barranquilla", "santiago de cali": "Cali", "bogota dc": "Bogotá"}
def sin_tildes(s):
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")
def oficial(texto):
    clave = sin_tildes(str(texto)).lower().replace("/", "").replace(".", "").strip()
    for o in OFICIALES:
        if sin_tildes(o).lower() == clave:
            return o
    return ALIAS.get(clave, "Sin equivalencia")
'''


def _hoja_erp():
    return pd.read_excel(RAIZ / "data" / "Distribuidora_Andina_practica.xlsx", sheet_name="ERP_Sucio", dtype=object)


def _opciones_num(valor, otros):
    vals = sorted({valor, *[o for o in otros if o > 0 and o != valor]})
    return [f"{v:,}".replace(",", ".") for v in vals]


# ============================================================================
# 06 · Agregar con condiciones
# ============================================================================
def cuaderno_06():
    _, val, _, _ = datos()
    dic = val[(val.anio == 2025) & (val.mes == 12)]
    combos = dic.groupby(["ciudad", "canal"])["subtotal"].sum().sort_values(ascending=False)
    top = [f"{c} · {k}" for c, k in combos.index[:4]]
    return [
        encabezado("Clave 6", "Agregar con condiciones", "SUMAR.SI.CONJUNTO y sus hermanas", 30, [
            "Ver el informe mensual sede × canal que se arma con una sola fórmula.",
            "Comprobar que el informe cuadra con una tabla dinámica.",
            "Comparar lo que responden SUMAR, CONTAR y PROMEDIO con las mismas condiciones."],
            "06_agregar_con_condiciones.ipynb", "clave-06"),
        code(PREPARACION),
        md("""
## 1 · El informe mensual de formato fijo
La hoja **Informe_Mensual** de `Andina_listo_para_dinamicas.xlsx` tiene las sedes en filas, los canales en columnas y el año y el mes en dos celdas (G1 y G2). Cada celda amarilla lleva la misma fórmula:

`=SUMAR.SI.CONJUNTO(tVentas[subtotal];tVentas[ciudad];$A5;tVentas[canal];B$4;tVentas[anio];$G$1;tVentas[mes];$G$2;tVentas[estado];"<>Anulada")`

Aquí ves ese mismo informe. Elige el año y el mes en la lista de la derecha, como si los escribieras en G1 y G2.
"""),
        ficha("¿Cuánto vendió cada sede por cada canal en el mes elegido?", "Mapa de calor: sedes × canales, en millones de pesos",
              "Es una tabla de doble entrada: el color guía la vista hacia las celdas grandes sin perder el número exacto.",
              "Barras agrupadas: con 18 barras la comparación se vuelve difícil de leer.",
              "Las filas oscuras son las sedes grandes; compara los canales dentro de cada fila.",
              "Hoja Informe_Mensual: la fórmula de B5 copiada a B5:D10, más totales en la columna E y la fila 11."),
        code('''
# @title Gráfico 1 · Informe mensual sede × canal
anio = 2025  # @param [2024, 2025]
mes = 12  # @param {type:"slider", min:1, max:12, step:1}
periodo = validas[(validas.anio == anio) & (validas.mes == mes)]
informe = (periodo.pivot_table(index="ciudad", columns="canal", values="subtotal", aggfunc="sum", fill_value=0)
           .reindex(index=sedes.ciudad, columns=["Presencial", "Televentas", "E-commerce"], fill_value=0))
z = informe / 1e6
fig = go.Figure(go.Heatmap(z=z.values, x=z.columns, y=z.index, colorscale=[[0, "#EEF2FF"], [1, AZUL]], showscale=False,
                           text=[[f"{v:,.0f}".replace(",", ".") for v in fila] for fila in z.values], texttemplate="%{text}"))
fig.update_layout(title=f"Venta neta de {MESES[mes - 1].lower()} {anio}: {millones(informe.values.sum())}",
                  yaxis=dict(autorange="reversed"), height=380, xaxis_side="top")
fig.show()
'''),
        ficha("¿El informe cuadra con una tabla dinámica?", "Dos barras: total del informe (fórmulas) y total de la dinámica · Tercera barra: lo que daría sin el criterio de estado",
              "La comprobación es una igualdad: dos barras iguales se reconocen al instante, y la tercera muestra el error típico.",
              "Mostrar solo un ✓: no se ve qué pasa cuando falta el criterio.",
              "Las dos primeras barras deben medir lo mismo. La tercera es más larga porque suma facturas anuladas.",
              "Tabla dinámica con anio y mes en Filtros y estado distinto de Anulada; su total general debe ser igual a E11."),
        code('''
# @title Gráfico 2 · Cuadre contra la tabla dinámica
total_formulas = informe.values.sum()
total_dinamica = periodo["subtotal"].sum()
sin_estado = df[(df.anio == anio) & (df.mes == mes)]["subtotal"].sum()
comp = pd.Series({"Informe con fórmulas": total_formulas, "Tabla dinámica": total_dinamica,
                  "Fórmula sin criterio de estado": sin_estado}) / 1e6
fig = go.Figure(go.Bar(x=comp.values, y=comp.index, orientation="h", marker_color=[AZUL, TEAL, MAGENTA],
                       text=[f"$ {v:,.0f} M".replace(",", ".") for v in comp.values], textposition="outside", cliponaxis=False))
cuadra = abs(total_formulas - total_dinamica) < 1
fig.update_layout(title=("Cuadra" if cuadra else "No cuadra") + f": sin el criterio de estado se suman {millones(sin_estado - total_dinamica)} de anuladas",
                  xaxis_title=MM, height=280, yaxis=dict(autorange="reversed"))
dar_aire(fig, comp.max())
fig.show()
'''),
        md("""
## 2 · Las mismas condiciones, tres preguntas distintas
Con los mismos criterios (sede, año, mes, sin anuladas):
* **SUMAR.SI.CONJUNTO** responde *¿cuánto se vendió?*
* **CONTAR.SI.CONJUNTO** responde *¿cuántas líneas de venta hubo?* (no lleva rango de suma)
* **PROMEDIO.SI.CONJUNTO** responde *¿de cuánto es una línea típica?*

Una sede puede vender mucho por volumen (muchas líneas) o por valor (líneas grandes). Solo viendo las tres se sabe cuál es el caso.
"""),
        ficha("¿Cada sede vende por volumen o por valor?", "Tres paneles de barras por sede: suma, conteo y promedio por línea",
              "Paneles con el mismo orden de sedes permiten comparar las tres medidas fila por fila.",
              "Un solo gráfico con tres medidas: tienen escalas distintas (pesos, líneas, pesos por línea).",
              "Si una sede baja en el conteo pero sube en el promedio, vende menos veces pero más grande.",
              "En tres columnas nuevas: =SUMAR.SI.CONJUNTO(…), =CONTAR.SI.CONJUNTO(…) y =PROMEDIO.SI.CONJUNTO(…), con los mismos criterios."),
        code('''
# @title Gráfico 3 · Suma, conteo y promedio con las mismas condiciones
from plotly.subplots import make_subplots
por_sede = periodo.groupby("ciudad")["subtotal"].agg(["sum", "count", "mean"]).reindex(sedes.ciudad).fillna(0)
orden = por_sede.sort_values("sum").index
fig = make_subplots(rows=1, cols=3, shared_yaxes=True, horizontal_spacing=0.04,
                    subplot_titles=["SUMAR: millones", "CONTAR: líneas", "PROMEDIO: miles por línea"])
for i, (col, escala, color) in enumerate([("sum", 1e6, AZUL), ("count", 1, TEAL), ("mean", 1e3, MAGENTA)], start=1):
    s = por_sede.loc[orden, col] / escala
    fig.add_bar(x=s.values, y=list(orden), orientation="h", marker_color=color, showlegend=False,
                text=[f"{v:,.0f}".replace(",", ".") for v in s.values], textposition="inside", row=1, col=i)
mayor_prom = por_sede["mean"].idxmax()
fig.update_layout(title=f"{MESES[mes - 1]} {anio}: la línea promedio más alta está en {mayor_prom}", height=360)
fig.show()
'''),
        md("## 3 · Criterios de comparación"),
        ficha("¿Cuántas facturas superan un monto?", "Barras por sede: facturas por encima del límite elegido, en todo el año",
              "Pocas categorías y una medida: la barra es la forma más clara.",
              "Un histograma: responde otra pregunta (cómo se distribuyen los montos).",
              "Mueve el límite y observa qué sedes concentran las facturas grandes.",
              "=CONTAR.SI.CONJUNTO(tFacturas[total];\">\"&$G$3;tFacturas[ciudad];$A5), con el límite en G3."),
        code('''
# @title Gráfico 4 · Facturas por encima de un límite
limite = 20000000  # @param [5000000, 10000000, 20000000, 50000000]
facturas = validas[validas.anio == anio].groupby(["id_factura", "ciudad"], as_index=False)["subtotal"].sum()
grandes = facturas[facturas.subtotal > limite].groupby("ciudad").size().reindex(sedes.ciudad, fill_value=0).sort_values()
fig = go.Figure(go.Bar(x=grandes.values, y=grandes.index, orientation="h", marker_color=AZUL,
                       text=[miles(v) for v in grandes.values], textposition="outside", cliponaxis=False))
fig.update_layout(title=f"{miles(grandes.sum())} facturas de {anio} superan {pesos(limite)} (criterio \\">\\"&G3)",
                  xaxis_title="Facturas", height=320)
dar_aire(fig, max(grandes.max(), 1))
fig.show()
'''),
        md("## 4 · Retos de interpretación"),
        reto(1, "En diciembre de 2025, ¿qué combinación sede · canal vendió más?", top,
             '(lambda s: f"{s.index[0][0]} · {s.index[0][1]}")(validas[(validas.anio == 2025) & (validas.mes == 12)].groupby(["ciudad", "canal"])["subtotal"].sum().sort_values(ascending=False))',
             "Es la celda más oscura del mapa de calor con año 2025 y mes 12."),
        reto(2, "En el criterio de estado, ¿qué texto va entre comillas para excluir las facturas anuladas?",
             ["Anulada", "<>Anulada", "=Anulada", "No Anulada"],
             '"<>Anulada"', "<> significa «distinto de». Como lleva un operador, todo va entre comillas: \"<>Anulada\"."),
        reto(3, "Una sede tiene menos líneas que otra pero una venta parecida. ¿Qué se puede concluir?",
             ["Que vende líneas de mayor valor", "Que tiene más facturas anuladas", "Que la fórmula está mal", "Nada"],
             '"Que vende líneas de mayor valor"', "Si la suma es parecida con menos líneas, el promedio por línea es mayor: vende por valor, no por volumen."),
        tip_ia("Para pasar de una pregunta de negocio a la fórmula:",
               """Tengo en Excel 365 una Tabla tVentas (ciudad, canal, anio, mes, estado, subtotal).
Quiero la venta neta por sede (A5:A10) y canal (B4:D4) del año G1 y el mes G2, sin anuladas.
Escribe la fórmula de B5 en español (separador ;) para copiarla a toda la matriz, y explica cada $."""),
        cierre(["Una fórmula con criterios en celdas, copiada a toda la matriz, arma un informe que se actualiza solo.",
                "Cuadra siempre contra una tabla dinámica: un criterio olvidado no muestra error.",
                "SUMAR, CONTAR y PROMEDIO con las mismas condiciones cuentan historias distintas."],
               f"[Clave 7 · Tablas dinámicas]({PAGES}#clave-07) · [Cuaderno 07]({colab('07_tablas_dinamicas.ipynb')})"),
    ]


# ============================================================================
# 08 · Limpieza reproducible
# ============================================================================
def cuaderno_08():
    ns = {"pd": pd, "np": np}
    exec(LIMPIEZA, ns)
    limpio, evol = ns["aplicar_pasos"](_hoja_erp())
    dup = int(evol[0][1]["Fila duplicada"])
    nombres = [n for n, _ in ns["PASOS"]]
    return [
        encabezado("Clave 8", "Limpieza reproducible", "Power Query: los pasos quedan guardados", 30, [
            "Ver cómo cada paso de limpieza reduce los problemas de la exportación.",
            "Medir cuántas filas cambia cada paso.",
            "Estimar el tiempo que se ahorra cuando la limpieza se repite sola cada mes."],
            "08_limpieza_reproducible.ipynb", "clave-08"),
        code(PREPARACION),
        md("""
## 1 · Los pasos aplicados
En Power Query cada acción queda registrada como un paso. Este cuaderno aplica los mismos pasos que haces en Excel sobre la hoja **ERP_Sucio**, uno detrás de otro, para que veas qué arregla cada uno:

1. Recortar y MAYÚSCULAS en `Cod Cliente`.
2. Reemplazar «$» y «.» en `Valor Neto` y convertir a número.
3. Quitar « und» en `Cantidad` y convertir a número.
4. Convertir `Fecha` con `try Date.FromText([Fecha], "es-CO") otherwise Date.From(Number.From([Fecha]))`.
5. Quitar duplicados.

Elige cuántos pasos aplicar, como si activaras las casillas del panel **Pasos aplicados**.
"""),
        code("# @title Definir los pasos de limpieza (los mismos de Power Query)\n" + LIMPIEZA.strip() + '''
erp = pd.read_excel(ruta("Distribuidora_Andina_practica.xlsx"), sheet_name="ERP_Sucio", dtype=object)
display(Markdown(f"Hoja ERP_Sucio leída: **{miles(len(erp))} filas** y {erp.shape[1]} columnas."))
'''),
        ficha("¿Cuántos problemas quedan después de cada paso?", "Barras apiladas: problemas por tipo, desde el origen hasta el último paso aplicado",
              "Muestra el avance total y qué tipo de problema elimina cada paso.",
              "Una tabla de conteos por paso: el descenso no se ve.",
              "Cada paso borra un color. Con los cinco, la barra desaparece: la tabla quedó limpia.",
              "En el Editor de Power Query, haz clic en cada paso del panel Pasos aplicados y mira la vista previa."),
        code('''
# @title Gráfico 1 · Problemas que quedan después de cada paso
pasos_aplicados = 5  # @param {type:"slider", min:0, max:5, step:1}
limpio, evolucion = aplicar_pasos(erp, pasos_aplicados)
tabla = pd.DataFrame({n: p for n, p, _ in evolucion}).T
colores = [AZUL, MAGENTA, TEAL, "#7A86E8", GRIS]
fig = go.Figure()
for col, color in zip(tabla.columns, colores):
    fig.add_bar(name=col, y=tabla.index, x=tabla[col], orientation="h", marker_color=color, marker_line_color="white", marker_line_width=1)
quedan = int(tabla.iloc[-1].sum())
fig.update_layout(barmode="stack", height=320 + 30 * len(tabla), yaxis=dict(autorange="reversed"), xaxis_title="Celdas o filas con problema",
                  legend=dict(orientation="h", y=-0.25), title=f"Del origen a «{tabla.index[-1]}»: quedan {miles(quedan)} problemas")
fig.show()
'''),
        ficha("¿Cuántas filas toca cada paso?", "Barras: filas que cambian (o se quitan) en cada paso",
              "Muestra el trabajo que hace cada paso: es lo que harías a mano cada mes.",
              "Porcentajes: para estimar esfuerzo importa el número de filas.",
              "El paso más largo es el que más trabajo manual reemplaza.",
              "En Power Query: Inicio › Mantener filas o Ver › Perfil de columna para contar valores antes y después."),
        code('''
# @title Gráfico 2 · Filas que cambia cada paso
_, completo = aplicar_pasos(erp)
cambios = pd.Series({n: int(completo[i][1].sum() - completo[i + 1][1].sum()) for i, (n, _, _) in enumerate(completo[1:])})
cambios = cambios.sort_values()
fig = go.Figure(go.Bar(x=cambios.values, y=cambios.index, orientation="h", marker_color=AZUL,
                       text=[miles(v) for v in cambios.values], textposition="outside", cliponaxis=False))
mayores = cambios[cambios == cambios.max()].index.tolist()
fig.update_layout(title=f"«{cambios.idxmin()}» corrige {miles(cambios.min())} problemas; " + " y ".join(f"«{m}»" for m in mayores) + f", {miles(cambios.max())} cada uno",
                  xaxis_title="Problemas corregidos", height=320)
dar_aire(fig, cambios.max())
fig.show()
display(Markdown(f"Filas al final: **{miles(len(limpio))}** de {miles(len(erp))}. Las que faltan eran duplicadas."))
'''),
        md("## 2 · El valor de repetir"),
        ficha("¿Cuánto tiempo cuesta limpiar a mano frente a actualizar?", "Líneas: horas acumuladas en un año con limpieza manual y con Power Query",
              "Es una acumulación en el tiempo: las líneas muestran cuándo se recupera el tiempo invertido en armar la consulta.",
              "Una cifra de horas ahorradas: no se ve el punto en que la consulta empieza a pagar.",
              "Al principio Power Query cuesta más (armar la consulta). Desde el cruce de las líneas, todo es ahorro.",
              "Datos › Consultas y conexiones › clic derecho › Propiedades › Actualizar al abrir el archivo."),
        code('''
# @title Gráfico 3 · Horas acumuladas en un año
minutos_manual = 40  # @param {type:"slider", min:10, max:120, step:5}
veces_por_mes = 4  # @param [1, 2, 4, 20]
horas_armar_consulta = 3  # @param [1, 2, 3, 5]
meses = np.arange(0, 13)
manual = meses * veces_por_mes * minutos_manual / 60
pq = horas_armar_consulta + meses * veces_por_mes * 1 / 60
fig = go.Figure()
fig.add_scatter(x=meses, y=manual, name="Limpieza manual", line=dict(color=MAGENTA, width=3))
fig.add_scatter(x=meses, y=pq, name="Power Query (1 min por actualización)", line=dict(color=AZUL, width=3))
cruce = next((m for m in meses if manual[m] > pq[m]), None)
fig.update_layout(title=f"En un año: {manual[-1]:.0f} h a mano frente a {pq[-1]:.0f} h con Power Query"
                  + (f" · se recupera en el mes {cruce}" if cruce else ""),
                  xaxis_title="Meses", yaxis_title="Horas acumuladas", height=360, legend=dict(orientation="h", y=-0.2))
fig.show()
'''),
        md("## 3 · Retos de interpretación"),
        reto(1, "Según el gráfico 2, ¿qué paso corrige menos problemas?", nombres, "cambios.idxmin()",
             "Es la barra más corta del gráfico 2. Aun así, encontrar duplicados a mano es de lo más lento."),
        reto(2, "¿Cuántas filas duplicadas quita el último paso?", _opciones_num(dup, [dup // 2, dup + 27, dup * 2]),
             'miles(int(erp.duplicated().sum()))', "Es la diferencia entre las filas del origen y las del resultado."),
        reto(3, "Llega la exportación de febrero con los mismos defectos. ¿Qué haces en Excel?",
             ["Repetir los pasos uno por uno", "Reemplazar el origen y usar Datos › Actualizar todo", "Crear una consulta nueva", "Limpiar solo las filas nuevas"],
             '"Reemplazar el origen y usar Datos › Actualizar todo"', "Los pasos quedaron guardados en la consulta: Actualizar los repite sobre los datos nuevos."),
        tip_ia("Para entender un paso que no conoces:",
               """En Power Query de Excel 365 tengo este paso:
= Table.ReplaceValue(#"Texto recortado","$","",Replacer.ReplaceText,{"Valor Neto"})
Explícame qué hace en palabras simples, cómo se hace con los menús y por qué debe ir antes de cambiar el tipo a número."""),
        cierre(["Power Query guarda cada paso de limpieza; los datos originales no cambian.",
                "Borra el paso automático «Tipo cambiado» y fija los tipos al final.",
                "Lo que se repite cada mes se arma una vez y se actualiza con un clic."],
               f"[Clave 9 · Datos que se validan solos]({PAGES}#clave-09) · [Cuaderno 09]({colab('09_validacion_y_formato.ipynb')})"),
    ]


# ============================================================================
# 09 · Datos que se validan solos
# ============================================================================
def cuaderno_09():
    h = _hoja_erp()
    n_var = h["Ciudad"].nunique()
    return [
        encabezado("Clave 9", "Datos que se validan solos", "Validación de datos y formato condicional", 25, [
            "Ver cuántas formas distintas de escribir la misma ciudad llegan sin validación.",
            "Medir cómo se reparte mal la venta cuando las variantes no se corrigen.",
            "Usar una regla de formato condicional para que las excepciones salten a la vista."],
            "09_validacion_y_formato.ipynb", "clave-09"),
        code(PREPARACION),
        md("""
## 1 · Seis ciudades, muchas formas de escribirlas
La columna `Ciudad` de la hoja **ERP_Sucio** se escribe a mano en cada sede. Sin una lista desplegable, cada persona la escribe a su manera: con o sin tilde, en mayúsculas, con un espacio al final o abreviada.
"""),
        code("# @title Leer la hoja ERP_Sucio y la tabla de equivalencias\n" + NORMALIZAR.strip() + '''
erp = pd.read_excel(ruta("Distribuidora_Andina_practica.xlsx"), sheet_name="ERP_Sucio", dtype=object)
erp["Ciudad oficial"] = erp["Ciudad"].map(oficial)
erp["Valor"] = erp["Valor Neto"].map(lambda x: pd.to_numeric(x.replace("$", "").replace(".", "").strip()) if isinstance(x, str) else x).astype(float)
display(Markdown(f"Filas: **{miles(len(erp))}**. Formas distintas de escribir la ciudad: **{erp['Ciudad'].nunique()}**."))
'''),
        ficha("¿De cuántas formas llega escrita cada ciudad?", "Barras: filas por cada forma escrita, coloreadas por si coinciden con la lista oficial",
              "Ordenadas de mayor a menor, muestran que el problema no es raro: son cientos de filas.",
              "Una torta: con 16 porciones no se puede leer.",
              "Las barras azules son los nombres oficiales; las magenta son variantes que una lista desplegable habría impedido.",
              "Formato condicional con fórmula =CONTAR.SI(Ciudades;$F2)=0 sobre la columna Ciudad."),
        code('''
# @title Gráfico 1 · Formas de escribir la ciudad
formas = erp["Ciudad"].value_counts().sort_values()
etiquetas = [f"«{c}»".replace(" »", "·»") for c in formas.index]
colores = [AZUL if c in OFICIALES else MAGENTA for c in formas.index]
fig = go.Figure(go.Bar(x=formas.values, y=etiquetas, orientation="h", marker_color=colores,
                       text=[miles(v) for v in formas.values], textposition="outside", cliponaxis=False))
variantes = formas[[c not in OFICIALES for c in formas.index]]
fig.update_layout(title=f"{len(formas)} formas de escribir {len(OFICIALES)} ciudades · {miles(variantes.sum())} filas con variantes",
                  xaxis_title="Filas", height=520)
dar_aire(fig, formas.max())
fig.show()
display(Markdown("El punto (·) antes de las comillas de cierre marca un espacio al final, invisible en Excel."))
'''),
        ficha("¿Cuánta venta se le asigna mal a cada ciudad sin corregir las variantes?", "Barras agrupadas por ciudad: venta con el nombre exacto frente a venta después de normalizar",
              "La diferencia entre las dos barras de cada ciudad es la venta que una tabla dinámica pone en otra fila.",
              "Solo la venta normalizada: no se ve el tamaño del error.",
              "Donde la barra magenta es más corta, la ciudad aparece con menos venta de la real en un informe sin limpieza.",
              "Tabla dinámica de ERP_Sucio con Ciudad en Filas: cuenta las filas que aparecen."),
        code('''
# @title Gráfico 2 · Venta por ciudad, con y sin normalizar
exacta = erp[erp["Ciudad"].isin(OFICIALES)].groupby("Ciudad")["Valor"].sum().reindex(OFICIALES) / 1e6
normal = erp.groupby("Ciudad oficial")["Valor"].sum().reindex(OFICIALES) / 1e6
fig = go.Figure()
fig.add_bar(name="Solo el nombre exacto", x=OFICIALES, y=exacta.values, marker_color=MAGENTA)
fig.add_bar(name="Después de normalizar", x=OFICIALES, y=normal.values, marker_color=AZUL)
perdida = 1 - exacta.sum() / normal.sum()
fig.update_layout(barmode="group", yaxis_title=MM, height=380, legend=dict(orientation="h", y=-0.15),
                  title=f"Sin normalizar, el {porc(perdida)} de la venta queda en filas de ciudades «fantasma»")
fig.show()
'''),
        md("""
## 2 · Formato condicional: que la excepción salte a la vista
La validación evita el error al escribir. El formato condicional no impide nada: **resalta** lo que necesita atención. Funciona mejor cuando expresa una regla de negocio. En Distribuidora Andina, un descuento del 10 % o más requiere aprobación del jefe comercial.
"""),
        ficha("¿Qué vendedores concentran los descuentos que requieren aprobación?", "Barras por vendedor: líneas de 2025 con descuento igual o mayor al límite · Resaltadas: las tres con más casos",
              "Es lo que hace una regla de formato condicional: todo en gris y solo las excepciones con color.",
              "Todas las barras con color: la vista no sabe dónde detenerse.",
              "Las barras resaltadas son las primeras conversaciones del jefe comercial.",
              "Regla con fórmula =$H2>=0,10 sobre la tabla de pedidos, con relleno amarillo para la fila completa."),
        code('''
# @title Gráfico 3 · Excepciones por vendedor
limite_descuento = 0.10  # @param [0.10, 0.15]
casos = (validas[(validas.anio == 2025) & (validas.descuento_pct >= limite_descuento)]
         .groupby("nombre_vendedor").size().sort_values())
top3 = casos.index[-3:]
fig = go.Figure(go.Bar(x=casos.values, y=casos.index, orientation="h",
                       marker_color=[MAGENTA if v in top3 else GRIS for v in casos.index],
                       text=[miles(v) for v in casos.values], textposition="outside", cliponaxis=False))
fig.update_layout(title=f"{miles(casos.sum())} líneas de 2025 con descuento ≥ {limite_descuento:.0%}: tres vendedores concentran el {porc(casos[top3].sum() / casos.sum())}".replace("%", " %", 1),
                  xaxis_title="Líneas", height=520)
dar_aire(fig, casos.max())
fig.show()
'''),
        md("## 3 · Retos de interpretación"),
        reto(1, "¿De cuántas formas distintas llega escrita la ciudad?", [str(x) for x in sorted({6, n_var, n_var + 4, 10})],
             'str(erp["Ciudad"].nunique())', "Es el número de barras del gráfico 1. Solo seis son correctas."),
        reto(2, "Agregas una lista desplegable a la columna Ciudad. ¿Qué pasa con las variantes que ya estaban escritas?",
             ["Se corrigen solas", "Siguen ahí: la validación solo controla lo que se escribe después", "Se borran", "Excel muestra un error en cada una"],
             '"Siguen ahí: la validación solo controla lo que se escribe después"', "Para encontrarlas: Datos › Validación de datos › Rodear con un círculo datos no válidos."),
        reto(3, "¿Qué fórmula de formato condicional resalta la fila completa cuando el descuento (columna H) es del 10 % o más?",
             ["=H2>=0,10", "=$H2>=0,10", "=$H$2>=0,10", "=H$2>=0,10"],
             '"=$H2>=0,10"', "El $ fija la columna H; la fila queda libre para que cada fila se evalúe con su propio descuento."),
        tip_ia("Para diseñar las reglas de un formato antes de entregarlo:",
               """Voy a crear en Excel 365 un formato de pedidos que llenan 18 vendedores (fecha, vendedor, ciudad, canal, producto, cantidad, precio, descuento).
Propón para cada columna una regla de validación de datos y el mensaje de error, y dos reglas de formato condicional con fórmula para resaltar excepciones de negocio."""),
        cierre(["Una lista desplegable evita las variantes; no corrige las que ya existen.",
                "Las listas que apuntan a una Tabla crecen solas.",
                "El formato condicional sirve cuando resalta pocas cosas y con un motivo de negocio."],
               f"[Clave 10 · Fórmulas de matriz dinámica]({PAGES}#clave-10) · [Laboratorio]({PAGES}#laboratorio)"),
    ]
