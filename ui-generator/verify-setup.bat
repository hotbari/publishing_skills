@echo off
REM UI Generator Setup Verification Script (Windows)
REM Run this to check if all required files are in place

echo.
echo UI Generator Setup Verification
echo ==================================
echo.

set ERRORS=0

echo Backend Files
echo ----------------
call :CheckFile "backend\requirements.txt"
call :CheckFile "backend\Dockerfile"
call :CheckFile "backend\.env.example"
call :CheckFile "backend\app\main.py"
call :CheckFile "backend\app\config.py"
call :CheckFile "backend\app\api\generate.py"
call :CheckFile "backend\app\services\claude_client.py"
call :CheckFile "backend\app\services\skill_loader.py"
call :CheckFile "backend\app\models\schemas.py"
call :CheckFile "backend\skill-data\design-system.md"
call :CheckFile "backend\skill-data\consistency-rules.md"
call :CheckFile "backend\skill-data\page-templates.md"
call :CheckFile "backend\skill-data\component-library.md"
echo.

echo Frontend Files
echo -----------------
call :CheckFile "frontend\package.json"
call :CheckFile "frontend\Dockerfile"
call :CheckFile "frontend\.env.example"
call :CheckFile "frontend\nginx.conf"
call :CheckFile "frontend\vite.config.ts"
call :CheckFile "frontend\tsconfig.json"
call :CheckFile "frontend\tailwind.config.js"
call :CheckFile "frontend\index.html"
call :CheckFile "frontend\src\App.tsx"
call :CheckFile "frontend\src\main.tsx"
call :CheckFile "frontend\src\types\index.ts"
call :CheckFile "frontend\src\services\api.ts"
call :CheckFile "frontend\src\components\PromptInput.tsx"
call :CheckFile "frontend\src\components\GenerateButton.tsx"
call :CheckFile "frontend\src\components\CodePreview.tsx"
call :CheckFile "frontend\src\components\DownloadButton.tsx"
call :CheckFile "frontend\src\styles\globals.css"
echo.

echo Infrastructure
echo -----------------
call :CheckFile "docker-compose.yml"
call :CheckFile ".env.example"
call :CheckFile ".gitignore"
call :CheckFile "README.md"
call :CheckFile "QUICKSTART.md"
echo.

echo Environment Configuration
echo -----------------------------
if exist ".env" (
    echo [32mOK[0m .env file exists
    findstr /C:"ANTHROPIC_API_KEY=sk-ant-" .env >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [32mOK[0m API key appears to be set
    ) else (
        echo [33mWARNING[0m API key may not be set correctly
        echo    Please check that ANTHROPIC_API_KEY is configured in .env
    )
) else (
    echo [33mWARNING[0m .env file not found
    echo    Run: copy .env.example .env
    echo    Then add your ANTHROPIC_API_KEY
)
echo.

echo Summary
echo ----------
if %ERRORS% EQU 0 (
    echo [32mAll files present! Setup looks good.[0m
    echo.
    echo Next steps:
    echo 1. Make sure .env has your ANTHROPIC_API_KEY
    echo 2. Run: docker-compose up --build
    echo 3. Open: http://localhost:3000
) else (
    echo [31mFound %ERRORS% missing file^(s^)[0m
    echo Please check the output above and ensure all files are created.
)

echo.
echo ==================================
pause
exit /b

:CheckFile
if exist %~1 (
    echo [32mOK[0m %~1
) else (
    echo [31mMISSING[0m %~1
    set /a ERRORS+=1
)
exit /b
