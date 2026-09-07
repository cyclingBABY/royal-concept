import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Send, 
  X, 
  Radio, 
  ExternalLink,
  Forward,
  CheckCircle2,
  FileText,
  Sparkles
} from 'lucide-react';
import { COMPANY_CONTACT } from '../data/mockData';
import { ServiceCategory } from '../types';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isPlaying?: boolean;
}

interface AudioChatBotProps {
  currentService?: ServiceCategory | null;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
  dispatchedToWhatsApp?: boolean;
}

export const AudioChatBot: React.FC<AudioChatBotProps> = ({
  currentService,
  isOpenExternal,
  onCloseExternal,
  dispatchedToWhatsApp = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [summaryForwarded, setSummaryForwarded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Count user messages to display forward CTA
  const userMessageCount = messages.filter(m => m.sender === 'user').length;

  // Sync external open state
  useEffect(() => {
    if (isOpenExternal !== undefined) {
      setIsOpen(isOpenExternal);
    }
  }, [isOpenExternal]);

  // Check speech synthesis and recognition support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis;
        setSpeechSupported(true);
      } else {
        setSpeechSupported(false);
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setRecognitionSupported(true);
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = 'en-US';

          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            if (transcript) {
              setInputQuery(transcript);
              handleSendMessage(transcript);
            }
            setIsListening(false);
          };

          recognition.onerror = () => {
            setIsListening(false);
          };

          recognition.onend = () => {
            setIsListening(false);
          };

          recognitionRef.current = recognition;
        } catch {
          setRecognitionSupported(false);
        }
      }
    }

    // Initial greeting
    const welcomeMsg: ChatMessage = {
      id: 'welcome-1',
      sender: 'assistant',
      text: dispatchedToWhatsApp
        ? "Your request was dispatched to our WhatsApp desk (+256 702 615 454). While our lead rigger reviews equipment availability, I'm here to talk out loud with you! Whenever you're ready, tap 'Summarize & Forward to WhatsApp' to forward all our notes directly."
        : "Hello! I am the Royal Concepts Voice Assistant. While you explore our gear or wait for our WhatsApp desk at 0702 615 454, ask me any stage questions. Whenever you wish, I can summarize our entire chat and forward it straight to WhatsApp!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcomeMsg]);

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Scroll to bottom without showing scrollbars
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isSpeaking, isSummarizing]);

  // Voice speech synthesis
  const speakText = (text: string, messageId?: string) => {
    if (!isVoiceEnabled || !synthRef.current) return;

    try {
      synthRef.current.cancel();

      // Strip markdown formatting for natural pronunciation
      const cleanSpeech = text
        .replace(/[*#_`~]/g, '')
        .replace(/━━━━━━━━━━━━━━━━━━━━━━━━━━━━/g, '')
        .replace(/---------------------------------------/g, '')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanSpeech);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(v => 
        (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Premium')))
      ) || voices.find(v => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        if (messageId) setCurrentlyPlayingId(messageId);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentlyPlayingId(null);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentlyPlayingId(null);
      };

      synthRef.current.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      setIsSpeaking(false);
      setCurrentlyPlayingId(null);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setCurrentlyPlayingId(null);
    }
  };

  // Toggle voice recognition
  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  // Summarize chat and forward to WhatsApp
  const handleSummarizeAndForward = async () => {
    if (isSummarizing) return;
    setIsSummarizing(true);
    stopSpeaking();

    const interimMsg: ChatMessage = {
      id: `interim-${Date.now()}`,
      sender: 'assistant',
      text: "Analyzing all our stage notes, equipment selections, and questions to compile your WhatsApp event brief...",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, interimMsg]);

    try {
      const res = await fetch('/api/assistant/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const summaryText = data.summary;
      const spokenRecap = data.spokenRecap || "I have summarized our discussion and prepared the brief for our lead rigger at 0702 615 454.";
      const whatsappUrl = data.whatsappUrl;

      const summaryMsg: ChatMessage = {
        id: `summary-${Date.now()}`,
        sender: 'assistant',
        text: `📋 *Executive Event Brief Compiled*\n\n${summaryText}\n\n📲 *Forwarded to Royal Concepts WhatsApp Desk (+256 702 615 454)*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev.filter(m => m.id !== interimMsg.id), summaryMsg]);
      setSummaryForwarded(true);

      // Speak confirmation out loud
      if (isVoiceEnabled) {
        speakText(spokenRecap, summaryMsg.id);
      }

      // Automatically launch WhatsApp
      if (whatsappUrl) {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.warn('API summarize error, using local formatter:', err);

      const userQueries = messages
        .filter(m => m.sender === 'user')
        .map(m => `• ${m.text}`)
        .join('\n');

      const fallbackSummary = `*ROYAL CONCEPTS - EVENT BRIEF & CHAT SUMMARY*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}

📋 *Client Inquiries & Specifications Discussed*:
${userQueries || '• Technical equipment booking & staging consultation'}

🛠 *Production Pillars Explored*:
• Staging, Rigging & Structural Trussing
• Intelligent Lighting & DMX Show Control
• High-Definition LED Screens (P2.9 Indoor / P3.9 Outdoor)
• Concert Line Array Pro Sound & Microphones

📞 *Next Step*:
Please review availability and reply on WhatsApp with gear confirmation and schedule.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Forwarded from Royal Concepts Voice Assistant to WhatsApp Desk (+256 702 615 454)._`;

      const fallbackUrl = `https://wa.me/256702615454?text=${encodeURIComponent(fallbackSummary)}`;

      const summaryMsg: ChatMessage = {
        id: `summary-${Date.now()}`,
        sender: 'assistant',
        text: `📋 *Event Brief Compiled*\n\n${fallbackSummary}\n\n📲 *Forwarding to WhatsApp Desk (+256 702 615 454)...*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev.filter(m => m.id !== interimMsg.id), summaryMsg]);
      setSummaryForwarded(true);

      if (isVoiceEnabled) {
        speakText("I have summarized all your stage specs and forwarded our chat to our WhatsApp desk at 0702 615 454. Opening WhatsApp now!", summaryMsg.id);
      }

      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setIsSummarizing(false);
    }
  };

  // Handle message sending
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading || isSummarizing) return;

    // Check if user specifically requested to summarize / forward to WhatsApp
    const lower = query.toLowerCase();
    if (
      lower.includes('summarize') || 
      lower.includes('summarise') || 
      lower.includes('sumerses') ||
      lower.includes('forward to whatsapp') ||
      lower.includes('forward chat') ||
      lower.includes('send to whatsapp') ||
      lower.includes('wrap up')
    ) {
      setInputQuery('');
      handleSummarizeAndForward();
      return;
    }

    setInputQuery('');
    stopSpeaking();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const history = messages.slice(-5).map(m => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        text: m.text,
      }));

      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history,
          serviceContext: currentService || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || "Our rigging lead will advise on this via WhatsApp at 0702 615 454. In the meantime, would you like to know about our moving heads or stage decks?";

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsLoading(false);

      if (isVoiceEnabled) {
        speakText(reply, assistantMsg.id);
      }
    } catch (error) {
      console.warn('Chat request failed, providing local assistance:', error);
      const fallbackReply = "Our technical crew is checking gear availability right now. You can chat with our lead rigger directly on WhatsApp at 0702 615 454 for instant equipment booking.";
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsLoading(false);

      if (isVoiceEnabled) {
        speakText(fallbackReply, assistantMsg.id);
      }
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    if (prompt.includes("Summarize")) {
      handleSummarizeAndForward();
    } else {
      handleSendMessage(prompt);
    }
  };

  const handleClose = () => {
    stopSpeaking();
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setIsOpen(false);
    if (onCloseExternal) {
      onCloseExternal();
    }
  };

  return (
    <>
      {/* Floating Audio Assistant Trigger Launcher */}
      {!isOpen && (
        <div className="fixed bottom-20 sm:bottom-6 left-3 sm:left-5 z-40 flex items-center gap-2">
          <button
            id="audio-bot-trigger"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full bg-[#181818] border border-[#FF2E00]/60 hover:border-[#FF2E00] text-white shadow-2xl shadow-black/80 transition-all duration-300 hover:scale-105 hover:bg-[#202020]"
            aria-label="Open Audio Voice Assistant"
          >
            <span className="absolute -inset-0.5 rounded-full bg-[#FF2E00] opacity-30 group-hover:opacity-60 blur-sm transition animate-pulse" />

            <div className="relative flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FF2E00] text-white flex items-center justify-center shadow-md">
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>

              <div className="flex flex-col text-left">
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF2E00] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-ping" />
                  Voice Concierge
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                  Audio Chat Bot
                </span>
              </div>

              {/* Soundwaves mini animation */}
              <div className="flex items-end gap-0.5 h-3.5 ml-1">
                <span className="w-0.5 sm:w-1 bg-[#FF2E00] rounded-full animate-[pulse_1s_ease-in-out_infinite] h-2" />
                <span className="w-0.5 sm:w-1 bg-[#FF2E00] rounded-full animate-[pulse_1.3s_ease-in-out_infinite] h-3.5" />
                <span className="w-0.5 sm:w-1 bg-[#FF2E00] rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2.5" />
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Main Interactive Audio Chat Window - Zero Scrollbars on Phone Screens */}
      {isOpen && (
        <div 
          className="fixed bottom-2 sm:bottom-6 left-2 sm:left-6 right-2 sm:right-auto z-50 w-auto sm:w-[430px] max-h-[92vh] sm:max-h-[600px] h-[550px] sm:h-[600px] bg-[#121212] border border-[#2D2D2D] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in no-scrollbar"
          style={{ overscrollBehavior: 'contain' }}
        >
          {/* Header Bar */}
          <div className="p-3 sm:p-4 bg-[#181818] border-b border-[#262626] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#FF2E00] to-[#b32000] text-white flex items-center justify-center shadow-lg shadow-[#FF2E00]/25">
                  {isSpeaking ? (
                    <Radio className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                  ) : (
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>
                {isSpeaking && (
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#25D366] border-2 border-[#121212] rounded-full animate-ping" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-white text-xs sm:text-sm">Royal Voice Assistant</h3>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#25D366]/20 text-[#25D366] font-bold">
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-neutral-400 truncate max-w-[190px] sm:max-w-none">
                  Talking while waiting on WhatsApp (+256 702 615 454)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Voice Sound Toggle */}
              <button
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  setIsVoiceEnabled(!isVoiceEnabled);
                }}
                className={`p-2 rounded-xl border transition ${
                  isVoiceEnabled 
                    ? 'bg-[#FF2E00]/15 border-[#FF2E00]/40 text-[#FF2E00]' 
                    : 'bg-[#222] border-[#333] text-neutral-500'
                }`}
                title={isVoiceEnabled ? 'Voice is Speaking Out Loud (Click to Mute)' : 'Voice is Muted (Click to Enable Audio)'}
                aria-label="Toggle voice output"
              >
                {isVoiceEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="p-2 rounded-xl bg-[#222] hover:bg-[#2c2c2c] text-neutral-400 hover:text-white transition"
                aria-label="Close voice assistant"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Primary Action Ribbon: Summarize & Forward to WhatsApp */}
          <div className="px-3 sm:px-4 py-2 bg-[#1A1A1A] border-b border-[#252525] flex items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-1.5 text-neutral-300 truncate">
              <span className="w-2 h-2 rounded-full bg-[#25D366] shrink-0 animate-pulse" />
              <span className="text-[11px] truncate">
                WhatsApp: <span className="font-bold text-white font-mono">+256 702 615 454</span>
              </span>
            </div>

            {/* Top Summarize & Forward Button */}
            <button
              onClick={handleSummarizeAndForward}
              disabled={isSummarizing}
              className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#25D366] hover:bg-[#20b857] disabled:opacity-50 text-white text-[10px] sm:text-[11px] font-bold shadow-md shadow-[#25D366]/20 transition"
              title="Summarize full chat and forward to WhatsApp"
            >
              <Forward className="w-3 h-3" />
              <span>Forward to WhatsApp</span>
            </button>
          </div>

          {/* Active Speaking Equalizer Waveform */}
          {isSpeaking && (
            <div className="bg-[#1C1614] border-b border-[#FF2E00]/30 px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-[11px] font-mono text-[#FF2E00] font-bold">SPEAKING:</span>
                <div className="flex items-center gap-1 h-3">
                  <span className="w-1 bg-[#FF2E00] rounded-full animate-[bounce_0.6s_infinite] h-2" />
                  <span className="w-1 bg-[#FF2E00] rounded-full animate-[bounce_0.9s_infinite] h-3" />
                  <span className="w-1 bg-[#FF2E00] rounded-full animate-[bounce_0.4s_infinite] h-1.5" />
                  <span className="w-1 bg-[#FF2E00] rounded-full animate-[bounce_0.8s_infinite] h-3" />
                  <span className="w-1 bg-[#FF2E00] rounded-full animate-[bounce_0.5s_infinite] h-2" />
                </div>
              </div>
              <button
                onClick={stopSpeaking}
                className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF2E00]/20 hover:bg-[#FF2E00]/30 text-[#FF2E00] font-bold transition"
              >
                Stop Audio
              </button>
            </div>
          )}

          {/* Message Stream - Strictly No Scrollbars */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 text-xs no-scrollbar scrollbar-none touch-pan-y">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              const isCurrentlyPlaying = currentlyPlayingId === msg.id && isSpeaking;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[88%] sm:max-w-[85%] rounded-2xl p-3 sm:p-3.5 space-y-1.5 relative transition-all ${
                      isAssistant
                        ? isCurrentlyPlaying
                          ? 'bg-[#1D1715] border border-[#FF2E00]/60 text-neutral-100 shadow-lg shadow-[#FF2E00]/10'
                          : 'bg-[#181818] border border-[#272727] text-neutral-200'
                        : 'bg-[#FF2E00] text-white font-medium'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    
                    <div className="flex items-center justify-between gap-3 text-[10px] text-neutral-400 pt-0.5">
                      <span>{msg.timestamp}</span>
                      
                      {isAssistant && (
                        <div className="flex items-center gap-1.5">
                          {isCurrentlyPlaying ? (
                            <span className="text-[10px] text-[#FF2E00] font-mono font-bold flex items-center gap-1">
                              <Radio className="w-2.5 h-2.5 animate-pulse" /> Playing
                            </span>
                          ) : (
                            <button
                              onClick={() => speakText(msg.text, msg.id)}
                              className="hover:text-white p-1 rounded hover:bg-[#252525] transition"
                              title="Listen to this message"
                              aria-label="Replay audio"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="p-3 rounded-2xl bg-[#181818] border border-[#272727] text-neutral-400 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF2E00] animate-ping" />
                  <span className="text-xs font-mono">Formulating technical answer & voice...</span>
                </div>
              </div>
            )}

            {isSummarizing && (
              <div className="flex items-start gap-2">
                <div className="p-3 rounded-2xl bg-[#16221A] border border-[#25D366]/40 text-[#25D366] flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
                  <span className="text-xs font-mono">Summarizing entire chat for WhatsApp (+256 702 615 454)...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Persistent Quick WhatsApp Summarize Callout if User has Asked Questions */}
          {userMessageCount >= 1 && (
            <div className="px-3 py-2 bg-[#172019] border-t border-[#25D366]/30 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-[#25D366]">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Ready to wrap up and reserve gear?</span>
              </div>
              <button
                onClick={handleSummarizeAndForward}
                disabled={isSummarizing}
                className="px-3 py-1 rounded-lg bg-[#25D366] hover:bg-[#20b857] text-white text-[11px] font-bold flex items-center gap-1 shadow-sm shrink-0 transition"
              >
                <Forward className="w-3 h-3" />
                <span>Forward Chat to WhatsApp</span>
              </button>
            </div>
          )}

          {/* Quick Technical Suggestion Chips - Clean Horizontal Scroll Without Scrollbars */}
          <div className="px-3 sm:px-4 py-2 bg-[#161616] border-t border-[#222222] overflow-x-auto flex items-center gap-1.5 no-scrollbar scrollbar-none touch-pan-x">
            <button
              onClick={handleSummarizeAndForward}
              className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 font-bold flex items-center gap-1 transition"
            >
              <Forward className="w-3 h-3" />
              <span>Forward to WhatsApp</span>
            </button>
            {[
              "What stage size for 500 guests?",
              "P2.9 vs P3.9 LED screen?",
              "Power generator requirements?",
              "Line array sound coverage?",
              "Kampala & upcountry delivery?"
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleQuickPrompt(chip)}
                className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#202020] hover:bg-[#282828] text-neutral-300 hover:text-white border border-[#2B2B2B] transition"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input & Voice Controls Footer */}
          <div className="p-2.5 sm:p-3 bg-[#181818] border-t border-[#262626]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Microphone Voice Input Button */}
              {recognitionSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 sm:p-2.5 rounded-xl border transition flex items-center justify-center shrink-0 ${
                    isListening
                      ? 'bg-red-600 border-red-500 text-white animate-pulse shadow-lg shadow-red-600/40'
                      : 'bg-[#222] border-[#333] text-neutral-300 hover:text-white hover:bg-[#2a2a2a]'
                  }`}
                  title={isListening ? 'Listening to your speech... (Click to stop)' : 'Click to Speak with your Microphone'}
                  aria-label="Microphone speech input"
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </button>
              )}

              {/* Text Query Input */}
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={isListening ? 'Listening to your voice...' : 'Type or ask a stage question...'}
                className="flex-1 min-w-0 px-3 py-2 sm:py-2.5 rounded-xl bg-[#121212] border border-[#2B2B2B] text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-[#FF2E00]"
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isSummarizing || !inputQuery.trim()}
                className="p-2 sm:p-2.5 rounded-xl bg-[#FF2E00] hover:bg-[#d92700] disabled:bg-neutral-800 disabled:text-neutral-600 text-white transition shadow-lg shadow-[#FF2E00]/20 shrink-0"
                aria-label="Send query"
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </form>

            <div className="mt-1.5 sm:mt-2 flex items-center justify-between text-[9px] sm:text-[10px] text-neutral-500">
              <span className="truncate">Speaks answers aloud • Powered by Gemini AI</span>
              <span className="font-mono text-neutral-400 shrink-0 ml-1">Desk: 0702 615 454</span>
            </div>
          </div>

        </div>
      )}
    </>
  );
};
