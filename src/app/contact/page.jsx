import Navbar from "@/components/Navbar";
import ContactUs from "@/components/ContactUs";

export const metadata = {
  title: "Contact Us | Shama Landscape Architects",
  description:
    "Get in touch with Shama Landscape Architects — visit us at Ambwere Plaza, 1st Floor, Kakamega, or send a message to discuss your project ideas and consultations.",
  keywords: [
    "contact shama landscape architects",
    "landscape design Kakamega",
    "architects near me Kenya",
    "architects in western Kenya",
  ],
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <ContactUs />
    </>
  );
}
