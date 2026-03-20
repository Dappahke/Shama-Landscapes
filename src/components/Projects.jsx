"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Filter options
const projectTypes = ["All", "Residential", "Commercial", "Hospitality", "Urban", "Public Space Design", "Landscape Architecture"];
const statusOptions = ["All", "Completed", "In Progress"];

// Icons (same as before)
const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

// Animation hook
const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};

const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const [ref, isVisible] = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project, index }) => {
  const isLarge = index % 5 === 0 || index % 5 === 3;
  
  return (
    <Link 
      href={`/projects/${project.id}`}
      className={`group relative block overflow-hidden rounded-2xl ${isLarge ? 'md:col-span-2 md:row-span-2' : ''}`}
    >
      <div className={`relative w-full ${isLarge ? 'aspect-square md:aspect-auto md:h-full min-h-100 md:min-h-150' : 'aspect-4/5'} overflow-hidden bg-shama-clay`}>
        <Image
          src={project.cover_url}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes={isLarge ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
        />
        
        <div className="absolute inset-0 transition-opacity duration-300 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-60 group-hover:opacity-80" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-300 opacity-0 bg-black/60 group-hover:opacity-100 md:p-8">
          <div className="transition-transform duration-300 transform translate-y-4 group-hover:translate-y-0">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-3 ${
              project.status === 'Completed' ? 'bg-shama-green text-white' : 'bg-shama-terra text-white'
            }`}>
              {project.status}
            </span>
            
            <h3 className="mb-2 text-2xl font-bold text-white md:text-3xl">{project.title}</h3>
            <p className="mb-1 font-light text-white/80">{project.location}</p>
            <p className="mb-4 text-sm text-white/60">{project.project_type} · {project.year}</p>
            
            <span className="inline-flex items-center gap-2 font-medium text-white group/link">
              View Project 
              <span className="transition-transform transform group-hover/link:translate-x-1"><ArrowRight /></span>
            </span>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 transition-opacity duration-300 md:p-8 group-hover:opacity-0">
          <h3 className="mb-1 text-xl font-bold text-white md:text-2xl drop-shadow-lg">{project.title}</h3>
          <p className="text-sm font-light text-white/80 drop-shadow-md">{project.location}</p>
        </div>
      </div>
    </Link>
  );
};

const FilterButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
      active 
        ? 'bg-shama-green text-white' 
        : 'bg-white text-black/70 hover:bg-black/5 border border-black/10'
    }`}
  >
    {children}
  </button>
);

// Loading Skeleton
const ProjectSkeleton = () => (
  <div className="animate-pulse">
    <div className="w-full bg-gray-200 rounded-2xl aspect-4/5"></div>
  </div>
);

export default function Projects() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || "All");
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || "All");
  const [isSticky, setIsSticky] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        let query = supabase.from('projects').select('*');
        
        // Apply filters in query if not "All"
        if (selectedType !== "All") {
          query = query.ilike('project_type', `%${selectedType}%`);
        }
        if (selectedStatus !== "All") {
          query = query.eq('status', selectedStatus);
        }
        
        // Order by created_at descending
        query = query.order('created_at', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setProjects(data || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [selectedType, selectedStatus]); // Re-fetch when filters change

  // Update URL when filters change (for sharing)
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedType !== "All") params.set('type', selectedType);
    if (selectedStatus !== "All") params.set('status', selectedStatus);
    
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.replace(`/projects${newUrl}`, { scroll: false });
  }, [selectedType, selectedStatus, router]);

  // Sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      const filterBar = document.getElementById('filter-bar');
      if (filterBar) {
        const rect = filterBar.getBoundingClientRect();
        setIsSticky(rect.top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get featured projects for hero (first 3)
  const featuredProjects = projects.slice(0, 3);
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    if (featuredProjects.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % featuredProjects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredProjects.length]);

  // Filter projects locally (backup if query filtering fails)
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const typeMatch = selectedType === "All" || project.project_type?.includes(selectedType);
      const statusMatch = selectedStatus === "All" || project.status === selectedStatus;
      return typeMatch && statusMatch;
    });
  }, [projects, selectedType, selectedStatus]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-shama-clay">
        <div className="text-center">
          <p className="mb-4 text-red-600">Error loading projects: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 text-white rounded-full bg-shama-green"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-shama-clay">
      {/* HERO SECTION */}
      <section className="relative h-[85vh] min-h-150 flex items-center justify-center overflow-hidden">
        {!loading && featuredProjects.length > 0 ? (
          <>
            {featuredProjects.map((project, idx) => (
              <div
                key={project.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentHero ? 'opacity-100' : 'opacity-0'}`}
              >
                <Image
                  src={project.cover_url}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority={idx === 0}
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/20" />
              </div>
            ))}
          </>
        ) : (
          <div className="absolute inset-0 bg-shama-green" /> // Fallback color while loading
        )}

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl px-6 mx-auto text-center lg:px-12">
          <AnimatedSection>
            <span className="inline-block text-sm font-medium tracking-[0.3em] text-shama-clay uppercase mb-6">
              Portfolio
            </span>
          </AnimatedSection>
          
          <AnimatedSection delay={200}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] mb-8">
              OUR WORK
            </h1>
          </AnimatedSection>
          
          <AnimatedSection delay={400}>
            <p className="max-w-2xl mx-auto mb-12 text-xl font-light leading-relaxed md:text-2xl text-white/90">
              Designing Landscapes That Last Generations
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={600}>
            <a 
              href="#projects-grid"
              className="inline-flex items-center gap-2 px-8 py-4 font-bold text-black transition-colors duration-300 bg-white rounded-full hover:bg-shama-clay"
            >
              Explore Projects
              <ChevronDown />
            </a>
          </AnimatedSection>
        </div>

        {/* Hero Indicators */}
        {!loading && featuredProjects.length > 0 && (
          <div className="absolute z-10 flex gap-2 transform -translate-x-1/2 bottom-8 left-1/2">
            {featuredProjects.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentHero(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentHero ? 'bg-white w-8' : 'bg-white/50'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-shama-clay to-transparent" />
      </section>

      {/* FILTER BAR - Sticky */}
      <div 
        id="filter-bar"
        className={`sticky top-0 z-40 transition-all duration-300 ${isSticky ? 'bg-shama-clay/95 backdrop-blur-md shadow-sm py-4' : 'bg-shama-clay py-8'}`}
      >
        <div className="px-6 mx-auto max-w-7xl lg:px-12">
          {/* Mobile Filter Toggle */}
          <div className="mb-4 md:hidden">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="flex items-center justify-between w-full px-4 py-3 bg-white border rounded-xl border-black/10"
            >
              <span className="font-medium">Filters</span>
              <span className={`transform transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`}>
                <ChevronDown />
              </span>
            </button>
          </div>

          {/* Filter Content */}
          <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} space-y-4 md:space-y-0 md:flex md:items-center md:justify-between`}>
            {/* Project Type Filters */}
            <div className="flex flex-wrap gap-2">
              <span className="hidden mr-2 text-sm font-medium text-black/50 md:inline">Type:</span>
              {projectTypes.map((type) => (
                <FilterButton
                  key={type}
                  active={selectedType === type}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </FilterButton>
              ))}
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              <span className="hidden mr-2 text-sm font-medium text-black/50 md:inline">Status:</span>
              {statusOptions.map((status) => (
                <FilterButton
                  key={status}
                  active={selectedStatus === status}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </FilterButton>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-black/60">
            {loading ? 'Loading projects...' : `Showing ${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''}`}
          </div>
        </div>
      </div>

      {/* PROJECTS GRID - Asymmetrical */}
      <section id="projects-grid" className="px-6 py-12 md:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            // Loading skeletons
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
              {[...Array(6)].map((_, idx) => (
                <ProjectSkeleton key={idx} />
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6 auto-rows-auto">
              {filteredProjects.map((project, index) => (
                <AnimatedSection key={project.id} delay={index * 100}>
                  <ProjectCard project={project} index={index} />
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-xl font-light text-black/60">No projects match your filters.</p>
              <button
                onClick={() => { setSelectedType("All"); setSelectedStatus("All"); }}
                className="mt-4 font-medium text-shama-green hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* END CTA */}
      <section className="relative py-24 overflow-hidden text-white lg:py-32 bg-shama-green">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 rounded-full w-96 h-96 bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 rounded-full w-96 h-96 bg-shama-terra/30 blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-4xl px-6 mx-auto text-center lg:px-12">
          <AnimatedSection>
            <h2 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
              Start Your Project With Us
            </h2>
          </AnimatedSection>
          
          <AnimatedSection delay={200}>
            <p className="max-w-2xl mx-auto mb-12 text-xl font-light text-white/90">
              Ready to transform your landscape? Let&apos;s discuss how we can bring your vision to life.
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={400}>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 font-bold transition-colors duration-300 bg-white rounded-full text-shama-green hover:bg-shama-clay"
            >
              Request Consultation
              <ArrowRight />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}