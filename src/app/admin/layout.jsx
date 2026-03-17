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
    { name: "Subscribers", href: "/admin/subscribers", icon: Mail },
  ];

  const isActive = (href) => pathname === href;

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* DESKTOP SIDEBAR - Fixed, always visible on md+ */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-64 lg:w-72 flex-col bg-[#264653] text-white shadow-2xl">
        {/* Logo Section */}
        <div className="p-6 border-b lg:p-8 border-white/10">
          <Link href="/admin" className="block">
            <h1 className="text-2xl italic font-black tracking-tighter uppercase">
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
        <div className="p-4 space-y-3 border-t border-white/10">
          <Link 
            href="/" 
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-lg text-white/60 hover:text-white hover:bg-white/5"
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
            <h1 className="text-xl italic font-black tracking-tight">
              Shama<span className="text-[#E9C46A]">.</span>A
            </h1>
          </Link>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 transition-colors rounded-lg bg-white/10 hover:bg-white/20"
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
            
            <div className="pt-4 mt-4 space-y-3 border-t border-white/10">
              <Link 
                href="/" 
                className="flex items-center gap-2 px-4 py-2 text-sm transition-colors text-white/60 hover:text-white"
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
        <div className="p-4 mx-auto max-w-7xl sm:p-6 lg:p-8 xl:p-10">
          {children}
        </div>
      </main>

      {/* MOBILE BOTTOM NAV - Quick access for frequent actions */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
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
      <div className="h-20 md:hidden" />
    </div>
  );
}