"""Curso rápido de Google Colab: celdas de texto, celdas de código y librerías («poderes»).

A diferencia de los demás cuadernos, aquí el código se ve a propósito: el tema es entender
cómo funciona un cuaderno. Las celdas de preparación y los retos siguen ocultos.
"""
from .comun import PAGES, RAW, cierre, code, colab, md, reto

ARCHIVO = "curso_rapido_colab.ipynb"

PREPARAR = '''
# @title Preparar el curso (ejecuta esta celda primero con el botón ▶)
import os
from IPython.display import display, Markdown
REPO = "OmarLi-360/excel-corporativo-12-claves"

def archivo(nombre):
    """Atajo del curso: busca el archivo de datos en la copia local o en GitHub."""
    local = os.path.join("../data", nombre)
    return local if os.path.exists(local) else f"https://raw.githubusercontent.com/{REPO}/main/data/{nombre}"

def revisar(respuesta, esperado, explicacion=""):
    if respuesta == "Elige una opción":
        display(Markdown("**Elige una opción en la lista de la derecha** y vuelve a ejecutar esta celda con ▶."))
    elif str(respuesta) == str(esperado):
        display(Markdown(f"✅ **Correcto.** {explicacion}"))
    else:
        display(Markdown(f"❌ **Todavía no.** Vuelve a leer la lección e inténtalo otra vez. *(Elegiste: {respuesta})*"))

display(Markdown("✅ **Listo.** Ya puedes seguir con la lección 1."))
'''


