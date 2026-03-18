"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, X, Send, HeadphonesIcon, Paperclip, FileText, Image as ImageIcon, X as XIcon, Download
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState("form");
  const [visitorId, setVisitorId] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [visitorInfo, setVisitorInfo] = useState({ name: "", email: "", phone: "" });
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const colors = {
    clay: "#F5EBE8",
    blue: "#3596D5",
    green: "#0F7F40",
  };

  // 🔔 Request notification permission once
  useEffect(() => {
    if (typeof window !== "undefined" && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // 🔊 Play sound
  const playSound = () => {
    const audio = new Audio("/notification.mp3");
    audio.play().catch(() => {});
  };

  // Check for existing visitor
  const checkExistingVisitor = async (email, phone) => {
    if (!email && !phone) return null;
    try {
      let query = supabase.from("chat_conversations").select("*").order("created_at", { ascending: false });
      if (email && phone) query = query.or(`visitor_email.eq.${email},visitor_phone.eq.${phone}`);
      else if (email) query = query.eq("visitor_email", email);
      else if (phone) query = query.eq("visitor_phone", phone);
      
      const { data } = await query.limit(1).maybeSingle();
      return data ? { visitor_id: data.visitor_id, name: data.visitor_name, email: data.visitor_email, phone: data.visitor_phone } : null;
    } catch (err) { return null; }
  };

  useEffect(() => {
    const init = async () => {
      let id = localStorage.getItem("chat_visitor_id") || uuidv4();
      const savedInfo = localStorage.getItem("chat_visitor_info");
      const activeConv = localStorage.getItem("active_conv_id");

      if (savedInfo) {
        const parsed = JSON.parse(savedInfo);
        const existing = await checkExistingVisitor(parsed.email, parsed.phone);
        if (existing) {
          id = existing.visitor_id;
          setVisitorInfo(existing);
        } else {
          setVisitorInfo(parsed);
        }
      }
      
      setVisitorId(id);
      localStorage.setItem("chat_visitor_id", id);

      if (activeConv && savedInfo) {
        setConversationId(activeConv);
        setStep("chatting");
        fetchMessages(activeConv);
      }
    };
    init();
  }, []);

  const fetchMessages = async (id) => {
    const { data } = await supabase.from("chat_messages").select("*").eq("conversation_id", id).order("created_at", { ascending: true });
    if (data) setMessages(data);
  };

  // 🔥 Realtime Messages + Notifications
  useEffect(() => {
    if (!conversationId) return;
    
    const channel = supabase.channel(`chat_realtime_${conversationId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `conversation_id=eq.${conversationId}` }, 
        (payload) => {
          const msg = payload.new;

          setMessages(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg]);

          // 🔔 Only notify for incoming (agent) messages
          if (msg.sender_type !== "visitor") {
            playSound();

            if (document.hidden && Notification.permission === "granted") {
              new Notification("New Message", {
                body: msg.content || "New attachment received",
              });
            }
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOtherTyping]);

  const sendTypingStatus = async (isTyping) => {
    if (!conversationId) return;
    await supabase.from("chat_typing").upsert({
      conversation_id: conversationId,
      user_id: visitorId,
      user_type: "visitor",
      typing_at: new Date()
    }, { onConflict: 'conversation_id, user_id' });
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    sendTypingStatus(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => sendTypingStatus(false), 3000);
  };

  const startChat = async () => {
    if (!visitorInfo.name.trim()) return;

    try {
      const { data: conv, error } = await supabase.from("chat_conversations").insert([{
        visitor_id: visitorId, 
        visitor_name: visitorInfo.name, 
        visitor_email: visitorInfo.email,
        visitor_phone: visitorInfo.phone, 
        status: "active", 
        source: "website_chat"
      }]).select().single();

      if (error) throw error;
      setConversationId(conv.id);
      localStorage.setItem("active_conv_id", conv.id);
      localStorage.setItem("chat_visitor_info", JSON.stringify(visitorInfo));
      setStep("chatting");
    } catch (err) { console.error(err); }
  };

  // Upload file
  const uploadFileToServer = async (file) => {
    setIsUploading(true);
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: `${uuidv4()}-${file.name}`,
              fileType: file.type,
              fileData: reader.result
            }),
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || 'Upload failed');
          }

          const data = await res.json();
          setIsUploading(false);
          resolve(data.url);
        } catch (err) {
          setIsUploading(false);
          reject(err);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      try {
        const url = await uploadFileToServer(file);
        setAttachments(prev => [...prev, { name: file.name, type: file.type.startsWith('image/') ? 'image' : 'pdf', url }]);
      } catch (err) {
        console.error("Upload error:", err);
      }
    }
  };

  // 🔥 UPDATED SEND MESSAGE (WITH WHATSAPP)
  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && attachments.length === 0) || isSending || !conversationId) return;
    
    setIsSending(true);
    sendTypingStatus(false);

    const messageData = {
      conversation_id: conversationId,
      sender_type: "visitor",
      sender_id: visitorId,
      sender_name: visitorInfo.name,
      content: inputMessage,
      metadata: attachments.length > 0 ? { attachments: attachments } : null
    };

    const { error } = await supabase.from("chat_messages").insert([messageData]);

    if (!error) {
      // ✅ WhatsApp notification
      try {
        await fetch("/api/send-whatsapp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: inputMessage || `Sent ${attachments.length} attachment(s)`,
            name: visitorInfo.name,
            phone: visitorInfo.phone,
            conversation_id: conversationId,
          }),
        });
      } catch (err) {
        console.error("WhatsApp send failed:", err);
      }

      setInputMessage("");
      setAttachments([]);
    }

    setIsSending(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-4 md:right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl flex flex-col max-h-[70vh] z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 text-white" style={{ background: `linear-gradient(135deg, ${colors.green} 0%, ${colors.blue} 100%)` }}>
              <div className="flex items-center gap-2">
                <HeadphonesIcon size={20}/><h3 className="font-bold">Shama Support</h3>
              </div>
              <button onClick={() => setIsOpen(false)}><X size={20}/></button>
            </div>

            <div className="flex-1 p-4 space-y-3 overflow-y-auto" style={{ backgroundColor: colors.clay }}>
              {step === "form" ? (
                <div className="py-4 space-y-4">
                   <input className="w-full p-3 text-sm outline-none rounded-xl" placeholder="Name *" value={visitorInfo.name} onChange={e => setVisitorInfo({...visitorInfo, name: e.target.value})} />
                   <input className="w-full p-3 text-sm outline-none rounded-xl" placeholder="Email" value={visitorInfo.email} onChange={e => setVisitorInfo({...visitorInfo, email: e.target.value})} />
                   <input className="w-full p-3 text-sm outline-none rounded-xl" placeholder="Phone" value={visitorInfo.phone} onChange={e => setVisitorInfo({...visitorInfo, phone: e.target.value})} />
                   <button onClick={startChat} className="w-full p-3 font-bold text-white rounded-xl" style={{ background: colors.green }}>Start Chat</button>
                </div>
              ) : (
                <>
                  {messages.map((m, i) => {
                    const isVisitor = m.sender_type === "visitor";
                    const hasAttachments = m.metadata?.attachments;

                    return (
                      <div key={m.id || i} className={`flex ${isVisitor ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${isVisitor ? "bg-shama-green text-white" : "bg-white shadow-sm"}`}>
                          {m.content && <p className="mb-2 leading-relaxed">{m.content}</p>}

                          {hasAttachments && (
                            <div className="space-y-2">
                              {m.metadata.attachments.map((att, attIdx) => (
                                <div key={attIdx} className="overflow-hidden rounded-lg">
                                  {att.type === 'image' ? (
                                    <img src={att.url} alt={att.name} className="h-auto max-w-full border rounded-lg cursor-pointer border-white/20 hover:opacity-90" onClick={() => window.open(att.url, '_blank')} />
                                  ) : (
                                    <a href={att.url} target="_blank" download={att.name} className={`flex items-center gap-2 p-2 rounded-lg text-xs ${isVisitor ? 'bg-white/10' : 'bg-gray-100'}`}>
                                      <FileText size={16} />
                                      <span className="flex-1 truncate">{att.name}</span>
                                      <Download size={14} />
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          <span className="text-[9px] mt-1 block opacity-60 text-right">{m.created_at && format(new Date(m.created_at), "h:mm a")}</span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {step === "chatting" && (
              <div className="p-3 bg-white border-t">
                <div className="flex items-center gap-2">
                  <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-shama-green"><Paperclip size={20}/></button>
                  <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileSelect} accept="image/*,.pdf" />
                  <input className="flex-1 p-2 text-sm bg-gray-100 outline-none rounded-xl" placeholder="Type..." value={inputMessage} onChange={handleInputChange} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} />
                  <button onClick={handleSendMessage} className="p-2 text-white shadow-md rounded-xl bg-shama-green"><Send size={18}/></button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => setIsOpen(!isOpen)} className="fixed z-50 flex items-center justify-center w-16 h-16 text-white rounded-full shadow-2xl bottom-6 right-6 bg-shama-green">
        <MessageCircle size={32}/>
      </button>
    </>
  );
}