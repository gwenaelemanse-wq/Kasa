import { getProperties } from "@/lib/api";

export default async function Home() {
  const properties = await getProperties();

  // Étape 2 : vérification que la connexion à l'API fonctionne
  console.log("Propriétés récupérées depuis l'API :", properties);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Kasa — Données temporaires (test API)</h1>
      <p>{properties.length} logements récupérés depuis le backend.</p>
      <ul>
        {properties.map((property) => (
          <li key={property.id}>
            <strong>{property.title}</strong> — {property.location} —{" "}
            {property.price_per_night}€/nuit
          </li>
        ))}
      </ul>
    </div>
  );
}