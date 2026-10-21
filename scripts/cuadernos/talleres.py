"""Cuadernos de los talleres del laboratorio Excel + Colab."""
import pandas as pd

from .comun import PAGES, PREPARACION, RAIZ, cierre, code, ficha, md

CIUDADES = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Bucaramanga", "Pereira"]
lista = lambda xs: ", ".join(f'"{x}"' for x in xs)

# Función compartida: una sola tabla plana con todo lo que necesita una tabla dinámica
PLANA = '''
MESES_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
def tabla_plana(v):
    d = (v.merge(sedes[["id_sede", "ciudad", "region"]], on="id_sede", validate="many_to_one")
          .merge(vendedores[["id_vendedor", "nombre_vendedor"]], on="id_vendedor", validate="many_to_one")
          .merge(clientes[["id_cliente", "razon_social", "segmento"]], on="id_cliente", validate="many_to_one")
          .merge(productos[["sku", "producto", "categoria"]], on="sku", validate="many_to_one")
          .sort_values("id_linea"))
    return pd.DataFrame({"fecha": d.fecha.dt.date, "anio": d.fecha.dt.year, "mes": d.fecha.dt.month,
        "nombre_mes": d.fecha.dt.month.map(lambda m: MESES_ES[m - 1]), "trimestre": "T" + d.fecha.dt.quarter.astype(str),
        "id_factura": d.id_factura, "ciudad": d.ciudad, "region": d.region, "vendedor": d.nombre_vendedor,
        "cliente": d.razon_social, "segmento": d.segmento, "canal": d.canal, "categoria": d.categoria,
        "producto": d.producto, "cantidad": d.cantidad, "subtotal": d.subtotal, "margen_bruto": d.margen_bruto, "estado": d.estado})
def metas_planas(m):
    m = m.merge(sedes[["id_sede", "ciudad"]], on="id_sede")
    return pd.DataFrame({"ciudad": m.ciudad, "anio": m.anio, "mes": m.mes, "nombre_mes": m.mes.map(lambda x: MESES_ES[x - 1]),
        "fecha_mes": pd.to_datetime(dict(year=m.anio, month=m.mes, day=1)).dt.date, "meta_subtotal": m.meta_subtotal})
'''


def descargar(nombre):
    return f'''
if EN_COLAB:
    from google.colab import files
    files.download("{nombre}")
    display(Markdown("Descarga iniciada: **{nombre}**. Si no aparece, búscalo en el panel de archivos (ícono de carpeta) › clic derecho › Descargar."))
else:
    display(Markdown("Archivo creado: **{nombre}** (en la carpeta del cuaderno)."))
'''


