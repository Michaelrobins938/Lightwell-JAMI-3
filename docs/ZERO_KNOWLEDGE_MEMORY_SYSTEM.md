# Zero-Knowledge Memory System for Luna AI Therapist

## Overview

The Zero-Knowledge Memory System implements a secure, privacy-first approach to maintaining therapeutic continuity across sessions. It functions like a therapist's notebook that's kept under lock and key, only accessible when the patient is in the room.

## Core Principles

### 1. Client-Owned Storage
- **Encrypted Storage**: All memory data is encrypted with user-specific keys
- **Zero-Knowledge Guarantee**: The host system cannot read user's saved notes
- **User Control**: Only the AI + user in session can decrypt memories

### 2. Consent Gating
- **Explicit Consent**: Nothing gets saved without clear opt-in patterns
- **Granular Control**: Users can approve, reject, or modify each memory proposal
- **Transparent Process**: Clear explanations of what's being remembered and why

### 3. Therapeutic Context
- **Stable Identity**: Name, pronouns, recurring relationships, important life facts
- **Therapeutic Themes**: Repeated struggles, goals, triggers, coping strategies
- **Session Continuity**: What was last discussed, progress tracking
- **Meta-Preferences**: User's communication style, preferences, boundaries

## What Gets Retained

### ✅ Appropriate for Memory
- **Stable Identity**: "My name is Sarah, I use she/her pronouns"
- **Therapeutic Goals**: "Working on anxiety management through CBT"
- **Coping Strategies**: "Deep breathing helps when I'm stressed"
- **Session Continuity**: "Last session we discussed workplace boundaries"
- **Communication Preferences**: "I prefer direct, actionable advice"
- **Recurring Themes**: "Anxiety around deadlines is a frequent topic"

### ❌ NOT Retained (Unless Explicitly Requested)
- **Raw Chat Logs**: Full conversation transcripts
- **Moment-to-Moment Venting**: Emotional outbursts, temporary states
- **Sensitive Ephemeral Disclosures**: Temporary thoughts, passing concerns
- **Personal Details**: Addresses, phone numbers, specific dates
- **Third-Party Information**: Information about others without consent

## Memory Types

### 1. Stable Identity
```typescript
type: 'stable_identity'
content: "User's name is Sarah, prefers she/her pronouns"
importance: 9
retention: 'permanent'
```

### 2. Therapeutic Themes
```typescript
type: 'therapeutic_theme'
content: "Anxiety around work deadlines, triggers panic attacks"
importance: 8
retention: 'therapeutic'
```

### 3. Session Continuity
```typescript
type: 'session_continuity'
content: "Last session focused on boundary setting with coworkers"
importance: 7
retention: 'therapeutic'
```

### 4. Coping Strategies
```typescript
type: 'coping_strategy'
content: "Box breathing technique helps during anxiety attacks"
importance: 8
retention: 'therapeutic'
```

### 5. Crisis History
```typescript
type: 'crisis_history'
content: "Previous suicide attempt in 2022, requires immediate escalation"
importance: 10
retention: 'crisis'
```

## Consent Levels

### Explicit Consent
- User directly asks: "Remember that I'm allergic to peanuts"
- High-importance memories (importance ≥ 8)
- Permanent retention requests
- **Always requires user approval**

### Therapeutic Consent
- Standard therapy notes for continuity
- Recurring themes and patterns
- Coping strategies and progress
- **Auto-approved unless user opts out**

### Crisis Consent
- Safety-related information
- Risk assessment data
- Emergency contact information
- **Auto-approved for safety**

### Inferred Consent
- Communication preferences
- Session patterns
- General therapeutic context
- **Requires approval if high importance**

## Retention Policies

### Session-Only
- Temporary context for current session
- Deleted when session ends
- **Use case**: Current mood, immediate concerns

### Temporary (30 days)
- Short-term memory for recent sessions
- Automatic cleanup after 30 days
- **Use case**: Recent stressors, temporary situations

### Therapeutic (2 years)
- Standard therapy note retention
- HIPAA-compliant timeframe
- **Use case**: Goals, progress, coping strategies

### Crisis (7 years)
- Extended retention for safety records
- Required for legal/clinical compliance
- **Use case**: Crisis events, risk assessments

### Permanent (Until Deleted)
- User-requested permanent storage
- Only for explicit user requests
- **Use case**: Important life facts, preferences

## Implementation Architecture

### 1. Memory Extraction Service
```typescript
// Analyzes conversations for potential memories
const extractionResult = await memoryExtractionService.extractMemories({
  userId: 'user123',
  conversationId: 'conv456',
  messages: [...],
  sessionStartTime: new Date()
});
```

### 2. Secure Memory Service
```typescript
// Handles encrypted storage and retrieval
const result = await secureMemoryService.proposeMemory(
  userId,
  memoryProposal,
  userEncryptionKey
);
```

