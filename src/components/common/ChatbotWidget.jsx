import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../store/contexts/AuthContext";
import { apiService as api } from "../../services/api";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";

export default function ChatbotWidget() {
  const { isAuthenticated, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am your WedLens assistant. Ask me anything about wedding photography packages, booking, payments, or cancellations."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Only show the chatbot if the user is logged in
  if (!isAuthenticated || !user) return null;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Optimistically add user message
    setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
    setLoading(true);

    try {
      const response = await api.sendChatbotMessage(userMessage);
      const botResponse = response.data.response || "I'm sorry, I couldn't process that query.";
      setMessages(prev => [...prev, { sender: "bot", text: botResponse }]);
    } catch (err) {
      console.error("Chatbot Error:", err);
      setMessages(prev => [...prev, { sender: "bot", text: "Something went wrong. Please check your connection and try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Chat Bubble Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center relative group"
          title="Ask Assistant"
        >
          <MessageSquare size={26} className="animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-80 sm:w-96 h-[480px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="bg-white/20 p-2 rounded-xl">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">WedLens Smart Assistant</h3>
                <p className="text-[10px] text-blue-100 font-medium flex items-center gap-1 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online | AI Helper
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((msg, i) => {
              const isBot = msg.sender === "bot";
              return (
                <div key={i} className={`flex gap-2.5 ${isBot ? "justify-start" : "justify-end"}`}>
                  {isBot && (
                    <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-blue-50">
                      <Bot size={16} />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm whitespace-pre-wrap ${
                      isBot
                        ? "bg-white text-gray-800 border border-gray-150 rounded-tl-none font-medium"
                        : "bg-blue-600 text-white rounded-tr-none font-bold"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {!isBot && (
                    <div className="h-8 w-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0 border border-indigo-100 font-bold text-xs">
                      {user.name?.[0]?.toUpperCase() || <User size={16} />}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-blue-50">
                  <Bot size={16} />
                </div>
                <div className="bg-white text-gray-800 border border-gray-150 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Form Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Ask about pricing, booking, rules..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none text-xs font-semibold placeholder:text-gray-400"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-blue-500/20"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
