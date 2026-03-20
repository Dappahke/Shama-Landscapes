import { supabase } from "@/lib/supabaseClient";
import ProjectDetail from "./ProjectDetail";

// Generate static params for all projects at build time
export async function generateStaticParams() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id');
  
  if (error || !projects) {
    return [];
  }
  
  return projects.map((project) => ({
    id: project.id,
  }));
}

// Dynamic metadata for each project (fetched server-side)
export async function generateMetadata({ params }) {
  const { data: project, error } = await supabase
    .from('projects')
    .select('title, tagline, location, description')
    .eq('id', params.id)
    .single();
  
  if (error || !project) {
    return {
      title: "Project Not Found | Shama Landscape Architects"
    };
  }
  
  return {
    title: `${project.title} | Shama Landscape Architects`,
    description: `${project.tagline} - ${project.location}. ${project.description?.substring(0, 150)}...`,
    openGraph: {
      title: `${project.title} | Shama Landscape Architects`,
      description: project.tagline,
      type: "article",
      images: project.cover_url ? [project.cover_url] : undefined,
    },
  };
}

export default function ProjectDetailPage({ params }) {
  return <ProjectDetail params={params} />;
}