#!/usr/bin/env bash
set -euo pipefail

# Database restore script
# Usage: ./scripts/db-restore.sh <backup_file.sql.gz>

BACKUP_FILE="${1:-}"

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: $0 <backup_file.sql.gz>"
  echo "Available backups:"
  ls -la ./backups/*.sql.gz 2>/dev/null || echo "  No backups found in ./backups/"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: Backup file not found: $BACKUP_FILE"
  exit 1
fi

CONTAINER_NAME=$(docker compose ps -q db 2>/dev/null || echo "")
if [ -z "$CONTAINER_NAME" ]; then
  echo "Error: Database container not running."
  exit 1
fi

echo "WARNING: This will overwrite the current database."
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 0
fi

echo "Restoring from ${BACKUP_FILE}..."
gunzip -c "$BACKUP_FILE" | docker compose exec -T db psql -U "${DB_USERNAME:-aaagent}" "${DB_DATABASE:-aaagent}"

echo "Restore complete."
