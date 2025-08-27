# Security and Permissions

## 1. Overview

This document defines the security policies and permission model for the Luna Web application. It covers Role-Based Access Control (RBAC), rate limiting, API key usage, and data retention policies.

## 2. Authentication Recap

The application uses JWT (JSON Web Tokens) for authentication:

*   Users authenticate via email/password or OAuth (conceptual).
*   Upon successful authentication, a JWT token is issued by the `/api/auth/login` endpoint.
*   The token is stored securely on the client (e.g., HttpOnly cookie).
*   For protected API requests, the client sends the token in the `Authorization: Bearer <token>` header.
*   `authMiddleware` verifies the token and attaches the `userId` to the request object.

## 3. Role-Based Access Control (RBAC)

The Prisma `User` model defines several boolean flags that indicate roles or privileges:

*   `isExpert`: Indicates if the user is a mental health professional.
*   `isModerator`: Indicates if the user has moderation privileges.

### 3.1. Roles

Based on the existing model, we can define the following roles:

*   **User (Default):** A standard user of the application.
*   **Expert:** A mental health professional. Likely has access to additional features like viewing assessments, providing expert answers, or managing support groups.
*   **Moderator:** A user responsible for content moderation. Can manage posts, comments, and user reports.
*   **Admin (Future):** A super-user with full access to all system functionalities, including user management, system configuration, and data access.

### 3.2. Permissions by Role

| Feature/Resource              | User | Expert | Moderator | Admin |
| :--------------------------- | :--: | :----: | :-------: | :---: |
| **Authentication**           |  Y   |   Y    |     Y     |   Y   |
| **Memory Management**        |  Y   |   Y    |     Y     |   Y   |
| **Chat Interaction**         |  Y   |   Y    |     Y     |   Y   |
| **Voice Interaction**        |  Y   |   Y    |     Y     |   Y   |
| **View Assessments**         |  N   |   Y    |     N     |   Y   |
| **Create/Edit Posts**        |  Y   |   Y    |     Y     |   Y   |
| **Delete Any Post**          |  N   |   N    |     Y     |   Y   |
| **Manage Support Groups**    |  Y (own groups) | Y (own + professional) | Y |   Y   |
| **View User Profiles**       |  Y (limited) | Y (more details) | Y (full) |   Y   |
| **Access Admin Panel**       |  N   |   N    |     N     |   Y   |
| **Manage Users**             |  N   |   N    |     N     |   Y   |
| **System Configuration**     |  N   |   N    |     N     |   Y   |

### 3.3. Implementing RBAC

To implement RBAC, we can enhance the authentication and authorization process:

1.  **User Model Extension:** Add an `isAdmin` boolean field to the `User` model.
2.  **Role-Based Middleware:** Create specific middleware functions for role checks.
    ```typescript
    // Example middleware
    export const requireExpert = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) => {
      return async (req: AuthenticatedRequest, res: NextApiResponse) => {
        // First, ensure user is authenticated
        await authMiddleware(async (authReq, authRes) => {
          const user = await prisma.user.findUnique({
            where: { id: authReq.user?.userId },
            select: { isExpert: true }
          });

          if (!user?.isExpert) {
            return authRes.status(403).json({ message: 'Access denied. Expert privileges required.' });
          }

          return handler(authReq, authRes);
        })(req, res);
      };
    };
    ```
3.  **API Route Protection:** Apply the appropriate middleware to API routes.
    ```typescript
    // Example API route
    import { requireExpert } from '../../../middleware/role-middleware';

    const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
      // Route logic here, accessible only to Experts
    };

    export default requireExpert(handler);
    ```
4.  **Frontend Integration:** Conditionally render UI elements based on the user's role. This can be done by fetching the user's role information (e.g., via `/api/user/profile` which would include role flags) and using it in the React components.

## 4. Rate Limiting and API Key Usage

To protect the application and its external service integrations from abuse, rate limiting is essential.

### 4.1. Rate Limiting

*   **Scope:** Rate limiting should be applied to API endpoints, especially those that are resource-intensive or interact with external services (e.g., OpenAI, Stripe).
*   **Strategy:**
    *   Use a library like `express-rate-limit` or a Redis-based solution for more distributed environments.
    *   Define limits per endpoint or per user/IP.
