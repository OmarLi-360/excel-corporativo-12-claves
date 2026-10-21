"""Cuadernos de las claves 2, 3 y 4 (tramo Fundamentos), enfoque visual."""
import pandas as pd

from .comun import PAGES, PREPARACION, RAIZ, cierre, code, colab, encabezado, ficha, md, reto, tip_ia


def _pct_texto_erp():
    e = pd.read_csv(RAIZ / "data" / "ventas_erp_sucio.csv", dtype=str, keep_default_na=False)
    v = e["Valor Neto"]
    t = v.str.contains(r"\$")
    num = pd.to_numeric(v.where(~t), errors="coerce").sum()
    txt = v[t].str.replace(r"[\$\.\s]", "", regex=True).astype(float).sum()
    return round(txt / (num + txt) * 100)


# ============================================================================
# 02 · Tipos de dato que no engañan
# ============================================================================
def cuaderno_02():
    p = _pct_texto_erp()
    opciones = [f"{x} %" for x in sorted({max(p - 12, 2), p, p + 13, 50})]
    return [
        encabezado("Clave 2", "Tipos de dato que no engañan", "Números, textos y fechas", 30, [
            "Ver cuánto de una columna está guardado como texto.",
            "Medir cuánto dinero deja por fuera una suma.",
            "Entender por qué las fechas en varios formatos impiden analizar por mes."], "02_tipos_de_dato.ipynb", "clave-02"),
        code(PREPARACION),
        md("""
## 1 · La exportación, como la ve Excel
La exportación del ERP llega con montos escritos con símbolo y puntos (`$ 1.234.567`), cantidades con la unidad pegada (`33 und`) y fechas en tres formatos. Para Excel, todo lo que no es claramente un número o una fecha queda como **texto**, y el texto no se suma ni se agrupa por mes.
"""),
        code('''
# @title Leer la hoja ERP_Sucio y ver qué tipo guarda Excel en cada celda
hoja = pd.read_excel(ruta("Distribuidora_Andina_practica.xlsx"), sheet_name="ERP_Sucio", dtype=object)
def tipo(x):
    if x is None or (isinstance(x, float) and np.isnan(x)): return "Vacía"
    if isinstance(x, str): return "Texto (con unidad)" if "und" in x else "Texto"
    return "Número"
tipos = pd.DataFrame({c: hoja[c].map(tipo) for c in ["Valor Neto", "Cantidad", "Fecha"]})
conteo = pd.concat({c: tipos[c].value_counts() for c in tipos}, axis=1).fillna(0).astype(int)
display(conteo.style.format(miles))
display(Markdown("Así guarda Excel cada celda del libro de práctica. **Ojo:** si abres el CSV directamente, Excel intenta adivinar los tipos según la configuración regional del equipo, y el resultado cambia de un computador a otro. Por eso se practica con el libro."))
'''),
        ficha("¿Qué parte de cada columna llega como texto?", "Barras apiladas al 100 %: proporción de celdas que son número, texto o están vacías, por columna",
              "Compara la composición de dos columnas de un vistazo.", "Una tabla de conteos: los números absolutos no muestran la proporción.",
              "El segmento magenta es lo que SUMA va a ignorar.", "=CONTAR (números) y =CONTARA (no vacías) sobre cada columna."),
        code('''
# @title Gráfico 1 · Número, texto o vacía
prop = conteo / conteo.sum()
fig = go.Figure()
for estado, color in [("Número", AZUL), ("Texto", MAGENTA), ("Texto (con unidad)", MAGENTA), ("Vacía", GRIS)]:
    if estado in prop.index:
        fig.add_bar(name=estado, y=prop.columns, x=prop.loc[estado], orientation="h", marker_color=color,
                    text=[f"{v:.0%}" if v > 0.03 else "" for v in prop.loc[estado]], marker_line_color="white", marker_line_width=2)
txt_valor = prop.loc["Texto", "Valor Neto"]
fig.update_layout(barmode="stack", xaxis_tickformat=".0%", height=300, legend_title="",
                  title=f"Cantidad y Fecha llegaron completas como texto; Valor Neto, el {porc(txt_valor)}")
fig.show()
'''),
        md("## 2 · ¿Cuánto dinero ignora SUMA?"),
        ficha("¿Cuánto falta en el total si se suma la columna tal como llegó?", "Dos barras: lo que suma Excel (solo números) y el total real (después de convertir)",
              "El mensaje es una diferencia entre dos cifras.", "Una tarjeta con el porcentaje: se pierde la magnitud en pesos.",
              "La distancia entre las barras es el dinero que el informe no mostraría.", "Compara =SUMA(columna original) con =SUMA(columna convertida con VALOR)."),
        code('''
# @title Gráfico 2 · Suma de Excel frente a total real
v = hoja["Valor Neto"]
es_txt = v.map(lambda x: isinstance(x, str))
suma_excel = v[~es_txt].dropna().astype(float).sum()
suma_texto = v[es_txt].str.replace(r"[$.\\s]", "", regex=True).astype(float).sum()
valor_real = v.map(lambda x: float(x.replace("$", "").replace(".", "").strip()) if isinstance(x, str) else x).astype(float)
falta = suma_texto / (suma_excel + suma_texto)
comp = pd.Series({"Lo que suma Excel": suma_excel, "Total real": suma_excel + suma_texto}) / 1e6
fig = go.Figure(go.Bar(x=comp.values, y=comp.index, orientation="h", marker_color=[MAGENTA, AZUL],
                       text=[f"$ {v:,.0f} M".replace(",", ".") for v in comp.values], textposition="outside", cliponaxis=False))
fig.update_layout(title=f"SUMA deja por fuera {millones(suma_texto)}: el {porc(falta)} del valor", xaxis_title=MM, height=260)
dar_aire(fig, comp.max())
fig.show()
'''),
        md("## 3 · Fechas en tres formatos"),
        ficha("¿En cuántos formatos llegaron las fechas?", "Barras: número de filas por formato de fecha",
              "Pocas categorías, una medida.", "Torta: la pregunta no es la proporción sino que existan varios formatos.",
              "Cada barra es un formato que necesita su propia conversión.", "Filtro de texto sobre la columna, o =ESNUMERO(FECHANUMERO(C2))."),
        code('''
# @title Gráfico 3 · Formatos de fecha
def formato_fecha(x):
    x = str(x)
    if "/" in x: return "dd/mm/aaaa"
    if "-" in x: return "aaaa-mm-dd"
    return "Número serial (como texto)"
fmt = hoja["Fecha"].map(formato_fecha).value_counts().sort_values()
fig = go.Figure(go.Bar(x=fmt.values, y=fmt.index, orientation="h", marker_color=[TEAL, TEAL, AZUL][-len(fmt):],
                       text=[miles(v) for v in fmt.values], textposition="outside", cliponaxis=False))
fig.update_layout(title=f"Las fechas llegaron en {len(fmt)} formatos distintos", xaxis_title="Filas", height=260)
dar_aire(fig, fmt.max())
fig.show()
'''),
        ficha("¿Qué se pierde si solo se convierte el formato más común?", "Líneas: venta mensual con las fechas convertidas según la opción elegida",
              "Es una serie de tiempo: la línea muestra los meses que se pierden o quedan bajos.", "Una tabla mensual: los huecos no se ven.",
              "Compara las dos opciones: con una sola conversión, cada mes queda más bajo de lo real.", "Columna con =SI.ERROR(FECHANUMERO(C2);VALOR(C2)) y luego tabla dinámica por mes."),
        code('''
# @title Gráfico 4 · Venta mensual según cómo se conviertan las fechas
conversion = "Todos los formatos"  # @param ["Solo dd/mm/aaaa", "Todos los formatos"]
def a_fecha(s):
    s = str(s)
    if "/" in s: return pd.to_datetime(s, format="%d/%m/%Y")
    if conversion == "Solo dd/mm/aaaa": return pd.NaT
    if "-" in s: return pd.to_datetime(s, format="%Y-%m-%d")
    return pd.Timestamp("1899-12-30") + pd.Timedelta(days=int(s))
x = hoja.assign(f=hoja["Fecha"].map(a_fecha), valor=valor_real)
perdidas = x["f"].isna().mean()
m = x.dropna(subset=["f"]).groupby(x["f"].dt.to_period("M"))["valor"].sum() / 1e6
fig = go.Figure(go.Scatter(x=m.index.to_timestamp(), y=m.values, mode="lines+markers", line=dict(color=AZUL if conversion != "Solo dd/mm/aaaa" else MAGENTA)))
eje_meses(fig, m.index.to_timestamp())
fig.update_layout(title=f"{conversion}: quedan por fuera el {porc(perdidas)} de las filas", yaxis_title=MM, height=340)
fig.show()
'''),
        md("## 4 · Retos de interpretación"),
        reto(1, "¿Qué parte del valor de la columna Valor Neto ignora SUMA?", opciones,
             'f"{falta:.0%}".replace("%", " %")', "Es la distancia entre las dos barras del gráfico 2."),
        reto(2, "Una celda de la columna Fecha muestra 45299. ¿Qué haces?",
             ["Borrarla", "Convertirla con VALOR y darle formato de fecha", "Escribir la fecha a mano", "Nada: ya es una fecha"],
             '"Convertirla con VALOR y darle formato de fecha"', "45299 es un número serial que llegó como texto: VALOR lo vuelve número y el formato lo muestra como fecha."),
        reto(3, "¿Qué fórmula cuenta cuántos textos hay en una columna que debería ser numérica?",
             ["=CONTAR(I:I)", "=CONTARA(I:I)-CONTAR(I:I)", "=SUMA(I:I)", "=CONTAR.BLANCO(I:I)"],
             '"=CONTARA(I:I)-CONTAR(I:I)"', "CONTARA cuenta lo no vacío; CONTAR, solo números. La diferencia son los textos."),
        tip_ia("Cuando una suma no cuadre, pide un diagnóstico del tipo de dato:",
               """Tengo una columna de Excel 365 donde =CONTAR da 1.450 y =CONTARA da 1.816.
Estos son 8 valores de muestra tal como aparecen: [pega aquí]
Dime qué tipos de problema hay y dame una fórmula en español (separador ;) para convertir todos en número."""),
        cierre(["El formato cambia cómo se ve un valor, no lo que es.", "SUMA ignora los textos sin avisar: compara CONTAR con CONTARA.",
                "Una columna de fechas en varios formatos necesita una conversión por formato, o Power Query."],
               f"[Clave 3 · Referencias que se copian bien]({PAGES}#clave-03) · [Cuaderno 03]({colab('03_referencias.ipynb')})"),
    ]


