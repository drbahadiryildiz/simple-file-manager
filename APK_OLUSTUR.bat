@echo off
setlocal
cd /d "%~dp0"

echo [1/3] Paketler kuruluyor...
call npm install
if errorlevel 1 goto error

echo [2/3] Expo hesabina giris...
call npx eas-cli@latest login
if errorlevel 1 goto error

echo [3/3] APK bulutta derleniyor...
call npx eas-cli@latest build -p android --profile preview
if errorlevel 1 goto error

echo.
echo Tamamlandi. EAS ekrandaki APK indirme baglantisini verecek.
pause
exit /b 0

:error
echo.
echo Islem basarisiz oldu. Yukaridaki hata mesajini kontrol edin.
pause
exit /b 1
