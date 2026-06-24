# PowerShell Execution Policy Fix Script
# Bu scriptni Administrator sifatida ishga tushiring

Write-Host "PowerShell Execution Policy'ni o'zgartirish..." -ForegroundColor Yellow

# CurrentUser scope uchun (admin huquqlari talab qilmaydi)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

Write-Host "`nExecution Policy muvaffaqiyatli o'zgartirildi!" -ForegroundColor Green
Write-Host "Hozirgi policy:" -ForegroundColor Cyan
Get-ExecutionPolicy -List

Write-Host "`nnpm buyruqlari endi ishlashi kerak!" -ForegroundColor Green
