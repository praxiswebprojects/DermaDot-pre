import { getImageDefinition } from "@/app/image-registry";
import { imageBucket, readImageOverrides } from "@/app/image-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const definition = getImageDefinition(id);
  if (!definition) return new Response("Not found", { status: 404 });
  const override = (await readImageOverrides()).find((item) => item.id === id);
  if (!override) return Response.redirect(new URL(definition.sourcePath, request.url), 307);
  const object = await imageBucket().get(`managed-images/files/${override.fileId}`);
  if (!object) return Response.redirect(new URL(definition.sourcePath, request.url), 307);
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "no-store");
  headers.set("x-content-type-options", "nosniff");
  headers.set("content-security-policy", "default-src 'none'; style-src 'unsafe-inline'; sandbox");
  return new Response(object.body as BodyInit, { headers });
}