# ============================================================================
# TALLER 1 · De Excel a Colab
# ============================================================================
def taller_1():
    return [
        md(_encabezado(1, "De Excel a Colab", "Tu libro de Excel se convierte en un informe interactivo", 45,
                       "taller_1_excel_a_colab.ipynb")),
        code(PREPARACION),
        md("## Paso 3 · ¿De dónde viene tu libro?\nElige la fuente en la lista y ejecuta la celda con ▶. Si eliges *Subir desde mi computador*, aparece un botón **Elegir archivos**."),
        code('''
# @title Leer el libro de Excel
fuente = "Copia del curso (GitHub)"  # @param ["Copia del curso (GitHub)", "Subir desde mi computador", "Desde mi Google Drive", "Copia ya subida al panel de Colab"]
ruta_en_drive = "Laboratorio_Andina/1_datos/Andina_listo_para_dinamicas.xlsx"  # @param {type:"string"}
nombre_en_panel = "Andina_listo_para_dinamicas.xlsx"  # @param {type:"string"}

if fuente == "Subir desde mi computador" and EN_COLAB:
    from google.colab import files
    archivo = list(files.upload())[0]
elif fuente == "Desde mi Google Drive" and EN_COLAB:
    from google.colab import drive
    drive.mount("/content/drive")
    archivo = "/content/drive/MyDrive/" + ruta_en_drive
elif fuente == "Copia ya subida al panel de Colab":
    archivo = nombre_en_panel
else:
    archivo = ruta("Andina_listo_para_dinamicas.xlsx")

libro = pd.read_excel(archivo, sheet_name="Ventas")
libro["fecha"] = pd.to_datetime(libro["fecha"], errors="coerce")
display(Markdown(f"Leí **{miles(len(libro))} filas** y **{libro.shape[1]} columnas** de la hoja Ventas."))
display(Markdown(f"Primer cliente del libro: **{libro['cliente'].iloc[0]}**. Si lo cambiaste en Excel, aquí debe aparecer tu cambio."))
'''),
        md("## Paso 4 · Diagnóstico automático\nAntes de graficar se revisa. Es el hábito de la clave 12: comprobar antes de concluir."),
        code('''
# @title Revisar el libro
esperadas = ["fecha", "anio", "mes", "ciudad", "vendedor", "cliente", "segmento", "canal", "categoria", "producto", "subtotal", "margen_bruto", "estado"]
faltan = [c for c in esperadas if c not in libro.columns]
revision = [
    ("Están todas las columnas que usa el informe", not faltan, f"Faltan: {', '.join(faltan)}" if faltan else ""),
    ("Las fechas se reconocen como fechas", libro["fecha"].notna().all(), f"{libro['fecha'].isna().sum()} fechas no válidas"),
    ("subtotal es numérico", pd.api.types.is_numeric_dtype(libro["subtotal"]), "Hay textos en subtotal (clave 2)"),
    ("No hay subtotales vacíos", libro["subtotal"].notna().all(), f"{libro['subtotal'].isna().sum()} vacíos"),
]
for texto, ok, detalle in revision:
    display(Markdown(f"{'✓' if ok else '✗'} {texto}" + ("" if ok else f" — **{detalle}**")))
anuladas = (libro["estado"] == "Anulada").sum()
display(Markdown(f"ℹ️ El libro trae **{anuladas} líneas anuladas**. El informe las excluye porque no son venta."))
datos_ok = libro[libro["estado"] != "Anulada"].copy()
'''),
        md("## Paso 5 · Configura el informe\nElige y ejecuta. Luego ejecuta los cinco gráficos (o usa *Entorno de ejecución › Ejecutar celdas posteriores*)."),
        code(f'''
# @title Configuración del informe
anio = "2025"  # @param ["2025", "2024", "Todos"]
sede = "Todas"  # @param ["Todas", {lista(CIUDADES)}]
medida = "Venta neta"  # @param ["Venta neta", "Margen bruto"]
sel = datos_ok if anio == "Todos" else datos_ok[datos_ok.anio == int(anio)]
if sede != "Todas": sel = sel[sel.ciudad == sede]
col = "subtotal" if medida == "Venta neta" else "margen_bruto"
alcance = f"{{'toda la empresa' if sede == 'Todas' else sede}} · {{'2024–2025' if anio == 'Todos' else anio}}"
informe = []   # aquí se guardan los gráficos para exportarlos
display(Markdown(f"Informe de **{{medida.lower()}}** para **{{alcance}}**: {{miles(len(sel))}} líneas."))
'''),
        ficha("¿En qué meses y dónde se concentra la venta?", "Filas: sedes (o líneas, si elegiste una sede) · Columnas: meses · Color: medida elegida",
              "Dos categorías cruzadas: el color muestra el patrón de 72 cifras de un vistazo.", "Una línea por sede: seis líneas entrecruzadas.",
              "Las celdas más oscuras son los momentos fuertes.", "Tabla dinámica + Formato condicional › Escalas de color. Requiere armar la tabla primero."),
        code('''
# @title Gráfico 1 · Mapa de calor
filas = "ciudad" if sede == "Todas" else "categoria"
p = sel.pivot_table(index=filas, columns="mes", values=col, aggfunc="sum").fillna(0) / 1e6
p = p.loc[p.sum(axis=1).sort_values(ascending=False).index]
i, j = np.unravel_index(np.argmax(p.values), p.shape)
fig = px.imshow(p, x=[MESES[m - 1] for m in p.columns], text_auto=".0f", aspect="auto", color_continuous_scale=["#EEF2FF", AZUL, "#00006A"],
                title=f"{p.index[i]} en {MESES[p.columns[j] - 1].lower()} es el punto más alto ({alcance}, millones)")
fig.update_layout(coloraxis_colorbar_title="M$", xaxis_title="", yaxis_title="", height=400)
fig.show(); informe.append(fig)
'''),
        ficha("¿Qué tan concentrada está la venta en pocos clientes?", "Barras: aporte de cada 10 % de clientes · Línea: acumulado · Línea punteada: 80 %",
              "El Pareto responde si unos pocos explican la mayoría; un solo eje de porcentaje evita la trampa de dos ejes.", "Barras de cientos de clientes: ilegibles.",
              "Mira en qué grupo la línea cruza el 80 %.", "Insertar › Gráfico estadístico › Pareto, sobre una tabla de clientes ordenada."),
        code('''
# @title Gráfico 2 · Pareto de clientes
c = sel.groupby("cliente")[col].sum().sort_values(ascending=False); n = len(c)
dec = pd.Series([c.iloc[int(n * d / 10):int(n * (d + 1) / 10)].sum() / c.sum() for d in range(10)], index=[f"{(d + 1) * 10} %" for d in range(10)])
fig = go.Figure([go.Bar(x=dec.index, y=dec.values, name="Aporte del grupo", marker_color=AZUL),
                 go.Scatter(x=dec.index, y=dec.cumsum(), name="Acumulado", mode="lines+markers", line=dict(color=MAGENTA))])
fig.add_hline(y=0.8, line_dash="dot", line_color=MAGENTA)
fig.update_layout(title=f"El 20 % de los clientes explica el {porc(dec.iloc[:2].sum())} ({alcance})", yaxis_tickformat=".0%",
                  xaxis_title=f"{n} clientes, del que más compra al que menos", legend_title="")
fig.show(); informe.append(fig)
'''),
        ficha("¿Qué líneas y productos pesan más?", "Rectángulos: líneas de producto y, dentro, sus productos; el área es la medida",
              "Muestra composición en dos niveles a la vez; se puede hacer clic para entrar en una línea.", "Un anillo con 73 productos: imposible de leer.",
              "Los rectángulos grandes son los que más pesan. Haz clic en una línea para ver sus productos.", "Insertar › Gráfico de rectángulos (Treemap)."),
        code('''
# @title Gráfico 3 · Mapa de árbol línea → producto
t = sel.groupby(["categoria", "producto"], as_index=False)[col].sum()
t = t[t[col] > 0]
fig = px.treemap(t, path=[px.Constant("Total"), "categoria", "producto"], values=col, color="categoria",
                 color_discrete_sequence=[AZUL, TEAL, MAGENTA, "#7A5AC8", "#3E8E5E"])
top = t.groupby("categoria")[col].sum().idxmax()
fig.update_layout(title=f"{top} es la línea que más pesa en {medida.lower()} ({alcance})", height=480, margin=dict(t=70, l=5, r=5, b=5))
fig.update_traces(hovertemplate="%{label}<br>%{value:,.0f}<extra></extra>")
fig.show(); informe.append(fig)
'''),
        ficha("¿Cómo evolucionó cada sede mes a mes?", "Una pequeña gráfica de líneas por sede (o por línea), con el mismo eje",
              "Varias gráficas pequeñas evitan una maraña de seis líneas y permiten comparar formas.", "Seis líneas en un solo gráfico: se cruzan y nadie las sigue.",
              "Compara la forma de cada curva: quién crece, quién cae, quién es estacional.", "En Excel exige seis gráficos alineados a mano."),
        code('''
# @title Gráfico 4 · Una gráfica por sede
grupo = "ciudad" if sede == "Todas" else "categoria"
s = sel.assign(periodo=sel.fecha.dt.to_period("M").dt.to_timestamp()).groupby([grupo, "periodo"], as_index=False)[col].sum()
s["millones"] = s[col] / 1e6
orden = s.groupby(grupo)["millones"].sum().sort_values(ascending=False).index.tolist()
fig = px.line(s, x="periodo", y="millones", facet_col=grupo, facet_col_wrap=3, color_discrete_sequence=[AZUL], category_orders={grupo: orden})
eje_meses(fig, s["periodo"], cada=3)
fig.for_each_annotation(lambda a: a.update(text=a.text.split("=")[-1]))
fig.update_layout(title=f"{medida} mensual por {'sede' if grupo == 'ciudad' else 'línea'} ({alcance}, millones)", height=520, showlegend=False)
fig.update_yaxes(title=""); fig.update_xaxes(title="")
fig.show(); informe.append(fig)
'''),
        ficha("¿Los vendedores que más venden dejan más margen?", "Un punto por vendedor · Eje X: venta · Eje Y: margen %",
              "Relación entre dos medidas, un punto por persona.", "Barras de cada medida por separado: no se ve la relación.",
              "Los puntos abajo a la derecha venden mucho con poco margen: ¿descuentos?", "Insertar › Dispersión (X, Y)."),
        code('''
# @title Gráfico 5 · Dispersión de vendedores
g = sel.groupby("vendedor").agg(venta=("subtotal", "sum"), margen=("margen_bruto", "sum"))
g = g[g.venta > 0]; g["margen %"] = g.margen / g.venta
fig = px.scatter(g.reset_index(), x="venta", y="margen %", hover_name="vendedor", color_discrete_sequence=[AZUL])
fig.update_traces(marker_size=13, marker_line_color="white", marker_line_width=1.5)
fig.update_layout(title=f"Venta y margen por vendedor ({alcance})", yaxis_tickformat=".0%", xaxis_title="Venta neta (pesos)")
fig.show(); informe.append(fig)
'''),
        md("## Paso 6 · Exportar el informe\nCrea una página web con los cinco gráficos. Funciona sin Colab y sin internet: se puede enviar por correo o Teams."),
        code('''
# @title Crear y descargar informe_interactivo_Andina.html
from datetime import date
partes = [f"""<html><head><meta charset="utf-8"><title>Informe interactivo · Distribuidora Andina</title>
<style>body{{font-family:Segoe UI,Arial,sans-serif;max-width:1100px;margin:24px auto;padding:0 16px;color:#11153A}}
h1{{color:#00006A;margin-bottom:4px}} .meta{{color:#566080;margin-bottom:24px}} .g{{margin:28px 0;border-top:1px solid #D6DCEA;padding-top:12px}}</style></head><body>
<h1>Distribuidora Andina S.A.S. · Informe interactivo</h1>
<div class="meta">{medida} · {alcance} · sin facturas anuladas · generado el {date.today():%Y-%m-%d} con Colab · Fuente: {archivo.split('/')[-1]}</div>"""]
for k, f in enumerate(informe):
    partes.append('<div class="g">' + f.to_html(full_html=False, include_plotlyjs=(k == 0)) + "</div>")
partes.append('<p class="meta">Pasa el mouse sobre los gráficos para ver los valores. Datos ficticios · Excel Corporativo · 12 Claves · Dr. Bits.</p></body></html>')
with open("informe_interactivo_Andina.html", "w", encoding="utf-8") as fh:
    fh.write("".join(partes))
''' + descargar("informe_interactivo_Andina.html")),
        cierre(["Excel guarda y organiza los datos; Colab los revisa y los convierte en análisis.",
                "Revisar antes de graficar evita conclusiones sobre datos equivocados.",
                "Un HTML interactivo se comparte sin que el lector instale nada."],
               f"[Taller 2 · De Colab a Excel]({PAGES}#taller-2)"),
    ]


