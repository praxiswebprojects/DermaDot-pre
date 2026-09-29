import DermaDotSite from "../site";
import { pageMetadata } from "../seo";

export const metadata = pageMetadata("applications");

export default function Page() {
  return <DermaDotSite route="applications" />;
}
