import Link from "next/link";

// Composant SERVEUR (par défaut) : aucune interactivité, aucun état.
// Pas besoin de "use client" ici.
export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-6 text-sm text-gray-500 sm:flex-row sm:justify-between">
        <span className="text-lg font-bold text-[#FF6060]">Kasa</span>
        <span>© 2026 Kasa. All rights reserved</span>
        <nav>
          <ul className="flex gap-4">
            <li>
              
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}