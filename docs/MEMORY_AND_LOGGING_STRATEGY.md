# Memory and Logging Strategy

## 1. Project Memory Policy

### 1.1. What Belongs in Memory

The `/project/memory` directory (and its corresponding database table) is designed to store persistent, structured information that the AI system needs to recall across sessions and interactions for a specific user. This is distinct from transient application state or logs.

**Types of Information:**

*   **User Preferences:** Settings, communication style preferences, therapy goals, notification preferences.
    *   Example: `"preferred_therapy_style": "cbt"`, `"session_reminder_time": "09:00"`
*   **Contextual Facts:** Information about the user's current life situation, ongoing projects, relationships, or health status that is relevant for personalized interaction.
    *   Example: `"current_project": "Learning Spanish"`, `"recent_move": "Seattle, WA"`
*   **Learned Facts:** Biographical information, interests, or personal history explicitly shared by the user.
    *   Example: `"birthplace": "Tokyo, Japan"`, `"interests": ["photography", "hiking"]`
*   **Personality Insights:** Inferred or stated aspects of the user's personality, communication patterns, or emotional tendencies that help tailor the AI's responses.
    *   Example: `"communication_style": "direct"`, `"emotional_tone": "often anxious"`
*   **Therapeutic Goals & Progress:** Explicitly defined goals and tracked milestones in the user's therapeutic journey.
    *   Example: `"primary_goal": "Manage anxiety"`, `"milestone_1_completion_date": "2023-10-27"`
*   **Triggers & Sensitivities:** Topics, words, or situations that the user has indicated are sensitive or triggering.
    *   Example: `"triggers": ["spiders", "crowded places"]`

**What Does NOT Belong in Memory:**

*   **Transient State:** Temporary UI states, loading flags, or ephemeral data.
*   **Technical Logs:** Debug messages, error traces, system events (these go in append-only logs).
*   **Raw Conversation History:** While summaries might be stored, full transcripts should be managed separately (e.g., in `ChatSession`).
*   **Large Binary Data:** Images, audio files, or large documents. Store references or metadata instead.

### 1.2. Memory Structure (Refresher)

Based on the `Memory` interface and Prisma schema:
*   `id`: Unique identifier.
*   `userId`: Links memory to a user.
*   `key`: A unique string identifier for the memory within the user's scope.
*   `value`: The actual data, stored as a string (could be JSON serialized).
*   `category`: A predefined category (`"preferences"`, `"context"`, `"facts"`, `"personality"`, `"goals"`, `"triggers"`, `"progress"`).
*   `confidence`: A numerical score (0-1) indicating the reliability of the memory.
*   `chatId` (optional): Links the memory to a specific conversation.
*   `createdAt`, `updatedAt`: Timestamps.

### 1.3. How Memory Gets Updated

The process of updating memory should be managed by a dedicated service to ensure consistency and prevent conflicts.

**Proposed Pipeline (`MemoryProcessor` role):**

1.  **Trigger:**
    *   User input (chat message, voice command).
    *   AI analysis output (insights from a therapy session).
    *   Explicit user action (editing a preference in the UI).
2.  **Extraction/Analysis:**
    *   An NLP service or rule-based system analyzes the trigger to identify potential new memories or updates to existing ones.
    *   This process assigns an initial `confidence` score.
    *   It determines the appropriate `category` and `key`.
3.  **Proposal:**
    *   The system proposes the new/updated memory. This could be a data structure like `ProposedMemory { key, value, category, confidence, source }`.
4.  **Validation/Conflict Resolution (Optional but Recommended):**
    *   Before writing, check if a memory with the same `key` already exists for the user.
    *   If it exists, decide whether to overwrite, merge, or create a new version based on `confidence` and `source`.
    *   Example: If a new fact has a higher confidence than an existing one, it overwrites. If it's a preference change, it directly updates.
5.  **Persistence:**
    *   A `MemoryService` is responsible for the final CRUD operations on the database via the `/api/memory` endpoints or direct Prisma calls.
    *   This service ensures `userId` is correctly associated and handles any necessary data transformations (e.g., serializing `value`).

### 1.4. How Agents Read/Write Without Overwriting

To prevent agents from overwriting each other's data inadvertently:

*   **Centralized Service:** All read/write operations on the `Memory` database table *must* go through the `MemoryService`. Direct database calls from arbitrary parts of the application should be discouraged.
*   **Key Naming Convention:** Establish a clear convention for `key` names to avoid accidental collisions.
    *   Use descriptive, namespaced keys: `therapist:last_session_topic`, `user:preferred_name`, `onboarding:completed_steps`.
*   **Atomic Operations:** The `MemoryService` should provide atomic operations for common patterns (e.g., "increment a counter", "append to a list if not present").
*   **Optimistic Locking (Advanced):** For highly concurrent updates to the same memory item, implement a version number or timestamp check. If the item has been modified since it was read, the update fails, and the agent must re-read and try again.
*   **Confidence-Based Merging:** When updating, the `MemoryProcessor` should consider the `confidence` of the incoming update and the existing memory to decide the merge strategy.

## 2. System Logging Policy

### 2.1. Append-Only Logs

The system uses append-only logs (`/project/agent_logs/*.md`) for tracking agent activities, system events, and debugging information. These logs are crucial for auditing, debugging, and understanding the system's behavior over time.

**Log Files:**
*   `claude_log.md` (Builder Agent)
*   `gemini_log.md` (Research Agent)
*   `quinn_log.md` (Maintainer Agent)
*   `AI_THERAPIST_LOG.md` (AI Therapy interactions)
*   `JAMIE_LOG.md` (Jamie agent interactions)
*   `CHATGPT_INTEGRATION_LOG.md` (ChatGPT interactions)

### 2.2. What Gets Logged

**Agent Activities:**
*   Tasks performed, decisions made, code written or modified.
*   Plans and summaries of work completed.
*   Errors encountered and how they were resolved (or attempted to be resolved).

**System Events:**
*   API requests and responses (potentially sensitive data should be sanitized).
*   Database operations (at a high level, e.g., "User 123 created memory X").
*   External service calls (e.g., "Called OpenAI API for voice transcription").
*   Errors and exceptions.

**Debugging Information:**
*   Detailed state information that helps diagnose issues.
*   Flow of execution through complex logic.

### 2.3. Log Entry Format

To maintain consistency and readability, log entries should follow a standard format.

```
## Entry - YYYY-MM-DD HH:MM:SS

### [Category/Title of Entry]

**Details:**
- Point 1
- Point 2

**Impact/Next Steps:**
- Action item 1
```

*   **Date/Time:** Precise timestamp of the log entry.
*   **Category/Title:** A brief, descriptive heading.
*   **Details:** Bullet points or paragraphs explaining the event or action.
*   **Impact/Next Steps:** Consequences of the event or planned follow-up actions.

### 2.4. Log Rotation & Archival

To prevent log files from becoming excessively large and unwieldy:

*   **Size-Based Rotation:** When a log file reaches a certain size (e.g., 10MB), it is closed.
*   **Archival:** The closed log file is renamed with a timestamp (e.g., `claude_log_20231027_1000.md`) and moved to an archive directory (`/project/log_archive`).
*   **New File:** A new, empty log file with the original name is created for ongoing entries.
*   **Automated Process:** A background script or a function within the logging utility can handle this rotation process periodically (e.g., daily) or when the size threshold is met.
*   **Retention Policy:** Define how long archived logs are kept (e.g., 90 days) before being deleted or moved to long-term storage.

This strategy ensures that `/project/memory` is a well-organized, reliable store of user-specific knowledge, and that system logs provide valuable insights without becoming a performance or management burden.