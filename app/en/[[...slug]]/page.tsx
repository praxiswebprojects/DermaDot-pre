import { notFound } from "next/navigation";
import DermaDotSite, { type Route } from "../../site";
import { pageMetadata, type SitePage } from "../../seo";
import { RESULTS_ENABLED } from "../../site-features";

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
  "thank-you": "thank-you",
  faq: "faq",
};

export default async function EnglishPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const route = englishRoutes[slug.join("/")];

  if (!route || (route === "results" && !RESULTS_ENABLED)) notFound();

  return <DermaDotSite route={route} lang="en" />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const route = englishRoutes[slug.join("/")] as SitePage | undefined;
  if (!route || (route === "results" && !RESULTS_ENABLED)) notFound();
  return pageMetadata(route, "en");
}
