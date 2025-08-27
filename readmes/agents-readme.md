# 🤖 Multi-Agent Development System

Welcome to your local AI agent system! This setup allows you to simulate multiple specialized AI agents within your Cursor project, each with distinct personalities and expertise.

## 🎭 Available Agents

### 📋 **Planner** (`planner.md`)
**Role:** Strategic Project Planner  
**Personality:** Strategic, methodical, scope-clarifying  
**Best for:** Breaking down complex features, project planning, architecture decisions

### 🔍 **Debugger** (`debugger.md`)  
**Role:** Precision Debugging Specialist  
**Personality:** Clinical, analytical, forensic approach  
**Best for:** Finding bugs, analyzing errors, systematic troubleshooting

### 🧹 **Refactorer** (`refactorer.md`)
**Role:** Code Refactoring Specialist  
**Personality:** Blunt, efficient, no-nonsense  
**Best for:** Cleaning messy code, applying best practices, code optimization

### 🧪 **QA** (`qa.md`)
**Role:** Quality Assurance Specialist  
**Personality:** Detail-oriented, skeptical, thorough  
**Best for:** Writing tests, finding edge cases, ensuring code reliability

### 👔 **Assistant** (`assistant.md`)
**Role:** Snarky Executive Assistant  
**Personality:** Efficient, slightly sarcastic, results-oriented  
**Best for:** Quick fixes, random tasks, getting things done fast

## 🚀 How to Use

### Method 1: Cursor AI Mode Switching (Recommended)
1. Open Cursor's AI Mode dropdown (usually in the top-right)
2. Select one of the agent modes:
   - `planner` - For strategic planning
   - `debugger` - For bug hunting
   - `refactorer` - For code cleanup
   - `qa` - For testing and quality assurance
   - `assistant` - For quick tasks and fixes

### Method 2: Manual Copy-Paste
If AI mode switching doesn't work:
1. Open the corresponding `.md` file in the `agents/` folder
2. Copy the **SYSTEM ROLE** section (everything under "## SYSTEM ROLE")
3. Paste it into your Cursor chat with the instruction: "Act as this agent"

## 🔄 Multi-Agent Workflows

### Example Workflow: Adding a New Feature

1. **Start with Planner:**
   ```
   "I want to add user authentication to my app"
   ```
   → Gets strategic breakdown and scope clarification

2. **Switch to Debugger:**
   ```
   "My login function isn't working"
   ```
   → Gets systematic debugging approach

3. **Switch to Refactorer:**
   ```
   "Clean up this messy authentication code"
   ```
   → Gets code optimization and best practices

4. **Switch to QA:**
   ```
   "Write tests for my authentication system"
   ```
   → Gets comprehensive test coverage

5. **Switch to Assistant:**
   ```
   "Quick fix for this loading spinner issue"
   ```
   → Gets immediate practical solution

### Workflow Tips:
- **Planner → Debugger → Refactorer → QA → Assistant** is a common pattern
- Use **Planner** for initial scope and architecture
- Use **Debugger** when things break
- Use **Refactorer** for code quality improvements
- Use **QA** for testing and reliability
- Use **Assistant** for quick wins and urgent fixes

## 📁 File Structure

```
agents/
├── planner.md          # Strategic planning agent
├── debugger.md         # Bug hunting agent  
├── refactorer.md       # Code cleanup agent
├── qa.md              # Testing agent
├── assistant.md        # Quick fixes agent
└── README.md          # This file

.cursor/rules/
├── planner.mdc         # Cursor mode for planner
├── debugger.mdc        # Cursor mode for debugger
├── refactorer.mdc      # Cursor mode for refactorer
├── qa.mdc             # Cursor mode for QA
└── assistant.mdc       # Cursor mode for assistant
```

## 🎯 Agent Selection Guide

| Task Type | Best Agent | Why |
|-----------|------------|-----|
| New feature planning | **Planner** | Strategic breakdown and scope |
| Bug investigation | **Debugger** | Systematic analysis |
| Code cleanup | **Refactorer** | Best practices application |
| Testing needs | **QA** | Comprehensive coverage |
| Quick fixes | **Assistant** | Fast practical solutions |

## 🔧 Troubleshooting

### If Cursor AI Mode switching doesn't work:
1. Check that `.cursor/rules/` folder exists
2. Verify `.mdc` files are properly formatted
3. Restart Cursor if needed
4. Use manual copy-paste method as fallback

### If agents aren't responding as expected:
1. Check the agent's personality traits in the `.md` files
2. Make sure you're using the right agent for the task
3. Be specific about what you need from each agent

## 🎪 Pro Tips

- **Chain agents:** Use multiple agents in sequence for complex tasks
- **Be specific:** Tell each agent exactly what you need
- **Leverage personalities:** Use each agent's unique strengths
- **Document workflows:** Keep notes on which agent combinations work best
- **Iterate:** Don't be afraid to switch agents mid-task if needed

---

**Ready to start? Pick an agent and let's build something amazing! 🚀** 