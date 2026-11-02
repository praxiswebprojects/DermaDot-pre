import DermaDotSite from "../site";
import { pageMetadata } from "../seo";

export const metadata = pageMetadata("accommodation");

export default function AccommodationPage() {
  return <DermaDotSite route="accommodation" />;
}
