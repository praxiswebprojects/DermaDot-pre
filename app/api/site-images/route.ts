import { isPhotoAdmin } from "@/app/photo-admin-auth";
import { getPhotoBucket, normalizeCrop, PhotoValidationError } from "@/app/photo-store";
import {
  getSlot,
  readSiteImages,
  saveSiteImageUpload,
  SITE_IMAGE_SLOTS,
  writeSiteImages,
  type SiteImage,
} from "@/app/site-image-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const images = await readSiteImages();
  return Response.json({
    images: SITE_IMAGE_SLOTS.map((slot) => {
      const saved = images.find((image) => image.slot === slot.id);
      return {
        slot: slot.id,
        label: slot.label,
        fallback: slot.fallback,
        fileId: saved?.fileId ?? null,
        x: saved?.x ?? 50,
        y: saved?.y ?? 50,
        zoom: saved?.zoom ?? 1,
        url: `/api/site-images/file/${slot.id}`,
      };
    }),
  }, { headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  if (!(await isPhotoAdmin())) return Response.json({ error: "Not found." }, { status: 404 });
  try {
    const formData = await request.formData();
    const slot = getSlot(String(formData.get("slot") ?? ""));
    if (!slot) return Response.json({ error: "Invalid photo position." }, { status: 400 });

    const images = await readSiteImages();
    const previous = images.find((image) => image.slot === slot.id);
    const newFileId = await saveSiteImageUpload(formData.get("photo"));
    const crop = normalizeCrop({
      x: formData.get("x"),
      y: formData.get("y"),
      zoom: formData.get("zoom"),
    });
    const next: SiteImage = {
      slot: slot.id,
      fileId: newFileId ?? previous?.fileId ?? null,
      ...crop,
    };
    const updated = images.filter((image) => image.slot !== slot.id);
    updated.push(next);
    await writeSiteImages(updated);
    if (newFileId && previous?.fileId) {
      await getPhotoBucket().delete(`gallery/files/${previous.fileId}`);
    }
    return Response.json({ image: { ...next, label: slot.label, fallback: slot.fallback, url: `/api/site-images/file/${slot.id}` } });
  } catch (error) {
    if (error instanceof PhotoValidationError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: "The site photo could not be saved." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isPhotoAdmin())) return Response.json({ error: "Not found." }, { status: 404 });
  const slot = getSlot(new URL(request.url).searchParams.get("slot") ?? "");
  if (!slot) return Response.json({ error: "Invalid photo position." }, { status: 400 });
  const images = await readSiteImages();
  const previous = images.find((image) => image.slot === slot.id);
  await writeSiteImages(images.filter((image) => image.slot !== slot.id));
  if (previous?.fileId) await getPhotoBucket().delete(`gallery/files/${previous.fileId}`);
  return new Response(null, { status: 204 });
}
