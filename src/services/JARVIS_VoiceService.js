import { ProtobufHelper } from './JARVIS_protobufHelper.js';
import { AudioProcessor } from './JARVIS_audioProcessor_utils.js';

export class VoiceService {
    constructor() {
        this.protobufHelper = new ProtobufHelper();
        this.audioProcessor = new AudioProcessor();
        this.isVoiceModeEnabled = false;
        this.isRecording = false;
        this.isPlaying = false;
        this.audioContext = null;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.currentAudioBlob = null;
        this.voicePersonality = 'default';
        this.voiceSettings = {
            speed: 1.0,
            pitch: 1.0,
            volume: 1.0,
            language: 'en-US'
        };
        this.supportedVoices = [];
        this.selectedVoice = null;
        this.recognition = null;
        this.synthesis = null;
        
        // GPT integration
        this.chatService = null;
        this.currentConversationId = null;
        this.isProcessingGPTResponse = false;
        
        // Audio visualization
        this.visualizationCallbacks = {
            onAudioData: null,
            onAudioLevelChange: null,
            onFrequencyChange: null
        };
    }

    async initialize() {
        await this.protobufHelper.initialize();
        await this.audioProcessor.initialize();
        await this.initializeVoiceCapabilities();
        this.loadVoiceSettings();
        
        // Set up audio processor callbacks
        this.audioProcessor.setCallbacks({
            onAudioData: this.handleAudioData.bind(this),
            onAudioLevelChange: this.handleAudioLevelChange.bind(this),
            onFrequencyChange: this.handleFrequencyChange.bind(this)
        });
    }

    /**
     * Set chat service reference for GPT integration
     */
    setChatService(chatService) {
        this.chatService = chatService;
    }

    /**
     * Handle audio data from processor
     */
    handleAudioData(data) {
        if (this.visualizationCallbacks.onAudioData) {
            this.visualizationCallbacks.onAudioData(data);
        }
    }

    /**
     * Handle audio level changes
     */
    handleAudioLevelChange(level) {
        if (this.visualizationCallbacks.onAudioLevelChange) {
            this.visualizationCallbacks.onAudioLevelChange(level);
        }
    }

    /**
     * Handle frequency changes
     */
    handleFrequencyChange(isActive) {
        if (this.visualizationCallbacks.onFrequencyChange) {
            this.visualizationCallbacks.onFrequencyChange(isActive);
        }
    }

    /**
     * Set visualization callbacks
     */
    setVisualizationCallbacks(callbacks) {
        this.visualizationCallbacks = { ...this.visualizationCallbacks, ...callbacks };
    }

