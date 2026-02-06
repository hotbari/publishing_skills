#!/bin/bash

# UI Generator Setup Verification Script
# Run this to check if all required files are in place

echo "🔍 UI Generator Setup Verification"
echo "=================================="
echo ""

ERRORS=0

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1"
    else
        echo "❌ MISSING: $1"
        ((ERRORS++))
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo "✅ $1/"
    else
        echo "❌ MISSING: $1/"
        ((ERRORS++))
    fi
}

echo "📁 Backend Files"
echo "----------------"
check_file "backend/requirements.txt"
check_file "backend/Dockerfile"
check_file "backend/.env.example"
check_file "backend/app/main.py"
check_file "backend/app/config.py"
check_file "backend/app/api/generate.py"
check_file "backend/app/services/claude_client.py"
check_file "backend/app/services/skill_loader.py"
check_file "backend/app/models/schemas.py"
check_file "backend/skill-data/design-system.md"
check_file "backend/skill-data/consistency-rules.md"
check_file "backend/skill-data/page-templates.md"
check_file "backend/skill-data/component-library.md"
echo ""

echo "📁 Frontend Files"
echo "-----------------"
check_file "frontend/package.json"
check_file "frontend/Dockerfile"
check_file "frontend/.env.example"
check_file "frontend/nginx.conf"
check_file "frontend/vite.config.ts"
check_file "frontend/tsconfig.json"
check_file "frontend/tailwind.config.js"
check_file "frontend/index.html"
check_file "frontend/src/App.tsx"
check_file "frontend/src/main.tsx"
check_file "frontend/src/types/index.ts"
check_file "frontend/src/services/api.ts"
check_file "frontend/src/components/PromptInput.tsx"
check_file "frontend/src/components/GenerateButton.tsx"
check_file "frontend/src/components/CodePreview.tsx"
check_file "frontend/src/components/DownloadButton.tsx"
check_file "frontend/src/styles/globals.css"
echo ""

echo "📁 Infrastructure"
echo "-----------------"
check_file "docker-compose.yml"
check_file ".env.example"
check_file ".gitignore"
check_file "README.md"
check_file "QUICKSTART.md"
echo ""

# Check for .env file
echo "🔐 Environment Configuration"
echo "-----------------------------"
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    if grep -q "ANTHROPIC_API_KEY=sk-ant-" .env 2>/dev/null; then
        echo "✅ API key appears to be set"
    else
        echo "⚠️  WARNING: API key may not be set correctly"
        echo "   Please check that ANTHROPIC_API_KEY is configured in .env"
    fi
else
    echo "⚠️  WARNING: .env file not found"
    echo "   Run: cp .env.example .env"
    echo "   Then add your ANTHROPIC_API_KEY"
fi
echo ""

# Final summary
echo "📊 Summary"
echo "----------"
if [ $ERRORS -eq 0 ]; then
    echo "✅ All files present! Setup looks good."
    echo ""
    echo "Next steps:"
    echo "1. Make sure .env has your ANTHROPIC_API_KEY"
    echo "2. Run: docker-compose up --build"
    echo "3. Open: http://localhost:3000"
else
    echo "❌ Found $ERRORS missing file(s)"
    echo "Please check the output above and ensure all files are created."
fi

echo ""
echo "=================================="
