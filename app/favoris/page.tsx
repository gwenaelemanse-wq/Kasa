import { getProperties } from "@/lib/api";
import FavorisList from "@/components/FavorisList";

// Composant SERVEUR : récupère TOUTES les propriétés directement depuis le
// serveur Next.js (pas de souci CORS, comme sur la page d'accueil).
export default async function FavorisPage() {
  const allProperties = await getProperties();

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold">Vos coups de cœur</h1>
      <FavorisList allProperties={allProperties} />
    </div>
  );
}