def curso_colab():
    return [
        md(f"""
<img src="{RAW}/assets/logo-drbits.jpg" alt="Dr. Bits" width="170">

# Curso rápido de Google Colab
**Excel Corporativo · 12 Claves** — Cómo funciona un cuaderno, sin saber programar · ⏱ 25 min

[![Abrir en Colab](https://colab.research.google.com/assets/colab-badge.svg)]({colab(ARCHIVO)}) &nbsp; [Volver al tablero]({PAGES}#colab)

<sub>Si al abrir un enlace Google muestra «Redirect Notice», haz clic en el enlace azul de esa página: es un aviso de seguridad de Google, no un error.</sub>

**Al terminar podrás:**
1. Distinguir una celda de texto de una celda de código, y editar o ejecutar cada una.
2. Leer lo que devuelve una celda, incluidos los mensajes de error.
3. Usar los formularios (listas y deslizadores) de los cuadernos del curso.
4. Entender qué es una librería y por qué con dos líneas Colab puede leer un archivo y dibujar un gráfico.

---
### Antes de empezar
1. **Guarda tu copia:** *Archivo › Guardar una copia en Drive*. Se abre una pestaña nueva con tu copia: trabaja en esa. El original está protegido; si escribes en él, nadie más lo ve y tus cambios se borran al cerrar.
2. **Ejecuta la celda de preparación** que está justo debajo: pasa el mouse sobre ella y haz clic en el botón ▶ de la izquierda. La primera vez tarda unos segundos porque Colab enciende una máquina para ti.
"""),
        code(PREPARAR),
        md("""
## Lección 1 · Un cuaderno es texto y código

Un cuaderno de Colab es como un **cuaderno de laboratorio**: hay párrafos que explican qué se va a hacer y bloques que lo hacen. Cada bloque se llama **celda**, y hay dos clases:

| | Celda de **texto** | Celda de **código** |
|---|---|---|
| Para qué | Explicar: títulos, párrafos, tablas, imágenes | Hacer: calcular, leer archivos, dibujar gráficos |
| Cómo se ve | Como una página web | Fondo gris con un botón ▶ a la izquierda |
| Cómo se edita | Doble clic sobre ella | Clic dentro del bloque gris |
| Qué produce | Nada: solo se lee | Un **resultado** que aparece debajo |
| Parecido en Excel | Un cuadro de texto con instrucciones | Una celda con fórmula |

Esta celda que estás leyendo es de **texto**. Para crear celdas nuevas usa los botones **+ Código** y **+ Texto** de la barra superior, o pasa el mouse entre dos celdas.
"""),
        md("""
## Lección 2 · Celdas de texto

Las celdas de texto usan un formato sencillo llamado **Markdown**: unos pocos símbolos se convierten en formato.

| Escribes | Obtienes |
|---|---|
| `# Título` | Un título grande |
| `## Subtítulo` | Un título mediano |
| `**negrita**` | **negrita** |
| `*cursiva*` | *cursiva* |
| `* elemento` | Una viñeta |
| `[texto](https://…)` | Un enlace |

**Practica:** haz **doble clic** en la celda de abajo. Verás los símbolos. Cambia «Tu nombre» por tu nombre y **Ventas** por **Finanzas**, y luego presiona **Shift + Enter** para ver el resultado.
"""),
        md("""
### Mi primera celda de texto
Soy **Tu nombre** y trabajo en el área de **Ventas**.
* Hoy aprendí qué es una celda de texto.
"""),
        md("""
## Lección 3 · Celdas de código

Una celda de código se **ejecuta**: Colab lee lo que está escrito, lo calcula y muestra el resultado debajo. Hay tres formas de ejecutarla:

1. Clic en el botón **▶** a la izquierda de la celda.
2. **Ctrl + Enter**: ejecuta y se queda en la misma celda.
3. **Shift + Enter**: ejecuta y pasa a la siguiente.

Al terminar aparece un número entre corchetes, como `[3]`: es el **orden** en que se ejecutó. Ejecuta las tres celdas de abajo, una por una.
"""),
        code('''
# Una celda de código puede ser una calculadora, como una fórmula de Excel
120000 * 12
''', oculto=False),
        code('''
# Guardar un valor con un nombre es como poner un nombre a una celda de Excel
precio = 21900          # el precio de una resma, en pesos
cantidad = 40
total = precio * cantidad
total
''', oculto=False),
        code('''
# print muestra un mensaje. Cambia el nombre entre comillas y vuelve a ejecutar
nombre = "Laura"
print(f"Hola, {nombre}. La venta fue de {total:,.0f} pesos".replace(",", "."))
''', oculto=False),
        md("""
**Lo que acabas de ver:**
* Las líneas que empiezan con `#` son **comentarios**: notas para las personas, Colab no las ejecuta.
* `precio = 21900` guarda un valor con un nombre. Después puedes usar `precio` en otras celdas, igual que en Excel usas `=B2*C2`.
* Las celdas **recuerdan** lo que se ejecutó antes: la tercera celda usa `total`, que se calculó en la segunda.
"""),
        md("""
## Lección 4 · El orden importa y los errores se leen

Colab recuerda solo lo que **ya se ejecutó**. Si abres un cuaderno y ejecutas una celda del medio, puede faltar algo que se calculaba más arriba. Por eso los cuadernos del curso se abren con **Entorno de ejecución › Ejecutar todas** (Ctrl + F9), que corre todas las celdas de arriba abajo.

Cuando algo falla, Colab muestra un **mensaje de error** en rojo. No hay que asustarse: **la última línea dice qué pasó**. La celda de abajo provoca un error a propósito y te lo traduce.
"""),
        code('''
# Esta celda usa un nombre que nunca se definió: «iva»
try:
    precio_con_iva = precio * (1 + iva)
except NameError as e:
    print("Colab mostraría en rojo:  NameError:", e)
    print("Traducción: se usó el nombre «iva» antes de definirlo.")
    print("Solución: crear iva en una celda anterior, por ejemplo  iva = 0.19, y ejecutarla primero.")
''', oculto=False),
        md("""
**Errores que vas a ver en el curso y qué hacer:**

| Mensaje (última línea) | Qué significa | Qué hacer |
|---|---|---|
| `NameError: name '…' is not defined` | Se usa algo que no se ha calculado | *Entorno de ejecución › Ejecutar todas* |
| `FileNotFoundError` | No encuentra el archivo | Revisa el nombre y que lo hayas subido a la carpeta |
| `ModuleNotFoundError` | Falta una librería (lección 6) | Ejecuta la celda que la instala |
| La celda gira y no termina | Está trabajando o se colgó | Espera; si no termina, *Entorno de ejecución › Interrumpir ejecución* |

Si nada funciona: **Entorno de ejecución › Reiniciar sesión** y luego **Ejecutar todas**. Es el «apagar y volver a encender» de Colab.
"""),
        md("""
## Lección 5 · Formularios: el código que no necesitas ver

En los cuadernos del curso casi no verás código. Las celdas muestran solo un **título** y unos **controles** a la derecha: listas desplegables y deslizadores. El código está escondido a propósito.

* Cambia el valor del control y vuelve a ejecutar la celda con ▶: el resultado se recalcula.
* Si tienes curiosidad, haz **doble clic** en el título de la celda o usa *Ver › Mostrar código*: verás que cada control es una línea con `# @param`.

Prueba la celda de abajo: elige una sede, mueve el deslizador del descuento y ejecútala.
"""),
        code('''
# @title Calcular un pedido con formulario
sede = "Bogotá"  # @param ["Bogotá", "Medellín", "Cali", "Barranquilla", "Bucaramanga", "Pereira"]
cantidad = 40  # @param {type:"slider", min:1, max:200, step:1}
descuento = 0.05  # @param {type:"slider", min:0, max:0.15, step:0.01}
precio = 21900
subtotal = cantidad * precio * (1 - descuento)
print(f"Pedido de {sede}: {cantidad} resmas con {descuento:.0%} de descuento = {subtotal:,.0f} pesos".replace(",", "."))
'''),
        md("""
## Lección 6 · Librerías: los poderes de Colab

Colab entiende **Python**, un lenguaje de programación. Python solo sabe hacer cosas básicas, como la calculadora de la lección 3. Los superpoderes vienen en **librerías**: paquetes de herramientas que otras personas construyeron y comparten gratis. Se parecen a las **aplicaciones del celular** o a los **complementos de Excel**: los instalas una vez y te dan capacidades nuevas.

| Librería | Su poder | Parecido en Excel |
|---|---|---|
| **pandas** | Leer CSV y Excel, filtrar, unir y resumir tablas de millones de filas | Tablas, filtros, BUSCARX, tablas dinámicas |
| **plotly** | Gráficos interactivos: zoom, información al pasar el mouse, exportar como página web | Insertar › Gráfico |
| **numpy** | Cálculos rápidos con muchos números | Las funciones matemáticas |
| **openpyxl** | Leer y escribir libros de Excel con varias hojas | Abrir y guardar .xlsx |

Para usar una librería se **importa** al comienzo, con un apodo corto. Colab ya trae instaladas estas cuatro; si algún día falta una, se instala con una línea como `!pip install nombre`.
"""),
        code('''
# Activar los poderes: import trae la librería, "as" le pone un apodo corto
import pandas as pd
import plotly.express as px
print("Poderes activados: pandas (pd) y plotly (px)")
''', oculto=False),
        md("""
### Poder 1 · Leer un archivo
`pd.read_csv` lee un archivo CSV y lo convierte en una **tabla** (en pandas se llama *DataFrame*). Aquí leemos las ventas de Distribuidora Andina, la empresa ficticia del curso. `archivo(...)` es un atajo preparado para este curso que busca el archivo en GitHub.
"""),
        code('''
ventas = pd.read_csv(archivo("ventas.csv"))
print(f"Filas: {len(ventas):,}  ·  Columnas: {ventas.shape[1]}".replace(",", "."))
ventas.head()     # head muestra las primeras 5 filas, como mirar el comienzo de una hoja
''', oculto=False),
        md("""
### Poder 2 · Resumir como una tabla dinámica
Una línea hace lo que en Excel sería una tabla dinámica con *canal* en filas y *suma de subtotal* en valores. Antes quitamos las facturas anuladas, como en la clave 7.
"""),
        code('''
validas = ventas[ventas["estado"] != "Anulada"]                  # filtrar: sin anuladas
por_canal = validas.groupby("canal")["subtotal"].sum()           # agrupar y sumar
por_canal
''', oculto=False),
        md("""
### Poder 3 · Dibujar un gráfico interactivo
Con plotly, una línea dibuja el gráfico. Pasa el mouse sobre las barras: verás el valor exacto. Arriba a la derecha hay botones para hacer zoom y descargar la imagen.
"""),
        code('''
fig = px.bar(x=por_canal.index, y=por_canal.values / 1e6,
             labels={"x": "Canal", "y": "Millones de pesos"},
             title="Venta neta por canal, 2024 y 2025")
fig.show()
''', oculto=False),
        md("""
**Lo que acabas de hacer en tres celdas:** leer 17.106 filas, filtrar, resumir y graficar. En los cuadernos del curso todo esto ya está escrito y escondido: tú eliges las opciones y lees el resultado.
"""),
        md("""
## Lección 7 · Guardar, compartir y cerrar

* **Tu copia vive en Google Drive**, en la carpeta *Colab Notebooks*. Se guarda sola mientras trabajas.
* **Los archivos que subes o creas en la sesión son temporales:** se borran cuando Colab se desconecta (unos 90 minutos sin uso, o al cerrar). Descarga lo que quieras conservar o guárdalo en Drive; el Taller 0 enseña a conectar una carpeta.
* **Compartir:** botón *Compartir* arriba a la derecha, igual que un documento de Google. Quien lo abra ve también los resultados que dejaste.
* **Seguridad:** al abrir un cuaderno que no hizo Google, Colab pregunta si confías en él. En este curso puedes elegir *Ejecutar de todos modos*. Con cuadernos de origen desconocido, lee primero qué hacen.
* **Datos reales:** no subas datos personales de clientes o empleados a cuentas personales. Los datos de este curso son ficticios.
"""),
        md("## Retos de repaso"),
        reto(1, "¿Qué tipo de celda usarías para escribir las conclusiones de un informe?",
             ["Celda de texto", "Celda de código", "Cualquiera de las dos", "Ninguna"],
             '"Celda de texto"', "Las celdas de texto explican; las de código calculan."),
        reto(2, "Abres un cuaderno, ejecutas una celda del medio y sale NameError. ¿Qué haces primero?",
             ["Borrar la celda", "Entorno de ejecución › Ejecutar todas", "Cerrar Colab", "Escribir el nombre otra vez"],
             '"Entorno de ejecución › Ejecutar todas"', "Seguramente falta algo que se calculaba en una celda anterior."),
        reto(3, "¿Qué es una librería, como pandas o plotly?",
             ["Una carpeta de Drive", "Un paquete de herramientas que le da nuevos poderes a Python", "Un tipo de celda", "Un archivo de Excel"],
             '"Un paquete de herramientas que le da nuevos poderes a Python"', "Se importa al comienzo del cuaderno y se usa con su apodo, como pd o px."),
        cierre(["Una celda de texto explica; una celda de código hace y muestra su resultado debajo.",
                "Las celdas recuerdan lo que ya se ejecutó: abre los cuadernos con Ejecutar todas.",
                "Los errores se leen por la última línea.",
                "Las librerías son los poderes de Colab: pandas para tablas y plotly para gráficos."],
               f"[Taller 0 · Monta tu laboratorio]({PAGES}#taller-0) · [Cuaderno 00 · Conoce la empresa]({colab('00_conoce_la_empresa.ipynb')})"),
    ]
