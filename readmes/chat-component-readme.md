# ChatGPT-Style Chat Components

This directory contains a complete set of React components that replicate ChatGPT's exact message system, typography, and animations.

## Components Overview

### Core Components

#### `Message.tsx`
The main message component that renders both AI and user messages with exact ChatGPT styling.

**Features:**
- AI messages: Full-width markdown blocks with prose styling
- User messages: Right-aligned bubbles with max-width constraints
- Streaming animation for AI responses
- Hover toolbar (copy, regenerate, thumbs up/down)
- Exact typography: Inter font, 15px, 1.6 line-height

#### `ChatWindow.tsx`
The main chat container with scroll anchoring and floating scroll-to-bottom button.

**Features:**
- Auto-scroll to bottom for new messages
- Smart scroll detection (pauses when user scrolls up)
- Scroll-to-bottom floating button
- Exact spacing and padding matching ChatGPT
- Max-width centering (48rem)

#### `InputBar.tsx`
The input bar with auto-resize functionality and OpenAI-style controls.

**Features:**
- Auto-resizing textarea (44px → 200px max height)
- Left: "+" button (for attachments)
- Right: Microphone + Voice toggle (purple icon)
- Enter to submit, Shift+Enter for new line
- Exact styling matching ChatGPT

#### `ScrollToBottom.tsx`
Floating button that appears when user scrolls up, exactly like ChatGPT.

#### `TypingIndicator.tsx`
Three-dot pulse animation that appears while AI is generating.

### Hooks

#### `useScrollAnchor.ts`
Smart scroll management that replicates ChatGPT's behavior:
- Auto-scrolls to bottom for new messages
- Pauses when user scrolls up
- Re-enables when user scrolls back to bottom
- 20px threshold for "at bottom" detection

## Usage Example

```tsx
import ChatWindow from './components/chat/ChatWindow';
import InputBar from './components/chat/InputBar';

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');

    // Start streaming response
    setIsStreaming(true);

    // Your API call here
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: input })
    });

    // Handle streaming response...
  };

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e]">
      <ChatWindow
        messages={messages}
        isStreaming={isStreaming}
      />
      <InputBar
        value={input}
        setValue={setInput}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
```

## Styling & Animations

Add these animations to your `globals.css`:

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.2s cubic-bezier(0.2, 0.8, 0.4, 1);
}

@keyframes pulseDot {
  0%, 80%, 100% { transform: scale(1); opacity: 0.6; }
  40% { transform: scale(1.4); opacity: 1; }
}
.animate-pulseDot {
  animation: pulseDot 1.2s infinite;
}
```

## Exact ChatGPT Specifications Implemented

### Typography
- **Font**: Inter (system sans-serif)
- **Size**: text-[15px]
- **Line Height**: leading-[1.6]
- **AI Messages**: text-gray-100 with prose styling
- **User Messages**: text-white with font-medium weight

### Spacing
- **Message Gap**: mb-4 (16px)
- **Container Padding**: px-4 sm:px-6 md:px-8 py-6
- **Max Width**: max-w-[48rem] (768px)
- **User Bubble Max**: max-w-[75%]

### Animations
- **Message Entry**: fadeIn with translateY(4px)
- **Duration**: 200ms with cubic-bezier(0.2, 0.8, 0.4, 1)
- **Streaming**: Token-by-token at ~20ms intervals
- **Toolbar**: opacity-0 → opacity-100 on hover
- **Typing Dots**: Staggered pulse animation

### Colors (Exact ChatGPT)
- **Background**: bg-[#1e1e1e]
- **AI Messages**: text-gray-100 with prose styling
- **User Bubbles**: bg-[#2a2a2a] text-white
- **Input Bar**: bg-[#2a2a2a] with focus:ring-purple-500/50
- **Typing Indicator**: bg-[#2a2a2a] with pulsing dots
- **Toolbar**: neutral-800 background on hover

### Interactive Elements
- **Hover Toolbar**: Positioned top-right of AI messages
- **Copy Button**: Copies raw content to clipboard
- **Scroll Button**: Appears at bottom-24 when scrolled up
- **Input Resize**: Auto-expands from 44px to 200px max
- **Enter Submit**: Shift+Enter for new line, Enter to submit

## Demo Component

Use `ChatGPTDemo.tsx` to see all components working together with simulated streaming:

```tsx
import ChatGPTDemo from './components/chat/ChatGPTDemo';

function App() {
  return <ChatGPTDemo />;
}
```

This will show you the exact ChatGPT experience with all animations, scroll behavior, and styling working perfectly together.

