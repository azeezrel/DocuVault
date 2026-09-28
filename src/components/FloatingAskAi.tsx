import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Maximize2,
  Bot,
  User,
  Trash2,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { askDocuMindAiDetailed } from '../services/api';

export const FloatingAskAi: React.FC = () => {
  const {
    documents,
    chatHistory,
    addChatMessage,
    clearChat,
    setActiveView,
    setSelectedDocForView,
  } = useVault();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isOpen, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputQuery.trim();
    if (!query || isTyping) return;

    addChatMessage({
      role: 'user',
      content: query,
    });

    setInputQuery('');
    setIsTyping(true);

    try {
      const activeDocs = documents.filter((d) => !d.isDeleted);
      const detailed = await askDocuMindAiDetailed(query, activeDocs, chatHistory);
      addChatMessage({
        role: 'assistant',
        content: detailed.reply,
        citations: detailed.citations,
      });
    } catch (err) {
      addChatMessage({
        role: 'assistant',
        content: 'I could not process your query right now. Please try again.',
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Floating Chat Window Popover */}
      {isOpen && (
        <div className="mb-3 w-[360px] sm:w-[400px] h-[480px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-sky-100 flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Brain gradient icon */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-fuchsia-500 via-purple-500 to-sky-400 p-0.5 flex items-center justify-center shadow-xs">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold flex items-center gap-1.5 text-white">
                  <span>Ask AI</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-sky-500/30 text-sky-300 rounded font-semibold border border-sky-400/30">
                    Vault Intelligence
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">Ask anything about your documents</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setActiveView('ai-assistant');
                }}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                title="Expand to Full View"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={clearChat}
                className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors"
                title="Clear Chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
            {chatHistory.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Bot className="w-8 h-8 mx-auto text-sky-400 mb-2" />
                <p className="font-semibold text-slate-700">Ask AI about your vault</p>
                <p className="text-[11px] mt-1 text-slate-400 max-w-xs mx-auto">
                  "When does my passport expire?", "What certificates do I have?", or "Summarize my employment contract."
                </p>
              </div>
            ) : (
              chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-sky-500 text-white rounded-tr-none shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-2xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {msg.role === 'assistant' && msg.citations && msg.citations.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">
                          Sources:
                        </span>
                        {msg.citations.map((cit, idx) => {
                          const matchedDoc = documents.find(
                            (d) =>
                              d.id === cit.documentId ||
                              (cit.documentName && d.name.toLowerCase() === cit.documentName.toLowerCase()) ||
                              d.title.toLowerCase() === cit.documentTitle.toLowerCase() ||
                              (cit.documentName && d.name.toLowerCase().includes(cit.documentName.toLowerCase()))
                          );
                          return (
                            <div
                              key={idx}
                              className="p-1.5 rounded-lg bg-sky-50/60 border border-sky-100 flex items-center justify-between text-[11px]"
                            >
                              <span className="font-semibold text-sky-900 truncate max-w-[150px]">
                                {cit.documentTitle || cit.documentName}
                              </span>
                              {matchedDoc && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsOpen(false);
                                    setSelectedDocForView(matchedDoc);
                                  }}
                                  className="text-[10px] font-bold text-sky-700 hover:text-sky-800 flex items-center gap-0.5 cursor-pointer ml-1"
                                >
                                  <span>Open</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))
            )}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400">
                <div className="w-6 h-6 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-200 px-3 py-2 rounded-xl rounded-tl-none shadow-2xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => {
                setInputQuery('What documents do I have?');
              }}
              className="px-2 py-1 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 rounded-md whitespace-nowrap transition-colors"
            >
              What docs do I have?
            </button>
            <button
              onClick={() => {
                setInputQuery('Check for upcoming expirations');
              }}
              className="px-2 py-1 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 rounded-md whitespace-nowrap transition-colors"
            >
              Any expirations?
            </button>
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about your vault..."
              className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-slate-800 placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="p-2 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-200 text-white rounded-xl transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Ask AI Button (Bottom far right) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-full shadow-lg hover:shadow-xl hover:border-sky-300 transition-all cursor-pointer active:scale-95"
        title="Ask AI"
        id="floating-ask-ai-btn"
      >
        {/* Brain Icon with Vibrant Gradient matching the screenshot */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-fuchsia-500 via-purple-500 to-sky-400 p-[1.5px] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform">
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-purple-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 4.5a3 3 0 0 0-3 3v.5a3 3 0 0 0-2.5 4.5 3 3 0 0 0 .5 3.5 3 3 0 0 0 5 1.5V4.5z" fill="url(#brain-grad-1)" stroke="none" />
              <path d="M12 4.5a3 3 0 0 1 3 3v.5a3 3 0 0 1 2.5 4.5 3 3 0 0 1-.5 3.5 3 3 0 0 1-5 1.5V4.5z" fill="url(#brain-grad-2)" stroke="none" />
              <defs>
                <linearGradient id="brain-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="brain-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <span className="text-xs font-extrabold text-slate-800 tracking-tight pr-1">
          Ask AI
        </span>
      </button>
    </div>
  );
};
