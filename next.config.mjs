/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', <-- Comment this out or delete it
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

export default nextConfig;