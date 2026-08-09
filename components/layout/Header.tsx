"use client";

import { useState } from "react";
import Link from "next/link";

// Composant CLIENT : nécessaire car le menu mobile a un état (ouvert/fermé)
// géré avec useState, et une interaction au clic (onClick).
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-gray-100 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Liens gauche - visibles seulement desktop */}
        <ul className="hidden gap-6 text-sm font-medium md:flex">
          <li>
            <Link href="/">Accueil</Link>
          </li>
          <li>
            <Link href="/a-propos">À propos</Link>
          </li>
        </ul>

        {/* Logo centré */}
        <Link href="/" className="text-xl font-bold text-[#FF6060]">
          Kasa
        </Link>

        {/* CTA droite - visible seulement desktop */}
        <div className="hidden md:block">
          <Link
            href="/ajouter-un-logement"
            className="rounded-full bg-[#FF6060] px-4 py-2 text-sm font-medium text-white"
          >
            Ajouter un logement
          </Link>
        </div>

        {/* Bouton burger - visible seulement mobile */}
        <button
          type="button"
          className="md:hidden"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={isMenuOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      {/* Menu mobile overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white p-6 md:hidden">
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Fermer le menu"
            className="mb-8"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <ul className="flex flex-col gap-6 text-lg">
            <li>
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                Accueil
              </Link>
            </li>
            <li>
              <Link href="/a-propos" onClick={() => setIsMenuOpen(false)}>
                À propos
              </Link>
            </li>
            <li>
              <Link href="/messagerie" onClick={() => setIsMenuOpen(false)}>
                Messagerie
              </Link>
            </li>
            <li>
              <Link href="/favoris" onClick={() => setIsMenuOpen(false)}>
                Favoris
              </Link>
            </li>
          </ul>

          <Link
            href="/ajouter-un-logement"
            className="mt-8 block rounded-full bg-[#FF6060] px-4 py-3 text-center text-sm font-medium text-white"
            onClick={() => setIsMenuOpen(false)}
          >
            Ajouter un logement
          </Link>
        </div>
      )}
    </header>
  );
}