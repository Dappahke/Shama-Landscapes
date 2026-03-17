"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { format, formatDistanceToNow } from "date-fns";
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
  Clock,
  Filter,
  Download,
  Archive,
  Trash2,
  Star,
  Pin,
  Paperclip,
  Smile,
  Image as ImageIcon,
  FileText,
  Calendar,
  AlertCircle,
  Users,
  AtSign,
  Hash,
  X,
  ExternalLink,
  File,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Nairobi timezone helper
const toEAT = (utcDate) => {
  if (!utcDate) return null;
  const date = new Date(utcDate);
  // Add 3 hours for EAT (Nairobi, Kenya)
  return new Date(date.getTime() + (3 * 60 * 60 * 1000));
};

const formatEAT = (date, formatStr = "h:mm a") => {
  if (!date) return "";
  return format(toEAT(date), formatStr);
};

export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const filteredConversations = conversations
    .filter(c => 
      (filterStatus === "all" || c.status === filterStatus) &&
      (c.visitor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       c.visitor_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       c.visitor_phone?.includes(searchQuery) ||
       c.last_message?.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (a.unread_count > 0 && b.unread_count === 0) return -1;
      if (a.unread_count === 0 && b.unread_count > 0) return 1;
      return new Date(b.updated_at) - new Date(a.updated_at);
    });

  const unreadCount = conversations.filter(c => c.unread_count > 0).length;
  const activeCount = conversations.filter(c => c.status === 'active').length;

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

  const fetchMessages = async (id) => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });

    if (!error) setMessages(data || []);
  };

  const markAsRead = async (id) => {
    await supabase
      .from("chat_conversations")
      .update({ unread_count: 0 })
      .eq("id", id);
    
    setConversations(prev => prev.map(c => 
      c.id === id ? { ...c, unread_count: 0 } : c
    ));
  };

  const archiveConversation = async (id) => {
    await supabase
      .from("chat_conversations")
      .update({ status: 'archived' })
      .eq("id", id);
    
    setConversations(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'archived' } : c
    ));
    
    if (selectedChat?.id === id) {
      setSelectedChat(null);
    }
  };

  const deleteConversation = async (id) => {
    if (confirm('Are you sure you want to delete this conversation?')) {
      await supabase
        .from("chat_conversations")
        .delete()
        .eq("id", id);
      
      setConversations(prev => prev.filter(c => c.id !== id));
      if (selectedChat?.id === id) {
        setSelectedChat(null);
      }
    }
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
    setAttachments([]);

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

  useEffect(() => {
    if (selectedChat && !isMobileMenuOpen) {
      inputRef.current?.focus();
    }
  }, [selectedChat, isMobileMenuOpen]);

  // Handle file upload for admin replies
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);

    for (const file of files) {
      const isImage = file.type.startsWith('image/');
      const isPDF = file.type === 'application/pdf';
      const maxSize = 5 * 1024 * 1024;

      if (!isImage && !isPDF) {
        alert('Only images and PDF files are allowed');
        continue;
      }

      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        continue;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `admin-uploads/${selectedChat.id}/${fileName}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from('chat-attachments')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          // Fallback: store as base64
          const reader = new FileReader();
          reader.onload = () => {
            setAttachments(prev => [...prev, {
              name: file.name,
              type: isImage ? 'image' : 'pdf',
              size: file.size,
              data: reader.result,
              isBase64: true
            }]);
          };
          reader.readAsDataURL(file);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('chat-attachments')
          .getPublicUrl(filePath);

        setAttachments(prev => [...prev, {
          name: file.name,
          url: publicUrl,
          type: isImage ? 'image' : 'pdf',
          size: file.size
        }]);
      } catch (err) {
        console.error('File processing error:', err);
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if ((!reply.trim() && attachments.length === 0) || !selectedChat) return;

    const content = reply.trim();
    setReply("");
    setIsTyping(false);

    const { data: { user } } = await supabase.auth.getUser();

    // Build message with attachments
    let messageContent = content;
    if (attachments.length > 0) {
      const attachmentNames = attachments.map(a => `[${a.type.toUpperCase()}: ${a.name}]`).join(' ');
      messageContent = content ? `${content}\n\n${attachmentNames}` : attachmentNames;
    }

    const messageData = {
      conversation_id: selectedChat.id,
      sender_type: "agent",
      sender_id: user?.id,
      sender_name: "Admin", 
      content: messageContent
    };

    // Try to add metadata if we have attachments with URLs
    const attachmentsWithUrls = attachments.filter(a => a.url);
    if (attachmentsWithUrls.length > 0) {
      try {
        messageData.metadata = {
          attachments: attachmentsWithUrls.map(a => ({
            name: a.name,
            type: a.type,
            size: a.size,
            url: a.url
          }))
        };
      } catch (e) {
        console.log('Metadata not supported');
      }
    }

    const { error } = await supabase.from("chat_messages").insert([messageData]);

    if (error) {
      console.error("Reply failed:", error);
      setReply(content);
    } else {
      setAttachments([]);
    }
  };

  // Parse attachments from message content or metadata
  const parseAttachments = (message) => {
    const metadataAttachments = message.metadata?.attachments || [];
    if (metadataAttachments.length > 0) return metadataAttachments;

    // Parse from content text like [IMAGE: filename.jpg] or [PDF: document.pdf]
    const regex = /\[((?:IMAGE|PDF)):\s*([^\]]+)\]/g;
    const matches = [];
    let match;
    while ((match = regex.exec(message.content)) !== null) {
      matches.push({
        type: match[1].toLowerCase(),
        name: match[2].trim(),
        isParsed: true
      });
    }
    return matches;
  };

  // Download attachment
  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Download failed:', err);
      window.open(url, '_blank');
    }
  };

  const formatMessageTime = (date) => {
    const messageDate = toEAT(date);
    const now = toEAT(new Date());
    const diffInDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return formatEAT(date, "h:mm a");
    if (diffInDays === 1) return "Yesterday " + formatEAT(date, "h:mm a");
    if (diffInDays < 7) return formatEAT(date, "EEEE h:mm a");
    return formatEAT(date, "MMM d, yyyy h:mm a");
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = format(toEAT(message.created_at), "yyyy-MM-dd");
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  const getFileIcon = (type) => {
    if (type === 'image') return <ImageIcon size={16} />;
    if (type === 'pdf') return <FileText size={16} />;
    return <File size={16} />;
  };

  return (
    <div className="flex flex-col h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-xl shrink-0">
        <div className="flex items-center justify-between mx-auto max-w-7xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-linear-to-br from-emerald-600 to-emerald-800 rounded-2xl">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              {unreadCount > 0 && (
                <div className="absolute flex items-center justify-center w-5 h-5 border-2 border-white rounded-full -top-1 -right-1 bg-amber-500">
                  <span className="text-[10px] font-bold text-white">{unreadCount}</span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Message Center</h1>
              <p className="text-sm text-gray-500">Manage client communications • Nairobi (EAT)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1 px-3 py-1.5 bg-emerald-50 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-700">{activeCount} active</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <div className={`
          shrink-0 bg-white border-r flex flex-col
          w-full md:w-96
          ${selectedChat ? 'hidden md:flex' : 'flex'}
          ${isMobileMenuOpen ? 'fixed inset-0 z-50' : ''}
        `}>
          {/* Search and Filter */}
          <div className="p-4 space-y-3 border-b shrink-0">
            <div className="relative">
              <Search className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, phone..." 
                className="w-full py-3 pl-10 pr-4 text-sm transition-all bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white"
              />
            </div>

            <div className="flex gap-2">
              {['all', 'active', 'archived'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`
                    flex-1 px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all
                    ${filterStatus === status 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                  `}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl shrink-0" />
                    <div className="flex-1 py-1 space-y-2">
                      <div className="w-3/4 h-4 bg-gray-200 rounded" />
                      <div className="w-1/2 h-3 bg-gray-200 rounded" />
                      <div className="w-2/3 h-3 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-10 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-2xl">
                  <Inbox size={24} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">No conversations found</p>
                <button 
                  onClick={() => setFilterStatus('all')}
                  className="mt-3 text-xs text-emerald-600 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = selectedChat?.id === c.id;
                const hasUnread = c.unread_count > 0;
                
                return (
                  <motion.button 
                    key={c.id} 
                    onClick={() => setSelectedChat(c)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`
                      w-full p-4 flex items-center gap-3 border-b transition-all text-left group
                      hover:bg-gray-50
                      ${isSelected ? "bg-emerald-50/50 border-l-4 border-l-emerald-600" : ""}
                      ${hasUnread ? "bg-blue-50/30" : ""}
                    `}
                  >
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                      ${isSelected 
                        ? "bg-emerald-600 text-white" 
                        : hasUnread 
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-500"}
                    `}>
                      <User size={22} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`font-semibold text-sm truncate ${hasUnread ? "text-gray-900" : "text-gray-700"}`}>
                          {c.visitor_name || "Anonymous Visitor"}
                        </p>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                          {formatDistanceToNow(toEAT(c.updated_at || c.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {c.visitor_email || c.visitor_phone || "No contact info"}
                      </p>
                      
                      <p className="text-xs text-gray-600 truncate mt-1.5">
                        {c.last_message || "No messages yet"}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`
                          inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium
                          ${c.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : c.status === 'archived'
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-gray-100 text-gray-600'}
                        `}>
                          <Circle size={4} className={c.status === 'active' ? 'fill-current' : ''} />
                          {c.status}
                        </span>
                        
                        {hasUnread && (
                          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {c.unread_count} new
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.button>
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
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 bg-white border-b shrink-0">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedChat(null)}
                    className="p-2 -ml-2 transition-colors rounded-lg md:hidden hover:bg-gray-100"
                  >
                    <ArrowLeft size={20} className="text-gray-600" />
                  </button>

                  <div className="flex items-center justify-center w-12 h-12 text-emerald-600 bg-emerald-100 rounded-xl">
                    <User size={24} />
                  </div>
                  
                  <div>
                    <h2 className="font-bold text-gray-900">{selectedChat.visitor_name}</h2>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
                      {selectedChat.visitor_email && (
                        <span className="flex items-center gap-1">
                          <Mail size={12} />
                          {selectedChat.visitor_email}
                        </span>
                      )}
                      {selectedChat.visitor_phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={12} />
                          {selectedChat.visitor_phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        Started {formatEAT(selectedChat.created_at, "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => archiveConversation(selectedChat.id)}
                    className="p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                    title="Archive"
                  >
                    <Archive size={18} />
                  </button>
                  <button 
                    onClick={() => deleteConversation(selectedChat.id)}
                    className="p-2 text-gray-600 transition-colors rounded-lg hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 space-y-6 overflow-y-auto md:p-6 bg-linear-to-b from-gray-50 to-gray-100">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <div className="flex items-center justify-center w-20 h-20 mb-4 bg-gray-200 rounded-2xl">
                      <MessageSquare size={32} className="opacity-40" />
                    </div>
                    <p className="font-medium text-gray-600">No messages yet</p>
                    <p className="text-sm">Send a message to start the conversation</p>
                  </div>
                ) : (
                  Object.entries(messageGroups).map(([date, dateMessages]) => (
                    <div key={date} className="space-y-4">
                      <div className="flex items-center justify-center gap-3">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-[10px] font-medium text-gray-400 bg-white px-3 py-1 rounded-full">
                          {formatEAT(date, "MMMM d, yyyy")}
                        </span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>

                      {dateMessages.map((m, idx) => {
                        const isAgent = m.sender_type === "agent";
                        const isSystem = m.sender_type === "system";
                        const showAvatar = idx === 0 || dateMessages[idx - 1].sender_type !== m.sender_type;
                        const msgAttachments = parseAttachments(m);

                        if (isSystem) return (
                          <div key={idx} className="flex justify-center">
                            <span className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-200 rounded-full">
                              {m.content}
                            </span>
                          </div>
                        );

                        return (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${isAgent ? "justify-end" : "justify-start"} gap-2`}
                          >
                            {!isAgent && showAvatar && (
                              <div className="flex items-center justify-center w-8 h-8 mt-1 text-gray-500 bg-gray-200 rounded-xl shrink-0">
                                <User size={14} />
                              </div>
                            )}
                            {!isAgent && !showAvatar && <div className="w-8 shrink-0" />}
                            
                            <div className={`
                              max-w-[85%] md:max-w-[70%] p-3 md:p-4 rounded-2xl text-sm shadow-sm
                              ${isAgent 
                                ? "bg-emerald-600 text-white rounded-tr-none" 
                                : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                              }
                            `}>
                              {/* Message content (without attachment markers) */}
                              <p className="leading-relaxed whitespace-pre-wrap">
                                {m.content.replace(/\[((?:IMAGE|PDF)):\s*[^\]]+\]/g, '').trim()}
                              </p>

                              {/* Attachments */}
                              {msgAttachments.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  {msgAttachments.map((att, attIdx) => (
                                    <div 
                                      key={attIdx}
                                      className={`
                                        flex items-center gap-2 p-2 rounded-lg text-xs
                                        ${isAgent ? 'bg-white/20' : 'bg-gray-100'}
                                        ${att.url ? 'cursor-pointer hover:opacity-80' : ''}
                                      `}
                                      onClick={() => att.url && window.open(att.url, '_blank')}
                                    >
                                      {getFileIcon(att.type)}
                                      <span className="flex-1 truncate">{att.name}</span>
                                      {att.url && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            downloadFile(att.url, att.name);
                                          }}
                                          className="p-1 rounded hover:bg-black/10"
                                          title="Download"
                                        >
                                          <Download size={14} />
                                        </button>
                                      )}
                                      {att.isParsed && !att.url && (
                                        <span className="text-[10px] opacity-60">(text ref)</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <div className={`flex items-center justify-end gap-1 mt-2 text-[10px] ${isAgent ? "text-emerald-200" : "text-gray-400"}`}>
                                <span>{formatEAT(m.created_at, "h:mm a")}</span>
                                {isAgent && <CheckCheck size={12} />}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendReply} className="p-4 bg-white border-t shrink-0">
                <div className="max-w-4xl mx-auto space-y-3">
                  {/* Attachment Preview */}
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-xl">
                      {attachments.map((att, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center gap-2 px-3 py-1.5 text-xs bg-white border rounded-lg shadow-sm"
                        >
                          {getFileIcon(att.type)}
                          <span className="max-w-37.5 truncate">{att.name}</span>
                          <button
                            type="button"
                            onClick={() => removeAttachment(idx)}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick actions */}
                  <div className="flex items-center gap-2 px-1">
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors rounded-lg hover:bg-gray-100 disabled:opacity-50"
                    >
                      {isUploading ? (
                        <div className="w-4 h-4 border-2 border-current rounded-full border-t-transparent animate-spin" />
                      ) : (
                        <Paperclip size={16} />
                      )}
                      Attach
                    </button>
                    <span className="text-xs text-gray-400">
                      Images & PDFs up to 5MB
                    </span>
                  </div>

                  {/* Message input */}
                  <div className="flex items-end gap-2">
                    <textarea 
                      ref={inputRef}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendReply(e);
                        }
                      }}
                      placeholder="Type your message..." 
                      rows="1"
                      className="flex-1 px-4 py-3 text-sm transition-all bg-gray-100 border-0 resize-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white"
                      style={{ minHeight: '48px', maxHeight: '120px' }}
                    />
                    
                    <button 
                      type="submit"
                      disabled={(!reply.trim() && attachments.length === 0)}
                      className="flex items-center gap-2 p-3 text-white transition-all shadow-md bg-emerald-600 rounded-2xl hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg active:scale-95 shrink-0"
                    >
                      <Send size={18} />
                    </button>
                  </div>

                  <input 
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    multiple
                  />
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 p-8 bg-linear-to-b from-gray-50 to-white">
              <div className="relative">
                <div className="flex items-center justify-center w-32 h-32 mb-6 rounded-3xl bg-linear-to-br from-emerald-500/10 to-emerald-600/10">
                  <MessageSquare size={48} className="text-emerald-500/40" />
                </div>
                <div className="absolute flex items-center justify-center w-12 h-12 shadow-xl -top-2 -right-2 bg-emerald-600 rounded-2xl">
                  <Users size={24} className="text-white" />
                </div>
              </div>
              
              <h3 className="mb-2 text-xl font-bold text-gray-900">No conversation selected</h3>
              <p className="max-w-xs text-sm text-center text-gray-500">
                Choose a conversation from the sidebar to start messaging with your clients
              </p>
              
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex items-center gap-2 px-6 py-3 mt-6 font-medium text-white transition-all shadow-lg md:hidden bg-emerald-600 rounded-xl hover:bg-emerald-700"
              >
                <Inbox size={18} />
                View Conversations
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-100 bg-black/80"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-0 right-0 p-2 text-white rounded-full bg-black/50 hover:bg-black/70"
            >
              <X size={24} />
            </button>
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-w-full max-h-[85vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}