"use client";

import { useFavorites } from "@/context/FavoritesContext";

export default function FavoriteButton({ propertyId }: { propertyId: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(propertyId);

  function handleClick(e: React.MouseEvent) {
    // Empêche le clic de déclencher la navigation du Link parent (la card)
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(propertyId);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-pressed={active}
      className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={active ? "#FF6060" : "none"}
        stroke={active ? "#FF6060" : "currentColor"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}