"""
Construye el tablero a partir de src/tablero.html.

* index.html            → página para GitHub Pages (carga assets/datos-andina.js y el logo).
* dist/vista_previa.html → versión autocontenida (datos y logo incrustados), útil para
                           compartir un solo archivo o revisar sin servidor.

Uso:  python scripts/construir_tablero.py
"""
import base64
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
MARCA_DATOS = '<script src="assets/datos-andina.js"></script>\n'


def main() -> None:
    fuente = (RAIZ / "src" / "tablero.html").read_text(encoding="utf-8")
    # El primer <script> sin src es el código de la página: los datos deben cargarse antes.
    i = fuente.index("<script>\n")
    cuerpo = fuente[:i] + MARCA_DATOS + fuente[i:]

    titulo_fin = cuerpo.index("</style>") + len("</style>")
    cabeza, resto = cuerpo[:titulo_fin], cuerpo[titulo_fin:]
    index = (
        "<!doctype html>\n<html lang=\"es\">\n<head>\n<meta charset=\"utf-8\">\n"
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n"
        "<link rel=\"icon\" href=\"assets/logo-drbits.jpg\">\n"
        + cabeza + "\n</head>\n<body>\n" + resto + "\n</body>\n</html>\n"
    )
    (RAIZ / "index.html").write_text(index, encoding="utf-8")

    # Vista previa autocontenida
    datos = (RAIZ / "assets" / "datos-andina.js").read_text(encoding="utf-8")
    logo = base64.b64encode((RAIZ / "assets" / "logo-drbits.jpg").read_bytes()).decode()
    previa = cuerpo.replace(MARCA_DATOS, "<script>\n" + datos + "</script>\n")
    previa = previa.replace('src="assets/logo-drbits.jpg"', f'src="data:image/jpeg;base64,{logo}"')
    (RAIZ / "dist").mkdir(exist_ok=True)
    (RAIZ / "dist" / "vista_previa.html").write_text(previa, encoding="utf-8")
    print("index.html y dist/vista_previa.html listos")


if __name__ == "__main__":
    main()
