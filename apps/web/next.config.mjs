/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/(login|register)\b/",
          destination: "/projects",
          has: [
            {
              type: "cookie",
              key: "logstrap_token",
            },
          ],
        },
        {
          source: "/(projects)\b/",
          destination: "/login",
          missing: [
            {
              type: "cookie",
              key: "logstrap_token",
            },
          ],
        },
      ],
    };
  },
};

export default nextConfig;
