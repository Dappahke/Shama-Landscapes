"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Icons (same as before)
const ArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
  </svg>
);

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

const X = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);

const MapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const Calendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);

const Maximize2 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h6v6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/>
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

// Lightbox Component
const Lightbox = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
      <button 
        onClick={onClose}
        className="absolute z-10 transition-colors top-6 right-6 text-white/70 hover:text-white"
      >
        <X />
      </button>
      
      <button 
        onClick={onPrev}
        className="absolute p-2 transition-colors left-4 md:left-8 text-white/70 hover:text-white"
      >
        <ArrowLeft />
      </button>
      
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4">
        <Image
          src={images[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
      </div>
      
      <button 
        onClick={onNext}
        className="absolute p-2 transition-colors right-4 md:right-8 text-white/70 hover:text-white"
      >
        <ArrowRight />
      </button>
      
      <div className="absolute text-sm transform -translate-x-1/2 bottom-6 left-1/2 text-white/60">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default function ProjectDetail() {
  const params = useParams();
  const [project, setProject] = useState(null);
  const [projectImages, setProjectImages] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch project data
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        
        // Fetch main project
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', params.id)
          .single();
        
        if (projectError) throw projectError;
        if (!projectData) {
          notFound();
          return;
        }
        
        setProject(projectData);
        
        // Fetch additional images from project_images table
        const { data: imagesData, error: imagesError } = await supabase
          .from('project_images')
          .select('*')
          .eq('project_id', params.id)
          .order('position');
        
        if (!imagesError && imagesData) {
          setProjectImages(imagesData.map(img => img.image_url));
        }
        
        // Fetch all projects for "Next Project" navigation
        const { data: allData, error: allError } = await supabase
          .from('projects')
          .select('id, title, cover_url, project_type, year, location');
        
        if (!allError && allData) {
          setAllProjects(allData);
        }
        
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProjectData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5EBE8] flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-32 h-8 mx-auto mb-4 bg-gray-200 rounded"></div>
          <div className="w-48 h-4 mx-auto bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#F5EBE8] flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-600">{error || 'Project not found'}</p>
          <Link href="/projects" className="text-[#0F7F40] hover:underline">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  // Combine cover + gallery + additional images
  const allImages = [
    project.cover_url,
    ...(project.image_gallery || []),
    ...projectImages
  ].filter(Boolean); // Remove any null/undefined

  // Get next project
  const currentIndex = allProjects.findIndex(p => p.id === params.id);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Parse description into sections
  const descriptionParts = (project.description || '').split('. ').filter(Boolean);
  const overview = descriptionParts.slice(0, 2).join('. ') + (descriptionParts.length > 0 ? '.' : '');
  const approach = descriptionParts.slice(2, 4).join('. ') + (descriptionParts.length > 2 ? '.' : '');
  const outcome = descriptionParts.slice(4).join('. ');

  return (
    <main className="min-h-screen bg-[#F5EBE8]">
      {/* HERO */}
      <section className="relative h-[70vh] min-h-[500px]">
        <Image
          src={project.cover_url}
          alt={project.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Back Button */}
        <Link 
          href="/projects"
          className="absolute z-20 inline-flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-full top-6 left-6 md:top-8 md:left-8 bg-white/10 backdrop-blur-sm hover:bg-white/20"
        >
          <ArrowLeft />
          <span className="hidden sm:inline">Back to Projects</span>
        </Link>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-4 ${
                project.status === 'Completed' ? 'bg-[#0F7F40] text-white' : 'bg-[#BD7563] text-white'
              }`}>
                {project.status}
              </span>
            </AnimatedSection>
            
            <AnimatedSection delay={100}>
              <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl lg:text-7xl">{project.title}</h1>
            </AnimatedSection>
            
            <AnimatedSection delay={200}>
              <p className="text-xl font-light md:text-2xl text-white/90">{project.tagline}</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* INFO STRIP */}
      <section className="bg-white border-b border-black/5">
        <div className="max-w-6xl px-6 mx-auto lg:px-12">
          <div className="grid grid-cols-2 gap-6 py-8 md:grid-cols-5">
            <AnimatedSection>
              <div>
                <p className="mb-1 text-xs font-medium tracking-wider uppercase text-black/40">Client</p>
                <p className="font-medium text-black">{project.client}</p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={100}>
              <div>
                <p className="mb-1 text-xs font-medium tracking-wider uppercase text-black/40">Location</p>
                <p className="flex items-center gap-1 font-medium text-black">
                  <MapPin />
                  {project.location}
                </p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={200}>
              <div>
                <p className="mb-1 text-xs font-medium tracking-wider uppercase text-black/40">Year</p>
                <p className="flex items-center gap-1 font-medium text-black">
                  <Calendar />
                  {project.year}
                </p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={300}>
              <div>
                <p className="mb-1 text-xs font-medium tracking-wider uppercase text-black/40">Area</p>
                <p className="font-medium text-black">{project.area}</p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={400}>
              <div>
                <p className="mb-1 text-xs font-medium tracking-wider uppercase text-black/40">Type</p>
                <p className="font-medium text-black">{project.project_type}</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* PROJECT STORY */}
      <section className="px-6 py-16 md:py-24 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <span className="text-sm font-medium tracking-[0.2em] text-[#0F7F40] uppercase mb-4 block">Project Story</span>
          </AnimatedSection>
          
          <div className="space-y-12">
            {overview && (
              <AnimatedSection delay={100}>
                <div className="border-l-4 border-[#0F7F40] pl-6">
                  <h2 className="mb-4 text-2xl font-bold text-black">Overview</h2>
                  <p className="text-lg font-light leading-relaxed text-black/70">{overview}</p>
                </div>
              </AnimatedSection>
            )}
            
            {approach && (
              <AnimatedSection delay={200}>
                <div className="border-l-4 border-[#BD7563] pl-6">
                  <h2 className="mb-4 text-2xl font-bold text-black">Design Approach</h2>
                  <p className="text-lg font-light leading-relaxed text-black/70">{approach}</p>
                </div>
              </AnimatedSection>
            )}
            
            {(outcome || project.description) && (
              <AnimatedSection delay={300}>
                <div className="border-l-4 border-[#3596D5] pl-6">
                  <h2 className="mb-4 text-2xl font-bold text-black">Outcome</h2>
                  <p className="text-lg font-light leading-relaxed text-black/70">{outcome || project.description}</p>
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>

        {/* IMAGE GALLERY */}
        {allImages.length > 0 && (
            <section className="px-6 py-16 bg-white md:py-24 lg:px-12">
            <div className="max-w-6xl mx-auto">
                <AnimatedSection>
                <span className="text-sm font-medium tracking-[0.2em] text-[#BD7563] uppercase mb-8 block">Gallery</span>
                </AnimatedSection>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Large featured image */}
                <AnimatedSection delay={100} className="md:col-span-2 lg:col-span-2 lg:row-span-2">
                    <button 
                    onClick={() => openLightbox(0)}
                    className="group relative w-full h-full min-h-[300px] md:min-h-[500px] rounded-2xl overflow-hidden"
                    >
                    <Image
                        src={allImages[0]}
                        alt="Project cover"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 66vw"
                    />
                    <div className="absolute inset-0 flex items-center justify-center transition-colors duration-300 bg-black/0 group-hover:bg-black/30">
                        <span className="flex items-center gap-2 text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                        <Maximize2 /> View Fullscreen
                        </span>
                    </div>
                    </button>
                </AnimatedSection>
                
                {/* Gallery images */}
                {allImages.slice(1).map((image, idx) => {
                    if (!image || typeof image !== 'string' || (!image.startsWith('http') && !image.startsWith('/'))) {
                        return null;
                    }
                    return (
                    <AnimatedSection key={idx} delay={150 + (idx * 50)}>
                    <button 
                        onClick={() => openLightbox(idx + 1)}
                        className="relative w-full overflow-hidden group aspect-square rounded-2xl"
                    >
                        <Image
                        src={image}
                        alt={`Project image ${idx + 2}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 flex items-center justify-center transition-colors duration-300 bg-black/0 group-hover:bg-black/30">
                        <span className="text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                            <Maximize2 />
                        </span>
                        </div>
                    </button>
                    </AnimatedSection>
                    );
                })} 
                </div>
            </div>
            </section>
        )}

      {/* NEXT PROJECT */}
      {nextProject && (
        <section className="px-6 py-16 md:py-24 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <span className="text-sm font-medium tracking-[0.2em] text-black/40 uppercase mb-8 block">Next Project</span>
            </AnimatedSection>
            
            <Link href={`/projects/${nextProject.id}`} className="block group">
              <AnimatedSection delay={100}>
                <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
                  <Image
                    src={nextProject.cover_url}
                    alt={nextProject.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="mb-2 text-sm text-white/60">{nextProject.project_type} · {nextProject.year}</p>
                        <h3 className="mb-2 text-3xl font-bold text-white md:text-4xl">{nextProject.title}</h3>
                        <p className="text-white/80">{nextProject.location}</p>
                      </div>
                      <div className="items-center hidden gap-2 font-medium text-white transition-transform md:flex group-hover:translate-x-2">
                        View Project <ArrowRight />
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </Link>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="py-24 lg:py-32 bg-[#0F7F40] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 rounded-full w-96 h-96 bg-white/20 blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-4xl px-6 mx-auto text-center lg:px-12">
          <AnimatedSection>
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">Have a project in mind?</h2>
          </AnimatedSection>
          
          <AnimatedSection delay={200}>
            <p className="mb-8 text-xl font-light text-white/90">
              Let&apos;s discuss how we can bring your landscape vision to life.
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={400}>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0F7F40] rounded-full font-bold hover:bg-[#F5EBE8] transition-colors duration-300"
            >
              Contact Us
              <ArrowRight />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <Lightbox 
          images={allImages}
          currentIndex={currentImageIndex}
          onClose={() => setLightboxOpen(false)}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </main>
  );
}