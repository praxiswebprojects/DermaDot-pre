import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";

function getPhotoBucket() {
  const bucket = (env as unknown as { PHOTOS?: R2Bucket }).PHOTOS;
  if (!bucket) {
    throw new Error("Photo storage is not available.");
  }
  return bucket;
}

function safeId(value: string) {
  return /^[a-f0-9-]+\.(?:jpg|png|webp|avif)$/i.test(value) ? value : null;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await context.params;
  const id = safeId(rawId);
  if (!id) return new Response("Not found", { status: 404 });

  const object = await getPhotoBucket().get(`gallery/${id}`);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");

  return new Response(object.body as BodyInit, { headers });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await context.params;
  const id = safeId(rawId);
  if (!id) {
    return Response.json({ error: "Invalid photo." }, { status: 400 });
  }

  await getPhotoBucket().delete(`gallery/${id}`);
  return new Response(null, { status: 204 });
}
