"""
Generador del dataset sintético «Distribuidora Andina S.A.S.»
=============================================================

Excel Corporativo · 12 Claves — Dr. Bits / ADNBITS S.A.S.

La empresa, los clientes, los vendedores y todas las cifras son FICTICIOS.
El generador usa una semilla fija: cualquier persona que lo ejecute obtiene
exactamente los mismos archivos, lo que permite que el tablero, los cuadernos
y los ejercicios en Excel den los mismos resultados.

Qué reproduce del mundo real
----------------------------
* Modelo relacional: un hecho (ventas) y cinco maestros (sedes, vendedores,
  clientes, productos, metas) unidos por llaves.
* Estacionalidad: temporada escolar (ene-feb), cierre de presupuesto (nov-dic),
  bache de mitad de año y crecimiento de un año a otro.
* Concentración tipo Pareto: pocos clientes explican gran parte de las ventas.
* Ajuste de precios entre 2024 y 2025, descuentos por volumen y segmento.
* Facturas anuladas y cartera pendiente (que NO deben sumarse como venta).
* Rotación de personal: vendedores que ingresan o se retiran a mitad del periodo.
* Una exportación «sucia» de ERP con los defectos que se ven en la práctica.

Uso
---
    python scripts/generar_dataset.py            # escribe en ./data
    python scripts/generar_dataset.py --salida otra_carpeta
"""

from __future__ import annotations

import argparse
import json
from datetime import date, timedelta
from pathlib import Path

import numpy as np
import pandas as pd

SEMILLA = 2026
IVA = 0.19
INICIO = date(2024, 1, 1)
FIN = date(2025, 12, 31)


# ---------------------------------------------------------------------------
# Maestros
# ---------------------------------------------------------------------------
def crear_sedes() -> pd.DataFrame:
    return pd.DataFrame(
        [
            ("S01", "Bogotá", "Cundinamarca", "Centro", "2015-03-02", 0.33),
            ("S02", "Medellín", "Antioquia", "Noroccidente", "2016-08-16", 0.22),
            ("S03", "Cali", "Valle del Cauca", "Pacífico", "2017-02-06", 0.15),
            ("S04", "Barranquilla", "Atlántico", "Caribe", "2018-05-14", 0.12),
            ("S05", "Bucaramanga", "Santander", "Nororiente", "2019-09-02", 0.10),
            ("S06", "Pereira", "Risaralda", "Eje Cafetero", "2021-04-05", 0.08),
        ],
        columns=["id_sede", "ciudad", "departamento", "region", "fecha_apertura", "peso"],
    )


NOMBRES = ["Andrés", "Camila", "Juan Pablo", "Valentina", "Santiago", "Daniela", "Felipe",
           "Laura", "Sebastián", "Natalia", "Carlos", "María José", "Julián", "Paula",
           "Diego", "Carolina", "Mateo", "Juliana", "Alejandro", "Manuela", "Esteban", "Luisa"]
APELLIDOS = ["Rojas", "Gómez", "Martínez", "Rodríguez", "Herrera", "Castro", "Vargas",
             "Ramírez", "Moreno", "Ortiz", "Jiménez", "Suárez", "Quintero", "Patiño",
             "Cárdenas", "Mejía", "Restrepo", "Salazar", "Ospina", "Pineda", "Arango", "Duarte"]


def crear_vendedores(rng, sedes: pd.DataFrame) -> pd.DataFrame:
    # Número de vendedores por sede (proporcional al tamaño de la sede)
    reparto = {"S01": 5, "S02": 4, "S03": 3, "S04": 2, "S05": 2, "S06": 2}
    filas, usados, n = [], set(), 1
    for sede, k in reparto.items():
        for _ in range(k):
            while True:
                nombre = f"{rng.choice(NOMBRES)} {rng.choice(APELLIDOS)}"
                if nombre not in usados:
                    usados.add(nombre)
                    break
            ingreso = date(2019, 1, 7) + timedelta(days=int(rng.integers(0, 1700)))
            filas.append({
                "id_vendedor": f"V{n:02d}",
                "nombre_vendedor": nombre,
                "id_sede": sede,
                "fecha_ingreso": ingreso,
                "fecha_retiro": pd.NaT,
                "efectividad": round(float(rng.lognormal(0, 0.28)), 3),
            })
            n += 1
    v = pd.DataFrame(filas)
    # Rotación: dos retiros y dos ingresos dentro del periodo analizado
    v.loc[v.id_vendedor == "V03", "fecha_retiro"] = pd.Timestamp("2025-06-30")
    v.loc[v.id_vendedor == "V11", "fecha_retiro"] = pd.Timestamp("2024-09-15")
    v.loc[v.id_vendedor == "V08", "fecha_ingreso"] = date(2024, 10, 1)
    v.loc[v.id_vendedor == "V17", "fecha_ingreso"] = date(2025, 2, 3)
    v["fecha_ingreso"] = pd.to_datetime(v["fecha_ingreso"])
    v["estado"] = np.where(v["fecha_retiro"].isna(), "Activo", "Retirado")
    return v


