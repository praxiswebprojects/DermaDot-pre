import DermaDotSite from "../site";
import { pageMetadata } from "../seo";

export const metadata = pageMetadata("thank-you");

export default function ThankYouPage() {
  return <DermaDotSite route="thank-you" />;
}
