import { Suspense } from "react";
import Projects from "@/components/Projects";

export const metadata = {
  title: "Projects | Shama Landscape Architects",
  description: "Explore our portfolio of landscape architecture projects across Kenya and East Africa. From residential gardens to commercial developments, discover spaces that inspire.",
  keywords: ["landscape architecture projects", "Kenya", "Nairobi", "residential landscaping", "commercial landscaping", "garden design"],
  openGraph: {
    title: "Projects | Shama Landscape Architects",
    description: "Designing Landscapes That Last Generations",
    type: "website",
  },
};

// Loading component for Suspense fallback
function ProjectsLoading() {
  return (
    <div className="projects-loading">
      <p>Loading projects...</p>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsLoading />}>
      <Projects />
    </Suspense>
  );
}