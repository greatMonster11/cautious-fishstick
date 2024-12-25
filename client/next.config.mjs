/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "tmdb.org",
      "themoviedb.org",
      "i1-vnexpress.vnecdn.net",
      "i1-thethao.vnecdn.net",
    ],
  },
  output: "standalone",
};

export default nextConfig;
