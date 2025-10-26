/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['qnhptgpgamdkmsxsugfa.supabase.co'],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_URL: process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000',
  },
};

module.exports = nextConfig;
