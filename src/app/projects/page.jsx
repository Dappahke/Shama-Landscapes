import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";

export const metadata = {
  title: "Landscape Architecture Projects in Kenya | Shama Portfolio",
  description:
    "Explore Shama Landscape Architects portfolio featuring residential, commercial, and hospitality landscape projects across Kenya.",
  alternates: {
    canonical: "https://shamalandscapes.co.ke/projects",
  },
};

export default function ProjectsPage() {
  return (
    <main>
      <Navbar />
      <Projects />
    </main>
  );
}