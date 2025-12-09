#!/bin/bash
# Restore Roger Rabbit sample data from SQL backup
# Run this from the backend directory: ./backups/restore.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_FILE="${SCRIPT_DIR}/roger-rabbit-full.sql"

echo "=== Roger Rabbit Sample Data Restore ==="
echo "This will restore the database from: $BACKUP_FILE"
echo ""

# Check if running from backend directory
if [ ! -f "docker-compose.yml" ]; then
    echo "Error: Please run this script from the backend directory"
    exit 1
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "WARNING: This will drop and recreate the database!"
read -p "Continue? (y/N): " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "Aborted."
    exit 0
fi

echo ""
echo "1. Stopping Directus..."
docker compose stop directus

echo ""
echo "2. Dropping and recreating database..."
docker compose exec -T database psql -U directus -d postgres -c "DROP DATABASE IF EXISTS directus;"
docker compose exec -T database psql -U directus -d postgres -c "CREATE DATABASE directus;"

echo ""
echo "3. Restoring from backup..."
docker compose exec -T database psql -U directus -d directus < "$BACKUP_FILE"

echo ""
echo "4. Starting Directus..."
docker compose start directus

echo ""
echo "5. Waiting for Directus to start..."
sleep 10

echo ""
echo "=== Restore Complete ==="
echo "You can now access Directus at http://localhost:8055"
echo "Login: admin@example.com / d1r3ctu5"
