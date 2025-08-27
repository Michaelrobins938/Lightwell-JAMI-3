"use client";
import { Mic, Send, Plus, Brain, Search, Palette, Infinity, BookOpen, Globe, Pencil, Cloud, Paperclip } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

// Placeholder components
const VoiceOrb = ({ state, isRecording, audioLevel, onStateChange, onAudioLevelChange, liveTranscript, finalTranscript }: any) => {
  return (
    <div className="voice-orb">
      <div>Voice Orb (State: {state})</div>
      {liveTranscript && <div>Live: {liveTranscript}</div>}
      {finalTranscript && <div>Final: {finalTranscript}</div>}
    </div>
  );
};

const VoiceModeInterface = ({ onClose }: any) => {
  return (
    <div className="voice-mode-interface">
      <div>Voice Mode Interface</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};



type Props = {
  disabled?: boolean;
  onSubmit:(text:string, attachments:{type:"image"|"pdf"; dataUrl:string; page?:number}[])=>void;
  layoutId?: string;
  placeholder?: string;
  onVoiceModeToggle?: () => void;
  onFullscreenOrbToggle?: () => void;
  addMessage?: (msg: { role: string; content: string }) => void;
}

export default function InputBar({ disabled, onSubmit, layoutId, placeholder = "Ask anything...", onVoiceModeToggle, onFullscreenOrbToggle, addMessage }: Props) {
  const [value, setValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [attachments, setAttachments] = useState<{type:"image"|"pdf"; dataUrl:string; page?:number}[]>([]);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  

  const imageInput = useRef<HTMLInputElement>(null);
  const plusButtonRef = useRef<HTMLButtonElement>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  // Voice-related state
  const [recording, setRecording] = useState(false);
  const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);
  const [showVoiceOrb, setShowVoiceOrb] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [showNewVoiceMode, setShowNewVoiceMode] = useState(false);
  
  // Orb state - define enum
  enum OrbState {
    IDLE = 'idle',
    LISTENING = 'listening',
    PROCESSING = 'processing',
    SPEAKING = 'speaking'
  }
  const [orbState, setOrbState] = useState<OrbState>(OrbState.IDLE);
  


  useEffect(() => {
    const el = document.querySelector<HTMLTextAreaElement>("#prompt");
    if (!el) return;
    const adjust = () => { el.style.height = "0px"; el.style.height = Math.min(el.scrollHeight, 180) + "px"; };
    el.addEventListener("input", adjust); adjust();
    return () => el.removeEventListener("input", adjust);
  }, []);

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown && !plusButtonRef.current?.contains(event.target as Node)) {
        setShowDropdown(false);
        setShowMoreOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && recording) {
        try {
          mediaRecorderRef.current.stop();
        } catch {}
      }
    };
  }, [recording]);

  // Handle voice orb close
  const handleVoiceOrbClose = useCallback(() => {
    if (recording && mediaRecorderRef.current) {
      try {
        setOrbState(OrbState.PROCESSING);
        mediaRecorderRef.current.stop();
        setIsVoiceModeActive(false);
        setRecording(false);
        setAudioLevel(0);
        setShowVoiceOrb(false);
        setOrbState(OrbState.IDLE);
      } catch (error) {
        console.error('Error stopping voice mode:', error);
        setRecording(false);
        setShowVoiceOrb(false);
        setOrbState(OrbState.IDLE);
      }
    } else {
      setShowVoiceOrb(false);
      setOrbState(OrbState.IDLE);
    }
  }, [recording, isVoiceModeActive]);

  // Handle escape key for voice orb
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showVoiceOrb) {
        handleVoiceOrbClose();
      }
    };

    if (showVoiceOrb) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showVoiceOrb, handleVoiceOrbClose]);

  // Enhanced voice mode functions with exact ChatGPT UX flow
  const startAdvancedVoiceMode = useCallback(async () => {
    try {
      // Input bar animates out (300ms fade/slide down)
      setShowVoiceOrb(true);
      setOrbState(OrbState.LISTENING);
      setLiveTranscript("");
      setFinalTranscript("");
      
      // Start voice mode
      setIsVoiceModeActive(true);
      setRecording(true);

      // Initialize Web Speech API for live transcription
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event: any) => {
          let interim = '';
          let final = '';
          
          for (let i = 0; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              final += transcript;
            } else {
              interim += transcript;
            }
          }
          
          // Live transcript: grey/ghost text, then solidifies once confident
          setLiveTranscript(interim);
          if (final) {
            setFinalTranscript(prev => prev + final);
            setLiveTranscript("");
          }
        };

        recognition.onend = () => {
          if (recording) {
            // Automatically restart if still in voice mode
            recognition.start();
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
        };

        recognitionRef.current = recognition;
        recognition.start();
      }
      
      // Basic recording for fallback transcription
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream, { mimeType: "audio/webm" });
      
      // Real-time audio level analysis
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateAudioLevel = () => {
        if (recording) {
          analyser.getByteFrequencyData(dataArray);
          const sum = dataArray.reduce((a, b) => a + b, 0);
          const average = sum / bufferLength;
          const normalized = average / 255;
          setAudioLevel(normalized);
          requestAnimationFrame(updateAudioLevel);
        }
      };
      updateAudioLevel();
      
      rec.ondataavailable = (e) => { 
        if (e.data.size) chunksRef.current.push(e.data); 
      };
      
      rec.onstop = async () => {
        // Processing state: spinning/thinking animation
        setOrbState(OrbState.PROCESSING);
        
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        chunksRef.current = [];
        
        // Final transcript is locked in and displayed as user bubble
        const finalText = finalTranscript + liveTranscript;
        if (finalText.trim()) {
          // Add user message to chat
          onSubmit(finalText.trim(), []);
        }
        
        // 500-800ms thinking delay before assistant response
        setTimeout(() => {
          setOrbState(OrbState.IDLE);
          setShowVoiceOrb(false);
          setLiveTranscript("");
          setFinalTranscript("");
        }, 600 + Math.random() * 200);
      };
      
      mediaRecorderRef.current = rec;
      rec.start();
      
    } catch (error) {
      console.error('Voice mode unavailable:', error);
      alert("Microphone access required for voice mode");
      setShowVoiceOrb(false);
      setOrbState(OrbState.IDLE);
    }
  }, [isVoiceModeActive, recording, finalTranscript, liveTranscript, onSubmit]);

  const stopAdvancedVoiceMode = useCallback(() => {
    if (!recording) return;
    
    try {
      // Stop speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      
      setIsVoiceModeActive(false);
      setRecording(false);
      setAudioLevel(0);
    } catch (error) {
      console.error('Error stopping voice mode:', error);
      setRecording(false);
      setShowVoiceOrb(false);
      setOrbState(OrbState.IDLE);
      setLiveTranscript("");
      setFinalTranscript("");
    }
  }, [recording]);

  const toggleAdvancedVoiceMode = useCallback(() => {
    // Use new ChatGPT-like voice mode if addMessage is available
    if (addMessage) {
      setShowNewVoiceMode(true);
      return;
    }
    
    // Fallback to legacy voice mode
    if (onVoiceModeToggle) {
      onVoiceModeToggle();
    } else {
      if (isVoiceModeActive) { // Use the new state variable
        stopAdvancedVoiceMode();
      } else {
        startAdvancedVoiceMode();
      }
    }
  }, [isVoiceModeActive, startAdvancedVoiceMode, stopAdvancedVoiceMode, onVoiceModeToggle, addMessage]);

  const send = useCallback(() => {
    if (!value.trim()) return;
    onSubmit(value.trim(), attachments);
    setValue(""); 
    setAttachments([]);
  }, [value, attachments, onSubmit]);

  const handleSendButtonClick = useCallback(() => {
    if (onFullscreenOrbToggle) {
      onFullscreenOrbToggle();
    } else {
      send();
    }
  }, [onFullscreenOrbToggle, send]);

  const removeAttachment = useCallback((index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }, []);

  const calculateDropdownPosition = useCallback(() => {
    if (plusButtonRef.current) {
      const rect = plusButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8, // 8px below the button
        left: rect.left + (rect.width / 2) - 96 // Center the dropdown on the plus button (96px = half of w-48)
      });
    }
  }, []);

  const toggleDropdown = useCallback(() => {
    if (!showDropdown) {
      calculateDropdownPosition();
    }
    setShowDropdown(!showDropdown);
  }, [showDropdown, calculateDropdownPosition]);

  const mainOptions = [
    { icon: Paperclip, label: "Add photos & files", action: () => console.log("Add photos & files") },
    { icon: Cloud, label: "Add from Google Drive", action: () => console.log("Google Drive") },
    { icon: Brain, label: "Agent mode", action: () => console.log("Agent mode"), isNew: true },
    { icon: Search, label: "Deep research", action: () => console.log("Deep research") },
    { icon: Palette, label: "Create image", action: () => console.log("Create image") },
    { icon: Infinity, label: "Use connectors", action: () => console.log("Use connectors") },
    { icon: Plus, label: "More", action: () => setShowMoreOptions(!showMoreOptions), hasArrow: true },
  ];

  const moreOptions = [
    { icon: BookOpen, label: "Study and learn", action: () => console.log("Study and learn") },
    { icon: Globe, label: "Web search", action: () => console.log("Web search") },
    { icon: Pencil, label: "Canvas", action: () => console.log("Canvas") },
    { icon: Cloud, label: "Connect OneDrive", action: () => console.log("OneDrive") },
    { icon: Cloud, label: "Connect Sharepoint", action: () => console.log("SharePoint") },
  ];

  return (
    <>
      <div className="w-full mx-auto">
        <div 
          className="relative flex items-center justify-between transition-colors w-full h-full"
          style={{
            backgroundColor: '#2A2A2A',
            borderRadius: '24px',
            height: '100%',
            padding: '12px 16px'
          }}
        >
          {/* Left Section - Plus button */}
          <button 
            className="text-[#8e8ea0] hover:text-[#d1d5db] hover:bg-[#3a3a3a] rounded-lg transition-colors flex items-center justify-center" 
            style={{
              width: '20px',
              height: '20px',
              padding: '12px'
            }}
            title="New chat" 
            onClick={toggleDropdown}
            ref={plusButtonRef}
          >
            <Plus size={20}/>
          </button>

          <input 
            ref={imageInput} 
            type="file" 
            accept="image/*" 
            hidden 
            onChange={async (e) => {
              const f = e.target.files?.[0]; 
              if (!f) return;
              const b64 = await f.arrayBuffer().then(buf => {
                const bin = new Uint8Array(buf); 
                let s = ""; 
                bin.forEach(b => s += String.fromCharCode(b));
                return "data:" + (f.type || "image/png") + ";base64," + btoa(s);
              });
              setAttachments(a => [...a, { type: "image", dataUrl: b64 }]);
            }}
          />

          {/* Input field */}
          <textarea 
            id="prompt" 
            placeholder={placeholder || "Message ChatGPT..."}
            value={value} 
            onChange={e => setValue(e.target.value)} 
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (value.trim()) {
                  send();
                }
              }
            }}
            rows={1} 
            disabled={disabled}
            className="flex-1 resize-none bg-transparent border-0 outline-0 text-white leading-relaxed min-h-[24px] max-h-32"
            style={{ 
              fontFamily: 'Inter, sans-serif', 
              fontSize: '14px', 
              fontWeight: 400,
              color: '#EDEDED'
            }}
          />

          {/* Voice and Send buttons */}
          <div className="flex items-center gap-2">
            {/* REAL VOICE MODE - Only Working Button */}
            <button
              onClick={() => {
                if (onVoiceModeToggle) {
                  onVoiceModeToggle();
                } else {
                  toggleAdvancedVoiceMode();
                }
              }}
              className="flex items-center justify-center transition-all duration-150 hover:bg-[#3A3A3A]"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'transparent'
              }}
              title="Open ChatGPT Voice Mode"
            >
              <Mic size={20} color="#8E8EA0" />
            </button>

            {/* Send button */}
            <button 
              className="flex items-center justify-center transition-all duration-150"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: onFullscreenOrbToggle ? '#FF6B6B' : (value.trim() ? '#7B3AED' : '#3A3A3A')
              }}
              onMouseEnter={(e) => {
                if (onFullscreenOrbToggle) {
                  e.currentTarget.style.backgroundColor = '#FF5252';
                } else if (value.trim()) {
                  e.currentTarget.style.backgroundColor = '#6D28D9';
                } else {
                  e.currentTarget.style.backgroundColor = '#5C5C5C';
                }
              }}
              onMouseLeave={(e) => {
                if (onFullscreenOrbToggle) {
                  e.currentTarget.style.backgroundColor = '#FF6B6B';
                } else if (value.trim()) {
                  e.currentTarget.style.backgroundColor = '#7B3AED';
                } else {
                  e.currentTarget.style.backgroundColor = '#3A3A3A';
                }
              }}
              onClick={handleSendButtonClick} 
              title={onFullscreenOrbToggle ? "Open Fullscreen Orb" : "Send"} 
              disabled={disabled || (!value.trim() && !onFullscreenOrbToggle)}
            >
              <Send size={18} color="white" />
            </button>
          </div>
        </div>



        {/* ChatGPT-style Dropdown */}
        {showDropdown && createPortal(
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed w-48 bg-gray-900 rounded-lg border border-gray-800 shadow-lg p-0.5 z-[9999]"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left
            }}
          >
            {/* Main Options */}
            <div className="space-y-0">
              {mainOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={option.action}
                  className="w-full flex items-center py-1 px-2 text-xs text-gray-200 hover:bg-gray-800 rounded-sm transition-colors"
                >
                  <option.icon className="w-3 h-3 mr-1.5 text-gray-400" />
                  <span className="flex-1 text-left">{option.label}</span>
                  {option.isNew && (
                    <span className="ml-1 text-xs text-purple-400 uppercase">NEW</span>
                  )}
                  {option.hasArrow && (
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            {/* Submenu - More Options */}
            <AnimatePresence>
              {showMoreOptions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, x: 8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: 8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute left-full top-0 ml-1 w-40 bg-gray-900 rounded-lg border border-gray-800 shadow-lg p-0.5 z-[9999]"
                >
                  <div className="space-y-0">
                    {moreOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={option.action}
                        className="w-full flex items-center py-1 px-2 text-xs text-gray-200 hover:bg-gray-800 rounded-sm transition-colors"
                      >
                        <option.icon className="w-3 h-3 mr-1.5 text-gray-400" />
                        <span className="flex-1 text-left">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>,
          document.body
        )}

        {/* Attachments Display */}
        {!!attachments.length && (
          <div className="flex gap-2 pt-3 flex-wrap">
            {attachments.map((a, i) => (
              <div key={i} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={a.dataUrl} 
                  alt={`attachment ${i + 1}`}
                  style={{
                    width:80, 
                    height:80, 
                    objectFit:"cover", 
                    borderRadius:8, 
                    border:"1px solid var(--gpt-border)"
                  }}
                />
                {/* Remove button */}
                <button
                  onClick={() => removeAttachment(i)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Voice Orb Modal */}
      {showVoiceOrb && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Voice Orb */}
            <VoiceOrb
              state={orbState}
              audioLevel={audioLevel}
              onStateChange={setOrbState}
              onAudioLevelChange={setAudioLevel}
            />
            
            {/* Live Transcript Display */}
            {(liveTranscript || finalTranscript) && (
              <motion.div
                className="absolute -top-20 left-1/2 transform -translate-x-1/2 text-white text-center max-w-md"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 text-sm">
                  <span className="text-white">{finalTranscript}</span>
                  <span className="text-gray-400 opacity-70">{liveTranscript}</span>
                  {liveTranscript && <span className="inline-block w-0.5 h-4 bg-white ml-1 animate-pulse" />}
                </div>
              </motion.div>
            )}

            {/* ChatGPT-style Status Text */}
            <motion.div
              className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-white text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-base font-medium mb-2 text-white/90">
                Advanced Voice is now Luna AI Voice
              </div>
              
              {/* Microphone and X buttons */}
              <div className="flex items-center gap-6 justify-center mb-4">
                <button
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  onClick={() => {
                    // Toggle mute functionality - stop speaking
                    if (orbState === OrbState.LISTENING) {
                      stopAdvancedVoiceMode();
                    }
                  }}
                  title={orbState === OrbState.LISTENING ? "Stop listening" : "Microphone"}
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                </button>
                
                <button
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  onClick={handleVoiceOrbClose}
                  title="Exit voice mode"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>

          </motion.div>
        </div>,
        document.body
      )}

      {/* New ChatGPT-like Voice Mode Interface */}
      {showNewVoiceMode && addMessage && (
        <VoiceModeInterface
          addMessage={addMessage}
          closeVoiceMode={() => setShowNewVoiceMode(false)}
        />
      )}
    </>
  );
}

