import Navbar from "@/components/Navbar";
import Services from "@/components/Services";

export const metadata = {
  title: "Our Services | Shama Landscape Architects",
  description:
    "Explore our landscape architecture services — from master planning and site design to irrigation systems, garden design, and ecological restoration across Kenya.",
  keywords: [
    "landscape architecture services",
    "garden design Kenya",
    "irrigation planning",
    "site design Kenya",
  ],
};

export default function ServicesPage() {
  return (
    <main>
      <Navbar />
      <Services />
    </main>
  );
}
