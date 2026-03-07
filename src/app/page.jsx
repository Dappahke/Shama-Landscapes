"use client";
import { useState, useEffect, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import FeaturedProjects from "@/components/FeaturedProjects";
import NewsletterModal from "@/components/NewsletterModal";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-hidden bg-white text-shama-black font-montserrat">
      {/* HERO SECTION */}
      <HeroSection />

      {/* INTRODUCTION - Enhanced with animation */}
      <section 
        ref={observerRef}
        className={`px-6 py-20 text-center bg-white md:px-24 transition-all duration-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="mb-6 text-4xl font-bold text-shama-green md:text-5xl">
            Landscape Architecture With <span className="italic">Purpose</span> and <span className="italic">Permanence</span>
          </h2>

          <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-700 md:text-xl">
            Shama Landscape Architects delivers environments where design,
            ecology, and human experience align. Our
            team blends traditional craftsmanship with modern strategy —
            developing landscapes that elevate property value, community identity,
            and everyday life.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 mt-12 sm:flex-row">
            <Link
              href="/contact"
              className="px-8 py-4 font-semibold text-white transition-all duration-300 transform rounded-full shadow-lg bg-shama-green hover:bg-shama-terra hover:shadow-2xl hover:scale-105"
            >
              Book an Appointment
            </Link>
            <Link
              href="/projects"
              className="px-8 py-4 font-semibold transition-all duration-300 border-2 rounded-full text-shama-green border-shama-green hover:bg-shama-green hover:text-white"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US - Enhanced with staggered animation */}
      <section className="px-6 py-20 bg-shama-clay/40 md:px-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-4 text-3xl font-bold text-center md:text-4xl">
            Why Clients Choose Shama
          </h2>
          <p className="max-w-2xl mx-auto mb-12 text-center text-gray-600">
            Delivering exceptional landscapes through proven expertise and client-focused service
          </p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "leaf",
                title: "Sustainability First",
                desc: "Designed around native ecosystems, water efficiency, and long-term maintenance logic — landscapes built to thrive.",
                color: "text-shama-green"
              },
              {
                icon: "pen-ruler",
                title: "Design-Led Process",
                desc: "Every site is a narrative. We translate your objectives into spatial strategy, form, and material expression.",
                color: "text-shama-blue"
              },
              {
                icon: "people-group",
                title: "Client-Focused Delivery",
                desc: "Predictable timelines, transparent communication, and a workflow built around your priorities.",
                color: "text-shama-terra"
              },
              {
                icon: "award",
                title: "Proven Excellence",
                desc: "Trusted by hospitality brands, developers, and institutions across Kenya for work that performs and endures.",
                color: "text-shama-green"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="p-6 text-center transition-all duration-300 bg-white shadow-sm rounded-2xl hover:shadow-md hover:transform hover:-translate-y-2"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full ${feature.color.replace('text-', 'bg-')}/10`}>
                  <i className={`text-2xl fa-solid fa-${feature.icon} ${feature.color}`}></i>
                </div>
                <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                <p className="leading-relaxed text-gray-600">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <FeaturedProjects />

      {/* STATISTICS SECTION - New addition */}
      <section className="px-6 py-16 bg-white md:px-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { number: "50+", label: "Projects Completed" },
              { number: "15+", label: "Years Experience" },
              { number: "100%", label: "Client Satisfaction" },
              { number: "24/7", label: "Project Support" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-shama-green md:text-4xl">
                  {stat.number}
                </div>
                <div className="mt-2 text-sm font-medium text-gray-600 md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Enhanced with cards */}
      <section className="px-6 py-20 bg-shama-green/10 md:px-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-4 text-3xl font-bold text-center text-shama-green md:text-4xl">
            What Our Clients Say
          </h2>
          <p className="max-w-2xl mx-auto mb-12 text-center text-gray-600">
            Don't just take our word for it - hear from our satisfied clients
          </p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {[
              {
                quote: "“Shama elevated our outdoor spaces from functional to exceptional. Their design intelligence and professionalism set a new benchmark for our apartment environment.”",
                author: "Ben Lukoko",
                role: "Property Developer"
              },
              {
                quote: "“They listened, interpreted, and executed with precision. Our project landed on time, on budget, and far above the original brief.”",
                author: "Nairobi Street Kitchen",
                role: "Hospitality Group"
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="p-8 transition-all duration-300 bg-white shadow-sm rounded-2xl hover:shadow-md"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="text-yellow-400 fas fa-star"></i>
                  ))}
                </div>
                <blockquote className="mb-6 text-lg italic leading-relaxed text-gray-700">
                  {testimonial.quote}
                </blockquote>
                <div>
                  <div className="font-semibold text-shama-green">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENTS & PARTNERS - Enhanced with better scrolling */}
      <section className="px-6 py-20 bg-white md:px-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-4 text-3xl font-bold text-center md:text-4xl">
            Trusted by Leading Brands
          </h2>
          <p className="max-w-2xl mx-auto mb-12 text-center text-gray-600">
            We collaborate with Kenya's top hotels, developers, institutions, and contractors
          </p>

          <div className="relative">
            <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="flex gap-16 pr-16 animate-scroll-left">
                {[
                  "/assets/partners/Nairobi Street Kitchen.png",
                  "/assets/partners/The hub Karen.png",
                  "/assets/partners/Dale Suites Bungoma.png",
                  "/assets/partners/Muthokinju Hardware.png",
                  "/assets/partners/Lake Naivasha Resort.png",
                  "/assets/partners/Mwalimu Sacco.png",
                  "/assets/partners/Ole Pajeta.png",
                  "/assets/partners/Sax and Violins Lounge.jpeg",
                  "/assets/partners/Thai Chi.jpeg",
                  "/assets/partners/Crown Paints.png"
                ].map((src, index) => (
                  <div 
                    key={index}
                    className="flex-shrink-0 transition-all duration-300 opacity-70 hover:opacity-100 grayscale hover:grayscale-0"
                  >
                    <Image 
                      src={src} 
                      alt={`Partner ${index + 1}`}
                      width={120} 
                      height={60}
                      className="object-contain"
                    />
                  </div>
                ))}
                {/* Duplicate for seamless loop */}
                {[
                  "/assets/partners/Nairobi Street Kitchen.png",
                  "/assets/partners/The hub Karen.png",
                  "/assets/partners/Dale Suites Bungoma.png",
                  "/assets/partners/Muthokinju Hardware.png",
                  "/assets/partners/Lake Naivasha Resort.png",
                  "/assets/partners/Mwalimu Sacco.png",
                  "/assets/partners/Ole Pajeta.png",
                  "/assets/partners/Sax and Violins Lounge.jpeg",
                  "/assets/partners/Thai Chi.jpeg",
                  "/assets/partners/Crown Paints.png"
                ].map((src, index) => (
                  <div 
                    key={`dup-${index}`}
                    className="flex-shrink-0 transition-all duration-300 opacity-70 hover:opacity-100 grayscale hover:grayscale-0"
                  >
                    <Image 
                      src={src} 
                      alt={`Partner ${index + 1}`}
                      width={120} 
                      height={60}
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION - More compelling */}
      <section className="px-6 py-20 text-center text-white bg-shama-terra md:px-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">
            Ready to Transform Your Landscape?
          </h2>

          <p className="max-w-2xl mx-auto mb-10 text-lg md:text-xl">
            Your property deserves strategic design that builds value and stands the test of time. 
            Let's create something extraordinary together.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="px-10 py-4 font-semibold transition-all duration-300 transform bg-white rounded-full shadow-lg text-shama-terra hover:bg-shama-green hover:text-white hover:scale-105"
            >
              Start Your Project
            </Link>
            <Link
              href="/portfolio"
              className="px-10 py-4 font-semibold text-white transition-all duration-300 border-2 border-white rounded-full hover:bg-white hover:text-shama-terra"
            >
              View Portfolio
            </Link>
          </div>
          
          <p className="mt-6 text-sm opacity-90">
            Schedule a free consultation - No obligation, just expert advice
          </p>
        </div>
      </section>
            {/* Newsletter Modal */}
      <NewsletterModal /> {/* <-- added newsletter modal here */}
    </div>
  );
}
