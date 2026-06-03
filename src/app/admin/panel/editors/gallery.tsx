/**
 * Gallery editor — the photo grid on the home page. Each photo has a
 * caption (shown on hover), a size (lg / md / sm) that controls how
 * much space the photo takes in the asymmetric grid, and a kind
 * (image / instagram / video) for future expansion.
 */
"use client";

import { useEffect, useState } from "react";
import {
  SectionHeader, Card, Lbl, Row, TextInput, NumberInput, Select, ImageInput, SaveBar, VisibleToggle,
} from "../ui";

type Item = {
  id: string; sort: number; kind: "image" | "instagram" | "video";
  url: string; caption: string; width: "sm" | "md" | "lg"; visible: number;
};

export default function GalleryEditor() {
  const [list, setList] = useState<Item[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/admin/gallery_items").then(r => r.json()).then(j => {
      const rows: Item[] = (j.rows as any[]).map((r) => ({
        id: r.id,
        sort: r.sort ?? 0,
        kind: r.kind ?? "image",
        url: r.url ?? "",
        caption: r.caption ?? "",
        width: r.width ?? "sm",
        visible: r.visible ?? 1,
      }));
      setList(rows);
      if (rows[0]) setActiveId(rows[0].id);
    });
  }, []);
  if (!list) return <p>Loading…</p>;
  const a = list.find(x => x.id === activeId);

  function update(patch: Partial<Item>) {
    setList(list!.map(x => x.id === activeId ? { ...x, ...patch } : x));
  }
  async function save() {
    if (!a) return;
    const r = await fetch(`/api/admin/gallery_items/${a.id}`, {
      method: "PUT", headers: { "content-type": "application/json" },
      body: JSON.stringify(a),
    });
    if (!r.ok) throw new Error("Save failed");
  }
  async function add() {
    const r = await fetch("/api/admin/gallery_items", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({
        kind: "image", url: "/images/gi-detail.jpg",
        caption: "New photo", width: "sm", sort: list!.length + 10, visible: 1,
      }),
    });
    const j = await r.json();
    setList([...list!, j.row]);
    setActiveId(j.row.id);
  }
  async function remove(id: string) {
    if (!confirm("Delete this photo?")) return;
    await fetch(`/api/admin/gallery_items/${id}`, { method: "DELETE" });
    const next = list!.filter(x => x.id !== id);
    setList(next); setActiveId(next[0]?.id ?? null);
  }

  return (
    <div>
      <SectionHeader
        title="Gallery"
        where="The asymmetric photo grid on the home page (between the testimonials and the Instagram feed)."
        intro="Mix large, medium and small photos for a BJJ-magazine feel. Use BJJ-themed shots: training, competition, gi details, the academy, students of all ages. Captions appear on hover."
      />

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "1.2rem" }}>
        <aside>
          <button onClick={add} type="button" style={newBtn}>+ New photo</button>
          {list.map(x => (
            <button
              key={x.id} onClick={() => setActiveId(x.id)} type="button"
              style={{
                ...itemBtn,
                background: activeId === x.id ? "#1a1916" : "transparent",
                color: activeId === x.id ? "#f4ede0" : "#cdc7b8",
                opacity: x.visible ? 1 : .4,
              }}
            >
              {x.caption || x.url || "(untitled)"}
            </button>
          ))}
        </aside>
        {a ? (
          <div>
            <Card>
              <Row>
                <div style={{ flex: 2 }}>
                  <Lbl hint="Short caption shown on hover (e.g. 'Morning open mat', 'Champions class').">Caption</Lbl>
                  <TextInput value={a.caption} onChange={v => update({ caption: v })} />
                </div>
                <div style={{ width: 110 }}>
                  <Lbl hint="Order in the grid. Smaller = first.">Order</Lbl>
                  <NumberInput value={a.sort} onChange={v => update({ sort: v })} />
                </div>
              </Row>
              <Lbl hint="Upload a new photo or paste an image URL.">Image</Lbl>
              <ImageInput value={a.url} onChange={v => update({ url: v })} />
              <Row>
                <div style={{ flex: 1 }}>
                  <Lbl hint="How much space this photo takes in the asymmetric grid AND the aspect ratio of its frame. Pick the size that matches your photo's shape so nothing gets cropped: lg = wide 16:10 (landscape), md = 4:3 (almost square), sm = 3:4 portrait.">Size in grid</Lbl>
                  <Select
                    value={a.width}
                    onChange={v => update({ width: v as "sm" | "md" | "lg" })}
                    options={[
                      { label: "Large · 16:10 wide (landscape)", value: "lg" },
                      { label: "Medium · 4:3 (square-ish)", value: "md" },
                      { label: "Small · 3:4 portrait (vertical)", value: "sm" },
                    ]}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Lbl hint="What the source is.">Kind</Lbl>
                  <Select
                    value={a.kind}
                    onChange={v => update({ kind: v as "image" | "instagram" | "video" })}
                    options={[
                      { label: "Image", value: "image" },
                      { label: "Instagram", value: "instagram" },
                      { label: "Video", value: "video" },
                    ]}
                  />
                </div>
              </Row>
              <Lbl hint="Show this photo on the site, or hide it.">Show on the site</Lbl>
              <VisibleToggle value={a.visible} onChange={v => update({ visible: v })} />
            </Card>
            <div style={{ display: "flex", gap: ".8rem", alignItems: "center" }}>
              <SaveBar onSave={save} label="Save photo" />
              <button onClick={() => remove(a.id)} type="button" style={delBtn}>Delete</button>
            </div>
          </div>
        ) : <p style={{ opacity: .6 }}>No photo selected.</p>}
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
  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
};
const delBtn: React.CSSProperties = {
  background: "transparent", color: "#a77070", border: 0,
  padding: ".5rem .9rem", cursor: "pointer", fontSize: ".9rem", fontFamily: "inherit",
};
