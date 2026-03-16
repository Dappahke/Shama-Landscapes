"use client";
import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import Link from "next/link";
// ... (imports for motion and icons)

// Initialize Supabase (Ensure these are in your .env.local)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjects(data);
      }
      setLoading(false);
    }
    fetchProjects();
  }, []);

  if (loading) return <div className="py-20 text-center">Loading Projects...</div>;

  return (
    <section className="bg-white">
      {/* ... Hero Section ... */}
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} onClick={() => setActive(project)}>
             {/* Use project.cover_url and project.title from DB */}
             <img src={project.cover_url} alt={project.title} />
          </div>
        ))}
      </div>

      {/* ... Modal Logic remains the same, just use project properties ... */}
    </section>
  );
}