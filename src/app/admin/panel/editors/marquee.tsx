/**
 * Marquee editor — the thin band of words that scrolls left-to-right
 * right below the hero on the home page. Pure decoration, no links.
 */
"use client";

import { useEffect, useState } from "react";
import {
  SectionHeader, Card, Lbl, ListEditor, SaveBar,
} from "../ui";

export default function MarqueeEditor() {
  const [d, setD] = useState<{ items: string[] } | null>(null);
  useEffect(() => {
    fetch("/api/admin/site/marquee").then(r => r.json()).then(j => {
      const v = j.value;
      setD({ items: Array.isArray(v) ? v : [] });
    });
  }, []);
  if (!d) return <p>Loading…</p>;

  return (
    <div>
      <SectionHeader
        title="Scrolling band"
        where="A thin band of single words that scrolls continuously under the hero on the home page."
        intro="No links, no formatting — just a list of short words or short phrases. Add or remove freely. The band is decorative."
      />

      <Card>
        <Lbl hint="One short word or phrase per line. The band will keep scrolling them in a loop.">Words in the band</Lbl>
        <ListEditor
          value={d.items.map((s, i) => ({ _k: `m-${i}`, s }))}
          onChange={arr => setD({ items: arr.map(({ _k, s }) => s) })}
          addLabel="Add word"
          emptyText="No words yet — add your first one below."
          renderItem={(item, setItem) => (
            <input
              type="text" value={item.s}
              onChange={e => setItem({ ...item, s: e.target.value })}
              placeholder="e.g. Confidence"
              style={{
                width: "100%", background: "#0c0c0b", color: "#f4ede0",
                border: "1px solid #2a2a28", borderRadius: 8,
                padding: ".55rem .7rem", fontSize: ".95rem", outline: "none",
                fontFamily: "inherit",
              }}
            />
          )}
        />
      </Card>

      <SaveBar
        onSave={async () => {
          const r = await fetch("/api/admin/site/marquee", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ value: d.items.filter(s => s.trim() !== "") }),
          });
          if (!r.ok) throw new Error("Save failed");
        }}
      />
    </div>
  );
}
