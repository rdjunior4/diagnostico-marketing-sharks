@echo off
chcp 65001 >nul
title Diagnostico Sharks - Dev Server
echo ========================================
echo  SHARKS COMPANY - Diagnostico Marketing
echo ========================================
echo.

:: Copia projeto para caminho curto (evita limite de 260 chars do Windows)
if not exist "C:\sharks\package.json" (
    echo [1/3] Copiando projeto para C:\sharks...
    robocopy "%~dp0" "C:\sharks" /E /XD node_modules .next .git /NFL /NDL /NJH /NJS /nc /ns /np
    if errorlevel 8 goto :error
) else (
    echo [1/3] Sincronizando arquivos atualizados...
    robocopy "%~dp0src" "C:\sharks\src" /E /IS /IT /NFL /NDL /NJH /NJS /nc /ns /np
    robocopy "%~dp0public" "C:\sharks\public" /E /IS /IT /NFL /NDL /NJH /NJS /nc /ns /np
    copy /Y "%~dp0next.config.ts" "C:\sharks\next.config.ts" >nul 2>&1
    copy /Y "%~dp0package.json" "C:\sharks\package.json" >nul 2>&1
    copy /Y "%~dp0tsconfig.json" "C:\sharks\tsconfig.json" >nul 2>&1
    copy /Y "%~dp0postcss.config.mjs" "C:\sharks\postcss.config.mjs" >nul 2>&1
)

:: Instala dependencias se necessario
cd /d C:\sharks
if not exist "node_modules\next" (
    echo [2/3] Instalando dependencias...
    call npm install
    if errorlevel 1 goto :error
) else (
    echo [2/3] Dependencias OK.
)

:: Limpa cache antigo se existir
if exist ".next" (
    echo Limpando cache...
    rmdir /s /q .next 2>nul
)

:: Inicia servidor
echo.
echo [3/3] Iniciando servidor...
echo.
echo ========================================
echo  Acesse: http://localhost:3002
echo  Pressione Ctrl+C para parar
echo ========================================
echo.
call npx next dev -p 3002
goto :end

:error
echo.
echo ERRO: Algo deu errado. Verifique as mensagens acima.
echo.

:end
pause
