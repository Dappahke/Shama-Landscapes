"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, X, Send, HeadphonesIcon, ArrowRight
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState("form"); // form, chatting
  const [visitorId, setVisitorId] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [visitorInfo, setVisitorInfo] = useState({ name: "", email: "" });

  const messagesEndRef = useRef(null);

  // --- 1. Identity & Rehydration ---
  useEffect(() => {
    // Get or Create Visitor UUID
    let id = localStorage.getItem("chat_visitor_id");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("chat_visitor_id", id);
    }
    setVisitorId(id);

    // Load saved visitor info (Name/Email)
    const savedInfo = localStorage.getItem("chat_visitor_info");
    if (savedInfo) {
      setVisitorInfo(JSON.parse(savedInfo));
    }

    // Check for existing active conversation
    const activeConv = localStorage.getItem("active_conv_id");
    if (activeConv) {
      setConversationId(activeConv);
      setStep("chatting");
      fetchMessages(activeConv);
    }
  }, []);

  const fetchMessages = async (id) => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });
    if (data) setMessages(data);
  };

  // --- 2. Real-time Subscription ---
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on("postgres_changes", { 
        event: "INSERT", 
        schema: "public", 
        table: "chat_messages", 
        filter: `conversation_id=eq.${conversationId}` 
      }, (payload) => {
        setMessages((prev) => {
          if (prev.find(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- 3. Start Conversation ---
  const startChat = async () => {
    if (!visitorInfo.name.trim()) return;

    // Save info locally so refresh doesn't break the UI
    localStorage.setItem("chat_visitor_info", JSON.stringify(visitorInfo));

    const { data: conv, error } = await supabase
      .from("chat_conversations")
      .insert([{
        visitor_id: visitorId,
        visitor_name: visitorInfo.name,
        visitor_email: visitorInfo.email,
        status: "active"
      }])
      .select().single();

    if (error) {
      console.error("Error creating conversation:", error);
      return;
    }

    setConversationId(conv.id);
    localStorage.setItem("active_conv_id", conv.id);
    setStep("chatting");

    await supabase.from("chat_messages").insert([{
      conversation_id: conv.id,
      sender_type: "system",
      content: `Chat started by ${visitorInfo.name}`
    }]);
  };

  // --- 4. Send Message ---
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;
    
    const content = inputMessage.trim();
    setInputMessage("");
    setIsSending(true);

    const { error } = await supabase.from("chat_messages").insert([{
      conversation_id: conversationId,
      sender_type: "visitor",
      sender_id: visitorId,
      sender_name: visitorInfo.name,
      content: content,
      attachments: [] // Satisfies your JSONB column requirement
    }]);

    if (error) {
      console.error("Message failed:", error);
      setInputMessage(content); // Restore message on fail
    }
    setIsSending(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl flex flex-col max-h-[70vh] z-50 border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-blue-600 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-2">
                <HeadphonesIcon size={20}/>
                <h3 className="font-bold">Live Support</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X size={20}/>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f9fafb]">
              {step === "form" ? (
                <div className="space-y-4 py-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 font-medium">How can we help you today?</p>
                  </div>
                  <input 
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white" 
                    placeholder="Your Name" 
                    value={visitorInfo.name}
                    onChange={e => setVisitorInfo({...visitorInfo, name: e.target.value})}
                  />
                  <input 
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white" 
                    placeholder="Email Address" 
                    value={visitorInfo.email}
                    onChange={e => setVisitorInfo({...visitorInfo, email: e.target.value})}
                  />
                  <button 
                    onClick={startChat}
                    className="w-full bg-green-600 text-white p-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg active:scale-[0.98]"
                  >
                    Start Conversation <ArrowRight size={18}/>
                  </button>
                </div>
              ) : (
                <>
                  {messages.map((m, i) => {
                    const isVisitor = m.sender_type === "visitor";
                    const isSystem = m.sender_type === "system";

                    if (isSystem) return (
                      <div key={m.id || i} className="flex justify-center italic text-[10px] text-gray-400 py-1 uppercase tracking-tighter">
                        {m.content}
                      </div>
                    );

                    return (
                      <div key={m.id || i} className={`flex ${isVisitor ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                          isVisitor 
                            ? "bg-green-600 text-white rounded-tr-none" 
                            : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
                        }`}>
                          <p className="leading-relaxed">{m.content}</p>
                          <span className={`text-[9px] mt-1 block opacity-60 text-right`}>
                            {m.created_at ? format(new Date(m.created_at), "h:mm a") : "Just now"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Footer */}
            {step === "chatting" && (
              <div className="p-3 bg-white border-t flex gap-2 items-center">
                <input 
                  className="flex-1 p-2.5 bg-gray-100 rounded-xl outline-none text-sm focus:bg-white focus:ring-1 focus:ring-blue-200 transition-all"
                  placeholder="Message..."
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                />
                <button 
                  onClick={handleSendMessage} 
                  disabled={!inputMessage.trim() || isSending}
                  className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 transition-all shadow-md"
                >
                  <Send size={18}/>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50 group"
      >
        <MessageCircle size={32} className="group-hover:rotate-12 transition-transform"/>
      </button>
    </>
  );
}