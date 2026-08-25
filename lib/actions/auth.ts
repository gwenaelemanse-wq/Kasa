"use server";

import { login as loginRequest, register as registerRequest, type LoginResponse } from "@/lib/api";

// "use server" en haut du fichier = tout ce qui est exporté ici s'exécute
// sur le serveur Next.js, même quand c'est appelé depuis un composant client.
// C'est ça qui règle le problème de CORS : le fetch part du serveur, pas du navigateur.
//
// IMPORTANT : on ne fait JAMAIS "throw" ici. En production, Next.js efface le
// contenu des erreurs qui traversent la frontière serveur → client depuis une
// Server Action (sécurité, pour éviter de fuiter des détails sensibles). On
// retourne donc un résultat "normal" ({ success: false, error }) à la place :
// aucune erreur ne traverse la frontière, donc rien n'est effacé.
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function loginAction(
  email: string,
  password: string
): Promise<ActionResult<LoginResponse>> {
  try {
    const data = await loginRequest(email, password);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Échec de la connexion",
    };
  }
}

export async function registerAction(
  name: string,
  email: string,
  password: string
): Promise<ActionResult<LoginResponse>> {
  try {
    const data = await registerRequest(name, email, password);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Échec de l'inscription",
    };
  }
}