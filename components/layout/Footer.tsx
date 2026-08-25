import Image from "next/image";
import Link from "next/link";

// Composant SERVEUR (par défaut) : aucune interactivité, aucun état.
// Pas besoin de "use client" ici.
export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-6 text-sm text-gray-500 sm:flex-row sm:justify-between">
        <Link href="/" aria-label="Retour à l'accueil Kasa">
          <Image src="/images/LogoIcon.png" alt="" width={28} height={28} />
        </Link>
        <span>© 2026 Kasa. All rights reserved</span>
        
      </div>
    </footer>
  );
}