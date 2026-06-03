/**
 * Philosophy editor — the section on the home page between the programs
 * and the instructors. Big statement, paragraph body, side image.
 */
"use client";

import { useEffect, useState } from "react";
import {
  SectionHeader, Card, Lbl, TextInput, TextArea, ImageInput, SaveBar,
} from "../ui";

type Doc = {
  eyebrow: string;
  title: string;
  italic: string;
  body: string[];
  image: string;
};

export default function PhilosophyEditor() {
  const [d, setD] = useState<Doc | null>(null);
  useEffect(() => {
    fetch("/api/admin/site/philosophy").then(r => r.json()).then(j => setD(j.value));
  }, []);
  if (!d) return <p>Loading…</p>;
  function patch(p: Partial<Doc>) { setD({ ...d!, ...p }); }

  return (
    <div>
      <SectionHeader
        title="Philosophy"
        where="The big 'A quiet art, practiced seriously.' section between the programs and the instructors on the home page."
      />

      <Card>
        <Lbl hint="Tiny label above the title. Usually numbered, e.g. '01 Philosophy'.">Eyebrow</Lbl>
        <TextInput value={d.eyebrow} onChange={v => patch({ eyebrow: v })} />

        <Lbl hint="The first line of the heading.">Title (regular)</Lbl>
        <TextInput value={d.title} onChange={v => patch({ title: v })} placeholder="A quiet art," />

        <Lbl hint="The second line of the heading, shown in italic.">Title (italic line)</Lbl>
        <TextInput value={d.italic} onChange={v => patch({ italic: v })} placeholder="practiced seriously." />

        <Lbl hint="Each paragraph is a separate block. You can use basic HTML inside (e.g. <strong>...</strong>).">Body — one paragraph per block</Lbl>
        {(d.body || []).map((para, i) => (
          <div key={i} style={{ marginBottom: ".6rem", position: "relative" }}>
            <TextArea
              value={para}
              onChange={v => {
                const next = [...d.body];
                next[i] = v;
                patch({ body: next });
              }}
              rows={4}
            />
            <button
              type="button"
              onClick={() => patch({ body: d.body.filter((_, j) => j !== i) })}
              style={{
                position: "absolute", top: 6, right: 6,
                background: "transparent", border: 0,
                color: "#a77070", cursor: "pointer", fontSize: ".75rem",
              }}
            >Remove</button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => patch({ body: [...d.body, ""] })}
          style={{
            background: "transparent", border: "1px dashed #2a2a28",
            color: "#cdc7b8", borderRadius: 8,
            padding: ".5rem .9rem", fontSize: ".85rem",
            cursor: "pointer", margin: ".3rem 0 .4rem", fontFamily: "inherit",
          }}
        >+ Add paragraph</button>

        <Lbl hint="Side image shown next to the text. Use a tall portrait, 3:4 or 4:5.">Image</Lbl>
        <ImageInput value={d.image} onChange={v => patch({ image: v })} />
      </Card>

      <SaveBar
        onSave={async () => {
          const r = await fetch("/api/admin/site/philosophy", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ value: d }),
          });
          if (!r.ok) throw new Error("Save failed");
        }}
      />
    </div>
  );
}
