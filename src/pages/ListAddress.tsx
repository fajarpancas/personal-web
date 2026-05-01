import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

function buildFullText(addr: Address): string {
  return `Nama: ${addr.name} (${addr.whatsapp})\nAlamat: ${addr.jalan}, RT ${addr.rt}/RW ${addr.rw}, Kel. ${addr.kelurahan}, Kec. ${addr.kecamatan}, ${addr.provinsi} ${addr.kodePos}`;
}

interface Address {
  id: string;
  name: string;
  whatsapp: string;
  uniqueCode?: string;
  jalan: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  provinsi: string;
  kodePos: string;
  createdAt?: { seconds: number };
}

export default function ListAddress() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCopy(addr: Address) {
    await navigator.clipboard.writeText(buildFullText(addr));
    setCopiedId(addr.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  useEffect(() => {
    async function fetchAddresses() {
      try {
        const q = query(collection(db, "addresses"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setAddresses(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Address))
        );
      } catch (err) {
        setError("Gagal memuat data alamat.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAddresses();
  }, []);

  const filtered = search.trim()
    ? addresses.filter((a) =>
        a.uniqueCode?.toUpperCase().includes(search.trim().toUpperCase())
      )
    : addresses;

  return (
    <div className="list-address-page">
      <div className="list-address-header">
        <h1 className="list-address-title">Daftar Alamat</h1>
        <a href="/add-address" className="btn primary list-address-add-btn">+ Tambah</a>
      </div>

      <div className="list-address-search-wrap">
        <svg className="list-address-search-icon" viewBox="0 0 20 20" fill="none">
          <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.6"/>
          <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
        <input
          className="list-address-search"
          type="text"
          placeholder="Cari kode unik..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxLength={10}
        />
        {search && (
          <button className="list-address-search-clear" onClick={() => setSearch("")}>✕</button>
        )}
      </div>

      {loading && <p className="list-address-state">Memuat data...</p>}
      {error && <p className="list-address-state error">{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="list-address-state">
          {search ? `Kode "${search.toUpperCase()}" tidak ditemukan.` : "Belum ada alamat tersimpan."}
        </p>
      )}

      <div className="list-address-grid">
        {filtered.map((addr) => (
          <div key={addr.id} className="address-card">
            <div className="address-card-header">
              <span className="address-card-name">{addr.name}</span>
              <a
                href={`https://wa.me/${addr.whatsapp.replace(/^0/, "62").replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="address-card-wa"
              >
                {addr.whatsapp}
              </a>
            </div>
            <div className="address-card-meta">
              {addr.uniqueCode && (
                <span className="address-card-code">{addr.uniqueCode}</span>
              )}
              <button
                className={`address-card-copy${copiedId === addr.id ? " copied" : ""}`}
                onClick={() => handleCopy(addr)}
              >
                {copiedId === addr.id ? (
                  <>
                    <svg viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Tersalin
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="8" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 5V4a1.5 1.5 0 0 0-1.5-1.5h-6A1.5 1.5 0 0 0 2 4v7A1.5 1.5 0 0 0 3.5 12.5H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    Salin
                  </>
                )}
              </button>
            </div>
            <p className="address-card-detail">
              {addr.jalan}, RT {addr.rt}/RW {addr.rw}, Kel. {addr.kelurahan},{" "}
              Kec. {addr.kecamatan}, {addr.provinsi} {addr.kodePos}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
