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
      className="relative flex items-end justify-start w-full h-screen pb-24 pl-8 overflow-hidden text-left md:pl-16"
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

      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

      {/* Content */}
      <div
        className={`relative z-20 max-w-2xl text-white transition-all duration-700 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >

        {/* Firm label */}
        <p className="mb-4 text-sm tracking-widest uppercase text-white/70">
          Landscape Architecture Studio
        </p>

        {/* Main Headline */}
        <h1 className="mb-6 text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
          Designing Landscapes <br />
          <span className="text-shama-green">That Integrate Nature</span>  
          <br />with the Built Environment
        </h1>

        {/* Subheadline */}
        <p className="max-w-xl mb-6 text-base leading-relaxed text-white/80 md:text-lg">
          Shama Landscape Architects is a Nairobi-based studio delivering
          landscape architecture, environmental planning, and master planning
          services — shaping sustainable outdoor environments from concept
          to implementation.
        </p>

        {/* CTA */}
        <div className="flex gap-4">
          <a
            href="/projects"
            className="px-5 py-2.5 text-sm font-semibold text-white transition-all rounded-full bg-shama-green hover:bg-shama-terra"
          >
            View Projects
          </a>

          <a
            href="/contact"
            className="px-5 py-2.5 text-sm font-semibold text-white transition-all border rounded-full border-white/40 hover:bg-white/10"
          >
            Start a Project
          </a>
        </div>
      </div>
    </section>
  );
}