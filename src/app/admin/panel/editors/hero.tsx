"use client";

import { useEffect, useState } from "react";
import { H1, Lbl, Card, Row, SaveBar, TextInput, TextArea, ImageInput, ListEditor } from "../ui";
import type { HeroData, CTA, ValueItem, Social } from "@/lib/types";

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
      <H1>Hero</H1>
      <Card>
        <Lbl>Eyebrow</Lbl>
        <TextInput value={d.eyebrow} onChange={v => patch({ eyebrow: v })} />
        <Lbl>Title lines (one per line)</Lbl>
        <ListEditor
          value={d.titleLines.map(s => ({ _k: crypto.randomUUID(), s }))}
          onChange={arr => setTitleLines(arr.map(({ _k, s }) => s))}
          addLabel="Add line"
          renderItem={(item, setItem) => (
            <input
              type="text"
              value={item.s}
              onChange={e => setItem({ ...item, s: e.target.value })}
              style={{
                width: "100%",
                background: "#0c0c0b",
                color: "#f4ede0",
                border: "1px solid #2a2a28",
                borderRadius: 8,
                padding: ".55rem .7rem",
                fontSize: ".95rem",
                outline: "none",
              }}
            />
          )}
        />
        <Lbl>Subtitle</Lbl>
        <TextArea value={d.subtitle} onChange={v => patch({ subtitle: v })} rows={3} />
      </Card>

      <Card>
        <H1>Portrait</H1>
        <ImageInput value={d.portrait} onChange={v => patch({ portrait: v })} />
      </Card>

      <Card>
        <H1>Primary CTA</H1>
        <Row>
          <div style={{ flex: 1 }}>
            <Lbl>Label</Lbl>
            <TextInput value={d.ctaPrimary.label} onChange={v => patch({ ctaPrimary: { ...d.ctaPrimary, label: v } })} />
          </div>
          <div style={{ flex: 1 }}>
            <Lbl>URL</Lbl>
            <TextInput value={d.ctaPrimary.href} onChange={v => patch({ ctaPrimary: { ...d.ctaPrimary, href: v } })} />
          </div>
        </Row>
      </Card>

      <Card>
        <H1>Secondary CTA</H1>
        <Row>
          <div style={{ flex: 1 }}>
            <Lbl>Label</Lbl>
            <TextInput value={d.ctaSecondary.label} onChange={v => patch({ ctaSecondary: { ...d.ctaSecondary, label: v } })} />
          </div>
          <div style={{ flex: 1 }}>
            <Lbl>URL</Lbl>
            <TextInput value={d.ctaSecondary.href} onChange={v => patch({ ctaSecondary: { ...d.ctaSecondary, href: v } })} />
          </div>
        </Row>
      </Card>

      <Card>
        <H1>Social</H1>
        <ListEditor
          value={d.social.map(s => ({ ...s, _k: crypto.randomUUID() }))}
          onChange={arr => setSocial(arr.map(({ _k, ...rest }) => rest))}
          addLabel="Add social"
          renderItem={(item, setItem) => (
            <Row>
              <div style={{ flex: 1 }}>
                <Lbl>Label</Lbl>
                <TextInput value={item.label} onChange={v => setItem({ ...item, label: v })} />
              </div>
              <div style={{ flex: 1 }}>
                <Lbl>URL</Lbl>
                <TextInput value={item.href} onChange={v => setItem({ ...item, href: v })} />
              </div>
            </Row>
          )}
        />
      </Card>

      <Card>
        <H1>Values (3 cards)</H1>
        <ListEditor
          value={d.values.map(v => ({ ...v, _k: crypto.randomUUID() }))}
          onChange={arr => setValues(arr.map(({ _k, ...rest }) => rest))}
          addLabel="Add value"
          renderItem={(item, setItem) => (
            <div>
              <Row>
                <div style={{ flex: 1 }}>
                  <Lbl>Title</Lbl>
                  <TextInput value={item.title} onChange={v => setItem({ ...item, title: v })} />
                </div>
              </Row>
              <Lbl>Body</Lbl>
              <TextArea value={item.body} onChange={v => setItem({ ...item, body: v })} rows={2} />
            </div>
          )}
        />
      </Card>

      <SaveBar
        onSave={async () => {
          await fetch("/api/admin/site/hero", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ value: d }),
          });
        }}
      />
    </div>
  );
}
