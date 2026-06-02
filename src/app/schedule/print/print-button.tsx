"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      className="print-btn"
      onClick={() => typeof window !== "undefined" && window.print()}
    >
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <path d="M6 14h12v7H6z" />
      </svg>
      <span>Save as PDF / Print</span>
      <style>{printBtnCss}</style>
    </button>
  );
}

const printBtnCss = `
.print-btn {
  display: inline-flex; align-items: center; gap: 8px;
  background: #faf6ee;
  color: #1a1714;
  border: 0;
  border-radius: 999px;
  padding: 9px 16px;
  font-size: 13px; font-weight: 500;
  letter-spacing: 0.01em;
  cursor: pointer;
  font-family: inherit;
  transition: background .2s var(--ease-out-soft), color .2s var(--ease-out-soft);
}
.print-btn:hover { background: #8a6a3d; color: #faf6ee; }

@media print { .print-btn { display: none; } }
`;
