/**
 * Instagram Feed — list of public Instagram post URLs rendered as embeds.
 * Edited from the admin panel. The "Latest from Instagram" section on
 * the home page reads from this and renders native Instagram iframes.
 */
"use client";

import { useEffect, useState } from "react";
import {
  SectionHeader, Card, Lbl, Row, TextInput, TextArea, ListEditor, SaveBar,
} from "../ui";
import { detectEmbed, type EmbedResult } from "@/lib/embeds";

type Item = { _k?: string; url: string; caption: string };

function validateUrl(url: string): { ok: boolean; reason?: string; embed?: EmbedResult } {
  const trimmed = url.trim();
  if (!trimmed) return { ok: false, reason: "Empty" };
  const e = detectEmbed(trimmed);
  if (e.kind === "instagram") return { ok: true, embed: e };
  return { ok: false, reason: "Not a recognizable Instagram post link" };
}

export default function InstagramFeedEditor() {
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/site/instagram_feed")
      .then(r => r.json())
      .then(j => {
        const arr = Array.isArray(j.value) ? j.value : [];
        setItems(arr.map((x: Item) => ({ url: x.url ?? "", caption: x.caption ?? "" })));
      });
  }, []);

  if (!items) return <p>Loading…</p>;

  return (
    <div>
      <SectionHeader
        title="Instagram feed"
        where="Shown on the home page, in the 'Latest from Instagram' section, between the gallery and the visit section."
        intro="Paste the public URL of each Instagram post or reel. Each one will appear as a native Instagram embed on the home page. Drag, add or remove items freely — visitors see them in the same order shown here."
      />

      <Card>
        <Lbl hint="The official academy handle.">Public Instagram URL of each post</Lbl>
        <ListEditor
          value={items.map((x, i) => ({ ...x, _k: `ig-${i}-${x.url.slice(-6)}` }))}
          onChange={arr => setItems(arr.map(({ _k, ...rest }) => rest))}
          addLabel="Add post"
          emptyText="No posts yet — add your first one below."
          renderItem={(item, setItem, idx) => {
            const v = validateUrl(item.url);
            return (
              <div>
                <Row>
                  <div style={{ flex: 1 }}>
                    <Lbl>Post URL</Lbl>
                    <TextInput
                      value={item.url}
                      onChange={v => setItem({ ...item, url: v })}
                      placeholder="https://www.instagram.com/p/XXXXX/"
                    />
                    {item.url && !v.ok && (
                      <div style={{ fontSize: ".78rem", color: "#d9a8a8", marginTop: ".25rem" }}>
                        {v.reason}
                      </div>
                    )}
                    {item.url && v.ok && (
                      <div style={{ fontSize: ".78rem", color: "#a8d9b6", marginTop: ".25rem" }}>
                        Looks good — will render as Instagram embed.
                      </div>
                    )}
                  </div>
                </Row>
                <Lbl hint="Optional caption shown below the embed on the home page.">Caption (optional)</Lbl>
                <TextArea
                  value={item.caption}
                  onChange={v => setItem({ ...item, caption: v })}
                  rows={2}
                  placeholder="e.g. 'Coach Pablo drilling a knee-cut pass at the morning fundamentals class.'"
                />
                <div style={{ fontSize: ".72rem", opacity: .45, marginTop: ".4rem" }}>
                  Item #{idx + 1} of {items.length}
                </div>
              </div>
            );
          }}
        />
      </Card>

      <SaveBar
        onSave={async () => {
          // Filter out empty rows before saving.
          const clean = items
            .map(({ _k, ...rest }) => rest)
            .filter(x => x.url.trim() !== "");
          const r = await fetch("/api/admin/site/instagram_feed", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ value: clean }),
          });
          if (!r.ok) throw new Error("Save failed");
          setItems(clean);
        }}
      />
    </div>
  );
}