PREFIJOS = ["Comercializadora", "Inversiones", "Grupo", "Distribuciones", "Servicios",
            "Consultores", "Clínica", "Colegio", "Ferretería", "Laboratorios",
            "Transportes", "Constructora", "Agencia", "Hotel", "Notaría", "Fundación",
            "Centro Médico", "Instituto", "Alcaldía de", "Secretaría de"]
NUCLEOS = ["Los Andes", "Del Valle", "Altamira", "Santa Fe", "La Sabana", "El Prado",
           "Nogal", "Pacífico", "Caribe", "Quimbaya", "Guayacán", "Cordillera",
           "Horizonte", "Aurora", "Bambú", "Ceiba", "Magdalena", "Orquídea", "Cóndor",
           "Llanos", "Tequendama", "Guadalupe", "Monserrate", "Palmas", "Arrayán",
           "Sinú", "Chicamocha", "Farallones", "Yarumo", "Cafetal"]
SUFIJOS = ["S.A.S.", "S.A.S.", "S.A.S.", "Ltda.", "S.A."]


def segmento_por_prefijo(prefijo: str) -> str:
    if prefijo in ("Alcaldía de", "Secretaría de", "Notaría"):
        return "Gobierno"
    if prefijo in ("Colegio", "Instituto", "Fundación"):
        return "Educación"
    if prefijo in ("Grupo", "Laboratorios", "Constructora", "Clínica", "Transportes"):
        return "Corporativo"
    return "Pyme"


def crear_clientes(rng, sedes: pd.DataFrame, n: int = 420) -> pd.DataFrame:
    filas, usados = [], set()
    for i in range(1, n + 1):
        while True:
            pre = str(rng.choice(PREFIJOS))
            nuc = str(rng.choice(NUCLEOS))
            if pre in ("Alcaldía de", "Secretaría de"):
                nombre = f"{pre} {nuc}"
            else:
                nombre = f"{pre} {nuc} {rng.choice(SUFIJOS)}"
            if nombre not in usados:
                usados.add(nombre)
                break
        sede = rng.choice(sedes.id_sede, p=sedes.peso / sedes.peso.sum())
        seg = segmento_por_prefijo(pre)
        filas.append({
            "id_cliente": f"C-{i:04d}",
            "razon_social": nombre,
            "segmento": seg,
            "id_sede": sede,
            "ciudad": sedes.set_index("id_sede").loc[sede, "ciudad"],
            "dias_credito": int(rng.choice([0, 30, 60], p=[0.35, 0.45, 0.20]) if seg != "Gobierno" else 60),
            "fecha_alta": INICIO - timedelta(days=int(rng.integers(30, 2400))),
        })
    c = pd.DataFrame(filas)
    # Clientes nuevos durante el periodo (crecimiento comercial)
    nuevos = rng.choice(c.index, size=60, replace=False)
    c.loc[nuevos, "fecha_alta"] = [INICIO + timedelta(days=int(d)) for d in rng.integers(30, 690, 60)]
    c["fecha_alta"] = pd.to_datetime(c["fecha_alta"])
    # Popularidad tipo Pareto (oculta): pocos clientes compran mucho
    c["_pop"] = np.minimum(rng.pareto(1.6, n) + 0.05, 6.0)
    c.loc[c.segmento == "Corporativo", "_pop"] *= 2.2
    c.loc[c.segmento == "Gobierno", "_pop"] *= 1.6
    return c


