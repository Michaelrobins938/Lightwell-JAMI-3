# 🧩 ChatGPT-5 UI Clone (1:1 Parity) — Complete Integration Guide

This project is a **modular, plug-and-play clone of ChatGPT-5's interface** designed for **web, desktop, and mobile deployment**. Every feature from the official app is broken into self-contained modules that can be reused across platforms.

## 📂 Project Structure & Architecture

```
src/
 ├─ components/
 │   ├─ AppShell.tsx              # Global frame: sidebar + header + chat + input bar
 │   ├─ sidebar/                  # Left column components
 │   │   ├─ Sidebar.tsx           # Main sidebar wrapper
 │   │   ├─ ChatHistoryList.tsx   # Past conversations list
 │   │   ├─ ChatHistoryItem.tsx   # Individual chat row
 │   │   └─ SidebarFooter.tsx     # Profile, settings, upgrade
 │   ├─ header/                   # Top bar components
 │   │   ├─ Header.tsx            # Header container
 │   │   ├─ ModelSelector.tsx     # GPT-4o, GPT-5 dropdown
 │   │   ├─ ShareButton.tsx       # Share modal trigger
 │   │   └─ OverflowMenu.tsx      # Three-dots menu
 │   ├─ chat-window/              # Main conversation area
 │   │   ├─ ChatWindow.tsx        # Messages container
 │   │   ├─ ChatMessage.tsx       # Individual message bubble
 │   │   ├─ MarkdownRenderer.tsx  # Markdown formatting
 │   │   ├─ CodeBlock.tsx         # Syntax highlighting + copy
 │   │   └─ MessageActions.tsx    # Thumbs up/down feedback
 │   ├─ input-bar/                # User input area
 │   │   ├─ ChatInput.tsx         # Text input + send
 │   │   ├─ AttachmentButton.tsx  # + button for files
 │   │   ├─ VoiceButton.tsx       # Mic button
 │   │   └─ AttachmentPreview.tsx # File/audio preview chips
 │   ├─ modals/                   # Secondary overlays
 │   │   ├─ FileModal.tsx         # Upload files/attachments
 │   │   ├─ ConnectorDrawer.tsx   # Google Drive, Notion, Slack
 │   │   ├─ SettingsModal.tsx     # Theme, shortcuts, preferences
 │   │   ├─ UpgradeModal.tsx      # Pricing tiers
 │   │   └─ ProfileDrawer.tsx     # Account management
 │   ├─ voice/                    # Voice mode components
 │   │   ├─ VoiceRecorder.tsx     # Mic capture UI
 │   │   └─ VoiceOverlay.tsx      # Floating voice panel
 │   └─ shared/                   # Reusable atoms
 │       ├─ Icon.tsx              # Icon wrapper (Lucide/Heroicons)
 │       ├─ Button.tsx            # Consistent button styles
 │       └─ Loader.tsx            # Loading spinners
 ├─ hooks/                        # Smart logic layer
 │   ├─ useChat.ts                # Messages, API calls, streaming
 │   ├─ usePlan.ts                # Free/Pro/Enterprise gating
 │   ├─ useModal.ts               # Global modal state management
 │   ├─ useTheme.ts               # Light/dark/system themes
 │   ├─ useVoiceSession.ts        # WebRTC to OpenAI Realtime API
 │   └─ useRecorder.ts            # Browser audio capture
 ├─ lib/
 │   ├─ config.ts                 # API keys, models, plan tiers
 │   ├─ theme.ts                  # Tailwind theme overrides
 │   └─ constants.ts              # Shortcuts, limits, error messages
 ├─ pages/                        # Next.js routes
 │   ├─ chat.tsx                  # Main chat interface
 │   ├─ settings.tsx
 │   ├─ profile.tsx
 │   ├─ upgrade.tsx
 │   └─ about.tsx
 └─ styles/                       # Global CSS + Tailwind
```

## 🔑 Core Integration Principles

### 1. **Dumb Components, Smart Hooks**
- **Components** = pure render functions (no API calls, no state logic)
- **Hooks** = all business logic (streaming, authentication, plan checks)
- **Example**: `ChatWindow` only renders `messages[]`, while `useChat` manages the conversation

### 2. **AppShell as the Glue**
- `AppShell.tsx` wires together Sidebar, Header, ChatWindow, and InputBar
- Acts as the single source of layout and state coordination
- Passes context from hooks down to dumb components

### 3. **Single Source of Configuration**
- All settings live in `lib/config.ts` (API keys, model lists, plan tiers)
- Swap providers (OpenAI → Anthropic) by editing one file
- Environment-specific overrides via `.env.local`

