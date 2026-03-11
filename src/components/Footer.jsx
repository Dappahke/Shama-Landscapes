"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="pt-16 pb-10 bg-shama-clay/40 text-shama-black">
      <div className="grid gap-10 px-6 mx-auto max-w-7xl md:grid-cols-2 lg:grid-cols-4">
        {/* Brand Section */}
        <div className="lg:col-span-1">
          <div className="mb-6">
            <Image
              src="/assets/shama_landscape_logo.png"
              alt="Shama Landscape Architects Logo"
              width={150}
              height={60}
              className="w-auto h-12"
            />
          </div>
          <p className="mb-4 text-lg font-semibold text-shama-black">
            Imagine it. <span className="text-shama-green">Build it.</span>{" "}
            <span className="text-shama-terra">Have it.</span>
          </p>
          <p className="mb-6 text-sm leading-relaxed text-shama-black/70">
            We craft sustainable and beautiful outdoor spaces that harmonize
            people, architecture, and nature across Kenya.
          </p>
          
          {/* Social Links */}
          <div className="flex space-x-3">
            <a
              href="https://www.linkedin.com/in/shamalandscapearchitectslimited"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full bg-shama-blue/10 hover:bg-shama-blue hover:text-white text-shama-blue"
              aria-label="LinkedIn"
            >
              <i className="text-lg fab fa-linkedin"></i>
            </a>
            <a
              href="https://www.instagram.com/shamalandscapes/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full bg-shama-terra/10 hover:bg-shama-terra hover:text-white text-shama-terra"
              aria-label="Instagram"
            >
              <i className="text-lg fab fa-instagram"></i>
            </a>
            <a
              href="https://www.facebook.com/shamalandscapearchitects/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full bg-shama-green/10 hover:bg-shama-green hover:text-white text-shama-green"
              aria-label="Facebook"
            >
              <i className="text-lg fab fa-facebook"></i>
            </a>
            <a
              href="https://www.tiktok.com/@shamalandscapearchitects"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full bg-shama-black/10 hover:bg-shama-black hover:text-white text-shama-black"
              aria-label="TikTok"
            >
              <i className="text-lg fab fa-tiktok"></i>
            </a>
            <a
              href="https://twitter.com/shamalandscapes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full bg-shama-blue/10 hover:bg-shama-blue hover:text-white text-shama-blue"
              aria-label="X (Twitter)"
            >
              <i className="text-lg fab fa-x-twitter"></i>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="pb-2 mb-6 text-lg font-semibold border-b-2 text-shama-green border-shama-green/20">
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About Us" },
              { href: "/services", label: "Services" },
              { href: "/projects", label: "Our Projects" },
              { href: "/sustainability", label: "Sustainability" },
              { href: "/company-profile", label: "Company Profile" },
              { href: "/blog", label: "Blog" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block transition-all duration-300 transform hover:text-shama-blue hover:translate-x-1"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Head Office - Nairobi */}
        <div>
          <h3 className="pb-2 mb-6 text-lg font-semibold border-b-2 text-shama-blue border-shama-blue/20">
            Head Office
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 mt-1 rounded-full bg-shama-blue/10">
                <i className="text-xs fas fa-map-marker-alt text-shama-blue"></i>
              </div>
              <div>
                <p className="font-medium text-shama-black">Muini Plaza</p>
                <p className="text-shama-black/70">Kinoo, Nairobi</p>
                <p className="mt-1 text-xs text-shama-black/60">Main Headquarters</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-shama-green/10">
                <i className="text-xs fas fa-phone text-shama-green"></i>
              </div>
              <a
                href="tel:+254735184292"
                className="transition hover:text-shama-green"
              >
                +254 735 184 292
              </a>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-shama-terra/10">
                <i className="text-xs fas fa-envelope text-shama-terra"></i>
              </div>
              <a
                href="mailto:info@shamalandscapes.co.ke"
                className="transition hover:text-shama-terra"
              >
                info@shamalandscapes.co.ke
              </a>
            </div>

            <div className="flex items-center pt-2 space-x-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-shama-blue/10">
                <i className="text-xs fas fa-clock text-shama-blue"></i>
              </div>
              <div>
                <p className="text-shama-black/70">Mon - Fri: 8:00 AM - 5:00 PM</p>
                <p className="text-shama-black/70">Sat: 9:00 AM - 2:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kakamega Branch */}
        <div>
          <h3 className="pb-2 mb-6 text-lg font-semibold border-b-2 text-shama-terra border-shama-terra/20">
            Kakamega Branch
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 mt-1 rounded-full bg-shama-terra/10">
                <i className="text-xs fas fa-map-marker-alt text-shama-terra"></i>
              </div>
              <div>
                <p className="font-medium text-shama-black">Ambwere Plaza</p>
                <p className="text-shama-black/70">1st Floor, Kakamega</p>
                <p className="mt-1 text-xs text-shama-black/60">Western Kenya Branch</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-shama-green/10">
                <i className="text-xs fas fa-phone text-shama-green"></i>
              </div>
              <a
                href="tel:+254735184292"
                className="transition hover:text-shama-green"
              >
                +254 735 184 292
              </a>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-shama-blue/10">
                <i className="text-xs fas fa-envelope text-shama-blue"></i>
              </div>
              <a
                href="mailto:kakamega@shamalandscapes.co.ke"
                className="transition hover:text-shama-blue"
              >
                info@shamalandscapes.co.ke
              </a>
            </div>

            <div className="flex items-center pt-2 space-x-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-shama-terra/10">
                <i className="text-xs fas fa-clock text-shama-terra"></i>
              </div>
              <div>
                <p className="text-shama-black/70">Mon - Fri: 8:00 AM - 5:00 PM</p>
                <p className="text-shama-black/70">Sat: 9:00 AM - 2:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Preview */}
      <div className="px-6 mx-auto mt-12 max-w-7xl">
        <div className="py-6 border-t border-b border-shama-black/10">
          <h4 className="mb-4 font-semibold text-center text-shama-black">
            Our Services
          </h4>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-shama-black/70">
            {[
              "Landscape Design",
              "Environmental Planning", 
              "Project Installation",
              "Maintenance Services",
              "Sustainable Landscaping",
              "Commercial Landscaping"
            ].map((service, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-shama-green"></div>
                <span>{service}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-6 mt-8 text-sm text-center border-t border-shama-black/20 text-shama-black/70">
        <div className="flex flex-col items-center justify-between px-6 mx-auto md:flex-row max-w-7xl">
          <div className="mb-4 md:mb-0">
            © {new Date().getFullYear()} Shama Landscape Architects Limited. All rights reserved.
          </div>
          <div className="flex space-x-6 text-xs">
            <Link href="/privacy" className="transition hover:text-shama-green">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-shama-green">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="transition hover:text-shama-green">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
