import Image from "next/image";
import Link from "next/link";
import type { PropertyDetail as PropertyDetailType } from "@/lib/api";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyCollapse from "@/components/PropertyCollapse";

// Composant SERVEUR : reçoit la donnée en props, affichage uniquement.
export default function PropertyDetail({
  property,
}: {
  property: PropertyDetailType;
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Link
        href="/"
        className="mb-6 inline-block rounded-full border border-gray-200 px-4 py-2 text-sm"
      >
        ← Retour aux annonces
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        {/* Colonne gauche : galerie + infos */}
        <div>
          <PropertyGallery pictures={property.pictures} title={property.title} />

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h1 className="text-xl font-bold">{property.title}</h1>
            <p className="mt-1 text-sm text-gray-500">{property.location}</p>

            <PropertyCollapse title="Description" defaultOpen>
              {property.description}
            </PropertyCollapse>

            <PropertyCollapse title="Équipements" defaultOpen>
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {property.equipments.map((equipment) => (
                  <li
                    key={equipment}
                    className="rounded-lg bg-gray-100 px-3 py-2 text-center text-xs"
                  >
                    {equipment}
                  </li>
                ))}
              </ul>
            </PropertyCollapse>

            <h2 className="mt-6 font-semibold">Catégorie</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {property.tags.map((tag) => (
                <li key={tag} className="rounded-lg bg-gray-100 px-3 py-2 text-xs">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Colonne droite : carte hôte */}
        <aside className="h-fit rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold">Votre hôte</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{property.host.name}</span>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[#FF6060] px-2 py-1 text-xs text-white">
                ★ {property.rating_avg}
              </span>
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src={property.host.picture}
                  alt={property.host.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            className="mt-4 w-full rounded-full bg-[#FF6060] py-2 text-sm text-white"
          >
            Contacter l&apos;hôte
          </button>
          <button
            type="button"
            className="mt-2 w-full rounded-full bg-[#FF6060] py-2 text-sm text-white"
          >
            Envoyer un message
          </button>
        </aside>
      </div>
    </div>
  );
}