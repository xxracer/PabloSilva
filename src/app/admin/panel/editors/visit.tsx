/**
 * Visit section editor — the "Schedule a visit" block on the home page
 * and the main content of the /contact page. The actual Google Map is
 * loaded on the public page from the hard-coded embed URL.
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
  body: string;
  address: string;
  mapUrl: string;
  image: string;
};

export default function VisitEditor() {
  const [d, setD] = useState<Doc | null>(null);
  useEffect(() => {
    fetch("/api/admin/site/visit").then(r => r.json()).then(j => setD(j.value));
  }, []);
  if (!d) return <p>Loading…</p>;
  function patch(p: Partial<Doc>) { setD({ ...d!, ...p }); }

  return (
    <div>
      <SectionHeader
        title="Visit section"
        where="The 'Schedule a visit' block on the home page (above the footer) and the main content of the /contact page."
      />

      <Card>
        <Lbl hint="Tiny label above the title.">Eyebrow</Lbl>
        <TextInput value={d.eyebrow} onChange={v => patch({ eyebrow: v })} />

        <Lbl hint="The first line of the heading.">Title (regular)</Lbl>
        <TextInput value={d.title} onChange={v => patch({ title: v })} placeholder="Schedule a" />

        <Lbl hint="The second line, shown in italic.">Title (italic line)</Lbl>
        <TextInput value={d.italic} onChange={v => patch({ italic: v })} placeholder="visit." />

        <Lbl hint="Short paragraph shown under the heading. 1–2 sentences.">Body</Lbl>
        <TextArea value={d.body} onChange={v => patch({ body: v })} rows={4} />

        <Lbl hint="The full mailing address, shown on the page and used for the Google Maps link.">Address</Lbl>
        <TextInput value={d.address} onChange={v => patch({ address: v })} placeholder="5233 Bellaire Blvd, Bellaire, TX 77401" />

        <Lbl hint="The Google Maps link used by the 'Open in Maps' button. Paste a share URL from maps.google.com.">Google Maps link</Lbl>
        <TextInput value={d.mapUrl} onChange={v => patch({ mapUrl: v })} placeholder="https://maps.google.com/?q=5233+Bellaire+Blvd+Bellaire+TX" />

        <Lbl hint="Background image used behind the visit section on the home page.">Background image</Lbl>
        <ImageInput value={d.image} onChange={v => patch({ image: v })} />
      </Card>

      <SaveBar
        onSave={async () => {
          const r = await fetch("/api/admin/site/visit", {
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
