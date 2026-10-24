@echo off
chcp 65001 >nul
title Leonida Tpk - publicar en GitHub Pages
cd /d "%~dp0"

where git >nul 2>nul || (
  echo  No se encontro Git. Instalalo desde https://git-scm.com/download/win
  pause
  exit /b 1
)

echo.
echo  1. Crea un repositorio VACIO en GitHub (sin README).
echo     Se abrira https://github.com/new en tu navegador.
echo.
start "" "https://github.com/new"

set "GHUSER="
set /p "GHUSER=  Tu usuario de GitHub: "
if "%GHUSER%"=="" (
  echo  Necesito tu usuario para continuar.
  pause
  exit /b 1
)
set "REPO="
set /p "REPO=  Nombre del repositorio [gta6-leonida]: "
if "%REPO%"=="" set "REPO=gta6-leonida"

set "PAGES=https://%GHUSER%.github.io/%REPO%/"

rem El QR apunta a la direccion publica aunque abras la pagina en localhost.
powershell -NoProfile -Command "$f='script.js'; $t=[IO.File]::ReadAllText($f); $t=[regex]::Replace($t,'const PUBLIC_URL = \"[^\"]*\";','const PUBLIC_URL = \"%PAGES%\";'); [IO.File]::WriteAllText($f,$t,(New-Object Text.UTF8Encoding $false))"

if not exist ".git" git init -b main >nul

git config user.name >nul 2>nul || git config user.name "%GHUSER%"
git config user.email >nul 2>nul || git config user.email "%GHUSER%@users.noreply.github.com"

git add -A
git commit -m "Publicar Leonida Tpk en GitHub Pages" >nul 2>nul
git branch -M main
git remote remove origin >nul 2>nul
git remote add origin "https://github.com/%GHUSER%/%REPO%.git"

echo.
echo  Subiendo archivos. Si es la primera vez, GitHub te pedira
echo  iniciar sesion en una ventana del navegador.
echo.
git push -u origin main
if errorlevel 1 (
  echo.
  echo  El push fallo. Revisa que el repositorio exista y este vacio.
  pause
  exit /b 1
)

echo.
echo  2. Activa GitHub Pages: Settings ^> Pages ^> Deploy from a branch
echo     Rama: main   Carpeta: / (root)   y pulsa Save.
echo.
start "" "https://github.com/%GHUSER%/%REPO%/settings/pages"
echo  En uno o dos minutos tu pagina estara en:
echo     %PAGES%
echo.
pause
