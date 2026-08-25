import Image from "next/image";
import Link from "next/link";
import type { PropertySummary } from "@/lib/api";
import FavoriteButton from "@/components/FavoriteButton";

// Composant SERVEUR : reçoit la donnée en props, l'affiche.
// Le bouton favori (interactif) est isolé dans son propre composant client.
export default function PropertyCard({ property }: { property: PropertySummary }) {
  return (
    <Link
      href={`/logement/${property.id}`}
      className="block overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-square w-full">
        <Image
          src={property.cover}
          alt={property.title}
          fill
          className="object-cover"
        />
        <FavoriteButton propertyId={property.id} />
      </div>
      <div className="p-3">
        <h3 className="truncate font-semibold">{property.title}</h3>
        <p className="truncate text-sm text-gray-500">{property.location}</p>
        <p className="mt-1 text-sm font-medium">
          <span className=" px-2 py-0.5 text-black">
            {property.price_per_night}€
          </span>{" "}
          <span className="text-gray-500"> par nuit</span>
        </p>
      </div>
    </Link>
  );
}