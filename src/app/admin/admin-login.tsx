"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [secret, setSecret] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  function go(e: React.FormEvent) {
    e.preventDefault();
    if (!secret.trim()) {
      setErr("Paste your admin link or secret.");
      return;
    }
    // If user pasted a full URL like /admin/<secret>, extract just the secret.
    let s = secret.trim();
    const m = s.match(/\/admin\/(?:login\/)?([^\/?#]+)/);
    if (m) s = m[1];
    router.push(`/admin/login/${encodeURIComponent(s)}`);
  }

  return (
    <main style={{
      minHeight: "100dvh",
      display: "grid",
      placeItems: "center",
      background: "var(--color-ink)",
      color: "var(--color-bone)",
      padding: "2rem",
    }}>
      <form onSubmit={go} style={{
        width: "min(420px, 100%)",
        background: "#131311",
        borderRadius: 20,
        padding: "2.2rem 1.8rem",
        boxShadow: "0 30px 80px rgba(0,0,0,.5)",
      }}>
        <div style={{ fontFamily: "var(--font-display, Fraunces, serif)", fontSize: "1.6rem", marginBottom: ".2rem" }}>
          Pablo Silva BJJ
        </div>
        <div style={{ opacity: .6, fontSize: ".9rem", marginBottom: "1.4rem" }}>
          Paste your admin link to sign in.
        </div>
        <input
          autoFocus
          type="password"
          value={secret}
          onChange={(e) => { setSecret(e.target.value); setErr(null); }}
          placeholder="/admin/your-secret-here"
          style={{
            width: "100%",
            background: "#0d0d0c",
            color: "var(--color-bone)",
            border: "1px solid #2a2a28",
            borderRadius: 10,
            padding: ".8rem .9rem",
            fontSize: "1rem",
            outline: "none",
          }}
        />
        {err && <div style={{ color: "#d97a7a", fontSize: ".85rem", marginTop: ".6rem" }}>{err}</div>}
        <button
          type="submit"
          style={{
            width: "100%",
            marginTop: "1rem",
            background: "var(--color-bronze, #8c6a3d)",
            color: "var(--color-bone)",
            border: 0,
            borderRadius: 10,
            padding: ".85rem",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Enter
        </button>
      </form>
    </main>
  );
}
