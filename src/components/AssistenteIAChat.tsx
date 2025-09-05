import { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AssistenteIAChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssistenteIAChat = ({ isOpen, onClose }: AssistenteIAChatProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '👋 Olá! Eu sou sua Assistente IA Jurídica. Posso ajudá-lo a:\n\n📖 Explicar conceitos jurídicos complexos\n📝 Resumir legislações e artigos\n🔍 Esclarecer dúvidas sobre direito\n📚 Orientar sobre estudos\n\nComo posso ajudá-lo hoje?',
      timestamp: Date.now(),
      typing: false
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Efeito de digitação para mensagens da IA
  const typeMessage = (content: string, callback?: () => void) => {
    setIsTyping(true);
    setTypingMessage('');
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < content.length) {
        setTypingMessage(prev => prev + content[index]);
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        callback?.();
      }
    }, 30);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user' as const,
      content: message,
      timestamp: Date.now(),
      typing: false
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    // Simular resposta da IA com efeito de digitação
    setTimeout(() => {
      const botResponse = 'Obrigada pela sua pergunta! 😊 Esta é uma versão demonstrativa. Em breve terei acesso completo para te ajudar com suas dúvidas jurídicas. Continue estudando! 📚✨';
      
      typeMessage(botResponse, () => {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot' as const,
          content: botResponse,
          timestamp: Date.now(),
          typing: false
        };
        
        setMessages(prev => [...prev, botMessage]);
        setTypingMessage('');
      });
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Chat Container com animação de subida suave */}
      <div className="relative w-full max-w-md h-[80vh] bg-gradient-to-br from-red-800 via-red-900 to-red-950 rounded-t-3xl shadow-2xl overflow-hidden animate-chat-slide-up border border-red-600/30">
        {/* Efeito de brilho animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 via-transparent to-red-600/10 animate-pulse" />
        
        {/* Header com avatar melhorado */}
        <div className="relative bg-black/30 backdrop-blur-md p-4 flex items-center justify-between border-b border-red-400/20">
          <div className="flex items-center space-x-3">
            {/* Avatar da professora com animações */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 via-red-500 to-red-700 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
                <Bot className="w-7 h-7 text-white animate-bounce" />
                {/* Sparkles animados */}
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-ping" />
              </div>
              {/* Indicador online */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg animate-fade-in">Professora IA</h3>
              <p className="text-red-200 text-sm font-medium animate-fade-in flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Pronta para ajudar
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300 hover:rotate-90"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages com animações melhoradas */}
        <div className="flex-1 p-4 overflow-y-auto h-[calc(80vh-140px)] space-y-4 scroll-smooth">
          {messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`flex animate-fade-in ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-300 ${
                  msg.type === 'user'
                    ? 'bg-white text-gray-800 rounded-br-md shadow-red-500/20'
                    : 'bg-gradient-to-br from-white/25 to-white/15 text-white rounded-bl-md backdrop-blur-sm border border-white/10'
                }`}
              >
                <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          
          {/* Indicador de digitação */}
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="max-w-[85%] p-4 rounded-2xl bg-gradient-to-br from-white/25 to-white/15 text-white rounded-bl-md backdrop-blur-sm border border-white/10">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm ml-2">Digitando...</span>
                </div>
                {typingMessage && (
                  <p className="text-sm mt-2 whitespace-pre-line leading-relaxed">{typingMessage}</p>
                )}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input melhorado */}
        <div className="relative p-4 bg-black/40 backdrop-blur-md border-t border-red-400/20">
          <div className="flex space-x-3">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua dúvida jurídica... 💭"
              className="flex-1 bg-white/20 border-red-400/30 text-white placeholder:text-red-200/60 rounded-full px-4 py-3 focus:ring-2 focus:ring-red-400/50 transition-all duration-300"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isTyping || !message.trim()}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 rounded-full px-6 py-3 shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};