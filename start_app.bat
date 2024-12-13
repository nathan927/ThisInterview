@echo off
echo Starting ThisInterview application...
echo.

cd /d "%~dp0"
echo Installing dependencies...
call npm install

echo Starting backend server...
cd backend
start cmd /k "npm install && npm start"
cd ..

echo Starting frontend...
timeout /t 5 /nobreak
start "" http://localhost:3000
npm start

pause
