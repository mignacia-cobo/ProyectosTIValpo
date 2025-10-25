# Script para generar valores de secrets para GitHub Actions
# Ejecutar: .\generate-secrets-simple.ps1

$ErrorActionPreference = "Stop"

Write-Host "`n================================================" -ForegroundColor Green
Write-Host "  GENERADOR DE SECRETS PARA GITHUB ACTIONS" -ForegroundColor Green
Write-Host "================================================`n" -ForegroundColor Green

# Generar contraseñas seguras
Write-Host "[1/3] Generando contraseñas seguras...`n" -ForegroundColor Yellow

function New-RandomPassword {
    param([int]$Length = 32)
    $rng = New-Object System.Security.Cryptography.RNGCryptoServiceProvider
    $bytes = New-Object byte[] $Length
    $rng.GetBytes($bytes)
    return [Convert]::ToBase64String($bytes)
}

$dbPassword = New-RandomPassword -Length 32
$jwtSecret = New-RandomPassword -Length 64

# Recopilar información
Write-Host "[2/3] Recopilando informacion...`n" -ForegroundColor Yellow

Write-Host "=== DOCKER HUB ===" -ForegroundColor Cyan
Write-Host "Primero, crea una cuenta en: https://hub.docker.com/signup" -ForegroundColor Gray
Write-Host "Luego, crea un Access Token en: https://hub.docker.com/settings/security`n" -ForegroundColor Gray

$dockerUsername = Read-Host "Usuario de Docker Hub (ej: mignaciacobo)"
$dockerPassword = Read-Host "Docker Hub Access Token" -AsSecureString
$dockerPasswordText = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($dockerPassword))

Write-Host "`n=== SERVIDOR ===" -ForegroundColor Cyan
$serverHost = "64.176.16.195"
$serverUser = "root"
$serverPassword = Read-Host "Contrasena del servidor" -AsSecureString
$serverPasswordText = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($serverPassword))

Write-Host "`n=== EMAIL SMTP ===" -ForegroundColor Cyan
Write-Host "Para Gmail, crea una contrasena de aplicacion en:" -ForegroundColor Gray
Write-Host "https://myaccount.google.com/apppasswords`n" -ForegroundColor Gray

$smtpUser = Read-Host "Email para SMTP (Enter = ma.cobo@profesor.duoc.cl)"
if ([string]::IsNullOrWhiteSpace($smtpUser)) { $smtpUser = "ma.cobo@profesor.duoc.cl" }

$smtpPass = Read-Host "Contrasena de aplicacion Gmail (16 caracteres)" -AsSecureString
$smtpPassText = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($smtpPass))

$adminEmail = $smtpUser

Write-Host "`n=== BASE DE DATOS ===" -ForegroundColor Cyan
$dbUser = "postgres"
$dbName = "proyectosti"

# Generar archivo de secrets
Write-Host "`n[3/3] Generando archivo de secrets...`n" -ForegroundColor Yellow

$secretsContent = @"
================================================
GITHUB SECRETS - COPIAR A GITHUB
================================================
Ve a: Settings > Secrets and variables > Actions
Crea un "New repository secret" para cada uno
================================================

DOCKER_USERNAME
$dockerUsername

DOCKER_PASSWORD
$dockerPasswordText

SERVER_HOST
$serverHost

SERVER_USER
$serverUser

SERVER_PASSWORD
$serverPasswordText

DB_USER
$dbUser

DB_PASSWORD
$dbPassword

DB_NAME
$dbName

JWT_SECRET
$jwtSecret

SMTP_HOST
smtp.gmail.com

SMTP_PORT
587

SMTP_USER
$smtpUser

SMTP_PASS
$smtpPassText

ADMIN_EMAIL
$adminEmail

================================================
INSTRUCCIONES
================================================
1. Copia cada par Nombre/Valor a GitHub Secrets
2. NO compartas este archivo
3. NO lo subas a GitHub
4. Guardalo en un lugar seguro
================================================
"@

$secretsFile = "github-secrets.txt"
$secretsContent | Out-File -FilePath $secretsFile -Encoding UTF8

Write-Host "================================================" -ForegroundColor Green
Write-Host "  ARCHIVO GENERADO EXITOSAMENTE" -ForegroundColor Green
Write-Host "================================================`n" -ForegroundColor Green

Write-Host "Archivo creado: $secretsFile`n" -ForegroundColor Cyan

Write-Host "PROXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "1. Abre: $secretsFile" -ForegroundColor White
Write-Host "2. Ve a GitHub: Settings > Secrets and variables > Actions" -ForegroundColor White
Write-Host "3. Copia cada secret al repositorio" -ForegroundColor White
Write-Host "4. Haz push: git push origin main`n" -ForegroundColor White

Write-Host "Presiona Enter para abrir el archivo" -ForegroundColor Cyan
Read-Host | Out-Null
notepad $secretsFile
