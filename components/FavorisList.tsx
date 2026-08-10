"use client";

import { useFavorites } from "@/context/FavoritesContext";
import PropertyCard from "@/components/PropertyCard";
import type { PropertySummary } from "@/lib/api";

// Composant CLIENT : reçoit TOUTES les propriétés en props (déjà récupérées
// côté serveur, sans souci CORS), et filtre seulement grâce au Context
// des favoris (qui, lui, a vraiment besoin du navigateur/localStorage).
export default function FavorisList({
  allProperties,
}: {
  allProperties: PropertySummary[];
}) {
  const { favorites } = useFavorites();

  const favoriteProperties = allProperties.filter((property) =>
    favorites.includes(property.id)
  );

  if (favoriteProperties.length === 0) {
    return (
      <p className="text-gray-500">
        Vous n&apos;avez pas encore ajouté de logement à vos favoris.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {favoriteProperties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}