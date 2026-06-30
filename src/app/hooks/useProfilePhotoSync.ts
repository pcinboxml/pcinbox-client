"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTheContext } from "../services/globalContext";
import usePerfil from "../perfil/usePerfil";
import { getAuthToken, getAuthUserId, isAuthGoogle } from "../utils/authStorage";
import { getCachedProfilePhotoUrl } from "../utils/profilePhoto";

export default function useProfilePhotoSync() {
  const { hasToken, setRutaImgPerfil } = useTheContext();
  const { getPhotoUser } = usePerfil();
  const { status } = useSession();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = getAuthToken();
    const userId = getAuthUserId();
    if (!token || !userId) return;

    const cached = getCachedProfilePhotoUrl(userId);
    if (cached) {
      setRutaImgPerfil(cached);
    }
  }, [setRutaImgPerfil]);

  useEffect(() => {
    if (hasToken === false) {
      setRutaImgPerfil("");
      return;
    }

    const token = getAuthToken();
    const userId = getAuthUserId();
    if (!token || !userId) return;

    const authReady =
      hasToken === true ||
      status === "authenticated" ||
      (!isAuthGoogle() && Boolean(token));

    if (!authReady) return;

    void getPhotoUser();
    // getPhotoUser viene de usePerfil (referencia estable por closure del hook)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasToken, status, setRutaImgPerfil]);
}

/** Debe montarse dentro de SessionProvider (NextAuth). */
export function ProfilePhotoLoader() {
  useProfilePhotoSync();
  return null;
}
