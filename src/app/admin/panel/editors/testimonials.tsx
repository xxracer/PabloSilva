/**
 * Testimonials editor — the quotes carousel on the home page. Each
 * testimonial has a name, a context (e.g. 'Adult BJJ student, 2 years'),
 * and the quote itself.
 */
"use client";

import { useEffect, useState } from "react";
import {
  SectionHeader, Card, Lbl, Row, TextInput, TextArea, NumberInput, SaveBar, VisibleToggle,
} from "../ui";

type Item = { id: string; name: string; role: string; quote: string; sort: number; visible: number };

export default function TestimonialsEditor() {
  const [list, setList] = useState<Item[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/admin/testimonials").then(r => r.json()).then(j => {
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
    const r = await fetch(`/api/admin/testimonials/${a.id}`, {
      method: "PUT", headers: { "content-type": "application/json" },
      body: JSON.stringify(a),
    });
    if (!r.ok) throw new Error("Save failed");
  }
  async function add() {
    const r = await fetch("/api/admin/testimonials", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "New quote", role: "", quote: "", sort: list!.length + 10, visible: 1 }),
    });
    const j = await r.json();
    setList([...list!, j.row]);
    setActiveId(j.row.id);
  }
  async function remove(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    const next = list!.filter(x => x.id !== id);
    setList(next); setActiveId(next[0]?.id ?? null);
  }

  return (
    <div>
      <SectionHeader
        title="Testimonials"
        where="The quotes carousel on the home page (between the gallery and the Instagram feed)."
        intro="Aim for 3–6 testimonials. Each one is just a name, a short context, and the quote."
      />

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "1.2rem" }}>
        <aside>
          <button onClick={add} type="button" style={newBtn}>+ New quote</button>
          {list.map(x => (
            <button
              key={x.id} onClick={() => setActiveId(x.id)} type="button"
              style={{
                ...itemBtn,
                background: activeId === x.id ? "#1a1916" : "transparent",
                color: activeId === x.id ? "#f4ede0" : "#cdc7b8",
                opacity: x.visible ? 1 : .4,
              }}
            >{x.name || "(untitled)"}</button>
          ))}
        </aside>
        {a ? (
          <div>
            <Card>
              <Row>
                <div style={{ flex: 1 }}>
                  <Lbl hint="The student's full name.">Name</Lbl>
                  <TextInput value={a.name} onChange={v => update({ name: v })} />
                </div>
                <div style={{ flex: 1 }}>
                  <Lbl hint="Short context line shown under the name, e.g. 'Adult BJJ · 2 years'.">Role / context</Lbl>
                  <TextInput value={a.role} onChange={v => update({ role: v })} />
                </div>
                <div style={{ width: 110 }}>
                  <Lbl hint="Order in the carousel. Smaller = first.">Order</Lbl>
                  <NumberInput value={a.sort} onChange={v => update({ sort: v })} />
                </div>
              </Row>
              <Lbl hint="The actual quote. Keep it under ~30 words for readability.">Quote</Lbl>
              <TextArea value={a.quote} onChange={v => update({ quote: v })} rows={4} />
              <Lbl hint="Show this testimonial on the site, or hide it.">Show on the site</Lbl>
              <VisibleToggle value={a.visible} onChange={v => update({ visible: v })} />
            </Card>
            <div style={{ display: "flex", gap: ".8rem", alignItems: "center" }}>
              <SaveBar onSave={save} label="Save quote" />
              <button onClick={() => remove(a.id)} type="button" style={delBtn}>Delete</button>
            </div>
          </div>
        ) : <p style={{ opacity: .6 }}>No testimonial selected.</p>}
      </div>
    </div>
  );
}

const newBtn: React.CSSProperties = {
  width: "100%", background: "transparent", color: "#cdc7b8",
  border: "1px dashed #2a2a28", borderRadius: 8, padding: ".5rem .9rem",
  cursor: "pointer", fontSize: ".85rem", marginBottom: ".7rem", fontFamily: "inherit",
};
const itemBtn: React.CSSProperties = {
  display: "block", width: "100%", textAlign: "left",
  border: 0, borderRadius: 8, padding: ".55rem .7rem",
  fontSize: ".9rem", cursor: "pointer", marginBottom: 2, fontFamily: "inherit",
};
const delBtn: React.CSSProperties = {
  background: "transparent", color: "#a77070", border: 0,
  padding: ".5rem .9rem", cursor: "pointer", fontSize: ".9rem", fontFamily: "inherit",
};
