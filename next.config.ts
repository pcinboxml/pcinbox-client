import type { NextConfig } from "next";
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

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
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SOCKET_PROVEEDOR: process.env.NEXT_PUBLIC_SOCKET_PROVEEDOR,
    NEXT_PUBLIC_API_URL_PROVEEDOR: process.env.NEXT_PUBLIC_API_URL_PROVEEDOR,
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
    NEXTAUTH_SECRET: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
    NEXT_PUBLIC_KEY_JWT: process.env.NEXT_PUBLIC_KEY_JWT,
    NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY:
      process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY,
    NEXT_PUBLIC_SOCKET_PAGOS: process.env.NEXT_PUBLIC_SOCKET_PAGOS,
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
    NEXT_PUBLIC_SOCKET_CRON: process.env.NEXT_PUBLIC_SOCKET_CRON,
    NEXT_PUBLIC_API_KEY_GOOGLE_REVIEWS:
      process.env.NEXT_PUBLIC_API_KEY_GOOGLE_REVIEWS,
    NEXT_PUBLIC_PLACE_ID_GOOGLE_REVIEWS:
      process.env.NEXT_PUBLIC_PLACE_ID_GOOGLE_REVIEWS,
  },

  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: [
  //         {
  //           key: "Access-Control-Allow-Origin",
  //           value: "*",
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default withBundleAnalyzer(nextConfig);
