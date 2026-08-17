import { useCallback, useEffect, useState } from "react";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { DEFAULT_CONTENT, PortfolioContent } from "../data/portfolio";

export const CONTENT_DOC_ID = "portfolio";
const LOCAL_KEY = "portfolio_content_v1";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Deep-merge `override` over `base`. Arrays & primitives are replaced, plain objects are merged. */
export function deepMerge<T>(base: T, override: unknown): T {
  if (isPlainObject(base) && isPlainObject(override)) {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const key of Object.keys(override)) {
      out[key] = deepMerge(out[key], override[key]);
    }
    return out as T;
  }
  return (override === undefined ? base : override) as T;
}

async function loadFromDb(): Promise<PortfolioContent | null> {
  try {
    const ref = doc(db, "content", CONTENT_DOC_ID);
    const snap = await getDoc(ref);
    if (snap.exists()) return snap.data() as PortfolioContent;
    return null;
  } catch {
    return null;
  }
}

function loadFromLocal(): PortfolioContent | null {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PortfolioContent;
  } catch {
    return null;
  }
}

function saveToLocal(content: PortfolioContent) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(content));
  } catch {
    /* storage full / unavailable — ignore */
  }
}

export interface SaveResult {
  online: boolean;
  error?: string;
}

async function saveToDb(content: PortfolioContent): Promise<SaveResult> {
  saveToLocal(content);
  try {
    await setDoc(doc(db, "content", CONTENT_DOC_ID), content as unknown as Record<string, unknown>);
    return { online: true };
  } catch (err) {
    console.error("Firestore save failed:", err);
    return { online: false, error: "Gagal menyimpan ke Firestore. Perubahan hanya tersimpan di browser ini." };
  }
}

async function resetFromDb(): Promise<SaveResult> {
  try {
    localStorage.removeItem(LOCAL_KEY);
    await deleteDoc(doc(db, "content", CONTENT_DOC_ID));
    return { online: true };
  } catch (err) {
    console.error("Firestore reset failed:", err);
    return { online: false, error: "Gagal reset di Firestore. Data lokal sudah dihapus." };
  }
}

export function usePortfolioContent() {
  const [content, setContent] = useState<PortfolioContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const remote = await loadFromDb();
      if (cancelled) return;
      if (remote) {
        setContent(deepMerge(DEFAULT_CONTENT, remote));
        setOnline(true);
      } else {
        const local = loadFromLocal();
        if (local) setContent(deepMerge(DEFAULT_CONTENT, local));
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const save = useCallback(async (next: PortfolioContent): Promise<SaveResult> => {
    const merged = deepMerge(DEFAULT_CONTENT, next);
    const result = await saveToDb(merged);
    setContent(merged);
    setOnline(result.online);
    return result;
  }, []);

  const reset = useCallback(async (): Promise<SaveResult> => {
    const result = await resetFromDb();
    setContent(DEFAULT_CONTENT);
    setOnline(false);
    return result;
  }, []);

  return { content, loading, online, save, reset };
}
