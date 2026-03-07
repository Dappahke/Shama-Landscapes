"use client";
import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Sparkles } from "lucide-react";

export default function WhatsAppButton() {
  const [showText, setShowText] = useState(false);
  const [hovered, setHovered] = useState(false);
  const timeoutRef = useRef(null);

  // Show text bubble after short delay
  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-hide text bubble after 8s
  useEffect(() => {
    if (showText) {
      timeoutRef.current = setTimeout(() => setShowText(false), 8000);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [showText]);

  const handleCloseText = () => {
    setShowText(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end space-y-3">
      {/* Text Bubble */}
      {showText && (
        <div className="relative group">
          <button
            onClick={handleCloseText}
            className="absolute flex items-center justify-center w-6 h-6 text-white transition transform rounded-full -top-2 -left-2 bg-shama-terra hover:bg-shama-green hover:scale-110"
          >
            <X size={12} />
          </button>

          <div className="relative px-4 py-3 text-sm font-semibold border shadow-lg rounded-2xl bg-white/90 text-shama-black border-shama-green/20 backdrop-blur-sm animate-fade-in">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute top-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                <div className="relative w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <span>💬 Chat with us!</span>
            </div>
            <Sparkles className="absolute top-2 right-2 text-shama-green animate-pulse" size={12} />
            <div className="absolute bottom-0 w-3 h-3 rotate-45 translate-y-1/2 bg-white border-b border-r border-shama-green/20 right-4"></div>
          </div>
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/+254735184292?text=Hello%20Shama%20Landscape%20Architects%2C%20I%27d%20like%20to%20discuss%20a%20landscaping%20project%20with%20you.%20"
        target="_blank"
        rel="noopener noreferrer"
        className={`relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-transform transform ${
          hovered
            ? "scale-110 bg-gradient-to-br from-green-500 to-green-600 shadow-xl"
            : "scale-100 bg-gradient-to-br from-green-400 to-green-500 shadow-lg"
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setShowText(true)}
        aria-label="Chat with Shama Landscapes on WhatsApp"
      >
        {/* Pulsing ring */}
        {hovered && <div className="absolute inset-0 bg-green-400 rounded-full opacity-50 animate-ping"></div>}

        <MessageCircle size={30} className={`transition-transform ${hovered ? "scale-110" : "scale-100"}`} />

        {/* Online Indicator */}
        <div className="absolute flex items-center justify-center w-3 h-3 bg-white rounded-full top-1 right-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </a>

      {/* Mini brand indicator */}
      <div className="flex items-center space-x-1 text-xs text-shama-black/60">
        <span>Shama</span>
        <div className="w-1 h-1 rounded-full bg-shama-green"></div>
        <span>WhatsApp</span>
      </div>
    </div>
  );
}
