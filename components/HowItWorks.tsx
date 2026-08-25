const STEPS = [
  {
    title: "Recherchez",
    description:
      "Entrez votre destination, vos dates et laissez Kasa faire le reste.",
  },
  {
    title: "Réservez",
    description:
      "Profitez d'une plateforme sécurisée et de profils d'hôtes vérifiés.",
  },
  {
    title: "Vivez l'expérience",
    description:
      "Installez-vous, profitez de votre séjour, et sentez-vous chez vous, partout.",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 text-center">
      <h2 className="text-2xl font-bold">Comment ça marche ?</h2>
      <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-600">
        Que vous partiez pour un week-end improvisé, des vacances en famille
        ou un voyage professionnel, Kasa vous aide à trouver un lieu qui vous
        ressemble.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {STEPS.map((step) => (
          <div
            key={step.title}
            className="rounded-2xl p-6 text-left text-white"
            style={{ backgroundColor: "#99331A" }}
          >
            <h3 className="mb-2 font-semibold">{step.title}</h3>
            <p className="text-sm opacity-90">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}