## 🌐 Platform Integration Patterns

### Web (Next.js + TailwindCSS)
```bash
# Install dependencies
npm install

# Add API key
echo "OPENAI_API_KEY=sk-xxxx" > .env.local

# Run development server
npm run dev

# Visit localhost:3000/chat
```

**Result**: Fully functional ChatGPT-style web UI with all features.

### Desktop (Electron Wrapper)
```bash
# Build web assets
npm run build

# Launch with Electron
npm run desktop
```

**Features Added**:
- System tray icon
- Global hotkey (Cmd+Shift+Space)
- Native file picker dialogs
- Same UI as web, packaged as DMG/EXE

### Mobile (React Native + Expo)
```bash
cd mobile
npm install
npx expo start
```

**Platform Differences**:
- Sidebar → slide-in drawer
- Input bar → always pinned to bottom
- Floating "+" button opens file/voice modal
- Bottom tab navigation: Chats | Explore | Settings | Profile
- Voice → press-and-hold mic with native API

## 🗂️ Module Assembly Instructions (IKEA-Style)

### Step 1: Global Shell + Layout
**File**: `src/components/AppShell.tsx`

```tsx
export default function AppShell() {
  const { messages, sendMessage } = useChat();
  const { isVoiceActive } = useVoiceSession();

  return (
    <div className="h-screen flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />
        <ChatWindow messages={messages} />
        <InputBar onSend={sendMessage} isVoiceActive={isVoiceActive} />
      </div>

      {/* Modals */}
      <ModalManager />
    </div>
  );
}
```

**Purpose**: Creates the skeleton that all other components bolt onto.

### Step 2: Wire the Brain (Hooks)
**File**: `src/pages/chat.tsx`

```tsx
import AppShell from '../components/AppShell';

export default function ChatPage() {
  return (
    <ChatProvider>
      <ModalProvider>
        <ThemeProvider>
          <AppShell />
        </ThemeProvider>
      </ModalProvider>
    </ChatProvider>
  );
}
```

**At this stage**: UI renders empty boxes. No functionality yet.

### Step 3: Attach Sidebar
**Wire into**: `AppShell.tsx`

```tsx
import { useChat } from '../hooks/useChat';

function AppShell() {
  const { chats, createNewChat } = useChat();

  return (
    <div>
      <Sidebar chats={chats} onNewChat={createNewChat} />
      {/* ... rest of layout */}
    </div>
  );
}
```

**Behavior**: Sidebar shows chat history, new chat button works.

### Step 4: Attach Header
**Wire into**: `AppShell.tsx`

```tsx
function AppShell() {
  const { activeModel, setActiveModel } = useChat();
  const { openModal } = useModal();

  return (
    <div>
      <Header
        activeModel={activeModel}
        onModelChange={setActiveModel}
        onShare={() => openModal('share')}
        onSettings={() => openModal('settings')}
      />
      {/* ... rest of layout */}
    </div>
  );
}
```

**Behavior**: Model selector, share button, overflow menu functional.

### Step 5: Implement Chat Core
**Wire into**: `AppShell.tsx`

```tsx
function AppShell() {
  const { messages, sendMessage, isStreaming } = useChat();

  return (
    <div>
      <ChatWindow messages={messages} isStreaming={isStreaming} />
      <InputBar onSend={sendMessage} />
    </div>
  );
}
```

**Behavior**: Text conversations work, markdown renders, streaming text.

### Step 6: Add File Attachments
**Wire into**: `InputBar` + `useChat`

```tsx
// In InputBar
<AttachmentButton onFileSelect={handleFileSelect} />

// In useChat
function sendMessage(text: string, files?: File[]) {
  // Upload files, attach to message
  const attachments = await uploadFiles(files);
  // Send to API with attachments
}
```

**Behavior**: File uploads, preview chips, drag-and-drop.

### Step 7: Add Voice Mode
**Wire into**: `InputBar` + new hooks

```tsx
// In InputBar
<VoiceButton onClick={() => setVoiceActive(true)} />

// In AppShell
{isVoiceActive && (
  <VoiceOverlay
    onStop={handleVoiceStop}
    transcript={voiceTranscript}
  />
)}
```

**Behavior**: Mic capture, realtime transcription, audio playback.

### Step 8: Add All Modals
**Wire into**: `ModalManager` component

```tsx
function ModalManager() {
  const { activeModal, closeModal } = useModal();

  return (
    <>
      {activeModal === 'settings' && <SettingsModal onClose={closeModal} />}
      {activeModal === 'profile' && <ProfileDrawer onClose={closeModal} />}
      {activeModal === 'upgrade' && <UpgradeModal onClose={closeModal} />}
      {activeModal === 'file' && <FileModal onClose={closeModal} />}
    </>
  );
}
```

