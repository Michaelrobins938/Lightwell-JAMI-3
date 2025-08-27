# 🚀 Luna AI Therapist Chatbot - Final Implementation Plan

## 📋 Team Delegation & Execution Orders

---

## 👑 **QUINN (Organizer) - DELEGATION PROMPT**

**Role**: Project coordinator, architecture decisions, and integration oversight

**Your Priority Tasks:**
```
□ Review and approve all architectural decisions
□ Coordinate between Claude (Builder) and Gemini (Polish/UX)
□ Ensure memory system integration points are properly planned
□ Review API contracts between frontend/backend components
□ Manage authentication and user system architecture
□ Oversee database schema changes and migrations
□ Final testing and integration approval
```

**Quinn's Specific Instructions:**
1. **First Priority**: Create the authentication system architecture (needed for memory, sync, teams)
2. **Second Priority**: Review and approve the memory system folder structure that Claude will build
3. **Third Priority**: Design the WebSocket architecture for voice mode
4. **Final Priority**: Integration testing of all voice mode components

---

## 🔨 **CLAUDE (Builder Agent) - EXECUTION PROMPT**

**Role**: Core feature implementation, new systems, backend integration

**CRITICAL FIRST TASK - MEMORY SYSTEM SETUP:**

**Step 1: Create Memory System Foundation**
```bash
# Create the memory folder structure in your Luna project:
mkdir -p src/memory
mkdir -p src/memory/hooks
mkdir -p src/memory/components
mkdir -p src/memory/services
mkdir -p src/memory/types
```

**Memory System Files to Create:**
```
src/memory/
├── types/
│   ├── memory.types.ts       # Memory interfaces and schemas
│   └── index.ts
├── services/
│   ├── memoryService.ts      # API calls for memory CRUD
│   ├── memoryProcessor.ts    # Extract facts from conversations
│   └── index.ts
├── hooks/
│   ├── useMemory.ts          # React hook for memory management
│   ├── useMemorySync.ts      # Sync memory across chats
│   └── index.ts
├── components/
│   ├── MemoryViewer.tsx      # Timeline view of memories
│   ├── MemoryEditor.tsx      # Edit/delete memories
│   └── index.ts
└── index.ts                  # Export all memory functionality
```

**Your Core Implementation Tasks:**
1. ✅ **Memory System** (Tasks #1, #17) - BUILD FIRST
2. ✅ **Voice Mode Integration** (Tasks #20-25) - Core backend systems
3. ✅ **Streaming & Real-time** (Tasks #2, #21, #22) - Token streaming, orb animations
4. ✅ **Multi-modal Input** (Tasks #3, #4) - File uploads, image+text input
5. ✅ **Backend APIs** (Tasks #8, #14, #25) - Title generation, usage tracking, voice WebSocket

**Code Implementation Priority:**
```typescript
// 1. Memory System Schema (Prisma)
model Memory {
  id        String   @id @default(cuid())
  userId    String
  key       String   // "preferences", "context", "facts"
  value     String
  chatId    String?  // optional link to conversation
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// 2. Voice WebSocket Backend
// 3. Streaming token system
// 4. File upload handlers
// 5. Multi-modal LLM integration
```

---

## 💎 **GEMINI (UX/Polish Agent) - REFINEMENT PROMPT**

**Role**: UI/UX polish, animations, micro-interactions, visual perfection

**Your Specialization Tasks:**
1. ✅ **Polish & Animations** (Tasks #26, #27) - Skeleton loaders, streaming avatars
2. ✅ **User Experience** (Tasks #9, #11-13) - Resizable sidebar, message actions, shortcuts
3. ✅ **Visual Systems** (Tasks #6, #7, #12) - Thread branching UI, export dialogs, sharing
4. ✅ **Voice Mode UX** (Tasks #21, #23) - Orb animations, camera/screen switching UI

**Specific Animation Requirements:**
```css
/* Orb Animation Specs */
.voice-orb {
  transition: all 120ms ease-out;
  /* Breathing: 1200ms loop */
  /* Volume reactive: real-time scale */
  /* Gradient shift: 800ms */
}

/* Skeleton Loader Specs */
.skeleton-message {
  animation: shimmer 1200ms linear infinite;
  /* Fade-in: 150ms opacity + slide */
}

/* Sidebar Resize */
.sidebar-resize {
  transition: width 200ms ease-in-out;
  /* Min: 180px, Max: 400px */
}
```

---

## 🔧 **BACKEND SPECIALIST - INFRASTRUCTURE PROMPT**

**Role**: Server setup, WebSocket implementation, API optimization

**Your Tasks:**
1. ✅ **Voice WebSocket Server** (Task #25) - OpenAI Realtime proxy
2. ✅ **Authentication System** - Multi-device sync support
3. ✅ **Database Optimization** - Efficient memory and chat queries
4. ✅ **API Performance** - Token streaming, file uploads

**WebSocket Implementation:**
```javascript
// Voice mode endpoint: ws://localhost:3000/api/voice
// Events: session_init, audio chunks, transcript, TTS
// Integration: OpenAI Realtime API proxy
```

---

## 🧪 **QA/TESTING SPECIALIST - VALIDATION PROMPT**

**Role**: Testing all implementations, integration validation

**Your Testing Checklist:**
```
□ Memory system persists across browser refreshes
□ Voice mode transitions smoothly (input bar ↔ orb)
□ Real-time transcript accuracy during voice input
□ Token streaming displays correctly
□ File uploads work with drag-and-drop
□ Multi-modal input (text + image) processes correctly
□ Message editing creates proper thread branches
□ Export functions generate valid JSON/Markdown/PDF
□ Keyboard shortcuts work in all contexts
□ Resizable sidebar maintains width across sessions
□ Shared links display read-only conversations correctly
□ Cross-device sync maintains conversation history
□ Plugin system can execute external API calls
□ Team workspace sharing functions properly
```

---

## 📐 **EXECUTION ORDER & DEPENDENCIES**

### Phase 1: Foundation (Week 1)
1. **Quinn**: Authentication architecture + database design
2. **Claude**: Memory system implementation
3. **Backend**: Basic WebSocket server setup

### Phase 2: Core Features (Week 2)
1. **Claude**: Voice mode integration + streaming systems
2. **Gemini**: Basic UI polish + sidebar improvements
3. **Backend**: OpenAI Realtime integration

### Phase 3: Advanced Features (Week 3)
1. **Claude**: Multi-modal input + thread branching
2. **Gemini**: Advanced animations + micro-interactions
3. **Backend**: Performance optimization

### Phase 4: Final Polish (Week 4)
1. **Gemini**: Pixel-perfect ChatGPT parity
2. **QA**: Comprehensive testing
3. **Quinn**: Final integration review

---

## 🎯 **SUCCESS CRITERIA**

**Luna will be complete when:**
- ✅ Voice mode matches ChatGPT's orb behavior exactly
- ✅ Memory system remembers user preferences across chats
- ✅ Streaming feels as smooth as ChatGPT
- ✅ All 27 todo items are implemented and tested
- ✅ Multi-device sync works flawlessly
- ✅ Voice + screen share integration functions properly

---

**PRIORITY EXECUTION: Start with Claude building the memory system, then move to voice integration. All other features build on these foundations.**