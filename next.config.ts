import type { NextConfig } from "next";

const nextConfig: NextConfig = {
<<<<<<< HEAD
  // Performance optimizations
  experimental: {
    // optimizeCss: true, // Disabled temporarily due to critters dependency issue
    optimizePackageImports: ['gsap', 'framer-motion', '@react-three/fiber', '@react-three/drei']
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
=======
  /* config options here */
>>>>>>> 283e2a89e6e0729170b28fa60c074a015b83bf7d
};

export default nextConfig;
