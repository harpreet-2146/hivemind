import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api';

function ChatSidebar({ context, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm Hivemind AI. Ask me anything about the topics you're exploring.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // subtle focus when sidebar opens
    containerRef.current?.focus();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const data = await sendChatMessage(userMessage);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.response },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-full flex flex-col bg-gradient-to-b from-[#070417]/80 to-[#060612]/90 border-l border-white/6 shadow-2xl"
      role="complementary"
      aria-label="Hivemind chat sidebar"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md">
            🤖
          </div>
          <div>
            <h2 className="text-sm font-semibold">Hivemind AI</h2>
            <div className="text-xs text-indigo-200/60 -mt-0.5">Context-aware assistant</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-indigo-100/60 hidden sm:block px-2 py-1 rounded-md bg-white/3 border border-white/6">
            {context.length} articles
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/4 hover:bg-white/6 transition flex items-center justify-center border border-white/8"
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>
      </div>

      {context.length > 0 && (
        <div className="px-4 py-2 mx-3 rounded-lg bg-white/6 backdrop-blur-sm border border-white/8 text-xs text-indigo-100/70">
          <strong className="mr-2">📚</strong>
          {context.length} articles loaded as context for the assistant
        </div>
      )}

      <div
        ref={containerRef}
        tabIndex={-1}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={index}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end`}
            >
              {!isUser && (
                <div className="flex-shrink-0 mr-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-indigo-600/20 text-indigo-100">
                    🤖
                  </div>
                </div>
              )}

              <div
                className={`
                  max-w-[78%] min-w-[18%]
                  ${isUser ? 'text-right' : 'text-left'}
                `}
              >
                <div
                  className={`
                    inline-block px-4 py-2 rounded-2xl
                    ${isUser ? 'rounded-br-none bg-indigo-500 text-white shadow-md' : 'rounded-bl-none bg-white/6 text-indigo-50'}
                    break-words text-sm leading-relaxed
                  `}
                  style={{
                    boxShadow: isUser
                      ? '0 8px 24px rgba(99,102,241,0.18)'
                      : 'inset 0 1px 0 rgba(255,255,255,0.02)',
                    backdropFilter: !isUser ? 'blur(6px)' : undefined,
                  }}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                <div className={`mt-1 text-[11px] ${isUser ? 'text-indigo-200/60' : 'text-slate-400'}`}>
                  {isUser ? 'You' : 'Assistant'}
                </div>
              </div>

              {isUser && (
                <div className="flex-shrink-0 ml-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-indigo-700 text-white">
                    👤
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-indigo-600/20 text-indigo-100">🤖</div>
            <div className="inline-flex items-center gap-1 px-3 py-2 rounded-2xl bg-white/6 text-indigo-50">
              <span className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '0.08s' }} />
              <span className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '0.16s' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-white/6 bg-gradient-to-t from-[#06050a]/60 to-transparent">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the loaded topics..."
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-2xl bg-white/4 placeholder-indigo-200/40 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 border border-white/6"
            aria-label="Chat input"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white shadow-md transition-transform disabled:opacity-60"
            aria-label="Send message"
          >
            <svg className="w-5 h-5 -rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </form>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(99,102,241,0.28), rgba(99,102,241,0.18));
          border-radius: 999px;
          border: 2px solid rgba(0,0,0,0.12);
        }
      `}</style>
    </div>
  );
}

export default ChatSidebar;
