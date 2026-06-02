"use client";

import { useEffect, useState } from "react";
import { H1, Card, Lbl, Row, TextInput, NumberInput, SaveBar } from "../ui";

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
    await fetch(`/api/admin/hours/${a.id}`, {
      method: "PUT", headers: { "content-type": "application/json" },
      body: JSON.stringify(a),
    });
  }
  async function add() {
    const r = await fetch("/api/admin/hours", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ day: "New day", hours: "", sort: list!.length + 10, visible: 1 }),
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
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "1.2rem" }}>
      <aside>
        <H1>Hours</H1>
        <button onClick={add} type="button" style={newBtn}>+ New row</button>
        {list.map(x => (
          <button key={x.id} onClick={() => setActiveId(x.id)} type="button" style={{ ...itemBtn, background: activeId === x.id ? "#1a1916" : "transparent", color: activeId === x.id ? "#f4ede0" : "#cdc7b8" }}>
            {x.day || "(untitled)"}
          </button>
        ))}
      </aside>
      {a ? (
        <div>
          <H1>{a.day}</H1>
          <Card>
            <Row>
              <div style={{ flex: 1 }}>
                <Lbl>Day label</Lbl>
                <TextInput value={a.day} onChange={v => update({ day: v })} />
              </div>
              <div style={{ flex: 1 }}>
                <Lbl>Hours</Lbl>
                <TextInput value={a.hours} onChange={v => update({ hours: v })} />
              </div>
              <div style={{ width: 90 }}>
                <Lbl>Sort</Lbl>
                <NumberInput value={a.sort} onChange={v => update({ sort: v })} />
              </div>
            </Row>
          </Card>
          <div style={{ display: "flex", gap: ".8rem" }}>
            <button onClick={save} type="button" style={saveBtn}>Save</button>
            <button onClick={() => remove(a.id)} type="button" style={delBtn}>Delete</button>
          </div>
        </div>
      ) : <p style={{ opacity: .6 }}>No row selected.</p>}
    </div>
  );
}

const newBtn: React.CSSProperties = { width: "100%", background: "transparent", color: "#cdc7b8", border: "1px dashed #2a2a28", borderRadius: 8, padding: ".5rem .9rem", cursor: "pointer", fontSize: ".85rem", marginBottom: ".7rem" };
const itemBtn: React.CSSProperties = { display: "block", width: "100%", textAlign: "left", border: 0, borderRadius: 8, padding: ".55rem .7rem", fontSize: ".9rem", cursor: "pointer", marginBottom: 2 };
const saveBtn: React.CSSProperties = { background: "var(--color-bronze, #8c6a3d)", color: "var(--color-bone, #f4ede0)", border: 0, borderRadius: 10, padding: ".75rem 1.4rem", fontWeight: 600, cursor: "pointer" };
const delBtn: React.CSSProperties = { background: "transparent", color: "#a77070", border: 0, padding: ".5rem .9rem", cursor: "pointer", fontSize: ".9rem" };
