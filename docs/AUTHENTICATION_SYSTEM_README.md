# 🔐 Authentication & Access Control System

## Overview

Luna AI now features a comprehensive authentication and access control system that provides:

- **Secure user authentication** with JWT tokens
- **Role-based access control** (Free, Basic, Premium, Enterprise)
- **Creator access** for unfiltered development access
- **Fair pricing model** similar to OpenAI's approach
- **Usage tracking** and limits for Jamie AI
- **Protected routes** with automatic access enforcement

## 🏗️ Architecture

### Core Components

1. **AuthContext** (`src/contexts/AuthContext.tsx`)
   - Manages user authentication state
   - Handles login/logout/signup
   - Provides access control methods

2. **useAccessControl Hook** (`src/hooks/useAccessControl.ts`)
   - Feature access checking
   - Usage tracking and limits
   - Upgrade recommendations

3. **ProtectedRoute Component** (`src/components/auth/ProtectedRoute.tsx`)
   - Route protection with automatic access enforcement
   - Beautiful upgrade prompts
   - Role-based access control

4. **Database Schema** (`prisma/schema.prisma`)
   - Enhanced User model with subscription and access fields
   - SubscriptionTier model for pricing plans
   - AccessControl and CreatorAccess models

## 👥 User Roles & Access Levels

### Free Tier
- ✅ Basic mental health resources
- ✅ Community support forums
- ✅ Basic mood tracking
- ✅ Limited meditation sessions
- ❌ No Jamie AI access
- ❌ No premium features

### Basic Tier ($9.99/month)
- ✅ Everything in Free
- ✅ Jamie AI (50 conversations/month)
- ✅ Advanced mood tracking
- ✅ Personalized insights
- ✅ Priority community support

### Premium Tier ($24.99/month)
- ✅ Everything in Basic
- ✅ **Unlimited Jamie AI conversations**
- ✅ Advanced therapeutic techniques
- ✅ Personalized therapy plans
- ✅ Crisis intervention support
- ✅ Family account sharing (up to 3 users)

### Enterprise Tier ($99.99/month)
- ✅ Everything in Premium
- ✅ White-label solutions
- ✅ Custom integrations
- ✅ Advanced analytics dashboard
- ✅ Dedicated support team
- ✅ Compliance certifications (HIPAA, GDPR)

### Creator Access
- 🔓 **Unfiltered access to everything**
- 🔓 **No usage limits**
- 🔓 **Full system access**
- 🔓 **Development tools**
- 🔓 **Admin capabilities**

## 🚀 Getting Started

### 1. Database Setup

First, apply the new schema changes:

```bash
# Generate Prisma client with new schema
npx prisma generate

# Apply migrations
npx prisma migrate dev --name add_subscription_system

# Seed subscription tiers
node prisma/seed-subscription-tiers.js
```

### 2. Environment Variables

Ensure your `.env.local` has all required API keys:

```bash
# Authentication
JWT_SECRET="your-super-secret-jwt-key"

# AI Services
OPENAI_API_KEY="your-openai-key"
OPENROUTER_API_KEY="your-openrouter-key"
GEMINI_API_KEY="your-gemini-key"

# TTS
CARTESIA_API_KEY="your-cartesia-key"

# Database
DATABASE_URL="file:./dev.db"
```

### 3. Wrap Your App

Wrap your app with the AuthProvider:

```tsx
// pages/_app.tsx
import { AuthProvider } from '../contexts/AuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
```

## 🛡️ Protecting Routes

### Basic Authentication

```tsx
import ProtectedRoute from '../components/auth/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute requireAuth={true}>
      <div>Protected dashboard content</div>
    </ProtectedRoute>
  );
}
```

### Feature-Specific Access

```tsx
import ProtectedRoute from '../components/auth/ProtectedRoute';

export default function JamieChat() {
  return (
    <ProtectedRoute requiredFeature="jamie">
      <div>Jamie AI chat interface</div>
    </ProtectedRoute>
  );
}
```

### Creator-Only Access

```tsx
import ProtectedRoute from '../components/auth/ProtectedRoute';

export default function DeveloperTools() {
  return (
    <ProtectedRoute requireCreator={true}>
      <div>Developer and creator tools</div>
    </ProtectedRoute>
  );
}
```

### Admin-Only Access

```tsx
import ProtectedRoute from '../components/auth/ProtectedRoute';

export default function AdminPanel() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div>Administrative panel</div>
    </ProtectedRoute>
  );
}
```

## 🔧 Using Access Control in Components

### Check Feature Access

