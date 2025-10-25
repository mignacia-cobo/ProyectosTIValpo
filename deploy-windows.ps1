# Script de despliegue desde Windows al servidor
# Ejecutar en PowerShell: .\deploy-windows.ps1

$ErrorActionPreference = "Stop"

Write-Host "`n=====================================" -ForegroundColor Green
Write-Host "  DESPLIEGUE A SERVIDOR REMOTO" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Variables del servidor
$SERVER_IP = "64.176.16.195"
$SERVER_USER = "linuxuser"
$SERVER_PATH = "/var/www/proyectostivalpo"
$LOCAL_PATH = $PSScriptRoot

Write-Host "[INFO] IP del servidor: $SERVER_IP" -ForegroundColor Cyan
Write-Host "[INFO] Ruta local: $LOCAL_PATH" -ForegroundColor Cyan
Write-Host "[INFO] Ruta remota: $SERVER_PATH" -ForegroundColor Cyan
Write-Host ""

# Verificar si SCP está disponible
Write-Host "[1/5] Verificando herramientas..." -ForegroundColor Yellow
if (-not (Get-Command ssh -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] SSH no está instalado." -ForegroundColor Red
    Write-Host "Por favor, instala OpenSSH desde:" -ForegroundColor Yellow
    Write-Host "Settings > Apps > Optional Features > OpenSSH Client" -ForegroundColor White
    Write-Host ""
    Write-Host "O descarga WinSCP: https://winscp.net/" -ForegroundColor White
    exit 1
}
Write-Host "[OK] SSH disponible" -ForegroundColor Green

# Crear archivo temporal con archivos a excluir
Write-Host "`n[2/5] Preparando archivos..." -ForegroundColor Yellow
$excludeFile = "$env:TEMP\rsync-exclude.txt"
@"
node_modules/
.git/
dist/
uploads/
postgres_data/
*.log
.env.local
"@ | Out-File -FilePath $excludeFile -Encoding UTF8

Write-Host "[OK] Archivos preparados" -ForegroundColor Green

# Mostrar advertencia
Write-Host "`n[3/5] IMPORTANTE:" -ForegroundColor Red
Write-Host "Se va a copiar el proyecto al servidor." -ForegroundColor White
Write-Host "Esto puede sobrescribir archivos existentes." -ForegroundColor Yellow
$confirm = Read-Host "`n¿Deseas continuar? (S/N)"
if ($confirm -ne "S" -and $confirm -ne "s") {
    Write-Host "`nOperación cancelada." -ForegroundColor Yellow
    exit 0
}

# Usar SCP para copiar archivos
Write-Host "`n[4/5] Copiando archivos al servidor..." -ForegroundColor Yellow
Write-Host "Esto puede tomar varios minutos..." -ForegroundColor Cyan
Write-Host ""

# Crear directorio en el servidor
Write-Host "Creando directorio remoto..." -ForegroundColor Cyan
ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p $SERVER_PATH"

# Copiar archivos importantes uno por uno
$filesToCopy = @(
    "docker-compose.yml",
    "deploy.sh",
    "DEPLOYMENT_SERVER.md",
    "README.md",
    ".gitignore"
)

foreach ($file in $filesToCopy) {
    if (Test-Path $file) {
        Write-Host "Copiando $file..." -ForegroundColor Gray
        scp "$LOCAL_PATH\$file" "${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/"
    }
}

# Copiar directorios backend y frontend
Write-Host "Copiando backend..." -ForegroundColor Gray
scp -r "$LOCAL_PATH\backend" "${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/"

Write-Host "Copiando frontend..." -ForegroundColor Gray
scp -r "$LOCAL_PATH\frontend" "${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/"

Write-Host "`n[OK] Archivos copiados exitosamente" -ForegroundColor Green

# Ejecutar comandos en el servidor
Write-Host "`n[5/5] Configurando en el servidor..." -ForegroundColor Yellow

$remoteCommands = @"
cd $SERVER_PATH
chmod +x deploy.sh
echo 'Archivos subidos correctamente.'
echo ''
echo 'Para continuar con la instalación, ejecuta:'
echo 'bash deploy.sh'
ls -la
"@

ssh ${SERVER_USER}@${SERVER_IP} $remoteCommands

# Resumen final
Write-Host "`n=====================================" -ForegroundColor Green
Write-Host "  CARGA COMPLETADA" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Los archivos han sido subidos al servidor." -ForegroundColor White
Write-Host ""
Write-Host "PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Conectarse al servidor:" -ForegroundColor Yellow
Write-Host "   ssh ${SERVER_USER}@${SERVER_IP}" -ForegroundColor White
Write-Host ""
Write-Host "2. Ir al directorio del proyecto:" -ForegroundColor Yellow
Write-Host "   cd $SERVER_PATH" -ForegroundColor White
Write-Host ""
Write-Host "3. Ejecutar el script de instalación:" -ForegroundColor Yellow
Write-Host "   bash deploy.sh" -ForegroundColor White
Write-Host ""
Write-Host "4. Seguir los pasos en DEPLOYMENT_SERVER.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "¿Quieres conectarte al servidor ahora? (S/N): " -ForegroundColor Cyan -NoNewline
$connectNow = Read-Host
if ($connectNow -eq "S" -or $connectNow -eq "s") {
    Write-Host "`nConectando al servidor..." -ForegroundColor Green
    ssh ${SERVER_USER}@${SERVER_IP}
}