# ============================================================================
# 03 · Referencias que se copian bien
# ============================================================================
def cuaderno_03():
    return [
        encabezado("Clave 3", "Referencias que se copian bien", "Relativas, absolutas y mixtas", 25, [
            "Ver qué calcula cada celda cuando una fórmula se copia con y sin $.",
            "Reconocer en un informe el efecto de un total que no estaba fijo.",
            "Entender por qué un valor de entrada va en una sola celda."], "03_referencias.ipynb", "clave-03"),
        code(PREPARACION),
        md("""
## 1 · Cuatro formas de la misma celda

| Escrita como | Al copiar hacia abajo | Al copiar a la derecha | Se usa para |
|---|---|---|---|
| `B5` | cambia la fila | cambia la columna | Lo normal: cada fila usa su propio dato |
| `$B$5` | no cambia | no cambia | Una tasa, un total, una fecha de corte |
| `$B5` | cambia la fila | **no** cambia | Una columna de datos que se lee desde varias columnas |
| `B$5` | **no** cambia | cambia la columna | Una fila de encabezados (escenarios, meses) |

El ejercicio de la hoja **Referencias**: proyectar la venta 2025 de cada sede con cuatro escenarios de crecimiento, escribiendo **una sola fórmula** en C5 y copiándola a toda la tabla.
"""),
        code('''
# @title Preparar la venta base y los escenarios
base = validas[validas.anio == 2025].groupby("ciudad")["subtotal"].sum().reindex(sedes.ciudad) / 1e6
esc = [-0.05, 0.0, 0.05, 0.10]
display(base.to_frame("Venta 2025 (millones)").style.format(lambda v: f"{v:,.0f}".replace(",", ".")))
'''),
        ficha("¿Qué calcula cada celda si la fórmula se copia con estas referencias?", "Mapa de calor: sedes × escenarios · Celdas grises: la fórmula apunta a una celda equivocada",
              "La tabla de doble entrada se ve como una cuadrícula; el gris marca exactamente dónde falla la copia.", "Solo el número de errores: no se vería el patrón (fila o columna equivocada).",
              "Con $B5 y C$4 toda la cuadrícula tiene color. Prueba las otras opciones y mira qué fila o columna se apaga.", "Escribe la fórmula en C5 de la hoja Referencias y cópiala hasta F10."),
        code('''
# @title Gráfico 1 · Copiar la fórmula a toda la tabla
ref_base = "$B5"  # @param ["$B5", "B5", "$B$5", "B$5"]
ref_escenario = "C$4"  # @param ["C$4", "C4", "$C$4", "$C4"]
def apunta(ref, df, dc):
    col_fija, fila_fija = ref.startswith("$"), "$" in ref[1:]
    letra = ref.replace("$", "")[0]; fila = int(ref.replace("$", "")[1:])
    return (ord(letra) - 64 + (0 if col_fija else dc), fila + (0 if fila_fija else df))
z, txt, ok = [], [], 0
for i, s in enumerate(base.index):
    fz, ft = [], []
    for j, e in enumerate(esc):
        b, c = apunta(ref_base, i, j), apunta(ref_escenario, i, j)
        bien = b == (2, 5 + i) and c == (3 + j, 4)
        ok += bien
        fz.append(base[s] * (1 + e) if bien else np.nan)
        ft.append(f"{base[s] * (1 + e):,.0f}".replace(",", ".") if bien else f"✗ {chr(64 + b[0])}{b[1]}")
    z.append(fz); txt.append(ft)
fig = go.Figure(go.Heatmap(z=z, x=[f"{e:+.0%}" for e in esc], y=list(base.index), text=txt, texttemplate="%{text}",
                           colorscale=[[0, "#EEF2FF"], [1, AZUL]], showscale=False, hoverongaps=False))
fig.update_layout(title=f"={ref_base}*(1+{ref_escenario}) copiada: {ok} de 24 celdas correctas",
                  yaxis=dict(autorange="reversed"), height=360, plot_bgcolor="#E4E8F2")
fig.show()
display(Markdown("Las celdas grises muestran a qué celda apunta la venta base cuando la copia sale mal." if ok < 24 else "Toda la tabla quedó bien: la venta base fija en la columna B y el escenario fijo en la fila 4."))
'''),
        md("## 2 · El total que no estaba fijo"),
        ficha("¿Qué ve el lector del informe cuando la participación se copió sin $?", "Dos paneles: participación por sede con =B5/B$11 y con =B5/B11 copiada",
              "Lado a lado, la diferencia salta a la vista: el informe correcto y el que llega con errores.", "Explicar el error con texto: no se ve la consecuencia.",
              "A la derecha solo sobrevive la primera sede; las demás son #DIV/0! porque dividen por celdas vacías.", "H5: =B5/B$11 y copiar hasta H10."),
        code('''
# @title Gráfico 2 · Participación con y sin $
from plotly.subplots import make_subplots
part = base / base.sum()
mal = pd.Series([part.iloc[0]] + [np.nan] * (len(part) - 1), index=part.index)
fig = make_subplots(rows=1, cols=2, subplot_titles=["=B5/B$11 (total fijo)", "=B5/B11 copiada (total que se mueve)"], shared_yaxes=True)
fig.add_bar(y=part.index, x=part.values, orientation="h", marker_color=AZUL, text=[porc(v) for v in part.values], textposition="outside", row=1, col=1, showlegend=False)
fig.add_bar(y=mal.index, x=mal.fillna(0).values, orientation="h", marker_color=MAGENTA, text=[porc(v) if v == v else "#DIV/0!" for v in mal.values], textposition="outside", row=1, col=2, showlegend=False)
fig.update_xaxes(tickformat=".0%", range=[0, part.max() * 1.6])
fig.update_layout(title="Con el total fijo, las seis sedes suman 100 %; sin él, el informe sale con cinco errores", yaxis=dict(autorange="reversed"), height=360)
fig.show()
'''),
        md("## 3 · Un dato de entrada, una sola celda"),
        ficha("¿Cuánto cambia la venta con IVA si cambia la tasa?", "Barras: venta con IVA por sede, calculada con la tasa que elijas",
              "Comparación de una medida entre sedes; al cambiar la tasa, todas las barras cambian a la vez, igual que en Excel con $K$1.", "Tasa escrita dentro de cada fórmula (*1,19): habría que corregir seis fórmulas.",
              "Cambia la tasa en la lista y mira que todo se recalcula desde un solo lugar.", "J5: =B5*(1+$K$1) o =B5*(1+IVA) con un nombre definido."),
        code('''
# @title Gráfico 3 · Venta con IVA según la tasa
tasa = "19 %"  # @param ["19 %", "5 %", "0 %"]
t = int(tasa.split()[0]) / 100
con_iva = (base * (1 + t)).sort_values()
fig = go.Figure(go.Bar(x=con_iva.values, y=con_iva.index, orientation="h", marker_color=AZUL,
                       text=[f"$ {v:,.0f} M".replace(",", ".") for v in con_iva.values], textposition="outside", cliponaxis=False))
fig.update_layout(title=f"Con IVA del {tasa}, la venta total sería {millones(con_iva.sum() * 1e6)}", xaxis_title=MM, height=340)
dar_aire(fig, con_iva.max())
fig.show()
'''),
        md("## 4 · Retos de interpretación"),
        reto(1, "En C5 está =B5/B11. ¿Qué fórmula queda en C6 al copiarla hacia abajo?", ["=B5/B11", "=B6/B11", "=B6/B12", "=C6/C12"],
             '"=B6/B12"', "Las dos referencias son relativas y bajan una fila. B12 está vacía: #DIV/0!."),
        reto(2, "¿Qué fórmula en C5 llena bien toda la tabla de escenarios?", ["=B5*(1+C4)", "=$B$5*(1+$C$4)", "=$B5*(1+C$4)", "=B$5*(1+$C4)"],
             '"=$B5*(1+C$4)"', "Columna de la venta base fija ($B) y fila de escenarios fija (C$4): 24 de 24 en el gráfico 1."),
        reto(3, "La tasa de IVA está en $K$1. Si cambia, ¿cuántas celdas hay que modificar?", ["1", "6", "24", "Todas las fórmulas"],
             '"1"', "Esa es la razón de poner los datos de entrada en una celda propia."),
        tip_ia("Si una fórmula copiada da resultados raros, pide que te expliquen la copia celda por celda:",
               """En Excel escribí =B5/B11 en C5 y la copié hasta C10. Dime qué fórmula queda en cada celda de C6 a C10,
qué resultado da cada una y cómo corregirla con $ o con un nombre definido."""),
        cierre(["Al copiar, las referencias se mueven: el $ fija lo que no debe moverse.", "Pregunta: ¿debe cambiar al copiar hacia abajo? ¿y a la derecha?",
                "Los datos de entrada (tasas, totales, fechas de corte) van en una sola celda."],
               f"[Clave 4 · Lógica condicional legible]({PAGES}#clave-04) · [Cuaderno 04]({colab('04_logica_condicional.ipynb')})"),
    ]


