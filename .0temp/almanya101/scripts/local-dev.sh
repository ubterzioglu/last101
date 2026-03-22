#!/bin/bash

# =====================================================
# LOCAL DEVELOPMENT HELPER
# Start local development server
# =====================================================

echo "🚀 Starting local development server..."
echo ""

# Check if Python is available
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Python not found!"
    echo "Install Python: https://python.org"
    exit 1
fi

# Check current directory
if [ ! -f "index.html" ]; then
    echo "⚠️  Warning: index.html not found"
    echo "Are you in the almanya101 root directory?"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Start server
echo "📂 Serving files from: $(pwd)"
echo "🌐 Server running at:"
echo ""
echo "   http://localhost:8000"
echo "   http://127.0.0.1:8000"
echo ""
echo "📄 Pages:"
echo "   http://localhost:8000/index.html"
echo "   http://localhost:8000/rehber/providers.html"
echo "   http://localhost:8000/admin/providers.html"
echo ""
echo "⚠️  Note: API routes (/api/*) won't work locally"
echo "   Use Vercel CLI for API testing: vercel dev"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start Python HTTP server
$PYTHON_CMD -m http.server 8000
