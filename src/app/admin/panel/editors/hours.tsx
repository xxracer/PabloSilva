/**
 * Academy hours — the open/closed times shown on the home page and on
 * the /schedule and /contact pages.
 */
"use client";

import { useEffect, useState } from "react";
import {
  SectionHeader, Card, Lbl, Row, TextInput, NumberInput, VisibleToggle, SaveBar,
} from "../ui";

type Item = { id: string; day: string; hours: string; sort: number; visible: number };

export default function HoursEditor() {
  const [list, setList] = useState<Item[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/admin/hours").then(r => r.json()).then(j => {
      setList(j.rows);
      if (j.rows[0]) setActiveId(j.rows[0].id);
    });
  }, []);
  if (!list) return <p>Loading…</p>;
  const a = list.find(x => x.id === activeId);

  function update(patch: Partial<Item>) {
    setList(list!.map(x => x.id === activeId ? { ...x, ...patch } : x));
  }
  async function save() {
    if (!a) return;
    const r = await fetch(`/api/admin/hours/${a.id}`, {
      method: "PUT", headers: { "content-type": "application/json" },
      body: JSON.stringify(a),
    });
    if (!r.ok) throw new Error("Save failed");
  }
  async function add() {
    const r = await fetch("/api/admin/hours", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ day: "New day", hours: "Closed", sort: list!.length + 10, visible: 1 }),
    });
    const j = await r.json();
    setList([...list!, j.row]);
    setActiveId(j.row.id);
  }
  async function remove(id: string) {
    if (!confirm("Delete this row?")) return;
    await fetch(`/api/admin/hours/${id}`, { method: "DELETE" });
    const next = list!.filter(x => x.id !== id);
    setList(next); setActiveId(next[0]?.id ?? null);
  }

  return (
    <div>
      <SectionHeader
        title="Academy hours"
        where="The 'academy hours' block on the home page and the /schedule and /contact pages."
        intro="One row per day or day range. The default three are Mon–Fri, Saturday, and Sunday (closed)."
      />

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "1.2rem" }}>
        <aside>
          <button onClick={add} type="button" style={newBtn}>+ New row</button>
          {list.map(x => (
            <button key={x.id} onClick={() => setActiveId(x.id)} type="button" style={{
              ...itemBtn,
              background: activeId === x.id ? "#1a1916" : "transparent",
              color: activeId === x.id ? "#f4ede0" : "#cdc7b8",
              opacity: x.visible ? 1 : .4,
            }}>
              {x.day || "(untitled)"}
            </button>
          ))}
        </aside>

        {a ? (
          <div>
            <Card>
              <Row>
                <div style={{ flex: 1 }}>
                  <Lbl hint="e.g. 'Mon – Fri' or 'Monday'.">Day label</Lbl>
                  <TextInput value={a.day} onChange={v => update({ day: v })} />
                </div>
                <div style={{ flex: 1 }}>
                  <Lbl hint="e.g. '7:00 AM – 7:30 PM' or 'Closed'.">Hours</Lbl>
                  <TextInput value={a.hours} onChange={v => update({ hours: v })} />
                </div>
                <div style={{ width: 110 }}>
                  <Lbl hint="Order in the list. Smaller = first.">Order</Lbl>
                  <NumberInput value={a.sort} onChange={v => update({ sort: v })} />
                </div>
              </Row>
              <Row>
                <div style={{ flex: 1 }}>
                  <Lbl hint="Show this row on the site, or hide it temporarily.">Show on the site</Lbl>
                  <VisibleToggle value={a.visible} onChange={v => update({ visible: v })} />
                </div>
              </Row>
            </Card>
            <div style={{ display: "flex", gap: ".8rem", alignItems: "center" }}>
              <SaveBar onSave={save} label="Save this row" />
              <button onClick={() => remove(a.id)} type="button" style={delBtn}>Delete</button>
            </div>
          </div>
        ) : <p style={{ opacity: .6 }}>No row selected.</p>}
      </div>
    </div>
  );
}

const newBtn: React.CSSProperties = {
  width: "100%", background: "transparent", color: "#cdc7b8",
  border: "1px dashed #2a2a28", borderRadius: 8,
  padding: ".5rem .9rem", cursor: "pointer", fontSize: ".85rem",
  marginBottom: ".7rem", fontFamily: "inherit",
};
const itemBtn: React.CSSProperties = {
  display: "block", width: "100%", textAlign: "left",
  border: 0, borderRadius: 8, padding: ".55rem .7rem",
  fontSize: ".9rem", cursor: "pointer", marginBottom: 2,
  fontFamily: "inherit",
};
const delBtn: React.CSSProperties = {
  background: "transparent", color: "#a77070", border: 0,
  padding: ".5rem .9rem", cursor: "pointer", fontSize: ".9rem", fontFamily: "inherit",
};
