import Image from "next/image";

export default function About() {
  return (
    <div className="bg-[#FFF8F5]">
      {/* Titre + texte d'intro, centrés */}
      <div className="mx-auto max-w-3xl px-6 py-12 text-center">
        <h1 className="text-3xl font-bold" style={{ color: "#99331A" }}>
          À propos
        </h1>
        <p className="mt-4 text-black">
          Chez Kasa, nous croyons que chaque voyage mérite un lieu unique où se
          sentir bien.
          <br />
          Depuis notre création, nous mettons en relation des voyageurs en
          quête d&apos;authenticité avec des hôtes passionnés qui aiment
          partager leur région et leurs bonnes adresses.
        </p>
      </div>

      {/* Grande image bannière */}
      <div className="mx-auto max-w-3xl px-6">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <Image
            src="/images/about2.png"
            alt="Chalet en bois entouré d'arbres"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Mission + deuxième image */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="font-semibold" style={{ color: "#99331A" }}>
              Notre mission est simple :
            </h2>
            <ol className="mt-4 list-inside list-decimal space-y-3 text-black">
              <li>Offrir une plateforme fiable et simple d&apos;utilisation</li>
              <li>Proposer des hébergements variés et de qualité</li>
              <li>
                Favoriser des échanges humains et chaleureux entre hôtes et
                voyageurs
              </li>
            </ol>
            <p className="mt-6" style={{ color: "#99331A" }}>
              Que vous cherchiez un appartement cosy en centre-ville, une
              maison en bord de mer ou un chalet à la montagne, Kasa vous
              accompagne pour que chaque séjour devienne un souvenir
              inoubliable.
            </p>
          </div>

          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
            <Image
              src="/images/about1.png"
              alt="Chalet en A-frame au crépuscule"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}