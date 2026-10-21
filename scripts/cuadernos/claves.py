"""Cuadernos de las claves (v2): 00 empresa, 01, 05, 07 y galería de gráficos."""
from .comun import (PAGES, PREPARACION, cierre, code, colab, datos, encabezado, ficha, md, reto, tip_ia)

CIUDADES = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Bucaramanga", "Pereira"]
LINEAS = ["Papelería", "Tecnología", "Aseo y cafetería", "Mobiliario", "Impresión"]
MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
lista = lambda xs: ", ".join(f'"{x}"' for x in xs)


# ============================================================================
# 00 · Conoce la empresa y sus datos (también es la prueba del Taller 0)
# ============================================================================
def cuaderno_00():
    _, val, _, _ = datos()
    top_mes = MESES[val[val.anio == 2025].groupby("mes").subtotal.sum().idxmax() - 1]
    opciones_mes = sorted({top_mes, "Ene", "Jun", "Sep", "Dic"} - {""}, key=MESES.index)[:4]
    assert top_mes in opciones_mes
    return [
        encabezado("Cuaderno 00", "Conoce la empresa y sus datos", "Recorrido visual por Distribuidora Andina", 20, [
            "Explicar qué hace la empresa y qué área produce cada tabla.",
            "Responder la pregunta clave ante cualquier tabla: ¿qué representa una fila?",
            "Leer los tres gráficos básicos de la empresa.",
            "Comprobar que tu laboratorio funciona (Taller 0)."], "00_conoce_la_empresa.ipynb", "empresa"),
        code(PREPARACION),
        md("""
## 1 · La empresa en un minuto
**Distribuidora Andina S.A.S.** vende suministros de oficina y tecnología a otras organizaciones: pymes, empresas corporativas, entidades de gobierno e instituciones educativas. Tiene seis sedes (Bogotá, Medellín, Cali, Barranquilla, Bucaramanga y Pereira), cinco líneas de producto y tres canales de venta: presencial, televentas y e-commerce.

Cada tabla la produce un área. **Comercial** registra los pedidos; **Facturación** emite y anula facturas; **Cartera** registra el recaudo; **Servicio al cliente** crea los clientes; **Compras** mantiene precios y costos; **Talento Humano** registra a los vendedores; **Planeación financiera** fija las metas, y **TI** exporta los datos del ERP.

[Ver la explicación completa en el tablero]({PAGES}#empresa)
""".replace("{PAGES}", PAGES)),
        md("""
## 2 · ¿Qué representa una fila?
Es la primera pregunta ante cualquier tabla. En `ventas`, **una fila es una línea de factura**: un producto dentro de una factura. Mira esta factura real de tres productos y cómo queda guardada.
"""),
        code('''
# @title Ver una factura y sus filas
det = df[(df.estado == "Pagada") & (df.descuento_pct > 0)]
conteo = det.groupby("id_factura").size()
factura = conteo[conteo == 3].index[5]
filas = df[df.id_factura == factura].sort_values("id_linea")
f0 = filas.iloc[0]
display(Markdown(f"**Factura {factura}** · {f0.fecha:%Y-%m-%d} · {f0.razon_social} ({f0.segmento}) · sede {f0.ciudad} · vendedor {f0.nombre_vendedor}"))
vista = filas[["id_linea", "id_factura", "id_cliente", "sku", "producto", "cantidad", "precio_unitario", "subtotal", "iva", "total", "estado"]]
display(vista.style.format({"precio_unitario": pesos, "subtotal": pesos, "iva": pesos, "total": pesos}).hide(axis="index"))
display(Markdown(f"La factura completa vale **{pesos(filas.total.sum())}** con IVA. Ese total no se guarda en ninguna fila: se calcula sumando las {len(filas)} filas."))
'''),
        md("""
## 3 · Las tablas del conjunto de datos
Cada tabla responde a la pregunta «¿qué representa una fila?» de forma distinta. Esa respuesta se llama **granularidad**.
"""),
        code('''
# @title Ver el resumen de tablas
resumen = pd.DataFrame([
    ["ventas", "Una línea de factura", len(ventas), ventas.shape[1], "id_linea", "Comercial y Facturación"],
    ["clientes", "Un cliente", len(clientes), clientes.shape[1], "id_cliente", "Servicio al cliente"],
    ["productos", "Un producto", len(productos), productos.shape[1], "sku", "Compras"],
    ["vendedores", "Un vendedor", len(vendedores), vendedores.shape[1], "id_vendedor", "Talento Humano"],
    ["sedes", "Una sede", len(sedes), sedes.shape[1], "id_sede", "Gerencia"],
    ["metas", "La meta de una sede en un mes", len(metas), metas.shape[1], "id_sede + anio + mes", "Planeación financiera"],
], columns=["Tabla", "Una fila es…", "Filas", "Columnas", "Llave", "Área responsable"])
display(resumen.style.format({"Filas": lambda x: f"{x:,}".replace(",", ".")}).hide(axis="index"))
'''),
        md("## 4 · Tres gráficos para conocer el negocio"),
        ficha("¿Cómo se comporta la venta durante el año?", "Eje X: mes · Eje Y: venta neta (millones) · Color: año · Sin anuladas",
              "El tiempo va en el eje horizontal y una línea muestra la tendencia mes a mes.",
              "Columnas por mes: 24 barras saturan el gráfico y ocultan la forma del año.",
              "Busca los picos (temporada escolar y cierre de año) y compara la altura de las dos líneas.",
              "Tabla dinámica con mes en Filas y año en Columnas › Gráfico dinámico de líneas."),
        code('''
# @title Gráfico 1 · Venta mensual
mensual = validas.groupby(["anio", "mes"], as_index=False)["subtotal"].sum()
mensual["millones"] = mensual["subtotal"] / 1e6
mensual["año"] = mensual["anio"].astype(str)
top = mensual[mensual.anio == 2025].sort_values("subtotal").iloc[-1]
fig = px.line(mensual, x="mes", y="millones", color="año", markers=True,
              color_discrete_map={"2024": GRIS, "2025": AZUL},
              title=f"En 2025 el mes más fuerte fue {MESES[int(top.mes) - 1].lower()}: {millones(top.subtotal)}")
fig.update_xaxes(tickvals=list(range(1, 13)), ticktext=MESES, title="")
fig.update_layout(yaxis_title=MM, legend_title="", hovermode="x unified")
fig.show()
'''),
        ficha("¿Qué sede pesa más?", "Barras: una por sede · Largo: la medida que elijas · Año: el que elijas",
              "Barras horizontales ordenadas: se lee el ranking de un vistazo y caben los nombres.",
              "Torta: seis partes parecidas no se comparan bien por ángulos.",
              "La barra resaltada es la primera. Compara su largo con las demás.",
              "Tabla dinámica con ciudad en Filas, ordenada de mayor a menor › Barra agrupada."),
        code('''
# @title Gráfico 2 · Ranking de sedes
medida = "Venta neta"  # @param ["Venta neta", "Margen bruto", "Facturas"]
anio = "2025"  # @param ["2025", "2024"]
base = validas[validas.anio == int(anio)]
if medida == "Facturas":
    serie = base.groupby("ciudad")["id_factura"].nunique(); etiqueta = serie.map(lambda v: f"{v:,}".replace(",", "."))
else:
    col = "subtotal" if medida == "Venta neta" else "margen_bruto"
    serie = base.groupby("ciudad")[col].sum() / 1e6; etiqueta = serie.map(lambda v: f"$ {v:,.0f} M".replace(",", "."))
serie = serie.sort_values()
colores = [GRIS] * (len(serie) - 1) + [AZUL]
fig = go.Figure(go.Bar(x=serie.values, y=serie.index, orientation="h", marker_color=colores, text=etiqueta[serie.index], textposition="outside", cliponaxis=False))
fig.update_layout(title=f"{serie.index[-1]} lidera en {medida.lower()} {anio} con el {porc(serie.iloc[-1] / serie.sum())} del total",
                  xaxis_title=MM if medida != "Facturas" else "Facturas", height=380)
dar_aire(fig, serie.max())
fig.show()
'''),
        ficha("¿Qué líneas venden más y cuáles dejan más margen?", "Columnas agrupadas: venta y margen por línea, 2025",
              "Dos medidas en la misma unidad (pesos) comparadas lado a lado en cada línea.",
              "Dos ejes: si venta y margen tuvieran escalas distintas, el gráfico engañaría.",
              "Compara la altura de la barra de margen con la de venta en cada línea: tecnología vende mucho y deja poco.",
              "Tabla dinámica con categoría en Filas y subtotal y margen_bruto en Valores › Columna agrupada."),
        code('''
# @title Gráfico 3 · Venta y margen por línea
lin = validas[validas.anio == 2025].groupby("categoria")[["subtotal", "margen_bruto"]].sum().sort_values("subtotal", ascending=False) / 1e6
largo = lin.reset_index().melt(id_vars="categoria", var_name="medida", value_name="millones")
largo["medida"] = largo["medida"].map({"subtotal": "Venta neta", "margen_bruto": "Margen bruto"})
m = (lin["margen_bruto"] / lin["subtotal"])
fig = px.bar(largo, x="categoria", y="millones", color="medida", barmode="group", color_discrete_sequence=[AZUL, TEAL],
             title=f"{lin.index[0]} es la línea que más vende, pero su margen es el más bajo ({porc(m[lin.index[0]])})" if m.idxmin() == lin.index[0]
                   else f"{lin.index[0]} es la línea que más vende en 2025")
fig.update_layout(yaxis_title=MM, xaxis_title="", legend_title="")
fig.show()
'''),
        md("""
## 5 · Explora una columna
Elige una columna y mira qué valores tiene y cuánto pesa cada uno. Así se conoce una tabla antes de analizarla.
"""),
        code('''
# @title Explorar los valores de una columna
columna = "canal"  # @param ["canal", "segmento", "categoria", "estado", "medio_pago", "ciudad"]
tabla = df.groupby(columna).agg(lineas=("id_linea", "size"), venta=("subtotal", "sum")).sort_values("venta", ascending=False)
tabla["% de la venta"] = tabla["venta"] / tabla["venta"].sum()
display(tabla.style.format({"lineas": lambda x: f"{x:,}".replace(",", "."), "venta": pesos, "% de la venta": porc}))
if columna == "estado":
    display(Markdown("**Ojo:** las filas *Anulada* existen en la tabla, pero no son venta. En los análisis comerciales se excluyen."))
'''),
        md("## 6 · Retos de interpretación\nElige la respuesta en la lista desplegable y ejecuta la celda con ▶."),
        reto(1, "La factura de ejemplo tiene 3 productos. ¿Cuántas filas ocupa en la tabla ventas?", ["1", "3", "4", "Depende del IVA"], '"3"',
             "Una fila por producto: la granularidad de ventas es la línea de factura."),
        reto(2, "¿Qué mes de 2025 tuvo la mayor venta neta?", opciones_mes,
             'MESES[validas[validas.anio == 2025].groupby("mes")["subtotal"].sum().idxmax() - 1]',
             "Es el punto más alto de la línea azul del gráfico 1."),
        reto(3, "¿Qué área produce la tabla metas?", ["Comercial", "Planeación financiera", "Talento Humano", "TI"], '"Planeación financiera"',
             "Planeación financiera fija el presupuesto de cada sede, mes a mes."),
        code('''
# @title Comprobación del laboratorio (Taller 0)
ok = len(ventas) > 17000 and len(metas) == 144 and abs(validas[validas.anio == 2025].subtotal.sum() - 14_692_379_210) < 1
display(Markdown("## ✅ Laboratorio listo" if ok else "## ❌ Algo no cargó bien: vuelve a ejecutar todas las celdas"))
display(Markdown(f"Leíste {miles(len(ventas))} líneas de venta. Venta neta 2025 sin anuladas: **{pesos(validas[validas.anio == 2025].subtotal.sum())}**. "
                 "Si ves este mensaje y el gráfico de abajo, tu entorno funciona."))
mini = validas.groupby(validas.fecha.dt.to_period("M"))["subtotal"].sum() / 1e6
fig = px.line(x=mini.index.to_timestamp(), y=mini.values, title="Venta neta mensual 2024–2025", markers=True)
fig.update_layout(height=300, xaxis_title="", yaxis_title=MM)
eje_meses(fig, mini.index.to_timestamp())
fig.show()
'''),
        cierre(["Una fila de ventas es una línea de factura: contar filas no es contar facturas.",
                "Cada tabla la produce un área; conocerla explica sus errores típicos.",
                "Antes de analizar, explora qué valores tiene cada columna."],
               f"[Clave 1 · Estructura antes que fórmulas]({PAGES}#clave-01) · [Taller 1]({PAGES}#taller-1)"),
    ]


