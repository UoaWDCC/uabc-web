import { AUTH_COOKIE_NAME } from "@repo/shared"

type TokenStoreListener = () => void

const listeners = new Set<TokenStoreListener>()

function getSnapshot(): string | null {
  if (typeof window === "undefined") {
    return null
  }
  return localStorage.getItem(AUTH_COOKIE_NAME)
}

function subscribe(listener: TokenStoreListener): () => void {
  listeners.add(listener)

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === AUTH_COOKIE_NAME) {
      listeners.forEach((listener) => listener())
    }
  }

  window.addEventListener("storage", handleStorageChange)

  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", handleStorageChange)
  }
}

function setToken(token: string | null): void {
  if (typeof window === "undefined") {
    return
  }

  if (token) {
    localStorage.setItem(AUTH_COOKIE_NAME, token)
  } else {
    localStorage.removeItem(AUTH_COOKIE_NAME)
  }

  listeners.forEach((listener) => listener())
}

export const tokenStore = {
  subscribe,
  getSnapshot,
  setToken,
}
