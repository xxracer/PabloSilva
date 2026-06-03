/**
 * Site meta — the title shown on the browser tab, the description that
 * shows on Google, the Open Graph image used when the site is shared on
 * social media, and the social profile URLs + footer credit.
 */
"use client";

import { useEffect, useState } from "react";
import {
  SectionHeader, Card, Lbl, TextInput, TextArea, ImageInput, SaveBar,
} from "../ui";

type Doc = {
  title: string;
  description: string;
  ogImage: string;
  instagram: string;
  youtube: string;
  footerCredit: string;
};

export default function MetaEditor() {
  const [d, setD] = useState<Doc | null>(null);
  useEffect(() => {
    fetch("/api/admin/site/meta").then(r => r.json()).then(j => setD(j.value));
  }, []);
  if (!d) return <p>Loading…</p>;
  function patch(p: Partial<Doc>) { setD({ ...d!, ...p }); }

  return (
    <div>
      <SectionHeader
        title="Site meta & SEO"
        where="Not visible on the page itself — but it's what shows on Google, on the browser tab, and when someone shares the site on social media."
      />

      <Card>
        <H2 sub="What shows on the browser tab and as the Google search result title.">Browser tab & Google</H2>
        <Lbl hint="Aim for 50–60 characters.">Page title</Lbl>
        <TextInput value={d.title} onChange={v => patch({ title: v })} />

        <Lbl hint="Aim for 140–160 characters. Shown in Google search results and in social previews.">Meta description</Lbl>
        <TextArea value={d.description} onChange={v => patch({ description: v })} rows={3} />
      </Card>

      <Card>
        <H2 sub="The big preview image used when someone shares the site on Facebook, Twitter, LinkedIn, iMessage, etc.">Social share image</H2>
        <Lbl hint="Use a 1200x630 image (landscape). This is the default image used when a link to the home page is shared.">Open Graph image</Lbl>
        <ImageInput value={d.ogImage} onChange={v => patch({ ogImage: v })} />
      </Card>

      <Card>
        <H2 sub="The academy's social media URLs.">Social profiles</H2>
        <Lbl hint="Full URL to the academy's Instagram profile.">Instagram URL</Lbl>
        <TextInput value={d.instagram} onChange={v => patch({ instagram: v })} placeholder="https://instagram.com/pablosilvabjjhq" />

        <Lbl hint="Full URL to the YouTube channel, if any.">YouTube URL</Lbl>
        <TextInput value={d.youtube} onChange={v => patch({ youtube: v })} placeholder="https://youtube.com/@pablosilvabjj" />
      </Card>

      <Card>
        <H2 sub="Small copyright line at the bottom of every page.">Footer</H2>
        <Lbl hint="Tiny line in the very bottom of the site.">Footer credit</Lbl>
        <TextInput value={d.footerCredit} onChange={v => patch({ footerCredit: v })} />
      </Card>

      <SaveBar
        onSave={async () => {
          const r = await fetch("/api/admin/site/meta", {
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

function H2({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div style={{ marginBottom: ".7rem" }}>
      <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "1.05rem", fontWeight: 500, margin: 0 }}>{children}</h2>
      {sub && <div style={{ fontSize: ".8rem", opacity: .55, marginTop: ".15rem", lineHeight: 1.45 }}>{sub}</div>}
    </div>
  );
}
