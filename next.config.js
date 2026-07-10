/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // SSR (getServerSideProps) — the portal reads live from CKAN and hosts
  // Queryless API routes, so no static export. Image optimizer left off; the
  // portal uses plain <img> tags anyway.
  images: { unoptimized: true },
}
module.exports = nextConfig
