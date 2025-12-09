# Database Backups

This folder contains SQL backups of the Roger Rabbit sample data for the Master Resume system.

## Files

- `roger-rabbit-full.sql` - Complete database dump including schema and data
- `roger-rabbit-sample-data.sql` - Data-only dump (requires schema to be loaded first)

## Restore Instructions

### Prerequisites
- Docker and Docker Compose installed
- Backend containers should be running (`docker compose up -d`)

### Restoring from Backup

From the `backend` directory, run one of the restore scripts:

**Windows (PowerShell):**
```powershell
.\backups\restore.ps1
```

**Windows (Command Prompt):**
```cmd
backups\restore.bat
```

**Linux/Mac:**
```bash
./backups/restore.sh
```

### Manual Restore

If the scripts don't work, you can restore manually:

```bash
# Stop Directus
docker compose stop directus

# Drop and recreate database
docker compose exec -T database psql -U directus -d postgres -c "DROP DATABASE IF EXISTS directus;"
docker compose exec -T database psql -U directus -d postgres -c "CREATE DATABASE directus;"

# Restore from backup
docker compose exec -T database psql -U directus -d directus < backups/roger-rabbit-full.sql

# Start Directus
docker compose start directus
```

## Creating New Backups

To create a new backup after modifying data:

```bash
# Full backup (schema + data)
docker compose exec -T database pg_dump -U directus -d directus \
  --exclude-table=directus_activity \
  --exclude-table=directus_revisions \
  --exclude-table=directus_sessions \
  > backups/roger-rabbit-full.sql

# Data-only backup
docker compose exec -T database pg_dump -U directus -d directus \
  --data-only \
  --exclude-table=directus_activity \
  --exclude-table=directus_revisions \
  --exclude-table=directus_sessions \
  > backups/roger-rabbit-sample-data.sql
```

## Generating Sample Data

If you don't have a SQL backup, you can generate the Roger Rabbit sample data by importing from the schema-sync JSON files:

```bash
# Get a fresh access token
TOKEN=$(curl -s -X POST http://localhost:8055/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"d1r3ctu5"}' \
  | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

# Import each collection (order matters for foreign keys)
for collection in companies positions accomplishments skills technologies projects education certifications; do
  curl -X POST "http://localhost:8055/items/$collection?access_token=$TOKEN" \
    -H "Content-Type: application/json" \
    -d @schema-sync/data/$collection.json
done
```

Note: The `identity` and `professional_summaries` collections are singleton-like and may already have data.

## Login Credentials

After restore, login to Directus at http://localhost:8055:
- **Email:** admin@example.com
- **Password:** d1r3ctu5
