# Luna API Documentation

This document provides comprehensive documentation for the Luna AI API endpoints.

## Base URL
```
https://your-domain.com/api
```

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

Error responses:
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## Endpoints

### Authentication

#### POST /api/auth/login
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-here"
  }
}
```

#### POST /api/auth/signup
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-here"
  }
}
```

#### POST /api/auth/reset-password
Request a password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

### Chat & AI

#### POST /api/chat
Send a message to the AI and receive a response.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Hello! I'm doing well, thank you for asking. How can I help you today?"
  }
}
```

#### GET /api/chat/get-histories
Get chat history for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "histories": [
      {
        "id": "chat-id",
        "messages": "...",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### POST /api/chat/save-history
Save chat history.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hi there!"
    }
  ]
}
```

### User Management

#### GET /api/user/[id]
Get user profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "name": "John Doe",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Mood Tracking

#### GET /api/mood-entries
Get mood entries for a user.

**Query Parameters:**
- `userId` (string, required): User ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "entry-id",
      "level": 5,
      "notes": "Feeling good today",
      "date": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/mood-entries
Create a new mood entry.

**Request Body:**
```json
{
  "userId": "user-id",
  "level": 5,
  "notes": "Feeling good today",
  "date": "2024-01-01T00:00:00Z"
}
```

### Journal Entries

#### GET /api/journal-entries
Get journal entries for a user.

**Query Parameters:**
- `userId` (string, required): User ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "entry-id",
      "prompt": "How are you feeling today?",
      "content": "I'm feeling optimistic about the future.",
      "date": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/save-journal-entry
Save a journal entry.

**Request Body:**
```json
{
  "userId": "user-id",
  "prompt": "How are you feeling today?",
  "content": "I'm feeling optimistic about the future.",
  "date": "2024-01-01T00:00:00Z"
}
```

### Progress Tracking

#### POST /api/progress-tracking/goals
Create a new goal.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Practice mindfulness",
  "description": "Meditate for 10 minutes daily",
  "targetDate": "2024-12-31",
  "category": "wellness"
}
```

#### PUT /api/progress-tracking/goals
Update goal progress.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "goalId": "goal-id",
  "progress": 75,
  "notes": "Completed 3 out of 4 sessions this week"
}
```

#### GET /api/progress-tracking/insights
Get personalized insights.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `userId` (string, required): User ID

**Response:**
```json
{
  "success": true,
  "data": {
    "insights": [
      {
        "type": "mood_trend",
        "title": "Mood Improvement",
        "description": "Your mood has improved by 20% this week",
        "data": { ... }
      }
    ]
  }
}
```

### Community

#### GET /api/community
Get community posts.

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "post-id",
        "content": "Sharing my journey with anxiety",
        "author": {
          "id": "user-id",
          "name": "John Doe"
        },
        "comments": [...],
        "likes": [...],
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### POST /api/community
Create a new community post.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "content": "Sharing my journey with anxiety",
  "authorId": "user-id"
}
```

### Payments & Donations

#### POST /api/create-payment-intent
Create a Stripe payment intent for donations.

**Request Body:**
```json
{
  "amount": 25.00
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxx_secret_xxx"
  }
}
```

#### POST /api/create-checkout-session
Create a Stripe checkout session.

**Request Body:**
```json
{
  "amount": 25.00,
  "isMonthly": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_xxx"
  }
}
```

### Analytics

#### POST /api/track-events
Track user events for analytics.

**Request Body:**
```json
{
  "userId": "user-id",
  "eventName": "PAGE_VIEW",
  "eventData": {
    "page": "chat",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### Health & Monitoring

#### GET /api/health
Check application health status.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00Z",
    "uptime": 3600,
    "environment": "production",
    "version": "1.0.0",
    "checks": {
      "database": "healthy",
      "environment": "healthy"
    },
    "responseTime": "15ms"
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `AUTH_REQUIRED` | Authentication required |
| `INVALID_TOKEN` | Invalid or expired token |
| `USER_NOT_FOUND` | User not found |
| `VALIDATION_ERROR` | Request validation failed |
| `DATABASE_ERROR` | Database operation failed |
| `AI_SERVICE_ERROR` | AI service unavailable |
| `PAYMENT_ERROR` | Payment processing failed |
| `RATE_LIMIT_EXCEEDED` | Too many requests |

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **Chat endpoints**: 60 requests per minute
- **General endpoints**: 100 requests per minute

## Pagination

For endpoints that return lists, pagination is supported:

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

## Webhooks

### Stripe Webhooks

**Endpoint:** `POST /api/webhooks`

**Headers:**
```
Stripe-Signature: t=timestamp,v1=signature
```

**Events:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## SDK Examples

### JavaScript/TypeScript

```typescript
class LunaAPI {
  private baseURL: string;
  private token: string;

  constructor(baseURL: string, token?: string) {
    this.baseURL = baseURL;
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.token = response.data.token;
    return response;
  }

  async sendMessage(message: string) {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: message }],
      }),
    });
  }
}

// Usage
const api = new LunaAPI('https://your-domain.com/api');
await api.login('user@example.com', 'password');
const response = await api.sendMessage('Hello, how are you?');
```

### Python

```python
import requests
import json

class LunaAPI:
    def __init__(self, base_url, token=None):
        self.base_url = base_url
        self.token = token
        self.session = requests.Session()
        
        if token:
            self.session.headers.update({
                'Authorization': f'Bearer {token}'
            })
    
    def login(self, email, password):
        response = self.session.post(
            f'{self.base_url}/auth/login',
            json={'email': email, 'password': password}
        )
        response.raise_for_status()
        data = response.json()
        self.token = data['data']['token']
        self.session.headers.update({
            'Authorization': f'Bearer {self.token}'
        })
        return data
    
    def send_message(self, message):
        response = self.session.post(
            f'{self.base_url}/chat',
            json={'messages': [{'role': 'user', 'content': message}]}
        )
        response.raise_for_status()
        return response.json()

# Usage
api = LunaAPI('https://your-domain.com/api')
api.login('user@example.com', 'password')
response = api.send_message('Hello, how are you?')
```

## Testing

### Postman Collection

Import this collection into Postman for testing:

```json
{
  "info": {
    "name": "Luna API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"user@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/auth/login",
              "host": ["{{base_url}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "https://your-domain.com/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

## Support

For API support:
- Email: michael.robins938@gmail.com
- GitHub Issues: [Repository Issues](https://github.com/yourusername/luna-ai/issues)
- Documentation: [Main README](../README.md) 