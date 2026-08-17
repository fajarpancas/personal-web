import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { auth } from "../firebase";
import { deepMerge, usePortfolioContent } from "../lib/content";
import { uploadImage } from "../lib/upload";
import { DEFAULT_CONTENT, PortfolioContent, Project, Experience, Stat } from "../data/portfolio";

type TabId = "general" | "hero" | "stats" | "skills" | "experience" | "projects" | "contact" | "settings";

const TABS: { id: TabId; label: string }[] = [
  { id: "general", label: "Umum" },
  { id: "hero", label: "Hero" },
  { id: "stats", label: "Stats" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Pengalaman" },
  { id: "projects", label: "Proyek" },
  { id: "contact", label: "Kontak" },
  { id: "settings", label: "Pengaturan" },
];

export default function Admin() {
  const { content, loading, online, save, reset } = usePortfolioContent();
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [draft, setDraft] = useState<PortfolioContent>(content);
  const [tab, setTab] = useState<TabId>("general");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "ok" | "warn"; text: string } | null>(null);
  const [savedJson, setSavedJson] = useState("");
  const bootstrapped = useRef(false);

  // Track Firebase Auth session (persists across refreshes automatically)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return unsub;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      /* ignore */
    }
  };

  // Sync draft once remote content finishes loading
  useEffect(() => {
    if (!loading && !bootstrapped.current) {
      bootstrapped.current = true;
      setDraft(content);
      setSavedJson(JSON.stringify(content));
    }
  }, [loading, content]);

  const dirty = JSON.stringify(draft) !== savedJson;

  /* ── updaters ─────────────────────────── */
  const patch = (p: Partial<PortfolioContent>) => setDraft((d) => ({ ...d, ...p }));
  const patchHero = (p: Partial<PortfolioContent["hero"]>) =>
    setDraft((d) => ({ ...d, hero: { ...d.hero, ...p } }));
  const patchAbout = (p: Partial<PortfolioContent["about"]>) =>
    setDraft((d) => ({ ...d, about: { ...d.about, ...p } }));
  const patchContact = (p: Partial<PortfolioContent["contact"]>) =>
    setDraft((d) => ({ ...d, contact: { ...d.contact, ...p } }));

  const setStat = (i: number, p: Partial<Stat>) =>
    setDraft((d) => ({ ...d, stats: d.stats.map((s, idx) => (idx === i ? { ...s, ...p } : s)) }));
  const addStat = () =>
    setDraft((d) => ({ ...d, stats: [...d.stats, { value: 0, label: "Stat Baru" }] }));
  const removeStat = (i: number) =>
    setDraft((d) => ({ ...d, stats: d.stats.filter((_, idx) => idx !== i) }));

  const setExp = (i: number, p: Partial<Experience>) =>
    setDraft((d) => ({
      ...d,
      experiences: d.experiences.map((e, idx) => (idx === i ? { ...e, ...p } : e)),
    }));
  const moveExp = (i: number, dir: -1 | 1) =>
    setDraft((d) => {
      const arr = [...d.experiences];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return d;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...d, experiences: arr };
    });
  const addExp = () =>
    setDraft((d) => ({
      ...d,
      experiences: [
        ...d.experiences,
        { company: "Perusahaan Baru", initial: "PB", badge: "1 app", desc: "", roles: [], tags: [] },
      ],
    }));
  const removeExp = (i: number) =>
    setDraft((d) => ({ ...d, experiences: d.experiences.filter((_, idx) => idx !== i) }));
  const setRole = (expI: number, roleI: number, p: Partial<Experience["roles"][number]>) =>
    setDraft((d) => ({
      ...d,
      experiences: d.experiences.map((e, idx) =>
        idx === expI
          ? { ...e, roles: e.roles.map((r, rIdx) => (rIdx === roleI ? { ...r, ...p } : r)) }
          : e
      ),
    }));
  const addRole = (expI: number) =>
    setDraft((d) => ({
      ...d,
      experiences: d.experiences.map((e, idx) =>
        idx === expI
          ? { ...e, roles: [...e.roles, { type: "Full-time", period: "" }] }
          : e
      ),
    }));
  const removeRole = (expI: number, roleI: number) =>
    setDraft((d) => ({
      ...d,
      experiences: d.experiences.map((e, idx) =>
        idx === expI ? { ...e, roles: e.roles.filter((_, rIdx) => rIdx !== roleI) } : e
      ),
    }));

  const setProject = (i: number, p: Partial<Project>) =>
    setDraft((d) => ({
      ...d,
      projects: d.projects.map((pr, idx) => (idx === i ? { ...pr, ...p } : pr)),
    }));
  const moveProject = (i: number, dir: -1 | 1) =>
    setDraft((d) => {
      const arr = [...d.projects];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return d;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...d, projects: arr };
    });
  const addProject = () =>
    setDraft((d) => ({
      ...d,
      projects: [
        ...d.projects,
        { title: "Proyek Baru", desc: "", img: "", tags: [], appStore: "", playStore: "" },
      ],
    }));
  const removeProject = (i: number) =>
    setDraft((d) => ({ ...d, projects: d.projects.filter((_, idx) => idx !== i) }));

  const resetSection = (key: keyof PortfolioContent, label: string) => {
    if (!window.confirm(`Reset bagian "${label}" ke bawaan?`)) return;
    setDraft((d) => ({ ...d, [key]: DEFAULT_CONTENT[key] }));
  };

  const onSave = async () => {
    const size = new Blob([JSON.stringify(draft)]).size;
    if (size > 1_000_000) {
      setStatus({ kind: "warn", text: `Konten ${(size / 1e6).toFixed(1)}MB melebihi batas 1MB Firestore — upload gambar yang lebih kecil/ringkas.` });
      window.setTimeout(() => setStatus(null), 7000);
      return;
    }
    setSaving(true);
    const res = await save(draft);
    setSaving(false);
    setSavedJson(JSON.stringify(draft));
    setStatus(
      res.online
        ? { kind: "ok", text: "Tersimpan ke Firestore — semua pengunjung akan melihat perubahan." }
        : { kind: "warn", text: res.error || "Tersimpan di browser ini saja." }
    );
    window.setTimeout(() => setStatus(null), 4000);
  };

  const onResetAll = async () => {
    if (!window.confirm("Reset SEMUA konten ke bawaan dan hapus data dari Firestore?")) return;
    await reset();
    setDraft(DEFAULT_CONTENT);
    setSavedJson(JSON.stringify(DEFAULT_CONTENT));
    setStatus({ kind: "ok", text: "Semua konten di-reset ke bawaan." });
    window.setTimeout(() => setStatus(null), 4000);
  };

  if (!authReady) {
    return (
      <div className="admin-gate">
        <div className="admin-gate-card">
          <div className="admin-gate-icon">🔐</div>
          <h1>Admin Panel</h1>
          <p>Memuat status login...</p>
        </div>
      </div>
    );
  }
  if (!user) {
    return <AuthGate />;
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <p className="section-eyebrow">Admin Panel</p>
          <h1>Kelola Konten Portofolio</h1>
          <p className="admin-subtitle">
            Perubahan tersimpan di Firestore dan langsung tampil di website.
          </p>
        </div>
        <div className="admin-header-actions">
          <a href="/" className="btn">Lihat Situs →</a>
          <button className="btn" onClick={handleLogout} title="Keluar dari admin">
            Keluar ({user.email})
          </button>
        </div>
      </header>

      {!online && (
        <div className="admin-banner warn">
          Mode offline — perubahan hanya tersimpan di browser ini (tidak sinkron ke pengunjung lain).
        </div>
      )}

      <nav className="admin-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`admin-tab${tab === t.id ? " active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="admin-panel">
        {tab === "general" && (
          <GeneralTab draft={draft} patchAbout={patchAbout} patch={patch} onReset={() => resetSection("about", "Umum")} />
        )}
        {tab === "hero" && (
          <HeroTab draft={draft} patchHero={patchHero} onReset={() => resetSection("hero", "Hero")} />
        )}
        {tab === "stats" && (
          <StatsTab draft={draft} setStat={setStat} addStat={addStat} removeStat={removeStat} onReset={() => resetSection("stats", "Stats")} />
        )}
        {tab === "skills" && (
          <SkillsTab draft={draft} patch={patch} onReset={() => resetSection("skills", "Skills")} />
        )}
        {tab === "experience" && (
          <ExperienceTab
            draft={draft}
            setExp={setExp}
            moveExp={moveExp}
            addExp={addExp}
            removeExp={removeExp}
            setRole={setRole}
            addRole={addRole}
            removeRole={removeRole}
            onReset={() => resetSection("experiences", "Pengalaman")}
          />
        )}
        {tab === "projects" && (
          <ProjectsTab
            draft={draft}
            setProject={setProject}
            moveProject={moveProject}
            addProject={addProject}
            removeProject={removeProject}
            onReset={() => resetSection("projects", "Proyek")}
          />
        )}
        {tab === "contact" && (
          <ContactTab draft={draft} patchContact={patchContact} onReset={() => resetSection("contact", "Kontak")} />
        )}
        {tab === "settings" && (
          <SettingsTab
            draft={draft}
            email={user.email || ""}
            onLogout={handleLogout}
            onImport={(parsed) => {
              setDraft((d) => deepMerge(d, parsed));
              setSavedJson(""); // force dirty state so user must press Save
              setStatus({ kind: "ok", text: "Konten dari JSON dimuat ke draft — tekan Simpan Perubahan untuk menerapkan." });
              window.setTimeout(() => setStatus(null), 5000);
            }}
          />
        )}
      </div>

      <div className="admin-savebar">
        <div className="admin-savebar-status">
          {status ? (
            <span className={`admin-status-pill ${status.kind}`}>{status.text}</span>
          ) : (
            <span className="admin-status-pill neutral">
              {dirty ? "Ada perubahan yang belum disimpan" : "Semua perubahan sudah tersimpan"}
            </span>
          )}
        </div>
        <div className="admin-savebar-actions">
          <button className="btn" onClick={onResetAll} disabled={saving}>
            Reset Semua
          </button>
          <button className="btn primary" onClick={onSave} disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Auth gate (Firebase email/password) ──────────────── */

function AuthGate() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{ kind: "err" | "warn"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      const code = (err as { code?: string })?.code || "";
      const msg = (err as { message?: string })?.message || "";
      if (
        code === "auth/operation-not-allowed" ||
        code === "auth/configuration-not-found" ||
        msg.includes("CONFIGURATION_NOT_FOUND")
      ) {
        setError({
          kind: "warn",
          text: "Auth email/password belum aktif di project ini (twinsalib). Cek di console: pojok kiri atas harus 'twinsalib' → Authentication → Sign-in method → Email/Password → aktifkan (Enabled) → Save.",
        });
      } else if (code === "auth/invalid-credential" || code === "auth/user-not-found" || code === "auth/wrong-password") {
        setError({ kind: "err", text: "Email atau password salah." });
      } else if (code === "auth/network-request-failed") {
        setError({ kind: "err", text: "Tidak ada koneksi internet — coba lagi." });
      } else if (code === "auth/invalid-email") {
        setError({ kind: "err", text: "Format email tidak valid." });
      } else {
        setError({ kind: "err", text: `Gagal masuk (${code || "unknown"}): ${msg.slice(0, 160)}` });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-gate">
      <div className="admin-gate-card">
        <div className="admin-gate-icon">🔐</div>
        <h1>Admin Panel</h1>
        <p>Masuk dengan akun admin untuk mengelola konten website.</p>
        <form onSubmit={submit} className="admin-gate-form">
          <input
            type="email"
            className="admin-input"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            placeholder="Email"
            autoComplete="username"
            autoFocus
            aria-label="Email"
          />
          <input
            type="password"
            className="admin-input"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            placeholder="Password"
            autoComplete="current-password"
            aria-label="Password"
          />
          {error && <span className={`admin-gate-error ${error.kind}`}>{error.text}</span>}
          <button type="submit" className="btn primary admin-gate-btn" disabled={busy}>
            {busy ? "Masuk..." : "Masuk"}
          </button>
        </form>
        <p className="admin-gate-hint">
          Akun dibuat di Firebase console → Authentication → Users → Add user.
        </p>
      </div>
    </div>
  );
}

/* ── Upload error helper ──────────────────────────────── */

function friendlyUploadError(e: unknown): string {
  const err = e as { code?: string; message?: string };
  const code = err.code || "";
  const msg = err.message || String(e);
  if (code.includes("unauthorized") || code.includes("unauthenticated")) {
    return `Upload ditolak Storage rules (${code}). Aktifkan mode test di Firebase console → Storage, atau deploy storage.rules.`;
  }
  if (code.includes("not-found") || /404/.test(msg)) {
    return `Storage belum aktif di Firebase console (404). Buka console → Storage → Get started.`;
  }
  if (/quota|capacity|quota_exceeded/i.test(msg)) {
    return "Kuota penyimpanan habis — cek Firebase console → Storage.";
  }
  return `Upload gagal (${code || "unknown"}): ${msg.slice(0, 180)}`;
}

/* ── Shared form primitives ───────────────────────────── */

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="admin-field">
      <span className="admin-field-label">{label}</span>
      {hint && <span className="admin-field-hint">{hint}</span>}
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      className="admin-input"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function TextArea({
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      className="admin-input"
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function parseTags(v: string): string[] {
  return v
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function TagsInput({ value, onChange }: { value: string[]; onChange: (tags: string[]) => void }) {
  return (
    <TextInput value={value.join(", ")} onChange={(v) => onChange(parseTags(v))} placeholder="pisahkan dengan koma" />
  );
}

function ImageField({
  label,
  hint,
  value,
  onChange,
  folder,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  folder: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const upload = async (file: File) => {
    setBusy(true);
    setErr(null);
    setNote(null);
    try {
      const res = await uploadImage(file, folder);
      onChange(res.url);
      setNote(
        res.mode === "storage"
          ? "✓ Tersimpan di Firebase Storage."
          : "✓ Tersimpan di Firestore (gratis) — gambar dikompres otomatis."
      );
    } catch (e) {
      setErr(friendlyUploadError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Field label={label} hint={hint}>
      <div className="admin-image-row">
        <TextInput value={value} onChange={onChange} placeholder="/nama-file.png" />
        <button
          type="button"
          className="btn admin-upload-btn"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
        >
          {busy ? "⏳ Mengunggah..." : "⬆ Upload"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
      </div>
      {note && <span className="admin-upload-note">{note}</span>}
      {err && <span className="admin-msg err">{err}</span>}
      {value && (
        <div className="admin-thumb">
          <img
            src={value}
            alt="preview"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
    </Field>
  );
}

function SectionCard({
  title,
  onReset,
  children,
}: {
  title: string;
  onReset?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-section">
      <div className="admin-section-head">
        <h2>{title}</h2>
        {onReset && (
          <button className="admin-reset" onClick={onReset}>Reset bagian ini</button>
        )}
      </div>
      {children}
    </div>
  );
}

/* ── General tab ──────────────────────────────────────── */

function GeneralTab({
  draft,
  patchAbout,
  patch,
  onReset,
}: {
  draft: PortfolioContent;
  patchAbout: (p: Partial<PortfolioContent["about"]>) => void;
  patch: (p: Partial<PortfolioContent>) => void;
  onReset: () => void;
}) {
  return (
    <SectionCard title="Teks Umum" onReset={onReset}>
      <div className="admin-grid">
        <Field label="Eyebrow section Career">
          <TextInput value={draft.about.eyebrow} onChange={(v) => patchAbout({ eyebrow: v })} />
        </Field>
        <Field label="Judul section Career">
          <TextInput value={draft.about.title} onChange={(v) => patchAbout({ title: v })} />
        </Field>
        <Field label="Paragraf intro Career" hint="Tampil di bawah judul Work Experiences">
          <TextArea value={draft.about.intro} onChange={(v) => patchAbout({ intro: v })} />
        </Field>
        <Field label="Eyebrow section Projects">
          <TextInput value={draft.projectsEyebrow} onChange={(v) => patch({ projectsEyebrow: v })} />
        </Field>
        <Field label="Judul section Projects">
          <TextInput value={draft.projectsTitle} onChange={(v) => patch({ projectsTitle: v })} />
        </Field>
        <Field label="Teks footer" hint="Gunakan {year} untuk tahun berjalan">
          <TextInput value={draft.footer} onChange={(v) => patch({ footer: v })} />
        </Field>
      </div>
    </SectionCard>
  );
}

/* ── Hero tab ─────────────────────────────────────────── */

function HeroTab({
  draft,
  patchHero,
  onReset,
}: {
  draft: PortfolioContent;
  patchHero: (p: Partial<PortfolioContent["hero"]>) => void;
  onReset: () => void;
}) {
  const h = draft.hero;
  return (
    <SectionCard title="Hero" onReset={onReset}>
      <div className="admin-grid">
        <Field label="Nama">
          <TextInput value={h.name} onChange={(v) => patchHero({ name: v })} />
        </Field>
        <ImageField
          label="Foto profil"
          hint="Upload otomatis dikompres & gratis (Firestore). Bisa juga isi path manual, mis. /profile.png"
          value={h.profileImg}
          onChange={(v) => patchHero({ profileImg: v })}
          folder="profile"
        />
        <Field label="Role typewriter" hint="Satu per baris, diputar bergantian">
          <TextArea value={h.roles.join("\n")} onChange={(v) => patchHero({ roles: v.split("\n").map((s) => s.trim()).filter(Boolean) })} rows={3} />
        </Field>
        <Field label="Bio hero">
          <TextArea value={h.bio} onChange={(v) => patchHero({ bio: v })} />
        </Field>
        <Field label="Teks tombol CTA">
          <TextInput value={h.cta} onChange={(v) => patchHero({ cta: v })} />
        </Field>
        <Field label="Badge melayang — ikon">
          <TextInput value={h.floatBadge.icon} onChange={(v) => patchHero({ floatBadge: { ...h.floatBadge, icon: v } })} placeholder="🚀" />
        </Field>
        <Field label="Badge melayang — angka">
          <TextInput value={h.floatBadge.value} onChange={(v) => patchHero({ floatBadge: { ...h.floatBadge, value: v } })} placeholder="17+" />
        </Field>
        <Field label="Badge melayang — teks">
          <TextInput value={h.floatBadge.label} onChange={(v) => patchHero({ floatBadge: { ...h.floatBadge, label: v } })} placeholder="apps shipped" />
        </Field>
      </div>
    </SectionCard>
  );
}

/* ── Stats tab ────────────────────────────────────────── */

function StatsTab({
  draft,
  setStat,
  addStat,
  removeStat,
  onReset,
}: {
  draft: PortfolioContent;
  setStat: (i: number, p: Partial<Stat>) => void;
  addStat: () => void;
  removeStat: (i: number) => void;
  onReset: () => void;
}) {
  return (
    <SectionCard title="Statistik" onReset={onReset}>
      <div className="admin-list">
        {draft.stats.map((s, i) => (
          <div className="admin-item" key={i}>
            <div className="admin-item-head">
              <span className="admin-item-title">Stat #{i + 1}</span>
              <button className="admin-remove" onClick={() => removeStat(i)}>Hapus</button>
            </div>
            <div className="admin-grid">
              <Field label="Angka">
                <input
                  type="number"
                  className="admin-input"
                  value={s.value}
                  onChange={(e) => setStat(i, { value: Number(e.target.value) || 0 })}
                />
              </Field>
              <Field label="Suffix" hint="mis. +">
                <TextInput value={s.suffix || ""} onChange={(v) => setStat(i, { suffix: v })} />
              </Field>
              <Field label="Label">
                <TextInput value={s.label} onChange={(v) => setStat(i, { label: v })} />
              </Field>
              <Field label="Sub-teks" hint="opsional, mis. iOS & Android">
                <TextInput value={s.sub || ""} onChange={(v) => setStat(i, { sub: v })} />
              </Field>
            </div>
          </div>
        ))}
      </div>
      <button className="btn admin-add" onClick={addStat}>+ Tambah Stat</button>
    </SectionCard>
  );
}

/* ── Skills tab ───────────────────────────────────────── */

function SkillsTab({
  draft,
  patch,
  onReset,
}: {
  draft: PortfolioContent;
  patch: (p: Partial<PortfolioContent>) => void;
  onReset: () => void;
}) {
  return (
    <SectionCard title="Skills (marquee)" onReset={onReset}>
      <Field label="Daftar skill" hint="Satu per baris">
        <TextArea value={draft.skills.join("\n")} onChange={(v) => patch({ skills: v.split("\n").map((s) => s.trim()).filter(Boolean) })} rows={10} />
      </Field>
      <div className="admin-preview">
        {draft.skills.map((s) => (
          <span className="tag" key={s}>{s}</span>
        ))}
      </div>
    </SectionCard>
  );
}

/* ── Experience tab ───────────────────────────────────── */

function ExperienceTab({
  draft,
  setExp,
  moveExp,
  addExp,
  removeExp,
  setRole,
  addRole,
  removeRole,
  onReset,
}: {
  draft: PortfolioContent;
  setExp: (i: number, p: Partial<Experience>) => void;
  moveExp: (i: number, dir: -1 | 1) => void;
  addExp: () => void;
  removeExp: (i: number) => void;
  setRole: (expI: number, roleI: number, p: Partial<Experience["roles"][number]>) => void;
  addRole: (expI: number) => void;
  removeRole: (expI: number, roleI: number) => void;
  onReset: () => void;
}) {
  return (
    <SectionCard title="Pengalaman Kerja" onReset={onReset}>
      <div className="admin-list">
        {draft.experiences.map((exp, i) => (
          <details className="admin-item" key={`${exp.company}-${i}`} open={i === 0}>
            <summary>
              <span className="admin-item-title">{exp.company}</span>
              <span className="admin-item-actions">
                <button onClick={(e) => { e.preventDefault(); moveExp(i, -1); }} disabled={i === 0}>↑</button>
                <button onClick={(e) => { e.preventDefault(); moveExp(i, 1); }} disabled={i === draft.experiences.length - 1}>↓</button>
              </span>
            </summary>
            <div className="admin-item-body">
              <div className="admin-grid">
                <Field label="Nama perusahaan">
                  <TextInput value={exp.company} onChange={(v) => setExp(i, { company: v })} />
                </Field>
                <Field label="Inisial (di lingkaran timeline)">
                  <TextInput value={exp.initial} onChange={(v) => setExp(i, { initial: v })} />
                </Field>
                <Field label="Badge jumlah app">
                  <TextInput value={exp.badge} onChange={(v) => setExp(i, { badge: v })} />
                </Field>
                <Field label="Deskripsi">
                  <TextArea value={exp.desc} onChange={(v) => setExp(i, { desc: v })} />
                </Field>
                <Field label="Tags">
                  <TagsInput value={exp.tags} onChange={(tags) => setExp(i, { tags })} />
                </Field>
              </div>

              <div className="admin-roles">
                <span className="admin-field-label">Roles / Periode</span>
                {exp.roles.map((r, rIdx) => (
                  <div className="admin-role" key={rIdx}>
                    <select
                      className="admin-input"
                      value={r.type}
                      onChange={(e) => setRole(i, rIdx, { type: e.target.value as "Full-time" | "Part-time" })}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                    </select>
                    <input
                      type="text"
                      className="admin-input"
                      value={r.period}
                      placeholder="mis. Jan 2024 – Present"
                      onChange={(e) => setRole(i, rIdx, { period: e.target.value })}
                    />
                    <label className="admin-check">
                      <input
                        type="checkbox"
                        checked={!!r.current}
                        onChange={(e) => setRole(i, rIdx, { current: e.target.checked })}
                      />
                      Current
                    </label>
                    <button className="admin-remove" onClick={() => removeRole(i, rIdx)}>Hapus</button>
                  </div>
                ))}
                <button className="btn admin-add small" onClick={() => addRole(i)}>+ Tambah Role</button>
              </div>

              <div className="admin-item-foot">
                <button className="admin-remove" onClick={() => removeExp(i)}>Hapus pengalaman ini</button>
              </div>
            </div>
          </details>
        ))}
      </div>
      <button className="btn admin-add" onClick={addExp}>+ Tambah Pengalaman</button>
    </SectionCard>
  );
}

/* ── Projects tab ─────────────────────────────────────── */

function ProjectsTab({
  draft,
  setProject,
  moveProject,
  addProject,
  removeProject,
  onReset,
}: {
  draft: PortfolioContent;
  setProject: (i: number, p: Partial<Project>) => void;
  moveProject: (i: number, dir: -1 | 1) => void;
  addProject: () => void;
  removeProject: (i: number) => void;
  onReset: () => void;
}) {
  return (
    <SectionCard title={`Proyek (${draft.projects.length})`} onReset={onReset}>
      <div className="admin-list">
        {draft.projects.map((p, i) => (
          <details className="admin-item" key={`${p.title}-${i}`} open={i === 0}>
            <summary>
              <span className="admin-item-title">{i + 1}. {p.title}</span>
              <span className="admin-item-actions">
                <button onClick={(e) => { e.preventDefault(); moveProject(i, -1); }} disabled={i === 0}>↑</button>
                <button onClick={(e) => { e.preventDefault(); moveProject(i, 1); }} disabled={i === draft.projects.length - 1}>↓</button>
              </span>
            </summary>
            <div className="admin-item-body">
              <div className="admin-grid">
                <Field label="Judul">
                  <TextInput value={p.title} onChange={(v) => setProject(i, { title: v })} />
                </Field>
                <ImageField
                  label="Screenshot"
                  hint="Upload otomatis dikompres & gratis (Firestore). Bisa juga isi path manual, mis. /jiff-customer.png"
                  value={p.img}
                  onChange={(v) => setProject(i, { img: v })}
                  folder="screenshots"
                />
                <Field label="Deskripsi">
                  <TextArea value={p.desc} onChange={(v) => setProject(i, { desc: v })} />
                </Field>
                <Field label="Tags">
                  <TagsInput value={p.tags} onChange={(tags) => setProject(i, { tags })} />
                </Field>
                <Field label="Link App Store" hint="kosongkan jika tidak ada">
                  <TextInput value={p.appStore} onChange={(v) => setProject(i, { appStore: v })} />
                </Field>
                <Field label="Link Google Play" hint="kosongkan jika tidak ada">
                  <TextInput value={p.playStore} onChange={(v) => setProject(i, { playStore: v })} />
                </Field>
              </div>
              <div className="admin-item-foot">
                <button className="admin-remove" onClick={() => removeProject(i)}>Hapus proyek ini</button>
              </div>
            </div>
          </details>
        ))}
      </div>
      <button className="btn admin-add" onClick={addProject}>+ Tambah Proyek</button>
    </SectionCard>
  );
}

/* ── Contact tab ──────────────────────────────────────── */

function ContactTab({
  draft,
  patchContact,
  onReset,
}: {
  draft: PortfolioContent;
  patchContact: (p: Partial<PortfolioContent["contact"]>) => void;
  onReset: () => void;
}) {
  const c = draft.contact;
  return (
    <SectionCard title="Kontak" onReset={onReset}>
      <div className="admin-grid">
        <Field label="Eyebrow section Contact">
          <TextInput value={c.eyebrow} onChange={(v) => patchContact({ eyebrow: v })} />
        </Field>
        <Field label="Judul section Contact">
          <TextInput value={c.title} onChange={(v) => patchContact({ title: v })} />
        </Field>
        <Field label="Paragraf intro">
          <TextArea value={c.intro} onChange={(v) => patchContact({ intro: v })} />
        </Field>
        <Field label="Email">
          <TextInput value={c.email} onChange={(v) => patchContact({ email: v })} />
        </Field>
        <Field label="URL LinkedIn">
          <TextInput value={c.linkedinUrl} onChange={(v) => patchContact({ linkedinUrl: v })} />
        </Field>
        <Field label="Handle LinkedIn" hint="teks yang ditampilkan">
          <TextInput value={c.linkedinHandle} onChange={(v) => patchContact({ linkedinHandle: v })} />
        </Field>
        <Field label="URL GitHub">
          <TextInput value={c.githubUrl} onChange={(v) => patchContact({ githubUrl: v })} />
        </Field>
        <Field label="Handle GitHub" hint="teks yang ditampilkan">
          <TextInput value={c.githubHandle} onChange={(v) => patchContact({ githubHandle: v })} />
        </Field>
      </div>
    </SectionCard>
  );
}

/* ── Settings tab ─────────────────────────────────────── */

function SettingsTab({ draft, onImport, email, onLogout }: { draft: PortfolioContent; onImport: (parsed: unknown) => void; email: string; onLogout: () => void }) {
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-content.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        onImport(parsed);
        setMsg({ kind: "ok", text: "File JSON terbaca dan dimuat ke draft." });
      } catch {
        setMsg({ kind: "err", text: "File JSON tidak valid." });
      }
    };
    reader.readAsText(file);
  };

  return (
    <SectionCard title="Pengaturan">
      <div className="admin-settings">
        <div className="admin-settings-block">
          <h3>Akun Admin</h3>
          <p className="admin-hint-text">
            Masuk sebagai: <b>{email}</b>. Akun dan password dikelola di Firebase console
            (Authentication → Users), bukan di website.
          </p>
          <div className="admin-settings-form row">
            <button className="btn" onClick={onLogout}>Keluar dari Admin</button>
          </div>
        </div>

        <div className="admin-settings-block">
          <h3>Backup & Restore</h3>
          <p className="admin-hint-text">
            Export menyimpan seluruh konten sebagai file JSON (berguna untuk backup atau commit ke repo).
            Import membaca file JSON ke draft — lalu tekan <b>Simpan Perubahan</b>.
          </p>
          <div className="admin-settings-form row">
            <button className="btn" onClick={exportJson}>⬇ Export JSON</button>
            <button className="btn" onClick={() => fileRef.current?.click()}>⬆ Import JSON</button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importJson(f);
                e.target.value = "";
              }}
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
