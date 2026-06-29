const DRAFT_KEY = "pcinbox-global-search-draft";
const HISTORY_KEY = "pcinbox-global-search-history";
const MAX_HISTORY = 8;

function readStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // quota / private mode
  }
}

export function getSearchDraft(): string {
  return readStorage(DRAFT_KEY) ?? "";
}

export function setSearchDraft(value: string): void {
  writeStorage(DRAFT_KEY, value);
}

export function clearSearchDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}

export function getSearchHistory(): string[] {
  const raw = readStorage(HISTORY_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item) => typeof item === "string" && item.trim())
      : [];
  } catch {
    return [];
  }
}

export function addSearchHistory(term: string): void {
  const normalized = term.trim();
  if (normalized.length < 2) return;

  const current = getSearchHistory().filter(
    (item) => item.toLowerCase() !== normalized.toLowerCase(),
  );
  const next = [normalized, ...current].slice(0, MAX_HISTORY);
  writeStorage(HISTORY_KEY, JSON.stringify(next));
}

export function removeSearchHistory(term: string): void {
  const next = getSearchHistory().filter(
    (item) => item.toLowerCase() !== term.toLowerCase(),
  );
  writeStorage(HISTORY_KEY, JSON.stringify(next));
}
