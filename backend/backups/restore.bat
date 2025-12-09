@echo off
REM Restore Roger Rabbit sample data from SQL backup
REM Run this from the backend directory: backups\restore.bat

setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "BACKUP_FILE=%SCRIPT_DIR%roger-rabbit-full.sql"

echo === Roger Rabbit Sample Data Restore ===
echo This will restore the database from: %BACKUP_FILE%
echo.

REM Check if running from backend directory
if not exist "docker-compose.yml" (
    echo Error: Please run this script from the backend directory
    exit /b 1
)

REM Check if backup file exists
if not exist "%BACKUP_FILE%" (
    echo Error: Backup file not found: %BACKUP_FILE%
    exit /b 1
)

echo WARNING: This will drop and recreate the database!
set /p confirm="Continue? (y/N): "
if /i not "%confirm%"=="y" (
    echo Aborted.
    exit /b 0
)

echo.
echo 1. Stopping Directus...
docker compose stop directus

echo.
echo 2. Dropping and recreating database...
docker compose exec -T database psql -U directus -d postgres -c "DROP DATABASE IF EXISTS directus;"
docker compose exec -T database psql -U directus -d postgres -c "CREATE DATABASE directus;"

echo.
echo 3. Restoring from backup...
docker compose exec -T database psql -U directus -d directus < "%BACKUP_FILE%"

echo.
echo 4. Starting Directus...
docker compose start directus

echo.
echo 5. Waiting for Directus to start...
timeout /t 10 /nobreak > nul

echo.
echo === Restore Complete ===
echo You can now access Directus at http://localhost:8055
echo Login: admin@example.com / d1r3ctu5
