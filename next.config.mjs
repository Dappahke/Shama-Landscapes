/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', <-- Comment this out or delete it
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**', // More permissive for Sanity
      },
      {
        protocol: 'https',
        hostname: 'ecldsnjdpmqhrjlqbaxu.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;