"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

type Photo = {
  id: string;
  alt: string;
  uploadedAt: string;
  url: string;
};

export default function PhotoManager() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const loadPhotos = useCallback(async () => {
    const response = await fetch("/api/photos", { cache: "no-store" });
    const data = (await response.json()) as { photos?: Photo[] };
    setPhotos(data.photos ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadPhotos();
  }, [loadPhotos]);

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    const response = await fetch("/api/photos", {
      method: "POST",
      body: new FormData(event.currentTarget),
    });
    const data = (await response.json()) as { error?: string };

    if (!response.ok) {
      setMessage(data.error ?? "Η μεταφόρτωση απέτυχε.");
      setBusy(false);
      return;
    }

    formRef.current?.reset();
    setMessage("Η φωτογραφία ανέβηκε επιτυχώς.");
    await loadPhotos();
    setBusy(false);
  }

  async function remove(photo: Photo) {
    const confirmed = window.confirm(
      `Να διαγραφεί οριστικά η φωτογραφία «${photo.alt}»;`,
    );
    if (!confirmed) return;

    setBusy(true);
    setMessage("");
    const response = await fetch(`/api/photos/${encodeURIComponent(photo.id)}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setMessage(data.error ?? "Η διαγραφή απέτυχε.");
      setBusy(false);
      return;
    }

    setPhotos((current) => current.filter((item) => item.id !== photo.id));
    setMessage("Η φωτογραφία διαγράφηκε.");
    setBusy(false);
  }

  return (
    <section className="photo-manager">
      <form className="photo-upload-card" ref={formRef} onSubmit={upload}>
        <div>
          <span className="photo-admin-step">01</span>
          <h2>Νέα φωτογραφία</h2>
          <p>JPG, PNG, WebP ή AVIF έως 10 MB.</p>
        </div>
        <label className="photo-file-field">
          <span>Επιλογή αρχείου</span>
          <input
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            required
          />
        </label>
        <label className="photo-alt-field">
          <span>Περιγραφή φωτογραφίας</span>
          <input
            name="alt"
            type="text"
            maxLength={140}
            placeholder="π.χ. Φυσικό αποτέλεσμα hairline"
          />
        </label>
        <button className="button" disabled={busy} type="submit">
          {busy ? "Παρακαλώ περιμένετε…" : "Ανέβασμα φωτογραφίας"}
        </button>
      </form>

      {message && (
        <p className="photo-admin-message" role="status">
          {message}
        </p>
      )}

      <div className="photo-library-head">
        <div>
          <span className="photo-admin-step">02</span>
          <h2>Βιβλιοθήκη φωτογραφιών</h2>
        </div>
        <span>{photos.length} φωτογραφίες</span>
      </div>

      {loading ? (
        <p className="photo-admin-empty">Φόρτωση φωτογραφιών…</p>
      ) : photos.length === 0 ? (
        <p className="photo-admin-empty">
          Δεν υπάρχουν ακόμη φωτογραφίες. Ανεβάστε την πρώτη παραπάνω.
        </p>
      ) : (
        <div className="photo-admin-grid">
          {photos.map((photo) => (
            <article className="photo-admin-card" key={photo.id}>
              <img src={photo.url} alt={photo.alt} />
              <div>
                <p>{photo.alt}</p>
                <time dateTime={photo.uploadedAt}>
                  {new Intl.DateTimeFormat("el-GR", {
                    dateStyle: "medium",
                  }).format(new Date(photo.uploadedAt))}
                </time>
                <button
                  disabled={busy}
                  type="button"
                  onClick={() => void remove(photo)}
                >
                  Διαγραφή
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
