"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // --- HIDE NAVBAR ON ADMIN & LOGIN ROUTES ---
  const isExcludedPage = pathname.startsWith("/admin") || pathname === "/login";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // If we are on an admin or login page, don't render anything
  if (isExcludedPage) return null;

  const navItems = [
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Projects" },
    { href: "/sustainability", label: "Sustainability" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-7xl">
      {/* ... rest of your existing JSX code ... */}
      <nav
        className={`flex items-center justify-between px-6 lg:px-8 py-3 transition-all duration-500
        rounded-4xl border border-white/20
        ${
          scrolled
            ? "bg-white/70 backdrop-blur-md shadow-lg"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <img
            src="/assets/shama_landscape_logo.png"
            alt="Shama Landscape Architects"
            className="w-auto h-10"
          />
        </Link>

        {/* DESKTOP NAV */}
        <div className="items-center hidden gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative text-sm tracking-wide transition-colors duration-300 ${
                isActive(item.href)
                  ? "text-shama-green"
                  : "text-shama-black/80 hover:text-shama-green"
              }`}
            >
              {item.label}
              <span
                className={`absolute left-0 -bottom-1 h-0.5 bg-shama-green transition-all duration-300 ${
                  isActive(item.href) ? "w-full" : "w-0"
                }`}
              />
            </Link>
          ))}

          <Link
            href="/contact"
            className="px-5 py-2 ml-4 text-sm font-semibold text-white transition-all duration-300 rounded-full shadow-md bg-shama-green hover:bg-shama-terra"
          >
            Start a Project
          </Link>
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-shama-black"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden fixed inset-x-0 top-24 mx-auto w-[92%] max-w-7xl rounded-2xl border border-white/20
        bg-white/80 backdrop-blur-md shadow-xl transition-all duration-400
        ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
      >
        <div className="flex flex-col p-6 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`text-base transition ${
                isActive(item.href)
                  ? "text-shama-green font-semibold"
                  : "text-shama-black/80 hover:text-shama-green"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="px-6 py-3 mt-4 text-center text-white rounded-full bg-shama-green"
          >
            Start a Project
          </Link>
        </div>
      </div>
    </header>
  );
}