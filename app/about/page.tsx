import Image from "next/image";

export default function About() {
    return (
        <div className="mx-auto max-w-6xl px-6 py-8">
            <h1 className="text-center text-3xl font-bold" style={{ color: "#99331A" }}>À propos </h1>
            <h2 className="text-center text-lg mt-2 mb-8" style={{ color: "#000000" }}>
                Chez Kasa, nous croyons que chaque voyage mérite un lieu unique où se sentir bien.
                <br />
                Depuis notre création, nous mettons en relation des voyageurs en quête d’authenticité avec des hôtes passionnés qui aiment partager leur région et leurs bonnes adresses.
            </h2>
            <Image src="/images/about2.png" alt="About Kasa" className="mx-auto" width={600} height={400} />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <p className="text-justify" style={{ color: "#99331A" }}>Notre mission est simple :</p>
                <p className="text-justify" style={{ color: "#000000" }}>
                    Offrir une plateforme fiable et simple d’utilisation
                </p>
                <p className="text-justify" style={{ color: "#000000" }}>
                    Proposer des hébergements variés et de qualité
                </p>
                <p className="text-justify" style={{ color: "#000000" }}>
                    Favoriser des échanges humains et chaleureux entre hôtes et voyageurs
                </p>
                <p className="text-justify" style={{ color: "#99331A" }}>Que vous cherchiez un appartement cosy en centre-ville, une maison en bord de mer ou un chalet à la montagne, Kasa vous accompagne pour que chaque séjour devienne un souvenir inoubliable.</p>
                <img src="/images/about1.png" alt="About Kasa" className="mx-auto" width={600} height={400} />
            </div>
        </div>
    );
}