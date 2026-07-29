import { getPhotoBucket, normalizeCrop, storePhoto, validatePhoto } from "./photo-store";

export const SITE_IMAGE_SLOTS = [
  { id: "hero", label: "Κεντρική φωτογραφία (Hero)", fallback: "/hero.png" },
  { id: "equipment", label: "Εξοπλισμός SMP", fallback: "/smp-02-equipment.webp" },
  { id: "crown", label: "Αραίωση κορυφής", fallback: "/crown-thinning.png" },
  { id: "male-before", label: "Ανδρική αλωπεκία — Πριν", fallback: "/cases/male-hair-loss-before.webp" },
  { id: "male-after", label: "Ανδρική αλωπεκία — Μετά", fallback: "/cases/male-hair-loss-after.webp" },
  { id: "female-before", label: "Γυναικεία αραίωση — Πριν", fallback: "/cases/female-thinning-before.webp" },
  { id: "female-after", label: "Γυναικεία αραίωση — Μετά", fallback: "/cases/female-thinning-after.webp" },
  { id: "transplant-before", label: "Ουλές μεταμόσχευσης — Πριν", fallback: "/cases/hair-transplant-scar-before.webp" },
  { id: "transplant-after", label: "Ουλές μεταμόσχευσης — Μετά", fallback: "/cases/hair-transplant-scar-after.webp" },
  { id: "trauma-before", label: "Ουλές τραυματισμών — Πριν", fallback: "/cases/trauma-scar-before.webp" },
  { id: "trauma-after", label: "Ουλές τραυματισμών — Μετά", fallback: "/cases/trauma-scar-after.webp" },
  { id: "alopecia-before", label: "Alopecia Areata — Πριν", fallback: "/cases/alopecia-areata-before.webp" },
  { id: "alopecia-after", label: "Alopecia Areata — Μετά", fallback: "/cases/alopecia-areata-after.webp" },
  { id: "beard-before", label: "Γένια — Πριν", fallback: "/cases/beard-density-before.webp" },
  { id: "beard-after", label: "Γένια — Μετά", fallback: "/cases/beard-density-after.webp" },
  { id: "correction-before", label: "Διόρθωση SMP — Πριν", fallback: "/cases/failed-smp-correction-before.webp" },
  { id: "correction-after", label: "Διόρθωση SMP — Μετά", fallback: "/cases/failed-smp-correction-after.webp" },
] as const;

export type SiteImageSlot = typeof SITE_IMAGE_SLOTS[number]["id"];
export type SiteImage = {
  slot: SiteImageSlot;
  fileId: string | null;
  x: number;
  y: number;
  zoom: number;
};

const MANIFEST_KEY = "site-images/manifest.json";

export function getSlot(id: string) {
  return SITE_IMAGE_SLOTS.find((slot) => slot.id === id) ?? null;
}

export async function readSiteImages(): Promise<SiteImage[]> {
  const object = await getPhotoBucket().get(MANIFEST_KEY);
  if (!object) return [];
  try {
    const parsed = JSON.parse(await object.text()) as unknown[];
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((value) => {
      if (!value || typeof value !== "object") return [];
      const item = value as Partial<SiteImage>;
      if (!item.slot || !getSlot(item.slot)) return [];
      const crop = normalizeCrop(item);
      return [{ slot: item.slot, fileId: typeof item.fileId === "string" ? item.fileId : null, ...crop }];
    });
  } catch {
    return [];
  }
}

export async function writeSiteImages(images: SiteImage[]) {
  await getPhotoBucket().put(MANIFEST_KEY, JSON.stringify(images), {
    httpMetadata: { contentType: "application/json; charset=utf-8", cacheControl: "no-store" },
  });
}

export async function saveSiteImageUpload(value: FormDataEntryValue | null) {
  const upload = validatePhoto(value, true);
  if (!upload) return null;
  await storePhoto(upload);
  return upload.fileId;
}
