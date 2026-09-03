"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createConversationAction } from "@/lib/actions/messages";

export default function ContactHostButton({ propertyId }: { propertyId: string }) {
  const { user, token } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    // Pas connecté : on envoie d'abord se connecter, pas la peine d'appeler l'API
    if (!user || !token) {
      router.push("/connexion");
      return;
    }

    setIsLoading(true);
    try {
      const conversation = await createConversationAction(propertyId, token);
      // On passe l'id de la conversation en paramètre d'URL, pour que la
      // page/modale messagerie sache laquelle ouvrir directement.
      router.push(`/messagerie?conversation=${conversation.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className="mt-2 w-full rounded-full bg-[#99331A] py-2 text-sm text-white disabled:opacity-60"
    >
      {isLoading ? "..." : "Envoyer un message"}
    </button>
  );
}