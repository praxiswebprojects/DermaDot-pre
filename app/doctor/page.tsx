import DermaDotSite from "../site";
import { pageMetadata } from "../seo";

export const metadata = pageMetadata("doctor");

export default function Page() {
  return <DermaDotSite route="doctor" />;
}
