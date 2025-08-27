# Quinn Log (Maintainer Agent)

All entries must be appended only. DO NOT overwrite.

## Entry - 2025-08-18

### 1. Authentication Architecture Design

**Objective:** Design a user system that supports multi-device sync, memory persistence, team workspace sharing, and secure user identification for memory storage.

**Design Considerations:**

*   **Secure User Identification:** Use industry-standard OAuth 2.0/OpenID Connect for social logins (Google, GitHub) and a robust email/password system with secure password hashing (e.g., bcrypt or Argon2). JWTs (JSON Web Tokens) will be issued upon successful authentication for stateless session management. The JWT payload will contain the user's unique ID and potentially their role/workspace memberships for efficient access control checks on the server-side.
*   **Multi-Device Sync:** JWTs stored in `HttpOnly`, `Secure` cookies (for web clients) or secure storage (mobile/desktop) will manage sessions. A refresh token mechanism will be implemented to obtain new access tokens without re-authentication, ensuring long-lived sessions across devices. A centralized session store (e.g., Redis) can be used to track active sessions, allowing for features like "Sign out everywhere" or revoking specific sessions.
*   **Memory Persistence:** User identity (derived from the JWT) will be the primary key for associating memories with a user. Memories will be stored in a database with a `user_id` foreign key. This ensures that memories are tied to the authenticated user and persist across sessions and devices.
*   **Team Workspace Sharing:** Introduce a `workspace` or `team` entity in the database. Users will belong to workspaces. A `workspace_members` join table will define user roles (e.g., owner, member, admin) within a workspace. Memories can then have an optional `workspace_id` foreign key. Access control logic will check if the authenticated user belongs to the workspace associated with a memory. A separate `workspace_invitations` table can manage the process of adding users to workspaces.

**Proposed Components:**

*   **User Model:** `id` (UUID), `email` (unique), `hashed_password`, `created_at`, `updated_at`.
*   **Workspace Model:** `id` (UUID), `name`, `created_by_user_id` (FK), `created_at`, `updated_at`.
*   **WorkspaceMember Model:** `id` (UUID), `workspace_id` (FK), `user_id` (FK), `role` (enum: owner, admin, member), `joined_at`.
*   **Session Management:** JWTs for access, refresh tokens stored securely server-side (e.g., in Redis with a unique identifier linked to the user/device). Optional server-side session invalidation.
*   **Authentication Middleware:** A middleware function that intercepts requests to protected routes. It will verify the JWT signature, check its expiration, and potentially decode user information (like `user_id`) to attach to the request object for downstream use. It will also handle refreshing access tokens using refresh tokens.

---

### 2. Database Schema Review

**Current Memory Model Analysis:**

Based on `src/memory/types/memory.types.ts` and the Prisma schema, the current `Memory` model has the following structure:
```prisma
model Memory {
  id         String   @id @default(cuid())
  userId     String
  key        String
  value      String
  chatId     String?
  category   String   // MemoryCategory enum as string
  confidence Float    @default(0.8)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([userId])
  @@index([userId, category])
  @@index([userId, key])
}
```

**Migration Strategy for Existing Luna Data:**

1.  **Backup:** Always start with a full backup of the existing database.
2.  **Schema Changes:** If introducing new fields like `workspaceId` for team sharing, these would be added as optional fields initially (`workspaceId String?`).
3.  **Data Migration Script:** A script would be written to populate the new `userId` field for existing memories. If user identification was previously implicit or tied to a session, this might require mapping old data to a default user or prompting users to claim their memories. For `workspaceId`, it would initially be `NULL` for all existing memories.
4.  **Backward Compatibility:** Ensure the application logic can handle memories with `NULL` `workspaceId` values, treating them as private to the user.
5.  **Testing:** Thoroughly test the migration script on a copy of the production data before running it on the live database.
6.  **Rollback Plan:** Have a plan to revert the schema and data changes if critical issues arise.

**User Table Relationships:**

The `User` model in `prisma/schema.prisma` is already quite extensive. For the memory system, the relationship is straightforward:
*   `Memory.userId` is a foreign key referencing `User.id`.
*   If implementing workspaces:
    *   `Memory.workspaceId` would be a foreign key referencing a new `Workspace.id`.
    *   A new `WorkspaceMember` model would link `User.id` to `Workspace.id` with a `role` attribute.

**Performance Indexes for Memory Queries:**

The current schema already includes good indexes for common query patterns:
*   `@@index([userId])`: Efficient retrieval of all memories for a specific user.
*   `@@index([userId, category])`: Efficient filtering of memories by user and category.
*   `@@index([userId, key])`: Efficient lookup of a specific memory key for a user.
If `workspaceId` is added, indexes like `@@index([workspaceId])` and `@@index([workspaceId, category])` would be beneficial for workspace-level queries.

---

### 3. API Architecture Planning

