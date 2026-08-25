"use server";

import type { ActionResult } from "@/lib/actions/auth";
import type { PropertyDetail } from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface UploadImageResponse {
  url: string;
}

export async function uploadImageAction(
  formData: FormData,
  token: string
): Promise<ActionResult<UploadImageResponse>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/uploads/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || "Échec de l'envoi de l'image" };
    }

    // Le back-end renvoie parfois une URL relative (ex: "/uploads/xxx.jpg").
    // On la transforme en URL absolue pour que next/image puisse la charger
    // correctement, peu importe où le front est servi.
    const absoluteUrl = data.url.startsWith("http")
      ? data.url
      : `${API_BASE_URL}${data.url}`;

    return { success: true, data: { url: absoluteUrl } };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Échec de l'envoi de l'image",
    };
  }
}

export interface CreatePropertyPayload {
  title: string;
  description: string;
  location: string;
  price_per_night: number;
  host_id: number;
  cover: string;
  pictures: string[];
  equipments: string[];
  tags: string[];
}

export async function createPropertyAction(
  payload: CreatePropertyPayload,
  token: string
): Promise<ActionResult<PropertyDetail>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/properties`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || "Échec de la création du logement" };
    }

    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Échec de la création du logement",
    };
  }
}