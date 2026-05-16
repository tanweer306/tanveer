# Chat Widget Component Analysis

## Overview
The chat widget is a fully-featured chatbot component built into the portfolio homepage. It's a floating chat interface in the bottom-right corner that supports text messages, file uploads, and audio messages.

---

## 1. Main Chat Widget Component File

**Location:** [src/app/page.tsx](src/app/page.tsx)

This is the main component file. The entire chat widget is integrated into the Next.js page component (not separated into a standalone component file).

### Key Code Sections:
- **Chat State Management:** Lines 101-135
- **Chat Message Handler:** Lines 284-370  
- **Audio Recording Logic:** Lines 372-423
- **Send Audio Message Handler:** Lines 425-484
- **Chat Widget UI Rendering:** Lines 1623-1750+

---

## 2. Audio Message Rendering Location

**File:** [src/app/page.tsx](src/app/page.tsx#L1695-L1710)

**Current Implementation (Lines 1695-1710):**
```tsx
{/* Chat Messages */}
<div className="flex-1 p-4 overflow-y-auto space-y-4" data-oid="messages-container">
  {chatMessages.map((message) => (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${
        message.type === "user" ? "justify-end" : "justify-start"
      }`}
      data-oid="message-item"
    >
      {message.type === "bot" && (
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0" data-oid="bot-avatar">
          <Bot className="w-4 h-4 text-blue-600" data-oid="bot-avatar-icon" />
        </div>
      )}
      <div
        className={`max-w-xs px-4 py-2 rounded-2xl ${
          message.type === "user"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-800"
        }`}
        data-oid="message-bubble"
      >
        <p className="text-sm" data-oid="message-text">
          {message.message}  {/* <- This renders "🎙️ Audio message" for audio */}
        </p>
      </div>
      {message.type === "user" && (
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0" data-oid="user-avatar">
          <User className="w-4 h-4 text-white" data-oid="user-avatar-icon" />
        </div>
      )}
    </motion.div>
  ))}
</div>
```

**Current Behavior:**
- When audio is sent, it displays as: `"🎙️ Audio message"` (hardcoded text)
- No audio playback controls
- No indication of audio duration or format
- No visual distinction from regular text messages

**Where "Audio message" is set:** [Line 434](src/app/page.tsx#L434)
```tsx
const userMessage = {
  id: Date.now(),
  type: "user" as const,
  message: "🎙️ Audio message",  // <- Hardcoded text
  timestamp: new Date()
};
```

---

## 3. Audio Data Structure and Storage

### Message Data Structure

**Type Definition (Implicit in the code):**
```typescript
interface ChatMessage {
  id: number;
  type: "user" | "bot";
  message: string;          // Currently only text
  timestamp: Date;
  // ⚠️ No audioData, audioUrl, audioBlob, or duration fields
}
```

**State:** [Lines 103-112](src/app/page.tsx#L103-L112)
```tsx
const [chatMessages, setChatMessages] = useState([
  {
    id: 1,
    type: "bot",
    message: "Hi! I'm here to help you learn more about my work. How can I assist you today?",
    timestamp: new Date()
  }
]);
```

### Audio Blob Storage (Temporary - Not in Messages)

**Location:** [Lines 118-119](src/app/page.tsx#L118-L119)
```tsx
const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
const [audioMessage, setAudioMessage] = useState("");
```

**Note:** The audio blob is stored separately and NOT included in the chat message. It's only used during the send process.

### Audio Data Flow:

1. **Recording Stage:**
   - Blob created: [Line 390-391](src/app/page.tsx#L390-L391)
   - Stored in: `recordingBlob` state (Blob type)
   - Size limit: None enforced

2. **Sending Stage:** [Lines 425-484](src/app/page.tsx#L425-L484)
   ```tsx
   const formData = new FormData();
   formData.append("audio", recordingBlob, "message.wav");
   formData.append("message", audioMessage || "Voice message");
   formData.append("sessionId", sessionId.current);
   formData.append("timestamp", new Date().toISOString());
   formData.append("type", "audio_message");
   formData.append("language", selectedLanguage);
   ```

3. **Message Structure (After Send):**
   - Only text is stored: `"🎙️ Audio message"`
   - Actual audio blob is NOT stored in chatMessages
   - Server receives the blob but frontend doesn't keep reference

---

## 4. Audio Playback Functionality

**Current Status:** ❌ **NOT IMPLEMENTED**

### What Exists:
- Audio recording via MediaRecorder API
- Audio transmission to webhook
- Audio display as text emoji

### What's Missing:
- ❌ Audio playback controls
- ❌ Audio URL storage
- ❌ Play/pause buttons
- ❌ Audio duration display
- ❌ Audio waveform visualization
- ❌ Download audio functionality
- ❌ Audio format specification (hardcoded as "message.wav")

### Related State Variables:
- [Line 116](src/app/page.tsx#L116): `const [isRecording, setIsRecording]` - Recording state only
- [Line 117](src/app/page.tsx#L117): `const [mediaRecorder, setMediaRecorder]` - MediaRecorder instance
- [Line 186](src/app/page.tsx#L186): `const [recordingTime, setRecordingTime]` - For UI timer display

---

## 5. Webhook Integration

**Webhook Configuration:**
```tsx
const webhookUrl = process.env.NEXT_PUBLIC_CHATBOT_WEBHOOK_URL;

