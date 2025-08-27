# Comprehensive Persistence System

## Overview

The Comprehensive Persistence System provides site-wide data persistence for all interactive elements, user progress, chat memory, and application state. This system ensures that user interactions, preferences, and progress are maintained across sessions and synchronized with the backend when available.

## Architecture

### Core Components

1. **PersistenceContext** - Central state management for all persistence data
2. **PersistenceService** - Backend synchronization and API management
3. **Persistence Hooks** - Easy-to-use hooks for components
4. **PersistenceDashboard** - User interface for managing persistence data
5. **API Endpoints** - Backend endpoints for data synchronization

### Data Flow

```
User Interaction → Component State → Persistence Hook → Context → Storage → Backend Sync
     ↑                                                                           ↓
     ←─────────────────────── Data Retrieval ←───────────────────────────────────
```

## Features

### 1. Comprehensive Data Persistence

- **Service Waivers** - Legal consent and waiver data
- **User Progress** - Onboarding and assessment completion
- **Chat History** - Complete conversation persistence
- **Memory Context** - AI memory and user preferences
- **Interactive Elements** - Card states, component visibility
- **User Preferences** - Theme, accessibility, privacy settings
- **UI State** - Layout preferences, navigation state

### 2. Multi-Layer Storage

- **Context Storage** - React context for immediate access
- **Local Storage** - Persistent browser storage
- **Session Storage** - Session-based storage
- **Backend Storage** - Cloud synchronization

### 3. Automatic Synchronization

- **Real-time Updates** - Immediate state persistence
- **Backend Sync** - Cloud backup and cross-device access
- **Conflict Resolution** - Smart merging of local and remote data
- **Offline Support** - Local storage when backend unavailable

### 4. User Control

- **Data Export** - Download all persistence data
- **Data Import** - Restore from backup
- **Selective Clearing** - Remove specific data types
- **Privacy Controls** - Granular data sharing preferences

## Usage

### Basic Persistence Hook

```tsx
import { usePersistentState } from '../hooks/usePersistenceState';

function MyComponent() {
  const { value, setValue, isDirty, save } = usePersistentState(
    'my-component-state',
    { count: 0, name: '' },
    { autoSave: true, saveDelay: 1000 }
  );

  return (
    <div>
      <input 
        value={value.name} 
        onChange={(e) => setValue(prev => ({ ...prev, name: e.target.value }))}
      />
      <button onClick={() => setValue(prev => ({ ...prev, count: prev.count + 1 }))}>
        Count: {value.count}
      </button>
      {isDirty && <span className="text-orange-500">Unsaved changes</span>}
    </div>
  );
}
```

### Card State Persistence

```tsx
import { useExpandableCard } from '../hooks/usePersistenceState';

function ExpandableCard({ cardId, title, children }) {
  const { isExpanded, toggle, expand, collapse } = useExpandableCard(cardId, false);

  return (
    <div className="border rounded-lg">
      <button 
        onClick={toggle}
        className="w-full p-4 text-left font-semibold flex items-center justify-between"
      >
        {title}
        <span>{isExpanded ? '▼' : '▶'}</span>
      </button>
      {isExpanded && (
        <div className="p-4 border-t">
          {children}
        </div>
      )}
    </div>
  );
}
```

### Component Visibility Persistence

```tsx
import { useVisibleComponent } from '../hooks/usePersistenceState';

function ToggleableComponent({ componentId, children }) {
  const { isVisible, toggle, show, hide } = useVisibleComponent(componentId, true);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={show} className="px-3 py-1 bg-green-600 text-white rounded">
          Show
        </button>
        <button onClick={hide} className="px-3 py-1 bg-red-600 text-white rounded">
          Hide
        </button>
        <button onClick={toggle} className="px-3 py-1 bg-blue-600 text-white rounded">
          Toggle
        </button>
      </div>
      {isVisible && children}
    </div>
  );
}
```

### Waiver Persistence

