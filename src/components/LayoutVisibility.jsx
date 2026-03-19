"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveChat from "@/components/LiveChat";

export default function LayoutVisibility({ children }) {
  const pathname = usePathname();

  const hideUI =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/blog");

  return (
    <>
      {!hideUI && <Navbar />}

      <main>{children}</main>

      {!hideUI && <Footer />}
      {!hideUI && <LiveChat />}
    </>
  );
}