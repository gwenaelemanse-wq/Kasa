"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ConnexionPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-2 text-2xl font-bold text-[#FF6060]">Heureux de vous revoir</h1>
      <p className="mb-6 text-sm text-gray-500">
        Connectez-vous pour retrouver vos réservations, vos annonces et tout
        ce qui rend vos séjours uniques.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Adresse email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FF6060]"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FF6060]"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-full bg-[#FF6060] py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </button>

        <div className="text-center text-sm">
          {/* Fonctionnalité pas encore implémentée, lien visuel pour l'instant */}
          <Link href="/mot-de-passe-oublie" className="text-[#FF6060] underline">
            Mot de passe oublié
          </Link>
        </div>
        <p className="text-center text-sm text-[#FF6060]">
          Pas encore de compte ? <Link href="/inscription" className="underline">Inscrivez-vous</Link>
        </p>
      </form>
    </div>
  );
}