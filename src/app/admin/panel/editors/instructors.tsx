"use client";

import { useEffect, useState } from "react";
import { H1, Card, Lbl, Row, TextInput, TextArea, NumberInput, SaveBar, ListEditor, ImageInput, UploadButton } from "../ui";

type Inst = { id: string; name: string; role: string; bio: string; image: string; sort: number; tags: string[] };

function parseRow(r: any): Inst {
  return { ...r, tags: r.tags_json ? JSON.parse(r.tags_json) : [] };
}

export default function InstructorsEditor() {
  const [list, setList] = useState<Inst[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/admin/instructors").then(r => r.json()).then(j => {
      const rows = (j.rows as any[]).map(parseRow);
      setList(rows);
      if (rows[0]) setActiveId(rows[0].id);
    });
  }, []);
  if (!list) return <p>Loading…</p>;
  const a = list.find(x => x.id === activeId);

  function update(patch: Partial<Inst>) {
    setList(list!.map(x => x.id === activeId ? { ...x, ...patch } : x));
  }

  async function save() {
    if (!a) return;
    const body = { ...a, tags_json: JSON.stringify(a.tags) };
    delete (body as any).tags;
    await fetch(`/api/admin/instructors/${a.id}`, {
      method: "PUT", headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  }
  async function add() {
    const r = await fetch("/api/admin/instructors", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "New instructor", role: "", bio: "", image: "", sort: list!.length + 10, tags_json: "[]" }),
    });
    const j = await r.json();
    const row = parseRow(j.row);
    setList([...list!, row]);
    setActiveId(row.id);
  }
  async function remove(id: string) {
    if (!confirm("Delete this instructor?")) return;
    await fetch(`/api/admin/instructors/${id}`, { method: "DELETE" });
    const next = list!.filter(x => x.id !== id);
    setList(next); setActiveId(next[0]?.id ?? null);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "1.2rem" }}>
      <aside>
        <H1>Instructors</H1>
        <button onClick={add} type="button" style={newBtn}>+ New instructor</button>
        {list.map(x => (
          <button key={x.id} onClick={() => setActiveId(x.id)} type="button" style={{ ...itemBtn, background: activeId === x.id ? "#1a1916" : "transparent", color: activeId === x.id ? "#f4ede0" : "#cdc7b8" }}>
            {x.name || "(untitled)"}
          </button>
        ))}
      </aside>
      {a ? (
        <div>
          <H1>{a.name}</H1>
          <Card>
            <Row>
              <div style={{ flex: 1 }}>
                <Lbl>Name</Lbl>
                <TextInput value={a.name} onChange={v => update({ name: v })} />
              </div>
              <div style={{ flex: 1 }}>
                <Lbl>Role</Lbl>
                <TextInput value={a.role} onChange={v => update({ role: v })} />
              </div>
              <div style={{ width: 90 }}>
                <Lbl>Sort</Lbl>
                <NumberInput value={a.sort} onChange={v => update({ sort: v })} />
              </div>
            </Row>
            <Lbl>Photo</Lbl>
            <ImageInput value={a.image} onChange={v => update({ image: v })} />
            <Lbl>Bio</Lbl>
            <TextArea value={a.bio} onChange={v => update({ bio: v })} rows={4} />
            <Lbl>Tags (one per slot)</Lbl>
            <ListEditor
              value={a.tags.map(t => ({ _k: crypto.randomUUID(), t }))}
              onChange={arr => update({ tags: arr.map(({ _k, t }) => t) })}
              addLabel="Add tag"
              renderItem={(item, setItem) => (
                <input
                  type="text" value={item.t}
                  onChange={e => setItem({ ...item, t: e.target.value })}
                  style={{ width: "100%", background: "#0c0c0b", color: "#f4ede0", border: "1px solid #2a2a28", borderRadius: 8, padding: ".55rem .7rem", fontSize: ".95rem", outline: "none" }}
                />
              )}
            />
          </Card>
          <div style={{ display: "flex", gap: ".8rem" }}>
            <button onClick={save} type="button" style={saveBtn}>Save instructor</button>
            <button onClick={() => remove(a.id)} type="button" style={delBtn}>Delete</button>
          </div>
        </div>
      ) : <p style={{ opacity: .6 }}>No instructor selected.</p>}
    </div>
  );
}

const newBtn: React.CSSProperties = { width: "100%", background: "transparent", color: "#cdc7b8", border: "1px dashed #2a2a28", borderRadius: 8, padding: ".5rem .9rem", cursor: "pointer", fontSize: ".85rem", marginBottom: ".7rem" };
const itemBtn: React.CSSProperties = { display: "block", width: "100%", textAlign: "left", border: 0, borderRadius: 8, padding: ".55rem .7rem", fontSize: ".9rem", cursor: "pointer", marginBottom: 2 };
const saveBtn: React.CSSProperties = { background: "var(--color-bronze, #8c6a3d)", color: "var(--color-bone, #f4ede0)", border: 0, borderRadius: 10, padding: ".75rem 1.4rem", fontWeight: 600, cursor: "pointer" };
const delBtn: React.CSSProperties = { background: "transparent", color: "#a77070", border: 0, padding: ".5rem .9rem", cursor: "pointer", fontSize: ".9rem" };
