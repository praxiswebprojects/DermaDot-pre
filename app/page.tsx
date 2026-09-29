import DermaDotSite from "./site";
import { pageMetadata } from "./seo";

export const metadata = pageMetadata("home");

export default function Home() {
  return <DermaDotSite route="home" />;
}