# ============================================================================
# TALLER 2 · De Colab a Excel
# ============================================================================
def taller_2():
    return [
        md(_encabezado(2, "De Colab a Excel", "Colab prepara y valida; tú construyes el tablero en Excel", 20,
                       "taller_2_colab_a_excel.ipynb")),
        code(PREPARACION),
        md("""
## Paso 1 · Seis tablas separadas
La empresa guarda sus datos en seis tablas unidas por llaves (ver [La empresa]({PAGES}#empresa)). Una tabla dinámica, en cambio, trabaja mejor con **una sola tabla** que lo tenga todo: ciudad, vendedor, cliente, segmento, línea y producto en cada fila.
""".replace("{PAGES}", PAGES)),
        code('''
# @title Ver el tamaño de cada tabla
tam = pd.Series({"ventas": len(ventas), "clientes": len(clientes), "productos": len(productos), "vendedores": len(vendedores), "sedes": len(sedes), "metas": len(metas)}).sort_values()
fig = go.Figure(go.Bar(x=tam.values, y=tam.index, orientation="h", marker_color=[AZUL if k == "ventas" else GRIS for k in tam.index],
                       text=[f"{v:,}".replace(",", ".") for v in tam.values], textposition="outside", cliponaxis=False))
fig.update_layout(title="Ventas es la tabla grande; las demás son maestros que la explican", xaxis_type="log", xaxis_title="Filas (escala logarítmica)", height=320)
fig.show()
display(Markdown("Se usa escala logarítmica porque ventas tiene miles de filas y sedes solo seis: con escala normal, los maestros no se verían."))
'''),
        md("""
## Paso 2 · Unir las tablas
Colab trae a cada línea de venta los datos de sus maestros, usando las llaves:

| Dato que se trae | Desde | Llave | En Excel sería |
|---|---|---|---|
| ciudad y región | sedes | id_sede | 2 columnas con BUSCARX |
| nombre del vendedor | vendedores | id_vendedor | 1 columna con BUSCARX |
| cliente y segmento | clientes | id_cliente | 2 columnas con BUSCARX |
| producto y línea | productos | sku | 2 columnas con BUSCARX |

Además crea columnas de tiempo (año, mes, nombre del mes, trimestre). En Excel serían unas **8 columnas de fórmulas sobre 17.106 filas: más de 130.000 fórmulas**. Colab lo hace en un segundo y, sobre todo, **comprueba** el resultado.
"""),
        code('''# @title Unir las tablas
''' + PLANA + '''
plana = tabla_plana(ventas)
mplana = metas_planas(metas)
display(Markdown(f"Tabla unida: **{miles(len(plana))} filas × {plana.shape[1]} columnas**."))
display(plana.head(5).style.format({"subtotal": pesos, "margen_bruto": pesos}).hide(axis="index"))
'''),
        md("## Paso 3 · Validar antes de entregar\nCuatro pruebas. Si alguna falla, el libro no se entrega."),
        code('''
# @title Validar la tabla unida
pruebas = [
    ("Ninguna fila perdida ni agregada", len(plana) == len(ventas)),
    ("Todas las llaves cruzaron (sin vacíos en ciudad, vendedor, cliente ni producto)", plana[["ciudad", "vendedor", "cliente", "producto"]].notna().all().all()),
    ("El total de venta cuadra con la fuente", plana["subtotal"].sum() == ventas["subtotal"].sum()),
    ("Cada sede tiene 24 metas mensuales", (mplana.groupby("ciudad").size() == 24).all()),
]
for texto, ok in pruebas:
    display(Markdown(f"{'✓' if ok else '✗'} {texto}"))
cuadre = pd.DataFrame({"tabla": ["Fuente (ventas.csv)", "Tabla unida"], "millones": [ventas.subtotal.sum() / 1e6, plana.subtotal.sum() / 1e6]})
fig = px.bar(cuadre, x="tabla", y="millones", text=cuadre.millones.map(lambda v: f"$ {v:,.0f} M".replace(",", ".")), color="tabla", color_discrete_sequence=[GRIS, AZUL])
fig.update_layout(title="Cuadre: el total de la tabla unida es idéntico al de la fuente", showlegend=False, yaxis_title=MM, xaxis_title="", height=340)
fig.show()
'''),
        md("## Paso 4 · Exportar el libro para Excel\nSe crea `Andina_listo_para_dinamicas.xlsx` con las Tablas `tVentas` y `tMetas`, una hoja `Panel` vacía y una hoja `LEEME`."),
        code('''
# @title Crear y descargar Andina_listo_para_dinamicas.xlsx
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.table import Table, TableStyleInfo
wb = Workbook(); ws = wb.active; ws.title = "LEEME"; ws.column_dimensions["B"].width = 110
for r, t in enumerate(["Distribuidora Andina S.A.S. — Libro listo para tablas dinámicas (creado en Colab, Taller 2)", "",
                       "Panel → construye aquí tu tablero.", "Ventas (tVentas) → una fila por línea de factura, con todo unido.",
                       "Metas (tMetas) → meta mensual de venta neta por ciudad.", "", "Filtra estado = Anulada antes de cualquier pregunta comercial."], start=2):
    ws.cell(row=r, column=2, value=t).font = Font(name="Arial", size=14 if r == 2 else 11, bold=(r == 2), color="00006A" if r == 2 else "222222")
p = wb.create_sheet("Panel"); p.sheet_view.showGridLines = False
p["B2"] = "PANEL COMERCIAL · DISTRIBUIDORA ANDINA"; p["B2"].font = Font(name="Arial", size=18, bold=True, color="FFFFFF")
for c in "BCDEFGHIJKLMNOP": p[f"{c}2"].fill = PatternFill("solid", fgColor="00006A")
for nombre, tabla, d in [("Ventas", "tVentas", plana), ("Metas", "tMetas", mplana)]:
    h = wb.create_sheet(nombre); h.append(list(d.columns))
    for fila in d.itertuples(index=False): h.append(list(fila))
    t = Table(displayName=tabla, ref=f"A1:{get_column_letter(d.shape[1])}{len(d) + 1}"); t.tableStyleInfo = TableStyleInfo(name="TableStyleMedium2", showRowStripes=True)
    h.add_table(t); h.freeze_panes = "A2"
    for j, c in enumerate(d.columns, start=1):
        h.column_dimensions[get_column_letter(j)].width = min(max(len(c), int(d[c].astype(str).str.len().head(200).max())) + 2, 38)
        fmt = "#,##0" if c in ("subtotal", "margen_bruto", "meta_subtotal") else "yyyy-mm-dd" if c in ("fecha", "fecha_mes") else None
        if fmt:
            for (celda,) in h.iter_rows(min_row=2, min_col=j, max_col=j): celda.number_format = fmt
wb.save("Andina_listo_para_dinamicas.xlsx")
''' + descargar("Andina_listo_para_dinamicas.xlsx")),
        md(f"""
## Paso 5 · Ahora en Excel
Abre el libro descargado y sigue la **Parte B** del taller en el tablero: hoja de cálculos, tres tablas dinámicas, gráficos dinámicos, segmentaciones, escala de tiempo e indicadores.

👉 [Taller 2 · Parte B en el tablero]({PAGES}#taller-2)
"""),
        cierre(["Colab une, crea columnas y valida: tareas repetitivas donde Excel es lento y propenso a errores.",
                "Excel recibe una sola tabla limpia, ideal para tablas dinámicas y segmentaciones.",
                "Un libro solo se entrega si pasa las pruebas de validación."],
               f"[Taller 3 · Tablero para el comité]({PAGES}#taller-3)"),
    ]


