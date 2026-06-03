/**
 * Navigation menu — the links in the top nav bar (and the mobile menu).
 * Drag-free; reorder by editing the Sort number. Lower numbers come first.
 */
"use client";

import { useEffect, useState } from "react";
import {
  SectionHeader, Card, Lbl, Row, TextInput, NumberInput, SaveBar,
} from "../ui";

type Row = { id: string; label: string; href: string; sort: number };

export default function NavEditor() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/nav_links").then(r => r.json()).then(j => setRows(j.rows));
  }, []);

  if (!rows) return <p>Loading…</p>;

  function setRow(i: number, patch: Partial<Row>) {
    const next = [...rows!];
    next[i] = { ...next[i], ...patch };
    setRows(next);
  }

  async function save() {
    setSaved(false);
    for (const r of rows!) {
      await fetch(`/api/admin/nav_links/${r.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(r),
      });
    }
    setSaved(true);
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
      <SectionHeader
        title="Navigation menu"
        where="The links in the top nav bar (and the mobile menu). Shows on every page."
        intro="Reorder by editing the Order number — smaller numbers come first. The four default links are Programs, Instructors, Schedule, and Visit."
      />

      {rows.map((r, i) => (
        <Card key={r.id}>
          <Row>
            <div style={{ flex: 1 }}>
              <Lbl hint="The visible text in the menu, e.g. 'Programs'.">Label</Lbl>
              <TextInput value={r.label} onChange={v => setRow(i, { label: v })} />
            </div>
            <div style={{ flex: 1 }}>
              <Lbl hint="Internal path (/programs) or full external URL (https://...).">URL</Lbl>
              <TextInput value={r.href} onChange={v => setRow(i, { href: v })} />
            </div>
            <div style={{ width: 110 }}>
              <Lbl hint="Order in the menu. Smaller = first.">Order</Lbl>
              <NumberInput value={r.sort} onChange={v => setRow(i, { sort: v })} />
            </div>
          </Row>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: ".3rem" }}>
            <button
              type="button"
              onClick={() => remove(r.id)}
              style={{ background: "transparent", color: "#a77070", border: 0, padding: ".4rem 0", cursor: "pointer", fontSize: ".85rem" }}
            >Remove this link</button>
          </div>
        </Card>
      ))}

      <div style={{ display: "flex", gap: ".8rem", alignItems: "center", marginTop: "1rem" }}>
        <button onClick={add} type="button" style={{
          background: "transparent", color: "#cdc7b8",
          border: "1px dashed #2a2a28", borderRadius: 8,
          padding: ".5rem .9rem", cursor: "pointer", fontSize: ".85rem", fontFamily: "inherit",
        }}>+ Add a new link</button>
        <SaveBar onSave={save} label="Save menu" />
      </div>
      {saved && <div style={{ marginTop: ".5rem", fontSize: ".85rem", color: "#a8d9b6" }}>Menu saved.</div>}
    </div>
  );
}
