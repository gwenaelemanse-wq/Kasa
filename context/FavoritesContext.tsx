"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "kasa-favorites";

interface FavoritesContextValue {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Chargement depuis le localStorage au premier rendu côté client uniquement
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        setFavorites([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Sauvegarde à chaque changement, une fois le chargement initial fait
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  function isFavorite(id: string) {
    return favorites.includes(id);
  }

  function toggleFavorite(id: string) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites doit être utilisé à l'intérieur de FavoritesProvider");
  }
  return context;
}