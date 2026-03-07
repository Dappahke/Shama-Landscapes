"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutUs() {
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

  return (
    <section className="bg-white text-shama-black font-montserrat">
      {/* Enhanced Hero Section */}
      <motion.div
        className="relative flex items-center justify-center min-h-[80vh] bg-fixed bg-center bg-cover"
        style={{ backgroundImage: "url('/assets/about-hero.jpg')" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-shama-blue/50 to-shama-green/40 backdrop-blur-[1px]" />
        <div className="relative z-10 max-w-4xl px-6 text-center text-white">
          <motion.h1
            className="mb-6 text-5xl font-extrabold md:text-7xl"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            About Us
          </motion.h1>
          <motion.div
            className="w-24 h-1 mx-auto mb-6 bg-shama-green"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.p
            className="max-w-3xl mx-auto text-xl leading-relaxed md:text-2xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            Rooted in Kenya, inspired by nature — designing spaces that connect
            people, landscape, and legacy.
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

      {/* Enhanced Introduction */}
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
              Our Story
            </span>
            <h2 className="mb-6 text-4xl font-bold text-shama-blue md:text-5xl">
              We Design for <span className="italic">Connection</span>
            </h2>
            
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-shama-black/80">
                For over a decade, <strong className="text-shama-green">Shama Landscape Architects Limited</strong>{" "}
                has delivered bespoke landscape design, implementation, and
                maintenance services across Kenya and East Africa. Founded by{" "}
                <strong className="text-shama-blue">John Shamala Mulievi</strong>, a landscape architect devoted
                to environmental conservation, Shama has grown into a team of 46
                professionals shaping outdoor spaces that balance beauty, function,
                and sustainability.
              </p>

              <motion.blockquote 
                className="p-6 italic border-l-4 bg-shama-clay/20 rounded-2xl border-shama-green"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-xl text-shama-green">
                  "Shama was born from a simple belief — that the land itself is the
                  first architect."
                </p>
                <cite className="block mt-4 not-italic font-semibold text-shama-blue">
                  — John Shamala Mulievi, Founder
                </cite>
              </motion.blockquote>

              <p className="text-lg leading-relaxed text-shama-black/80">
                We specialize in landscape design, environmental planning, and project
                implementation. Each project begins with deep listening — to the site,
                to the client, and to the land's story. From intimate gardens to
                urban-scale developments, we design for harmony between people and
                place.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            variants={scaleIn}
          >
            <div className="relative overflow-hidden shadow-2xl rounded-2xl">
              <img
                src="/assets/about-team.jpg"
                alt="Shama Landscape Architects Team"
                className="object-cover w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-shama-black/30 to-transparent" />
            </div>
            {/* Decorative elements */}
            <div className="absolute w-24 h-24 rounded-full -top-4 -right-4 bg-shama-green/10" />
            <div className="absolute w-16 h-16 rounded-full -bottom-4 -left-4 bg-shama-blue/10" />
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Vision, Mission, Values */}
      <motion.div
        className="py-24 bg-shama-clay/20"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-6xl px-6 mx-auto">
          <motion.div
            className="mb-16 text-center"
            variants={fadeIn}
          >
            <span className="text-sm font-semibold tracking-widest uppercase text-shama-green">
              Our Foundation
            </span>
            <h2 className="mt-2 text-4xl font-bold text-shama-blue">
              What Guides Our Work
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Our Vision",
                desc: "To be a regional leader in delivering the highest quality of landscaping services and customer experience through a reputable and innovative team.",
                icon: "👁️",
                color: "blue"
              },
              {
                title: "Our Mission",
                desc: "To enhance property value and community wellbeing through professional design, installation, and maintenance guided by sound environmental practices.",
                icon: "🎯",
                color: "green"
              },
              {
                title: "Our Values",
                desc: "Integrity, Innovation, Collaboration, Sustainability, and Excellence — principles that illuminate every design we create.",
                icon: "❤️",
                color: "terra"
              },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                className="p-8 text-center transition-all duration-500 bg-white shadow-lg group rounded-2xl hover:shadow-xl"
                variants={fadeIn}
                whileHover={{ y: -8 }}
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-shama-${item.color}/10 text-3xl group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h3 className="mb-4 text-2xl font-bold text-shama-blue">
                  {item.title}
                </h3>
                <p className="leading-relaxed text-shama-black/80">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Expertise Section */}
      <motion.div
        className="max-w-6xl px-6 py-24 mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div
          className="mb-16 text-center"
          variants={fadeIn}
        >
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
            {
              title: "Site Visit & Analysis",
              desc: "Understanding the land's opportunities and patterns before design begins.",
              icon: "📍"
            },
            {
              title: "Scheme Design",
              desc: "Early-stage concepts and cost planning tailored to client needs.",
              icon: "📐"
            },
            {
              title: "Detailed Design",
              desc: "Refined plans and planting schemes translating vision into construction.",
              icon: "🎨"
            },
            {
              title: "Installation",
              desc: "Execution by skilled site professionals with constant design oversight.",
              icon: "🛠️"
            },
            {
              title: "Maintenance",
              desc: "Ongoing care to sustain ecological and visual integrity.",
              icon: "🌱"
            },
            {
              title: "Environmental Planning",
              desc: "Embedding water-wise, native, and regenerative strategies in every project.",
              icon: "♻️"
            },
          ].map((service, i) => (
            <motion.div
              key={i}
              className="p-8 transition-all duration-500 bg-white border-2 group border-shama-clay/30 rounded-2xl hover:border-shama-green/50 hover:shadow-xl"
              variants={scaleIn}
              whileHover={{ 
                scale: 1.03,
                borderColor: "rgb(72 187 120 / 0.3)" // shama-green
              }}
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

      {/* Enhanced Timeline */}
      <motion.div
        className="py-24 bg-shama-blue/5"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-6xl px-6 mx-auto">
          <motion.div
            className="mb-16 text-center"
            variants={fadeIn}
          >
            <span className="text-sm font-semibold tracking-widest uppercase text-shama-green">
              Our Journey
            </span>
            <h2 className="mt-2 text-4xl font-bold text-shama-blue">
              A Decade of Growth and Impact
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-0 bottom-0 w-1 transform left-6 md:left-1/2 bg-shama-green/30 md:-translate-x-1/2" />
            
            {[
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
            ].map((event, i) => (
              <motion.div
                key={i}
                className={`relative flex flex-col md:flex-row ${
                  i % 2 === 0 ? 'md:flex-row-reverse' : ''
                } mb-12 md:mb-16`}
                variants={fadeIn}
              >
                {/* Year */}
                <div className={`flex-1 md:flex-none md:w-1/2 ${
                  i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                }`}>
                  <div className="mb-4 md:mb-0">
                    <span className="inline-block px-4 py-2 text-lg font-bold text-white rounded-full bg-shama-green">
                      {event.year}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className={`flex-1 md:w-1/2 ${
                  i % 2 === 0 ? 'md:pl-12' : 'md:pr-12'
                }`}>
                  <div className="relative p-6 transition-all duration-500 bg-white shadow-lg rounded-2xl hover:shadow-xl">
                    {/* Connector dot */}
                    <div className={`absolute top-6 ${
                      i % 2 === 0 ? 
                      'md:-left-12 -left-3' : 
                      'md:-right-12 -right-3'
                    } w-6 h-6 bg-shama-green rounded-full border-4 border-white`} />
                    
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

      {/* Enhanced Team Section */}
      <motion.div
        className="py-24 bg-shama-clay/10"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-6xl px-6 mx-auto">
          <motion.div
            className="mb-16 text-center"
            variants={fadeIn}
          >
            <span className="text-sm font-semibold tracking-widest uppercase text-shama-green">
              Meet Our Experts
            </span>
            <h2 className="mt-2 text-4xl font-bold text-shama-blue">
              Our Leadership Team
            </h2>
            <p className="max-w-3xl mx-auto mt-4 text-lg text-shama-black/80">
              Led by <strong>John Shamala Mulievi</strong>, our multidisciplinary
              team of landscape architects, horticulturists, engineers, and
              artisans works collaboratively to shape environments that nurture
              both people and planet.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
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
                role: "Landcape Architect",
                email: "millicent@shamalandscapes.co.ke",
                desc: "Landscape architects, horticulturists, engineers, and artisans",
                img: "/assets/team/businesswoman.png",
              },
               {
                name: "Shama Landscapes team",
                role: "Development team",
                desc: "Landscape architects, horticulturists, engineers, and artisans",
                img: "/assets/team/people-together.png",
              },
            ].map((member, i) => (
              <motion.div
                key={i}
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
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-shama-black/40 to-transparent group-hover:opacity-100" />
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
                      className="inline-block underline transition-colors duration-300 text-shama-blue hover:text-shama-green"
                    >
                      {member.email}
                    </a>
                  ) : (
                    <p className="text-sm text-shama-black/70">
                      {member.desc}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Closing CTA */}
      <motion.div
        className="py-20 text-center bg-gradient-to-r from-shama-blue/10 to-shama-green/10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl px-6 mx-auto">
          <motion.blockquote
            className="mb-8 text-2xl italic leading-relaxed md:text-3xl text-shama-black/80"
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
              className="px-8 py-4 font-semibold text-white transition-all duration-300 rounded-full bg-shama-green hover:bg-shama-terra hover:shadow-xl hover:scale-105"
            >
              Discover Our Work
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 font-semibold transition-all duration-300 border-2 rounded-full text-shama-green border-shama-green hover:bg-shama-green hover:text-white"
            >
              Start Your Project
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
