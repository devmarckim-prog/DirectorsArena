$profilePath = $PROFILE
if (-not (Test-Path (Split-Path $profilePath))) {
    New-Item -ItemType Directory -Path (Split-Path $profilePath) -Force | Out-Null
}

$content = @"

function oma {
    & "C:\Users\happy\.oma\bin\oma.ps1" @args
}
"@

$content | Out-File -FilePath $profilePath -Append -Encoding UTF8
Write-Host "OMA alias added to $profilePath"
