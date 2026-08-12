"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function BecomeHostPrompt() {
  const { updateRole } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBecomeHost() {
    setError(null);
    setIsSubmitting(true);
    try {
      await updateRole("owner");
      // Une fois le rôle mis à jour, RequireRole laissera passer automatiquement
      // au prochain rendu (hasAccess redevient true).
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16 text-center">
      <h1 className="mb-2 text-xl font-bold">Devenez hôte sur Kasa</h1>
      <p className="mb-6 text-sm text-gray-500">
        Pour publier une annonce, votre compte doit être un compte hôte. C&apos;est
        gratuit et instantané.
      </p>

      {error && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleBecomeHost}
        disabled={isSubmitting}
        className="rounded-full bg-[#FF6060] px-6 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {isSubmitting ? "Activation..." : "Devenir hôte"}
      </button>
    </div>
  );
}