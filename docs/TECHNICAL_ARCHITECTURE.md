# Luna Web Technical Architecture

## System Overview

Luna Web is a full-stack AI therapy platform built with modern web technologies. The architecture follows a modular, scalable design pattern that prioritizes maintainability, performance, and user experience.

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (React/Next)  │◄──►│   (Node.js)     │◄──►│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Browser       │    │   Database      │    │   AI Services   │
│   Storage       │    │   (SQLite)      │    │   (OpenAI, etc) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend Architecture

### Technology Stack
- **Framework**: React 18 with Next.js 13
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context + Custom Hooks
- **Animations**: Framer Motion
- **3D Graphics**: React Three Fiber + Three.js
- **Real-time**: Socket.IO Client

### Component Architecture

```
src/
├── components/
│   ├── chat/                    # Chat interface components
│   │   ├── ChatGPTInput.tsx     # Message input with voice
│   │   ├── ChatMessage.tsx      # Individual message display
│   │   ├── CollapsibleSidebar.tsx # Conversation sidebar
│   │   └── ...
│   ├── personality/             # Personality system
│   │   ├── PersonalitySelector.tsx
│   │   ├── PersonalityEditor.tsx
│   │   └── PersonalityQuickSwitcher.tsx
│   ├── memory/                  # Memory system
│   │   └── MemoryInsights.tsx
│   ├── plugins/                 # Plugin system
│   │   └── PluginExecutor.tsx
│   ├── therapeutic/             # Therapeutic features
│   │   ├── AITherapistOrb.tsx
│   │   ├── FullscreenOrbMode.tsx
│   │   └── ...
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   └── visuals/                 # 3D visual components
│       ├── AIParticleOrb.tsx
│       └── NarratorOrbComponent.tsx
├── hooks/                       # Custom React hooks
│   ├── useAuth.ts
│   ├── usePersonality.ts
│   ├── usePlugins.ts
│   ├── useTeamWorkspace.ts
│   └── useSyncClient.ts
├── services/                    # Business logic services
│   ├── personalityService.ts
│   ├── memoryService.ts
│   ├── pluginService.ts
│   ├── teamWorkspaceService.ts
│   └── syncService.ts
├── pages/                       # Next.js pages
│   ├── api/                     # API routes
│   ├── enhanced-chat-interface.tsx
│   ├── personality-management.tsx
│   ├── plugin-management.tsx
│   └── ...
└── contexts/                    # React contexts
    └── AuthContext.tsx
```

### Key Frontend Patterns

#### 1. Service Layer Pattern
All business logic is abstracted into service classes:
```typescript
// Example: PersonalityService
export class PersonalityService {
  private static instance: PersonalityService;
  
  public static getInstance(): PersonalityService {
    if (!PersonalityService.instance) {
      PersonalityService.instance = new PersonalityService();
    }
    return PersonalityService.instance;
  }
  
  async createPersonality(data: PersonalityConfig): Promise<PersonalityConfig> {
    // Implementation
  }
}
```

#### 2. Custom Hook Pattern
State management through custom hooks:
```typescript
export const usePersonality = () => {
  const [personalities, setPersonalities] = useState<PersonalityConfig[]>([]);
  const [activePersonality, setActivePersonality] = useState<PersonalityConfig | null>(null);
  
  // Actions
  const createPersonality = useCallback(async (data) => {
    // Implementation
  }, []);
  
  return {
    personalities,
    activePersonality,
    createPersonality,
    // ... other actions
  };
};
```

#### 3. Component Composition
Modular component design with clear separation of concerns:
```typescript
// Main chat interface composes multiple components
<EnhancedChatInterface>
  <CollapsibleSidebar />
  <ChatContent>
    <PersonalityQuickSwitcher />
    <ChatMessages />
    <PluginExecutor />
  </ChatContent>
</EnhancedChatInterface>
```

## Backend Architecture

### Technology Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT tokens
- **Real-time**: Socket.IO
- **File Handling**: Multer