CATALOGO = {
    # categoría: (margen, [(subcategoría, [(nombre, precio_base)])])
    "Papelería": (0.36, [
        ("Escritura", [("Bolígrafo negro x12", 14500), ("Lápiz HB x12", 9800), ("Resaltador surtido x4", 11200),
                       ("Marcador borrable x4", 16900), ("Portaminas 0.5", 6400), ("Corrector cinta", 5200)]),
        ("Papel", [("Resma carta 75 g", 21900), ("Resma oficio 75 g", 24800), ("Cuaderno argollado 100 h", 12900),
                   ("Block cuadriculado", 6900), ("Notas adhesivas 3x3 x6", 13400), ("Cartulina pliego x10", 18900)]),
        ("Archivo", [("AZ oficio lomo ancho", 11900), ("Carpeta legajadora x25", 17500), ("Sobre manila x50", 15800),
                     ("Caja archivo inactivo", 7900), ("Separadores x10", 4900), ("Bisturí y repuestos", 6200)]),
        ("Escolar", [("Colores x24", 18900), ("Tijera punta roma", 4600), ("Pegante en barra x3", 8900),
                     ("Regla 30 cm", 2900), ("Kit geometría", 9600), ("Plastilina x12", 7400)]),
    ]),
    "Tecnología": (0.17, [
        ("Cómputo", [("Portátil 14\" i5 16GB", 3290000), ("Portátil 15\" i7 16GB", 4190000), ("Monitor 24\" FHD", 689000),
                     ("Mini PC oficina", 2150000), ("Tablet 10\"", 1190000)]),
        ("Periféricos", [("Teclado y mouse inalámbrico", 119000), ("Mouse ergonómico", 79000), ("Diadema USB con micrófono", 98000),
                         ("Cámara web FHD", 149000), ("Base refrigerante", 69000), ("Hub USB-C 7 en 1", 139000)]),
        ("Almacenamiento", [("Memoria USB 64GB", 32000), ("Disco externo 1TB", 259000), ("SSD 1TB", 329000),
                            ("Memoria microSD 128GB", 54000)]),
        ("Redes y energía", [("Router WiFi 6", 289000), ("Switch 8 puertos", 119000), ("UPS 1000VA", 529000),
                             ("Regleta protectora", 49000), ("Cable HDMI 2 m", 22000)]),
    ]),
    "Aseo y cafetería": (0.29, [
        ("Aseo", [("Papel higiénico institucional x4", 46900), ("Toalla de manos x6", 38900), ("Jabón líquido galón", 29900),
                  ("Desinfectante galón", 24900), ("Bolsa basura x10", 7900), ("Gel antibacterial 1 L", 18900)]),
        ("Cafetería", [("Café molido 500 g", 21900), ("Azúcar en sobres x200", 16900), ("Vaso desechable x50", 6900),
                       ("Mezcladores x1000", 9900), ("Té surtido x100", 26900), ("Agua botella x24", 23900)]),
    ]),
    "Mobiliario": (0.28, [
        ("Sillas", [("Silla ergonómica malla", 689000), ("Silla interlocutora", 219000), ("Silla gerencial", 1290000)]),
        ("Escritorios", [("Escritorio 120 cm", 549000), ("Escritorio en L", 989000), ("Mesa de juntas 6 puestos", 1690000)]),
        ("Almacenaje", [("Archivador 4 gavetas", 789000), ("Locker 6 puestos", 1190000), ("Biblioteca 5 entrepaños", 459000)]),
    ]),
    "Impresión": (0.24, [
        ("Tóner y tinta", [("Tóner negro alto rendimiento", 389000), ("Kit tinta 4 colores", 189000),
                           ("Tóner color c/u", 349000), ("Cinta para rotuladora", 59000)]),
        ("Equipos", [("Impresora láser mono", 789000), ("Multifuncional tinta continua", 1090000),
                     ("Rotuladora", 249000), ("Destructora de papel", 389000)]),
    ]),
}


def crear_productos(rng) -> pd.DataFrame:
    filas, n = [], 1
    for cat, (margen, subcats) in CATALOGO.items():
        for sub, items in subcats:
            for nombre, precio in items:
                m = float(np.clip(rng.normal(margen, 0.04), 0.08, 0.55))
                costo = round(precio * (1 - m), -1)
                filas.append({
                    "sku": f"P-{n:03d}",
                    "producto": nombre,
                    "categoria": cat,
                    "subcategoria": sub,
                    "unidad": "Unidad" if precio > 60000 else "Paquete",
                    "precio_lista_2025": int(precio),
                    "costo_unitario_2025": int(costo),
                })
                n += 1
    p = pd.DataFrame(filas)
    p["precio_lista_2024"] = (p.precio_lista_2025 / 1.065).round(-2).astype(int)
    p["costo_unitario_2024"] = (p.costo_unitario_2025 / 1.055).round(-1).astype(int)
    return p


# ---------------------------------------------------------------------------
# Hechos: ventas
# ---------------------------------------------------------------------------
ESTACIONALIDAD = {1: 1.18, 2: 1.12, 3: 0.98, 4: 0.94, 5: 0.97, 6: 0.84,
                  7: 0.90, 8: 0.99, 9: 1.00, 10: 1.03, 11: 1.12, 12: 1.16}
