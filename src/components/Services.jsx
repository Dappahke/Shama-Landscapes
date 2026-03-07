"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  Leaf, 
  PenTool, 
  Users, 
  Droplets, 
  Building, 
  CheckCircle,
  ArrowRight,
  MapPin,
  Calendar,
  Ruler
} from "lucide-react";

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
      staggerChildren: 0.2 
    } 
  },
};

const cardHover = {
  rest: { 
    scale: 1,
    y: 0,
    transition: { duration: 0.4 }
  },
  hover: { 
    scale: 1.02,
    y: -8,
    transition: { 
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export default function Services() {
  const services = [
    {
      icon: <PenTool size={32} />,
      title: "Landscape Architecture",
      description: "Comprehensive design of outdoor environments — blending form, ecology, and functionality. We shape spaces that enhance everyday life and strengthen the relationship between people and place.",
      features: ["Site Analysis", "Concept Development", "3D Visualization", "Construction Documentation"],
      color: "#2A9D8F",
      image: "/assets/services/landscape-architecture.jpg"
    },
    {
      icon: <Leaf size={32} />,
      title: "Environmental Planning",
      description: "We integrate environmental principles into design, balancing development and conservation. Our work includes site analysis, ecological restoration, and sustainable land-use planning.",
      features: ["Ecological Assessment", "Sustainable Strategies", "Habitat Creation", "Conservation Planning"],
      color: "#BD7563",
      image: "/assets/services/environmental-planning.jpg"
    },
    {
      icon: <Leaf size={32} />,
      title: "Horticultural Design",
      description: "Native planting design, seasonal palettes, and habitat creation that celebrate biodiversity and beauty — connecting color, texture, and rhythm through nature.",
      features: ["Native Planting", "Seasonal Palettes", "Biodiversity Plans", "Maintenance Guides"],
      color: "#3596D5",
      image: "/assets/services/horticultural-design.jpg"
    },
    {
      icon: <Building size={32} />,
      title: "Urban Design & Public Spaces",
      description: "Designing human-centered urban environments — parks, plazas, and streetscapes that foster community engagement, accessibility, and cultural identity.",
      features: ["Public Realm Design", "Community Engagement", "Accessibility Planning", "Cultural Integration"],
      color: "#2A9D8F",
      image: "/assets/services/urban-design.jpg"
    },
    {
      icon: <Droplets size={32} />,
      title: "Irrigation & Water Management",
      description: "Water-wise design systems, rain harvesting, and sustainable irrigation strategies — ensuring resilience and long-term landscape health.",
      features: ["Smart Irrigation", "Rainwater Harvesting", "Drainage Solutions", "Water Conservation"],
      color: "#264653",
      image: "/assets/services/water-management.jpg"
    },
    {
      icon: <Users size={32} />,
      title: "Project Implementation",
      description: "From concept to completion, we provide site supervision, materials sourcing, and project coordination to guarantee design integrity and build quality.",
      features: ["Site Supervision", "Quality Control", "Contractor Coordination", "Project Management"],
      color: "#BD7563",
      image: "/assets/services/project-implementation.jpeg"
    },
  ];

  const processSteps = [
    { 
      number: "01", 
      title: "Site Visit", 
      description: "We begin with comprehensive site analysis, understanding natural systems, cultural context, and client aspirations through detailed assessment.",
      icon: <MapPin size={24} />
    },
    { 
      number: "02", 
      title: "Concept Design", 
      description: "Transforming insights into visionary concepts through sketches, 3D models, and renderings that capture the essence of your project.",
      icon: <PenTool size={24} />
    },
    { 
      number: "03", 
      title: "Detailed Design", 
      description: "Developing comprehensive technical drawings, material specifications, and planting plans to guide precise implementation.",
      icon: <Ruler size={24} />
    },
    { 
      number: "04", 
      title: "Execution", 
      description: "On-site supervision and collaboration with contractors to ensure design integrity and exceptional quality throughout construction.",
      icon: <CheckCircle size={24} />
    },
  ];

  return (
    <section className="bg-white text-shama-black font-montserrat">
      {/* Hero Section with Background Image */}
      <div className="relative h-[80vh] flex items-center justify-center bg-cover bg-center bg-fixed overflow-hidden"
           style={{ backgroundImage: "url('/assets/services/hero-services.jpg')" }}>
        
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
        
        {/* Architectural Grid Overlay */}
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
        
        <motion.div 
          className="relative max-w-4xl px-6 text-center text-white"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold tracking-widest text-white uppercase rounded-full bg-white/20 backdrop-blur-sm">
            Our Expertise
          </span>
          <h1 className="mb-6 text-5xl font-black leading-tight md:text-6xl lg:text-7xl">
            Landscape <span className="text-shama-green">Services</span>
          </h1>
          <div className="w-24 h-1 mx-auto mb-8 rounded-full bg-gradient-to-r from-shama-green to-shama-blue" />
          <p className="max-w-3xl mx-auto text-xl leading-relaxed text-white/90">
            We design landscapes that inspire, sustain, and belong — grounded in creativity, 
            craftsmanship, and ecological intelligence for a better built environment.
          </p>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute transform -translate-x-1/2 bottom-8 left-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex justify-center w-6 h-10 border-2 rounded-full border-white/50">
              <div className="w-1 h-3 mt-2 rounded-full bg-white/70" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Introduction */}
      <motion.div 
        className="max-w-6xl px-6 py-20 mx-auto"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold tracking-widest uppercase text-shama-green">
              Our Approach
            </span>
            <h2 className="mb-6 text-4xl font-bold leading-tight text-shama-blue">
              Design That Connects <br />People & Place
            </h2>
          </div>
          <div>
            <p className="mb-6 text-lg leading-relaxed text-shama-black/80">
              At Shama Landscape Architects, our work spans the full design cycle — from 
              visionary concepts to meticulous implementation. We create environments that 
              merge beauty with purpose, sustainability with innovation.
            </p>
            <p className="text-lg leading-relaxed text-shama-black/80">
              Each project reflects our commitment to ecological stewardship, community 
              engagement, and timeless design principles that stand the test of time.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Core Services */}
      <div className="py-20 bg-gradient-to-b from-shama-clay/5 to-white">
        <div className="px-6 mx-auto max-w-7xl">
          {/* Section Header */}
          <motion.div 
            className="mb-16 text-center"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-widest uppercase rounded-full text-shama-green bg-shama-green/10">
              What We Do
            </span>
            <h2 className="mb-6 text-4xl font-bold text-shama-blue">
              Comprehensive <span className="text-shama-green">Landscape Services</span>
            </h2>
            <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-[#BD7563] to-[#3596D5] rounded-full" />
          </motion.div>

          {/* Services Grid */}
          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                className="cursor-pointer group"
                variants={fadeIn}
                initial="rest"
                whileHover="hover"
                animate="rest"
              >
                <motion.div 
                  className="h-full overflow-hidden bg-white border border-gray-100 shadow-xl rounded-2xl"
                  variants={cardHover}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div 
                      className="absolute p-3 text-white top-4 left-4 rounded-2xl backdrop-blur-sm"
                      style={{ backgroundColor: service.color }}
                    >
                      {service.icon}
                    </div>
                    <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/40 to-transparent group-hover:opacity-100" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="mb-3 text-xl font-bold text-shama-blue">
                      {service.title}
                    </h3>
                    <p className="mb-4 leading-relaxed text-shama-black/70">
                      {service.description}
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-2">
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-center text-sm text-shama-black/60">
                          <div 
                            className="w-2 h-2 mr-3 rounded-full"
                            style={{ backgroundColor: service.color }}
                          />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Accent Border */}
                  <div 
                    className="w-full h-1"
                    style={{ backgroundColor: service.color }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl px-6 mx-auto">
          <motion.div 
            className="mb-16 text-center"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-widest uppercase rounded-full text-shama-green bg-shama-green/10">
              Our Method
            </span>
            <h2 className="mb-6 text-4xl font-bold text-shama-blue">
              The Shama <span className="text-shama-green">Design Process</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-shama-black/80">
              Each project follows our proven, collaborative design process — ensuring your vision 
              aligns perfectly with site potential and environmental performance.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {processSteps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={fadeIn}
                className="relative"
              >
                {/* Connecting Line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-shama-green to-shama-blue -z-10" />
                )}
                
                <div className="p-8 text-center transition-all duration-300 bg-white border border-gray-100 shadow-lg rounded-2xl group hover:shadow-xl">
                  {/* Step Number */}
                  <div className="relative mb-6">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto text-2xl font-black text-white transition-transform duration-300 bg-shama-green rounded-2xl group-hover:scale-110">
                      {step.number}
                    </div>
                    <div className="absolute transition-transform duration-300 -inset-4 bg-shama-green/10 rounded-3xl -z-10 group-hover:scale-110" />
                  </div>

                  {/* Icon */}
                  <div className="mb-4 text-shama-green">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 text-xl font-bold text-shama-blue">
                    {step.title}
                  </h3>
                  <p className="leading-relaxed text-shama-black/70">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div 
        className="relative py-20 overflow-hidden text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-shama-blue via-shama-green to-shama-terra" />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-white [mask-image:linear-gradient(0deg,white,transparent)]" />
        </div>

        <div className="relative max-w-4xl px-6 mx-auto text-center">
          <h2 className="mb-6 text-4xl font-bold">
            Ready to Transform Your Space?
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-xl text-white/90">
            Let's collaborate to craft outdoor environments that reflect your identity, 
            celebrate culture, and embrace sustainable design principles.
          </p>
          <motion.a
            href="/contact"
            className="inline-flex items-center px-8 py-4 font-semibold transition-all duration-300 bg-white rounded-lg shadow-2xl group text-shama-blue hover:shadow-3xl hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Project
            <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
