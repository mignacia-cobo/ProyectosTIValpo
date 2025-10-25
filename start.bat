@echo off
REM Script de inicio rápido para desarrollo local en Windows

echo Iniciando Proyectos TI Valpo...

REM Verificar si Docker está instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker no esta instalado. Por favor, instala Docker primero.
    pause
    exit /b 1
)

REM Verificar si Docker Compose está instalado
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker Compose no esta instalado. Por favor, instala Docker Compose primero.
    pause
    exit /b 1
)

REM Crear archivo .env si no existe
if not exist .env (
    echo Creando archivo .env...
    copy .env.example .env
    echo IMPORTANTE: Por favor, edita el archivo .env con tus credenciales antes de continuar.
    echo Presiona cualquier tecla cuando hayas terminado...
    pause
)

REM Crear archivo .env del frontend si no existe
if not exist frontend\.env (
    echo Creando archivo .env del frontend...
    copy frontend\.env.example frontend\.env
)

REM Construir y levantar contenedores
echo Construyendo y levantando contenedores...
docker-compose up -d --build

REM Esperar a que los servicios estén listos
echo Esperando a que los servicios esten listos...
timeout /t 10 /nobreak >nul

REM Verificar estado de los contenedores
echo Estado de los contenedores:
docker-compose ps

echo.
echo Aplicacion iniciada correctamente!
echo.
echo Acceder a:
echo   - Frontend: http://localhost:3000
echo   - Backend API: http://localhost:5000/api
echo   - Panel Admin: http://localhost:3000/admin
echo.
echo Siguiente paso:
echo   Crear usuario administrador ejecutando:
echo   docker exec -it proyectosti_backend node src/scripts/createAdmin.js
echo.
echo Ver logs:
echo   docker-compose logs -f
echo.
echo Detener aplicacion:
echo   docker-compose down
echo.
pause
