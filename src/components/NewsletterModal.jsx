"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Check, Loader2, Mail } from "lucide-react";
import supabase from "@/lib/supabaseClient";

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  DELAY: 8000,              // 8 seconds before auto-show
  SCROLL_THRESHOLD: 0.6,    // 60% scroll
  AUTO_CLOSE_DELAY: 3500,   // 3.5s after success
  STORAGE_KEY: "newsletterSeen",
  STORAGE_DATE_KEY: "newsletterLastShown",
  RESHOW_AFTER_DAYS: 30,    // Show again after 30 days
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function shouldShowModal() {
  if (typeof window === "undefined") return false;
  const lastShown = localStorage.getItem(CONFIG.STORAGE_DATE_KEY);
  if (!lastShown) return true;
  const daysSince = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24);
  return daysSince >= CONFIG.RESHOW_AFTER_DAYS;
}

function markModalSeen() {
  localStorage.setItem(CONFIG.STORAGE_KEY, "true");
  localStorage.setItem(CONFIG.STORAGE_DATE_KEY, Date.now().toString());
}

// ============================================
// COMPONENT
// ============================================

export default function NewsletterModal({
  category = "general",
  postTitle = "homepage",
  onSubscribe = null,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Only mount on client
  useEffect(() => setMounted(true), []);

  // ============================================
  // Modal trigger logic
  // ============================================
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!shouldShowModal()) return;

    let timer = null;
    let scrollTriggered = false;

    const openModal = () => {
      setIsOpen(true);
      markModalSeen();
    };

    // Timer
    timer = setTimeout(openModal, CONFIG.DELAY);

    // Scroll
    const scrollHandler = () => {
      if (scrollTriggered) return;
      const scrollPercent =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent > CONFIG.SCROLL_THRESHOLD) {
        scrollTriggered = true;
        openModal();
      }
    };
    window.addEventListener("scroll", scrollHandler, { passive: true });

    // Exit intent
    const exitHandler = (e) => {
      if (e.clientY < 50 && e.relatedTarget === null) openModal();
    };
    document.addEventListener("mouseout", exitHandler);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", scrollHandler);
      document.removeEventListener("mouseout", exitHandler);
    };
  }, []);

  // ============================================
  // Focus and body scroll
  // ============================================
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = "hidden";
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    }
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  // Keyboard navigation & trap
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "Tab") {
        const focusable = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // ============================================
  // Handlers
  // ============================================
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setError(null);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (honeypot) return; // Bot detected

    const trimmedEmail = email.toLowerCase().trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!supabase) {
      setError("Service unavailable, try again later.");
      return;
    }

    setIsLoading(true);

    try {
      const { error: supabaseError } = await supabase
        .from("newsletter")
        .insert([
          {
            email: trimmedEmail,
            metadata: {
              source_post: postTitle,
              category,
              signup_date: new Date().toISOString(),
              platform: "shama-web-v2",
              user_agent: navigator.userAgent,
            },
          },
        ]);

      if (supabaseError) {
        if (supabaseError.code === "23505") { // Already subscribed
          setSubmitted(true);
          setTimeout(handleClose, CONFIG.AUTO_CLOSE_DELAY);
        } else throw supabaseError;
      } else {
        setSubmitted(true);
        onSubscribe?.({ email: trimmedEmail, category, postTitle });
        setTimeout(handleClose, CONFIG.AUTO_CLOSE_DELAY);
      }
    } catch (err) {
      console.error(err);
      setError("Subscription failed. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || !isOpen) return null;

  // ============================================
  // Modal JSX
  // ============================================
  const modalContent = (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-500"
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-title"
      aria-describedby="newsletter-description"
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-3xl animate-in zoom-in slide-in-from-bottom-8"
      >
        <div className="h-2 bg-gradient-to-r from-[#2A9D8F] via-[#38b172] to-[#2A9D8F]" />
        <button
          ref={closeButtonRef}
          className="absolute p-2 top-4 right-4 text-slate-400 hover:text-[#2A9D8F] hover:bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:ring-offset-2"
          onClick={handleClose}
          aria-label="Close newsletter signup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-12 text-center">
          {!submitted ? (
            <>
              <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest uppercase rounded-full text-[#2A9D8F] bg-[#daf0ea]">
                The Shama Journal
              </span>
              <h2 id="newsletter-title" className="mb-3 text-3xl font-extrabold text-slate-900">
                Sustainable living, <br />delivered to your inbox.
              </h2>
              <p id="newsletter-description" className="mb-8 text-slate-600">
                Join our curated insights on landscape design in Kenya twice a year.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="hidden">
                  <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                </div>
                <div className="relative">
                  <Mail className="absolute w-5 h-5 -translate-y-1/2 text-slate-400 left-4 top-1/2" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 pl-12 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] bg-slate-50 disabled:opacity-50"
                    required
                    disabled={isLoading}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? "email-error" : undefined}
                  />
                </div>
                {error && <p id="email-error" className="text-sm text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-4 font-bold text-white bg-[#2A9D8F] rounded-2xl hover:bg-[#238354] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Join the Collective"}
                </button>
              </form>

              <p className="mt-6 text-[11px] text-slate-400 uppercase tracking-widest">Privacy respected. Opt-out anytime.</p>
            </>
          ) : (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-[#daf0ea]">
                <Check className="w-10 h-10 text-[#2A9D8F]" />
              </div>
              <h2 className="mb-2 text-3xl font-bold text-slate-900">Welcome Aboard</h2>
              <p className="text-slate-600">You've successfully subscribed to the Shama Journal.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}