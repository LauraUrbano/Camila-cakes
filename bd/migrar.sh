#!/usr/bin/env bash
# Aplica as migrações pela ligação directa, não pela agrupada: o PgBouncer
# em modo transacção faz migrações falharem de forma intermitente.
set -euo pipefail

URL="${DATABASE_URL_UNPOOLED:-${DATABASE_URL:-}}"
if [ -z "$URL" ]; then
  echo "Falta DATABASE_URL_UNPOOLED (ou DATABASE_URL)." >&2
  exit 1
fi

for ficheiro in bd/[0-9]*.sql; do
  echo "→ $ficheiro"
  psql "$URL" -v ON_ERROR_STOP=1 -f "$ficheiro"
done
echo "✓ migrações aplicadas"
