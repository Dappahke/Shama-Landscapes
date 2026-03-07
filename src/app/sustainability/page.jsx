import Navbar from "@/components/Navbar";
import Sustainability from "@/components/Sustainability";

export const metadata = {
  title: "Sustainability & Innovation | Shama Landscape Architects",
  description:
    "We design with the environment in mind — integrating green materials, native planting, and innovative design solutions for climate-resilient spaces.",
  keywords: [
    "sustainability in architecture",
    "eco-friendly landscaping",
    "green design Kenya",
    "climate-resilient architecture",
  ],
};

export default function SustainabilityPage() {
  return (
    <main>
      <Navbar />
      <Sustainability />
    </main>
  );
}
