# Vercel Environment Variables Setup Script
# Run: .\scripts\vercel-env-setup.ps1

$envVars = @(
    @{ Name = "NEXT_PUBLIC_SUPABASE_URL"; Value = "https://ldptefnpiudquipdsezr.supabase.co" },
    @{ Name = "NEXT_PUBLIC_SUPABASE_ANON_KEY"; Value = "sb_publishable_mqX5A9NdO66oM2GjvPJwNw_C7MhIDcI" },
    @{ Name = "NEXT_PUBLIC_SITE_URL"; Value = "https://almanya101.vercel.app" },
    @{ Name = "NEXT_PUBLIC_SITE_NAME"; Value = "Almanya101" }
)

Write-Host "Setting up Vercel environment variables..." -ForegroundColor Green

foreach ($var in $envVars) {
    Write-Host "Adding $($var.Name)..." -NoNewline
    
    # Add to production
    $var.Value | npx vercel env add $var.Name production --yes 2>$null
    
    # Add to preview
    $var.Value | npx vercel env add $var.Name preview --yes 2>$null
    
    Write-Host " OK" -ForegroundColor Green
}

Write-Host "`nAll environment variables added!" -ForegroundColor Green
Write-Host "Redeploy to apply changes: npx vercel --prod" -ForegroundColor Yellow
