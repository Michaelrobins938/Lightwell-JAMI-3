# Comprehensive script to collect all .md files from the project
# and organize them into a centralized documentation structure

param(
    [string]$TargetFolder = "docs",
    [switch]$DryRun,
    [switch]$OrganizeByCategory
)

Write-Host "=== Comprehensive .md File Collection Script ===" -ForegroundColor Cyan
Write-Host "Target folder: $TargetFolder" -ForegroundColor Yellow
Write-Host "Organize by category: $OrganizeByCategory" -ForegroundColor Yellow

if ($DryRun) {
    Write-Host "DRY RUN mode - no files will be moved" -ForegroundColor Magenta
}
Write-Host ""

# Create target folder if it doesn't exist
if (-not (Test-Path $TargetFolder)) {
    if (-not $DryRun) {
        New-Item -ItemType Directory -Path $TargetFolder -Force
        Write-Host "Created folder: $TargetFolder" -ForegroundColor Green
    } else {
        Write-Host "[DRY RUN] Would create folder: $TargetFolder" -ForegroundColor Gray
    }
}

# Function to get category from path
function Get-CategoryFromPath {
    param([string]$FilePath)

    $relativePath = $FilePath.Replace($PWD.Path + "\", "").Replace("\", "/")

    if ($relativePath -match "^docs/") {
        return "documentation"
    }
    elseif ($relativePath -match "^agent_logs/|^logs/") {
        return "logs"
    }
    elseif ($relativePath -match "^agents/") {
        return "agents"
    }
    elseif ($relativePath -match "^security-audit/") {
        return "security"
    }
    elseif ($relativePath -match "^scripts/") {
        return "scripts"
    }
    elseif ($relativePath -match "^src/") {
        return "src-docs"
    }
    elseif ($relativePath -match "^project/") {
        return "project"
    }
    elseif ($relativePath -match "^archive/") {
        return "archive"
    }
    else {
        return "root-docs"
    }
}

# Function to clean filename
function Get-CleanFileName {
    param([string]$FilePath, [string]$Category)

    $fileName = [System.IO.Path]::GetFileNameWithoutExtension($FilePath)
    $extension = [System.IO.Path]::GetExtension($FilePath)

    # Remove category prefixes if they match the target category
    if ($Category -eq "documentation" -and $fileName -match "^docs[-_]") {
        $fileName = $fileName -replace "^docs[-_]", ""
    }
    elseif ($Category -eq "logs" -and $fileName -match "^.*[-_]log") {
        $fileName = $fileName -replace "[-_]log$", ""
    }

    # Clean up the name
    $cleanName = $fileName -replace "[^a-zA-Z0-9\-_\.]", "-"
    $cleanName = $cleanName -replace "-+", "-"
    $cleanName = $cleanName -replace "^-|-$", ""

    return $cleanName + $extension
}

# Find all .md files in the project (excluding common exclusions)
$mdFiles = Get-ChildItem -Path "." -Recurse -Include "*.md" -File |
    Where-Object {
        $_.FullName -notmatch "\\$TargetFolder\\" -and
        $_.FullName -notmatch "\\node_modules\\" -and
        $_.FullName -notmatch "\\\.git\\" -and
        $_.FullName -notmatch "\\\.next\\" -and
        $_.FullName -notmatch "\\dist\\" -and
        $_.FullName -notmatch "\\build\\"
    }

Write-Host "Found $($mdFiles.Count) .md files to process:" -ForegroundColor Green
Write-Host ""

$filesByCategory = @{}
$movedFiles = 0

foreach ($mdFile in $mdFiles) {
    $category = Get-CategoryFromPath -FilePath $mdFile.FullName
    $cleanName = Get-CleanFileName -FilePath $mdFile.FullName -Category $category

    if ($OrganizeByCategory) {
        $targetPath = Join-Path $TargetFolder $category
        $finalPath = Join-Path $targetPath $cleanName
    } else {
        $targetPath = $TargetFolder
        # Add category prefix to avoid conflicts
        $prefixedName = "$category-$cleanName"
        $finalPath = Join-Path $targetPath $prefixedName
    }

    # Create category subfolder if needed
    if ($OrganizeByCategory -and -not (Test-Path $targetPath)) {
        if (-not $DryRun) {
            New-Item -ItemType Directory -Path $targetPath -Force | Out-Null
        }
    }

    # Track files by category for summary
    if (-not $filesByCategory.ContainsKey($category)) {
        $filesByCategory[$category] = @()
    }
    $filesByCategory[$category] += $mdFile.Name

    $relativePath = $mdFile.FullName.Replace($PWD.Path + "\", "")
    Write-Host "  $relativePath" -ForegroundColor White

    if ($OrganizeByCategory) {
        Write-Host "    -> $TargetFolder/$category/$cleanName" -ForegroundColor Yellow
    } else {
        Write-Host "    -> $TargetFolder/$category-$cleanName" -ForegroundColor Yellow
    }

    if (-not $DryRun) {
        try {
            Move-Item -Path $mdFile.FullName -Destination $finalPath -Force
            Write-Host "    Moved successfully" -ForegroundColor Green
            $movedFiles++
        } catch {
            Write-Host "    Error moving file: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "    [DRY RUN] Would move file" -ForegroundColor Gray
    }

    Write-Host ""
}

# Summary
Write-Host "=== Collection Summary ===" -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "DRY RUN COMPLETED - No files were actually moved" -ForegroundColor Magenta
    Write-Host "Run without -DryRun parameter to execute the moves" -ForegroundColor Magenta
} else {
    Write-Host "COLLECTION COMPLETED - $movedFiles files moved" -ForegroundColor Green
}

Write-Host ""
Write-Host "Files by category:" -ForegroundColor Yellow
foreach ($category in $filesByCategory.Keys | Sort-Object) {
    $count = $filesByCategory[$category].Count
    Write-Host "  $category ($count files)" -ForegroundColor White
    if ($count -le 10) {
        foreach ($file in $filesByCategory[$category]) {
            Write-Host "    - $file" -ForegroundColor Gray
        }
    } else {
        $filesByCategory[$category][0..9] | ForEach-Object {
            Write-Host "    - $_" -ForegroundColor Gray
        }
        Write-Host "    ... and $($count - 10) more files" -ForegroundColor Gray
    }
    Write-Host ""
}

if ($OrganizeByCategory) {
    Write-Host "Files organized into category folders in '$TargetFolder/'" -ForegroundColor Green
} else {
    Write-Host "Files organized with category prefixes in '$TargetFolder/'" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Script Complete ===" -ForegroundColor Cyan