# ============================================================================
# 01 · Estructura antes que fórmulas
# ============================================================================
def cuaderno_01():
    return [
        encabezado("Clave 1", "Estructura antes que fórmulas", "Datos tabulares y Tablas de Excel", 30, [
            "Reconocer en pantalla un reporte que no se puede analizar.",
            "Ver con un gráfico cuánto se equivoca una suma hecha sobre un reporte.",
            "Entender qué cambia cuando la misma información se ordena en una tabla.",
            "Elegir un gráfico que solo es posible con datos ordenados."], "01_estructura_y_tablas.ipynb", "clave-01"),
        code(PREPARACION),
        md("""
## 1 · El reporte que llega por correo
El libro de práctica tiene la hoja **Reporte_Mal_Estructurado**: el informe de ventas de 2025 armado para imprimir. Así lo ve Python: cada celda vacía (por una celda combinada, una fila en blanco o un título) aparece en blanco.
"""),
        code('''
# @title Ver el reporte tal como llega
reporte = pd.read_excel(ruta("Distribuidora_Andina_practica.xlsx"), sheet_name="Reporte_Mal_Estructurado", header=None)
fila_enc = reporte.index[reporte.eq("Ciudad").any(axis=1)][0]
col = reporte.columns[reporte.loc[fila_enc].eq("Ciudad")][0]
vista = reporte.iloc[fila_enc - 2:fila_enc + 16, col:col + 6].fillna("")
vista.columns = list("BCDEFG")[:vista.shape[1]]
display(vista.style.hide(axis="index").set_properties(**{"font-size": "12px"}))
'''),
        md("""
Fíjate en tres cosas: la ciudad aparece una sola vez por bloque (era una **celda combinada**), hay filas **Subtotal** mezcladas con los registros y algunas cifras están escritas como **texto** (por ejemplo `1.204,9 M`).

## 2 · ¿Cuánto se equivoca una suma rápida?
Alguien con prisa selecciona todas las cifras y usa SUMA. Excel ignora los textos y suma subtotales y total como si fueran ventas.
"""),
        code('''
# @title Preparar el cálculo (Colab hace los pasos por ti)
datos_rep = reporte.iloc[fila_enc + 2:, col:col + 6].copy()
datos_rep.columns = ["ciudad", "linea", "T1", "T2", "T3", "T4"]
es_sub = datos_rep["linea"].astype(str).str.startswith(("Subtotal", "TOTAL"))
es_vacia = datos_rep["linea"].isna()
valores = datos_rep[["T1", "T2", "T3", "T4"]]
es_texto = valores.map(lambda v: isinstance(v, str))
def a_numero(v):
    return float(v.replace(" M", "").replace(".", "").replace(",", ".")) * 1e6 if isinstance(v, str) else v
suma_rapida = valores[~es_texto].apply(pd.to_numeric, errors="coerce").sum().sum()
correcta = valores[~es_sub & ~es_vacia].map(a_numero).astype(float).sum().sum()
veces = suma_rapida / correcta
display(Markdown(f"Filas de subtotal o total: **{es_sub.sum()}** · filas vacías o notas: **{es_vacia.sum()}** · cifras escritas como texto: **{int(es_texto.values.sum())}**"))
'''),
        ficha("¿Cuánto infla el total una suma hecha sobre el reporte?", "Dos barras: la suma rápida y la suma correcta, en millones",
              "Solo hay dos cifras y el mensaje es la diferencia: dos barras lo muestran sin explicación.",
              "Una tarjeta con el número: se pierde la comparación visual.",
              "La barra magenta mide la suma rápida y la azul la correcta. La diferencia es el error.",
              "Barra agrupada con dos celdas de datos."),
        code('''
# @title Gráfico 1 · Dos totales para la misma hoja
comp = pd.DataFrame({"cálculo": ["Seleccionar todo y SUMA", "Solo registros, texto convertido"], "millones": [suma_rapida / 1e6, correcta / 1e6]})
fig = px.bar(comp, x="millones", y="cálculo", orientation="h", color="cálculo", color_discrete_sequence=[MAGENTA, AZUL],
             text=comp["millones"].map(lambda v: f"$ {v:,.0f} M".replace(",", ".")),
             title=f"La suma rápida infla el total {veces:.1f} veces".replace(".", ","))
fig.update_traces(textposition="outside", cliponaxis=False)
fig.update_layout(showlegend=False, xaxis_title=MM, yaxis_title="", height=280)
dar_aire(fig, suma_rapida / 1e6)
fig.show()
'''),
        md("""
## 3 · La misma información, ordenada
Colab hizo cuatro pasos, los mismos que harías en Excel: **repetir la ciudad** en cada fila (en Excel: separar celdas y rellenar), **quitar subtotales y filas vacías** (filtrar y eliminar), **convertir el texto en número** y **llevar los trimestres a una columna** (en Power Query: anular dinamización de columnas).
"""),
        code('''
# @title Ver el antes y el después
ordenada = datos_rep.copy()
ordenada["ciudad"] = ordenada["ciudad"].ffill()
ordenada = ordenada[~es_sub & ~es_vacia]
for t in ["T1", "T2", "T3", "T4"]:
    ordenada[t] = ordenada[t].map(a_numero).astype(float)
ordenada = ordenada.melt(id_vars=["ciudad", "linea"], var_name="trimestre", value_name="subtotal")
antes = pd.DataFrame({"": ["Filas", "Columnas", "Celdas vacías dentro de los datos", "Subtotales", "Cifras como texto"],
                      "Reporte": [len(datos_rep), 6, int(datos_rep[["ciudad"]].isna().sum().iloc[0]), int(es_sub.sum()), int(es_texto.values.sum())],
                      "Tabla ordenada": [len(ordenada), 4, 0, 0, 0]})
display(antes.style.hide(axis="index"))
display(ordenada.head(8).style.format({"subtotal": pesos}).hide(axis="index"))
'''),
        md("Tiene más filas y ninguna ambigüedad. Ahora sí se puede graficar cualquier combinación."),
        ficha("¿Cómo evolucionó cada línea durante 2025 en la ciudad que elijas?", "Eje X: trimestre · Eje Y: venta (millones) · Color: línea de producto · Filtro: ciudad",
              "Los trimestres son tiempo: las líneas muestran la tendencia de cada producto.",
              "Columnas apiladas: no permiten comparar la tendencia de cada línea.",
              "Sigue cada línea de izquierda a derecha. El título dice cuál creció más de T1 a T4.",
              "Tabla dinámica con trimestre en Filas y línea en Columnas › Gráfico de líneas. Con el reporte original era imposible."),
        code(f'''
# @title Gráfico 2 · Evolución por trimestre (elige la ciudad)
ciudad = "Todas"  # @param ["Todas", {lista(CIUDADES)}]
base = ordenada if ciudad == "Todas" else ordenada[ordenada.ciudad == ciudad]
serie = base.groupby(["trimestre", "linea"], as_index=False)["subtotal"].sum()
serie["millones"] = serie["subtotal"] / 1e6
var = serie.pivot(index="linea", columns="trimestre", values="subtotal")
var = (var["T4"] / var["T1"] - 1).sort_values()
fig = px.line(serie, x="trimestre", y="millones", color="linea", markers=True,
              color_discrete_sequence=[AZUL, TEAL, MAGENTA, "#7A5AC8", "#3E8E5E"],
              title=f"{{ciudad if ciudad != 'Todas' else 'Toda la empresa'}}: {{var.index[-1]}} fue la línea que más creció de T1 a T4 ({{porc(var.iloc[-1], signo=True)}})")
fig.update_layout(yaxis_title=MM, xaxis_title="", legend_title="")
fig.show()
'''),
        md("""
## 4 · La calidad también es de significado
La tabla de ventas pasa todas las pruebas de forma (sin vacíos ni duplicados), pero contiene filas que **no son venta**: las facturas anuladas. Ninguna prueba automática lo detecta; lo detecta quien conoce el negocio.
"""),
        ficha("¿Cuánto dinero hay en facturas anuladas?", "Barras: venta por estado de la factura, 2024–2025",
              "Pocas categorías comparadas en una medida.",
              "Torta: la parte anulada es tan pequeña que no se vería.",
              "La barra Anulada parece pequeña, pero son cientos de millones que inflarían cualquier informe.",
              "Tabla dinámica con estado en Filas y subtotal en Valores."),
        code('''
# @title Gráfico 3 · Venta por estado
est = df.groupby("estado")["subtotal"].sum().reindex(["Pagada", "Pendiente", "Anulada"]) / 1e6
fig = go.Figure(go.Bar(x=est.index, y=est.values, marker_color=[AZUL, TEAL, MAGENTA],
                       text=[f"$ {v:,.0f} M".replace(",", ".") for v in est.values], textposition="outside", cliponaxis=False))
fig.update_layout(title=f"Las anuladas suman {millones(est['Anulada'] * 1e6)}: si no se filtran, se cuentan como venta",
                  yaxis_title=MM, height=380)
dar_aire(fig, est.max(), "y")
fig.show()
'''),
        md("## 5 · Retos de interpretación"),
        reto(1, "¿Cuántas veces infla el total la suma rápida?", ["1,5 veces", "2 veces", "3 veces", "4 veces"],
             'f"{round(veces)} veces"', "La suma rápida cuenta cada venta dos veces (registro y subtotal) y además el total general."),
        reto(2, "Para comparar trimestres de cada línea, ¿qué estructura necesitas?",
             ["Una columna por trimestre", "Una columna trimestre y una columna subtotal", "Una hoja por trimestre"],
             '"Una columna trimestre y una columna subtotal"', "El trimestre es una variable: va en una columna propia."),
        reto(3, "¿Qué gráfico usarías para mostrar cómo evolucionó Bogotá por trimestre?", ["Torta", "Líneas", "Dispersión", "Mapa de árbol"],
             '"Líneas"', "El eje horizontal es tiempo: las líneas muestran la tendencia."),
        tip_ia("Si recibes un reporte con otra forma, pídele a una IA que te diga cómo ordenarlo en Excel:",
               """Tengo un reporte de Excel con este encabezado y estas 8 filas de muestra (datos anonimizados):
[pega aquí]
Dime qué problemas de estructura tiene para hacer una tabla dinámica y los pasos en Excel 365 en español
para convertirlo en una tabla con una fila por registro. No inventes datos."""),
        cierre(["Un reporte sirve para leer; una tabla ordenada sirve para analizar.",
                "Una suma sobre un reporte cuenta subtotales e ignora textos: el error es silencioso.",
                "Los gráficos de evolución y comparación solo son posibles con datos ordenados."],
               f"[Clave 5 · Buscar y cruzar sin #N/D]({PAGES}#clave-05) · [Cuaderno 05]({colab('05_busqueda_y_cruce.ipynb')})"),
    ]


