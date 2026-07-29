import { isPhotoAdmin } from "@/app/photo-admin-auth";
import {
  normalizeAspect,
  PhotoValidationError,
  readGalleryManifest,
  storePhoto,
  validatePhoto,
  withPhotoUrls,
  writeGalleryManifest,
  type GalleryEntry,
} from "@/app/photo-store";

export const dynamic = "force-dynamic";

function cleanTitle(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim().slice(0, 120) : "";
}

export async function GET(request: Request) {
  try {
    const showAdminState = new URL(request.url).searchParams.get("scope") === "admin";
    if (showAdminState && !(await isPhotoAdmin())) {
      return Response.json({ error: "Not found." }, { status: 404 });
    }

    const entries = await readGalleryManifest();
    return Response.json({
      photos: entries
        .filter((entry) => showAdminState || entry.visible)
        .map(withPhotoUrls),
    }, {
      headers: { "cache-control": "no-store" },
    });
  } catch {
    return Response.json({ photos: [] }, {
      headers: { "cache-control": "no-store" },
    });
  }
}

export async function POST(request: Request) {
  if (!(await isPhotoAdmin())) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  try {
    const formData = await request.formData();
    const beforeUpload = validatePhoto(formData.get("before"));
    const afterUpload = validatePhoto(formData.get("after"));
    if (!beforeUpload || !afterUpload) {
      throw new PhotoValidationError("Choose both photos.", 400);
    }

    await Promise.all([storePhoto(beforeUpload), storePhoto(afterUpload)]);

    const now = new Date().toISOString();
    const entry: GalleryEntry = {
      id: crypto.randomUUID(),
      titleEl: cleanTitle(formData.get("titleEl")),
      titleEn: cleanTitle(formData.get("titleEn")),
      beforeFileId: beforeUpload.fileId,
      afterFileId: afterUpload.fileId,
      beforeCrop: { x: 50, y: 50, zoom: 1 },
      afterCrop: { x: 50, y: 50, zoom: 1 },
      aspect: normalizeAspect(formData.get("aspect")),
      visible: formData.get("visible") === "true",
      createdAt: now,
      updatedAt: now,
    };

    const entries = await readGalleryManifest();
    entries.unshift(entry);
    await writeGalleryManifest(entries);

    return Response.json({ photo: withPhotoUrls(entry) }, { status: 201 });
  } catch (error) {
    if (error instanceof PhotoValidationError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json(
      { error: "The photos could not be uploaded. Please try again." },
      { status: 500 },
    );
  }
}
