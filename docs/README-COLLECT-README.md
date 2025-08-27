# README Collection Scripts

This directory contains scripts to automatically find and collect all README.md files from throughout the project into a centralized location.

## Available Scripts

### 1. PowerShell Script (`collect-readmes.ps1`)
**Best for Windows users with PowerShell**

**Basic usage:**
```powershell
# From project root
powershell -ExecutionPolicy Bypass -File scripts\collect-readmes.ps1

# Or if in scripts directory
.\collect-readmes.ps1
```

**Dry run (preview what would be moved):**
```powershell
powershell -ExecutionPolicy Bypass -File scripts\collect-readmes.ps1 -DryRun
```

**Custom target folder:**
```powershell
powershell -ExecutionPolicy Bypass -File scripts\collect-readmes.ps1 -TargetFolder "docs"
```

### 2. Batch Script (`collect-readmes-working.bat`)
**Simple Windows batch file - most reliable option**

**Basic usage:**
```cmd
# From project root
scripts\collect-readmes-working.bat

# Or using cmd
cmd /c scripts\collect-readmes-working.bat
```

**Dry run:**
```cmd
scripts\collect-readmes-working.bat dry-run
```

### 3. Node.js Script (`collect-readmes.js`)
**Cross-platform compatibility**

**Basic usage:**
```bash
# From project root
node scripts/collect-readmes.js

# Or globally if installed
npm install -g && collect-readmes
```

**Dry run:**
```bash
node scripts/collect-readmes.js --dry-run
```

**Custom target folder:**
```bash
node scripts/collect-readmes.js --target-folder=docs
```

## What the Scripts Do

1. **Find** all README.md files in the project (excluding common directories like node_modules, .git, archive, etc.)
2. **Move** them to a centralized folder (default: `readmes`)
3. **Rename** them with descriptive names to avoid conflicts:
   - `README.md` → `main-readme.md`
   - `src/components/chat/README.md` → `components-chat-readme.md`
   - `project/README.md` → `project-readme.md`

## Features

- **Dry run mode**: Preview what would be moved without actually moving files
- **Custom target folder**: Specify where to collect the READMEs
- **Smart naming**: Automatically generates descriptive names based on file locations
- **Exclusion rules**: Skips common directories that shouldn't be processed
- **Cross-platform**: Node.js version works on Windows, macOS, and Linux

## Example Output

```
=== README.md Collection Script ===
Target folder: readmes
Found 5 README.md files:

1. README.md
   -> readmes/main-readme.md
   Moved successfully

2. security-audit\README.md
   -> readmes/security-audit-readme.md
   Moved successfully

3. project\README.md
   -> readmes/project-readme.md
   Moved successfully
```

## Safety Features

- Dry run mode to preview changes
- Automatic backup of existing files with the same name (if any)
- Detailed logging of all operations
- Error handling for permission issues

## Manual Usage (Alternative)

If the scripts don't work in your environment, you can manually collect README files:

```powershell
# Find all README.md files
Get-ChildItem -Path "." -Recurse -Include "README.md" -File | Where-Object {
    $_.FullName -notmatch "\\readmes\\" -and
    $_.FullName -notmatch "\\node_modules\\" -and
    $_.FullName -notmatch "\\\.git\\" -and
    $_.FullName -notmatch "\\archive\\"
}

# Create readmes folder
mkdir readmes

# Move files with new names (example)
Move-Item "path\to\README.md" "readmes\descriptive-name.md"
```

## Troubleshooting

### PowerShell Issues
- Run with execution policy: `powershell -ExecutionPolicy Bypass -File script.ps1`
- Enable script execution: `Set-ExecutionPolicy RemoteSigned`

### Node.js Issues
- Ensure Node.js is installed: `node --version`
- Check if scripts directory is in PATH
- Use absolute paths if relative paths fail

### Batch File Issues
- Use `cmd /c script.bat` instead of direct execution
- Ensure you're in the correct directory
- Check for special characters in paths

## Use Cases

- **Project organization**: Keep all documentation in one place
- **Documentation maintenance**: Easy to find and update all README files
- **Project handoffs**: Centralized documentation location
- **CI/CD integration**: Automate documentation collection in build processes