# ============================================================================
# 05 · Buscar y cruzar sin #N/D
# ============================================================================
def cuaderno_05():
    return [
        encabezado("Clave 5", "Buscar y cruzar sin #N/D", "Lo que se pierde cuando un cruce falla", 30, [
            "Ver cuántas filas de una exportación cruzan con el maestro y por qué fallan las demás.",
            "Medir con un gráfico cuánto dinero queda sin clasificar si se cruza mal.",
            "Comparar el resultado antes y después de limpiar la llave.",
            "Decidir qué hacer con los códigos que no existen en el maestro."], "05_busqueda_y_cruce.ipynb", "clave-05"),
        code(PREPARACION),
        md("""
## 1 · El problema
La exportación del ERP trae el **código del cliente**, pero no su **segmento**. Para el comité hay que mostrar la venta por segmento, así que hay que traer el segmento desde el maestro de clientes. En Excel eso se hace con **BUSCARX**; en Colab, con una unión de tablas. La lógica es la misma: buscar la llave en el maestro y traer el dato.
"""),
        code('''
# @title Cargar la exportación y mirar las llaves de cerca
erp = pd.read_csv(ruta("ventas_erp_sucio.csv"), dtype=str, keep_default_na=False)
def a_pesos(t):
    t = t.replace("$", "").replace(".", "").strip()
    return float(t) if t else np.nan
erp["valor"] = erp["Valor Neto"].map(a_pesos)
erp = erp.drop_duplicates(subset=["Linea"])
ids = set(clientes["id_cliente"])
muestra = erp[erp["Cod Cliente"].str.len() != 6].head(6)[["Factura", "Cod Cliente"]].copy()
muestra["Así se ve"] = muestra["Cod Cliente"]
muestra["Lo que realmente tiene"] = muestra["Cod Cliente"].map(lambda c: c.replace(" ", "·"))
muestra["Caracteres"] = muestra["Cod Cliente"].str.len()
display(muestra.drop(columns="Cod Cliente").style.hide(axis="index"))
display(Markdown("Un código válido tiene **6 caracteres** (`C-0129`). Los puntos `·` son espacios que en pantalla no se ven. En Excel, `=LARGO(A2)` los delata."))
'''),
        md("## 2 · ¿Por qué falla cada fila?"),
        ficha("¿Cuántas filas cruzan y por qué fallan las demás?", "Barras: número de filas por motivo · Colores: cruza (azul), se arregla limpiando (teal), no existe (magenta)",
              "Barras ordenadas: el motivo más frecuente salta a la vista; el color separa lo que se corrige de lo que se reporta.",
              "Torta: la parte que cruza es tan grande que las fallas se volverían rebanadas invisibles.",
              "Las barras teal se arreglan con una fórmula. La magenta no: hay que avisar al área de datos maestros.",
              "Columna con BUSCARX y «No encontrado», luego CONTAR.SI por causa."),
        code('''
# @title Gráfico 1 · Motivos de fallo
def motivo(c):
    if c in ids: return "Cruza tal como viene"
    if c.strip() in ids: return "Espacios"
    if c.upper() in ids: return "Minúsculas"
    if c.strip().upper() in ids: return "Espacios y minúsculas"
    return "No existe en el maestro"
erp["motivo"] = erp["Cod Cliente"].map(motivo)
mot = erp["motivo"].value_counts().sort_values()
fallas = mot.drop("Cruza tal como viene")
colores = {"Cruza tal como viene": AZUL, "No existe en el maestro": MAGENTA}
fig = go.Figure(go.Bar(x=mot.values, y=mot.index, orientation="h", marker_color=[colores.get(k, TEAL) for k in mot.index],
                       text=mot.values, textposition="outside", cliponaxis=False))
fig.update_layout(title=f"{porc(mot['Cruza tal como viene'] / mot.sum())} cruza; la causa de fallo más común es «{fallas.idxmax()}»",
                  xaxis_title="Filas de la exportación", height=340)
dar_aire(fig, mot.max())
fig.show()
display(Markdown("En **Excel**, las filas con *Minúsculas* sí habrían cruzado: BUSCARX no distingue mayúsculas. Python sí."))
'''),
        md("## 3 · Limpiar la llave cambia el resultado\nElige el nivel de limpieza y vuelve a ejecutar. Mira cómo cambian la tasa de cruce y el dinero sin clasificar."),
        ficha("¿Cuánta venta queda sin segmento según cómo se limpie la llave?", "Barras: venta por segmento + una barra «Sin clasificar» · Filtro: nivel de limpieza",
              "La barra magenta hace visible el dinero que el informe perdería; las demás muestran el reparto real.",
              "Mostrar solo la tasa de cruce: un 85 % suena bien hasta que se ve cuánto dinero es el 15 %.",
              "Mientras más corta la barra magenta, más confiable el informe por segmento.",
              "Tabla dinámica con la columna del BUSCARX en Filas: «No encontrado» aparece como una categoría más."),
        code('''
# @title Gráfico 2 · Venta por segmento según la limpieza
limpieza = "Sin limpiar"  # @param ["Sin limpiar", "Quitar espacios", "Quitar espacios y pasar a mayúsculas"]
llave = erp["Cod Cliente"]
if limpieza != "Sin limpiar": llave = llave.str.strip()
if limpieza == "Quitar espacios y pasar a mayúsculas": llave = llave.str.upper()
seg = llave.map(clientes.set_index("id_cliente")["segmento"]).fillna("Sin clasificar")
tasa = (seg != "Sin clasificar").mean()
vv = erp[erp["Estado"] != "Anulada"].assign(segmento=seg).groupby("segmento")["valor"].sum().sort_values() / 1e6
fig = go.Figure(go.Bar(x=vv.values, y=vv.index, orientation="h", marker_color=[MAGENTA if k == "Sin clasificar" else AZUL for k in vv.index],
                       text=[f"$ {v:,.0f} M".replace(",", ".") for v in vv.values], textposition="outside", cliponaxis=False))
fig.update_layout(title=f"{limpieza}: cruza el {porc(tasa)} de las filas y quedan {millones(vv.get('Sin clasificar', 0) * 1e6)} sin segmento",
                  xaxis_title=MM, height=360)
dar_aire(fig, vv.max())
fig.show()
'''),
        md("""
## 4 · Lo que ninguna limpieza arregla
Los códigos que siguen sin cruzar **no existen en el maestro**: son clientes creados en el ERP que nadie registró. No se inventa su segmento ni se borran sus filas. Se entregan en una lista al área de datos maestros y, mientras tanto, se muestran como «Sin clasificar».
"""),
        code('''
# @title Ver la lista de códigos huérfanos
llave_ok = erp["Cod Cliente"].str.strip().str.upper()
tasa_limpia = llave_ok.isin(ids).mean()
huer = erp[~llave_ok.isin(ids)].groupby(llave_ok[~llave_ok.isin(ids)]).agg(filas=("Factura", "size"), venta=("valor", "sum"))
huer = huer.sort_values("venta", ascending=False).rename_axis("código")
display(Markdown(f"**{len(huer)} códigos** no existen en el maestro. Con la llave limpia cruza el **{porc(tasa_limpia)}** de las filas."))
display(huer.head(10).style.format({"venta": pesos}))
'''),
        md("""
## 5 · Un maestro con duplicados multiplica filas
Si un código aparece dos veces en el maestro, BUSCARX devuelve la primera coincidencia **sin avisar**. En Python, la unión repite la fila de la venta por cada coincidencia, y los totales crecen. Por eso se comprueba que la llave del maestro sea única antes de cruzar.
"""),
        code('''
# @title Gráfico 3 · Qué pasa con un maestro duplicado
frecuente = llave_ok.value_counts().index[0]
dup = pd.concat([clientes, clientes[clientes.id_cliente == frecuente]])
filas_mal = len(erp.assign(llave=llave_ok).merge(dup[["id_cliente", "segmento"]], left_on="llave", right_on="id_cliente", how="left"))
fig = go.Figure(go.Bar(x=["Filas de la exportación", "Filas después de cruzar con el maestro duplicado"], y=[len(erp), filas_mal],
                       marker_color=[AZUL, MAGENTA], text=[f"{len(erp):,}".replace(",", "."), f"{filas_mal:,}".replace(",", ".")], textposition="outside"))
fig.update_layout(title=f"Duplicar un solo cliente ({frecuente}) en el maestro agrega {filas_mal - len(erp)} filas falsas a la venta", height=360, yaxis_title="Filas")
dar_aire(fig, filas_mal, "y")
fig.show()
'''),
        md("## 6 · Retos de interpretación"),
        reto(1, "¿Cuál es la causa de fallo más común en esta exportación?", ["Espacios", "Minúsculas", "Espacios y minúsculas", "No existe en el maestro"],
             'fallas.idxmax()', "Es la barra teal más larga del gráfico 1. Se corrige con ESPACIOS en Excel."),
        reto(2, "Con la llave limpia, ¿qué porcentaje de filas cruza?", ["84 %", "90 %", "98 %", "100 %"],
             'f"{tasa_limpia:.0%}".replace("%", " %")', "Lo que falta para el 100 % son los códigos huérfanos."),
        reto(3, "¿Qué haces con los códigos que no existen en el maestro?",
             ["Asignarles el segmento más probable", "Borrar esas filas", "Reportarlos y mostrarlos como Sin clasificar", "Usar BUSCARV con coincidencia aproximada"],
             '"Reportarlos y mostrarlos como Sin clasificar"', "No se inventa ni se oculta: se reporta y se hace visible."),
        tip_ia("Cuando un cruce falle en Excel, pide un diagnóstico, no una fórmula nueva:",
               """Mi BUSCARX en Excel 365 devuelve "No encontrado" en el 15 % de las filas.
Estos son 10 códigos que no cruzaron: [pega aquí]. Estos son 5 códigos válidos del maestro: [pega aquí].
Dime las causas probables (espacios, carácter 160, ceros a la izquierda, códigos inexistentes)
y una fórmula de Excel en español para comprobar cada una."""),
        cierre(["Un cruce termina cuando sabes cuántas filas cruzaron y por qué fallaron las demás.",
                "Un porcentaje de cruce alto puede esconder mucho dinero: mídelo en pesos.",
                "Los huérfanos se reportan; un maestro con duplicados se corrige antes de cruzar."],
               f"[Clave 7 · Tablas dinámicas]({PAGES}#clave-07) · [Cuaderno 07]({colab('07_tablas_dinamicas.ipynb')})"),
    ]


