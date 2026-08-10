"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-gray-100 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <ul className="hidden gap-6 text-sm font-medium md:flex">
          <li>
            <Link href="/">Accueil</Link>
          </li>
          <li>
            <Link href="/about">À propos</Link>
          </li>
        </ul>

        <Link href="/" className="text-xl font-bold text-[#FF6060]">
          Kasa
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/ajouter-un-logement"
            className="rounded-full bg-[#FF6060] px-4 py-2 text-sm font-medium text-white"
          >
            Ajouter un logement
          </Link>
          <Link href="/favoris" aria-label="Voir mes favoris">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={isMenuOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white p-6 md:hidden">
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Fermer le menu"
            className="mb-8"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <ul className="flex flex-col gap-6 text-lg">
            <li>
              <Link href="/" onClick={() => setIsMenuOpen(false)}>Accueil</Link>
            </li>
            <li>
              <Link href="/about" onClick={() => setIsMenuOpen(false)}>À propos</Link>
            </li>
            <li>
              <Link href="/messagerie" onClick={() => setIsMenuOpen(false)}>Messagerie</Link>
            </li>
            <li>
              <Link href="/favoris" onClick={() => setIsMenuOpen(false)}>Favoris</Link>
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