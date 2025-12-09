# Stop all containers
Write-Host "Stopping all containers..." -ForegroundColor Yellow
docker compose down

# Remove database files
Write-Host "`nRemoving database files..." -ForegroundColor Yellow
Remove-Item -Path ".\data\database" -Recurse -Force -ErrorAction SilentlyContinue

# Remove schema-sync data (personal information)
Write-Host "`nRemoving schema-sync data (personal information)..." -ForegroundColor Yellow
Remove-Item -Path ".\schema-sync\data" -Recurse -Force -ErrorAction SilentlyContinue

# Remove all related Docker images
Write-Host "`nRemoving all related Docker images..." -ForegroundColor Yellow
docker compose down --rmi all

# Prune Docker volumes
Write-Host "`nPruning Docker volumes..." -ForegroundColor Yellow
docker volume prune -f

Write-Host "`nAll clean! Run 'docker compose up --build' to start fresh." -ForegroundColor Green