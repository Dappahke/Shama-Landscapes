"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowRight, 
  Linkedin, 
  Instagram, 
  Facebook, 
  Twitter,
  Send,
  CheckCircle2,
  ChevronRight,
  Building2,
  Leaf,
  PenTool,
  Trees,
  Award
} from "lucide-react";
import supabase from "@/lib/supabaseClient";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("newsletter")
        .insert([{ 
          email: email.toLowerCase().trim(),
          metadata: { source: "footer", date: new Date().toISOString() }
        }]);
      
      if (error && error.code !== '23505') throw error;
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    } catch (err) {
      console.error("Newsletter error:", err);
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "Studio" },
    { href: "/services", label: "Expertise" },
    { href: "/projects", label: "Portfolio" },
    { href: "/sustainability", label: "Ecology" },
    { href: "/blog", label: "Journal" },
    { href: "/contact", label: "Studio Inquiries" },
  ];

  const services = [
    { name: "Master Planning", icon: Building2 },
    { name: "Landscape Design", icon: Leaf },
    { name: "Environmental Planning", icon: Trees },
    { name: "Construction Documentation", icon: PenTool },
    { name: "Project Installation", icon: Trees },
    { name: "Sustainable Design", icon: Award },
  ];

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/shamalandscapearchitectslimited", label: "LinkedIn", color: "hover:bg-[#0077b5]" },
    { icon: Instagram, href: "https://www.instagram.com/shamalandscapes", label: "Instagram", color: "hover:bg-[#E4405F]" },
    { icon: Facebook, href: "https://www.facebook.com/shamalandscapearchitects", label: "Facebook", color: "hover:bg-[#1877F2]" },
    { icon: Twitter, href: "https://twitter.com/shamalandscapes", label: "X", color: "hover:bg-black" },
  ];

  const officeHours = [
    { day: "Monday – Friday", hours: "8:00 AM – 5:00 PM" },
    { day: "Saturday", hours: "9:00 AM – 2:00 PM" },
    { day: "Sunday", hours: "Closed" }
  ];

  return (
    <footer className="relative bg-linear-to-b from-white to-shama-clay/20 text-shama-black">
      {/* Architectural Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-shama-green/30 to-transparent" />
      
      {/* Main Footer */}
      <motion.div 
        className="relative px-6 pt-20 pb-12 mx-auto max-w-7xl lg:px-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Studio Header */}
        <motion.div variants={fadeIn} className="max-w-3xl mx-auto mb-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-shama-green/30" />
            <span className="text-xs font-semibold tracking-[0.3em] text-shama-green uppercase">
              Landscape Architecture
            </span>
            <div className="w-12 h-px bg-shama-green/30" />
          </div>
          
          <Link href="/" className="inline-block">
            <Image
              src="/assets/shama_landscape_logo.png"
              alt="Shama Landscape Architects"
              width={240}
              height={96}
              className="w-auto h-16 mx-auto transition-opacity hover:opacity-80"
              priority
            />
          </Link>
          
          <p className="mt-6 text-lg italic text-shama-black/60">
            "Imagine it. <span className="not-italic text-shama-green">Build it.</span>{" "}
            <span className="not-italic text-shama-terra">Have it."</span>
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid gap-12 lg:grid-cols-12">
          
          {/* Studio Info */}
          <motion.div variants={fadeIn} className="lg:col-span-4">
            <h3 className="mb-6 text-xs font-semibold tracking-[0.2em] text-shama-green uppercase">
              The Practice
            </h3>
            
            <p className="mb-8 text-sm leading-relaxed text-shama-black/70">
              Kenya's premier landscape architecture practice, delivering 
              design-led, ecologically responsive environments since 2012. 
              Registered with the Architectural Association of Kenya.
            </p>

            {/* Accreditation Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-3 py-1 text-xs font-medium border rounded-full bg-shama-green/5 border-shama-green/20 text-shama-green">
                AAK Registered
              </span>
              <span className="px-3 py-1 text-xs font-medium border rounded-full bg-shama-blue/5 border-shama-blue/20 text-shama-blue">
                Licensed Architects
              </span>
              <span className="px-3 py-1 text-xs font-medium border rounded-full bg-shama-terra/5 border-shama-terra/20 text-shama-terra">
                ISO 14001
              </span>
            </div>

            {/* Social Links - Architectural Treatment */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-shama-black/60">Professional Network</h4>
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="relative w-12 h-12 overflow-hidden transition-all duration-300 bg-white border rounded-full shadow-sm group border-shama-black/10 hover:border-transparent"
                  >
                    <div className={`absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0 ${social.color.replace('hover:', '')}`} />
                    <social.icon className="absolute inset-0 w-5 h-5 m-auto transition-colors text-shama-black/60 group-hover:text-white" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Navigation */}
          <motion.div variants={fadeIn} className="lg:col-span-2">
            <h3 className="mb-6 text-xs font-semibold tracking-[0.2em] text-shama-green uppercase">
              Navigate
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center text-sm transition-all group text-shama-black/70 hover:text-shama-green"
                  >
                    <span className="relative overflow-hidden">
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-full h-px transition-transform origin-left transform scale-x-0 bg-shama-green group-hover:scale-x-100" />
                    </span>
                    <ChevronRight className="w-3 h-3 ml-1 transition-transform -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services with Icons */}
          <motion.div variants={fadeIn} className="lg:col-span-3">
            <h3 className="mb-6 text-xs font-semibold tracking-[0.2em] text-shama-green uppercase">
              Expertise
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {services.map((service) => (
                <Link
                  key={service.name}
                  href="/services"
                  className="p-3 transition-all duration-300 bg-white border group border-shama-black/5 rounded-xl hover:shadow-lg hover:border-shama-green/20"
                >
                  <service.icon className="w-4 h-4 mb-2 text-shama-green/60 group-hover:text-shama-green" />
                  <span className="text-xs font-medium">{service.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Contact & Newsletter */}
          <motion.div variants={fadeIn} className="lg:col-span-3">
            <h3 className="mb-6 text-xs font-semibold tracking-[0.2em] text-shama-green uppercase">
              Studio Contact
            </h3>
            
            {/* Nairobi Office */}
            <div className="p-5 mb-4 bg-white border-l-4 shadow-sm border-shama-blue rounded-r-2xl">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-shama-blue/10 shrink-0">
                  <MapPin className="w-5 h-5 text-shama-blue" />
                </div>
                <div className="flex-1">
                  <p className="mb-1 text-sm font-bold text-shama-blue">Nairobi Studio</p>
                  <p className="text-xs text-shama-black/70">Muini Plaza, Kinoo</p>
                  <p className="text-xs text-shama-black/70">Nairobi, Kenya</p>
                  <a href="tel:+254735184292" className="inline-block mt-2 text-xs font-medium text-shama-green hover:underline">
                    +254 735 184 292
                  </a>
                </div>
              </div>
            </div>

            {/* Kakamega Office */}
            <div className="p-5 mb-4 bg-white border-l-4 shadow-sm border-shama-terra rounded-r-2xl">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-shama-terra/10 shrink-0">
                  <MapPin className="w-5 h-5 text-shama-terra" />
                </div>
                <div className="flex-1">
                  <p className="mb-1 text-sm font-bold text-shama-terra">Western Studio</p>
                  <p className="text-xs text-shama-black/70">Ambwere Plaza, 1st Floor</p>
                  <p className="text-xs text-shama-black/70">Kakamega, Kenya</p>
                  <a href="mailto:info@shamalandscapes.co.ke" className="inline-block mt-2 text-xs font-medium text-shama-green hover:underline">
                    info@shamalandscapes.co.ke
                  </a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="p-5 mb-6 bg-white border border-shama-black/5 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-4 h-4 text-shama-green" />
                <span className="text-xs font-semibold tracking-wider uppercase text-shama-black/60">
                  Studio Hours
                </span>
              </div>
              <div className="space-y-2">
                {officeHours.map((schedule) => (
                  <div key={schedule.day} className="flex justify-between text-xs">
                    <span className="text-shama-black/60">{schedule.day}</span>
                    <span className="font-medium text-shama-black">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter - Refined */}
            <div className="p-5 shadow-xl bg-linear-to-br from-shama-blue to-shama-blue/90 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-white/10">
                  <Send className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">The Shama Journal</h4>
                  <p className="text-xs text-white/70">Biannual landscape insights</p>
                </div>
              </div>
              
              {subscribed ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 text-sm rounded-lg bg-white/10"
                >
                  <CheckCircle2 className="w-5 h-5 text-shama-green" />
                  <span className="text-white">Thank you for subscribing</span>
                </motion.div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 pr-20 text-sm text-white border rounded-xl bg-white/10 border-white/20 placeholder:text-white/50 focus:outline-none focus:bg-white/20 focus:border-white/30"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-2 top-2 px-4 py-1.5 text-sm font-medium transition-all bg-white rounded-lg text-shama-blue hover:bg-shama-green hover:text-white disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 rounded-full border-shama-blue/30 border-t-shama-blue animate-spin" />
                    ) : (
                      "Join"
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Bar - Refined */}
      <div className="border-t border-shama-black/10 bg-shama-clay/10">
        <div className="flex flex-col items-center justify-between gap-4 px-6 py-6 mx-auto text-xs max-w-7xl lg:px-8 md:flex-row text-shama-black/50">
          <p className="order-2 text-center md:order-1">
            © {new Date().getFullYear()} Shama Landscape Architects Limited. 
            <span className="hidden md:inline"> All rights reserved.</span>
          </p>
          
          <div className="flex order-1 gap-8 md:order-2">
            <Link href="/privacy" className="transition-colors hover:text-shama-green">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-shama-green">Terms</Link>
            <Link href="/accessibility" className="transition-colors hover:text-shama-green">Accessibility</Link>
            <Link href="/sitemap" className="transition-colors hover:text-shama-green">Sitemap</Link>
          </div>
          
          <p className="order-3 text-xs md:order-3">
            Site by <a href="#" className="transition-colors hover:text-shama-green">Dappah Solutions</a>
          </p>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed z-40 p-3 transition-all bg-white border rounded-full shadow-lg bottom-8 right-8 border-shama-green/20 hover:shadow-xl hover:bg-shama-green group"
        aria-label="Back to top"
      >
        <ChevronRight className="w-5 h-5 transition-colors transform -rotate-90 text-shama-green group-hover:text-white" />
      </button>
    </footer>
  );
}