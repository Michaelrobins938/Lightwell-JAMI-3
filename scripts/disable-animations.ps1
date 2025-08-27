#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Animation Disabler Script for Windows
    Removes all scroll animations from the codebase for clean screenshots

.DESCRIPTION
    This script removes common animation patterns from TypeScript/React files:
    - Framer Motion whileInView, initial, animate, exit props
    - AOS (Animate On Scroll) data attributes
    - Lazy loading attributes
    - Replaces motion components with regular HTML elements

.PARAMETER Preview
    Preview mode - shows what would be changed without actually modifying files

.PARAMETER SpecificFile
    Process only a specific file instead of the entire codebase

.EXAMPLE
    .\scripts\disable-animations.ps1
    .\scripts\disable-animations.ps1 -Preview
    .\scripts\disable-animations.ps1 -SpecificFile "src\pages\login.tsx"
#>

param(
    [switch]$Preview,
    [string]$SpecificFile
)

Write-Host "🎬 Animation Disabler Script (PowerShell)" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Patterns to remove (in order of specificity)
$patterns = @(
    # Framer Motion scroll animations
    @{ Name = "whileInView"; Regex = "whileInView=\{[^}]*\}"; Replacement = "" }
    @{ Name = "whileInView (nested)"; Regex = "whileInView=\{[^}]*\{[^}]*\}[^}]*\}"; Replacement = "" }

    # Initial animation states
    @{ Name = "initial"; Regex = "initial=\{[^}]*\}"; Replacement = "" }
    @{ Name = "initial (nested)"; Regex = "initial=\{[^}]*\{[^}]*\}[^}]*\}"; Replacement = "" }

    # Animation props
    @{ Name = "animate"; Regex = "animate=\{[^}]*\}"; Replacement = "" }
    @{ Name = "animate (nested)"; Regex = "animate=\{[^}]*\{[^}]*\}[^}]*\}"; Replacement = "" }

    # Exit animations
    @{ Name = "exit"; Regex = "exit=\{[^}]*\}"; Replacement = "" }
    @{ Name = "exit (nested)"; Regex = "exit=\{[^}]*\{[^}]*\}[^}]*\}"; Replacement = "" }

    # Transition props
    @{ Name = "transition"; Regex = "transition=\{[^}]*\}"; Replacement = "" }
    @{ Name = "transition (nested)"; Regex = "transition=\{[^}]*\{[^}]*\}[^}]*\}"; Replacement = "" }

    # Variants
    @{ Name = "variants"; Regex = "variants=\{[^}]*\}"; Replacement = "" }
    @{ Name = "variants (nested)"; Regex = "variants=\{[^}]*\{[^}]*\}[^}]*\}"; Replacement = "" }

    # AOS (Animate On Scroll) attributes
    @{ Name = "data-aos"; Regex = 'data-aos="[^"]*"'; Replacement = "" }

    # Lazy loading
    @{ Name = 'loading="lazy"'; Regex = 'loading="lazy"'; Replacement = "" }
)

# Motion component replacements
$motionReplacements = @(
    @{ Pattern = "<motion\.div"; Replacement = '<div className="opacity-100"' }
    @{ Pattern = "<motion\.section"; Replacement = '<section className="opacity-100"' }
    @{ Pattern = "<motion\.h1"; Replacement = '<h1 className="opacity-100"' }
    @{ Pattern = "<motion\.h2"; Replacement = '<h2 className="opacity-100"' }
    @{ Pattern = "<motion\.p"; Replacement = '<p className="opacity-100"' }
    @{ Pattern = "<motion\.button"; Replacement = '<button className="opacity-100"' }
    @{ Pattern = "<motion\.span"; Replacement = '<span className="opacity-100"' }
)

