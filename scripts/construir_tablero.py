"""
Construye el tablero a partir de src/.

* index.html             → página para GitHub Pages. Carga los scripts como archivos
                            separados (src/motor, src/contenido), así cada cambio de
                            contenido toca un archivo pequeño.
* dist/vista_previa.html → versión autocontenida (datos, scripts y logo incrustados),
                            útil para revisar sin servidor o compartir un solo archivo.

Uso:  python scripts/construir_tablero.py
"""
import base64
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]

# Orden de carga: datos → motor → contenido → aplicación (arranca al final)
SCRIPTS = [
    "assets/datos-andina.js",
    "src/motor/utilidades.js",
    "src/motor/graficos.js",
    "src/motor/simuladores.js",
    "src/contenido/claves.js",
    "src/contenido/claves_fundamentos.js",
    "src/contenido/claves_analisis_control.js",
    "src/contenido/claves_cierre.js",
    "src/contenido/empresa.js",
    "src/contenido/graficos.js",
    "src/contenido/laboratorio.js",
    "src/app.js",
]


def main() -> None:
    shell = (RAIZ / "src" / "tablero.html").read_text(encoding="utf-8")
    fin_head = shell.index("</style>") + len("</style>")
    cabeza, cuerpo = shell[:fin_head], shell[fin_head:]

    etiquetas = "\n".join(f'<script src="{s}"></script>' for s in SCRIPTS)
    index = (
        "<!doctype html>\n<html lang=\"es\">\n<head>\n<meta charset=\"utf-8\">\n"
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n"
        "<link rel=\"icon\" href=\"assets/logo-drbits.jpg\">\n"
        + cabeza + "\n</head>\n<body>\n" + cuerpo + "\n" + etiquetas + "\n</body>\n</html>\n"
    )
    (RAIZ / "index.html").write_text(index, encoding="utf-8")

    logo = base64.b64encode((RAIZ / "assets" / "logo-drbits.jpg").read_bytes()).decode()
    codigo = "\n".join(
        "<script>\n" + (RAIZ / s).read_text(encoding="utf-8").replace("</script", "<\\/script") + "\n</script>"
        for s in SCRIPTS)
    previa = shell.replace('src="assets/logo-drbits.jpg"', f'src="data:image/jpeg;base64,{logo}"') + "\n" + codigo
    (RAIZ / "dist").mkdir(exist_ok=True)
    (RAIZ / "dist" / "vista_previa.html").write_text(previa, encoding="utf-8")
    print("index.html y dist/vista_previa.html listos")


if __name__ == "__main__":
    main()
