/**
 * Shared UI primitives for the admin panel.
 * Every editor reuses these so the panel feels consistent.
 */
"use client";

import { useState } from "react";

/* ─── Typography ─────────────────────────────────────────────────────── */

export function H1({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <h1 style={{
        fontFamily: "Fraunces, serif",
        fontSize: "1.4rem",
        fontWeight: 500,
        margin: 0,
        letterSpacing: "-0.01em",
      }}>{children}</h1>
      {sub && <div style={{ fontSize: ".82rem", opacity: .6, marginTop: ".15rem" }}>{sub}</div>}
    </div>
  );
}

export function H2({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div style={{ marginBottom: ".7rem" }}>
      <h2 style={{
        fontFamily: "Fraunces, serif",
        fontSize: "1.05rem",
        fontWeight: 500,
        margin: 0,
        letterSpacing: "-0.01em",
      }}>{children}</h2>
      {sub && <div style={{ fontSize: ".78rem", opacity: .6, marginTop: ".1rem" }}>{sub}</div>}
    </div>
  );
}

/** Field label, uppercase, small. */
export function Lbl({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div style={{ margin: "1rem 0 .35rem" }}>
      <div style={{
        fontSize: ".72rem",
        textTransform: "uppercase",
        letterSpacing: ".1em",
        opacity: .6,
        fontWeight: 500,
      }}>{children}</div>
      {hint && <FieldHelp>{hint}</FieldHelp>}
    </div>
  );
}

/** Italic hint line shown under a label or input. */
export function FieldHelp({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: ".78rem", opacity: .55, marginTop: ".25rem", lineHeight: 1.4 }}>{children}</div>;
}

/** Top-of-section header: title + a plain-language description of where it shows. */
export function SectionHeader({
  title,
  where,
  intro,
}: {
  title: string;
  /** Plain-language description of where the content appears on the site. */
  where: string;
  /** Optional extra context. */
  intro?: string;
}) {
  return (
    <div style={{ marginBottom: "1.4rem", paddingBottom: "1rem", borderBottom: "1px solid #1c1c1a" }}>
      <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "1.5rem", margin: 0, fontWeight: 500 }}>{title}</h1>
      <div style={{
        marginTop: ".4rem",
        fontSize: ".85rem",
        color: "#cdc7b8",
        opacity: .9,
        lineHeight: 1.5,
      }}>{where}</div>
      {intro && (
        <div style={{
          marginTop: ".4rem",
          fontSize: ".82rem",
          opacity: .55,
          lineHeight: 1.5,
        }}>{intro}</div>
      )}
    </div>
  );
}

/* ─── Card ──────────────────────────────────────────────────────────── */

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "#131311",
      border: "1px solid #1c1c1a",
      borderRadius: 14,
      padding: "1.4rem 1.4rem .6rem",
      marginBottom: "1.2rem",
    }}>{children}</div>
  );
}

export function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", gap: ".8rem", alignItems: "flex-start" }}>{children}</div>;
}

/* ─── Inputs ────────────────────────────────────────────────────────── */

const baseInput: React.CSSProperties = {
  width: "100%",
  background: "#0c0c0b",
  color: "#f4ede0",
  border: "1px solid #2a2a28",
  borderRadius: 8,
  padding: ".6rem .7rem",
  fontSize: ".95rem",
  outline: "none",
  fontFamily: "inherit",
};

