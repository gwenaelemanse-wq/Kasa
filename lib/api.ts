const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface Host {
  id: number;
  name: string;
  picture: string;
}

// Format renvoyé par GET /api/properties (liste)
export interface PropertySummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover: string;
  location: string;
  price_per_night: number;
  rating_avg: number;
  ratings_count: number;
  host: Host;
}

// Format renvoyé par GET /api/properties/:id (détail)
export interface PropertyDetail extends PropertySummary {
  pictures: string[];
  equipments: string[];
  tags: string[];
}

export async function getProperties(): Promise<PropertySummary[]> {
  const res = await fetch(`${API_BASE_URL}/api/properties`);
  if (!res.ok) {
    throw new Error(`Erreur lors de la récupération des propriétés: ${res.status}`);
  }
  return res.json();
}

export async function getPropertyById(id: string): Promise<PropertyDetail> {
  const res = await fetch(`${API_BASE_URL}/api/properties/${id}`);
  if (!res.ok) {
    throw new Error(`Erreur lors de la récupération de la propriété ${id}: ${res.status}`);
  }
  return res.json();
}