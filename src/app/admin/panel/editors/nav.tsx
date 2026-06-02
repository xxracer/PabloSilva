"use client";

import { useState } from "react";
import { H1, Card, Lbl, Row, TextInput, NumberInput, SaveBar } from "../ui";

type NavLinkRow = { id: string; label: string; href: string; sort: number };

export default function NavEditor() {
  const [rows, setRows] = useState<NavLinkRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  if (!rows) {
    fetch("/api/admin/nav_links").then(r => r.json()).then(j => setRows(j.rows));
    return <p>Loading…</p>;
  }

  function setRow(i: number, patch: Partial<NavLinkRow>) {
    const next = [...rows!];
    next[i] = { ...next[i], ...patch };
    setRows(next);
  }
  async function save() {
    setErr(null); setSaved(false);
    for (const r of rows!) {
      const r1 = await fetch(`/api/admin/nav_links/${r.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(r),
      });
      if (!r1.ok) { setErr("Failed to save " + r.id); return; }
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }
  async function add() {
    const r = await fetch("/api/admin/nav_links", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ label: "New link", href: "/", sort: rows!.length + 10 }),
    });
    const j = await r.json();
    setRows([...rows!, j.row]);
  }
  async function remove(id: string) {
    await fetch(`/api/admin/nav_links/${id}`, { method: "DELETE" });
    setRows(rows!.filter(r => r.id !== id));
  }

  return (
    <div>
      <H1>Nav Links</H1>
      {rows.map((r, i) => (
        <Card key={r.id}>
          <Row>
            <div style={{ flex: 1 }}>
              <Lbl>Label</Lbl>
              <TextInput value={r.label} onChange={v => setRow(i, { label: v })} />
            </div>
            <div style={{ flex: 1 }}>
              <Lbl>URL</Lbl>
              <TextInput value={r.href} onChange={v => setRow(i, { href: v })} />
            </div>
            <div style={{ width: 90 }}>
              <Lbl>Sort</Lbl>
              <NumberInput value={r.sort} onChange={v => setRow(i, { sort: v })} />
            </div>
          </Row>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => remove(r.id)}
              style={{ background: "transparent", color: "#a77070", border: 0, padding: ".4rem 0", cursor: "pointer", fontSize: ".85rem" }}
            >
              Remove
            </button>
          </div>
        </Card>
      ))}
      <div style={{ display: "flex", gap: ".8rem", alignItems: "center" }}>
        <button onClick={add} type="button" style={{
          background: "transparent", color: "#cdc7b8", border: "1px dashed #2a2a28",
          borderRadius: 8, padding: ".5rem .9rem", cursor: "pointer", fontSize: ".85rem",
        }}>+ Add link</button>
        <button onClick={save} type="button" style={{
          background: "var(--color-bronze, #8c6a3d)", color: "var(--color-bone, #f4ede0)",
          border: 0, borderRadius: 10, padding: ".75rem 1.4rem", fontWeight: 600, cursor: "pointer",
        }}>Save all</button>
        {err && <span style={{ color: "#d97a7a" }}>{err}</span>}
        {saved && <span style={{ opacity: .7 }}>Saved.</span>}
      </div>
    </div>
  );
}
