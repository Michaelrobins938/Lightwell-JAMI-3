# PowerShell script to collect all README.md files from the project
# and move them to a centralized readmes folder

param(
    [string]$TargetFolder = "readmes",
    [switch]$DryRun
)

Write-Host "=== README.md Collection Script ===" -ForegroundColor Cyan
Write-Host "Target folder: $TargetFolder" -ForegroundColor Yellow

# Create target folder if it doesn't exist
if (-not (Test-Path $TargetFolder)) {
    if (-not $DryRun) {
        New-Item -ItemType Directory -Path $TargetFolder -Force
        Write-Host "Created folder: $TargetFolder" -ForegroundColor Green
    } else {
        Write-Host "[DRY RUN] Would create folder: $TargetFolder" -ForegroundColor Gray
    }
}

# Find all README.md files in the project (excluding the target folder and common exclusions)
$readmeFiles = Get-ChildItem -Path "." -Recurse -Include "README.md" -File |
    Where-Object {
        $_.FullName -notmatch "\\$TargetFolder\\" -and
        $_.FullName -notmatch "\\node_modules\\" -and
        $_.FullName -notmatch "\\\.git\\" -and
        $_.FullName -notmatch "\\archive\\" -and
        $_.FullName -notmatch "\\backup"
    }

Write-Host "Found $($readmeFiles.Count) README.md files:" -ForegroundColor Green

$counter = 0
foreach ($readme in $readmeFiles) {
    $counter++

    # Generate a descriptive name based on the file's original location
    $relativePath = $readme.FullName.Replace($PWD.Path + "\", "").Replace("\README.md", "")
    $cleanName = $relativePath.Replace("\", "-").Replace(" ", "-").ToLower()

    # Handle special cases
    if ($relativePath -eq "README") {
        $newName = "main-readme.md"
    } elseif ($cleanName -match "^src-") {
        $newName = $cleanName.Replace("src-", "") + "-readme.md"
    } else {
        $newName = $cleanName + "-readme.md"
    }

    $targetPath = Join-Path $TargetFolder $newName

    Write-Host "$counter. $($readme.FullName)" -ForegroundColor White
    Write-Host "   -> $targetPath" -ForegroundColor Yellow

    if (-not $DryRun) {
        # Move the file
        Move-Item -Path $readme.FullName -Destination $targetPath -Force
        Write-Host "   Moved successfully" -ForegroundColor Green
    } else {
        Write-Host "   [DRY RUN] Would move to: $targetPath" -ForegroundColor Gray
    }

    Write-Host ""
}

if ($DryRun) {
    Write-Host "DRY RUN COMPLETED - No files were actually moved" -ForegroundColor Magenta
    Write-Host "Run without -DryRun parameter to execute the moves" -ForegroundColor Magenta
} else {
    Write-Host "COLLECTION COMPLETED - All README.md files have been moved" -ForegroundColor Green
}

Write-Host "=== Script Complete ===" -ForegroundColor Cyan