### API Architecture

```
src/pages/api/
├── auth/                        # Authentication endpoints
│   ├── login.ts
│   ├── register.ts
│   └── verify.ts
├── chat/                        # Chat management
│   ├── save-history.ts
│   ├── get-histories.ts
│   ├── share.ts
│   └── generate-title.ts
├── personalities/               # Personality system
│   ├── index.ts
│   └── [id].ts
├── memory/                      # Memory system
│   ├── index.ts
│   └── insights.ts
├── plugins/                     # Plugin system
│   ├── index.ts
│   ├── [id].ts
│   ├── [id]/actions.ts
│   └── actions/[id]/execute.ts
├── teams/                       # Team management
│   ├── index.ts
│   ├── [id].ts
│   ├── [id]/invite.ts
│   └── invitations/accept.ts
├── workspaces/                  # Workspace management
│   ├── index.ts
│   ├── [id].ts
│   └── [id]/conversations.ts
└── sync/                        # Real-time sync
    └── websocket.ts
```

### Database Schema

#### Core Models
```prisma
model User {
  id                    String    @id @default(cuid())
  email                 String    @unique
  name                  String?
  // Relations
  conversations         ChatSession[]
  personalities         PersonalityProfile[]
  memories              Memory[]
  teams                 TeamMember[]
  workspaces            WorkspaceMember[]
  pluginExecutions      PluginExecution[]
}

model ChatSession {
  id                    String    @id @default(cuid())
  title                 String
  userId                String
  workspaceId           String?
  // Relations
  user                  User      @relation(fields: [userId], references: [id])
  workspace             Workspace? @relation(fields: [workspaceId], references: [id])
  messages              ChatMessage[]
  pluginExecutions      PluginExecution[] @relation("ConversationPluginExecutions")
}
```

#### Therapeutic Models
```prisma
model PersonalityProfile {
  id                    String    @id @default(cuid())
  name                  String
  description           String?
  coreInstructions      String
  safetyProtocols       String
  therapeuticTechniques String
  // Relations
  user                  User      @relation(fields: [userId], references: [id])
  usage                 PersonalityUsage[]
}

model Memory {
  id                    String    @id @default(cuid())
  userId                String
  conversationId        String
  type                  String
  content               String
  importance            Int       @default(5)
  emotionalValence      Int       @default(0)
  tags                  String    // JSON array
  metadata              String    // JSON object
  // Relations
  user                  User      @relation(fields: [userId], references: [id])
}
```

#### Collaboration Models
```prisma
model Team {
  id                    String    @id @default(cuid())
  name                  String
  description           String?
  isPublic              Boolean   @default(false)
  // Relations
  members               TeamMember[]
  workspaces            Workspace[]
  invitations           TeamInvitation[]
}

model Workspace {
  id                    String    @id @default(cuid())
  name                  String
  description           String?
  isPublic              Boolean   @default(false)
  teamId                String?
  ownerId               String
  // Relations
  team                  Team?     @relation(fields: [teamId], references: [id])
  owner                 User      @relation("WorkspaceOwner", fields: [ownerId], references: [id])
  members               WorkspaceMember[]
  conversations         ChatSession[]
}
```

#### Plugin System Models
```prisma
model Plugin {
  id                    String    @id @default(cuid())
  name                  String    @unique
  displayName           String
  description           String?
  version               String    @default("1.0.0")
  isEnabled             Boolean   @default(true)
  isSystem              Boolean   @default(false)
  config                String?   // JSON configuration
  // Relations
  actions               PluginAction[]
  usage                 PluginUsage[]
}

model PluginAction {
  id                    String    @id @default(cuid())
  pluginId              String
  name                  String
  displayName           String
  endpoint              String
  method                String
  parameters            String?   // JSON schema
  headers               String?   // JSON object
  authType              String
  // Relations
  plugin                Plugin    @relation(fields: [pluginId], references: [id])
  executions            PluginExecution[]
}
```

