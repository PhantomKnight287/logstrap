import { withNextJSRouteTypes } from "nextjs-route-types";
/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        after: true,
    }
};

export default withNextJSRouteTypes(nextConfig);
