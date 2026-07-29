import { isPhotoAdmin } from "@/app/photo-admin-auth";
import {
  getPhotoBucket,
  readGalleryManifest,
  safeFileId,
} from "@/app/photo-store";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await context.params;
  const fileId = safeFileId(rawId);
  if (!fileId) return new Response("Not found", { status: 404 });

  const entries = await readGalleryManifest();
  const entry = entries.find(
    (item) => item.beforeFileId === fileId || item.afterFileId === fileId,
  );
  if (!entry || (!entry.visible && !(await isPhotoAdmin()))) {
    return new Response("Not found", { status: 404 });
  }

  const object = await getPhotoBucket().get(`gallery/files/${fileId}`);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set(
    "cache-control",
    entry.visible ? "public, max-age=31536000, immutable" : "private, no-store",
  );
  headers.set("x-content-type-options", "nosniff");
  return new Response(object.body as BodyInit, { headers });
}
