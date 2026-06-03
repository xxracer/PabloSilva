/**
 * Contact section editor — the contact details (email, phone, WhatsApp)
 * shown next to the visit form. NOT the visit form fields themselves
 * (those are static and live in the form component).
 */
"use client";

import { useEffect, useState } from "react";
import {
  SectionHeader, Card, Lbl, TextInput, TextArea, SaveBar,
} from "../ui";

type Doc = {
  eyebrow: string;
  title: string;
  body: string;
  email: string;
  phone: string;
  whatsapp: string;
};

export default function ContactEditor() {
  const [d, setD] = useState<Doc | null>(null);
  useEffect(() => {
    fetch("/api/admin/site/contact").then(r => r.json()).then(j => setD(j.value));
  }, []);
  if (!d) return <p>Loading…</p>;
  function patch(p: Partial<Doc>) { setD({ ...d!, ...p }); }

  return (
    <div>
      <SectionHeader
        title="Contact details"
        where="The contact block on the /contact page — the heading, the email, phone, and the WhatsApp link."
      />

      <Card>
        <Lbl hint="Tiny label above the heading.">Eyebrow</Lbl>
        <TextInput value={d.eyebrow} onChange={v => patch({ eyebrow: v })} />

        <Lbl hint="The main heading of the contact block.">Title</Lbl>
        <TextInput value={d.title} onChange={v => patch({ title: v })} placeholder="Say hello." />

        <Lbl hint="Short intro paragraph under the heading.">Body</Lbl>
        <TextArea value={d.body} onChange={v => patch({ body: v })} rows={3} />

        <Lbl hint="Shown as a mailto: link. Use a real email address.">Email</Lbl>
        <TextInput value={d.email} onChange={v => patch({ email: v })} type="email" placeholder="pablosilvabjj@gmail.com" />

        <Lbl hint="Display format, e.g. +1 (346) 303-9572. Used for the 'Call' button.">Phone (display)</Lbl>
        <TextInput value={d.phone} onChange={v => patch({ phone: v })} placeholder="+1 (346) 303-9572" />

        <Lbl hint="Digits only, with country code. Used for the WhatsApp link, e.g. 13463039572.">WhatsApp number</Lbl>
        <TextInput value={d.whatsapp} onChange={v => patch({ whatsapp: v })} placeholder="13463039572" />
      </Card>

      <SaveBar
        onSave={async () => {
          const r = await fetch("/api/admin/site/contact", {
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
