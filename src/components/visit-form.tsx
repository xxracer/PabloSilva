"use client";

import { useState } from "react";

export function VisitForm() {
  const [sent, setSent] = useState(false);
  return (
    <form
      className="visit__form"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
        (e.currentTarget as HTMLFormElement).reset();
      }}
    >
      <div className="field">
        <label htmlFor="f-name">Name</label>
        <input id="f-name" name="name" type="text" required autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="f-email">Email</label>
        <input id="f-email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="f-program">Program of interest</label>
        <select id="f-program" name="program">
          <option>Little Champions (3–6)</option>
          <option>Champions &amp; Teens (7–14)</option>
          <option>Kids Competition</option>
          <option>Adults BJJ</option>
          <option>Not sure yet</option>
        </select>
      </div>
      <div className="field field--full">
        <label htmlFor="f-msg">
          Anything we should know? <span className="field__opt">(optional)</span>
        </label>
        <textarea id="f-msg" name="message" rows={3} />
      </div>
      <button className="btn btn--primary btn--lg visit__submit" type="submit">
        <span>Request my trial</span>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
      {sent ? (
        <p className="visit__sent">Thanks — we&apos;ll be in touch within a day.</p>
      ) : null}

      <style>{visitFormCss}</style>
    </form>
  );
}

const visitFormCss = `
.visit__form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 20px;
}
.field { display: flex; flex-direction: column; gap: 6px; }
.field--full { grid-column: 1 / -1; }
.field label {
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: #948b7e;
}
.field__opt { color: #948b7e; text-transform: none; letter-spacing: 0; font-weight: 400; }
.field input, .field select, .field textarea {
  background: transparent;
  border: 0;
  border-bottom: 1px solid rgba(255,255,255,0.12);
  color: #faf6ee;
  padding: 10px 0;
  font: inherit;
  font-size: 15px;
  outline: none;
  border-radius: 0;
  transition: border-color .25s var(--ease-out-soft);
  appearance: none;
  -webkit-appearance: none;
  font-family: inherit;
}
.field input:focus, .field select:focus, .field textarea:focus { border-color: #8a6a3d; }
.field select {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' fill='none' stroke='%23948b7e' stroke-width='1.5'/></svg>");
  background-repeat: no-repeat;
  background-position: right 0 center;
  padding-right: 24px;
}
.field textarea { resize: vertical; min-height: 60px; }
.visit__form .btn { grid-column: 1 / -1; justify-content: center; margin-top: 8px; }
.visit__form .btn--primary { background: #faf6ee; color: #1a1714; }
.visit__form .btn--primary:hover { background: #8a6a3d; color: #faf6ee; }
.visit__sent {
  grid-column: 1 / -1;
  font-size: 13px;
  color: #8a6a3d;
  letter-spacing: 0.02em;
  margin: 0;
}
@media (max-width: 880px) {
  .visit__form { grid-template-columns: 1fr; }
}
`;
