"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { brand } from "@/data/brand";
import type { Currency } from "@/data/types";
import { isCurrency, lineKey, priceCart, type CartLine } from "@/lib/pricing";

type Action =
  | { type: "add"; line: CartLine }
  | { type: "addMany"; lines: CartLine[] }
  | { type: "setQty"; key: string; qty: number }
  | { type: "remove"; key: string }
  | { type: "setVariant"; key: string; variantId: string }
  | { type: "clear" }
  | { type: "hydrate"; lines: CartLine[] };

function merge(lines: CartLine[], add: CartLine): CartLine[] {
  const k = lineKey(add);
  const existing = lines.find((l) => lineKey(l) === k);
  if (existing) return lines.map((l) => (lineKey(l) === k ? { ...l, qty: Math.min(99, l.qty + add.qty) } : l));
  return [...lines, add];
}

function reducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case "add":
      return merge(state, action.line);
    case "addMany":
      return action.lines.reduce(merge, state);
    case "setQty":
      return action.qty <= 0
        ? state.filter((l) => lineKey(l) !== action.key)
        : state.map((l) => (lineKey(l) === action.key ? { ...l, qty: Math.min(99, action.qty) } : l));
    case "remove":
      return state.filter((l) => lineKey(l) !== action.key);
    case "setVariant": {
      const line = state.find((l) => lineKey(l) === action.key);
      if (!line) return state;
      const next = { ...line, variantId: action.variantId };
      const collides = state.some((l) => lineKey(l) === lineKey(next));
      return collides
        ? merge(state.filter((l) => lineKey(l) !== action.key), next)
        : state.map((l) => (lineKey(l) === action.key ? next : l));
    }
    case "clear":
      return state.length ? [] : state;
    case "hydrate":
      return action.lines;
  }
}

interface Store {
  lines: CartLine[];
  currency: Currency;
  setCurrency: (c: Currency) => void;
  add: (line: CartLine, message?: string) => void;
  addMany: (lines: CartLine[], message?: string) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  setVariant: (key: string, variantId: string) => void;
  clear: () => void;
  cart: ReturnType<typeof priceCart>;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  toast: string | null;
}

const StoreContext = createContext<Store | null>(null);

const CART_KEY = "pf.cart.v1";
const CURRENCY_KEY = "pf.currency";

function guessCurrency(): Currency {
  try {
    const lang = navigator.language || "";
    if (/-US$|-CA$/i.test(lang)) return "USD";
    if (/^(de|fr|es|it|nl|pt|fi|el|sk|sl|et|lv|lt)\b|-IE$|-AT$|-BE$/i.test(lang)) return "EUR";
  } catch {
    /* ignore */
  }
  return brand.defaultCurrency;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const [currency, setCurrencyState] = useState<Currency>(brand.defaultCurrency);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          dispatch({
            type: "hydrate",
            lines: parsed.filter(
              (l): l is CartLine =>
                l && typeof l.productId === "string" && typeof l.variantId === "string" && typeof l.qty === "number",
            ),
          });
        }
      }
      const c = localStorage.getItem(CURRENCY_KEY);
      setCurrencyState(isCurrency(c) ? c : guessCurrency());
    } catch {
      setCurrencyState(guessCurrency());
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable */
    }
  }, [lines, ready]);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(CURRENCY_KEY, c);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const flash = useCallback((msg?: string) => {
    if (!msg) return;
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const store = useMemo<Store>(
    () => ({
      lines,
      currency,
      setCurrency,
      add: (line, message) => {
        dispatch({ type: "add", line });
        setDrawerOpen(true);
        flash(message);
      },
      addMany: (ls, message) => {
        dispatch({ type: "addMany", lines: ls });
        setDrawerOpen(true);
        flash(message);
      },
      setQty: (key, qty) => dispatch({ type: "setQty", key, qty }),
      remove: (key) => dispatch({ type: "remove", key }),
      setVariant: (key, variantId) => dispatch({ type: "setVariant", key, variantId }),
      clear: () => dispatch({ type: "clear" }),
      cart: priceCart(lines, currency),
      drawerOpen,
      setDrawerOpen,
      toast,
    }),
    [lines, currency, setCurrency, drawerOpen, toast, flash],
  );

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