*   **Implementation:**
    *   **Login/Register Endpoints:** Limit to 5 attempts per minute per IP to prevent brute-force attacks.
    *   **AI Interaction Endpoints:** Limit to 10 requests per minute per user to prevent excessive usage.
    *   **Voice API:** Limit the number of concurrent sessions or the total duration of audio processed per user per hour.
    *   **Generic API Limits:** A general limit of 100 requests per minute per IP/user.
*   **Configuration:** Rate limits should be configurable via environment variables.
    ```javascript
    // Example configuration
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: "Too many requests from this IP, please try again later."
    });
    ```

### 4.2. API Key Usage for Plugins/Actions

If the application supports third-party plugins or actions that need to interact with internal APIs:

*   **API Key Generation:** Provide a mechanism for users (likely Admins) to generate API keys for trusted plugins.
*   **API Key Storage:** Store API keys securely, hashed in the database.
*   **API Key Middleware:** Create middleware to verify API keys.
    ```typescript
    // Example API key middleware
    export const apiKeyMiddleware = async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
      const apiKey = req.headers['x-api-key'];
      if (!apiKey) {
        return res.status(401).json({ message: 'API key required' });
      }

      const plugin = await prisma.plugin.findUnique({
        where: { apiKeyHash: hash(apiKey) } // Use a secure hashing function
      });

      if (!plugin) {
        return res.status(401).json({ message: 'Invalid API key' });
      }

      // Attach plugin information to the request
      (req as any).plugin = plugin;
      next();
    };
    ```
*   **Rate Limiting for API Keys:** Apply separate rate limits for API key-based access.
*   **Permissions for API Keys:** Define what actions or data a plugin can access via its API key.

## 5. Data Retention Policies

It's important to define how long different types of data are retained to comply with privacy regulations and manage storage.

### 5.1. Memory Data

*   **Type:** User-defined memories (preferences, facts, goals, etc.).
*   **Retention:** This is core user data and should be retained as long as the user's account is active.
*   **Deletion:** Upon user account deletion, all associated memory data should be permanently removed.

### 5.2. Chat Logs/History

*   **Type:** Conversation history between the user and the AI.
*   **Retention:** Should be retained for a reasonable period to allow users to review past conversations. A default of 2 years is suggested, with an option for users to delete their history earlier.
*   **Deletion:** Automatically deleted after the retention period or upon user request. Upon account deletion, all chat history should be removed.

### 5.3. Analytics Events

*   **Type:** Data collected for analytics purposes (page views, feature usage, etc.).
*   **Retention:** Retained for a period necessary for business analysis, typically 1-2 years.
*   **Anonymization:** Consider anonymizing or aggregating data after a shorter period (e.g., 6 months) to reduce privacy risks.

### 5.4. System Logs

*   **Type:** Application logs, error logs, access logs.
*   **Retention:** Retained for debugging and security monitoring. A period of 90 days to 1 year is typical.
*   **Rotation:** Logs should be rotated and archived as per the `MEMORY_AND_LOGGING_STRATEGY.md`.

### 5.5. User Account Data

*   **Upon Deletion Request:** All personal data (user record, memories, chat history, analytics, etc.) associated with the user should be permanently deleted from active databases within 30 days.
*   **Legal Obligations:** Data may be retained longer if required by law (e.g., financial records for 7 years).

## 6. Security Best Practices

*   **Input Validation:** Always validate and sanitize user inputs on both client and server sides to prevent injection attacks.
*   **Secure Password Storage:** Passwords are already stored using bcrypt, which is good.
*   **HTTPS:** Ensure all communication is over HTTPS in staging and production environments.
*   **Dependency Security:** Regularly update dependencies and scan for vulnerabilities (as done in the CI/CD pipeline).
*   **Security Headers:** Configure appropriate security headers (e.g., CSP, X-Frame-Options) in the Nginx configuration.
*   **Regular Security Audits:** Conduct periodic security audits and penetration testing.

This document provides a foundation for a secure and well-permissioned Luna Web application.