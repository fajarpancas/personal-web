import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

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

export default function AddAddress() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [uniqueCode, setUniqueCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const code = generateCode();
    try {
      await addDoc(collection(db, "addresses"), {
        ...form,
        uniqueCode: code,
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

        {error && (
          <div className="add-address-alert error">{error}</div>
        )}

        <form className="add-address-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Nama Lengkap</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Nama lengkap"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="whatsapp">No. WhatsApp</label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              placeholder="08xxxxxxxxxx"
              value={form.whatsapp}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="jalan">Alamat Jalan / Detail</label>
            <input
              id="jalan"
              name="jalan"
              type="text"
              placeholder="Nama jalan, nomor rumah, blok, dll."
              value={form.jalan}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-address-row">
            <div className="field">
              <label htmlFor="rt">RT</label>
              <input
                id="rt"
                name="rt"
                type="text"
                placeholder="001"
                value={form.rt}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="rw">RW</label>
              <input
                id="rw"
                name="rw"
                type="text"
                placeholder="002"
                value={form.rw}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="kelurahan">Kelurahan</label>
            <input
              id="kelurahan"
              name="kelurahan"
              type="text"
              placeholder="Nama kelurahan"
              value={form.kelurahan}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="kecamatan">Kecamatan</label>
            <input
              id="kecamatan"
              name="kecamatan"
              type="text"
              placeholder="Nama kecamatan"
              value={form.kecamatan}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-address-row">
            <div className="field">
              <label htmlFor="provinsi">Provinsi</label>
              <input
                id="provinsi"
                name="provinsi"
                type="text"
                placeholder="Nama provinsi"
                value={form.provinsi}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="kodePos">Kode Pos</label>
              <input
                id="kodePos"
                name="kodePos"
                type="text"
                inputMode="numeric"
                placeholder="12345"
                value={form.kodePos}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn primary add-address-submit"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan Alamat"}
          </button>
        </form>
      </div>
    </div>
  );
}
