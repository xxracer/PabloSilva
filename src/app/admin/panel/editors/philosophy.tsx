"use client";

import { useEffect, useState } from "react";
import { H1, Card, Lbl, TextInput, TextArea, ImageInput, SaveBar } from "../ui";

export default function PhilosophyEditor() {
  const [d, setD] = useState<any>(null);
  useEffect(() => {
    fetch("/api/admin/site/philosophy").then(r => r.json()).then(j => setD(j.value));
  }, []);
  if (!d) return <p>Loading…</p>;
  function patch(p: any) { setD({ ...d, ...p }); }

  return (
    <div>
      <H1>Philosophy</H1>
      <Card>
        <Lbl>Eyebrow</Lbl>
        <TextInput value={d.eyebrow} onChange={v => patch({ eyebrow: v })} />
        <Lbl>Title</Lbl>
        <TextInput value={d.title} onChange={v => patch({ title: v })} />
        <Lbl>Body</Lbl>
        <TextArea value={d.body} onChange={v => patch({ body: v })} rows={5} />
        <Lbl>Image</Lbl>
        <ImageInput value={d.image} onChange={v => patch({ image: v })} />
      </Card>
      <SaveBar
        onSave={async () => {
          await fetch("/api/admin/site/philosophy", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ value: d }),
          });
        }}
      />
    </div>
  );
}
