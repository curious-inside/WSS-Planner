/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['mongoose'],
  images: {
    domains: ['localhost'],
  },
}

export default nextConfig