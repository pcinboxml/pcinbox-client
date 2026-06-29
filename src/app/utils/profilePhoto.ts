import { getAuthUserId } from "./authStorage";

const PROFILE_PHOTO_CACHE_PREFIX = "profilePhotoUrl_";

function isImageKitPhotoUrl(url: string): boolean {
  return url.includes("ik.imagekit.io");
}

export function getCachedProfilePhotoUrl(userId?: string | null): string {
  if (!userId || typeof window === "undefined") return "";
  return localStorage.getItem(`${PROFILE_PHOTO_CACHE_PREFIX}${userId}`)?.trim() || "";
}

export function setCachedProfilePhotoUrl(
  userId: string | number,
  url: string,
): void {
  if (typeof window === "undefined") return;

  const trimmed = url?.trim() || "";
  const key = `${PROFILE_PHOTO_CACHE_PREFIX}${userId}`;

  if (trimmed && isImageKitPhotoUrl(trimmed)) {
    localStorage.setItem(key, trimmed);
    return;
  }

  localStorage.removeItem(key);
}

export function clearCachedProfilePhotoUrl(userId?: string | null): void {
  if (!userId || typeof window === "undefined") return;
  localStorage.removeItem(`${PROFILE_PHOTO_CACHE_PREFIX}${userId}`);
}

/** Resuelve la URL de avatar: ImageKit (estado o caché) > Google > placeholder. */
export function resolveProfilePhotoUrl(
  imageKitUrl: string,
  options?: {
    googleImageUrl?: string | null;
    sessionEmail?: string | null;
    userId?: string | null;
  },
): string {
  const userId = options?.userId ?? getAuthUserId();
  const customPhoto =
    imageKitUrl?.trim() || getCachedProfilePhotoUrl(userId);

  if (customPhoto) return customPhoto;

  const googleImage = options?.googleImageUrl?.trim();
  if (!googleImage) return "/user.jpeg";

  if (typeof window === "undefined") return googleImage;

  const sessionEmail = options?.sessionEmail?.trim();
  const storedEmail = localStorage.getItem("email")?.trim();

  if (sessionEmail && storedEmail && storedEmail !== sessionEmail) {
    return "/user.jpeg";
  }

  if (!userId) return "/user.jpeg";

  return googleImage;
}

export function isAuthGoogleSession(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("authGoogle") === "true";
}
