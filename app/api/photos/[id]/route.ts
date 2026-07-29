import { isPhotoAdmin } from "@/app/photo-admin-auth";
import {
  getPhotoBucket,
  normalizeAspect,
  normalizeCrop,
  PhotoValidationError,
  readGalleryManifest,
  storePhoto,
  validatePhoto,
  withPhotoUrls,
  writeGalleryManifest,
  type GalleryEntry,
} from "@/app/photo-store";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

async function requireAdminResponse() {
  return await isPhotoAdmin()
    ? null
    : Response.json({ error: "Not found." }, { status: 404 });
}

function text(value: unknown, fallback: string) {
  return typeof value === "string" ? value.trim().slice(0, 120) : fallback;
}

function updatedEntry(entry: GalleryEntry, body: Record<string, unknown>): GalleryEntry {
  return {
    ...entry,
    titleEl: text(body.titleEl, entry.titleEl),
    titleEn: text(body.titleEn, entry.titleEn),
    beforeCrop: body.beforeCrop ? normalizeCrop(body.beforeCrop) : entry.beforeCrop,
    afterCrop: body.afterCrop ? normalizeCrop(body.afterCrop) : entry.afterCrop,
    aspect: body.aspect ? normalizeAspect(body.aspect) : entry.aspect,
    visible: typeof body.visible === "boolean" ? body.visible : entry.visible,
    updatedAt: new Date().toISOString(),
  };
}

export async function PATCH(request: Request, context: RouteContext) {
  const denied = await requireAdminResponse();
  if (denied) return denied;

  const { id } = await context.params;
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "Invalid changes." }, { status: 400 });

  const entries = await readGalleryManifest();
  const index = entries.findIndex((entry) => entry.id === id);
  if (index < 0) return Response.json({ error: "Photo set not found." }, { status: 404 });

  if (body.action === "move-up" && index > 0) {
    [entries[index - 1], entries[index]] = [entries[index], entries[index - 1]];
  } else if (body.action === "move-down" && index < entries.length - 1) {
    [entries[index], entries[index + 1]] = [entries[index + 1], entries[index]];
  } else {
    entries[index] = updatedEntry(entries[index], body);
  }

  await writeGalleryManifest(entries);
  const current = entries.find((entry) => entry.id === id);
  return Response.json({ photo: current ? withPhotoUrls(current) : null });
}

export async function POST(request: Request, context: RouteContext) {
  const denied = await requireAdminResponse();
  if (denied) return denied;

  try {
    const { id } = await context.params;
    const formData = await request.formData();
    const beforeUpload = validatePhoto(formData.get("before"), true);
    const afterUpload = validatePhoto(formData.get("after"), true);
    if (!beforeUpload && !afterUpload) {
      throw new PhotoValidationError("Choose a replacement photo.", 400);
    }

    const entries = await readGalleryManifest();
    const index = entries.findIndex((entry) => entry.id === id);
    if (index < 0) {
      return Response.json({ error: "Photo set not found." }, { status: 404 });
    }

    const previous = entries[index];
    await Promise.all([
      beforeUpload ? storePhoto(beforeUpload) : Promise.resolve(),
      afterUpload ? storePhoto(afterUpload) : Promise.resolve(),
    ]);

    const next: GalleryEntry = {
      ...previous,
      beforeFileId: beforeUpload?.fileId ?? previous.beforeFileId,
      afterFileId: afterUpload?.fileId ?? previous.afterFileId,
      updatedAt: new Date().toISOString(),
    };
    entries[index] = next;
    await writeGalleryManifest(entries);

    const obsolete = [
      beforeUpload ? previous.beforeFileId : null,
      afterUpload ? previous.afterFileId : null,
    ].filter((value): value is string => Boolean(value));
    if (obsolete.length) {
      await getPhotoBucket().delete(obsolete.map((fileId) => `gallery/files/${fileId}`));
    }

    return Response.json({ photo: withPhotoUrls(next) });
  } catch (error) {
    if (error instanceof PhotoValidationError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: "The photo could not be replaced." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const denied = await requireAdminResponse();
  if (denied) return denied;

  const { id } = await context.params;
  const entries = await readGalleryManifest();
  const entry = entries.find((item) => item.id === id);
  if (!entry) return Response.json({ error: "Photo set not found." }, { status: 404 });

  await writeGalleryManifest(entries.filter((item) => item.id !== id));
  await getPhotoBucket().delete([
    `gallery/files/${entry.beforeFileId}`,
    `gallery/files/${entry.afterFileId}`,
  ]);
  return new Response(null, { status: 204 });
}
