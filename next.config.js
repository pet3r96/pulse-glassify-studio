/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
}

export default nextConfig