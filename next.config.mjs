/** @type {import('next').Config} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        turbo: {
            root: 'C:/Dev/fecoka-web',
        },
    },
}

export default nextConfig;
