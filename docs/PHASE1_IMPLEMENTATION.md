# 🚀 Phase 1 Implementation: The Hub

## **Current Status**
Your Luna ChatGPT clone with voice mode is the perfect foundation. We're now building the **persistent AI entity** on top of it.

## **Step 1: Enable Electron Node Integration**

### **Update main.js (Electron Main Process)**

```javascript
// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const { spawn } = require('child_process');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,  // Enable Node.js in renderer
      contextIsolation: false, // Allow direct access (for development)
      enableRemoteModule: true
    }
  });

  mainWindow.loadURL('http://localhost:3000'); // Your Next.js app
}

// ------------------ IPC BRIDGES ------------------

// File Operations
ipcMain.handle('fs:readFile', async (event, filePath) => {
  try {
    const fullPath = path.resolve(filePath);
    // Basic sandboxing - restrict to project directory
    if (!fullPath.startsWith(process.cwd())) {
      throw new Error('Access denied: outside project directory');
    }
    return await fs.readFile(fullPath, 'utf-8');
  } catch (error) {
    throw new Error(`File read failed: ${error.message}`);
  }
});

ipcMain.handle('fs:writeFile', async (event, filePath, content) => {
  try {
    const fullPath = path.resolve(filePath);
    if (!fullPath.startsWith(process.cwd())) {
      throw new Error('Access denied: outside project directory');
    }
    await fs.writeFile(fullPath, content, 'utf-8');
    return { success: true };
  } catch (error) {
    throw new Error(`File write failed: ${error.message}`);
  }
});

ipcMain.handle('fs:deleteFile', async (event, filePath) => {
  try {
    const fullPath = path.resolve(filePath);
    if (!fullPath.startsWith(process.cwd())) {
      throw new Error('Access denied: outside project directory');
    }
    await fs.unlink(fullPath);
    return { success: true };
  } catch (error) {
    throw new Error(`File delete failed: ${error.message}`);
  }
});

// CLI Operations
ipcMain.handle('cli:run', async (event, command, args = [], cwd) => {
  return new Promise((resolve, reject) => {
    const allowedCommands = ['git', 'npm', 'node', 'yarn', 'npx', 'docker', 'python', 'pip'];

    if (!allowedCommands.includes(command)) {
      reject(new Error(`Command not allowed: ${command}`));
      return;
    }

    const proc = spawn(command, args, {
      cwd: cwd || process.cwd(),
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, stdout, stderr, code });
      } else {
        resolve({ success: false, stdout, stderr, code });
      }
    });

    proc.on('error', (error) => {
      reject(new Error(`Command execution failed: ${error.message}`));
    });
  });
});

app.whenReady().then(createWindow);
```

## **Step 2: MCP Server Configuration**

### **Create mcp-config.json**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem"],
      "env": {}
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "mcp-sequentialthinking-tools"],
      "env": {}
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@bdmarvin/mcp-server-memory"],
      "env": {}
    },
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "puppeteer-mcp-server"],
      "env": {}
    },
    "everything": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-everything"],
      "env": {}
    }
  }
}
```

### **Create MCP Manager**

```javascript
// mcp-manager.js
const { spawn } = require('child_process');
const WebSocket = require('ws');

class MCPManager {
  constructor() {
    this.servers = new Map();
    this.connections = new Map();
  }

  async startServer(name, config) {
    return new Promise((resolve, reject) => {
      const server = spawn(config.command, config.args, {
        env: { ...process.env, ...config.env },
        stdio: ['pipe', 'pipe', 'pipe']
      });

      // Wait for server to be ready (you'll need to parse stdout for ready signal)
      server.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Server ready') || output.includes('listening')) {
          this.servers.set(name, server);
          resolve(server);
        }
      });

      server.on('error', reject);

      // Keep server alive
      server.on('close', () => {
        this.servers.delete(name);
      });
    });
  }

  async connectToServer(name, port) {
    const ws = new WebSocket(`ws://localhost:${port}`);
    return new Promise((resolve, reject) => {
      ws.on('open', () => {
        this.connections.set(name, ws);
        resolve(ws);
      });
      ws.on('error', reject);
    });
  }

  async initializeAll() {
    const config = require('./mcp-config.json');

    for (const [name, serverConfig] of Object.entries(config.mcpServers)) {
      try {
        await this.startServer(name, serverConfig);
        console.log(`✅ MCP Server ${name} started`);
      } catch (error) {
        console.error(`❌ Failed to start ${name}:`, error);
      }
    }
  }

  async shutdown() {
    for (const [name, server] of this.servers) {
      server.kill();
    }
    for (const [name, ws] of this.connections) {
      ws.close();
    }
  }
}

