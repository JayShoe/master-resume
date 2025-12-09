# Restore Roger Rabbit sample data from SQL backup
# Run this from the backend directory: .\backups\restore.ps1

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackupFile = Join-Path $ScriptDir "roger-rabbit-full.sql"

Write-Host "=== Roger Rabbit Sample Data Restore ===" -ForegroundColor Cyan
Write-Host "This will restore the database from: $BackupFile"
Write-Host ""

# Check if running from backend directory
if (-not (Test-Path "docker-compose.yml")) {
    Write-Host "Error: Please run this script from the backend directory" -ForegroundColor Red
    exit 1
}

# Check if backup file exists
if (-not (Test-Path $BackupFile)) {
    Write-Host "Error: Backup file not found: $BackupFile" -ForegroundColor Red
    exit 1
}

Write-Host "WARNING: This will drop and recreate the database!" -ForegroundColor Yellow
$confirm = Read-Host "Continue? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Aborted."
    exit 0
}

Write-Host ""
Write-Host "1. Stopping Directus..." -ForegroundColor Green
docker compose stop directus

Write-Host ""
Write-Host "2. Dropping and recreating database..." -ForegroundColor Green
docker compose exec -T database psql -U directus -d postgres -c "DROP DATABASE IF EXISTS directus;"
docker compose exec -T database psql -U directus -d postgres -c "CREATE DATABASE directus;"

Write-Host ""
Write-Host "3. Restoring from backup..." -ForegroundColor Green
Get-Content $BackupFile | docker compose exec -T database psql -U directus -d directus

Write-Host ""
Write-Host "4. Starting Directus..." -ForegroundColor Green
docker compose start directus

Write-Host ""
Write-Host "5. Waiting for Directus to start..." -ForegroundColor Green
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "=== Restore Complete ===" -ForegroundColor Cyan
Write-Host "You can now access Directus at http://localhost:8055"
Write-Host "Login: admin@example.com / d1r3ctu5"
