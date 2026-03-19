"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// Icons as simple SVG components for performance (no icon library dependency)
const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

const DropletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-6s-3.5-3.5-4-5C11 5.5 9 8 7 9s-3 4-3 6a7 7 0 0 0 7 7Z"/>
  </svg>
);

const RecycleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.88 1.82 1.82 0 0 1-.43-1.35l1.36-6.2"/>
    <path d="M11 19h8.5a1.5 1.5 0 0 0 1.5-1.5v-3.25"/>
    <path d="m16.5 7.5 3.25-3.25"/>
    <path d="M19 4.5 16.5 7.5"/>
    <path d="M16.5 7.5 19 10.5"/>
    <path d="M7 19v2"/>
    <path d="M11 19v2"/>
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2"/>
    <path d="M12 20v2"/>
    <path d="m4.93 4.93 1.41 1.41"/>
    <path d="m17.66 17.66 1.41 1.41"/>
    <path d="M2 12h2"/>
    <path d="M20 12h2"/>
    <path d="m6.34 17.66-1.41 1.41"/>
    <path d="m19.07 4.93-1.41 1.41"/>
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const CpuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="16" x="4" y="4" rx="2"/>
    <rect width="6" height="6" x="9" y="9" rx="1"/>
    <path d="M15 2v2"/>
    <path d="M15 20v2"/>
    <path d="M2 15h2"/>
    <path d="M2 9h2"/>
    <path d="M20 15h2"/>
    <path d="M20 9h2"/>
    <path d="M9 2v2"/>
    <path d="M9 20v2"/>
  </svg>
);

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/>
    <path d="m12 5 7 7-7 7"/>
  </svg>
);

const CheckCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <path d="m9 11 3 3L22 4"/>
  </svg>
);

// Animation hook for intersection observer
const useScrollAnimation = () => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return ref;
};

