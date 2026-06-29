/** Claves de sesión de autenticación (única fuente de verdad). */
export const AUTH_STORAGE_KEYS = {
  token: "token",
  idUser: "idUser",
  email: "email",
  name: "name",
  lastname: "lastname",
  authGoogle: "authGoogle",
} as const;

export type AuthSession = {
  token: string;
  idUser: string | number;
  email?: string;
  name?: string;
  lastname?: string;
  authGoogle?: boolean;
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function getAuthToken(): string | null {
  if (!isBrowser()) return null;
  const token = localStorage.getItem(AUTH_STORAGE_KEYS.token);
  if (!token || token === "null" || token === "undefined") return null;
  return token;
}

export function getAuthUserId(): string | null {
  if (!isBrowser()) return null;
  const id = localStorage.getItem(AUTH_STORAGE_KEYS.idUser);
  return id && id !== "null" ? id : null;
}

export function getAuthProfile(): Pick<AuthSession, "email" | "name" | "lastname"> {
  if (!isBrowser()) return {};
  return {
    email: localStorage.getItem(AUTH_STORAGE_KEYS.email) ?? undefined,
    name: localStorage.getItem(AUTH_STORAGE_KEYS.name) ?? undefined,
    lastname: localStorage.getItem(AUTH_STORAGE_KEYS.lastname) ?? undefined,
  };
}

export function isAuthGoogle(): boolean {
  if (!isBrowser()) return false;
  return localStorage.getItem(AUTH_STORAGE_KEYS.authGoogle) === "true";
}

export function hasAuthToken(): boolean {
  return Boolean(getAuthToken());
}

export function setAuthSession(session: AuthSession) {
  if (!isBrowser()) return;
  localStorage.setItem(AUTH_STORAGE_KEYS.token, session.token);
  localStorage.setItem(AUTH_STORAGE_KEYS.idUser, String(session.idUser));
  if (session.email != null) localStorage.setItem(AUTH_STORAGE_KEYS.email, session.email);
  if (session.name != null) localStorage.setItem(AUTH_STORAGE_KEYS.name, session.name);
  if (session.lastname != null) {
    localStorage.setItem(AUTH_STORAGE_KEYS.lastname, session.lastname);
  }
  localStorage.setItem(
    AUTH_STORAGE_KEYS.authGoogle,
    session.authGoogle ? "true" : "false",
  );
}

export function clearAuthSession() {
  if (!isBrowser()) return;
  Object.values(AUTH_STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}
