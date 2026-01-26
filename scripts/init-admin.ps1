# PowerShell Script to initialize the first admin user

Write-Host "==========================================" -ForegroundColor Green
Write-Host "Efficience - Admin Initialization Script" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Configuration
$API_URL = "http://localhost:3000/api/admin/init"
$INIT_KEY = $env:INIT_SECRET_KEY -or "your-init-secret-key-change-this"

# Prompt for admin details
Write-Host ""
Write-Host "Veuillez entrer les détails de l'administrateur:" -ForegroundColor Yellow

$adminEmail = Read-Host "Email (admin@efficience-dentaire.fr)"
if ([string]::IsNullOrEmpty($adminEmail)) {
    $adminEmail = "admin@efficience-dentaire.fr"
}

$adminName = Read-Host "Nom (Admin Efficience)"
if ([string]::IsNullOrEmpty($adminName)) {
    $adminName = "Admin Efficience"
}

$adminPassword = Read-Host "Mot de passe (min 8 caractères)" -AsSecureString
$adminPasswordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($adminPassword))

# Validate password
if ($adminPasswordPlain.Length -lt 8) {
    Write-Host "[ERROR] Le mot de passe doit contenir au moins 8 caracteres" -ForegroundColor Red
    exit 1
}

# Create admin user
Write-Host ""
Write-Host "Création du compte administrateur..." -ForegroundColor Yellow

$body = @{
    email = $adminEmail
    name = $adminName
    password = $adminPasswordPlain
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "x-init-key" = $INIT_KEY
}

try {
    $response = Invoke-WebRequest -Uri $API_URL -Method POST -Body $body -Headers $headers
    $responseData = $response.Content | ConvertFrom-Json
    
    if ($responseData.success) {
        Write-Host ""
        Write-Host "[SUCCESS] Administrateur cree avec succes!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Informations de connexion:" -ForegroundColor Yellow
        Write-Host "URL: http://localhost:3000/admin/login"
        Write-Host "Email: $adminEmail"
        Write-Host "Mot de passe: (celui que vous avez entre)"
        Write-Host ""
        Write-Host "Vous pouvez maintenant vous connecter!" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Erreur lors de la creation:" -ForegroundColor Red
        Write-Host $responseData
        exit 1
    }
} catch {
    Write-Host "[ERROR] Erreur lors de la creation:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}
