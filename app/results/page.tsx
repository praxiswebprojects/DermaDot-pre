import { notFound } from "next/navigation";
import DermaDotSite from "../site";
import { pageMetadata } from "../seo";
import { RESULTS_ENABLED } from "../site-features";

export const metadata = pageMetadata("results");

export default function Page() {
  if (!RESULTS_ENABLED) notFound();
  return <DermaDotSite route="results" />;
}
