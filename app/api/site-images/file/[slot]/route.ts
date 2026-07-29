import { getPhotoBucket } from "@/app/photo-store";
import { getSlot, readSiteImages } from "@/app/site-image-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ slot: string }> }) {
  const { slot: id } = await context.params;
  const slot = getSlot(id);
  if (!slot) return new Response("Not found", { status: 404 });
  const saved = (await readSiteImages()).find((image) => image.slot === slot.id);
  if (!saved?.fileId) return Response.redirect(new URL(slot.fallback, request.url), 307);
  const object = await getPhotoBucket().get(`gallery/files/${saved.fileId}`);
  if (!object) return Response.redirect(new URL(slot.fallback, request.url), 307);
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "no-store");
  headers.set("x-content-type-options", "nosniff");
  return new Response(object.body as BodyInit, { headers });
}
