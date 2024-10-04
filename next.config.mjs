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
        hostname: "www.lophils.com"
      },
      {
        protocol: 'https',
        hostname: "i.pinimg.com"
      },
      {
        protocol: 'https',
        hostname: "acacia-soft.com"
      },
    ]
  }
};

export default nextConfig;
