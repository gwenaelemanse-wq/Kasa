"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Carousel photo accessible pour la fiche détail d'un logement.
 * - Navigation par flèches (au survol) et par miniatures.
 * - Boucle entre la dernière et la première image.
 * - Flèches masquées automatiquement s'il n'y a qu'une seule photo.
 * - Navigable au clavier (flèches ← →) une fois le carousel focus.
 * Testé unitairement dans PropertyGallery.test.tsx.
 *
 * @param pictures - Liste des URLs des photos du logement
 * @param title - Titre du logement, utilisé pour les textes alternatifs des images
 */
export default function PropertyGallery({
  pictures,
  title,
}: {
  pictures: string[];
  title: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const hasMultiple = pictures.length > 1;

  function changeIndex(newIndex: number) {
    if (newIndex === currentIndex) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsFading(false);
    }, 150);
  }

  function goNext() {
    changeIndex((currentIndex + 1) % pictures.length);
  }

  function goPrev() {
    changeIndex((currentIndex - 1 + pictures.length) % pictures.length);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
  }

  const thumbnails = pictures
    .map((picture, index) => ({ picture, index }))
    .filter((item) => item.index !== currentIndex);

  return (
    <div className="flex h-[320px] gap-2 md:h-[420px]">
      {/* Carousel principal - occupe 2/3 de l'espace, nettement dominant */}
      <div
        className="group relative h-full flex-[2] overflow-hidden rounded-2xl outline-none"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={`Photos de ${title}`}
        onKeyDown={handleKeyDown}
      >
        <div
          className="h-full w-full transition-opacity duration-150"
          style={{ opacity: isFading ? 0 : 1 }}
        >
          <Image
            src={pictures[currentIndex]}
            alt={`${title} - photo ${currentIndex + 1} sur ${pictures.length}`}
            fill
            className="object-cover"
            priority
          />
        </div>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Photo précédente"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Photo suivante"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Miniatures - occupent 1/3 de l'espace, en grille 2 colonnes scrollable si besoin */}
      {thumbnails.length > 0 && (
        <div className="grid flex-1 grid-cols-2 gap-2 overflow-y-auto">
          {thumbnails.map(({ picture, index }) => (
            <button
              key={picture}
              type="button"
              onClick={() => changeIndex(index)}
              className="relative aspect-square overflow-hidden rounded-xl"
              aria-label={`Voir la photo ${index + 1}`}
            >
              <Image
                src={picture}
                alt={`${title} - miniature ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}