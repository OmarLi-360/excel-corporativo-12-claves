"""
Genera todos los cuadernos de Google Colab (versión 2, enfoque visual y sin código expuesto).

Uso:  python scripts/construir_cuadernos.py
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from cuadernos.claves import cuaderno_00, cuaderno_01, cuaderno_05, cuaderno_07, cuaderno_graficos  # noqa: E402
from cuadernos.comun import escribir  # noqa: E402
from cuadernos.fundamentos import cuaderno_02, cuaderno_03, cuaderno_04  # noqa: E402
from cuadernos.talleres import taller_1, taller_2, taller_3  # noqa: E402

if __name__ == "__main__":
    escribir("00_conoce_la_empresa.ipynb", cuaderno_00())
    escribir("01_estructura_y_tablas.ipynb", cuaderno_01())
    escribir("02_tipos_de_dato.ipynb", cuaderno_02())
    escribir("03_referencias.ipynb", cuaderno_03())
    escribir("04_logica_condicional.ipynb", cuaderno_04())
    escribir("05_busqueda_y_cruce.ipynb", cuaderno_05())
    escribir("07_tablas_dinamicas.ipynb", cuaderno_07())
    escribir("graficos_para_informes.ipynb", cuaderno_graficos())
    escribir("taller_1_excel_a_colab.ipynb", taller_1())
    escribir("taller_2_colab_a_excel.ipynb", taller_2())
    escribir("taller_3_tablero_comite.ipynb", taller_3())
