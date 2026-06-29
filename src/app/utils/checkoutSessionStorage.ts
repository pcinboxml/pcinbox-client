/**
 * Estado efímero de checkout en sessionStorage (solo la pestaña actual).
 * No persiste montos ni totales — solo selecciones de UI para rehidratar la vista.
 */
export const CHECKOUT_SESSION_KEYS = {
  ui: "checkout_ui_session",
} as const;

export type CheckoutUiSession = {
  optionEnvio?: Record<string, string>;
  seguroEnvioRequired?: Record<string, "si" | "no" | "">;
  addressByStore?: Record<string, number>;
};

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function readCheckoutUiSession(): CheckoutUiSession {
  if (typeof window === "undefined") return {};
  return safeParse<CheckoutUiSession>(
    sessionStorage.getItem(CHECKOUT_SESSION_KEYS.ui),
  ) ?? {};
}

export function writeCheckoutUiSession(partial: CheckoutUiSession) {
  if (typeof window === "undefined") return;
  const prev = readCheckoutUiSession();
  sessionStorage.setItem(
    CHECKOUT_SESSION_KEYS.ui,
    JSON.stringify({ ...prev, ...partial }),
  );
}

export function clearCheckoutUiSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CHECKOUT_SESSION_KEYS.ui);
}
