import { notFound } from "next/navigation";
import { getPropertyById } from "@/lib/api";
import PropertyDetail from "@/components/PropertyDetail";

export default async function LogementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let property;
  try {
    property = await getPropertyById(id);
  } catch {
    notFound();
  }

  // Microdonnées Schema.org (format JSON-LD) : permettent à Google de
  // comprendre qu'il s'agit d'un logement avec un prix et une note, pour
  // afficher des résultats enrichis dans les résultats de recherche.
  // Testable sur https://search.google.com/test/rich-results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: property.title,
    description: property.description,
    image: property.pictures,
    offers: {
      "@type": "Offer",
      price: property.price_per_night,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    ...(property.ratings_count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: property.rating_avg,
        reviewCount: property.ratings_count,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PropertyDetail property={property} />
    </>
  );
}