"use server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function updateUserRoleAction(
  userId: number,
  role: string,
  token: string
) {
  const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Échec de la mise à jour du rôle");
  }

  return data;
}
