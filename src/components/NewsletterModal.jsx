"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Check, Loader2, Mail } from "lucide-react";
import supabase from "@/lib/supabaseClient";

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // Timing settings (in milliseconds)
  DELAY: 8000,              // 8 seconds initial delay
  SCROLL_THRESHOLD: 0.6,    // 60% of page height
  AUTO_CLOSE_DELAY: 3500,   // Auto-close after success
  
  // LocalStorage keys
  STORAGE_KEY: "newsletterSeen",
  STORAGE_DATE_KEY: "newsletterLastShown",
  
  // Re-show interval (30 days)
  RESHOW_AFTER_DAYS: 30,
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if enough time has passed to show modal again
 */
function shouldShowModal() {
  if (typeof window === "undefined") return false;
  
  const lastShown = localStorage.getItem(CONFIG.STORAGE_DATE_KEY);
  if (!lastShown) return true;
  
  const daysSinceShown = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24);
  return daysSinceShown >= CONFIG.RESHOW_AFTER_DAYS;
}

/**
 * Mark modal as seen with timestamp
 */
function markModalSeen() {
  localStorage.setItem(CONFIG.STORAGE_KEY, "true");
  localStorage.setItem(CONFIG.STORAGE_DATE_KEY, Date.now().toString());
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function NewsletterModal({ 
  category = "general", 
  postTitle = "homepage",
  onSubscribe = null, // Optional callback for successful subscription
}) {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  
  // Refs
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Mount detection for portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Main effect: trigger conditions
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!shouldShowModal()) return;

    let timer = null;
    let scrollHandler = null;
    let exitHandler = null;

    // Timer trigger
    timer = setTimeout(() => {
      setIsOpen(true);
    }, CONFIG.DELAY);

    // Scroll trigger
    let scrollTriggered = false;
    scrollHandler = () => {
      if (scrollTriggered) return;
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent > CONFIG.SCROLL_THRESHOLD) {
        scrollTriggered = true;
        setIsOpen(true);
      }
    };

    // Exit intent trigger (desktop only)
    exitHandler = (e) => {
      if (e.clientY < 50 && e.relatedTarget === null) {
        setIsOpen(true);
      }
    };

    window.addEventListener("scroll", scrollHandler, { passive: true });
    document.addEventListener("mouseout", exitHandler);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", scrollHandler);
      document.removeEventListener("mouseout", exitHandler);
    };
  }, []);

  // Focus management when modal opens
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      // Prevent body scroll
      document.body.style.overflow = "hidden";
      // Focus close button after animation
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Keyboard handling (Escape to close)
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
      // Trap focus within modal
      if (e.key === "Tab") {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements?.length) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Handlers
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setError(null);
    markModalSeen();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Honeypot check (bot protection)
    if (honeypot) {
      console.log("Bot detected");
      return;
    }

    // Validation
    const trimmedEmail = email.toLowerCase().trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!supabase) {
      setError("Service temporarily unavailable. Please try again later.");
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
              category: category,
              signup_date: new Date().toISOString(),
              platform: "shama-web-v2",
              user_agent: navigator.userAgent,
            },
          },
        ]);

      if (supabaseError) {
        if (supabaseError.code === "23505") {
          setSubmitted(true);
          setTimeout(handleClose, CONFIG.AUTO_CLOSE_DELAY);
        } else {
          throw supabaseError;
        }
      } else {
        setSubmitted(true);
        onSubscribe?.({ email: trimmedEmail, category, postTitle });
        setTimeout(handleClose, CONFIG.AUTO_CLOSE_DELAY);
      }
    } catch (err) {
      console.error("Newsletter submission error:", err);
      setError("Subscription failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if not mounted (prevents hydration mismatch)
  if (!mounted || !isOpen) return null;

  // Portal content
  const modalContent = (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-500"
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-title"
      aria-describedby="newsletter-description"
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-lg overflow-hidden duration-500 bg-white shadow-2xl rounded-3xl animate-in zoom-in slide-in-from-bottom-8"
      >
        {/* Top gradient bar */}
        <div className="h-2 bg-gradient-to-r from-emerald-800 via-emerald-600 to-emerald-800" />

        {/* Close button */}
        <button
          ref={closeButtonRef}
          className="absolute p-2 transition-all rounded-full text-slate-400 top-4 right-4 hover:text-emerald-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          onClick={handleClose}
          disabled={isLoading}
          aria-label="Close newsletter signup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-12">
          {!submitted ? (
            <>
              <div className="text-center">
                <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest uppercase rounded-full text-emerald-700 bg-emerald-50">
                  The Shama Journal
                </span>
                <h2 
                  id="newsletter-title"
                  className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900"
                >
                  Sustainable living, <br />delivered to your inbox.
                </h2>
                <p 
                  id="newsletter-description"
                  className="mb-8 leading-relaxed text-slate-600"
                >
                  Join our community of architects and designers. We send curated insights on landscape design in Kenya twice a year.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Honeypot field (hidden from users, visible to bots) */}
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {/* Email input */}
                <div className="relative">
                  <Mail className="absolute w-5 h-5 -translate-y-1/2 text-slate-400 left-4 top-1/2" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 pl-12 transition-all border text-slate-900 bg-slate-50 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white disabled:opacity-50"
                    required
                    disabled={isLoading}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? "email-error" : undefined}
                  />
                </div>

                {/* Error message */}
                {error && (
                  <p 
                    id="email-error" 
                    className="text-sm text-center text-red-600 animate-in fade-in"
                    role="alert"
                  >
                    {error}
                  </p>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-4 font-bold text-white transition-all shadow-lg bg-emerald-800 rounded-2xl hover:bg-emerald-900 hover:shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Syncing...</span>
                    </>
                  ) : (
                    "Join the Collective"
                  )}
                </button>
              </form>

              <p className="mt-6 text-[11px] text-center leading-relaxed text-slate-400 uppercase tracking-widest">
                Privacy respected. Opt-out at any time.
              </p>
            </>
          ) : (
            <div className="py-12 text-center duration-500 animate-in zoom-in">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-emerald-50">
                <Check className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="mb-2 text-3xl font-bold text-slate-900">Welcome Aboard</h2>
              <p className="text-slate-600">
                You've successfully subscribed to the Shama Journal.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Use portal to render at document root (prevents z-index issues)
  return createPortal(modalContent, document.body);
}