"use client";

/**
 * Hero editor — the top of the home page.
 *   eyebrow       small uppercase label above the title
 *   titleLines    the giant display title (3 lines; the 3rd renders in italic)
 *   subtitle      paragraph below the title
 *   portrait      the professor photo on the right
 *   ctaPrimary    main call-to-action button
 *   ctaSecondary  secondary button
 *   social        links shown in the hero (Instagram, Facebook, etc.)
 *   values        the four cards below the hero
 */
import { useEffect, useState } from "react";
import {
  SectionHeader, Card, Lbl, Row, TextInput, TextArea, ImageInput,
  ListEditor, SaveBar,
} from "../ui";
import type { CTA, ValueItem, Social } from "@/lib/types";

type Doc = {
  eyebrow: string;
  titleLines: string[];
  subtitle: string;
  ctaPrimary: CTA;
  ctaSecondary: CTA;
  social: Social[];
  values: ValueItem[];
  portrait: string;
};

export default function HeroEditor() {
  const [d, setD] = useState<Doc | null>(null);

  useEffect(() => {
    fetch("/api/admin/site/hero").then(r => r.json()).then(j => setD(j.value));
  }, []);

  if (!d) return <p>Loading…</p>;

  function patch(p: Partial<Doc>) { setD({ ...d!, ...p }); }
  function setTitleLines(arr: string[]) { patch({ titleLines: arr }); }
  function setValues(arr: ValueItem[]) { patch({ values: arr }); }
  function setSocial(arr: Social[]) { patch({ social: arr }); }

  return (
    <div>
      <SectionHeader
        title="Hero"
        where="The very first section of the home page — the big title, the subtitle, the photo, and the main buttons."
        intro="These are the most visible words on the site. Keep the title short and confident."
      />

      <Card>
        <H2 sub="The big three-line display title at the top of the home page.">Title</H2>
        <Lbl hint="Small uppercase label shown above the title. Empty = hidden.">Eyebrow</Lbl>
        <TextInput value={d.eyebrow} onChange={v => patch({ eyebrow: v })} placeholder="Bellaire, Texas · Established academy" />

        <Lbl hint="Up to 3 lines. The 3rd line is rendered in italic. Keep each line short — they appear very large.">Title lines (one per line)</Lbl>
        <ListEditor
          value={d.titleLines.map((s, i) => ({ _k: `tl-${i}`, s }))}
          onChange={arr => setTitleLines(arr.map(({ _k, s }) => s))}
          addLabel="Add line"
          renderItem={(item, setItem) => (
            <input
              type="text" value={item.s}
              onChange={e => setItem({ ...item, s: e.target.value })}
              placeholder={item.s === "" ? "e.g. Where champions are made." : ""}
              style={{
                width: "100%", background: "#0c0c0b", color: "#f4ede0",
                border: "1px solid #2a2a28", borderRadius: 8,
                padding: ".55rem .7rem", fontSize: ".95rem", outline: "none",
                fontFamily: "inherit",
              }}
            />
          )}
        />

        <Lbl hint="A short paragraph (1–3 sentences) shown below the title.">Subtitle</Lbl>
        <TextArea value={d.subtitle} onChange={v => patch({ subtitle: v })} rows={3} />
      </Card>

      <Card>
        <H2 sub="The right-side photo of the professor on the home page hero.">Portrait photo</H2>
        <Lbl hint="Use a tall portrait image, ideally 3:4 or 4:5 aspect ratio.">Image</Lbl>
        <ImageInput value={d.portrait} onChange={v => patch({ portrait: v })} />
      </Card>

      <Card>
        <H2 sub="The main and secondary call-to-action buttons in the hero.">Buttons</H2>
        <Row>
          <div style={{ flex: 1 }}>
            <Lbl hint="The most prominent button — usually 'Book a free trial'.">Primary button — label</Lbl>
            <TextInput value={d.ctaPrimary.label} onChange={v => patch({ ctaPrimary: { ...d.ctaPrimary, label: v } })} />
          </div>
          <div style={{ flex: 1 }}>
            <Lbl hint="Where the button links to (e.g. /contact, /programs).">Primary button — URL</Lbl>
            <TextInput value={d.ctaPrimary.href} onChange={v => patch({ ctaPrimary: { ...d.ctaPrimary, href: v } })} />
          </div>
        </Row>
        <Row>
          <div style={{ flex: 1 }}>
            <Lbl hint="The secondary button, shown next to the primary.">Secondary button — label</Lbl>
            <TextInput value={d.ctaSecondary.label} onChange={v => patch({ ctaSecondary: { ...d.ctaSecondary, label: v } })} />
          </div>
          <div style={{ flex: 1 }}>
            <Lbl hint="Where the secondary button links to.">Secondary button — URL</Lbl>
            <TextInput value={d.ctaSecondary.href} onChange={v => patch({ ctaSecondary: { ...d.ctaSecondary, href: v } })} />
          </div>
        </Row>
      </Card>

      <Card>
        <H2 sub="Social media links shown in the hero (Instagram, Facebook, etc.).">Social links</H2>
        <Lbl hint="Add, remove, or reorder these. Each one becomes a small link chip in the hero.">Social links</Lbl>
        <ListEditor
          value={d.social.map((s, i) => ({ ...s, _k: `soc-${i}` }))}
          onChange={arr => setSocial(arr.map(({ _k, ...rest }) => rest))}
          addLabel="Add social link"
          renderItem={(item, setItem) => (
            <Row>
              <div style={{ flex: 1 }}>
                <Lbl>Label (e.g. "Instagram", "Facebook", "YouTube")</Lbl>
                <TextInput value={item.label} onChange={v => setItem({ ...item, label: v })} />
              </div>
              <div style={{ flex: 1 }}>
                <Lbl>Full URL</Lbl>
                <TextInput value={item.href} onChange={v => setItem({ ...item, href: v })} placeholder="https://instagram.com/pablosilvabjjhq" />
              </div>
            </Row>
          )}
        />
      </Card>

      <Card>
        <H2 sub="The four short value cards under the hero (Confidence, Discipline, etc.).">Value cards</H2>
        <Lbl hint="Each one becomes a small card. The standard four are Confidence, Self-Defense, Discipline, Respect — but you can change them.">Value cards</Lbl>
        <ListEditor
          value={d.values.map((v, i) => ({ ...v, _k: `val-${i}` }))}
          onChange={arr => setValues(arr.map(({ _k, ...rest }) => rest))}
          addLabel="Add value card"
          renderItem={(item, setItem) => (
            <div>
              <Row>
                <div style={{ flex: 1 }}>
                  <Lbl>Title</Lbl>
                  <TextInput value={item.title} onChange={v => setItem({ ...item, title: v })} placeholder="e.g. Confidence" />
                </div>
              </Row>
              <Lbl hint="A short sentence — one line on the card.">Body</Lbl>
              <TextArea value={item.body} onChange={v => setItem({ ...item, body: v })} rows={2} />
            </div>
          )}
        />
      </Card>

      <SaveBar
        onSave={async () => {
          const r = await fetch("/api/admin/site/hero", {
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
      <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "1.05rem", fontWeight: 500, margin: 0, letterSpacing: "-0.01em" }}>{children}</h2>
      {sub && <div style={{ fontSize: ".8rem", opacity: .55, marginTop: ".2rem", lineHeight: 1.45 }}>{sub}</div>}
    </div>
  );
}
