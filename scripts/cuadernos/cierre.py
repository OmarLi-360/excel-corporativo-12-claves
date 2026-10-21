"""Cuadernos de las claves 10, 11 y 12 (tramo Control y comunicación), enfoque visual."""
from .comun import PAGES, PREPARACION, cierre, code, colab, datos, encabezado, ficha, md, reto, tip_ia


def _top_bogota():
    _, val, s, _ = datos()
    import pandas as pd
    from pathlib import Path
    c = pd.read_csv(Path(__file__).resolve().parents[2] / "data" / "clientes.csv")
    x = (val[(val.ciudad == "Bogotá") & (val.anio == 2025)].merge(c[["id_cliente", "razon_social"]], on="id_cliente")
         .groupby("razon_social")["subtotal"].sum().sort_values(ascending=False))
    acum = x.cumsum() / x.sum()
    return x.index[:4].tolist(), int((acum < 0.5).sum() + 1)


# ============================================================================
# 10 · Fórmulas de matriz dinámica
# ============================================================================
def cuaderno_10():
    top4, n50 = _top_bogota()
    return [
        encabezado("Clave 10", "Fórmulas de matriz dinámica", "FILTRAR, UNICOS, ORDENAR, TOMAR y LET", 25, [
            "Ver la lista que devuelve la fórmula del top de clientes para cualquier sede.",
            "Medir cuántos clientes concentran la mitad de la venta de cada sede.",
            "Contar clientes únicos por sede y año, como hace CONTARA(UNICOS(…))."],
            "10_matriz_dinamica.ipynb", "clave-10"),
        code(PREPARACION),
        md("""
## 1 · La lista que se actualiza sola
En la hoja **Top_Clientes** de `Andina_listo_para_dinamicas.xlsx`, una sola fórmula devuelve los mejores clientes de la sede elegida:

`=LET(c;D6#;v;E6#;TOMAR(ORDENAR(APILARH(c;v);2;-1);$B$4))`

donde D6# es la lista de clientes únicos (`UNICOS(FILTRAR(…))`) y E6# su venta (`SUMAR.SI.CONJUNTO(…;D6#;…)`). Aquí ves el mismo resultado. Cambia la sede, el año o el número de clientes.
"""),
        ficha("¿Quiénes son los mejores clientes de la sede y cuánto pesan?", "Barras horizontales ordenadas: venta neta de los primeros clientes, en millones",
              "Es un ranking: las barras ordenadas se leen de arriba abajo, como la lista de Excel.",
              "Una tabla sola: muestra los nombres, pero no la distancia entre el primero y los demás.",
              "La primera barra es el cliente más importante; el título dice cuánto suman todos juntos.",
              "Hoja Top_Clientes: sede en B2, año en B3 y cuántos en B4."),
        code('''
# @title Gráfico 1 · Top de clientes de la sede
sede = "Bogotá"  # @param ["Bogotá", "Medellín", "Cali", "Barranquilla", "Bucaramanga", "Pereira"]
anio = 2025  # @param [2024, 2025]
cuantos = 10  # @param {type:"slider", min:5, max:20, step:1}
por_cliente = (validas[(validas.ciudad == sede) & (validas.anio == anio)]
               .groupby("razon_social")["subtotal"].sum().sort_values(ascending=False))
top = por_cliente.head(cuantos)[::-1] / 1e6
fig = go.Figure(go.Bar(x=top.values, y=top.index, orientation="h", marker_color=[GRIS] * (len(top) - 1) + [AZUL],
                       text=[f"{v:,.0f}".replace(",", ".") for v in top.values], textposition="outside", cliponaxis=False))
fig.update_layout(title=f"Los {cuantos} primeros clientes de {sede} suman el {porc(por_cliente.head(cuantos).sum() / por_cliente.sum())} de su venta {anio}",
                  xaxis_title=MM, height=200 + 26 * cuantos, margin=dict(l=10))
dar_aire(fig, top.max())
fig.show()
display(Markdown(f"UNICOS devolvió **{len(por_cliente)} clientes** en {sede} durante {anio}; TOMAR se quedó con {cuantos}."))
'''),
        md("## 2 · ¿Cuántos clientes hacen la mitad de la venta?"),
        ficha("¿Qué tan concentrada está la venta de cada sede?", "Líneas: porcentaje acumulado de la venta a medida que se suman clientes, de mayor a menor · Línea punteada: 50 %",
              "Una curva por sede permite comparar la concentración: la que sube más rápido depende de menos clientes.",
              "Barras del top 10 por sede: seis gráficos que no se comparan entre sí.",
              "Donde cada curva cruza el 50 % está el número de clientes que hacen la mitad de la venta.",
              "Con la lista de A7 ordenada: =SUMA(TOMAR(B7#;n))/SUMA(B7#) para distintos n, o una columna de acumulado con =ESCANEAR."),
        code('''
# @title Gráfico 2 · Concentración de la venta por sede
fig = go.Figure()
cruces = {}
for i, s in enumerate(ORDEN_CIUDADES):
    x = validas[(validas.ciudad == s) & (validas.anio == anio)].groupby("razon_social")["subtotal"].sum().sort_values(ascending=False)
    acum = (x.cumsum() / x.sum()).values
    cruces[s] = int((acum < 0.5).sum() + 1)
    fig.add_scatter(x=list(range(1, len(acum) + 1)), y=acum, name=f"{s} ({cruces[s]})", mode="lines",
                    line=dict(width=3 if s == sede else 1.5, color=AZUL if s == sede else GRIS))
fig.add_hline(y=0.5, line_dash="dot", line_color=MAGENTA, annotation_text="50 %", annotation_position="bottom right")
fig.update_layout(title=f"{anio}: en {sede} bastan {cruces[sede]} clientes para la mitad de la venta",
                  xaxis_title="Clientes, de mayor a menor venta", yaxis_tickformat=".0%", height=440, legend=dict(title="Clientes para el 50 %:", orientation="h", y=-0.25))
fig.show()
'''),
        md("## 3 · Clientes únicos"),
        ficha("¿Cuántos clientes distintos compraron en cada sede?", "Columnas agrupadas: clientes únicos por sede en 2024 y 2025",
              "Comparar dos años por sede: columnas lado a lado, con el año más reciente en el color fuerte.",
              "Líneas: con solo dos puntos por sede no hay tendencia que mostrar.",
              "Si una sede vende más con menos clientes, su venta depende más de pocos clientes.",
              "=CONTARA(UNICOS(FILTRAR(tVentas[cliente];(tVentas[ciudad]=A2)*(tVentas[anio]=2025))))"),
        code('''
# @title Gráfico 3 · Clientes únicos por sede y año
unicos = validas.groupby(["ciudad", "anio"])["id_cliente"].nunique().unstack().reindex(ORDEN_CIUDADES)
fig = go.Figure()
for a, color in [(2024, GRIS), (2025, AZUL)]:
    fig.add_bar(name=str(a), x=unicos.index, y=unicos[a], marker_color=color, text=unicos[a], textposition="outside")
cambio = (unicos[2025] - unicos[2024])
fig.update_layout(barmode="group", yaxis_title="Clientes únicos", height=380, legend_title="",
                  title=f"De 2024 a 2025 la sede que más clientes sumó fue {cambio.idxmax()} (+{cambio.max()})")
fig.show()
'''),
        md("## 4 · Retos de interpretación"),
        reto(1, "¿Quién es el mejor cliente de Bogotá en 2025?", top4,
             'validas[(validas.ciudad == "Bogotá") & (validas.anio == 2025)].groupby("razon_social")["subtotal"].sum().idxmax()',
             "Es la primera fila de la lista que devuelve la fórmula con B2 = Bogotá y B3 = 2025."),
        reto(2, "¿Cuántos clientes hacen la mitad de la venta de Bogotá en 2025?", [str(x) for x in sorted({n50, n50 + 7, max(n50 - 5, 2), n50 * 3})],
             'str(int(((lambda x: x.cumsum() / x.sum())(validas[(validas.ciudad == "Bogotá") & (validas.anio == 2025)].groupby("razon_social")["subtotal"].sum().sort_values(ascending=False)) < 0.5).sum() + 1))',
             "Es el punto donde la curva de Bogotá cruza la línea del 50 % (con año 2025 en el gráfico 1)."),
        reto(3, "La fórmula del top muestra #¡DESBORDAMIENTO!. ¿Qué significa?",
             ["Que la fórmula está mal escrita", "Que hay celdas ocupadas donde debe derramarse el resultado", "Que faltan datos", "Que el libro es muy grande"],
             '"Que hay celdas ocupadas donde debe derramarse el resultado"', "Se despeja el espacio y el resultado aparece; la fórmula no se toca."),
        tip_ia("Para construir una lista que se actualice sola:",
               """En Excel 365 en español (separador ;) tengo la Tabla tVentas con cliente, ciudad, anio, estado y subtotal.
Quiero los 10 clientes con más venta neta de la sede de B2 y el año de B3, sin anuladas, en una sola fórmula con LET.
Explica cada paso y qué hago si aparece #¡DESBORDAMIENTO!."""),
        cierre(["Una fórmula de matriz dinámica devuelve una lista completa que se recalcula sola.",
                "D6# se refiere a todo el resultado derramado, con el tamaño que tenga.",
                "LET hace legible una fórmula larga dando nombre a cada paso."],
               f"[Clave 11 · Gráficos y narrativa]({PAGES}#clave-11) · [Cuaderno 11]({colab('11_graficos_y_narrativa.ipynb')})"),
    ]


