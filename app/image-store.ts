import { env } from "cloudflare:workers";

export type ImageOverride = {
  id: string;
  fileId: string;
  filename: string;
  mime: string;
  width: number | null;
  height: number | null;
  updatedAt: string;
};

const MANIFEST_KEY = "managed-images/manifest.json";
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

export class ImageUploadError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export function imageBucket() {
  const bucket = (env as unknown as { PHOTOS?: R2Bucket }).PHOTOS;
  if (!bucket) throw new Error("Image storage is unavailable.");
  return bucket;
}

export async function readImageOverrides(): Promise<ImageOverride[]> {
  const object = await imageBucket().get(MANIFEST_KEY);
  if (!object) return [];
  try {
    const value = JSON.parse(await object.text());
    return Array.isArray(value)
      ? value.filter((item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.fileId === "string" &&
          typeof item.filename === "string" &&
          typeof item.mime === "string",
        )
      : [];
  } catch {
    return [];
  }
}

export async function writeImageOverrides(overrides: ImageOverride[]) {
  await imageBucket().put(MANIFEST_KEY, JSON.stringify(overrides), {
    httpMetadata: { contentType: "application/json; charset=utf-8", cacheControl: "no-store" },
  });
}

function pngDimensions(bytes: Uint8Array) {
  if (
    bytes.length < 24 ||
    bytes[0] !== 0x89 || bytes[1] !== 0x50 || bytes[2] !== 0x4e || bytes[3] !== 0x47
  ) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

function jpegDimensions(bytes: Uint8Array) {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 8 < bytes.length) {
    if (bytes[offset] !== 0xff) { offset += 1; continue; }
    const marker = bytes[offset + 1];
    if (marker === 0xd9 || marker === 0xda) break;
    const length = (bytes[offset + 2] << 8) + bytes[offset + 3];
    if (length < 2 || offset + length + 2 > bytes.length) break;
    if (
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)
    ) {
      return {
        height: (bytes[offset + 5] << 8) + bytes[offset + 6],
        width: (bytes[offset + 7] << 8) + bytes[offset + 8],
      };
    }
    offset += length + 2;
  }
  return null;
}

function webpDimensions(bytes: Uint8Array) {
  if (
    bytes.length < 30 ||
    String.fromCharCode(...bytes.slice(0, 4)) !== "RIFF" ||
    String.fromCharCode(...bytes.slice(8, 12)) !== "WEBP"
  ) return null;
  const chunk = String.fromCharCode(...bytes.slice(12, 16));
  if (chunk === "VP8X") {
    return {
      width: 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16),
      height: 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16),
    };
  }
  if (chunk === "VP8L" && bytes[20] === 0x2f) {
    const bits = bytes[21] | (bytes[22] << 8) | (bytes[23] << 16) | (bytes[24] << 24);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (chunk === "VP8 " && bytes.length >= 30) {
    return {
      width: (bytes[26] | (bytes[27] << 8)) & 0x3fff,
      height: (bytes[28] | (bytes[29] << 8)) & 0x3fff,
    };
  }
  return null;
}

function svgDimensions(text: string) {
  if (!/<svg[\s>]/i.test(text)) return null;
  if (
    /<script[\s>]/i.test(text) ||
    /<foreignObject[\s>]/i.test(text) ||
    /\son[a-z]+\s*=/i.test(text) ||
    /javascript\s*:/i.test(text) ||
    /(?:href|src)\s*=\s*["']https?:/i.test(text)
  ) {
    throw new ImageUploadError("The SVG contains unsafe or external content.", 415);
  }
  const width = Number(text.match(/\bwidth\s*=\s*["']([\d.]+)/i)?.[1]);
  const height = Number(text.match(/\bheight\s*=\s*["']([\d.]+)/i)?.[1]);
  if (width > 0 && height > 0) return { width, height };
  const viewBox = text.match(/\bviewBox\s*=\s*["'][\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)/i);
  return viewBox ? { width: Number(viewBox[1]), height: Number(viewBox[2]) } : { width: null, height: null };
}

export async function validateImageUpload(value: FormDataEntryValue | null) {
  if (!(value instanceof File) || value.size === 0) {
    throw new ImageUploadError("Choose an image to upload.", 400);
  }
  const extension = MIME_EXTENSIONS[value.type];
  if (!extension) {
    throw new ImageUploadError("Use a JPG, JPEG, PNG, WebP or SVG image.", 415);
  }
  if (value.size > MAX_FILE_SIZE) {
    throw new ImageUploadError("The image must be smaller than 15 MB.", 413);
  }
  const bytes = new Uint8Array(await value.arrayBuffer());
  let dimensions: { width: number | null; height: number | null } | null;
  if (value.type === "image/png") dimensions = pngDimensions(bytes);
  else if (value.type === "image/jpeg") dimensions = jpegDimensions(bytes);
  else if (value.type === "image/webp") dimensions = webpDimensions(bytes);
  else dimensions = svgDimensions(new TextDecoder().decode(bytes));
  if (!dimensions) {
    throw new ImageUploadError("The selected file is not a valid image.", 415);
  }
  return {
    bytes,
    mime: value.type,
    filename: value.name.slice(0, 180),
    fileId: `${crypto.randomUUID()}.${extension}`,
    width: dimensions.width,
    height: dimensions.height,
  };
}

export async function saveUploadedImage(upload: Awaited<ReturnType<typeof validateImageUpload>>) {
  await imageBucket().put(`managed-images/files/${upload.fileId}`, upload.bytes, {
    httpMetadata: {
      contentType: upload.mime,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });
}
