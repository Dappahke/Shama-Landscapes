"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, X, Send, HeadphonesIcon, Paperclip, 
  FileText, Download, Loader2, WifiOff, AlertCircle, 
  CheckCheck, ChevronDown, Smile, Phone, Mail, Share2
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabaseClient";
import { format, isToday, isYesterday } from "date-fns";

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const TYPING_TIMEOUT = 3000;
const RECONNECT_INTERVAL = 5000;
const SUMMARY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const COMPANY_WHATSAPP = process.env.NEXT_PUBLIC_COMPANY_WHATSAPP || "254711706059";

export default function LiveChat() {
  // State management
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
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [failedMessages, setFailedMessages] = useState(new Set());
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [summarySent, setSummarySent] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState(null);

  // Refs
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const inactivityTimeoutRef = useRef(null);
  const channelRef = useRef(null);
  const visibilityRef = useRef(true);
  const processedMessageIds = useRef(new Set());

  // Colors from Shama brand
  const colors = {
    clay: "#F5EBE8",
    green: "#0F7F40",
    terra: "#BD7563",
    blue: "#3596D5",
    dark: "#1a1a1a",
    white: "#ffffff"
  };

  // Initialize notification permission
  useEffect(() => {
    if (typeof window !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
    
    const handleVisibility = () => {
      visibilityRef.current = !document.hidden;
      if (!document.hidden) setUnreadCount(0);
    };
    
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      console.log("Connection restored");
      setIsOnline(true);
      setConnectionStatus("connecting");
      if (failedMessages.size > 0) {
        failedMessages.forEach(tempId => {
          const failedMsg = messages.find(m => m.temp_id === tempId);
          if (failedMsg) retryMessage(failedMsg);
        });
      }
    };
    
    const handleOffline = () => {
      console.log("Connection lost");
      setIsOnline(false);
      setConnectionStatus("disconnected");
    };
    
    setIsOnline(navigator.onLine);
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [failedMessages, messages]);

  // Play notification sound
  const playSound = useCallback(() => {
    try {
      const audio = new Audio("https://actions.google.com/sounds/v1/notifications/notification_simple.mp3");
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (e) {}
  }, []);

  // Check for existing visitor
  const checkExistingVisitor = useCallback(async (email, phone) => {
    if (!email && !phone) return null;
    
    try {
      let query = supabase
        .from("chat_conversations")
        .select("visitor_id, visitor_name, visitor_email, visitor_phone")
        .order("created_at", { ascending: false });
        
      if (email && phone) {
        query = query.or(`visitor_email.eq.${email},visitor_phone.eq.${phone}`);
      } else if (email) {
        query = query.eq("visitor_email", email);
      } else if (phone) {
        query = query.eq("visitor_phone", phone);
      }
      
      const { data, error } = await query.limit(1).maybeSingle();
      if (error) throw error;
      
      if (!data) return null;
      
      return {
        visitor_id: data.visitor_id,
        visitor_name: data.visitor_name || "",
        visitor_email: data.visitor_email || "",
        visitor_phone: data.visitor_phone || ""
      };
      
    } catch (err) {
      console.error("Error checking existing visitor:", err);
      return null;
    }
  }, []);

  // Initialize visitor
  useEffect(() => {
    const init = async () => {
      let id = localStorage.getItem("chat_visitor_id");
      const savedInfo = localStorage.getItem("chat_visitor_info");
      const activeConv = localStorage.getItem("active_conv_id");
      
      if (!id) {
        id = uuidv4();
        localStorage.setItem("chat_visitor_id", id);
      }
      
      setVisitorId(id);
      
      if (savedInfo) {
        try {
          const parsed = JSON.parse(savedInfo);
          const safeInfo = {
            name: parsed.name || "",
            email: parsed.email || "",
            phone: parsed.phone || ""
          };
          
          const existing = await checkExistingVisitor(safeInfo.email, safeInfo.phone);
          
          if (existing) {
            setVisitorInfo({
              name: existing.visitor_name || safeInfo.name || "",
              email: existing.visitor_email || safeInfo.email || "",
              phone: existing.visitor_phone || safeInfo.phone || ""
            });
            localStorage.setItem("chat_visitor_id", existing.visitor_id);
          } else {
            setVisitorInfo(safeInfo);
          }
        } catch (e) {
          console.error("Error parsing saved info:", e);
          localStorage.removeItem("chat_visitor_info");
          setVisitorInfo({ name: "", email: "", phone: "" });
        }
      }
      
      if (activeConv && savedInfo) {
        setConversationId(activeConv);
        setStep("chatting");
        fetchMessages(activeConv);
      }
    };
    
    init();
  }, [checkExistingVisitor]);

  // Fetch message history
  const fetchMessages = useCallback(async (id) => {
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", id)
        .order("created_at", { ascending: true })
        .limit(100);
        
      if (error) throw error;
      if (data) {
        setMessages(data);
        processedMessageIds.current = new Set(data.map(m => m.id));
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // Send chat summary to company WhatsApp with fallback
  const sendChatSummary = useCallback(async (trigger = 'manual') => {
    if (!conversationId || summarySent) {
      console.log('⏭️ Skipping summary:', { conversationId, summarySent });
      return;
    }
    
    try {
      console.log(`📤 Sending chat summary [${trigger}]...`);
      console.log('📊 Current messages count:', messages.length);
      
      const messageSummary = messages
        .filter(m => m.content)
        .map(m => {
          const sender = m.sender_type === 'visitor' ? '👤 Client' : '🤖 AI';
          const time = format(new Date(m.created_at), 'h:mm a');
          return `${time} ${sender}: ${m.content.substring(0, 100)}${m.content.length > 100 ? '...' : ''}`;
        })
        .join('\n')
        .substring(0, 1200);

      const summaryText = `📋 *Chat Report* [${trigger}]
      
👤 *Client:* ${visitorInfo.name || 'Unknown'}
📞 *Phone:* ${visitorInfo.phone || 'Not provided'}
📧 *Email:* ${visitorInfo.email || 'Not provided'}
🆔 *Conversation:* ${conversationId}
⏰ *Duration:* ${messages.length > 0 ? 
  Math.round((new Date(messages[messages.length-1].created_at) - new Date(messages[0].created_at)) / 60000) + ' mins' 
  : 'N/A'}

💬 *Conversation:*
${messageSummary || 'No messages'}

---
Sent from Shama LiveChat`;

      console.log('📱 Sending to WhatsApp:', COMPANY_WHATSAPP);
      console.log('📝 Message preview:', summaryText.substring(0, 200) + '...');

      const response = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: COMPANY_WHATSAPP,
          message: summaryText,
        }),
      });

      const result = await response.json();
      console.log('📊 Delivery result:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send');
      }

      console.log(`✅ Chat summary sent via ${result.method}`);
      setDeliveryMethod(result.method);
      setSummarySent(true);
      
      if (result.method === 'email') {
        console.log('📧 WhatsApp failed, email sent instead');
      } else if (result.method === 'sms') {
        console.log('📱 WhatsApp & email failed, SMS sent instead');
      }
      
    } catch (err) {
      console.error('❌ Failed to send chat summary:', err.message);
      // Don't throw - let the chat close normally
    }
  }, [conversationId, summarySent, messages, visitorInfo]);

  // Inactivity timeout - send summary after 30 minutes
  useEffect(() => {
    if (!conversationId || step !== "chatting") return;
    
    const resetInactivityTimeout = () => {
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
      
      inactivityTimeoutRef.current = setTimeout(() => {
        console.log("30min timeout - sending summary");
        sendChatSummary('timeout_30min');
        supabase.from("chat_conversations")
          .update({ status: "timeout" })
          .eq("id", conversationId)
          .then(({ error }) => {
            if (error) console.error("Timeout status update error:", error);
          });
      }, SUMMARY_TIMEOUT);
    };
    
    resetInactivityTimeout();
    
    return () => {
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    };
  }, [conversationId, step, messages.length, sendChatSummary]);

  // Real-time subscription
  useEffect(() => {
    if (!conversationId) return;
    
    let retryCount = 0;
    const maxRetries = 5;
    
    const subscribe = () => {
      setConnectionStatus("connecting");
      
      const channel = supabase
        .channel(`chat_realtime_${conversationId}`)
        .on("postgres_changes", {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${conversationId}`
        }, (payload) => {
          const msg = payload.new;
          
          if (processedMessageIds.current.has(msg.id)) return;
          processedMessageIds.current.add(msg.id);
          
          setMessages(prev => {
            const pendingIndex = prev.findIndex(m => 
              m.pending && 
              m.sender_type === msg.sender_type &&
              m.content === msg.content &&
              Math.abs(new Date(m.created_at) - new Date(msg.created_at)) < 5000
            );
            
            if (pendingIndex !== -1) {
              const newMessages = [...prev];
              newMessages[pendingIndex] = msg;
              return newMessages;
            }
            
            if (prev.find(m => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          
          if (msg.sender_type !== "visitor") {
            playSound();
            
            if (document.hidden) {
              setUnreadCount(prev => prev + 1);
              if (Notification.permission === "granted") {
                new Notification("Shama Support", {
                  body: msg.content || "New attachment received",
                  icon: "/favicon.ico",
                  tag: msg.id
                });
              }
            }
            
            setOtherTyping(false);
          }
        })
        .on("postgres_changes", {
          event: "UPDATE",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${conversationId}`
        }, (payload) => {
          const updated = payload.new;
          setMessages(prev => prev.map(m => m.id === updated.id ? updated : m));
        })
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            setConnectionStatus("connected");
            retryCount = 0;
          } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
            setConnectionStatus("disconnected");
            
            if (retryCount < maxRetries) {
              setTimeout(() => {
                retryCount++;
                subscribe();
              }, RECONNECT_INTERVAL);
            }
          }
        });
        
      channelRef.current = channel;
    };
    
    subscribe();
    fetchMessages(conversationId);
    
    const typingChannel = supabase
      .channel(`typing_${conversationId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "chat_typing",
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        if (payload.new.user_type !== "visitor") {
          setOtherTyping(true);
          setTimeout(() => setOtherTyping(false), TYPING_TIMEOUT);
        }
      })
      .subscribe();
    
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
      supabase.removeChannel(typingChannel);
    };
  }, [conversationId, playSound, fetchMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, otherTyping]);

  // Send typing status
  const sendTypingStatus = useCallback(async (typing) => {
    if (!conversationId || !visitorId) return;
    
    try {
      await supabase.from("chat_typing").upsert({
        conversation_id: conversationId,
        user_id: visitorId,
        user_type: "visitor",
        typing_at: new Date().toISOString()
      }, { onConflict: ["conversation_id", "user_id"] });
    } catch (err) {
      console.error("Typing indicator error:", err);
    }
  }, [conversationId, visitorId]);

  // Handle textarea input
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    
    if (!isTyping) {
      setIsTyping(true);
      sendTypingStatus(true);
    }
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingStatus(false);
    }, TYPING_TIMEOUT);
  };

  // Start new chat
  const startChat = async () => {
    const name = visitorInfo.name || "";
    if (!name.trim() || !visitorId) return;
    
    if (!isOnline) {
      alert("You appear to be offline. Please check your internet connection.");
      return;
    }
    
    try {
      const { data: conv, error } = await supabase
        .from("chat_conversations")
        .insert([{
          visitor_id: visitorId,
          visitor_name: name.trim(),
          visitor_email: (visitorInfo.email || "").trim() || null,
          visitor_phone: (visitorInfo.phone || "").trim() || null,
          status: "active",
          source: "website_chat",
          last_message_at: new Date().toISOString(),
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      setConversationId(conv.id);
      setSummarySent(false);
      setDeliveryMethod(null);
      localStorage.setItem("active_conv_id", conv.id);
      localStorage.setItem("chat_visitor_info", JSON.stringify(visitorInfo));
      setStep("chatting");
      
      await supabase.from("chat_messages").insert([{
        conversation_id: conv.id,
        sender_type: "ai",
        sender_id: "system",
        sender_name: "Shama",
        content: `Hi ${name.trim()}! Welcome to Shama Landscape Architects. How can I help you today?`,
        metadata: { is_welcome: true }
      }]);
      
    } catch (err) {
      console.error("Error starting chat:", err);
      alert("Failed to start chat. Please check your connection and try again.");
    }
  };

  // File validation
  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      alert(`File too large. Max size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      return false;
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      alert("Only images (JPEG, PNG, WebP) and PDFs are allowed");
      return false;
    }
    return true;
  };

  // Upload file
  const uploadFileToServer = async (file) => {
    if (!validateFile(file)) throw new Error("Invalid file");
    
    setIsUploading(true);
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileName: `${uuidv4()}-${file.name}`,
              fileType: file.type,
              fileData: reader.result
            }),
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || "Upload failed");
          }

          const data = await res.json();
          resolve({ url: data.url, name: file.name, type: file.type.startsWith("image/") ? "image" : "pdf" });
        } catch (err) {
          reject(err);
        } finally {
          setIsUploading(false);
        }
      };
      
      reader.onerror = () => {
        setIsUploading(false);
        reject(new Error("Failed to read file"));
      };
      
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      try {
        const uploaded = await uploadFileToServer(file);
        setAttachments(prev => [...prev, uploaded]);
      } catch (err) {
        console.error("Upload error:", err);
        alert(`Failed to upload ${file.name}: ${err.message}`);
      }
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Retry failed message
  const retryMessage = async (messageData) => {
    const tempId = messageData.temp_id;
    setFailedMessages(prev => {
      const next = new Set(prev);
      next.delete(tempId);
      return next;
    });
    
    if (!isOnline) {
      alert("You are still offline. Please check your connection.");
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .insert([{
          conversation_id: conversationId,
          sender_type: "visitor",
          sender_id: visitorId,
          sender_name: visitorInfo.name || "Unknown",
          content: messageData.content,
          metadata: messageData.metadata
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      setMessages(prev => prev.map(m => m.temp_id === tempId ? data : m));
      
      await fetch("/api/ai-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: conversationId,
          message: messageData.content,
          visitor_info: {
            name: visitorInfo.name || "",
            email: visitorInfo.email || "",
            phone: visitorInfo.phone || ""
          }
        }),
      }).catch(() => {});
      
    } catch (err) {
      setFailedMessages(prev => new Set(prev).add(tempId));
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!visitorId || !conversationId) {
      console.error("Missing visitorId or conversationId", { visitorId, conversationId });
      alert("Chat session expired. Please refresh and try again.");
      return;
    }
    
    if ((!inputMessage.trim() && attachments.length === 0) || isSending) return;

    if (!isOnline) {
      alert("You appear to be offline. Please check your internet connection.");
      return;
    }

    setIsSending(true);
    sendTypingStatus(false);
    
    const messageContent = inputMessage.trim();
    const messageAttachments = [...attachments];
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const optimisticMessage = {
      id: tempId,
      temp_id: tempId,
      conversation_id: conversationId,
      sender_type: "visitor",
      sender_id: visitorId,
      sender_name: visitorInfo.name || "Unknown",
      content: messageContent,
      metadata: messageAttachments.length > 0 ? { attachments: messageAttachments } : null,
      created_at: new Date().toISOString(),
      pending: true
    };
    
    setMessages(prev => [...prev, optimisticMessage]);
    setInputMessage("");
    setAttachments([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .insert([{
          conversation_id: conversationId,
          sender_type: "visitor",
          sender_id: visitorId,
          sender_name: visitorInfo.name || "Unknown",
          content: messageContent,
          metadata: messageAttachments.length > 0 ? { attachments: messageAttachments } : null
        }])
        .select()
        .single();

      if (error) {
        console.error("Raw Supabase error:", error);
        
        let errorMessage = "Failed to save message";
        if (error && typeof error === 'object') {
          errorMessage = error.message || error.error_description || error.error || JSON.stringify(error);
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        
        if (!navigator.onLine || JSON.stringify(error) === '{}') {
          throw new Error("Connection failed. Please check your internet and try again.");
        }
        
        throw new Error(errorMessage);
      }

      if (!data) {
        throw new Error("No data returned from server");
      }

      await supabase
        .from("chat_conversations")
        .update({
          last_message_at: new Date().toISOString(),
          status: "active"
        })
        .eq("id", conversationId);

      setMessages(prev => prev.map(m => m.temp_id === tempId ? data : m));
      setFailedMessages(prev => {
        const next = new Set(prev);
        next.delete(tempId);
        return next;
      });
      
      processedMessageIds.current.add(data.id);

      try {
        await fetch("/api/ai-reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversation_id: conversationId,
            message: messageContent,
            visitor_info: {
              name: visitorInfo.name || "",
              email: visitorInfo.email || "",
              phone: visitorInfo.phone || ""
            }
          }),
        });
      } catch (err) {
        console.error("AI reply failed:", err.message || err);
      }

    } catch (err) {
      console.error("Send message error:", {
        error: err,
        message: err?.message,
        visitorId,
        conversationId,
        isOnline: navigator.onLine
      });
      
      const errorMsg = err?.message || "Failed to send message. Please check your connection.";
      
      if (/offline|network|failed to fetch/i.test(errorMsg)) {
        alert("Connection issue: " + errorMsg);
      }
      
      setFailedMessages(prev => new Set(prev).add(tempId));
    } finally {
      setIsSending(false);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Close chat with summary
  const handleClose = () => {
    if (step === "chatting" && messages.length > 0) {
      setShowCloseConfirm(true);
    } else {
      setIsOpen(false);
    }
  };

  const confirmClose = async () => {
    setShowCloseConfirm(false);
    setIsOpen(false);
    
    await sendChatSummary('chat_ended');
    
    if (conversationId) {
      const { error } = await supabase
        .from("chat_conversations")
        .update({ status: "closed" })
        .eq("id", conversationId);
        
      if (error) {
        console.error("Error closing conversation:", error);
      }
      
      localStorage.removeItem("active_conv_id");
    }
  };

  // Format message content
  const formatMessageContent = (content) => {
    if (!content) return null;
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline break-all"
            style={{ color: "inherit", opacity: 0.9 }}
          >
            {part}
          </a>
        );
      }
      return part.split("\n").map((line, j) => (
        <React.Fragment key={j}>
          {line}
          {j < part.split("\n").length - 1 && <br />}
        </React.Fragment>
      ));
    });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, msg) => {
    const date = new Date(msg.created_at);
    const dateKey = format(date, "yyyy-MM-dd");
    
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(msg);
    return groups;
  }, {});

  const getDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  };

  // Get delivery status text
  const getDeliveryStatus = () => {
    if (!summarySent) return null;
    switch (deliveryMethod) {
      case 'whatsapp': return '✅ Sent via WhatsApp';
      case 'email': return '📧 Sent via Email (WhatsApp unavailable)';
      case 'sms': return '📱 Sent via SMS (fallback)';
      default: return '✅ Summary sent';
    }
  };

  return (
    <>
      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center text-xs py-2 z-60">
          You are offline. Messages will be sent when connection is restored.
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-2 sm:right-4 md:right-6 w-[calc(100vw-16px)] sm:w-95 md:w-100 bg-white rounded-2xl shadow-2xl flex flex-col max-h-[75vh] sm:max-h-[80vh] z-50 overflow-hidden border"
            style={{ 
              borderColor: colors.clay, 
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              bottom: isOnline ? "24px" : "40px"
            }}
          >
            {/* Header */}
            <div 
              className="flex items-center justify-between p-3 sm:p-4 text-white relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${colors.green} 0%, ${colors.blue} 100%)` }}
            >
              <div className="flex items-center gap-2 sm:gap-3 relative z-10">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <HeadphonesIcon size={16} className="sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm">Shama Support</h3>
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-white/80">
                    {connectionStatus === "connected" ? (
                      <>
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse" />
                        <span>Online</span>
                      </>
                    ) : connectionStatus === "connecting" ? (
                      <>
                        <Loader2 size={10} className="animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <WifiOff size={10} />
                        <span>Offline</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 relative z-10">
                {step === "chatting" && (
                  <>
                    <button 
                      onClick={() => sendChatSummary('manual')}
                      className="p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-colors"
                      title="Send summary to WhatsApp"
                      disabled={summarySent}
                    >
                      <Share2 size={16} className={`sm:w-4.5 sm:h-4.5 ${summarySent ? 'opacity-50' : ''}`} />
                    </button>
                    <button 
                      onClick={() => setShowCloseConfirm(true)}
                      className="p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-colors"
                      title="End chat"
                    >
                      <X size={16} className="sm:w-4.5 sm:h-4.5" />
                    </button>
                  </>
                )}
                <button 
                  onClick={handleClose}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ChevronDown size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>
              
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px)`,
                backgroundSize: "20px 20px"
              }} />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4" style={{ backgroundColor: colors.clay }}>
              {isLoadingHistory ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin" style={{ color: colors.green }} />
                </div>
              ) : step === "form" ? (
                <div className="py-4 sm:py-6 space-y-3 sm:space-y-4">
                  <div className="text-center mb-4 sm:mb-6">
                    <div 
                      className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full flex items-center justify-center mb-2 sm:mb-3"
                      style={{ backgroundColor: colors.green }}
                    >
                      <MessageCircle size={24} className="sm:w-8 sm:h-8" color="white" />
                    </div>
                    <h4 className="font-semibold text-sm sm:text-base text-gray-800">Start a Conversation</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">We&apos;re here to help with your landscape needs</p>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <div className="relative">
                      <input 
                        className="w-full p-2.5 sm:p-3 pl-9 sm:pl-10 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shama-green/50 transition-all"
                        placeholder="Your Name *"
                        value={visitorInfo.name || ""}
                        onChange={e => setVisitorInfo(prev => ({...prev, name: e.target.value}))}
                        onKeyDown={e => e.key === "Enter" && startChat()}
                      />
                      <span className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 text-gray-400 text-xs sm:text-sm">👤</span>
                    </div>
                    
                    <div className="relative">
                      <input 
                        className="w-full p-2.5 sm:p-3 pl-9 sm:pl-10 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shama-green/50 transition-all"
                        placeholder="Email Address"
                        type="email"
                        value={visitorInfo.email || ""}
                        onChange={e => setVisitorInfo(prev => ({...prev, email: e.target.value}))}
                      />
                      <Mail size={14} className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3.5 text-gray-400" />
                    </div>
                    
                    <div className="relative">
                      <input 
                        className="w-full p-2.5 sm:p-3 pl-9 sm:pl-10 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shama-green/50 transition-all"
                        placeholder="Phone Number"
                        type="tel"
                        value={visitorInfo.phone || ""}
                        onChange={e => setVisitorInfo(prev => ({...prev, phone: e.target.value}))}
                      />
                      <Phone size={14} className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3.5 text-gray-400" />
                    </div>
                    
                    <button 
                      onClick={startChat} 
                      disabled={!(visitorInfo.name || "").trim()}
                      className="w-full p-2.5 sm:p-3 font-bold text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] text-xs sm:text-sm"
                      style={{ background: colors.green }}
                    >
                      Start Chat
                    </button>
                  </div>
                  
                  <p className="text-[10px] sm:text-xs text-center text-gray-500 mt-3 sm:mt-4">
                    By starting a chat, you agree to our privacy policy
                  </p>
                </div>
              ) : (
                <>
                  {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                    <div key={date} className="space-y-2 sm:space-y-3">
                      <div className="flex justify-center">
                        <span className="text-[10px] sm:text-xs text-gray-500 bg-white/50 px-2 sm:px-3 py-1 rounded-full">
                          {getDateLabel(date)}
                        </span>
                      </div>
                      
                      {dateMessages.map((m, i) => {
                        const isVisitor = m.sender_type === "visitor";
                        const isFailed = failedMessages.has(m.temp_id);
                        const hasAttachments = m.metadata?.attachments?.length > 0;
                        const messageKey = m.id || m.temp_id || `msg-${date}-${i}`;
                        
                        return (
                          <motion.div 
                            key={messageKey}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${isVisitor ? "justify-end" : "justify-start"}`}
                          >
                            <div className={`max-w-[90%] sm:max-w-[85%] ${isVisitor ? "order-2" : "order-1"}`}>
                              {!isVisitor && (
                                <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1 ml-1">
                                  {m.sender_name || "Shama"}
                                </div>
                              )}
                              
                              <div 
                                className={`p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm relative ${
                                  isVisitor 
                                    ? "rounded-br-md text-white" 
                                    : "rounded-bl-md bg-white shadow-sm text-gray-800"
                                } ${isFailed ? "ring-2 ring-red-400" : ""}`}
                                style={{ backgroundColor: isVisitor ? colors.green : undefined }}
                              >
                                {m.content && (
                                  <div className="leading-relaxed wrap-break-word">
                                    {formatMessageContent(m.content)}
                                  </div>
                                )}

                                {hasAttachments && (
                                  <div className={`space-y-1.5 sm:space-y-2 ${m.content ? "mt-1.5 sm:mt-2" : ""}`}>
                                    {m.metadata.attachments.map((att, attIdx) => (
                                      <div key={`${messageKey}-att-${attIdx}`} className="overflow-hidden rounded-lg">
                                        {att.type === 'image' ? (
                                          <div className="relative group">
                                            <img 
                                              src={att.url} 
                                              alt={att.name} 
                                              className="h-auto max-w-full border rounded-lg cursor-pointer border-white/20 hover:opacity-90 transition-opacity max-h-37.5 sm:max-h-50 object-cover"
                                              onClick={() => window.open(att.url, '_blank')}
                                              loading="lazy"
                                            />
                                          </div>
                                        ) : (
                                          <a 
                                            href={att.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            download={att.name}
                                            className={`flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg text-[10px] sm:text-xs transition-colors ${
                                              isVisitor ? 'bg-white/20 hover:bg-white/30' : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                          >
                                            <FileText size={14} className="sm:w-4 sm:h-4" />
                                            <span className="flex-1 truncate">{att.name}</span>
                                            <Download size={12} className="sm:w-4 sm:h-4" />
                                          </a>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {m.pending && (
                                  <div className="absolute -right-5 sm:-right-6 bottom-1">
                                    <Loader2 size={10} className="animate-spin text-gray-400 sm:w-3 sm:h-3" />
                                  </div>
                                )}
                                
                                {isFailed && (
                                  <div className="absolute -right-5 sm:-right-6 bottom-1 cursor-pointer" onClick={() => retryMessage(m)}>
                                    <AlertCircle size={12} className="text-red-500 sm:w-4 sm:h-4" />
                                  </div>
                                )}
                                
                                <div className={`flex items-center gap-1 mt-0.5 sm:mt-1 text-[8px] sm:text-[10px] ${
                                  isVisitor ? "text-white/70 justify-end" : "text-gray-400"
                                }`}>
                                  {m.created_at && format(new Date(m.created_at), "h:mm a")}
                                  {isVisitor && !m.pending && !isFailed && (
                                    <CheckCheck size={10} className={m.id && !m.pending ? "text-blue-300" : "text-white/50"} />
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ))}
                  
                  {otherTyping && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white p-2 sm:p-3 rounded-2xl rounded-bl-md shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input area */}
            {step === "chatting" && (
              <div className="p-2 sm:p-3 bg-white border-t border-gray-100">
                {attachments.length > 0 && (
                  <div className="flex gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 overflow-x-auto pb-1.5 sm:pb-2">
                    {attachments.map((att, idx) => (
                      <div key={`preview-${idx}`} className="relative shrink-0">
                        {att.type === 'image' ? (
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-gray-200">
                            <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                            <FileText size={16} className="sm:w-5 sm:h-5" style={{ color: colors.terra }} />
                          </div>
                        )}
                        <button 
                          onClick={() => removeAttachment(idx)}
                          className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] sm:text-xs hover:bg-red-600 transition-colors"
                        >
                          <X size={10} className="sm:w-3 sm:h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-end gap-1.5 sm:gap-2">
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    disabled={isUploading || attachments.length >= 3}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    {isUploading ? <Loader2 size={16} className="animate-spin sm:w-5 sm:h-5" /> : <Paperclip size={16} className="sm:w-5 sm:h-5" />}
                  </button>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    multiple 
                    onChange={handleFileSelect} 
                    accept="image/*,.pdf"
                  />
                  
                  <div className="flex-1 relative">
                    <textarea
                      ref={textareaRef}
                      className="w-full p-2 sm:p-3 pr-8 sm:pr-10 text-xs sm:text-sm bg-gray-100 rounded-xl resize-none outline-none focus:ring-2 focus:ring-shama-green/50 transition-all max-h-25 sm:max-h-30"
                      placeholder="Type a message..."
                      value={inputMessage}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      rows={1}
                    />
                    <button className="absolute right-1.5 sm:right-2 bottom-1.5 sm:bottom-2 p-1 text-gray-400 hover:text-gray-600 transition-colors">
                      <Smile size={14} className="sm:w-4.5 sm:h-4.5" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleSendMessage}
                    disabled={isSending || (!inputMessage.trim() && attachments.length === 0)}
                    className="p-2 sm:p-3 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 flex items-center justify-center"
                    style={{ background: colors.green }}
                  >
                    {isSending ? <Loader2 size={14} className="animate-spin sm:w-4.5 sm:h-4.5" /> : <Send size={14} className="sm:w-4.5 sm:h-4.5" />}
                  </button>
                </div>
                
                <div className="text-[10px] sm:text-xs text-gray-400 mt-1.5 sm:mt-2 text-center">
                  Press Enter to send, Shift+Enter for new line
                </div>
              </div>
            )}
            
            {/* Close confirmation modal */}
            <AnimatePresence>
              {showCloseConfirm && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                >
                  <motion.div 
                    initial={{ scale: 0.9 }} 
                    animate={{ scale: 1 }} 
                    exit={{ scale: 0.9 }}
                    className="bg-white rounded-2xl p-4 sm:p-6 max-w-xs sm:max-w-sm w-full shadow-2xl"
                  >
                    <h4 className="font-bold text-sm sm:text-lg mb-1.5 sm:mb-2">End Conversation?</h4>
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                      A complete chat summary will be sent to our team at {COMPANY_WHATSAPP}. 
                      {deliveryMethod && summarySent && (
                        <span className="block mt-2 text-green-600 font-medium">
                          {getDeliveryStatus()}
                        </span>
                      )}
                      You can start a new chat anytime.
                    </p>
                    <div className="flex gap-2 sm:gap-3">
                      <button 
                        onClick={() => setShowCloseConfirm(false)}
                        className="flex-1 p-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-xs sm:text-sm"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={confirmClose}
                        className="flex-1 p-2 rounded-xl text-white hover:opacity-90 transition-colors text-xs sm:text-sm"
                        style={{ background: colors.terra }}
                      >
                        {summarySent ? 'Close Chat' : 'End & Send Summary'}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button 
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed z-50 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white rounded-full shadow-2xl bottom-4 sm:bottom-6 right-4 sm:right-6 transition-colors"
        style={{ 
          background: isOpen ? colors.terra : colors.green,
          boxShadow: "0 10px 40px -10px rgba(15, 127, 64, 0.5)"
        }}
      >
        {isOpen ? <ChevronDown size={24} className="sm:w-7 sm:h-7" /> : <MessageCircle size={24} className="sm:w-7 sm:h-7" />}
        
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </motion.button>
    </>
  );
}