module.exports = MCPManager;
```

## **Step 3: React Hooks for IPC Communication**

### **Create hooks/useDevAgent.ts**

```typescript
// hooks/useDevAgent.ts
import { useState, useCallback } from 'react';

export function useDevAgent() {
  const [isLoading, setIsLoading] = useState(false);

  const runCommand = useCallback(async (
    command: string,
    args: string[] = [],
    cwd?: string
  ) => {
    setIsLoading(true);
    try {
      const result = await window.electron.invoke('cli:run', command, args, cwd);
      return result;
    } catch (error) {
      throw new Error(`CLI command failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const readFile = useCallback(async (filePath: string) => {
    setIsLoading(true);
    try {
      const content = await window.electron.invoke('fs:readFile', filePath);
      return content;
    } catch (error) {
      throw new Error(`File read failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const writeFile = useCallback(async (filePath: string, content: string) => {
    setIsLoading(true);
    try {
      const result = await window.electron.invoke('fs:writeFile', filePath, content);
      return result;
    } catch (error) {
      throw new Error(`File write failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteFile = useCallback(async (filePath: string) => {
    setIsLoading(true);
    try {
      const result = await window.electron.invoke('fs:deleteFile', filePath);
      return result;
    } catch (error) {
      throw new Error(`File delete failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    runCommand,
    readFile,
    writeFile,
    deleteFile,
    isLoading
  };
}
```

## **Step 4: TypeScript Declarations**

### **Create types/electron.d.ts**

```typescript
// types/electron.d.ts
declare global {
  interface Window {
    electron: {
      invoke(channel: string, ...args: any[]): Promise<any>;
    };
  }
}

export {};
```

## **Step 5: Test the Integration**

### **Create a Test Component**

```tsx
// components/DevAgentTest.tsx
import { useState } from 'react';
import { useDevAgent } from '@/hooks/useDevAgent';

export default function DevAgentTest() {
  const { runCommand, readFile, writeFile, isLoading } = useDevAgent();
  const [output, setOutput] = useState('');

  const handleRunGitStatus = async () => {
    try {
      const result = await runCommand('git', ['status']);
      setOutput(result.stdout || result.stderr);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const handleReadFile = async () => {
    try {
      const content = await readFile('package.json');
      setOutput(content);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Dev Agent Test</h2>

      <div className="space-x-2 mb-4">
        <button
          onClick={handleRunGitStatus}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Run Git Status
        </button>

        <button
          onClick={handleReadFile}
          disabled={isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Read Package.json
        </button>
      </div>

      <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
        {output}
      </pre>
    </div>
  );
}
```

## **Step 6: Integrate with Voice Mode**

### **Update Your Voice Service**

```typescript
// Update your voice service to use the dev agent
import { useDevAgent } from '@/hooks/useDevAgent';

function VoiceService() {
  const { runCommand } = useDevAgent();

  const executeCommand = async (command: string) => {
    try {
      const result = await runCommand(command);
      // Send result back through voice or display
      return result;
    } catch (error) {
      return { error: error.message };
    }
  };

  // Integrate with your existing voice transcription
  // When user says "run git status", call executeCommand('git status')
}
```

## **Next Steps**

1. **Update your Electron main process** with the IPC handlers
2. **Install MCP servers** via npm
3. **Create the MCP manager** and initialize servers
4. **Add the React hooks** and TypeScript declarations
5. **Test the integration** with the test component
6. **Connect to your voice mode** for hands-free operation

## **Expected Outcome**

After implementation, you'll have:

- ✅ **Persistent AI entity** that remembers across sessions
- ✅ **Full file system access** with proper sandboxing
- ✅ **CLI command execution** with security controls
- ✅ **MCP server integration** for advanced capabilities
- ✅ **Voice-controlled development** environment

**The foundation for Jarvis is now ready to build upon.**
