/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "avatars.githubusercontent.com"
      },
      {
        protocol: 'https',
        hostname: "i.pinimg.com"
      },
      {
        protocol: 'https',
        hostname: "*.pagbilaoenergy.app"
      },
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.fbcdn.net",  // facebook
      },
      {
        protocol: "https",
        hostname: "media.licdn.com", // linkedIn
      },
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ]
  }
};

export default nextConfig;
