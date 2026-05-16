import { useState, useEffect } from "react";

const KEY = "vc_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggle = (listingId: string) => {
    setFavorites((prev) =>
      prev.includes(listingId) ? prev.filter((id) => id !== listingId) : [...prev, listingId]
    );
  };

  const isFav = (listingId: string) => favorites.includes(listingId);
  return { favorites, toggle, isFav };
}