AJUSTE_CATEGORIA = {  # multiplicador por (categoría, mes)
    "Papelería": {1: 1.7, 2: 1.5, 12: 0.7},
    "Tecnología": {11: 1.4, 12: 1.6, 6: 0.8},
    "Mobiliario": {1: 1.3, 2: 1.3, 3: 1.2},
}
PREFERENCIA_SEGMENTO = {
    "Pyme": {"Papelería": 1.2, "Tecnología": 0.9, "Aseo y cafetería": 1.1, "Mobiliario": 0.6, "Impresión": 1.0},
    "Corporativo": {"Papelería": 0.9, "Tecnología": 1.4, "Aseo y cafetería": 1.0, "Mobiliario": 1.2, "Impresión": 1.1},
    "Gobierno": {"Papelería": 1.3, "Tecnología": 1.1, "Aseo y cafetería": 1.2, "Mobiliario": 1.0, "Impresión": 1.2},
    "Educación": {"Papelería": 1.8, "Tecnología": 0.8, "Aseo y cafetería": 1.0, "Mobiliario": 0.9, "Impresión": 1.0},
}


def crear_ventas(rng, sedes, vendedores, clientes, productos, n_facturas: int = 7000) -> pd.DataFrame:
    dias = pd.date_range(INICIO, FIN, freq="D")
    peso_dia = np.array([
        ESTACIONALIDAD[d.month] * (1.12 if d.year == 2025 else 1.0) *
        (0.0 if d.weekday() == 6 else 0.45 if d.weekday() == 5 else 1.0) *
        (0.04 if (d.month, d.day) in {(1, 1), (12, 25), (12, 31), (5, 1), (7, 20), (8, 7)} else 1.0)
        for d in dias
    ])
    fechas = rng.choice(dias, size=n_facturas, p=peso_dia / peso_dia.sum())
    fechas = np.sort(fechas)

    prod = productos.reset_index(drop=True)
    filas, linea = [], 1
    for k, f in enumerate(fechas, start=1):
        f = pd.Timestamp(f)
        activos = clientes[clientes.fecha_alta <= f]
        cli = activos.sample(1, weights=activos._pop, random_state=int(rng.integers(1e9))).iloc[0]
        sede = cli.id_sede if rng.random() < 0.92 else rng.choice(sedes.id_sede)
        vend_ok = vendedores[(vendedores.id_sede == sede) & (vendedores.fecha_ingreso <= f) &
                             (vendedores.fecha_retiro.isna() | (vendedores.fecha_retiro >= f))]
        vend = vend_ok.sample(1, weights=vend_ok.efectividad, random_state=int(rng.integers(1e9))).iloc[0]
        p_ecom = 0.14 if f.year == 2024 else 0.24
        canal = rng.choice(["Presencial", "Televentas", "E-commerce"], p=[0.56 - p_ecom / 2, 0.44 - p_ecom / 2, p_ecom])
        n_lineas = int(rng.choice([1, 2, 3, 4, 5], p=[0.30, 0.28, 0.20, 0.13, 0.09]))
        pesos = np.array([
            PREFERENCIA_SEGMENTO[cli.segmento][c] * AJUSTE_CATEGORIA.get(c, {}).get(f.month, 1.0)
            for c in prod.categoria
        ])
        skus = rng.choice(prod.index, size=n_lineas, replace=False, p=pesos / pesos.sum())
        factura = f"FV-{k:06d}"
        r = rng.random()
        if r < 0.022:
            estado = "Anulada"
        elif f >= pd.Timestamp("2025-11-01") and cli.dias_credito > 0 and r < 0.40:
            estado = "Pendiente"
        else:
            estado = "Pagada"
        medio = "Crédito" if cli.dias_credito > 0 and rng.random() < 0.7 else \
            rng.choice(["Transferencia", "Tarjeta", "Efectivo"], p=[0.55, 0.35, 0.10])
        for i in skus:
            p = prod.loc[i]
            precio = p.precio_lista_2025 if f.year == 2025 else p.precio_lista_2024
            costo = p.costo_unitario_2025 if f.year == 2025 else p.costo_unitario_2024
            base = 40 if precio < 30000 else 12 if precio < 150000 else 3 if precio < 1000000 else 1.6
            escala = {"Corporativo": 1.8, "Gobierno": 2.2, "Educación": 1.5, "Pyme": 1.0}[cli.segmento]
            cant = max(1, int(round(rng.gamma(1.6, base * escala / 1.6))))
            desc = 0.0
            if cli.segmento in ("Corporativo", "Gobierno"):
                desc += 0.05
            if cant * precio > 5_000_000:
                desc += 0.05
            if rng.random() < 0.08:
                desc += 0.05  # descuento comercial puntual del vendedor
            bruto = cant * precio
            valor_desc = round(bruto * desc)
            subtotal = bruto - valor_desc
            iva = round(subtotal * IVA)
            filas.append({
                "id_linea": linea, "id_factura": factura, "fecha": f.date(),
                "id_cliente": cli.id_cliente, "id_vendedor": vend.id_vendedor, "id_sede": sede,
                "canal": canal, "sku": p.sku, "cantidad": cant, "precio_unitario": int(precio),
                "descuento_pct": round(desc, 2), "valor_bruto": int(bruto), "valor_descuento": int(valor_desc),
                "subtotal": int(subtotal), "iva": int(iva), "total": int(subtotal + iva),
                "costo_total": int(cant * costo), "medio_pago": medio, "estado": estado,
            })
            linea += 1
    v = pd.DataFrame(filas)
    v["margen_bruto"] = v.subtotal - v.costo_total
    v["fecha"] = pd.to_datetime(v["fecha"])
    return v