### Real-time Architecture

#### WebSocket Implementation
```typescript
// Socket.IO server setup
const io = new Server(res.socket.server, {
  path: '/api/sync/websocket',
  addTrailingSlash: false,
});

// Event handling
io.on('connection', (socket) => {
  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId);
  });
  
  socket.on('sync-event', async (data) => {
    // Process sync event
    const result = await syncService.processSyncEvent(data);
    
    // Broadcast to other clients
    socket.to(data.conversationId).emit('sync-update', result);
  });
});
```

## Security Architecture

### Authentication Flow
1. **Login**: User credentials → JWT token generation
2. **Token Validation**: Middleware validates JWT on each request
3. **Session Management**: Tokens stored in secure HTTP-only cookies
4. **Authorization**: Role-based access control for team/workspace features

### Data Protection
- **Encryption**: Sensitive data encrypted at rest
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **XSS Prevention**: Content Security Policy headers
- **CSRF Protection**: Token-based CSRF protection

## Performance Architecture

### Frontend Optimization
- **Code Splitting**: Dynamic imports for route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo and useMemo for expensive operations
- **Virtual Scrolling**: For large message lists
- **Image Optimization**: Next.js Image component with WebP support

### Backend Optimization
- **Database Indexing**: Strategic indexes on frequently queried fields
- **Query Optimization**: Efficient Prisma queries with proper includes
- **Caching**: Redis for session and frequently accessed data
- **Connection Pooling**: Database connection management
- **Rate Limiting**: API rate limiting to prevent abuse

### Real-time Performance
- **WebSocket Optimization**: Efficient event handling and broadcasting
- **Message Queuing**: Redis for handling high-volume sync events
- **Connection Management**: Proper socket cleanup and reconnection logic

## Scalability Considerations

### Horizontal Scaling
- **Stateless Design**: API routes are stateless for easy scaling
- **Database Sharding**: Prepared for future database sharding
- **Load Balancing**: Ready for load balancer integration
- **Microservices**: Modular design allows service extraction

### Vertical Scaling
- **Memory Management**: Efficient memory usage in React components
- **Database Optimization**: Query optimization and indexing
- **Asset Optimization**: Compressed and optimized static assets

## Monitoring & Observability

### Logging Strategy
- **Structured Logging**: JSON-formatted logs for easy parsing
- **Error Tracking**: Comprehensive error logging with stack traces
- **Performance Monitoring**: Response time and throughput tracking
- **User Analytics**: Anonymous usage analytics for feature optimization

### Health Checks
- **API Health**: `/api/health` endpoint for monitoring
- **Database Health**: Connection and query performance monitoring
- **External Services**: AI service availability monitoring

## Deployment Architecture

### Development Environment
- **Local Development**: `npm run dev` with hot reloading
- **Database**: Local SQLite for development
- **Environment Variables**: `.env.local` for configuration

### Production Environment
- **Containerization**: Docker support for consistent deployment
- **Environment Management**: Environment-specific configurations
- **Database Migration**: Automated Prisma migrations
- **Static Asset Optimization**: Next.js production build optimization

## Future Architecture Considerations

### Planned Enhancements
1. **Microservices Migration**: Extract services into separate microservices
2. **GraphQL API**: Consider GraphQL for more flexible data fetching
3. **Event Sourcing**: Implement event sourcing for audit trails
4. **Machine Learning Pipeline**: Dedicated ML service for advanced features
5. **Mobile API**: RESTful API optimized for mobile applications

### Technical Debt
1. **TypeScript Strict Mode**: Complete strict mode compliance
2. **Test Coverage**: Comprehensive unit and integration tests
3. **Documentation**: API documentation with OpenAPI/Swagger
4. **Performance Testing**: Load testing and performance benchmarks

---

*This technical architecture document provides a comprehensive overview of the Luna Web system design, implementation patterns, and scalability considerations. The modular design ensures the platform can evolve and adapt to future requirements while maintaining performance and reliability.*