# ============================================================================
# TALLER 3 · Tablero para el comité
# ============================================================================
def taller_3():
    e = pd.read_csv(RAIZ / "data" / "nuevo_mes" / "ventas_2026_01.csv")
    control = int(e[e.estado != "Anulada"].subtotal.sum())
    return [
        md(_encabezado(3, "Tablero para el comité", "Integra el mes nuevo, compara con la meta y genera el tablero web", 25,
                       "taller_3_tablero_comite.ipynb")),
        code(PREPARACION),
        md("""
> **Escenario.** Es lunes 2 de febrero de 2026. A las 9:00 se reúne el comité comercial y acaban de llegar los datos de enero. El gerente quiere saber: ¿cómo cerró enero frente a la meta?, ¿qué sede preocupa? y ¿qué está pasando con los canales?

## Paso 1 · Integrar enero de 2026
"""),
        code('''# @title Cargar 2024, 2025 y enero de 2026
''' + PLANA + f'''
fuente = "Datos del curso"  # @param ["Datos del curso", "Mi Panel actualizado (subir)"]
if fuente.startswith("Mi Panel") and EN_COLAB:
    from google.colab import files
    archivo = list(files.upload())[0]
    datos = pd.read_excel(archivo, sheet_name="Ventas"); metas_p = pd.read_excel(archivo, sheet_name="Metas")
    datos["fecha"] = pd.to_datetime(datos["fecha"])
else:
    enero = pd.read_csv(ruta("nuevo_mes/ventas_2026_01.csv"), parse_dates=["fecha"])
    m_enero = pd.read_csv(ruta("nuevo_mes/metas_2026_01.csv"))
    datos = tabla_plana(pd.concat([ventas, enero])); datos["fecha"] = pd.to_datetime(datos["fecha"])
    metas_p = metas_planas(pd.concat([metas, m_enero]))
ok = datos[datos.estado != "Anulada"].copy()
CONTROL = {control}
ene26 = ok[(ok.anio == 2026) & (ok.mes == 1)]
display(Markdown(f"Leí **{{miles(len(datos))}} líneas**, de las cuales **{{miles(len(datos[datos.anio == 2026]))}}** son de enero de 2026."))
display(Markdown(f"**Cifra de control** · venta neta de enero de 2026 sin anuladas: **{{pesos(ene26.subtotal.sum())}}** "
                 + ("✓ coincide con la del tablero de Excel." if int(ene26.subtotal.sum()) == CONTROL else f"✗ no coincide con {{pesos(CONTROL)}}: revisa que pegaste todas las filas de enero.")))
'''),
        md("## Paso 2 · Los cuatro gráficos del comité"),
        ficha("¿Cómo cerró enero?", "Tres indicadores: venta de enero, cumplimiento de la meta y variación contra enero de 2025",
              "Es lo primero que pregunta el gerente: tres cifras con su comparación.", "Una tabla con todas las sedes: responde después, no primero.",
              "El color de la variación dice si es buena o mala noticia.", "Celdas grandes con IMPORTARDATOSDINAMICOS."),
        code('''
# @title Indicadores de enero
ene25 = ok[(ok.anio == 2025) & (ok.mes == 1)]
meta26 = metas_p[(metas_p.anio == 2026) & (metas_p.mes == 1)].meta_subtotal.sum()
v26, v25 = ene26.subtotal.sum(), ene25.subtotal.sum()
fig = go.Figure([
    go.Indicator(mode="number", value=v26 / 1e6, number=dict(prefix="$ ", suffix=" M", valueformat=",.0f"), title="Venta neta enero 2026", domain=dict(x=[0, 0.3])),
    go.Indicator(mode="number+delta", value=v26 / meta26 * 100, number=dict(suffix=" %", valueformat=".1f"), delta=dict(reference=100, valueformat=".1f", suffix=" pts"), title="Cumplimiento de la meta", domain=dict(x=[0.35, 0.65])),
    go.Indicator(mode="delta", value=v26 / 1e6, delta=dict(reference=v25 / 1e6, relative=True, valueformat=".1%", font=dict(size=56)), title="Variación contra enero 2025", domain=dict(x=[0.7, 1]))])
fig.update_layout(title=f"Enero cerró en {porc(v26 / meta26)} de la meta, {porc(v26 / v25 - 1, signo=True)} frente a enero de 2025", height=280)
fig.show()
'''),
        ficha("¿Qué sede preocupa?", "Barras: cumplimiento de la meta de enero por sede, ordenado; línea punteada en 100 %",
              "El cumplimiento es la pregunta; ordenarlo pone a la sede que preocupa en un extremo.", "Real y meta en pesos: Bogotá dominaría por tamaño.",
              "Las barras magenta no llegaron a la meta; la más corta es la que preocupa.", "SUMAR.SI.CONJUNTO por sede contra tMetas."),
        code('''
# @title Cumplimiento de enero por sede
real = ene26.groupby("ciudad").subtotal.sum()
meta = metas_p[(metas_p.anio == 2026) & (metas_p.mes == 1)].groupby("ciudad").meta_subtotal.sum()
cum = (real / meta).sort_values()
fig = go.Figure(go.Bar(x=cum.values, y=cum.index, orientation="h", marker_color=[TEAL if v >= 1 else MAGENTA for v in cum.values],
                       text=[("✓ " if v >= 1 else "✗ ") + porc(v) for v in cum.values], textposition="outside", cliponaxis=False))
fig.add_vline(x=1, line_dash="dot", line_color="#11153A", annotation_text="Meta")
fig.update_layout(title=f"{cum.index[0]} es la sede que más preocupa: {porc(cum.iloc[0])} de su meta de enero", xaxis_tickformat=".0%",
                  xaxis_range=[0, max(1.2, cum.max() + 0.1)], height=360)
fig.show()
'''),
        ficha("¿Es una caída puntual o una tendencia?", "Líneas: venta real y meta de los últimos 13 meses (enero 2025 a enero 2026)",
              "Trece meses incluyen el mismo mes del año anterior; dos líneas en la misma unidad (pesos) se comparan sin trampas.", "Solo enero: no se sabe si es un mal mes o una tendencia.",
              "Si la línea real cae por debajo de la meta solo al final, es un mes atípico; si viene cayendo, es tendencia.", "Gráfico de líneas sobre una dinámica con fecha agrupada por meses."),
        code('''
# @title Tendencia de 13 meses
ok["periodo"] = ok.fecha.dt.to_period("M").dt.to_timestamp()
r = ok[ok.periodo >= "2025-01-01"].groupby("periodo").subtotal.sum() / 1e6
m = metas_p.assign(periodo=pd.to_datetime(metas_p.fecha_mes)).query("periodo >= '2025-01-01'").groupby("periodo").meta_subtotal.sum() / 1e6
fig = go.Figure([go.Scatter(x=r.index, y=r.values, name="Real", mode="lines+markers", line=dict(color=AZUL, width=3)),
                 go.Scatter(x=m.index, y=m.values, name="Meta", mode="lines", line=dict(color=GRIS, dash="dash"))])
bajo = (r < m.reindex(r.index)).sum()
fig.update_layout(title=f"En {bajo} de los últimos 13 meses la venta quedó por debajo de la meta", yaxis_title=MM, legend_title="", hovermode="x unified")
eje_meses(fig, r.index)
fig.show()
'''),
        ficha("¿Qué está pasando con los canales?", "Barras apiladas al 100 %: reparto por canal en enero de 2025 y enero de 2026",
              "Compara la composición del mismo mes en dos años, sin el efecto del tamaño.", "Valores absolutos: la caída general taparía el cambio de mezcla.",
              "Compara el ancho de cada color entre las dos barras.", "Dinámica con canal en columnas y Mostrar valores como › % del total de fila."),
        code('''
# @title Participación por canal, enero contra enero
ce = ok[(ok.mes == 1) & ok.anio.isin([2025, 2026])]
p = pd.crosstab(ce.anio, ce.canal, values=ce.subtotal, aggfunc="sum", normalize="index")[["Presencial", "Televentas", "E-commerce"]]
fig = go.Figure([go.Bar(name=c, y=["Enero " + str(a) for a in p.index], x=p[c], orientation="h", marker_color=col, text=[f"{v:.0%}" for v in p[c]],
                        marker_line_color="white", marker_line_width=2) for c, col in zip(p.columns, [AZUL, TEAL, MAGENTA])])
fig.update_layout(barmode="stack", xaxis_tickformat=".0%", yaxis=dict(autorange="reversed"), height=300, legend_title="",
                  title=f"El e-commerce pasó de {porc(p.iloc[0, 2])} a {porc(p.iloc[1, 2])} de la venta de enero")
fig.show()
'''),
        md("## Paso 3 · Generar el tablero web del comité\nUn solo archivo HTML con una lista para elegir la sede. Se abre en cualquier navegador, sin Colab ni internet."),
        code('''
# @title Crear y descargar tablero_comite_enero2026.html
def figuras(c):
    d = ok if c == "Todas" else ok[ok.ciudad == c]
    mt = metas_p if c == "Todas" else metas_p[metas_p.ciudad == c]
    e26, e25 = d[(d.anio == 2026) & (d.mes == 1)].subtotal.sum(), d[(d.anio == 2025) & (d.mes == 1)].subtotal.sum()
    me = mt[(mt.anio == 2026) & (mt.mes == 1)].meta_subtotal.sum()
    k = go.Figure([go.Indicator(mode="number", value=e26 / 1e6, number=dict(prefix="$ ", suffix=" M", valueformat=",.0f"), title="Venta enero 2026", domain=dict(x=[0, 0.3])),
                   go.Indicator(mode="number+delta", value=e26 / me * 100, number=dict(suffix=" %", valueformat=".1f"), delta=dict(reference=100, valueformat=".1f", suffix=" pts"), title="Cumplimiento", domain=dict(x=[0.35, 0.65])),
                   go.Indicator(mode="delta", value=e26 / 1e6, delta=dict(reference=e25 / 1e6, relative=True, valueformat=".1%", font=dict(size=56)), title="Variación contra enero 2025", domain=dict(x=[0.7, 1]))])
    k.update_layout(height=230, margin=dict(t=40, b=10))
    rr = d[d.periodo >= "2025-01-01"].groupby("periodo").subtotal.sum() / 1e6
    mm = mt.assign(periodo=pd.to_datetime(mt.fecha_mes)).query("periodo >= '2025-01-01'").groupby("periodo").meta_subtotal.sum() / 1e6
    t = go.Figure([go.Scatter(x=rr.index, y=rr.values, name="Real", mode="lines+markers", line=dict(color=AZUL, width=3)),
                   go.Scatter(x=mm.index, y=mm.values, name="Meta", mode="lines", line=dict(color=GRIS, dash="dash"))])
    t.update_layout(title="Real contra meta, últimos 13 meses (millones)", height=340, hovermode="x unified")
    eje_meses(t, rr.index)
    cc = d[(d.mes == 1) & d.anio.isin([2025, 2026])]
    pp = pd.crosstab(cc.anio, cc.canal, values=cc.subtotal, aggfunc="sum", normalize="index").reindex(columns=["Presencial", "Televentas", "E-commerce"]).fillna(0)
    ch = go.Figure([go.Bar(name=x, y=["Ene " + str(a) for a in pp.index], x=pp[x], orientation="h", marker_color=col, text=[f"{v:.0%}" for v in pp[x]]) for x, col in zip(pp.columns, [AZUL, TEAL, MAGENTA])])
    ch.update_layout(barmode="stack", title="Participación por canal", xaxis_tickformat=".0%", height=260, yaxis=dict(autorange="reversed"))
    return [k, t, ch]
opciones = ["Todas", *ORDEN_CIUDADES]
cab = f"""<html><head><meta charset="utf-8"><title>Comité comercial · enero 2026</title><style>
body{{font-family:Segoe UI,Arial,sans-serif;max-width:1100px;margin:20px auto;padding:0 16px;color:#11153A}} h1{{color:#00006A;margin:0}}
.meta{{color:#566080}} select{{font-size:16px;padding:6px 10px;margin:14px 0}} .vista{{display:none}} .vista.on{{display:block}}</style></head><body>
<h1>Comité comercial · enero 2026</h1><div class="meta">Distribuidora Andina S.A.S. · venta neta sin anuladas · fuente: ERP con corte al 31/01/2026</div>"""
# cumplimiento de todas las sedes (siempre visible)
cumf = go.Figure(go.Bar(x=cum.values, y=cum.index, orientation="h", marker_color=[TEAL if v >= 1 else MAGENTA for v in cum.values], text=[porc(v) for v in cum.values], textposition="outside"))
cumf.add_vline(x=1, line_dash="dot"); cumf.update_layout(title="Cumplimiento de la meta de enero por sede", xaxis_tickformat=".0%", height=320, xaxis_range=[0, max(1.2, cum.max() + 0.1)])
html = [cab, cumf.to_html(full_html=False, include_plotlyjs=True), '<label>Ver sede: <select id="s">' + "".join(f"<option>{o}</option>" for o in opciones) + "</select></label>"]
for i, o in enumerate(opciones):
    html.append(f'<div class="vista{" on" if i == 0 else ""}" data-o="{o}">' + "".join(f.to_html(full_html=False, include_plotlyjs=False) for f in figuras(o)) + "</div>")
html.append("""<script>document.getElementById('s').onchange=function(){document.querySelectorAll('.vista').forEach(function(v){v.classList.toggle('on',v.dataset.o===this.value);if(v.dataset.o===this.value){v.querySelectorAll('.plotly-graph-div').forEach(function(g){Plotly.Plots.resize(g)})}},this)};</script>
<p class="meta">Datos ficticios · Excel Corporativo · 12 Claves · Dr. Bits</p></body></html>""")
with open("tablero_comite_enero2026.html", "w", encoding="utf-8") as fh:
    fh.write("".join(html))
''' + descargar("tablero_comite_enero2026.html")),
        md("## Paso 4 · Borrador del informe\nUn punto de partida con las cifras de este cuaderno. Reescríbelo con tus palabras y agrega lo que viste en el Panel de Excel."),
        code('''
# @title Generar el borrador
peor, mejor = cum.index[0], cum.index[-1]
display(Markdown(f"""
**INFORME COMERCIAL · ENERO 2026**

1. Enero cerró en **{millones(v26)}**, el **{porc(v26 / meta26)}** de la meta y **{porc(v26 / v25 - 1, signo=True)}** frente a enero de 2025. *Siguiente pregunta:* ¿la caída es de volumen (menos facturas) o de valor (facturas más pequeñas)?
2. **{peor}** llegó al **{porc(cum.iloc[0])}** de su meta y **{mejor}** al **{porc(cum.iloc[-1])}**. *Siguiente pregunta:* ¿qué clientes grandes de {peor} no compraron en enero?
3. El e-commerce pasó de **{porc(p.iloc[0, 2])}** a **{porc(p.iloc[1, 2])}** de la venta de enero. *Siguiente pregunta:* ¿el canal digital está reemplazando ventas presenciales o sumando clientes nuevos?

**Recomendación:** revisar con el coordinador de {peor} la cartera de clientes principales antes del 15 de febrero.
"""))
'''),
        cierre(["Un proceso bien armado se repite cada mes: pegar, actualizar, verificar la cifra de control.",
                "Excel y Colab deben dar la misma cifra; si no, algo se perdió en el camino.",
                "El comité necesita tres respuestas con cifra, comparación y siguiente pregunta, no veinte gráficos."],
               f"[Volver al laboratorio]({PAGES}#laboratorio)"),
    ]


def _encabezado(n, titulo, sub, minutos, archivo):
    from .comun import RAW, colab
    return f"""
<img src="{RAW}/assets/logo-drbits.jpg" alt="Dr. Bits" width="170">

# Taller {n} · {titulo}
**Laboratorio Excel + Colab** — {sub} · ⏱ {minutos} min en Colab

[![Abrir en Colab](https://colab.research.google.com/assets/colab-badge.svg)]({colab(archivo)}) &nbsp; [Ver el taller completo en el tablero]({PAGES}#taller-{n})

Este cuaderno es una parte del taller. Los pasos en Excel están en el tablero.

**Cómo usarlo:** *Archivo › Guardar una copia en Drive* → *Entorno de ejecución › Ejecutar todas*. Las celdas con listas desplegables se pueden cambiar y volver a ejecutar con ▶. No necesitas programar.
"""