// Animated Section Wrapper
const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const ref = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`opacity-0 ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

export default function Approach() {
  return (
    <main className="min-h-screen bg-shama-clay">
      {/* 1. Hero Section - Uses hero-services.jpg as background */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/approach/commercial-projects.jpg"
            alt="Shama Landscape Architecture Services"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 max-w-6xl px-6 mx-auto text-center lg:px-12">
          <AnimatedSection>
            <span className="inline-block text-sm font-medium tracking-[0.3em] text-shama-clay uppercase mb-6">
              Our Methodology
            </span>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] mb-8">
              REGENERATIVE
              <br />
              <span className="text-shama-green">DESIGN</span>
            </h1>
          </AnimatedSection>
          
          <AnimatedSection delay={0.4}>
            <p className="max-w-2xl mx-auto mb-12 text-xl font-light leading-relaxed md:text-2xl text-white/90">
              Sustainable Impact. Timeless Landscapes.
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={0.6}>
            <div className="flex flex-wrap justify-center gap-8 text-sm font-medium tracking-wider text-white/80">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-shama-green" />
                ECOLOGICAL
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-shama-blue" />
                SOCIAL
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-shama-terra" />
                TECHNOLOGICAL
              </span>
            </div>
          </AnimatedSection>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-shama-clay to-transparent" />
      </section>

      {/* 2. Introduction - Uses ecological-design.jpg */}
      <section className="px-6 py-24 lg:py-32 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <AnimatedSection>
              <span className="text-sm font-medium tracking-[0.2em] text-shama-green uppercase mb-4 block">
                Introduction
              </span>
              <h2 className="mb-8 text-4xl font-bold leading-tight text-black md:text-5xl">
                Where Design Meets Ecology
              </h2>
              <p className="mb-6 text-lg font-light leading-relaxed text-black/70">
                At Shama Landscape Architects, our approach is grounded in the evolving discipline of Landscape Architecture, where design is no longer just aesthetic—but ecological, social, and technological.
              </p>
              <p className="text-lg font-light leading-relaxed text-black/70">
                We operate at the intersection of environmental stewardship, design innovation, and human-centered planning.
              </p>
            </AnimatedSection>
            
            <AnimatedSection delay={0.3}>
              <div className="relative">
                <div className="overflow-hidden aspect-4/3 rounded-2xl">
                  <Image
                    src="/assets/approach/ecological-design.jpg"
                    alt="Ecological landscape design integrating native vegetation"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute w-48 h-48 rounded-full -bottom-6 -right-6 bg-shama-terra/20 blur-3xl" />
              </div>
            </AnimatedSection>
          </div>
          
          <AnimatedSection delay={0.4} className="mt-20">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { title: "Support biodiversity", desc: "Creating habitats that thrive" },
                { title: "Manage resources efficiently", desc: "Smart water and energy systems" },
                { title: "Enhance human wellbeing", desc: "Spaces that heal and inspire" },
              ].map((item, idx) => (
                <div key={idx} className="pl-6 border-l-2 border-shama-green">
                  <h3 className="mb-2 text-xl font-bold text-black">{item.title}</h3>
                  <p className="font-light text-black/60">{item.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 3. Design Philosophy - Uses horticultural-design.jpg */}
      <section className="relative py-24 overflow-hidden text-white lg:py-32 bg-shama-green">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/assets/approach/horticultural-design.jpg"
            alt="Native planting systems and horticultural design"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-shama-green/90" />
        
        <div className="relative z-10 max-w-6xl px-6 mx-auto lg:px-12">
          <AnimatedSection className="mb-16 text-center">
            <span className="text-sm font-medium tracking-[0.2em] text-shama-clay/70 uppercase mb-4 block">
              Design Philosophy
            </span>
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">
              From Sustainability to Regeneration
            </h2>
            <p className="max-w-3xl mx-auto text-xl font-light text-shama-clay/90">
              Traditional sustainable design aims to reduce harm. At Shama, we go further—embracing Regenerative Design that restores ecosystems and creates net-positive impact.
            </p>
          </AnimatedSection>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                num: "01",
                title: "Systems Thinking",
                desc: "Every site is part of a larger ecological and urban system. We analyze connections, flows, and interdependencies."
              },
              {
                num: "02",
                title: "Place-Based Design",
                desc: "Solutions tailored to local climate, culture, and ecology. What works in Nairobi differs from what works in Nakuru."
              },
              {
                num: "03",
                title: "Long-Term Performance",
                desc: "We design for durability, adaptability, and lifecycle sustainability—landscapes that improve with time."
              }
            ].map((principle, idx) => (
              <AnimatedSection key={idx} delay={0.2 * (idx + 1)}>
                <div className="h-full p-8 transition-colors duration-300 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/10 hover:bg-white/15">
                  <span className="block mb-4 text-5xl font-black text-shama-clay/20">{principle.num}</span>
                  <h3 className="mb-4 text-2xl font-bold">{principle.title}</h3>
                  <p className="font-light leading-relaxed text-shama-clay/80">{principle.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Green Building Integration - Uses environmental-planning.jpg */}
      <section className="px-6 py-24 lg:py-32 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="mb-16">
            <span className="text-sm font-medium tracking-[0.2em] text-shama-blue uppercase mb-4 block">
              Standards & Certification
            </span>
            <h2 className="mb-6 text-4xl font-bold text-black md:text-5xl">
              Integration with Green Building
            </h2>
            <p className="max-w-3xl text-xl font-light text-black/70">
              Our approach aligns with globally recognized green building frameworks, ensuring measurable sustainability outcomes.
            </p>
          </AnimatedSection>
          
          <div className="grid items-center gap-12 mb-16 lg:grid-cols-2">
            <AnimatedSection delay={0.2}>
              <div className="overflow-hidden aspect-4/3 rounded-2xl">
                <Image
                  src="/assets/approach/environmental-planning.jpg"
                  alt="Environmental planning and green building integration"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.3}>
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { 
                    title: "LEED", 
                    org: "U.S. Green Building Council",
                    points: ["Sustainable site development", "Water efficiency", "Material selection"],
                    color: "#0F7F40"
                  },
                  { 
                    title: "SITES", 
                    org: "Sustainable SITES Initiative",
                    points: ["Soil restoration", "Ecosystem services", "Landscape performance"],
                    color: "#BD7563"
                  },
                  { 
                    title: "World GBC", 
                    org: "World Green Building Council",
                    points: ["Climate-positive design", "Net-zero carbon", "Resilient infrastructure"],
                    color: "#3596D5"
                  },
                  { 
                    title: "Local Focus", 
                    org: "Kenya & East Africa",
                    points: ["Climate-responsive design", "Water conservation", "Urban resilience"],
                    color: "#0F7F40"
                  }
                ].map((standard, idx) => (
                  <div key={idx} className="p-5 transition-shadow duration-300 bg-white border shadow-sm rounded-xl border-black/5 hover:shadow-md">
                    <div className="w-10 h-1 mb-3 rounded-full" style={{ backgroundColor: standard.color }} />
                    <h3 className="mb-1 text-lg font-bold text-black">{standard.title}</h3>
                    <p className="mb-3 text-xs text-black/50">{standard.org}</p>
                    <ul className="space-y-1">
                      {standard.points.map((point, pidx) => (
                        <li key={pidx} className="flex items-start gap-2 text-xs text-black/70">
                          <span className="text-shama-green mt-0.5"><CheckCircle /></span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 5. Six Core Pillars - Uses various images */}
      <section className="py-24 text-white bg-black lg:py-32">
        <div className="max-w-6xl px-6 mx-auto lg:px-12">
          <AnimatedSection className="mb-16 text-center">
            <span className="text-sm font-medium tracking-[0.2em] text-shama-clay/50 uppercase mb-4 block">
              Core Pillars
            </span>
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">
              The Foundation of Our Practice
            </h2>
          </AnimatedSection>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <LeafIcon />,
                title: "Ecological Regeneration",
                desc: "Restore native vegetation, rebuild soil health, enhance biodiversity.",
                outcome: "Self-sustaining ecosystems",
                color: "#0F7F40",
                image: "/assets/approach/ecological-design.jpg"
              },
              {
                icon: <DropletIcon />,
                title: "Water Intelligence",
                desc: "Rainwater harvesting, greywater reuse, permeable landscapes.",
                outcome: "Reduced water demand + improved resilience",
                color: "#3596D5",
                image: "/assets/approach/water-management.jpg"
              },
              {
                icon: <RecycleIcon />,
                title: "Circular Material Use",
                desc: "Recycled materials, local sourcing, low-carbon construction.",
                outcome: "Reduced environmental footprint",
                color: "#BD7563",
                image: "/assets/approach/material-innovation.jpg"
              },
              {
                icon: <SunIcon />,
                title: "Climate Resilience",
                desc: "Urban heat reduction, flood mitigation, drought-tolerant planting.",
                outcome: "Future-proof landscapes",
                color: "#F5EBE8",
                image: "/assets/approach/climate-adaptation.jpg"
              },
              {
                icon: <UsersIcon />,
                title: "Social & Community Impact",
                desc: "Inclusive public spaces, cultural integration, community engagement.",
                outcome: "Stronger social ecosystems",
                color: "#BD7563",
                image: "/assets/approach/community-engagement.jpg"
              },
              {
                icon: <CpuIcon />,
                title: "Smart Technology",
                desc: "Smart irrigation, environmental sensors, data-driven design.",
                outcome: "Optimized performance + efficiency",
                color: "#3596D5",
                image: "/assets/approach/technology-integration.jpeg"
              }
            ].map((pillar, idx) => (
              <AnimatedSection key={idx} delay={0.1 * idx}>
                <div className="flex flex-col h-full overflow-hidden transition-all duration-300 border group bg-white/5 backdrop-blur-sm rounded-2xl border-white/10 hover:bg-white/10">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={pillar.image}
                      alt={pillar.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4" style={{ color: pillar.color }}>
                      {pillar.icon}
                    </div>
                  </div>
                  <div className="flex flex-col p-6 grow">
                    <h3 className="mb-3 text-xl font-bold">{pillar.title}</h3>
                    <p className="mb-4 font-light text-shama-clay/70 grow">{pillar.desc}</p>
                    <div className="pt-4 border-t border-white/10">
                      <span className="text-xs font-medium tracking-wider uppercase text-shama-clay/50">Outcome</span>
                      <p className="text-sm font-medium" style={{ color: pillar.color }}>{pillar.outcome}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Services - Uses landscape-architecture.jpg and urban-design.jpg */}
      <section className="px-6 py-24 lg:py-32 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="mb-16">
            <span className="text-sm font-medium tracking-[0.2em] text-shama-terra uppercase mb-4 block">
              Integrated Delivery
            </span>
            <h2 className="mb-6 text-4xl font-bold text-black md:text-5xl">
              Our Services
            </h2>
            <p className="text-xl font-light text-black/70">
              We deliver a holistic suite of services, aligned with both architecture and environmental systems.
            </p>
          </AnimatedSection>
          
          <div className="grid gap-12 mb-16 lg:grid-cols-2">
            <AnimatedSection delay={0.2}>
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { title: "Landscape Architecture", items: ["Site planning", "Conceptual design", "Spatial organization"] },
                  { title: "Environmental Planning", items: ["Environmental impact strategies", "Ecological restoration", "Land-use planning"] },
                  { title: "Planting & Horticulture", items: ["Native planting systems", "Biodiversity enhancement", "Seasonal dynamics"] },
                  { title: "Urban Design", items: ["Public spaces", "Streetscapes", "Placemaking"] },
                  { title: "Water Systems", items: ["Irrigation design", "Stormwater management", "Water-sensitive urban design"] },
                  { title: "Project Implementation", items: ["Construction oversight", "Quality assurance", "Project coordination"] }
                ].map((service, idx) => (
                  <div key={idx} className="p-6 transition-all duration-300 bg-white border shadow-sm rounded-xl border-black/5 hover:shadow-lg hover:-translate-y-1">
                    <h3 className="mb-3 text-lg font-bold text-black">{service.title}</h3>
                    <ul className="space-y-2">
                      {service.items.map((item, iidx) => (
                        <li key={iidx} className="flex items-center gap-2 text-sm font-light text-black/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-shama-green" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.3} className="space-y-6">
              <div className="overflow-hidden aspect-4/3 rounded-2xl">
                <Image
                  src="/assets/approach/landscape-architecture.jpg"
                  alt="Landscape architecture services"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="overflow-hidden aspect-4/3 rounded-2xl">
                <Image
                  src="/assets/approach/urban-design.jpg"
                  alt="Urban design and placemaking"
                  fill
                  className="object-cover"
                  sizes="(max-width: 720px) 100vw, 50vw"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 7. Process - Uses project-implementation.jpeg */}
      <section className="relative py-24 overflow-hidden lg:py-32 bg-shama-clay">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 rounded-full left-1/4 w-96 h-96 bg-shama-green/10 blur-3xl" />
          <div className="absolute bottom-0 rounded-full right-1/4 w-96 h-96 bg-shama-terra/10 blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-6xl px-6 mx-auto lg:px-12">
          <AnimatedSection className="mb-16 text-center">
            <span className="text-sm font-medium tracking-[0.2em] text-shama-green uppercase mb-4 block">
              Our Process
            </span>
            <h2 className="mb-6 text-4xl font-bold text-black md:text-5xl">
              Structured Yet Flexible
            </h2>
            <p className="max-w-2xl mx-auto text-xl font-light text-black/70">
              Our methodology ensures clarity and collaboration at every stage.
            </p>
          </AnimatedSection>
          
          <div className="grid items-center gap-12 mb-16 md:grid-cols-2">
            <AnimatedSection delay={0.2}>
              <div className="overflow-hidden aspect-4/3 rounded-2xl">
                <Image
                  src="/assets/approach/project-implementation.jpeg"
                  alt="Project implementation and construction oversight"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.3}>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { num: "01", title: "Understand", items: ["Site analysis", "Environmental assessment", "Client engagement"], color: "#0F7F40" },
                  { num: "02", title: "Design", items: ["Concept creation", "Visualization", "Iteration"], color: "#BD7563" },
                  { num: "03", title: "Develop", items: ["Technical detailing", "Material specification", "Performance optimization"], color: "#3596D5" },
                  { num: "04", title: "Deliver", items: ["Construction supervision", "Quality control", "Implementation"], color: "#0F7F40" }
                ].map((step, idx) => (
                  <div key={idx} className="relative p-6 bg-white border shadow-sm rounded-xl border-black/5">
                    <span className="absolute text-4xl font-black text-black/5 top-2 right-2">{step.num}</span>
                    <div className="w-8 h-1 mb-4 rounded-full" style={{ backgroundColor: step.color }} />
                    <h3 className="mb-3 text-xl font-bold text-black">{step.title}</h3>
                    <ul className="space-y-1">
                      {step.items.map((item, iidx) => (
                        <li key={iidx} className="text-sm font-light text-black/60">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 8. Innovation - Uses pexels image (placeholder for future/emerging) */}
      <section className="relative px-6 py-24 overflow-hidden lg:py-32 lg:px-12 bg-shama-green">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/assets/approach/pexels-soc-nang-d-ng-2150345854-34319671.jpg"
            alt="Innovation and future landscape design"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-shama-green/85" />
        
        <div className="relative z-10 max-w-6xl px-6 mx-auto lg:px-12">
          <AnimatedSection className="mb-16">
            <span className="text-sm font-medium tracking-[0.2em] text-shama-clay/70 uppercase mb-4 block">
              Future Thinking
            </span>
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Innovation & Emerging Practices
            </h2>
            <p className="max-w-3xl text-xl font-light text-shama-clay/90">
              We incorporate emerging practices shaping the future of landscape design.
            </p>
          </AnimatedSection>
          
          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                title: "Nature-Based Solutions",
                desc: "Using natural systems to solve infrastructure challenges—wetlands for water purification, urban forests for cooling."
              },
              {
                title: "Ecosystem Services Design",
                desc: "Designing landscapes that filter air, manage water, and support wildlife while serving human needs."
              },
              {
                title: "Digital Simulation",
                desc: "Modeling water flow, microclimates, and environmental performance before breaking ground."
              },
              {
                title: "Productive Landscapes",
                desc: "Integrating urban agriculture and food systems into beautiful, functional spaces."
              }
            ].map((innovation, idx) => (
              <AnimatedSection key={idx} delay={0.1 * idx}>
                <div className="p-8 transition-colors duration-300 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/10 hover:bg-white/15">
                  <h3 className="mb-4 text-2xl font-bold text-white">{innovation.title}</h3>
                  <p className="font-light leading-relaxed text-shama-clay/80">{innovation.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Impact */}
      <section className="px-6 py-24 lg:py-32 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="mb-16 text-center">
            <span className="text-sm font-medium tracking-[0.2em] text-shama-terra uppercase mb-4 block">
              Value & Impact
            </span>
            <h2 className="mb-6 text-4xl font-bold text-black md:text-5xl">
              Measuring Success
            </h2>
          </AnimatedSection>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Environmental Impact",
                metrics: ["Reduced carbon footprint", "Improved biodiversity", "Efficient resource use"],
                color: "#0F7F40"
              },
              {
                title: "Social Impact",
                metrics: ["Healthier communities", "Inclusive environments", "Cultural relevance"],
                color: "#BD7563"
              },
              {
                title: "Economic Impact",
                metrics: ["Lower lifecycle costs", "Increased property value", "Long-term sustainability"],
                color: "#3596D5"
              }
            ].map((impact, idx) => (
              <AnimatedSection key={idx} delay={0.15 * idx}>
                <div className="h-full p-8 bg-white border shadow-sm rounded-2xl border-black/5">
                  <div className="w-16 h-1 mb-6 rounded-full" style={{ backgroundColor: impact.color }} />
                  <h3 className="mb-6 text-2xl font-bold text-black">{impact.title}</h3>
                  <ul className="space-y-4">
                    {impact.metrics.map((metric, midx) => (
                      <li key={midx} className="flex items-center gap-3 text-black/70">
                        <span style={{ color: impact.color }}><CheckCircle /></span>
                        {metric}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Clients - Uses community-engagement.jpg as background accent */}
      <section className="relative py-24 overflow-hidden lg:py-32 bg-shama-clay border-y border-black/5">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/assets/approach/community-engagement.jpg"
            alt="Community collaboration"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        
        <div className="relative z-10 max-w-6xl px-6 mx-auto lg:px-12">
          <AnimatedSection className="mb-12 text-center">
            <span className="text-sm font-medium tracking-[0.2em] text-shama-blue uppercase mb-4 block">
              Collaboration
            </span>
            <h2 className="mb-6 text-4xl font-bold text-black md:text-5xl">
              Who We Work With
            </h2>
            <p className="max-w-2xl mx-auto text-xl font-light text-black/70">
              We partner across sectors to deliver integrated solutions.
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2}>
            <div className="flex flex-wrap justify-center gap-4">
              {["Developers", "Governments", "Institutions", "Private Clients", "NGOs", "Communities"].map((client, idx) => (
                <span 
                  key={idx} 
                  className="px-8 py-4 font-medium transition-shadow duration-300 border rounded-full shadow-sm bg-white/90 backdrop-blur-sm text-black/70 border-black/5 hover:shadow-md"
                >
                  {client}
                </span>
              ))}
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={0.4} className="mt-16 text-center">
            <div className="max-w-3xl p-8 mx-auto border bg-shama-green/10 backdrop-blur-sm rounded-2xl border-shama-green/20">
              <p className="text-lg italic font-light text-black/70">
                "Our advantage is a flexible yet consistent approach adaptable to scale, context, and ambition."
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 11. CTA - Uses water-management.jpg as dramatic background */}
      <section className="relative py-24 overflow-hidden lg:py-32">
        <div className="absolute inset-0">
          <Image
            src="/assets/approach/water-management.jpg"
            alt="Water management and sustainable landscapes"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-shama-terra/85" />
        </div>
        
        <div className="relative z-10 max-w-4xl px-6 mx-auto text-center lg:px-12">
          <AnimatedSection>
            <h2 className="mb-6 text-4xl font-bold text-white md:text-6xl">
              Let&apos;s Design the Future Together
            </h2>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2}>
            <p className="max-w-2xl mx-auto mb-12 text-xl font-light text-white/90">
              We partner with forward-thinking clients to create sustainable environments, high-performance landscapes, and meaningful places.
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={0.4}>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold transition-colors duration-300 bg-white rounded-full text-shama-terra hover:bg-shama-clay"
              >
                Start Your Project
                <ArrowRight />
              </Link>
              <Link 
                href="/projects"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-white transition-colors duration-300 bg-transparent border-2 border-white rounded-full hover:bg-white/10"
              >
                View Our Work
              </Link>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={0.6} className="pt-8 mt-16 border-t border-white/20">
            <p className="text-lg italic font-light text-white/80">
              &ldquo;Our approach integrates design, sustainability, and innovation to create landscapes that are not only beautiful—but regenerative, resilient, and enduring.&rdquo;
            </p>
            <p className="mt-4 text-sm font-medium tracking-wider uppercase text-white/60">
              — Shama Landscape Architects
            </p>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}