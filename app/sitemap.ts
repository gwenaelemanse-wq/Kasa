import type { MetadataRoute } from "next";
import { getProperties } from "@/lib/api";

const SITE_URL = "https://kasa-79qs-sigma.vercel.app";

/**
 * Génère automatiquement le sitemap.xml du site (accessible sur /sitemap.xml).
 * Inclut les pages statiques + une entrée par logement (récupérés en direct
 * depuis l'API, donc toujours à jour avec les vraies annonces existantes).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getProperties();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/favoris`, changeFrequency: "weekly", priority: 0.3 },
    { url: `${SITE_URL}/connexion`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/inscription`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const propertyPages: MetadataRoute.Sitemap = properties.map((property) => ({
    url: `${SITE_URL}/logement/${property.id}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...propertyPages];
}