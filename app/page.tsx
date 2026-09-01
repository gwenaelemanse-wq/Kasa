import { getProperties } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";
import HowItWorks from "@/components/HowItWorks";
import Image from "next/image";

export default async function Home() {
  const properties = await getProperties();

  return (
    <>
      <h1 className="text-center text-3xl font-bold" style={{ color: "#99331A" }}>
        Chez vous, partout et ailleurs
      </h1>
      <h2 className="mb-8 mt-2 text-center text-lg" style={{ color: "#000000" }}>
        Avec Kasa, vivez des séjours uniques dans des hébergements chaleureux,
        sélectionnés avec soin par nos hôtes.
      </h2>
      <div className="relative mx-auto mb-8 aspect-[3/1] w-full max-w-6xl px-6">
        <Image
          src="/images/banner.jpg"
          alt="Bannière de la page d'accueil"
          fill
          priority
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="rounded-lg object-cover shadow-md"
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>

      <HowItWorks />
    </>
  );
}