```tsx
import { useWaiverPersistence } from '../contexts/PersistenceContext';

function WaiverComponent() {
  const { waiver, setWaiver, hasValidWaiver } = useWaiverPersistence();

  const handleWaiverSign = (waiverData) => {
    setWaiver(waiverData);
  };

  return (
    <div>
      {hasValidWaiver ? (
        <div className="text-green-600">✅ Waiver signed and active</div>
      ) : (
        <button onClick={() => setShowWaiver(true)}>
          Sign Service Waiver
        </button>
      )}
    </div>
  );
}
```

### Progress Tracking

```tsx
import { useProgressPersistence } from '../contexts/PersistenceContext';

function OnboardingStep({ stepId, children }) {
  const { onboarding, updateOnboarding } = useProgressPersistence();

  const handleComplete = () => {
    updateOnboarding(stepId, true);
  };

  const isCompleted = onboarding.completedSteps.includes(stepId);

  return (
    <div className={`p-4 border rounded ${isCompleted ? 'bg-green-50' : 'bg-gray-50'}`}>
      {children}
      {!isCompleted && (
        <button onClick={handleComplete} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
          Mark Complete
        </button>
      )}
    </div>
  );
}
```

## Configuration

### Persistence Options

```tsx
const persistenceOptions = {
  // Storage options
  persistTo: 'context' | 'localStorage' | 'sessionStorage' | 'all',
  storageKey: 'custom-storage-key',
  
  // Persistence behavior
  autoSave: true,           // Auto-save on changes
  saveDelay: 1000,          // Delay before auto-save (ms)
  debounce: true,           // Debounce multiple rapid changes
  
  // Data validation
  validate: (value) => boolean,  // Custom validation function
  defaultValue: any,             // Fallback value
  
  // Sync options
  syncWithBackend: false,    // Enable backend synchronization
  syncOnChange: false        // Sync immediately on changes
};
```

### Context Configuration

```tsx
// In _app.tsx
import { PersistenceProvider } from '../contexts/PersistenceContext';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <PersistenceProvider>
        <AssessmentProvider>
          {/* Your app components */}
        </AssessmentProvider>
      </PersistenceProvider>
    </AuthProvider>
  );
}
```

## API Endpoints

### Persistence Sync

```http
POST /api/persistence/sync
Content-Type: application/json

{
  "waivers": [...],
  "chatHistory": [...],
  "memories": [...],
  "onboarding": {...},
  "assessment": {...},
  "preferences": {...},
  "uiState": {...}
}
```

### Progress Tracking

```http
POST /api/progress/onboarding
POST /api/progress/assessment
GET /api/progress/onboarding
GET /api/progress/assessment
```

### User Preferences

```http
POST /api/preferences
GET /api/preferences
```

## Data Structure

### Persistence State

```typescript
interface PersistenceState {
  // Waiver and legal state
  serviceWaiver: ServiceWaiverData | null;
  legalConsent: LegalConsentData | null;
  
  // User progress and onboarding
  onboardingProgress: OnboardingProgress;
  assessmentProgress: AssessmentProgress;
  featureAccess: FeatureAccess;
  
  // Interactive elements and cards
  cardStates: Record<string, CardState>;
  componentStates: Record<string, ComponentState>;
  
  // Chat and memory persistence
  chatHistory: ChatHistoryData;
  memoryContext: MemoryContextData;
  
  // User preferences and settings
  userPreferences: UserPreferences;
  uiState: UIStateData;
}
```

### Card State

```typescript
interface CardState {
  isExpanded: boolean;
  isVisible: boolean;
  lastInteraction: string;
  customData?: Record<string, any>;
}
```

### Component State

```typescript
interface ComponentState {
  isVisible: boolean;
  isEnabled: boolean;
  lastState: string;
  customData?: Record<string, any>;
}
```

## Best Practices

### 1. Naming Conventions

- Use descriptive keys for persistence state
- Prefix card states with `card-`
- Prefix component states with `component-`
- Use kebab-case for consistency

### 2. Data Validation

```tsx
const validateUserData = (data) => {
  return data && typeof data.name === 'string' && data.name.length > 0;
};

const { value, setValue } = usePersistentState(
  'user-profile',
  { name: '', email: '' },
  { validate: validateUserData }
);
```

