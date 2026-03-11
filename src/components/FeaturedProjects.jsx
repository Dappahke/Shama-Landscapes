"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  MapPin, 
  Calendar, 
  ArrowUpRight,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Quote
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
  },
};

const staggerContainer = {
  hidden: {},
  visible: { 
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  },
};

const cardHover = {
  rest: { 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  hover: { 
    y: -16,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

export default function FeaturedProjects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const featuredProjects = [
    {
      id: "owiti-residence",
      title: "Owiti's Residence",
      cover: "/assets/projects/Oyugis.jpg",
      images: ["/assets/projects/Oyugis.jpg", "/assets/projects/Oyugis-2.jpg"],
      tagline: "Tropical Paradise Estate",
      year: "2025",
      location: "Oyugis, Homa Bay County",
      description: "Amidst the rolling hills of Kasipul-Kabondo sub-County, this stunning tropical paradise features expansive lawns, dense tropical planting, and expertly graded foundation gardens that seamlessly blend with the natural topography.",
      fullDescription: "Shama Landscape Architects transformed this residential estate into a breathtaking tropical sanctuary. The design honors the area's astounding biodiversity through native species selection, while expert grading work creates accessible, multi-level gardens that frame the home in natural beauty. Each outdoor room was carefully crafted to capture views of the rolling hills while providing intimate spaces for family gathering and quiet reflection.",
      category: "Residential",
      size: "2.5 acres",
      duration: "8 months",
      services: ["Master Planning", "Grading Design", "Native Planting", "Irrigation"],
      client: "Private Residence",
      testimonial: "Shama transformed our property into something we never imagined possible. The way they worked with the land's natural contours created spaces that feel like they've always been here.",
      accentColor: "#BD7563",
      featured: true
    },
    {
      id: "kipchoge-library",
      title: "Kipchoge Keino Library",
      cover: "/assets/projects/kipchoge-library.jpg",
      images: ["/assets/projects/kipchoge-library.jpg"],
      tagline: "Educational Landmark",
      year: "2024",
      location: "Kapsabet, Nandi County",
      description: "A state-of-the-art library honoring Kenya's running legend, featuring contemplative outdoor reading spaces and indigenous plantings that reflect the region's athletic heritage.",
      fullDescription: "Commissioned in 2022, this educational landscape celebrates Kipchoge Keino's legendary Enoes victory through design. The library's outdoor spaces feature running-inspired pathways, contemplative gardens for study, and indigenous plantings that require minimal maintenance while providing year-round beauty. The design creates a seamless transition between the built structure and the surrounding Nandi Hills landscape.",
      category: "Institutional",
      size: "1.8 acres",
      duration: "14 months",
      services: ["Landscape Design", "Installation", "Drought-Tolerant Planting", "Hardscaping"],
      client: "Kapsisiywa High School",
      testimonial: "The library grounds have become a source of pride for our entire community. Students study outdoors year-round, and the space hosts regional athletic events.",
      accentColor: "#3596D5",
      featured: true
    },
    {
      id: "nairobi-street-kitchen",
      title: "Nairobi Street Kitchen",
      cover: "/assets/projects/NSK.jpg",
      tagline: "Urban Dining Destination",
      year: "2020",
      location: "Westlands, Nairobi",
      description: "Vibrant urban landscape transforming a former industrial site into Nairobi's premier open-air dining destination.",
      category: "Hospitality",
      size: "0.5 acres",
      duration: "5 months",
      services: ["Site Transformation", "Urban Planting", "Event Spaces"],
      client: "Nairobi Street Kitchen",
      accentColor: "#E9C46A",
      featured: false
    },
    {
      id: "hub-karen",
      title: "The Hub Karen",
      cover: "/assets/projects/hub-karen.jpg",
      tagline: "Mixed-Use Development",
      year: "2019",
      location: "Karen, Nairobi",
      description: "Ongoing maintenance of Kenya's first integrated retail and office park with iconic central landscape features.",
      category: "Commercial",
      size: "5 acres",
      duration: "Ongoing",
      services: ["Landscape Maintenance", "Seasonal Refresh", "Irrigation Management"],
      client: "The Hub Management",
      accentColor: "#264653",
      featured: false
    },
  ];

  const filters = ["All", "Residential", "Hospitality", "Institutional", "Commercial"];
  
  const filteredProjects = activeFilter === "All" 
    ? featuredProjects 
    : featuredProjects.filter(p => p.category === activeFilter);

  const featuredProject = featuredProjects.find(p => p.id === "owiti-residence");

  const nextProject = () => {
    const currentIndex = filteredProjects.findIndex(p => p.id === selectedProject?.id);
    const nextIndex = (currentIndex + 1) % filteredProjects.length;
    setSelectedProject(filteredProjects[nextIndex]);
  };

  const prevProject = () => {
    const currentIndex = filteredProjects.findIndex(p => p.id === selectedProject?.id);
    const prevIndex = (currentIndex - 1 + filteredProjects.length) % filteredProjects.length;
    setSelectedProject(filteredProjects[prevIndex]);
  };

  return (
    <section className="relative px-6 py-24 bg-white md:px-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #2A9D8F 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          className="mb-16 text-center"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-widest uppercase rounded-full text-shama-green bg-shama-green/10">
            Selected Work
          </span>
          <h2 className="mb-6 text-4xl font-black leading-tight md:text-6xl text-shama-blue">
            Projects That <span className="text-shama-green">Define</span> Us
          </h2>
          <p className="max-w-2xl mx-auto text-lg leading-relaxed text-gray-600 md:text-xl">
            Each landscape tells a story of collaboration between vision, ecology, and craft. 
            Explore our signature work across Kenya and East Africa.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-12"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                activeFilter === filter
                  ? "bg-shama-green text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Featured Project Hero (Large) */}
        {activeFilter === "All" && featuredProject && (
          <motion.div
            className="mb-16"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div 
              className="relative overflow-hidden cursor-pointer rounded-3xl group"
              onClick={() => setSelectedProject(featuredProject)}
            >
              <div className="relative aspect-21/9">
                <Image
                  src={featuredProject.cover}
                  alt={featuredProject.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              
              {/* Featured Badge */}
              <div className="absolute flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-full top-6 left-6 bg-shama-green">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Featured Project
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-4 mb-4 text-sm text-white/80">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                      {featuredProject.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {featuredProject.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {featuredProject.year}
                    </span>
                  </div>
                  <h3 className="mb-4 text-3xl font-bold text-white md:text-5xl">
                    {featuredProject.title}
                  </h3>
                  <p className="max-w-2xl mb-6 text-lg text-white/90 line-clamp-2">
                    {featuredProject.description}
                  </p>
                  <button className="inline-flex items-center gap-2 px-6 py-3 font-semibold transition-all bg-white rounded-full text-shama-blue hover:bg-shama-green hover:text-white group/btn">
                    Explore Project
                    <ArrowUpRight size={18} className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.filter(p => p.id !== featuredProject?.id || activeFilter !== "All").map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="cursor-pointer group"
                onClick={() => setSelectedProject(project)}
                variants={cardHover}
                whileHover="hover"
              >
                <div className="relative flex flex-col h-full overflow-hidden bg-white border border-gray-100 shadow-lg rounded-2xl">
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-4/3">
                    <Image
                      src={project.cover}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-linear-to-t from-black/40 to-transparent group-hover:opacity-100" />
                    
                    {/* Category Badge */}
                    <div 
                      className="absolute px-3 py-1 text-xs font-bold text-white rounded-full top-4 left-4"
                      style={{ backgroundColor: project.accentColor }}
                    >
                      {project.category}
                    </div>

                    {/* Expand Icon */}
                    <div className="absolute flex items-center justify-center w-10 h-10 transition-all duration-300 transform translate-y-4 rounded-full opacity-0 bottom-4 right-4 bg-white/90 group-hover:opacity-100 group-hover:translate-y-0">
                      <Maximize2 size={18} className="text-shama-blue" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {project.location.split(',')[0]}
                      </span>
                      <span>•</span>
                      <span>{project.year}</span>
                    </div>
                    
                    <h3 className="mb-2 text-xl font-bold transition-colors text-shama-blue group-hover:text-shama-green">
                      {project.title}
                    </h3>
                    <p className="mb-3 text-sm font-medium text-shama-green">
                      {project.tagline}
                    </p>
                    <p className="flex-1 mb-4 text-sm text-gray-600 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500">{project.size}</span>
                      <span className="inline-flex items-center text-sm font-semibold transition-colors text-shama-blue group-hover:text-shama-green">
                        View <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>

                  {/* Accent Bar */}
                  <div 
                    className="w-full h-1 transition-transform duration-300 origin-left transform scale-x-0 group-hover:scale-x-100"
                    style={{ backgroundColor: project.accentColor }}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-500">No projects found in this category.</p>
            <button 
              onClick={() => setActiveFilter("All")}
              className="mt-4 font-semibold text-shama-green hover:underline"
            >
              View all projects
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          className="mt-20 text-center"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="inline-flex flex-col items-center gap-6 p-8 border sm:flex-row bg-shama-clay/10 rounded-3xl border-shama-clay/20">
            <div className="text-left">
              <h3 className="mb-2 text-2xl font-bold text-shama-blue">
                Have a project in mind?
              </h3>
              <p className="max-w-md text-gray-600">
                Let's discuss how we can transform your landscape into a lasting asset.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 font-bold text-white transition-all rounded-full shadow-lg bg-shama-green hover:bg-shama-blue hover:shadow-xl whitespace-nowrap"
            >
              Start Your Project
              <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <div className="flex items-center justify-center min-h-screen px-4 py-8 md:py-12">
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="relative w-full max-w-5xl overflow-hidden bg-white shadow-2xl rounded-3xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute z-10 flex items-center justify-center w-12 h-12 transition-all rounded-full shadow-lg top-4 right-4 bg-white/90 hover:bg-shama-green hover:text-white"
                >
                  <X size={24} />
                </button>

                {/* Navigation */}
                <div className="absolute z-10 flex justify-between pointer-events-none top-1/2 left-4 right-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); prevProject(); }}
                    className="flex items-center justify-center w-12 h-12 transition-all rounded-full shadow-lg pointer-events-auto bg-white/90 hover:bg-shama-green hover:text-white"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextProject(); }}
                    className="flex items-center justify-center w-12 h-12 transition-all rounded-full shadow-lg pointer-events-auto bg-white/90 hover:bg-shama-green hover:text-white"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

                {/* Hero Image */}
                <div className="relative aspect-video">
                  <Image
                    src={selectedProject.cover}
                    alt={selectedProject.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 text-white">
                    <div 
                      className="inline-block px-4 py-1 mb-4 text-sm font-bold rounded-full"
                      style={{ backgroundColor: selectedProject.accentColor }}
                    >
                      {selectedProject.category}
                    </div>
                    <h2 className="mb-2 text-3xl font-bold md:text-4xl">{selectedProject.title}</h2>
                    <p className="text-lg text-white/90">{selectedProject.tagline}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12">
                  <div className="grid gap-8 mb-8 md:grid-cols-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="text-shama-green" size={20} />
                      <div>
                        <div className="text-sm text-gray-500">Location</div>
                        <div className="font-semibold text-shama-blue">{selectedProject.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="text-shama-green" size={20} />
                      <div>
                        <div className="text-sm text-gray-500">Completed</div>
                        <div className="font-semibold text-shama-blue">{selectedProject.year}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Maximize2 className="text-shama-green" size={20} />
                      <div>
                        <div className="text-sm text-gray-500">Project Size</div>
                        <div className="font-semibold text-shama-blue">{selectedProject.size}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-12 md:grid-cols-2">
                    <div>
                      <h3 className="mb-4 text-xl font-bold text-shama-blue">Project Overview</h3>
                      <p className="mb-6 leading-relaxed text-gray-600">
                        {selectedProject.fullDescription || selectedProject.description}
                      </p>
                      
                      <h4 className="mb-3 font-bold text-shama-blue">Services Provided</h4>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {(selectedProject.services || []).map((service, i) => (
                          <span key={i} className="px-3 py-1 text-sm rounded-full bg-shama-clay/20 text-shama-blue">
                            {service}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-4">
                        <Link
                          href="/contact"
                          className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-full bg-shama-green hover:bg-shama-blue"
                        >
                          Discuss Similar Project
                          <ArrowRight size={18} />
                        </Link>
                      </div>
                    </div>

                    <div>
                      {selectedProject.testimonial && (
                        <div className="p-6 mb-6 bg-shama-clay/10 rounded-2xl">
                          <Quote className="mb-4 text-shama-green" size={32} />
                          <p className="mb-4 italic leading-relaxed text-gray-700">
                            "{selectedProject.testimonial}"
                          </p>
                          <div className="font-semibold text-shama-blue">{selectedProject.client}</div>
                          <div className="text-sm text-gray-500">Client</div>
                        </div>
                      )}

                      <div className="p-6 bg-gray-50 rounded-2xl">
                        <h4 className="mb-3 font-bold text-shama-blue">Project Details</h4>
                        <dl className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Duration:</dt>
                            <dd className="font-medium text-shama-blue">{selectedProject.duration || "N/A"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Category:</dt>
                            <dd className="font-medium text-shama-blue">{selectedProject.category}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}