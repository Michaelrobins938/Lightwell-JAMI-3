# Comprehensive .md File Collection Script

This script collects **ALL** `.md` files from throughout your project and organizes them into a centralized documentation structure.

## 🎯 **What It Does**

- **Finds** all `.md` files in your project
- **Categorizes** them by location (docs, logs, agents, security, etc.)
- **Moves** them to a centralized location
- **Renames** them to avoid conflicts
- **Organizes** them either with prefixes or in category folders

## 📁 **Categories**

The script automatically categorizes files based on their location:

| Location Pattern | Category | Description |
|------------------|----------|-------------|
| `docs/` | `documentation` | Main documentation files |
| `agent_logs/`, `logs/` | `logs` | Log files and reports |
| `agents/` | `agents` | Agent definition files |
| `security-audit/` | `security` | Security-related documentation |
| `scripts/` | `scripts` | Script documentation |
| `src/` | `src-docs` | Source code documentation |
| `project/` | `project` | Project-related files |
| `archive/` | `archive` | Archived documentation |
| Root directory | `root-docs` | General project documentation |

## 🚀 **Usage Options**

### **PowerShell Script** (`collect-all-md-files.ps1`)

**Basic collection (with category prefixes):**
```powershell
# From project root
powershell -ExecutionPolicy Bypass -File scripts\collect-all-md-files.ps1

# Or if in scripts directory
.\collect-all-md-files.ps1
```

**Organize by category folders:**
```powershell
powershell -ExecutionPolicy Bypass -File scripts\collect-all-md-files.ps1 -OrganizeByCategory
```

**Dry run (preview what would be moved):**
```powershell
powershell -ExecutionPolicy Bypass -File scripts\collect-all-md-files.ps1 -DryRun
```

**Dry run with category organization:**
```powershell
powershell -ExecutionPolicy Bypass -File scripts\collect-all-md-files.ps1 -DryRun -OrganizeByCategory
```

**Custom target folder:**
```powershell
powershell -ExecutionPolicy Bypass -File scripts\collect-all-md-files.ps1 -TargetFolder "documentation"
```

### **Batch Script** (`collect-all-md-files.bat`)

**Basic collection:**
```cmd
scripts\collect-all-md-files.bat
```

**Dry run:**
```cmd
scripts\collect-all-md-files.bat dry-run
```

**Organize by categories:**
```cmd
scripts\collect-all-md-files.bat organize
```

**Dry run with organization:**
```cmd
scripts\collect-all-md-files.bat dry-run-organize
```

## 📋 **Organization Methods**

### **Method 1: Category Prefixes (Default)**
```
docs/
├── documentation-AUTHENTICATION_SYSTEM_README.md
├── documentation-COMPREHENSIVE_PERSISTENCE_SYSTEM.md
├── logs-claude_log.md
├── logs-gemini_log.md
├── agents-assistant.md
├── agents-debugger.md
└── security-SECURITY_HARDENING_AUDIT.md
```

### **Method 2: Category Folders**
```
docs/
├── documentation/
│   ├── AUTHENTICATION_SYSTEM_README.md
│   └── COMPREHENSIVE_PERSISTENCE_SYSTEM.md
├── logs/
│   ├── claude_log.md
│   └── gemini_log.md
├── agents/
│   ├── assistant.md
│   └── debugger.md
└── security/
    └── SECURITY_HARDENING_AUDIT.md
```

## 🔧 **Features**

### **Smart Naming**
- Removes redundant prefixes (e.g., "docs-" from files in docs folder)
- Cleans up special characters and spaces
- Handles naming conflicts automatically
- Preserves file extensions

### **Exclusion Rules**
- Skips `node_modules/`, `.git/`, `.next/`, `dist/`, `build/`
- Avoids moving files from the target directory
- Safe operation with error handling

### **Detailed Logging**
- Shows progress for each file
- Provides summary by category
- Color-coded output for different operations
- Error reporting for failed moves

## 📊 **Example Output**

```
=== Comprehensive .md File Collection Script ===
Target folder: docs
Organize by category: True

Found 87 .md files to process:

  docs\AUTHENTICATION_SYSTEM_README.md
    -> docs/documentation/AUTHENTICATION_SYSTEM_README.md
    Moved successfully

  agent_logs\claude_log.md
    -> docs/logs/claude_log.md
    Moved successfully

  agents\assistant.md
    -> docs/agents/assistant.md
    Moved successfully

=== Collection Summary ===
COLLECTION COMPLETED - 87 files moved

Files by category:
  documentation (25 files)
    - AUTHENTICATION_SYSTEM_README.md
    - COMPREHENSIVE_PERSISTENCE_SYSTEM.md
    ...
  logs (12 files)
    - claude_log.md
    - gemini_log.md
    ...
```

## 🛡️ **Safety Features**

- **Dry run mode** to preview changes
- **Error handling** for permission issues
- **Conflict resolution** for duplicate names
- **Backup-safe** operation

## 🔍 **Troubleshooting**

### **PowerShell Issues**
- Use: `powershell -ExecutionPolicy Bypass -File script.ps1`
- Enable execution: `Set-ExecutionPolicy RemoteSigned`

### **Permission Errors**
- Run as administrator if moving system files
- Close any open .md files in editors

### **Path Issues**
- Use absolute paths if relative paths fail
- Check for long path names (>260 characters)

## 💡 **Use Cases**

- **Project cleanup**: Organize scattered documentation
- **Documentation maintenance**: Centralize all docs
- **Project handoffs**: Prepare clean documentation structure
- **Backup preparation**: Consolidate important files
- **CI/CD integration**: Automate documentation collection

## 📈 **Current Project Status**

Based on your project, this script will collect approximately **87+ .md files** including:

- **Documentation** (25+ files from `docs/` folder)
- **Agent files** (7 files from `agents/` folder)
- **Log files** (12+ files from `logs/` and `agent_logs/` folders)
- **Security docs** (1+ files from `security-audit/` folder)
- **Script docs** (1+ file from `scripts/` folder)
- **Source docs** (3+ files from `src/` subdirectories)
- **Project files** (1+ file from `project/` folder)
- **Root docs** (35+ files from main directory)

Run the script to get the exact count and organization for your current project state!
