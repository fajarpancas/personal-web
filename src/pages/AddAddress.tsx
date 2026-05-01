import { useEffect, useRef, useState } from "react";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { getDeviceId } from "../utils/deviceId";

interface FormState {
  name: string;
  whatsapp: string;
  jalan: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  provinsi: string;
  kodePos: string;
}

const initialForm: FormState = {
  name: "",
  whatsapp: "",
  jalan: "",
  rt: "",
  rw: "",
  kelurahan: "",
  kecamatan: "",
  provinsi: "",
  kodePos: "",
};

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function generateCode(): string {
  return Array.from({ length: 10 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");
}

const BLOCK_MS = 10 * 60 * 1000; // 10 minutes

export default function AddAddress() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [uniqueCode, setUniqueCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0); // seconds remaining
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  function startCountdown(remainingMs: number) {
    setCountdown(Math.ceil(remainingMs / 1000));
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const deviceId = await getDeviceId();

      // Check recent submissions from this device
      const q = query(collection(db, "addresses"), where("deviceId", "==", deviceId));
      const snapshot = await getDocs(q);
      const tenMinAgo = Date.now() - BLOCK_MS;

      const recentDoc = snapshot.docs
        .map((d) => ({ ...d.data(), id: d.id }))
        .filter((d: any) => d.createdAt?.seconds && d.createdAt.seconds * 1000 > tenMinAgo)
        .sort((a: any, b: any) => b.createdAt.seconds - a.createdAt.seconds)[0] as any;

      if (recentDoc) {
        const submittedAt = recentDoc.createdAt.seconds * 1000;
        const blockedUntil = submittedAt + BLOCK_MS;
        const remainingMs = blockedUntil - Date.now();
        startCountdown(remainingMs);
        setError("block");
        setLoading(false);
        return;
      }

      const code = generateCode();
      await addDoc(collection(db, "addresses"), {
        ...form,
        uniqueCode: code,
        deviceId,
        createdAt: serverTimestamp(),
      });
      setUniqueCode(code);
      setForm(initialForm);
    } catch (err) {
      setError("Gagal menyimpan data. Silakan coba lagi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!uniqueCode) return;
    await navigator.clipboard.writeText(uniqueCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCloseModal() {
    setUniqueCode(null);
    setCopied(false);
  }

  const isBlocked = error === "block" && countdown > 0;
  const mm = String(Math.floor(countdown / 60)).padStart(2, "0");
  const ss = String(countdown % 60).padStart(2, "0");

  return (
    <div className="add-address-page">
      {uniqueCode && (
        <div className="code-modal-overlay" onClick={handleCloseModal}>
          <div className="code-modal" onClick={(e) => e.stopPropagation()}>
            <div className="code-modal-icon">✓</div>
            <h2 className="code-modal-title">Alamat Tersimpan!</h2>
            <p className="code-modal-subtitle">Simpan kode unik ini sebagai referensi alamatmu</p>
            <div className="code-modal-code-wrap">
              <span className="code-modal-code">{uniqueCode}</span>
              <button className="code-modal-copy" onClick={handleCopy}>
                {copied ? "Tersalin!" : "Salin"}
              </button>
            </div>
            <button className="btn primary code-modal-close" onClick={handleCloseModal}>
              Selesai
            </button>
          </div>
        </div>
      )}

      <div className="add-address-card">
        <h1 className="add-address-title">Tambah Alamat</h1>
        <p className="add-address-subtitle">Isi data diri dan alamat lengkap kamu</p>

        {isBlocked && (
          <div className="add-address-alert block">
            <svg viewBox="0 0 20 20" fill="none" width="18" height="18" style={{flexShrink:0}}>
              <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 6v4.5M10 13.5v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span>Perangkat ini diblokir sementara. Coba lagi dalam <strong>{mm}:{ss}</strong></span>
          </div>
        )}
        {!isBlocked && error && error !== "block" && (
          <div className="add-address-alert error">{error}</div>
        )}

        <form className="add-address-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Nama Lengkap</label>
            <input id="name" name="name" type="text" placeholder="Nama lengkap"
              value={form.name} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="whatsapp">No. WhatsApp</label>
            <input id="whatsapp" name="whatsapp" type="tel" placeholder="08xxxxxxxxxx"
              value={form.whatsapp} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="jalan">Alamat Jalan / Detail</label>
            <input id="jalan" name="jalan" type="text" placeholder="Nama jalan, nomor rumah, blok, dll."
              value={form.jalan} onChange={handleChange} required />
          </div>

          <div className="add-address-row">
            <div className="field">
              <label htmlFor="rt">RT</label>
              <input id="rt" name="rt" type="text" placeholder="001"
                value={form.rt} onChange={handleChange} required />
            </div>
            <div className="field">
              <label htmlFor="rw">RW</label>
              <input id="rw" name="rw" type="text" placeholder="002"
                value={form.rw} onChange={handleChange} required />
            </div>
          </div>

          <div className="field">
            <label htmlFor="kelurahan">Kelurahan</label>
            <input id="kelurahan" name="kelurahan" type="text" placeholder="Nama kelurahan"
              value={form.kelurahan} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="kecamatan">Kecamatan</label>
            <input id="kecamatan" name="kecamatan" type="text" placeholder="Nama kecamatan"
              value={form.kecamatan} onChange={handleChange} required />
          </div>

          <div className="add-address-row">
            <div className="field">
              <label htmlFor="provinsi">Provinsi</label>
              <input id="provinsi" name="provinsi" type="text" placeholder="Nama provinsi"
                value={form.provinsi} onChange={handleChange} required />
            </div>
            <div className="field">
              <label htmlFor="kodePos">Kode Pos</label>
              <input id="kodePos" name="kodePos" type="text" inputMode="numeric" placeholder="12345"
                value={form.kodePos} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="btn primary add-address-submit"
            disabled={loading || isBlocked}>
            {loading ? "Menyimpan..." : isBlocked ? `Tunggu ${mm}:${ss}` : "Simpan Alamat"}
          </button>
        </form>
      </div>
    </div>
  );
}
