"use client";

export function H1({ children }: { children: React.ReactNode }) {
  return <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "1.4rem", margin: "0 0 1rem" }}>{children}</h1>;
}

export function H2({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "1.05rem", margin: "0 0 .7rem" }}>{children}</h2>;
}

export function Lbl({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: ".72rem", textTransform: "uppercase", letterSpacing: ".1em", opacity: .55, margin: ".85rem 0 .4rem" }}>{children}</div>;
}

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "#131311",
      border: "1px solid #1c1c1a",
      borderRadius: 14,
      padding: "1.2rem 1.2rem .4rem",
      marginBottom: "1.2rem",
    }}>{children}</div>
  );
}

export function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", gap: ".8rem" }}>{children}</div>;
}

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

export function TextInput({ value, onChange, type = "text" }: { value: string; onChange: (v: string) => void; type?: string }) {
  return <input type={type} value={value ?? ""} onChange={e => onChange(e.target.value)} style={baseInput} />;
}

export function TextArea({ value, onChange, rows = 4 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return <textarea rows={rows} value={value ?? ""} onChange={e => onChange(e.target.value)} style={{ ...baseInput, resize: "vertical" }} />;
}

export function NumberInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return <input type="number" value={value} onChange={e => onChange(Number(e.target.value))} style={baseInput} />;
}

export function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { label: string; value: string }[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={baseInput}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div style={{ display: "flex", gap: ".6rem" }}>
        <input type="text" value={value ?? ""} onChange={e => onChange(e.target.value)} placeholder="/uploads/..." style={baseInput} />
        <UploadButton onUploaded={(url) => onChange(url)} />
      </div>
      {value && (
        <div style={{ marginTop: ".7rem" }}>
          <img src={value} alt="" style={{ maxWidth: 220, maxHeight: 220, borderRadius: 8, border: "1px solid #2a2a28" }} />
        </div>
      )}
    </div>
  );
}

export function UploadButton({ onUploaded, label = "Upload" }: { onUploaded: (url: string) => void; label?: string }) {
  return (
    <label style={{
      display: "inline-flex",
      alignItems: "center",
      background: "#1c1c1a",
      color: "#f4ede0",
      border: "1px solid #2a2a28",
      borderRadius: 8,
      padding: ".55rem .9rem",
      fontSize: ".85rem",
      cursor: "pointer",
      whiteSpace: "nowrap",
    }}>
      {label}
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const fd = new FormData();
          fd.append("file", f);
          const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
          const j = await r.json();
          if (j.url) onUploaded(j.url);
          e.target.value = "";
        }}
      />
    </label>
  );
}

export function ListEditor<T>({
  value, onChange, addLabel, renderItem,
}: {
  value: T[];
  onChange: (v: T[]) => void;
  addLabel: string;
  renderItem: (item: T, setItem: (v: T) => void, idx: number) => React.ReactNode;
}) {
  return (
    <div>
      {value.map((item, idx) => (
        <div key={(item as { _k?: string })._k ?? idx} style={{
          background: "#0c0c0b",
          border: "1px solid #1c1c1a",
          borderRadius: 10,
          padding: ".7rem .8rem",
          marginBottom: ".6rem",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".3rem" }}>
            <span style={{ fontSize: ".75rem", opacity: .55 }}>#{idx + 1}</span>
            <button
              type="button"
              onClick={() => onChange(value.filter((_, i) => i !== idx))}
              style={{ background: "transparent", border: 0, color: "#a77070", cursor: "pointer", fontSize: ".8rem" }}
            >
              Remove
            </button>
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
          padding: ".5rem .9rem",
          fontSize: ".85rem",
          cursor: "pointer",
          margin: ".3rem 0 .8rem",
        }}
      >
        + {addLabel}
      </button>
    </div>
  );
}

export function SaveBar({ onSave, label = "Save changes" }: { onSave: () => Promise<void>; label?: string }) {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div style={{ position: "sticky", bottom: 0, padding: "1rem 0", display: "flex", gap: ".8rem", alignItems: "center" }}>
      <button
        type="button"
        onClick={async () => {
          setSaving(true); setMsg(null);
          try { await onSave(); setMsg("Saved"); }
          catch (e) { setMsg("Error: " + (e as Error).message); }
          finally { setSaving(false); setTimeout(() => setMsg(null), 2500); }
        }}
        disabled={saving}
        style={{
          background: "var(--color-bronze, #8c6a3d)",
          color: "var(--color-bone, #f4ede0)",
          border: 0,
          borderRadius: 10,
          padding: ".75rem 1.4rem",
          fontSize: ".95rem",
          fontWeight: 600,
          cursor: saving ? "wait" : "pointer",
          opacity: saving ? .6 : 1,
        }}
      >
        {saving ? "Saving…" : label}
      </button>
      {msg && <span style={{ opacity: .7, fontSize: ".9rem" }}>{msg}</span>}
    </div>
  );
}

import { useState } from "react";