def crear_metas(rng, ventas: pd.DataFrame) -> pd.DataFrame:
    real = (ventas[ventas.estado != "Anulada"]
            .assign(anio=lambda d: d.fecha.dt.year, mes=lambda d: d.fecha.dt.month)
            .groupby(["id_sede", "anio", "mes"], as_index=False).subtotal.sum())
    # La meta se fija con el promedio del mes y un sesgo optimista por sede
    sesgo = {"S01": 1.04, "S02": 1.08, "S03": 0.97, "S04": 1.10, "S05": 0.95, "S06": 1.02}
    suav = real.groupby(["id_sede", "mes"]).subtotal.transform("mean")
    crec = np.where(real.anio == 2025, 1.10, 0.95)
    real["meta_subtotal"] = (suav * crec * real.id_sede.map(sesgo) *
                             rng.normal(1, 0.03, len(real))).round(-5).astype(int)
    return real[["id_sede", "anio", "mes", "meta_subtotal"]]


# ---------------------------------------------------------------------------
# Exportación «sucia» de ERP (para módulos de limpieza y búsqueda)
# ---------------------------------------------------------------------------
def crear_export_sucio(rng, ventas, clientes, sedes, n=1800) -> pd.DataFrame:
    base = ventas.sample(n, random_state=SEMILLA).sort_values("id_linea").copy()
    base = base.merge(clientes[["id_cliente", "razon_social"]], on="id_cliente")
    base = base.merge(sedes[["id_sede", "ciudad"]], on="id_sede")
    d = pd.DataFrame({
        "Linea": base.id_linea.values,
        "Factura": base.id_factura.values,
        "Fecha": base.fecha.dt.strftime("%d/%m/%Y").values,
        "Cod Cliente": base.id_cliente.values,
        "Cliente": base.razon_social.values,
        "Ciudad": base.ciudad.values,
        "SKU": base.sku.values,
        "Cantidad": base.cantidad.astype(str).values,
        "Valor Neto": base.subtotal.values.astype(object),
        "Estado": base.estado.values,
    })
    m = len(d)

    def idx(frac):
        return rng.choice(m, size=int(m * frac), replace=False)

    # 1) Códigos con espacios y minúsculas → causa n.º 1 de #N/D en BUSCARV/BUSCARX
    for i in idx(0.10):
        d.at[i, "Cod Cliente"] = d.at[i, "Cod Cliente"] + " "
    for i in idx(0.05):
        d.at[i, "Cod Cliente"] = d.at[i, "Cod Cliente"].lower()
    # 2) Códigos que no existen en el maestro (cliente creado en el ERP pero no en el maestro)
    for i in idx(0.015):
        d.at[i, "Cod Cliente"] = f"C-{int(rng.integers(9000, 9999))}"
    # 3) Fechas en formatos mezclados
    for i in idx(0.12):
        d.at[i, "Fecha"] = pd.to_datetime(d.at[i, "Fecha"], dayfirst=True).strftime("%Y-%m-%d")
    for i in idx(0.04):
        crudo = d.at[i, "Fecha"]
        dt = pd.to_datetime(crudo, format="%Y-%m-%d" if "-" in crudo else "%d/%m/%Y")
        d.at[i, "Fecha"] = str((dt - pd.Timestamp("1899-12-30")).days)  # número serial de Excel
    # 4) Montos como texto con separador de miles y símbolo de moneda
    for i in idx(0.20):
        d.at[i, "Valor Neto"] = "$ " + f"{int(d.at[i, 'Valor Neto']):,}".replace(",", ".")
    # 5) Ciudades escritas de muchas formas
    variantes = {"Bogotá": ["Bogota", "BOGOTÁ", "Bogotá D.C.", "bogota "], "Medellín": ["Medellin", "MEDELLÍN"],
                 "Barranquilla": ["B/quilla", "Barranquilla "], "Cali": ["CALI", "Santiago de Cali"]}
    for i in idx(0.18):
        c = d.at[i, "Ciudad"]
        if c in variantes:
            d.at[i, "Ciudad"] = rng.choice(variantes[c])
    # 6) Cantidades con unidades pegadas y celdas vacías
    for i in idx(0.03):
        d.at[i, "Cantidad"] = d.at[i, "Cantidad"] + " und"
    for i in idx(0.02):
        d.at[i, "Valor Neto"] = None
    # 7) Filas duplicadas (doble exportación)
    dup = d.iloc[idx(0.03)]
    d = pd.concat([d, dup]).sort_values("Linea", kind="stable").reset_index(drop=True)
    return d


