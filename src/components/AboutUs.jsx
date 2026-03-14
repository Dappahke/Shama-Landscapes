"use client";
import React from "react";
import { motion } from "framer-motion";
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
  ArrowRight
} from "lucide-react";

export default function AboutUs() {
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
    { number: "50+", label: "Projects Completed", icon: <Award size={24} /> },
    { number: "12+", label: "Years Experience", icon: <Calendar size={24} /> },
    { number: "10+", label: "Cities Served", icon: <MapPin size={24} /> },
    { number: "98%", label: "Client Satisfaction", icon: <Star size={24} /> },
  ];

  const values = [
    {
      icon: <HeartHandshake size={32} />,
      title: "Integrity First",
      description: "We build lasting relationships through transparency, honesty, and unwavering commitment to our promises.",
      color: "#0F7F40",
      image: "/assets/company/integrity-team.jpg"
    },
    {
      icon: <Lightbulb size={32} />,
      title: "Creative Innovation",
      description: "Every space tells a unique story through innovative design that blends art, ecology, and human experience.",
      color: "#BD7563",
      image: "/assets/company/creative-process.jpg"
      
    },
    {
      icon: <Leaf size={32} />,
      title: "Sustainable Legacy",
      description: "We design for generations, prioritizing environmental stewardship and long-term ecological balance.",
      color: "#3596D5",
      image: "/assets/company/sustainable-design.jpg"
    },
    {
      icon: <Users size={32} />,
      title: "Collaborative Spirit",
      description: "Your vision + our expertise = extraordinary results. We're partners in creating your ideal space.",
      color: "#E9C46A",
      image: "/assets/company/collaboration.jpg"
    },
    {
      icon: <Target size={32} />,
      title: "Excellence in Execution",
      description: "From concept to completion, we maintain the highest standards of quality and attention to detail.",
      color: "#264653",
      image: "/assets/company/quality-work.png"
    },
    {
      icon: <Award size={32} />,
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

  const timeline = [
    {
      year: "2017",
      project: "Sax & Violin Lounge, Waterfront Mall, Karen",
      desc: "Landscape design and installation for a landmark restaurant redefining hospitality in Nairobi.",
    },
    {
      year: "2019",
      project: "The Hub Karen Mall",
      desc: "Maintenance of Kenya's first integrated retail and office park with an iconic central landscape.",
    },
    {
      year: "2020",
      project: "Nairobi Kitchen Street Hotel, Westlands",
      desc: "Design, installation, and maintenance of a modern 4-star hotel landscape.",
    },
    {
      year: "2022",
      project: "Kipchoge Keino Library, Kapsabet",
      desc: "Educational landscape celebrating heritage and place identity.",
    },
    {
      year: "2023",
      project: "Kakamega Pride-Inn Resort and Hotel",
      desc: "Ongoing installation and maintenance — merging tropical ecology with luxury design.",
    },
    {
      year: "2024",
      project: "Dale Suites Bungoma",
      desc: "Installation, maintenance and post installation maintenance.",
    },
    {
      year: "2025",
      project: "Joyland Serviced Apartments",
      desc: "Installation, maintenance and post installation maintenance.",
    },
  ];

  const team = [
    {
      name: "John Shamala Mulievi",
      role: "Principal Landscape Architect & Founder",
      email: "john@shamalandscapes.co.ke",
      img: "/assets/team/lead-architect.jpeg",
    },
    {
      name: "Noel Syambi",
      role: "Architectural Designer and Landscape Draughtsperson",
      email: "nsyambi@shamalandscapes.co.ke",
      img: "/assets/team/project-coordinator.jpg",
    },
    {
      name: "Gabriel Wanjala",
      role: "Architectural Designer and Landscape Specialist",
      email: "gabriel@shamalandscapes.co.ke",
      img: "/assets/team/ecologist.jpeg",
    },
    {
      name: "Millicent Adhiambo",
      role: "Landscape Architect",
      email: "millicent@shamalandscapes.co.ke",
      img: "/assets/team/businesswoman.png",
    },
    {
      name: "Shama Landscapes Team",
      role: "Development Team",
      desc: "Landscape architects, horticulturists, engineers, and artisans",
      img: "/assets/team/people-together.png",
    },
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

  return (
    <section className="bg-white text-shama-black font-montserrat">
      {/* Hero Section */}
      <motion.div
        className="relative flex items-center justify-center min-h-[80vh] bg-fixed bg-center bg-cover overflow-hidden"
        style={{ backgroundImage: "url('/assets/hero-profile.jpeg')" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
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

        <div className="relative z-10 max-w-4xl px-6 text-center text-white">
          <motion.span 
            className="inline-block px-4 py-2 mb-6 text-sm font-semibold tracking-widest uppercase rounded-full bg-white/20 backdrop-blur-sm"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Our Story
          </motion.span>
          
          <motion.h1
            className="mb-6 text-5xl font-black leading-tight md:text-6xl lg:text-7xl"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.1 }}
          >
            Shama <span className="text-shama-blue">Landscapes</span>
          </motion.h1>
          
          <motion.div
            className="w-24 h-1 mx-auto mb-6 rounded-full bg-linear-to-r from-shama-green to-shama-blue"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          
          <motion.p
            className="max-w-2xl mx-auto text-xl leading-relaxed text-white/90"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            Crafting sustainable, inspiring landscapes that harmonize people, place, and planet 
            through innovative design and environmental stewardship.
          </motion.p>
        </div>
        
        {/* Scroll indicator */}
        <motion.div
          className="absolute transform -translate-x-1/2 bottom-8 left-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <div className="animate-bounce">
            <div className="flex justify-center w-6 h-10 border-2 border-white rounded-full">
              <div className="w-1 h-3 mt-2 bg-white rounded-full" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Stats Section */}
      <div className="relative py-16 bg-white border-b border-shama-clay/20">
        <div className="max-w-6xl px-6 mx-auto">
          <motion.div 
            className="grid grid-cols-2 gap-8 md:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeIn}
                className="text-center group"
              >
                <div className="flex justify-center mb-4 text-shama-green">
                  {stat.icon}
                </div>
                <div className="mb-2 text-3xl font-black transition-transform duration-300 text-shama-blue group-hover:scale-110">
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

      {/* Introduction Section */}
      <motion.div
        className="max-w-6xl px-6 py-24 mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div variants={slideInFromLeft}>
            <span className="text-sm font-semibold tracking-widest uppercase text-shama-green">
              Who We Are
            </span>
            <h2 className="mb-6 text-4xl font-bold leading-tight text-shama-blue md:text-5xl">
              We Design for <span className="italic">Connection</span>
            </h2>
            
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-shama-black/80">
                <strong className="text-shama-green">Shama Landscape Architects Ltd</strong> stands at the intersection of 
                artistry, ecology, and innovation. As a premier Kenyan-based design practice, 
                we transform outdoor spaces into living ecosystems that inspire connection 
                and promote environmental resilience.
              </p>

              <motion.blockquote 
                className="p-6 italic border-l-4 bg-shama-clay/20 rounded-2xl border-shama-green"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-xl text-shama-green">
                  "Shama was born from a simple belief — that the land itself is the first architect."
                </p>
                <cite className="block mt-4 not-italic font-semibold text-shama-blue">
                  — John Shamala Mulievi, Founder
                </cite>
              </motion.blockquote>

              <p className="text-lg leading-relaxed text-shama-black/80">
                Our multidisciplinary team of landscape architects, horticultural specialists, 
                and environmental designers brings a unique fusion of global expertise and 
                local understanding to every project across East Africa.
              </p>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center justify-center w-12 h-12 text-white rounded-full bg-shama-green">
                  <Users size={24} />
                </div>
                <div>
                  <div className="font-semibold text-shama-blue">Hands-On Approach</div>
                  <div className="text-sm text-shama-black/70">From consultation to completion, we partner with you through every phase.</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="relative" variants={scaleIn}>
            {/* Team Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              {teamImages.map((img, index) => (
                <div key={index} className="overflow-hidden aspect-square rounded-2xl">
                  <img
                    src={img}
                    alt={`Shama Team ${index + 1}`}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                  />
                </div>
              ))}
            </div>
            {/* Decorative elements */}
            <div className="absolute w-24 h-24 rounded-full -top-4 -right-4 bg-shama-green/10" />
            <div className="absolute w-16 h-16 rounded-full -bottom-4 -left-4 bg-shama-blue/10" />
          </motion.div>
        </div>
      </motion.div>

      {/* Vision & Mission Section */}
      <div className="relative py-20 overflow-hidden bg-shama-clay/5">
        <div className="relative max-w-6xl px-6 mx-auto">
          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              variants={fadeIn}
              className="relative p-8 overflow-hidden bg-white border-l-4 shadow-lg rounded-2xl border-shama-green group"
            >
              <div 
                className="absolute inset-0 transition-opacity duration-500 bg-center bg-cover opacity-10 group-hover:opacity-20"
                style={{ backgroundImage: "url('/assets/company/vision-bg.jpg')" }}
              />
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 text-white bg-shama-green rounded-xl">
                    <Target size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-shama-blue">Our Vision</h2>
                </div>
                <p className="relative z-10 text-lg leading-relaxed text-shama-black/80">
                  To pioneer a new era of landscape architecture where every designed space 
                  becomes a living testament to sustainability, beauty, and human connection — 
                  creating legacies that inspire generations to come.
                </p>
              </div>
            </motion.div>

            <motion.div 
              variants={fadeIn}
              className="relative p-8 overflow-hidden bg-white border-l-4 shadow-lg rounded-2xl border-shama-blue group"
            >
              <div 
                className="absolute inset-0 transition-opacity duration-500 bg-center bg-cover opacity-10 group-hover:opacity-20"
                style={{ backgroundImage: "url('/assets/company/mission-bg.jpg')" }}
              />
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 text-white bg-shama-blue rounded-xl">
                    <Leaf size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-shama-blue">Our Mission</h2>
                </div>
                <p className="relative z-10 text-lg leading-relaxed text-shama-black/80">
                  To design and deliver transformative landscape solutions that harmonize 
                  cultural identity with ecological intelligence, creating spaces that 
                  nurture communities, celebrate nature, and stand as benchmarks of 
                  sustainable excellence.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="py-20 bg-white">
        <div className="px-6 mx-auto max-w-7xl">
          <motion.div 
            className="mb-16 text-center"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-widest uppercase rounded-full text-shama-green bg-shama-green/10">
              Our Foundation
            </span>
            <h2 className="mb-6 text-4xl font-bold text-shama-blue">
              Core Values That <span className="text-shama-green">Define Us</span>
            </h2>
            <div className="w-16 h-0.5 mx-auto bg-linear-to-r from-shama-terra to-shama-blue rounded-full" />
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={fadeIn}
                className="cursor-pointer group"
              >
                <div className="h-full overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-lg rounded-2xl hover:shadow-xl hover:border-shama-green/30">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={value.image}
                      alt={value.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 transition-colors duration-300 bg-black/20 group-hover:bg-black/10" />
                  </div>
                  
                  <div className="p-6">
                    <div 
                      className="flex items-center justify-center w-16 h-16 mb-4 text-white transition-transform duration-300 rounded-2xl group-hover:scale-110"
                      style={{ backgroundColor: value.color }}
                    >
                      {value.icon}
                    </div>
                    <h3 className="mb-4 text-xl font-bold text-shama-blue">
                      {value.title}
                    </h3>
                    <p className="leading-relaxed text-shama-black/70">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Expertise Areas Section */}
      <div className="py-20 bg-linear-to-b from-shama-clay/5 to-white">
        <div className="max-w-6xl px-6 mx-auto">
          <motion.div 
            className="mb-16 text-center"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-widest uppercase rounded-full text-shama-green bg-shama-green/10">
              Our Expertise
            </span>
            <h2 className="mb-6 text-4xl font-bold text-shama-blue">
              Specialized <span className="text-shama-green">Landscape Solutions</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-shama-black/80">
              From intimate residential gardens to large-scale civic spaces, our expertise 
              spans the full spectrum of landscape architecture with a focus on sustainable, 
              culturally relevant design.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {expertiseAreas.map((area) => (
              <motion.div
                key={area.category}
                variants={fadeIn}
                className="group"
              >
                <div className="h-full overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-lg rounded-2xl hover:shadow-xl">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={area.image}
                      alt={area.category}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="mb-6 text-xl font-bold text-shama-blue">
                      {area.category}
                    </h3>
                    <ul className="space-y-3">
                      {area.projects.map((project) => (
                        <li key={project} className="flex items-center text-shama-black/70">
                          <div className="w-2 h-2 mr-3 rounded-full bg-shama-green" />
                          {project}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Process Section */}
      <motion.div
        className="max-w-6xl px-6 py-24 mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="mb-16 text-center" variants={fadeIn}>
          <span className="text-sm font-semibold tracking-widest uppercase text-shama-green">
            Our Process
          </span>
          <h2 className="mt-2 mb-4 text-4xl font-bold text-shama-blue">
            End-to-End Landscape Solutions
          </h2>
          <p className="max-w-3xl mx-auto text-lg leading-relaxed text-shama-black/80">
            From initial concept to long-term maintenance, our comprehensive process 
            ensures every project achieves its full potential.
          </p>
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
            <motion.div
              key={service.title}
              className="p-8 transition-all duration-500 bg-white border-2 group border-shama-clay/30 rounded-2xl hover:border-shama-green/50 hover:shadow-xl"
              variants={scaleIn}
              whileHover={{ scale: 1.03 }}
            >
              <div className="mb-4 text-4xl transition-transform duration-300 transform group-hover:scale-110">
                {service.icon}
              </div>
              <h3 className="mb-3 text-xl font-semibold text-shama-green">
                {service.title}
              </h3>
              <p className="leading-relaxed text-shama-black/70">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Timeline Section */}
      <motion.div
        className="py-24 bg-shama-blue/5"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-6xl px-6 mx-auto">
          <motion.div className="mb-16 text-center" variants={fadeIn}>
            <span className="text-sm font-semibold tracking-widest uppercase text-shama-green">
              Our Journey
            </span>
            <h2 className="mt-2 text-4xl font-bold text-shama-blue">
              A Decade of Growth and Impact
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute top-0 bottom-0 w-1 transform left-6 md:left-1/2 bg-shama-green/30 md:-translate-x-1/2" />
            
            {timeline.map((event, i) => (
              <motion.div
                key={event.year}
                className={`relative flex flex-col md:flex-row ${i % 2 === 0 ? 'md:flex-row-reverse' : ''} mb-12 md:mb-16`}
                variants={fadeIn}
              >
                <div className={`flex-1 md:flex-none md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className="mb-4 md:mb-0">
                    <span className="inline-block px-4 py-2 text-lg font-bold text-white rounded-full bg-shama-green">
                      {event.year}
                    </span>
                  </div>
                </div>

                <div className={`flex-1 md:w-1/2 ${i % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                  <div className="relative p-6 transition-all duration-500 bg-white shadow-lg rounded-2xl hover:shadow-xl">
                    <div className={`absolute top-6 ${i % 2 === 0 ? 'md:-left-12 -left-3' : 'md:-right-12 -right-3'} w-6 h-6 bg-shama-green rounded-full border-4 border-white`} />
                    
                    <h3 className="mb-2 text-xl font-bold text-shama-blue">
                      {event.project}
                    </h3>
                    <p className="leading-relaxed text-shama-black/70">
                      {event.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div
        className="py-24 bg-shama-clay/10"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-6xl px-6 mx-auto">
          <motion.div className="mb-16 text-center" variants={fadeIn}>
            <span className="text-sm font-semibold tracking-widest uppercase text-shama-green">
              Meet Our Experts
            </span>
            <h2 className="mt-2 text-4xl font-bold text-shama-blue">
              Our Leadership Team
            </h2>
            <p className="max-w-3xl mx-auto mt-4 text-lg text-shama-black/80">
              Led by <strong>John Shamala Mulievi</strong>, our multidisciplinary
              team works collaboratively to shape environments that nurture
              both people and planet.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                className="overflow-hidden text-center transition-all duration-500 bg-white shadow-lg group rounded-2xl hover:shadow-xl"
                variants={scaleIn}
                whileHover={{ y: -8 }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-linear-to-t from-shama-black/40 to-transparent group-hover:opacity-100" />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-shama-blue">
                    {member.name}
                  </h3>
                  <p className="mb-3 font-medium text-shama-green">
                    {member.role}
                  </p>
                  {member.email ? (
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-block text-sm underline transition-colors duration-300 text-shama-blue hover:text-shama-green"
                    >
                      {member.email}
                    </a>
                  ) : (
                    <p className="text-sm text-shama-black/70">{member.desc}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Gallery Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl px-6 mx-auto">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-widest uppercase rounded-full text-shama-green bg-shama-green/10">
              Our Work
            </span>
            <h2 className="mb-6 text-4xl font-bold text-shama-blue">
              Visual <span className="text-shama-green">Portfolio</span>
            </h2>
            <div className="w-16 h-0.5 mx-auto bg-linear-to-r from-shama-terra to-shama-blue rounded-full" />
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 gap-4 md:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="overflow-hidden cursor-pointer aspect-square rounded-2xl group"
              >
                <img
                  src={image}
                  alt={`Shama Project ${index + 1}`}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl px-6 mx-auto text-center">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-widest uppercase rounded-full text-shama-green bg-shama-green/10">
              Why Choose Shama
            </span>
            <h2 className="mb-6 text-4xl font-bold text-shama-blue">
              The Shama <span className="text-shama-green">Difference</span>
            </h2>
            <div className="w-16 h-0.5 mx-auto mb-8 bg-linear-to-r from-shama-terra to-shama-blue rounded-full" />
            
            <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-3">
              {[
                {
                  title: "Local Expertise, Global Standards",
                  description: "Deep understanding of East African ecology with international design excellence"
                },
                {
                  title: "End-to-End Service",
                  description: "From initial concept to final planting - we handle every detail"
                },
                {
                  title: "Sustainable Innovation",
                  description: "Pioneering eco-friendly solutions that reduce environmental impact"
                }
              ].map((item, index) => (
                <div key={item.title} className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white rounded-full bg-shama-green">
                    {index + 1}
                  </div>
                  <h4 className="mb-3 font-bold text-shama-blue">{item.title}</h4>
                  <p className="text-sm text-shama-black/70">{item.description}</p>
                </div>
              ))}
            </div>
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
        <div className="absolute inset-0 bg-linear-to-br from-shama-blue via-shama-green to-shama-terra" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IndoaXRlIi8+PC9zdmc+')] mask-[linear-gradient(0deg,white,transparent)]" />
        </div>

        <div className="relative max-w-4xl px-6 mx-auto text-center">
          <motion.blockquote
            className="mb-8 text-2xl italic leading-relaxed md:text-3xl text-white/90"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            "At Shama Landscape Architects, we don't just design spaces — we
            design relationships between people and the land they call home."
          </motion.blockquote>
          
          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              href="/projects"
              className="inline-flex items-center px-8 py-4 font-semibold text-white transition-all duration-300 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 hover:shadow-xl hover:scale-105"
            >
              Discover Our Work
              <ArrowRight size={20} className="ml-2" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 font-semibold transition-all duration-300 bg-white rounded-full shadow-2xl text-shama-blue hover:shadow-3xl hover:scale-105"
            >
              Start Your Project
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}