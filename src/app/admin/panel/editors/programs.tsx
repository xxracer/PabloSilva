"use client";

import { useEffect, useState } from "react";
import {
  H1, Card, Lbl, Row, TextInput, TextArea, NumberInput, Select, SaveBar,
  ListEditor, ImageInput, UploadButton,
} from "../ui";

type Embed = { kind: string; url: string; aspect: string };
type DetailItem = string | Embed;
type Program = {
  id: string; slug: string; title: string; ageRange: string; tagline: string;
  description: string; image: string; ctaLabel: string; ctaHref: string;
  ctaLabel2?: string; ctaHref2?: string; sort: number; visible: number;
  details: DetailItem[];
};

function parseRow(r: any): Program {
  return { ...r, details: r.details_json ? JSON.parse(r.details_json) : [] };
}

export default function ProgramsEditor() {
  const [list, setList] = useState<Program[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/programs").then(r => r.json()).then(j => {
      const rows = (j.rows as any[]).map(parseRow);
      setList(rows);
      if (rows[0]) setActiveId(rows[0].id);
    });
  }, []);

  if (!list) return <p>Loading…</p>;
  const active = list.find(p => p.id === activeId);

  function updateActive(patch: Partial<Program>) {
    setList(list!.map(p => p.id === activeId ? { ...p, ...patch } : p));
  }
  function setDetails(d: DetailItem[]) { updateActive({ details: d }); }

  async function save() {
    if (!active) return;
    const body = { ...active, details_json: JSON.stringify(active.details) };
    delete (body as any).details;
    await fetch(`/api/admin/programs/${active.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  }
  async function remove(id: string) {
    if (!confirm("Delete this program?")) return;
    await fetch(`/api/admin/programs/${id}`, { method: "DELETE" });
    const next = list!.filter(p => p.id !== id);
    setList(next);
    setActiveId(next[0]?.id ?? null);
  }
  async function add() {
    const r = await fetch("/api/admin/programs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        slug: "new-program", title: "New program", ageRange: "", tagline: "",
        description: "", image: "", ctaLabel: "Book a Trial", ctaHref: "/contact",
        sort: list!.length + 10, visible: 1, details_json: "[]",
      }),
    });
    const j = await r.json();
    const row = parseRow(j.row);
    setList([...list!, row]);
    setActiveId(row.id);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "1.2rem" }}>
      <aside>
        <H1>Programs</H1>
        <button onClick={add} type="button" style={{
          width: "100%", background: "transparent", color: "#cdc7b8",
          border: "1px dashed #2a2a28", borderRadius: 8,
          padding: ".5rem .9rem", cursor: "pointer", fontSize: ".85rem", marginBottom: ".7rem",
        }}>+ New program</button>
        {list.map(p => (
          <button
            key={p.id}
            onClick={() => setActiveId(p.id)}
            type="button"
            style={{
              display: "block", width: "100%", textAlign: "left",
              background: activeId === p.id ? "#1a1916" : "transparent",
              color: activeId === p.id ? "#f4ede0" : "#cdc7b8",
              border: 0, borderRadius: 8, padding: ".55rem .7rem",
              fontSize: ".9rem", cursor: "pointer", marginBottom: 2,
            }}
          >
            {p.title || "(untitled)"}
          </button>
        ))}
      </aside>

      {active ? (
        <div>
          <H1>{active.title || "(untitled)"}</H1>
          <Card>
            <Row>
              <div style={{ flex: 1 }}>
                <Lbl>Title</Lbl>
                <TextInput value={active.title} onChange={v => updateActive({ title: v })} />
              </div>
              <div style={{ width: 130 }}>
                <Lbl>Sort</Lbl>
                <NumberInput value={active.sort} onChange={v => updateActive({ sort: v })} />
              </div>
            </Row>
            <Row>
              <div style={{ flex: 1 }}>
                <Lbl>Slug</Lbl>
                <TextInput value={active.slug} onChange={v => updateActive({ slug: v })} />
              </div>
              <div style={{ flex: 1 }}>
                <Lbl>Age range</Lbl>
                <TextInput value={active.ageRange} onChange={v => updateActive({ ageRange: v })} />
              </div>
            </Row>
            <Lbl>Tagline (large heading)</Lbl>
            <TextArea value={active.tagline} onChange={v => updateActive({ tagline: v })} rows={2} />
            <Lbl>Description</Lbl>
            <TextArea value={active.description} onChange={v => updateActive({ description: v })} rows={4} />
            <Lbl>Hero image</Lbl>
            <ImageInput value={active.image} onChange={v => updateActive({ image: v })} />
            <Row>
              <div style={{ flex: 1 }}>
                <Lbl>CTA label</Lbl>
                <TextInput value={active.ctaLabel} onChange={v => updateActive({ ctaLabel: v })} />
              </div>
              <div style={{ flex: 1 }}>
                <Lbl>CTA URL</Lbl>
                <TextInput value={active.ctaHref} onChange={v => updateActive({ ctaHref: v })} />
              </div>
            </Row>
            <Row>
              <div style={{ flex: 1 }}>
                <Lbl>Secondary CTA label (optional)</Lbl>
                <TextInput value={active.ctaLabel2 ?? ""} onChange={v => updateActive({ ctaLabel2: v })} />
              </div>
              <div style={{ flex: 1 }}>
                <Lbl>Secondary CTA URL</Lbl>
                <TextInput value={active.ctaHref2 ?? ""} onChange={v => updateActive({ ctaHref2: v })} />
              </div>
            </Row>
            <Lbl>Visible</Lbl>
            <Select
              value={String(active.visible)}
              onChange={v => updateActive({ visible: Number(v) })}
              options={[{ label: "Yes", value: "1" }, { label: "No", value: "0" }]}
            />
          </Card>

          <Card>
            <H1>Detail blocks</H1>
            <p style={{ opacity: .6, fontSize: ".85rem", marginTop: 0 }}>
              Each block is either a paragraph (text) or an embed (image / Instagram / YouTube / Vimeo link).
            </p>
            <ListEditor
              value={active.details.map((d, i) => ({ _k: `${active.id}-${i}`, raw: d }))}
              onChange={arr => setDetails(arr.map(({ _k, raw }) => raw))}
              addLabel="Add block"
              renderItem={(item, setItem, idx) => {
                const isEmbed = typeof item.raw === "object" && item.raw !== null;
                return (
                  <div>
                    <div style={{ display: "flex", gap: ".5rem", marginBottom: ".4rem" }}>
                      <button
                        type="button"
                        onClick={() => setItem({ _k: item._k, raw: typeof item.raw === "string" ? item.raw : "" })}
                        style={{
                          background: !isEmbed ? "#1a1916" : "transparent",
                          color: !isEmbed ? "#f4ede0" : "#cdc7b8",
                          border: "1px solid #2a2a28", borderRadius: 6,
                          padding: ".25rem .6rem", fontSize: ".78rem", cursor: "pointer",
                        }}
                      >Paragraph</button>
                      <button
                        type="button"
                        onClick={() => setItem({ _k: item._k, raw: { kind: "instagram", url: "", aspect: "4/5" } })}
                        style={{
                          background: isEmbed ? "#1a1916" : "transparent",
                          color: isEmbed ? "#f4ede0" : "#cdc7b8",
                          border: "1px solid #2a2a28", borderRadius: 6,
                          padding: ".25rem .6rem", fontSize: ".78rem", cursor: "pointer",
                        }}
                      >Embed</button>
                    </div>
                    {!isEmbed ? (
                      <TextArea
                        value={item.raw as string}
                        onChange={v => setItem({ _k: item._k, raw: v })}
                        rows={3}
                      />
                    ) : (
                      <div>
                        <Lbl>Source</Lbl>
                        <div style={{ display: "flex", gap: ".5rem" }}>
                          <TextInput
                            value={(item.raw as Embed).url}
                            onChange={v => setItem({ _k: item._k, raw: { ...(item.raw as Embed), url: v } })}
                          />
                          <UploadButton
                            label="Upload image"
                            onUploaded={(url) => setItem({ _k: item._k, raw: { ...(item.raw as Embed), kind: "image", url, aspect: (item.raw as Embed).aspect ?? "4/5" } })}
                          />
                        </div>
                        <Row>
                          <div style={{ flex: 1 }}>
                            <Lbl>Kind</Lbl>
                            <Select
                              value={(item.raw as Embed).kind}
                              onChange={v => setItem({ _k: item._k, raw: { ...(item.raw as Embed), kind: v } })}
                              options={[
                                { label: "Image", value: "image" },
                                { label: "Instagram", value: "instagram" },
                                { label: "YouTube", value: "youtube" },
                                { label: "Vimeo", value: "vimeo" },
                              ]}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <Lbl>Aspect</Lbl>
                            <Select
                              value={(item.raw as Embed).aspect}
                              onChange={v => setItem({ _k: item._k, raw: { ...(item.raw as Embed), aspect: v } })}
                              options={[
                                { label: "16:9 (video)", value: "16/9" },
                                { label: "4:5 (portrait)", value: "4/5" },
                                { label: "1:1 (square)", value: "1/1" },
                                { label: "9:16 (story)", value: "9/16" },
                                { label: "4:3", value: "4/3" },
                              ]}
                            />
                          </div>
                        </Row>
                      </div>
                    )}
                  </div>
                );
              }}
            />
          </Card>

          <div style={{ display: "flex", gap: ".8rem", alignItems: "center" }}>
            <button onClick={save} type="button" style={{
              background: "var(--color-bronze, #8c6a3d)", color: "var(--color-bone, #f4ede0)",
              border: 0, borderRadius: 10, padding: ".75rem 1.4rem", fontWeight: 600, cursor: "pointer",
            }}>Save program</button>
            <button onClick={() => remove(active.id)} type="button" style={{
              background: "transparent", color: "#a77070", border: 0,
              padding: ".5rem .9rem", cursor: "pointer", fontSize: ".9rem",
            }}>Delete program</button>
          </div>
        </div>
      ) : (
        <p style={{ opacity: .6 }}>No program selected. Create one with the button on the left.</p>
      )}
    </div>
  );
}
