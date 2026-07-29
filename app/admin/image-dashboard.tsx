"use client";

import { type ChangeEvent, useEffect, useRef, useState } from "react";
import type { ImageUsage } from "@/app/image-registry";

type ManagedImage = {
  id: string;
  filename: string;
  sourcePath: string;
  width: number;
  height: number;
  usages: ImageUsage[];
  currentFilename: string;
  currentWidth: number | null;
  currentHeight: number | null;
  isCustom: boolean;
  updatedAt: string | null;
  imageUrl: string;
};

const ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
]);

function ImageCard({
  image,
  onUpdate,
}: {
  image: ManagedImage;
  onUpdate: (image: ManagedImage) => void;
}) {
  const [selected, setSelected] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function cancel() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setSelected(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  function choose(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (!file) return cancel();
    if (!ACCEPTED_TYPES.has(file.type)) {
      cancel();
      setError("Use JPG, JPEG, PNG, WebP or SVG.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      cancel();
      setError("The image must be smaller than 15 MB.");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setSelected(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  }

  async function save() {
    if (!selected) return;
    setBusy(true);
    setError("");
    const formData = new FormData();
    formData.set("id", image.id);
    formData.set("image", selected);
    try {
      const response = await fetch("/api/admin/images", { method: "POST", body: formData });
      const data = await response.json() as { image?: ManagedImage; error?: string };
      if (!response.ok || !data.image) throw new Error(data.error ?? "Upload failed.");
      onUpdate(data.image);
      cancel();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function restore() {
    if (!window.confirm(`Restore ${image.filename}?`)) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/images?id=${encodeURIComponent(image.id)}`, { method: "DELETE" });
      const data = await response.json() as { image?: ManagedImage; error?: string };
      if (!response.ok || !data.image) throw new Error(data.error ?? "Restore failed.");
      onUpdate(data.image);
      cancel();
    } catch (restoreError) {
      setError(restoreError instanceof Error ? restoreError.message : "Restore failed.");
    } finally {
      setBusy(false);
    }
  }

  const dimensions = image.currentWidth && image.currentHeight
    ? `${image.currentWidth} × ${image.currentHeight}px`
    : "Dimensions unavailable";

  return (
    <article className="image-admin-card">
      <div className="image-admin-preview">
        <img src={preview ?? image.imageUrl} alt="" />
        {preview ? <span>Unsaved preview</span> : image.isCustom ? <span>Custom image</span> : <span>Original image</span>}
      </div>
      <div className="image-admin-card-body">
        <div className="image-admin-file-meta">
          <div>
            <h2>{image.currentFilename}</h2>
            <p>{dimensions}</p>
          </div>
          <code>{image.sourcePath}</code>
        </div>

        <div className="image-admin-usage-list">
          <h3>Used in</h3>
          {image.usages.map((usage) => (
            <div className="image-admin-usage" key={`${usage.path}-${usage.section}`}>
              <span>{usage.page}</span>
              <code>{usage.path}</code>
              <strong>{usage.section}</strong>
            </div>
          ))}
        </div>

        <label className="image-admin-upload">
          <span>{selected ? "Choose a different image" : "Replace image"}</span>
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.svg,image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={choose}
            disabled={busy}
          />
        </label>

        {selected ? (
          <div className="image-admin-selected">
            <span>{selected.name}</span>
            <span>{(selected.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        ) : null}

        {error ? <p className="image-admin-error" role="alert">{error}</p> : null}

        <div className="image-admin-actions">
          {selected ? (
            <>
              <button className="image-admin-save" type="button" onClick={() => void save()} disabled={busy}>
                {busy ? "Saving…" : "Save changes"}
              </button>
              <button type="button" onClick={cancel} disabled={busy}>Cancel</button>
            </>
          ) : null}
          {image.isCustom && !selected ? (
            <button className="image-admin-restore" type="button" onClick={() => void restore()} disabled={busy}>
              Restore original
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function ImageDashboard() {
  const [images, setImages] = useState<ManagedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/admin/images", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json() as { images?: ManagedImage[]; error?: string };
        if (!response.ok) throw new Error(data.error ?? "Could not load website images.");
        if (active) setImages(data.images ?? []);
      })
      .catch((loadError: Error) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  function updateImage(updated: ManagedImage) {
    setImages((current) => current.map((image) => image.id === updated.id ? updated : image));
  }

  return (
    <section className="image-admin-dashboard">
      <div className="image-admin-summary">
        <div><strong>{images.length}</strong><span>editable image frames</span></div>
        <p>Accepted formats: JPG, JPEG, PNG, WebP and SVG · Maximum 15 MB</p>
      </div>
      {loading ? <p className="image-admin-state">Loading image registry…</p> : null}
      {error ? <p className="image-admin-error" role="alert">{error}</p> : null}
      {!loading && !error ? (
        <div className="image-admin-grid">
          {images.map((image) => <ImageCard image={image} onUpdate={updateImage} key={image.id} />)}
        </div>
      ) : null}
    </section>
  );
}
