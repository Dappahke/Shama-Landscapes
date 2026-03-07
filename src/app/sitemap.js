export const dynamic = "force-static"; // ✅ tells Next.js this file is static

export default function sitemap() {
  const baseUrl = "https://shamalandscapes.co.ke";
  const now = new Date();

  return [
    { url: `${baseUrl}`, lastModified: now },
    { url: `${baseUrl}/about`, lastModified: now },
    { url: `${baseUrl}/services`, lastModified: now },
    { url: `${baseUrl}/company-profile`, lastModified: now },
    { url: `${baseUrl}/sustainability`, lastModified: now },
    { url: `${baseUrl}/blog`, lastModified: now },
    { url: `${baseUrl}/contact`, lastModified: now },
  ];
}
