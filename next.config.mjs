/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['external-content.duckduckgo.com'], // Add other domains as needed
    },
    i18n: {
      locales: ['en', 'pl', 'fr', 'jp', 'kr', 'ar', 'rs'], // Your supported languages
      defaultLocale: 'en', // Default language
      localeDetection: true, // Detect language automatically
    },
  };
  
  export default nextConfig;
  