# ============================================================================
# 11 · Gráficos y narrativa de resultados
# ============================================================================
def cuaderno_11():
    return [
        encabezado("Clave 11", "Gráficos y narrativa de resultados", "Del dato al informe que se explica solo", 30, [
            "Comparar el gráfico por defecto con uno diseñado para responder una pregunta.",
            "Elegir el gráfico y el título según el mensaje del informe.",
            "Armar un informe de una página: qué pasó, por qué y qué sigue."],
            "11_graficos_y_narrativa.ipynb", "clave-11"),
        code(PREPARACION),
        code('''
# @title Preparar real y meta 2025 por sede
real = validas[validas.anio == 2025].groupby("ciudad")["subtotal"].sum()
real24 = validas[validas.anio == 2024].groupby("ciudad")["subtotal"].sum()
meta = (metas[metas.anio == 2025].merge(sedes[["id_sede", "ciudad"]], on="id_sede").groupby("ciudad")["meta_subtotal"].sum())
tabla = pd.DataFrame({"real": real, "meta": meta, "real_2024": real24}).reindex(sedes.ciudad)
tabla["cumplimiento"] = tabla.real / tabla.meta
tabla["crecimiento"] = tabla.real / tabla.real_2024 - 1
display(tabla.style.format({"real": miles, "meta": miles, "real_2024": miles, "cumplimiento": "{:.1%}", "crecimiento": "{:+.1%}"}))
'''),
        md("""
## 1 · Lo que sale por defecto
La pregunta del comité es: **«¿qué sedes cumplieron la meta de 2025?»**. Este es el gráfico que muchos insertan al seleccionar la tabla: columnas de real y meta, en el orden de la tabla, con un título que nombra el tema.
"""),
        ficha("¿Responde el gráfico por defecto la pregunta?", "Columnas agrupadas de real y meta por sede, sin ordenar · Título genérico",
              "Se muestra a propósito tal como sale por defecto, para compararlo con la versión siguiente.",
              "—", "Intenta decir en cinco segundos qué sedes cumplieron: hay que comparar pares de columnas una por una.",
              "Es lo que da Insertar › Gráfico recomendado sobre la tabla sin ninguna decisión."),
        code('''
# @title Gráfico 1 · Versión por defecto
fig = go.Figure()
fig.add_bar(name="Real", x=tabla.index, y=tabla.real / 1e6)
fig.add_bar(name="Meta", x=tabla.index, y=tabla.meta / 1e6)
fig.update_layout(barmode="group", title="Ventas por sede 2025", yaxis_title=MM, height=360)
fig.show()
'''),
        md("""
## 2 · El gráfico según el mensaje
Primero se decide **qué se quiere decir**; el gráfico y el título vienen después. Elige el mensaje del informe:

* **Cumplimiento de la meta**: barras de % ordenadas, línea en 100 % y color solo para las que no cumplen.
* **Crecimiento frente a 2024**: barras de crecimiento ordenadas y una línea con el crecimiento total.
* **Mezcla de canales**: barras apiladas al 100 % con el canal que importa en color.
"""),
        ficha("¿Qué gráfico y qué título responden el mensaje elegido?", "Depende del mensaje: barras de cumplimiento, barras de crecimiento o barras apiladas al 100 %",
              "Cada mensaje es una pregunta distinta (cumplimiento, cambio o composición) y cada una tiene su forma.",
              "Usar el mismo gráfico para los tres mensajes: alguno quedaría sin respuesta.",
              "El título dice el hallazgo con su cifra; el color solo marca lo que el título menciona.",
              "Barras ordenadas, una serie de referencia como línea, relleno gris y un color de énfasis, título enlazado a una celda."),
        code('''
# @title Gráfico 2 · Mensaje, gráfico y título
mensaje = "Cumplimiento de la meta"  # @param ["Cumplimiento de la meta", "Crecimiento frente a 2024", "Mezcla de canales"]
if mensaje == "Cumplimiento de la meta":
    t = tabla.sort_values("cumplimiento")
    colores = [MAGENTA if c < 1 else GRIS for c in t.cumplimiento]
    fig = go.Figure(go.Bar(x=t.cumplimiento, y=t.index, orientation="h", marker_color=colores,
                           text=[f"{c:.1%}".replace(".", ",").replace("%", " %") for c in t.cumplimiento], textposition="outside", cliponaxis=False))
    fig.add_vline(x=1, line_dash="dash", line_color="#11153A", annotation_text="Meta 100 %", annotation_position="top")
    cumplen = t[t.cumplimiento >= 1].index.tolist()[::-1]
    peor = t.index[0]
    titulo = f"{' y '.join(cumplen)} superaron su meta; {peor} quedó {(1 - t.cumplimiento.iloc[0]) * 100:.0f} puntos abajo"
    fig.update_layout(xaxis_tickformat=".0%", xaxis_range=[0, t.cumplimiento.max() * 1.15])
elif mensaje == "Crecimiento frente a 2024":
    t = tabla.sort_values("crecimiento")
    total = tabla.real.sum() / tabla.real_2024.sum() - 1
    colores = [AZUL if c > total else GRIS for c in t.crecimiento]
    fig = go.Figure(go.Bar(x=t.crecimiento, y=t.index, orientation="h", marker_color=colores,
                           text=[porc(c, signo=True) for c in t.crecimiento], textposition="outside", cliponaxis=False))
    fig.add_vline(x=total, line_dash="dash", line_color="#11153A", annotation_text=f"Total {porc(total, signo=True)}", annotation_position="top")
    titulo = f"{t.index[-1]} creció {porc(t.crecimiento.iloc[-1])}, más del doble que el total de la empresa ({porc(total)})" if t.crecimiento.iloc[-1] > 2 * total \\
             else f"{t.index[-1]} lideró el crecimiento con {porc(t.crecimiento.iloc[-1])}"
    fig.update_layout(xaxis_tickformat=".0%", xaxis_range=[0, t.crecimiento.max() * 1.2])
else:
    mezcla = (validas[validas.anio == 2025].pivot_table(index="ciudad", columns="canal", values="subtotal", aggfunc="sum")
              .reindex(columns=["E-commerce", "Televentas", "Presencial"]))
    mezcla = mezcla.div(mezcla.sum(axis=1), axis=0).sort_values("E-commerce")
    fig = go.Figure()
    for canal, color in [("E-commerce", AZUL), ("Televentas", "#C9D0E2"), ("Presencial", "#E4E8F2")]:
        fig.add_bar(name=canal, y=mezcla.index, x=mezcla[canal], orientation="h", marker_color=color,
                    text=[porc(v) if canal == "E-commerce" else "" for v in mezcla[canal]], textposition="inside")
    titulo = f"E-commerce pesa {porc(mezcla['E-commerce'].iloc[-1])} de la venta en {mezcla.index[-1]} y {porc(mezcla['E-commerce'].iloc[0])} en {mezcla.index[0]}"
    fig.update_layout(barmode="stack", xaxis_tickformat=".0%", legend=dict(orientation="h", y=-0.15))
fig.update_layout(title=titulo, height=380, showlegend=(mensaje == "Mezcla de canales"))
fig.show()
display(Markdown(f"**Título del hallazgo:** {titulo}"))
'''),
        md("## 3 · Informe de una página"),
        ficha("¿Cómo se ve el informe completo para el comité?", "Indicador de cumplimiento total con su diferencia frente a la meta, y líneas de real y meta mes a mes",
              "El indicador da la respuesta en un número; la línea muestra cuándo se ganó o se perdió.",
              "Un tablero con diez gráficos: el comité necesita un mensaje, no todos los datos.",
              "Lee primero el número grande, luego busca los meses donde la línea real queda debajo de la meta.",
              "Hoja Panel: una tarjeta con =SUMA(…)/SUMA(…), un gráfico de líneas y un cuadro de texto enlazado a la narrativa."),
        code('''
# @title Gráfico 3 · Informe de una página
from plotly.subplots import make_subplots
mens = validas[validas.anio == 2025].groupby("mes")["subtotal"].sum() / 1e6
mmeta = metas[metas.anio == 2025].groupby("mes")["meta_subtotal"].sum() / 1e6
fechas = pd.to_datetime([f"2025-{m:02d}-01" for m in mens.index])
fig = make_subplots(rows=1, cols=2, column_widths=[0.3, 0.7], specs=[[{"type": "indicator"}, {"type": "xy"}]])
fig.add_trace(go.Indicator(mode="number+delta", value=tabla.real.sum() / tabla.meta.sum() * 100,
                           number=dict(suffix=" %", valueformat=".1f"), delta=dict(reference=100, valueformat=".1f", suffix=" pts"),
                           title=dict(text="Cumplimiento 2025")), row=1, col=1)
fig.add_scatter(x=fechas, y=mens.values, name="Real", line=dict(color=AZUL, width=3), row=1, col=2)
fig.add_scatter(x=fechas, y=mmeta.values, name="Meta", line=dict(color="#11153A", width=2, dash="dash"), row=1, col=2)
debajo = int((mens.values < mmeta.values).sum())
eje_meses(fig, fechas)
fig.update_layout(title=f"La empresa cerró 2025 en {porc(tabla.real.sum() / tabla.meta.sum())} de la meta: {debajo} de 12 meses quedaron debajo",
                  height=380, yaxis_title=MM, legend=dict(orientation="h", y=-0.15))
fig.show()
peor = tabla.cumplimiento.idxmin(); mejor = tabla.cumplimiento.idxmax()
display(Markdown(f"""
**Qué pasó.** La venta neta de 2025 fue {millones(tabla.real.sum())}, el {porc(tabla.real.sum() / tabla.meta.sum())} de la meta.

**Por qué.** {mejor} superó su meta ({porc(tabla.cumplimiento[mejor])}) y creció {porc(tabla.crecimiento[mejor])} frente a 2024; {peor} quedó en {porc(tabla.cumplimiento[peor])}.

**Qué sigue.** Revisar con {peor} la cartera de clientes y el plan del primer trimestre, y replicar lo que funcionó en {mejor}.
"""))
'''),
        md("## 4 · Retos de interpretación"),
        reto(1, "¿Cuál de estos es un título de hallazgo?",
             ["Ventas por sede 2025", "Cumplimiento de metas", "Barranquilla quedó 12 puntos debajo de su meta", "Gráfico de barras"],
             '"Barranquilla quedó 12 puntos debajo de su meta"', "Dice qué pasó y con qué cifra; los otros solo nombran el tema."),
        reto(2, "¿Qué sede quedó más lejos de su meta en 2025?", ["Bogotá", "Medellín", "Cali", "Barranquilla", "Bucaramanga", "Pereira"],
             "tabla.cumplimiento.idxmin()", "Es la barra más corta del gráfico de cumplimiento."),
        reto(3, "Quieres mostrar cómo evolucionó la venta mes a mes. ¿Qué gráfico usas?",
             ["Torta", "Líneas", "Barras apiladas al 100 %", "Dispersión"],
             '"Líneas"', "La evolución en el tiempo se lee mejor como una línea continua."),
        tip_ia("Para pasar de la tabla a la narrativa:",
               """Esta es la tabla de real, meta y cumplimiento 2025 por sede: [PEGA LA TABLA].
Escribe tres títulos de hallazgo de máximo 12 palabras con cifra, y la narrativa en tres frases: qué pasó, por qué y qué sigue.
No inventes datos que no estén en la tabla."""),
        cierre(["Primero el mensaje, después el gráfico.",
                "Ordenar, un color de énfasis, una referencia y etiquetas directas hacen que se entienda en diez segundos.",
                "El título dice el hallazgo; la narrativa dice qué pasó, por qué y qué sigue."],
               f"[Clave 12 · Auditoría y control]({PAGES}#clave-12) · [Cuaderno 12]({colab('12_auditoria_y_control.ipynb')})"),
    ]


