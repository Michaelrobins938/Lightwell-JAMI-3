# Simple .md file collector - works reliably in any PowerShell environment

Write-Host "=== Simple .md File Collection ===" -ForegroundColor Cyan
Write-Host "Scanning for all .md files in the project..." -ForegroundColor Yellow

# Get all .md files except those in excluded directories
$mdFiles = Get-ChildItem -Path "." -Recurse -Include "*.md" -File | Where-Object {
    $_.FullName -notmatch "\\node_modules\\" -and
    $_.FullName -notmatch "\\\.git\\" -and
    $_.FullName -notmatch "\\\.next\\" -and
    $_.FullName -notmatch "\\dist\\" -and
    $_.FullName -notmatch "\\build\\" -and
    $_.FullName -notmatch "\\readmes\\"  # Skip our existing readmes folder
}

Write-Host "Found $($mdFiles.Count) .md files" -ForegroundColor Green

# Create docs directory if it doesn't exist
if (-not (Test-Path "docs")) {
    New-Item -ItemType Directory -Path "docs" -Force
    Write-Host "Created docs/ directory" -ForegroundColor Green
}

$movedCount = 0
$skippedCount = 0

foreach ($file in $mdFiles) {
    $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "")

    # Skip if file is already in docs directory
    if ($relativePath -match "^docs\\") {
        Write-Host "Skipping (already in docs): $relativePath" -ForegroundColor Gray
        $skippedCount++
        continue
    }

    # Get file name without path
    $fileName = $file.Name

    # Check if file already exists in docs
    $targetPath = Join-Path "docs" $fileName
    if (Test-Path $targetPath) {
        # Add directory prefix to avoid conflicts
        $dirName = Split-Path $relativePath -Parent
        $dirName = $dirName -replace "[^a-zA-Z0-9]", "-"
        $newFileName = "$dirName-$fileName"
        $targetPath = Join-Path "docs" $newFileName
    }

    Write-Host "Moving: $relativePath -> docs/$([System.IO.Path]::GetFileName($targetPath))" -ForegroundColor White

    try {
        Move-Item -Path $file.FullName -Destination $targetPath -Force
        Write-Host "  ✓ Moved successfully" -ForegroundColor Green
        $movedCount++
    }
    catch {
        Write-Host "  ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Files moved: $movedCount" -ForegroundColor Green
Write-Host "Files skipped: $skippedCount" -ForegroundColor Yellow
Write-Host "Total processed: $($movedCount + $skippedCount)" -ForegroundColor White

if ($movedCount -gt 0) {
    Write-Host ""
    Write-Host "All .md files have been collected in the docs/ folder!" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Cyan
