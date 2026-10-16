/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/projects/jobs',
        destination: '/projects/list',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
