"use client";
import React from "react";
import { motion } from "framer-motion";
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

export default function CompanyProfile() {
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
      color: "#2A9D8F",
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
      icon: "",
      image: "/assets/company/residential-expertise.jpg"
    },
    {
      category: "Commercial Innovation",
      projects: ["Hotel & Resort Landscaping", "Office Complexes", "Shopping Centers", "Mixed-Use Developments"],
      icon: "",
      image: "/assets/company/commercial-projects.jpg"
    },
    {
      category: "Public & Civic Spaces",
      projects: ["Parks & Recreation", "Educational Institutions", "Healthcare Facilities", "Public Plazas"],
      icon: "",
      image: "/assets/company/public-spaces.jpg"
    },
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
      <div className="relative h-[80vh] flex items-center justify-center bg-cover bg-center bg-fixed overflow-hidden"
           style={{ backgroundImage: "url('/assets/hero-profile.jpeg')" }}>
        
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
            Our Story
          </span>
          <h1 className="mb-6 text-5xl font-black leading-tight md:text-6xl lg:text-7xl">
            Shama <span className="text-shama-blue">Landscapes</span>
          </h1>
          <div className="w-24 h-1 mx-auto mb-8 rounded-full bg-gradient-to-r from-shama-green to-shama-blue" />
          <p className="max-w-2xl mx-auto text-xl leading-relaxed text-white/90">
            Crafting sustainable, inspiring landscapes that harmonize people, place, and planet 
            through innovative design and environmental stewardship.
          </p>
        </motion.div>
      </div>

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
            {stats.map((stat, index) => (
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

      {/* About Section with Team Images */}
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
              Who We Are
            </span>
            <h2 className="mb-6 text-4xl font-bold leading-tight text-shama-blue">
              Redefining Landscape <br />Architecture in East Africa
            </h2>
            
            {/* Team Image Grid */}
            <div className="grid grid-cols-2 gap-4 mt-8">
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
          </motion.div>
          
          <motion.div variants={fadeIn} className="space-y-6">
            <p className="text-lg leading-relaxed text-shama-black/80">
              <strong>Shama Landscape Architects Ltd</strong> stands at the intersection of 
              artistry, ecology, and innovation. As a premier Kenyan-based design practice, 
              we transform outdoor spaces into living ecosystems that inspire connection 
              and promote environmental resilience.
            </p>
            <p className="text-lg leading-relaxed text-shama-black/80">
              Our multidisciplinary team of landscape architects, horticultural specialists, 
              and environmental designers brings a unique fusion of global expertise and 
              local understanding to every project across East Africa.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center justify-center w-12 h-12 text-white rounded-full bg-shama-green">
                <Users size={40} />
              </div>
              <div>
                <div className="font-semibold text-shama-blue">Hands-On Approach</div>
                <div className="text-sm text-shama-black/70">From initial consultation and site analysis to final planting and maintenance guidance, we partner with you through every phase. Our hands-on approach ensures design integrity, quality control, and your complete satisfaction at every milestone.</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Vision & Mission with Background Images */}
      <div className="relative py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-shama-clay/5" />
        
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
              {/* Background Image for Vision */}
              <div 
                className="absolute inset-0 transition-opacity duration-500 bg-center bg-cover opacity-10 group-hover:opacity-20"
                style={{ backgroundImage: "url('/assets/company/vision-bg.jpg')" }}
              />
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 text-white bg-shama-green rounded-xl">
                    <Target size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-shama-blue">
                    Our Vision
                  </h2>
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
              {/* Background Image for Mission */}
              <div 
                className="absolute inset-0 transition-opacity duration-500 bg-center bg-cover opacity-10 group-hover:opacity-20"
                style={{ backgroundImage: "url('/assets/company/mission-bg.jpg')" }}
              />
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 text-white bg-shama-blue rounded-xl">
                    <Leaf size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-shama-blue">
                    Our Mission
                  </h2>
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

      {/* Core Values with Images */}
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
            <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-[#BD7563] to-[#3596D5] rounded-full" />
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                variants={fadeIn}
                className="cursor-pointer group"
              >
                <div className="h-full overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-lg rounded-2xl hover:shadow-xl hover:border-shama-green/30">
                  {/* Value Image */}
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

      {/* Expertise Areas with Project Images */}
      <div className="py-20 bg-gradient-to-b from-shama-clay/5 to-white">
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
            {expertiseAreas.map((area, index) => (
              <motion.div
                key={area.category}
                variants={fadeIn}
                className="group"
              >
                <div className="h-full overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-lg rounded-2xl hover:shadow-xl">
                  {/* Expertise Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={area.image}
                      alt={area.category}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute p-2 text-3xl rounded-lg top-4 left-4 bg-white/90">
                      {area.icon}
                    </div>
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

      {/* Image Gallery Section */}
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
            <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-[#BD7563] to-[#3596D5] rounded-full" />
          </motion.div>

          {/* Image Gallery Grid */}
          <motion.div 
            className="grid grid-cols-2 gap-4 md:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
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
            ].map((image, index) => (
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

      {/* Unique Selling Proposition */}
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
            <div className="w-16 h-0.5 mx-auto mb-8 bg-gradient-to-r from-[#BD7563] to-[#3596D5] rounded-full" />
            
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
        <div className="absolute inset-0 bg-gradient-to-br from-shama-blue via-shama-green to-shama-terra" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-white [mask-image:linear-gradient(0deg,white,transparent)]" />
        </div>

        <div className="relative max-w-4xl px-6 mx-auto text-center">
          <h2 className="mb-6 text-4xl font-bold">
            Ready to Create Something Extraordinary?
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-xl text-white/90">
            Let's collaborate to transform your vision into a sustainable, beautiful reality 
            that stands the test of time.
          </p>
          <motion.a
            href="/contact"
            className="inline-flex items-center px-8 py-4 font-semibold transition-all duration-300 bg-white rounded-lg shadow-2xl group text-shama-blue hover:shadow-3xl hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Journey With Us
            <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
