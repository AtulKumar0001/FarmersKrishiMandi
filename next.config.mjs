/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['sbzxabupqcuwinesuoim.supabase.co'],
  },
  i18n: {
    locales: ['en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'pa', 'ur'],
    defaultLocale: 'en',
  },
};

export default nextConfig;