if (webhookUrl && webhookUrl !== "https://your-webhook-url-here.com/api/chat") {
  // Send to webhook
}
```

**Audio Request Format:** [Lines 441-460](src/app/page.tsx#L441-L460)
- Sends FormData with audio blob
- Sends metadata: sessionId, timestamp, language, type: "audio_message"
- Expects JSON response with `data.response` or `data.message`

**Webhook Response Handling:** [Lines 461-479](src/app/page.tsx#L461-L479)
- Creates a bot message from webhook response
- No audio URL is extracted or used for playback

---

## 6. Supported Audio Features

### ✅ Currently Implemented:
- Microphone access via `getUserMedia` API
- Real-time recording with MediaRecorder
- Recording timer display
- Stop/Cancel recording
- Add optional text message with audio
- Language selection (50+ languages)
- Send to webhook with metadata
- Session tracking
- Recording feedback UI with progress bar

### ❌ Not Implemented:
- Audio playback in chat
- Audio URL handling
- Audio file persistence
- Audio download
- Audio re-recording without canceling
- Audio trimming/editing
- Audio format conversion
- Audio quality selection

---

## 7. Related Files and Dependencies

### Imports:
```tsx
import { Mic, Paperclip, MessageCircle, Minimize2, Bot, User, Send, X, Globe } from "lucide-react";
```

### Required Packages:
- `framer-motion` - For animations
- `lucide-react` - For UI icons
- Built-in APIs: MediaRecorder, getUserMedia, FormData

### Environment Variables:
```
NEXT_PUBLIC_CHATBOT_WEBHOOK_URL - Webhook endpoint
NEXT_PUBLIC_CHATBOT_API_KEY - Optional bearer token
```

---

## 8. Key Implementation Details

### Recording Settings:
- **Format:** WAV (hardcoded as "message.wav")
- **Codec:** Browser default (usually PCM)
- **Sample Rate:** Browser default (usually 48kHz or 44.1kHz)
- **Channels:** Mono (typical browser default)

### Modal Components:
1. **Audio Recording Modal:** [Lines 2000-2100](src/app/page.tsx#L2000-L2100)
2. **File Upload Modal:** [Lines 1940-1999](src/app/page.tsx#L1940-L1999)

### Chat Widget Configuration:
- **Position:** Fixed bottom-right (Line 1615)
- **Default Size:** 320px wide × 500px tall
- **Resizable:** Yes (handles all 8 directions)
- **Size Constraints:** 280px-600px width, 400px-800px height

---

## Summary of Findings

| Aspect | Status | Notes |
|--------|--------|-------|
| Chat Widget Component | ✅ Complete | Integrated in page.tsx |
| Audio Recording | ✅ Complete | MediaRecorder based |
| Audio Message Display | ⚠️ Partial | Only text emoji shown |
| Audio Data Structure | ❌ Limited | No audio metadata in messages |
| Audio Playback | ❌ Missing | Not implemented |
| Audio Storage | ⚠️ Temporary | Only stored during send process |
| Webhook Integration | ✅ Complete | Full FormData support |
| UI/UX | ✅ Good | Smooth animations & responsive |

---

## Next Steps for Implementation

To add audio playback functionality, you would need to:

1. **Modify Message Interface** - Add audio-related fields
2. **Store Audio URLs** - Return from webhook or use blob URLs
3. **Add Playback UI** - Audio player component in message bubbles
4. **Handle Audio Events** - Play, pause, seek, volume
5. **Update Message Rendering** - Conditional rendering for audio messages

See the other documentation for detailed implementation steps.