```tsx
import { useAccessControl } from '../hooks/useAccessControl';

export default function MyComponent() {
  const { canAccess, canAccessJamie, isCreator } = useAccessControl();

  if (canAccessJamie()) {
    return <div>Jamie AI is available!</div>;
  }

  if (isCreator) {
    return <div>Creator mode - unlimited access</div>;
  }

  return <div>Upgrade required for this feature</div>;
}
```

### Track Usage

```tsx
import { useAccessControl } from '../hooks/useAccessControl';

export default function ChatComponent() {
  const { trackUsage } = useAccessControl();

  const handleSendMessage = async () => {
    // Track Jamie AI usage
    await trackUsage('jamie');
    // ... send message logic
  };

  return <button onClick={handleSendMessage}>Send</button>;
}
```

### Get Usage Information

```tsx
import { useAccessControl } from '../hooks/useAccessControl';

export default function UsageDisplay() {
  const { getJamieUsage, usageStats, isLoading } = useAccessControl();
  const jamieUsage = getJamieUsage();

  if (isLoading) return <div>Loading...</div>;

  if (jamieUsage?.isUnlimited) {
    return <div>Unlimited Jamie AI access</div>;
  }

  return (
    <div>
      Jamie AI: {jamieUsage?.usageCount} / {jamieUsage?.limit}
      <br />
      Remaining: {jamieUsage?.remaining}
    </div>
  );
}
```

## 🎯 Creator Access Setup

### 1. Create Creator Account

The seed script automatically creates a creator account. Update the email in `prisma/seed-subscription-tiers.js`:

```javascript
const creatorEmail = 'your-email@domain.com'; // Change this
```

### 2. Set Password

After running the seed script, you'll need to set a real password for your creator account. You can do this through:

- Admin panel (if you have another admin account)
- Direct database update
- Password reset flow

### 3. Creator Permissions

Creators automatically get:
- `isCreator: true`
- `isAdmin: true`
- `subscriptionTier: 'enterprise'`
- `jamieAccess: true`
- `jamieUsageLimit: -1` (unlimited)

## 📊 Usage Tracking

### Automatic Tracking

The system automatically tracks:
- Jamie AI conversations
- Premium feature usage
- Monthly limits and resets

### Manual Tracking

```tsx
import { useAccessControl } from '../hooks/useAccessControl';

const { trackUsage } = useAccessControl();

// Track specific feature usage
await trackUsage('jamie');
await trackUsage('premium_features');
```

## 🔄 Subscription Management

### Upgrade Flow

1. User visits `/pricing`
2. Selects plan and billing cycle
3. Redirected to checkout
4. Payment processed
5. Subscription updated
6. Access granted immediately

### Downgrade Flow

1. User cancels subscription
2. Access continues until billing period ends
3. Automatically reverts to free tier
4. Usage limits applied

## 🚨 Security Features

### JWT Tokens
- Secure token-based authentication
- Automatic token refresh
- Secure storage in localStorage

### Rate Limiting
- API rate limiting for non-creator users
- Usage-based limits for Jamie AI
- Automatic reset periods

### Data Privacy
- Encrypted conversations
- Secure user data storage
- GDPR compliance ready

## 🧪 Testing

### Test Different Access Levels

1. **Free User**: Limited access, upgrade prompts
2. **Basic User**: Jamie AI with limits
3. **Premium User**: Unlimited access
4. **Creator**: Full system access

### Test Protected Routes

```bash
# Test authentication required
curl http://localhost:3000/dashboard

# Test feature access
curl http://localhost:3000/chat

# Test creator access
curl http://localhost:3000/developer-tools
```

## 🐛 Troubleshooting

### Common Issues

1. **"Module not found" errors**
   - Ensure all imports are correct
   - Check file paths

2. **Authentication not working**
   - Verify JWT_SECRET is set
   - Check database connection
   - Verify API routes exist

3. **Access control not working**
   - Check user roles in database
   - Verify subscription tier
   - Check usage limits

### Debug Mode

Enable debug logging:

```typescript
// In AuthContext
console.log('User state:', user);
console.log('Access check:', checkFeatureAccess('jamie'));
```

## 📈 Future Enhancements

### Planned Features
- [ ] Stripe integration for payments
- [ ] Advanced analytics dashboard
- [ ] Team management for enterprise
- [ ] SSO integration
- [ ] Advanced role permissions

### Customization
- [ ] Custom subscription tiers
- [ ] Feature bundles
- [ ] Usage-based pricing
- [ ] Promotional codes

## 🤝 Support

For questions or issues with the authentication system:

1. Check this documentation
2. Review the code examples
3. Check the database schema
4. Contact the development team

---

**Note**: This system is designed to be fair and accessible while providing premium features for those who need them. The free tier ensures that basic mental health support is available to everyone, while paid tiers provide advanced AI capabilities and unlimited access.
