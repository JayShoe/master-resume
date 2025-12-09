@echo off
echo ============================================
echo  RESET - Reset to Default State
echo ============================================
echo  Resets database and reloads sample data.
echo  Use this to start fresh or fix issues.
echo ============================================
echo.
echo Stopping all containers...
docker compose down

echo.
echo Removing database files...
rmdir /s /q data\database 2>nul

echo.
echo Done! Run 'docker compose up' to restart.
echo Sample data from schema-sync\data will be imported on startup.
