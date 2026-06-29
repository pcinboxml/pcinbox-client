import { isGoogleOAuthConfigured, publicEnv } from "@/app/config/env";

/** Credenciales OAuth de Google (servidor NextAuth). */
export function getGoogleOAuthConfig() {
  return {
    clientId: publicEnv.googleClientId,
    clientSecret: publicEnv.googleClientSecret,
    enabled: isGoogleOAuthConfigured(),
  };
}

/** Indica si el login con Google está disponible (cliente). */
export function isGoogleAuthEnabled(): boolean {
  return Boolean(publicEnv.googleClientId);
}
