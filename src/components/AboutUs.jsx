"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Award, 
  Users, 
  Leaf, 
  HeartHandshake, 
  Lightbulb,
  Target,
  MapPin,
  Calendar,
  Star,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  ExternalLink
} from "lucide-react";

export default function AboutUs() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTimelineItem, setActiveTimelineItem] = useState(null);
  const [hoveredYear, setHoveredYear] = useState(null);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      } 
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: { 
      transition: { 
        staggerChildren: 0.15 
      } 
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      } 
    },
  };

  const slideInFromLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      } 
    },
  };

  // Data
  const stats = [
    { number: "50+", label: "Projects Completed", icon: Award },
    { number: "12+", label: "Years Experience", icon: Calendar },
    { number: "10+", label: "Cities Served", icon: MapPin },
    { number: "98%", label: "Client Satisfaction", icon: Star },
  ];

  const values = [
    {
      icon: HeartHandshake,
      title: "Integrity First",
      description: "We build lasting relationships through transparency, honesty, and unwavering commitment to our promises.",
      color: "#0F7F40",
      image: "/assets/company/integrity-team.jpg"
    },
    {
      icon: Lightbulb,
      title: "Creative Innovation",
      description: "Every space tells a unique story through innovative design that blends art, ecology, and human experience.",
      color: "#BD7563",
      image: "/assets/company/creative-process.jpg"
    },
    {
      icon: Leaf,
      title: "Sustainable Legacy",
      description: "We design for generations, prioritizing environmental stewardship and long-term ecological balance.",
      color: "#3596D5",
      image: "/assets/company/sustainable-design.jpg"
    },
    {
      icon: Users,
      title: "Collaborative Spirit",
      description: "Your vision + our expertise = extraordinary results. We're partners in creating your ideal space.",
      color: "#E9C46A",
      image: "/assets/company/collaboration.jpg"
    },
    {
      icon: Target,
      title: "Excellence in Execution",
      description: "From concept to completion, we maintain the highest standards of quality and attention to detail.",
      color: "#264653",
      image: "/assets/company/quality-work.png"
    },
    {
      icon: Award,
      title: "Meaningful Impact",
      description: "We create spaces that transform communities, enhance wellbeing, and celebrate cultural identity.",
      color: "#F4A261",
      image: "/assets/company/community-impact.jpeg"
    },
  ];

  const expertiseAreas = [
    {
      category: "Residential Excellence",
      projects: ["Luxury Home Gardens", "Private Estates", "Gated Communities", "Family Compounds"],
      image: "/assets/company/residential-expertise.jpg"
    },
    {
      category: "Commercial Innovation",
      projects: ["Hotel & Resort Landscaping", "Office Complexes", "Shopping Centers", "Mixed-Use Developments"],
      image: "/assets/company/commercial-projects.jpg"
    },
    {
      category: "Public & Civic Spaces",
      projects: ["Parks & Recreation", "Educational Institutions", "Healthcare Facilities", "Public Plazas"],
      image: "/assets/company/public-spaces.jpg"
    },
  ];

  // Enhanced Timeline Data with real project links and images
  const timeline = [
    { 
      year: "2017", 
      shortYear: "17",
      project: "Sax & Violin Lounge", 
      location: "Waterfront Mall, Karen",
      desc: "Landscape design and installation for a landmark restaurant redefining hospitality in Nairobi.",
      category: "Hospitality",
      image: "/assets/projects/SVL.jpg",
      gallery: [
        "/assets/projects/SVL-1.jpg",
        "/assets/projects/SVL-4.jpg",
        "/assets/projects/SVL-3.jpg",
        "/assets/projects/SVL-5.jpg",
      ],
      projectId: "sax-and-violins",
      hasProjectPage: true
    },
    { 
      year: "2019", 
      shortYear: "19",
      project: "The Hub Karen Mall", 
      location: "Karen, Nairobi",
      desc: "Maintenance of Kenya's first integrated retail and office park with an iconic central landscape.",
      category: "Commercial",
      image: "/assets/projects/hub-karen.jpg",
      gallery: [
        "/assets/projects/hub-karen-1.jpg",
        "/assets/projects/hub-karen-2.png",
        "/assets/projects/hub-karen-3.png",
        "/assets/projects/hub-karen-4.png",
      ],
      projectId: "hub-karen",
      hasProjectPage: true
    },
    { 
      year: "2020", 
      shortYear: "20",
      project: "Nairobi Kitchen Street Hotel", 
      location: "Westlands, Nairobi",
      desc: "Design, installation, and maintenance of a modern 4-star hotel landscape.",
      category: "Hospitality",
      image: "/assets/projects/NSK.png",
      gallery: [
        "/assets/projects/nsk-1.jpg",
        "/assets/projects/nsk-2.jpg",
        "/assets/projects/nsk-3.jpg",
        "/assets/projects/nsk-4.jpg",
      ],
      projectId: "NSK",
      hasProjectPage: true
    },
    { 
      year: "2022", 
      shortYear: "22",
      project: "Kipchoge Keino Library", 
      location: "Kapsabet",
      desc: "Educational landscape celebrating heritage and place identity.",
      category: "Institutional",
      image: "/assets/projects/kipchoge-library.jpg",
      gallery: [
        "/assets/projects/KHS-1.jpg",
        "/assets/projects/KHS-2.jpg",
        "/assets/projects/KHS-3.jpg",
        "/assets/projects/KHS-4.jpg",
      ],
      projectId: "kapsisiywa-high-school",
      hasProjectPage: true
    },
    { 
      year: "2023", 
      shortYear: "23",
      project: "Kakamega Pride-Inn Resort", 
      location: "Kakamega",
      desc: "Ongoing installation and maintenance — merging tropical ecology with luxury design.",
      category: "Hospitality",
      image: "/assets/company/gallery-5.jpg",
      gallery: [
        "/assets/company/gallery-5.jpg",
        "/assets/company/gallery-6.jpg",
        "/assets/company/gallery-7.jpg",
      ],
      projectId: null,
      hasProjectPage: false
    },
    { 
      year: "2024", 
      shortYear: "24",
      project: "Dale Suites Bungoma", 
      location: "Bungoma",
      desc: "Installation, maintenance and post installation maintenance.",
      category: "Residential",
      image: "/assets/company/gallery-6.jpg",
      gallery: [
        "/assets/company/gallery-6.jpg",
        "/assets/company/gallery-7.jpg",
        "/assets/company/gallery-8.jpg",
      ],
      projectId: null,
      hasProjectPage: false
    },
    { 
      year: "2025", 
      shortYear: "25",
      project: "Joyland Serviced Apartments", 
      location: "Nairobi",
      desc: "Installation, maintenance and post installation maintenance.",
      category: "Residential",
      image: "/assets/company/gallery-7.jpg",
      gallery: [
        "/assets/company/gallery-7.jpg",
        "/assets/company/gallery-8.jpg",
        "/assets/company/gallery-9.jpg",
      ],
      projectId: null,
      hasProjectPage: false
    },
  ];

  const team = [
    { name: "John Shamala Mulievi", role: "Principal Landscape Architect & Founder", email: "john@shamalandscapes.co.ke", img: "/assets/team/lead-architect.jpeg" },
    { name: "Noel Syambi", role: "Architectural Designer and Landscape Draughtsperson", email: "nsyambi@shamalandscapes.co.ke", img: "/assets/team/project-coordinator.jpg" },
    { name: "Gabriel Wanjala", role: "Architectural Designer and Landscape Specialist", email: "gabriel@shamalandscapes.co.ke", img: "/assets/team/ecologist.jpeg" },
    { name: "Millicent Adhiambo", role: "Landscape Architect", email: "millicent@shamalandscapes.co.ke", img: "/assets/team/businesswoman.png" },
    { name: "Shama Landscapes Team", role: "Development Team", desc: "Landscape architects, horticulturists, engineers, and artisans", img: "/assets/team/people-together.png" },
  ];

  const galleryImages = [
    "/assets/company/gallery-1.png",
    "/assets/company/gallery-2.jpg",
    "/assets/company/gallery-3.jpg",
    "/assets/company/gallery-4.jpg",
    "/assets/company/gallery-5.jpg",
    "/assets/company/gallery-6.jpg",
    "/assets/company/gallery-7.jpg",
    "/assets/company/gallery-8.jpg",
    "/assets/company/gallery-9.jpg",
    "/assets/company/gallery-10.jpg",
    "/assets/company/gallery-11.png",
    "/assets/company/gallery-12.jpg"
  ];

  const teamImages = [
    "/assets/company/team-1.jpg",
    "/assets/company/team-2.jpg",
    "/assets/company/team-3.jpg",
    "/assets/company/team-4.jpg"
  ];

  const getCategoryColor = (category) => {
    const colors = {
      "Hospitality": "#BD7563",
      "Commercial": "#3596D5",
      "Institutional": "#E9C46A",
      "Residential": "#0F7F40"
    };
    return colors[category] || "#264653";
  };

  return (
    <section className="bg-[#FDFCF8] text-[#1a1a1a] font-montserrat">

      {/* Hero Section */}
      <motion.div className="relative flex items-center justify-center min-h-screen pt-20 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
        <div className="absolute inset-0 z-0">
          <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 10, ease: "linear" }} className="absolute inset-0 bg-[url('/assets/hero-profile.jpeg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-[#FDFCF8]" />
        </div>
        <div className="relative z-10 max-w-4xl px-6 text-center text-white">
          <motion.span initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="inline-block px-4 py-2 mb-6 text-sm font-semibold tracking-widest uppercase rounded-full bg-white/20 backdrop-blur-sm">Our Story</motion.span>
          <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.1 }} className="mb-6 text-5xl font-black leading-tight md:text-6xl lg:text-7xl">Shama <span className="text-[#E9C46A]">Landscapes</span></motion.h1>
          <motion.div initial={{ width: 0 }} animate={{ width: 96 }} transition={{ duration: 1, delay: 0.5 }} className="w-24 h-1 mx-auto mb-6 rounded-full bg-linear-to-r from-shama-green to-shama-blue" />
          <motion.p initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.2, delay: 0.3 }} className="max-w-2xl mx-auto text-xl leading-relaxed text-white/90">Crafting sustainable, inspiring landscapes that harmonize people, place, and planet through innovative design and environmental stewardship.</motion.p>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.8 }} className="absolute -translate-x-1/2 bottom-8 left-1/2">
          <div className="animate-bounce"><ChevronDown size={32} className="text-white" /></div>
        </motion.div>
      </motion.div>

      {/* Stats Section */}
      <div className="relative py-16 bg-white border-b border-[#E8DCCA]/50">
        <div className="max-w-6xl px-6 mx-auto">
          <motion.div className="grid grid-cols-2 gap-8 md:grid-cols-4" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeIn} className="text-center group">
                <div className="flex justify-center mb-4 text-shama-green"><stat.icon size={24} /></div>
                <div className="mb-2 text-3xl font-black transition-transform duration-300 text-[#264653] group-hover:scale-110">{stat.number}</div>
                <div className="text-sm font-semibold tracking-wide text-gray-500 uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Introduction Section */}
      <motion.div id="about" className="max-w-6xl px-6 py-24 mx-auto" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div variants={slideInFromLeft}>
            <span className="text-sm font-semibold tracking-widest uppercase text-shama-green">Who We Are</span>
            <h2 className="mb-6 text-4xl font-bold leading-tight text-[#264653] md:text-5xl">We Design for <span className="italic text-shama-green">Connection</span></h2>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-gray-600"><strong className="text-[#264653]">Shama Landscape Architects Ltd</strong> stands at the intersection of artistry, ecology, and innovation. As a premier Kenyan-based design practice, we transform outdoor spaces into living ecosystems that inspire connection and promote environmental resilience.</p>
              <motion.blockquote className="p-6 italic border-l-4 bg-[#E8DCCA]/30 rounded-r-2xl border-shama-green" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                <p className="text-xl text-shama-green">"Shama was born from a simple belief — that the land itself is the first architect."</p>
                <cite className="block mt-4 not-italic font-semibold text-[#264653]">— John Shamala Mulievi, Founder</cite>
              </motion.blockquote>
              <p className="text-lg leading-relaxed text-gray-600">Our multidisciplinary team of landscape architects, horticultural specialists, and environmental designers brings a unique fusion of global expertise and local understanding to every project across East Africa.</p>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center justify-center w-12 h-12 text-white rounded-full bg-shama-green"><Users size={24} /></div>
                <div><div className="font-semibold text-[#264653]">Hands-On Approach</div><div className="text-sm text-gray-500">From consultation to completion, we partner with you through every phase.</div></div>
              </div>
            </div>
          </motion.div>
          <motion.div className="relative" variants={scaleIn}>
            <div className="grid grid-cols-2 gap-4">
              {teamImages.map((img, index) => (
                <div key={index} className="overflow-hidden shadow-lg aspect-square rounded-2xl">
                  <img src={img} alt={`Shama Team ${index + 1}`} className="object-cover w-full h-full transition-transform duration-500 hover:scale-110" />
                </div>
              ))}
            </div>
            <div className="absolute w-24 h-24 rounded-full -top-4 -right-4 bg-shama-green/10 -z-10" />
            <div className="absolute w-16 h-16 rounded-full -bottom-4 -left-4 bg-shama-blue/10 -z-10" />
          </motion.div>
        </div>
      </motion.div>

      {/* Vision & Mission Section */}
      <div className="relative py-20 overflow-hidden bg-[#264653] text-white">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-shama-green/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-shama-terra/10 blur-[100px]" />
        <div className="relative max-w-6xl px-6 mx-auto">
          <motion.div className="grid grid-cols-1 gap-8 md:grid-cols-2" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={fadeIn} className="relative p-8 overflow-hidden transition-colors border bg-white/5 backdrop-blur-sm border-white/10 rounded-3xl hover:bg-white/10">
              <div className="flex items-center gap-4 mb-6"><div className="flex items-center justify-center w-12 h-12 text-[#264653] bg-[#E9C46A] rounded-xl"><Target size={24} /></div><h2 className="text-3xl font-bold">Our Vision</h2></div>
              <p className="relative z-10 text-lg leading-relaxed text-gray-300">To pioneer a new era of landscape architecture where every designed space becomes a living testament to sustainability, beauty, and human connection — creating legacies that inspire generations to come.</p>
            </motion.div>
            <motion.div variants={fadeIn} className="relative p-8 overflow-hidden transition-colors border bg-white/5 backdrop-blur-sm border-white/10 rounded-3xl hover:bg-white/10">
              <div className="flex items-center gap-4 mb-6"><div className="flex items-center justify-center w-12 h-12 text-white bg-shama-green rounded-xl"><Leaf size={24} /></div><h2 className="text-3xl font-bold">Our Mission</h2></div>
              <p className="relative z-10 text-lg leading-relaxed text-gray-300">To design and deliver transformative landscape solutions that harmonize cultural identity with ecological intelligence, creating spaces that nurture communities, celebrate nature, and stand as benchmarks of sustainable excellence.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="py-20 bg-[#FDFCF8]">
        <div className="px-6 mx-auto max-w-7xl">
          <motion.div className="mb-16 text-center" variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-widest uppercase rounded-full text-shama-green bg-shama-green/10">Our Foundation</span>
            <h2 className="mb-6 text-4xl font-bold text-[#264653]">Core Values That <span className="text-shama-green">Define Us</span></h2>
            <div className="w-16 h-1 mx-auto rounded-full bg-linear-to-r from-shama-terra to-shama-blue" />
          </motion.div>
          <motion.div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {values.map((value) => (
              <motion.div key={value.title} variants={fadeIn} className="cursor-pointer group">
                <div className="h-full overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-lg rounded-2xl hover:shadow-xl hover:border-shama-green/30">
                  <div className="relative h-48 overflow-hidden">
                    <img src={value.image} alt={value.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 transition-colors duration-300 bg-black/20 group-hover:bg-black/10" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-center w-16 h-16 mb-4 text-white transition-transform duration-300 rounded-2xl group-hover:scale-110" style={{ backgroundColor: value.color }}><value.icon size={32} /></div>
                    <h3 className="mb-4 text-xl font-bold text-[#264653]">{value.title}</h3>
                    <p className="leading-relaxed text-gray-600">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Expertise Areas Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl px-6 mx-auto">
          <motion.div className="mb-16 text-center" variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-widest uppercase rounded-full text-shama-green bg-shama-green/10">Our Expertise</span>
            <h2 className="mb-6 text-4xl font-bold text-[#264653]">Specialized <span className="text-shama-green">Landscape Solutions</span></h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">From intimate residential gardens to large-scale civic spaces, our expertise spans the full spectrum of landscape architecture with a focus on sustainable, culturally relevant design.</p>
          </motion.div>
          <motion.div className="grid grid-cols-1 gap-8 md:grid-cols-3" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {expertiseAreas.map((area) => (
              <motion.div key={area.category} variants={fadeIn} className="group">
                <div className="h-full overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-lg rounded-2xl hover:shadow-xl">
                  <div className="relative h-48 overflow-hidden"><img src={area.image} alt={area.category} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" /></div>
                  <div className="p-6">
                    <h3 className="mb-6 text-xl font-bold text-[#264653]">{area.category}</h3>
                    <ul className="space-y-3">
                      {area.projects.map((project) => (<li key={project} className="flex items-center text-gray-600"><div className="w-2 h-2 mr-3 rounded-full bg-shama-green" />{project}</li>))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Process Section */}
      <motion.div className="max-w-6xl px-6 py-24 mx-auto" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <motion.div className="mb-16 text-center" variants={fadeIn}>
          <span className="text-sm font-semibold tracking-widest uppercase text-shama-green">Our Process</span>
          <h2 className="mt-2 mb-4 text-4xl font-bold text-[#264653]">End-to-End Landscape Solutions</h2>
          <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-600">From initial concept to long-term maintenance, our comprehensive process ensures every project achieves its full potential.</p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Site Visit & Analysis", desc: "Understanding the land's opportunities and patterns before design begins.", icon: "📍" },
            { title: "Scheme Design", desc: "Early-stage concepts and cost planning tailored to client needs.", icon: "📐" },
            { title: "Detailed Design", desc: "Refined plans and planting schemes translating vision into construction.", icon: "🎨" },
            { title: "Installation", desc: "Execution by skilled site professionals with constant design oversight.", icon: "🛠️" },
            { title: "Maintenance", desc: "Ongoing care to sustain ecological and visual integrity.", icon: "🌱" },
            { title: "Environmental Planning", desc: "Embedding water-wise, native, and regenerative strategies in every project.", icon: "♻️" },
          ].map((service, i) => (
            <motion.div key={service.title} className="p-8 transition-all duration-500 bg-white border-2 group border-[#E8DCCA] rounded-2xl hover:border-shama-green/50 hover:shadow-xl" variants={scaleIn} whileHover={{ scale: 1.03 }}>
              <div className="mb-4 text-4xl transition-transform duration-300 transform group-hover:scale-110">{service.icon}</div>
              <h3 className="mb-3 text-xl font-semibold text-shama-green">{service.title}</h3>
              <p className="leading-relaxed text-gray-600">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* MASTERPIECE TIMELINE SECTION - WITH REAL PROJECT LINKS */}
      <section className="py-24 bg-[#264653] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-shama-green/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-shama-terra/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 px-6 mx-auto max-w-7xl">
          <motion.div className="mb-16 text-center" variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-widest uppercase rounded-full text-[#E9C46A] bg-[#E9C46A]/20">Our Journey</span>
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">A Decade of Growth <span className="text-[#E9C46A]">& Impact</span></h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-300">From our first project in 2017 to today, explore the milestones that have shaped Shama Landscapes.</p>
          </motion.div>

          {/* Interactive Timeline Container */}
          <div className="relative">
            {/* Main Timeline Line - Hidden on mobile, shown on desktop */}
            <div className="absolute left-0 right-0 hidden h-1 transform -translate-y-1/2 lg:block top-1/2 bg-linear-to-r from-transparent via-shama-green to-transparent" />
            
            {/* Timeline Items - Horizontal Scroll on Desktop */}
            <div className="space-y-8 lg:grid lg:grid-cols-7 lg:gap-4 lg:space-y-0">
              {timeline.map((event, index) => (
                <motion.div
                  key={event.year}
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                  onMouseEnter={() => setHoveredYear(index)}
                  onMouseLeave={() => setHoveredYear(null)}
                >
                  {/* Desktop Layout */}
                  <div className="flex-col items-center hidden lg:flex">
                    {/* Year Badge - Clickable */}
                    {event.hasProjectPage ? (
                      <Link href={`/projects/${event.projectId}`}>
                        <div className={`
                          relative z-10 w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500 cursor-pointer
                          ${hoveredYear === index 
                            ? 'bg-[#E9C46A] text-[#264653] scale-110 shadow-lg shadow-[#E9C46A]/30' 
                            : 'bg-shama-green text-white hover:scale-105'}
                        `}>
                          {event.shortYear}
                        </div>
                      </Link>
                    ) : (
                      <div className={`
                        relative z-10 w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500
                        ${hoveredYear === index 
                          ? 'bg-[#E9C46A] text-[#264653] scale-110 shadow-lg shadow-[#E9C46A]/30' 
                          : 'bg-shama-green text-white'}
                      `}>
                        {event.shortYear}
                      </div>
                    )}
                    
                    {/* Connector Line */}
                    <div className={`
                      w-0.5 h-12 transition-all duration-500 my-2
                      ${hoveredYear === index ? 'bg-[#E9C46A] h-16' : 'bg-shama-green/30'}
                    `} />
                    
                    {/* Content Card */}
                    <div className={`
                      relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 w-full transition-all duration-500 overflow-hidden
                      ${hoveredYear === index ? 'bg-white/10 border-[#E9C46A]/50 transform -translate-y-2' : 'hover:bg-white/10'}
                    `}>
                      {/* Project Image */}
                      <div className="relative mb-3 overflow-hidden rounded-lg aspect-video">
                        <img 
                          src={event.image} 
                          alt={event.project} 
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        />
                        {event.hasProjectPage && (
                          <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 bg-black/40 group-hover:opacity-100">
                            <Link 
                              href={`/projects/${event.projectId}`}
                              className="px-4 py-2 bg-[#E9C46A] text-[#264653] rounded-full font-semibold text-sm flex items-center gap-2 hover:scale-90 transition-transform"
                            >
                              View Project <ExternalLink size={6} />
                            </Link>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span 
                          className="px-2 py-1 text-xs font-semibold rounded-full"
                          style={{ backgroundColor: `${getCategoryColor(event.category)}30`, color: getCategoryColor(event.category) }}
                        >
                          {event.category}
                        </span>
                      </div>
                      <h3 className="mb-1 text-sm font-bold leading-tight text-white">
                        {event.hasProjectPage ? (
                          <Link href={`/projects/${event.projectId}`} className="hover:text-[#E9C46A] transition-colors">
                            {event.project}
                          </Link>
                        ) : (
                          event.project
                        )}
                      </h3>
                      <p className="mb-2 text-xs text-gray-400">{event.location}</p>
                      
                      {/* Expanded Content on Hover */}
                      <AnimatePresence>
                        {hoveredYear === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-2 mt-2 border-t border-white/10">
                              <p className="mb-3 text-xs leading-relaxed text-gray-300">{event.desc}</p>
                              {event.hasProjectPage && (
                                <Link 
                                  href={`/projects/${event.projectId}`}
                                  className="inline-flex items-center gap-1 text-[#E9C46A] text-xs font-semibold hover:underline"
                                >
                                  See full project <ArrowRight size={12} />
                                </Link>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Mobile Layout - Vertical Timeline */}
                  <div className="flex gap-4 lg:hidden">
                    <div className="flex flex-col items-center">
                      {event.hasProjectPage ? (
                        <Link href={`/projects/${event.projectId}`}>
                          <div className={`
                            w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0 cursor-pointer
                            ${hoveredYear === index ? 'bg-[#E9C46A] text-[#264653]' : 'bg-shama-green text-white'}
                          `}>
                            {event.year}
                          </div>
                        </Link>
                      ) : (
                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0
                          ${hoveredYear === index ? 'bg-[#E9C46A] text-[#264653]' : 'bg-shama-green text-white'}
                        `}>
                          {event.year}
                        </div>
                      )}
                      {index !== timeline.length - 1 && (
                        <div className="w-0.5 flex-1 bg-shama-green/30 my-2" />
                      )}
                    </div>
                    <div 
                      className={`
                        flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 transition-all overflow-hidden
                        ${hoveredYear === index ? 'border-[#E9C46A]/50' : ''}
                      `}
                    >
                      {/* Project Image */}
                      <div className="relative mb-3 overflow-hidden rounded-lg aspect-video">
                        <img 
                          src={event.image} 
                          alt={event.project} 
                          className="object-cover w-full h-full"
                        />
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <span 
                          className="px-2 py-1 text-xs font-semibold rounded-full"
                          style={{ backgroundColor: `${getCategoryColor(event.category)}30`, color: getCategoryColor(event.category) }}
                        >
                          {event.category}
                        </span>
                        {event.hasProjectPage && (
                          <Link href={`/projects/${event.projectId}`}>
                            <ExternalLink size={16} className="text-[#E9C46A]" />
                          </Link>
                        )}
                      </div>
                      <h3 className="mb-1 font-bold text-white">
                        {event.hasProjectPage ? (
                          <Link href={`/projects/${event.projectId}`} className="hover:text-[#E9C46A] transition-colors">
                            {event.project}
                          </Link>
                        ) : (
                          event.project
                        )}
                      </h3>
                      <p className="mb-1 text-sm text-gray-400">{event.location}</p>
                      <p className="text-sm leading-relaxed text-gray-300">{event.desc}</p>
                      {event.hasProjectPage && (
                        <Link 
                          href={`/projects/${event.projectId}`}
                          className="inline-flex items-center gap-1 text-[#E9C46A] text-sm font-semibold mt-3 hover:underline"
                        >
                          View full project <ArrowRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Category Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-12">
              {["Hospitality", "Commercial", "Institutional", "Residential"].map((cat) => (
                <div key={cat} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getCategoryColor(cat) }} />
                  <span className="text-sm text-gray-400">{cat}</span>
                </div>
              ))}
            </div>

            {/* View All Projects Button */}
            <div className="mt-12 text-center">
              <Link 
                href="/projects"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#E9C46A] text-[#264653] rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                View All Projects <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <motion.div id="team" className="py-24 bg-[#E8DCCA]/20" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <div className="max-w-6xl px-6 mx-auto">
          <motion.div className="mb-16 text-center" variants={fadeIn}>
            <span className="text-sm font-semibold tracking-widest uppercase text-shama-green">Meet Our Experts</span>
            <h2 className="mt-2 text-4xl font-bold text-[#264653]">Our Leadership Team</h2>
            <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-600">Led by <strong>John Shamala Mulievi</strong>, our multidisciplinary team works collaboratively to shape environments that nurture both people and planet.</p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {team.map((member, i) => (
              <motion.div key={member.name} className="overflow-hidden text-center transition-all duration-500 bg-white shadow-lg group rounded-2xl hover:shadow-xl" variants={scaleIn} whileHover={{ y: -8 }}>
                <div className="relative h-64 overflow-hidden">
                  <img src={member.img} alt={member.name} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-linear-to-t from-[#264653]/60 to-transparent group-hover:opacity-100" />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-[#264653]">{member.name}</h3>
                  <p className="mb-3 font-medium text-shama-green">{member.role}</p>
                  {member.email ? (<a href={`mailto:${member.email}`} className="inline-block text-sm underline transition-colors duration-300 text-shama-blue hover:text-shama-green">{member.email}</a>) : (<p className="text-sm text-gray-500">{member.desc}</p>)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Gallery Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl px-6 mx-auto">
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12 text-center">
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-widest uppercase rounded-full text-shama-green bg-shama-green/10">Our Work</span>
            <h2 className="mb-6 text-4xl font-bold text-[#264653]">Visual <span className="text-shama-green">Portfolio</span></h2>
            <div className="w-16 h-1 mx-auto rounded-full bg-linear-to-r from-shama-terra to-shama-blue" />
          </motion.div>
          <motion.div className="grid grid-cols-2 gap-4 md:grid-cols-4" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {galleryImages.map((image, index) => (
              <motion.div key={index} variants={fadeIn} className="overflow-hidden shadow-md cursor-pointer aspect-square rounded-2xl group">
                <img src={image} alt={`Shama Project ${index + 1}`} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-20 bg-[#FDFCF8]">
        <div className="max-w-4xl px-6 mx-auto text-center">
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-widest uppercase rounded-full text-shama-green bg-shama-green/10">Why Choose Shama</span>
            <h2 className="mb-6 text-4xl font-bold text-[#264653]">The Shama <span className="text-shama-green">Difference</span></h2>
            <div className="w-16 h-1 mx-auto mb-8 rounded-full bg-linear-to-r from-shama-terra to-shama-blue" />
            <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-3">
              {[
                { title: "Local Expertise, Global Standards", description: "Deep understanding of East African ecology with international design excellence" },
                { title: "End-to-End Service", description: "From initial concept to final planting - we handle every detail" },
                { title: "Sustainable Innovation", description: "Pioneering eco-friendly solutions that reduce environmental impact" }
              ].map((item, index) => (
                <div key={item.title} className="p-6 text-center transition-shadow bg-white shadow-sm rounded-2xl hover:shadow-md">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 font-bold text-white rounded-full bg-shama-green">{index + 1}</div>
                  <h4 className="mb-3 font-bold text-[#264653]">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div className="relative py-24 overflow-hidden text-white" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}>
        <div className="absolute inset-0 bg-linear-to-br from-[#264653] via-shama-green to-shama-terra" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="relative max-w-4xl px-6 mx-auto text-center">
          <motion.blockquote className="mb-8 text-2xl italic leading-relaxed md:text-3xl text-white/90" initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            "At Shama Landscape Architects, we don't just design spaces — we design relationships between people and the land they call home."
          </motion.blockquote>
          <motion.div className="flex flex-col items-center justify-center gap-4 sm:flex-row" initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
            <Link href="/projects" className="inline-flex items-center px-8 py-4 font-semibold text-white transition-all duration-300 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 hover:shadow-xl hover:scale-105">
              Discover Our Work <ArrowRight size={20} className="ml-2" />
            </Link>
            <Link href="/contact" className="inline-flex items-center px-8 py-4 font-semibold transition-all duration-300 bg-[#E9C46A] rounded-full shadow-2xl text-[#264653] hover:shadow-xl hover:scale-105">
              Start Your Project
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}