import Navbar from "@/components/Navbar";
import AboutUs from "@/components/AboutUs";

export const metadata = {
  title: "About Us | Shama Landscape Architects",
  description:
    "Learn about Shama Landscape Architects — our story, mission, and commitment to creating sustainable landscapes that connect people and nature.",
  keywords: [
    "about shama landscape architects",
    "landscape design firm Kenya",
    "Kenyan Landscape architects",
    "sustainable design team",
    "landscape firms in Kenya"
  ],
};

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <AboutUs />
    </main>
  );
}