# ---------------------------------------------------------------------------
# Libro de práctica en Excel
# ---------------------------------------------------------------------------
def escribir_libro(ruta: Path, tablas: dict[str, pd.DataFrame], sucio: pd.DataFrame,
                   ventas, productos, sedes) -> None:
    from openpyxl import Workbook
    from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
    from openpyxl.utils import get_column_letter
    from openpyxl.worksheet.table import Table, TableStyleInfo

    AZUL, CIAN = "00006A", "45E7FF"
    f_base = Font(name="Arial", size=10)
    wb = Workbook()

    # --- LEEME ---------------------------------------------------------
    ws = wb.active
    ws.title = "LEEME"
    ws.sheet_view.showGridLines = False
    texto = [
        ("Distribuidora Andina S.A.S. — Libro de práctica", Font(name="Arial", size=16, bold=True, color=AZUL)),
        ("Excel Corporativo · 12 Claves — Dr. Bits", Font(name="Arial", size=11, color="555555")),
        ("", f_base),
        ("Empresa y cifras 100 % ficticias, generadas con semilla fija (scripts/generar_dataset.py).", f_base),
        ("", f_base),
        ("HOJAS", Font(name="Arial", size=11, bold=True, color=AZUL)),
        ("Ventas · Clientes · Productos · Vendedores · Sedes · Metas → datos limpios, cada uno como Tabla de Excel.", f_base),
        ("Reporte_Mal_Estructurado → Clave 1: encuentra por qué este reporte NO se puede analizar.", f_base),
        ("ERP_Sucio → Claves 2 y 5: exportación real con espacios, textos y duplicados. Cruza con Clientes.", f_base),
        ("", f_base),
        ("REGLAS DE ORO", Font(name="Arial", size=11, bold=True, color=AZUL)),
        ("1. Una fila = un registro. Una columna = un dato. Encabezados en una sola fila.", f_base),
        ("2. Las ventas Anuladas NO son venta: fíltralas antes de sumar.", f_base),
        ("3. 'subtotal' es la venta neta sin IVA: es la base de las metas comerciales.", f_base),
        ("4. Nunca escribas sobre la hoja Ventas: trabaja en hojas nuevas.", f_base),
        ("", f_base),
        ("Separador de argumentos: con configuración regional de Colombia Excel usa punto y coma (;).", f_base),
    ]
    for r, (t, font) in enumerate(texto, start=2):
        c = ws.cell(row=r, column=2, value=t)
        c.font = font
    ws.column_dimensions["A"].width = 3
    ws.column_dimensions["B"].width = 110

    # --- Tablas limpias --------------------------------------------------
    for nombre, df in tablas.items():
        ws = wb.create_sheet(nombre)
        df = df.copy()
        for col in df.columns:
            if pd.api.types.is_datetime64_any_dtype(df[col]):
                df[col] = df[col].dt.date
        ws.append(list(df.columns))
        for fila in df.itertuples(index=False):
            ws.append([None if (isinstance(x, float) and np.isnan(x)) or x is pd.NaT else x for x in fila])
        ref = f"A1:{get_column_letter(df.shape[1])}{df.shape[0] + 1}"
        t = Table(displayName=f"t{nombre}", ref=ref)
        t.tableStyleInfo = TableStyleInfo(name="TableStyleMedium2", showRowStripes=True)
        ws.add_table(t)
        ws.freeze_panes = "A2"
        for j, col in enumerate(df.columns, start=1):
            ancho = max(len(str(col)), *(len(str(x)) for x in df[col].head(200))) + 2
            ws.column_dimensions[get_column_letter(j)].width = min(max(ancho, 10), 42)
            fmt = None
            if col.startswith(("precio", "costo", "valor", "subtotal", "iva", "total", "margen", "meta")):
                fmt = '#,##0'
            elif col == "descuento_pct":
                fmt = '0%'
            elif col.startswith("fecha"):
                fmt = 'yyyy-mm-dd'
            if fmt:
                for (c,) in ws.iter_rows(min_row=2, min_col=j, max_col=j):
                    c.number_format = fmt

    # --- Reporte mal estructurado (Clave 1) --------------------------------
    ws = wb.create_sheet("Reporte_Mal_Estructurado")
    ws.sheet_view.showGridLines = False
    v = ventas[ventas.estado != "Anulada"].merge(productos[["sku", "categoria"]], on="sku")
    v = v.merge(sedes[["id_sede", "ciudad"]], on="id_sede")
    v = v[v.fecha.dt.year == 2025]
    v["trim"] = "T" + v.fecha.dt.quarter.astype(str)
    piv = v.pivot_table(index=["ciudad", "categoria"], columns="trim", values="subtotal", aggfunc="sum").fillna(0)
    ws.merge_cells("B2:G2")
    ws["B2"] = "INFORME DE VENTAS 2025 – DISTRIBUIDORA ANDINA (cifras en pesos)"
    ws["B2"].font = Font(name="Arial", size=14, bold=True, color="FFFFFF")
    ws["B2"].fill = PatternFill("solid", fgColor=AZUL)
    ws["B2"].alignment = Alignment(horizontal="center")
    ws.merge_cells("B4:B5"); ws["B4"] = "Ciudad"
    ws.merge_cells("C4:C5"); ws["C4"] = "Línea"
    ws.merge_cells("D4:G4"); ws["D4"] = "Ventas por trimestre"
    for j, tq in enumerate(["T1", "T2", "T3", "T4"]):
        ws.cell(row=5, column=4 + j, value=tq)
    borde = Border(*(Side(style="thin", color="999999"),) * 4)
    for row in ws["B4:G5"]:
        for c in row:
            c.font = Font(name="Arial", bold=True, color=AZUL)
            c.fill = PatternFill("solid", fgColor=CIAN)
            c.alignment = Alignment(horizontal="center", vertical="center")
            c.border = borde
    r = 6
    for ciudad in sedes.ciudad:
        bloque = piv.loc[ciudad]
        inicio = r
        for cat, fila in bloque.iterrows():
            ws.cell(row=r, column=3, value=cat)
            for j, tq in enumerate(["T1", "T2", "T3", "T4"]):
                val = int(fila.get(tq, 0))
                # Cifras en «millones» escritas como texto: error clásico de reportes copiados
                ws.cell(row=r, column=4 + j, value=f"{val / 1e6:,.1f} M".replace(",", "X").replace(".", ",").replace("X", ".")
                        if (r + j) % 7 == 0 else val)
                ws.cell(row=r, column=4 + j).number_format = '#,##0'
            r += 1
        ws.merge_cells(start_row=inicio, start_column=2, end_row=r - 1, end_column=2)
        ws.cell(row=inicio, column=2, value=ciudad).alignment = Alignment(vertical="center")
        ws.cell(row=r, column=3, value=f"Subtotal {ciudad}").font = Font(name="Arial", bold=True)
        for j in range(4):
            ws.cell(row=r, column=4 + j, value=int(bloque.iloc[:, j].sum())).font = Font(name="Arial", bold=True)
            ws.cell(row=r, column=4 + j).number_format = '#,##0'
        r += 2  # fila en blanco entre ciudades
    ws.cell(row=r, column=3, value="TOTAL GENERAL").font = Font(name="Arial", bold=True, color=AZUL)
    for j in range(4):
        c = ws.cell(row=r, column=4 + j, value=int(piv.iloc[:, j].sum()))
        c.font = Font(name="Arial", bold=True, color=AZUL)
        c.number_format = '#,##0'
    ws.cell(row=r + 2, column=2, value="Nota: T3 de Cali incluye ajuste manual pendiente por validar con contabilidad.").font = \
        Font(name="Arial", italic=True, color="AA0000")
    for col, w in zip("ABCDEFG", [3, 16, 22, 15, 15, 15, 15]):
        ws.column_dimensions[col].width = w

    # --- ERP sucio ----------------------------------------------------
    ws = wb.create_sheet("ERP_Sucio")
    ws.append(list(sucio.columns))
    for fila in sucio.itertuples(index=False):
        ws.append([None if x is None or (isinstance(x, float) and np.isnan(x)) else x for x in fila])
    for j, col in enumerate(sucio.columns, start=1):
        ws.column_dimensions[get_column_letter(j)].width = 14 if col != "Cliente" else 40

    for hoja in wb.worksheets:
        for row in hoja.iter_rows(min_row=1, max_row=1):
            for c in row:
                if c.font is None or not c.font.bold:
                    c.font = Font(name="Arial", bold=True)
    wb.save(ruta)


