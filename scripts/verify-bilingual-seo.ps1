$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $repoRoot

$env:Path = "C:\Ruby33-x64\bin;$env:Path"

$koreanPosts = @(
  "2026-04-13-AI-Business-Planning-Havruta-Method.md",
  "2025-10-11-korea-blockchain-regulation-crossroads.md",
  "2025-10-11-k-stablecoin-opportunities.md",
  "2025-10-11-k-stablecoin-strategy-step-one.md",
  "2025-09-22-what-is-stablecoin.md",
  "2025-09-22-won-status-in-global-market.md",
  "2025-09-22-won-as-big-hand-in-crypto.md",
  "2025-09-22-reason-for-weak-won.md",
  "2025-09-22-stablecoin-revenue-model.md",
  "2025-09-22-role-of-government.md"
)

$englishPages = @(
  "_pages/en/ai-business-planning-havruta-method.md",
  "_pages/en/korea-blockchain-regulation-crossroads.md",
  "_pages/en/k-stablecoin-opportunities.md",
  "_pages/en/k-stablecoin-strategy-step-one.md",
  "_pages/en/what-is-stablecoin.md",
  "_pages/en/won-status-in-global-market.md",
  "_pages/en/won-as-big-hand-in-crypto.md",
  "_pages/en/reason-for-weak-won.md",
  "_pages/en/stablecoin-revenue-model.md",
  "_pages/en/role-of-government.md"
)

function Assert-Contains {
  param(
    [string]$Content,
    [string]$Expected,
    [string]$Message
  )

  if (-not $Content.Contains($Expected)) {
    throw $Message
  }
}

foreach ($post in $koreanPosts) {
  $path = Join-Path $repoRoot "_posts\$post"
  $content = Get-Content -LiteralPath $path -Raw
  Assert-Contains $content "lang: ko" "Missing 'lang: ko' in $post"
  Assert-Contains $content "translation_key:" "Missing translation_key in $post"
}

foreach ($page in $englishPages) {
  $path = Join-Path $repoRoot $page
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing English page: $page"
  }
}

bundle exec jekyll build | Out-Null

$homePath = Join-Path $repoRoot "_site\index.html"
$englishIndexPath = Join-Path $repoRoot "_site\en\index.html"
$englishArticlePath = Join-Path $repoRoot "_site\en\business-strategy\ai-business-planning-havruta-method\index.html"
$koreanArticlePath = Get-ChildItem -LiteralPath (Join-Path $repoRoot "_site") -Recurse -Filter "index.html" |
  Where-Object { $_.FullName -match [regex]::Escape("AI-Business-Planning-Havruta-Method\index.html") } |
  Select-Object -First 1 -ExpandProperty FullName

foreach ($generated in @($homePath, $englishIndexPath, $englishArticlePath)) {
  if (-not (Test-Path -LiteralPath $generated)) {
    throw "Missing generated file: $generated"
  }
}

if (-not $koreanArticlePath) {
  throw "Missing generated Korean article output for AI-Business-Planning-Havruta-Method"
}

$homeHtml = Get-Content -LiteralPath $homePath -Raw
$englishIndexHtml = Get-Content -LiteralPath $englishIndexPath -Raw
$koreanArticleHtml = Get-Content -LiteralPath $koreanArticlePath -Raw
$englishArticleHtml = Get-Content -LiteralPath $englishArticlePath -Raw

Assert-Contains $homeHtml '<html lang="ko"' "Korean homepage should render with lang=ko"
Assert-Contains $englishIndexHtml '<html lang="en"' "English landing page should render with lang=en"
Assert-Contains $koreanArticleHtml 'hreflang="en"' "Korean article should emit hreflang=en"
Assert-Contains $koreanArticleHtml 'page__language-switcher' "Korean article should render the language switcher"
Assert-Contains $koreanArticleHtml '/en/business-strategy/ai-business-planning-havruta-method/' "Korean article should link to its English counterpart"
Assert-Contains $englishArticleHtml 'hreflang="ko-KR"' "English article should emit hreflang=ko-KR"
Assert-Contains $englishArticleHtml 'page__language-switcher' "English article should render the language switcher"

Write-Host "Bilingual SEO verification passed."
