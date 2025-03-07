@echo off
echo ===================================================
echo Product Review App Launcher
echo ===================================================
echo.

echo Opening frontend in your default browser...
start "" "frontend\index.html"
echo.

echo Frontend is now open in your browser.
echo.

echo If you want to run the backend server (optional):
echo 1. Make sure you have Node.js installed
echo 2. Open a command prompt in this directory
echo 3. Run the following commands:
echo    cd backend
echo    npm install
echo    npm start
echo.

echo Note: The backend server requires MongoDB and proper configuration
echo in the .env file. For demonstration purposes, you can use the
echo frontend without the backend server.
echo.

echo ===================================================
echo HOW TO RUN THIS BATCH FILE:
echo.
echo In PowerShell: Type .\run-app.bat
echo In Command Prompt: Type run-app.bat
echo Or simply double-click this file in Windows Explorer
echo ===================================================
echo.
echo Press any key to exit...
pause > nul