# ============================================================================
# 04 · Lógica condicional legible
# ============================================================================
def cuaderno_04():
    return [
        encabezado("Clave 4", "Lógica condicional legible", "La cartera de la empresa, clasificada por reglas", 30, [
            "Ver cómo una regla de negocio clasifica la cartera pendiente.",
            "Comparar el efecto de Y frente a O en una regla de alerta.",
            "Medir lo que esconde un SI.ERROR mal usado."], "04_logica_condicional.ipynb", "clave-04"),
        code(PREPARACION),
        md("""
## 1 · La regla de Cartera
| Si los días de mora son… | La factura queda en |
|---|---|
| 0 o menos | No vencida |
| de 1 a 30 | 1–30 |
| de 31 a 60 | 31–60 |
| más de 60 | Más de 60 |

**Días de mora** = fecha de corte − fecha de vencimiento. **Fecha de vencimiento** = fecha de la factura + días de crédito del cliente. Solo cuentan las facturas en estado *Pendiente*.
"""),
        code('''
# @title Preparar la cartera y elegir la fecha de corte
corte = "2026-01-31"  # @param ["2026-01-31", "2025-12-31"]
p = (ventas[ventas.estado == "Pendiente"].groupby("id_factura")
     .agg(fecha=("fecha", "first"), id_cliente=("id_cliente", "first"), id_sede=("id_sede", "first"), total=("total", "sum")).reset_index()
     .merge(clientes[["id_cliente", "razon_social", "dias_credito"]], on="id_cliente").merge(sedes[["id_sede", "ciudad"]], on="id_sede"))
p["vencimiento"] = p.fecha + pd.to_timedelta(p.dias_credito, unit="D")
p["dias_mora"] = (pd.Timestamp(corte) - p.vencimiento).dt.days
RANGOS = ["No vencida", "1–30", "31–60", "Más de 60"]
def rango(d):                     # lo mismo que SI.CONJUNTO, en el mismo orden
    if d <= 0: return "No vencida"
    if d <= 30: return "1–30"
    if d <= 60: return "31–60"
    return "Más de 60"
p["rango"] = p.dias_mora.map(rango)
display(Markdown(f"**{len(p)} facturas pendientes** por **{millones(p.total.sum())}**, con corte al {pd.Timestamp(corte):%d/%m/%Y}."))
'''),
        ficha("¿Cuánta plata está en cada rango de mora?", "Barras: valor pendiente por rango, en el orden de la regla · Etiqueta: número de facturas",
              "El orden de los rangos es parte del mensaje (de menos a más grave), así que no se ordena por tamaño.", "Torta: no muestra el orden de gravedad.",
              "Las barras de la derecha son las que preocupan. Cambia el corte arriba y vuelve a ejecutar: la misma cartera envejece.", "Tabla dinámica con rango en Filas y total en Valores, con los rangos ordenados a mano."),
        code('''
# @title Gráfico 1 · Cartera por rango de mora
r = p.groupby("rango").agg(valor=("total", "sum"), n=("id_factura", "size")).reindex(RANGOS).fillna(0)
colores = [AZUL, TEAL, MAGENTA, "#7A1F3D"]
fig = go.Figure(go.Bar(x=RANGOS, y=r.valor / 1e6, marker_color=colores,
                       text=[f"$ {v / 1e6:,.0f} M · {int(n)} fact.".replace(",", ".") for v, n in zip(r.valor, r.n)], textposition="outside", cliponaxis=False))
vencida = r.loc[RANGOS[1:], "valor"].sum() / r.valor.sum()
fig.update_layout(title=f"Con corte al {pd.Timestamp(corte):%d/%m/%Y}, el {porc(vencida)} de la cartera está vencida", yaxis_title=MM, height=380)
dar_aire(fig, r.valor.max() / 1e6, "y")
fig.show()
mayor = r.valor.idxmax()
'''),
        ficha("¿Qué sede tiene la cartera más envejecida?", "Barras apiladas al 100 %: composición de la cartera de cada sede por rango, ordenadas por porcentaje vencido",
              "Compara la composición entre sedes sin que el tamaño de Bogotá lo domine.", "Valores absolutos: Bogotá parecería la peor solo por ser la más grande.",
              "Mira el ancho de los colores de la derecha en cada barra.", "Dinámica sede × rango con Mostrar valores como › % del total de fila."),
        code('''
# @title Gráfico 2 · Envejecimiento por sede
c = pd.crosstab(p.ciudad, p.rango, values=p.total, aggfunc="sum", normalize="index").reindex(columns=RANGOS).fillna(0)
c = c.loc[(1 - c["No vencida"]).sort_values().index]
fig = go.Figure([go.Bar(name=k, y=c.index, x=c[k], orientation="h", marker_color=col, marker_line_color="white", marker_line_width=2,
                        text=[f"{v:.0%}" if v > 0.06 else "" for v in c[k]]) for k, col in zip(RANGOS, colores)])
fig.update_layout(barmode="stack", xaxis_tickformat=".0%", legend_title="", height=360,
                  title=f"{c.index[-1]} tiene la cartera más envejecida: {porc(1 - c['No vencida'].iloc[-1])} vencida")
fig.show()
'''),
        md("## 2 · Y frente a O\nLa regla de alerta es «Llamar hoy si la mora supera X días **y** el total supera Y pesos». Cambia el operador y los umbrales."),
        ficha("¿Qué facturas quedan en «Llamar hoy» con la regla elegida?", "Dispersión: un punto por factura · Eje X: días de mora · Eje Y: total · Color: alerta · Líneas: umbrales",
              "Muestra la regla como una zona del gráfico: con Y es la esquina superior derecha; con O, todo lo que pasa cualquiera de las dos líneas.", "Una tabla filtrada: no se ve por qué una factura entra y otra no.",
              "Los puntos magenta son los que se llaman hoy. Compara cuántos hay con Y y con O.", '=SI(Y([@dias_mora]>30;[@total]>5000000);"Llamar hoy";"Seguimiento normal")'),
        code('''
# @title Gráfico 3 · La regla de alerta como zona
operador = "Y"  # @param ["Y", "O"]
dias = "30"  # @param ["15", "30", "45"]
monto_millones = "5"  # @param ["2", "5", "10"]
d, m = int(dias), int(monto_millones) * 1e6
cond = (p.dias_mora > d) & (p.total > m) if operador == "Y" else (p.dias_mora > d) | (p.total > m)
p["alerta"] = np.where(cond, "Llamar hoy", "Seguimiento normal")
fig = px.scatter(p, x="dias_mora", y=p.total / 1e6, color="alerta", hover_name="razon_social",
                 color_discrete_map={"Llamar hoy": MAGENTA, "Seguimiento normal": GRIS})
fig.add_vline(x=d, line_dash="dot"); fig.add_hline(y=m / 1e6, line_dash="dot")
fig.update_traces(marker_size=9, marker_line_color="white", marker_line_width=1)
llamar = (p.alerta == "Llamar hoy").sum()
fig.update_layout(title=f"Con «{operador}»: {llamar} facturas para llamar hoy ({millones(p.loc[p.alerta == 'Llamar hoy', 'total'].sum())})",
                  xaxis_title="Días de mora", yaxis_title="Total de la factura (millones)", legend_title="", height=420)
fig.show()
'''),
        md("## 3 · Lo que esconde un SI.ERROR mal usado\nEn la vida real algunas fechas llegan mal escritas. Simulamos 8 facturas con la fecha de vencimiento dañada."),
        ficha("¿Dónde terminan las facturas con fecha dañada según cómo se maneje el error?", 'Barras agrupadas: facturas por rango, con SI.ERROR(…;0) y con SI.ERROR(…;"Revisar fecha")',
              "Las dos versiones lado a lado muestran a dónde «se esconden» los errores.", "Contar errores: no muestra que el 0 los mete entre las facturas al día.",
              "Con 0, las dañadas inflan «No vencida». Con «Revisar fecha», aparecen como una categoría que alguien debe corregir.", '=SI.ERROR($K$2-[@fecha_vencimiento];"Revisar fecha")'),
        code('''
# @title Gráfico 4 · SI.ERROR con 0 frente a «Revisar fecha»
danadas = p.sample(8, random_state=7).index
con_cero = p.rango.copy(); con_cero[danadas] = "No vencida"
con_aviso = p.rango.copy(); con_aviso[danadas] = "Revisar fecha"
orden = RANGOS + ["Revisar fecha"]
a = con_cero.value_counts().reindex(orden).fillna(0); b = con_aviso.value_counts().reindex(orden).fillna(0)
fig = go.Figure([go.Bar(name="SI.ERROR(…;0)", x=orden, y=a, marker_color=GRIS, text=a.astype(int)),
                 go.Bar(name="SI.ERROR(…;\\"Revisar fecha\\")", x=orden, y=b, marker_color=AZUL, text=b.astype(int))])
fig.update_layout(barmode="group", title="Con 0, las 8 facturas dañadas se esconden entre las «No vencidas»", yaxis_title="Facturas", legend_title="", height=380)
fig.show()
'''),
        md("## 4 · Retos de interpretación"),
        reto(1, "Con el corte que elegiste, ¿qué rango concentra más dinero?", ["No vencida", "1–30", "31–60", "Más de 60"],
             "mayor", "Es la barra más alta del gráfico 1."),
        reto(2, "Si la regla de alerta usa O en lugar de Y, las facturas en «Llamar hoy»…", ["Aumentan", "Disminuyen", "Quedan iguales"],
             '"Aumentan"', "Con O basta cumplir una de las dos condiciones: la zona del gráfico 3 se agranda."),
        reto(3, "=SI.CONJUNTO(A2<=60; «31–60»; A2<=30; «1–30»; VERDADERO; «Más de 60») con A2 = 10 devuelve…", ["1–30", "31–60", "Más de 60"],
             '"31–60"', "SI.CONJUNTO devuelve la primera prueba verdadera: el orden de las pruebas es parte de la regla."),
        tip_ia("Pídele a la IA que convierta la regla en fórmula y, sobre todo, que te dé los casos límite para probarla:",
               """Regla de Cartera: 0 o menos días de mora = "No vencida"; 1 a 30 = "1–30"; 31 a 60 = "31–60"; más de 60 = "Más de 60".
Escríbela en Excel 365 en español con SI.CONJUNTO y la columna [@dias_mora]. Dame los casos de prueba de los límites (0, 1, 30, 31, 60, 61) con el resultado esperado."""),
        cierre(["Primero la regla en una tabla de decisión; después la fórmula.", "SI.CONJUNTO evalúa en orden: la primera prueba verdadera gana.",
                "Y estrecha la regla; O la amplía. SI.ERROR no debe esconder datos que alguien tiene que corregir."],
               f"[Clave 5 · Buscar y cruzar sin #N/D]({PAGES}#clave-05) · [Cuaderno 05]({colab('05_busqueda_y_cruce.ipynb')})"),
    ]
