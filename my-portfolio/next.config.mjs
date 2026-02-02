/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // --- EXISTING PATTERNS ---
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/**',
      },
      
      // --- NEW ADDITIONS ---
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // <--- For your new large file uploads
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',   // <--- Backup/Legacy support
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // <--- Needed for Google Drive previews
        port: '',
        pathname: '/**',
      },
    ],
  },
  // --- EXPERIMENTAL CONFIGURATION ---
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', // Increases upload limit to 50MB
    },
  },
};

export default nextConfig;