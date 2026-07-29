import { env } from "cloudflare:workers";

export type CropSettings = {
  x: number;
  y: number;
  zoom: number;
};

export type GalleryAspect = "portrait" | "square" | "landscape";

export type GalleryEntry = {
  id: string;
  titleEl: string;
  titleEn: string;
  beforeFileId: string;
  afterFileId: string;
  beforeCrop: CropSettings;
  afterCrop: CropSettings;
  aspect: GalleryAspect;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GalleryEntryWithUrls = GalleryEntry & {
  beforeUrl: string;
  afterUrl: string;
};

const MANIFEST_KEY = "gallery/manifest.json";
const DEFAULT_CROP: CropSettings = { x: 50, y: 50, zoom: 1 };

export function getPhotoBucket() {
  const bucket = (env as unknown as { PHOTOS?: R2Bucket }).PHOTOS;
  if (!bucket) throw new Error("Photo storage is not available.");
  return bucket;
}

function numberInRange(value: unknown, min: number, max: number, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

export function normalizeCrop(value: unknown): CropSettings {
  const crop = value && typeof value === "object" ? value as Partial<CropSettings> : {};
  return {
    x: numberInRange(crop.x, 0, 100, DEFAULT_CROP.x),
    y: numberInRange(crop.y, 0, 100, DEFAULT_CROP.y),
    zoom: numberInRange(crop.zoom, 1, 2.5, DEFAULT_CROP.zoom),
  };
}

export function normalizeAspect(value: unknown): GalleryAspect {
  return value === "square" || value === "landscape" ? value : "portrait";
}

function validFileId(value: unknown): value is string {
  return typeof value === "string" &&
    /^[a-f0-9-]{36}\.(?:jpg|png|webp|avif)$/i.test(value);
}

function normalizeEntry(value: unknown): GalleryEntry | null {
  if (!value || typeof value !== "object") return null;
  const entry = value as Partial<GalleryEntry>;
  if (
    typeof entry.id !== "string" ||
    !validFileId(entry.beforeFileId) ||
    !validFileId(entry.afterFileId)
  ) return null;

  const createdAt = typeof entry.createdAt === "string"
    ? entry.createdAt
    : new Date().toISOString();

  return {
    id: entry.id,
    titleEl: typeof entry.titleEl === "string" ? entry.titleEl.slice(0, 120) : "",
    titleEn: typeof entry.titleEn === "string" ? entry.titleEn.slice(0, 120) : "",
    beforeFileId: entry.beforeFileId,
    afterFileId: entry.afterFileId,
    beforeCrop: normalizeCrop(entry.beforeCrop),
    afterCrop: normalizeCrop(entry.afterCrop),
    aspect: normalizeAspect(entry.aspect),
    visible: entry.visible === true,
    createdAt,
    updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : createdAt,
  };
}

export async function readGalleryManifest(): Promise<GalleryEntry[]> {
  const object = await getPhotoBucket().get(MANIFEST_KEY);
  if (!object) return [];

  try {
    const parsed = JSON.parse(await object.text());
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeEntry).filter((entry): entry is GalleryEntry => Boolean(entry));
  } catch {
    return [];
  }
}

export async function writeGalleryManifest(entries: GalleryEntry[]) {
  await getPhotoBucket().put(MANIFEST_KEY, JSON.stringify(entries), {
    httpMetadata: {
      contentType: "application/json; charset=utf-8",
      cacheControl: "no-store",
    },
  });
}

export function withPhotoUrls(entry: GalleryEntry): GalleryEntryWithUrls {
  return {
    ...entry,
    beforeUrl: `/api/photos/file/${encodeURIComponent(entry.beforeFileId)}`,
    afterUrl: `/api/photos/file/${encodeURIComponent(entry.afterFileId)}`,
  };
}

export function safeFileId(value: string) {
  return validFileId(value) ? value : null;
}

const ACCEPTED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

export function validatePhoto(value: FormDataEntryValue | null, optional = false) {
  if (!(value instanceof File) || value.size === 0) {
    if (optional) return null;
    throw new PhotoValidationError("Choose both a Before and an After photo.", 400);
  }
  const extension = ACCEPTED_TYPES.get(value.type);
  if (!extension) {
    throw new PhotoValidationError("Use JPG, PNG, WebP or AVIF images.", 415);
  }
  if (value.size > 15 * 1024 * 1024) {
    throw new PhotoValidationError("Each photo must be smaller than 15 MB.", 413);
  }
  return { file: value, fileId: `${crypto.randomUUID()}.${extension}` };
}

export async function storePhoto(upload: { file: File; fileId: string }) {
  await getPhotoBucket().put(`gallery/files/${upload.fileId}`, upload.file.stream(), {
    httpMetadata: {
      contentType: upload.file.type,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });
}

export class PhotoValidationError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}
