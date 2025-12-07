// import { useState } from 'react';
// import { sendChatMessage } from '../services/api';

// function ChatSidebar({ context }) {
//   const [messages, setMessages] = useState([
//     { role: 'assistant', content: 'Hi! I\'m Hivemind AI. Ask me anything about the topics you\'re exploring.' }
//   ]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!input.trim() || loading) return;

//     const userMessage = input.trim();
//     setInput('');
//     setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
//     setLoading(true);

//     try {
//       const data = await sendChatMessage(userMessage);
//       setMessages((prev) => [
//         ...prev,
//         { role: 'assistant', content: data.response }
//       ]);
//     } catch (error) {
//       setMessages((prev) => [
//         ...prev,
//         { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="chat-sidebar">
//       <div className="chat-header">
//         <h2>🤖 Hivemind AI</h2>
//       </div>

//       <div className="chat-messages">
//         {messages.map((msg, index) => (
//           <div key={index} className={`chat-message ${msg.role}`}>
//             <p>{msg.content}</p>
//           </div>
//         ))}
//         {loading && (
//           <div className="chat-message assistant">
//             <p className="typing">Thinking...</p>
//           </div>
//         )}
//       </div>

//       <form className="chat-input" onSubmit={handleSend}>
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Ask about these topics..."
//           disabled={loading}
//         />
//         <button type="submit" disabled={loading}>
//           Send
//         </button>
//       </form>
//     </div>
//   );
// }

// export default ChatSidebar;

// import { useState, useRef, useEffect } from 'react';
// import { sendChatMessage } from '../services/api';

// function ChatSidebar({ context, onClose }) {
//   const [messages, setMessages] = useState([
//     {
//       role: 'assistant',
//       content: "Hi! I'm Hivemind AI. Ask me anything about the topics you're exploring.",
//     },
//   ]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!input.trim() || loading) return;

//     const userMessage = input.trim();
//     setInput('');
//     setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
//     setLoading(true);

//     try {
//       const data = await sendChatMessage(userMessage);
//       setMessages((prev) => [
//         ...prev,
//         { role: 'assistant', content: data.response },
//       ]);
//     } catch (error) {
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: 'assistant',
//           content: 'Sorry, I encountered an error. Please try again.',
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="chat-sidebar">
//       <div className="chat-header">
//         <div className="chat-title">
//           <span>🤖</span>
//           <h2>Hivemind AI</h2>
//         </div>
//         <button className="chat-close" onClick={onClose}>
//           ✕
//         </button>
//       </div>

//       {context.length > 0 && (
//         <div className="chat-context">
//           <span>Context: {context.length} articles loaded</span>
//         </div>
//       )}

//       <div className="chat-messages">
//         {messages.map((msg, index) => (
//           <div key={index} className={`chat-message ${msg.role}`}>
//             {msg.role === 'assistant' && <span className="msg-icon">🤖</span>}
//             {msg.role === 'user' && <span className="msg-icon">👤</span>}
//             <div className="msg-content">
//               <p>{msg.content}</p>
//             </div>
//           </div>
//         ))}

//         {loading && (
//           <div className="chat-message assistant">
//             <span className="msg-icon">🤖</span>
//             <div className="msg-content">
//               <p className="typing">
//                 <span></span>
//                 <span></span>
//                 <span></span>
//               </p>
//             </div>
//           </div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>

//       <form className="chat-input" onSubmit={handleSend}>
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Ask about these topics..."
//           disabled={loading}
//         />
//         <button type="submit" disabled={loading || !input.trim()}>
//           ➤
//         </button>
//       </form>
//     </div>
//   );
// }

// export default ChatSidebar;

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <h2 className="font-bold">Hivemind AI</h2>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center"
        >
          ✕
        </button>
      </div>

      {/* Context Info */}
      {context.length > 0 && (
        <div className="px-4 py-2 bg-gray-800/50 text-xs text-gray-400">
          📚 {context.length} articles loaded as context
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <span className="text-lg flex-shrink-0">
              {msg.role === 'assistant' ? '🤖' : '👤'}
            </span>
            <div
              className={`px-3 py-2 rounded-lg max-w-[85%] ${
                msg.role === 'assistant'
                  ? 'bg-gray-800 text-gray-200'
                  : 'bg-yellow-500 text-black'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2">
            <span className="text-lg">🤖</span>
            <div className="px-3 py-2 bg-gray-800 rounded-lg">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about these topics..."
            disabled={loading}
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 text-sm"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-medium rounded-lg transition-colors"
          >
            ➤
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatSidebar;