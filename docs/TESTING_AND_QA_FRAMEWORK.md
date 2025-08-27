# Testing and QA Framework

## 1. Overview

This document defines the testing and quality assurance framework for the Luna Web application. It establishes standards for unit tests, integration tests, and end-to-end tests to ensure the reliability, correctness, and robustness of the application.

## 2. Testing Principles

*   **Test Pyramid:** Prioritize unit tests, followed by integration tests, and use end-to-end tests sparingly for critical user flows.
*   **Automated Testing:** Automate as much testing as possible to ensure consistent and repeatable verification.
*   **Early Testing:** Integrate testing early in the development lifecycle.
*   **Clear and Maintainable Tests:** Write tests that are easy to understand, modify, and extend.
*   **Comprehensive Coverage:** Aim for high test coverage, especially for critical business logic and core functionalities.

## 3. Unit Testing Standards

Unit tests focus on testing individual functions, components, or modules in isolation.

### 3.1. Scope

*   **Functions/Services:** Pure functions, utility functions, service layer logic (e.g., `MemoryService`, `authService`).
*   **React Components:** Individual React components, especially those with complex logic or state management.
*   **Helper Functions:** Utility functions in `utils/` or `lib/`.
*   **State Management:** Reducers, actions, and selectors in state management libraries (e.g., Redux, Zustand).
*   **Schema Validation:** Validation logic for API requests and data models.

### 3.2. Tools

*   **Jest:** JavaScript testing framework.
*   **@testing-library/react:** For testing React components.
*   **@testing-library/jest-dom:** Custom jest matchers for the DOM.

### 3.3. Conventions

*   **File Naming:** Place test files next to the code they are testing, with a `.test.ts` or `.test.tsx` extension.
    *   Example: `src/memory/services/memoryService.ts` -> `src/memory/services/memoryService.test.ts`
*   **Describe Blocks:** Use `describe` blocks to group related tests. Name them after the unit being tested.
    *   Example: `describe('MemoryService', () => { ... });`
*   **Test Naming:** Use clear, descriptive names for `it` or `test` blocks that explain the expected behavior.
    *   Example: `it('should create a new memory with correct userId', () => { ... });`
*   **Assertions:** Use specific assertions to check the outcome of the test.
    *   Example: `expect(result.id).toBeDefined();`, `expect(mockFunction).toHaveBeenCalledWith(arg1, arg2);`
*   **Mocking:** Mock external dependencies (API calls, database access, browser APIs) to isolate the unit under test.
    *   Use `jest.fn()`, `jest.mock()`, or libraries like `nock` for HTTP requests.

### 3.4. Coverage Targets

*   **Core Business Logic (Services, Utilities):** 90%+ coverage.
*   **React Components (Complex ones):** 80%+ coverage.
*   **Simple Components/Helpers:** 70%+ coverage.

## 4. Integration Testing Standards

Integration tests verify that different modules or services work together correctly.

### 4.1. Scope

*   **API Endpoints:** Test the full flow of an API endpoint, including request parsing, authentication (via middleware), business logic, and database interaction.
*   **Database Operations:** Test complex database queries, relationships, and transactions.
*   **External Service Integrations:** Test interactions with third-party services (e.g., OpenAI, Stripe) using mocked responses or controlled test environments.
*   **WebSocket Communication:** Test the connection, message exchange, and state management of WebSocket connections (e.g., `/api/voice`).

### 4.2. Tools

*   **Jest:** For orchestrating the tests.
*   **Supertest:** For testing HTTP endpoints.
*   **Prisma Test Utilities:** For database interactions in tests (consider using an in-memory database or a separate test database).
*   **Mocking Libraries:** For simulating external service responses.

### 4.3. Conventions

*   **File Naming:** Place integration test files in a dedicated directory like `src/__tests__/integration/` or alongside the module with a `.integration.test.ts` extension.
*   **Environment Setup:** Use a separate test database and environment variables.
*   **Test Data:** Use factories or fixtures to create consistent test data.
*   **Cleanup:** Ensure tests clean up after themselves (e.g., deleting created records from the database).

### 4.4. Coverage Targets

*   **Critical API Routes:** 100% of core API endpoints should have integration tests.
*   **Database Interactions:** Complex queries and relationships should be thoroughly tested.
*   **External Integrations:** Key interactions with third-party services should be covered.

## 5. End-to-End (E2E) Testing Standards

