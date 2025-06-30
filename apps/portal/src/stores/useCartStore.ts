import type { CartGameSession, PlayLevel } from "@repo/shared"
import { create } from "zustand"

interface CartState {
  cart: CartGameSession[]
}

interface CartAction {
  updateCart: (cart: CartState["cart"]) => void
  updatePlayLevelById: (id: number, PlayLevel: PlayLevel) => void
  clearCart: () => void
}

export const useCartStore = create<CartState & CartAction>((set) => ({
  cart: [],
  updateCart: (cart) => set(() => ({ cart: cart })),
  updatePlayLevelById: (id, playLevel) =>
    set((state) => ({
      cart: state.cart.map((session) => {
        if (session.id === id) return { ...session, playLevel }
        return session
      }),
    })),
  clearCart: () => set(() => ({ cart: [] })),
}))
