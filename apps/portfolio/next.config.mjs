/** @type {import("next").NextConfig} */
const nextConfig = {
  transpilePackages: ['@lancebailey26/skyforge-ui'],
  /** Lets dev clients on 127.0.0.1 talk to the dev server (HMR); avoids flaky hydration in automation. */
  allowedDevOrigins: ['127.0.0.1'],
}

export default nextConfig