# ---------------------------------------------------------------------------
# Muestra compacta para el tablero web (index.html)
# ---------------------------------------------------------------------------
def exportar_muestra_web(ruta: Path, ventas, clientes, productos, vendedores, sedes, sucio) -> None:
    v = ventas.merge(productos[["sku", "categoria"]], on="sku") \
              .merge(clientes[["id_cliente", "segmento"]], on="id_cliente") \
              .merge(sedes[["id_sede", "ciudad"]], on="id_sede") \
              .merge(vendedores[["id_vendedor", "nombre_vendedor"]], on="id_vendedor")
    v = v.sort_values("id_linea")
    dims = {
        "anio": sorted(v.fecha.dt.year.unique().tolist()),
        "mes": list(range(1, 13)),
        "ciudad": sedes.ciudad.tolist(),
        "categoria": list(CATALOGO.keys()),
        "segmento": ["Pyme", "Corporativo", "Gobierno", "Educación"],
        "canal": ["Presencial", "Televentas", "E-commerce"],
        "vendedor": vendedores.nombre_vendedor.tolist(),
        "estado": ["Pagada", "Pendiente", "Anulada"],
    }
    col = {
        "anio": v.fecha.dt.year.map({a: i for i, a in enumerate(dims["anio"])}).tolist(),
        "mes": (v.fecha.dt.month - 1).tolist(),
        "ciudad": v.ciudad.map({c: i for i, c in enumerate(dims["ciudad"])}).tolist(),
        "categoria": v.categoria.map({c: i for i, c in enumerate(dims["categoria"])}).tolist(),
        "segmento": v.segmento.map({c: i for i, c in enumerate(dims["segmento"])}).tolist(),
        "canal": v.canal.map({c: i for i, c in enumerate(dims["canal"])}).tolist(),
        "vendedor": v.nombre_vendedor.map({c: i for i, c in enumerate(dims["vendedor"])}).tolist(),
        "estado": v.estado.map({c: i for i, c in enumerate(dims["estado"])}).tolist(),
        "subtotal": v.subtotal.tolist(),
        "margen": v.margen_bruto.tolist(),
        "cantidad": v.cantidad.tolist(),
        "factura": v.id_factura.str[3:].astype(int).tolist(),
    }
    # Muestra para el simulador de búsqueda (Clave 5)
    cli = clientes.sort_values("id_cliente").head(40)[["id_cliente", "razon_social", "segmento", "ciudad", "dias_credito"]]
    erp = sucio.head(14)[["Factura", "Cod Cliente", "Valor Neto"]].copy()
    erp["Valor Neto"] = erp["Valor Neto"].astype(str)
    data = {
        "dims": dims, "cols": col,
        "clientes": cli.values.tolist(),
        "erp": erp.values.tolist(),
        "n_lineas": int(len(v)),
    }
    ruta.write_text("window.DATA_ANDINA = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n",
                    encoding="utf-8")


