import { getProperties } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";
import Image from "next/image";



export default async function Home() {
  const properties = await getProperties();

  return (
    <>
      <h1 className="text-center text-3xl font-bold" style={{ color: "#99331A" }}>Chez vous, partout et ailleurs</h1>
      <h2 className="text-center text-lg mt-2 mb-8" style={{ color: "#000000" }}>Avec Kasa, vivez des séjours uniques dans des hébergements chaleureux, sélectionnés avec soin par nos hôtes.</h2>
      <Image
        src="/images/banner.jpg"
        alt="Bannière de la page d'accueil"
        className="mx-auto mb-8 rounded-lg shadow-md"
        width={1110}
        height={80}
      />
      <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 ">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      </div>
    </>
  );
}