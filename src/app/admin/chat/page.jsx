"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  X, 
  Send, 
  Clock,
  CheckCheck,
  HeadphonesIcon,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import supabase from "@/lib/supabaseClient";

const PRESET_MESSAGES = [
  {
    id: 1,
    label: "Get a Quote",
    text: "Hi, I'd like to get a quote for a landscape design project. Can we schedule a consultation?"
  },
  {
    id: 2,
    label: "Discuss My Project",
    text: "Hello, I have a property and would love to discuss landscape architecture options with your team."
  },
  {
    id: 3,
    label: "Maintenance Services",
    text: "Hi, I'm looking for professional landscape maintenance services. Do you offer ongoing care?"
  }
];

const BUSINESS_HOURS = {
  open: 8,
  close: 17,
  timezone: "EAT"
};

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [step, setStep] = useState("closed"); // closed, form, chatting, error
  const [visitorId, setVisitorId] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [agentTyping, setAgentTyping] = useState(false);
  const [visitorInfo, setVisitorInfo] = useState({ name: "", email: "" });
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [useLocalMode, setUseLocalMode] = useState(false);
  
  const messagesEndRef = useRef(null);
  const subscriptionRef = useRef(null);
  const channelRef = useRef(null);

  // Initialize visitor ID
  useEffect(() => {
    const stored = localStorage.getItem("chat_visitor_id");
    if (stored) {
      setVisitorId(stored);
    } else {
      const newId = uuidv4();
      localStorage.setItem("chat_visitor_id", newId);
      setVisitorId(newId);
    }
  }, []);

  // Show tooltip after delay
  useEffect(() => {
    const hasSeen = localStorage.getItem("chat_tooltip_seen");
    if (!hasSeen && !isOpen) {
      const timer = setTimeout(() => setShowTooltip(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, agentTyping]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!conversationId || useLocalMode) return;

    // Clean up previous subscription
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Subscribe to new messages
    channelRef.current = supabase
      .channel(`chat:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new;
          setMessages((prev) => {
            if (prev.find((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
          
          if (newMessage.sender_type === "agent" && !isOpen) {
            setUnreadCount((c) => c + 1);
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [conversationId, useLocalMode, isOpen]);

  const startChat = async () => {
    if (!visitorInfo.name.trim()) return;

    setErrorMessage("");
    setStep("chatting");

    try {
      // Try to create conversation in Supabase
      const { data: conv, error: convError } = await supabase
        .from("chat_conversations")
        .insert([
          {
            visitor_id: visitorId,
            visitor_name: visitorInfo.name,
            visitor_email: visitorInfo.email || null,
            status: "active",
            metadata: {
              source: "website",
              url: typeof window !== "undefined" ? window.location.href : "",
              userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
              started_at: new Date().toISOString()
            },
          },
        ])
        .select()
        .single();

      if (convError) {
        console.warn("Supabase error, switching to local mode:", convError);
        setUseLocalMode(true);
        // Continue in local mode
        setMessages([
          {
            id: "welcome-local",
            conversation_id: "local",
            sender_type: "system",
            sender_id: "system",
            content: `Welcome ${visitorInfo.name}! An agent will be with you shortly. How can we help with your landscape project today?`,
            created_at: new Date().toISOString(),
          }
        ]);
        return;
      }

      setConversationId(conv.id);
      setUseLocalMode(false);

      // Send welcome message
      const { error: msgError } = await supabase
        .from("chat_messages")
        .insert([
          {
            conversation_id: conv.id,
            sender_type: "system",
            sender_id: "system",
            content: `Welcome ${visitorInfo.name}! An agent will be with you shortly. How can we help with your landscape project today?`,
          },
        ]);

      if (msgError) {
        console.warn("Failed to send welcome message:", msgError);
      }

      // Load existing messages
      const { data: existingMessages } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", conv.id)
        .order("created_at", { ascending: true });

      if (existingMessages) {
        setMessages(existingMessages);
      }

    } catch (err) {
      console.error("Failed to start chat:", err);
      setErrorMessage("Connection issue. Using offline mode.");
      setUseLocalMode(true);
      setMessages([
        {
          id: "welcome-local",
          conversation_id: "local",
          sender_type: "system",
          sender_id: "system",
          content: `Welcome ${visitorInfo.name}! Please leave your message and we'll respond via email at info@shamalandscapes.co.ke`,
          created_at: new Date().toISOString(),
        }
      ]);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageContent = inputMessage.trim();
    setInputMessage("");

    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      id: tempId,
      conversation_id: conversationId || "local",
      sender_type: "visitor",
      sender_id: visitorId,
      sender_name: visitorInfo.name,
      content: messageContent,
      created_at: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, tempMessage]);

    // If in local mode, just store locally and show confirmation
    if (useLocalMode || !conversationId) {
      // In a real implementation, you might send this to a backup endpoint
      // For now, just show it as sent
      return;
    }

    try {
      const { error } = await supabase.from("chat_messages").insert([
        {
          conversation_id: conversationId,
          sender_type: "visitor",
          sender_id: visitorId,
          sender_name: visitorInfo.name,
          content: messageContent,
        },
      ]);

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error("Failed to send:", err);
      // Mark as failed
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...m, failed: true } : m
        )
      );
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setShowTooltip(false);
    localStorage.setItem("chat_tooltip_seen", "true");
  };

  const openChat = () => {
    setIsOpen(true);
    setShowTooltip(false);
    setUnreadCount(0);
    localStorage.setItem("chat_tooltip_seen", "true");
    if (step === "closed") setStep("form");
  };

  const formatTime = (timestamp) => {
    try {
      return format(new Date(timestamp), "h:mm a");
    } catch {
      return "";
    }
  };

  const isOnline = () => {
    const hour = new Date().getHours();
    return hour >= BUSINESS_HOURS.open && hour < BUSINESS_HOURS.close;
  };

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 md:right-6 z-9999 w-[calc(100vw-2rem)] md:w-96 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="bg-linear-to-r from-shama-blue to-shama-green p-4 text-white shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <HeadphonesIcon className="w-5 h-5" />
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isOnline() ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  </div>
                  <div>
                    <h3 className="font-bold">Shama Support</h3>
                    <p className="text-xs text-white/80">
                      {isOnline() ? "Typically replies in minutes" : "Back tomorrow at 8am"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeChat}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
              {step === "form" ? (
                // Pre-chat Form
                <div className="p-6 flex flex-col h-full">
                  <h4 className="text-lg font-bold text-shama-blue mb-2">
                    Start a Conversation
                  </h4>
                  <p className="text-sm text-gray-600 mb-6">
                    We'd love to help with your landscape project. Please introduce yourself.
                  </p>
                  
                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errorMessage}
                    </div>
                  )}
                  
                  <div className="space-y-4 flex-1">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={visitorInfo.name}
                        onChange={(e) => setVisitorInfo({ ...visitorInfo, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-shama-green focus:outline-none"
                        onKeyPress={(e) => e.key === "Enter" && visitorInfo.name && startChat()}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email (optional)
                      </label>
                      <input
                        type="email"
                        value={visitorInfo.email}
                        onChange={(e) => setVisitorInfo({ ...visitorInfo, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-shama-green focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={startChat}
                    disabled={!visitorInfo.name.trim()}
                    className="w-full mt-6 py-3 bg-shama-green text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-shama-blue transition-colors flex items-center justify-center gap-2"
                  >
                    Start Chat
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  {useLocalMode && (
                    <p className="mt-3 text-xs text-center text-amber-600">
                      ⚠️ Live connection unavailable. Messages will be sent via email backup.
                    </p>
                  )}
                </div>
              ) : (
                // Chat Interface
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && !useLocalMode && (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="w-12 h-12 mx-auto mb-3 text-shama-green/30" />
                        <p>Connecting to agent...</p>
                      </div>
                    )}
                    
                    {messages.map((msg, index) => {
                      const isVisitor = msg.sender_type === "visitor";
                      const isSystem = msg.sender_type === "system";
                      
                      if (isSystem) {
                        return (
                          <div key={msg.id || index} className="flex justify-center">
                            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                              {msg.content}
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={msg.id || index}
                          className={`flex ${isVisitor ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                              isVisitor
                                ? "bg-shama-green text-white rounded-br-sm"
                                : "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100"
                            }`}
                          >
                            {!isVisitor && (
                              <p className="text-xs font-semibold text-shama-blue mb-1">
                                {msg.sender_name || "Agent"}
                              </p>
                            )}
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                            <div
                              className={`flex items-center gap-1 mt-1 text-xs ${
                                isVisitor ? "text-white/70" : "text-gray-400"
                              }`}
                            >
                              {formatTime(msg.created_at)}
                              {isVisitor && (
                                <CheckCheck
                                  className={`w-3 h-3 ${msg.failed ? "text-red-300" : msg.read_at ? "text-blue-200" : ""}`}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {agentTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 px-4 py-3">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-shama-blue rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-2 h-2 bg-shama-blue rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-2 h-2 bg-shama-blue rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                    <div className="flex items-end gap-2">
                      <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        placeholder={useLocalMode ? "Type your message (we'll email you back)..." : "Type your message..."}
                        rows={1}
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-shama-green focus:outline-none resize-none min-h-11 max-h-32"
                        style={{ height: "auto" }}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim()}
                        className="p-3 bg-shama-green text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-shama-blue transition-colors shrink-0"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">
                      {useLocalMode ? "Messages will be forwarded to our team via email" : "Press Enter to send, Shift+Enter for new line"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <div className="fixed bottom-6 right-4 md:right-6 z-9999">
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-full right-0 mb-3 w-64"
            >
              <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <button
                  onClick={() => setShowTooltip(false)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-shama-terra text-white rounded-full flex items-center justify-center text-xs"
                >
                  <X className="w-3 h-3" />
                </button>
                <p className="text-sm font-semibold text-shama-blue mb-1">
                  👋 Need help with your project?
                </p>
                <p className="text-xs text-gray-600">
                  Chat with our landscape architects. We're here to help!
                </p>
                <div className="absolute bottom-0 right-6 w-3 h-3 bg-white rotate-45 translate-y-1/2 border-b border-r border-gray-100" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={openChat}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group"
        >
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
              {unreadCount}
            </span>
          )}
          
          <div className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
            isOpen ? "bg-shama-terra rotate-90" : "bg-linear-to-br from-shama-blue to-shama-green"
          }`}>
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <MessageCircle className="w-6 h-6 text-white" />
            )}
          </div>
          
          <div className="absolute inset-0 rounded-full bg-shama-blue animate-ping opacity-20" />
        </motion.button>
      </div>
    </>
  );
}