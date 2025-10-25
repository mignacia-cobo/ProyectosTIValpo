# Script para generar valores de secrets para GitHub Actions
# Ejecutar: .\generate-secrets.ps1

Write-Host "`n================================================" -ForegroundColor Green
Write-Host "  GENERADOR DE SECRETS PARA GITHUB ACTIONS" -ForegroundColor Green
Write-Host "================================================`n" -ForegroundColor Green

Write-Host "Este script te ayudará a generar los valores para los GitHub Secrets.`n" -ForegroundColor Cyan

# Función para generar password seguro
function Generate-SecurePassword {
    param([int]$Length = 32)
    $bytes = New-Object byte[] $Length
    [System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
    return [Convert]::ToBase64String($bytes)
}

# Generar valores
Write-Host "[1/3] Generando contraseñas seguras..." -ForegroundColor Yellow
$dbPassword = Generate-SecurePassword -Length 32
$jwtSecret = Generate-SecurePassword -Length 64

Write-Host "[2/3] Recopilando información..." -ForegroundColor Yellow
Write-Host ""

# Docker Hub
Write-Host "=== DOCKER HUB ===" -ForegroundColor Cyan
Write-Host "Primero, crea una cuenta en https://hub.docker.com/signup" -ForegroundColor Gray
Write-Host "Luego, crea un Access Token en: https://hub.docker.com/settings/security`n" -ForegroundColor Gray

$dockerUsername = Read-Host "Ingresa tu usuario de Docker Hub (ej: mignaciacobo)"
$dockerPassword = Read-Host "Ingresa tu Docker Hub Access Token" -MaskInput

Write-Host ""

# Servidor
Write-Host "=== SERVIDOR ===" -ForegroundColor Cyan
$serverHost = Read-Host "IP del servidor (Enter para usar: 64.176.16.195)"
if ([string]::IsNullOrWhiteSpace($serverHost)) { $serverHost = "64.176.16.195" }

$serverUser = Read-Host "Usuario del servidor (Enter para usar: root)"
if ([string]::IsNullOrWhiteSpace($serverUser)) { $serverUser = "root" }

$serverPassword = Read-Host "Contraseña del servidor" -MaskInput

Write-Host ""

# Email
Write-Host "=== EMAIL (SMTP) ===" -ForegroundColor Cyan
Write-Host "Para Gmail, crea una contraseña de aplicación en:" -ForegroundColor Gray
Write-Host "https://myaccount.google.com/apppasswords`n" -ForegroundColor Gray

$smtpUser = Read-Host "Email para SMTP (Enter para usar: ma.cobo@profesor.duoc.cl)"
if ([string]::IsNullOrWhiteSpace($smtpUser)) { $smtpUser = "ma.cobo@profesor.duoc.cl" }

$smtpPass = Read-Host "Contraseña de aplicación de Gmail (16 caracteres)" -MaskInput

$adminEmail = Read-Host "Email del administrador (Enter para usar: $smtpUser)"
if ([string]::IsNullOrWhiteSpace($adminEmail)) { $adminEmail = $smtpUser }

Write-Host ""

# Base de datos
Write-Host "=== BASE DE DATOS ===" -ForegroundColor Cyan
$dbUser = Read-Host "Usuario de PostgreSQL (Enter para usar: postgres)"
if ([string]::IsNullOrWhiteSpace($dbUser)) { $dbUser = "postgres" }

$dbName = Read-Host "Nombre de la base de datos (Enter para usar: proyectosti)"
if ([string]::IsNullOrWhiteSpace($dbName)) { $dbName = "proyectosti" }

# Generar resumen
Write-Host "`n[3/3] Generando archivo de secrets..." -ForegroundColor Yellow

$secretsContent = @"
# ================================================
# GITHUB SECRETS - COPIAR A GITHUB
# ================================================
# Ve a: Settings > Secrets and variables > Actions
# Crea un "New repository secret" para cada uno
# ================================================

DOCKER_USERNAME
$dockerUsername

DOCKER_PASSWORD
$dockerPassword

SERVER_HOST
$serverHost

SERVER_USER
$serverUser

SERVER_PASSWORD
$serverPassword

DB_USER
$dbUser

DB_PASSWORD (GENERADA AUTOMÁTICAMENTE - MUY SEGURA)
$dbPassword

DB_NAME
$dbName

JWT_SECRET (GENERADO AUTOMÁTICAMENTE - MUY SEGURO)
$jwtSecret

SMTP_HOST
smtp.gmail.com

SMTP_PORT
587

SMTP_USER
$smtpUser

SMTP_PASS
$smtpPass

ADMIN_EMAIL
$adminEmail

# ================================================
# INSTRUCCIONES
# ================================================
# 1. Copia cada par Nombre/Valor a GitHub Secrets
# 2. NO compartas este archivo
# 3. NO lo subas a GitHub
# 4. Guárdalo en un lugar seguro
# ================================================
"@

# Guardar en archivo
$secretsFile = "github-secrets.txt"
$secretsContent | Out-File -FilePath $secretsFile -Encoding UTF8

Write-Host "`n✅ Archivo generado: $secretsFile" -ForegroundColor Green
Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  PRÓXIMOS PASOS" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "1. Abre el archivo: $secretsFile" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Ve a tu repositorio en GitHub:" -ForegroundColor Yellow
Write-Host "   Settings - Secrets and variables - Actions" -ForegroundColor White
Write-Host ""
Write-Host "3. Por cada secret en el archivo:" -ForegroundColor Yellow
Write-Host "   - Click 'New repository secret'" -ForegroundColor White
Write-Host "   - Name: el nombre del secret" -ForegroundColor White
Write-Host "   - Value: el valor correspondiente" -ForegroundColor White
Write-Host "   - Click 'Add secret'" -ForegroundColor White
Write-Host ""
Write-Host "4. Después de configurar todos los secrets:" -ForegroundColor Yellow
Write-Host "   git add ." -ForegroundColor White
Write-Host "   git commit -m 'feat: CI/CD con GitHub Actions'" -ForegroundColor White
Write-Host "   git push origin main" -ForegroundColor White
Write-Host ""
Write-Host "5. El deployment automatico comenzara!" -ForegroundColor Yellow
Write-Host "   Monitorea en: Repositorio - Actions" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANTE:" -ForegroundColor Red
Write-Host "   - NO subas el archivo $secretsFile a GitHub" -ForegroundColor Yellow
Write-Host "   - Guárdalo en un lugar seguro" -ForegroundColor Yellow
Write-Host "   - Ya está en .gitignore" -ForegroundColor Yellow
Write-Host ""

# Añadir al .gitignore si no existe
$gitignoreFile = ".gitignore"
if (Test-Path $gitignoreFile) {
    $gitignoreContent = Get-Content $gitignoreFile -Raw
    if ($gitignoreContent -notmatch "github-secrets.txt") {
        Add-Content -Path $gitignoreFile -Value "`n# Secrets generados`ngithub-secrets.txt"
        Write-Host "✅ Añadido $secretsFile a .gitignore" -ForegroundColor Green
    }
} else {
    "github-secrets.txt" | Out-File -FilePath $gitignoreFile -Encoding UTF8
    Write-Host "✅ Creado .gitignore con $secretsFile" -ForegroundColor Green
}

Write-Host ""
Write-Host "Presiona Enter para abrir el archivo" -ForegroundColor Cyan
Read-Host
notepad $secretsFile
