#!/bin/bash

# =====================================================
# CONFIGURATION SETUP HELPER
# Interactive script to update frontend config
# =====================================================

echo "🔧 almanya101 Providers Configuration Setup"
echo "=========================================="
echo ""

# Check if files exist
if [ ! -f "rehber/providers.js" ] || [ ! -f "admin/providers.js" ]; then
    echo "❌ Error: providers.js files not found"
    echo "Run this script from almanya101 root directory"
    exit 1
fi

echo "This script will update Supabase configuration in:"
echo "  - rehber/providers.js"
echo "  - admin/providers.js"
echo ""

# Get Supabase URL
echo "📝 Enter your Supabase URL:"
echo "   (Example: https://abcdefgh.supabase.co)"
read -p "URL: " SUPABASE_URL

if [ -z "$SUPABASE_URL" ]; then
    echo "❌ URL cannot be empty"
    exit 1
fi

# Validate URL format
if [[ ! "$SUPABASE_URL" =~ ^https://.*\.supabase\.co$ ]]; then
    echo "⚠️  Warning: URL format doesn't match expected pattern"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Get Supabase Anon Key
echo ""
echo "📝 Enter your Supabase Anon Key:"
echo "   (Find it in: Supabase Dashboard → Settings → API → anon public)"
read -p "Anon Key: " SUPABASE_ANON_KEY

if [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Anon Key cannot be empty"
    exit 1
fi

# Backup originals
echo ""
echo "📦 Creating backups..."
cp rehber/providers.js rehber/providers.js.backup
cp admin/providers.js admin/providers.js.backup
echo "✅ Backups created: .backup files"

# Update rehber/providers.js
echo ""
echo "🔄 Updating rehber/providers.js..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|const SUPABASE_URL = '.*';|const SUPABASE_URL = '$SUPABASE_URL';|" rehber/providers.js
    sed -i '' "s|const SUPABASE_ANON_KEY = '.*';|const SUPABASE_ANON_KEY = '$SUPABASE_ANON_KEY';|" rehber/providers.js
else
    # Linux
    sed -i "s|const SUPABASE_URL = '.*';|const SUPABASE_URL = '$SUPABASE_URL';|" rehber/providers.js
    sed -i "s|const SUPABASE_ANON_KEY = '.*';|const SUPABASE_ANON_KEY = '$SUPABASE_ANON_KEY';|" rehber/providers.js
fi

# Update admin/providers.js
echo "🔄 Updating admin/providers.js..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|const SUPABASE_URL = '.*';|const SUPABASE_URL = '$SUPABASE_URL';|" admin/providers.js
    sed -i '' "s|const SUPABASE_ANON_KEY = '.*';|const SUPABASE_ANON_KEY = '$SUPABASE_ANON_KEY';|" admin/providers.js
else
    # Linux
    sed -i "s|const SUPABASE_URL = '.*';|const SUPABASE_URL = '$SUPABASE_URL';|" admin/providers.js
    sed -i "s|const SUPABASE_ANON_KEY = '.*';|const SUPABASE_ANON_KEY = '$SUPABASE_ANON_KEY';|" admin/providers.js
fi

# Verify
echo ""
echo "✅ Configuration updated!"
echo ""
echo "📋 Verification:"
echo "─────────────────────────────────────────"
echo "URL set to: $SUPABASE_URL"
echo "Key length: ${#SUPABASE_ANON_KEY} characters"
echo ""

# Test connection (optional)
echo "🔍 Would you like to test the connection?"
read -p "(Requires curl) (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Testing connection to Supabase..."
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$SUPABASE_URL/rest/v1/" -H "apikey: $SUPABASE_ANON_KEY")

    if [ "$RESPONSE" -eq 200 ] || [ "$RESPONSE" -eq 401 ]; then
        echo "✅ Connection successful! (HTTP $RESPONSE)"
    else
        echo "⚠️  Unexpected response: HTTP $RESPONSE"
        echo "   Check your URL and key"
    fi
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Test locally: npm run dev (or python -m http.server 8000)"
echo "  2. Visit: http://localhost:8000/rehber/providers.html"
echo "  3. If working, commit and deploy to Vercel"
echo ""
echo "Note: Backups saved as .backup files"
echo "      Restore with: mv rehber/providers.js.backup rehber/providers.js"
echo ""
