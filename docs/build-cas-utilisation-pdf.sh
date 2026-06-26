#!/usr/bin/env bash
# Regenerates docs/cas-utilisation.pdf from cas-utilisation.md (UTF-8).
set -euo pipefail
cd "$(dirname "$0")"

pandoc cas-utilisation.md \
  --standalone \
  --from markdown \
  --to html5 \
  --metadata lang=fr \
  --metadata title="Cas d'utilisation - Boutique PCJ" \
  -H pdf-header.html \
  -o /tmp/cas-utilisation.html

wkhtmltopdf --encoding UTF-8 --quiet /tmp/cas-utilisation.html cas-utilisation.pdf
echo "OK: docs/cas-utilisation.pdf"
