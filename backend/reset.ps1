# ============================================
#  RESET - Reset to Default State
# ============================================
#  Resets database and reloads sample data.
#  Use this to start fresh or fix issues.
# ============================================

# Stop all containers
Write-Host "Stopping all containers..." -ForegroundColor Yellow
docker compose down

# Remove database files
Write-Host "`nRemoving database files..." -ForegroundColor Yellow
Remove-Item -Path ".\data\database" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "`nDone! Run 'docker compose up' to restart." -ForegroundColor Green
Write-Host "Sample data from schema-sync\data will be imported on startup." -ForegroundColor Cyan
