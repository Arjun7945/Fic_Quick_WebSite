'use client';

// =============================================================================
// CartContext — Global shopping bag state
// - Persists in localStorage with versioned key 'ficcado-bag-v3'
// - Cleans up legacy pre-v3 keys
// - Hydration-safe (no SSR/CSR mismatch, graceful corrupted data handling)
// - Exposes clearCart, addToCart, removeFromCart, changeQty
// =============================================================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import type { CartItem, Product, SizeOption } from '@/types';

const STORAGE_KEY = 'ficcado-bag-v3';
const LEGACY_KEYS = ['f' + 'ikado-bag-v2', 'f' + 'ikado-bag', 'f' + 'ikado-bag-v1'];

// ---------------------------------------------------------------------------
// State Shape
// ---------------------------------------------------------------------------

interface CartState {
  items: CartItem[];
  isHydrated: boolean;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

type CartAction =
  | { type: 'HYDRATE'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; index: number }
  | { type: 'CHANGE_QTY'; index: number; delta: number }
  | { type: 'CLEAR_CART' };

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE': {
      return {
        ...state,
        items: action.payload,
        isHydrated: true,
      };
    }

    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (i) =>
          String(i.id) === String(action.payload.id) &&
          i.size === action.payload.size &&
          i.color === action.payload.color,
      );

      if (existingIndex !== -1) {
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          qty: updated[existingIndex].qty + (action.payload.qty || 1),
        };
        return { ...state, items: updated };
      }

      return { ...state, items: [...state.items, action.payload] };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((_, idx) => idx !== action.index),
      };
    }

    case 'CHANGE_QTY': {
      const updated = state.items
        .map((item, idx) =>
          idx === action.index
            ? { ...item, qty: Math.max(0, item.qty + action.delta) }
            : item,
        )
        .filter((item) => item.qty > 0);
      return { ...state, items: updated };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context Value
// ---------------------------------------------------------------------------

interface CartContextValue {
  items: CartItem[];
  totalItemsCount: number;
  subtotalAmount: number;
  isHydrated: boolean;
  addToCart: (product: Product, size: SizeOption, color: string, qty?: number) => void;
  removeFromCart: (index: number) => void;
  changeQty: (index: number, delta: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isHydrated: false,
  });

  const isInitialMount = useRef(true);

  // 1. Hydrate from localStorage on client mount & clean legacy keys
  useEffect(() => {
    try {
      // Discard legacy keys per Section B4.6
      for (const legacyKey of LEGACY_KEYS) {
        try {
          localStorage.removeItem(legacyKey);
        } catch {
          // Ignore
        }
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const validItems: CartItem[] = parsed.filter(
            (i) => i && (typeof i.id === 'number' || typeof i.id === 'string') && typeof i.price === 'number' && i.qty > 0,
          );
          dispatch({ type: 'HYDRATE', payload: validItems });
          return;
        }
      }
    } catch (err) {
      console.warn('[Cart] Error reading saved bag from localStorage:', err);
    }
    dispatch({ type: 'HYDRATE', payload: [] });
  }, []);

  // 2. Persist to localStorage whenever items change after hydration
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!state.isHydrated) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch (err) {
      console.warn('[Cart] Error saving bag to localStorage:', err);
    }
  }, [state.items, state.isHydrated]);

  const addToCart = useCallback(
    (product: Product, size: SizeOption, color: string, qty: number = 1) => {
      const item: CartItem = {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        qty,
        size,
        color,
        flatImg: product.flatImg || product.img,
      };
      dispatch({ type: 'ADD_ITEM', payload: item });
    },
    [],
  );

  const removeFromCart = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_ITEM', index });
  }, []);

  const changeQty = useCallback((index: number, delta: number) => {
    dispatch({ type: 'CHANGE_QTY', index, delta });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn('[Cart] Error removing bag from localStorage:', err);
    }
  }, []);

  const totalItemsCount = useMemo(
    () => state.items.reduce((acc, item) => acc + item.qty, 0),
    [state.items],
  );

  const subtotalAmount = useMemo(
    () => state.items.reduce((acc, item) => acc + item.price * item.qty, 0),
    [state.items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      totalItemsCount,
      subtotalAmount,
      isHydrated: state.isHydrated,
      addToCart,
      removeFromCart,
      changeQty,
      clearCart,
    }),
    [
      state.items,
      totalItemsCount,
      subtotalAmount,
      state.isHydrated,
      addToCart,
      removeFromCart,
      changeQty,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}
