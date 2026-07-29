"use client";

import { type FormEvent, useEffect, useState } from "react";

type SiteImage = {
  slot: string;
  label: string;
  fallback: string;
  fileId: string | null;
  x: number;
  y: number;
  zoom: number;
  url: string;
};

export default function SiteImageManager() {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/site-images", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { images?: SiteImage[] }) => {
        if (active) setImages(data.images ?? []);
      });
    return () => { active = false; };
  }, []);

  function update(slot: string, field: "x" | "y" | "zoom", value: number) {
    setImages((current) => current.map((image) =>
      image.slot === slot ? { ...image, [field]: value } : image,
    ));
  }

  async function save(event: FormEvent<HTMLFormElement>, image: SiteImage) {
    event.preventDefault();
    setBusy(image.slot);
    setMessage("");
    const formData = new FormData(event.currentTarget);
    formData.set("slot", image.slot);
    formData.set("x", String(image.x));
    formData.set("y", String(image.y));
    formData.set("zoom", String(image.zoom));
    const response = await fetch("/api/site-images", { method: "POST", body: formData });
    const data = await response.json() as { image?: SiteImage; error?: string };
    if (response.ok && data.image) {
      event.currentTarget.reset();
      setImages((current) => current.map((item) =>
        item.slot === image.slot ? { ...item, ...data.image, url: `${data.image?.url}?v=${Date.now()}` } : item,
      ));
      setMessage(`Η φωτογραφία «${image.label}» αποθηκεύτηκε.`);
    } else {
      setMessage(data.error ?? "Η αποθήκευση απέτυχε.");
    }
    setBusy(null);
  }

  async function reset(image: SiteImage) {
    if (!window.confirm(`Επαναφορά της φωτογραφίας «${image.label}» στην αρχική;`)) return;
    setBusy(image.slot);
    const response = await fetch(`/api/site-images?slot=${encodeURIComponent(image.slot)}`, { method: "DELETE" });
    if (response.ok) {
      setImages((current) => current.map((item) =>
        item.slot === image.slot
          ? { ...item, fileId: null, x: 50, y: 50, zoom: 1, url: `${item.url}?v=${Date.now()}` }
          : item,
      ));
      setMessage("Έγινε επαναφορά στην αρχική φωτογραφία.");
    }
    setBusy(null);
  }

  return (
    <section className="site-image-manager">
      <div className="photo-library-head">
        <div>
          <span className="photo-admin-step">01</span>
          <h2>Φωτογραφίες υπόλοιπου site</h2>
        </div>
        <span>{images.length} θέσεις</span>
      </div>
      <p className="site-image-help">
        Επιλέξτε τη θέση που θέλετε, ανεβάστε νέα φωτογραφία και ρυθμίστε το zoom
        και το σημείο εστίασης. Χωρίς νέο αρχείο μπορείτε να αλλάξετε μόνο το κάδρο.
      </p>
      {message && <p className="photo-admin-message" role="status">{message}</p>}
      <div className="site-image-grid">
        {images.map((image) => (
          <form className="site-image-card" key={image.slot} onSubmit={(event) => void save(event, image)}>
            <div className="site-image-preview">
              <img
                src={image.url}
                alt=""
                style={{ objectPosition: `${image.x}% ${image.y}%`, transform: `scale(${image.zoom})` }}
              />
            </div>
            <div className="site-image-card-body">
              <div className="site-image-title">
                <h3>{image.label}</h3>
                <span>{image.fileId ? "Δική σας φωτογραφία" : "Αρχική φωτογραφία"}</span>
              </div>
              <label><span>Νέα φωτογραφία</span><input name="photo" type="file" accept="image/jpeg,image/png,image/webp,image/avif" /></label>
              <label><span>Zoom</span><input type="range" min="1" max="2.5" step=".01" value={image.zoom} onChange={(event) => update(image.slot, "zoom", Number(event.target.value))} /></label>
              <label><span>Οριζόντια θέση</span><input type="range" min="0" max="100" value={image.x} onChange={(event) => update(image.slot, "x", Number(event.target.value))} /></label>
              <label><span>Κάθετη θέση</span><input type="range" min="0" max="100" value={image.y} onChange={(event) => update(image.slot, "y", Number(event.target.value))} /></label>
              <div className="site-image-actions">
                <button className="photo-save-button" type="submit" disabled={busy === image.slot}>Αποθήκευση</button>
                {image.fileId ? <button type="button" onClick={() => void reset(image)} disabled={busy === image.slot}>Επαναφορά</button> : null}
              </div>
            </div>
          </form>
        ))}
      </div>
    </section>
  );
}
