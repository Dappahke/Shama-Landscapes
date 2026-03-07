"use client";
import { useState, useEffect } from "react";
import supabase from "@/lib/supabaseClient";

export default function NewsletterModal({ category = "general", postTitle = "homepage" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Bot protection
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasSeenModal = localStorage.getItem("newsletterSeen");
    if (hasSeenModal) return;

    // Show after 8 seconds (less intrusive) OR scroll 60% down
    const timer = setTimeout(() => setIsOpen(true), 8000);

    const handleScroll = () => {
      if (window.scrollY > document.body.scrollHeight * 0.6) {
        setIsOpen(true);
      }
    };

    const handleExitIntent = (e) => {
      if (e.clientY < 50) setIsOpen(true);
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mouseout", handleExitIntent);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseout", handleExitIntent);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("newsletterSeen", "true");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If honeypot is filled, it's a bot
    if (honeypot) return;
    if (!email || !supabase) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('newsletter')
        .insert([
          { 
            email: email.toLowerCase().trim(),
            metadata: { 
              source_post: postTitle,
              category: category,
              signup_date: new Date().toISOString(),
              platform: "shama-web-v2"
            }
          }
        ]);

      if (error) {
        if (error.code === '23505') {
          alert("You're already on our curated list! ✨");
          handleClose();
        } else {
          throw error;
        }
      } else {
        setSubmitted(true);
        localStorage.setItem("newsletterSeen", "true");
        // Auto-close after 3 seconds on success
        setTimeout(handleClose, 3500);
      }
    } catch (err) {
      console.error('Submission error:', err.message);
      alert('Subscription failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-500">
      <div className="relative w-full max-w-lg overflow-hidden duration-500 bg-white shadow-2xl rounded-3xl animate-in zoom-in slide-in-from-bottom-8">
        
        {/* Aesthetic Top Bar */}
        <div className="h-2 bg-gradient-to-r from-emerald-800 via-emerald-600 to-emerald-800" />

        <button
          className="absolute p-2 transition-all rounded-full text-slate-400 top-4 right-4 hover:text-emerald-800 hover:bg-slate-100"
          onClick={handleClose}
          disabled={isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 md:p-12">
          {!submitted ? (
            <>
              <div className="text-center">
                <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest uppercase rounded-full text-emerald-700 bg-emerald-50">
                  The Shama Journal
                </span>
                <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900">
                  Sustainable living, <br />delivered to your inbox.
                </h2>
                <p className="mb-8 leading-relaxed text-slate-600">
                  Join our community of architects and designers. We send curated insights on landscape design in Kenya twice a year.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot Hidden Field */}
                <input 
                  type="text" 
                  className="hidden" 
                  value={honeypot} 
                  onChange={(e) => setHoneypot(e.target.value)} 
                />
                
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 transition-all border text-slate-900 bg-slate-50 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-4 font-bold text-white transition-all shadow-lg bg-emerald-800 rounded-2xl hover:bg-emerald-900 hover:shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {isLoading ? "Syncing..." : "Join the Collective"}
                </button>
              </form>
              
              <p className="mt-6 text-[11px] text-center leading-relaxed text-slate-400 uppercase tracking-widest">
                Privacy respected. Opt-out at any time.
              </p>
            </>
          ) : (
            <div className="py-12 text-center duration-500 animate-in zoom-in">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-emerald-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mb-2 text-3xl font-bold text-slate-900">Welcome Aboard</h2>
              <p className="text-slate-600">
                You’ve successfully subscribed to the Shama Journal.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}