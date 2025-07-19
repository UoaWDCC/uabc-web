import { AUTH_COOKIE_NAME } from "@repo/shared"

type TokenStoreListener = () => void
type TokenStoreSnapshot = string | null

/**
 * Token store class that manages authentication tokens in localStorage
 * and provides a subscription mechanism for token changes
 */
class TokenStore {
  private listeners = new Set<TokenStoreListener>()

  /**
   * Gets the current token from localStorage
   * @returns Current token or null if not found
   */
  getSnapshot(): TokenStoreSnapshot {
    if (typeof window === "undefined") {
      return null
    }
    return localStorage.getItem(AUTH_COOKIE_NAME)
  }

  /**
   * Subscribes to token changes
   * @param listener Function to call when token changes
   * @returns Unsubscribe function
   */
  subscribe = (listener: TokenStoreListener): (() => void) => {
    this.listeners.add(listener)

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === AUTH_COOKIE_NAME) {
        this.notifyListeners()
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange)
    }

    return () => {
      this.listeners.delete(listener)
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorageChange)
      }
    }
  }

  /**
   * Sets or removes the authentication token
   * @param token Token to store or null to remove
   */
  setToken = (token: string | null): void => {
    if (typeof window === "undefined") {
      return
    }

    if (token) {
      localStorage.setItem(AUTH_COOKIE_NAME, token)
    } else {
      localStorage.removeItem(AUTH_COOKIE_NAME)
    }

    this.notifyListeners()
  }

  /**
   * Notifies all listeners of token changes
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener()
      } catch (error) {
        console.error("Token store listener error:", error)
      }
    })
  }
}

export const tokenStore = new TokenStore()