# ============================================================================
# 12 · Auditoría, control y uso responsable de IA
# ============================================================================
ERRORES_12 = ["Cali: valor pegado de 2024", "Barranquilla: fórmula de IA sin criterio de estado", "Total: omite Pereira"]


def cuaderno_12():
    return [
        encabezado("Clave 12", "Auditoría, control y uso responsable de IA", "Revisar antes de enviar", 30, [
            "Medir cuánto mueve cada error el total de un informe.",
            "Ver cómo cambia la conclusión por sede cuando el informe tiene errores.",
            "Probar una fórmula sugerida por una IA con casos conocidos."],
            "12_auditoria_y_control.ipynb", "clave-12"),
        code(PREPARACION),
        md("""
## 1 · El informe con cinco errores
La hoja **Auditoria** de `Andina_listo_para_dinamicas.xlsx` es un informe de cumplimiento 2025 listo para enviar. Tiene cinco errores sembrados:

| Celda | Error | ¿Lo marca Excel? |
|---|---|---|
| B7 | Venta de Cali pegada del informe de 2024 | No |
| B8 | Fórmula sugerida por una IA, sin el criterio de estado: suma anuladas | No |
| C9 | Meta de Bucaramanga escrita como texto: SUMA la ignora | Sí: número como texto |
| D10 | Cumplimiento de Pereira dividido por la meta de la fila de arriba | Sí: fórmula incoherente |
| B11 | El total omite la fila de Pereira | Sí: omite celdas adyacentes |

Este cuaderno reconstruye el informe correcto y el informe tal como quedó, para ver el efecto de cada error.
"""),
        code('''
# @title Reconstruir el informe correcto y el reportado
v25 = validas[validas.anio == 2025].groupby("ciudad")["subtotal"].sum()
v25_con_anuladas = df[df.anio == 2025].groupby("ciudad")["subtotal"].sum()
v24 = validas[validas.anio == 2024].groupby("ciudad")["subtotal"].sum()
meta = metas[metas.anio == 2025].merge(sedes[["id_sede", "ciudad"]], on="id_sede").groupby("ciudad")["meta_subtotal"].sum()
orden = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Bucaramanga", "Pereira"]
ok = pd.DataFrame({"venta": v25, "meta": meta}).reindex(orden)
ok["cumplimiento"] = ok.venta / ok.meta
rep = ok.copy()
rep.loc["Cali", "venta"] = v24["Cali"]                                   # B7
rep.loc["Barranquilla", "venta"] = v25_con_anuladas["Barranquilla"]       # B8
rep["cumplimiento"] = rep.venta / rep.meta
rep.loc["Pereira", "cumplimiento"] = rep.loc["Pereira", "venta"] / rep.loc["Bucaramanga", "meta"]   # D10
total_ok = ok.venta.sum()
total_rep = rep.venta.drop("Pereira").sum()                              # B11
meta_rep = rep.meta.drop("Bucaramanga").sum()                            # C9
display(Markdown(f"Total correcto: **{pesos(total_ok)}** · Total reportado: **{pesos(total_rep)}** · Diferencia: **{'−' if total_rep < total_ok else '+'}{pesos(abs(total_rep - total_ok))}**"))
'''),
        ficha("¿Cuánto mueve cada error el total de venta?", "Cascada: del total correcto al total reportado, un escalón por error",
              "La cascada explica una diferencia como suma de partes: cada escalón es un error y su tamaño.",
              "Solo la diferencia total: no se sabe qué corregir primero.",
              "Los escalones hacia abajo restan venta; los de arriba la suman. El más largo es el error más costoso.",
              "Filas 14 y 15 de la hoja Auditoria: el cuadre contra la fuente muestra la diferencia total."),
        code('''
# @title Gráfico 1 · Del total correcto al reportado
efectos = pd.Series({
    "Cali: valor pegado de 2024": v24["Cali"] - v25["Cali"],
    "Barranquilla: fórmula de IA sin criterio de estado": v25_con_anuladas["Barranquilla"] - v25["Barranquilla"],
    "Total: omite Pereira": -v25["Pereira"],
})
fig = go.Figure(go.Waterfall(
    x=["Total correcto", *[e.split(":")[0] + ":<br>" + e.split(": ")[1] for e in efectos.index], "Total reportado"],
    y=[total_ok / 1e6, *(efectos / 1e6).tolist(), 0], measure=["absolute", "relative", "relative", "relative", "total"],
    text=[f"{v:,.0f}".replace(",", ".") for v in [total_ok / 1e6, *(efectos / 1e6).tolist(), total_rep / 1e6]], textposition="outside",
    increasing=dict(marker_color=MAGENTA), decreasing=dict(marker_color=MAGENTA), totals=dict(marker_color=AZUL),
    connector=dict(line=dict(color=GRIS))))
fig.update_layout(title=f"El informe reporta {millones(abs(total_rep - total_ok))} menos que la base; el error más costoso es «{efectos.abs().idxmax()}»",
                  yaxis_title=MM, height=420, yaxis_range=[0, total_ok / 1e6 * 1.15])
fig.show()
'''),
        md("## 2 · La conclusión que cambia"),
        ficha("¿Cambia el mensaje por sede cuando el informe tiene errores?", "Puntos conectados: cumplimiento correcto y reportado por sede · Línea en 100 %",
              "Cada línea une los dos valores de una sede: cuanto más larga, más cambia la conclusión.",
              "Dos tablas de cumplimiento: habría que comparar cifra por cifra.",
              "Pereira pasa de cumplir a no cumplir, y Cali parece mucho más lejos de su meta de lo que está.",
              "Columna D de la hoja Auditoria antes y después de corregir."),
        code('''
# @title Gráfico 2 · Cumplimiento correcto frente al reportado
fig = go.Figure()
for s in orden:
    a, b = ok.cumplimiento[s], rep.cumplimiento[s]
    fig.add_scatter(x=[a, b], y=[s, s], mode="lines", line=dict(color=GRIS, width=2), showlegend=False)
fig.add_scatter(x=ok.cumplimiento, y=orden, mode="markers", name="Correcto", marker=dict(color=AZUL, size=12))
fig.add_scatter(x=rep.cumplimiento, y=orden, mode="markers", name="Reportado", marker=dict(color=MAGENTA, size=12, symbol="diamond"))
fig.add_vline(x=1, line_dash="dash", line_color="#11153A", annotation_text="Meta 100 %")
cambian = [s for s in orden if (ok.cumplimiento[s] >= 1) != (rep.cumplimiento[s] >= 1)]
fig.update_layout(title=f"Con los errores, {', '.join(cambian) if cambian else 'ninguna sede'} cambia de conclusión frente a la meta",
                  xaxis_tickformat=".0%", height=360, yaxis=dict(autorange="reversed"), legend=dict(orientation="h", y=-0.2))
fig.show()
'''),
        md("""
## 3 · Probar la fórmula de la IA con casos conocidos
La fórmula de B8 la sugirió un asistente de IA. Se veía razonable y nadie la probó. La prueba es simple: calcular el mismo dato por otro camino (una tabla dinámica sin anuladas) en varios casos y comparar.
"""),
        ficha("¿En qué meses falla la fórmula sugerida?", "Columnas por mes: diferencia entre la fórmula de la IA y la tabla dinámica para la sede elegida",
              "Cada mes es un caso de prueba; una columna distinta de cero es un caso fallido.",
              "Probar solo el total anual: un error pequeño en un mes se esconde en el total.",
              "Los meses con columna son los que tienen facturas anuladas: la IA no las excluyó.",
              "Tabla dinámica de tVentas con ciudad y mes, sin anuladas, comparada con la fórmula en cada mes."),
        code('''
# @title Gráfico 3 · Casos de prueba mes a mes
sede_prueba = "Barranquilla"  # @param ["Bogotá", "Medellín", "Cali", "Barranquilla", "Bucaramanga", "Pereira"]
ia = df[(df.anio == 2025) & (df.ciudad == sede_prueba)].groupby("mes")["subtotal"].sum()
dinamica = validas[(validas.anio == 2025) & (validas.ciudad == sede_prueba)].groupby("mes")["subtotal"].sum()
dif = (ia - dinamica).reindex(range(1, 13), fill_value=0) / 1e6
fallan = int((dif > 0).sum())
fig = go.Figure(go.Bar(x=[MESES[m - 1] for m in dif.index], y=dif.values, marker_color=[MAGENTA if v > 0 else GRIS for v in dif.values],
                       text=[f"{v:,.1f}".replace(".", ",") if v > 0 else "" for v in dif.values], textposition="outside"))
fig.update_layout(title=f"{sede_prueba}: la fórmula de la IA falla en {fallan} de 12 meses (suma facturas anuladas)",
                  yaxis_title="Diferencia, millones", height=340)
fig.show()
'''),
        md("## 4 · Retos de interpretación"),
        reto(1, "¿Qué error mueve más el total de venta del informe?", ERRORES_12, "efectos.abs().idxmax()",
             "Es el escalón más largo de la cascada."),
        reto(2, "¿Cuántos de los cinco errores marca la Comprobación de errores de Excel?", ["1", "3", "5", "0"], '"3"',
             "Marca el número como texto, la fórmula incoherente y el total que omite celdas. El valor pegado y la fórmula de la IA no tienen aviso."),
        reto(3, "Una IA te sugiere una fórmula y el resultado se ve razonable. ¿Qué haces antes de enviarlo?",
             ["Enviarlo: se ve bien", "Probarla con casos conocidos calculados por otro camino", "Pedirle a la IA que confirme", "Agregar SI.ERROR"],
             '"Probarla con casos conocidos calculados por otro camino"', "Un resultado razonable puede estar mal. La prueba con casos conocidos lo demuestra."),
        tip_ia("Para diseñar los casos de prueba de una fórmula:",
               """Una IA me sugirió esta fórmula de Excel 365: [PEGA LA FÓRMULA].
Debe calcular la venta neta por sede y año, sin facturas anuladas.
Propón tres casos de prueba que pueda verificar con una tabla dinámica, incluido uno que detecte si suma anuladas."""),
        cierre(["Mostrar fórmulas y la comprobación de errores encuentran parte de los errores, no todos.",
                "El cuadre contra la fuente y la prueba con casos conocidos encuentran el resto.",
                "Lo que propone una IA se prueba igual que lo que escribe un colega: lo que envías es tu responsabilidad."],
               f"[Laboratorio Excel + Colab]({PAGES}#laboratorio) · [Taller 3]({colab('taller_3_tablero_comite.ipynb')})"),
    ]
