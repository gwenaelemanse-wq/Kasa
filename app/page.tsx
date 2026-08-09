import { getProperties } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";

export default async function Home() {
  const properties = await getProperties();

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}