### 3. Error Handling

```tsx
const { value, setValue, isSaving, hasChanges } = usePersistentState(
  'important-data',
  defaultValue
);

useEffect(() => {
  if (hasChanges && !isSaving) {
    // Handle unsaved changes
    console.warn('You have unsaved changes');
  }
}, [hasChanges, isSaving]);
```

### 4. Performance Optimization

```tsx
// Use debouncing for frequent updates
const { setValue } = usePersistentState(
  'search-query',
  '',
  { autoSave: true, saveDelay: 500, debounce: true }
);

// Debounce input changes
const debouncedSetValue = useMemo(
  () => debounce(setValue, 300),
  [setValue]
);
```

## Deployment Considerations

### 1. Environment Variables

```bash
# Database connection
DATABASE_URL="your-database-url"

# Redis for caching (optional)
REDIS_URL="your-redis-url"

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="your-domain"
```

### 2. Database Migrations

```bash
# Run Prisma migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### 3. Storage Limits

- **Local Storage**: ~5-10MB per domain
- **Session Storage**: ~5-10MB per domain
- **Context**: Memory-based, limited by available RAM
- **Backend**: Limited by database storage

### 4. Security Considerations

- All data is user-scoped
- Sensitive data is encrypted in transit
- User authentication required for backend sync
- Data export/import with user consent

## Monitoring and Debugging

### 1. Persistence Dashboard

The PersistenceDashboard component provides real-time visibility into:
- Storage availability and usage
- Backend sync status
- Data summary and statistics
- Manual sync operations

### 2. Console Logging

```typescript
// Enable debug logging
const DEBUG_PERSISTENCE = process.env.NODE_ENV === 'development';

if (DEBUG_PERSISTENCE) {
  console.log('Persistence operation:', { key, value, timestamp });
}
```

### 3. Error Tracking

```typescript
// Track persistence errors
const handlePersistenceError = (error, context) => {
  console.error('Persistence error:', { error, context });
  
  // Send to error tracking service
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'persistence_error', {
      error_message: error.message,
      context: context
    });
  }
};
```

## Troubleshooting

### Common Issues

1. **Storage Quota Exceeded**
   - Clear old data
   - Implement data rotation
   - Use backend storage for large datasets

2. **Backend Sync Failures**
   - Check network connectivity
   - Verify authentication
   - Review API endpoint status

3. **Data Corruption**
   - Validate data structure
   - Implement data versioning
   - Provide fallback values

4. **Performance Issues**
   - Reduce auto-save frequency
   - Implement data pagination
   - Use lazy loading for large datasets

### Debug Commands

```typescript
// Check persistence status
const { state, isSyncing } = usePersistence();
console.log('Persistence state:', state);

// Force manual sync
const { syncWithBackend } = usePersistence();
await syncWithBackend();

// Export current state
const { exportData } = usePersistence();
const data = exportData();
console.log('Exported data:', data);
```

## Future Enhancements

### 1. Advanced Features

- **Real-time Collaboration** - Multi-user persistence
- **Data Versioning** - Track changes over time
- **Conflict Resolution** - Advanced merge strategies
- **Compression** - Reduce storage footprint

### 2. Integration Opportunities

- **Analytics** - Track user behavior patterns
- **Machine Learning** - Predictive data management
- **Blockchain** - Immutable audit trails
- **Edge Computing** - Distributed persistence

### 3. Performance Improvements

- **Web Workers** - Background synchronization
- **Service Workers** - Offline persistence
- **IndexedDB** - Large dataset storage
- **WebAssembly** - Fast data processing

## Conclusion

The Comprehensive Persistence System provides a robust foundation for maintaining user state and progress throughout the Luna AI application. With its multi-layer storage approach, automatic synchronization, and user-friendly interface, it ensures that users never lose their progress and can seamlessly continue their experience across devices and sessions.

For questions or support, refer to the development team or consult the API documentation for specific implementation details.

