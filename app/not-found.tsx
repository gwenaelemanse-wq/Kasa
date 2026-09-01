import Link from "next/link";

/**
 * Page 404 personnalisée, affichée automatiquement par Next.js quand une
 * route n'existe pas, ou manuellement via l'appel à notFound().
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#FFF8F5] px-6">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold" style={{ color: "#99331A" }}>
          404
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-sm text-black">
          Il semble que la page que vous cherchez ait pris des vacances... ou
          n&apos;ait jamais existé.
        </p>

        <div className="mt-6 flex flex-col items-center gap-3">
          <Link
            href="/"
            className="w-40 rounded-full bg-[#99331A] py-2 text-sm font-medium text-white"
          >
            Accueil
          </Link>
          <Link
            href="/"
            className="w-40 rounded-full bg-[#99331A] py-2 text-sm font-medium text-white"
          >
            Logements
          </Link>
        </div>
      </div>
    </div>
  );
}