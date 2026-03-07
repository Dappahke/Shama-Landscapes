"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [inHero, setInHero] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/about", label: "About Us", color: "blue" },
    { href: "/services", label: "Services", color: "green" },
    { href: "/projects", label: "Our Projects", color: "green" },
    { href: "/company-profile", label: "Company Profile", color: "blue" },
    { href: "/sustainability", label: "Sustainability", color: "green" },
    { href: "/blog", label: "Blog", color: "blue" },
    { href: "/contact", label: "Contact", color: "green" },
  ];

  useEffect(() => {
    if (pathname !== "/") return;
    const hero = document.querySelector("#hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInHero(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const getActiveColorClass = (color) =>
    color === "green" ? "text-shama-green" : "text-shama-blue";

  const getHoverColorClass = (color) =>
    color === "green" ? "hover:text-shama-green" : "hover:text-shama-blue";

  const isHome = pathname === "/";

  return (
    <header
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] w-[90%] max-w-7xl transition-all duration-500 rounded-3xl ${
        isHome && inHero && !scrolled
          ? "bg-white/30 backdrop-blur-none shadow-none"
          : "bg-white/30 backdrop-blur-lg shadow-2xl"
      }`}
    >
      <nav className="flex items-center justify-between px-6 py-3">
        {/* LOGO */}
        <Link href="/" aria-label="Home" className="transition-opacity hover:opacity-80">
          <img
            src="/assets/logo.png"
            alt="Shama Landscape Architects Logo"
            className="w-auto h-10 lg:h-12"
          />
        </Link>

        {/* DESKTOP NAV */}
        <div className="items-center hidden space-x-4 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ${
                isHome && inHero && !scrolled
                  ? "text-white/90 hover:text-white"
                  : isActive(item.href)
                  ? getActiveColorClass(item.color) + " font-semibold"
                  : "text-shama-black/80 " + getHoverColorClass(item.color)
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${
                    item.color === "green" ? "bg-shama-green" : "bg-shama-blue"
                  }`}
                />
              )}
            </Link>
          ))}

          {/* CTA */}
          <Link
            href="/contact"
            className="ml-4 px-5 py-2.5 text-sm font-semibold text-white rounded-full bg-shama-green hover:bg-shama-terra transition-all duration-300 shadow-lg"
          >
            Book an Appointment
          </Link>
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="p-2 transition rounded-lg lg:hidden text-shama-black/80 hover:bg-shama-green/10"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden fixed inset-x-0 top-24 bg-white/80 backdrop-blur-lg shadow-2xl transition-all duration-500 z-[200] ${
          open ? "visible opacity-100 translate-y-0" : "invisible opacity-0 -translate-y-4"
        }`}
      >
        <div className="flex flex-col p-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-lg text-base font-medium ${
                isActive(item.href)
                  ? getActiveColorClass(item.color) + " bg-white/20 font-semibold"
                  : "text-shama-black/80 hover:bg-white/10 " + getHoverColorClass(item.color)
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile CTA */}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="px-4 py-3 mt-4 font-semibold text-center text-white rounded-lg bg-shama-green hover:bg-shama-terra"
          >
            Book an Appointment
          </Link>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[150] bg-black/20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </header>
  );
}