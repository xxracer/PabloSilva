"use client";

import { useEffect, useState } from "react";
import { H1, Card, Lbl, ListEditor, SaveBar } from "../ui";

export default function MarqueeEditor() {
  const [d, setD] = useState<{ items: string[] } | null>(null);
  useEffect(() => {
    fetch("/api/admin/site/marquee").then(r => r.json()).then(j => setD(j.value));
  }, []);
  if (!d) return <p>Loading…</p>;
  return (
    <div>
      <H1>Marquee</H1>
      <Card>
        <Lbl>Items (scroll left-to-right in the band)</Lbl>
        <ListEditor
          value={d.items.map(s => ({ _k: crypto.randomUUID(), s }))}
          onChange={arr => setD({ items: arr.map(({ _k, s }) => s) })}
          addLabel="Add item"
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
      </Card>
      <SaveBar
        onSave={async () => {
          await fetch("/api/admin/site/marquee", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ value: d }),
          });
        }}
      />
    </div>
  );
}
