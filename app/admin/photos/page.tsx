import { chatGPTSignOutPath } from "@/app/chatgpt-auth";
import { requirePhotoAdmin } from "@/app/photo-admin-auth";
import Link from "next/link";
import PhotoManager from "./photo-manager";
import SiteImageManager from "./site-image-manager";

export const dynamic = "force-dynamic";

export default async function PhotoAdminPage() {
  const user = await requirePhotoAdmin();

  return (
    <main className="photo-admin-shell">
      <header className="photo-admin-header">
        <Link className="photo-admin-brand" href="/" aria-label="DermaDot home">
          <span>Derma</span><span>Dot</span>
        </Link>
        <div className="photo-admin-account">
          <span>{user.email}</span>
          <a href={chatGPTSignOutPath("/admin/photos")}>Αποσύνδεση</a>
        </div>
      </header>

      <section className="photo-admin-intro">
        <p className="eyebrow">Ιδιωτική διαχείριση</p>
        <h1>Φωτογραφίες Πριν &amp; Μετά</h1>
        <p>
          Ανεβάστε ζεύγη φωτογραφιών, προσαρμόστε το κάδρο τους και επιλέξτε
          ποιες είναι δημοσιευμένες. Η σελίδα αυτή δεν συνδέεται από το δημόσιο site.
        </p>
      </section>

      <SiteImageManager />
      <PhotoManager />
    </main>
  );
}
