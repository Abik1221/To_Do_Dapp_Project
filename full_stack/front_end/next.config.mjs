/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    images: { unoptimized: true },
    basePath: `/web_query/${process.env.NEXT_PUBLIC_BRID}/web_static`,
  };

export default nextConfig;
