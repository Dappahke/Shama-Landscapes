"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";
import { 
  Search, 
  MessageSquare, 
  Send, 
  User, 
  Circle, 
  ChevronRight, 
  Inbox,
  ArrowLeft,
  MoreVertical,
  Phone,
  Mail,
  CheckCheck,
  Clock
} from "lucide-react";

export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Filter conversations based on search
  const filteredConversations = conversations.filter(c => 
    c.visitor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.visitor_email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- 1. Fetch Conversations List ---
  const fetchConversations = async () => {
    const { data, error } = await supabase
      .from("chat_conversations")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
    } else {
      setConversations(data || []);
      setLoading(false);
    }
  };

  // --- 2. Fetch Messages for Selected Chat ---
  const fetchMessages = async (id) => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });

    if (!error) setMessages(data || []);
  };

  // Mark conversation as read when selected
  const markAsRead = async (id) => {
    await supabase
      .from("chat_conversations")
      .update({ unread_count: 0 })
      .eq("id", id);
    
    setConversations(prev => prev.map(c => 
      c.id === id ? { ...c, unread_count: 0 } : c
    ));
  };

  useEffect(() => {
    fetchConversations();

    const channel = supabase
      .channel("admin_conv_updates")
      .on("postgres_changes", 
        { event: "*", schema: "public", table: "chat_conversations" }, 
        () => fetchConversations()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (!selectedChat) return;
    
    fetchMessages(selectedChat.id);
    markAsRead(selectedChat.id);
    setIsMobileMenuOpen(false);

    const msgChannel = supabase
      .channel(`room-${selectedChat.id}`)
      .on("postgres_changes", 
        { 
          event: "INSERT", 
          schema: "public", 
          table: "chat_messages", 
          filter: `conversation_id=eq.${selectedChat.id}` 
        }, 
        (payload) => {
          setMessages((prev) => {
            if (prev.find(m => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(msgChannel); };
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat selected
  useEffect(() => {
    if (selectedChat && !isMobileMenuOpen) {
      inputRef.current?.focus();
    }
  }, [selectedChat, isMobileMenuOpen]);

  // --- 3. Functional Admin Reply ---
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim() || !selectedChat) return;

    const content = reply.trim();
    setReply("");

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("chat_messages").insert([{
      conversation_id: selectedChat.id,
      sender_type: "agent",
      sender_id: user?.id,
      sender_name: "Admin", 
      content: content,
      attachments: []
    }]);

    if (error) {
      console.error("Reply failed:", error.message, error.details);
      setReply(content);
    }
  };

  // Format relative time
  const getRelativeTime = (date) => {
    const now = new Date();
    const msgDate = new Date(date);
    const diffInHours = (now - msgDate) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return format(msgDate, "h:mm a");
    if (diffInHours < 24) return format(msgDate, "h:mm a");
    if (diffInHours < 48) return "Yesterday";
    return format(msgDate, "MMM d");
  };

  return (
    <div className="h-[calc(100vh-80px)] md:h-[calc(100vh-60px)] bg-gray-50 flex flex-col md:flex-row overflow-hidden">
      
      {/* MOBILE HEADER - When chat is selected */}
      {selectedChat && (
        <div className="md:hidden bg-white border-b px-4 py-3 flex items-center gap-3 shrink-0">
          <button 
            onClick={() => {
              setSelectedChat(null);
              setIsMobileMenuOpen(true);
            }}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
            <User size={20} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-800 truncate">{selectedChat.visitor_name}</h2>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Circle size={6} className="fill-green-500 text-green-500" />
              <span>Active now</span>
            </div>
          </div>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical size={20} className="text-gray-600" />
          </button>
        </div>
      )}

      {/* LEFT SIDEBAR: Conversations List */}
      <div className={`
        shrink-0 bg-white border-r flex flex-col
        w-full md:w-80 lg:w-96
        ${selectedChat ? 'hidden md:flex' : 'flex'}
        ${isMobileMenuOpen ? 'fixed inset-0 z-50' : ''}
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b space-y-4 shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Inbox size={22} className="text-shama-green" /> 
              Inquiries
            </h1>
            <span className="bg-shama-green text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {conversations.filter(c => c.unread_count > 0).length}
            </span>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-shama-green/20 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-10 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No conversations found</p>
            </div>
          ) : (
            filteredConversations.map((c) => {
              const isSelected = selectedChat?.id === c.id;
              const hasUnread = c.unread_count > 0;
              
              return (
                <button 
                  key={c.id} 
                  onClick={() => setSelectedChat(c)}
                  className={`
                    w-full p-4 flex items-center gap-3 border-b transition-all text-left
                    hover:bg-gray-50 active:bg-gray-100
                    ${isSelected ? "bg-shama-green/5 border-r-4 border-r-shama-green" : ""}
                    ${hasUnread ? "bg-blue-50/50" : ""}
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center shrink-0
                    ${isSelected ? "bg-shama-green text-white" : "bg-gray-100 text-gray-500"}
                  `}>
                    <User size={22} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`font-semibold text-sm truncate ${hasUnread ? "text-gray-900" : "text-gray-700"}`}>
                        {c.visitor_name || "Anonymous"}
                      </p>
                      <span className="text-xs text-gray-400 shrink-0">
                        {getRelativeTime(c.updated_at || c.created_at)}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {c.last_message || "No messages yet"}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`
                        inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium
                        ${c.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-500'}
                      `}>
                        <Circle size={4} className={c.status === 'active' ? 'fill-current' : ''} />
                        {c.status}
                      </span>
                      
                      {hasUnread && (
                        <span className="bg-shama-green text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {c.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <ChevronRight size={16} className={`shrink-0 transition-colors ${isSelected ? "text-shama-green" : "text-gray-300"}`} />
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT SIDE: Chat Window */}
      <div className={`
        flex-1 flex flex-col bg-white min-w-0
        ${selectedChat ? 'flex' : 'hidden md:flex'}
      `}>
        {selectedChat ? (
          <>
            {/* Desktop Header */}
            <div className="hidden md:flex p-4 border-b items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">{selectedChat.visitor_name}</h2>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Mail size={12} />
                      {selectedChat.visitor_email || "No email"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {format(new Date(selectedChat.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
                  <Phone size={20} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
                  <Mail size={20} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#f8f9fa]">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <MessageSquare size={48} className="mb-3 opacity-20" />
                  <p className="text-sm">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((m, idx) => {
                  const isAgent = m.sender_type === "agent";
                  const isSystem = m.sender_type === "system";
                  const showAvatar = idx === 0 || messages[idx - 1].sender_type !== m.sender_type;

                  if (isSystem) return (
                    <div key={idx} className="flex justify-center my-4">
                      <span className="bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-wider">
                        {m.content}
                      </span>
                    </div>
                  );

                  return (
                    <div key={idx} className={`flex ${isAgent ? "justify-end" : "justify-start"} gap-2`}>
                      {/* Avatar for visitor */}
                      {!isAgent && showAvatar && (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 shrink-0 mt-1">
                          <User size={14} />
                        </div>
                      )}
                      {!isAgent && !showAvatar && <div className="w-8 shrink-0" />}
                      
                      <div className={`
                        max-w-[85%] md:max-w-[70%] p-3 md:p-4 rounded-2xl text-sm shadow-sm
                        ${isAgent 
                          ? "bg-shama-green text-white rounded-tr-none" 
                          : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                        }
                      `}>
                        <p className="leading-relaxed">{m.content}</p>
                        <div className={`flex items-center gap-1 mt-1.5 text-[10px] ${isAgent ? "text-green-100" : "text-gray-400"}`}>
                          <span>{format(new Date(m.created_at), "h:mm a")}</span>
                          {isAgent && <CheckCheck size={12} className="ml-1" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendReply} className="p-3 md:p-4 border-t bg-white shrink-0">
              <div className="flex gap-2 md:gap-3 items-end max-w-4xl mx-auto">
                <div className="flex-1 relative">
                  <input 
                    ref={inputRef}
                    type="text" 
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your message..." 
                    className="w-full bg-gray-100 border-0 rounded-2xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-shama-green/20 focus:bg-white transition-all resize-none"
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={!reply.trim()}
                  className="bg-shama-green text-white p-3 md:px-6 md:py-3 rounded-2xl hover:bg-[#0c6633] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 shrink-0"
                >
                  <Send size={18} className="md:hidden" />
                  <span className="hidden md:inline font-medium">Send</span>
                  <Send size={16} className="hidden md:inline" />
                </button>
              </div>
              
              <p className="text-[10px] text-gray-400 text-center mt-2 hidden md:block">
                Press Enter to send, Shift + Enter for new line
              </p>
            </form>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white p-8">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-linear-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-gray-200">
              <MessageSquare size={48} className="text-gray-300" />
            </div>
            <h3 className="text-gray-700 font-bold text-xl mb-2">Select a conversation</h3>
            <p className="text-gray-500 text-sm text-center max-w-xs">
              Choose a chat from the sidebar to view messages and respond to inquiries
            </p>
            
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden mt-6 px-6 py-3 bg-shama-green text-white rounded-xl font-medium flex items-center gap-2"
            >
              <Inbox size={18} />
              View Inquiries
            </button>
          </div>
        )}
      </div>
    </div>
  );
}