# Automated Push to GitHub for Akash
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "💖 Deploying Nitisha's Website to GitHub 💖" -ForegroundColor Magenta
Write-Host "==========================================" -ForegroundColor Cyan

$repoName = Read-Host "Enter your GitHub Repository name (e.g. for-nitu)"
if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "for-nitu"
}

$githubUser = "Akashsinghiiitb"
$remoteUrl = "https://github.com/$githubUser/$repoName.git"

Write-Host "`nSetting remote to: $remoteUrl" -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin $remoteUrl
git branch -M main

Write-Host "Pushing files to GitHub..." -ForegroundColor Green
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n==========================================" -ForegroundColor Green
    Write-Host "🎉 Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "Next Step to get your free live link:" -ForegroundColor Cyan
    Write-Host "1. Go to: https://github.com/$githubUser/$repoName/settings/pages" -ForegroundColor White
    Write-Host "2. Under 'Build and deployment' -> Branch: select 'main' -> Click Save" -ForegroundColor White
    Write-Host "`nWithin 30 seconds, your site will be live at:" -ForegroundColor Magenta
    Write-Host "👉 https://$githubUser.github.io/$repoName/`n" -ForegroundColor Yellow
} else {
    Write-Host "`nNote: Make sure you created the empty repository on https://github.com/new first!" -ForegroundColor Red
}
