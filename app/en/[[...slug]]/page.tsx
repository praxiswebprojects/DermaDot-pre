import { notFound } from "next/navigation";
import DermaDotSite, { type Route } from "../../site";

const englishRoutes: Record<string, Route> = {
  "": "home",
  info: "info",
  applications: "applications",
  doctor: "doctor",
  "what-is-smp": "what-is-smp",
  "treatment-guide": "treatment-guide",
  results: "results",
  procedure: "procedure",
  aftercare: "aftercare",
  contact: "contact",
  faq: "faq",
};

export default async function EnglishPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const route = englishRoutes[slug.join("/")];

  if (!route) notFound();

  return <DermaDotSite route={route} lang="en" />;
}
