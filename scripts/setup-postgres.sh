#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

COMPOSE_FILE="docker-compose.yml"
CONTAINER="yenikule-postgres"
DB_USER="yenikule"
DB_PASS="yenikule_dev"
DB_NAME="yenikule"
DB_PORT="5432"

DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@localhost:${DB_PORT}/${DB_NAME}"

echo "==> Yeni Kule — yerel PostgreSQL kurulumu"
echo ""

if ! command -v docker >/dev/null 2>&1; then
  echo "Hata: Docker yüklü değil. https://docs.docker.com/get-docker/"
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Hata: Docker daemon çalışmıyor. Docker Desktop'ı açıp tekrar deneyin."
  exit 1
fi

echo "==> PostgreSQL container başlatılıyor..."
docker compose -f "$COMPOSE_FILE" up -d postgres

echo "==> Veritabanı hazır olana kadar bekleniyor..."
for i in $(seq 1 30); do
  if docker exec "$CONTAINER" pg_isready -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; then
    break
  fi
  sleep 1
  if [ "$i" -eq 30 ]; then
    echo "Hata: PostgreSQL zaman aşımına uğradı."
    exit 1
  fi
done

echo "==> Şema uygulanıyor (db/schema.sql)..."
docker exec -i "$CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" < db/schema.sql

echo ""
echo "=============================================="
echo "  PostgreSQL hazır"
echo "=============================================="
echo ""
echo "DATABASE_URL (yerel):"
echo "$DATABASE_URL"
echo ""
echo "Vercel / .env.local için bu satırı ekleyin:"
echo "DATABASE_URL=$DATABASE_URL"
echo "USE_MOCK_DATA=false"
echo ""
echo "Not: Vercel production için Neon kullanın:"
echo "  ./scripts/setup-neon.sh"
echo ""
