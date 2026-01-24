@echo off
chcp 65001 > nul
set "time=%time:~0,5%"
set "date=%date:~-10%"

for /f "tokens=2 delims==" %%i in ('wmic path win32_localtime get dayofweek /value 2^>nul') do set "dow_num=%%i"
if "%dow_num%"=="1" set "dow=Mon"
if "%dow_num%"=="2" set "dow=Tue"
if "%dow_num%"=="3" set "dow=Wed"
if "%dow_num%"=="4" set "dow=Thu"
if "%dow_num%"=="5" set "dow=Fri"
if "%dow_num%"=="6" set "dow=Sat"
if "%dow_num%"=="0" set "dow=Sun"

for /f %%i in ('date /t') do set "today=%%i"

findstr /c:"=== %dow%, %date% ===" notes.txt >nul 2>&1
if errorlevel 1 (
    echo. >> notes.txt
    echo === %dow%, %date% === >> notes.txt
)

echo [%time%] %* >> notes.txt
echo [%time%] ✓ %today%