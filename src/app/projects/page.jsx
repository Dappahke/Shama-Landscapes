import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";

export const metadata = {
  title: "Landscape Architecture Projects in Kenya | Shama Portfolio",
  description:
    "View our portfolio of award-winning landscape architecture in Kenya. Featuring The Hub Karen, Nairobi Street Kitchen, and luxury residential garden designs.",
  keywords: [
    "landscape architects Nairobi",
    "garden design portfolio Kenya",
    "commercial landscaping projects",
    "residential landscape designers",
    "Shama Landscape Architects projects",
  ],
  alternates: {
    canonical: "https://shamalandscapes.co.ke/projects",
  },
};

export default function ProjectsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "The Hub Karen Landscape Design",
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Nairobi Street Kitchen Hospitality Design",
              },
            ],
          }),
        }}
      />
      <main>
        <Navbar />
        <Projects />
      </main>
    </>
  );
}