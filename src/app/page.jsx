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

      {/* STUDIO PHILOSOPHY - Architecture firm positioning */}
      <section className="px-6 py-24 bg-white md:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="relative">
              <div className="absolute inset-0 transform -translate-x-6 -translate-y-6 border-2 border-shama-clay/20"></div>
              <div className="relative overflow-hidden rounded-2xl aspect-4/3">
                <Image
                  src="/assets/studio-philosophy.jpg"
                  alt="Shama Studio Philosophy"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Architectural detail */}
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-shama-green/10 -z-10"></div>
            </div>
            
            <div className="space-y-6">
              <span className="text-sm font-semibold tracking-[0.3em] text-shama-green uppercase">
                Architecture-Led Design
              </span>
              <h2 className="text-4xl font-light leading-tight md:text-5xl">
                Where <span className="font-bold">Landscape</span> Meets 
                <span className="font-bold text-shama-terra"> Architecture</span>
              </h2>
              <p className="text-lg leading-relaxed text-gray-600">
                At Shama, we approach landscape as built form. Every project begins with rigorous 
                site analysis, spatial strategy, and material intelligence — delivering outdoor 
                environments that function as architecture and perform as ecosystems.
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div>
                  <div className="text-3xl font-bold text-shama-green">15+</div>
                  <div className="text-sm text-gray-500">Years of Practice</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-shama-green">50+</div>
                  <div className="text-sm text-gray-500">Completed Projects</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-shama-green">100%</div>
                  <div className="text-sm text-gray-500">Client Retention</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-shama-green">24/7</div>
                  <div className="text-sm text-gray-500">Project Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESIGN APPROACH - Architectural process */}
      <section className="px-6 py-24 bg-shama-clay/5 md:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mx-auto mb-16 text-center">
            <span className="text-sm font-semibold tracking-[0.3em] text-shama-green uppercase">
              Our Process
            </span>
            <h2 className="mt-4 text-4xl font-light md:text-5xl">
              Architectural <span className="font-bold">Methodology</span>
            </h2>
          </div>

          <div className="relative">
            {/* Connecting line - architectural detail */}
            <div className="absolute left-0 hidden w-full h-px top-24 bg-linear-to-r from-transparent via-shama-green/30 to-transparent lg:block"></div>
            
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
              {[
                {
                  phase: "01",
                  title: "Site Intelligence",
                  desc: "Topographic analysis, microclimate study, and ecological assessment inform every design decision.",
                  icon: "mountain"
                },
                {
                  phase: "02",
                  title: "Spatial Strategy",
                  desc: "We map circulation, views, and program to create fluid transitions between built and natural environments.",
                  icon: "draw-polygon"
                },
                {
                  phase: "03",
                  title: "Material Logic",
                  desc: "Stone, timber, water, and planting specified for performance, longevity, and contextual resonance.",
                  icon: "layer-group"
                },
                {
                  phase: "04",
                  title: "Technical Resolution",
                  desc: "Construction detailing, grading plans, and irrigation systems executed with precision.",
                  icon: "ruler-combined"
                }
              ].map((item, index) => (
                <div key={index} className="relative text-center lg:text-left group">
                  <div className="absolute transform -translate-x-1/2 -top-6 left-1/2 lg:left-8 lg:translate-x-0">
                    <span className="text-6xl font-black transition-colors text-shama-green/10 group-hover:text-shama-green/20">
                      {item.phase}
                    </span>
                  </div>
                  
                  <div className="relative pt-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-6 transition-colors rounded-full bg-shama-green/10 group-hover:bg-shama-green/20">
                      <i className={`text-2xl fas fa-${item.icon} text-shama-green`}></i>
                    </div>
                    <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                    <p className="leading-relaxed text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS - With architectural framing */}
      <section className="px-6 py-24 bg-white md:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-between mb-12 md:flex-row">
            <div>
              <span className="text-sm font-semibold tracking-[0.3em] text-shama-green uppercase">
                    Portfolio
              </span>
              <h2 className="mt-4 text-4xl font-light md:text-5xl">
                Selected <span className="font-bold">Works</span>
              </h2>
            </div>
            <Link 
              href="/portfolio" 
              className="flex items-center gap-2 px-6 py-3 mt-4 font-medium transition-all border-2 rounded-full group border-shama-green/30 hover:border-shama-green md:mt-0"
            >
              <span>View All Projects</span>
              <i className="transition-transform fas fa-arrow-right group-hover:translate-x-1"></i>
            </Link>
          </div>
          <FeaturedProjects />
        </div>
      </section>

      {/* EXPERTISE SECTORS - Architecture firm specialization */}
      <section className="px-6 py-24 bg-shama-clay/5 md:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mx-auto mb-16 text-center">
            <span className="text-sm font-semibold tracking-[0.3em] text-shama-green uppercase">
              Sectors
            </span>
            <h2 className="mt-4 text-4xl font-light md:text-5xl">
              Deep <span className="font-bold">Expertise</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "hotel",
                title: "Hospitality",
                desc: "Resorts, lodges, and hotels where landscape drives guest experience.",
                projects: "12+ Projects"
              },
              {
                icon: "building",
                title: "Residential",
                desc: "Private estates and multi-unit developments with architectural landscapes.",
                projects: "25+ Projects"
              },
              {
                icon: "tree",
                title: "Commercial",
                desc: "Corporate campuses, retail environments, and public plazas.",
                projects: "8+ Projects"
              },
              {
                icon: "landmark",
                title: "Institutional",
                desc: "Schools, healthcare facilities, and civic spaces designed for longevity.",
                projects: "5+ Projects"
              }
            ].map((sector, index) => (
              <div 
                key={index}
                className="p-8 transition-all duration-500 bg-white border border-transparent shadow-sm group rounded-2xl hover:border-shama-green/20 hover:shadow-xl"
              >
                <div className="mb-6">
                  <i className={`text-3xl fas fa-${sector.icon} text-shama-green`}></i>
                </div>
                <h3 className="mb-2 text-xl font-bold">{sector.title}</h3>
                <p className="mb-4 text-gray-600">{sector.desc}</p>
                <div className="text-sm font-medium text-shama-green">
                  {sector.projects}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Architectural credibility */}
      <section className="px-6 py-24 bg-white md:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mx-auto mb-16 text-center">
            <span className="text-sm font-semibold tracking-[0.3em] text-shama-green uppercase">
              Testimonials
            </span>
            <h2 className="mt-4 text-4xl font-light md:text-5xl">
              Trusted by <span className="font-bold">Industry Leaders</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                quote: "“Shama's design intelligence elevated our property above market expectations. They don't just plant — they architect space.”",
                author: "Ben Muli",
                role: "Director, Muli Properties",
                rating: 5
              },
              {
                quote: "“The team delivered technical precision with creative vision. Our Nairobi Street Kitchen project became a destination because of their work.”",
                author: "Wambui Kamau",
                role: "Operations Director, NSK Group",
                rating: 5
              },
              {
                quote: "“Their understanding of both ecology and construction sets them apart. A true architecture-led practice.”",
                author: "David Ngugi",
                role: "Principal, Ngugi Associates",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="relative p-8 transition-all duration-500 bg-shama-clay/5 rounded-2xl group hover:bg-white hover:shadow-xl"
              >
                {/* Quote mark */}
                <div className="absolute text-6xl transition-colors top-6 right-6 text-shama-green/10 group-hover:text-shama-green/20">
                  &ldquo;
                </div>
                
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <i key={i} className="text-yellow-400 fas fa-star"></i>
                  ))}
                </div>
                
                <blockquote className="mb-6 text-lg italic leading-relaxed text-gray-700">
                  {testimonial.quote}
                </blockquote>
                
                <div>
                  <div className="font-bold text-shama-green">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENTS & PARTNERS - Architectural collaborations */}
      <section className="px-6 py-20 bg-shama-clay/5 md:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mx-auto mb-12 text-center">
            <h2 className="text-2xl font-light md:text-3xl">
              <span className="font-bold">Collaborators</span> & Partners
            </h2>
          </div>

          <div className="relative">
            <div className="flex overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
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
                    className="transition-all duration-300 shrink-0 opacity-60 hover:opacity-100 grayscale hover:grayscale-0"
                  >
                    <Image 
                      src={src} 
                      alt={`Partner ${index + 1}`}
                      width={120} 
                      height={60}
                      className="object-contain w-auto h-12"
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
                    className="transition-all duration-300 shrink-0 opacity-60 hover:opacity-100 grayscale hover:grayscale-0"
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

      {/* CTA SECTION - Professional engagement */}
      <section className="relative px-6 py-32 overflow-hidden text-white bg-shama-terra md:px-20">
        {/* Architectural grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.1) 20px),
                              repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,0.1) 20px)`
          }}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block mb-6 text-sm font-semibold tracking-[0.3em] uppercase bg-white/20 px-6 py-2 rounded-full">
            Begin Your Project
          </span>
          
          <h2 className="mb-6 text-4xl font-light md:text-5xl">
            Ready to <span className="font-bold">Build</span> with Us?
          </h2>

          <p className="max-w-2xl mx-auto mb-12 text-lg opacity-90">
            From concept to completion, our team delivers landscapes of lasting value. 
            Schedule a consultation to discuss your vision.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="px-10 py-4 font-semibold transition-all duration-300 bg-white rounded-full shadow-xl group text-shama-terra hover:bg-shama-green hover:text-white hover:shadow-2xl"
            >
              <span className="flex items-center gap-2">
                Schedule Consultation
                <i className="transition-transform fas fa-calendar-check group-hover:translate-x-1"></i>
              </span>
            </Link>
            <Link
              href="/portfolio"
              className="px-10 py-4 font-semibold text-white transition-all duration-300 border-2 border-white rounded-full group hover:bg-white hover:text-shama-terra"
            >
              <span className="flex items-center gap-2">
                View Portfolio
                <i className="transition-transform fas fa-arrow-right group-hover:translate-x-1"></i>
              </span>
            </Link>
          </div>
          
          <p className="mt-8 text-sm opacity-75">
            Free initial consultation • No obligation • Expert advice
          </p>
        </div>
      </section>

      <NewsletterModal />
    </div>
  );
}