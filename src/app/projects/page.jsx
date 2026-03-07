import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";

export const metadata = {
  title: "Our Projects | Shama Landscape Architects",
  description:
    "Explore our landscape architecture services — from master planning and site design to irrigation systems, garden design, and ecological restoration across Kenya.",
  keywords: [
    "landscape architecture services",
    "garden design Kenya",
    "irrigation planning",
    "site design Kenya",
  ],
};

export default function ProjectsPage() {
  return (
    <main>
      <Navbar />
      <Projects />
    </main>
  );
}
