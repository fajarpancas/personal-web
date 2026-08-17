import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

export interface UploadResult {
  url: string;
  /** "storage" = Firebase Storage URL · "firestore" = base64 data URL in the content doc */
  mode: "storage" | "firestore";
}

/**
 * Upload an image from the admin panel — no paid plan required.
 *
 * 1. Compresses the image in the browser (max 720px, JPEG) so it stays small.
 * 2. Tries Firebase Storage first (needs the Blaze plan; may not be enabled).
 * 3. Falls back to a base64 data URL stored inside the Firestore content doc,
 *    which works on the free Spark plan with zero extra setup.
 */
export async function uploadImage(file: File, folder: string): Promise<UploadResult> {
  const dataUrl = await compressImage(file, 720, 0.72);
  try {
    const url = await uploadToStorageWithTimeout(file, folder, 6000);
    return { url, mode: "storage" };
  } catch {
    return { url: dataUrl, mode: "firestore" };
  }
}

async function uploadToStorageWithTimeout(file: File, folder: string, ms: number): Promise<string> {
  const dot = file.name.lastIndexOf(".");
  const ext = dot >= 0 ? file.name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "png";
  const base = file.name.slice(0, dot).replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 40) || "image";
  const path = `${folder}/${Date.now()}-${base}.${ext || "png"}`;

  const storageRef = ref(storage, path);
  const upload = (async () => {
    await uploadBytes(storageRef, file, { contentType: file.type || "image/png" });
    return getDownloadURL(storageRef);
  })();
  // Storage may be disabled (Blaze required) — fail fast so the Firestore
  // fallback kicks in instead of hanging on SDK retries.
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("storage timeout")), ms)
  );
  return Promise.race([upload, timeout]);
}

function compressImage(file: File, maxDim: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("canvas tidak tersedia");
        // Fill transparent PNG areas with the site's dark bg instead of black
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        const out = canvas.toDataURL("image/jpeg", quality);
        if (out.length > 900_000) throw new Error("gambar terlalu besar setelah kompresi");
        resolve(out);
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("file bukan gambar yang valid"));
    };
    img.src = objectUrl;
  });
}