**Behavior**: All secondary screens (settings, profile, upgrade) functional.

### Step 9: Polish & Plan Gating
**Wire into**: `usePlan` hook

```tsx
function AppShell() {
  const { userPlan, hasFeature } = usePlan();

  return (
    <div>
      {hasFeature('voice') && <VoiceButton />}
      {hasFeature('gpt5') && <ModelSelector />}
      {/* ... conditional rendering based on plan */}
    </div>
  );
}
```

**Behavior**: Free/Pro/Enterprise feature toggles.

## 🎙️🔊 Voice Mode Deep Integration (OpenAI Realtime API)

### Parts Required
- `useVoiceSession.ts` — WebRTC connection management
- `useRecorder.ts` — Browser audio capture
- `useAudioPlayer.ts` — Playback of assistant audio
- `VoiceButton.tsx` + `VoiceOverlay.tsx` — UI controls

### Step-by-Step Voice Assembly

#### 1. Add Voice Button
```tsx
// input-bar/VoiceButton.tsx
export default function VoiceButton({ onClick }) {
  return (
    <button onClick={onClick}>
      <MicIcon />
    </button>
  );
}
```

#### 2. Create Voice Overlay
```tsx
// voice/VoiceOverlay.tsx
export default function VoiceOverlay({ transcript, onStop, isAssistantSpeaking }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <WaveformVisualizer />
        <p className="text-lg">{transcript}</p>
        {isAssistantSpeaking && <p>Assistant speaking...</p>}
        <button onClick={onStop}>Stop Recording</button>
      </div>
    </div>
  );
}
```

#### 3. Implement Audio Recorder
```tsx
// hooks/useRecorder.ts
export function useRecorder() {
  const [stream, setStream] = useState<MediaStream | null>(null);

  async function start() {
    const mic = await navigator.mediaDevices.getUserMedia({
      audio: { sampleRate: 16000, channelCount: 1 }
    });
    setStream(mic);
    return mic;
  }

  function stop() {
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);
  }

  return { start, stop, stream };
}
```

#### 4. Implement Voice Session (WebRTC)
```tsx
// hooks/useVoiceSession.ts
export function useVoiceSession() {
  const pc = useRef<RTCPeerConnection | null>(null);
  const [transcript, setTranscript] = useState("");
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);

  async function connect(micStream: MediaStream) {
    pc.current = new RTCPeerConnection();

    // Add microphone track
    pc.current.addTrack(micStream.getTracks()[0], micStream);

    // Listen for assistant's audio track
    pc.current.ontrack = (event) => {
      const remoteStream = event.streams[0];
      setIsAssistantSpeaking(true);
      // Play remote audio stream
      playAudioStream(remoteStream);
    };

    // Create data channel for transcript events
    const dc = pc.current.createDataChannel("oai-events");
    dc.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "response.text.delta") {
        setTranscript(prev => prev + msg.delta);
      } else if (msg.type === "response.text.completed") {
        // Final transcript ready
        onFinalTranscript(msg.text);
      }
    };

    // Create WebRTC offer
    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(offer);

    // Get short-lived token from server
    const tokenResp = await fetch('/api/session');
    const { client_secret } = await tokenResp.json();

    // Send offer to OpenAI Realtime API
    const response = await fetch(
      `https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${client_secret}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sdp: offer.sdp,
          type: offer.type
        })
      }
    );

    const answer = await response.json();
    await pc.current.setRemoteDescription(answer);
  }

  function disconnect() {
    pc.current?.close();
    pc.current = null;
    setTranscript("");
    setIsAssistantSpeaking(false);
  }

  return { connect, disconnect, transcript, isAssistantSpeaking };
}
```

#### 5. Add Audio Playback Hook
```tsx
// hooks/useAudioPlayer.ts
export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function playStream(stream: MediaStream) {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.autoplay = true;
    }
    audioRef.current.srcObject = stream;
    audioRef.current.play();
  }

  function stop() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.srcObject = null;
    }
  }

  return { playStream, stop };
}
```

#### 6. Wire Voice into Main App
```tsx
// In AppShell.tsx or main chat component
function ChatContainer() {
  const { start, stop, stream } = useRecorder();
  const { connect, disconnect, transcript, isAssistantSpeaking } = useVoiceSession();
  const { sendMessage } = useChat();
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  async function startVoiceRecording() {
    const micStream = await start();
    setIsVoiceActive(true);
    await connect(micStream);
  }

  function stopVoiceRecording() {
    stop();
    disconnect();
    setIsVoiceActive(false);
    // Send final transcript as message
    if (transcript) {
      sendMessage(transcript);
    }
  }

  return (
    <div>
      <InputBar
        onVoiceClick={startVoiceRecording}
        hasVoice={true}
      />

      {isVoiceActive && (
        <VoiceOverlay
          transcript={transcript}
          onStop={stopVoiceRecording}
          isAssistantSpeaking={isAssistantSpeaking}
        />
      )}
    </div>
  );
}
```

## 📐 Complete Voice Flow Blueprint

```
User Action: Tap Mic
     ↓