# ---------------------------------------------------------------------------
def main(salida: Path) -> None:
    rng = np.random.default_rng(SEMILLA)
    salida.mkdir(parents=True, exist_ok=True)

    sedes = crear_sedes()
    vendedores = crear_vendedores(rng, sedes)
    clientes = crear_clientes(rng, sedes)
    productos = crear_productos(rng)
    ventas = crear_ventas(rng, sedes, vendedores, clientes, productos)
    metas = crear_metas(rng, ventas)
    sucio = crear_export_sucio(rng, ventas, clientes, sedes)

    publicos = {
        "Ventas": ventas,
        "Clientes": clientes.drop(columns="_pop"),
        "Productos": productos,
        "Vendedores": vendedores.drop(columns="efectividad"),
        "Sedes": sedes.drop(columns="peso"),
        "Metas": metas,
    }
    for nombre, df in publicos.items():
        df.to_csv(salida / f"{nombre.lower()}.csv", index=False, encoding="utf-8", date_format="%Y-%m-%d")
    sucio.to_csv(salida / "ventas_erp_sucio.csv", index=False, encoding="utf-8")

    escribir_libro(salida / "Distribuidora_Andina_practica.xlsx", publicos, sucio, ventas, productos, sedes)
    web = salida.parent / "assets" / "datos-andina.js"
    exportar_muestra_web(web, ventas, clientes, productos, vendedores, sedes, sucio)

    validas = ventas[ventas.estado != "Anulada"]
    print(f"Líneas de venta: {len(ventas):,} | facturas: {ventas.id_factura.nunique():,}")
    print(f"Venta neta válida 2024: {validas[validas.fecha.dt.year == 2024].subtotal.sum():,.0f}")
    print(f"Venta neta válida 2025: {validas[validas.fecha.dt.year == 2025].subtotal.sum():,.0f}")
    print(f"Exportación sucia: {len(sucio):,} filas")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--salida", type=Path, default=Path(__file__).resolve().parents[1] / "data")
    main(ap.parse_args().salida)
