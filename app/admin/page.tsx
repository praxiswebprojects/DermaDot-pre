import { chatGPTSignOutPath } from "@/app/chatgpt-auth";
import { requireAdmin } from "@/app/admin-auth";
import Link from "next/link";
import ImageDashboard from "./image-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireAdmin();
  return (
    <main className="image-admin-shell">
      <header className="image-admin-header">
        <Link className="image-admin-brand" href="/" aria-label="DermaDot home">
          <span>Derma</span><span>Dot</span>
        </Link>
        <div className="image-admin-account">
          <span>{user.email}</span>
          <a href={chatGPTSignOutPath("/admin")}>Sign out</a>
        </div>
      </header>
      <section className="image-admin-intro">
        <p className="eyebrow">Private administration</p>
        <h1>Website Image Manager</h1>
        <p>
          Every active image is mapped to its exact page and section. Replacing
          an image here updates all of its listed placements automatically.
        </p>
      </section>
      <ImageDashboard />
    </main>
  );
}