# ============================================================================
# 07 · Tablas dinámicas que responden preguntas
# ============================================================================
def cuaderno_07():
    return [
        encabezado("Clave 7", "Tablas dinámicas que responden preguntas", "Resumir, comparar y graficar sin errores de agregación", 40, [
            "Armar una tabla dinámica eligiendo filas, columnas y valor.",
            "Elegir el gráfico adecuado para cada pregunta de negocio.",
            "Evitar los tres errores clásicos: anuladas, líneas contadas como facturas y promedio de porcentajes.",
            "Comparar la venta con la meta y redactar el hallazgo."], "07_tablas_dinamicas.ipynb", "clave-07"),
        code(PREPARACION),
        md("""
## 1 · Tu propia tabla dinámica
Elige filas, columnas, valor y cómo mostrarlo, igual que en el panel de campos de Excel. Ejecuta la celda con ▶. Debajo de la tabla aparece el gráfico que mejor responde esa combinación y la razón de la elección.
"""),
        code('''
# @title Constructor de tabla dinámica
filas = "ciudad"  # @param ["ciudad", "categoria", "segmento", "canal", "nombre_vendedor", "mes", "anio"]
columnas = "anio"  # @param ["(ninguna)", "anio", "canal", "segmento", "categoria"]
valor = "Venta neta (suma de subtotal)"  # @param ["Venta neta (suma de subtotal)", "Margen bruto (suma)", "Margen %", "Líneas (recuento)", "Facturas (recuento distinto)"]
mostrar_como = "Valor"  # @param ["Valor", "% del total general", "% del total de columna", "% del total de fila"]
filtro_anio = "Todos"  # @param ["Todos", "2024", "2025"]
incluir_anuladas = False  # @param {type:"boolean"}

base = df if incluir_anuladas else validas
if filtro_anio != "Todos": base = base[base.anio == int(filtro_anio)]
col = None if columnas == "(ninguna)" or columnas == filas else columnas
def resumir(g):
    if valor.startswith("Venta"): return g["subtotal"].sum()
    if valor.startswith("Margen bruto"): return g["margen_bruto"].sum()
    if valor == "Margen %": return g["margen_bruto"].sum() / g["subtotal"].sum()
    if valor.startswith("Líneas"): return len(g)
    return g["id_factura"].nunique()
claves = [filas] + ([col] if col else [])
tabla = base.groupby(claves).apply(resumir)
tabla = tabla.unstack(col) if col else tabla.to_frame(valor.split(" (")[0])
if valor != "Margen %" and mostrar_como != "Valor":
    if mostrar_como == "% del total general": tabla = tabla / tabla.values.sum()
    elif mostrar_como == "% del total de columna": tabla = tabla / tabla.sum()
    else: tabla = tabla.div(tabla.sum(axis=1), axis=0)
es_pct = valor == "Margen %" or mostrar_como != "Valor"
if filas == "mes": tabla.index = [MESES[m - 1] for m in tabla.index]
elif filas != "anio": tabla = tabla.loc[tabla.sum(axis=1).sort_values(ascending=False).index] if col else tabla.sort_values(tabla.columns[0], ascending=False)
display(tabla.style.format(porc if es_pct else (lambda v: f"{v:,.0f}".replace(",", "."))))

# Elección del gráfico según la combinación
largo = tabla.reset_index().melt(id_vars=tabla.index.name or "index", var_name="serie", value_name="v")
x = tabla.index.name or "index"
if filas == "mes":
    fig = px.line(largo, x=x, y="v", color="serie" if col else None, markers=True); razon = "Las filas son meses: es tiempo, así que se usan líneas."
elif col and tabla.shape[1] > 3:
    grande = (not es_pct) and tabla.values.max() > 1e6
    fig = px.imshow(tabla / 1e6 if grande else tabla, text_auto=".0%" if es_pct else ".0f", aspect="auto", color_continuous_scale=["#EEF2FF", AZUL, "#00006A"])
    razon = "Hay más de tres columnas: un mapa de calor muestra el patrón sin saturar de colores." + (" Valores en millones de pesos." if grande else "")
elif col and mostrar_como == "% del total de fila":
    fig = px.bar(largo, y=x, x="v", color="serie", orientation="h", barmode="stack"); razon = "Porcentajes de cada fila que suman 100 %: barras apiladas al 100 %."
elif col:
    fig = px.bar(largo, x=x, y="v", color="serie", barmode="group", color_discrete_sequence=[GRIS, AZUL, TEAL]); razon = "Pocas series para comparar dentro de cada categoría: columnas agrupadas."
else:
    fig = px.bar(largo.sort_values("v"), y=x, x="v", orientation="h", color_discrete_sequence=[AZUL]); razon = "Una sola medida por categoría: barras horizontales ordenadas."
fig.update_layout(title=f"{valor.split(' (')[0]} por {filas}" + (f" y {col}" if col else ""), legend_title="", xaxis_title="", yaxis_title="", height=420)
if es_pct and not isinstance(fig.data[0], go.Heatmap): fig.update_layout(xaxis_tickformat=".0%" if not filas == "mes" else None, yaxis_tickformat=".0%" if filas == "mes" else None)
fig.show()
display(Markdown(f"**¿Por qué este gráfico?** {razon}"))
if incluir_anuladas: display(Markdown("⚠️ Estás incluyendo facturas anuladas: no son venta."))
if valor.startswith("Facturas") and col: display(Markdown("Ojo: los recuentos distintos de cada columna **no se suman** para obtener el total; una factura puede tener productos de varias categorías."))
'''),
        md("## 2 · Seis preguntas de negocio, seis gráficos"),
        ficha("P1 · ¿Qué ciudad vendió más en 2025?", "Barras: venta neta 2025 por ciudad, sin anuladas", "Ranking de una medida en pocas categorías.",
              "Torta: seis partes parecidas no se comparan bien.", "La barra resaltada lidera. Compara las distancias entre barras.",
              "Ciudad en Filas, subtotal en Valores, estado en Filtros, año 2025."),
        code('''
# @title P1 · Venta 2025 por ciudad
p1 = validas[validas.anio == 2025].groupby("ciudad")["subtotal"].sum().sort_values()
fig = go.Figure(go.Bar(x=p1.values / 1e6, y=p1.index, orientation="h", marker_color=[GRIS] * 5 + [AZUL],
                       text=[millones(v) for v in p1.values], textposition="outside", cliponaxis=False))
fig.update_layout(title=f"{p1.index[-1]} vendió el {porc(p1.iloc[-1] / p1.sum())} de la venta neta 2025", xaxis_title=MM, height=360)
dar_aire(fig, p1.max() / 1e6)
fig.show()
'''),
        ficha("P2 · ¿Cuánto creció cada ciudad de 2024 a 2025?", "Columnas agrupadas: 2024 (gris) y 2025 (azul) por ciudad, ordenadas por crecimiento",
              "Dos series por categoría; el gris para el pasado deja el foco en el presente.", "Una línea por ciudad: dos puntos no hacen una tendencia.",
              "Lee la etiqueta de crecimiento sobre cada par de barras.", "Ciudad en Filas, año en Columnas › Columna agrupada."),
        code('''
# @title P2 · Crecimiento por ciudad
p2 = validas.pivot_table(index="ciudad", columns="anio", values="subtotal", aggfunc="sum")
p2["var"] = p2[2025] / p2[2024] - 1
p2 = p2.sort_values("var", ascending=False)
fig = go.Figure([go.Bar(name="2024", x=p2.index, y=p2[2024] / 1e6, marker_color=GRIS), go.Bar(name="2025", x=p2.index, y=p2[2025] / 1e6, marker_color=AZUL)])
for c, f in p2.iterrows():
    fig.add_annotation(x=c, y=max(f[2024], f[2025]) / 1e6, text=porc(f["var"], signo=True), showarrow=False, yshift=12)
fig.update_layout(barmode="group", title=f"{p2.index[0]} fue la ciudad que más creció ({porc(p2['var'].iloc[0], signo=True)})", yaxis_title=MM, legend_title="")
fig.show()
'''),
        ficha("P3 · ¿Qué línea deja más margen porcentual?", "Barras: margen % por línea, bien calculado (Σ margen ÷ Σ venta) y mal calculado (promedio de %)",
              "Mostrar los dos cálculos juntos hace visible el error más común con porcentajes.", "Solo el valor correcto: el estudiante no vería por qué el otro está mal.",
              "Compara las dos barras de cada línea: la diferencia es el error de promediar porcentajes.", "Campo calculado o margen_bruto ÷ subtotal fuera de la dinámica."),
        code('''
# @title P3 · Margen % bien y mal calculado
v = validas.assign(pct=validas.margen_bruto / validas.subtotal)
p3 = pd.DataFrame({"Correcto (Σ margen ÷ Σ venta)": v.groupby("categoria").margen_bruto.sum() / v.groupby("categoria").subtotal.sum(),
                   "Incorrecto (promedio de %)": v.groupby("categoria").pct.mean()}).sort_values("Correcto (Σ margen ÷ Σ venta)")
largo = p3.reset_index().melt(id_vars="categoria", var_name="cálculo", value_name="margen")
fig = px.bar(largo, y="categoria", x="margen", color="cálculo", barmode="group", orientation="h", color_discrete_sequence=[AZUL, GRIS])
fig.update_layout(title=f"{p3.index[-1]} deja el mayor margen; {p3.index[0]}, el menor ({porc(p3.iloc[0, 0])})", xaxis_tickformat=".0%", yaxis_title="", xaxis_title="", legend_title="", height=400)
fig.show()
'''),
        ficha("P4 · ¿El e-commerce ganó participación?", "Barras apiladas al 100 %: reparto de la venta por canal en cada año",
              "Composición de un total en pocas partes, comparada entre dos años.", "Valores absolutos: ocultan que el total creció.",
              "Compara el ancho del segmento magenta en 2024 y en 2025.", "Año en Filas, canal en Columnas, Mostrar valores como › % del total de fila › Barra 100 % apilada."),
        code('''
# @title P4 · Participación por canal
p4 = pd.crosstab(validas.anio, validas.canal, values=validas.subtotal, aggfunc="sum", normalize="index")[["Presencial", "Televentas", "E-commerce"]]
largo = p4.reset_index().melt(id_vars="anio", var_name="canal", value_name="part"); largo["anio"] = largo["anio"].astype(str)
fig = px.bar(largo, y="anio", x="part", color="canal", orientation="h", text=largo["part"].map(lambda v: f"{v:.0%}"), color_discrete_sequence=[AZUL, TEAL, MAGENTA])
fig.update_traces(marker_line_color="white", marker_line_width=2, insidetextanchor="middle")
fig.update_layout(barmode="stack", title=f"El e-commerce pasó de {porc(p4.loc[2024, 'E-commerce'])} a {porc(p4.loc[2025, 'E-commerce'])} de la venta",
                  xaxis_tickformat=".0%", yaxis_title="", xaxis_title="", legend_title="", height=300, yaxis=dict(autorange="reversed"))
fig.show()
'''),
        ficha("P5 · ¿Cuántas facturas emitió cada sede?", "Columnas agrupadas: líneas (recuento) y facturas (recuento distinto) por sede",
              "Muestra en el mismo gráfico la diferencia entre contar filas y contar facturas.", "Solo facturas: no se vería el error de contar filas.",
              "La barra de líneas siempre es más alta: cada factura tiene varios productos.", "Recuento distinto requiere marcar «Agregar al Modelo de datos»."),
        code('''
# @title P5 · Líneas frente a facturas
p5 = validas.groupby("ciudad").agg(lineas=("id_linea", "size"), facturas=("id_factura", "nunique")).sort_values("facturas", ascending=False)
fig = go.Figure([go.Bar(name="Líneas (recuento)", x=p5.index, y=p5.lineas, marker_color=GRIS), go.Bar(name="Facturas (recuento distinto)", x=p5.index, y=p5.facturas, marker_color=AZUL)])
fig.update_layout(barmode="group", title=f"Contar filas casi duplica las facturas: {p5.lineas.sum() / p5.facturas.sum():.1f} líneas por factura".replace(".", ","), yaxis_title="", legend_title="")
fig.show()
'''),
        ficha("P6 · ¿En qué meses y sedes se concentra la venta?", "Mapa de calor: sede × mes de 2025, color más oscuro = más venta",
              "Dos categorías cruzadas: el color revela patrones que una tabla de 72 números esconde.", "Doce líneas, una por mes: imposible de leer.",
              "Busca columnas oscuras (meses fuertes) y filas claras (sedes pequeñas).", "Tabla dinámica sede × mes › Formato condicional › Escalas de color."),
        code('''
# @title P6 · Mapa de calor sede × mes
p6 = validas[validas.anio == 2025].pivot_table(index="ciudad", columns="mes", values="subtotal", aggfunc="sum").loc[ORDEN_CIUDADES] / 1e6
i, j = np.unravel_index(np.argmax(p6.values), p6.shape)
fig = px.imshow(p6, x=MESES, y=p6.index, text_auto=".0f", aspect="auto", color_continuous_scale=["#EEF2FF", "#9AA8F0", AZUL, "#00006A"])
fig.update_layout(title=f"{p6.index[i]} en {MESES[j].lower()} es el punto más alto de 2025 (millones de pesos)", coloraxis_colorbar_title="M$", xaxis_title="", yaxis_title="", height=380)
fig.show()
'''),
        md("## 3 · Real contra meta"),
        ficha("¿Qué sedes cumplieron la meta de 2025?", "Barras: % de cumplimiento por sede · Línea punteada: 100 % · Color: cumplió (teal) o no (magenta)",
              "El cumplimiento es una razón; ordenar por ella responde directamente la pregunta.", "Barras de real y meta en pesos: Bogotá dominaría el gráfico aunque no sea la que más cumplió.",
              "Las barras que pasan la línea punteada cumplieron. El texto da el porcentaje exacto.", "SUMAR.SI.CONJUNTO de real y meta por sede, y luego Barra con línea de referencia."),
        code('''
# @title Cumplimiento 2025 por sede
real = validas[validas.anio == 2025].groupby("id_sede")["subtotal"].sum()
meta = metas[metas.anio == 2025].groupby("id_sede")["meta_subtotal"].sum()
cum = (real / meta).rename(index=sedes.set_index("id_sede")["ciudad"]).sort_values()
fig = go.Figure(go.Bar(x=cum.values, y=cum.index, orientation="h", marker_color=[TEAL if v >= 1 else MAGENTA for v in cum.values],
                       text=[("✓ " if v >= 1 else "✗ ") + porc(v) for v in cum.values], textposition="outside", cliponaxis=False))
fig.add_vline(x=1, line_dash="dot", line_color="#11153A", annotation_text="Meta 100 %")
fig.update_layout(title=f"{(cum >= 1).sum()} de 6 sedes cumplieron; {cum.index[0]} quedó en {porc(cum.iloc[0])}", xaxis_tickformat=".0%",
                  xaxis_range=[0.8, max(1.15, cum.max() + 0.06)], height=360)
fig.show()
mejor = cum.index[-1]
'''),
        md("## 4 · Del resultado al informe\nUna tabla dinámica no es un informe. El informe son tres frases con cifra, comparación y siguiente pregunta:"),
        code('''
# @title Generar el borrador del hallazgo
display(Markdown(f"""
1. En 2025 la empresa vendió **{millones(p2[2025].sum())}** netos, **{porc(p2[2025].sum() / p2[2024].sum() - 1, signo=True)}** frente a 2024.
2. **{cum.index[-1]}** superó su meta ({porc(cum.iloc[-1])}) y **{cum.index[0]}** quedó en {porc(cum.iloc[0])}. ¿Qué explica la brecha de {cum.index[0]}?
3. El e-commerce ya es el **{porc(p4.loc[2025, 'E-commerce'])}** de la venta. ¿Tiene el mismo margen que los otros canales?
"""))
'''),
        md("## 5 · Retos de interpretación"),
        reto(1, "¿Qué participación tuvo el e-commerce en la venta neta de 2025?", ["13 %", "19 %", "24 %", "30 %"],
             'f"{p4.loc[2025, \'E-commerce\']:.0%}".replace("%", " %")', "Es el segmento magenta de la barra 2025 en P4."),
        reto(2, "¿Qué sede tuvo el mayor cumplimiento de meta en 2025?", CIUDADES, "mejor", "Es la barra más larga del gráfico de cumplimiento."),
        reto(3, "En una tabla dinámica, ¿qué usas para contar facturas y no líneas?", ["Recuento", "Suma", "Recuento distinto", "Promedio"],
             '"Recuento distinto"', "Recuento cuenta filas; cada factura ocupa varias filas."),
        tip_ia("Usa la IA para pasar de la pregunta a la configuración de la tabla dinámica:",
               """Tengo en Excel 365 una Tabla tVentas con: fecha, id_factura, ciudad, canal, categoria, subtotal, margen_bruto, estado.
Pregunta de negocio: "[escribe tu pregunta]".
Dime qué va en Filas, Columnas, Valores y Filtros, qué "Mostrar valores como" usar, qué gráfico elegir y por qué,
y qué error de agregación debo evitar. No inventes resultados."""),
        cierre(["Primero la pregunta, después la tabla dinámica.", "Sin anuladas; facturas con recuento distinto; porcentajes como razón de sumas.",
                "El gráfico se elige por la pregunta: ranking, tiempo, composición o cumplimiento."],
               f"[Laboratorio Excel + Colab]({PAGES}#laboratorio)"),
    ]


