"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Building, Users, Ruler, Download } from "lucide-react";

/**
 * Improved Projects component with enhanced architectural styling
 * - Geometric patterns and clean lines
 * - Improved typography hierarchy
 * - Enhanced visual structure
 * - PDF download functionality
 */

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16 } },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
};

export default function Projects() {
  const projects = [
    {
      id: "hub-karen",
      title: "The Hub Karen",
      cover: "/assets/projects/hub-karen.jpg",
      tagline: "Landscape Architecture · 2024",
      description: "A landscape design integrating retail and nature for a balanced urban experience.",
      images: [
        "/assets/projects/hub-karen-1.jpg",
        "/assets/projects/hub-karen-2.png",
        "/assets/projects/hub-karen-3.png",
        "/assets/projects/hub-karen-4.png",
        "/assets/projects/hub-karen-5.jpg",
        "/assets/projects/hub-karen-6.jpg",
        "/assets/projects/hub-karen-7.jpg",
        "/assets/projects/hub-karen-8.jpg",
        "/assets/projects/hub-karen-9.jpg",
      ],
      details: {
        location: "Karen, Nairobi",
        year: "2024",
        type: "Landscape Architecture",
        client: "Private Developer",
        area: "4,200 m²",
      },
    },
    {
      id: "NSK",
      title: "Nairobi Street Kitchen",
      cover: "/assets/projects/NSK.jpeg",
      tagline: "Contemporary Hospitality Design · 2024",
      description: "Nairobi Kitchen Street Hotel is in Westlands. The site is approximately 4 km from Nairobi's Central Business District. It is a 4-star standard hotel with personal service and the authentic flavour of the new Africa.",
      images: [
        "/assets/projects/nsk-1.jpg",
        "/assets/projects/nsk-2.jpg",
        "/assets/projects/nsk-3.jpg",
        "/assets/projects/nsk-4.jpg",
        "/assets/projects/nsk-5.jpg",
        "/assets/projects/nsk-6.jpg",
        "/assets/projects/nsk-7.jpg",
        "/assets/projects/nsk-8.jpg",
        "/assets/projects/nsk-9.jpg",
        "/assets/projects/nsk-10.jpg",
        "/assets/projects/nsk-11.jpg",
        "/assets/projects/nsk-12.jpg",
      ],
      details: {
        location: "Westlands, Nairobi",
        year: "2024",
        type: "Hospitality Architecture",
        client: "Private Developer",
        area: "3,800 m²",
      },
    },
    {
      id: "sax and violins",
      title: "Sax and Violins Lounge",
      cover: "/assets/projects/SVL.jpg",
      tagline: "Hospitality · 2019",
      description: "A green public library that merges education, culture, and sustainability through innovative architectural solutions.",
      images: [
        "/assets/projects/SVL-1.jpg",
        "/assets/projects/SVL-4.jpg",
        "/assets/projects/SVL-3.jpg",
        "/assets/projects/SVL-5.jpg",
      ],
      details: {
        location: "Karen, Kenya",
        year: "2019",
        type: "Public Space Design",
        client: "County Council",
        area: "1,800 m²",
      },
    },
    {
      id: "Charlton Andati Residence",
      title: "Charlton Andati Residence Landscaping",
      cover: "/assets/projects/CAR-1.jpg",
      tagline: "Residential · 2024",
      description: "A tropical courtyard concept promoting comfort and serenity for guests through architectural landscape integration.",
      images: [
        "/assets/projects/CAR-2.jpg",
        "/assets/projects/CAR-3.jpg",
        "/assets/projects/CAR-4.jpg",
        "/assets/projects/CAR-5.jpg",
        "/assets/projects/CAR-6.jpg",
        "/assets/projects/CAR-7.jpg",
        "/assets/projects/CAR-8.jpg",
        "/assets/projects/CAR-9.jpg",
      ],
      details: {
        location: "Bukura, Kenya",
        year: "2020",
        type: "Residential Design",
        client: "Charlton Andati",
        area: "2,400 m²",
      },
    },
    {
      id: "Owiti’s Residence",
      title: "Mr . & Mr s . Owiti’s Residence",
      cover: "/assets/projects/Oyugis.jpg",
      tagline: "Residential · 2025",
      description: "Amidst the rolling hills of Kasipul-Kabondo sub-County,Shama Landscape Architects brought a vision of stunning beauty to life. This beautiful landscape captures the essence of a tropical paradise — expansive lawns, dense tropical planting, and thoughtfully designed foundation gardens that wrap the home in natural beauty. Expert grading work was integrated seamlessly into the design, creating gradual transitions between levels and offering beauty and accessibility throughout the property. Each aspect of this landscape was carefully crafted to be in sync with the natural topography, honoring the area’s astounding biodiversity and tropical beauty. At Shama Landscape Architects, we transform the ordinary into the extraordinary — blending art, nature, and function to form timeless outdoor spaces that inspire the senses and spirit.",
      images: [
        "/assets/projects/Oyugis - 1.jpg",
        "/assets/projects/Oyugis - 2.jpg",
        "/assets/projects/Oyugis - 3.jpg",
        "/assets/projects/Oyugis - 4.jpg",
        "/assets/projects/Oyugis - 5.jpg",
        "/assets/projects/Oyugis - 6.jpg",
        "/assets/projects/Oyugis - 7.jpg",
      ],
      details: {
        location: "Oyugis, Kenya",
        year: "2024",
        type: "Residential",
        client: "Private",
        area: "5,000 m²",
      },
    },
     {
      id: "kapsisiywa high school",
      title: "Kipchoge Library, Kapsisiywa High School",
      cover: "/assets/projects/kipchoge-library.jpg",
      tagline: "Commercial · 2025",
      description: "Urban regeneration project transforming open grounds into a green, inclusive park with architectural precision.",
      images: [
        "/assets/projects/KHS -1.jpg",
        "/assets/projects/KHS- 2.jpg",
        "/assets/projects/KHS- 3.jpg",
        "/assets/projects/KHS- 4.jpg",
        "/assets/projects/KHS- 5.jpg",
        "/assets/projects/KHS- 6.jpg",
        "/assets/projects/KHS- 7.jpg",
        "/assets/projects/KHS- 8.jpg",
        "/assets/projects/KHS- 9.jpg",
        "/assets/projects/KHS- 10.jpg",
      ],
      details: {
        location: "Kapsabet, Kenya",
        year: "2023",
        type: "Commercial",
        client: "County Partnership",
        area: "7,000 m²",
      },
    },
  ];

  const [active, setActive] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);

  // PDF Download Function - CORRECT PATH FOR YOUR FILE
  const downloadPortfolioPDF = () => {
    // This matches your file location: public/portfolio/shama-landscape-architects-portfolio.pdf
    const pdfUrl = '/portfolio/shama-landscape-architects-portfolio.pdf';
    
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'Shama-Landscape-Architects-Portfolio.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // keyboard controls for modal
  useEffect(() => {
    const onKey = (e) => {
      if (!active) return;
      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "ArrowLeft") {
        prevImage();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, imgIndex]);

  const openModal = (project) => {
    setActive(project);
    setImgIndex(0);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setActive(null);
    setImgIndex(0);
    document.body.style.overflow = "";
  };

  const nextImage = () => {
    if (!active) return;
    setImgIndex((p) => (p + 1) % active.images.length);
  };

  const prevImage = () => {
    if (!active) return;
    setImgIndex((p) => (p - 1 + active.images.length) % active.images.length);
  };

  return (
    <section className="bg-white text-shama-black font-montserrat">
      {/* HERO WITH ARCHITECTURAL GRID OVERLAY */}
      <motion.div
        className="relative flex items-center justify-center h-[80vh] bg-fixed bg-center bg-cover"
        style={{ backgroundImage: "url('/assets/hero-architecture.jpeg')" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        {/* Architectural Grid Overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
        <div className="absolute inset-0 opacity-20">
          <div className="grid h-full grid-cols-12">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-white/10" />
            ))}
          </div>
          <div className="absolute inset-0 grid h-full grid-rows-12">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-b border-white/10" />
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-4xl px-6 text-center text-white">
          <motion.h1
            className="mb-6 text-5xl font-black tracking-tight md:text-6xl lg:text-7xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          >
            LANDSCAPE ARCHITECTURAL<br />PORTFOLIO
          </motion.h1>

          <motion.div 
            className="w-24 h-1 mx-auto mb-8 bg-[#BD7563]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />

          <motion.p
            className="max-w-3xl mx-auto text-xl font-light leading-relaxed md:text-2xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            Crafting spaces that harmonize structure, environment, and human experience through innovative architectural solutions.
          </motion.p>

          <motion.a
            href="#gallery"
            className="inline-block px-8 py-4 mt-10 text-sm font-semibold tracking-widest text-white uppercase transition-all duration-500 border-2 border-white hover:bg-white hover:text-shama-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Explore Our Work
          </motion.a>
        </div>
      </motion.div>

      {/* ARCHITECTURAL PHILOSOPHY SECTION */}
      <motion.div
        className="max-w-6xl px-6 py-20 mx-auto border-b border-shama-clay/20"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold tracking-widest uppercase text-shama-green">
              Design Philosophy
            </span>
            <h2 className="mb-6 text-4xl font-bold leading-tight text-shama-blue">
              Where Form Meets<br />Function & Context
            </h2>
          </div>
          
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-shama-black/80">
              We approach architecture as a dialogue between built form and natural environment. 
              Each project is a unique response to site conditions, cultural context, and client vision.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="space-y-2">
                <div className="w-8 h-0.5 bg-[#BD7563]" />
                <h4 className="font-semibold text-shama-blue">Material Honesty</h4>
                <p className="text-sm text-shama-black/70">Expressing materials in their true form and texture</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-0.5 bg-[#3596D5]" />
                <h4 className="font-semibold text-shama-blue">Spatial Harmony</h4>
                <p className="text-sm text-shama-black/70">Creating balanced, proportional spaces</p>
              </div>
            </div>

            <blockquote className="pl-6 mt-8 text-lg italic font-light border-l-4 text-shama-green border-shama-green">
              "Architecture should speak of its time and place, but yearn for timelessness."
            </blockquote>
          </div>
        </div>
      </motion.div>

      {/* PROJECTS GALLERY WITH ARCHITECTURAL LAYOUT */}
      <motion.div
        id="gallery"
        className="py-20 bg-shama-clay/5"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="px-6 mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <span className="text-sm font-semibold tracking-widest uppercase text-shama-green">
              Selected Works
            </span>
            <h2 className="mt-2 text-4xl font-bold text-shama-blue">
              Architectural Portfolio
            </h2>
            <div className="w-16 h-0.5 mx-auto mt-4 bg-[#BD7563]" />
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={scaleUp}
                className="cursor-pointer group"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className="relative overflow-hidden bg-white shadow-2xl rounded-xl aspect-[4/5]"
                  onClick={() => openModal(project)}
                >
                  {/* Image Container */}
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={project.cover}
                      alt={project.title}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 transition-all duration-500 bg-black/0 group-hover:bg-black/20" />
                  </div>

                  {/* Overlay Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <div className="transition-transform duration-500 transform translate-y-8 group-hover:translate-y-0">
                      <div className="mb-2">
                        <span className="text-xs font-semibold tracking-widest uppercase opacity-90">
                          {project.tagline.split('·')[0].trim()}
                        </span>
                      </div>
                      <h3 className="mb-2 text-xl font-bold leading-tight">
                        {project.title}
                      </h3>
                      <p className="mb-4 text-sm opacity-90 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center text-xs font-semibold tracking-widest uppercase opacity-80">
                        VIEW PROJECT
                        <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>

                  {/* Index Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white rounded-full bg-black/40 backdrop-blur-sm">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ENHANCED MODAL WITH ARCHITECTURAL DETAILS */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />

            {/* Modal Content */}
            <motion.div
              className="relative z-50 w-full overflow-hidden bg-white max-w-7xl rounded-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between p-6 bg-white border-b border-shama-clay/20">
                <div>
                  <h3 className="text-2xl font-bold text-shama-blue">{active.title}</h3>
                  <p className="text-sm font-medium text-shama-green">{active.tagline}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 transition-colors rounded-lg hover:bg-shama-clay/10"
                  aria-label="Close project"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col lg:flex-row">
                {/* Image Gallery */}
                <div className="relative lg:w-7/12">
                  <div className="relative h-96 lg:h-[600px] bg-gray-100 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={active.images[imgIndex]}
                        src={active.images[imgIndex]}
                        alt={`${active.title} image ${imgIndex + 1}`}
                        className="object-cover w-full h-full"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      />
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    {active.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute p-3 text-white transition-all transform -translate-y-1/2 rounded-full left-4 top-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute p-3 text-white transition-all transform -translate-y-1/2 rounded-full right-4 top-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                          aria-label="Next image"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute px-3 py-1 text-sm text-white rounded-full bottom-4 left-4 bg-black/50 backdrop-blur-sm">
                      {imgIndex + 1} / {active.images.length}
                    </div>
                  </div>

                  {/* Thumbnail Strip */}
                  {active.images.length > 1 && (
                    <div className="flex gap-2 p-4 overflow-x-auto bg-white border-t border-shama-clay/10">
                      {active.images.map((src, idx) => (
                        <button
                          key={src}
                          onClick={() => setImgIndex(idx)}
                          className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                            idx === imgIndex
                              ? "border-[#BD7563] ring-2 ring-[#BD7563]/30"
                              : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={src}
                            alt={`Thumbnail ${idx + 1}`}
                            className="object-cover w-full h-full"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Project Details */}
                <div className="p-8 lg:w-5/12 bg-shama-clay/5">
                  <div className="space-y-6">
                    <div>
                      <h4 className="mb-4 text-lg font-semibold text-shama-blue">Project Overview</h4>
                      <p className="leading-relaxed text-shama-black/80">{active.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <MapPin size={20} className="text-[#BD7563]" />
                        <div>
                          <div className="text-xs text-shama-black/60">Location</div>
                          <div className="font-medium">{active.details.location}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <Calendar size={20} className="text-[#3596D5]" />
                        <div>
                          <div className="text-xs text-shama-black/60">Year</div>
                          <div className="font-medium">{active.details.year}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <Building size={20} className="text-[#BD7563]" />
                        <div>
                          <div className="text-xs text-shama-black/60">Type</div>
                          <div className="font-medium">{active.details.type}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <Users size={20} className="text-[#3596D5]" />
                        <div>
                          <div className="text-xs text-shama-black/60">Client</div>
                          <div className="font-medium">{active.details.client}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                      <Ruler size={20} className="text-[#BD7563]" />
                      <div>
                        <div className="text-xs text-shama-black/60">Area</div>
                        <div className="text-lg font-medium">{active.details.area}</div>
                      </div>
                    </div>

                    <a
                      href={`/projects/${active.id}`}
                      className="block w-full py-3 text-center text-white bg-[#BD7563] hover:bg-[#3596D5] transition-colors rounded-lg font-semibold"
                    >
                      View Full Case Study
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ARCHITECTURAL CTA WITH PDF DOWNLOAD */}
      <motion.div
        className="py-20 text-center bg-white border-t border-shama-clay/20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-4xl px-6 mx-auto">
          <h3 className="mb-6 text-3xl font-bold text-shama-blue">
            Ready to Begin Your Architectural Landscaping Journey?
          </h3>
          <p className="mb-8 text-lg leading-relaxed text-shama-black/80">
            Let's collaborate to create spaces that inspire, function beautifully, and stand the test of time.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/contact"
              className="px-8 py-4 font-semibold text-white transition-colors rounded-lg bg-shama-green hover:bg-shama-blue"
            >
              Start a Project
            </a>
            
            {/* PDF Download Button - REPLACED THE OLD "View Full Portfolio" LINK */}
            <button
              onClick={downloadPortfolioPDF}
              className="flex items-center justify-center gap-2 px-8 py-4 font-semibold transition-all border-2 rounded-lg border-shama-blue text-shama-blue hover:bg-shama-blue hover:text-white"
            >
              <Download size={20} />
              Download Profile
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}