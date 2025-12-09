@echo off
echo Stopping all containers...
docker compose down

echo.
echo Removing database files...
rmdir /s /q data\database 2>nul

echo.
echo Removing schema-sync data (personal information)...
rmdir /s /q schema-sync\data 2>nul

echo.
echo Removing all related Docker images...
docker compose down --rmi all

echo.
echo Pruning Docker volumes...
docker volume prune -f

echo.
echo All clean! Run 'docker compose up --build' to start fresh.