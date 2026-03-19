import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Image from "next/image";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function ProjectPage({ params }) {
  const { id } = await params; // ✅ FIX HERE

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) return notFound();

  return (
    <main className="text-black bg-shama-clay">
      
      {/* HERO */}
      <div className="relative h-[70vh]">
        <Image
          src={project.cover_url}
          alt={project.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center max-w-5xl px-6 mx-auto text-white bg-black/40">
          <h1 className="text-5xl font-bold">{project.title}</h1>
          <p className="mt-4 text-lg">{project.tagline}</p>
          <p className="mt-2 text-sm">
            {project.location} • {project.year} • {project.project_type}
          </p>
        </div>
      </div>

      {/* INFO STRIP */}
      <div className="grid grid-cols-2 gap-6 px-6 py-12 mx-auto text-sm md:grid-cols-5 max-w-7xl">
        <div>
          <p className="font-semibold">Client</p>
          <p>{project.client || "-"}</p>
        </div>
        <div>
          <p className="font-semibold">Location</p>
          <p>{project.location}</p>
        </div>
        <div>
          <p className="font-semibold">Year</p>
          <p>{project.year}</p>
        </div>
        <div>
          <p className="font-semibold">Area</p>
          <p>{project.area || "-"}</p>
        </div>
        <div>
          <p className="font-semibold">Status</p>
          <p>{project.status}</p>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="max-w-3xl px-6 pb-12 mx-auto">
        <h2 className="mb-4 text-2xl font-semibold">Project Overview</h2>
        <p className="leading-relaxed text-gray-700">
          {project.description}
        </p>
      </div>

      {/* GALLERY */}
      <div className="grid gap-6 px-6 pb-16 mx-auto max-w-7xl md:grid-cols-2">
        {project.image_gallery?.map((img, i) => (
          <div key={i} className="relative h-75">
            <Image
              src={img}
              alt={`gallery-${i}`}
              fill
              className="object-cover rounded-xl"
            />
          </div>
        ))}
      </div>

    </main>
  );
}