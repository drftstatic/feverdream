/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb'
    },
    // Ensure native canvas stays external for server bundling
    serverComponentsExternalPackages: ['@napi-rs/canvas'],
    outputFileTracingIncludes: {
      'src/app/api/**': ['node_modules/@napi-rs/canvas/**/*']
    }
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Avoid bundling native addon; keep it as a runtime require
      config.externals = config.externals || []
      if (Array.isArray(config.externals)) {
        config.externals.push('@napi-rs/canvas')
      }
    }
    return config
  }
}

export default nextConfig
