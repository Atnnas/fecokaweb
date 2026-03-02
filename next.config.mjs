/** @type {import('next').Config} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
        ],
    },
    experimental: {
        turbo: {
            root: 'C:/Dev/fecoka-web',
        },
    },
}

export default nextConfig;
