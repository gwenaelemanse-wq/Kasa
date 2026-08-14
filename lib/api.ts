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

export interface User {
  id: number;
  name: string;
  email: string;
  picture: string;
  role: "owner" | "client" | "admin";
}

export interface LoginResponse {
  token: string;
  user: User;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Échec de la connexion");
  }

  return data;
}

// Inscription = toujours rôle "client" par défaut (voir BecomeHostPrompt pour
// le passage en "owner" ensuite, choix de conception documenté).
export async function register(
  name: string,
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Échec de l'inscription");
  }

  return data;
}