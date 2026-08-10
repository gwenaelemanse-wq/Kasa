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

  return <PropertyDetail property={property} />;
}