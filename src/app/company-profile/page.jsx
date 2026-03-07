import Navbar from "@/components/Navbar";
import CompanyProfile from "@/components/CompanyProfile";

export const metadata = {
  title: "Company Profile | Shama Landscape Architects",
  description:
    "Shama Landscape Architects — a registered landscape design consultancy in Kenya. View our profile, vision, and professional approach to sustainable site planning and development.",
  keywords: [
    "company profile Shama Landscape Architects",
    "landscape consultancy Kenya",
    "registered architects Kenya",
  ],
};

export default function CompanyProfilePage() {
  return (
    <main>
      <Navbar />
      <CompanyProfile />
    </main>
  );
}
