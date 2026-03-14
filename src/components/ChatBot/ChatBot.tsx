import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../../services/chatService';
import { 
  ChatBubbleBottomCenterTextIcon, 
  XMarkIcon,
  PaperAirplaneIcon,
  MinusIcon,
  FaceSmileIcon
} from '@heroicons/react/24/outline';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: '¡Hola! Soy Juli, tu asistente virtual. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const response = await chatService.askBot(message, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: response.response }]);
    } catch (error) {
      console.error('Error in chatbot:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, tuve un problema técnico. ¿Podrías repetir eso?' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-orange-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all z-50 animate-bounce"
      >
        <ChatBubbleBottomCenterTextIcon className="w-8 h-8" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-96 bg-white rounded-3xl shadow-2xl z-50 border border-gray-100 flex flex-col transition-all duration-300 ${minimized ? 'h-16' : 'h-[550px]'}`}>
      {/* Header */}
      <div className={`p-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-t-3xl flex items-center justify-between shadow-lg`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center font-bold text-xl">J</div>
          <div>
            <p className="font-black text-sm tracking-widest uppercase">Juli Assistant</p>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">En línea ahora</p>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setMinimized(!minimized)} className="p-1 hover:bg-white/10 rounded-lg"><MinusIcon className="w-5 h-5" /></button>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg"><XMarkIcon className="w-5 h-5" /></button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto space-y-4 bg-gray-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-orange-600 text-white rounded-tr-none font-medium' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 font-medium'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl border border-gray-100 flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 bg-white rounded-b-3xl border-t border-gray-50 flex items-center space-x-2">
            <button type="button" className="p-2 text-gray-400 hover:text-orange-500 transition-colors"><FaceSmileIcon className="w-6 h-6" /></button>
            <input 
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-gray-100 border-0 rounded-2xl px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-gray-900"
            />
            <button 
              type="submit" 
              disabled={loading || !message.trim()}
              className="p-3 bg-orange-600 text-white rounded-2xl hover:bg-orange-700 transition-all disabled:opacity-50 shadow-lg shadow-orange-100"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatBot;