**/api/memory/* Routes:**

Based on the `Memory` interface and common CRUD operations, the following routes are proposed:

*   **`POST /api/memory`**
    *   **Description:** Create a new memory for the authenticated user.
    *   **Request Body:** `Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>` (i.e., `userId` will be derived from the authenticated user).
    *   **Response:** `Memory` (the created memory object with `id`, `createdAt`, `updatedAt`).
    *   **Authentication:** Required (uses `authMiddleware`).

*   **`GET /api/memory`**
    *   **Description:** Retrieve a list of memories for the authenticated user, with optional filtering.
    *   **Query Parameters:**
        *   `categories` (optional): Comma-separated list of `MemoryCategory` values.
        *   `searchTerm` (optional): A term to search within `key` and `value`.
        *   `limit` (optional): Maximum number of memories to return.
        *   `confidence` (optional): Minimum confidence threshold.
    *   **Response:** `Memory[]`.
    *   **Authentication:** Required.

*   **`GET /api/memory/:id`**
    *   **Description:** Retrieve a specific memory by its ID for the authenticated user.
    *   **Path Parameter:** `id` (the memory's unique identifier).
    *   **Response:** `Memory`.
    *   **Authentication:** Required. Access control check to ensure the memory belongs to the user (or the user's workspace if applicable).

*   **`PUT /api/memory/:id`**
    *   **Description:** Update an existing memory by its ID for the authenticated user.
    *   **Path Parameter:** `id`.
    *   **Request Body:** `MemoryUpdate` (fields that can be updated: `value`, `confidence`, `category`).
    *   **Response:** `Memory` (the updated memory object).
    *   **Authentication:** Required. Access control check.

*   **`DELETE /api/memory/:id`**
    *   **Description:** Delete a specific memory by its ID for the authenticated user.
    *   **Path Parameter:** `id`.
    *   **Response:** `{ message: "Memory deleted successfully" }`.
    *   **Authentication:** Required. Access control check.

*   **`POST /api/memory/extract`**
    *   **Description:** Extract memories from a text input.
    *   **Request Body:** `MemoryExtraction` (`text` to analyze, optional `chatId`).
    *   **Response:** `MemoryExtraction` (with `extractedMemories` and overall `confidence`).
    *   **Authentication:** Required (to associate extracted memories with the user if saved).

**/api/voice WebSocket Architecture:**

The current `src/pages/api/voice.ts` implements a solid foundation for voice interaction with OpenAI Realtime. The architecture is event-driven, with the server acting as a proxy between the client (voice orb) and OpenAI.

*   **Current Flow:**
    1. Client connects to `/api/voice` WebSocket endpoint.
    2. Client sends `session_init` with user details and preferences.
    3. Server initializes a WebSocket connection to OpenAI Realtime API.
    4. Server configures the OpenAI session.
    5. Client sends `audio_input` events (base64 PCM16 audio data).
    6. Server forwards audio to OpenAI.
    7. Server receives events and audio from OpenAI and forwards them to the client (`realtime_event`, `audio_data`).
    8. Client can send `realtime_command` events directly to OpenAI via the server.
    9. Client or server can send `audio_commit` or `generate_response` commands.

*   **Considerations for Enhancement:**
    *   **Authentication:** The `session_init` event currently accepts a `user_id`. This should be validated using the existing JWT-based authentication. The server should verify the token and ensure the provided `user_id` matches the authenticated user, or derive the `user_id` directly from the token.
    *   **Memory Integration:** The extracted text from voice interactions (via OpenAI's transcription) can be automatically processed to extract and store memories. This would involve calling the `/api/memory/extract` endpoint or directly invoking the memory extraction service within the voice handler.
    *   **Error Handling:** Ensure robust error handling for WebSocket disconnections, OpenAI API errors, and authentication failures.

**Authentication Middleware Integration:**

The project already has a well-defined authentication middleware (`src/middleware/auth-middleware.ts`) and service (`src/services/authService.ts`).

*   **For REST API Routes (`/api/memory`):**
    *   Apply `authMiddleware` to all routes to protect them.
    *   Example:
        ```typescript
        // /src/pages/api/memory/index.ts
        import { authMiddleware, AuthenticatedRequest } from '../../../middleware/auth-middleware';
        // ... other imports

        const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
          // req.user.userId is now available
          const userId = req.user?.userId;
          // ... route logic
        };

        export default authMiddleware(handler);
        ```

*   **For WebSocket (`/api/voice`):**
    *   Modify the `session_init` event handler to require a JWT token.
    *   The client would need to send the token as part of the `session_init` data or in a custom header (if supported by the WebSocket library).
    *   Use `verifyToken` from `authService` to validate the token and extract the `userId`.
    *   Associate the `userId` with the session in `activeSessions`.

---

## Entry - 2025-08-18 (TypeScript Health Check)

### TypeScript Scan Results

- **Initial Errors:** 50+ TypeScript errors were identified.
- **Fixed Issues:**
  1. Added missing `useCallback` import in `LunaSidebar.tsx`.
  2. Resolved duplicate `onError` declarations in `audioProcessor.ts`.
  3. Resolved duplicate `setVoicePersonality` declarations in `useVoiceMode.ts`.
  4. Fixed unclosed `motion.button` tag in `MultiModalInput.tsx`.
- **Remaining Issues:** There are still numerous TypeScript errors, including type mismatches, missing modules, export/import issues, and implicit any/unknown types. A detailed report is available in `TS_SCAN_REPORT.md`.

### Next Steps

1. Continue addressing the remaining TypeScript errors, prioritizing type mismatches and missing modules.
2. Investigate missing modules like `pdfjs-dist/build/pdf` and `socket.io-client`.
3. Work on resolving export/import issues in the voice components.
4. Address implicit any/unknown types by adding explicit type annotations.

This is an ongoing process as new code is added to the codebase.