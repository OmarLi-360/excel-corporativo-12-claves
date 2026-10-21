# Datos · Distribuidora Andina S.A.S.

Empresa **ficticia**. Todas las cifras se generan con `scripts/generar_dataset.py` (semilla 2026). Periodo: 1 de enero de 2024 a 31 de diciembre de 2025, más enero de 2026 en `nuevo_mes/` (generado con una semilla aparte, así no altera los datos anteriores). Moneda: pesos colombianos.

## Modelo

Un hecho (`ventas`) y cinco maestros, unidos por llaves (modelo en estrella):

```
clientes ──id_cliente──┐
productos ────sku──────┤
vendedores ─id_vendedor┼── ventas (una fila por línea de factura)
sedes ──────id_sede────┤
metas ── id_sede + año + mes (se compara con ventas resumidas al mismo nivel)
```

## Archivos

| Archivo | Filas | Contenido |
|---|---|---|
| `ventas.csv` | 17.106 | Una fila por línea de factura (7.000 facturas) |
| `clientes.csv` | 420 | Maestro de clientes |
| `productos.csv` | 73 | Catálogo con precio y costo 2024 y 2025 |
| `vendedores.csv` | 18 | Fuerza comercial, con ingresos y retiros |
| `sedes.csv` | 6 | Sedes |
| `metas.csv` | 144 | Meta mensual de venta neta por sede |
| `ventas_erp_sucio.csv` | 1.854 | Exportación de ERP con defectos (para limpiar y cruzar) |
| `Distribuidora_Andina_practica.xlsx` | — | Todo lo anterior como Tablas de Excel, la hoja `Reporte_Mal_Estructurado` y la hoja `ERP_Sucio` |
| `Andina_listo_para_dinamicas.xlsx` | 17.106 | Una sola tabla `tVentas` con todo unido (ciudad, vendedor, cliente, segmento, línea, producto) y `tMetas`, más una hoja `Panel` vacía. Es la salida del Taller 2 |
| `nuevo_mes/ventas_2026_01.csv` | 914 | Enero de 2026 con el mismo esquema de `ventas.csv` (Taller 3) |
| `nuevo_mes/metas_2026_01.csv` | 6 | Metas de enero de 2026 |
| `nuevo_mes/Andina_enero_2026_para_pegar.xlsx` | — | Enero de 2026 en el formato de `tVentas` y `tMetas`, listo para pegar debajo de las Tablas |

## Diccionario: `ventas.csv`

| Columna | Tipo | Descripción |
|---|---|---|
| `id_linea` | Entero | Identificador único de la línea |
| `id_factura` | Texto | Número de factura (`FV-000001`); una factura tiene de 1 a 5 líneas |
| `fecha` | Fecha | Fecha de la factura |
| `id_cliente` | Texto | Llave hacia `clientes` |
| `id_vendedor` | Texto | Llave hacia `vendedores` |
| `id_sede` | Texto | Sede que factura; llave hacia `sedes` y `metas` |
| `canal` | Texto | Presencial, Televentas o E-commerce |
| `sku` | Texto | Llave hacia `productos` |
| `cantidad` | Entero | Unidades o paquetes |
| `precio_unitario` | Pesos | Precio de lista del año de la venta (ajuste de 6,5 % en 2025) |
| `descuento_pct` | Porcentaje | 0, 5, 10 o 15 % según segmento, volumen y negociación |
| `valor_bruto` | Pesos | `cantidad × precio_unitario` |
| `valor_descuento` | Pesos | `valor_bruto × descuento_pct` |
| `subtotal` | Pesos | **Venta neta sin IVA.** Base de las metas |
| `iva` | Pesos | 19 % del subtotal |
| `total` | Pesos | `subtotal + iva` |
| `costo_total` | Pesos | `cantidad ×` costo unitario del año |
| `margen_bruto` | Pesos | `subtotal − costo_total` |
| `medio_pago` | Texto | Transferencia, Tarjeta, Efectivo o Crédito |
| `estado` | Texto | Pagada, Pendiente (cartera) o **Anulada (no es venta)** |

## Maestros

* **clientes:** `id_cliente`, `razon_social`, `segmento` (Pyme, Corporativo, Gobierno, Educación), `id_sede`, `ciudad`, `dias_credito` (0, 30 o 60), `fecha_alta`.
* **productos:** `sku`, `producto`, `categoria` (Papelería, Tecnología, Aseo y cafetería, Mobiliario, Impresión), `subcategoria`, `unidad`, `precio_lista_2025`, `costo_unitario_2025`, `precio_lista_2024`, `costo_unitario_2024`.
* **vendedores:** `id_vendedor`, `nombre_vendedor`, `id_sede`, `fecha_ingreso`, `fecha_retiro`, `estado`.
* **sedes:** `id_sede`, `ciudad`, `departamento`, `region`, `fecha_apertura`.
* **metas:** `id_sede`, `anio`, `mes`, `meta_subtotal`.

## Defectos de `ventas_erp_sucio.csv`

Son intencionales y reproducen lo que llega de un ERP real:

* Códigos de cliente con espacios al final y en minúsculas.
* Códigos que no existen en el maestro (huérfanos).
* Fechas en tres formatos: `dd/mm/aaaa`, `aaaa-mm-dd` y número serial de Excel.
* Montos como texto con símbolo y separador de miles (`$ 1.234.567`) y celdas vacías.
* Ciudades escritas de varias formas (`Bogota`, `BOGOTÁ`, `Bogotá D.C.`, `B/quilla`).
* Cantidades con unidad pegada (`49 und`).
* Filas exportadas dos veces.

## Cifra de control del Taller 3

Venta neta de enero de 2026 sin facturas anuladas: **$ 1.204.089.720** (81,7 % de la meta de $ 1.473.000.000). Debe coincidir en Excel y en Colab.

## Reglas para analizar

1. Las facturas **Anuladas** no son venta: exclúyelas en cualquier pregunta comercial.
2. `subtotal` es la venta neta; `total` incluye IVA.
3. Para contar facturas usa recuento distinto de `id_factura`; contar filas cuenta líneas.
4. Los porcentajes de un grupo se calculan como razón de sumas, nunca como promedio de porcentajes.
