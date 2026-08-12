"use server";

import { login as loginRequest, type LoginResponse } from "@/lib/api";

// "use server" en haut du fichier = tout ce qui est exporté ici s'exécute
// sur le serveur Next.js, même quand c'est appelé depuis un composant client.
// C'est ça qui règle le problème de CORS : le fetch part du serveur, pas du navigateur.
export async function loginAction(
  email: string,
  password: string
): Promise<LoginResponse> {
  return loginRequest(email, password);
}