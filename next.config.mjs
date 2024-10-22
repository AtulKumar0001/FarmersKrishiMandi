/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['sbzxabupqcuwinesuoim.supabase.co'], // Add your Supabase domain here
    },
    i18n: {
      locales: ['en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'pa', 'ur'],
      defaultLocale: 'en',
    },
  };
  
  export default nextConfig;
  