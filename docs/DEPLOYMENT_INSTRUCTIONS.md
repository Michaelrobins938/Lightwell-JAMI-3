# 🌙 LUNA AUTONOMOUS DESIGN AGENT - DEPLOYMENT GUIDE

## Quick Start (One-Command Bootstrap)

```bash
# Navigate to project directory
cd luna-web

# Run the autonomous agent bootstrap
node luna-agent-bootstrap.js
```

## Prerequisites

### 1. Node.js Installation
If Node.js is not installed, download and install from:
- **Windows**: https://nodejs.org/en/download/
- **macOS**: `brew install node`
- **Linux**: `sudo apt install nodejs npm`

### 2. Environment Setup

Create a `.env` file in the project root:

```bash
# Required API Keys
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Optional: Additional AI Services
OPENAI_API_KEY=your-openai-key-here
GROQ_API_KEY=your-groq-key-here

# Development Settings
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Install Dependencies

```bash
npm install
```

## Agent Deployment Phases

The Luna Autonomous Design Agent executes 8 phases automatically:

1. **System Initialization** - Creates workspace structure
2. **Environment Configuration** - Sets up development tools
3. **Agent Deployment** - Deploys autonomous systems
4. **Design System Creation** - Generates therapeutic design tokens
5. **Component Generation** - Creates 25+ UI components
6. **Validation & Optimization** - Runs accessibility and safety checks
7. **Documentation Generation** - Creates comprehensive docs
8. **Project Completion** - Finalizes deployment

## Monitoring Agent Progress

### Real-time Status
```bash
# Check agent status
cat .luna-agent/progress.json

# View live logs
tail -f .luna-agent/logs/agent.log

# Monitor component generation
watch -n 5 "ls -la src/components/luna-ui/"
```

### Agent Commands
```bash
# Resume agent execution
node .luna-agent/scripts/resume-agent.js

# Check agent health
node .luna-agent/monitoring.js

# Force restart agent
pkill -f "luna-design-agent"
node .luna-agent/luna-design-agent.js
```

## Generated Components

The agent will create 25+ production-ready components:

### Core Therapeutic Components
- `TherapyCanvas` - Main therapeutic interface
- `JamieAvatar` - AI companion visualization
- `MoodTracker` - Emotional state monitoring
- `CrisisButton` - Emergency intervention system
- `EmotionalCalibrator` - Mood regulation tools

### Accessibility & Safety
- `AccessibilityToolbar` - Universal design controls
- `SensoryControls` - Neurodivergent accommodations
- `CrisisResources` - Emergency support system
- `PrivacyControls` - Data protection interface

### Wellness & Recovery
- `BreathingExercise` - Mindfulness tools
- `GroundingTools` - Crisis intervention
- `ProgressVisualizer` - Recovery tracking
- `WellnessCheckIn` - Regular assessments

## Design System Features

### Therapeutic Design Tokens
- **Color Palette**: Trauma-informed, calming colors
- **Typography**: High readability, dyslexia-friendly
- **Spacing**: Consistent, predictable layouts
- **Animation**: Smooth, non-triggering transitions

### Accessibility Compliance
- WCAG 2.2 AA+ standards
- Screen reader optimization
- Keyboard navigation support
- High contrast modes
- Reduced motion options

### Crisis-Safe UX Patterns
- No auto-playing media
- Predictable navigation
- Clear exit options
- Trigger warnings
- Emergency contacts always accessible

## Development Workflow

### Starting Development Server
```bash
# After agent deployment
npm run dev
```

### Component Development
```bash
# View generated components
ls src/components/luna-ui/

# Edit specific component
code src/components/luna-ui/TherapyCanvas/

# Run component tests
npm test src/components/luna-ui/TherapyCanvas/
```

### Storybook Integration
```bash
# Start Storybook
npm run storybook

# Build Storybook
npm run storybook:build
```

## Troubleshooting

### Common Issues

1. **Node.js not found**
   ```bash
   # Install Node.js from https://nodejs.org/
   # Restart terminal after installation
   ```

2. **API key missing**
   ```bash
   # Set environment variable
   export ANTHROPIC_API_KEY="your-key"
   # Or add to .env file
   ```

3. **Agent stuck on phase**
   ```bash
   # Check logs for errors
   cat .luna-agent/logs/agent.log
   
   # Restart from current phase
   node .luna-agent/scripts/resume-agent.js
   ```

4. **Component generation failed**
   ```bash
   # Check API quota
   # Verify network connection
   # Restart agent
   pkill -f "luna-design-agent"
   node luna-agent-bootstrap.js
   ```

### Recovery Procedures

```bash
# Full agent reset
rm -rf .luna-agent
node luna-agent-bootstrap.js

# Component regeneration
rm -rf src/components/luna-ui
node .luna-agent/luna-design-agent.js

# Environment reset
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

### Build for Production
```bash
# Build the application
npm run build

# Test production build
npm start
```

### Deploy to Platform
```bash
# Netlify deployment
npm run deploy:netlify

# Vercel deployment
npm run deploy:vercel

# Docker deployment
docker-compose -f docker-compose.prod.yml up -d
```

## Agent Architecture

### Autonomous Capabilities
- **Self-Management**: Monitors own progress
- **Error Recovery**: Automatic retry mechanisms
- **Continuous Learning**: Improves based on feedback
- **Quality Assurance**: Automated testing and validation

### Integration Points
- **Cursor IDE**: Direct code generation
- **GitHub Actions**: CI/CD automation
- **Storybook**: Component documentation
- **Testing Suite**: Automated validation

### Safety Features
- **Therapeutic Compliance**: Trauma-informed design
- **Accessibility First**: Universal design principles
- **Crisis Awareness**: Emergency intervention ready
- **Privacy Protection**: Data security by design

## Success Metrics

The agent tracks completion through:
- ✅ 25+ production-ready components
- ✅ Complete design system documentation
- ✅ 100% WCAG 2.2 AA+ compliance
- ✅ Therapeutic safety validation
- ✅ Automated testing suite
- ✅ Storybook integration
- ✅ Deployment readiness

## Support & Maintenance

### Agent Updates
```bash
# Update agent version
npm update @luna/autonomous-agent

# Check for updates
node .luna-agent/scripts/check-updates.js
```

### Performance Monitoring
```bash
# Monitor agent performance
node .luna-agent/monitoring.js

# View analytics
cat .luna-agent/analytics.json
```

### Backup & Recovery
```bash
# Backup agent state
tar -czf luna-agent-backup.tar.gz .luna-agent/

# Restore from backup
tar -xzf luna-agent-backup.tar.gz
```

---

**🌙 Luna Autonomous Design Agent v3.1.0**
*Self-managing AI design system for therapeutic applications* 