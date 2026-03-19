"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    setProjects(data || []);
  }

  const filteredProjects = projects.filter((p) => {
    const typeMatch = filter === "All" || p.project_type === filter;
    const statusMatch =
      statusFilter === "All" || p.status === statusFilter;
    return typeMatch && statusMatch;
  });

  return (
    <div className="px-6 pt-24 mx-auto max-w-7xl">
      
      {/* HERO */}
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-5xl font-bold">Our Work</h1>
        <p className="max-w-2xl mx-auto text-gray-600">
          A collection of our landscape architecture projects across Kenya,
          blending nature, design, and functionality.
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        
        {/* TYPE FILTER */}
        {["All", "Residential", "Commercial", "Hospitality", "Urban"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full border ${
              filter === type
                ? "bg-[var(--color-shama-green)] text-white"
                : "bg-white"
            }`}
          >
            {type}
          </button>
        ))}

        {/* STATUS FILTER */}
        {["All", "Completed", "In Progress"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-full border ${
              statusFilter === status
                ? "bg-[var(--color-shama-terra)] text-white"
                : "bg-white"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* PROJECT GRID */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <div className="relative overflow-hidden cursor-pointer group rounded-2xl">
              
              {/* IMAGE */}
              <Image
                src={project.cover_url}
                alt={project.title}
                width={600}
                height={400}
                className="w-full h-[300px] object-cover group-hover:scale-105 transition duration-500"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 text-white transition opacity-0 bg-black/40 group-hover:opacity-100">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p className="text-sm">{project.location}</p>

                <span className="px-3 py-1 mt-2 text-xs rounded-full bg-white/20 w-fit">
                  {project.status}
                </span>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}