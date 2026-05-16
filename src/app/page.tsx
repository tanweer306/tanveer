"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fallbackData } from "./portfolioData";
import { useTheme } from "./ThemeProvider";
import { Mic, Paperclip, MessageCircle, Minimize2, Bot, User, Send, X, Globe, Play, Pause, Volume2, Download } from "lucide-react";

/**
 * Portfolio Data Structure
 *
 * This component loads portfolio data from /portfolio-data.json
 *
 * JSON Structure:
 * {
 *   hero: { name, title, bio, profileImage, resumeUrl, social: { github, linkedin, twitter, email } }
 *   skills: { languages: [], frameworks: [], tools: [], design: [] }
 *   experience: [{ company, role, duration, location, responsibilities: [], achievements: [], technologies: [] }]
 *   education: [{ degree, institution, duration, gpa?, relevantCourses?: [], achievements?: [] }]
 *   projects: [{ name, description, image, technologies: [], liveUrl?, githubUrl?, featured: boolean }]
 *   contact: { email, phone, location, availability, social: {} }
 * }
 *
 * To customize your portfolio:
 * 1. Edit /public/portfolio-data.json
 * 2. Replace URLs with your own images (use Unsplash, Imgur, or your own hosting)
 * 3. Add/remove entries from arrays (projects, experience, etc.)
 * 4. All fields are optional except for the main structure
 */

interface PortfolioData {
  hero: {
    name: string;
    title: string;
    bio: string;
    aboutMe?: string;
    recommendationImage?: string;
    profileImage: string;
    resumeUrl?: string;
    social: {
      github?: string;
      linkedin?: string;
      twitter?: string;
      email?: string;
    };
  };
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    design: string[];
  };
  experienceTagline?: string;
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    location: string;
    responsibilities: string[];
    achievements: string[];
    technologies: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    duration: string;
    gpa?: string;
    relevantCourses?: string[];
    achievements?: string[];
    courses?: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    image: string;
    technologies: string[];
    liveUrl?: string;
    githubUrl?: string;
    featured: boolean;
  }>;
  contact: {
    email: string;
    phone?: string;
    location: string;
    availability: string;
    social: {
      github?: string;
      linkedin?: string;
      twitter?: string;
    };
  };
}

// Chat message interface with audio support
interface ChatMessage {
  id: number;
  type: "user" | "bot";
  message: string;
  timestamp: Date;
  audioUrl?: string;
  audioDuration?: number;
  isLoading?: boolean;
}

