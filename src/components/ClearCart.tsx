"use client";

import { useEffect, useRef } from "react";
import { useStore } from "./StoreProvider";

export function ClearCart() {
  const { clear } = useStore();
  const clearRef = useRef(clear);
  clearRef.current = clear;
  useEffect(() => {
    // Defer so it runs after the store has hydrated from storage.
    const t = setTimeout(() => clearRef.current(), 50);
    return () => clearTimeout(t);
  }, []);
  return null;
}
