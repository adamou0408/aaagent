#!/usr/bin/env bash
set -euo pipefail

# Database backup script
# Usage: ./scripts/db-backup.sh [output_dir]

OUTPUT_DIR="${1:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
CONTAINER_NAME=$(docker compose ps -q db 2>/dev/null || echo "")

if [ -z "$CONTAINER_NAME" ]; then
  echo "Error: Database container not running. Start with 'make docker-up' first."
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

BACKUP_FILE="$OUTPUT_DIR/backup_${TIMESTAMP}.sql.gz"

echo "Backing up database to ${BACKUP_FILE}..."
docker compose exec -T db pg_dump -U "${DB_USERNAME:-aaagent}" "${DB_DATABASE:-aaagent}" | gzip > "$BACKUP_FILE"

echo "Backup complete: ${BACKUP_FILE} ($(du -h "$BACKUP_FILE" | cut -f1))"
