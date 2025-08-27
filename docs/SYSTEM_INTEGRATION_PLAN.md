# System Integration Plan

## Overview

This document outlines the integration blueprint for the Luna Web application, tying together the Authentication flow, Database schema, API endpoints, and Frontend consumers. This plan serves as a stable specification for Builder (Claude) and Research (Gemini) agents to build against.

## 1. Authentication Flow Integration

### 1.1. User Authentication & Session Management

*   **Login/Registration:**
    *   Users authenticate via `/api/auth/login` or `/api/auth/register`.
    *   Upon successful authentication, a JWT token is issued.
    *   The JWT contains the user's unique `userId`.
*   **Session Persistence:**
    *   The JWT is stored securely on the client (e.g., `HttpOnly` cookie for web).
    *   The token is sent in the `Authorization: Bearer <token>` header for all protected API requests.
*   **Middleware Verification:**
    *   `authMiddleware` intercepts requests to protected routes (`/api/memory/*`, `/api/user/profile`, etc.).
    *   It verifies the JWT's signature and expiration.
    *   It decodes the `userId` and attaches it to the request object (`req.user.userId`).
    *   If verification fails, a 401 error is returned.

### 1.2. WebSocket Authentication (Voice Mode)

*   **Session Initialization:**
    *   When a client connects to the `/api/voice` WebSocket, it must provide the JWT token.
    *   This can be done by sending the token as part of the `session_init` event payload or through a custom handshake mechanism if supported by the WebSocket library.
*   **Server-Side Verification:**
    *   The server receives the token during the `session_init` event.
    *   It uses `verifyToken` from `authService` to validate the token.
    *   The `userId` is extracted and associated with the WebSocket session (`activeSessions` map).

## 2. Database Schema Integration

### 2.1. Core Models and Relationships

*   **User Model (`User`):**
    *   Central entity for authentication and authorization.
    *   `id` (String, cuid): Primary key, referenced by `Memory.userId`.
*   **Memory Model (`Memory`):**
    *   `id` (String, cuid): Unique identifier for each memory.
    *   `userId` (String): Foreign key linking the memory to a user. Enforced by application logic and database constraints.
    *   `workspaceId` (String, optional): Foreign key for team/workspace sharing (to be implemented).
    *   `key` (String): A unique key within a user's scope (e.g., "last_therapy_topic").
    *   `value` (String): The stored information.
    *   `category` (String): Categorizes the memory (e.g., "preferences", "facts").
    *   `confidence` (Float): A measure of the reliability of the memory.
    *   `chatId` (String, optional): Links the memory to a specific conversation.
*   **Indexes:**
    *   `@@index([userId])`: For fetching all memories of a user.
    *   `@@index([userId, category])`: For filtering memories by user and category.
    *   `@@index([userId, key])`: For quickly finding a memory by its key for a user.

### 2.2. Data Flow

1.  **User Action (e.g., Chat):** A user interacts with the system (chat, voice input).
2.  **Memory Extraction:** Services (e.g., NLP processors) analyze the interaction and propose new memories or updates.
3.  **API Call:** The frontend or a background service calls a `/api/memory` endpoint (e.g., `POST /api/memory`).
4.  **Authentication Check:** `authMiddleware` verifies the user's token and attaches `userId`.
5.  **Database Operation:** The API handler uses `userId` to create, read, update, or delete records in the `Memory` table via Prisma.
6.  **Response:** The updated data or confirmation is sent back to the client.

## 3. API Endpoint Integration

### 3.1. Protected Memory API (`/api/memory`)

All routes under `/api/memory` are protected by `authMiddleware`.

*   **`POST /api/memory`**
    *   **Frontend Consumer:** Memory creation UI, background extraction services.
    *   **Integration:** Receives memory data from the request body. Uses `req.user.userId` to set the `userId` field in the database record.
*   **`GET /api/memory[/:id]`**
    *   **Frontend Consumer:** Memory viewer, context provider for AI.
    *   **Integration:** Fetches memories for `req.user.userId`. For `GET /api/memory/:id`, an additional check ensures the memory belongs to the user.
*   **`PUT /api/memory/:id`**
    *   **Frontend Consumer:** Memory editor UI.
    *   **Integration:** Updates a memory record, verifying that `req.user.userId` matches the record's `userId`.
*   **`DELETE /api/memory/:id`**
    *   **Frontend Consumer:** Memory management UI.
    *   **Integration:** Deletes a memory record, verifying ownership via `userId`.
*   **`POST /api/memory/extract`**
    *   **Frontend Consumer:** AI analysis services.
    *   **Integration:** Processes text, potentially using `req.user.userId` to associate extracted memories with the user.

### 3.2. Voice API (`/api/voice`)

*   **Frontend Consumer:** Voice Orb component.
*   **Integration:**
    1.  Client establishes a WebSocket connection to `/api/voice`.
    2.  Client sends `session_init` with the JWT token.
    3.  Server verifies the token, extracts `userId`, and stores it with the session.
    4.  Server establishes a connection to OpenAI Realtime API.
    5.  Client sends `audio_input` events. Server forwards PCM data to OpenAI.
    6.  Server receives events (including transcriptions) from OpenAI and forwards them to the client.
    7.  Transcribed text can be processed by other services (e.g., sent to `/api/memory/extract`).

## 4. Frontend Consumer Integration

### 4.1. Memory Context Provider

*   A React Context (`MemoryContext` defined in `src/memory/types/memory.types.ts`) will be implemented.
*   This context will use the `/api/memory` endpoints.
*   It will provide state (`memories`, `isLoading`, `error`) and actions (`addMemory`, `updateMemory`, `searchMemories`, `extractMemoriesFromText`) to child components.
*   Components like `MemoryEditor`, `MemoryViewer`, and AI prompt builders will consume this context.

### 4.2. Voice Orb Component

*   A React component will manage the WebSocket connection to `/api/voice`.
*   It will handle sending `session_init`, `audio_input`, and receiving `realtime_event`, `audio_data`.
*   It will integrate with browser APIs for microphone access and audio playback.
*   It will display visual feedback based on the voice session state (listening, speaking, idle).

## 5. Service Map

This section provides a high-level view of key modules and their responsibilities.

| Module/Service             | Responsibility                                                                                     | Key Technologies/Files                          |
| :------------------------- | :------------------------------------------------------------------------------------------------- | :---------------------------------------------- |
| **Authentication Service** | User login, registration, JWT generation and verification.                                         | `src/services/authService.ts`, `src/middleware/auth-middleware.ts`, `/api/auth/*` |
| **Memory Service**         | Core logic for creating, reading, updating, deleting, and searching memories.                      | `src/memory/services/memoryService.ts`, `/api/memory/*` |
| **Memory Processor**       | Logic for extracting memories from text, summarizing, and determining confidence.                  | `src/memory/services/memoryProcessor.ts`        |
| **Voice Service**          | Manages the WebSocket proxy to OpenAI Realtime, handles audio streaming.                           | `/src/pages/api/voice.ts`                       |
| **Database Access (Prisma)** | ORM for interacting with the SQLite database.                                                    | `prisma/schema.prisma`, `src/lib/database.ts`   |
| **Frontend Context/State** | Provides a reactive state management layer for memory data in the UI.                               | `src/memory/types/memory.types.ts` (context interface), React Context implementation |
| **Frontend Components**    | UI elements for displaying and interacting with memories and voice features.                       | `src/memory/components/*`, Voice Orb component  |

This plan provides a clear path for integrating the designed components. Quinn will continue to evolve the architecture towards testing and deployment as outlined in the next directions.