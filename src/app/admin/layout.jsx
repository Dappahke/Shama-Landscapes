"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "./LogoutButton";
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  Mail,
  ArrowLeft,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Projects", href: "/admin/projects", icon: Briefcase },
    { name: "Chat", href: "/admin/chat", icon: MessageSquare },
    { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
  ];

  const isActive = (href) => pathname === href;

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* DESKTOP SIDEBAR - Fixed, always visible on md+ */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-64 lg:w-72 flex-col bg-[#264653] text-white shadow-2xl">
        {/* Logo Section */}
        <div className="p-6 lg:p-8 border-b border-white/10">
          <Link href="/admin" className="block">
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">
              Shama<span className="text-[#E9C46A]">.</span>Admin
            </h1>
            <p className="text-[10px] font-bold text-white/40 tracking-[0.2em] mt-1 uppercase">
              Management Portal
            </p>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 group
                  ${active 
                    ? "bg-white text-[#264653] shadow-lg" 
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <span className={`
                  p-2 rounded-lg transition-colors
                  ${active ? "bg-[#E9C46A]/20 text-[#E9C46A]" : "bg-white/5 text-white/50 group-hover:text-white"}
                `}>
                  <Icon size={18} strokeWidth={2} />
                </span>
                <span className="flex-1">{link.name}</span>
                {active && <ChevronRight size={16} className="text-[#E9C46A]" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <Link 
            href="/" 
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            <ArrowLeft size={16} />
            Back to Website
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* MOBILE HEADER - Sticky top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#264653] text-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin" className="flex items-center gap-2">
            <h1 className="text-xl font-black italic tracking-tight">
              Shama<span className="text-[#E9C46A]">.</span>A
            </h1>
          </Link>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <nav className="border-t border-white/10 bg-[#1a3238] px-4 py-4 space-y-1">
            {links.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all
                    ${active 
                      ? "bg-white text-[#264653]" 
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <span className={active ? "text-[#E9C46A]" : "text-white/50"}>
                    <Icon size={20} />
                  </span>
                  {link.name}
                </Link>
              );
            })}
            
            <div className="pt-4 mt-4 border-t border-white/10 space-y-3">
              <Link 
                href="/" 
                className="flex items-center gap-2 px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Website
              </Link>
              <LogoutButton />
            </div>
          </nav>
        )}
      </header>

      {/* MAIN CONTENT - With proper offset for sidebar and mobile header */}
      <main className="flex-1 min-h-screen md:ml-64 lg:ml-72 pt-15 md:pt-0">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 xl:p-10">
          {children}
        </div>
      </main>

      {/* MOBILE BOTTOM NAV - Quick access for frequent actions */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center px-2 py-2">
          {links.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl min-w-16 transition-all
                  ${active 
                    ? "text-[#264653] bg-[#E9C46A]/10" 
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-semibold leading-none">{link.name}</span>
              </Link>
            );
          })}
        </div>
        
        {/* Safe area padding for iOS */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>

      {/* Mobile content padding for bottom nav */}
      <div className="md:hidden h-20" />
    </div>
  );
}