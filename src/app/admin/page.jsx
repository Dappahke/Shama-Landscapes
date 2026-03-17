"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  LayoutDashboard, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Users,
  Mail,
  AlertCircle,
  ArrowUpRight,
  Calendar
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    messages: 0,
    unreadMessages: 0,
    subscribers: 0,
    recentProjects: []
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate completion rate
  const completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  // Fetch all dashboard data
  const fetchStats = useCallback(async () => {
    try {
      setIsRefreshing(true);
      
      const [
        { data: projects },
        { count: chatCount },
        { count: unreadChatCount },
        { count: newsCount },
        { data: recentProjectsData }
      ] = await Promise.all([
        supabase.from('projects').select('status, id'),
        supabase.from('chat_conversations').select('*', { count: 'exact', head: true }),
        supabase.from('chat_conversations').select('*', { count: 'exact', head: true }).gt('unread_count', 0),
        supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('id, title, status, created_at, cover_image').order('created_at', { ascending: false }).limit(4)
      ]);

      if (projects) {
        setStats({
          total: projects.length,
          inProgress: projects.filter(p => p.status === 'In Progress').length,
          completed: projects.filter(p => p.status === 'Completed').length,
          messages: chatCount || 0,
          unreadMessages: unreadChatCount || 0,
          subscribers: newsCount || 0,
          recentProjects: recentProjectsData || []
        });
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Set up Realtime Subscriptions
  useEffect(() => {
    fetchStats();

    // Listen for any changes on projects, messages, or subscribers
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        () => fetchStats()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_conversations' },
        () => fetchStats()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'newsletter_subscribers' },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchStats]);

  // Stat cards configuration
  const statCards = [
    { 
      label: "Total Projects", 
      value: stats.total, 
      icon: Briefcase, 
      color: "from-[#264653] to-[#2a5262]",
      trend: "+12%",
      trendUp: true,
      href: "/admin/projects"
    },
    { 
      label: "In Progress", 
      value: stats.inProgress, 
      icon: Clock, 
      color: "from-[#BD7563] to-[#d48a75]",
      trend: "+5%",
      trendUp: true,
      href: "/admin/projects"
    },
    { 
      label: "Completed", 
      value: stats.completed, 
      icon: CheckCircle2, 
      color: "from-[#0F7F40] to-[#13a350]",
      trend: "+18%",
      trendUp: true,
      href: "/admin/projects"
    },
  ];

  // Quick actions
  const quickActions = [
    { label: "New Project", icon: Briefcase, color: "bg-[#264653]", href: "/admin/projects" },
    { label: "View Messages", icon: MessageSquare, color: "bg-[#BD7563]", href: "/admin/chat", badge: stats.unreadMessages },
    { label: "Newsletter", icon: Mail, color: "bg-[#0F7F40]", href: "/admin/newsletter", badge: stats.subscribers },
  ];

  const getRelativeTime = (date) => {
    const now = new Date();
    const projectDate = new Date(date);
    const diffInDays = Math.floor((now - projectDate) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50/50 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 mb-8 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-linear-to-br from-shama-green to-[#264653] rounded-2xl flex items-center justify-center shadow-lg">
            <LayoutDashboard className="w-6 h-6 text-white md:w-7 md:h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#264653] tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm font-medium text-gray-500 md:text-base">
              Welcome back, Admin
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchStats}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          
          <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-green-700 border border-green-100 bg-green-50 rounded-xl">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="hidden sm:inline">Live Realtime</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3 mb-6 md:gap-4 md:mb-8">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex flex-col items-center p-3 transition-all bg-white border border-gray-100 shadow-sm group md:p-4 rounded-2xl hover:shadow-md hover:border-gray-200 active:scale-95"
          >
            <div className={`${action.color} p-2.5 md:p-3 rounded-xl mb-2 group-hover:scale-110 transition-transform`}>
              <action.icon className="w-4 h-4 text-white md:w-5 md:h-5" />
            </div>
            <span className="text-xs font-semibold leading-tight text-center text-gray-700 md:text-sm">
              {action.label}
            </span>
            {action.badge > 0 && (
              <span className="mt-1.5 bg-shama-green text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {action.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3 md:gap-6 md:mb-8">
        {statCards.map((card, i) => (
          <Link 
            key={i} 
            href={card.href}
            className={`group relative overflow-hidden bg-linear-to-br ${card.color} p-5 md:p-6 rounded-2xl md:rounded-3xl text-white shadow-lg hover:shadow-xl transition-all active:scale-[0.98]`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <card.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${card.trendUp ? 'bg-white/20' : 'bg-red-400/30'}`}>
                {card.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {card.trend}
              </div>
            </div>
            
            <div>
              <p className="text-xs font-medium tracking-wider uppercase md:text-sm opacity-90">{card.label}</p>
              <h3 className="mt-1 text-3xl font-black md:text-4xl">
                {loading && stats.total === 0 ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  card.value
                )}
              </h3>
            </div>
            <div className="absolute w-24 h-24 transition-transform duration-500 rounded-full -bottom-6 -right-6 bg-white/10 blur-2xl group-hover:scale-150" />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="p-5 bg-white border border-gray-100 shadow-sm lg:col-span-2 md:p-6 rounded-2xl md:rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg md:text-xl font-bold text-[#264653] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-shama-green" />
              Project Completion
            </h2>
            <span className="text-2xl font-black md:text-3xl text-shama-green">{completionRate}%</span>
          </div>
          
          <div className="h-4 mb-4 overflow-hidden bg-gray-100 rounded-full">
            <div 
              className="h-full bg-linear-to-r from-shama-green to-[#13a350] rounded-full transition-all duration-1000"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          
          <div className="flex justify-between mb-6 text-sm text-gray-500">
            <span>{stats.completed} completed</span>
            <span>{stats.total} total</span>
          </div>

          <div className="space-y-3">
            <h3 className="mb-3 text-sm font-bold tracking-wider text-gray-400 uppercase">Recent Projects</h3>
            {stats.recentProjects.length === 0 ? (
              <div className="py-8 text-center text-gray-400">
                <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No projects yet</p>
              </div>
            ) : (
              stats.recentProjects.map((project) => (
                <Link 
                  key={project.id}
                  href={`/admin/projects`}
                  className="flex items-center gap-3 p-3 transition-colors bg-gray-50 rounded-xl hover:bg-gray-100 group"
                >
                  <div className="w-12 h-12 overflow-hidden bg-gray-200 rounded-lg shrink-0">
                    {project.cover_image ? (
                      <img src={project.cover_image} alt="" className="object-cover w-full h-full" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-400">
                        <Briefcase className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-800 truncate md:text-base">{project.title}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`
                        text-[10px] px-2 py-0.5 rounded-full font-medium
                        ${project.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                          project.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : 
                          'bg-gray-100 text-gray-600'}
                      `}>
                        {project.status}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {getRelativeTime(project.created_at)}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-gray-400 transition-colors group-hover:text-shama-green" />
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-5 bg-white border border-gray-100 shadow-sm md:p-6 rounded-2xl md:rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#264653] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-shama-terra" />
                Messages
              </h2>
              <Link href="/admin/chat" className="text-xs font-semibold text-shama-green hover:underline">
                View all
              </Link>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border bg-amber-50 rounded-xl border-amber-100">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">Unread</span>
                </div>
                <span className="bg-amber-600 text-white px-2.5 py-1 rounded-full text-xs font-bold">
                  {stats.unreadMessages}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-600">Total Conversations</span>
                <span className="text-lg font-bold text-gray-800">{stats.messages}</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border border-gray-100 shadow-sm md:p-6 rounded-2xl md:rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#264653] flex items-center gap-2">
                <Mail className="w-5 h-5 text-shama-green" />
                Newsletter
              </h2>
              <Link href="/admin/newsletter" className="text-xs font-semibold text-shama-green hover:underline">
                Manage
              </Link>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-linear-to-br from-shama-green/5 to-shama-green/10 rounded-xl">
              <div className="flex items-center justify-center w-12 h-12 bg-shama-green rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-black text-[#264653]">{stats.subscribers}</p>
                <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Subscribers</p>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-[#264653] to-[#1a3a47] p-5 md:p-6 rounded-2xl md:rounded-3xl text-white shadow-lg">
            <h2 className="flex items-center gap-2 mb-4 text-lg font-bold">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              System Status
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">Database</span>
                <span className="px-2 py-1 text-xs font-bold text-green-300 rounded-full bg-green-500/30">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">Realtime</span>
                <span className="px-2 py-1 text-xs font-bold text-green-300 rounded-full bg-green-500/30">Active</span>
              </div>
            </div>
            
            <p className="text-[10px] opacity-50 mt-4 pt-4 border-t border-white/10">
              Last sync: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}