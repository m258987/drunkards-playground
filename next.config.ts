import type { NextConfig } from 'next'
import packageJson from './package.json' assert { type: 'json' }
const nextConfig: NextConfig = {
  /* config options here */
  env: {
    version: packageJson.version,
  },
}

export default nextConfig
