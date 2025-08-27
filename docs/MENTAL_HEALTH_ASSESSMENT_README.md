# Mental Health Assessment Onboarding System

## Overview

The Mental Health Assessment Onboarding System is a critical safety and personalization feature that blocks access to the Jamie AI chat interface until users complete a comprehensive mental health assessment. This system serves two primary purposes:

1. **Safety & Crisis Prevention**: Identifies users who may need immediate clinical intervention
2. **Personalization**: Provides Jamie AI with essential context to tailor responses and recommendations

## System Architecture

### Components

#### 1. AssessmentGate Component (`src/components/chat/AssessmentGate.tsx`)
- **Purpose**: Blocks access to chat interface until assessment completion
- **Features**:
  - Welcoming onboarding experience
  - Clear explanation of assessment purpose
  - Professional, clinical appearance
  - Crisis detection integration

#### 2. CrisisIntervention Component (`src/components/chat/CrisisIntervention.tsx`)
- **Purpose**: Provides immediate support for high-risk users
- **Features**:
  - Crisis hotline information (988, 911)
  - Self-help strategies
  - Safety planning resources
  - Professional escalation options

#### 3. AdaptiveAssessment Component (`src/components/onboarding/AdaptiveAssessment.tsx`)
- **Purpose**: Core assessment engine using IRT (Item Response Theory)
- **Features**:
  - Dynamic question selection
  - Real-time scoring
  - Crisis detection algorithms
  - Progress tracking

### Assessment Questions

The onboarding assessment includes validated clinical scales:

- **PHQ-9**: Depression screening (2 questions)
- **GAD-7**: Anxiety screening (2 questions)  
- **PSS**: Stress assessment (1 question)
- **Crisis Screening**: Suicidal ideation assessment (1 question)

### Data Flow

```
User Access → AssessmentGate → AdaptiveAssessment → Database Storage → Jamie AI Context
                ↓
        Crisis Detection → CrisisIntervention (if needed)
```

## Implementation Details

### Assessment Gate Integration

The `ChatGPTInterface` component now includes:

```typescript
// Assessment gate state
const [showAssessmentGate, setShowAssessmentGate] = useState(true);
const [assessmentCompleted, setAssessmentCompleted] = useState(false);
const [userProfile, setUserProfile] = useState<any>(null);
const [showCrisisIntervention, setShowCrisisIntervention] = useState(false);
const [crisisData, setCrisisData] = useState<any>(null);
```

### Access Control

The chat interface is completely blocked until assessment completion:

- **Chat Messages Area**: Shows assessment gate message
- **Input Bars**: Hidden during assessment
- **Sidebar**: Accessible but chat functionality blocked
- **Footer**: Hidden during assessment

### Database Integration

Assessment results are stored in the Prisma database:

```sql
model Assessment {
  id             String   @id @default(cuid())
  userId         String
  type           String   // 'comprehensive', 'phq-9', 'gad-7', etc.
  answers        String   // JSON string
  score          Int
  severity       String?
  interpretation String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  user           User     @relation(fields: [userId], references: [id])
}
```

### Jamie AI Context Integration

Assessment data is automatically passed to Jamie AI:

```typescript
// Store profile in localStorage for Jamie AI context
localStorage.setItem('jamieUserProfile', JSON.stringify(profile));

// Welcome message tailored to assessment results
const welcomeMessage = `Welcome! I'm Jamie, and I'm here to support you on your mental health journey. Based on your assessment, I understand that you're experiencing ${profile.depressionScore > 10 ? 'some challenges' : 'some stress'}, and I want you to know that you're not alone.`;
```

## Crisis Detection & Response

### Risk Assessment Algorithm

The system automatically detects high-risk responses:

- **Suicidal Ideation**: Immediate crisis intervention
- **Severe Depression/Anxiety**: Professional referral recommendations
- **Moderate Symptoms**: Monitoring and support strategies
- **Low Risk**: Standard personalized support

### Crisis Resources

Immediate access to:

- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **Emergency Services**: 911
- **Local Crisis Centers**: Community-based support

## User Experience Flow

### 1. First Visit
```
Welcome Screen → Assessment Explanation → Begin Assessment → Question Flow → Results
```

### 2. Assessment Completion
```
Results Processing → Database Storage → Jamie AI Context → Chat Unlock → Welcome Message
```

### 3. Crisis Detection
```
High-Risk Response → Crisis Intervention → Immediate Resources → Professional Escalation
```

### 4. Return Visits
```
Profile Check → Assessment Status → Chat Access (if completed) → Personalized Experience
```

## Safety Features

### Immediate Intervention
- **Real-time Crisis Detection**: Monitors responses during assessment
- **Automatic Escalation**: Connects users to crisis resources
- **Safety Planning**: Provides immediate coping strategies

### Professional Standards
- **Clinical Validation**: Uses established screening tools
- **Crisis Protocols**: Follows mental health best practices
- **Referral System**: Connects to appropriate care levels

## Privacy & Security

### Data Protection
- **Local Storage**: Assessment data stored locally for immediate access
- **Database Security**: Results stored with user authentication
- **Confidentiality**: Clear privacy notices and consent

### Ethical Considerations
- **No Diagnosis**: Assessment provides screening, not medical diagnosis
- **Professional Boundaries**: Clear limitations of AI support
- **Informed Consent**: Users understand assessment purpose and data use

## Technical Implementation

### State Management
```typescript
// Assessment completion handler
const handleAssessmentComplete = (profile: any) => {
  setUserProfile(profile);
  setAssessmentCompleted(true);
  setShowAssessmentGate(false);
  
  // Store profile for Jamie AI context
  localStorage.setItem('jamieUserProfile', JSON.stringify(profile));
  
  // Add personalized welcome message
  const welcomeMessage = createWelcomeMessage(profile);
  setMessages([welcomeMessage]);
  setHasStarted(true);
};
```

### API Integration
```typescript
// Store assessment data in database
const response = await fetch('/api/assessments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'comprehensive',
    answers: profile,
    userId: 'current-user'
  })
});
```

## Future Enhancements

### Planned Features
- **Periodic Re-assessment**: Monthly wellness check-ins
- **Progress Tracking**: Longitudinal mental health monitoring
- **Professional Integration**: Direct referral to mental health providers
- **Family Support**: Resources for loved ones of users

### Advanced Analytics
- **Trend Analysis**: Identify patterns in mental health changes
- **Predictive Modeling**: Early intervention recommendations
- **Outcome Measurement**: Track effectiveness of AI support

## Maintenance & Monitoring

### Regular Updates
- **Assessment Validation**: Regular review of question effectiveness
- **Crisis Protocols**: Updated based on best practices
- **Resource Verification**: Ensure crisis resources remain current

### Quality Assurance
- **User Feedback**: Collect assessment experience feedback
- **Clinical Review**: Regular review by mental health professionals
- **Safety Audits**: Monitor crisis detection accuracy

## Conclusion

The Mental Health Assessment Onboarding System represents a significant advancement in AI-powered mental health support, combining safety, personalization, and professional standards. By ensuring every user receives appropriate screening and support, the system helps prevent crises while providing Jamie AI with essential context for meaningful, personalized assistance.

This system demonstrates the project's commitment to user safety and responsible AI development in mental health applications.
