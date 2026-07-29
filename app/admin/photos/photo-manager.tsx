"use client";

import {
  type CSSProperties,
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type Crop = { x: number; y: number; zoom: number };
type Aspect = "portrait" | "square" | "landscape";
type Photo = {
  id: string;
  titleEl: string;
  titleEn: string;
  beforeUrl: string;
  afterUrl: string;
  beforeCrop: Crop;
  afterCrop: Crop;
  aspect: Aspect;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
};

function previewStyle(crop: Crop): CSSProperties {
  return {
    objectPosition: `${crop.x}% ${crop.y}%`,
    transform: `scale(${crop.zoom})`,
  };
}

function clonePhoto(photo: Photo): Photo {
  return {
    ...photo,
    beforeCrop: { ...photo.beforeCrop },
    afterCrop: { ...photo.afterCrop },
  };
}

export default function PhotoManager() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const uploadForm = useRef<HTMLFormElement>(null);

  const loadPhotos = useCallback(async () => {
    const response = await fetch("/api/photos?scope=admin", { cache: "no-store" });
    const data = await response.json() as { photos?: Photo[]; error?: string };
    if (!response.ok) throw new Error(data.error ?? "Δεν ήταν δυνατή η φόρτωση.");
    setPhotos((data.photos ?? []).map(clonePhoto));
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/photos?scope=admin", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json() as { photos?: Photo[]; error?: string };
        if (!response.ok) throw new Error(data.error ?? "Δεν ήταν δυνατή η φόρτωση.");
        if (active) setPhotos((data.photos ?? []).map(clonePhoto));
      })
      .catch((error: Error) => {
        if (active) setMessage(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function updateLocal(id: string, update: (photo: Photo) => Photo) {
    setPhotos((current) => current.map((photo) => photo.id === id ? update(photo) : photo));
  }

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusyId("upload");
    setMessage("");
    const response = await fetch("/api/photos", {
      method: "POST",
      body: new FormData(event.currentTarget),
    });
    const data = await response.json() as { photo?: Photo; error?: string };
    if (!response.ok || !data.photo) {
      setMessage(data.error ?? "Η μεταφόρτωση απέτυχε.");
      setBusyId(null);
      return;
    }
    uploadForm.current?.reset();
    setPhotos((current) => [clonePhoto(data.photo as Photo), ...current]);
    setMessage("Το νέο ζεύγος φωτογραφιών αποθηκεύτηκε.");
    setBusyId(null);
  }

  async function save(photo: Photo) {
    setBusyId(photo.id);
    setMessage("");
    const response = await fetch(`/api/photos/${encodeURIComponent(photo.id)}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        titleEl: photo.titleEl,
        titleEn: photo.titleEn,
        beforeCrop: photo.beforeCrop,
        afterCrop: photo.afterCrop,
        aspect: photo.aspect,
        visible: photo.visible,
      }),
    });
    const data = await response.json() as { photo?: Photo; error?: string };
    if (!response.ok || !data.photo) {
      setMessage(data.error ?? "Οι αλλαγές δεν αποθηκεύτηκαν.");
    } else {
      updateLocal(photo.id, () => clonePhoto(data.photo as Photo));
      setMessage("Οι αλλαγές αποθηκεύτηκαν.");
    }
    setBusyId(null);
  }

  async function move(photo: Photo, action: "move-up" | "move-down") {
    setBusyId(photo.id);
    const response = await fetch(`/api/photos/${encodeURIComponent(photo.id)}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (response.ok) await loadPhotos();
    else setMessage("Η σειρά δεν άλλαξε.");
    setBusyId(null);
  }

  async function replace(photo: Photo, form: HTMLFormElement) {
    const formData = new FormData(form);
    if (!(formData.get("before") as File)?.size && !(formData.get("after") as File)?.size) {
      setMessage("Επιλέξτε τουλάχιστον μία νέα φωτογραφία.");
      return;
    }
    setBusyId(photo.id);
    setMessage("");
    const response = await fetch(`/api/photos/${encodeURIComponent(photo.id)}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json() as { photo?: Photo; error?: string };
    if (!response.ok || !data.photo) {
      setMessage(data.error ?? "Η αντικατάσταση απέτυχε.");
    } else {
      form.reset();
      updateLocal(photo.id, () => clonePhoto(data.photo as Photo));
      setMessage("Η φωτογραφία αντικαταστάθηκε.");
    }
    setBusyId(null);
  }

  async function remove(photo: Photo) {
    if (!window.confirm(`Να διαγραφεί οριστικά το ζεύγος «${photo.titleEl || "Χωρίς τίτλο"}»;`)) {
      return;
    }
    setBusyId(photo.id);
    const response = await fetch(`/api/photos/${encodeURIComponent(photo.id)}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setPhotos((current) => current.filter((item) => item.id !== photo.id));
      setMessage("Το ζεύγος φωτογραφιών διαγράφηκε.");
    } else {
      setMessage("Η διαγραφή απέτυχε.");
    }
    setBusyId(null);
  }

  return (
    <section className="photo-manager">
      <form className="photo-upload-card" ref={uploadForm} onSubmit={upload}>
        <div className="photo-upload-heading">
          <span className="photo-admin-step">02</span>
          <h2>Νέο αποτέλεσμα</h2>
          <p>JPG, PNG, WebP ή AVIF, έως 15 MB ανά φωτογραφία.</p>
        </div>
        <label className="photo-file-field">
          <span>Φωτογραφία Πριν</span>
          <input name="before" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required />
        </label>
        <label className="photo-file-field">
          <span>Φωτογραφία Μετά</span>
          <input name="after" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required />
        </label>
        <label>
          <span>Τίτλος στα Ελληνικά</span>
          <input name="titleEl" type="text" maxLength={120} placeholder="π.χ. Φυσικό hairline" required />
        </label>
        <label>
          <span>Τίτλος στα Αγγλικά</span>
          <input name="titleEn" type="text" maxLength={120} placeholder="e.g. Natural hairline" />
        </label>
        <label>
          <span>Αναλογία κάδρου</span>
          <select name="aspect" defaultValue="portrait">
            <option value="portrait">Κάθετο 4:5</option>
            <option value="square">Τετράγωνο 1:1</option>
            <option value="landscape">Οριζόντιο 16:9</option>
          </select>
        </label>
        <label className="photo-check-field">
          <input name="visible" type="checkbox" value="true" defaultChecked />
          <span>Δημοσίευση στο site</span>
        </label>
        <button className="button" disabled={busyId === "upload"} type="submit">
          {busyId === "upload" ? "Ανέβασμα…" : "Αποθήκευση αποτελέσματος"}
        </button>
      </form>

      {message && <p className="photo-admin-message" role="status">{message}</p>}

      <div className="photo-library-head">
        <div>
          <span className="photo-admin-step">03</span>
          <h2>Βιβλιοθήκη</h2>
        </div>
        <span>{photos.length} αποτελέσματα</span>
      </div>

      {loading ? (
        <p className="photo-admin-empty">Φόρτωση…</p>
      ) : photos.length === 0 ? (
        <p className="photo-admin-empty">Δεν υπάρχουν ακόμη φωτογραφίες.</p>
      ) : (
        <div className="photo-editor-list">
          {photos.map((photo, index) => (
            <article className="photo-editor-card" key={photo.id}>
              <div className={`photo-editor-previews aspect-${photo.aspect}`}>
                <figure>
                  <div><img src={photo.beforeUrl} alt="" style={previewStyle(photo.beforeCrop)} /></div>
                  <figcaption>ΠΡΙΝ</figcaption>
                </figure>
                <figure>
                  <div><img src={photo.afterUrl} alt="" style={previewStyle(photo.afterCrop)} /></div>
                  <figcaption>ΜΕΤΑ</figcaption>
                </figure>
              </div>

              <div className="photo-editor-controls">
                <div className="photo-editor-topline">
                  <span>#{String(index + 1).padStart(2, "0")}</span>
                  <span className={photo.visible ? "is-published" : "is-hidden"}>
                    {photo.visible ? "Δημοσιευμένο" : "Κρυφό"}
                  </span>
                </div>

                <div className="photo-editor-fields">
                  <label>
                    <span>Ελληνικός τίτλος</span>
                    <input value={photo.titleEl} onChange={(event) => updateLocal(photo.id, (item) => ({ ...item, titleEl: event.target.value }))} />
                  </label>
                  <label>
                    <span>Αγγλικός τίτλος</span>
                    <input value={photo.titleEn} onChange={(event) => updateLocal(photo.id, (item) => ({ ...item, titleEn: event.target.value }))} />
                  </label>
                  <label>
                    <span>Αναλογία</span>
                    <select value={photo.aspect} onChange={(event) => updateLocal(photo.id, (item) => ({ ...item, aspect: event.target.value as Aspect }))}>
                      <option value="portrait">Κάθετο 4:5</option>
                      <option value="square">Τετράγωνο 1:1</option>
                      <option value="landscape">Οριζόντιο 16:9</option>
                    </select>
                  </label>
                  <label className="photo-check-field">
                    <input type="checkbox" checked={photo.visible} onChange={(event) => updateLocal(photo.id, (item) => ({ ...item, visible: event.target.checked }))} />
                    <span>Εμφάνιση στο site</span>
                  </label>
                </div>

                <div className="photo-crop-columns">
                  {(["before", "after"] as const).map((side) => {
                    const cropKey = side === "before" ? "beforeCrop" : "afterCrop";
                    const crop = photo[cropKey];
                    const setCrop = (field: keyof Crop, value: number) => updateLocal(photo.id, (item) => ({
                      ...item,
                      [cropKey]: { ...item[cropKey], [field]: value },
                    }));
                    return (
                      <fieldset key={side}>
                        <legend>{side === "before" ? "Κάδρο Πριν" : "Κάδρο Μετά"}</legend>
                        <label><span>Zoom</span><input type="range" min="1" max="2.5" step=".01" value={crop.zoom} onChange={(event) => setCrop("zoom", Number(event.target.value))} /></label>
                        <label><span>Οριζόντια θέση</span><input type="range" min="0" max="100" value={crop.x} onChange={(event) => setCrop("x", Number(event.target.value))} /></label>
                        <label><span>Κάθετη θέση</span><input type="range" min="0" max="100" value={crop.y} onChange={(event) => setCrop("y", Number(event.target.value))} /></label>
                      </fieldset>
                    );
                  })}
                </div>

                <form className="photo-replace-form" onSubmit={(event) => {
                  event.preventDefault();
                  void replace(photo, event.currentTarget);
                }}>
                  <label><span>Νέο Πριν (προαιρετικό)</span><input name="before" type="file" accept="image/jpeg,image/png,image/webp,image/avif" /></label>
                  <label><span>Νέο Μετά (προαιρετικό)</span><input name="after" type="file" accept="image/jpeg,image/png,image/webp,image/avif" /></label>
                  <button type="submit" disabled={busyId === photo.id}>Αντικατάσταση</button>
                </form>

                <div className="photo-editor-actions">
                  <button type="button" onClick={() => void move(photo, "move-up")} disabled={index === 0 || busyId === photo.id}>↑ Πάνω</button>
                  <button type="button" onClick={() => void move(photo, "move-down")} disabled={index === photos.length - 1 || busyId === photo.id}>↓ Κάτω</button>
                  <button className="photo-save-button" type="button" onClick={() => void save(photo)} disabled={busyId === photo.id}>
                    {busyId === photo.id ? "Αποθήκευση…" : "Αποθήκευση αλλαγών"}
                  </button>
                  <button className="photo-delete-button" type="button" onClick={() => void remove(photo)} disabled={busyId === photo.id}>Διαγραφή</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
