"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { uploadImageAction, createPropertyAction } from "@/lib/actions/properties";

const EQUIPMENT_OPTIONS = [
  "Micro-Ondes", "Clic-clac",
  "Douche italienne", "Four",
  "Frigo", "Rangements",
  "WIFI", "Lit",
  "Parking", "Bouilloire",
  "Sèche Cheveux", "SDB",
  "Machine à laver", "Toilettes sèches",
  "Cuisine équipée", "Cintres",
  "Télévision", "Baie vitrée",
  "Chambre Séparée", "Hotte",
  "Climatisation", "Baignoire",
  "Frigo Américain", "Vue Parc",
];

const TAG_OPTIONS = [
  "Parc", "Night Life", "Culture", "Nature", "Touristique",
  "Vue sur mer", "Pour les couples", "Famille", "Forêt",
];

const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE_MB = 5;

interface PhotoItem {
  file: File;
  previewUrl: string;
}

export default function AjouterLogementForm() {
  const { user, token, updateProfilePicture } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [customTagOptions, setCustomTagOptions] = useState<string[]>([]);
  const [coverPhoto, setCoverPhoto] = useState<PhotoItem | null>(null);
  const [hostPhoto, setHostPhoto] = useState<PhotoItem | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function toggleEquipment(equipment: string) {
    setSelectedEquipments((prev) =>
      prev.includes(equipment) ? prev.filter((e) => e !== equipment) : [...prev, equipment]
    );
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function addCustomTag() {
    const value = customTag.trim();
    if (!value) return;
    if (!customTagOptions.includes(value)) {
      setCustomTagOptions((prev) => [...prev, value]);
    }
    setSelectedTags((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setCustomTag("");
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, cover: `La photo doit faire moins de ${MAX_PHOTO_SIZE_MB} Mo.` }));
      return;
    }
    if (coverPhoto) URL.revokeObjectURL(coverPhoto.previewUrl);
    setCoverPhoto({ file, previewUrl: URL.createObjectURL(file) });
    setErrors((prev) => {
      const next = { ...prev };
      delete next.cover;
      return next;
    });
    e.target.value = "";
  }

  function removeCoverPhoto() {
    if (coverPhoto) URL.revokeObjectURL(coverPhoto.previewUrl);
    setCoverPhoto(null);
  }

  function handleHostPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, hostPhoto: `La photo doit faire moins de ${MAX_PHOTO_SIZE_MB} Mo.` }));
      return;
    }
    if (hostPhoto) URL.revokeObjectURL(hostPhoto.previewUrl);
    setHostPhoto({ file, previewUrl: URL.createObjectURL(file) });
    setErrors((prev) => {
      const next = { ...prev };
      delete next.hostPhoto;
      return next;
    });
    e.target.value = "";
  }

  function removeHostPhoto() {
    if (hostPhoto) URL.revokeObjectURL(hostPhoto.previewUrl);
    setHostPhoto(null);
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

    const newPhotos = files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
    setPhotos((prev) => [...prev, ...newPhotos]);
    setErrors(newErrors);
    e.target.value = "";
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
    if (!coverPhoto) newErrors.cover = "Ajoutez une image de couverture.";
    if (photos.length === 0) newErrors.photos = "Ajoutez au moins une photo du logement.";
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
      // Photo de profil de l'hôte (optionnelle) : on l'associe au compte connecté
      if (hostPhoto) {
        const hostFormData = new FormData();
        hostFormData.append("file", hostPhoto.file);
        hostFormData.append("purpose", "user-picture");
        const hostResult = await uploadImageAction(hostFormData, token);
        if (!hostResult.success) throw new Error(hostResult.error);
        await updateProfilePicture(hostResult.data.url);
      }

      // Upload de la couverture en premier
      const coverFormData = new FormData();
      coverFormData.append("file", coverPhoto!.file);
      coverFormData.append("purpose", "property-cover");
      const coverResult = await uploadImageAction(coverFormData, token);
      if (!coverResult.success) throw new Error(coverResult.error);

      // Puis upload des autres photos du logement
      const uploadedUrls: string[] = [];
      for (const photo of photos) {
        const formData = new FormData();
        formData.append("file", photo.file);
        formData.append("purpose", "property-picture");
        const result = await uploadImageAction(formData, token);
        if (!result.success) throw new Error(result.error);
        uploadedUrls.push(result.data.url);
      }

      const fullLocation = postalCode.trim() ? `${location} - ${postalCode}` : location;

      const propertyResult = await createPropertyAction(
        {
          title,
          description,
          location: fullLocation,
          price_per_night: Number(price),
          host_id: user.id,
          cover: coverResult.data.url,
          pictures: [coverResult.data.url, ...uploadedUrls],
          equipments: selectedEquipments,
          tags: selectedTags,
        },
        token
      );
      if (!propertyResult.success) throw new Error(propertyResult.error);

      router.push(`/logement/${propertyResult.data.id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  }

  const allTagOptions = [...TAG_OPTIONS, ...customTagOptions];

  return (
    <div className="bg-[#FFF8F5]">
      <form onSubmit={handleSubmit} className="mx-auto max-w-5xl px-6 py-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm"
        >
          ← Retour
        </button>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Ajouter une propriété</h1>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[#99331A] px-6 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {isSubmitting ? "..." : "Ajouter"}
          </button>
        </div>

        {submitError && (
          <p role="alert" className="mb-4 text-sm text-red-600">{submitError}</p>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Colonne gauche : infos propriété */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4">
              <label htmlFor="title" className="mb-1 block text-sm font-medium">
                Titre de la propriété
              </label>
              <input
                id="title"
                type="text"
                placeholder="Ex : Appartement cosy au cœur de Paris"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FF6060]"
              />
              {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="mb-1 block text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Décrivez votre propriété en détail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FF6060]"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="postalCode" className="mb-1 block text-sm font-medium">
                Code postal
              </label>
              <input
                id="postalCode"
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FF6060]"
              />
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
              />
              {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
            </div>

            <div className="mt-4">
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
              />
              {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
            </div>
          </div>

          {/* Colonne droite : images + hôte */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              {/* Image de couverture - une seule photo */}
              <p className="mb-1 text-sm font-medium">Image de couverture</p>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex-1 truncate rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500">
                  {coverPhoto ? coverPhoto.file.name : "Aucune image sélectionnée"}
                </div>
                <label className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#99331A] text-white">
                  +
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="hidden"
                  />
                </label>
              </div>
              {coverPhoto && (
                <div className="relative mb-2 aspect-video w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverPhoto.previewUrl}
                    alt="Aperçu de la couverture"
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeCoverPhoto}
                    aria-label="Supprimer l'image de couverture"
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs shadow"
                  >
                    ✕
                  </button>
                </div>
              )}
              {errors.cover && <p className="mb-4 text-xs text-red-600">{errors.cover}</p>}

              {/* Image(s) du logement - plusieurs photos */}
              <p className="mb-1 mt-4 text-sm font-medium">
                Image du logement ({photos.length}/{MAX_PHOTOS})
              </p>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex-1 truncate rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500">
                  {photos.length > 0
                    ? `${photos.length} photo${photos.length > 1 ? "s" : ""} sélectionnée${photos.length > 1 ? "s" : ""}`
                    : "Aucune image sélectionnée"}
                </div>
                {photos.length < MAX_PHOTOS && (
                  <label className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#99331A] text-white">
                    +
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {photos.length > 0 && (
                <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {photos.map((photo, index) => (
                    <div key={photo.previewUrl} className="relative aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
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

              {errors.photos && <p className="mt-1 text-xs text-red-600">{errors.photos}</p>}

              {photos.length < MAX_PHOTOS && (
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[#FF6060]">
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
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="mb-3 text-sm font-medium">Votre hôte</p>
              <p className="text-sm text-gray-500">Nom de l&apos;hôte</p>
              <p className="mb-4 text-sm">{user?.name}</p>

              <p className="mb-1 text-sm font-medium">Photo de profil</p>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex-1 truncate rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500">
                  {hostPhoto ? hostPhoto.file.name : "Aucune image sélectionnée"}
                </div>
                <label className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#99331A] text-white">
                  +
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHostPhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
              {hostPhoto && (
                <div className="relative mb-2 h-20 w-20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hostPhoto.previewUrl}
                    alt="Aperçu photo de profil"
                    className="h-full w-full rounded-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeHostPhoto}
                    aria-label="Supprimer la photo de profil"
                    className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs shadow"
                  >
                    ✕
                  </button>
                </div>
              )}
              {errors.hostPhoto && (
                <p className="text-xs text-red-600">{errors.hostPhoto}</p>
              )}
              <label className="mb-2 inline-flex cursor-pointer items-center gap-2 text-sm text-[#FF6060]">
                + Ajouter une image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHostPhotoChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-400">
                Optionnelle — remplace la photo de profil de votre compte.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Équipements */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-medium">Équipements</p>
            <div className="grid grid-cols-2 gap-2">
              {EQUIPMENT_OPTIONS.map((equipment) => (
                <label key={equipment} className="flex items-center gap-2 text-sm">
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
              <p className="mt-2 text-xs text-red-600">{errors.equipments}</p>
            )}
          </div>

          {/* Catégories */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-medium">Catégories</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {allTagOptions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-lg px-3 py-1.5 text-xs ${
                    selectedTags.includes(tag)
                      ? "bg-[#FF6060] text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <p className="mb-1 text-sm font-medium">Ajouter une catégorie personnalisée</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nouveau tag"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomTag();
                  }
                }}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FF6060]"
              />
              <button
                type="button"
                onClick={addCustomTag}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#99331A] text-white"
                aria-label="Ajouter le tag"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}