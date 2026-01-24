function _ { & "$PWD\note.bat" $args}

if (-not (Test-Path "notes.txt")){
    "# Лог разработки" | Out-File "notes.txt"
    Write-Host "Создан notes.txt" -ForegroundColor Yellow
}

Write-Host "`n ✓ Настройка завершена!" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
