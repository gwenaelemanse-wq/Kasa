"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function InscriptionPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!acceptedTerms) {
      setError("Vous devez accepter les conditions générales d'utilisation.");
      return;
    }

    setIsSubmitting(true);
    try {
      // L'API attend un seul champ "name" : on combine prénom + nom.
      const fullName = `${prenom} ${nom}`.trim();
      await register(fullName, email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-2 text-2xl font-bold text-[#FF6060]">
        Rejoignez la communauté Kasa
      </h1>
      <p className="mb-6 text-sm text-gray-500">
        Créez votre compte et commencez à voyager autrement.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="nom" className="mb-1 block text-sm font-medium">Nom</label>
          <input
            id="nom"
            type="text"
            required
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FF6060]"
          />
        </div>

        <div>
          <label htmlFor="prenom" className="mb-1 block text-sm font-medium">Prénom</label>
          <input
            id="prenom"
            type="text"
            required
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FF6060]"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">Adresse email</label>
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
          <label htmlFor="password" className="mb-1 block text-sm font-medium">Mot de passe</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FF6060]"
          />
        </div>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-1"
          />
          <span>
            J&apos;accepte les{" "}
            <Link href="/conditions" className="underline">
              conditions générales d&apos;utilisation
            </Link>
          </span>
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-full bg-[#FF6060] py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {isSubmitting ? "Inscription..." : "S'inscrire"}
        </button>

        <p className="text-center text-sm text-[#FF6060]">
          Déjà membre ? <Link href="/connexion" className="underline">Se connecter</Link>
        </p>
      </form>
    </div>
  );
}