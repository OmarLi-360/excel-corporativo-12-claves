#!/usr/bin/env bash
# Publica el repositorio en GitHub y activa GitHub Pages.
# Requisitos: git y GitHub CLI (https://cli.github.com) con sesión iniciada: gh auth login
set -euo pipefail
REPO="OmarLi-360/excel-corporativo-12-claves"

gh repo create "$REPO" --public \
  --description "Guía interactiva de Excel corporativo en 12 claves, con cuadernos de Google Colab. Dr. Bits." \
  --homepage "https://omarli-360.github.io/excel-corporativo-12-claves/" \
  --source . --remote origin --push

# GitHub Pages desde la rama main, carpeta raíz
gh api -X POST "repos/$REPO/pages" -f "source[branch]=main" -f "source[path]=/" >/dev/null \
  || echo "Si Pages ya estaba activo, ignora este aviso."
gh repo edit "$REPO" --add-topic excel --add-topic sena --add-topic google-colab --add-topic analisis-de-datos --add-topic educacion

echo "Listo. El tablero estará en https://omarli-360.github.io/excel-corporativo-12-claves/ en 1 o 2 minutos."
