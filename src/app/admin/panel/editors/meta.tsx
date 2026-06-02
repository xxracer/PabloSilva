"use client";

import { useEffect, useState } from "react";
import { H1, Card, Lbl, TextInput, TextArea, ImageInput, SaveBar } from "../ui";

export default function MetaEditor() {
  const [d, setD] = useState<any>(null);
  useEffect(() => {
    fetch("/api/admin/site/meta").then(r => r.json()).then(j => setD(j.value));
  }, []);
  if (!d) return <p>Loading…</p>;
  function patch(p: any) { setD({ ...d, ...p }); }

  return (
    <div>
      <H1>Site Meta</H1>
      <Card>
        <Lbl>Title</Lbl>
        <TextInput value={d.title} onChange={v => patch({ title: v })} />
        <Lbl>Description</Lbl>
        <TextArea value={d.description} onChange={v => patch({ description: v })} rows={3} />
        <Lbl>OG Image</Lbl>
        <ImageInput value={d.ogImage} onChange={v => patch({ ogImage: v })} />
        <Lbl>Instagram</Lbl>
        <TextInput value={d.instagram} onChange={v => patch({ instagram: v })} />
        <Lbl>YouTube</Lbl>
        <TextInput value={d.youtube} onChange={v => patch({ youtube: v })} />
        <Lbl>Footer credit</Lbl>
        <TextInput value={d.footerCredit} onChange={v => patch({ footerCredit: v })} />
      </Card>
      <SaveBar
        onSave={async () => {
          await fetch("/api/admin/site/meta", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ value: d }),
          });
        }}
      />
    </div>
  );
}
