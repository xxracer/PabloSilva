"use client";

import { useEffect, useState } from "react";
import { H1, Card, Lbl, TextInput, TextArea, SaveBar } from "../ui";

export default function ContactEditor() {
  const [d, setD] = useState<any>(null);
  useEffect(() => {
    fetch("/api/admin/site/contact").then(r => r.json()).then(j => setD(j.value));
  }, []);
  if (!d) return <p>Loading…</p>;
  function patch(p: any) { setD({ ...d, ...p }); }

  return (
    <div>
      <H1>Contact</H1>
      <Card>
        <Lbl>Eyebrow</Lbl>
        <TextInput value={d.eyebrow} onChange={v => patch({ eyebrow: v })} />
        <Lbl>Title</Lbl>
        <TextInput value={d.title} onChange={v => patch({ title: v })} />
        <Lbl>Body</Lbl>
        <TextArea value={d.body} onChange={v => patch({ body: v })} rows={3} />
        <Lbl>Email</Lbl>
        <TextInput value={d.email} onChange={v => patch({ email: v })} />
        <Lbl>Phone</Lbl>
        <TextInput value={d.phone} onChange={v => patch({ phone: v })} />
        <Lbl>WhatsApp (digits only, with country code)</Lbl>
        <TextInput value={d.whatsapp} onChange={v => patch({ whatsapp: v })} />
      </Card>
      <SaveBar
        onSave={async () => {
          await fetch("/api/admin/site/contact", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ value: d }),
          });
        }}
      />
    </div>
  );
}