export function TextInput({
  value, onChange, type = "text", placeholder,
}: { value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return <input type={type} value={value ?? ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={baseInput} />;
}

export function TextArea({
  value, onChange, rows = 4, placeholder,
}: { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return <textarea rows={rows} value={value ?? ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...baseInput, resize: "vertical", lineHeight: 1.5 }} />;
}

export function NumberInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return <input type="number" value={value} onChange={e => onChange(Number(e.target.value))} style={baseInput} />;
}

export function Select({
  value, onChange, options,
}: { value: string; onChange: (v: string) => void; options: { label: string; value: string }[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={baseInput}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

/** Yes / No toggle (Visible) — clearer than a Select dropdown. */
export function VisibleToggle({ value, onChange }: { value: number | boolean; onChange: (v: number) => void }) {
  const on = Number(value) === 1;
  return (
    <div style={{ display: "flex", gap: ".5rem" }}>
      <button
        type="button"
        onClick={() => onChange(1)}
        style={{
          flex: 1, padding: ".5rem .7rem", fontSize: ".85rem",
          background: on ? "#1f3a2a" : "transparent",
          color: on ? "#a8d9b6" : "#cdc7b8",
          border: `1px solid ${on ? "#2f5a3e" : "#2a2a28"}`,
          borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
        }}
      >Visible</button>
      <button
        type="button"
        onClick={() => onChange(0)}
        style={{
          flex: 1, padding: ".5rem .7rem", fontSize: ".85rem",
          background: !on ? "#3a1f1f" : "transparent",
          color: !on ? "#d9a8a8" : "#cdc7b8",
          border: `1px solid ${!on ? "#5a2f2f" : "#2a2a28"}`,
          borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
        }}
      >Hidden</button>
    </div>
  );
}

/* ─── Image upload ──────────────────────────────────────────────────── */

export function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div style={{ display: "flex", gap: ".6rem" }}>
        <input
          type="text" value={value ?? ""} onChange={e => onChange(e.target.value)}
          placeholder="/uploads/... or https://..."
          style={baseInput}
        />
        <UploadButton onUploaded={(url) => onChange(url)} />
      </div>
      {value && (
        <div style={{ marginTop: ".7rem" }}>
          <img
            src={value} alt=""
            style={{ maxWidth: 220, maxHeight: 220, borderRadius: 8, border: "1px solid #2a2a28", objectFit: "cover" }}
          />
        </div>
      )}
      <FieldHelp>Type a URL or upload a new image (goes to Vercel Blob if configured).</FieldHelp>
    </div>
  );
}

export function UploadButton({ onUploaded, label = "Upload" }: { onUploaded: (url: string) => void; label?: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  return (
    <label style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      background: "#1c1c1a", color: "#f4ede0",
      border: "1px solid #2a2a28", borderRadius: 8,
      padding: ".55rem .9rem", fontSize: ".85rem",
      cursor: busy ? "wait" : "pointer", whiteSpace: "nowrap",
      fontFamily: "inherit", minWidth: 90,
    }}>
      {busy ? "Uploading…" : label}
      <input
        type="file" accept="image/*" disabled={busy}
        style={{ display: "none" }}
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setBusy(true); setErr(null);
          try {
            const fd = new FormData();
            fd.append("file", f);
            const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
            const j = await r.json();
            if (!r.ok) throw new Error(j.error || "Upload failed");
            onUploaded(j.url);
          } catch (ex) {
            setErr((ex as Error).message);
          } finally {
            setBusy(false);
            e.target.value = "";
          }
        }}
      />
    </label>
  );
}

/* ─── List editor ──────────────────────────────────────────────────── */

export function ListEditor<T>({
  value, onChange, addLabel, renderItem, emptyText = "No items yet.",
}: {
  value: T[];
  onChange: (v: T[]) => void;
  addLabel: string;
  renderItem: (item: T, setItem: (v: T) => void, idx: number) => React.ReactNode;
  emptyText?: string;
}) {
  return (
    <div>
      {value.length === 0 && (
        <div style={{ fontSize: ".85rem", opacity: .5, padding: ".6rem 0" }}>{emptyText}</div>
      )}
      {value.map((item, idx) => (
        <div key={(item as { _k?: string })._k ?? idx} style={{
          background: "#0c0c0b",
          border: "1px solid #1c1c1a",
          borderRadius: 10,
          padding: ".7rem .8rem",
          marginBottom: ".6rem",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".3rem" }}>
            <span style={{ fontSize: ".72rem", opacity: .5, letterSpacing: ".06em" }}>ITEM #{idx + 1}</span>
            <button
              type="button"
              onClick={() => onChange(value.filter((_, i) => i !== idx))}
              style={{ background: "transparent", border: 0, color: "#a77070", cursor: "pointer", fontSize: ".8rem" }}
            >Remove</button>
          </div>
          {renderItem(item, (v) => {
            const next = [...value];
            next[idx] = v;
            onChange(next);
          }, idx)}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, {} as T])}
        style={{
          background: "transparent",
          border: "1px dashed #2a2a28",
          color: "#cdc7b8",
          borderRadius: 8,
          padding: ".55rem .9rem",
          fontSize: ".85rem",
          cursor: "pointer",
          margin: ".3rem 0 .8rem",
          fontFamily: "inherit",
        }}
      >+ {addLabel}</button>
    </div>
  );
}

/* ─── Save bar ─────────────────────────────────────────────────────── */

export function SaveBar({
  onSave, label = "Save changes",
}: { onSave: () => Promise<void>; label?: string }) {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState<boolean | null>(null);
  return (
    <div style={{
      position: "sticky", bottom: 0,
      padding: "1rem 0",
      marginTop: "1rem",
      display: "flex", gap: ".8rem", alignItems: "center",
      background: "linear-gradient(180deg, transparent, #0c0c0b 30%)",
    }}>
      <button
        type="button"
        onClick={async () => {
          setSaving(true); setMsg(null); setOk(null);
          try {
            await onSave();
            setMsg("Saved"); setOk(true);
          } catch (e) {
            setMsg("Error: " + (e as Error).message); setOk(false);
          } finally {
            setSaving(false);
            setTimeout(() => setMsg(null), 3000);
          }
        }}
        disabled={saving}
        style={{
          background: "var(--color-bronze, #8c6a3d)",
          color: "var(--color-bone, #f4ede0)",
          border: 0, borderRadius: 10,
          padding: ".75rem 1.4rem", fontSize: ".95rem", fontWeight: 600,
          cursor: saving ? "wait" : "pointer",
          opacity: saving ? .6 : 1, fontFamily: "inherit",
        }}
      >{saving ? "Saving…" : label}</button>
      {msg && (
        <span style={{
          fontSize: ".9rem",
          color: ok ? "#a8d9b6" : "#d9a8a8",
        }}>{msg}</span>
      )}
    </div>
  );
}
