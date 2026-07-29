import { isAdmin } from "@/app/admin-auth";
import { IMAGE_REGISTRY, getImageDefinition, managedImageUrl } from "@/app/image-registry";
import {
  ImageUploadError,
  imageBucket,
  readImageOverrides,
  saveUploadedImage,
  validateImageUpload,
  writeImageOverrides,
  type ImageOverride,
} from "@/app/image-store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "Not found." }, { status: 404 });
  const overrides = await readImageOverrides();
  return Response.json({
    images: IMAGE_REGISTRY.map((definition) => {
      const override = overrides.find((item) => item.id === definition.id);
      return {
        ...definition,
        currentFilename: override?.filename ?? definition.filename,
        currentWidth: override?.width ?? definition.width,
        currentHeight: override?.height ?? definition.height,
        isCustom: Boolean(override),
        updatedAt: override?.updatedAt ?? null,
        imageUrl: managedImageUrl(definition.id),
      };
    }),
  }, { headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Not found." }, { status: 404 });
  try {
    const formData = await request.formData();
    const id = String(formData.get("id") ?? "");
    const definition = getImageDefinition(id);
    if (!definition) return Response.json({ error: "Unknown website image." }, { status: 400 });
    const upload = await validateImageUpload(formData.get("image"));
    await saveUploadedImage(upload);

    const overrides = await readImageOverrides();
    const previous = overrides.find((item) => item.id === id);
    const next: ImageOverride = {
      id,
      fileId: upload.fileId,
      filename: upload.filename,
      mime: upload.mime,
      width: upload.width,
      height: upload.height,
      updatedAt: new Date().toISOString(),
    };
    await writeImageOverrides([...overrides.filter((item) => item.id !== id), next]);
    if (previous) await imageBucket().delete(`managed-images/files/${previous.fileId}`);

    return Response.json({
      image: {
        ...definition,
        currentFilename: next.filename,
        currentWidth: next.width,
        currentHeight: next.height,
        isCustom: true,
        updatedAt: next.updatedAt,
        imageUrl: `${managedImageUrl(id)}?v=${encodeURIComponent(next.updatedAt)}`,
      },
    });
  } catch (error) {
    if (error instanceof ImageUploadError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: "The image could not be saved. Please try again." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Not found." }, { status: 404 });
  const id = new URL(request.url).searchParams.get("id") ?? "";
  const definition = getImageDefinition(id);
  if (!definition) return Response.json({ error: "Unknown website image." }, { status: 400 });
  const overrides = await readImageOverrides();
  const previous = overrides.find((item) => item.id === id);
  await writeImageOverrides(overrides.filter((item) => item.id !== id));
  if (previous) await imageBucket().delete(`managed-images/files/${previous.fileId}`);
  return Response.json({
    image: {
      ...definition,
      currentFilename: definition.filename,
      currentWidth: definition.width,
      currentHeight: definition.height,
      isCustom: false,
      updatedAt: null,
      imageUrl: `${managedImageUrl(id)}?v=original`,
    },
  });
}
