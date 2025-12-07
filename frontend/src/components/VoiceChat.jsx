import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api';

const LANGUAGES = [
  { code: 'en-US', name: 'English' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'zh-CN', name: 'Chinese' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'ar-SA', name: 'Arabic' },
  { code: 'pt-BR', name: 'Portuguese' },
  { code: 'ru-RU', name: 'Russian' },
  { code: 'it-IT', name: 'Italian' },
];

function VoiceChat({ context, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Hivemind AI. Speak or type your question!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en-US');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        // Auto-send after voice input
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Update recognition language
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLang;
    }
  }, [selectedLang]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Text-to-Speech
  const speak = (text) => {
    if (!voiceEnabled) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang;
    utterance.rate = 1;
    utterance.pitch = 1;
    
    // Try to find a voice for the selected language
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(selectedLang.split('-')[0]));
    if (voice) {
      utterance.voice = voice;
    }
    
    window.speechSynthesis.speak(utterance);
  };

  // Start listening
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Send message
  const handleSendMessage = async (text) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: messageText }]);
    setLoading(true);

    try {
      const data = await sendChatMessage(messageText);
      const response = data.response;
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      
      // Speak the response
      speak(response);
    } catch (error) {
      const errorMsg = 'Sorry, something went wrong. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
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

      {/* Language & Voice Settings */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800 bg-gray-800/50">
        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="bg-gray-700 text-white text-sm px-2 py-1 rounded border border-gray-600 focus:outline-none"
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
        
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`px-2 py-1 rounded text-sm ${voiceEnabled ? 'bg-green-600' : 'bg-gray-600'}`}
        >
          {voiceEnabled ? '🔊 Voice On' : '🔇 Voice Off'}
        </button>
      </div>

      {/* Context Info */}
      {context.length > 0 && (
        <div className="px-4 py-2 bg-gray-800/30 text-xs text-gray-400">
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
            
            {/* Replay button for assistant messages */}
            {msg.role === 'assistant' && index > 0 && (
              <button
                onClick={() => speak(msg.content)}
                className="text-gray-500 hover:text-white text-sm"
                title="Replay"
              >
                🔊
              </button>
            )}
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

      {/* Input Area */}
      <div className="p-4 border-t border-gray-800">
        {/* Voice Button */}
        <div className="flex justify-center mb-3">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={loading}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all ${
              isListening
                ? 'bg-red-500 animate-pulse scale-110'
                : 'bg-yellow-500 hover:bg-yellow-400'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isListening ? '⏹️' : '🎤'}
          </button>
        </div>
        
        <p className="text-center text-xs text-gray-500 mb-3">
          {isListening ? 'Listening... Speak now!' : 'Tap microphone to speak'}
        </p>

        {/* Text Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Or type your message..."
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
        </form>
      </div>
    </div>
  );
}

export default VoiceChat;