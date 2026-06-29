/**
 * Configuración centralizada de URLs y variables públicas.
 * En desarrollo usa localhost si no hay .env.local / .env.production.
 */

const IS_DEV = process.env.NODE_ENV !== "production";

const DEV_DEFAULTS = {
  API_URL: "http://localhost:8000/api/v1",
  API_URL_PROVEEDOR: "http://localhost:8001/api/v1",
  API_URL_PAGOS: "http://localhost:8009/api/v1",
  SOCKET_PROVEEDOR: "http://localhost:8001",
  SOCKET_PAGOS: "http://localhost:8009",
  NEXTAUTH_URL: "http://localhost:3000",
  NODE_ENV_LABEL: "local",
} as const;

const PROD_FALLBACKS = {
  API_URL_PROVEEDOR:
    "https://server-proveedores-a69933baa01a.herokuapp.com/api/v1",
} as const;

function readEnv(key: string): string {
  return process.env[key]?.trim() ?? "";
}

function withDevDefault(envKey: string, devDefault: string): string {
  const value = readEnv(envKey);
  if (value) return value;
  if (IS_DEV) return devDefault;
  return "";
}

function withProdFallback(
  envKey: string,
  devDefault: string,
  prodFallback?: string,
): string {
  const value = readEnv(envKey);
  if (value) return value;
  if (IS_DEV) return devDefault;
  return prodFallback ?? "";
}

export const publicEnv = {
  apiUrl: withDevDefault("NEXT_PUBLIC_API_URL", DEV_DEFAULTS.API_URL),
  apiUrlProveedor: withProdFallback(
    "NEXT_PUBLIC_API_URL_PROVEEDOR",
    DEV_DEFAULTS.API_URL_PROVEEDOR,
    PROD_FALLBACKS.API_URL_PROVEEDOR,
  ),
  apiUrlPagos: withDevDefault(
    "NEXT_PUBLIC_API_URL_PAGOS",
    DEV_DEFAULTS.API_URL_PAGOS,
  ),
  socketProveedor: withDevDefault(
    "NEXT_PUBLIC_SOCKET_PROVEEDOR",
    DEV_DEFAULTS.SOCKET_PROVEEDOR,
  ),
  socketPagos: withDevDefault(
    "NEXT_PUBLIC_SOCKET_PAGOS",
    DEV_DEFAULTS.SOCKET_PAGOS,
  ),
  nodeEnvLabel: readEnv("NEXT_PUBLIC_NODE_ENV") || (IS_DEV ? DEV_DEFAULTS.NODE_ENV_LABEL : "prod"),
  keyJwt: readEnv("NEXT_PUBLIC_KEY_JWT"),
  googleClientId:
    readEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID") || readEnv("GOOGLE_CLIENT_ID"),
  googleClientSecret:
    readEnv("NEXT_PUBLIC_GOOGLE_CLIENT_SECRET") ||
    readEnv("GOOGLE_CLIENT_SECRET"),
  nextAuthSecret:
    readEnv("NEXTAUTH_SECRET") || readEnv("NEXT_PUBLIC_NEXTAUTH_SECRET"),
  nextAuthUrl: IS_DEV
    ? DEV_DEFAULTS.NEXTAUTH_URL
    :
        readEnv("NEXTAUTH_URL") ||
        readEnv("NEXT_PUBLIC_NEXTAUTH_URL") ||
        "",
};

export function isGoogleOAuthConfigured(): boolean {
  return Boolean(publicEnv.googleClientId && publicEnv.googleClientSecret);
}
