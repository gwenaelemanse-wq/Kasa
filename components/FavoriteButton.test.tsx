import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FavoritesProvider } from "@/context/FavoritesContext";
import FavoriteButton from "@/components/FavoriteButton";

const STORAGE_KEY = "kasa-favorites";

// Petit wrapper : FavoriteButton a besoin du Context pour fonctionner
function renderWithProvider(ui: React.ReactElement) {
  return render(<FavoritesProvider>{ui}</FavoritesProvider>);
}

describe("Favoris", () => {
  beforeEach(() => {
    // On repart d'un localStorage vide à chaque test, sinon ils s'influencent entre eux
    localStorage.clear();
  });

  it("n'est pas actif par défaut", () => {
    renderWithProvider(<FavoriteButton propertyId="prop-1" />);
    const button = screen.getByRole("button", { name: "Ajouter aux favoris" });
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("devient actif au clic", async () => {
    renderWithProvider(<FavoriteButton propertyId="prop-1" />);
    const button = screen.getByRole("button", { name: "Ajouter aux favoris" });

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Retirer des favoris" })).toHaveAttribute(
        "aria-pressed",
        "true"
      );
    });
  });

  it("redevient inactif si on clique une deuxième fois", async () => {
    renderWithProvider(<FavoriteButton propertyId="prop-1" />);
    const button = screen.getByRole("button", { name: "Ajouter aux favoris" });

    fireEvent.click(button); // ajoute
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Retirer des favoris" })).toBeInTheDocument()
    );

    fireEvent.click(screen.getByRole("button", { name: "Retirer des favoris" })); // retire

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Ajouter aux favoris" })).toHaveAttribute(
        "aria-pressed",
        "false"
      );
    });
  });

  it("sauvegarde l'état dans le localStorage (persistance)", async () => {
    renderWithProvider(<FavoriteButton propertyId="prop-1" />);
    fireEvent.click(screen.getByRole("button", { name: "Ajouter aux favoris" }));

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      expect(stored).toContain("prop-1");
    });
  });

  it("le clic ne déclenche pas la navigation du lien parent (stopPropagation)", () => {
    let parentClicked = false;

    renderWithProvider(
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a href="/logement/prop-1" onClick={() => (parentClicked = true)}>
        <FavoriteButton propertyId="prop-1" />
      </a>
    );

    fireEvent.click(screen.getByRole("button", { name: "Ajouter aux favoris" }));

    expect(parentClicked).toBe(false);
  });

  it("gère plusieurs logements indépendamment", async () => {
    function TwoButtons() {
      return (
        <>
          <FavoriteButton propertyId="prop-1" />
          <FavoriteButton propertyId="prop-2" />
        </>
      );
    }
    renderWithProvider(<TwoButtons />);

    const buttons = screen.getAllByRole("button", { name: "Ajouter aux favoris" });
    fireEvent.click(buttons[0]); // on like seulement le premier

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      expect(stored).toContain("prop-1");
      expect(stored).not.toContain("prop-2");
    });
  });
});