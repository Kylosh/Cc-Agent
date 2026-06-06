@echo off
REM Frontend startup script for Windows
REM Installs dependencies and starts the development server

echo.
echo 🚀 Starting Frontend Development Server...
echo.

echo 📦 Installing dependencies...
call npm install

echo.
echo 🔧 Starting development server...
npm start

pause
