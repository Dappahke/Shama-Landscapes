"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  Leaf, 
  Droplets, 
  Recycle, 
  Users, 
  Cpu, 
  Sun,
  ArrowRight,
  Target,
  Award,
  HeartHandshake,
  Lightbulb,
  Sprout,
  Shield,
  BadgeCheck,
  Building,
  MapPin,
  Trees,
  Network,
  Cctv,
  SproutIcon,
  CpuIcon,
  Wheat
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

export default function Sustainability() {
  const sustainabilityStats = [
    { number: "85%", label: "Native Species Usage", icon: <Leaf size={24} />, color: "#2A9D8F" },
    { number: "60%", label: "Water Consumption Reduced", icon: <Droplets size={24} />, color: "#3596D5" },
    { number: "90%", label: "Local Materials Sourced", icon: <Recycle size={24} />, color: "#BD7563" },
    { number: "45+", label: "Habitat Projects", icon: <Sprout size={24} />, color: "#E9C46A" },
  ];

  const sustainabilityPillars = [
    {
      icon: <Leaf size={32} />,
      title: "Ecological Regeneration",
      description: "We go beyond preservation to active regeneration, creating landscapes that restore native ecosystems, rebuild soil health, and increase biodiversity through strategic planting and habitat creation.",
      features: ["Native Species Restoration", "Wildlife Corridors", "Soil Revitalization", "Pollinator Gardens"],
      color: "#2A9D8F",
      image: "/assets/sustainability/ecological-design.jpg"
    },
    {
      icon: <Droplets size={32} />,
      title: "Water Intelligence",
      description: "Our integrated water management systems capture, clean, and reuse every drop. From smart irrigation to natural filtration, we create self-sustaining water cycles.",
      features: ["Rainwater Harvesting", "Greywater Systems", "Permeable Paving", "Natural Swales"],
      color: "#3596D5",
      image: "/assets/sustainability/water-management.jpg"
    },
    {
      icon: <Recycle size={32} />,
      title: "Circular Material Economy",
      description: "We champion the circular economy by repurposing construction waste, using recycled materials, and selecting products with complete life-cycle sustainability.",
      features: ["Recycled Aggregates", "Salvaged Materials", "Low-Carbon Concrete", "Sustainable Timber"],
      color: "#BD7563",
      image: "/assets/sustainability/material-innovation.jpg"
    },
    {
      icon: <Users size={32} />,
      title: "Community Resilience",
      description: "Sustainable landscapes must serve people. We design spaces that strengthen community bonds, provide educational opportunities, and enhance social wellbeing.",
      features: ["Community Gardens", "Educational Landscapes", "Social Gathering Spaces", "Cultural Preservation"],
      color: "#E9C46A",
      image: "/assets/sustainability/community-engagement.jpg"
    },
    {
      icon: <Cpu size={32} />,
      title: "Smart Technology Integration",
      description: "Leveraging cutting-edge technology for environmental monitoring, energy efficiency, and data-driven landscape management that adapts to changing conditions.",
      features: ["Smart Irrigation", "Solar Integration", "Environmental Sensors", "Digital Twins"],
      color: "#264653",
      image: "/assets/sustainability/technology-integration.jpeg"
    },
    {
      icon: <Shield size={32} />,
      title: "Climate Adaptation",
      description: "Proactive design strategies that address climate challenges through flood mitigation, urban cooling, carbon sequestration, and resilient planting.",
      features: ["Urban Heat Reduction", "Flood Management", "Carbon Capture", "Drought Resilience"],
      color: "#F4A261",
      image: "/assets/sustainability/climate-adaptation.jpg"
    },
  ];

  const innovationFeatures = [
    {
      title: "Bio-Engineering Solutions",
      description: "Using living plants as structural elements for erosion control, slope stabilization, and natural architecture that grows stronger over time.",
      icon: <Network size={32} className="text-[#2A9D8F]" />,
      benefits: ["Self-healing structures", "Reduced construction materials", "Enhanced biodiversity"]
    },
    {
      title: "Digital Environmental Modeling",
      description: "Advanced simulation tools that predict environmental performance, water flow, and microclimate conditions before construction begins.",
      icon: <Cctv size={32} className="text-[#3596D5]" />,
      benefits: ["Precise resource planning", "Risk mitigation", "Optimized design outcomes"]
    },
    {
      title: "Regenerative Agriculture Integration",
      description: "Blending productive landscapes with ecological design to create food-producing ecosystems that restore rather than deplete natural resources.",
      icon: <Wheat size={32} className="text-[#BD7563]" />,
      benefits: ["Local food production", "Soil regeneration", "Educational opportunities"]
    }
  ];

  const certificationStandards = [
    { 
      name: "SITES Certified", 
      level: "Silver & Gold", 
      projects: "12+", 
      icon: <BadgeCheck size={32} className="text-[#2A9D8F]" />
    },
    { 
      name: "LEED Integration", 
      level: "Platinum Target", 
      projects: "8+", 
      icon: <Building size={32} className="text-[#3596D5]" />
    },
    { 
      name: "Local Sustainability", 
      level: "Kenya Green Building", 
      projects: "15+", 
      icon: <MapPin size={32} className="text-[#BD7563]" />
    },
    { 
      name: "Biodiversity Net Gain", 
      level: "15%+ Improvement", 
      projects: "20+", 
      icon: <Trees size={32} className="text-[#E9C46A]" />
    },
  ];

  return (
    <section className="bg-white text-shama-black font-montserrat">
      {/* Hero Section */}
      <div className="relative h-[80vh] flex items-center justify-center bg-cover bg-center bg-fixed overflow-hidden"
           style={{ backgroundImage: "url('/assets/hero-sustainability.jpg')" }}>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
        
        {/* Architectural Grid */}
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
            Sustainable Future
          </span>
          <h1 className="mb-6 text-5xl font-black leading-tight md:text-6xl lg:text-7xl">
            Regenerative <span className="text-shama-green">Landscape Design</span>
          </h1>
          <div className="w-24 h-1 mx-auto mb-8 rounded-full bg-gradient-to-r from-shama-green to-shama-blue" />
          <p className="max-w-2xl mx-auto text-xl leading-relaxed text-white/90">
            We design landscapes that give back more than they take — creating living systems 
            that regenerate ecosystems, strengthen communities, and inspire environmental stewardship.
          </p>
        </motion.div>
      </div>

      {/* Impact Statistics */}
      <div className="relative py-16 bg-white border-b border-shama-clay/20">
        <div className="max-w-6xl px-6 mx-auto">
          <motion.div 
            className="grid grid-cols-2 gap-8 md:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {sustainabilityStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={fadeIn}
                className="text-center group"
              >
                <div className="flex justify-center mb-4" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <div 
                  className="mb-2 text-3xl font-black transition-transform duration-300 group-hover:scale-110"
                  style={{ color: stat.color }}
                >
                  {stat.number}
                </div>
                <div className="text-sm font-semibold tracking-wide uppercase text-shama-black/70">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="max-w-6xl px-6 py-20 mx-auto">
        <motion.div 
          className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeIn}>
            <span className="text-sm font-semibold tracking-widest uppercase text-shama-green">
              Our Commitment
            </span>
            <h2 className="mb-6 text-4xl font-bold leading-tight text-shama-blue">
              Designing Landscapes That <br />Heal the Planet
            </h2>
            <div className="w-16 h-0.5 bg-shama-green rounded-full mb-6" />
          </motion.div>
          
          <motion.div variants={fadeIn} className="space-y-6">
            <p className="text-lg leading-relaxed text-shama-black/80">
              At Shama Landscape Architects, sustainability is not a feature we add — 
              it's the foundation upon which we build. Every project represents an opportunity 
              to restore ecological balance, enhance biodiversity, and create spaces that 
              actively contribute to environmental healing.
            </p>
            <p className="text-lg leading-relaxed text-shama-black/80">
              We practice <strong>regenerative design</strong> — creating landscapes that 
              improve over time, sequester carbon, support wildlife, and strengthen the 
              connection between people and the natural world. Our approach combines 
              traditional ecological knowledge with cutting-edge sustainable technologies.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center justify-center w-12 h-12 text-white rounded-full bg-shama-green">
                <Target size={20} />
              </div>
              <div>
                <div className="font-semibold text-shama-blue">Net-Positive Environmental Impact</div>
                <div className="text-sm text-shama-black/70">
                  Every project is designed to leave the environment better than we found it
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Sustainability Pillars */}
      <div className="py-20 bg-gradient-to-b from-shama-clay/5 to-white">
        <div className="px-6 mx-auto max-w-7xl">
          <motion.div 
            className="mb-16 text-center"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-widest uppercase rounded-full text-shama-green bg-shama-green/10">
              Our Framework
            </span>
            <h2 className="mb-6 text-4xl font-bold text-shama-blue">
              Six Pillars of <span className="text-shama-green">Regenerative Design</span>
            </h2>
            <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-[#BD7563] to-[#3596D5] rounded-full" />
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {sustainabilityPillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                variants={fadeIn}
                className="cursor-pointer group"
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
                      src={pillar.image}
                      alt={pillar.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div 
                      className="absolute p-3 text-white top-4 left-4 rounded-2xl backdrop-blur-sm"
                      style={{ backgroundColor: pillar.color }}
                    >
                      {pillar.icon}
                    </div>
                    <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/40 to-transparent group-hover:opacity-100" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="mb-3 text-xl font-bold text-shama-blue">
                      {pillar.title}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-shama-black/70">
                      {pillar.description}
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-2">
                      {pillar.features.map((feature) => (
                        <div key={feature} className="flex items-center text-sm text-shama-black/60">
                          <div 
                            className="w-2 h-2 mr-3 rounded-full"
                            style={{ backgroundColor: pillar.color }}
                          />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Accent Border */}
                  <div 
                    className="w-full h-1"
                    style={{ backgroundColor: pillar.color }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Certification & Standards */}
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
              Industry Leadership
            </span>
            <h2 className="mb-6 text-4xl font-bold text-shama-blue">
              Certified <span className="text-shama-green">Sustainability Excellence</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-shama-black/80">
              We adhere to the highest international and local sustainability standards, 
              ensuring our projects deliver measurable environmental benefits and set new 
              benchmarks for green landscape architecture.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {certificationStandards.map((cert, index) => (
              <motion.div
                key={cert.name}
                variants={fadeIn}
                className="p-6 text-center transition-colors duration-300 bg-shama-clay/10 rounded-2xl group hover:bg-shama-green/10"
              >
                <div className="flex justify-center mb-4">
                  {cert.icon}
                </div>
                <h3 className="mb-2 font-bold text-shama-blue">{cert.name}</h3>
                <div className="mb-2 text-sm font-semibold text-shama-green">{cert.level}</div>
                <div className="text-xs text-shama-black/60">{cert.projects} Projects</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Innovation Section */}
      <div className="py-20 bg-gradient-to-br from-shama-blue/5 to-shama-green/5">
        <div className="max-w-6xl px-6 mx-auto">
          <motion.div 
            className="mb-16 text-center"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-widest uppercase rounded-full text-shama-green bg-shama-green/10">
              Cutting-Edge Solutions
            </span>
            <h2 className="mb-6 text-4xl font-bold text-shama-blue">
              Pioneering <span className="text-shama-green">Sustainable Innovation</span>
            </h2>
            <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-[#BD7563] to-[#3596D5] rounded-full" />
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {innovationFeatures.map((innovation, index) => (
              <motion.div
                key={innovation.title}
                variants={fadeIn}
                className="p-8 transition-all duration-300 bg-white border border-gray-100 shadow-lg rounded-2xl group hover:shadow-xl"
              >
                <div className="flex justify-center mb-4">
                  {innovation.icon}
                </div>
                <h3 className="mb-4 text-xl font-bold text-shama-blue">
                  {innovation.title}
                </h3>
                <p className="mb-6 leading-relaxed text-shama-black/70">
                  {innovation.description}
                </p>
                <ul className="space-y-2">
                  {innovation.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-sm text-shama-black/60">
                      <div className="w-1.5 h-1.5 bg-shama-green rounded-full mr-3" />
                      {benefit}
                    </li>
                  ))}
                </ul>
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
        <div className="absolute inset-0 bg-gradient-to-br from-shama-green via-shama-blue to-shama-terra" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-white [mask-image:linear-gradient(0deg,white,transparent)]" />
        </div>

        <div className="relative max-w-4xl px-6 mx-auto text-center">
          <h2 className="mb-6 text-4xl font-bold">
            Join Us in Building a Greener Future
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-xl text-white/90">
            Let's create landscapes that don't just exist in harmony with nature — 
            but actively regenerate and restore our precious ecosystems for generations to come.
          </p>
          <motion.a
            href="/contact"
            className="inline-flex items-center px-8 py-4 font-semibold transition-all duration-300 bg-white rounded-lg shadow-2xl group text-shama-blue hover:shadow-3xl hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Regenerative Project
            <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
          </motion.a>
          
          {/* Additional CTA for smaller actions */}
          <div className="flex flex-col justify-center gap-4 mt-8 sm:flex-row">
            <a
              href="/projects"
              className="inline-flex items-center px-6 py-3 text-white transition-colors border rounded-lg border-white/30 hover:bg-white/10"
            >
              View Sustainable Projects
            </a>
            <a
              href="/services"
              className="inline-flex items-center px-6 py-3 text-white transition-colors border rounded-lg border-white/30 hover:bg-white/10"
            >
              Explore Green Services
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
