@echo off
cd /d "%~dp0"
echo === Mini TP React Native : installation des dependances ===
call npm.cmd install
if errorlevel 1 (
  echo.
  echo L'installation a echoue. Verifiez Node.js et votre connexion Internet.
  pause
  exit /b 1
)
echo.
echo === Demarrage d'Expo ===
call npm.cmd start
pause
