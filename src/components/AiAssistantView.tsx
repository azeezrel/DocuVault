import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  HelpCircle,
  Folder,
} from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { askDocuMindAiDetailed } from '../services/api';

export const AiAssistantView: React.FC = () => {
  const {
    documents,
    chatHistory,
    addChatMessage,
    clearChat,
    setSelectedDocForView,
    searchQuery,
    setSearchQuery,
  } = useVault();

  const [inputQuery, setInputQuery] = useState(searchQuery || '');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (searchQuery && searchQuery.trim()) {
      handleSend(searchQuery);
    }
  }, []);

  const suggestedQuestions = [
    'When does my passport expire?',
    'Show me all my certificates.',
    'What documents do I need to renew soon?',
    'Find documents related to my house.',
    'When should I notify my landlord?',
    'How much did I spend on groceries this month?',
  ];

  const handleSend = async (queryToSend?: string) => {
    const text = (queryToSend || inputQuery).trim();
    if (!text || isLoading) return;

    setInputQuery('');
    setSearchQuery('');

    // Add user message
    addChatMessage({
      role: 'user',
      content: text,
    });

    setIsLoading(true);

    try {
      const detailedResult = await askDocuMindAiDetailed(text, documents, chatHistory);
      addChatMessage({
        role: 'assistant',
        content: detailedResult.reply,
        citations: detailedResult.citations,
      });
    } catch (err) {
      addChatMessage({
        role: 'assistant',
        content: 'I was unable to retrieve that information right now. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Helper to detect document references in message and make them interactive
  const renderMessageContent = (content: string) => {
    return (
      <div className="prose prose-sm max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* View Header */}
      <div className="flex items-center justify-between pb-3 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>DocuMind AI Assistant</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                AI Assistant
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Semantic reasoning and question answering across your {documents.length} personal documents
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="text-xs font-medium text-slate-400 hover:text-sky-700 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggested Questions Grid (Concept #4) */}
      <div>
        <p className="text-[11px] font-bold text-slate-600 tracking-wider mb-2">
          FREQUENT LIFE ADMIN QUESTIONS
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="text-left p-2.5 rounded-xl bg-white hover:bg-sky-50/80 border border-sky-100 hover:border-sky-300 text-xs font-medium text-slate-700 transition-all shadow-2xs group flex items-start justify-between"
            >
              <span className="group-hover:text-sky-800 transition-colors line-clamp-1">{q}</span>
              <Sparkles className="w-3.5 h-3.5 text-sky-400 group-hover:text-sky-600 flex-shrink-0 ml-1.5 mt-0.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white border border-sky-100 rounded-2xl shadow-xs overflow-hidden flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200 flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm ${
                  msg.role === 'user'
                    ? 'bg-sky-500 text-white shadow-xs rounded-tr-none'
                    : 'bg-slate-50 text-slate-800 border border-sky-100 shadow-2xs rounded-tl-none'
                }`}
              >
                {renderMessageContent(msg.content)}

                {/* RAG Citations Block (Concept #6) */}
                {msg.role === 'assistant' && msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <FileText className="w-3.5 h-3.5 text-sky-600" />
                      <span>Source Citations (RAG)</span>
                    </div>

                    <div className="space-y-1.5">
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
                            className="flex items-center justify-between p-2 rounded-xl bg-white border border-sky-100 shadow-2xs text-xs gap-2"
                          >
                            <div className="truncate">
                              <div className="font-semibold text-slate-900 truncate">
                                {cit.documentTitle || cit.documentName}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {cit.documentName} {cit.page ? `• Page ${cit.page}` : ''}
                                {cit.snippet ? ` — "${cit.snippet.slice(0, 50)}..."` : ''}
                              </div>
                            </div>

                            {matchedDoc && (
                              <button
                                type="button"
                                onClick={() => setSelectedDocForView(matchedDoc)}
                                className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                              >
                                <span>Open Document</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <span
                  className={`block text-[10px] mt-1.5 text-right ${
                    msg.role === 'user' ? 'text-sky-100' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  AB
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200 flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-sky-100 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce delay-200"></div>
                <span className="text-[11px] ml-1">Searching and reasoning across your DocuMind...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-sky-100 bg-slate-50/60">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your documents, certificates, rent, expiry dates..."
              className="w-full pl-4 pr-12 py-3 bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 rounded-xl border border-sky-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all shadow-2xs"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputQuery.trim() || isLoading}
              className={`absolute right-2 p-2 rounded-lg text-white transition-all ${
                inputQuery.trim() && !isLoading
                  ? 'bg-sky-500 hover:bg-sky-600 shadow-xs'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-600 text-center mt-2">
            Answers are grounded strictly in your uploaded personal library and will cite exact source files.
          </p>
        </div>
      </div>
    </div>
  );
};
