import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";

export const dynamic = "force-dynamic";

type StoredPhoto = {
  id: string;
  alt: string;
  uploadedAt: string;
  url: string;
};

function getPhotoBucket() {
  const bucket = (env as unknown as { PHOTOS?: R2Bucket }).PHOTOS;
  if (!bucket) {
    throw new Error("Photo storage is not available.");
  }
  return bucket;
}

function decodeMetadata(value?: string) {
  if (!value) return "";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function GET() {
  try {
    const bucket = getPhotoBucket();
    const listing = await bucket.list({
      prefix: "gallery/",
      include: ["customMetadata"],
      limit: 100,
    });

    const photos: StoredPhoto[] = listing.objects
      .map((object) => {
        const id = object.key.slice("gallery/".length);
        return {
          id,
          alt: decodeMetadata(object.customMetadata?.alt) || "DermaDot SMP result",
          uploadedAt:
            object.customMetadata?.uploadedAt ?? object.uploaded.toISOString(),
          url: `/api/photos/${encodeURIComponent(id)}`,
        };
      })
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));

    return Response.json({ photos });
  } catch {
    return Response.json({ photos: [] }, { status: 200 });
  }
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) {
    return Response.json({ error: "Authentication required." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("photo");
  const alt = String(formData.get("alt") ?? "").trim();

  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "Choose a photo to upload." }, { status: 400 });
  }

  const acceptedTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
  ]);

  if (!acceptedTypes.has(file.type)) {
    return Response.json(
      { error: "Use a JPG, PNG, WebP or AVIF image." },
      { status: 415 },
    );
  }

  if (file.size > 10 * 1024 * 1024) {
    return Response.json(
      { error: "The photo must be smaller than 10 MB." },
      { status: 413 },
    );
  }

  const extensionByType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
  };
  const id = `${crypto.randomUUID()}.${extensionByType[file.type]}`;
  const uploadedAt = new Date().toISOString();
  const bucket = getPhotoBucket();

  await bucket.put(`gallery/${id}`, file.stream(), {
    httpMetadata: {
      contentType: file.type,
      cacheControl: "public, max-age=31536000, immutable",
    },
    customMetadata: {
      alt: encodeURIComponent(alt || "DermaDot SMP result"),
      uploadedAt,
      uploadedBy: encodeURIComponent(user.email),
    },
  });

  return Response.json(
    {
      photo: {
        id,
        alt: alt || "DermaDot SMP result",
        uploadedAt,
        url: `/api/photos/${encodeURIComponent(id)}`,
      },
    },
    { status: 201 },
  );
}
