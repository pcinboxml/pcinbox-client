import type { NextConfig } from "next";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const isDev = process.env.NODE_ENV !== "production";

const devDefaults = isDev
  ? {
      NEXT_PUBLIC_API_URL: "http://localhost:8000/api/v1",
      NEXT_PUBLIC_API_URL_PROVEEDOR: "http://localhost:8001/api/v1",
      NEXT_PUBLIC_API_URL_PAGOS: "http://localhost:8009/api/v1",
      NEXT_PUBLIC_SOCKET_PROVEEDOR: "http://localhost:8001",
      NEXT_PUBLIC_SOCKET_PAGOS: "http://localhost:8009",
      NEXT_PUBLIC_NODE_ENV: "local",
      NEXTAUTH_URL: "http://localhost:3000",
    }
  : {};

function env(key: string, fallback?: string) {
  return process.env[key] || devDefaults[key as keyof typeof devDefaults] || fallback;
}

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/sitemap",
        permanent: true,
      },
    ];
  },
  images: {
    unoptimized: true,
    domains: [
      "img.icons8.com",
      "authjs.dev",
      "ik.imagekit.io",
      "lh3.googleusercontent.com",
      "commons.wikimedia.org",
      "upload.wikimedia.org",
    ],
  },

  env: {
    NEXT_PUBLIC_API_URL: env("NEXT_PUBLIC_API_URL"),
    NEXT_PUBLIC_SOCKET_PROVEEDOR: env("NEXT_PUBLIC_SOCKET_PROVEEDOR"),
    NEXT_PUBLIC_API_URL_PROVEEDOR: env("NEXT_PUBLIC_API_URL_PROVEEDOR"),
    NEXT_PUBLIC_API_URL_PAGOS: env("NEXT_PUBLIC_API_URL_PAGOS"),
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_MEAUREMENT_ID: process.env.NEXT_PUBLIC_MEAUREMENT_ID,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_CLIENT_SECRET:
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    NEXTAUTH_SECRET:
      process.env.NEXTAUTH_SECRET || process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
    NEXTAUTH_URL: env("NEXTAUTH_URL", process.env.NEXT_PUBLIC_NEXTAUTH_URL),
    NEXT_PUBLIC_KEY_JWT: process.env.NEXT_PUBLIC_KEY_JWT,
    NEXT_PUBLIC_NODE_ENV: env("NEXT_PUBLIC_NODE_ENV"),
    NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY:
      process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY,
    NEXT_PUBLIC_SOCKET_PAGOS: env("NEXT_PUBLIC_SOCKET_PAGOS"),
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
    NEXT_PUBLIC_SOCKET_CRON: process.env.NEXT_PUBLIC_SOCKET_CRON,
  },
};

export default withBundleAnalyzer(nextConfig);
