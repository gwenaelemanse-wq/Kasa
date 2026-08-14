import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PropertyGallery from "@/components/PropertyGallery";

// On remplace next/image par une balise <img> classique pour les tests :
// next/image a besoin d'un environnement de build spécial que jsdom n'a pas.
vi.mock("next/image", () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

const pictures = [
  "https://example.com/photo-1.jpg",
  "https://example.com/photo-2.jpg",
  "https://example.com/photo-3.jpg",
];

describe("PropertyGallery", () => {
  it("affiche la première photo par défaut", () => {
    render(<PropertyGallery pictures={pictures} title="Appartement cosy" />);
    expect(
      screen.getByAltText("Appartement cosy - photo 1 sur 3")
    ).toBeInTheDocument();
  });

  it("affiche les flèches de navigation quand il y a plusieurs photos", () => {
    render(<PropertyGallery pictures={pictures} title="Appartement cosy" />);
    expect(screen.getByLabelText("Photo suivante")).toBeInTheDocument();
    expect(screen.getByLabelText("Photo précédente")).toBeInTheDocument();
  });

  it("masque les flèches quand il n'y a qu'une seule photo", () => {
    render(
      <PropertyGallery pictures={[pictures[0]]} title="Appartement cosy" />
    );
    expect(screen.queryByLabelText("Photo suivante")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Photo précédente")).not.toBeInTheDocument();
  });

  it("passe à la photo suivante au clic sur la flèche droite", async () => {
    render(<PropertyGallery pictures={pictures} title="Appartement cosy" />);
    fireEvent.click(screen.getByLabelText("Photo suivante"));

    await waitFor(() => {
      expect(
        screen.getByAltText("Appartement cosy - photo 2 sur 3")
      ).toBeInTheDocument();
    });
  });

  it("revient à la dernière photo si on clique 'précédent' depuis la première (boucle)", async () => {
    render(<PropertyGallery pictures={pictures} title="Appartement cosy" />);
    fireEvent.click(screen.getByLabelText("Photo précédente"));

    await waitFor(() => {
      expect(
        screen.getByAltText("Appartement cosy - photo 3 sur 3")
      ).toBeInTheDocument();
    });
  });

  it("revient à la première photo si on clique 'suivant' depuis la dernière (boucle)", async () => {
    render(<PropertyGallery pictures={pictures} title="Appartement cosy" />);
    const nextButton = screen.getByLabelText("Photo suivante");

    // On avance jusqu'à la dernière photo (2 clics pour 3 photos)
    fireEvent.click(nextButton);
    await waitFor(() =>
      expect(screen.getByAltText("Appartement cosy - photo 2 sur 3")).toBeInTheDocument()
    );
    fireEvent.click(nextButton);
    await waitFor(() =>
      expect(screen.getByAltText("Appartement cosy - photo 3 sur 3")).toBeInTheDocument()
    );

    // Un clic de plus doit boucler vers la première
    fireEvent.click(nextButton);
    await waitFor(() =>
      expect(screen.getByAltText("Appartement cosy - photo 1 sur 3")).toBeInTheDocument()
    );
  });

  it("permet la navigation au clavier avec les flèches gauche/droite", async () => {
    render(<PropertyGallery pictures={pictures} title="Appartement cosy" />);
    const region = screen.getByRole("region", { name: "Photos de Appartement cosy" });

    fireEvent.keyDown(region, { key: "ArrowRight" });
    await waitFor(() => {
      expect(
        screen.getByAltText("Appartement cosy - photo 2 sur 3")
      ).toBeInTheDocument();
    });

    fireEvent.keyDown(region, { key: "ArrowLeft" });
    await waitFor(() => {
      expect(
        screen.getByAltText("Appartement cosy - photo 1 sur 3")
      ).toBeInTheDocument();
    });
  });

  it("change la photo principale au clic sur une miniature", async () => {
    render(<PropertyGallery pictures={pictures} title="Appartement cosy" />);
    fireEvent.click(screen.getByLabelText("Voir la photo 3"));

    await waitFor(() => {
      expect(
        screen.getByAltText("Appartement cosy - photo 3 sur 3")
      ).toBeInTheDocument();
    });
  });
});