/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets the dev server be opened from 127.0.0.1 and a phone on the same network.
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
