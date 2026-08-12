"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { uploadImageAction, createPropertyAction } from "@/lib/actions/properties";

const EQUIPMENT_OPTIONS = [
  "WIFI",
  "Équipements de base",
  "Frigo",
  "Micro-Ondes",
  "Cafetière",
  "Bouilloire",
  "Vaisselle",
  "Douche italienne",
  "Sèche-linge",
  "Sèche Cheveux",
  "Lit pour bébé",
  "Télévision",
];

const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE_MB = 5;

interface PhotoItem {
  file: File;
  previewUrl: string;
}

export default function AjouterLogementForm() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function toggleEquipment(equipment: string) {
    setSelectedEquipments((prev) =>
      prev.includes(equipment)
        ? prev.filter((e) => e !== equipment)
        : [...prev, equipment]
    );
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const newErrors = { ...errors };
    delete newErrors.photos;

    if (photos.length + files.length > MAX_PHOTOS) {
      newErrors.photos = `Maximum ${MAX_PHOTOS} photos.`;
      setErrors(newErrors);
      return;
    }

    const tooLarge = files.find((f) => f.size > MAX_PHOTO_SIZE_MB * 1024 * 1024);
    if (tooLarge) {
      newErrors.photos = `Chaque photo doit faire moins de ${MAX_PHOTO_SIZE_MB} Mo.`;
      setErrors(newErrors);
      return;
    }

    const newPhotos = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
    setErrors(newErrors);
    e.target.value = ""; // permet de re-sélectionner le même fichier si besoin
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Le titre est obligatoire.";
    if (!description.trim()) newErrors.description = "La description est obligatoire.";
    if (!location.trim()) newErrors.location = "La localisation est obligatoire.";
    if (!price.trim() || Number(price) <= 0) {
      newErrors.price = "Le prix doit être un nombre supérieur à 0.";
    }
    if (photos.length === 0) newErrors.photos = "Ajoutez au moins une photo.";
    if (selectedEquipments.length === 0) {
      newErrors.equipments = "Sélectionnez au moins un équipement.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!validate() || !user || !token) return;

    setIsSubmitting(true);
    try {
      // 1. Upload de chaque photo, récupération des URLs
      const uploadedUrls: string[] = [];
      for (const photo of photos) {
        const formData = new FormData();
        formData.append("file", photo.file);
        formData.append("purpose", "property-picture");
        const result = await uploadImageAction(formData, token);
        uploadedUrls.push(result.url);
      }

      // 2. Création de la propriété avec les URLs obtenues
      const property = await createPropertyAction(
        {
          title,
          description,
          location,
          price_per_night: Number(price),
          host_id: user.id,
          cover: uploadedUrls[0],
          pictures: uploadedUrls,
          equipments: selectedEquipments,
          tags: [],
        },
        token
      );

      router.push(`/logement/${property.id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold">Ajouter un logement</h1>

      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">
            Titre
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FF6060]"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {errors.title && (
            <p id="title-error" className="mt-1 text-xs text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FF6060]"
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? "description-error" : undefined}
          />
          {errors.description && (
            <p id="description-error" className="mt-1 text-xs text-red-600">{errors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="mb-1 block text-sm font-medium">
            Localisation
          </label>
          <input
            id="location"
            type="text"
            placeholder="Ex : Ile de France - Paris 17e"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FF6060]"
            aria-invalid={!!errors.location}
            aria-describedby={errors.location ? "location-error" : undefined}
          />
          {errors.location && (
            <p id="location-error" className="mt-1 text-xs text-red-600">{errors.location}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="mb-1 block text-sm font-medium">
            Prix par nuit (€)
          </label>
          <input
            id="price"
            type="number"
            min="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FF6060]"
            aria-invalid={!!errors.price}
            aria-describedby={errors.price ? "price-error" : undefined}
          />
          {errors.price && (
            <p id="price-error" className="mt-1 text-xs text-red-600">{errors.price}</p>
          )}
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">Équipements</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {EQUIPMENT_OPTIONS.map((equipment) => (
              <label
                key={equipment}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedEquipments.includes(equipment)}
                  onChange={() => toggleEquipment(equipment)}
                />
                {equipment}
              </label>
            ))}
          </div>
          {errors.equipments && (
            <p className="mt-1 text-xs text-red-600">{errors.equipments}</p>
          )}
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">
            Photos ({photos.length}/{MAX_PHOTOS})
          </legend>

          {photos.length > 0 && (
            <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
              {photos.map((photo, index) => (
                <div key={photo.previewUrl} className="relative aspect-square">
                  <img
                    src={photo.previewUrl}
                    alt={`Photo ${index + 1}`}
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    aria-label={`Supprimer la photo ${index + 1}`}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs shadow"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {photos.length < MAX_PHOTOS && (
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm">
              + Ajouter une image
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}

          {errors.photos && (
            <p className="mt-1 text-xs text-red-600">{errors.photos}</p>
          )}
        </fieldset>

        {submitError && (
          <p role="alert" className="text-sm text-red-600">{submitError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 rounded-full bg-[#FF6060] py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {isSubmitting ? "Publication en cours..." : "Publier le logement"}
        </button>
      </div>
    </form>
  );
}