"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Calendar } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.25, 0.46, 0.45, 0.94] 
    } 
  },
};

const staggerContainer = {
  hidden: {},
  visible: { 
    transition: { 
      staggerChildren: 0.3,
      delayChildren: 0.2 
    } 
  },
};

const cardHover = {
  rest: { 
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  hover: { 
    scale: 1.02,
    y: -12,
    transition: { 
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const imageHover = {
  rest: { scale: 1 },
  hover: { scale: 1.1 }
};

export default function FeaturedProjects() {
  const featuredProjects = [
    {
      id: "hub-karen",
      title: "Owiti’s Residence",
      cover: "/assets/projects/Oyugis.jpg",
      tagline: "Landscape Architecture",
      year: "2025",
      location: "Oyugis, Homa Bay County",
      description: "Amidst the rolling hills of Kasipul-Kabondo sub-County,Shama Landscape Architects brought a vision of stunning beauty to life. This beautiful landscape captures the essence of a tropical paradise — expansive lawns, dense tropical planting, and thoughtfully designed foundation gardens that wrap the home in natural beauty. Expert grading work was integrated seamlessly into the design, creating gradual transitions between levels and offering beauty and accessibility throughout the property. Each aspect of this landscape was carefully crafted to be in sync with the natural topography, honoring the area’s astounding biodiversity and tropical beauty. At Shama Landscape Architects, we transform the ordinary into the extraordinary — blending art, nature, and function to form timeless outdoor spaces that inspire the senses and spirit.",
      category: "Residential",
      accentColor: "#BD7563"
    },
    {
      id: "Kapsisiywa High School",
      title: "Kipchoge Library, Kapsisiywa High School",
      cover: "assets/projects/kipchoge-library.jpg",
      tagline: "Educationa Design",
      year: "2024",
      location: "Kapsabet, Nairobi",
      description: "Kipchoge Keino Library is located in the outskirts of Nandi County Headquarters (Kapsabet). The site is approximately 10km from Kapsabet’s Central Business District. It is a state-of-the-art Library that was done in respect of Kipchoge Keiono’s famous Eneos victory. Shama Landscape Architects Limited was commissioned to undertake the landscape design & installation of this project in the year 2022.",
      category: "Commercial",
      accentColor: "#3596D5"
    },
    {
      id: "sax and violins",
      title: "Sax and Violins Lounge",
      cover: "/assets/projects/SVL.jpg",
      tagline: "Luxury Hospitality",
      year: "2019",
      location: "Karen, Kenya",
      description: "Elegant lounge landscaping with intimate seating areas, water features, and carefully curated lighting for sophisticated evening entertainment.",
      category: "Hospitality",
      accentColor: "#2A9D8F"
    },
  ];

  return (
    <section className="relative px-6 py-24 bg-gradient-to-br from-shama-clay/5 to-white md:px-20">
      {/* Background Architectural Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute inset-0 bg-grid-slate-900 [mask-image:linear-gradient(0deg,white,transparent)]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          className="mb-20 text-center"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-widest uppercase rounded-full text-shama-green bg-shama-green/10">
            Portfolio
          </span>
          <h2 className="mb-6 text-5xl font-black leading-tight text-shama-blue">
            Featured <span className="text-shama-green">Projects</span>
          </h2>
          <div className="w-24 h-1 mx-auto mb-6 bg-gradient-to-r from-[#BD7563] to-[#3596D5] rounded-full" />
          <p className="max-w-2xl mx-auto text-xl leading-relaxed text-gray-600">
            Discover our signature landscape architecture projects that blend innovative design with environmental sustainability
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 gap-12 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="cursor-pointer group"
              initial="rest"
              whileHover="hover"
              animate="rest"
              variants={cardHover}
            >
              <div className="relative overflow-hidden bg-white border border-gray-100 shadow-2xl rounded-2xl">
                {/* Image Container with Overlay */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <motion.img
                    src={project.cover}
                    alt={project.title}
                    className="object-cover w-full h-full"
                    variants={imageHover}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 transition-all duration-500 opacity-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:opacity-100" />
                  
                  {/* Category Badge */}
                  <div 
                    className="absolute px-3 py-1 text-xs font-bold text-white rounded-full top-4 left-4 backdrop-blur-sm"
                    style={{ backgroundColor: project.accentColor }}
                  >
                    {project.category}
                  </div>

                  {/* Hover View Button */}
                  <div className="absolute transition-all duration-500 transform translate-y-8 opacity-0 bottom-4 right-4 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-white/90 backdrop-blur-sm">
                      <ArrowRight size={20} className="text-shama-blue" />
                    </div>
                  </div>

                  {/* Index Number */}
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center justify-center w-8 h-8 text-sm font-black text-white rounded-full bg-black/40 backdrop-blur-sm">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Project Meta */}
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{project.year}</span>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div className="mb-4">
                    <h3 className="mb-2 text-xl font-bold leading-tight text-shama-blue">
                      {project.title}
                    </h3>
                    <p className="text-sm font-semibold tracking-wide uppercase text-shama-green">
                      {project.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="mb-6 text-sm leading-relaxed text-gray-600 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Feature Dots */}
                  <div className="flex gap-2 mb-6">
                    {[1, 2, 3].map((dot) => (
                      <div
                        key={dot}
                        className="w-2 h-2 bg-gray-300 rounded-full"
                        style={{ 
                          backgroundColor: dot === 1 ? project.accentColor : undefined 
                        }}
                      />
                    ))}
                  </div>

                  {/* View Project Link */}
                  <Link
                    href={`/projects#${project.id}`}
                    className="inline-flex items-center text-sm font-semibold transition-colors text-shama-blue hover:text-shama-green group/link"
                  >
                    View Project Details
                    <ArrowRight size={16} className="ml-2 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>

                {/* Accent Border Bottom */}
                <div 
                  className="w-full h-1"
                  style={{ backgroundColor: project.accentColor }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-16 text-center"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="inline-flex flex-col items-center gap-6 p-8 border border-gray-100 shadow-xl sm:flex-row bg-white/80 backdrop-blur-sm rounded-2xl">
            <div className="text-left">
              <h3 className="mb-2 text-2xl font-bold text-shama-blue">
                Ready to explore our full portfolio?
              </h3>
              <p className="max-w-md text-gray-600">
                Dive deeper into our complete collection of landscape architecture projects, case studies, and design processes.
              </p>
            </div>
            <Link
              href="/projects"
              className="relative inline-flex items-center px-8 py-4 overflow-hidden font-semibold text-white transition-all duration-300 rounded-lg group bg-shama-green hover:bg-shama-blue hover:shadow-2xl hover:scale-105"
            >
              <span className="relative z-10 flex items-center">
                View Full Portfolio
                <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-shama-green to-shama-blue group-hover:opacity-100" />
            </Link>
          </div>
        </motion.div>
      </div>

      
    </section>
  );
}