// Audio Player Component for displaying audio with playback controls
// Supports both .mp3 and .mpga formats (which are essentially the same)
function AudioPlayer({
  audioUrl,
  duration,
  isUserMessage
}: {
  audioUrl: string;
  duration?: number;
  isUserMessage: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [displayDuration, setDisplayDuration] = useState(duration || 0);
  const [loadError, setLoadError] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    console.log("AudioPlayer mounted with URL:", audioUrl);
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Play error:", error);
          setLoadError("Play failed: " + error.message);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDisplayDuration(audioRef.current.duration);
      setLoadError("");
      console.log("Audio loaded successfully, duration:", audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleAudioError = (e: any) => {
    const errorMsg = e.target?.error?.message || "Unknown error";
    console.error("Audio error:", errorMsg, e);
    setLoadError("Error: " + errorMsg);
    setIsPlaying(false);
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    try {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `audio-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download error:", err);
      alert("Unable to download audio");
    }
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loadError) {
    return (
      <div className={`flex flex-col gap-2 p-3 rounded-lg ${
        isUserMessage ? "bg-blue-500/20" : "bg-gray-200/50"
      }`}>
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-xs text-red-600">{loadError}</span>
        </div>
        <button
          onClick={downloadAudio}
          className="text-xs bg-red-50 hover:bg-red-100 text-red-700 px-2 py-1 rounded transition-colors"
        >
          Try Download Instead
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 p-3 rounded-lg ${
      isUserMessage ? "bg-blue-500/20" : "bg-gray-200/50"
    }`}>
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlayPause}
          className={`p-2 rounded-full transition-colors flex-shrink-0 ${
            isUserMessage
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-300 hover:bg-gray-400 text-gray-800"
          }`}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <input
            type="range"
            min="0"
            max={displayDuration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            className="w-full h-1 bg-gray-300 rounded cursor-pointer accent-blue-600"
            title="Seek audio"
          />
        </div>

        <span className={`text-xs font-medium whitespace-nowrap flex-shrink-0 ${
          isUserMessage ? "text-blue-800" : "text-gray-700"
        }`}>
          {formatTime(currentTime)} / {formatTime(displayDuration)}
        </span>

        <button
          onClick={downloadAudio}
          className="p-2 rounded-full transition-colors flex-shrink-0 hover:bg-gray-300"
          title="Download audio"
        >
          <Download className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={handleAudioError}
        onCanPlay={() => console.log("Audio can play")}
        onLoadStart={() => console.log("Audio loading started")}
        crossOrigin="anonymous"
        preload="metadata"
      >
        {/* Support both .mp3 and .mpga (which is MPEG-1 audio) */}
        <source src={audioUrl} type="audio/mpeg" />
        {/* Fallback for alternative formats */}
        <source src={audioUrl} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

// Helper function to detect RTL languages
function isRTLLanguage(languageCode: string): boolean {
  const rtlLanguages = ['ar', 'ur', 'fa', 'he', 'yi', 'ji', 'iw', 'ps', 'sd'];
  return rtlLanguages.includes(languageCode.toLowerCase());
}

export default function Page() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("home");
  const { theme, toggleTheme } = useTheme();

  // Chat widget states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: "bot",
      message:
        "Hi! I'm here to help you learn more about my work. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [showAudioRecordModal, setShowAudioRecordModal] = useState(false);
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  // 50 Most common languages
  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "zh", name: "Chinese (Simplified)" },
    { code: "zh-TW", name: "Chinese (Traditional)" },
    { code: "ko", name: "Korean" },
    { code: "ar", name: "Arabic" },
    { code: "ur", name: "Urdu" },
    { code: "hi", name: "Hindi" },
    { code: "bn", name: "Bengali" },
    { code: "pa", name: "Punjabi" },
    { code: "te", name: "Telugu" },
    { code: "mr", name: "Marathi" },
    { code: "ta", name: "Tamil" },
    { code: "gu", name: "Gujarati" },
    { code: "kn", name: "Kannada" },
    { code: "ml", name: "Malayalam" },
    { code: "th", name: "Thai" },
    { code: "vi", name: "Vietnamese" },
    { code: "id", name: "Indonesian" },
    { code: "ms", name: "Malay" },
    { code: "pl", name: "Polish" },
    { code: "uk", name: "Ukrainian" },
    { code: "tr", name: "Turkish" },
    { code: "el", name: "Greek" },
    { code: "cs", name: "Czech" },
    { code: "sk", name: "Slovak" },
    { code: "hu", name: "Hungarian" },
    { code: "ro", name: "Romanian" },
    { code: "bg", name: "Bulgarian" },
    { code: "hr", name: "Croatian" },
    { code: "sr", name: "Serbian" },
    { code: "sl", name: "Slovenian" },
    { code: "sv", name: "Swedish" },
    { code: "no", name: "Norwegian" },
    { code: "da", name: "Danish" },
    { code: "fi", name: "Finnish" },
    { code: "nl", name: "Dutch" },
    { code: "be", name: "Belgian" },
    { code: "ca", name: "Catalan" },
    { code: "he", name: "Hebrew" },
    { code: "fa", name: "Persian" },
    { code: "sw", name: "Swahili" },
    { code: "af", name: "Afrikaans" },
    { code: "sq", name: "Albanian" }
  ];
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileMessage, setFileMessage] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioMessage, setAudioMessage] = useState("");
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatSize, setChatSize] = useState({ width: 320, height: 500 });
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef({
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0
  });
  const sessionId = useRef(
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let cancelled = false;

    // Fetch portfolio data
    const loadData = async () => {
      try {
        console.log("Fetching portfolio data from /portfolio-data.json...");

        // Set a timeout to detect if loading takes too long
        timeoutId = setTimeout(() => {
          if (!cancelled) {
            console.error("Fetch timeout after 10 seconds");
            console.warn("Using fallback data due to timeout");
            setData(fallbackData as PortfolioData);
            setLoading(false);
          }
        }, 10000);

        const res = await fetch("/portfolio-data.json", {
          cache: "no-store",
        });

        clearTimeout(timeoutId);

        if (cancelled) return;

        if (!res.ok) {
          throw new Error(
            `Failed to load portfolio data: ${res.status} ${res.statusText}`,
          );
        }

        const jsonData = await res.json();
        console.log("Portfolio data loaded successfully!", jsonData);
        setData(jsonData);
        setLoading(false);
      } catch (err) {
        if (timeoutId) clearTimeout(timeoutId);
        if (cancelled) return;
        console.error("Error loading portfolio data:", err);
        console.warn("Using fallback data instead");
        // Use fallback data instead of showing error
        setData(fallbackData as PortfolioData);
        setLoading(false);
        // setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    loadData();

    // Handle scroll for active section
    const handleScroll = () => {
      const sections = [
        "home",
        "about",
        "skills",
        "experience",
        "education",
        "projects",
        "contact",
      ];

      const scrollPos = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Chat widget handler functions
  const sendChatMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: "user",
      message: messageText,
      timestamp: new Date()
    };

    setChatMessages((prev) => [...prev, userMessage]);

    // Create a loading message with unique ID to replace later
    const loadingMessageId = Date.now() + 1;
    const loadingMessage: ChatMessage = {
      id: loadingMessageId,
      type: "bot",
      message: "Thinking...",
      timestamp: new Date(),
      isLoading: true
    };
    setChatMessages((prev) => [...prev, loadingMessage]);
    setIsWaitingForResponse(true);

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_CHATBOT_WEBHOOK_URL;

      if (
        webhookUrl &&
        webhookUrl !== "https://your-webhook-url-here.com/api/chat"
      ) {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(process.env.NEXT_PUBLIC_CHATBOT_API_KEY && {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_CHATBOT_API_KEY}`
            })
          },
          body: JSON.stringify({
            type: "text_message",
            message: messageText,
            context: "Portfolio",
            timestamp: new Date().toISOString(),
            sessionId: sessionId.current,
            language: selectedLanguage
          })
        });

        if (response.ok) {
          try {
            const contentType = response.headers.get("content-type");
            let data: any = {};
            
            // Only try to parse JSON if content-type indicates JSON
            if (contentType && contentType.includes("application/json")) {
              data = await response.json();
            } else {
              // Try to parse anyway, but catch errors gracefully
              const text = await response.text();
              if (text.trim()) {
                try {
                  data = JSON.parse(text);
                } catch (e) {
                  console.warn("Response is not valid JSON:", text);
                  data = {};
                }
              }
            }

            console.log("Bot response received:", data);

            // Process audio URL if present
            let audioUrl = data.audioUrl || data.audio_url;
            if (audioUrl && typeof audioUrl === 'string') {
              // If it's a base64 audio, convert to blob URL
              if (audioUrl.startsWith('data:audio')) {
                console.log("Converting base64 audio to blob URL");
                try {
                  const arr = audioUrl.split(',');
                  const mime = arr[0].match(/:(.*?);/)?.[1] || 'audio/mpeg';
                  const bstr = atob(arr[1]);
                  const n = bstr.length;
                  const u8arr = new Uint8Array(n);
                  for (let i = 0; i < n; i++) {
                    u8arr[i] = bstr.charCodeAt(i);
                  }
                  const blob = new Blob([u8arr], { type: mime });
                  audioUrl = URL.createObjectURL(blob);
                  console.log("Audio blob URL created:", audioUrl);
                } catch (err) {
                  console.error("Error converting base64 audio:", err);
                  audioUrl = undefined;
                }
              } else if (audioUrl.startsWith('blob:')) {
                console.log("Audio is already a blob URL");
              } else {
                console.log("Audio URL:", audioUrl);
              }
            }

            const botMessage: ChatMessage = {
              id: loadingMessageId,
              type: "bot",
              message:
                data.response ||
                data.message ||
                "Thanks for your message! I'll get back to you soon.",
              timestamp: new Date(),
              audioUrl: audioUrl,
              audioDuration: data.audioDuration || data.audio_duration,
              isLoading: false
            };
            setChatMessages((prev) =>
              prev.map((msg) => (msg.id === loadingMessageId ? botMessage : msg))
            );
          } catch (parseError) {
            console.error("Error parsing response:", parseError);
            const botMessage: ChatMessage = {
              id: loadingMessageId,
              type: "bot",
              message: "Thanks for your message! I received it successfully.",
              timestamp: new Date(),
              isLoading: false
            };
            setChatMessages((prev) =>
              prev.map((msg) => (msg.id === loadingMessageId ? botMessage : msg))
            );
          }
        } else {
          throw new Error(`Webhook returned status ${response.status}`);
        }
      } else {
        setTimeout(() => {
          const botResponses = [
            "Thanks for reaching out! I'm interested to hear more about your project.",
            "Great question! Feel free to tell me more details and we can discuss further.",
            "I appreciate your interest! Let's connect and explore collaboration opportunities.",
            "Sounds interesting! I'd love to learn more about what you're working on.",
            "Thanks for the message! I'll review it and get back to you shortly."
          ];

          const botMessage: ChatMessage = {
            id: loadingMessageId,
            type: "bot",
            message:
              botResponses[Math.floor(Math.random() * botResponses.length)],
            timestamp: new Date(),
            isLoading: false
          };

          setChatMessages((prev) =>
            prev.map((msg) => (msg.id === loadingMessageId ? botMessage : msg))
          );
        }, 1000);
      }
    } catch (error) {
      console.error("Chatbot webhook error:", error);

      const errorMessage: ChatMessage = {
        id: loadingMessageId,
        type: "bot",
        message:
          "I apologize, but I'm having trouble connecting right now. Please try again or contact me directly.",
        timestamp: new Date(),
        isLoading: false
      };
      setChatMessages((prev) =>
        prev.map((msg) => (msg.id === loadingMessageId ? errorMessage : msg))
      );
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const messageText = chatInput;
    setChatInput("");
    await sendChatMessage(messageText);
  };

  const startRecording = async () => {
    try {
      console.log('Requesting microphone access...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true
      });
      
      console.log('✓ Microphone access granted');
      console.log('Stream audio tracks:', stream.getAudioTracks().length);
      
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        const settings = audioTrack.getSettings?.();
        
        // 🔴 CHECK IF MICROPHONE IS MUTED!
        if (audioTrack.muted) {
          console.error('❌ MICROPHONE IS MUTED!');
          console.error('Your microphone is muted by the system or browser.');
          alert('Your microphone is MUTED! Please unmute it in your system settings or browser settings and try again.');
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        console.log('Audio track state:', {
          enabled: audioTrack.enabled,
          muted: audioTrack.muted,
          readyState: audioTrack.readyState,
          settings
        });
      }
      
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4'
      ];
      
      let selectedMimeType = '';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          console.log('✓ Using MIME type:', mimeType);
          break;
        }
      }
      
      const recorder = new MediaRecorder(
        stream, 
        selectedMimeType ? { mimeType: selectedMimeType } : {}
      );
      
      const audioChunks: BlobPart[] = [];
      let chunkCount = 0;
      let totalChunkSize = 0;
      let recordingTimerId: NodeJS.Timeout;
      let dataRequestTimerId: NodeJS.Timeout;

      recorder.ondataavailable = (event) => {
        const chunkSize = event.data.size;
        
        if (chunkSize > 0) {
          chunkCount++;
          totalChunkSize += chunkSize;
          console.log(`📦 Chunk ${chunkCount}: ${chunkSize} bytes (Total: ${totalChunkSize} bytes)`);
          audioChunks.push(event.data);
        }
      };

      recorder.onstart = () => {
        console.log('🎙️ Recording started - requesting data every 500ms');
      };

      recorder.onstop = () => {
        clearInterval(recordingTimerId);
        clearInterval(dataRequestTimerId);
        
        // Request any remaining data ONLY if recorder is still in recording state
        if (recorder.state === 'recording') {
          recorder.requestData();
        }
        
        const audioBlob = new Blob(audioChunks, { 
          type: selectedMimeType || 'audio/webm' 
        });
        
        console.log('\n=== 📊 RECORDING SUMMARY ===');
        console.log('Status: Recording stopped');
        console.log('Total chunks collected:', chunkCount);
        console.log('Total raw data size:', totalChunkSize, 'bytes');
        console.log('Final blob size:', audioBlob.size, 'bytes');
        console.log('Recording duration:', recordingTime, 'seconds');
        console.log('MIME type:', selectedMimeType || 'browser default');
        
        if (audioBlob.size < 5000) {
          console.error('❌ ERROR: Blob is too small!');
          console.error('Check: 1) Microphone muted? 2) Microphone working? 3) Correct device selected?');
        } else {
          console.log('✓ Audio captured successfully!');
        }
        console.log('============================\n');
        
        setRecordingBlob(audioBlob);
        
        // Stop and release the microphone
        stream.getTracks().forEach(track => {
          track.stop();
        });
      };

      recorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
      };

      // Start recording without timeslice
      recorder.start();
      
      setMediaRecorder(recorder);
      setIsRecording(true);
      setShowAudioRecordModal(true);
      setRecordingTime(0);

      // Actively request data every 500ms to force ondataavailable events
      dataRequestTimerId = setInterval(() => {
        if (recorder.state === 'recording') {
          recorder.requestData();
        }
      }, 500);

      // Update recording timer every second
      recordingTimerId = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error("❌ Microphone access error:", error);
      
      let errorMessage = "Unable to access microphone.";
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          errorMessage = "Microphone permission denied. Please allow access.";
        } else if (error.name === 'NotFoundError') {
          errorMessage = "No microphone found. Connect a microphone and try again.";
        } else if (error.name === 'NotReadableError') {
          errorMessage = "Microphone is in use. Close other apps and try again.";
        }
      }
      
      alert(errorMessage);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setShowAudioRecordModal(true);
    }
  };

  const handleSendAudioMessage = async () => {
    if (!recordingBlob) {
      console.error("No recording blob available");
      alert("No audio was recorded. Please try recording again.");
      return;
    }

    // Validate blob size
    if (recordingBlob.size < 5000) {
      console.warn(`Audio blob size is very small (${recordingBlob.size} bytes). This may indicate the microphone wasn't properly captured.`);
      const confirmed = confirm(
        `Warning: The audio file is very small (${(recordingBlob.size / 1024).toFixed(2)} KB) for a ${recordingTime} second recording.\n\nThis may indicate your microphone input wasn't captured. Do you want to try recording again?`
      );
      if (confirmed) {
        setRecordingBlob(null);
        setRecordingTime(0);
        setShowAudioRecordModal(false);
        return;
      }
    }

    console.log("Sending audio message. Blob size:", recordingBlob.size, "Duration:", recordingTime);

    // Create a blob URL for immediate playback
    const audioUrl = URL.createObjectURL(recordingBlob);
    const audioDuration = recordingTime;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: "user",
      message: "🎙️ Audio message",
      timestamp: new Date(),
      audioUrl: audioUrl,
      audioDuration: audioDuration
    };

    // Add user message and loading message
    setChatMessages((prev) => [...prev, userMessage]);

    // Create a loading message with unique ID to replace later
    const loadingMessageId = Date.now() + 1;
    const loadingMessage: ChatMessage = {
      id: loadingMessageId,
      type: "bot",
      message: "Processing your audio...",
      timestamp: new Date(),
      isLoading: true
    };
    setChatMessages((prev) => [...prev, loadingMessage]);

    // Close modal immediately
    setShowAudioRecordModal(false);
    setIsWaitingForResponse(true);

    try {
      const formData = new FormData();
      formData.append("audio", recordingBlob, "message.webm");
      formData.append("message", audioMessage || "Voice message");
      formData.append("sessionId", sessionId.current);
      formData.append("timestamp", new Date().toISOString());
      formData.append("type", "audio_message");
      formData.append("language", selectedLanguage);

      const webhookUrl = process.env.NEXT_PUBLIC_CHATBOT_WEBHOOK_URL;

      if (
        webhookUrl &&
        webhookUrl !== "https://your-webhook-url-here.com/api/chat"
      ) {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            ...(process.env.NEXT_PUBLIC_CHATBOT_API_KEY && {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_CHATBOT_API_KEY}`
            })
          },
          body: formData
        });

        if (response.ok) {
          try {
            const contentType = response.headers.get("content-type");
            let data: any = {};
            
            // Only try to parse JSON if content-type indicates JSON
            if (contentType && contentType.includes("application/json")) {
              data = await response.json();
            } else {
              // Try to parse anyway, but catch errors gracefully
              const text = await response.text();
              if (text.trim()) {
                try {
                  data = JSON.parse(text);
                } catch (e) {
                  console.warn("Response is not valid JSON:", text);
                  data = {};
                }
              }
            }

            console.log("Bot audio response received:", data);

            // Process audio URL if present
            let botAudioUrl = data.audioUrl || data.audio_url;
            if (botAudioUrl && typeof botAudioUrl === 'string') {
              // If it's a base64 audio, convert to blob URL
              if (botAudioUrl.startsWith('data:audio')) {
                console.log("Converting base64 audio to blob URL");
                try {
                  const arr = botAudioUrl.split(',');
                  const mime = arr[0].match(/:(.*?);/)?.[1] || 'audio/mpeg';
                  const bstr = atob(arr[1]);
                  const n = bstr.length;
                  const u8arr = new Uint8Array(n);
                  for (let i = 0; i < n; i++) {
                    u8arr[i] = bstr.charCodeAt(i);
                  }
                  const blob = new Blob([u8arr], { type: mime });
                  botAudioUrl = URL.createObjectURL(blob);
                  console.log("Audio blob URL created:", botAudioUrl);
                } catch (err) {
                  console.error("Error converting base64 audio:", err);
                  botAudioUrl = undefined;
                }
              }
            }

            const botMessage: ChatMessage = {
              id: loadingMessageId,
              type: "bot",
              message: data.response || data.message || "Thanks for your audio message!",
              timestamp: new Date(),
              audioUrl: botAudioUrl,
              audioDuration: data.audioDuration || data.audio_duration,
              isLoading: false
            };
            
            // Replace loading message with actual response
            setChatMessages((prev) =>
              prev.map((msg) => (msg.id === loadingMessageId ? botMessage : msg))
            );
          } catch (parseError) {
            console.error("Error parsing response:", parseError);
            const botMessage: ChatMessage = {
              id: loadingMessageId,
              type: "bot",
              message: "Thanks for your audio message! I received it successfully.",
              timestamp: new Date(),
              isLoading: false
            };
            setChatMessages((prev) =>
              prev.map((msg) => (msg.id === loadingMessageId ? botMessage : msg))
            );
          }
        } else {
          throw new Error(`Webhook returned status ${response.status}`);
        }
      } else {
        const botMessage: ChatMessage = {
          id: loadingMessageId,
          type: "bot",
          message: "Thanks for sending a voice message! I'll listen to it shortly.",
          timestamp: new Date(),
          isLoading: false
        };
        setChatMessages((prev) =>
          prev.map((msg) => (msg.id === loadingMessageId ? botMessage : msg))
        );
      }
    } catch (error) {
      console.error("Error sending audio:", error);
      const errorMessage: ChatMessage = {
        id: loadingMessageId,
        type: "bot",
        message: "I received your audio message but encountered an issue processing it. Please try again.",
        timestamp: new Date(),
        isLoading: false
      };
      setChatMessages((prev) =>
        prev.map((msg) => (msg.id === loadingMessageId ? errorMessage : msg))
      );
    } finally {
      // Always reset state
      setRecordingBlob(null);
      setAudioMessage("");
      setRecordingTime(0);
      setIsWaitingForResponse(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
    if (files.length > 0) {
      setShowFileUploadModal(true);
    }
  };

  const handleSendFileMessage = async () => {
    if (selectedFiles.length === 0) return;

    const userMessage = {
      id: Date.now(),
      type: "user" as const,
      message: `📎 Sent ${selectedFiles.length} file(s)`,
      timestamp: new Date()
    };

    setChatMessages((prev) => [...prev, userMessage]);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("message", fileMessage || "File upload");
      formData.append("sessionId", sessionId.current);
      formData.append("timestamp", new Date().toISOString());
      formData.append("type", "file_message");
      formData.append("language", selectedLanguage);

      const webhookUrl = process.env.NEXT_PUBLIC_CHATBOT_WEBHOOK_URL;

      if (
        webhookUrl &&
        webhookUrl !== "https://your-webhook-url-here.com/api/chat"
      ) {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            ...(process.env.NEXT_PUBLIC_CHATBOT_API_KEY && {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_CHATBOT_API_KEY}`
            })
          },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          const botMessage = {
            id: Date.now() + 1,
            type: "bot" as const,
            message: data.response || data.message || "Thanks for uploading the files!",
            timestamp: new Date()
          };
          setChatMessages((prev) => [...prev, botMessage]);
        }
      } else {
        const botMessage = {
          id: Date.now() + 1,
          type: "bot" as const,
          message: `Thanks for sharing the file(s)! I'll review them.`,
          timestamp: new Date()
        };
        setChatMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error sending files:", error);
    }

    setSelectedFiles([]);
    setFileMessage("");
    setShowFileUploadModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const cancelAudioRecording = () => {
    if (isRecording) {
      stopRecording();
    }
    setShowAudioRecordModal(false);
    setAudioMessage("");
    setRecordingBlob(null);
    setRecordingTime(0);
  };

  const cancelFileUpload = () => {
    setShowFileUploadModal(false);
    setSelectedFiles([]);
    setSelectedFile(null);
    setFileMessage("");
  };

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    setIsResizing(true);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: chatSize.width,
      startHeight: chatSize.height
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - resizeRef.current.startX;
      const deltaY = moveEvent.clientY - resizeRef.current.startY;

      let newWidth = resizeRef.current.startWidth;
      let newHeight = resizeRef.current.startHeight;

      // Handle width changes
      if (direction.includes("right")) {
        newWidth = resizeRef.current.startWidth + deltaX;
      } else if (direction.includes("left")) {
        newWidth = resizeRef.current.startWidth - deltaX;
      }

      // Handle height changes
      if (direction.includes("bottom")) {
        newHeight = resizeRef.current.startHeight + deltaY;
      } else if (direction.includes("top")) {
        newHeight = resizeRef.current.startHeight - deltaY;
      }

      newWidth = Math.max(280, Math.min(600, newWidth));
      newHeight = Math.max(400, Math.min(800, newHeight));

      setChatSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-gray-50 dark:to-white">
        <div className="text-center" data-oid="8arsxp:">
          <div
            className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"
            data-oid="9uiedgv"
          ></div>
          <p className="text-white dark:text-slate-900 text-xl" data-oid="9m-v8nm">
            Loading Portfolio...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-gray-50 dark:to-white">
        <div className="text-center text-white dark:text-slate-900 p-8" data-oid="zve2-04">
          <h1 className="text-4xl font-bold mb-4" data-oid="n8mcjan">
            ⚠️ Error
          </h1>
          <p className="text-xl" data-oid="7i1i5pc">
            Failed to load portfolio data
          </p>
          <p className="text-gray-400 mt-2" data-oid="i-q7o5y">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 min-h-screen" data-oid="kb:k3vb">
      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 bg-slate-900/95 dark:bg-white/95 backdrop-blur-sm z-50 border-b border-slate-800 dark:border-gray-200"
        data-oid="zhb:5u7"
      >
        <div className="container mx-auto px-6 py-4" data-oid="2n808a4">
          <div className="flex justify-between items-center" data-oid="_br:-:l">
            <div
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent"
              data-oid="1qhxc8a"
            >
              {data.hero.name}
            </div>
            <div className="flex items-center gap-4" data-oid="n:zq8lp">
              <div className="hidden md:flex space-x-8" data-oid="n:zq8lp">
              {[
                "home",
                "about",
                "skills",
                "experience",
                "education",
                "projects",
                "contact",
              ].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize hover:text-blue-600 transition-colors ${
                    activeSection === section
                      ? "text-blue-600"
                      : "text-gray-300 dark:text-gray-700"
                  }`}
                  data-oid="jh7ve8b"
                >
                  {section}
                </button>
              ))}
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-800 dark:bg-gray-200 hover:bg-slate-700 dark:hover:bg-gray-300 transition-colors"
                aria-label="Toggle theme"
                data-oid="theme-toggle"
              >
                {theme === "dark" ? (
                  <svg className="w-5 h-5 text-yellow-400 dark:text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
        data-oid="xujcqpn"
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-gray-50 dark:to-white"
          data-oid="hx8p43z"
        ></div>
        <div className="absolute inset-0 opacity-20" data-oid="3fg89qe">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse"
            data-oid="m:evwcv"
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl animate-pulse delay-1000"
            data-oid="b7whoeh"
          ></div>
        </div>

        <div
          className="container mx-auto px-6 relative z-10"
          data-oid="x2833mz"
        >
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-12"
            data-oid="pfba99w"
          >
            <div className="flex-1 text-center md:text-left" data-oid="d_gmw0f">
              <h1
                className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in"
                data-oid="-pw7pzd"
              >
                Hi, I'm{" "}
                <span
                  className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent"
                  data-oid="b-q3qqf"
                >
                  {data.hero.name}
                </span>
              </h1>
              <p
                className="text-2xl md:text-3xl text-gray-300 dark:text-gray-600 mb-6 animate-fade-in-delay-1"
                data-oid="b.myjh5"
              >
                {data.hero.title}
              </p>
              <p
                className="text-lg text-gray-400 dark:text-gray-500 mb-8 max-w-2xl animate-fade-in-delay-2"
                data-oid="j7sq-ze"
              >
                {data.hero.bio}
              </p>
              <div
                className="flex gap-4 justify-center md:justify-start mb-8 animate-fade-in-delay-3"
                data-oid="g.ir._t"
              >
                {data.hero.social.github && (
                  <a
                    href={data.hero.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-800 dark:bg-gray-200 hover:bg-blue-600 dark:hover:bg-blue-500 p-3 rounded-full transition-all transform hover:scale-110"
                    data-oid="ct22biy"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="k9nw:zg"
                    >
                      <path
                        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                        data-oid="wlz524z"
                      />
                    </svg>
                  </a>
                )}
                {data.hero.social.linkedin && (
                  <a
                    href={data.hero.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-800 dark:bg-gray-200 hover:bg-blue-600 dark:hover:bg-blue-500 p-3 rounded-full transition-all transform hover:scale-110"
                    data-oid="0p1_tza"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="kx2ab11"
                    >
                      <path
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                        data-oid="6mhb21:"
                      />
                    </svg>
                  </a>
                )}
                {data.hero.social.twitter && (
                  <a
                    href={data.hero.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-800 dark:bg-gray-200 hover:bg-blue-600 dark:hover:bg-blue-500 p-3 rounded-full transition-all transform hover:scale-110"
                    data-oid="urrxn3j"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="32.84no"
                    >
                      <path
                        d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                        data-oid="rup:f9r"
                      />
                    </svg>
                  </a>
                )}
                {data.hero.social.email && (
                  <a
                    href={`mailto:${data.hero.social.email}`}
                    className="bg-slate-800 dark:bg-gray-200 hover:bg-blue-600 dark:hover:bg-blue-500 p-3 rounded-full transition-all transform hover:scale-110"
                    data-oid="oi2sfyn"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="xu0fdln"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        data-oid="qojniw8"
                      />
                    </svg>
                  </a>
                )}
              </div>
              <div
                className="flex gap-4 justify-center md:justify-start animate-fade-in-delay-4"
                data-oid="ufa8116"
              >
                <button
                  onClick={() => scrollToSection("contact")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-105"
                  data-oid="0her8ip"
                >
                  Get In Touch
                </button>
                {data.hero.resumeUrl && (
                  <a
                    href={data.hero.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
                    data-oid="i42org4"
                  >
                    Download Resume
                  </a>
                )}
              </div>
            </div>
            <div
              className="flex-shrink-0 animate-fade-in-delay-2"
              data-oid="6z:itog"
            >
              <div className="relative" data-oid="g:8ar8y">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full blur-2xl opacity-50 animate-pulse"
                  data-oid=":_sy4j9"
                ></div>
                <img
                  src={data.hero.profileImage}
                  alt={data.hero.name}
                  className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-4 border-black shadow-2xl"
                  data-oid="l84ufcv"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-800 dark:bg-gray-100" data-oid="dxdx_rc">
        <div className="container mx-auto px-6" data-oid="xdd83j.">
          <h2
            className="text-4xl md:text-5xl font-bold mb-12 text-center text-white dark:text-slate-900"
            data-oid="51yc5sd"
          >
            About{" "}
            <span
              className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent dark:from-blue-600 dark:to-blue-500"
              data-oid="ra:482v"
            >
              Me
            </span>
          </h2>
          <div className="max-w-4xl mx-auto" data-oid="-piasn4">
            <p
              className="text-xl text-gray-300 dark:text-gray-600 leading-relaxed mb-12"
              data-oid="94lcqga"
            >
              {data.hero.aboutMe || data.hero.bio}
            </p>
            {data.hero.recommendationImage && (
              <div className="mt-12">
                <img
                  src={data.hero.recommendationImage}
                  alt="LinkedIn Recommendation"
                  className="w-full rounded-lg shadow-lg border border-slate-700 dark:border-gray-300"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-slate-900 dark:bg-white" data-oid="ina-9vi">
        <div className="container mx-auto px-6" data-oid="10ebw3:">
          <h2
            className="text-4xl md:text-5xl font-bold mb-12 text-center text-white dark:text-slate-900"
            data-oid="gp7pn7t"
          >
            Skills &{" "}
            <span
              className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent dark:from-blue-600 dark:to-blue-500"
              data-oid="jjno3ht"
            >
              Expertise
            </span>
          </h2>
          <div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            data-oid="pq98dbu"
          >
            {Object.entries(data.skills).map(([category, items]) => (
              <div
                key={category}
                className="bg-slate-800 dark:bg-white dark:border dark:border-gray-200 rounded-xl p-6 shadow-sm shadow-slate-950/10 dark:shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-slate-500/30 transition-all transform hover:-translate-y-2"
                data-oid="wryqk6c"
              >
                <h3
                  className="text-2xl font-semibold mb-4 capitalize text-blue-600 dark:text-blue-600"
                  data-oid="4vormyz"
                >
                  {category}
                </h3>
                <ul className="space-y-2" data-oid="30iegry">
                  {items.map((skill, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-gray-300 dark:text-gray-700"
                      data-oid="c.r.qui"
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-black dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        data-oid="8blpcnu"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                          data-oid="o6_dk28"
                        />
                      </svg>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section
        id="experience"
        className="py-20 bg-slate-800 dark:bg-gray-100"
        data-oid="m06ze3x"
      >
        <div className="container mx-auto px-6" data-oid="9j.15-o">
          <h2
            className="text-4xl md:text-5xl font-bold mb-12 text-center text-white dark:text-slate-900"
            data-oid="-s4_9du"
          >
            Work{" "}
            <span
              className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent dark:from-blue-600 dark:to-blue-500"
              data-oid="ih-zb2j"
            >
              Experience
            </span>
          </h2>
          {data.experienceTagline && (
            <p className="text-center text-gray-400 dark:text-gray-600 mb-12 max-w-3xl mx-auto text-lg" data-oid="exp-tagline">
              {data.experienceTagline}
            </p>
          )}
          <div className="max-w-4xl mx-auto space-y-8" data-oid="x6ovqzd">
            {data.experience.map((exp, idx) => (
              <div
                key={idx}
                className="bg-slate-900 dark:bg-gray-50 dark:border dark:border-gray-300 rounded-xl p-8 shadow-sm shadow-slate-950/10 dark:shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-slate-500/30 transition-all"
                data-oid="5v1pewu"
              >
                <div
                  className="flex flex-col md:flex-row md:justify-between md:items-start mb-4"
                  data-oid="h3b63e:"
                >
                  <div data-oid="cev-zp6">
                    <h3
                      className="text-2xl font-bold text-white dark:text-gray-900"
                      data-oid="pdy4j:4"
                    >
                      {exp.role}
                    </h3>
                    <p className="text-gray-300 dark:text-gray-700" data-oid="qe-qh5j">
                      {exp.company}
                    </p>
                  </div>
                  <div
                    className="text-gray-400 dark:text-gray-500 mt-2 md:mt-0 text-right"
                    data-oid="xus2nxn"
                  >
                    <p data-oid="z.gynou">{exp.duration}</p>
                    <p data-oid="5-vea1h">{exp.location}</p>
                  </div>
                </div>
                <div className="mb-4" data-oid="fsvgxds">
                  <h4
                    className="font-semibold text-grey mb-2"
                    data-oid="evr8cly"
                  >
                    Responsibilities:
                  </h4>
                  <ul
                    className="list-disc list-inside space-y-1 text-gray-400 dark:text-gray-600"
                    data-oid="nca4vqd"
                  >
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i} data-oid=".desgs2">
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
                {exp.achievements.length > 0 && (
                  <div className="mb-4" data-oid="6-qg9cn">
                    <h4
                      className="font-semibold text-gray-300 dark:text-gray-600 mb-2"
                      data-oid="6z5r.wz"
                    >
                      Key Achievements:
                    </h4>
                    <ul
                      className="list-disc list-inside space-y-1 text-gray-400 dark:text-gray-600"
                      data-oid="vogtas5"
                    >
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} data-oid="nt:e.n2">
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-4" data-oid="7ok-yx9">
                  {exp.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-medium"
                      data-oid="-4vw_f8"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 bg-slate-900 dark:bg-white" data-oid="xvq4fp7">
        <div className="container mx-auto px-6" data-oid="xil:ykr">
          <h2
            className="text-4xl md:text-5xl font-bold mb-12 text-center text-white dark:text-slate-900"
            data-oid="bn.ht9q"
          >
            <span
              className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent dark:from-blue-600 dark:to-blue-500"
              data-oid=":agkf6g"
            >
              Education
            </span>
          </h2>
          <div className="max-w-4xl mx-auto space-y-8" data-oid="y3l6uu3">
            {data.education.map((edu, idx) => (
              <div
                key={idx}
                className="bg-slate-800 dark:bg-gray-50 dark:border dark:border-gray-300 rounded-xl p-8 shadow-sm shadow-slate-950/10 dark:shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-slate-500/30 transition-all"
                data-oid="ynrc0_g"
              >
                <div
                  className="flex flex-col md:flex-row md:justify-between md:items-start mb-4"
                  data-oid="i8-0iao"
                >
                  <div data-oid="07t087q">
                    <h3
                      className="text-2xl font-bold text-white dark:text-gray-900"
                      data-oid="y6-.zlx"
                    >
                      {edu.degree}
                    </h3>
                    <p className="text-xl text-gray-300 dark:text-gray-700" data-oid="6lk97fo">
                      {edu.institution}
                    </p>
                  </div>
                  <div
                    className="text-gray-400 dark:text-gray-500 mt-2 md:mt-0 text-right"
                    data-oid="y3g19wt"
                  >
                    <p data-oid="y-n6y9x">{edu.duration}</p>
                    {edu.gpa && (
                      <p className="text-blue-600 dark:text-blue-600" data-oid="m2o0j9t">
                        GPA: {edu.gpa}
                      </p>
                    )}
                  </div>
                </div>
                {edu.relevantCourses && edu.relevantCourses.length > 0 && (
                  <div className="mb-4" data-oid="oads5qi">
                    <h4
                      className="font-semibold text-gray-300 dark:text-gray-600 mb-2"
                      data-oid="0-jz7rt"
                    >
                      Relevant Courses:
                    </h4>
                    <div className="flex flex-wrap gap-2" data-oid="bm_ajuo">
                      {edu.relevantCourses.map((course, i) => (
                        <span
                          key={i}
                      className="bg-gray-700 text-white dark:bg-gray-100 dark:text-gray-700 px-3 py-1 rounded-full text-sm"
                          data-oid="j9p26ku"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {edu.courses && edu.courses.length > 0 && (
                  <div className="mb-4" data-oid="ejou75w">
                    <h4
                      className="font-semibold text-gray-300 dark:text-gray-600 mb-2"
                      data-oid="d7zwwd4"
                    >
                      Certifications:
                    </h4>
                    <ul
                      className="list-disc list-inside space-y-1 text-gray-400 dark:text-gray-600"
                      data-oid="e42.uwg"
                    >
                      {edu.courses.map((course, i) => (
                        <li key={i} data-oid="19fujtl">
                          {course}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {edu.achievements && edu.achievements.length > 0 && (
                  <div data-oid="mqeg:74">
                    <h4
                      className="font-semibold text-gray-300 dark:text-gray-600 mb-2"
                      data-oid="dbxpszh"
                    >
                      Achievements:
                    </h4>
                    <ul
                      className="list-disc list-inside space-y-1 text-gray-400 dark:text-gray-600"
                      data-oid="bv-9m5_"
                    >
                      {edu.achievements.map((achievement, i) => (
                        <li key={i} data-oid="4fxe13i">
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-slate-800 dark:bg-gray-100" data-oid="czkd7qj">
        <div className="container mx-auto px-6" data-oid="mqhqo5_">
          <h2
            className="text-4xl md:text-5xl font-bold mb-12 text-center text-white dark:text-slate-900"
            data-oid="6hxrx2m"
          >
            Featured{" "}
            <span
              className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent dark:from-blue-600 dark:to-blue-500"
              data-oid="kw6t5_-"
            >
              Projects
            </span>
          </h2>
          <div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            data-oid=".q:e_j_"
          >
            {data.projects.map((project, idx) => (
              <div
                key={idx}
                className="bg-slate-900 dark:bg-gray-50 dark:border dark:border-gray-300 rounded-xl overflow-hidden shadow-sm shadow-slate-950/10 dark:shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-slate-500/30 transition-all transform hover:-translate-y-2 group"
                data-oid="g1k_6ql"
              >
                <div
                  className="relative overflow-hidden h-48"
                  data-oid="zgwpvwu"
                >
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    data-oid="jgw51eg"
                  />

                  {project.featured && (
                    <div
                      className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
                      data-oid="_mowu7u"
                    >
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-6" data-oid="blszf-f">
                  <h3
                    className="text-2xl font-bold mb-2 text-blue-400 dark:text-blue-600"
                    data-oid="p2ahzxw"
                  >
                    {project.name}
                  </h3>
                  <p className="text-gray-400 dark:text-gray-600 mb-4" data-oid="9ec-4qc">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4" data-oid="jlqhbhi">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="dark:bg-gray-100 dark:text-gray-700 bg-gray-200 text-black px-2 py-1 rounded text-sm"
                        data-oid="q3pers:"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4" data-oid="2:prfs-">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-400 hover:text-blue-300 dark:text-blue-600 dark:hover:text-blue-700 transition-colors"
                        data-oid="d18r_t5"
                      >
                        <svg
                          className="w-5 h-5 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          data-oid="g3tgab:"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            data-oid="jq5xbmw"
                          />
                        </svg>
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-400 hover:text-blue-300 dark:text-blue-600 dark:hover:text-blue-700 transition-colors"
                        data-oid="lx2k30d"
                      >
                        <svg
                          className="w-5 h-5 mr-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          data-oid="w1st8by"
                        >
                          <path
                            d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                            data-oid="xptimf_"
                          />
                        </svg>
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-900 dark:bg-white" data-oid=".k0b7i6">
        <div className="container mx-auto px-6" data-oid="o_ke.og">
          <h2
            className="text-4xl md:text-5xl font-bold mb-12 text-center text-white dark:text-slate-900"
            data-oid="kly5rp0"
          >
            Get In{" "}
            <span
              className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent dark:from-blue-600 dark:to-blue-500"
              data-oid="0xam-x:"
            >
              Touch
            </span>
          </h2>
          <div className="max-w-4xl mx-auto" data-oid="jgj19pq">
            <div
              className="bg-slate-800 dark:bg-white dark:border dark:border-gray-200 rounded-xl p-8 md:p-12 shadow-sm shadow-slate-950/10 dark:shadow-slate-900/10"
              data-oid="gkoyxsb"
            >
              <p
                className="text-xl text-gray-300 dark:text-gray-600 mb-8 text-center"
                data-oid="ksv6az3"
              >
                {data.contact.availability}
              </p>
              <div
                className="grid md:grid-cols-2 gap-8 mb-8"
                data-oid="f9k90il"
              >
                <div className="flex items-center" data-oid="390vnl4">
                  <div
                    className="bg-blue-600/10 p-4 rounded-full mr-4"
                    data-oid="-lfw7n9"
                  >
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="2jy:ore"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        data-oid="jjs4shh"
                      />
                    </svg>
                  </div>
                  <div data-oid="c.s9e.s">
                    <p className="text-gray-400 dark:text-gray-500 text-sm" data-oid="xza4t6y">
                      Email
                    </p>
                    <a
                      href={`mailto:${data.contact.email}`}
                      className="text-black hover:text-gray-700 dark:text-blue-600 dark:hover:text-blue-700"
                      data-oid="m.7-72-"
                    >
                      {data.contact.email}
                    </a>
                  </div>
                </div>
                {data.contact.phone && (
                  <div className="flex items-center" data-oid="hse_mrn">
                  <div
                    className="bg-blue-600/10 p-4 rounded-full mr-4"
                    data-oid="0zhsm4o"
                  >
                    <svg
                      className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="b0ua1s2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          data-oid="vbo3_ch"
                        />
                      </svg>
                    </div>
                    <div data-oid=".-l7rnv">
                      <p className="text-gray-400 text-sm" data-oid="w1qsylc">
                        Phone
                      </p>
                      <a
                        href={`tel:${data.contact.phone}`}
                        className="text-black hover:text-gray-700 dark:text-blue-600 dark:hover:text-blue-700"
                        data-oid="f1.wb:i"
                      >
                        {data.contact.phone}
                      </a>
                    </div>
                  </div>
                )}
                <div className="flex items-center" data-oid="vmq9gwl">
                  <div
                    className="bg-blue-600/10 p-4 rounded-full mr-4"
                    data-oid="mk433n4"
                  >
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="cgdgc-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        data-oid="k8.8im:"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        data-oid="b5kh204"
                      />
                    </svg>
                  </div>
                  <div data-oid="ilhkkxj">
                    <p className="text-gray-400 text-sm" data-oid="77k0.zd">
                      Location
                    </p>
                    <p className="text-gray-300 dark:text-gray-700" data-oid="0v3by42">
                      {data.contact.location}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="flex justify-center gap-4 pt-8 border-t border-slate-700 dark:border-gray-300"
                data-oid="7fz9z-r"
              >
                {data.contact.social.github && (
                  <a
                    href={data.contact.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-700 dark:bg-gray-200 hover:bg-black dark:hover:bg-gray-300 p-4 rounded-full transition-all transform hover:scale-110"
                    data-oid="gsvs:2z"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="pfbgv-p"
                    >
                      <path
                        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                        data-oid="i_spgoa"
                      />
                    </svg>
                  </a>
                )}
                {data.contact.social.linkedin && (
                  <a
                    href={data.contact.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-700 dark:bg-gray-200 hover:bg-black dark:hover:bg-gray-300 p-4 rounded-full transition-all transform hover:scale-110"
                    data-oid="391aqx4"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="p.m0-1d"
                    >
                      <path
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                        data-oid="wjykv:u"
                      />
                    </svg>
                  </a>
                )}
                {data.contact.social.twitter && (
                  <a
                    href={data.contact.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-700 dark:bg-gray-200 hover:bg-black dark:hover:bg-gray-300 p-4 rounded-full transition-all transform hover:scale-110"
                    data-oid="4_f9_0o"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="i3s.moc"
                    >
                      <path
                        d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                        data-oid="extk1ao"
                      />
                    </svg>
                  </a>
                )}
              </div>
              <div
                className="mt-8 pt-8 border-t border-slate-700 dark:border-gray-300 text-center"
                data-oid="whatsapp-cta"
              >
                <a
                  href="https://wa.me/923007603007?text=Hi%20Tanveer%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
                  data-oid="whatsapp-btn"
                >
                  <span>💬</span>
                  <span>Message me on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="bg-slate-950 dark:bg-gray-100 py-8 border-t border-slate-800 dark:border-gray-300"
        data-oid="gkr-gjo"
      >
        <div
          className="container mx-auto px-6 text-center text-gray-400 dark:text-gray-600"
          data-oid="-y2.n5h"
        >
          <p data-oid="3:n8xvk">
            &copy; {new Date().getFullYear()} {data.hero.name}. All rights
            reserved.
          </p>
          <p className="mt-2 text-sm" data-oid="rl1v4rb">
            Built with React, Next.js & Tailwind CSS
          </p>
        </div>
      </footer>

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50" data-oid="chat-widget">
        <AnimatePresence data-oid="chat-animate">
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              dir={isRTLLanguage(selectedLanguage) ? "rtl" : "ltr"}
              className={`mb-4 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden relative ${
                isResizing ? "select-none cursor-grabbing" : "select-none"
              }`}
              style={{
                width: `${chatSize.width}px`,
                height: `${chatSize.height}px`,
                minWidth: "280px",
                minHeight: "400px",
                maxWidth: "600px",
                maxHeight: "800px"
              }}
              data-oid="chat-window"
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white" data-oid="chat-header">
                <div className="flex items-center justify-between" data-oid="header-content">
                  <div className="flex items-center gap-3" data-oid="header-info">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center" data-oid="header-icon">
                      <Bot className="w-5 h-5" data-oid="bot-icon" />
                    </div>
                    <div data-oid="header-text">
                      <h4 className="font-semibold" data-oid="bot-name">
                        Portfolio Assistant
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-blue-100" data-oid="bot-status">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" data-oid="status-dot"></div>
                        Online
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                    data-oid="close-btn"
                  >
                    <Minimize2 className="w-5 h-5" data-oid="minimize-icon" />
                  </button>
                </div>
              </div>

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
                      className={`max-w-xs ${
                        message.type === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                      data-oid="message-bubble"
                    >
                      {/* Audio Player - displays if audioUrl exists */}
                      {message.audioUrl && (
                        <div className="mb-2">
                          <AudioPlayer
                            audioUrl={message.audioUrl}
                            duration={message.audioDuration}
                            isUserMessage={message.type === "user"}
                          />
                        </div>
                      )}

                      {/* Text Content */}
                      <div className={`${message.audioUrl ? "px-3 py-1" : "px-4 py-2"}`}>
                        {message.isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                              <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                              <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                            </div>
                            <span className="text-sm text-gray-500">Waiting for response...</span>
                          </div>
                        ) : (
                          <p className={`text-sm ${isRTLLanguage(selectedLanguage) ? 'text-right' : 'text-left'} break-words`} data-oid="message-text">
                            {message.message}
                          </p>
                        )}
                      </div>
                    </div>
                    {message.type === "user" && (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0" data-oid="user-avatar">
                        <User className="w-4 h-4 text-white" data-oid="user-avatar-icon" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200" data-oid="input-section">
                {/* Voice and File Controls */}
                <div className="flex gap-2 mb-3 items-center" data-oid="controls">
                  <motion.button
                    type="button"
                    onClick={startRecording}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors duration-300"
                    title="Record voice message"
                    data-oid="voice-btn"
                  >
                    <Mic className="w-4 h-4" data-oid="mic-icon" />
                  </motion.button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.xls,.xlsx"
                    className="hidden"
                    data-oid="file-input"
                  />

                  <motion.button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors duration-300"
                    title="Upload file"
                    data-oid="file-btn"
                  >
                    <Paperclip className="w-4 h-4" data-oid="paperclip-icon" />
                  </motion.button>

                  {/* Language Selector */}
                  <div className="relative ml-auto">
                    <motion.button
                      type="button"
                      onClick={() => setShowLanguagePopup(!showLanguagePopup)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 text-sm font-medium"
                      title="Select language"
                      data-oid="language-btn"
                    >
                      <Globe className="w-4 h-4" data-oid="globe-icon" />
                      <span data-oid="language-text">
                        {languages.find(l => l.code === selectedLanguage)?.name || "English"}
                      </span>
                    </motion.button>

                    {/* Language Popup */}
                    <AnimatePresence>
                      {showLanguagePopup && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute bottom-full right-0 mb-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto w-48"
                          data-oid="language-popup"
                        >
                          {languages.map((lang) => (
                            <button
                              key={lang.code}
                              type="button"
                              onClick={() => {
                                setSelectedLanguage(lang.code);
                                setShowLanguagePopup(false);
                              }}
                              className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors duration-200 text-sm ${
                                selectedLanguage === lang.code
                                  ? "bg-blue-100 text-blue-700 font-semibold"
                                  : "text-gray-700"
                              }`}
                              data-oid="language-option"
                            >
                              {lang.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <form onSubmit={handleChatSubmit} className="flex gap-2" data-oid="chat-form">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={isRTLLanguage(selectedLanguage) ? "اپنا پیغام درج کریں..." : "Type your message..."}
                    className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-500 ${
                      isRTLLanguage(selectedLanguage) ? 'text-right' : 'text-left'
                    }`}
                    data-oid="message-input"
                  />

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-300"
                    data-oid="send-btn"
                  >
                    <Send className="w-4 h-4" data-oid="send-icon" />
                  </motion.button>
                </form>
              </div>

              {/* Quick Actions */}
              <div className="p-4 bg-gray-50 border-t border-gray-200" data-oid="quick-actions">
                <div className="text-xs text-gray-500 mb-2" data-oid="actions-label">
                  Quick actions:
                </div>
                <div className="flex gap-2 flex-wrap" data-oid="actions-buttons">
                  <button
                    onClick={() => sendChatMessage("Tell me about your projects")}
                    className="text-xs bg-white border border-gray-200 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-700"
                    data-oid="action-projects"
                  >
                    Projects
                  </button>
                  <button
                    onClick={() => sendChatMessage("What are your skills?")}
                    className="text-xs bg-white border border-gray-200 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-700"
                    data-oid="action-skills"
                  >
                    Skills
                  </button>
                  <button
                    onClick={() => sendChatMessage("How can I contact you?")}
                    className="text-xs bg-white border border-gray-200 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-700"
                    data-oid="action-contact"
                  >
                    Contact
                  </button>
                </div>
              </div>

              {/* Resize Handles */}
              <div
                className="absolute -top-1 left-4 right-4 h-2 cursor-ns-resize hover:bg-blue-200 transition-all duration-200 opacity-60 hover:opacity-100"
                onMouseDown={(e) => handleResizeStart(e, "top")}
                data-oid="resize-top"
              ></div>

              <div
                className="absolute -bottom-1 left-4 right-4 h-2 cursor-ns-resize hover:bg-blue-200 transition-all duration-200 opacity-60 hover:opacity-100"
                onMouseDown={(e) => handleResizeStart(e, "bottom")}
                data-oid="resize-bottom"
              ></div>

              <div
                className="absolute -left-1 top-4 bottom-4 w-2 cursor-ew-resize hover:bg-blue-200 transition-all duration-200 opacity-60 hover:opacity-100"
                onMouseDown={(e) => handleResizeStart(e, "left")}
                data-oid="resize-left"
              ></div>

              <div
                className="absolute -right-1 top-4 bottom-4 w-2 cursor-ew-resize hover:bg-blue-200 transition-all duration-200 opacity-60 hover:opacity-100"
                onMouseDown={(e) => handleResizeStart(e, "right")}
                data-oid="resize-right"
              ></div>

              {/* Corner resize handles */}
              <div
                className="absolute -top-1 -left-1 w-4 h-4 cursor-nw-resize opacity-50 hover:opacity-100"
                onMouseDown={(e) => handleResizeStart(e, "top-left")}
                data-oid="resize-top-left"
              ></div>

              <div
                className="absolute -top-1 -right-1 w-4 h-4 cursor-ne-resize opacity-50 hover:opacity-100"
                onMouseDown={(e) => handleResizeStart(e, "top-right")}
                data-oid="resize-top-right"
              ></div>

              <div
                className="absolute -bottom-1 -left-1 w-4 h-4 cursor-sw-resize opacity-50 hover:opacity-100"
                onMouseDown={(e) => handleResizeStart(e, "bottom-left")}
                data-oid="resize-bottom-left"
              ></div>

              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100"
                onMouseDown={(e) => handleResizeStart(e, "bottom-right")}
                data-oid="resize-bottom-right"
              ></div>

              {/* Resize indicator when resizing */}
              {isResizing && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-mono z-50 shadow-lg" data-oid="resize-indicator">
                  {chatSize.width} × {chatSize.height}
                </div>
              )}

              {/* Resize helper overlay */}
              {isResizing && (
                <div className="absolute inset-0 bg-blue-100/10 pointer-events-none z-40 rounded-2xl border-2 border-blue-300 border-dashed" data-oid="resize-overlay" />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Toggle Button */}
        <motion.button
          onClick={() => setIsChatOpen(!isChatOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white relative"
          data-oid="chat-toggle"
        >
          <AnimatePresence mode="wait" data-oid="toggle-animate">
            {isChatOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                data-oid="toggle-close"
              >
                <X className="w-6 h-6" data-oid="close-icon" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                data-oid="toggle-open"
              >
                <MessageCircle className="w-6 h-6" data-oid="chat-icon" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notification Dot */}
          {!isChatOpen && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
              data-oid="notification-dot"
            ></motion.div>
          )}
        </motion.button>
      </div>

      {/* File Upload Modal */}
      <AnimatePresence data-oid="file-modal">
        {showFileUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={cancelFileUpload}
            data-oid="file-modal-overlay"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              data-oid="file-modal-content"
            >
              <div className="text-center mb-4" data-oid="file-modal-header">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4" data-oid="file-icon">
                  <Paperclip className="w-8 h-8 text-blue-600" data-oid="paperclip-icon-modal" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2" data-oid="file-modal-title">
                  Send {selectedFiles.length > 1 ? "Files" : "File"}
                </h3>
                <div className="text-gray-600 text-sm" data-oid="file-list">
                  {selectedFiles.length > 1 ? (
                    <div data-oid="multiple-files">
                      <p className="font-medium mb-1" data-oid="files-count">
                        Selected {selectedFiles.length} files:
                      </p>
                      <div className="max-h-24 overflow-y-auto space-y-1" data-oid="files-list">
                        {selectedFiles.map((file, index) => (
                          <p key={index} className="text-xs truncate" data-oid="file-item">
                            • {file.name}
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p data-oid="single-file">Selected: {selectedFiles[0]?.name}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4" data-oid="file-form">
                <div data-oid="message-field">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-oid="message-label">
                    Add a message (optional)
                  </label>
                  <textarea
                    value={fileMessage}
                    onChange={(e) => setFileMessage(e.target.value)}
                    placeholder="Describe your file or add additional context..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-500 resize-none"
                    rows={3}
                    data-oid="message-textarea"
                  />
                </div>

                <div className="flex gap-3" data-oid="file-buttons">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={cancelFileUpload}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-300"
                    data-oid="cancel-btn"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendFileMessage}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                    data-oid="send-file-btn"
                  >
                    <Send className="w-4 h-4" data-oid="send-icon-file" />
                    Send
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Recording Modal */}
      <AnimatePresence data-oid="audio-modal">
        {showAudioRecordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={cancelAudioRecording}
            data-oid="audio-modal-overlay"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              data-oid="audio-modal-content"
            >
              <div className="text-center mb-6" data-oid="audio-modal-header">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    isRecording ? "bg-red-100" : "bg-blue-100"
                  }`}
                  data-oid="audio-icon"
                >
                  <Mic
                    className={`w-10 h-10 ${
                      isRecording ? "text-red-600 animate-pulse" : "text-blue-600"
                    }`}
                    data-oid="mic-icon-modal"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2" data-oid="audio-modal-title">
                  {isRecording ? "Recording..." : "Voice Message"}
                </h3>

                {isRecording && (
                  <div className="space-y-3" data-oid="recording-info">
                    <p className="text-gray-600 text-sm" data-oid="recording-time">
                      Recording time: {Math.floor(recordingTime / 60)}:
                      {(recordingTime % 60).toString().padStart(2, "0")}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2" data-oid="progress-bar">
                      <div
                        className="bg-red-600 h-2 rounded-full animate-pulse"
                        style={{
                          width: `${Math.min(recordingTime * 2, 100)}%`
                        }}
                        data-oid="progress"
                      />
                    </div>
                  </div>
                )}
              </div>

              {!isRecording && recordingBlob && (
                <div className="space-y-4 mb-6" data-oid="audio-message-field">
                  <div data-oid="audio-text-input">
                    <label className="block text-sm font-medium text-gray-700 mb-2" data-oid="audio-label">
                      Add a message (optional)
                    </label>
                    <textarea
                      value={audioMessage}
                      onChange={(e) => setAudioMessage(e.target.value)}
                      placeholder="Describe your audio message or add additional context..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-500 resize-none"
                      rows={3}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendAudioMessage();
                        }
                      }}
                      data-oid="audio-textarea"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3" data-oid="audio-buttons">
                {isRecording ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={stopRecording}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                    data-oid="stop-recording-btn"
                  >
                    <div className="w-4 h-4 bg-white rounded-sm" data-oid="stop-icon" />
                    Stop Recording
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={cancelAudioRecording}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-300"
                      data-oid="audio-cancel-btn"
                    >
                      Cancel
                    </motion.button>
                    {recordingBlob && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendAudioMessage}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                        data-oid="send-audio-btn"
                      >
                        <Send className="w-4 h-4" data-oid="send-icon-audio" />
                        Send
                      </motion.button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx data-oid="7gy8e1j">{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay-1 {
          animation: fade-in 0.8s ease-out 0.2s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s both;
        }

        .animate-fade-in-delay-3 {
          animation: fade-in 0.8s ease-out 0.6s both;
        }

        .animate-fade-in-delay-4 {
          animation: fade-in 0.8s ease-out 0.8s both;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
