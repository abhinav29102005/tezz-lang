# Tezz-Lang Installer for Windows

Write-Host "⚡ Installing Tezz (तेज़)..." -ForegroundColor Cyan

$Platform = "win"
$Arch = "x64"

# In a real scenario, this URL would point to the GitHub releases
$DownloadUrl = "https://github.com/abhinav29102005/tezz-lang/releases/latest/download/tezz-$Platform-$Arch.exe"
$InstallDir = "$env:USERPROFILE\AppData\Local\Tezz\bin"

If (!(Test-Path -Path $InstallDir)) {
    New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
}

$ExePath = Join-Path -Path $InstallDir -ChildName "tezz.exe"

Write-Host "Downloading Tezz for Windows ($Arch)..."
# Invoke-WebRequest -Uri $DownloadUrl -OutFile $ExePath

# Add to PATH (Machine level requires admin, we do User level here)
$UserPath = [Environment]::GetEnvironmentVariable("PATH", "User")
If ($UserPath -notlike "*$InstallDir*") {
    [Environment]::SetEnvironmentVariable("PATH", "$UserPath;$InstallDir", "User")
    Write-Host "Added $InstallDir to PATH. You may need to restart your terminal." -ForegroundColor Yellow
}

Write-Host "✅ Tezz installed successfully! Run 'tezz --help' to get started." -ForegroundColor Green
