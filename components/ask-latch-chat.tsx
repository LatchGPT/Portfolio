'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  RotateCcw, 
  ExternalLink,
  RefreshCw,
  MessageSquareCode
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const SUGGESTION_POOLS: string[][] = [
  [
    "Summarize Latch's background",
    "Tell me about his QA internship at Denso Ten",
    "What is his tech stack?",
    "Tell me about Kuya Pahipak",
  ],
  [
    "How does DTR ni Latch calculate hours?",
    "What is the weighted reward roulette in Kuya Pahipak?",
    "Where can I see his GitHub repositories?",
    "What was his role at Ant Savvy Creatives?",
  ],
  [
    "What tools did he use for QA testing?",
    "What is his GWA at Rizal Technological University?",
    "Is Latch available for junior developer or QA roles?",
    "How can I contact Latch directly?",
  ],
  [
    "What are his key strengths in a software team?",
    "What databases does Latch work with?",
    "Tell me about his hardware technician work",
    "How do I download his full resume?",
  ]
];

export function AskLatchChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [suggestionPoolIndex, setSuggestionPoolIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm **Talk to Latch**, an AI assistant grounded in Latch Ayhon's portfolio.\n\nAsk me about his full-stack projects (*Kuya Pahipak* & *DTR ni Latch*), his QA internship at *Denso Ten Solutions*, his technical skills, or his availability for employment!",
      timestamp: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentSuggestions = SUGGESTION_POOLS[suggestionPoolIndex % SUGGESTION_POOLS.length];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, messages, isLoading]);

  const cycleSuggestions = () => {
    setSuggestionPoolIndex((prev) => prev + 1);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessageId = Date.now().toString();
    const newUserMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || "Sorry, I couldn't process that response. Please feel free to email Latch directly at Latchcrisford213@gmail.com!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
      // Advance to the next suggested question set!
      setSuggestionPoolIndex((prev) => prev + 1);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. You can email Latch directly at **Latchcrisford213@gmail.com**!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMessage]);
      setSuggestionPoolIndex((prev) => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: "Conversation reset! What else would you like to know about Latch's work or qualifications?",
        timestamp: 'Just now'
      }
    ]);
    setSuggestionPoolIndex(0);
  };

  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
        {lines.map((line, lIdx) => {
          if (!line.trim()) return <div key={lIdx} className="h-1" />;

          const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
          const cleanLine = isBullet ? line.trim().substring(2) : line;

          return (
            <div key={lIdx} className={isBullet ? "flex items-start gap-1.5 pl-1" : ""}>
              {isBullet && <span className="text-sky-500 font-bold">•</span>}
              <div>
                {cleanLine.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g).map((part, pIdx) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={pIdx} className="font-semibold text-neutral-900 dark:text-neutral-100">{part.slice(2, -2)}</strong>;
                  }
                  if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
                    const match = part.match(/\[(.*?)\]\((.*?)\)/);
                    if (match) {
                      return (
                        <a
                          key={pIdx}
                          href={match[2]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-sky-600 dark:text-sky-400 hover:underline font-medium"
                        >
                          {match[1]} <ExternalLink className="w-2.5 h-2.5 inline" />
                        </a>
                      );
                    }
                  }
                  return part;
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Chat Launcher */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end no-print">
        {!isOpen && (
          <>
            {/* Floating Notification Tag on top */}
            {showNotification && (
              <div className="relative mb-2.5 flex items-center justify-end animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div
                  onClick={() => {
                    setIsOpen(true);
                    setShowNotification(false);
                  }}
                  className="group/notif relative flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 shadow-xl border border-neutral-200 dark:border-neutral-700 text-xs font-medium cursor-pointer hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-2xl transition-all select-none"
                >
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-semibold text-xs text-neutral-800 dark:text-neutral-100 pl-0.5">
                    Talk to Latch
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNotification(false);
                    }}
                    className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ml-1"
                    title="Close notification"
                    aria-label="Close notification"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  {/* Speech bubble pointer arrow */}
                  <span className="absolute -bottom-1 right-6 w-2 h-2 bg-white dark:bg-neutral-900 border-r border-b border-neutral-200 dark:border-neutral-700 rotate-45 pointer-events-none"></span>
                </div>
              </div>
            )}

            {/* Circular Launcher Button with Vector Logo */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(true);
                setShowNotification(false);
              }}
              className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-neutral-700/60 dark:border-neutral-200 group focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              aria-label="Talk to Latch"
            >
              {/* Subtle hover gradient background */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              {/* Vector Logo */}
              <div className="relative flex items-center justify-center">
                <Bot className="w-6 h-6 text-sky-400 dark:text-sky-600 transition-transform duration-200 group-hover:scale-110" />
                <Sparkles className="w-3 h-3 text-amber-400 dark:text-amber-500 absolute -top-1 -right-1 animate-pulse" />
              </div>

              {/* Live status indicator dot */}
              <span className="absolute bottom-1 right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-neutral-900 dark:border-white"></span>
              </span>
            </button>
          </>
        )}
      </div>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-h-[620px] h-[84vh] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 no-print">
          {/* Header */}
          <div className="px-4 py-3.5 bg-neutral-900 text-white dark:bg-neutral-950 border-b border-neutral-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-sky-600/30 border border-sky-500/50 flex items-center justify-center">
                <Bot className="w-4 h-4 text-sky-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white tracking-tight">Talk to Latch</h3>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-medium bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    AI Assistant
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Online • Powered by Gemini
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-neutral-400">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 rounded-lg hover:text-white hover:bg-neutral-800 transition-colors"
                title="Reset Conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:text-white hover:bg-neutral-800 transition-colors"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed with Theme-Aware Scrollbar */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-neutral-50/60 dark:bg-neutral-900/60 [scrollbar-width:thin] scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-950 border border-sky-300 dark:border-sky-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                  </div>
                )}

                <div
                  className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-neutral-900 dark:bg-sky-600 text-white rounded-br-xs'
                      : 'bg-white dark:bg-neutral-800/95 border border-neutral-200 dark:border-neutral-700/80 text-neutral-800 dark:text-neutral-200 rounded-bl-xs'
                  }`}
                >
                  {renderFormattedText(msg.content)}
                  <span
                    className={`block text-[10px] mt-1.5 text-right font-mono ${
                      msg.role === 'user'
                        ? 'text-neutral-300 dark:text-sky-200'
                        : 'text-neutral-400 dark:text-neutral-500'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3 h-3 text-neutral-600 dark:text-neutral-300" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-950 border border-sky-300 dark:border-sky-800 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3 text-sky-600 dark:text-sky-400 animate-spin" />
                </div>
                <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl rounded-bl-xs px-4 py-3 shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 dark:bg-sky-400 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 dark:bg-sky-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 dark:bg-sky-400 animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono ml-1.5">
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Floating Contextual Suggestions Container (Floats above the input) */}
          {!isLoading && (
            <div className="px-3.5 py-2.5 bg-neutral-100/90 dark:bg-neutral-950/80 border-t border-neutral-200/80 dark:border-neutral-800/80 backdrop-blur-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                  <MessageSquareCode className="w-3 h-3 text-sky-500" />
                  Suggested questions:
                </span>
                <button
                  type="button"
                  onClick={cycleSuggestions}
                  className="text-[10px] text-neutral-500 dark:text-neutral-400 hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1 transition-colors px-1 py-0.5 rounded"
                  title="More suggestions"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>More</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto [scrollbar-width:none]">
                {currentSuggestions.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="text-left text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-300 dark:hover:border-sky-800 transition-all shadow-2xs hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about Latch's experience, projects, skills..."
              disabled={isLoading}
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 text-white transition-colors disabled:cursor-not-allowed shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
