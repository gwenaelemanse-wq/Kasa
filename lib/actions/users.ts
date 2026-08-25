"use server";

import type { ActionResult } from "@/lib/actions/auth";
import type { User } from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface UpdateUserResult {
  user: User;
  token?: string;
}

async function updateUserAction(
  userId: number,
  updates: { role?: string; picture?: string },
  token: string
): Promise<ActionResult<UpdateUserResult>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || "Échec de la mise à jour du profil" };
    }

    // Le back-end renvoie parfois un nouveau token (si le rôle a changé, par
    // exemple) mélangé avec le reste des champs utilisateur : on les sépare.
    const { token: newToken, ...user } = data;
    return { success: true, data: { user, token: newToken } };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Échec de la mise à jour du profil",
    };
  }
}

export async function updateUserRoleAction(userId: number, role: string, token: string) {
  return updateUserAction(userId, { role }, token);
}

export async function updateUserPictureAction(userId: number, picture: string, token: string) {
  return updateUserAction(userId, { picture }, token);
}