// src/app/studio/[[...index]]/page.js
import Studio from "./Studio";

export const metadata = {
  title: "Admin Studio | Shama Landscapes",
  robots: "noindex, nofollow", // Keep the admin area out of Google
};

// This tells Next.js to generate the base /studio route during build
export function generateStaticParams() {
  return [{ index: [] }];
}

// Only define the component ONCE
export default function StudioPage() {
  return <Studio />;
}