# ============================================================================
# Galería de gráficos para informes
# ============================================================================
GALERIA = ["Barras: ¿qué sede vendió más?", "Columnas agrupadas: ¿cómo cambió cada sede?", "Líneas: ¿cómo se comportó la venta mes a mes?",
           "Apiladas 100 %: ¿el e-commerce ganó participación?", "Anillo: ¿qué segmento pesa más?", "Histograma: ¿cuánto vale una factura típica?",
           "Dispersión: ¿vender más da más margen?", "Mapa de calor: ¿dónde y cuándo se concentra la venta?", "Pareto: ¿qué tan concentrados están los clientes?",
           "Indicadores (KPI): ¿cómo cerró el año?", "Real contra meta: ¿quién cumplió?", "Cascada: ¿qué explica el crecimiento?"]
NOMBRES = ["Barras", "Columnas agrupadas", "Líneas", "Apiladas 100 %", "Anillo", "Histograma", "Dispersión", "Mapa de calor", "Pareto", "Indicadores (KPI)", "Real contra meta", "Cascada"]


def cuaderno_graficos():
    return [
        encabezado("Galería", "Gráficos para informes", "Los 12 gráficos más usados, con su ficha de decisión", 30, [
            "Elegir el gráfico según lo que quieres mostrar.",
            "Escribir títulos que dicen el hallazgo.",
            "Reconocer las decisiones de diseño que hacen legible un gráfico."], "graficos_para_informes.ipynb", "graficos"),
        code(PREPARACION),
        md("""
## Cómo elegir
| Si quieres mostrar… | Usa |
|---|---|
| **Comparación** entre categorías | Barras o columnas agrupadas |
| **Evolución** en el tiempo | Líneas |
| **Composición** de un total | Apiladas al 100 %, anillo (máximo 4 partes) o cascada |
| **Distribución** de valores | Histograma, mapa de calor o Pareto |
| **Relación** entre dos medidas | Dispersión |
| **Cumplimiento** de una meta | Indicadores (KPI) o real contra meta |

Elige una pregunta en la lista y ejecuta la celda. Debajo del gráfico aparece su ficha de decisión.
"""),
        code(f'''
# @title Elige la pregunta y mira el gráfico
pregunta = "{GALERIA[0]}"  # @param [{lista(GALERIA)}]
v25, v24 = validas[validas.anio == 2025], validas[validas.anio == 2024]
fichas = {{}}
def F(usa, evita, excel, decisiones): return f"**Úsalo cuando:** {{usa}}  \\n**Evítalo cuando:** {{evita}}  \\n**En Excel 365:** {{excel}}  \\n**Decisiones:** {{decisiones}}"
k = pregunta.split(":")[0]
if k == "Barras":
    s = v25.groupby("ciudad").subtotal.sum().sort_values() / 1e6
    fig = go.Figure(go.Bar(x=s.values, y=s.index, orientation="h", marker_color=[GRIS] * 5 + [AZUL], text=[f"$ {{v:,.0f}} M".replace(",", ".") for v in s.values], textposition="outside", cliponaxis=False))
    fig.update_layout(title=f"{{s.index[-1]}} concentra el {{porc(s.iloc[-1] / s.sum())}} de la venta 2025", xaxis_title=MM); dar_aire(fig, s.max())
    txt = F("comparas categorías, sobre todo si son muchas o tienen nombres largos.", "el eje es el tiempo.", "Insertar › Barra agrupada, con los datos ordenados.", "ordenar de mayor a menor, un color y un resaltado, eje desde cero.")
elif k == "Columnas agrupadas":
    p = validas.pivot_table(index="ciudad", columns="anio", values="subtotal", aggfunc="sum").loc[ORDEN_CIUDADES] / 1e6
    fig = go.Figure([go.Bar(name="2024", x=p.index, y=p[2024], marker_color=GRIS), go.Bar(name="2025", x=p.index, y=p[2025], marker_color=AZUL)])
    fig.update_layout(barmode="group", title=f"La venta total creció {{porc(p[2025].sum() / p[2024].sum() - 1)}} de 2024 a 2025", yaxis_title=MM)
    txt = F("comparas dos o tres series dentro de cada categoría.", "hay más de tres series.", "Insertar › Columna agrupada.", "año anterior en gris, actual en color, máximo tres series.")
elif k == "Líneas":
    m = validas.groupby(["anio", "mes"]).subtotal.sum().unstack(0) / 1e6
    fig = go.Figure([go.Scatter(x=MESES, y=m[a], name=str(a), mode="lines+markers", line=dict(color=c)) for a, c in [(2024, GRIS), (2025, AZUL)]])
    fig.update_layout(title=f"El mes más fuerte de 2025 fue {{MESES[int(m[2025].idxmax()) - 1].lower()}}", yaxis_title=MM)
    txt = F("el eje horizontal es el tiempo.", "las categorías no tienen orden.", "Insertar › Línea con marcadores.", "máximo cuatro líneas, etiquetas al final.")
elif k == "Apiladas 100 %":
    p = pd.crosstab(validas.anio, validas.canal, values=validas.subtotal, aggfunc="sum", normalize="index")[["Presencial", "Televentas", "E-commerce"]]
    fig = go.Figure([go.Bar(name=c, y=[str(a) for a in p.index], x=p[c], orientation="h", marker_color=col, text=[f"{{v:.0%}}" for v in p[c]], marker_line_color="white", marker_line_width=2) for c, col in zip(p.columns, [AZUL, TEAL, MAGENTA])])
    fig.update_layout(barmode="stack", xaxis_tickformat=".0%", title=f"El e-commerce pasó de {{porc(p.iloc[0, 2])}} a {{porc(p.iloc[1, 2])}}", yaxis=dict(autorange="reversed"), height=320)
    txt = F("comparas cómo se reparte un total entre pocas partes.", "importan los valores absolutos.", "Insertar › Barra 100 % apilada.", "pocas partes, mismo orden, porcentajes dentro.")
elif k == "Anillo":
    s = v25.groupby("segmento").subtotal.sum().sort_values(ascending=False)
    fig = go.Figure(go.Pie(labels=s.index, values=s.values, hole=0.55, sort=False, marker_colors=[AZUL, TEAL, MAGENTA, GRIS], textinfo="label+percent"))
    fig.update_layout(title=f"{{s.index[0]}} aporta el {{porc(s.iloc[0] / s.sum())}} de la venta 2025", showlegend=False)
    txt = F("una sola serie, máximo cuatro partes y una parte domina.", "hay más de cuatro partes o son parecidas.", "Insertar › Anillo. Nunca en 3D.", "ordenar desde las 12, escribir porcentajes.")
elif k == "Histograma":
    fac = v25.groupby("id_factura").subtotal.sum() / 1e6; tope = fac.quantile(0.95)
    fig = px.histogram(fac.clip(upper=tope), nbins=20, color_discrete_sequence=[TEAL])
    fig.update_layout(title=f"La mitad de las facturas vale menos de $ {{fac.median():,.1f}} M".replace(".", ","), xaxis_title=f"Valor de la factura (millones; la última barra agrupa las mayores a {{tope:,.0f}} M)", yaxis_title="Facturas", showlegend=False)
    txt = F("quieres ver qué valores son típicos y cuáles extremos.", "tienes pocos datos o categorías.", "Insertar › Gráfico estadístico › Histograma.", "ancho de intervalo, agrupar extremos, reportar la mediana.")
elif k == "Dispersión":
    g = validas.groupby("nombre_vendedor").agg(venta=("subtotal", "sum"), margen=("margen_bruto", "sum")); g["margen_pct"] = g.margen / g.venta
    r = np.corrcoef(g.venta, g.margen_pct)[0, 1]
    fig = px.scatter(g.reset_index(), x="venta", y="margen_pct", hover_name="nombre_vendedor", color_discrete_sequence=[AZUL])
    fig.update_traces(marker_size=12); fig.update_layout(yaxis_tickformat=".0%", xaxis_title="Venta 2024–2025 (pesos)", yaxis_title="Margen bruto %",
        title="Los que más venden tienden a dejar menos margen" if r < -0.3 else "Vender más no se asocia con más margen")
    txt = F("quieres ver si dos medidas se mueven juntas.", "una variable es categoría o fecha.", "Insertar › Dispersión (X, Y).", "variable explicativa en X, rotular solo lo importante; relación no es causa.")
elif k == "Mapa de calor":
    p = v25.pivot_table(index="ciudad", columns="mes", values="subtotal", aggfunc="sum").loc[ORDEN_CIUDADES] / 1e6
    fig = px.imshow(p, x=MESES, text_auto=".0f", aspect="auto", color_continuous_scale=["#EEF2FF", AZUL, "#00006A"]); fig.update_layout(title="Venta 2025 por sede y mes (millones)")
    txt = F("cruzas dos categorías y buscas patrones.", "necesitas comparar cifras exactas.", "Formato condicional › Escalas de color.", "un solo color, filas ordenadas, valores escritos.")
elif k == "Pareto":
    c = v25.groupby("razon_social").subtotal.sum().sort_values(ascending=False); n = len(c)
    dec = pd.Series([c.iloc[int(n * d / 10):int(n * (d + 1) / 10)].sum() / c.sum() for d in range(10)], index=[f"{{(d + 1) * 10}} %" for d in range(10)])
    fig = go.Figure([go.Bar(x=dec.index, y=dec.values, name="Aporte", marker_color=AZUL), go.Scatter(x=dec.index, y=dec.cumsum(), name="Acumulado", mode="lines+markers", line=dict(color=MAGENTA))])
    fig.add_hline(y=0.8, line_dash="dot", line_color=MAGENTA)
    fig.update_layout(yaxis_tickformat=".0%", title=f"El 20 % de los clientes explica el {{porc(dec.iloc[:2].sum())}} de la venta", xaxis_title="Clientes agrupados del que más compra al que menos")
    txt = F("quieres saber si pocos explican la mayoría.", "todos aportan parecido.", "Insertar › Gráfico estadístico › Pareto.", "ordenar, marcar el 80 %, agrupar si son muchos.")
elif k == "Indicadores (KPI)":
    fig = go.Figure([go.Indicator(mode="number+delta", value=v25.subtotal.sum() / 1e6, delta=dict(reference=v24.subtotal.sum() / 1e6, relative=True, valueformat=".1%"), number=dict(prefix="$ ", suffix=" M", valueformat=",.0f"), title="Venta neta 2025", domain=dict(x=[0, 0.3])),
                     go.Indicator(mode="number", value=v25.margen_bruto.sum() / v25.subtotal.sum() * 100, number=dict(suffix=" %", valueformat=".1f"), title="Margen bruto", domain=dict(x=[0.35, 0.65])),
                     go.Indicator(mode="number", value=v25.id_factura.nunique(), number=dict(valueformat=","), title="Facturas", domain=dict(x=[0.7, 1]))])
    fig.update_layout(title="Lo primero que ve el comité", height=280)
    txt = F("el mensaje es una cifra y su comparación.", "pones más de cinco tarjetas.", "Celda grande con IMPORTARDATOSDINAMICOS.", "toda cifra con su comparación; color solo en la comparación.")
elif k == "Real contra meta":
    real = v25.groupby("ciudad").subtotal.sum(); meta = metas[metas.anio == 2025].merge(sedes, on="id_sede").groupby("ciudad").meta_subtotal.sum()
    cum = (real / meta).sort_values()
    fig = go.Figure(go.Bar(x=cum.values, y=cum.index, orientation="h", marker_color=[TEAL if v >= 1 else MAGENTA for v in cum.values], text=[("✓ " if v >= 1 else "✗ ") + porc(v) for v in cum.values], textposition="outside"))
    fig.add_vline(x=1, line_dash="dot"); fig.update_layout(xaxis_tickformat=".0%", xaxis_range=[0.8, cum.max() + 0.08], title=f"{{(cum >= 1).sum()}} de 6 sedes cumplieron la meta 2025")
    txt = F("comparas un resultado con su objetivo.", "no hay meta definida.", "Barra agrupada con superposición 100 %.", "ordenar por cumplimiento, % escrito, ✓ y ✗ con el color.")
else:
    p = validas.pivot_table(index="ciudad", columns="anio", values="subtotal", aggfunc="sum"); d = (p[2025] - p[2024]).sort_values(ascending=False)
    fig = go.Figure(go.Waterfall(x=["2024", *d.index, "2025"], y=[p[2024].sum() / 1e6, *(d.values / 1e6), 0], measure=["absolute", *["relative"] * len(d), "total"],
                                 increasing=dict(marker_color=BIEN), decreasing=dict(marker_color=MAL), totals=dict(marker_color=GRIS)))
    fig.update_layout(title=f"{{d.index[0]}} aportó la mayor parte del crecimiento", yaxis_title=MM)
    txt = F("explicas cómo se pasa de una cifra a otra.", "los pasos no suman el total.", "Insertar › Cascada; marca los totales con «Establecer como total».", "totales en gris, aumentos en verde, disminuciones en rojo.")
fig.update_layout(legend_title="", height=fig.layout.height or 420)
fig.show()
display(Markdown(txt))
'''),
        md("""
## Seis reglas para cualquier gráfico
1. **Empieza por la pregunta**, no por el tipo de gráfico.
2. **El título es el hallazgo**: una frase con la cifra que importa.
3. **Ordena** de mayor a menor, salvo que el orden sea el tiempo.
4. **Un color y un resaltado**: el color señala, no decora.
5. **Escribe los valores clave** si el lector necesita la cifra exacta.
6. **Fuente y fecha** al pie.

**Evita:** gráficos en 3D, dos ejes con escalas distintas, tortas con muchas partes y barras que no empiezan en cero.
"""),
        md("## Retos: elige el gráfico"),
        reto(1, "Quieres mostrar cómo cambió la venta mes a mes durante dos años", NOMBRES[:6], '"Líneas"', "El eje horizontal es el tiempo."),
        reto(2, "Quieres mostrar que pocos clientes explican la mayor parte de la venta", ["Anillo", "Pareto", "Dispersión", "Líneas"], '"Pareto"', "El Pareto muestra el aporte acumulado y marca el 80 %."),
        reto(3, "Quieres mostrar qué sedes llegaron a su meta", ["Mapa de calor", "Histograma", "Real contra meta", "Cascada"], '"Real contra meta"', "Compara el resultado con el objetivo, sede por sede."),
        cierre(["Pregunta → intención → gráfico → título con el hallazgo."], f"[Laboratorio Excel + Colab]({PAGES}#laboratorio)"),
    ]