    async initializeVoiceCapabilities() {
        try {
            // Initialize Web Speech API
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
                this.setupSpeechRecognition();
            }

            if ('speechSynthesis' in window) {
                this.synthesis = window.speechSynthesis;
                this.loadAvailableVoices();
            }

            // Initialize Web Audio API
            if ('AudioContext' in window || 'webkitAudioContext' in window) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            console.log('Voice capabilities initialized successfully');
        } catch (error) {
            console.error('Error initializing voice capabilities:', error);
        }
    }

    setupSpeechRecognition() {
        if (!this.recognition) return;

        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = this.voiceSettings.language;

        this.recognition.onstart = () => {
            this.isRecording = true;
            this.dispatchVoiceEvent('recording_started', {});
        };

        this.recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            if (finalTranscript) {
                this.dispatchVoiceEvent('speech_recognized', { 
                    transcript: finalTranscript,
                    isFinal: true 
                });
                
                // Process with GPT if voice mode is enabled
                if (this.isVoiceModeEnabled && this.chatService) {
                    this.processVoiceInputWithGPT(finalTranscript);
                }
            } else if (interimTranscript) {
                this.dispatchVoiceEvent('speech_interim', { 
                    transcript: interimTranscript,
                    isFinal: false 
                });
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isRecording = false;
            this.dispatchVoiceEvent('recording_error', { error: event.error });
        };

        this.recognition.onend = () => {
            this.isRecording = false;
            this.dispatchVoiceEvent('recording_stopped', {});
        };
    }

    /**
     * Process voice input with GPT
     */
    async processVoiceInputWithGPT(transcript) {
        if (!this.chatService || this.isProcessingGPTResponse) {
            return;
        }

        try {
            this.isProcessingGPTResponse = true;
            this.dispatchVoiceEvent('gpt_processing_started', { transcript });

            // Send to GPT via chat service
            const response = await this.chatService.sendMessage(transcript, 'user', this.currentConversationId);
            
            if (response && response.content) {
                // Speak the GPT response
                await this.speakText(response.content);
                
                this.dispatchVoiceEvent('gpt_response_received', { 
                    transcript, 
                    response: response.content 
                });
            }

        } catch (error) {
            console.error('Error processing voice input with GPT:', error);
            this.dispatchVoiceEvent('gpt_processing_error', { error: error.message });
        } finally {
            this.isProcessingGPTResponse = false;
        }
    }

    loadAvailableVoices() {
        if (!this.synthesis) return;

        const voices = this.synthesis.getVoices();
        if (voices.length > 0) {
            this.supportedVoices = voices;
            this.selectDefaultVoice();
        } else {
            // Wait for voices to load
            this.synthesis.onvoiceschanged = () => {
                this.supportedVoices = this.synthesis.getVoices();
                this.selectDefaultVoice();
            };
        }
    }

    selectDefaultVoice() {
        if (this.supportedVoices.length === 0) return;

        // Try to find a preferred voice
        const preferredVoices = ['en-US', 'en-GB'];
        for (const lang of preferredVoices) {
            const voice = this.supportedVoices.find(v => v.lang.startsWith(lang));
            if (voice) {
                this.selectedVoice = voice;
                break;
            }
        }

        // Fallback to first available voice
        if (!this.selectedVoice && this.supportedVoices.length > 0) {
            this.selectedVoice = this.supportedVoices[0];
        }
    }

    async startVoiceMode() {
        try {
            this.isVoiceModeEnabled = true;
            
            // Create voice mode activation message using Protobuf schema
            const voiceMessage = this.protobufHelper.createMessage('VoiceMessage', {
                message_id: this.generateMessageId(),
                session_id: this.generateSessionId(),
                auth_token: null, // Will be set by auth service
                user_id: null, // Will be set by auth service
                timestamp: Date.now(),
                message_type: 'voice_mode_activated',
                priority: 'normal',
                encryption: true,
                compression: false,
                version: '1.0.0',
                voice_enabled: true,
                voice_personality: this.voicePersonality,
                voice_settings: this.voiceSettings
            });

            this.dispatchVoiceEvent('voice_mode_activated', { 
                personality: this.voicePersonality,
                settings: this.voiceSettings 
            });

            this.saveVoiceSettings();
            return true;

        } catch (error) {
            console.error('Error starting voice mode:', error);
            this.isVoiceModeEnabled = false;
            throw error;
        }
    }

    async stopVoiceMode() {
        try {
            this.isVoiceModeEnabled = false;
            
            if (this.isRecording) {
                await this.stopRecording();
            }

            if (this.isPlaying) {
                this.stopPlaying();
            }

            // Create voice mode deactivation message using Protobuf schema
            const voiceMessage = this.protobufHelper.createMessage('VoiceMessage', {
                message_id: this.generateMessageId(),
                session_id: this.generateSessionId(),
                auth_token: null,
                user_id: null,
                timestamp: Date.now(),
                message_type: 'voice_mode_deactivated',
                priority: 'normal',
                encryption: true,
                compression: false,
                version: '1.0.0',
                voice_enabled: false
            });

            this.dispatchVoiceEvent('voice_mode_deactivated', {});
            this.saveVoiceSettings();

        } catch (error) {
            console.error('Error stopping voice mode:', error);
            throw error;
        }
    }

    async startRecording() {
        try {
            if (!this.isVoiceModeEnabled) {
                throw new Error('Voice mode must be enabled to record');
            }

            if (this.isRecording) {
                throw new Error('Already recording');
            }

            // Request microphone permission
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                } 
            });

            // Connect to audio processor for visualization
            await this.audioProcessor.connectAudioSource(stream);

            // Create media recorder
            this.mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            this.audioChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                this.currentAudioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                this.dispatchVoiceEvent('recording_completed', { 
                    blob: this.currentAudioBlob,
                    duration: this.getRecordingDuration()
                });
            };

            // Start recording
            this.mediaRecorder.start();
            this.isRecording = true;
            this.recordingStartTime = Date.now();

            // Create recording start message using Protobuf schema
            const recordingMessage = this.protobufHelper.createMessage('VoiceMessage', {
                message_id: this.generateMessageId(),
                session_id: this.generateSessionId(),
                auth_token: null,
                user_id: null,
                timestamp: Date.now(),
                message_type: 'voice_recording_started',
                priority: 'normal',
                encryption: true,
                compression: false,
                version: '1.0.0',
                voice_enabled: true,
                voice_personality: this.voicePersonality,
                recording_format: 'webm',
                recording_quality: 'high'
            });

            this.dispatchVoiceEvent('recording_started', {});
            return true;

        } catch (error) {
            console.error('Error starting recording:', error);
            this.isRecording = false;
            throw error;
        }
    }

    async stopRecording() {
        try {
            if (!this.isRecording || !this.mediaRecorder) {
                return false;
            }

            this.mediaRecorder.stop();
            this.isRecording = false;

            // Stop all tracks
            if (this.mediaRecorder.stream) {
                this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
            }

            // Create recording stop message using Protobuf schema
            const recordingMessage = this.protobufHelper.createMessage('VoiceMessage', {
                message_id: this.generateMessageId(),
                session_id: this.generateSessionId(),
                auth_token: null,
                user_id: null,
                timestamp: Date.now(),
                message_type: 'voice_recording_stopped',
                priority: 'normal',
                encryption: true,
                compression: false,
                version: '1.0.0',
                voice_enabled: true,
                recording_duration: this.getRecordingDuration(),
                recording_size: this.currentAudioBlob ? this.currentAudioBlob.size : 0
            });

            return true;

        } catch (error) {
            console.error('Error stopping recording:', error);
            this.isRecording = false;
            throw error;
        }
    }

    async playAudio(audioBlob) {
        try {
            if (this.isPlaying) {
                this.stopPlaying();
            }

            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);

            audio.onplay = () => {
                this.isPlaying = true;
                this.dispatchVoiceEvent('playback_started', {});
            };

            audio.onended = () => {
                this.isPlaying = false;
                this.dispatchVoiceEvent('playback_ended', {});
                URL.revokeObjectURL(audioUrl);
            };

            audio.onerror = (error) => {
                this.isPlaying = false;
                this.dispatchVoiceEvent('playback_error', { error });
                URL.revokeObjectURL(audioUrl);
            };

            await audio.play();

            // Create playback message using Protobuf schema
            const playbackMessage = this.protobufHelper.createMessage('VoiceMessage', {
                message_id: this.generateMessageId(),
                session_id: this.generateSessionId(),
                auth_token: null,
                user_id: null,
                timestamp: Date.now(),
                message_type: 'voice_playback_started',
                priority: 'normal',
                encryption: true,
                compression: false,
                version: '1.0.0',
                voice_enabled: true,
                playback_format: 'webm',
                playback_volume: this.voiceSettings.volume
            });

            return audio;

        } catch (error) {
            console.error('Error playing audio:', error);
            throw error;
        }
    }

    stopPlaying() {
        if (this.isPlaying) {
            // Stop any currently playing audio
            const audios = document.querySelectorAll('audio');
            audios.forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
            
            this.isPlaying = false;
            this.dispatchVoiceEvent('playback_stopped', {});
        }
    }

    async speakText(text, options = {}) {
        try {
            if (!this.synthesis || !this.selectedVoice) {
                throw new Error('Speech synthesis not available');
            }

            // Stop any current speech
            this.synthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = this.selectedVoice;
            utterance.rate = options.speed || this.voiceSettings.speed;
            utterance.pitch = options.pitch || this.voiceSettings.pitch;
            utterance.volume = options.volume || this.voiceSettings.volume;
            utterance.lang = options.language || this.voiceSettings.language;

            utterance.onstart = () => {
                this.isPlaying = true;
                this.dispatchVoiceEvent('speech_started', { text });
            };

            utterance.onend = () => {
                this.isPlaying = false;
                this.dispatchVoiceEvent('speech_ended', { text });
            };

            utterance.onerror = (error) => {
                this.isPlaying = false;
                this.dispatchVoiceEvent('speech_error', { error, text });
            };

            // Create speech message using Protobuf schema
            const speechMessage = this.protobufHelper.createMessage('VoiceMessage', {
                message_id: this.generateMessageId(),
                session_id: this.generateSessionId(),
                auth_token: null,
                user_id: null,
                timestamp: Date.now(),
                message_type: 'voice_speech_started',
                priority: 'normal',
                encryption: true,
                compression: false,
                version: '1.0.0',
                voice_enabled: true,
                voice_personality: this.voicePersonality,
                speech_text: text,
                speech_settings: {
                    speed: utterance.rate,
                    pitch: utterance.pitch,
                    volume: utterance.volume,
                    language: utterance.lang
                }
            });

            this.synthesis.speak(utterance);
            return utterance;

        } catch (error) {
            console.error('Error speaking text:', error);
            throw error;
        }
    }

    setVoicePersonality(personality) {
        this.voicePersonality = personality;
        this.dispatchVoiceEvent('personality_changed', { personality });
        this.saveVoiceSettings();
    }

    updateVoiceSettings(settings) {
        this.voiceSettings = { ...this.voiceSettings, ...settings };
        this.dispatchVoiceEvent('settings_updated', { settings: this.voiceSettings });
        this.saveVoiceSettings();
    }

    selectVoice(voiceIndex) {
        if (voiceIndex >= 0 && voiceIndex < this.supportedVoices.length) {
            this.selectedVoice = this.supportedVoices[voiceIndex];
            this.dispatchVoiceEvent('voice_selected', { voice: this.selectedVoice });
            this.saveVoiceSettings();
        }
    }

    getRecordingDuration() {
        if (!this.recordingStartTime) return 0;
        return Date.now() - this.recordingStartTime;
    }

    // Utility methods
    generateMessageId() {
        return `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    generateSessionId() {
        return `voice_sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Event dispatching
    dispatchVoiceEvent(eventType, data) {
        const event = new CustomEvent(`voice:${eventType}`, {
            detail: data,
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    // Settings persistence
    saveVoiceSettings() {
        try {
            const settings = {
                isVoiceModeEnabled: this.isVoiceModeEnabled,
                voicePersonality: this.voicePersonality,
                voiceSettings: this.voiceSettings,
                selectedVoiceIndex: this.selectedVoice ? this.supportedVoices.indexOf(this.selectedVoice) : 0
            };
            localStorage.setItem('chatgpt_voice_settings', JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving voice settings:', error);
        }
    }

    loadVoiceSettings() {
        try {
            const saved = localStorage.getItem('chatgpt_voice_settings');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.isVoiceModeEnabled = parsed.isVoiceModeEnabled || false;
                this.voicePersonality = parsed.voicePersonality || 'default';
                this.voiceSettings = { ...this.voiceSettings, ...parsed.voiceSettings };
                
                // Voice selection will be handled after voices are loaded
                if (parsed.selectedVoiceIndex !== undefined) {
                    setTimeout(() => {
                        this.selectVoice(parsed.selectedVoiceIndex);
                    }, 1000);
                }
            }
        } catch (error) {
            console.error('Error loading voice settings:', error);
        }
    }

    // Getters
    getVoiceStatus() {
        return {
            isVoiceModeEnabled: this.isVoiceModeEnabled,
            isRecording: this.isRecording,
            isPlaying: this.isPlaying,
            voicePersonality: this.voicePersonality,
            voiceSettings: this.voiceSettings,
            selectedVoice: this.selectedVoice,
            supportedVoices: this.supportedVoices
        };
    }

    getAvailableVoices() {
        return this.supportedVoices;
    }

    getCurrentAudioBlob() {
        return this.currentAudioBlob;
    }

    isVoiceSupported() {
        return !!(this.recognition && this.synthesis);
    }

    /**
     * Get audio processor for visualization
     */
    getAudioProcessor() {
        return this.audioProcessor;
    }

    /**
     * Set conversation ID for GPT integration
     */
    setConversationId(conversationId) {
        this.currentConversationId = conversationId;
    }
}