### 3. Consent Manager Component
```typescript
// UI for user approval/rejection
<ConsentManager
  proposals={extractionResult.proposals}
  onApprove={handleApprove}
  onReject={handleReject}
  onModify={handleModify}
/>
```

## API Endpoints

### Extract Memories
```http
POST /api/memory/secure
{
  "action": "extract",
  "conversationId": "conv123",
  "messages": [...],
  "sessionStartTime": "2024-01-15T10:00:00Z"
}
```

### Propose Memory
```http
POST /api/memory/secure
{
  "action": "propose",
  "proposal": {
    "type": "therapeutic_theme",
    "content": "User experiences anxiety around deadlines",
    "importance": 8,
    "consentLevel": "therapeutic"
  },
  "userEncryptionKey": "base64-encoded-key"
}
```

### Retrieve Memories
```http
GET /api/memory/secure?action=retrieve&type=therapeutic_theme&userEncryptionKey=...
```

## Security Features

### Encryption
- **AES-256-GCM** encryption for all memory data
- **User-specific keys** derived from user credentials
- **Zero-knowledge architecture** - system cannot decrypt user data

### Authentication
- **JWT-based authentication** for all API calls
- **User-specific encryption keys** for data isolation
- **Session-based key management**

### Audit Logging
- **All memory operations** logged for compliance
- **No content logging** - only metadata and operations
- **HIPAA-compliant audit trails**

## Usage Examples

### 1. Automatic Memory Extraction
```typescript
// After each user message, extract potential memories
const context = {
  userId: 'user123',
  conversationId: 'conv456',
  messages: conversationHistory,
  sessionStartTime: sessionStart
};

const extraction = await memoryExtractionService.extractMemories(context);

// Show consent manager if proposals require approval
if (extraction.proposals.some(p => p.requiresConsent)) {
  setShowConsentManager(true);
  setMemoryProposals(extraction.proposals);
}
```

### 2. Session Continuity
```typescript
// At session start, retrieve relevant memories
const continuity = await secureMemoryService.getSessionContinuity(
  userId,
  userEncryptionKey
);

// Use for session context
const sessionContext = `
Last session topics: ${continuity.lastTopics.join(', ')}
Current goals: ${continuity.currentGoals.join(', ')}
Recent progress: ${continuity.recentProgress.join(', ')}
Active triggers: ${continuity.activeTriggers.join(', ')}
`;
```

### 3. Memory Management
```typescript
// User can view and manage their memories
const memories = await secureMemoryService.retrieveMemories({
  userId,
  type: 'therapeutic_theme',
  importance: 7
}, userEncryptionKey);

// User can update or archive memories
await secureMemoryService.updateMemory(memoryId, {
  content: 'Updated content',
  importance: 9
}, userEncryptionKey);

await secureMemoryService.archiveMemory(memoryId);
```

## Privacy Benefits

### 1. Zero-Knowledge Architecture
- **No plaintext access** by the system
- **User-controlled encryption** keys
- **Client-side decryption** only

### 2. Granular Consent
- **Per-memory approval** process
- **Clear explanations** of what's being stored
- **User modification** capabilities

### 3. Retention Control
- **Flexible retention policies** based on content type
- **Automatic cleanup** for temporary data
- **User-initiated deletion** for permanent data

### 4. Compliance
- **HIPAA-compliant** data handling
- **Audit trails** for all operations
- **Data minimization** principles

## Best Practices

### 1. Memory Extraction
- **Conservative approach** - err on side of not remembering
- **Clear patterns** - only extract when confident
- **User benefit** - only remember what helps therapy

### 2. Consent Management
- **Clear explanations** - why this memory helps
- **Easy approval** - one-click for therapeutic standards
- **Granular control** - approve/reject/modify individual items

### 3. Security
- **Regular key rotation** - update encryption keys
- **Secure transmission** - HTTPS for all API calls
- **Access logging** - track all memory operations

### 4. User Experience
- **Transparent process** - show what's being remembered
- **Easy management** - simple interface for memory control
- **Clear benefits** - explain how memory improves therapy

## Future Enhancements

### 1. Advanced Extraction
- **NLP-based analysis** for better pattern recognition
- **Emotional context** detection
- **Relationship mapping** for complex dynamics

### 2. Enhanced Privacy
- **Differential privacy** for aggregated insights
- **Federated learning** for pattern recognition
- **Homomorphic encryption** for secure computation

### 3. User Control
- **Memory visualization** - see what's remembered
- **Bulk operations** - approve/reject multiple items
- **Export capabilities** - download memory data

### 4. Integration
- **Calendar integration** - session scheduling
- **Progress tracking** - therapeutic milestones
- **Crisis protocols** - emergency contact integration

This zero-knowledge memory system ensures that Luna AI maintains the therapeutic benefits of memory while respecting user privacy and maintaining the highest standards of data protection.
