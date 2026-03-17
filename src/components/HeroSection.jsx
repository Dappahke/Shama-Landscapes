"use client";
import React, { useState, useEffect } from "react";

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleVideoError = (e) => {
    e.target.style.display = "none";
    const hero = document.getElementById("hero");
    hero.style.backgroundImage = "url('/images/hero-fallback.jpg')";
    hero.classList.add("bg-cover", "bg-center");
  };

  return (
    <section
      id="hero"
      className="relative flex items-end justify-start w-full h-screen pb-20 pl-6 overflow-hidden md:pl-16"
    >
      {/* Background Video */}
      <video
        className="absolute inset-0 z-0 object-cover w-full h-full"
        autoPlay
        muted
        loop
        playsInline
        onError={handleVideoError}
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
        <source src="/videos/hero-bg.webm" type="video/webm" />
      </video>

      {/* Overlay (lighter so video shows clearly) */}
      <div className="absolute inset-0 z-10 bg-linear-to-t from-black/60 via-black/25 to-transparent" />

      {/* Content */}
      <div
        className={`relative z-20 max-w-lg text-white transition-all duration-700 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Label */}
        <p className="mb-3 text-xs tracking-[0.25em] uppercase text-white/70">
          Landscape Architecture & Environmental Planning
        </p>

        {/* Divider */}
        <div className="w-12 h-px mb-4 bg-shama-green"></div>

        {/* Headline */}
        <h1 className="mb-4 text-2xl font-medium leading-snug md:text-3xl lg:text-4xl">
          Designing Landscapes for the{" "}
          <span className="text-shama-green">Built Environment</span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-md mb-6 text-sm leading-relaxed text-white/80 md:text-base">
          A Nairobi-based landscape architecture practice delivering
          sustainable design, environmental planning, and master planning
          for residential, commercial, and hospitality developments across Kenya.
        </p>

        {/* CTA */}
        <div className="flex gap-3">
          <a
            href="/projects"
            className="px-4 py-2 text-xs font-semibold tracking-wide text-white transition-all rounded-full bg-shama-green hover:bg-shama-terra"
          >
            Explore Projects
          </a>

          <a
            href="/contact"
            className="px-4 py-2 text-xs font-semibold tracking-wide text-white transition-all border rounded-full border-white/40 hover:bg-white/10"
          >
            Start a Project
          </a>
        </div>
      </div>
    </section>
  );
}