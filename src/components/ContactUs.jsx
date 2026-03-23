"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ChevronRight,
} from "lucide-react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: Replace with API route (recommended)
    console.log("Form submitted:", formData);
  };

  return (
    <section className="bg-white text-shama-blue">
      {/* HERO */}
      <div className="relative px-6 text-center py-28 bg-linear-to-br from-shama-clay/10 to-shama-green/5">
        <h1 className="mb-6 text-4xl font-bold md:text-5xl">
          Let’s Shape Your Landscape
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-shama-black/70">
          Every meaningful landscape begins with a conversation. Tell us about
          your land, your vision, and what you want it to become.
        </p>
      </div>

      {/* PROCESS */}
      <div className="grid max-w-6xl gap-12 px-6 py-20 mx-auto text-center md:grid-cols-3">
        {[
          {
            title: "Understand",
            desc: "We listen to your site, your vision, and your goals.",
          },
          {
            title: "Design",
            desc: "We craft a thoughtful, site-responsive landscape solution.",
          },
          {
            title: "Realize",
            desc: "We bring your landscape to life with precision.",
          },
        ].map((step, i) => (
          <div key={i}>
            <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
            <p className="text-sm text-shama-black/70">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div className="grid max-w-6xl gap-16 px-6 mx-auto pb-28 lg:grid-cols-3">
        {/* CONTACT INFO */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">Prefer a direct conversation?</h3>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Phone />
              <span>+254 735 184 292</span>
            </div>
            <div className="flex items-center gap-4">
              <Mail />
              <span>info@shamalandscapes.co.ke</span>
            </div>
            <div className="flex items-center gap-4">
              <MapPin />
              <span>Mbuini Plaza, Kinoo, Nairobi</span>
            </div>
          </div>

          <a
            href="https://wa.me/254735184292"
            target="_blank"
            className="flex items-center justify-center gap-2 px-6 py-3 text-white bg-green-600 rounded-lg"
          >
            <MessageCircle size={18} /> WhatsApp
          </a>
        </div>

        {/* FORM */}
        <div className="p-8 lg:col-span-2 bg-gray-50 rounded-2xl">
          <h3 className="mb-6 text-xl font-semibold">
            Tell Us About Your Vision
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />

            <input
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />

            <input
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />

            <input
              name="location"
              placeholder="Project Location"
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />

            <select name="projectType" onChange={handleChange} className="w-full p-3 border rounded-lg">
              <option>What are you looking to create?</option>
              <option>Residential Landscape</option>
              <option>Commercial Space</option>
              <option>Public Space</option>
            </select>

            <select name="budget" onChange={handleChange} className="w-full p-3 border rounded-lg">
              <option>Investment Range</option>
              <option>Below 500k</option>
              <option>500k - 1M</option>
              <option>Above 1M</option>
            </select>

            <select name="timeline" onChange={handleChange} className="w-full p-3 border rounded-lg">
              <option>When would you like to begin?</option>
              <option>Immediately</option>
              <option>1-3 Months</option>
              <option>Flexible</option>
            </select>

            <textarea
              name="message"
              placeholder="Describe your land, ideas, or challenges..."
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              rows="4"
              required
            />

            <button className="flex items-center justify-center w-full gap-2 py-3 text-white rounded-lg bg-shama-green">
              Submit Inquiry <ChevronRight size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* MAP */}
      <div className="max-w-6xl px-6 pb-20 mx-auto">
        <h3 className="mb-4 text-xl font-semibold">Visit us by appointment</h3>
        <iframe
          src="https://www.google.com/maps?q=Kinoo,Nairobi&output=embed"
          className="w-full h-80 rounded-xl"
        />
      </div>
    </section>
  );
}