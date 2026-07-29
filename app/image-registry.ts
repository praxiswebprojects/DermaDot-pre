export type ImageUsage = {
  page: string;
  path: string;
  section: string;
};

export type ImageDefinition = {
  id: string;
  filename: string;
  sourcePath: string;
  width: number;
  height: number;
  usages: ImageUsage[];
};

function frame(
  id: string,
  filename: string,
  sourcePath: string,
  width: number,
  height: number,
  page: string,
  path: string,
  section: string,
): ImageDefinition {
  return { id, filename, sourcePath, width, height, usages: [{ page, path, section }] };
}

const applicationCases = [
  { key: "male", before: "male-hair-loss-before.webp", after: "male-hair-loss-after.webp", beforeHeight: 1476, afterHeight: 1493, label: "Male Hair Loss" },
  { key: "female", before: "female-thinning-before.webp", after: "female-thinning-after.webp", beforeHeight: 1500, afterHeight: 1500, label: "Female Thinning" },
  { key: "transplant", before: "hair-transplant-scar-before.webp", after: "hair-transplant-scar-after.webp", beforeHeight: 1500, afterHeight: 1500, label: "Hair-Transplant Scar" },
  { key: "trauma", before: "trauma-scar-before.webp", after: "trauma-scar-after.webp", beforeHeight: 1500, afterHeight: 1500, label: "Trauma Scar" },
  { key: "alopecia", before: "alopecia-areata-before.webp", after: "alopecia-areata-after.webp", beforeHeight: 1500, afterHeight: 1500, label: "Alopecia Areata" },
  { key: "beard", before: "beard-density-before.webp", after: "beard-density-after.webp", beforeHeight: 1500, afterHeight: 1500, label: "Beard Density" },
  { key: "correction", before: "failed-smp-correction-before.webp", after: "failed-smp-correction-after.webp", beforeHeight: 1500, afterHeight: 1500, label: "SMP Correction" },
];

const applicationFrames = applicationCases.flatMap((item): ImageDefinition[] => [
  frame(
    `${item.key}-before`,
    item.before,
    `/cases/${item.before}`,
    1100,
    item.beforeHeight,
    "Info",
    "/info",
    `Applications Carousel — ${item.label} — Before Frame`,
  ),
  frame(
    `${item.key}-after`,
    item.after,
    `/cases/${item.after}`,
    1100,
    item.afterHeight,
    "Info",
    "/info",
    `Applications Carousel — ${item.label} — After Frame`,
  ),
  frame(
    `${item.key}-detail-before`,
    item.before,
    `/cases/${item.before}`,
    1100,
    item.beforeHeight,
    "Applications",
    "/applications",
    `${item.label} Detail — Before Frame`,
  ),
  frame(
    `${item.key}-detail-after`,
    item.after,
    `/cases/${item.after}`,
    1100,
    item.afterHeight,
    "Applications",
    "/applications",
    `${item.label} Detail — After Frame`,
  ),
]);

export const IMAGE_REGISTRY: ImageDefinition[] = [
  frame("hero", "hero.png", "/hero.png", 1536, 1024, "Home", "/", "Hero Section — Main Background Frame"),
  frame("home-about-left", "hero.png", "/hero.png", 1536, 1024, "Home", "/", "About Section — Left Image Frame"),
  frame("home-about-wide", "hero.png", "/hero.png", 1536, 1024, "Home", "/", "About Section — Wide Center Image Frame"),
  frame("home-about-right", "hero.png", "/hero.png", 1536, 1024, "Home", "/", "About Section — Right Image Frame"),
  frame("personal-experience", "hero.png", "/hero.png", 1536, 1024, "What is SMP", "/what-is-smp", "Personal Experience Section — Image Frame"),
  frame("doctor-portrait", "hero.png", "/hero.png", 1536, 1024, "About Andreas", "/doctor", "Doctor Profile — Portrait Frame"),
  frame("equipment", "smp-02-equipment.webp", "/smp-02-equipment.webp", 1800, 1200, "What is SMP", "/what-is-smp", "Page Hero — Equipment Frame"),
  frame("crown", "crown-thinning.png", "/crown-thinning.png", 554, 608, "Before & After", "/results", "Results Grid — Crown Thinning Frame"),
  ...applicationFrames,
  frame("og", "og.png", "/og.png", 1536, 1024, "Global Layout", "All pages", "Social Sharing / Open Graph Preview"),
];

export function getImageDefinition(id: string) {
  return IMAGE_REGISTRY.find((image) => image.id === id) ?? null;
}

export function managedImageUrl(id: string) {
  return `/api/admin/images/file/${id}`;
}
