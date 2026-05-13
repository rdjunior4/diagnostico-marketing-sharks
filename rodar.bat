@echo off
chcp 65001 >nul
title Diagnóstico Sharks - Quiz
cd /d "%~dp0"

echo ========================================
echo  DIAGNÓSTICO ESTRATÉGICO DE MARKETING
echo  Sharks Company
echo ========================================
echo.

echo [1/3] Encerrando processos antigos...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 /nobreak >nul

echo [2/3] Limpando cache...
if exist ".next" rmdir /s /q .next >nul 2>&1

echo [3/3] Iniciando servidor...
echo.
echo ========================================
echo  Acesse: http://localhost:3000
echo  Pressione Ctrl+C para parar
echo ========================================
echo.
npx next dev -p 3000
pause
