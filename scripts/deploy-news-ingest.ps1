# news-ingest Edge Function deploy + smoke-test script'i.
#
# Secret okuma önceliği (uzak/CI uyumlu):
#   1) Gerçek ortam değişkeni  ($env:NAME)        <- CI/uzak runner burada
#   2) .env.local dosyası                         <- lokal geliştirme
#   3) .secret dosyası                            <- yalnızca SUPABASE_ACCESS_TOKEN için
#
# Kullanım:
#   Lokal : ./scripts/deploy-news-ingest.ps1
#           (token .secret veya .env.local'da, diğerleri .env.local'da)
#   CI/uzak: SUPABASE_ACCESS_TOKEN, SUPABASE_SERVICE_ROLE_KEY, NEWS_PIPELINE_SECRET
#            ortam değişkeni olarak set edilir; dosya gerekmez.

$ErrorActionPreference = 'Stop'
$projectRef = 'ldptefnpiudquipdsezr'

# --- env var -> .env.local -> .secret sırasıyla secret okuyan yardımcı ---
function Resolve-Secret {
  param([string]$Name, [switch]$AllowSecretFile)

  # 1) Gerçek ortam değişkeni (CI / uzak runner)
  $fromEnv = [Environment]::GetEnvironmentVariable($Name)
  if ($fromEnv) { return $fromEnv.Trim() }

  # 2) .env.local
  if (Test-Path '.env.local') {
    $line = Get-Content '.env.local' | Where-Object { $_ -match "^$Name=" } | Select-Object -First 1
    if ($line) { return (($line -split '=', 2)[1]).Trim().Trim('"') }
  }

  # 3) .secret (yalnızca token gibi tek-değerli dosyalar için)
  if ($AllowSecretFile -and (Test-Path '.secret')) {
    $raw = Get-Content '.secret' | Where-Object { $_ -match '\S' } | Select-Object -First 1
    if ($raw) {
      $val = $raw.Trim().Trim('"')
      if ($val -match '=') { $val = (($val -split '=', 2)[1]).Trim().Trim('"') }
      return $val
    }
  }
  return $null
}

# --- Access token (deploy için zorunlu) ---
$token = Resolve-Secret -Name 'SUPABASE_ACCESS_TOKEN' -AllowSecretFile
if (-not $token) {
  Write-Error "SUPABASE_ACCESS_TOKEN bulunamadı (env / .env.local / .secret). PAT: https://supabase.com/dashboard/account/tokens"
  exit 1
}
$env:SUPABASE_ACCESS_TOKEN = $token

Write-Host "news-ingest deploy ediliyor (project: $projectRef)..." -ForegroundColor Cyan
supabase functions deploy news-ingest --project-ref $projectRef
if ($LASTEXITCODE -ne 0) { Write-Error "Deploy başarısız (exit $LASTEXITCODE)"; exit $LASTEXITCODE }

# --- Smoke test: pipeline'ı tetikle ---
$svc = Resolve-Secret -Name 'SUPABASE_SERVICE_ROLE_KEY'
$sec = Resolve-Secret -Name 'NEWS_PIPELINE_SECRET'
if (-not $svc -or -not $sec) {
  Write-Host "`nDeploy tamam. (Smoke test atlandı: SERVICE_ROLE_KEY / NEWS_PIPELINE_SECRET yok.)" -ForegroundColor Yellow
  exit 0
}

Write-Host "`nDeploy tamam. Pipeline tetikleniyor (TRT dahil tüm kaynaklar)..." -ForegroundColor Cyan
$resp = Invoke-WebRequest -Uri "https://$projectRef.supabase.co/functions/v1/news-ingest" -Method Post -TimeoutSec 120 `
  -Headers @{ 'Authorization' = "Bearer $svc"; 'x-pipeline-secret' = $sec; 'Content-Type' = 'application/json' } `
  -Body '{"trigger":"manual"}'
Write-Host "Pipeline sonucu: $($resp.Content)" -ForegroundColor Green
