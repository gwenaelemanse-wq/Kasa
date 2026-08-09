import Image from "next/image";
import Link from "next/link";
import type { PropertySummary } from "@/lib/api";

// Composant SERVEUR : reçoit la donnée en props, l'affiche. Pas d'état, pas d'interaction.
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
      </div>
      <div className="p-3">
        <h3 className="truncate font-semibold">{property.title}</h3>
        <p className="truncate text-sm text-gray-500">{property.location}</p>
        <p className="mt-1 text-sm font-medium">
          <span className="rounded-full bg-[#FF6060] px-2 py-0.5 text-white">
            {property.price_per_night}€
          </span>{" "}
          <span className="text-gray-500">/nuit</span>
        </p>
      </div>
    </Link>
  );
}