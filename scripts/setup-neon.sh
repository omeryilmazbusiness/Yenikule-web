#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PROJECT_NAME="${NEON_PROJECT_NAME:-yenikule-web}"
DB_NAME="${NEON_DATABASE_NAME:-yenikule}"

echo "==> Yeni Kule — Neon PostgreSQL (production)"
echo ""

if [ -n "${NEON_API_KEY:-}" ]; then
  NEON_AUTH=(--api-key "$NEON_API_KEY")
else
  NEON_AUTH=()
  echo "Neon hesabına giriş (tarayıcı açılacak)..."
  npx --yes neonctl@latest auth "${NEON_AUTH[@]}" || true
fi

if ! npx --yes neonctl@latest me "${NEON_AUTH[@]}" >/dev/null 2>&1; then
  echo ""
  echo "Hata: Neon oturumu yok."
  echo "  1) Bu scripti tekrar çalıştırın ve tarayıcıda giriş yapın"
  echo "  2) veya https://console.neon.tech → Account → API Keys → NEON_API_KEY export edin"
  exit 1
fi

echo "==> Neon projesi oluşturuluyor: $PROJECT_NAME"
PROJECT_JSON="$(npx --yes neonctl@latest projects create \
  --name "$PROJECT_NAME" \
  --output json \
  "${NEON_AUTH[@]}" 2>/dev/null || true)"

if [ -z "$PROJECT_JSON" ]; then
  echo "Proje zaten var olabilir; mevcut proje listeleniyor..."
  PROJECT_JSON="$(npx --yes neonctl@latest projects list --output json "${NEON_AUTH[@]}" | node -e "
    const list = JSON.parse(require('fs').readFileSync(0,'utf8'));
    const projects = Array.isArray(list) ? list : list.projects ?? [];
    const match = projects.find(p => p.name === process.argv[1]);
    if (!match) { console.error('Proje bulunamadı'); process.exit(1); }
    console.log(JSON.stringify(match));
  " "$PROJECT_NAME")"
fi

PROJECT_ID="$(echo "$PROJECT_JSON" | node -e "const p=JSON.parse(require('fs').readFileSync(0,'utf8')); console.log(p.id || p.project?.id || '')")"

if [ -z "$PROJECT_ID" ]; then
  echo "Hata: Proje ID alınamadı."
  exit 1
fi

echo "==> Connection string alınıyor (project: $PROJECT_ID)..."
DATABASE_URL="$(npx --yes neonctl@latest connection-string \
  --project-id "$PROJECT_ID" \
  --database-name "$DB_NAME" \
  --role-name neondb_owner \
  --pooled \
  "${NEON_AUTH[@]}" 2>/dev/null || npx --yes neonctl@latest connection-string \
  --project-id "$PROJECT_ID" \
  "${NEON_AUTH[@]}")"

echo ""
echo "=============================================="
echo "  Neon PostgreSQL hazır"
echo "=============================================="
echo ""
echo "Project ID: $PROJECT_ID"
echo ""
echo "DATABASE_URL (Vercel Production):"
echo "$DATABASE_URL"
echo ""
echo "Vercel Environment Variables:"
echo "  DATABASE_URL=$DATABASE_URL"
echo "  USE_MOCK_DATA=false"
echo ""
echo "Şemayı Neon'a uygulamak için:"
echo "  psql \"$DATABASE_URL\" -f db/schema.sql"
echo ""
