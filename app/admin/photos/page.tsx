import { requireChatGPTUser, chatGPTSignOutPath } from "@/app/chatgpt-auth";
import PhotoManager from "./photo-manager";

export const dynamic = "force-dynamic";

export default async function PhotoAdminPage() {
  const user = await requireChatGPTUser("/admin/photos");

  return (
    <main className="photo-admin-shell">
      <header className="photo-admin-header">
        <a className="photo-admin-brand" href="/">
          <img src="/logo.png" alt="DermaDot Plus — Andreas Petropoulos" />
        </a>
        <div className="photo-admin-account">
          <span>{user.displayName}</span>
          <a href={chatGPTSignOutPath("/admin/photos")}>Sign out</a>
        </div>
      </header>
      <section className="photo-admin-intro">
        <p className="eyebrow">DermaDot / Photo manager</p>
        <h1>Διαχείριση φωτογραφιών</h1>
        <p>
          Ανεβάστε φωτογραφίες αποτελεσμάτων για τη σελίδα «Πριν &amp; Μετά» ή
          διαγράψτε όσες δεν θέλετε να εμφανίζονται.
        </p>
      </section>
      <PhotoManager />
    </main>
  );
}