VoiceButton → startVoiceRecording()
     ↓
useRecorder.start() → getUserMedia()
     ↓
useVoiceSession.connect(micStream)
     ↓
WebRTC Session Established
     ↓
Audio Streams Bidirectionally
     ↓
OpenAI Realtime API
     ↙          ↘
Transcript Deltas    Assistant Audio
     ↓          ↓
VoiceOverlay       useAudioPlayer
     ↓          ↓
Live Text Display  Speaker Output
     ↓
User: "Stop"
     ↓
Final Transcript → useChat.sendMessage()
     ↓
ChatWindow (text conversation continues)
```

## ✅ Final 1:1 Parity Checklist

### Core Features
- [ ] Sidebar resizes + collapses on mobile
- [ ] Header with model selector, share, overflow menu
- [ ] Input bar floats initially, pins after first message
- [ ] Token-by-token streaming text
- [ ] Markdown + code blocks with copy button
- [ ] File upload + preview chips
- [ ] Voice recording + realtime transcription
- [ ] All modals: settings, profile, upgrade, connectors
- [ ] Plan gating: Free vs Pro vs Enterprise
- [ ] Theme switching: light/dark/system
- [ ] Keyboard shortcuts modal

### Voice Mode Specific
- [ ] Mic permission request
- [ ] WebRTC session to OpenAI Realtime
- [ ] Live transcript display
- [ ] Assistant audio playback
- [ ] Session cleanup on stop
- [ ] Final transcript injection into chat

## 🧭 Mental Model for Agents

**Hooks = Brain**: All logic, API calls, state management
**Components = Face**: Pure render functions, receive props only
**AppShell = Skeleton**: Wires everything together
**Config = DNA**: Single source of truth for all settings
**Web/Desktop/Mobile = Different Bodies**: Same brain/face, different skin

## 📝 Rules for AI Agents (Refactoring/Extending)

1. **Always specify the target module** in requests
   - Example: *"Add video attachment support in `AttachmentPreview.tsx` and extend `useChat.ts`"*

2. **Keep UI components dumb, hooks smart**
   - Never put API calls or state logic in components
   - Components should be pure functions of props

3. **Follow the export convention**
   - Each folder has `index.ts` that re-exports its parts
   - Use default exports for main components

4. **No placeholders, everything functional**
   - Every component, hook, and config must be immediately usable

5. **Single responsibility principle**
   - One component/hook does one thing well
   - Compose complex behavior from simple parts

## 🚀 Deployment & Distribution

### Web Deployment
```bash
# Build optimized bundle
npm run build

# Deploy to Vercel/Netlify
vercel --prod
```

### Desktop Packaging
```bash
# Build web assets
npm run build

# Package with Electron
npm run electron:build

# Results: DMG (macOS), EXE (Windows), AppImage (Linux)
```

### Mobile Build
```bash
# React Native + Expo
cd mobile
npx expo build:ios
npx expo build:android

# Results: IPA (iOS), APK (Android)
```

## 🔄 Maintenance & Extension Patterns

### Adding New Features
1. **Identify the right module** (UI, hook, or config)
2. **Extend the hook** with new logic
3. **Pass data down** through AppShell to components
4. **Update config** if needed
5. **Test across platforms**

### Common Extension Patterns
- **New AI model** → Update `lib/config.ts` + `ModelSelector.tsx`
- **New attachment type** → Extend `AttachmentPreview.tsx` + `useChat.ts`
- **New modal** → Add to `modals/` folder + `useModal.ts`
- **New plan feature** → Update `usePlan.ts` + conditional rendering

## 📚 Further Reading

- [OpenAI Realtime API Documentation](https://platform.openai.com/docs/guides/realtime)
- [WebRTC MDN Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

This integration guide serves as your **IKEA instruction manual** for the ChatGPT-5 clone. Each component is a LEGO brick that snaps together following these patterns. When extending the system, always follow the **dumb components, smart hooks** principle and keep the AppShell as your central wiring point.
