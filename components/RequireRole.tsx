"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Composant de protection de route, générique et réutilisable pour n'importe
 * quelle combinaison de rôles autorisés.
 * - Redirige vers /connexion si personne n'est connecté.
 * - Si le rôle de l'utilisateur ne correspond pas à allowedRoles :
 *   - redirige vers l'accueil si aucun `fallback` n'est fourni ;
 *   - sinon affiche `fallback` sur place (ex : proposer de "devenir hôte").
 *
 * @param allowedRoles - Liste des rôles ayant le droit de voir `children` (ex: ["owner", "admin"])
 * @param children - Le contenu protégé, affiché uniquement si l'accès est autorisé
 * @param fallback - Contenu alternatif affiché si le rôle ne correspond pas (optionnel)
 */
export default function RequireRole({
  allowedRoles,
  children,
  fallback,
}: {
  allowedRoles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { user, isLoaded } = useAuth();
  const router = useRouter();

  const hasAccess = !!user && allowedRoles.includes(user.role);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/connexion");
      return;
    }

    // Si le rôle ne correspond pas mais qu'un fallback est fourni,
    // on ne redirige pas : on laisse l'utilisateur voir le fallback sur place.
    if (!hasAccess && !fallback) {
      router.push("/");
    }
  }, [isLoaded, user, hasAccess, fallback, router]);

  if (!isLoaded || !user) {
    return (
      <div className="mx-auto max-w-md px-6 py-12 text-center text-gray-500">
        Vérification des accès...
      </div>
    );
  }

  if (!hasAccess) {
    return fallback ?? null;
  }

  return <>{children}</>;
}