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

const applicationUsage = (section: string): ImageUsage[] => [
  { page: "Info", path: "/info", section: `Applications Carousel — ${section}` },
  { page: "Applications", path: "/applications", section: `Application Detail — ${section}` },
];

export const IMAGE_REGISTRY: ImageDefinition[] = [
  {
    id: "hero",
    filename: "hero.png",
    sourcePath: "/hero.png",
    width: 1536,
    height: 1024,
    usages: [
      { page: "Home", path: "/", section: "Hero Section" },
      { page: "Home", path: "/", section: "About Section — three image panels" },
      { page: "What is SMP", path: "/what-is-smp", section: "Personal Experience Section" },
      { page: "About Andreas", path: "/doctor", section: "Doctor Portrait" },
    ],
  },
  {
    id: "equipment",
    filename: "smp-02-equipment.webp",
    sourcePath: "/smp-02-equipment.webp",
    width: 1800,
    height: 1200,
    usages: [{ page: "What is SMP", path: "/what-is-smp", section: "Page Hero — Equipment Panel" }],
  },
  {
    id: "crown",
    filename: "crown-thinning.png",
    sourcePath: "/crown-thinning.png",
    width: 554,
    height: 608,
    usages: [{ page: "Before & After", path: "/results", section: "Results Grid — Crown Thinning Card" }],
  },
  {
    id: "male-before",
    filename: "male-hair-loss-before.webp",
    sourcePath: "/cases/male-hair-loss-before.webp",
    width: 1100,
    height: 1476,
    usages: applicationUsage("Male Hair Loss — Before"),
  },
  {
    id: "male-after",
    filename: "male-hair-loss-after.webp",
    sourcePath: "/cases/male-hair-loss-after.webp",
    width: 1100,
    height: 1493,
    usages: applicationUsage("Male Hair Loss — After"),
  },
  ...[
    ["female-before", "female-thinning-before.webp", "Female Thinning — Before"],
    ["female-after", "female-thinning-after.webp", "Female Thinning — After"],
    ["transplant-before", "hair-transplant-scar-before.webp", "Hair-Transplant Scar — Before"],
    ["transplant-after", "hair-transplant-scar-after.webp", "Hair-Transplant Scar — After"],
    ["trauma-before", "trauma-scar-before.webp", "Trauma Scar — Before"],
    ["trauma-after", "trauma-scar-after.webp", "Trauma Scar — After"],
    ["alopecia-before", "alopecia-areata-before.webp", "Alopecia Areata — Before"],
    ["alopecia-after", "alopecia-areata-after.webp", "Alopecia Areata — After"],
    ["beard-before", "beard-density-before.webp", "Beard Density — Before"],
    ["beard-after", "beard-density-after.webp", "Beard Density — After"],
    ["correction-before", "failed-smp-correction-before.webp", "SMP Correction — Before"],
    ["correction-after", "failed-smp-correction-after.webp", "SMP Correction — After"],
  ].map(([id, filename, section]) => ({
    id,
    filename,
    sourcePath: `/cases/${filename}`,
    width: 1100,
    height: 1500,
    usages: applicationUsage(section),
  })),
  {
    id: "og",
    filename: "og.png",
    sourcePath: "/og.png",
    width: 1536,
    height: 1024,
    usages: [{ page: "Global Layout", path: "All pages", section: "Social Sharing / Open Graph Preview" }],
  },
];

export function getImageDefinition(id: string) {
  return IMAGE_REGISTRY.find((image) => image.id === id) ?? null;
}

export function managedImageUrl(id: string) {
  return `/api/admin/images/file/${id}`;
}
