@echo off
chcp 65001 >nul
title Vice City de noche - servidor local
cd /d "%~dp0"

set "PORT=%~1"
if "%PORT%"=="" set "PORT=8000"

set "PY="
where python >nul 2>nul && set "PY=python"
if not defined PY where py >nul 2>nul && set "PY=py"
if not defined PY (
  echo.
  echo  No se encontro Python. Instalalo desde https://www.python.org/downloads/
  echo  y marca "Add python.exe to PATH" durante la instalacion.
  echo.
  pause
  exit /b 1
)

set "LANIP="
for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "(Get-NetIPConfiguration ^| Where-Object { $_.IPv4DefaultGateway -ne $null -and $_.NetAdapter.Status -eq 'Up' } ^| Select-Object -First 1).IPv4Address.IPAddress"`) do set "LANIP=%%i"
if "%LANIP%"=="" set "LANIP=localhost"

echo.
echo  ==============================================
echo    VICE CITY DE NOCHE - servidor encendido
echo  ==============================================
echo.
echo    En esta PC:      http://localhost:%PORT%/
echo    En tu celular:   http://%LANIP%:%PORT%/
echo.
echo    El celular debe estar en el mismo Wi-Fi.
echo    Si Windows pregunta por el firewall, permite
echo    el acceso en redes privadas.
echo.
echo    Cierra esta ventana o pulsa Ctrl+C para apagarlo.
echo.

start "" /b powershell -NoProfile -Command "Start-Sleep -Milliseconds 900; Start-Process 'http://%LANIP%:%PORT%/'"
%PY% servidor.py %PORT%
pause
