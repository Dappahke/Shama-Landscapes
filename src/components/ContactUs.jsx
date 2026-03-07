"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  MapPin,
  Clock,
  DollarSign,
  MessageCircle,
  Building,
  Calendar,
  Send,
  Home,
  MessageSquare,
  MailOpen
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: "easeOut" 
    } 
  },
};

const slideIn = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    } 
  },
  exit: { 
    opacity: 0, 
    x: -50,
    transition: { 
      duration: 0.3 
    } 
  }
};

export default function ContactForm() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
      return;
    }
    setStep(2);
    setStatus("idle");
  };

  const handleBack = (e) => {
    e.preventDefault();
    setStep(1);
    setStatus("idle");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    
    // Create comprehensive email content
    const subject = `New Project Inquiry from ${formData.name}`;
    const body = `
PROJECT INQUIRY - SHAMA LANDSCAPE ARCHITECTS
=============================================

CONTACT INFORMATION:
-------------------
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}

PROJECT DETAILS:
---------------
Project Type: ${formData.projectType}
Budget Range: ${formData.budget}
Timeline: ${formData.timeline}

MESSAGE:
--------
${formData.message}

---
This inquiry was submitted through the Shama Landscape Architects website.
    `.trim();
    
    // Create mailto link
    const mailtoLink = `mailto:info@shamalandscapes.co.ke?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open user's email client
    window.location.href = mailtoLink;
    setStatus("success");
    
    // Reset form after submission
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        projectType: "",
        budget: "",
        timeline: "",
        message: ""
      });
      setStep(1);
    }, 3000);
  };

  const projectTypes = [
    { value: "residential", label: "Residential Landscape", icon: <Home size={16} /> },
    { value: "commercial", label: "Commercial / Urban Space", icon: <Building size={16} /> },
    { value: "public", label: "Public Park / Institution", icon: <MapPin size={16} /> },
    { value: "restoration", label: "Environmental Restoration", icon: <CheckCircle size={16} /> },
  ];

  const budgetRanges = [
    { value: "below-500k", label: "Below KSh 500,000" },
    { value: "500k-1m", label: "KSh 500,000 - 1 Million" },
    { value: "1m-3m", label: "KSh 1 Million - 3 Million" },
    { value: "above-3m", label: "Above KSh 3 Million" },
  ];

  const timelines = [
    { value: "1-month", label: "1 Month", icon: <Clock size={16} /> },
    { value: "3-months", label: "Up to 3 Months", icon: <Clock size={16} /> },
    { value: "6-months", label: "Up to 6 Months", icon: <Clock size={16} /> },
    { value: "flexible", label: "Flexible / Not fixed", icon: <Calendar size={16} /> },
  ];

  return (
    <section className="relative py-20 bg-gradient-to-br from-shama-clay/10 to-shama-blue/5">
      <div className="max-w-6xl px-6 mx-auto">
        {/* Header Section */}
        <motion.div 
          className="mb-16 text-center"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-widest uppercase rounded-full text-shama-green bg-shama-green/10">
            Get Started
          </span>
          <h2 className="mb-6 text-4xl font-bold text-shama-blue">
            Start Your <span className="text-shama-green">Landscape Journey</span>
          </h2>
          <div className="w-16 h-0.5 mx-auto mb-6 bg-gradient-to-r from-shama-green to-shama-blue rounded-full" />
          <p className="max-w-2xl mx-auto text-lg leading-relaxed text-shama-black/80">
            Share your vision with us — we'll guide you through the process and create 
            a customized plan that brings your dream landscape to life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Contact Information */}
          <motion.div 
            className="space-y-8"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div>
              <h3 className="mb-6 text-2xl font-bold text-shama-blue">Get in Touch</h3>
              <p className="mb-6 text-shama-black/70">
                Prefer direct communication? Reach out through any of these channels:
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 shadow-lg rounded-2xl">
                <div className="flex items-center justify-center w-12 h-12 bg-shama-green/10 rounded-xl text-shama-green">
                  <Phone size={24} />
                </div>
                <div>
                  <div className="font-semibold text-shama-blue">Call Us</div>
                  <div className="text-shama-black/70">+254 735 184 292</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 shadow-lg rounded-2xl">
                <div className="flex items-center justify-center w-12 h-12 bg-shama-blue/10 rounded-xl text-shama-blue">
                  <Mail size={24} />
                </div>
                <div>
                  <div className="font-semibold text-shama-blue">Email Us</div>
                  <div className="text-shama-black/70">info@shamalandscapes.co.ke</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 shadow-lg rounded-2xl">
                <div className="flex items-center justify-center w-12 h-12 bg-shama-green/10 rounded-xl text-shama-green">
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="font-semibold text-shama-blue">Visit Us</div>
                  <div className="text-shama-black/70">Mbuini Plaza, Kinoo, Nairobi</div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-3">
              <a
                href="https://wa.me/254735184292?text=Hello%20Shama%20Landscape%20Architects!%20I%27d%20like%20to%20discuss%20my%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 bg-green-600 rounded-lg hover:bg-green-700 hover:shadow-lg"
              >
                <MessageCircle size={15} />
                WhatsApp Chat
              </a>
              
              <a
                href="tel:+254735184292"
                className="flex items-center justify-center w-full gap-2 px-6 py-3 font-semibold transition-all duration-300 border-2 rounded-lg text-shama-green border-shama-green hover:bg-shama-green hover:text-white"
              >
                <Phone size={20} />
                Call Now
              </a>

              <a
                href="mailto:info@shamalandscapes.co.ke"
                className="flex items-center justify-center w-full gap-2 px-6 py-3 font-semibold transition-all duration-300 border-2 rounded-lg text-shama-blue border-shama-blue hover:bg-shama-blue hover:text-white"
              >
                <MailOpen size={20} />
                Email Directly
              </a>
            </div>

            {/* Email Notice */}
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-center gap-2 text-blue-800">
                <MailOpen size={18} />
                <span className="text-sm font-medium">Direct Email Submission</span>
              </div>
              <p className="mt-1 text-xs text-blue-700">
                Your inquiry will open in your email client. Simply click "Send" to deliver it directly to our team.
              </p>
            </div>
          </motion.div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={fadeIn}
                  className="p-8 bg-white shadow-xl rounded-2xl"
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-shama-green/10 text-shama-green">
                      <MailOpen size={40} />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-shama-green">
                      Check Your Email!
                    </h3>
                    <p className="mb-4 leading-relaxed text-shama-black/70">
                      Your project inquiry has been prepared and should open in your email client.
                    </p>
                    <p className="mb-6 text-sm text-shama-black/60">
                      Please review the pre-filled email and click <strong>"Send"</strong> to deliver it to our team at <strong>info@shamalandscapes.co.ke</strong>
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                      <a
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 rounded-lg bg-shama-green hover:bg-shama-blue"
                      >
                        <Home size={20} />
                        Back to Home
                      </a>
                      <button
                        onClick={() => {
                          setStatus("idle");
                          setStep(1);
                        }}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-all duration-300 border-2 rounded-lg text-shama-green border-shama-green hover:bg-shama-green hover:text-white"
                      >
                        <MessageSquare size={20} />
                        New Inquiry
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={slideIn}
                  onSubmit={handleSubmit}
                  className="overflow-hidden bg-white shadow-xl rounded-2xl"
                >
                  {/* Progress Header */}
                  <div className="px-8 py-6 border-b border-gray-100 bg-shama-clay/5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-shama-blue">
                        Project Inquiry
                      </h3>
                      <span className="text-sm text-shama-black/60">
                        Step {step} of 2
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 bg-gradient-to-r from-shama-green to-shama-blue rounded-full transition-all duration-500 ${
                          step === 1 ? "w-1/2" : "w-full"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="p-8">
                    <AnimatePresence mode="wait">
                      {step === 1 ? (
                        <motion.div
                          key="step1"
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={fadeIn}
                          className="space-y-6"
                        >
                          <div>
                            <label className="flex items-center gap-2 mb-3 font-semibold text-shama-blue">
                              <User size={18} />
                              Full Name *
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 transition-all duration-300 border rounded-lg border-shama-green/30 focus:outline-none focus:ring-2 focus:ring-shama-green/50 focus:border-shama-green"
                              placeholder="Enter your full name"
                            />
                          </div>

                          <div>
                            <label className="flex items-center gap-2 mb-3 font-semibold text-shama-blue">
                              <Mail size={18} />
                              Email Address *
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 transition-all duration-300 border rounded-lg border-shama-green/30 focus:outline-none focus:ring-2 focus:ring-shama-green/50 focus:border-shama-green"
                              placeholder="your.email@example.com"
                            />
                          </div>

                          <div>
                            <label className="flex items-center gap-2 mb-3 font-semibold text-shama-blue">
                              <Phone size={18} />
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 transition-all duration-300 border rounded-lg border-shama-green/30 focus:outline-none focus:ring-2 focus:ring-shama-green/50 focus:border-shama-green"
                              placeholder="+254 XXX XXX XXX"
                            />
                          </div>

                          <div className="flex justify-end pt-4">
                            <button
                              onClick={handleNext}
                              className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 rounded-lg bg-shama-green hover:bg-shama-blue hover:shadow-lg"
                            >
                              Continue
                              <ArrowRight size={20} />
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="step2"
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={fadeIn}
                          className="space-y-6"
                        >
                          <div>
                            <label className="flex items-center gap-2 mb-3 font-semibold text-shama-blue">
                              <Building size={18} />
                              Project Type *
                            </label>
                            <select
                              name="projectType"
                              value={formData.projectType}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 transition-all duration-300 border rounded-lg border-shama-green/30 focus:outline-none focus:ring-2 focus:ring-shama-green/50 focus:border-shama-green"
                            >
                              <option value="">Select project type</option>
                              {projectTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="flex items-center gap-2 mb-3 font-semibold text-shama-blue">
                              <DollarSign size={18} />
                              Budget Range *
                            </label>
                            <select
                              name="budget"
                              value={formData.budget}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 transition-all duration-300 border rounded-lg border-shama-green/30 focus:outline-none focus:ring-2 focus:ring-shama-green/50 focus:border-shama-green"
                            >
                              <option value="">Select budget range</option>
                              {budgetRanges.map(budget => (
                                <option key={budget.value} value={budget.value}>
                                  {budget.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="flex items-center gap-2 mb-3 font-semibold text-shama-blue">
                              <Clock size={18} />
                              Timeline *
                            </label>
                            <select
                              name="timeline"
                              value={formData.timeline}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 transition-all duration-300 border rounded-lg border-shama-green/30 focus:outline-none focus:ring-2 focus:ring-shama-green/50 focus:border-shama-green"
                            >
                              <option value="">Select timeline</option>
                              {timelines.map(timeline => (
                                <option key={timeline.value} value={timeline.value}>
                                  {timeline.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="flex items-center gap-2 mb-3 font-semibold text-shama-blue">
                              <MessageCircle size={18} />
                              Project Details *
                            </label>
                            <textarea
                              name="message"
                              value={formData.message}
                              onChange={handleInputChange}
                              required
                              rows="4"
                              className="w-full px-4 py-3 transition-all duration-300 border rounded-lg resize-none border-shama-green/30 focus:outline-none focus:ring-2 focus:ring-shama-green/50 focus:border-shama-green"
                              placeholder="Tell us about your vision, site location, specific requirements, and any other details..."
                            />
                          </div>

                          <div className="flex justify-between pt-4">
                            <button
                              onClick={handleBack}
                              className="inline-flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-300 border-2 rounded-lg text-shama-green border-shama-green hover:bg-shama-green hover:text-white"
                            >
                              <ArrowLeft size={20} />
                              Back
                            </button>

                            <button
                              type="submit"
                              disabled={status === "sending"}
                              className={`inline-flex items-center gap-2 px-6 py-3 font-semibold text-white rounded-lg transition-all duration-300 ${
                                status === "sending"
                                  ? "bg-shama-blue cursor-not-allowed"
                                  : "bg-shama-green hover:bg-shama-blue hover:shadow-lg"
                              }`}
                            >
                              {status === "sending" ? (
                                "Preparing Email..."
                              ) : (
                                <>
                                  <MailOpen size={20} />
                                  Open Email to Send
                                </>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Map Section */}
        <motion.div 
          className="mt-16"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="overflow-hidden bg-white shadow-lg rounded-2xl">
            <div className="p-6 border-b border-gray-100">
              <h3 className="flex items-center gap-2 text-xl font-semibold text-shama-blue">
                <MapPin size={24} />
                Visit Our Office
              </h3>
              <p className="mt-2 text-shama-black/70">Muini Plaza, Kinoo, Nairobi - Kenya</p>
            </div>
            <iframe
              title="Shama Landscape Architects Map"
              src="https://www.google.com/maps?Muini+Plaza+Kinoo+Nairobi&output=embed"
              
              className="w-full border-0 h-80"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}