E2E tests simulate real user scenarios and verify the entire application flow.

### 5.1. Scope

*   **User Flows:** Critical user journeys from login to core features (e.g., user registration, creating a memory, using the voice orb).
*   **Cross-Browser Compatibility:** Ensure the application works correctly across different browsers (if deemed necessary).
*   **Performance Testing:** Measure the performance of critical user flows (though this might be a separate category).

### 5.2. Tools

*   **Cypress:** A popular E2E testing framework for web applications.
*   **Playwright:** Another modern E2E testing framework.
*   **Selenium:** A more traditional option, but can be more complex to set up.

### 5.3. Conventions

*   **Test Environment:** Run E2E tests against a staging or dedicated test environment that closely mirrors production.
*   **Data Setup:** Use a consistent way to set up test data (e.g., database seeding scripts).
*   **Test Stability:** E2E tests should be as stable and deterministic as possible. Avoid flaky tests.
*   **Selective Testing:** Focus E2E tests on the most critical and complex user flows.

### 5.4. Coverage Targets

*   **Core User Flows:** 100% of critical user journeys (e.g., login -> chat -> memory extraction -> logout).
*   **Key Features:** All primary features should be covered by at least one E2E test.

## 6. Specific Test Cases

### 6.1. Unit Tests

*   **MemoryService:**
    *   `createMemory`: Should create a memory with the correct `userId` and timestamps.
    *   `getMemoryById`: Should retrieve a memory by its ID and `userId`.
    *   `updateMemory`: Should update a memory's fields and `updatedAt` timestamp.
    *   `deleteMemory`: Should delete a memory by its ID and `userId`.
    *   `searchMemories`: Should filter memories by `userId`, `category`, and `searchTerm`.
*   **MemoryProcessor:**
    *   `extractMemoriesFromText`: Should correctly identify and structure potential memories from a text input.
    *   `calculateConfidence`: Should assign a confidence score based on extraction rules.
*   **Auth Middleware:**
    *   Should allow access with a valid token.
    *   Should deny access with an invalid or missing token.
    *   Should correctly attach `userId` to the request object.
*   **React Components (e.g., MemoryViewer):**
    *   Should render memory data correctly.
    *   Should handle loading and error states.
    *   Should trigger the correct actions when buttons are clicked.

### 6.2. Integration Tests

*   **POST /api/memory:**
    *   Should create a new memory in the database for an authenticated user.
    *   Should reject requests without a valid token.
    *   Should validate the request body (e.g., missing `key`).
*   **GET /api/memory:**
    *   Should retrieve all memories for the authenticated user.
    *   Should filter memories by query parameters.
*   **/api/voice WebSocket:**
    *   Should establish a connection with a valid token.
    *   Should reject connections with an invalid token.
    *   Should forward `audio_input` to OpenAI and receive `realtime_event` back.
*   **Database Migrations:**
    *   Should apply schema changes correctly.
    *   Should preserve existing data during migrations.

### 6.3. End-to-End Tests

*   **User Authentication Flow:**
    1.  Navigate to the login page.
    2.  Enter valid credentials.
    3.  Submit the form.
    4.  Verify that the user is redirected to the dashboard.
*   **Memory Management Flow:**
    1.  Log in as a user.
    2.  Navigate to the memory management section.
    3.  Create a new memory.
    4.  Verify the memory appears in the list.
    5.  Edit the memory.
    6.  Verify the changes are saved.
    7.  Delete the memory.
    8.  Verify the memory is removed from the list.
*   **Voice Interaction Flow:**
    1.  Log in as a user.
    2.  Navigate to the voice orb.
    3.  Click the "Start Session" button.
    4.  Allow microphone access.
    5.  Speak a phrase.
    6.  Verify that the orb animates and audio is played back (this might require mocking the OpenAI API or using a test double).

## 7. Continuous Integration (CI) and Test Execution

*   **Automated Runs:** Configure CI pipelines (e.g., GitHub Actions) to run unit and integration tests on every pull request and merge to the main branch.
*   **E2E Runs:** Schedule E2E tests to run nightly or on deployment to staging.
*   **Test Reports:** Generate and publish test reports for easy analysis of failures.
*   **Code Coverage:** Integrate code coverage tools (e.g., Istanbul/nyc with Jest) to track coverage metrics and enforce minimum thresholds.

This framework provides a structured approach to testing, ensuring that the Luna Web application is robust, reliable, and maintainable.