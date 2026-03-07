import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import NewsletterModal from "@/components/NewsletterModal";

// ✅ Load Montserrat properly
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
});

// ✅ Existing fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  // ✅ metadataBase is required for OpenGraph images to work on production
  metadataBase: new URL("https://shamalandscapes.co.ke"),
  title: "Shama Landscape Architects | Imagine it. Build it. Have it.",
  description:
    "Shama Landscape Architects blends design, sustainability, and innovation to create timeless outdoor spaces. Based in Kakamega, Kenya — we bring landscapes to life through creative vision and ecological harmony.",
  keywords: [
    "landscape architecture",
    "Shama Landscape Architects",
    "Kenya landscape design",
    "Kakamega architects",
    "urban design",
    "sustainable landscapes",
    "green architecture",
  ],
  authors: [{ name: "Shama Landscape Architects", url: "https://shamalandscapes.co.ke" }],
  creator: "Shama Landscape Architects",
  publisher: "Shama Landscape Architects",
  openGraph: {
    title: "Shama Landscape Architects | Imagine it. Build it. Have it.",
    description:
      "Transforming outdoor spaces into sustainable works of art across Kenya and East Africa.",
    url: "https://shamalandscapes.co.ke",
    siteName: "Shama Landscape Architects",
    images: [
      {
        url: "/assets/logo.png",
        width: 1200,
        height: 630,
        alt: "Shama Landscape Architects Logo",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shama Landscape Architects",
    description:
      "Creating sustainable outdoor spaces that connect people, nature, and design.",
    images: ["/assets/logo.png"],
  },
  alternates: {
    canonical: "https://shamalandscapes.co.ke",
  },
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      className={`${montserrat.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <link rel="icon" href="/assets/logo.png" type="image/png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ArchitecturalFirm",
              name: "Shama Landscape Architects",
              alternateName: "Shama Landscape Architects Ltd",
              url: "https://shamalandscapes.co.ke",
              logo: "https://shamalandscapes.co.ke/assets/logo.png",
              image: "https://shamalandscapes.co.ke/assets/logo.png",
              description:
                "Shama Landscape Architects is a Kenya-based firm specializing in sustainable landscape architecture, planning, and design innovation.",
              telephone: "+254735184292",
              email: "info@shamalandscapes.co.ke",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Ambwere Plaza, 1st Floor",
                addressLocality: "Kakamega",
                addressRegion: "Western",
                postalCode: "50100",
                addressCountry: "KE",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 0.2827,
                longitude: 34.7523,
              },
              sameAs: [
                "https://www.instagram.com/shama.landscape.architects",
                "https://www.linkedin.com/company/shama-landscape-architects",
              ],
              areaServed: {
                "@type": "Place",
                name: "Kenya and East Africa",
              },
              openingHours: "Mo-Fr 08:00-17:00",
              founder: {
                "@type": "Person",
                name: "John Mulievi",
                jobTitle: "Principal Landscape Architect",
              },
              makesOffer: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Landscape Design and Planning",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Sustainable Site Development",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Irrigation and Garden Design",
                  },
                },
              ],
            }),
          }}
        />
      </head>

      <body
        className="antialiased font-montserrat bg-shama-clay text-shama-black"
      >
        <Navbar />
        
        <main className="pt-16">
          {children}
        </main>

        {/* ✅ Newsletter Modal pops up globally */}
        <NewsletterModal />

        <WhatsAppButton />
        <Footer />
      </body>
    </html>
  );
}