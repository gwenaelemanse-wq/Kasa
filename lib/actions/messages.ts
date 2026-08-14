"use server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface Conversation {
  id: number;
  property_id: string;
  property_title: string;
  other: { id: number; name: string; picture: string | null };
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  created_at: string;
  read_at: string | null;
}

// Petite fonction interne pour ne pas répéter la gestion d'erreur 4 fois
async function apiFetch(path: string, token: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Erreur de communication avec le serveur");
  }
  return data;
}

// Crée une conversation avec l'hôte d'une propriété (ou récupère celle qui existe déjà)
export async function createConversationAction(
  propertyId: string,
  token: string
): Promise<{ id: number }> {
  return apiFetch("/api/conversations", token, {
    method: "POST",
    body: JSON.stringify({ property_id: propertyId }),
  });
}

export async function listConversationsAction(token: string): Promise<Conversation[]> {
  return apiFetch("/api/conversations", token);
}

export async function getMessagesAction(
  conversationId: number,
  token: string
): Promise<Message[]> {
  return apiFetch(`/api/conversations/${conversationId}/messages`, token);
}

export async function sendMessageAction(
  conversationId: number,
  content: string,
  token: string
): Promise<Message> {
  return apiFetch(`/api/conversations/${conversationId}/messages`, token, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}