function Process-File {
    param([string]$FilePath)

    try {
        $content = Get-Content $FilePath -Raw -Encoding UTF8
        $originalContent = $content
        $totalChanges = 0

        Write-Host "📄 Processing: $FilePath" -ForegroundColor Yellow

        # Apply regex patterns
        foreach ($pattern in $patterns) {
            $matches = [regex]::Matches($content, $pattern.Regex)
            if ($matches.Count -gt 0) {
                $content = [regex]::Replace($content, $pattern.Regex, $pattern.Replacement)
                $totalChanges += $matches.Count
                Write-Host "  ✅ $($pattern.Name): $($matches.Count) removed" -ForegroundColor Green
            }
        }

        # Apply motion component replacements
        foreach ($replacement in $motionReplacements) {
            $matches = [regex]::Matches($content, [regex]::Escape($replacement.Pattern))
            if ($matches.Count -gt 0) {
                $content = $content.Replace($replacement.Pattern, $replacement.Replacement)
                $totalChanges += $matches.Count
                Write-Host "  🔄 Motion component: $($matches.Count) replaced" -ForegroundColor Blue
            }
        }

        # Clean up empty props and extra whitespace
        $content = $content -replace '\s+>\s*', ">`n"
        $content = $content -replace '(\w+)\s*=\{\s*\}', ''
        $content = $content -replace '\s+', ' '
        $content = $content -replace '\s*\n\s*', "`n"

        if ($content -ne $originalContent) {
            if ($Preview) {
                Write-Host "  📝 Would modify: $totalChanges changes" -ForegroundColor Magenta
            } else {
                [System.IO.File]::WriteAllText($FilePath, $content, [System.Text.Encoding]::UTF8)
                Write-Host "  ✨ Modified: $totalChanges changes" -ForegroundColor Green
            }
            return $true
        } else {
            Write-Host "  ⏭️  No changes needed" -ForegroundColor Gray
            return $false
        }
    } catch {
        Write-Host "  ❌ Error processing $FilePath`: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Get-FilesToProcess {
    if ($SpecificFile) {
        if (Test-Path $SpecificFile) {
            return @($SpecificFile)
        } else {
            Write-Host "❌ Specific file not found: $SpecificFile" -ForegroundColor Red
            exit 1
        }
    }

    # Find all TypeScript/React files
    $patterns = @(
        "src\**\*.tsx",
        "src\**\*.ts",
        "components\**\*.tsx",
        "components\**\*.ts",
        "pages\**\*.tsx",
        "pages\**\*.ts"
    )

    $files = @()
    foreach ($pattern in $patterns) {
        try {
            $matches = Get-ChildItem -Path $pattern -ErrorAction SilentlyContinue
            $files += $matches.FullName
        } catch {
            # Skip if pattern doesn't match
        }
    }

    return $files | Sort-Object -Unique
}

# Main execution
Write-Host "🔍 Scanning for animation patterns..." -ForegroundColor Cyan
Write-Host ""

$files = Get-FilesToProcess
Write-Host "📁 Found $($files.Count) files to process" -ForegroundColor White
Write-Host ""

$totalFiles = 0
$totalChanges = 0

foreach ($file in $files) {
    if (Process-File -FilePath $file) {
        $totalFiles++
    }
}

Write-Host ""
Write-Host ("=" * 40) -ForegroundColor Cyan
if ($Preview) {
    Write-Host "📊 Preview Complete: $totalFiles files would be modified" -ForegroundColor Magenta
} else {
    Write-Host "✅ Animation Removal Complete: $totalFiles files modified" -ForegroundColor Green
}
Write-Host ("=" * 40) -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "  - Run with -Preview to see changes first" -ForegroundColor White
Write-Host "  - Use -SpecificFile to target one file" -ForegroundColor White
Write-Host "  - Check browser console for disableAnimations() function" -ForegroundColor White
Write-Host "  - Set DISABLE_ANIMATIONS = true in _app.tsx for runtime disabling" -ForegroundColor White

# Pause for user to see results
Read-Host "Press Enter to exit"

