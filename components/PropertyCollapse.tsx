"use client";

import { useState, type ReactNode } from "react";

/**
 * Accordéon générique et réutilisable : affiche un titre cliquable qui
 * ouvre/ferme un contenu quelconque (children), avec une animation fluide.
 * Utilisé pour les sections Description et Équipements de la fiche logement.
 *
 * @param title - Le texte affiché sur le bouton, toujours visible
 * @param children - Le contenu masqué/affiché à l'ouverture
 * @param defaultOpen - Si true, la section est ouverte au premier rendu (défaut : false)
 */
export default function Collapse({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-gray-100 py-3 first:border-t-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between text-left font-semibold"
      >
        {title}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Animation d'ouverture/fermeture en pur CSS (grid-template-rows 0fr -> 1fr) */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-3 text-sm text-gray-700">{children}</div>
        </div>
      </div>
    </div>
  );
}